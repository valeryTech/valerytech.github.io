"""Assemble the public Markdown navigation map using the site's Hugo templates."""

from __future__ import annotations

import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/site-map.md"


def assemble() -> str:
    # The same output template runs in preview, production builds, and deployment.
    # Use a fresh build so migration never exports routes from stale public/ files.
    with tempfile.TemporaryDirectory(prefix="agent-site-map-") as directory:
        subprocess.run(
            [
                "hugo", "--environment", "production", "--logLevel", "error",
                "--destination", directory, "--noBuildLock",
            ],
            cwd=ROOT, capture_output=True, text=True, check=True,
        )
        return (Path(directory) / "site-map.md").read_text(encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check", action="store_true",
        help="Check public/site-map.md against a fresh production build without rewriting it.",
    )
    args = parser.parse_args()
    try:
        document = assemble()
    except (OSError, subprocess.CalledProcessError) as error:
        print(f"Could not assemble the public site map: {error}", file=sys.stderr)
        if isinstance(error, subprocess.CalledProcessError):
            print(error.stdout + error.stderr, file=sys.stderr)
        print("Use make site-map to run with the project's Docker toolchain.", file=sys.stderr)
        return 1
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != document:
            print("public/site-map.md is stale or missing. Run make site-map or make build.", file=sys.stderr)
            return 1
        print("public/site-map.md is up to date.")
    else:
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(document, encoding="utf-8")
        print("Wrote public/site-map.md (website route: /site-map.md)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
