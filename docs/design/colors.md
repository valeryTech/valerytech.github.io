# Color reference

Shared UI colors are authored in [tokens/colors.css](../../assets/css/site/tokens/colors.css). This page records their implemented values for the [styling guide](styling.md) and [branding guide](visual-identity.md). There are two profiles: **Light** and **Dark**. System mode selects one of them.

## Shared UI counts per profile

| Profile | Semantic roles | Distinct solid values | Distinct alpha values | Total distinct values |
| ------- | -------------- | --------------------- | --------------------- | --------------------- |
| Light   | 24             | 15                    | 3                     | 18                    |
| Dark    | 24             | 14                    | 2                     | 16                    |

The 24 roles comprise **10 surfaces, 9 text foregrounds, 1 border, 1 control accent, and 3 effects**. Aliases count as roles, but repeated values count once. Stored constants select one active `link-color` per profile: the base blue in Light and orange in Dark. The `link-tint` constants keep the blue for Light fills and the brand mark. Transparent resets and upstream component palettes are outside these counts.

## Solid colors

Token names below omit the `--site-` prefix. Aliases name the token that supplies their value in each profile instead of repeating its color. Derived colors are mixed in OKLab and shown as the hex value the browser renders.

| Token                    | Type                          | Light                  | Dark                            |
| ------------------------ | ----------------------------- | ---------------------- | ------------------------------- |
| `page-background`        | Canvas surface                | `#FFFFFF`              | `#262624`                       |
| `foreground`             | Main text                     | `#0F172A`              | `#FAF9F5`                       |
| `body-foreground`        | Ordinary body text            | → `foreground`         | `#C2C0B6`                       |
| `heading-foreground`     | Content headings              | → `foreground`         | `#EBE9E1`                       |
| `context-header`         | Navigation bar surface        | `#CED9E6`              | `#1F1E1D`                       |
| `context-surface`        | Navigation parent surface     | `#EFF2F6`              | `#30302E`                       |
| `muted`                  | Secondary text                | `#64748B`              | `#A6A39A`                       |
| `nav-foreground`         | Panel text                    | → `muted`              | → `muted`                       |
| `nav-context-foreground` | Navigation labels             | → `context-foreground` | → `context-foreground`          |
| `border`                 | Border                        | `#E2E8F0`              | `#3E3E38`                       |
| `panel`                  | Supporting surface            | `#F8FAFC`              | `#1F1E1D`                       |
| `accent`                 | Control/focus accent          | → `link-color`         | `#E8906F`                       |
| `link-color`             | Links and selected navigation | `#3C5A7C`              | `#D97757`                       |
| `nav-selected-surface`   | Current top-level section     | `#E6EAEF`              | `#3A3936`                       |
| `table-surface`          | Table body surface            | `#F5F7FA`              | `#2B2B29`                       |
| `table-header`           | Table header surface          | `#DBEAFE`              | `#3A3936`                       |
| `warning-foreground`     | Status warnings               | `#92400E`              | `#FDE68A`                       |
| `context-foreground`     | Breadcrumb/context text       | → `link-color`         | `#E5E3DA`                       |
| `card-surface`           | Derived card surface          | `#E8ECF1`              | `#2B2B29`                       |
| `card-hover`             | Derived hover surface         | `#E0E6EC`              | `#3A3936`                       |
| `code-surface`           | Code block surface            | `#F3F7FD` (derived)    | `#1F1E1D`                       |

`card-surface` mixes 8% `fill-tint` with 92% `panel`; Light `card-hover` uses 12% / 88%, all derived fills mix in OKLab, which keeps lightness steps even instead of darkening the midpoint as an sRGB mix does. `accent` aliases `link-color` in Light, and Dark sets a lighter orange; it colors every focus ring, hover and current label and the current-item marker, so setting it in the palette editor moves all of them together. Fills (`card-surface`, `card-hover`, `nav-selected-surface`) mix `fill-tint`, which reads the stored blue `link-tint` constant for the profile rather than the editable `link-color`, so an edited link or accent color (white, or a warm preset) never turns them gray or brown. The fills themselves stay editable in the palette. `nav-foreground` aliases `muted`. `context-foreground` aliases `link-color` in Light and is a neutral `#E5E3DA` in Dark; `nav-context-foreground` aliases `context-foreground` in both profiles, so top navigation labels, both pane headings and the breadcrumbs share one color. `context-header` is the one navigation bar surface: the top section bar, the breadcrumbs, the logo, search and toolbar controls, and both pane headings use it, so the palette row "Navigation bars" recolors them together. `context-surface` only backs the round toggles and pinned parent rows nested inside those bars. Table headers retain their separate accent surface.

`page-background` paints the page canvas (`body`) as well as the bar gaps and pinned parent rows that mask content scrolling past, so the palette row "Page background" recolors all of them together.

`code-surface` fills every content code block. Light mixes 5% of Hextra's primary blue over `page-background`, which reproduces the theme's former translucent tint as one solid color, so Light presets with their own page background keep a matching code block. Dark sets `#1F1E1D`, the navigation bar color. The palette row "Code blocks" sets it. Inline code keeps the theme's translucent fill, and syntax colors stay with the theme.

`nav-selected-surface` mixes `fill-tint` over `page-background` at 12% in Light; Dark sets one fixed warm gray, `#3A3936`, for both this fill and `card-hover`. Desktop and mobile top-level links share this persistent fill. Hover and keyboard focus on top-level links, breadcrumbs and their choosers use `card-hover`, the same surface as Browse lists and controls, and replace the selected fill while the pointer is over it. The palette row "Hover surfaces" therefore recolors every hover fill at once.

Dark-mode body text uses `body-foreground`, and content headings use `heading-foreground`. The values above describe the default **Soft** text brightness profile. **Bright** also brightens the navigation foreground used by top navigation, sidebar links and group labels, the page outline, the mobile drawer, and breadcrumb menu group labels. Secondary text also brightens; links keep their orange and navigation labels their `#E5E3DA`:

| Text brightness | Dark body text | Dark headings | Dark menu text | Secondary text | Links and controls |
| --------------- | -------------- | ------------- | -------------- | -------------- | ------------------ |
| Soft            | `#C2C0B6`      | `#EBE9E1`     | `#A6A39A`      | `#A6A39A`      | `#D97757`          |
| Bright          | `#E5E3DA`      | `#FFFFFF`     | `#E5E3DA`      | `#C2C0B6`      | `#D97757`          |

Choose the profile under Settings → Appearance → Text brightness, or set `textBrightness.default` in [display.json](../../data/ui/display.json) to `soft` or `bright`. Both profiles retain the shared UI counts above. Bright also lightens the blue `link-tint` of the header brand mark from `#8FAFCE` to `#B7D2EB`. Article text and section descriptions use `body-foreground`, and content headings use `heading-foreground`, in both profiles; Light body text is therefore `#0F172A` rather than the theme default black.

Visitors can override these roles with Settings → Appearance → Color palette → Edit, which saves them in a cookie and offers the site presets from [palette.json](../../data/ui/palette.json); see [preferences and settings](../frontend.md#preferences-and-settings). Its Copy CSS button produces token blocks for this file. Overrides never change the values recorded here until they are pasted into `tokens/colors.css`.

The **Energetic** preset keeps the site Light colors. In Dark it uses one indigo (`#1A0A53`) for the navigation bars, round-toggle backing and panel, `#D6D6D6` menu text, a red current section (`#B51A00`) and an orange hover (`#D95000`). Round toggles show their rounded square only on hover. White labels reach 6.75:1 on the red and 4.12:1 on the orange.

The default Dark uses warm neutral grays in the style of Anthropic's Claude apps: a `#262624` page, `#1F1E1D` navigation bars, panels and code blocks, `#2B2B29` cards and table bodies, and `#3A3936` for the current section, hover and table header. Links use orange (`#D97757`, 4.86:1 on the page, 4.54:1 on cards) and the accent a lighter orange (`#E8906F`, 4.76:1 on the current section); navigation labels stay neutral (`#E5E3DA`, 12.94:1 on the bars). Every fill is set explicitly, so no blue `fill-tint` shows through. The brand mark keeps its blue `link-tint`.

The **Indigo** preset keeps the site Light colors and restores the previous Dark: a `#111111` page, `#1C1B2F` navigation bars, `#151524` panels, `#272743` for the current section and hover, and white links and navigation labels.

Each text role in the editor shows its WCAG 2 contrast ratio against the surface named in its `contrast` entry in palette.json. Ratios below the minimum (4.5:1 for text) appear in `warning-foreground`. The site defaults pass in both profiles.

## Alpha colors and effects

| Token                   | Type            | Light                 | Dark               |
| ----------------------- | --------------- | --------------------- | ------------------ |
| `floating-shadow-color` | Popover shadow  | `rgb(15 23 42 / 20%)` | `rgb(0 0 0 / 45%)` |
| `dialog-shadow-color`   | Settings shadow | `rgb(0 0 0 / 25%)`    | `rgb(0 0 0 / 25%)` |
| `dialog-backdrop`       | Modal scrim     | `rgb(0 0 0 / 45%)`    | `rgb(0 0 0 / 45%)` |

The floating shadow and dialog scrim share one value in Dark. Shadow geometry uses the spacing scale. Native scrollbar tracks/thumbs stay hidden; no thumb color role is retained. The PDF reader's scrollbar, the one shown, reuses `muted` for its thumb and `foreground` on hover over a transparent track.

The site-owned CSS palette has **24 roles** (10 surfaces, 9 foregrounds, 1 border, 1 control accent, 3 effects), resolving to **18 distinct values in Light** and **16 in Dark**. Callout and vendor palettes are listed separately below.

## Other palettes

- Brand marks reuse `foreground` and `link-tint`. Tab icons sit on a `page-background` tile and app icons on a Dark `context-header` tile. The Safari mask is pure black source artwork tinted by its link attribute. See [icon assets](visual-identity.md#v-topology-mark-and-icons).
- [Callouts](../../data/callouts.json): 5 named schemes plus a fallback, each with a background and foreground: **12 roles per profile**. Aliases add no schemes. Light uses the Hextra classes listed there. Dark replaces them with warm roles in `tokens/colors.css`: each surface mixes a muted hue into `page-background` (info `#6A9BCC` 16%, tip `#788C5D` 18%, warning and fallback `#D97757` 16%, error `#C4524A` 18%, important `#9B87C4` 16%) under a light tinted text color, all near 15:1. The callout shortcode adds a `site-callout-<kind>` class for this. Links inside Dark callouts use `accent` (`#E8906F`, at least 4.96:1 on every callout surface), because `link-color` drops to about 3.9:1 there. Theme color definitions are in the pinned [compiled CSS](../../themes/hextra/assets/css/compiled/main.css).
- Search chrome reuses the header, context, panel, text, and effect roles above. Shortcut hints are borderless context surfaces.
- Theme controls and their borderless menu use the same header, panel, card, navigation text, and link roles.
- The PDF reader's Sepia page colors are scoped to `.site-pdf-reader`: `pdf-reader-sepia-background` `#F4ECD8` and `pdf-reader-sepia-foreground` `#5B4636`, the same in both profiles. Its Site theme mode reuses `page-background` and `body-foreground`.
- Syntax highlighting and diagrams retain their theme/vendor palettes. See [Hextra customization](https://imfing.github.io/hextra/docs/advanced/customization/).
- Proposed surface changes are recorded separately in the [visual identity specification](visual-identity.md) and are excluded from current counts.
