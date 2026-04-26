from __future__ import annotations

from pathlib import Path

from scripts.migrate.models import MigrationConfig, MigrationPlan, PlannedNote
from scripts.migrate.paths import note_to_ref, source_import_root
from scripts.migrate.runtime import MigrationRoots
from scripts.migrate.text import humanize_slug, slugify


class MigrationFailed(RuntimeError):
    """Raised for fatal migration errors."""


def matches_any(rel_path: Path, patterns: tuple[str, ...]) -> bool:
    posix = rel_path.as_posix()
    return any(rel_path.match(pattern) or posix == pattern for pattern in patterns)


def should_include(rel_path: Path, include: tuple[str, ...], exclude: tuple[str, ...]) -> bool:
    return matches_any(rel_path, include) and not matches_any(rel_path, exclude)


def apply_rename(rel_path: Path, rename_overrides: dict[str, str]) -> Path:
    key = rel_path.as_posix()
    if key in rename_overrides:
        return Path(rename_overrides[key])

    parts = list(rel_path.parts)
    renamed: list[str] = []
    for index, part in enumerate(parts):
        if index == len(parts) - 1:
            path_part = Path(part)
            if path_part.name == "_index.md":
                renamed.append("_index.md")
            else:
                renamed.append(f"{slugify(path_part.stem)}{path_part.suffix.lower()}")
        else:
            renamed.append(slugify(part))
    return Path(*renamed)


def build_migration_plan(
    config: MigrationConfig,
    roots: MigrationRoots,
) -> MigrationPlan:
    notes: list[PlannedNote] = []
    seen_targets: dict[Path, Path] = {}
    managed_targets: list[Path] = []

    for rule in config.imports:
        import_root = source_import_root(roots, rule)
        if not import_root.exists():
            raise MigrationFailed(f"Missing source subtree: {import_root}")

        managed_targets.append(rule.target_subtree)
        for source_path in sorted(import_root.rglob("*.md")):
            rel_import = source_path.relative_to(import_root)
            if not should_include(rel_import, rule.include, rule.exclude):
                continue

            if rule.root_index_source and rel_import.as_posix() == rule.root_index_source:
                target_rel = rule.target_subtree / "_index.md"
            else:
                target_rel = rule.target_subtree / apply_rename(rel_import, rule.rename_overrides)

            target_path = roots.content_root / target_rel
            source_rel_global = source_path.relative_to(import_root.parent)
            if target_path in seen_targets:
                raise MigrationFailed(
                    f"Target collision: {target_rel.as_posix()} from "
                    f"{seen_targets[target_path].as_posix()} and {source_rel_global.as_posix()}"
                )
            seen_targets[target_path] = source_rel_global

            notes.append(
                PlannedNote(
                    import_rule=rule,
                    source_path=source_path,
                    source_rel_global=source_rel_global,
                    source_rel_import=rel_import,
                    target_rel_content=target_rel,
                    target_path=target_path,
                    target_ref=note_to_ref(target_rel),
                )
            )

    return MigrationPlan(notes=tuple(notes), managed_targets=tuple(managed_targets))


def synthetic_index_frontmatter(config: MigrationConfig, parent: Path) -> dict[str, object]:
    label = humanize_slug(parent.name)
    return {
        **config.frontmatter_defaults,
        "title": label,
        "linkTitle": label,
    }
