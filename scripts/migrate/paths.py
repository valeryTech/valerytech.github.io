from __future__ import annotations

import os
from pathlib import Path

from scripts.migrate.models import ImportRule, PlannedNote
from scripts.migrate.runtime import MigrationRoots
from scripts.migrate.text import slugify


def source_import_root(roots: MigrationRoots, rule: ImportRule) -> Path:
    if rule.source_root_kind == "repo":
        return roots.repo_root / rule.source_subtree
    return roots.source_root / rule.source_subtree


def note_to_ref(target_rel_content: Path) -> str:
    if target_rel_content.name == "_index.md":
        return target_rel_content.parent.as_posix()
    return target_rel_content.with_suffix("").as_posix()


def build_attachment_output_rel(note: PlannedNote, original_name: str) -> Path:
    stem = note.target_path.stem
    asset_dir = f"{stem}.assets"
    suffix = Path(original_name).suffix.lower()
    target_name = f"{slugify(Path(original_name).stem)}{suffix}"
    return note.target_rel_content.parent / asset_dir / target_name


def relative_output_from_note(note: PlannedNote, output_rel: Path) -> str:
    relative = os.path.relpath(output_rel, start=note.target_rel_content.parent)
    return relative.replace("\\", "/")
