from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class ImportRule:
    name: str
    source_root_kind: str
    source_subtree: Path
    target_subtree: Path
    include: tuple[str, ...]
    exclude: tuple[str, ...]
    root_index_source: str | None
    synthesize_section_indexes: bool
    attachment_mode: str
    rename_overrides: dict[str, str]


@dataclass(frozen=True)
class MigrationConfig:
    imports: tuple[ImportRule, ...]
    frontmatter_defaults: dict[str, Any]
