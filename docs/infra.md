# Infrastructure

### Purpose

This document describes the repo's build and execution contract: which command layer contributors use, how local preview runs, and how the same build path is reused in CI and GitHub Pages deployment.

### Command model

This site is built by Hugo with the pinned Hextra Git submodule. Node/npm provides analytics libraries, self-hosted search/math/font assets, and build scripts. Hextra ships compiled CSS, so local builds do not compile Tailwind or Bootstrap.

The repo also includes a small Python subsystem for content migration, isolated with `uv` in the same container.

The command layers are:

- [Task](https://taskfile.dev/) on the host, the only contributor entrypoint; `Taskfile.yml` groups tasks into `repo:`, `docker:`, `site:`, `content:` and `quality:` namespaces, and each wraps `docker compose run` or `exec`
- npm scripts in `package.json`, which run Hugo, Prettier, Node tests and the map script inside the container
- the `site` service image, shared by Compose and the devcontainer

The main authored inputs are `content/`, `layouts/`, `assets/`, `static/`, and `config/`. Hugo writes the generated site to `public/` and generated asset/cache data to `resources/`.

Some `content/` subtrees are regenerated from external notes instead of being edited directly. The committed migration manifest in `scripts/migrate/config.toml` defines which sections are managed that way.

Contributor-facing command usage lives in the [runbook](runbook.md).

### Shared toolchain

The [dependency update record](dependencies.md) lists the current package/action upgrades, compatibility decisions, and verification commands.

[.infra/versions.env](../.infra/versions.env) pins Node, npm, Hugo, Dart Sass, `uv`, the `n` Node installer and the Playwright browser. It is the source of truth for both the image and GitHub Actions, so local and deployed builds run the same Hugo, Node, npm and Dart Sass versions.

### Local runtime

Local work is isolated in Docker; nothing is installed on the host.

- `Taskfile.yml` is the contributor-facing entrypoint
- `task site:up` completes migration and agent-map regeneration before starting preview
- `compose.yaml` builds the image from `.devcontainer/Dockerfile`
- the `site` service runs `npm run dev -- --bind=0.0.0.0`
- the repo is bind-mounted into `/workspace`
- `node_modules` lives in the named Docker volume `valerytech-node-modules`; the host directory is only its empty mount point
- `UV_PROJECT_ENVIRONMENT` places the migration environment in the `valerytech-uv-venv` volume at `/opt/uv-venv`, outside the checkout, and `PYTHONDONTWRITEBYTECODE` keeps `__pycache__` out of the checkout
- `BROWSER_CHANNEL=chromium` selects the image's Playwright Chromium
- `HUGO_MEMORYLIMIT=2` caps Hugo's cache at 2 GB; without it the preview server grew to 9.6 GB of RAM after 6 hours of rebuilds

The dev command sets `--baseURL=http://localhost:1313/`, so local preview renders internal links against localhost instead of the production domain. `PREVIEW_BASE_URL` in `.env` overrides it for LAN access; see the [runbook](runbook.md#preview).

`.devcontainer/Dockerfile` installs the pinned Node, npm, Hugo, and Dart Sass versions into the image. It also installs `uv` for the migration pipeline and Playwright's Chromium with its system libraries for the navigation checks. The container includes `libatomic1`, required by the Node 26 Linux binaries. `.devcontainer/dev-entrypoint.sh` is the bootstrap guard for local runs: it hashes `package-lock.json`, runs `npm ci` when dependencies are missing or stale, then starts the requested command.

That yields a live local server at `http://localhost:1313` with Hugo file watching enabled for mounted source files.

Production builds use `resources/production/` for generated resources, while preview uses `resources/`. This keeps production garbage collection from deleting stylesheet files that the running preview has cached.

The theme is pinned to Hextra v0.13.0 under `themes/hextra/`. Initialize it with `git submodule update --init --recursive`; CI and deployment use recursive submodule checkout. `layouts/_partials/styles/site.html` assembles the ordered `assets/css/site/` modules into one local CSS resource. Hextra's compiled CSS is combined with that resource and fingerprinted in production. Formatting and UI conventions are described in the [styling guide](design/styling.md). Dart Sass remains available in the shared toolchain but is not used by the Hextra build.

FlexSearch comes from the local npm package, and KaTeX styles/fonts and Jost fonts are mounted into the published site. These features do not require build-time CDN downloads. Mermaid retains Hextra's standard optional loader.

Keep the local KaTeX package aligned with Hugo's embedded renderer: Hugo 0.169.0 embeds KaTeX 0.18.4, so that exact stylesheet/font package is pinned even while newer standalone KaTeX releases exist. See the [Hugo math documentation](https://gohugo.io/functions/transform/tomath/).

### Repo task scripts

Repo-owned scripts hold reusable task logic instead of embedding longer logic in `Taskfile.yml` or CI workflows:

- `scripts/build-site.sh` is the shared production build wrapper; it also builds the migration test pages into `.generated/fixture-site/` and runs the publication, SEO, agent-map and theme tests
- `scripts/verify-site.sh` builds the site, starts preview if needed, and checks core routes
- `scripts/clean-generated.sh` removes disposable generated outputs
- `scripts/check-host.sh` backs `task repo:doctor`: it checks host prerequisites and reports, or with `--fix` removes, host installs in the checkout
- `scripts/migrate-site.sh` runs the Docker-wrapped migration entrypoint
- `scripts/site-map.mjs` assembles generated Markdown for the eight HTML navigation maps after migration and before npm preview/build; it uses the existing Node and Hugo toolchain, including on CI

The devcontainer reuses the same Dockerfile, workspace mount, and bootstrap logic, so opening the repo in a devcontainer and running `docker compose` use the same runtime contract.

### Migration pipeline

The migration path is Docker-first:

- `pyproject.toml` and `uv.lock` define the Python environment
- `scripts/migrate/` contains the migration CLI, staging pipeline, and the committed tree manifest
- `scripts/migrate-site.sh` provides the bridge from Docker to the external notes source and the managed `content/` targets

Internally, the migration code is split into planning, note indexing, attachment resolution, parsing, conversion, staging, and render/report stages around a small document IR. That keeps path mapping, wiki-link rewriting, heading handling, callout conversion, asset copying, and Hugo rendering decoupled instead of living in one large function.

This pipeline is deterministic. It rebuilds managed targets from source notes instead of trying to preserve prior generated output in place.

Operator-facing migration usage lives in [the runbook](runbook.md#migration). Callout-specific migration behavior lives in [callouts.md](callouts.md).

### CI and deployment

Production hosting is GitHub Pages. Deployments run from GitHub Actions on pushes to `master`.

- `.github/actions/setup-site/action.yml` loads `.infra/versions.env`
- the action installs the pinned Node version, upgrades npm to the pinned npm version, installs the pinned Hugo and Dart Sass binaries, and runs `npm ci`
- `.github/workflows/ci.yml` validates the build on non-`master` pushes and pull requests via `scripts/build-site.sh --host`
- CI runs `npm run lint:styles` to check the site CSS formatting
- after the build, CI installs Playwright's Chromium and runs the navigation browser tests against Vite's preview of the minified `public/` artifact; the migration test pages, which production leaves out, come from a second preview of `.generated/fixture-site/`
- failed CI runs retain navigation screenshots as a downloadable artifact
- `.github/workflows/deploy.yml` uses the same build wrapper before uploading `public/` to GitHub Pages

Netlify is no longer part of the supported deployment path.

The important contract is that local production builds and CI production builds resolve through the same repo-owned build wrapper, while local preview remains a separate Hugo server path.

The repo is npm-only. `package.json` declares the supported package manager, and pnpm-specific config is not part of the supported workflow.

### Navigation checks

`task quality:test:navigation` runs `npm run test:navigation` in the preview container, using Playwright Core and the image's Chromium against `BASE_URL` (default `http://localhost:1313`). These browser checks cover the current page and its ancestors in the section menu, nested H1–H6 outlines, scroll highlighting, direct heading links, active-outline visibility, and mobile/tablet navigation. They also check short and deep breadcrumb trails and all ten imported callout styles in light, dark, desktop, and mobile layouts. Set `BROWSER_ENGINE=webkit` after installing WebKit in the container (see the runbook) to check the Safari rendering engine. An image-based occlusion check catches page content showing through the top bar or around rounded breadcrumb corners during scrolling. The static route checks in `task site:verify` remain independent of browser installation.

The page outline uses Hugo's `TableOfContents`, preserving its nested lists and the configured heading range. `assets/js/core/toc-scroll.js` overrides Hextra's observer with an empty shim. The bundled `assets/js/navigation/outline.mjs` supplies reading-position behavior, ancestor highlights, and automatic outline scrolling. Explicit hash destinations remain selected at their scroll margin. Smaller screens expose the same outline in an accessible “On this page” disclosure. Local CSS also marks the section-menu ancestor path.

An optional `REFERENCE_URL=https://valery.tech` compares heading targets and ancestor paths with the deployed site. This is a manual migration check; CI checks the local artifact so a later production content change cannot make an unrelated branch fail. See the runbook for commands.

### Build artifacts

`public/` and `resources/` are generated artifacts. They are disposable outputs, not authoring locations, and should not be tracked in git.

Other disposable local artifacts include `hugo_stats.json` and `.hugo_build.lock`.

The migration workspace under `.migration/` (staged output and reports) is also disposable and ignored. Installed state lives in the `valerytech-node-modules` and `valerytech-uv-venv` volumes; `task docker:reset` deletes both.
