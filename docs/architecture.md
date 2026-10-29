# Architecture

This repository is a Hugo site built on top of the Thulite/Doks stack. Most of
the site framework comes from mounted theme modules, while this repo owns the
actual content, local template overrides, and project-specific assets.

## Main Parts

- `content/` is the source of published pages for Hugo, but some subtrees are
  generated from external notes by the migration pipeline.
- `config/` defines Hugo behavior such as menus, params, permalinks, and module
  mounts.
- `layouts/` contains local template and partial overrides layered on top of
  the theme-provided layouts.
- `assets/` contains SCSS, JavaScript, and images processed during the build.
- `static/` contains files copied to the final site as-is.
- `public/` and `resources/` are generated output and build artifacts. They are
  not authoring locations.

## Ownership Boundaries

The base site behavior mostly comes from Thulite/Doks modules mounted through
`config/_default/module.toml`. This repo mainly customizes the site in four
places:

- `content/` for authored Markdown
- `config/` for site settings, menus, params, and permalinks
- `layouts/` for local template overrides
- `assets/` for local styling, scripts, and images

If something looks like default theme behavior, check the mounted modules first.
If it looks project-specific, check these local folders.

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
- `content/research/` imports exactly `research.md` and
  `selected-implementations.md` from `/Users/val/notes/projects/valery-tech/`.
  The reading map starts with Evaluation and AI; the code page links to specific
  implementations. Former contribution summaries remain archived in the notes
  vault and are not imported. Their old URLs are aliases on the relevant notes.
  Private project plans, positioning work, and reviews are also excluded.

When a Markdown file has a nonempty `description` in its front matter, its HTML
page displays it as an introductory paragraph with inline Markdown formatting.
The introduction follows the page title, including an opening H1 authored in
Markdown, or precedes the body when there is no title. The homepage uses `lead`
as a fallback; blog and legal pages use `summary` when no description is present.

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
