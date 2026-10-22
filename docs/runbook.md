# Local Runbook

## Purpose

Use this document for day-to-day local work on the site: preview, build,
verify, stop, and reset the local environment.

## Before You Start

- Docker with `docker compose`
- `make`
- The external notes source at `/Users/val/notes`, or a `SOURCE_NOTES` override

Host-level Hugo, Node, npm, or Python package installs are not part of the
supported workflow.

## Common Workflows

Start the local preview server:

```bash
make up
```

`make up` runs `make migrate` first, importing the latest source notes and
refreshing the agent maps before it starts the preview. If migration fails,
the preview startup command is not run. The `SOURCE_NOTES` and `MIGRATE_CONFIG`
overrides documented under [Migration](#migration) also apply here.

Use this while editing content, templates, config, or assets. The site is
served at `http://localhost:1313`, Hugo rebuilds watched files automatically,
and local links stay on localhost instead of jumping to production.

Build the site in production mode:

```bash
make build
```

Use this to regenerate `public/` and `resources/` the same way CI and GitHub
Pages do.

Lint page descriptions:

```bash
make lint
```

This runs the same Hugo SEO check as the build and fails when a published page's
description is outside 110–250 characters, inclusive. It checks the resolved SEO
description, including summary fallbacks and generated section and taxonomy pages,
and renders in memory without replacing `public/`. `make build` continues to
report these violations as warnings. Inside the container or CI, use `npm run lint`
or `npm run lint:descriptions`.

The limits are configurable under `[seo.description.length]` in
`config/_default/params.toml`.

Preview startup and production builds assemble Markdown, then Hugo renders six
HTML navigation maps:

- `/agent-map/` is the short main index, with links to top-level section maps and
  selected documents.
- `/agent-map/ai/`, `/agent-map/ai-engineering/`, `/agent-map/engineering/`,
  `/agent-map/system-design/`, and `/agent-map/projects/` each list their collection's
  complete contents, grouped under subsection headings with descriptions and
  relevant legacy redirects.
- Blog, Topics, and website information pages fit in the main index. Subsections
  do not generate separate map files.

Maps are ordinary HTML pages with headings and links, served as `text/html`.
The previous `/llms.txt` and `/site-map.md` downloads remain available at the root
and under the five content collections, and now point to the HTML maps.
Every collection map links back to the main index.
Template examples and the 404 utility page are omitted. Source-note properties
control descriptions, publication, map exclusions, and optional status labels;
see [Note metadata](#note-metadata).
The footer links to the main map; page metadata links to the collection map,
including for articles in nested subsections. Selected reading links are
configured in `data/agent_navigation.toml`.

The five mapped collections are selected by the `cascade` rule in
`config/_default/hugo.toml`.

`make migrate` runs `scripts/site-map.mjs` after a successful content sync.
The script uses Hugo's page inventory to assemble six Markdown sources under
`content/agent-map/`. These generated files are ignored by Git and excluded from
normal article listings and search. Hugo renders them with `layouts/agent-map.html`.
The `predev` and `prebuild` npm hooks also refresh the sources, so a clean checkout
can preview or deploy without access to the external notes folder.

Use `make site-map` to regenerate the Markdown sources without starting the site;
an already running preview rebuilds them automatically. `make site-map-check`
compares the Markdown sources against a fresh assembly without rewriting them.
`make build` renders the complete HTML site and removes obsolete public outputs.
After editing repo content during a preview session, rerun `make site-map` to
refresh its HTML maps.

Run a quick local confidence check:

```bash
make verify
```

Use this when you want a production-style build plus a few route checks.

Stop the local preview stack:

```bash
make down
```

Use this when you are done or when the preview server gets into a bad reload
state.

Remove disposable generated artifacts:

```bash
make clean
```

Use this before a clean rebuild or after migration if the local preview still
shows stale output.

Optional utility commands:

```bash
make format
make hugo-version
```

## Migration

The [migration config](../scripts/migrate/config.toml) controls which source
notes are imported and where they appear under `content/`. It is the source of
truth for import selections and path mappings.

Validate and stage the import before replacing managed content:

```bash
make migrate-check
```

Inspect `.migration/reports/check.json` for errors and unresolved links, and
`.migration/work/content/` for the generated Markdown. To apply the import and
refresh the agent maps:

```bash
make migrate
```

The default source is `/Users/val/notes`. Both commands and `make up` accept
`SOURCE_NOTES` and `MIGRATE_CONFIG` overrides, for example:

```bash
make migrate SOURCE_NOTES=/abs/path/to/notes
MIGRATE_CONFIG=/abs/path/to/manifest.toml make migrate-check
```

Within each import, `selection_paths` are relative to `source_subtree`; folders
apply recursively. `selection_mode` chooses `opt-in` or `opt-out`.
`root_index_source` includes the section index even with opt-in selection;
`section_title` names a synthesized root index. Use `rename_overrides` to retain
published paths when source files move. For sidebar ordering, set numeric
`sidebar_weights` keyed by extensionless paths relative to `target_subtree`;
lower weights appear first, followed by unweighted entries alphabetically.

### Note metadata

Set these properties in the source note's YAML front matter so migration
preserves them:

| Property | Purpose |
| --- | --- |
| `description` | Required on each migrated article; use 110–250 characters for the page introduction, SEO metadata, and agent map. |
| `document_status` | Optional map label: `canonical` for the preferred starting point, `draft` for provisional material, or `archived` for preserved history. Unset means no assigned status. |
| `draft` | Controls Hugo publication independently of the `document_status` label. |
| `agent_map_exclude: true` | Omits the article and its redirects from agent maps while leaving the page published. |

## What To Edit

Edit source files in:

- `content/`
- `layouts/`
- `assets/`
- `config/`

Do not edit generated output in `public/` or `resources/`.

For subtrees managed by the [migration config](../scripts/migrate/config.toml),
edit the external source notes. Each migration replaces their generated
`content/` files. Use the [migration commands](#migration) to regenerate them.

For repo structure, section ownership, and content placement rules, see
[docs/architecture.md](/Users/val/projects/website/valerytech.github.io/docs/architecture.md).

## Troubleshooting

Local edits do not show up:

- confirm you are looking at `http://localhost:1313`
- refresh the exact page you changed
- if needed, restart preview with `make down` and `make up`

Local preview still shows deleted or old pages after migration:

- stop preview with `make down`
- run `make clean`
- rerun migration if needed
- start preview again with `make up`

Links jump from localhost to `valery.tech`:

- this usually means you are looking at stale output or a stale browser view
- rebuild or restart preview before debugging templates

Migration-managed content looks wrong locally:

- check the external notes source, not just the generated `content/` file
- use the [migration commands](#migration) to regenerate the content

## Related Docs

- [README.md](/Users/val/projects/website/valerytech.github.io/README.md) for the shortest quickstart
- [docs/infra.md](/Users/val/projects/website/valerytech.github.io/docs/infra.md) for toolchain, Docker, CI, and deployment
- [docs/architecture.md](/Users/val/projects/website/valerytech.github.io/docs/architecture.md) for repo structure and content placement
