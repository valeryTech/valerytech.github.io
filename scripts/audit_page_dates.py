"""Audit page date metadata without modifying content.

Run: python3 -m scripts.audit_page_dates --csv .migration/reports/page-dates.csv

Git dates describe the first commit adding the current path. They do not prove
when a page went live, and a moved page may have an earlier history elsewhere.
Generated agent maps are excluded. Export times are not inferred from file mtimes.
"""

from __future__ import annotations

import argparse
from collections import Counter
import csv
from datetime import datetime
from pathlib import Path
import subprocess

from scripts.migrate.parser import extract_frontmatter


DATE_FIELDS = ("date", "publishDate", "lastmod", "exported_at")


def first_git_additions(repo: Path) -> dict[str, tuple[str, str]]:
    history = subprocess.check_output(
        [
            "git", "log", "--reverse", "--no-renames", "--diff-filter=A",
            "--format=%x00COMMIT%x00%H%x00%cI", "--name-only", "-z",
            "HEAD", "--", "content",
        ],
        cwd=repo,
    ).decode("utf-8")
    additions: dict[str, tuple[str, str]] = {}
    tokens = iter(history.split("\0"))
    commit = timestamp = ""
    for token in tokens:
        if token == "COMMIT":
            commit, timestamp = next(tokens), next(tokens)
        elif token.lstrip("\n").startswith("content/"):
            additions.setdefault(token.lstrip("\n"), (commit, timestamp))
    return additions


def date_format(value: str) -> str:
    if not value:
        return "missing"
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        return "unrecognized"
    if len(value) == 10:
        return "YYYY-MM-DD"
    result = "YYYY-MM-DDTHH:MM:SS"
    if "." in value:
        result += ".fraction"
    return result + ("Z" if value.endswith("Z") else "±HH:MM" if parsed.tzinfo else " (no timezone)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", type=Path, help="Write the per-page audit to this CSV file")
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[1]
    additions = first_git_additions(repo)
    rows = []
    for path in sorted((repo / "content").rglob("*.md")):
        relative = path.relative_to(repo).as_posix()
        if not path.is_file() or relative.startswith("content/agent-map/"):
            continue
        frontmatter, _ = extract_frontmatter(path.read_text(encoding="utf-8"))
        fields = {key.lower(): value for key, value in frontmatter.items()}
        row = {"path": relative, "title": str(frontmatter.get("title", ""))}
        for key in DATE_FIELDS:
            value = str(fields.get(key.lower(), ""))
            row[key] = value
            row[f"{key}_format"] = date_format(value)
        row["first_git_commit"], row["first_added_to_git_at"] = additions.get(relative, ("", ""))
        rows.append(row)

    print(f"Audited {len(rows)} Markdown pages (generated agent maps excluded).")
    for key in DATE_FIELDS:
        present = [row for row in rows if row[key]]
        print(f"\n{key}: {len(present)} present; {len(rows) - len(present)} missing")
        for label, count in sorted(Counter(row[f"{key}_format"] for row in present).items()):
            print(f"  Format {label}: {count}")
        months = Counter(row[key][:7] for row in present if row[f"{key}_format"] != "unrecognized")
        for month, count in sorted(months.items()):
            print(f"  Month {month}: {count}")

    print("\nFirst Git addition at the current path (committer date, not verified publication):")
    for month, count in sorted(Counter(row["first_added_to_git_at"][:7] or "uncommitted" for row in rows).items()):
        print(f"  {month}: {count}")
    if args.csv:
        args.csv.parent.mkdir(parents=True, exist_ok=True)
        with args.csv.open("w", newline="", encoding="utf-8") as output:
            writer = csv.DictWriter(output, fieldnames=list(rows[0]) if rows else ["path"])
            writer.writeheader()
            writer.writerows(rows)
        print(f"\nCSV: {args.csv.resolve()}")


if __name__ == "__main__":
    main()
