## Local Runbook

### Source of truth

Edit source files in:

- `content/`
- `layouts/`
- `assets/`
- `config/`

Do not edit generated site output in `public/`.

With `hugo server`, Hugo watches source files for changes, rebuilds the site,
and refreshes the browser. It does not rewrite your source templates or content
files.

### Requirements

- Docker with `docker compose`
- `make`

### Preview

Start the local Hugo server:

```bash
make up
```

The site is served at `http://localhost:1313`.

This is the normal development workflow for editing content and templates. The
server rebuilds automatically when files in `content/`, `layouts/`, `assets/`,
`config/`, and other watched Hugo source directories change.

Underlying command: `docker compose up site`

Stop the preview server:

```bash
make down
```

### Build

Generate the site in the container:

```bash
make build
```

This updates generated output in `public/` and cached generated assets in
`resources/`.

Generated output is local-only. `public/` and `resources/` are not meant to be
committed.

Use this when you want a production-style build or need to inspect generated
output directly. Do not make manual edits in `public/`; they will be replaced by
the next build.

Underlying command: `docker compose run --rm site bash scripts/build-site.sh --inside`

### Verify

Check the local preview and a few core routes:

```bash
make verify
```

Print the Hugo version inside the container:

```bash
make hugo-version
```

Remove generated outputs:

```bash
make clean
```

Run Prettier in the container:

```bash
make format
```

### Devcontainer

The repo includes a devcontainer that uses the same Hugo and Node toolchain as the
Docker workflow. Open the folder in the devcontainer and dependencies will be
installed into a Docker volume instead of the host filesystem.

### Deploy

Production deploys run through GitHub Actions to GitHub Pages when `master` is
updated.
