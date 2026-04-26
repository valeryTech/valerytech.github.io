from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from scripts.migrate.models.config import ImportRule


@dataclass(frozen=True)
class PlannedNote:
    import_rule: ImportRule
    source_path: Path
    source_rel_global: Path
    source_rel_import: Path
    target_rel_content: Path
    target_path: Path
    target_ref: str


@dataclass(frozen=True)
class PlannedAttachment:
    source_path: Path
    output_rel: Path


@dataclass(frozen=True)
class MigrationPlan:
    notes: tuple[PlannedNote, ...]
    managed_targets: tuple[Path, ...]
