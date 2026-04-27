# Local Runbook

## Purpose

Use this document for day-to-day local work on the site: preview, build,
verify, stop, and reset the local environment.

## Before You Start

- Docker with `docker compose`
- `make`

Host-level Hugo, Node, npm, or Python package installs are not part of the
supported workflow.

## Common Workflows

Start the local preview server:

```bash
make up
```

Use this while editing content, templates, config, or assets. The site is
served at `http://localhost:1313`, Hugo rebuilds watched files automatically,
and local links stay on localhost instead of jumping to production.

Build the site in production mode:

```bash
make build
```

Use this to regenerate `public/` and `resources/` the same way CI and GitHub
Pages do.

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

## What To Edit

Edit source files in:

- `content/`
- `layouts/`
- `assets/`
- `config/`

Do not edit generated output in `public/` or `resources/`.

These `content/` sections are migration-managed:

- `content/system-design/`
- `content/engineering/`
- `content/ai-engineering/`
- `content/projects/`

For those sections, edit the external notes source instead of the generated
files in `content/`. The migration workflow is documented in
[docs/migration.md](/Users/val/projects/website/valerytech.github.io/docs/migration.md).

For repo structure, section ownership, and content placement rules, see
[docs/architecture.md](/Users/val/projects/website/valerytech.github.io/docs/architecture.md).

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
- use the migration workflow in
  [docs/migration.md](/Users/val/projects/website/valerytech.github.io/docs/migration.md)

## Related Docs

- [README.md](/Users/val/projects/website/valerytech.github.io/README.md) for the shortest quickstart
- [docs/migration.md](/Users/val/projects/website/valerytech.github.io/docs/migration.md) for the external-notes workflow
- [docs/infra.md](/Users/val/projects/website/valerytech.github.io/docs/infra.md) for toolchain, Docker, CI, and deployment
- [docs/architecture.md](/Users/val/projects/website/valerytech.github.io/docs/architecture.md) for repo structure and content placement
