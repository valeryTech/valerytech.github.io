# Architecture

## Product

[valery.tech](https://valery.tech) ("Systems & Engineering") publishes Valery
Yuda's working notes on how people, software, data and AI work together: how AI
systems are evaluated, how applications are designed around language models, and
the engineering and system design underneath.

- **Collections:** AI, AI Engineering (with Evaluation), Engineering, System
  Design and Projects hold the articles. Research, Blog and Topics hold
  repo-authored material, alongside the About, Content Use, Privacy and Settings
  pages.
- **Readers:** people browse with section menus, page outlines, search and saved
  reading preferences (theme, font, text size, breadcrumbs and pane layout). Agents get HTML agent maps and
  `llms.txt` summaries of every collection.
- **Publishing:** most articles are written in a private Markdown vault and
  imported by the migration pipeline. Moved addresses land on a 404 page
  that points to the matching collection, and PostHog and Clarity measure reading.

## Implementation

The site combines a pinned Hextra theme with local presentation, migration,
URL preservation, search assets, SEO, and analytics. Generic theme behavior is
documented by [Hextra](https://imfing.github.io/hextra/docs/).

## Source ownership

| Area                                   | Local contract                                                            |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `content/`                             | Hugo input; direct-authored files coexist with migration-managed subtrees |
| `scripts/migrate/config.toml`          | Canonical imported sources, targets, and subtree exclusions               |
| `layouts/`                             | Site-owned head, navigation, content, and shortcode adapters              |
| `assets/css/site/`                     | Active CSS modules; legacy SCSS is unused                                 |
| `assets/js/`                           | Feature composition, saved preferences, and analytics                     |
| `config/_default/module.toml`          | Theme, vendor, attachment, and generated-content mounts                   |
| `.generated/`                          | Assembled maps and local review artifacts                                 |
| `public/`, `resources/`, `.migration/` | Disposable outputs and caches                                             |

Edit managed Markdown in its configured external source, then migrate. Keep
repo-owned research pages and other excluded material out of managed targets;
read the manifest for the exact current list. A trailing `/**` exclusion covers
nested attachments as well as documents.

## Presentation and content

Local callout/card/figure adapters preserve importer syntax and attachment URLs.
Markdown tables retain native cells/alignment in a keyboard-scrollable wrapper.
Search, KaTeX, and optional Jost assets are served locally.

Page descriptions stay in metadata rather than appearing beneath rendered titles.
Site-owned SEO precedence and validation live in the head adapters, independently
of theme defaults.

The UI module/configuration boundary is documented in [frontend.md](frontend.md);
visual contracts and exact palettes are in [styling.md](design/styling.md) and
[colors.md](design/colors.md). The local head override must be reviewed against upstream
when changing the theme submodule.

## Routing and generated maps

Menus come from `config/_default/menus/`; sidebar structure follows content and
site-owned child grouping. Section links retain their own landing pages.
`site-map.mjs` assembles the public agent maps.

There is no per-URL redirect map. Hugo `aliases` cover deliberate renames; any
other old address gets `layouts/404.html`, which lists the main collections and
highlights the one matching the first path segment. See
[frontend.md](frontend.md#not-found-page).

## Workflows

Use [runbook.md](runbook.md) for authoring/import commands,
[infra.md](infra.md) for Docker, CI, and deployment, and
[callouts.md](callouts.md) for the migration-specific callout contract.
