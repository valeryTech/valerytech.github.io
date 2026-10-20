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
overrides documented in [docs/migration.md](migration.md) also apply here.

Use this while editing content, templates, config, or assets. The site is
served at `http://localhost:1313`, Hugo rebuilds watched files automatically,
and local links stay on localhost instead of jumping to production.

Build the site in production mode:

```bash
make build
```

Use this to regenerate `public/` and `resources/` the same way CI and GitHub
Pages do.

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

## What To Edit

Edit source files in:

- `content/`
- `layouts/`
- `assets/`
- `config/`

Do not edit generated output in `public/` or `resources/`.

These `content/` sections are migration-managed:

- `content/system-design/`
- `content/engineering/`
- `content/ai/`
- `content/ai-engineering/`
- `content/projects/`

For those sections, edit the external notes source instead of the generated
files in `content/`. The migration workflow is documented in
[docs/migration.md](/Users/val/projects/website/valerytech.github.io/docs/migration.md).

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
- use the migration workflow in
  [docs/migration.md](/Users/val/projects/website/valerytech.github.io/docs/migration.md)

## Related Docs

- [README.md](/Users/val/projects/website/valerytech.github.io/README.md) for the shortest quickstart
- [docs/migration.md](/Users/val/projects/website/valerytech.github.io/docs/migration.md) for the external-notes workflow
- [docs/infra.md](/Users/val/projects/website/valerytech.github.io/docs/infra.md) for toolchain, Docker, CI, and deployment
- [docs/architecture.md](/Users/val/projects/website/valerytech.github.io/docs/architecture.md) for repo structure and content placement
