# Knowledge Base Publishing System

This repository is the system that transforms, previews, builds, and deploys a
Markdown-based knowledge base. It is a Hugo site built on the Thulite/Doks
stack, with the content tree in-repo under `content/`.

The main source inputs are:

- `content/` for authored Markdown
- `layouts/`, `config/`, and `assets/` for local presentation and build behavior

Generated output such as `public/` and `resources/` is disposable build
artifact, not an authoring surface.

## Local workflow

Local work runs in Docker, with `make` as the main contributor entrypoint. You
do not need a system-wide Hugo or Node installation.

Preview locally:

```bash
make up
```

Build the site:

```bash
make build
```

Production deploys run through GitHub Actions to GitHub Pages for `valery.tech`.

For more detail:

- [docs/runbook.md](/Users/val/projects/website/valerytech.github.io/docs/runbook.md) for local workflows
- [docs/migration.md](/Users/val/projects/website/valerytech.github.io/docs/migration.md) for the external-notes migration workflow
- [docs/infra.md](/Users/val/projects/website/valerytech.github.io/docs/infra.md) for Docker, toolchain, CI, and deployment
- [docs/architecture.md](/Users/val/projects/website/valerytech.github.io/docs/architecture.md) for repo structure and content placement
