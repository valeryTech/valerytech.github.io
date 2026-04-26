from __future__ import annotations

from pathlib import Path

from scripts.migrate.attachments import AttachmentResolver
from scripts.migrate.config import load_config
from scripts.migrate.indexing import build_note_index
from scripts.migrate.models import MigrationReport
from scripts.migrate.planning import MigrationFailed, build_migration_plan
from scripts.migrate.reporting import write_report
from scripts.migrate.runtime import MigrationRoots, MigrationRun
from scripts.migrate.staging import stage_output
from scripts.migrate.sync import sync_to_content


def run(
    command: str,
    source_root: Path,
    config_path: Path,
    content_root: Path,
    work_root: Path,
    report_root: Path,
    repo_root: Path | None = None,
) -> int:
    roots = MigrationRoots(
        repo_root=(repo_root or Path.cwd()).resolve(),
        source_root=source_root,
        content_root=content_root,
        work_root=work_root,
        report_root=report_root,
    )
    config = load_config(config_path)
    report = MigrationReport(
        command=command,
        config_path=str(config_path),
        source_root=str(source_root),
    )

    try:
        plan = build_migration_plan(config, roots)
        report.managed_targets.extend(path.as_posix() for path in plan.managed_targets)
        run_state = MigrationRun(
            command=command,
            roots=roots,
            config=config,
            plan=plan,
            note_index=build_note_index(plan),
            attachment_resolver=AttachmentResolver(roots, report),
            report=report,
        )
        staging_root = stage_output(run_state)
        write_report(report, report_root)
        if command == "sync":
            sync_to_content(plan, content_root, staging_root)
    except MigrationFailed as exc:
        report.add_error(str(exc))
        write_report(report, report_root)
        return 1

    return 0
