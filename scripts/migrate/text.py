from __future__ import annotations

import re
import unicodedata
from pathlib import Path


def normalize_note_key(value: str | Path) -> str:
    path = Path(str(value).replace("\\", "/"))
    if path.suffix.lower() == ".md":
        path = path.with_suffix("")
    return path.as_posix().strip().strip("/").lower()


def slugify(value: str) -> str:
    if value in {"", "."}:
        return value
    prefix = "_" if value.startswith("_") else ""
    core = value[1:] if prefix else value
    core = unicodedata.normalize("NFKD", core)
    core = core.encode("ascii", "ignore").decode("ascii")
    core = core.lower()
    core = re.sub(r"[\s_]+", "-", core)
    core = re.sub(r"[^a-z0-9-]+", "-", core)
    core = re.sub(r"-{2,}", "-", core).strip("-")
    if not core:
        core = "index"
    return f"{prefix}{core}"


def humanize_slug(value: str) -> str:
    stripped = value.lstrip("_")
    if not stripped:
        return "Index"
    return " ".join(part.capitalize() for part in stripped.replace("-", " ").split())


def normalize_title(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip().lower()


def slugify_heading(value: str) -> str:
    lowered = value.strip().lower()
    lowered = re.sub(r"[^\w\s-]", "", lowered)
    lowered = re.sub(r"[\s_]+", "-", lowered)
    lowered = re.sub(r"-{2,}", "-", lowered).strip("-")
    return lowered
