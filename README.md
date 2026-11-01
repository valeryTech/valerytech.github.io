# valery.tech

Source for [valery.tech](https://valery.tech), Valery Yuda's public notes on
evaluating AI systems, designing applications with language models, software
engineering and system design. Most articles are imported from a private
Markdown notes vault; the rest are written here. The site is built with
[Hugo](https://gohugo.io/) and the [Hextra](https://imfing.github.io/hextra/)
theme and deployed to GitHub Pages.

## Quickstart

Everything runs in Docker; the host needs only Docker, `git` and
[Task](https://taskfile.dev/).

```bash
task repo:init
```

```bash
task site:up
```

`task repo:init` checks out the theme, builds the toolchain image and checks the
host. `task site:up` imports the latest notes and serves the preview at
`http://localhost:1313`. `task` lists the other tasks.

## Documentation

- [Runbook](docs/runbook.md): setup, commands, checks, note imports and upgrades
- [Architecture](docs/architecture.md): what the site is and which files own what
- [Infrastructure](docs/infra.md): Docker image, build pipeline, CI and deployment
- [Frontend](docs/frontend.md): UI modules, configuration and behavior
- [Design guides](docs/design/README.md): brand and style guides, read before
  changing UI: [visual identity](docs/design/visual-identity.md),
  [styling](docs/design/styling.md) and [colors](docs/design/colors.md)
- [Dependencies](docs/dependencies.md): version authorities and upgrade notes
- [Page titles](docs/titles.md): how to write `title` and `linkTitle`
- [Analytics](docs/analytics.md)
- [AGENTS.md](AGENTS.md): rules for coding agents working in this repository
