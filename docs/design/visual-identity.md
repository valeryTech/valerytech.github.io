# Visual identity specification

**Current palette:** [Color reference](colors.md#solid-colors), including exact values,
role types, aliases, and counts for both profiles. Color names in this guide refer
to the shared palette in [tokens/colors.css](../../assets/css/site/tokens/colors.css).

## Decisions in use

- Links and selected navigation are blue in Light and white in Dark; fills behind
  them keep the blue tint in both. Ordinary panel labels are gray.
- Current top-level sections use a persistent tonal inset in both the header and
  mobile menu; hover and focus use the shared `card-hover` surface.
- The top section bar, breadcrumbs, toolbar controls and both pane headings share
  one `context-header` surface.
- Filled panel text uses darker blue in Light and gray in Dark.
- Surfaces, text, controls, and effects have separate semantic roles.
- Navigation uses IBM Plex Sans at 14px for breadcrumbs, the top section bar,
  and both side menus. Article text and headings use system sans-serif by default,
  with optional Jost; [reading-font configuration](../../data/ui/fonts.json) owns
  those choices. The [styling guide](styling.md) records the navigation tokens.
- Component layout and shapes follow the [styling guide](styling.md).
- Code blocks and inline code use IBM Plex Mono, alongside Plex Sans navigation.

## Proposed surface palette

These three surface pairs are **not applied** to the current site.

| Role                                      | Light     | Dark      |
| ----------------------------------------- | --------- | --------- |
| Base canvas                               | `#FFFFFF` | `#181818` |
| Primary accent: breadcrumbs/table headers | `#DAE9FE` | `#2A4160` |
| Secondary surface: neutral cards          | `#F3F4F6` | `#242424` |

Base and primary colors come from the
[shared identity proposal](https://chatgpt.com/share/6ae735bc-db40-83e9-b714-5a0516457fc6).
Neutral card colors remain a proposal. Review text/surface pairings when applying
them; the control accent is a foreground role, not a background fill.

## V topology mark and icons

The selected **C — V topology** direction comes from the
[branding discussion](https://chatgpt.com/share/6ae735bc-db40-83e9-b714-5a0516457fc6).
[v-mark.svg](../../assets/branding/v-mark.svg) is the geometry source: two paths,
three circular endpoints, a 100-unit viewBox. Keep their proportions together.
The header uses a 32px mark with equal padding in a filled 48px Home tile; the full site name stays
in its accessible label and tooltip. `navbar.displayLogo` controls the mark;
`navbar.displayTitle` can restore the optional wordmark and is off by default.

The mark reuses `foreground` and the blue `fill-tint`. The mark adds no palette
roles. Header colors follow the selected site theme. Browser tab and bookmark
icons use the Light palette in every theme: the dark V on a white
`page-background` badge with rounded corners. SVG, PNG, and ICO share that
treatment, so the icon stays legible on light and dark tab bars whichever format
the browser chooses or caches, and with custom browser themes that differ from
the system's reported color scheme. Touch and home-screen icons use the Dark
palette instead: a light V on an opaque square Dark `context-header` canvas.

| Use                    | Published assets                                                                 |
| ---------------------- | -------------------------------------------------------------------------------- |
| Transparent marks      | `/branding/mark-light.svg`, `/branding/mark-dark.svg`                            |
| Browser tabs/bookmarks | `/favicon.svg`; 16, 32, 48px PNGs and multi-size ICO                             |
| Apple touch            | `/apple-touch-icon.png`, 180px with an opaque square canvas                      |
| Safari pinned tabs     | `/mask-icon.svg`, monochrome, with the light link accent                         |
| Home-screen icons      | Opaque 192/512px icons and a separate 512px maskable icon in `/site.webmanifest` |

Run `npm run build:icons` after changing the geometry, relevant palette tokens,
or site title. This optional authoring command needs `rsvg-convert` and
ImageMagick `magick`, which the site image lacks; add them in a throwaway
container:

```bash
docker compose run --rm --user root site sh -c 'apt-get update -qq && apt-get install -y -qq librsvg2-bin imagemagick && (command -v magick || ln -s "$(command -v convert)" /usr/local/bin/magick) && npm run build:icons'
```

It derives the palette from
`tokens/colors.css` and writes `static/` assets; commit those outputs with the source.
Hugo and CI serve the generated files without those tools. The favicon partial
adds a content version to icon URLs; manifest icon URLs are versioned too, so
updates can refresh cached tab and home-screen images.

Touch icons leave corner masking to the OS. The maskable variant keeps the mark
inside the central safe circle. See Apple's
[pinned-tab requirements](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/pinnedTabs/pinnedTabs.html)
and the [manifest icon reference](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons).

Further wordmark treatments and the proposed surface palette remain open.
