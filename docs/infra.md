## Infrastructure

### Purpose

This document describes the repo's build and execution contract: which command
layer contributors use, how local preview runs, and how the same build path is
reused in CI and GitHub Pages deployment.

### Command model

This site is built by Hugo, with Node/npm providing the frontend dependency
layer used by the theme and asset pipeline.

The repo also includes a small Python subsystem for content migration. That
tooling is isolated with `uv`, but it still runs through Docker rather than
requiring host-side Python package installation.

The command boundary is:

- `make` for contributor-facing local tasks
- `npm` for app-level Hugo commands
- Docker/devcontainer for local execution

The main local entrypoints are:

- `make up`
- `make down`
- `make build`
- `make verify`
- `make clean`
- `make format`
- `make hugo-version`
- `make migrate-check`
- `make migrate`

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

### Shared toolchain

Pinned versions live in `.infra/versions.env`:

- `NODE_VERSION=24.15.0`
- `NPM_VERSION=11.13.0`
- `HUGO_VERSION=0.160.1`

That file is the source of truth for both local containers and GitHub Actions, so
the local preview/build path and the production deploy path run on the same Hugo,
Node, and npm versions.

### Local runtime

Local work is isolated in Docker. Host-level Hugo or Node installation is not part
of the supported workflow.

- `Makefile` is the primary contributor-facing entrypoint
- `compose.yaml` builds the image from `.devcontainer/Dockerfile`
- the `site` service runs `npm run dev -- --bind=0.0.0.0`
- the repo is bind-mounted into `/workspace`
- `node_modules` lives in the named Docker volume `valerytech-node-modules`

The dev command sets `--baseURL=http://localhost:1313/`, so local preview
renders internal links against localhost instead of the production domain.

`.devcontainer/Dockerfile` installs the pinned Node, npm, and Hugo versions into
the image. It also installs `uv` for the migration pipeline.
`.devcontainer/dev-entrypoint.sh` is the bootstrap guard for local runs: it
hashes `package-lock.json`, runs `npm ci` when dependencies are missing or
stale, then starts the requested command.

The normal local preview path is:

1. `make up`
2. `docker compose up site`
3. `npm run dev`
4. `hugo server ... --baseURL=http://localhost:1313/`

That gives a live local server at `http://localhost:1313` with Hugo file
watching enabled for mounted source files.

### Repo task scripts

Repo-owned scripts hold reusable task logic instead of embedding longer logic in
the `Makefile` or CI workflows:

- `scripts/build-site.sh` is the shared production build wrapper
- `scripts/verify-site.sh` builds the site, starts preview if needed, and checks
  core routes
- `scripts/clean-generated.sh` removes disposable generated outputs
- `scripts/migrate-site.sh` runs the Docker-wrapped migration entrypoint against
  a runtime-provided `SOURCE_NOTES` path

The devcontainer reuses the same Dockerfile, workspace mount, and bootstrap logic,
so opening the repo in a devcontainer and running `docker compose` use the same
runtime contract.

### Migration pipeline

The migration path is Docker-first:

- `pyproject.toml` and `uv.lock` define the Python environment
- `scripts/migrate/` contains the migration CLI, staging pipeline, and the committed tree manifest
- `scripts/migrate-site.sh` uses `/Users/val/notes` by default
- contributors can override that default at runtime with `SOURCE_NOTES=/abs/path`
- `make migrate-check` validates and stages output into `.migration/` without
  rewriting `content/`
- `make migrate` rebuilds only the manifest-managed `content/` targets

That default is repo-owned and machine-specific. Override it when running
against a different notes root.

Internally, the migration code is split into planning, note indexing,
attachment resolution, parsing, conversion, staging, and render/report stages
around a small document IR. That keeps path mapping, wiki-link rewriting,
heading handling, callout conversion, asset copying, and Hugo rendering
decoupled instead of living in one large function.

This pipeline is deterministic. It rebuilds managed targets from source notes
instead of trying to preserve prior generated output in place.

Callout-specific migration behavior, including the supported source syntax and
the visual regression page, is documented in
[docs/callouts.md](/Users/val/projects/website/valerytech.github.io/docs/callouts.md).

Operator-facing migration usage lives in
[docs/migration.md](/Users/val/projects/website/valerytech.github.io/docs/migration.md).

Regression coverage is split by purpose:

- `/Users/val/notes/system-design/integrated-test-pages/callouts.md` stays in
  the external notes tree as the manual copy/reference catalog
- `tests/migrate/fixtures/` holds the authoritative automated regression inputs
  for links, headings, unresolved links, and title handling
- `tests/migrate/smoke_notes/` provides one small repo-owned smoke page that is
  imported into the local site for quick visual checks

### CI and deployment

Production hosting is GitHub Pages. Deployments run from GitHub Actions on pushes
to `master`.

- `.github/actions/setup-site/action.yml` loads `.infra/versions.env`
- the action installs the pinned Node version, upgrades npm to the pinned npm
  version, installs the pinned Hugo binary, and runs `npm ci`
- `.github/workflows/ci.yml` validates the build on non-`master` pushes and pull
  requests via `scripts/build-site.sh --host`
- `.github/workflows/deploy.yml` uses the same build wrapper before uploading
  `public/` to GitHub Pages

Netlify is no longer part of the supported deployment path.

The important contract is that local production builds and CI production builds
resolve through the same repo-owned build wrapper, while local preview remains a
separate Hugo server path.

The repo is npm-only. `package.json` declares the supported package manager, and
pnpm-specific config is not part of the supported workflow.

### Build artifacts

`public/` and `resources/` are generated artifacts. They are disposable outputs,
not authoring locations, and should not be tracked in git.

Other disposable local artifacts include `hugo_stats.json` and
`.hugo_build.lock`.

The migration workspace under `.migration/`, including the Docker-managed
`.migration/.venv/` created by `uv`, is also disposable and ignored.
