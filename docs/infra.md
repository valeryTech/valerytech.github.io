## Infrastructure

### Deployment model

- Production hosting is GitHub Pages.
- Deployments run from GitHub Actions on pushes to `master`.
- Netlify is no longer part of the supported deployment path.

### Toolchain source of truth

Pinned versions live in `.infra/versions.env`.

- `NODE_VERSION` is used by GitHub Actions and the local container image.
- `HUGO_VERSION` is used by GitHub Actions and the local container image.

This keeps local builds and Pages deploys on the same toolchain.

### Local execution

Local work is isolated through Docker:

- `compose.yaml` runs the Hugo dev server
- the devcontainer uses the same Dockerfile and dependency bootstrap logic
- `.devcontainer/dev-entrypoint.sh` keeps `node_modules` in sync with
  `package-lock.json`

### Build artifacts

- `content/`, `layouts/`, `assets/`, `static/`, and `config/` are source inputs
- `public/` is generated site output
- `resources/` is Hugo generated asset/cache output

`public/` and `resources/` are build artifacts and should not be tracked in git.
