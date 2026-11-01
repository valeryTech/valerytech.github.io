from __future__ import annotations

import re
from typing import Any

from scripts.migrate.models import (
    Callout,
    Document,
    Embed,
    FencedCode,
    Heading,
    MarkdownChunk,
)

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n?", re.DOTALL)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
CALLOUT_START_RE = re.compile(r"^>?\s*\[!(\w+)\](?:[+-])?\s*(.*)$")
EMBED_LINE_RE = re.compile(r"^!\[\[([^\]]+)\]\]\s*$")
FENCE_START_RE = re.compile(r"^(\s*)(`{3,}|~{3,})(.*)$")


def parse_simple_frontmatter(raw: str) -> dict[str, Any]:
    frontmatter: dict[str, Any] = {}
    current_list_key: str | None = None
    for line in raw.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith("- ") and current_list_key:
            frontmatter.setdefault(current_list_key, []).append(parse_scalar(stripped[2:].strip()))
            continue
        current_list_key = None
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if not value:
            frontmatter[key] = []
            current_list_key = key
            continue
        frontmatter[key] = parse_scalar(value)
    return frontmatter


def parse_scalar(value: str) -> Any:
    if value in {"true", "True"}:
        return True
    if value in {"false", "False"}:
        return False
    if (value.startswith('"') and value.endswith('"')) or (
        value.startswith("'") and value.endswith("'")
    ):
        return value[1:-1]
    return value


def extract_frontmatter(content: str) -> tuple[dict[str, Any], str]:
    match = FRONTMATTER_RE.match(content)
    if not match:
        return {}, content
    return parse_simple_frontmatter(match.group(1)), content[match.end() :]


def parse_document(content: str) -> Document:
    frontmatter, body = extract_frontmatter(content)
    lines = body.splitlines()
    blocks: list[MarkdownChunk | Heading | Callout | Embed | FencedCode] = []
    buffer: list[str] = []
    index = 0

    def flush_buffer() -> None:
        if not buffer:
            return
        text = "\n".join(buffer).rstrip()
        if text:
            blocks.append(MarkdownChunk(text=text))
        buffer.clear()

    while index < len(lines):
        line = lines[index]

        fence_match = FENCE_START_RE.match(line)
        if fence_match:
            flush_buffer()
            fence = fence_match.group(2)
            info = fence_match.group(3).strip()
            index += 1
            code_lines: list[str] = []
            while index < len(lines):
                candidate = lines[index]
                if candidate.lstrip().startswith(fence[0] * len(fence)):
                    break
                code_lines.append(candidate)
                index += 1
            if index < len(lines):
                index += 1
            blocks.append(FencedCode(fence=fence, info=info, text="\n".join(code_lines)))
            continue

        if line.startswith("    ") or line.startswith("\t"):
            buffer.append(line)
            index += 1
            continue

        callout_match = CALLOUT_START_RE.match(line)
        if callout_match:
            flush_buffer()
            kind = callout_match.group(1).strip()
            title = callout_match.group(2).strip()
            index += 1
            content_lines: list[str] = []
            while index < len(lines):
                candidate = lines[index]
                if candidate.startswith(">"):
                    content_lines.append(candidate[1:].lstrip())
                    index += 1
                    continue
                break
            blocks.append(Callout(kind=kind, title=title, body="\n".join(content_lines).strip()))
            continue

        embed_match = EMBED_LINE_RE.match(line.strip())
        if embed_match:
            flush_buffer()
            target = embed_match.group(1).strip()
            caption: str | None = None
            if index + 1 < len(lines) and lines[index + 1].startswith("> "):
                caption = lines[index + 1][2:].strip()
                index += 1
            blocks.append(Embed(target=target, caption=caption))
            index += 1
            continue

        heading_match = HEADING_RE.match(line)
        if heading_match:
            flush_buffer()
            blocks.append(Heading(level=len(heading_match.group(1)), text=heading_match.group(2).strip()))
            index += 1
            continue

        buffer.append(line)
        index += 1

    flush_buffer()
    return Document(frontmatter=frontmatter, blocks=blocks)
