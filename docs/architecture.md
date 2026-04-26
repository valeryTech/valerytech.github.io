# Architecture

This repository is a Hugo site built on top of the Thulite/Doks stack. Most of
the site framework comes from mounted theme modules, while this repo owns the
actual content, local template overrides, and project-specific assets.

## Main Parts

- `content/` is the source of published pages. This is where the main Markdown
  content lives now.
- `config/` defines Hugo behavior such as menus, params, permalinks, and module
  mounts.
- `layouts/` contains local template and partial overrides layered on top of
  the theme-provided layouts.
- `assets/` contains SCSS, JavaScript, and images processed during the build.
- `static/` contains files copied to the final site as-is.
- `public/` and `resources/` are generated output and build artifacts. They are
  not authoring locations.

## Ownership Boundaries

The base site behavior mostly comes from Thulite/Doks modules mounted through
`config/_default/module.toml`. This repo mainly customizes the site in four
places:

- `content/` for authored Markdown
- `config/` for site settings, menus, params, and permalinks
- `layouts/` for local template overrides
- `assets/` for local styling, scripts, and images

If something looks like default theme behavior, check the mounted modules first.
If it looks project-specific, check these local folders.

## Content Structure

All primary Markdown content should live inside this repo under `content/`.
There is no external `notes` folder in the current Hugo setup, and new
publishable material should be placed here directly.

The content tree is organized by section. Current top-level sections include:

- `content/system-design/`
- `content/engineering/`
- `content/projects/`
- `content/blog/`
- `content/topics/`
- `content/english/`

Section landing pages use `_index.md`. Regular pages use `.md` files inside the
section folders. For example:

- `content/system-design/_index.md` renders the section landing page
- `content/system-design/topics/api.md` renders `/system-design/topics/api/`

If material is unfinished, keep it in a local in-repo holding area rather than
outside the site source. The current pattern is a subfolder such as
`content/system-design/to_sort/`.

## Navigation And Routing

Routes are mostly derived from the `content/` tree. Hugo turns folder structure
and filenames into URLs, with some permalink rules coming from
`config/_default/hugo.toml`.

Navigation is a mix of:

- content-driven section structure
- menu entries defined in `config/_default/menus/menus.en.toml`
- local sidebar rendering logic in `layouts/partials/sidebar/`

That means content placement affects both URLs and how sections are surfaced in
the UI.

## Build Flow

Local commands are defined in `package.json`:

- `npm run dev` starts the Hugo dev server
- `npm run build` runs the production Hugo build

During the build, Hugo reads from `content/`, `layouts/`, `assets/`, and
`static/`, then writes the generated site to `public/` and processed artifacts
to `resources/`.

## Practical Rule

When adding or restructuring knowledge-base content:

- put publishable Markdown in `content/`
- group files by subject area inside the repo
- use `_index.md` for section pages
- keep generated files out of `content/`

One config file still points to `content/en`, but the actual authored content in
this repo currently lives under `content/`. Treat `content/` as the source of
truth.
