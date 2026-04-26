## Local Runbook

### Purpose

Use this document for day-to-day local workflows: preview, build, verify, stop,
and clean the site.

### Before you start

- Docker with `docker compose`
- `make`

Host-level Hugo or Node installs are not part of the supported workflow.

### Common workflows

Start the local preview server:

```bash
make up
```

Use this while editing content, templates, or assets. The site is served at
`http://localhost:1313` and Hugo rebuilds automatically when watched source
files change. The local preview is configured with a localhost base URL, so
internal links stay on the local server instead of jumping to production.

Build the site in production mode:

```bash
make build
```

Use this to generate fresh output in `public/` and `resources/`.

Verify the local build and a few core routes:

```bash
make verify
```

Use this when you want a quick confidence check that the site builds and serves
correctly.

Stop the local preview server:

```bash
make down
```

Use this to shut down the local preview stack when you are done.

Remove generated local artifacts:

```bash
make clean
```

Use this to clear disposable outputs such as `public/`, `resources/`, and other
generated local files.

Run the formatter in Docker:

```bash
make format
```

Print the Hugo version from the local container:

```bash
make hugo-version
```

### What to edit

Edit source files in:

- `content/`
- `layouts/`
- `assets/`
- `config/`

Do not edit generated output in `public/` or `resources/`.

For content structure, section layout, and where Markdown should live, see
[docs/architecture.md](/Users/val/projects/website/valerytech.github.io/docs/architecture.md).

### Related docs

- [README.md](/Users/val/projects/website/valerytech.github.io/README.md) for the shortest local quickstart
- [docs/infra.md](/Users/val/projects/website/valerytech.github.io/docs/infra.md) for toolchain, Docker, CI, and deployment details
- [docs/architecture.md](/Users/val/projects/website/valerytech.github.io/docs/architecture.md) for repo structure and content placement rules
