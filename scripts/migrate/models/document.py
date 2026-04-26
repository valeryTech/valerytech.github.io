from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class MarkdownChunk:
    text: str


@dataclass(frozen=True)
class Heading:
    level: int
    text: str


@dataclass(frozen=True)
class Callout:
    kind: str
    title: str
    body: str


@dataclass(frozen=True)
class Embed:
    target: str
    caption: str | None


@dataclass(frozen=True)
class FencedCode:
    fence: str
    info: str
    text: str


Block = MarkdownChunk | Heading | Callout | Embed | FencedCode


@dataclass(frozen=True)
class Document:
    frontmatter: dict[str, Any]
    blocks: list[Block]


@dataclass(frozen=True)
class RenderedDocument:
    frontmatter: dict[str, Any]
    body_parts: list[str]
