from __future__ import annotations

import shutil
import tempfile
from dataclasses import dataclass
from pathlib import Path

from scripts.migrate.attachments import AttachmentResolver
from scripts.migrate.config import load_config
from scripts.migrate.indexing import build_note_index
from scripts.migrate.models import MigrationReport
from scripts.migrate.planning import build_migration_plan
from scripts.migrate.runtime import MigrationRoots, MigrationRun


FIXTURE_ROOT = Path(__file__).parent / "fixtures"


@dataclass
class FixtureWorkspace:
    temp_dir: tempfile.TemporaryDirectory[str]
    root: Path
    source_root: Path
    content_root: Path
    work_root: Path
    report_root: Path
    config_path: Path

    def cleanup(self) -> None:
        self.temp_dir.cleanup()


def make_workspace() -> FixtureWorkspace:
    temp_dir = tempfile.TemporaryDirectory()
    root = Path(temp_dir.name)
    source_root = root / "source_notes"
    smoke_root = root / "tests" / "migrate" / "smoke_notes"
    config_path = root / "tests" / "migrate" / "config.toml"
    content_root = root / "content"
    work_root = root / ".migration" / "work"
    report_root = root / ".migration" / "reports"
    shutil.copytree(FIXTURE_ROOT / "source_notes", source_root)
    shutil.copytree(FIXTURE_ROOT / "smoke_notes", smoke_root)
    config_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(FIXTURE_ROOT / "config.toml", config_path)
    content_root.mkdir(parents=True, exist_ok=True)
    return FixtureWorkspace(
        temp_dir=temp_dir,
        root=root,
        source_root=source_root,
        content_root=content_root,
        work_root=work_root,
        report_root=report_root,
        config_path=config_path,
    )


def make_run(workspace: FixtureWorkspace, command: str = "check") -> MigrationRun:
    roots = MigrationRoots(
        repo_root=workspace.root,
        source_root=workspace.source_root,
        content_root=workspace.content_root,
        work_root=workspace.work_root,
        report_root=workspace.report_root,
    )
    config = load_config(workspace.config_path)
    plan = build_migration_plan(config, roots)
    report = MigrationReport(
        command=command,
        config_path=str(workspace.config_path),
        source_root=str(workspace.source_root),
    )
    report.managed_targets.extend(path.as_posix() for path in plan.managed_targets)
    return MigrationRun(
        command=command,
        roots=roots,
        config=config,
        plan=plan,
        note_index=build_note_index(plan),
        attachment_resolver=AttachmentResolver(roots, report),
        report=report,
    )
