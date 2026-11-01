from __future__ import annotations

import os
from pathlib import Path

from scripts.migrate.models import ImportRule, PlannedNote
from scripts.migrate.runtime import MigrationRoots
from scripts.migrate.text import slugify

# Linked PDFs live at the content root rather than inside the sections that link them.
PDF_ROOT = Path("sources")


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


def build_pdf_output_rel(source_root: Path, source_path: Path) -> Path:
    # PDFs keep their folders from the vault's sources/ in one tree, so every section shares each copy.
    try:
        rel = Path(os.path.normpath(source_path)).relative_to(os.path.normpath(source_root))
    except ValueError:
        rel = Path(source_path.name)
    if rel.parts[:1] == (PDF_ROOT.name,):
        rel = rel.relative_to(PDF_ROOT.name)
    folders = [slugify(part) for part in rel.parent.parts]
    return PDF_ROOT.joinpath(*folders, f"{slugify(rel.stem)}.pdf.enc")


def relative_output_from_note(note: PlannedNote, output_rel: Path) -> str:
    relative = os.path.relpath(output_rel, start=note.target_rel_content.parent)
    return relative.replace("\\", "/")
