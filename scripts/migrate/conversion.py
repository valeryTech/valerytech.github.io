from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from scripts.migrate.attachments import AttachmentResolver
from scripts.migrate.indexing import NoteIndex
from scripts.migrate.models import (
    Callout,
    Document,
    Embed,
    FencedCode,
    Heading,
    MarkdownChunk,
    MigrationReport,
    PlannedNote,
    RenderedDocument,
)
from scripts.migrate.paths import relative_output_from_note
from scripts.migrate.text import humanize_slug, normalize_title, slugify_heading

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"}
CALLOUT_MAP = {
    "info": ("note", "outline/info-circle"),
    "important": ("note", "outline/info-circle"),
    "note": ("note", "outline/info-circle"),
    "question": ("note", "outline/help-octagon"),
    "thumbup": ("note", "outline/thumb-up"),
    "thumbdown": ("caution", "outline/thumb-down"),
    "tip": ("tip", "outline/rocket"),
    "caution": ("caution", "outline/alert-triangle"),
    "warning": ("caution", "outline/alert-triangle"),
    "danger": ("danger", "outline/alert-octagon"),
}
WIKI_LINK_RE = re.compile(r"(!)?\[\[([^\]|#]+)?(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]")


@dataclass(frozen=True)
class RenderContext:
    note: PlannedNote
    note_index: NoteIndex
    attachment_resolver: AttachmentResolver
    report: MigrationReport
    staging_root: Path


def escape_shortcode(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def default_note_label(note: PlannedNote) -> str:
    stem = note.target_path.stem if note.target_path.stem != "_index" else note.target_path.parent.name
    return humanize_slug(stem)


def callout_presentation(kind: str) -> tuple[str, str]:
    return CALLOUT_MAP.get(kind.lower(), ("note", "outline/info-circle"))


def resolve_titles(document: Document, note: PlannedNote) -> tuple[str, str]:
    title = str(document.frontmatter.get("title") or default_note_label(note))
    link_title = str(document.frontmatter.get("linkTitle") or title)
    return title, link_title


def strip_duplicate_leading_title_heading(document: Document, title: str) -> list[object]:
    blocks = list(document.blocks)
    if blocks and isinstance(blocks[0], Heading):
        if blocks[0].level == 1 and normalize_title(blocks[0].text) == normalize_title(title):
            return blocks[1:]
    return blocks


def rewrite_inline_links(text: str, ctx: RenderContext) -> str:
    def replace(match: re.Match[str]) -> str:
        is_embed = bool(match.group(1))
        target = (match.group(2) or "").strip()
        heading = (match.group(3) or "").strip()
        label = (match.group(4) or "").strip()

        if is_embed:
            ctx.report.add_warning(
                "unsupported-inline-embed",
                f"Inline embed is not converted: {match.group(0)}",
                source=ctx.note.source_rel_global.as_posix(),
            )
            return match.group(0)

        if not target and heading:
            link_text = label or heading
            return f"[{link_text}](#{slugify_heading(heading)})"

        if target:
            linked_note = ctx.note_index.resolve(ctx.note, target)
            if linked_note is not None:
                link_text = label or humanize_slug(Path(target).stem)
                ref = f'{{{{< ref "{linked_note.target_ref}" >}}}}'
                if heading:
                    ref = f"{ref}#{slugify_heading(heading)}"
                return f"[{link_text}]({ref})"

            attachment = ctx.attachment_resolver.resolve(ctx.note, target)
            if attachment is not None:
                copied = ctx.attachment_resolver.copy(ctx.staging_root, attachment[0], attachment[1])
                link_text = label or Path(target).name
                rel_path = relative_output_from_note(ctx.note, copied.output_rel)
                return f"[{link_text}]({rel_path})"

        ctx.report.add_warning(
            "unresolved-link",
            f"Could not resolve {match.group(0)}",
            source=ctx.note.source_rel_global.as_posix(),
        )
        return match.group(0)

    return WIKI_LINK_RE.sub(replace, text)


def convert_embed(block: Embed, ctx: RenderContext) -> str:
    target = block.target.strip()
    if not target:
        return ""

    attachment = ctx.attachment_resolver.resolve(ctx.note, target)
    if attachment is None:
        ctx.report.add_warning(
            "missing-attachment",
            f"Could not resolve attachment {target}",
            source=ctx.note.source_rel_global.as_posix(),
        )
        return f"![[{target}]]"

    copied = ctx.attachment_resolver.copy(ctx.staging_root, attachment[0], attachment[1])
    suffix = attachment[0].suffix.lower()
    if suffix in IMAGE_EXTENSIONS:
        alt = escape_shortcode(block.caption or Path(target).stem)
        caption = escape_shortcode(block.caption or "")
        rel_path = relative_output_from_note(ctx.note, copied.output_rel)
        return (
            f'{{{{< figure src="{rel_path}" alt="{alt}"'
            + (f' caption="{caption}"' if caption else "")
            + " >}}"
        )

    label = block.caption or Path(target).name
    rel_path = relative_output_from_note(ctx.note, copied.output_rel)
    return f"[{label}]({rel_path})"


def convert_block(block: object, ctx: RenderContext) -> str:
    if isinstance(block, MarkdownChunk):
        return rewrite_inline_links(block.text, ctx)
    if isinstance(block, Heading):
        return f'{"#" * block.level} {rewrite_inline_links(block.text, ctx)}'
    if isinstance(block, FencedCode):
        opener = f"{block.fence}{block.info}" if block.info else block.fence
        return f"{opener}\n{block.text}\n{block.fence}"
    if isinstance(block, Callout):
        context, icon = callout_presentation(block.kind)
        title = escape_shortcode(block.title or block.kind.title())
        body = rewrite_inline_links(block.body, ctx)
        return (
            f'{{{{< callout context="{context}" title="{title}" icon="{icon}" >}}}}\n'
            f"{body}\n"
            "{{< /callout >}}"
        )
    if isinstance(block, Embed):
        return convert_embed(block, ctx)
    raise TypeError(f"Unsupported block type: {type(block).__name__}")


def convert_document(
    document: Document,
    ctx: RenderContext,
    frontmatter_defaults: dict[str, object],
) -> RenderedDocument:
    title, link_title = resolve_titles(document, ctx.note)
    blocks = strip_duplicate_leading_title_heading(document, title)
    body_parts: list[str] = []
    for block in blocks:
        rendered = convert_block(block, ctx)
        if rendered.strip():
            body_parts.append(rendered)

    frontmatter = dict(frontmatter_defaults)
    for key in (
        "title",
        "aliases",
        "description",
        "summary",
        "date",
        "lastmod",
        "draft",
        "toc",
        "weight",
        "contributors",
    ):
        if key in document.frontmatter:
            frontmatter[key] = document.frontmatter[key]
    frontmatter["title"] = title
    frontmatter["linkTitle"] = link_title
    return RenderedDocument(frontmatter=frontmatter, body_parts=body_parts)
