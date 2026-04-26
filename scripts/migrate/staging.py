from __future__ import annotations

import shutil
from pathlib import Path

from scripts.migrate.conversion import RenderContext, convert_document
from scripts.migrate.models import PlannedNote
from scripts.migrate.parser import parse_document
from scripts.migrate.planning import synthetic_index_frontmatter
from scripts.migrate.render import render_document, render_frontmatter
from scripts.migrate.runtime import MigrationRun


def write_synthetic_indexes(staging_root: Path, run: MigrationRun) -> None:
    synthetic_targets: set[Path] = set()
    for note in run.plan.notes:
        if not note.import_rule.synthesize_section_indexes:
            continue
        parent = note.target_rel_content.parent
        import_root = note.import_rule.target_subtree
        while parent != import_root.parent and parent != Path("."):
            index_rel = parent / "_index.md"
            if index_rel not in synthetic_targets and not (staging_root / index_rel).exists():
                path = staging_root / index_rel
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(
                    render_frontmatter(synthetic_index_frontmatter(run.config, parent)),
                    encoding="utf-8",
                )
                synthetic_targets.add(index_rel)
                run.report.generated_files.append(index_rel.as_posix())
            if parent == import_root:
                break
            parent = parent.parent


def stage_note(staging_root: Path, note: PlannedNote, run: MigrationRun) -> None:
    document = parse_document(note.source_path.read_text(encoding="utf-8"))
    converted = convert_document(
        document,
        RenderContext(
            note=note,
            note_index=run.note_index,
            attachment_resolver=run.attachment_resolver,
            report=run.report,
            staging_root=staging_root,
        ),
        run.config.frontmatter_defaults,
    )
    destination = staging_root / note.target_rel_content
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(render_document(converted), encoding="utf-8")
    run.report.generated_files.append(note.target_rel_content.as_posix())


def stage_output(run: MigrationRun) -> Path:
    staging_root = run.roots.work_root / "content"
    if staging_root.exists():
        shutil.rmtree(staging_root, ignore_errors=True)
    staging_root.mkdir(parents=True, exist_ok=True)

    for note in run.plan.notes:
        stage_note(staging_root, note, run)

    write_synthetic_indexes(staging_root, run)
    return staging_root
