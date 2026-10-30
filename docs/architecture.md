# Architecture

This repository is a Hugo site built with the Hextra theme. The
base UI comes from the pinned `themes/hextra/` Git submodule, while this repo owns the
actual content, local template overrides, and project-specific assets.

## Main Parts

- `content/` is the source of published pages for Hugo, but some subtrees are
  generated from external notes by the migration pipeline.
- `config/` defines Hugo behavior such as menus, params, permalinks, and module
  mounts.
- `layouts/` contains local template and partial overrides layered on top of
  the theme-provided layouts.
- `assets/` contains site CSS, JavaScript, and images processed during the build.
- `static/` contains files copied to the final site as-is.
- `public/` and `resources/` are generated output and build artifacts. They are
  not authoring locations.

## Ownership Boundaries

The base site behavior comes from Hextra v0.13.0. Local assets, compatibility
partials, self-hosted vendor assets, and attachment files are mounted through
`config/_default/module.toml`. This repo mainly customizes the site in four
places:

- `content/` for authored Markdown
- `config/` for site settings, menus, params, and permalinks
- `layouts/` for local template overrides
- `assets/` for local styling, scripts, and images

If something looks like default theme behavior, check `themes/hextra/` first.
If it looks project-specific, check these local folders.

## Hextra Integration

`layouts/_partials/main/page.html` supplies the Hextra page shell for the
homepage, articles, section indexes, About, legal pages, and navigation maps.
It uses Hextra's navbar, search dialog, table of contents, theme switcher,
compiled CSS, and core scripts. The local sidebar retains arbitrary nesting,
`sidebar.weight` ordering, section overview links, and reading-guide entry pages.
Previous/next links follow that same ordering. Breadcrumbs include the complete
Hugo ancestor chain, and headings retain targets used by imported wiki links.
The right-hand outline uses Hugo's nested `TableOfContents` through H6, including
authored H1s. Scroll highlighting marks both the current heading and its ancestor
path, and keeps the current link visible in long outlines. Mobile/tablet readers
use an “On this page” disclosure with the same hierarchy. Browser regression
checks live in `tests/navigation/` and run against the production artifact in CI.

The importer remains independent of the theme. Its `callout context/title/icon`
output is accepted by `layouts/_shortcodes/callout.html`, which maps severity and
titles to Hextra callout components. Existing `card-grid` and `link-card`
shortcodes retain their authoring syntax and use the new UI. Math is rendered by
Hugo, with KaTeX styles and fonts served locally; FlexSearch and the optional Jost
reading font are also served from pinned npm dependencies.

Callouts use borderless colored surfaces. Markdown tables use
`layouts/_markup/render-table.html` to retain native table cells and alignment
inside a keyboard-scrollable surface. Cells form tiles with square corners, one
soft body fill, and a brighter blue header. Thin gaps between rows and columns
show the surrounding background. Empty header rows are omitted. Both components
use filled styling in `assets/css/custom.css` for light and dark modes.

The site's SEO field precedence, description validation, analytics event bus,
legacy redirects, attachment URLs, and HTML/Markdown navigation maps remain
site-owned. `layouts/_partials/head.html` is based on Hextra v0.13.0 with the
site's SEO and analytics entrypoints. Review it against upstream when upgrading.
`assets/css/custom.css` is the active local stylesheet. The old
`assets/scss/common/_custom.scss` is not loaded by Hextra.

## Content Structure

This repo now supports two content-authoring paths:

- direct in-repo Markdown under `content/`
- external notes imported into managed `content/` targets by the migration
  pipeline

The committed migration manifest in `scripts/migrate/config.toml` decides which
sections are regenerated from external notes.

The migration regression surface is intentionally split:

- the external notes tree keeps `integrated-test-pages/callouts.md` for manual
  copy/reference
- other migration regression cases live in repo-owned tests instead of the
  notes tree
- one repo-owned smoke page is imported into
  `content/system-design/integrated-test-pages/` for quick manual verification

The content tree is organized by section. Current top-level sections include:

- `content/ai/`
- `content/ai-engineering/`
- `content/system-design/`
- `content/engineering/`
- `content/projects/`
- `content/blog/`
- `content/topics/`
- `content/research/` (reading map and selected public implementations)

Section landing pages use `_index.md`. Regular pages use `.md` files inside the
section folders. For example:

- `content/system-design/_index.md` renders the section landing page
- `content/system-design/topics/api.md` renders `/system-design/topics/api/`
- `content/ai/collab-and-joint-work/build-approach.md` renders
  `/ai/collab-and-joint-work/build-approach/`
- `content/ai-engineering/evaluation/harness-and-platform.md` renders
  `/ai-engineering/evaluation/harness-and-platform/`
- `content/projects/code-assistant.md` is generated from the selected external
  project note and renders `/projects/code-assistant/`
- `content/research/` retains the reading map and selected implementation pages
  in the repository. `/Users/val/notes/projects/valery-tech/` is excluded from
  migration.
  The reading map starts with Evaluation and AI; the code page links to specific
  implementations. Former contribution summaries remain archived in the notes
  vault and are not imported. Their old URLs are aliases on the relevant notes.
  Private project plans, positioning work, and reviews are also excluded.
  The active `ai/ai-system-design/research-followups-2026-10-30/` coordination
  subtree is excluded as working material; trailing `/**` exclusions apply at
  every nesting depth.

On pages other than the homepage, a nonempty `description` in the Markdown front
matter appears as an introductory paragraph with inline Markdown formatting.
The introduction follows the page title, including an opening H1 authored in
Markdown, or precedes the body when there is no title. The homepage keeps its
description in page metadata without displaying it as an introduction.

If material is unfinished, it can live either in a local in-repo holding area
such as `content/system-design/to_sort/` or upstream in the external notes tree
before migration.

## Navigation And Routing

Routes are mostly derived from the `content/` tree. Hugo turns folder structure
and filenames into URLs, with some permalink rules coming from
`config/_default/hugo.toml`.

Navigation is a mix of:

- content-driven section structure
- menu entries defined in `config/_default/menus/menus.en.toml`
- local sidebar rendering logic in `layouts/partials/sidebar/`

That means content placement affects both URLs and how sections are surfaced in
the UI.

Published URLs are retained in `data/url-history.json`. Preparation in
`scripts/site-map.mjs` invokes `scripts/redirects.mjs` to import subsequent Git
snapshots, validate the current Hugo output, and render decisions from
`data/redirects.json` through `scripts/redirect-page.html`. The generated static
files under `.generated/redirects/` preserve old addresses on GitHub Pages and
in local preview. Single replacements redirect; multiple replacements show a
choice. The build fails when a retired URL has no decision or an internal link
has no destination. The workflow is described in the runbook's URL-preservation
section.

## Build Flow

This document only describes the source-side architecture. For local workflow
commands, use [docs/runbook.md](/Users/val/projects/website/valerytech.github.io/docs/runbook.md).
For build/runtime/deploy mechanics, use
[docs/infra.md](/Users/val/projects/website/valerytech.github.io/docs/infra.md).

At a high level:

- authored content and config live in `content/`, `config/`, `layouts/`,
  `assets/`, and `static/`
- Hugo reads those source folders to build the site
- generated output is written to `public/`
- generated asset/cache artifacts are written to `resources/`

For local preview, the repo uses a localhost dev base URL so internal links stay
on the local server rather than jumping to the production domain. That is an
execution detail, not a content-architecture rule.

## Practical Rule

When adding or restructuring knowledge-base content:

- decide first whether the target section is direct-authored or migration-managed
- put direct-authored publishable Markdown in `content/`
- put migration-managed source material in the external notes tree and rerun the migration
- group files by subject area inside the repo
- use `_index.md` for section pages
- keep generated files out of `content/`

`content/` remains Hugo's immediate build input, but it is no longer always the
canonical authoring location for every section.

## Related Docs

- [docs/runbook.md](/Users/val/projects/website/valerytech.github.io/docs/runbook.md) covers local commands and note imports
- [docs/infra.md](/Users/val/projects/website/valerytech.github.io/docs/infra.md) covers Docker, toolchain, CI, and deployment
- [docs/callouts.md](/Users/val/projects/website/valerytech.github.io/docs/callouts.md) covers migrated callout syntax, mapping, and verification
