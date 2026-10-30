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

This runs the same Hugo SEO check as the build and fails when an editorial page's
resolved description is outside 110–250 characters, inclusive. The check covers
the homepage, articles, and section pages with an authored description, summary,
or introduction. SEO overrides and summary fallbacks still apply. It renders in
memory without replacing `public/`. `make build` reports violations as warnings.
Inside the container or CI, use `npm run lint` or `npm run lint:descriptions`.

404 pages, taxonomy indexes and terms, legal pages, empty section listings, and
pages marked `seo.robots: noindex` (or `none`) do not need to meet the editorial
length target. A short description is still emitted when available; an empty
description tag is omitted. Exemption from this check does not change indexing.

Use an explicit front matter override for other technical pages or to require a
description on an important landing page:

```yaml
seo:
  validateDescription: false # true opts a page into validation
```

The example blog post uses this exemption because it is a theme demo. Main
collection landing pages keep their authored descriptions and are validated.

The limits are configurable under `[seo.description.length]` in
`config/_default/params.toml`; exempt page kinds and content types are configured
in `[seo.description]`. The 110–250 range is an editorial convention, not a
Google requirement. Google can build snippets from page content and has no fixed
meta-description length limit; see [Google's snippet guidance](https://developers.google.com/search/docs/appearance/snippet).

After changing toolchain pins or the Dockerfile, rebuild and restart preview:

```bash
docker compose up --build -d site
```

Preview startup and production builds assemble Markdown, then Hugo renders six
HTML navigation maps:

- `/agent-map/` is the short main index, with links to top-level section maps and
  selected documents.
- `/agent-map/ai/`, `/agent-map/ai-engineering/`, `/agent-map/engineering/`,
  `/agent-map/system-design/`, and `/agent-map/projects/` each list their collection's
  complete contents, grouped under subsection headings with descriptions.
  Maps link directly to current pages; legacy URLs and redirects are omitted.
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

The short main map starts with Evaluation, AI, and AI Engineering. It also links
the reading map and code examples, followed by the section maps and selected
technical notes. Titles and descriptions come from the destination pages.
The main map retains its existing size and link-count limits.

Edit the retained research pages in `content/research/`, then build and check
their public paths and pinned code links. `/Users/val/notes/projects/valery-tech/`
is excluded from migration, as is `/Users/val/notes/ai/ai-systems-design/`.

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
| `agent_map_exclude: true` | Omits the article from agent maps while leaving the page published. |
| `showTitle` | Retains the legacy title flag on import. Standard article templates supply a title when the body has no authored H1. |

### Project notes

`/Users/val/notes/projects/valery-tech/` is excluded from migration. Its previously
imported reading map and selected implementation pages remain in
`content/research/`. The former contribution overview, three summaries, and
reading route are archived source drafts. Their public
URLs redirect through Hugo aliases to the reading map or relevant technical
notes; the summaries themselves are no longer generated.

`implementation-notes.md` and `author-review.md` remain local project context.
They are not selected by the migration manifest. Adding a file to that folder
does not publish it automatically. The generated content is committed with the
website so CI can build without access to the notes vault.

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
[docs/architecture.md](architecture.md).

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

## Preserve URLs when moving or removing notes

`make migrate`, `make build`, and `make up` prepare legacy URL pages automatically.

1. Review production 404 traffic and record approved paths and source counts in
   `data/redirect-traffic.json`. Unvisited historical URLs need no mapping.
2. If no current page or Hugo alias covers the path, add current destinations
   and a public explanation to `data/redirects.json`.
3. Run `make build`; fix reported missing coverage, invalid destinations, or
   broken internal links. Correct imported links in the original notes too.
4. Commit the map, traffic evidence, and `data/url-history.json` inventory.
   Generated output remains ignored. `make site-map-check` checks freshness;
   `make verify` runs the production checks.

See [legacy URL redirects](legacy-url-redirects.md) for the schema and behavior,
and [analytics](analytics.md#reports) for saved 404 reports.

## Related Docs

- [README.md](../README.md) for the shortest quickstart
- [docs/infra.md](infra.md) for toolchain, Docker, CI, and deployment
- [docs/architecture.md](architecture.md) for repo structure and content placement

## Hextra theme

Initialize the pinned theme after a fresh clone or branch switch:

```bash
git submodule update --init --recursive
```

`make up` imports Markdown and starts Hextra at `http://localhost:1313/`.
`make build` runs the production build plus SEO, navigation-map, redirect,
and Hextra integration checks. `make verify` also checks live preview routes.
The migration regression suite can be run independently:

```bash
docker compose run --rm site uv run --frozen python -m unittest discover -s tests/migrate
```

Change the site UI in `assets/css/custom.css` and local `layouts/` overrides.
The importer keeps the existing callout/card syntax; the theme adapters render
it as Hextra components. Imported heading links, sidebar weights, and section
reading guides are preserved. A trailing `/**` exclusion in the migration
manifest excludes an entire source subtree, including nested attachments.

To upgrade Hextra, check out the intended release in `themes/hextra/`, review
local head/sidebar/heading overrides against it, run `make verify`, and commit
the updated submodule pointer. Keep the theme pinned to a release commit.

### Check navigation in Chrome

Start the Docker preview with `make up`. In another terminal with Node/npm and
Google Chrome installed, install the project dependencies and run:

```bash
npm ci
npm run test:navigation
```

The checks exercise nested section menus, current/ancestor highlights, H1–H4
outlines, scrolling, direct heading links, and mobile/tablet navigation. To
compare the outline with production and save review screenshots:

```bash
REFERENCE_URL=https://valery.tech SCREENSHOT_DIR=.generated/navigation-review npm run test:navigation
```

Set `BASE_URL` to test another preview. Set `BROWSER_EXECUTABLE` to select a
specific Chrome executable. CI uses `BROWSER_CHANNEL=chromium` after running
`npx playwright-core install --with-deps chromium`, and checks the minified
production output using Vite preview. These checks do not require host Hugo.
