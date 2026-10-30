# Callouts

This document defines the repo's callout contract for migrated Markdown.

Use it for three things:

- which source callout forms we support
- how the migration pipeline preserves shortcode syntax and renders it with Hextra
- where to verify the rendered result locally

## Sources

The source conventions retained by the importer are:

- Doks shortcodes: `note`, `tip`, `caution`, `danger`
- Hugo alert syntax: `note`, `tip`, `important`, `warning`, `caution`, plus
  optional custom titles and `+` / `-` fold signs

Reference docs:

- https://getdoks.org/docs/basics/shortcodes/
- https://gohugo.io/render-hooks/blockquotes/

## Source Syntax

The migration pipeline recognizes Obsidian/Hugo-style alert markers in
blockquote form, for example:

```md
> [!note] Note
> Useful information.

> [!warning]+ Radiation hazard
> Custom title with fold sign.
```

Rules:

- the callout marker must start a blockquote line
- the callout kind is case-insensitive
- a custom title after the marker is preserved
- fold signs like `+` and `-` are parsed but currently ignored visually

## Current Mapping

The migration logic lives in [scripts/migrate/conversion.py](/Users/val/projects/website/valerytech.github.io/scripts/migrate/conversion.py).

Current mapping:

| Source callout | Shortcode context | Hextra style | Hextra icon |
| --- | --- | --- | --- |
| `note`, `info`, `important` | `note` | `info` | `information-circle` |
| `tip` | `tip` | `default` | `light-bulb` |
| `caution`, `warning` | `caution` | `warning` | `exclamation` |
| `danger` | `danger` | `error` | `ban` |
| `question` | `note` | `info` | `question-mark-circle` |
| `thumbup` | `note` | `info` | `thumb-up` |
| `thumbdown` | `caution` | `warning` | `thumb-down` |

If a callout kind is unknown, migration falls back to `note` with the info icon.
The importer keeps its existing `outline/...` icon names; the Hextra adapter
maps them to native icons while preserving their meaning and custom titles.

## Output Shape

The migrator retains the established shortcode form:

```md
{{< callout context="note" title="Note" icon="outline/info-circle" >}}
Useful information.
{{< /callout >}}
```

The adapter in `layouts/_shortcodes/callout.html` renders this output through
Hextra's callout component. Existing imported and directly authored shortcodes
therefore work without rewriting source notes. Hextra's native `type` parameter
is also accepted for directly authored content.

When documenting shortcode usage in page content, use fenced code blocks and
escape the shortcode delimiters with Hugo's documented comment form:

```text
{{</* callout context="note" title="Note" icon="outline/info-circle" */>}}
...
{{</* /callout */>}}
```

Hugo documents this escape pattern for shortcode examples in code fences:

- https://gohugo.io/content-management/syntax-highlighting/#escaping

## Verification Surface

The canonical visual regression page is sourced from:

- [/Users/val/notes/system-design/integrated-test-pages/callouts.md](/Users/val/notes/system-design/integrated-test-pages/callouts.md)

After migration, it renders to:

- `/system-design/integrated-test-pages/callouts/`

That page should contain:

- the four Doks-documented callouts
- Hugo's extra `important` and `warning` alert forms
- the repo's local alias set
- a mapping table for quick comparison

## Workflow

When you change callout handling:

1. update the migration logic in [scripts/migrate/conversion.py](/Users/val/projects/website/valerytech.github.io/scripts/migrate/conversion.py)
2. update the source catalog in [/Users/val/notes/system-design/integrated-test-pages/callouts.md](/Users/val/notes/system-design/integrated-test-pages/callouts.md)
3. update the Hextra adapter and regression tests in [tests/migrate/test_pipeline.py](/Users/val/projects/website/valerytech.github.io/tests/migrate/test_pipeline.py)
4. rerun migration and `make verify` (including `tests/theme/hextra.test.mjs`)
5. check the rendered catalog page locally

## Known Limits

- fold signs are not rendered as collapsible UI
- unsupported callout kinds are normalized to `note`
- nested callout behavior is only as good as the current block parser
- this contract is migration-specific, not a general Markdown authoring standard
