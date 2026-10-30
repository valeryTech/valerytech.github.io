## Infrastructure

### Purpose

This document describes the repo's build and execution contract: which command
layer contributors use, how local preview runs, and how the same build path is
reused in CI and GitHub Pages deployment.

### Command model

This site is built by Hugo with the pinned Hextra Git submodule. Node/npm
provides analytics libraries, self-hosted search/math/font assets, and build scripts.
Hextra ships compiled CSS, so local builds do not compile Tailwind or Bootstrap.

The repo also includes a small Python subsystem for content migration. That
tooling is isolated with `uv`, but it still runs through Docker rather than
requiring host-side Python package installation.

The command boundary is:

- `make` for contributor-facing local tasks
- `npm` for app-level Hugo commands
- Docker/devcontainer for local execution

The app-level entrypoints remain:

- `npm run dev`
- `npm run build`
- `npm run format`
- `npm run create`

The main authored inputs are `content/`, `layouts/`, `assets/`, `static/`, and
`config/`. Hugo writes the generated site to `public/` and generated asset/cache
data to `resources/`.

Some `content/` subtrees are regenerated from external notes instead of being
edited directly. The committed migration manifest in `scripts/migrate/config.toml`
defines which sections are managed that way.

Contributor-facing command usage lives in
[docs/runbook.md](/Users/val/projects/website/valerytech.github.io/docs/runbook.md).

### Shared toolchain

Pinned versions live in `.infra/versions.env`:

- `NODE_VERSION=24.15.0`
- `NPM_VERSION=11.13.0`
- `HUGO_VERSION=0.160.1`
- `DART_SASS_VERSION=1.107.0`

That file is the source of truth for both local containers and GitHub Actions, so
the local preview/build path and the production deploy path run on the same Hugo,
Node, npm, and Dart Sass versions.

### Local runtime

Local work is isolated in Docker. Host-level Hugo or Node installation is not part
of the supported workflow.

- `Makefile` is the primary contributor-facing entrypoint
- `make up` completes migration and agent-map regeneration before starting preview
- `compose.yaml` builds the image from `.devcontainer/Dockerfile`
- the `site` service runs `npm run dev -- --bind=0.0.0.0`
- the repo is bind-mounted into `/workspace`
- `node_modules` lives in the named Docker volume `valerytech-node-modules`

The dev command sets `--baseURL=http://localhost:1313/`, so local preview
renders internal links against localhost instead of the production domain.

`.devcontainer/Dockerfile` installs the pinned Node, npm, Hugo, and Dart Sass
versions into the image. It also installs `uv` for the migration pipeline.
`.devcontainer/dev-entrypoint.sh` is the bootstrap guard for local runs: it
hashes `package-lock.json`, runs `npm ci` when dependencies are missing or
stale, then starts the requested command.

That yields a live local server at `http://localhost:1313` with Hugo file
watching enabled for mounted source files.

Production builds use `resources/production/` for generated resources, while
preview uses `resources/`. This keeps production garbage collection from deleting
stylesheet files that the running preview has cached.

The theme is pinned to Hextra v0.13.0 under `themes/hextra/`. Initialize it with
`git submodule update --init --recursive`; CI and deployment use recursive
submodule checkout. Hextra's compiled CSS is combined with
`assets/css/custom.css` and fingerprinted in production. Dart Sass remains
available in the shared toolchain but is not used by the Hextra build.

FlexSearch comes from the local npm package, and KaTeX styles/fonts and Jost
fonts are mounted into the published site. These features do not require
build-time CDN downloads. Mermaid retains Hextra's standard optional loader.

### Repo task scripts

Repo-owned scripts hold reusable task logic instead of embedding longer logic in
the `Makefile` or CI workflows:

- `scripts/build-site.sh` is the shared production build wrapper
- `scripts/verify-site.sh` builds the site, starts preview if needed, and checks
  core routes
- `scripts/clean-generated.sh` removes disposable generated outputs
- `scripts/migrate-site.sh` runs the Docker-wrapped migration entrypoint
- `scripts/site-map.mjs` assembles generated Markdown for the six HTML navigation
  maps after migration and before npm preview/build; it uses the existing Node and
  Hugo toolchain, including on CI

The devcontainer reuses the same Dockerfile, workspace mount, and bootstrap logic,
so opening the repo in a devcontainer and running `docker compose` use the same
runtime contract.

### Migration pipeline

The migration path is Docker-first:

- `pyproject.toml` and `uv.lock` define the Python environment
- `scripts/migrate/` contains the migration CLI, staging pipeline, and the committed tree manifest
- `scripts/migrate-site.sh` provides the bridge from Docker to the external
  notes source and the managed `content/` targets

Internally, the migration code is split into planning, note indexing,
attachment resolution, parsing, conversion, staging, and render/report stages
around a small document IR. That keeps path mapping, wiki-link rewriting,
heading handling, callout conversion, asset copying, and Hugo rendering
decoupled instead of living in one large function.

This pipeline is deterministic. It rebuilds managed targets from source notes
instead of trying to preserve prior generated output in place.

Operator-facing migration usage lives in
[the runbook](runbook.md#migration).
Callout-specific migration behavior lives in
[docs/callouts.md](/Users/val/projects/website/valerytech.github.io/docs/callouts.md).

### CI and deployment

Production hosting is GitHub Pages. Deployments run from GitHub Actions on pushes
to `master`.

- `.github/actions/setup-site/action.yml` loads `.infra/versions.env`
- the action installs the pinned Node version, upgrades npm to the pinned npm
  version, installs the pinned Hugo and Dart Sass binaries, and runs `npm ci`
- `.github/workflows/ci.yml` validates the build on non-`master` pushes and pull
  requests via `scripts/build-site.sh --host`
- after the build, CI installs Playwright's Chromium and runs the navigation
  browser tests against Vite's preview of the minified `public/` artifact
- failed CI runs retain navigation screenshots as a downloadable artifact
- `.github/workflows/deploy.yml` uses the same build wrapper before uploading
  `public/` to GitHub Pages

Netlify is no longer part of the supported deployment path.

The important contract is that local production builds and CI production builds
resolve through the same repo-owned build wrapper, while local preview remains a
separate Hugo server path.

The repo is npm-only. `package.json` declares the supported package manager, and
pnpm-specific config is not part of the supported workflow.

### Navigation checks

`npm run test:navigation` uses Playwright Core and an installed Chrome browser
against `BASE_URL` (default `http://localhost:1313`). These browser checks cover
the current page and its ancestors in the section menu, nested H1–H6 outlines,
scroll highlighting, direct heading links, active-outline visibility, and
mobile/tablet navigation. They also check short and deep breadcrumb trails and
all ten imported callout styles in light, dark, desktop, and mobile layouts.
The static route checks in `make verify` remain
independent of browser installation.

The page outline uses Hugo's `TableOfContents`, preserving its nested lists and
the configured heading range. `assets/js/core/toc-scroll.js` overrides Hextra's
observer to retain the site's reading-position behavior, ancestor highlights,
and automatic outline scrolling. Explicit hash destinations remain selected at
their scroll margin. Smaller screens expose the same outline in an accessible
“On this page” disclosure. Local CSS also marks the section-menu ancestor path.

An optional `REFERENCE_URL=https://valery.tech` compares heading targets and
ancestor paths with the deployed Doks site, while allowing the additional H5/H6
entries. This is a manual migration check;
CI checks the local artifact so a later production content change cannot make
an unrelated branch fail. See the runbook for commands.

### Build artifacts

`public/` and `resources/` are generated artifacts. They are disposable outputs,
not authoring locations, and should not be tracked in git.

Other disposable local artifacts include `hugo_stats.json` and
`.hugo_build.lock`.

The migration workspace under `.migration/`, including the Docker-managed
`.migration/.venv/` created by `uv`, is also disposable and ignored.
