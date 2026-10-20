# Migration

## Purpose

Use this document for the external-notes migration workflow: validating source
notes, regenerating migration-managed `content/` subtrees, and understanding
what the repo expects at runtime.

## Source Of Truth

The migration pipeline imports selected external notes into managed Hugo
content. The committed manifest in `scripts/migrate/config.toml` decides which
subtrees are generated this way.

If a section is migration-managed, the canonical source is the external notes
tree, not the generated Markdown under `content/`.

Each `[[imports]]` entry in the manifest controls one managed subtree, such as
`system-design`, `ai`, `ai-engineering`, or `projects`.

## Descriptions From Note Properties

To supply the agent map's description, add a `description` property to the
canonical source note's YAML front matter. This is the properties block used
by Obsidian, enclosed in `---` lines at the very start of the Markdown file:

```markdown
---
title: "Evaluation coverage"
description: "How to choose evaluation cases, identify coverage gaps, and connect findings to product decisions."
---

# Evaluation coverage

The note's content starts here.
```

Run `make migrate` after editing the source note. The importer preserves
`description` in the generated page metadata, and the article's section map
(discoverable from `/agent-map/`) uses it ahead of the automatic excerpt. It is
also available to the website's page metadata. Keep it concise: the map displays
up to 240 characters.
Production checks require a nonempty description of up to 240 characters for
every migrated article across AI, AI Engineering, Engineering, System Design,
and Projects. Section indexes and other pages can fall back to the page summary.

Set this property in the original note, rather than in the migration-managed
`content/` copy, so the next import preserves it.

## Document Status and Map Exclusions

Use a separate `document_status` property to help readers choose between related
documents. The map displays these labels next to document links:

- `canonical`: the preferred starting point for that topic, rather than a claim
  that the material is final or independently verified.
- `draft`: provisional working material that remains publicly readable.
- `archived`: material retained for historical context.

For example, a published working draft can use:

```yaml
---
description: "A draft proposal for adopting the test-strategy playbook across teams."
document_status: draft
draft: false
---
```

Hugo's `draft` property controls publication. It is independent of the editorial
`document_status` label. Unlabeled documents keep an unspecified status; the map
does not treat version numbers, filenames, or selected reading links as proof
that one document supersedes another.

Set `agent_map_exclude: true` on an article to omit its entry and redirects from
agent maps while keeping the page published. The template Example Post uses this
property. The generated 404 utility page is also omitted from navigation maps.
Migration preserves both properties from the original note's front matter.

## Runtime Contract

By default, the migration commands use:

```bash
/Users/val/notes
```

You can still override it explicitly when needed:

```bash
SOURCE_NOTES=/abs/path/to/notes
```

Current behavior:

- `scripts/migrate-site.sh` uses `/Users/val/notes` by default
- `SOURCE_NOTES` overrides that default when set
- the migration fails only if the final path does not exist

You can also override the manifest at runtime when needed:

```bash
MIGRATE_CONFIG=/abs/path/to/manifest.toml
```

That is optional. The normal default is `scripts/migrate/config.toml`.

## Common Workflows

Validate migration without rewriting `content/`:

```bash
make migrate-check
```

Use this to validate mappings, stage output under `.migration/`, and inspect
warnings before updating managed content.

Regenerate migration-managed content:

```bash
make migrate
```

Use this to rebuild only the sections managed by the manifest.

After a successful sync, the migration command assembles Markdown map sources in
the generated `content/agent-map/` directory. Hugo renders them as HTML during
the next preview or production build. Visitors start at `/agent-map/` through the
footer's **Agent map** link. This short index links to collection maps and
selected documents; each collection map lists all its articles, grouped by
subsection. Small collections such as Blog and Topics fit in the main index.
There are six maps in total, served as ordinary `text/html` pages at `/agent-map/`
and `/agent-map/<collection>/`. The former `llms.txt` and `site-map.md` URLs remain
as companion downloads and link to the HTML maps.
`make migrate-check` does not rewrite the maps.

The npm preview and build entrypoints refresh the Markdown sources before Hugo
renders the site, including on CI. Generated sources are ignored by Git; production
builds clear obsolete public outputs. Article descriptions come from source-note metadata, with the page
summary as a fallback. Drafts and private source-note paths are excluded.
The main index's selected documents are configured in `data/agent_navigation.toml`.

Override the notes root explicitly:

```bash
make migrate SOURCE_NOTES=/abs/path/to/notes
```

Use a different manifest:

```bash
MIGRATE_CONFIG=/abs/path/to/manifest.toml make migrate
```

Use this for one-off imports, narrow experiments, or section-specific migration
runs.

## Manifest Selectors

Each `[[imports]]` entry may optionally narrow the imported source paths with:

- `selection_mode = "opt-out" | "opt-in"`
- `selection_paths = ["..."]`

Rules:

- `selection_paths` are relative to that import's `source_subtree`
- a folder path applies recursively to all descendants
- a file path applies only to that exact source file
- `opt-out` means import everything except the listed files/folders
- `opt-in` means import only the listed files/folders
- `root_index_source` still imports the section root index when configured, even in `opt-in`
- `section_title` sets the title of a synthesized root index when the source has no root index

Example:

```toml
[[imports]]
name = "ai-engineering"
source_root_kind = "external"
source_subtree = "ai-engineering"
target_subtree = "ai-engineering"
selection_mode = "opt-in"
selection_paths = ["coding-agents", "evaluation", "approach/empirical-nature.md", "approach/experimentation.md"]
include = ["**/*.md", "*.md"]
root_index_source = "_index.md"
```

The committed manifest uses that pattern for `ai`, `ai-engineering`, and
`projects`. The AI import currently publishes `ai/approach/`,
`ai/collab-and-joint-work/`, `ai/design/`, `ai/discovery/`, `ai/other/methodology/`,
`ai/other/methodology-v1.3/`, `ai/operating-model/`, `ai/risk-areas/`, and
`ai/system-evaluation/`. It also imports two individual files from `ai/var/`:
`ai-product-types.md` (the seven product archetypes and deployment taxonomy) and
`practitioner_guide_seven_ai_product_types.md` (the accompanying design,
evaluation, and estimation guide).

The methodology imports include the developer and instrumentation guides,
comparison and change-detection methods, slice definitions, and supporting
rules and specifications. Those methodology pages remain source-note
migrations. System evaluation is curated in the canonical notes as
Building and Reviewing Software with AI: product framing, design decisions,
common development mistakes, the review process, and testing during review.
Migration publishes those articles without rewriting them. The former
`generation.md` fragment is
folded into `code-review.md`, which preserves its old URL as a Hugo alias.

The detailed `ai/design-research/` and legacy `ai/architecture-dsl-like/`
collections remain outside the allowlist pending a deliberate publication
sequence. The taxonomy improvement proposal and other `ai/var/` notes are also
excluded. Links from selected notes do not authorize importing their private
targets. Keep new selections specific; do not opt in the whole `ai/` or
`ai/var/` tree to resolve references.

The former `ai-engineering/my-perspective.md` page now appears
under `ai/approach/`. Its source note declares the old URL as a Hugo alias, so
migration preserves the redirect in the generated page front matter.
Because the notes subtree has no root `_index.md`, the migration synthesizes
the required parent landing pages and uses `section_title = "AI"` for the root
page to preserve the acronym. The Projects import currently publishes only
`code-assistant.md` and the root `_index.md`; the other external project notes
remain unpublished.

## Sidebar Ordering

Migration-managed content can define optional left-menu weights in its import
entry. Keys are extensionless paths relative to `target_subtree` and may refer
to a section or a regular page:

```toml
[[imports]]
name = "engineering"
source_subtree = "topics/engineering"
target_subtree = "engineering"

[imports.sidebar_weights]
"architecture" = 10
"data" = 20
"topics/tests" = 30
```

The migration writes each configured value to `sidebar.weight` in the generated
front matter. Lower values appear first. Entries with the same weight are
alphabetical, and entries without weights follow alphabetically. Use gaps such
as 10, 20, and 30 so entries can be inserted later.

The manifest is the source of truth for managed content because `make migrate`
replaces generated subtrees. For content outside those subtrees, set
`sidebar.weight` directly in the page front matter.

## Operational Notes

Managed content may be overwritten on every migration run. Do not hand-edit
generated files in a managed subtree unless you intend those edits to be lost.

If the local preview still shows removed or renamed pages after migration:

```bash
make clean
make up
```

The migration regression split is:

- external notes keep `integrated-test-pages/callouts.md` as the manual copy/reference catalog
- `tests/migrate/fixtures/` holds the main automated regression inputs
- `tests/migrate/smoke_notes/` provides the small repo-owned smoke page used for quick local checks

For callout-specific behavior, syntax, and verification, see
[docs/callouts.md](/Users/val/projects/website/valerytech.github.io/docs/callouts.md).

## Related Docs

- [docs/runbook.md](/Users/val/projects/website/valerytech.github.io/docs/runbook.md) for everyday local workflows
- [docs/infra.md](/Users/val/projects/website/valerytech.github.io/docs/infra.md) for the migration runtime and toolchain design
- [docs/architecture.md](/Users/val/projects/website/valerytech.github.io/docs/architecture.md) for ownership boundaries between direct-authored and migration-managed content
