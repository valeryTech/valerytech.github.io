from __future__ import annotations

import argparse
import logging
from pathlib import Path

from scripts.migrate.pipeline import run


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="python -m scripts.migrate",
        description="Migrate external notes into Hugo content.",
    )
    parser.add_argument(
        "--config",
        default="scripts/migrate/config.toml",
        help="Path to the committed migration config TOML.",
    )
    parser.add_argument(
        "--content-root",
        default="content",
        help="Path to the Hugo content root.",
    )
    parser.add_argument(
        "--work-root",
        default=".migration/work",
        help="Ignored workspace used for staged migration output.",
    )
    parser.add_argument(
        "--report-root",
        default=".migration/reports",
        help="Ignored directory for migration reports.",
    )
    parser.add_argument(
        "--source-root",
        required=True,
        help="Path to the external notes root.",
    )

    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("check", help="Validate mappings and stage output without touching content/.")
    subparsers.add_parser("sync", help="Regenerate managed content trees from the source notes.")
    return parser


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    parser = build_parser()
    args = parser.parse_args(argv)
    return run(
        command=args.command,
        source_root=Path(args.source_root).resolve(),
        config_path=Path(args.config).resolve(),
        content_root=Path(args.content_root).resolve(),
        work_root=Path(args.work_root).resolve(),
        report_root=Path(args.report_root).resolve(),
        repo_root=Path.cwd().resolve(),
    )
