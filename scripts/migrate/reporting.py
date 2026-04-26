from __future__ import annotations

import json
from pathlib import Path

from scripts.migrate.models import MigrationReport


def write_report(report: MigrationReport, report_root: Path) -> None:
    report_root.mkdir(parents=True, exist_ok=True)
    payload = {
        "command": report.command,
        "config_path": report.config_path,
        "source_root": report.source_root,
        "managed_targets": sorted(set(report.managed_targets)),
        "generated_files": sorted(set(report.generated_files)),
        "warnings": [
            {"code": item.code, "message": item.message, "source": item.source}
            for item in report.warnings
        ],
        "errors": report.errors,
    }
    (report_root / f"{report.command}.json").write_text(
        json.dumps(payload, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
