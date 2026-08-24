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
`system-design` or `ai-engineering`.

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

Example:

```toml
[[imports]]
name = "ai-engineering"
source_root_kind = "external"
source_subtree = "ai-engineering"
target_subtree = "ai-engineering"
selection_mode = "opt-in"
selection_paths = ["coding-agents", "evaluation", "ambiguity.md", "approach/empirical-nature.md", "approach/experimentation.md"]
include = ["**/*.md", "*.md"]
root_index_source = "_index.md"
```

The committed manifest currently uses that pattern for `ai-engineering`, so
only `coding-agents/`, `evaluation/`, `ambiguity.md`,
`approach/empirical-nature.md`, `approach/experimentation.md`, and the root
`_index.md` are regenerated for that section.

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
