# Architecture

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
| `.generated/`                          | Assembled maps, redirects, and local review artifacts                     |
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
visual contracts and exact palettes are in [styling.md](styling.md) and
[colors.md](colors.md). The local head override must be reviewed against upstream
when changing the theme submodule.

## Routing and generated maps

Menus come from `config/_default/menus/`; sidebar structure follows content and
site-owned child grouping. Section links retain their own landing pages.
`site-map.mjs` assembles the public agent maps and invokes redirect preparation.

`data/url-history.json` records published addresses from content/config commits.
`data/redirects.json` supplies reviewed replacements; generated redirects preserve
old GitHub Pages paths. One replacement redirects automatically; several offer a
choice. Missing decisions and broken internal destinations stop the build.
See [legacy-url-redirects.md](legacy-url-redirects.md).

## Workflows

Use [runbook.md](runbook.md) for authoring/import commands,
[infra.md](infra.md) for Docker, CI, and deployment, and
[callouts.md](callouts.md) for the migration-specific callout contract.
