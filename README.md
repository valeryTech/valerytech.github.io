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

This runs `make migrate` first to import the latest notes and refresh the agent
maps, then starts the preview. If migration fails, preview startup stops.

Build the site:

```bash
make build
```

Production deploys run through GitHub Actions to GitHub Pages for `valery.tech`.

Migration and builds generate [legacy URL redirects](docs/legacy-url-redirects.md)
for reviewed production 404 visits. Missing coverage and broken internal links
stop the build; unvisited historical URLs need no mapping.

For more detail:

- [Public agent map](https://valery.tech/agent-map/) for a short HTML index and selected documents; five collection maps list all articles grouped by subsection. `make migrate` assembles their Markdown sources, then Hugo renders the HTML during preview or build. Builds also refresh the sources automatically.
- [docs/runbook.md](docs/runbook.md) for local workflows and note imports
- [docs/infra.md](docs/infra.md) for Docker, toolchain, CI, and deployment
- [docs/architecture.md](docs/architecture.md) for repo structure and content placement
