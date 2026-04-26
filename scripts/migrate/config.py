from __future__ import annotations

import tomllib
from pathlib import Path

from scripts.migrate.models import ImportRule, MigrationConfig


def _as_tuple(value: object, default: tuple[str, ...]) -> tuple[str, ...]:
    if value is None:
        return default
    if not isinstance(value, list):
        raise ValueError(f"Expected list, got {type(value).__name__}")
    return tuple(str(item) for item in value)


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

        target_subtree = Path(str(entry["target_subtree"]))
        if str(target_subtree) in {"", "."}:
            raise ValueError(
                f"Import {entry.get('name', '<unknown>')} must use a non-root target_subtree"
            )

        imports.append(
            ImportRule(
                name=str(entry["name"]),
                source_root_kind=source_root_kind,
                source_subtree=Path(str(entry["source_subtree"])),
                target_subtree=target_subtree,
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
            )
        )

    return MigrationConfig(
        imports=tuple(imports),
        frontmatter_defaults={str(key): value for key, value in frontmatter_defaults.items()},
    )
