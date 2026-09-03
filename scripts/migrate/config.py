from __future__ import annotations

import math
import tomllib
from pathlib import Path

from scripts.migrate.models import ImportRule, MigrationConfig
from scripts.migrate.models.config import SidebarWeight


def _as_tuple(value: object, default: tuple[str, ...]) -> tuple[str, ...]:
    if value is None:
        return default
    if not isinstance(value, list):
        raise ValueError(f"Expected list, got {type(value).__name__}")
    return tuple(str(item) for item in value)


def _as_relative_paths(value: object) -> tuple[Path, ...]:
    if value is None:
        return tuple()
    if not isinstance(value, list):
        raise ValueError("selection_paths must be a list")

    paths: list[Path] = []
    for item in value:
        raw = str(item).strip()
        if raw in {"", "."}:
            raise ValueError("selection_paths entries must be non-empty relative paths")
        path = Path(raw)
        if path.is_absolute():
            raise ValueError("selection_paths entries must be relative paths")
        if ".." in path.parts:
            raise ValueError("selection_paths entries must not contain '..'")
        paths.append(path)
    return tuple(paths)


def _as_sidebar_weights(value: object) -> dict[Path, SidebarWeight]:
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise ValueError("sidebar_weights must be a table")

    weights: dict[Path, SidebarWeight] = {}
    for raw_path, raw_weight in value.items():
        text = str(raw_path).strip()
        if not text:
            raise ValueError("sidebar_weights paths must be non-empty")
        path = Path(text)
        if path.is_absolute():
            raise ValueError("sidebar_weights paths must be relative")
        if ".." in path.parts:
            raise ValueError("sidebar_weights paths must not contain '..'")
        if path.suffix:
            raise ValueError("sidebar_weights paths must be extensionless")
        if path in weights:
            raise ValueError(f"Duplicate sidebar_weights path: {path.as_posix()}")
        if isinstance(raw_weight, bool) or not isinstance(raw_weight, (int, float)):
            raise ValueError(f"sidebar weight for '{text}' must be numeric")
        if isinstance(raw_weight, float) and not math.isfinite(raw_weight):
            raise ValueError(f"sidebar weight for '{text}' must be finite")
        weights[path] = raw_weight
    return weights


def load_config(config_path: Path) -> MigrationConfig:
    raw = tomllib.loads(config_path.read_text(encoding="utf-8"))

    defaults = raw.get("defaults", {})
    if not isinstance(defaults, dict):
        raise ValueError("[defaults] must be a table")

    default_include = _as_tuple(defaults.get("include"), ("**/*.md", "*.md"))
    default_exclude = _as_tuple(defaults.get("exclude"), tuple())
    default_synthesize = bool(defaults.get("synthesize_section_indexes", True))
    default_attachment_mode = str(defaults.get("attachment_mode", "referenced-only"))
    frontmatter_defaults = defaults.get("frontmatter", {})
    if not isinstance(frontmatter_defaults, dict):
        raise ValueError("[defaults.frontmatter] must be a table")

    imports_raw = raw.get("imports", [])
    if not isinstance(imports_raw, list) or not imports_raw:
        raise ValueError("At least one [[imports]] entry is required")

    imports: list[ImportRule] = []
    for entry in imports_raw:
        if not isinstance(entry, dict):
            raise ValueError("Each [[imports]] entry must be a table")
        source_root_kind = str(entry.get("source_root_kind", "external"))
        if source_root_kind not in {"external", "repo"}:
            raise ValueError("source_root_kind must be 'external' or 'repo'")
        rename_overrides = entry.get("rename_overrides", {})
        if not isinstance(rename_overrides, dict):
            raise ValueError("rename_overrides must be a table")
        selection_mode = str(entry.get("selection_mode", "opt-out"))
        if selection_mode not in {"opt-in", "opt-out"}:
            raise ValueError("selection_mode must be 'opt-in' or 'opt-out'")
        selection_paths = _as_relative_paths(entry.get("selection_paths"))
        if selection_mode == "opt-in" and not selection_paths:
            raise ValueError("opt-in imports must define at least one selection_paths entry")

        target_subtree = Path(str(entry["target_subtree"]))
        if str(target_subtree) in {"", "."}:
            raise ValueError(
                f"Import {entry.get('name', '<unknown>')} must use a non-root target_subtree"
            )
        section_title = (
            str(entry["section_title"]).strip()
            if entry.get("section_title") is not None
            else None
        )
        if section_title == "":
            raise ValueError("section_title must be non-empty")

        imports.append(
            ImportRule(
                name=str(entry["name"]),
                source_root_kind=source_root_kind,
                source_subtree=Path(str(entry["source_subtree"])),
                target_subtree=target_subtree,
                section_title=section_title,
                selection_mode=selection_mode,
                selection_paths=selection_paths,
                include=_as_tuple(entry.get("include"), default_include),
                exclude=_as_tuple(entry.get("exclude"), default_exclude),
                root_index_source=(
                    str(entry["root_index_source"])
                    if entry.get("root_index_source") is not None
                    else None
                ),
                synthesize_section_indexes=bool(
                    entry.get("synthesize_section_indexes", default_synthesize)
                ),
                attachment_mode=str(
                    entry.get("attachment_mode", default_attachment_mode)
                ),
                rename_overrides={
                    str(key): str(value) for key, value in rename_overrides.items()
                },
                sidebar_weights=_as_sidebar_weights(entry.get("sidebar_weights")),
            )
        )

    return MigrationConfig(
        imports=tuple(imports),
        frontmatter_defaults={str(key): value for key, value in frontmatter_defaults.items()},
    )
