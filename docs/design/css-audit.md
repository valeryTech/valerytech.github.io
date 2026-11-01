# CSS audit and refactor

Reviewed the active `assets/css/site/` bundle, Hugo assembly, generated
configuration, JavaScript property reads/writes, alias-redirect palette, and icon
authoring consumer. Legacy `assets/scss/` is outside the active bundle.

## Unused and redundant values

Removed three properties with no consumers:

- `--site-bottom-control-background`
- `--site-bottom-control-foreground`
- `--site-pane-label-guide`

Removed `--site-scrollbar-thumb` and its search-result `scrollbar-color` rule:
native scrollbar chrome is hidden throughout the site. The color reference now
counts the remaining palette roles.

Removed the unassigned `--site-surface-inset-start` fallback. Shared controls
already use `--site-surface-inset`; the trailing inset remains a supported local
override. Removed the duplicate `.page-nav-title` declarations because its
existing `.site-control-label` class supplies the same layout.

## Canonical values

These aliases had no independent overrides. Their consumers now use the value
that owns the actual policy:

| Retired property                    | Canonical property              |
| ----------------------------------- | ------------------------------- |
| `--site-group-gap`                  | `--site-layout-gap`             |
| `--site-header-gap`                 | `--site-layout-gap`             |
| `--site-shell-gutter`               | `--site-layout-gap`             |
| `--site-context-gap`                | `--site-layout-gap`             |
| `--site-context-content-gap`        | `--site-layout-gap`             |
| `--site-pane-controls-padding`      | `--site-layout-gap`             |
| `--site-control-min-height`         | `--site-control-height`         |
| `--site-control-text-size`          | `--site-navigation-text-size`   |
| `--site-control-padding-inline-end` | `--site-control-padding-inline` |
| `--site-header-item-inset`          | `--site-space-2`                |

Palette aliases such as context/control foregrounds and backgrounds remain:
they describe different visual roles. Pane gutters, surface insets, and
header button dimensions retain their actual component overrides.

## Names and ownership

| Previous name                    | Current name                      | Reason                                                                      |
| -------------------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| `--site-header-control-height`   | `--site-header-button-width`      | It sizes button widths; their height uses `--site-control-height`.          |
| `--site-current-marker-width`    | `--site-nav-current-marker-width` | Identifies the shared tree/outline marker.                                  |
| `--site-current-marker-gap`      | `--site-nav-current-marker-gap`   | Keeps that marker's related values together.                                |
| `--site-nav-section-marker-size` | `--site-nav-chevron-size`         | Names the chevron shape, shared by sidebar, breadcrumbs, and browse groups. |
| `--site-nav-section-marker-gap`  | `--site-nav-chevron-gap`          | Describes the label spacing around that chevron.                            |
| `--site-tile-gap`                | `--site-table-cell-gap`           | Only table cells consume it.                                                |
| `--site-table-padding-block`     | `--site-table-cell-padding-block` | Distinguishes cell padding from table margins.                              |

Breadcrumb chooser bounds, Settings maximum width, table cell geometry, and
brand-mark size now live with their owning components. Their numerical values
are unchanged.

The old `tokens.css` source is split into `tokens/scale.css`, `tokens/colors.css`,
and `tokens/geometry.css`. `styles/tokens.html` assembles them into one Hugo
resource before generated configuration. There are no runtime CSS imports.
Hugo alias pages omit pane geometry; the icon authoring script reads the palette
module directly.

`controls.css` replaces the vague `alignment.css` name. The shared `.site-frame`
belongs to `shell.css`. The former shell's header, footer, and article-end
navigation each have a dedicated module. `layout.css` continues to own responsive
column fitting and CSS modes consumed by controllers.

## Properties retained after tracing consumers

`--site-sidebar-mode` and `--site-outline-mode` are read through the constructed
name `--site-${name}-mode` in `navigation/drawers.mjs`. They are active even
though a literal-name CSS scan reports no consumers.

Pane widths, sticky offsets, breadcrumb heights, chooser coordinates, Settings
header height, and map/pane viewport measurements are supplied by JavaScript.
Their CSS fallbacks are necessary before enhancement and during resizing.
Configuration-generated radius, layout widths, reading measure, and fractions
also remain in the Hugo configuration partial.

Generated pane-toggle/resizer classes and optional wordmark, footer, dialog,
popover, print, and preference rules remain. Absence from a screenshot alone is
insufficient evidence that a selector is unused.

## Value review

The values below remain in place; their ownership and references are simpler.

| Value                                        | Owner                                                | Decision                                                                            |
| -------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 4px spacing rhythm                           | `tokens/scale.css`                                   | Keep the shared rem scale; component insets use it.                                 |
| 8px layout gap                               | `data/ui/style.json` → `--site-layout-gap`           | Use one property across shell, header, pane controls, and groups.                   |
| 12px corners                                 | `data/ui/style.json` → `--site-radius`               | Keep one configurable surface radius.                                               |
| 48px control minimum                         | `tokens/geometry.css` and configured context minimum | Keep the rem floor; the compact header's 44px targets remain an explicit exception. |
| 14px navigation / 16px reading type          | `tokens/scale.css`                                   | Keep distinct UI and reading roles, with the existing reading preferences.          |
| 70ch reading measure / 30rem reading minimum | `data/ui/style.json` and `tokens/geometry.css`       | Keep reading constraints separate from pane widths.                                 |
| 20% sidebar / 25% outline                    | `data/ui/style.json`                                 | Retain automatic proportions within the existing min/max bounds.                    |
| 12–28rem sidebar / 1.6× outline maximum      | `tokens/geometry.css`                                | Retain responsive limits and manual resizing.                                       |

Equal numeric values are not automatically one role: table-cell padding and
navigation text size remain independent, as do palette foregrounds and surfaces.
Actual component overrides and CSS/JS interfaces remain explicit.

Component media queries now use the same 40/48/64rem boundaries as the shell,
replacing mixed pixel/rem thresholds. Their default-font transition points are
preserved, and they now follow the browser's default font size consistently.

Validation completed:

- 80 navigation checks passed; the optional deployed-reference comparison was skipped.
- All 32 configuration/preference tests passed.
- Eight affected layout/control checks passed in WebKit; four affected component checks also passed in Chrome after the breakpoint cleanup.
- Scoped CSS formatting, configuration validation, and the minified production build passed.
- Icon palette inputs were unchanged, and the authoring script passed its syntax check.

The navigation-font update that landed during this audit is preserved. For the
refactor comparison, that font was held at its baseline value in the browser:
all 24 page/theme/viewport screenshots were pixel-identical. The live preview
continues to use the updated navigation font.
