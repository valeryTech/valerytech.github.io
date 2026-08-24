from __future__ import annotations

from pathlib import Path

from scripts.migrate.models import ImportRule, MigrationConfig, MigrationPlan, PlannedNote
from scripts.migrate.models.config import SidebarWeight
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


def validate_selection_paths(import_root: Path, rule: ImportRule) -> None:
    for selection_path in rule.selection_paths:
        candidate = import_root / selection_path
        if not candidate.exists():
            raise MigrationFailed(
                f"Missing selection path for import '{rule.name}': {selection_path.as_posix()}"
            )


def matches_selection(rel_path: Path, selection_path: Path, import_root: Path) -> bool:
    candidate = import_root / selection_path
    if candidate.is_dir():
        return rel_path == selection_path or selection_path in rel_path.parents
    return rel_path == selection_path


def selection_allows(rel_path: Path, rule: ImportRule, import_root: Path) -> bool:
    if rule.root_index_source and rel_path.as_posix() == rule.root_index_source:
        return True

    if not rule.selection_paths:
        return True

    matched = any(matches_selection(rel_path, path, import_root) for path in rule.selection_paths)
    if rule.selection_mode == "opt-in":
        return matched
    return not matched


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
        validate_selection_paths(import_root, rule)

        managed_targets.append(rule.target_subtree)
        for source_path in sorted(import_root.rglob("*.md")):
            rel_import = source_path.relative_to(import_root)
            if not selection_allows(rel_import, rule, import_root):
                continue
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

    sidebar_weights = resolve_sidebar_weights(config, notes)
    return MigrationPlan(
        notes=tuple(notes),
        managed_targets=tuple(managed_targets),
        sidebar_weights=sidebar_weights,
    )


def synthetic_index_targets(notes: list[PlannedNote]) -> set[Path]:
    targets: set[Path] = set()
    for note in notes:
        if not note.import_rule.synthesize_section_indexes:
            continue
        parent = note.target_rel_content.parent
        import_root = note.import_rule.target_subtree
        while parent != import_root.parent and parent != Path("."):
            targets.add(parent / "_index.md")
            if parent == import_root:
                break
            parent = parent.parent
    return targets


def resolve_sidebar_weights(
    config: MigrationConfig,
    notes: list[PlannedNote],
) -> dict[Path, SidebarWeight]:
    output_targets = {note.target_rel_content for note in notes}
    output_targets.update(synthetic_index_targets(notes))
    resolved: dict[Path, SidebarWeight] = {}

    for rule in config.imports:
        for relative_path, weight in rule.sidebar_weights.items():
            base = rule.target_subtree / relative_path
            candidates = [base / "_index.md", base.with_suffix(".md")]
            matches = [candidate for candidate in candidates if candidate in output_targets]
            display_path = relative_path.as_posix()
            if not matches:
                raise MigrationFailed(
                    f"Unknown sidebar_weights target for import '{rule.name}': {display_path}"
                )
            if len(matches) > 1:
                raise MigrationFailed(
                    f"Ambiguous sidebar_weights target for import '{rule.name}': {display_path}"
                )

            target = matches[0]
            if target in resolved and resolved[target] != weight:
                raise MigrationFailed(
                    f"Conflicting sidebar weights for target '{target.as_posix()}': "
                    f"{resolved[target]} and {weight}"
                )
            resolved[target] = weight

    return resolved


def synthetic_index_frontmatter(config: MigrationConfig, parent: Path) -> dict[str, object]:
    label = humanize_slug(parent.name)
    return {
        **config.frontmatter_defaults,
        "title": label,
        "linkTitle": label,
    }
