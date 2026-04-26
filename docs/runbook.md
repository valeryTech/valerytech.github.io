## Local Runbook

### Requirements

- Docker with `docker compose`

### Preview

Start the local Hugo server:

```bash
docker compose up site
```

The site is served at `http://localhost:1313`.

Stop the preview server:

```bash
docker compose down
```

### Build

Generate the site in the container:

```bash
docker compose run --rm site npm run build
```

This updates generated output in `public/` and cached generated assets in
`resources/`.

Generated output is local-only. `public/` and `resources/` are not meant to be
committed.

### Verify

Check the Hugo version inside the container:

```bash
docker compose run --rm site hugo version
```

If you are running inside another container or do not have direct access to the host
browser, verify the server from inside the running service:

```bash
docker compose exec -T site wget -S --spider http://127.0.0.1:1313/
```

### Devcontainer

The repo includes a devcontainer that uses the same Hugo and Node toolchain as the
Docker workflow. Open the folder in the devcontainer and dependencies will be
installed into a Docker volume instead of the host filesystem.

### Deploy

Production deploys run through GitHub Actions to GitHub Pages when `master` is
updated.
