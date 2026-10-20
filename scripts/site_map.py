"""Assemble the main and section agent maps in plain-text and Markdown formats."""

from __future__ import annotations

import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public"
MAP_NAMES = {"llms.txt", "site-map.md"}


def map_files(directory: Path) -> set[Path]:
    return {
        path.relative_to(directory)
        for path in directory.rglob("*")
        if path.name in MAP_NAMES and path.is_file()
    }


def assemble() -> dict[Path, str]:
    # Preview, production, and migration share the same Hugo output templates.
    # A fresh build also tells us which obsolete section maps should be removed.
    with tempfile.TemporaryDirectory(prefix="agent-site-map-") as directory:
        destination = Path(directory)
        subprocess.run(
            [
                "hugo", "--environment", "production", "--logLevel", "error",
                "--destination", directory, "--noBuildLock",
            ],
            cwd=ROOT, capture_output=True, text=True, check=True,
        )
        maps = {
            path: (destination / path).read_text(encoding="utf-8")
            for path in sorted(map_files(destination))
        }
        if not {Path("llms.txt"), Path("site-map.md")} <= maps.keys():
            raise FileNotFoundError("The Hugo build did not generate the main agent map formats")
        return maps


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check", action="store_true",
        help="Check every main and section map against a fresh build without rewriting them.",
    )
    args = parser.parse_args()
    try:
        maps = assemble()
        stale = map_files(OUTPUT) - maps.keys()
        if args.check:
            changed = [
                path for path, document in maps.items()
                if not (OUTPUT / path).exists()
                or (OUTPUT / path).read_text(encoding="utf-8") != document
            ]
            if stale or changed:
                print("Agent maps are stale or missing. Run make site-map or make build.", file=sys.stderr)
                for path in sorted(stale | set(changed)):
                    print(f"  {path}", file=sys.stderr)
                return 1
            print(f"All {len(maps)} main and section map files are up to date.")
        else:
            for path, document in maps.items():
                target = OUTPUT / path
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(document, encoding="utf-8")
            for path in stale:
                (OUTPUT / path).unlink()
            print(f"Wrote {len(maps)} main and section map files (start at /llms.txt)")
        return 0
    except (OSError, subprocess.CalledProcessError) as error:
        print(f"Could not assemble the public agent maps: {error}", file=sys.stderr)
        if isinstance(error, subprocess.CalledProcessError):
            print(error.stdout + error.stderr, file=sys.stderr)
        print("Use make site-map to run with the project's Docker toolchain.", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
