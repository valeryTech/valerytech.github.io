# Color reference

Shared UI colors are authored in [tokens/colors.css](../assets/css/site/tokens/colors.css).
This page records their implemented values for the [styling guide](styling.md)
and [branding guide](visual-identity.md).
There are two profiles: **Light** and **Dark**. System mode selects one of them.

## Shared UI counts per profile

| Profile | Semantic roles | Distinct solid values | Distinct alpha values | Total distinct values |
| ------- | -------------- | --------------------- | --------------------- | --------------------- |
| Light   | 24             | 14                    | 4                     | 18                    |
| Dark    | 24             | 16                    | 3                     | 19                    |

The 24 roles comprise **10 surfaces, 8 text foregrounds, 1 border, 1 control
accent, and 4 effects**. Aliases count as roles, but repeated values count once.
The two stored link-profile constants select one active `link-color` role.
Transparent resets and upstream component palettes are outside these counts.

## Solid colors

Token names below omit the `--site-` prefix. Aliases name the token that supplies
their value in each profile instead of repeating its color. Derived RGB channels
retain the exact `color-mix()` arithmetic.

| Token                    | Type                          | Light                       | Dark                            |
| ------------------------ | ----------------------------- | --------------------------- | ------------------------------- |
| `page-background`        | Canvas surface                | `#FFFFFF`                   | `#111111` via `--hx-color-dark` |
| `foreground`             | Main text                     | `#0F172A`                   | `#F3F4F6`                       |
| `body-foreground`        | Ordinary body text            | → `foreground`              | `#C7C7C7`                       |
| `heading-foreground`     | Content headings              | → `foreground`              | `#DDDDDD`                       |
| `breadcrumb-background`  | Navigation header surface     | → `context-header`          | → `context-header`              |
| `context-header`         | Navigation header surface     | `#CED9E6`                   | `#1E232F`                       |
| `context-surface`        | Navigation parent surface     | `#EFF2F6`                   | `#141A20`                       |
| `muted`                  | Secondary text                | `#64748B`                   | `#A3A3A3`                       |
| `nav-foreground`         | Panel text                    | → `muted`                   | → `muted`                       |
| `nav-context-foreground` | Filled panel text             | → `link-color`              | → `nav-foreground`              |
| `border`                 | Border                        | `#E2E8F0`                   | `#303030`                       |
| `panel`                  | Supporting surface            | `#F8FAFC`                   | `#171717`                       |
| `accent`                 | Control/focus accent          | `#2563EB`                   | `#93C5FD`                       |
| `link-color`             | Links and selected navigation | `#3C5A7C`                   | `#8FAFCE`                       |
| `nav-selected-surface`   | Current top-level section     | `rgb(231.6 235.2 239.28)`   | `rgb(49.76 58.08 66.14)`        |
| `table-surface`          | Table body surface            | `#F5F7FA`                   | `#1C1C20`                       |
| `table-header`           | Table header surface          | `#DBEAFE`                   | `#263F60`                       |
| `context-foreground`     | Breadcrumb/context text       | → `link-color`              | → `link-color`                  |
| `card-surface`           | Derived card surface          | `rgb(231.12 237.92 250.64)` | `rgb(32.92 36.92 41.4)`         |
| `card-hover`             | Derived hover surface         | `rgb(222.68 231.88 249.96)` | `rgb(37.88 43.88 50.6)`         |

`card-surface` mixes 8% `accent` with 92% `panel`; `card-hover` uses 12% / 88%,
both in sRGB. `nav-foreground` aliases `muted`. `context-foreground` aliases
`link-color`; `nav-context-foreground` uses that link color in Light and the
navigation gray in Dark. `breadcrumb-background` aliases `context-header`,
matching the breadcrumb bar and sidebar hide/show button to top-level navigation
blocks. Table headers retain their separate accent surface.

`nav-selected-surface` mixes `link-color` over `page-background` at 12% in Light
and 26% in Dark. Desktop and mobile top-level links share this persistent fill.
The `nav-state-layer` effect below supplies hover/focus feedback over the current
surface, including the selected fill, without replacing the location cue.

Dark-mode body text uses `body-foreground`, and content headings use
`heading-foreground`. The values above describe the default **Soft** text
brightness profile. **Bright** also brightens the navigation foreground used by
top navigation, sidebar links and group labels, the page outline, the mobile
drawer, and breadcrumb menu group labels. Secondary text and blue links/controls
also brighten, including the breadcrumbs and mobile toolbar:

| Text brightness | Dark body text | Dark headings | Dark menu text | Secondary text | Links and controls |
| --------------- | -------------- | ------------- | -------------- | -------------- | ------------------ |
| Soft            | `#C7C7C7`      | `#DDDDDD`     | `#A3A3A3`      | `#A3A3A3`      | `#8FAFCE`          |
| Bright          | `#E5E5E5`      | `#FFFFFF`     | `#E5E5E5`      | `#C7C7C7`      | `#B7D2EB`          |

Choose the profile under Settings → Reading → Text brightness, or set
`textBrightness.default` in [display.json](../data/ui/display.json) to `soft`
or `bright`. Both profiles retain the shared UI counts above. Links retain
their blue hue, and Light-mode typography retains the theme's defaults.

## Alpha colors and effects

| Token                   | Type                    | Light                    | Dark                     |
| ----------------------- | ----------------------- | ------------------------ | ------------------------ |
| `floating-shadow-color` | Popover shadow          | `rgb(15 23 42 / 20%)`    | `rgb(0 0 0 / 45%)`       |
| `dialog-shadow-color`   | Settings shadow         | `rgb(0 0 0 / 25%)`       | `rgb(0 0 0 / 25%)`       |
| `dialog-backdrop`       | Modal scrim             | `rgb(0 0 0 / 45%)`       | `rgb(0 0 0 / 45%)`       |
| `nav-state-layer`       | Section hover/focus     | `rgb(60 90 124 / 8%)`    | `rgb(143 175 206 / 4%)` |

The floating shadow and dialog scrim share one value in Dark. Shadow geometry
uses the spacing scale. Native scrollbar tracks/thumbs stay hidden; no thumb
color role is retained.

## Standalone legacy pages

[redirect-page.html](../scripts/redirect-page.html) adds four solid roles per
profile. Links use the shared palette above.

| Role           | Light     | Dark      |
| -------------- | --------- | --------- |
| Canvas         | `#F7F9FC` | `#151B25` |
| Text           | `#253044` | `#E2E7EE` |
| Secondary text | `#61708A` | `#A3B1C6` |
| Border         | `#DCE2EC` | `#364153` |

Including these legacy roles, the site-owned CSS palette has **28 roles**
(11 surfaces, 10 foregrounds, 2 borders, 1 control accent, 4 effects), resolving
to **22 distinct values in Light** and **23 in Dark**. Callout and vendor
palettes are listed separately below.

## Other palettes

- Brand marks and favicon tiles reuse `foreground`, `link-color`, and
  `context-header`. The Safari mask is pure black source artwork tinted by its
  link attribute. See [icon assets](visual-identity.md#v-topology-mark-and-icons).
- [Callouts](../data/callouts.json): 5 named schemes plus a fallback, each with
  a background and foreground: **12 roles per profile**. Aliases add no schemes.
  Theme color definitions are in the pinned
  [compiled CSS](../themes/hextra/assets/css/compiled/main.css).
- Search chrome reuses the header, context, panel, text, and effect roles above.
  Shortcut hints are borderless context surfaces.
- Theme controls and their borderless menu use the same header, panel, card,
  navigation text, and link roles.
- Syntax highlighting and diagrams retain their theme/vendor palettes. See [Hextra customization](https://imfing.github.io/hextra/docs/advanced/customization/).
- Proposed surface changes are recorded separately in the
  [visual identity specification](visual-identity.md) and are excluded from current counts.
