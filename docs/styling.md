# Styling guide

The site uses Hextra's compiled CSS plus a small, site-owned CSS bundle. Edit
`assets/css/site/`; Hugo assembles these files through
`layouts/_partials/styles/site.html`, in this order:

| File | Owns |
| --- | --- |
| `tokens.css` | Spacing, type sizes, radii, semantic colors, shared layout geometry |
| `base.css` | Self-hosted fonts, page descriptions, content wrapping |
| `shell.css` | Main gutter, navbar, footer, previous/next links, font control |
| `navigation.css` | Breadcrumbs, section tree, outline, active markers, pinned stacks |
| `components.css` | Cards, callouts, Markdown tables |
| `collections.css` | Homepage grid and section indexes |

The assembled resource keeps the URL `css/custom.css` in local preview. Production
combines it with Hextra's CSS into one minified, fingerprinted stylesheet. There
are no browser-side `@import` requests or additional CSS tools to install.
`assets/scss/common/_custom.scss` is retained from the previous theme and is not
loaded. Do not edit the theme submodule or generated `public/` and `resources/`
files to change the UI.

## Tokens and spacing

Use `--site-*` tokens rather than repeating colors or shared dimensions. The
spacing scale is based on four pixels at the default root font size:

| Token suffix | rem | Default pixels |
| --- | --- | --- |
| `space-1` | 0.25 | 4 |
| `space-2` | 0.5 | 8 |
| `space-3` | 0.75 | 12 |
| `space-4` | 1 | 16 |
| `space-5` | 1.25 | 20 |
| `space-6` | 1.5 | 24 |
| `space-7` | 1.75 | 28 |
| `space-8` | 2 | 32 |
| `space-10` | 2.5 | 40 |
| `space-12` | 3 | 48 |
| `space-16` | 4 | 64 |

Choose a semantic token when several components must move together:

- `content-gutter`: main column padding and the breadcrumb's opaque backing;
  24px below 768px, 48px from 768px.
- `context-gap`: 8px below the top bar and around the breadcrumb card.
- `stack-gap` and `tile-gap`: separate tokens, both 4px; navigation rows and
  table cells can evolve independently.
- `nav-padding-block`, `nav-padding-inline`, and `nav-indent`: shared menu/outline
  rhythm, including 6px row padding and 10px nesting steps.
- `current-marker-width` / `current-marker-gap`: the same 3px marker and 8px
  label gap in both panes.

The left page-link inset is calculated from inline padding, triangle size, and
triangle-to-label gap. Change those inputs rather than adding an unrelated
offset to page links. JavaScript measures wrapping rows; do not hardcode stack
heights.

Use rem for spacing and typography, em for offsets that follow a label's text,
and px for hairlines, focus rings, and browser geometry tolerances. Half steps
are useful for compact controls: the 6px navigation padding and 14px table
padding have explicit component tokens. A one-off dimension such as a grid's
minimum card width can stay with that component. Add a token when a value has a
shared role or is intended to be tuned, rather than naming every number.

## Surfaces and typography

Keep light colors in `:root` and dark overrides in `.dark`. Components consume
semantic colors such as `context-header`, `context-surface`, `table-header`,
`table-surface`, `panel`, `muted`, and `accent`. Derived card and navigation colors
use the same theme tokens, so theme switching updates them together.

- Breadcrumbs and pinned navigation use the darker context palette.
- Callouts and homepage cards use borderless, soft fills. Callout severity colors
  come from the Hextra classes selected by the local shortcode adapter.
- Tables use a brighter header and a uniform body fill. Four-pixel gaps expose
  the page background between rows and columns. Only the four outside corners
  are rounded, including tables without a header or without body rows.
- `radius-lg` (12px) is shared by filled cards, callouts, tables, and navigation
  surfaces. `radius-sm` (4px) is for individual tree links and small controls;
  `radius-md` (8px) is for the mobile outline disclosure.

Use the text-size tokens for UI labels and descriptions. Navigation uses
`text-sm` (14px) and `line-ui` (1.5); descriptions and card titles use `text-lg`
(18px). Body copy and heading typography remain Hextra-owned. System and Jost
fonts must both work, including when a label wraps.

## Cascade and component boundaries

Prefer component classes and logical properties (`padding-inline`,
`margin-block`, logical corner radii). Keep responsive rules next to the
component they modify. Group truly identical rules, but keep separate tokens for
unrelated roles that happen to have the same value today.

Hextra's compiled Tailwind styles are layered; the local bundle is unlayered and
loaded last. Keep that relationship when upgrading the theme. Do not add a new
`@layer` around local styles without reviewing the cascade. The `.content`
qualifier on callouts and tables deliberately beats Hextra's prose selectors.
Use state classes and ARIA attributes for navigation state, and avoid
`!important`, IDs for styling, or broad global element overrides.

Templates own semantics and structure. CSS owns appearance. Inline table-cell
alignment is intentional: it carries each Markdown column's authored alignment.
Navigation JavaScript writes only measured height/offsets and ancestry depth;
colors, spacing, layer values, and compact-viewport policy stay in CSS.

## Sticky layers and responsive behavior

The navbar paints an opaque page background. The sticky breadcrumb wrapper is
also opaque and square, extending across the main gutter; only its inner card
is rounded. Preserve this backing to prevent Safari from showing scrolling
content through corners or gaps.

The breadcrumb uses layer 10 below Hextra's navbar (20). Tree parents use local
layer 100 minus ancestor depth; collection/outline titles use 101. The latter
values live inside their panes' stacking contexts. Do not compare them as global
page layers. `--hextra-navbar-height` remains owned by the theme.

`--site-breadcrumb-height` and `--site-sticky-offset` are runtime pixel
measurements. `--site-sticky-depth` is an integer supplied by the navigation
script. CSS sets `--site-stack-parents` to zero at heights of 500px or less;
the measurement script reads it instead of duplicating the media query.

Keep viewport breakpoints literal because CSS variables cannot be used in native
media queries. These values match the existing layout:

| Boundary | Purpose |
| --- | --- |
| 640px and below | Compact table cell padding |
| 768px and above | Desktop sidebar and wider main gutter |
| 768px to below 1024px | Hide the search shortcut badge so the title fits |
| 1024px and above | Homepage columns and extra search/menu spacing |
| 1280px and above | Right outline replaces the mobile outline disclosure |
| 500px height and below | Pin pane titles, disable ancestor stacking |

Hextra v0.13.0 applies its mobile sidebar rule through 768px inclusively, while
its desktop utilities start at 768px. A narrow local override at that exact
boundary restores the desktop sidebar column. Review it when upgrading Hextra;
the browser suite checks both sides of the boundary.

## Editing and verification

Use two-space indentation, LF endings, and a 100-column target for the site CSS.
The scoped Prettier configuration leaves legacy files alone:

```bash
docker compose exec -T site npm run format:styles
docker compose exec -T site npm run lint:styles
make build
```

CI checks CSS formatting before the production build and runs the navigation
browser suite against the resulting artifact. For layout changes, also run
`npm run test:navigation` against local preview, and repeat with
`BROWSER_ENGINE=webkit` for Safari's engine (installation and screenshot options
are in the [runbook](runbook.md#check-navigation-in-chrome-or-webkit)).

Review light/dark themes and narrow/wide viewports on the homepage, a section
index, a deeply nested article, and the
`/system-design/integrated-test-pages/callouts/` catalog. Check long labels with
both fonts, table overflow and outer corners, current markers, keyboard focus,
and sticky parents while scrolling. Keep focus indicators visible and honor
reduced-motion preferences when adding transitions.
