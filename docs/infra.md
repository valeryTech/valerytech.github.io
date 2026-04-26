## Infrastructure

### Purpose

This document describes the repo's build and execution contract: which command
layer contributors use, how local preview runs, and how the same build path is
reused in CI and GitHub Pages deployment.

### Command model

This site is built by Hugo, with Node/npm providing the frontend dependency
layer used by the theme and asset pipeline.

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

The app-level entrypoints remain:

- `npm run dev`
- `npm run build`
- `npm run format`
- `npm run create`

The main authored inputs are `content/`, `layouts/`, `assets/`, `static/`, and
`config/`. Hugo writes the generated site to `public/` and generated asset/cache
data to `resources/`.

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
the image. `.devcontainer/dev-entrypoint.sh` is the bootstrap guard for local runs:
it hashes `package-lock.json`, runs `npm ci` when dependencies are missing or stale,
then starts the requested command.

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

The devcontainer reuses the same Dockerfile, workspace mount, and bootstrap logic,
so opening the repo in a devcontainer and running `docker compose` use the same
runtime contract.

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
