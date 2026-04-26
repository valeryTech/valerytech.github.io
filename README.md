# System Design and Architecture

Knowledge Base for ML, AI and related topics.

## Local workflow

This repo uses Docker for local builds and preview so you do not need a system-wide
Hugo install.

### Preview

```bash
docker compose up site
```

### Build

```bash
docker compose run --rm site npm run build
```

Deployments run through GitHub Actions to GitHub Pages on pushes to `master`.

More commands and infra details are in [docs/runbook.md](/Users/val/projects/website/valerytech.github.io/docs/runbook.md) and [docs/infra.md](/Users/val/projects/website/valerytech.github.io/docs/infra.md).
