from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from scripts.migrate.models import MigrationConfig, MigrationPlan, MigrationReport


@dataclass(frozen=True)
class MigrationRoots:
    repo_root: Path
    source_root: Path
    content_root: Path
    work_root: Path
    report_root: Path


@dataclass
class MigrationRun:
    command: str
    roots: MigrationRoots
    config: MigrationConfig
    plan: MigrationPlan
    note_index: Any
    attachment_resolver: Any
    report: MigrationReport
