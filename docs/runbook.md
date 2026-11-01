# Runbook

Day-to-day operation of the site: setup, preview, checks, note imports, URL preservation and upgrades. The [infrastructure guide](infra.md) explains how the image, build wrapper and CI fit together.

## Docker only

Every Node, npm, npx, Hugo, Playwright and Python command runs in the `site` container defined by [compose.yaml](../compose.yaml). The host needs only:

- Docker with `docker compose`. On this Mac it is OrbStack; start it with `orb start` if `docker` cannot reach the daemon.
- [Task](https://taskfile.dev/) 3, `git` and `curl`
- The external notes source at `/Users/val/notes`, or a `SOURCE_NOTES` override

Do not install packages or run `npm`, `node`, `hugo`, `uv` or `python` on the host. The container bind-mounts the checkout at `/workspace` and keeps installed state in Docker volumes:

| State                            | Location                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| npm packages                     | `valerytech-node-modules` volume, mounted over the empty `node_modules/` directory |
| Python environment for migration | `valerytech-uv-venv` volume at `/opt/uv-venv`, created by `uv`                     |
| Chromium for navigation checks   | Baked into the image                                                               |

`package.json` and `package-lock.json` stay in the checkout: they are the tracked dependency manifest that the container and CI install from. The empty `node_modules/` directory exists only because Docker needs a mount point for the volume; npm and Hugo require packages inside the project tree.

`task repo:doctor` checks the host prerequisites and reports host installs, such as packages in `node_modules/`, a `.venv/` or `__pycache__` directories. `task repo:doctor -- --fix` removes them. `task docker:reset` deletes both volumes; the next container start reinstalls them.

GitHub Actions is the one exception; see [CI and deployment](infra.md#ci-and-deployment).

## First-time setup

```bash
task repo:init
```

This checks out the pinned Hextra submodule, builds the toolchain image, links `~/agent-docs` when it exists and runs `task repo:doctor`. Run `git submodule update --init --recursive` after switching to a branch with a different theme commit. The first container start runs `npm ci` into the volume; later starts reinstall only when `package-lock.json` changes.

## Commands

`task` lists every task. Pass extra arguments after `--`.

| Task                                                  | Purpose                                                                             |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `task site:up`                                        | Import notes, refresh agent maps, then serve the preview at `http://localhost:1313` |
| `task site:down`                                      | Stop the preview                                                                    |
| `task site:build`                                     | Production build plus SEO, agent-map and theme checks                               |
| `task site:verify`                                    | `task site:build`, then live route checks against the preview                       |
| `task site:maps` / `task site:maps:check`             | Regenerate or check agent-map sources                                               |
| `task site:hugo-version`                              | Print the container's Hugo version                                                  |
| `task content:migrate` / `task content:migrate:check` | Apply or stage the note import                                                      |
| `task quality:verify`                                 | Formatting, unit tests, migration tests and description lint                        |
| `task quality:test`                                   | UI configuration, preference and analytics tests                                    |
| `task quality:test:navigation`                        | Browser navigation checks against the running preview                               |
| `task quality:test:migrate`                           | Migration pipeline unit tests                                                       |
| `task quality:fmt` / `task quality:fmt:check`         | Write or check Prettier formatting                                                  |
| `task quality:lint`                                   | Page description length check                                                       |
| `task docker:build`                                   | Rebuild the image after changing `.infra/` or `.devcontainer/`                      |
| `task docker:shell`                                   | Open a shell in a fresh container                                                   |
| `task docker:run -- <command>`                        | Run one command in a fresh container                                                |
| `task docker:reset`                                   | Delete the npm and uv volumes                                                       |
| `task repo:init` / `task repo:doctor`                 | Set up the checkout, or check the host                                              |
| `task repo:clean`                                     | Remove generated output                                                             |

For an npm script without a task, run it in a one-off container, or in the preview container while `task site:up` is running:

```bash
task docker:run -- npm run test:seo
```

```bash
docker compose exec site npm run check:config
```

Change dependencies in the container and commit `package.json` with `package-lock.json`:

```bash
task docker:run -- npm install <package>
```

## Preview

```bash
task site:up
```

`task site:up` runs `task content:migrate` first; if migration fails, the preview does not start. The `SOURCE_NOTES` and `MIGRATE_CONFIG` overrides from [Migration](#migration) apply. Hugo watches the mounted sources and renders links against localhost, so pages never jump to production.

For access from another device on the LAN, set `PREVIEW_BASE_URL=http://mbp.local:1313/` in the local `.env` file, using the Mac's local hostname, and recreate the container with `task site:down` and `task site:up`. With OrbStack, also enable `docker.expose_ports_to_lan` and restart OrbStack.

Stop the preview with `task site:down`, and run `task repo:clean` before a clean rebuild.

## Checks

Run checks that match the change; [AGENTS.md](../AGENTS.md#validation) lists the required set.

- `task quality:test` runs `check:config`, `test:ui` and `test:analytics`. Run it after editing `data/ui/*.json`, `data/callouts.json` or `data/analytics.json`; preview startup and production builds also run `check:config`.
- `task quality:fmt:check` is the formatting check CI runs.
- `task quality:verify` runs the formatting check, both unit suites and the description lint in one go.
- `task quality:test:migrate` covers the importer.
- `task site:build` regenerates `public/` and `resources/` the way CI and GitHub Pages do, builds the migration test pages into `.generated/fixture-site/`, then runs the publication, SEO, agent-map and theme tests.
- `task site:verify` also checks the 404 page, the core routes and the eight agent maps in the running preview, starting and stopping it if needed.

### Indexing

A `[[cascade]]` in `config/_default/hugo.toml` marks `/system-design/archive/`, `/system-design/to-sort/` and `/functional-programming/to-sort/` as `seo.robots: "noindex, follow"` and removes them from the sitemaps. The pages stay published and linked. To keep another section out of search, add its path to that cascade. The 404 page is always `noindex`. `layouts/robots.txt` allows everything and points crawlers to `/sitemap.xml`.

### Unpublished fixtures

The migration test pages under `/system-design/integrated-test-pages/` are regression fixtures. A second `[[cascade]]`, limited to the `production` environment, stops Hugo rendering or listing them, so the deployed site, its sitemaps, search index and agent maps leave them out. The preview from `task site:up` still shows them, and `npm run build:fixtures` builds the site with them into `.generated/fixture-site/` for the theme tests and, in CI, the navigation tests (`FIXTURE_BASE_URL`).

`tests/publication/` checks the production build: these fixtures and the retired Blog and Topics collections render nothing and are linked from nowhere, every header, More collections, drawer and footer link opens a page, and each linked collection has notes or an introduction. To bring back a collection, add its content and remove it from `retired` in that test.

### Page descriptions

`task quality:lint` renders the production site in memory and fails when an editorial page's resolved description is outside 110–250 characters, inclusive. It covers the homepage, articles and section pages with an authored description, summary or introduction; `task site:build` reports the same violations as warnings.

404 pages, taxonomy pages, legal pages, empty section listings and pages marked `seo.robots: noindex` (or `none`) are exempt. A page can opt out, or opt in, in front matter:

```yaml
seo:
  validateDescription: false # true opts a page into validation
```

The limits live under `[seo.description.length]` in `config/_default/params.toml`, and the exempt kinds and types under `[seo.description]`. The range is an editorial convention, not a Google requirement; see [Google's snippet guidance](https://developers.google.com/search/docs/appearance/snippet).

### Navigation checks

Start the preview with `task site:up`, then in another terminal:

```bash
task quality:test:navigation
```

The suite covers section menus, current and ancestor highlights, H1–H6 outlines, scrolling, direct heading links, breadcrumbs, mobile and tablet navigation, and the ten callout styles in light and dark. A pixel check catches content showing through the top bar or around the breadcrumb's rounded corners.

Each test opens its own browser context, so up to six run at once and the suite takes about 20 seconds. A test that runs longer than a minute fails instead of stalling the run. To debug a failure one test at a time:

```bash
docker compose exec -e NAVIGATION_CONCURRENCY=1 site npm run test:navigation
```

Compare the outline with production and save review screenshots:

```bash
docker compose exec -e REFERENCE_URL=https://valery.tech -e SCREENSHOT_DIR=.generated/navigation-review site npm run test:navigation
```

Set `BASE_URL` the same way to test another preview. For the Safari engine, add WebKit to the running container; it lasts until the container is recreated:

```bash
docker compose exec site npx playwright-core install --with-deps webkit
```

```bash
docker compose exec -e BROWSER_ENGINE=webkit site npm run test:navigation
```

## Migration

The [migration config](../scripts/migrate/config.toml) selects which source notes are imported and where they land under `content/`. Each import replaces its managed `content/` files, so edit those notes in the source, not in the repo. Name each note and section as [page titles](titles.md) describes.

`include` and `exclude` patterns match against the end of a path, so `input/**` skips every `input` folder at any depth. A leading `/` anchors a pattern at the import root: `/input/**` skips only the top-level `input` folder.

Stage the import and inspect `.migration/reports/check.json` and `.migration/work/content/`:

```bash
task content:migrate:check
```

Apply it and refresh the agent maps:

```bash
task content:migrate
```

Both tasks and `task site:up` read these environment overrides:

```bash
SOURCE_NOTES=/abs/path/to/notes task content:migrate
```

```bash
MIGRATE_CONFIG=/abs/path/to/manifest.toml task content:migrate:check
```

Within each import, `selection_paths` are relative to `source_subtree`; folders apply recursively. `selection_mode` chooses `opt-in` or `opt-out`. `root_index_source` includes the section index even with opt-in selection, and `section_title` names a synthesized root index. `rename_overrides` keeps published paths when source files move. A trailing `/**` exclusion drops a whole source subtree, including attachments. `sidebar_weights`, keyed by extensionless paths relative to `target_subtree`, order the sidebar: lower weights first, then unweighted entries alphabetically.

### PDF attachments

A note links a PDF like any attachment, for example `[[sources/ai-foundations/paper.pdf|Author 2026]]`, or by its file name alone, `[[paper.pdf|Author 2026]]`, as Obsidian writes links. A file name is looked up anywhere in the vault, including `sources`; when two PDFs share it, the link needs enough of the folder to tell them apart, or it shows only its label with an `ambiguous-pdf` warning. The vault's `sources` folder is an absolute symlink to `/Users/val/sources`, which `scripts/migrate-site.sh` mounts read-only at the same path so the link resolves inside Docker; set `SOURCE_FILES` to mount a different folder. Linked PDFs leave the sections that link them: each is stored once, encrypted, directly in `content/sources/` under an opaque name derived from its contents with a neutral `.bin` extension, so every section shares one copy, moving or renaming the PDF in the vault keeps its name, and the URL says nothing about the file. The import owns `content/sources/`, so no import may target it. A PDF over 45 MB (`MAX_PDF_BYTES` in `scripts/migrate/attachments.py`) is not copied, because the reader downloads a whole file before it opens; the link shows only its label with an `oversized-pdf` warning. On the site, PDF links open the [inline reader](frontend.md#pdf-reader).

Most papers are someone else's work. Before pushing, check that each new PDF the upload's dry run lists may be redistributed (CC BY, CC0, public domain or your own); see [Before pushing](../AGENTS.md#before-pushing).

#### PDF storage

`content/sources/` is git-ignored. The preview serves PDFs from it, while the production site links them from a Cloudflare R2 bucket at `pdfBaseURL` in `config/production/params.toml`, so neither the repository nor the Pages site carries them. After an import that adds, changes or removes PDFs, mirror the folder to the bucket before pushing:

```bash
task content:pdfs:upload -- --dry-run
```

```bash
task content:pdfs:upload
```

The task runs rclone in Docker and makes the bucket's `sources/` match `content/sources/`: it uploads new and changed files, skips unchanged ones by checksum and deletes files the import no longer produces. It refuses to run when `content/sources/` is empty. It reads the bucket settings from the git-ignored `.env.r2`, or the file `R2_SETTINGS` names. The bucket's CORS policy must allow `GET` and `HEAD` from `https://valery.tech`, and from `http://localhost:1313` to try the preview against it, because the reader fetches PDFs with JavaScript.

An unresolved wiki link with a label, such as a link into an excluded folder, renders as its label; one without a label stays literal text.

To audit page dates without changing content:

```bash
task docker:run -- uv run --frozen python -m scripts.audit_page_dates --csv .migration/reports/page-dates.csv
```

### Note metadata

Set these properties in the source note's front matter:

| Property                  | Purpose                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `description`             | Required on each migrated article; 110–250 characters for the introduction, SEO metadata and agent map. |
| `document_status`         | Optional map label: `canonical`, `draft` or `archived`. Unset means no status.                          |
| `draft`                   | Controls Hugo publication independently of `document_status`.                                           |
| `agent_map_exclude: true` | Omits the article from agent maps; the page stays published.                                            |
| `showTitle`               | Legacy title flag; templates add a title when the body has no H1.                                       |

### Excluded notes

`/Users/val/notes/projects/valery-tech/` and `/Users/val/notes/ai/ai-systems-design/` are excluded. The reading map and selected implementation pages from the former remain in `content/research/` and are edited in the repo; their retired summaries redirect through Hugo aliases. Adding a file to an excluded folder does not publish it. Imported content is committed so CI builds without the notes vault.

## Agent maps

`scripts/site-map.mjs` uses Hugo's page inventory to assemble eight Markdown sources under `content/agent-map/`, which Hugo renders with `layouts/agent-map.html`:

- `/agent-map/` is the short main index: Evaluation, AI and AI Engineering, the reading map, code examples, section maps and selected notes from `data/agent_navigation.toml`.
- `/agent-map/{ai,ai-engineering,engineering,system-design,projects,functional-programming,type-driven-design}/` list each collection grouped by subsection, linking current pages only.

The collections come from the `cascade` rule in `config/_default/hugo.toml`. `/llms.txt` and `/site-map.md` remain at the root and under each collection and point to the HTML maps. The sources are ignored by Git and refreshed by `task content:migrate` and by the npm `predev` and `prebuild` hooks. After editing repo content during a preview, run `task site:maps`; `task site:maps:check` compares the sources with a fresh assembly.

## Moving notes

There is no per-URL redirect map. When moving or removing published notes, add a Hugo `aliases` entry only for an address you want to keep exactly; every other old address shows the 404 page, which points readers to the collection matching the first path segment and to the agent maps. Check the [404 reports](analytics.md#reports) when deciding whether an alias is worth it.

## Upgrades

- Toolchain: edit `.infra/versions.env`, run `task docker:build`, then `task site:verify`. Keep `PLAYWRIGHT_VERSION` equal to the `playwright-core` pin.
- npm packages: update in the container, as in [Commands](#commands). Keep KaTeX at the version Hugo embeds.
- Hextra: check out the release commit in `themes/hextra/`, review the local head, sidebar and heading overrides against it, run `task site:verify` and commit the submodule pointer.

[dependencies.md](dependencies.md) records the version authorities and compatibility decisions.

## What to edit

Edit `content/`, `layouts/`, `assets/`, `static/`, `config/` and `data/`. Never edit `public/` or `resources/`. Site CSS lives in `assets/css/site/`; see the [styling guide](design/styling.md) and [frontend conventions](frontend.md). [architecture.md](architecture.md) describes ownership and placement.

## Troubleshooting

| Symptom                               | Fix                                                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Cannot connect to the Docker daemon` | Start OrbStack with `orb start`.                                                                             |
| Edits do not appear                   | Check you are on `http://localhost:1313` and reload the page; otherwise `task site:down` and `task site:up`. |
| Deleted or old pages after migration  | `task site:down`, `task repo:clean`, then `task site:up`.                                                    |
| Links jump to `valery.tech`           | Stale output or tab; restart the preview before debugging templates.                                         |
| Imported content looks wrong          | Fix the source note, then `task content:migrate`.                                                            |
| Toolchain behaves like an old version | `task docker:build`, then recreate the preview.                                                              |
| npm packages are corrupt              | `task docker:reset`, then `task site:up`.                                                                    |
