## Infrastructure

### Build model

This site is built by Hugo, with Node/npm providing the frontend dependency layer
used by the theme and asset pipeline. The command boundary is:

- `make` for repo and local infrastructure tasks
- `npm` for app-level Hugo tasks
- Docker/devcontainer for local execution

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

- `NODE_VERSION=20.11.0`
- `HUGO_VERSION=0.144.1`

That file is the source of truth for both local containers and GitHub Actions, so
the local preview/build path and the production deploy path run on the same Hugo
and Node versions.

### Local infrastructure

Local work is isolated in Docker. Host-level Hugo or Node installation is not part
of the supported workflow.

- `Makefile` is the primary contributor-facing entrypoint
- `compose.yaml` builds the image from `.devcontainer/Dockerfile`
- the `site` service runs `npm run dev -- --bind=0.0.0.0`
- the repo is bind-mounted into `/workspace`
- `node_modules` lives in the named Docker volume `valerytech-node-modules`

`.devcontainer/Dockerfile` installs the pinned Node and Hugo versions into the
image. `.devcontainer/dev-entrypoint.sh` is the bootstrap guard for local runs: it
hashes `package-lock.json`, runs `npm ci` when dependencies are missing or stale,
then starts the requested command.

Repo-owned scripts hold reusable task logic:

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
- the action installs the pinned Node version, installs the pinned Hugo binary, and
  runs `npm ci`
- `.github/workflows/ci.yml` validates the build on non-`master` pushes and pull
  requests via `scripts/build-site.sh --host`
- `.github/workflows/deploy.yml` uses the same build wrapper before uploading
  `public/` to GitHub Pages

Netlify is no longer part of the supported deployment path.

### Build artifacts

`public/` and `resources/` are generated artifacts. They are disposable outputs,
not authoring locations, and should not be tracked in git.
