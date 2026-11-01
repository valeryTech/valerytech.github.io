# Styling guide

Use [colors.md](colors.md) for exact implemented color values and counts;
[visual-identity.md](visual-identity.md) records design decisions and proposals.
Shared colors are authored in [tokens/colors.css](../../assets/css/site/tokens/colors.css).
Component styles use `var(--site-...)`; this guide and the branding guide refer
to token names and the color reference for their values. Update that reference
when changing the palette, and regenerate the
[icon assets](visual-identity.md#v-topology-mark-and-icons) when a branding color changes.

## Ownership

Hugo assembles the following `assets/css/site/` modules in this order through
[styles/site.html](../../layouts/_partials/styles/site.html):

| Module                   | Owns                                                           |
| ------------------------ | -------------------------------------------------------------- |
| `tokens/scale.css`       | Spacing/type scales, focus/motion, reading preferences         |
| `tokens/colors.css`      | Semantic palette and Light/Dark/Bright color profiles          |
| `tokens/geometry.css`    | Shared control dimensions, pane bounds and navigation guides   |
| `base.css`               | Fonts, descriptions, content wrapping, hidden scrollbars       |
| `branding.css`           | Header V mark, title pairing, theme colors                     |
| `controls.css`           | Filled controls and leading/content/action surface slots       |
| `links.css`              | Link colors, panel foreground states, alias-redirect palette   |
| `shell.css`              | Shared frame, page gutters and not-found layout                |
| `header.css`             | Top-bar controls, groups and visibility                        |
| `page-navigation.css`    | Previous/Next, article-end spacing and reading fade            |
| `footer.css`             | Footer navigation and optional font control                    |
| `primary-navigation.css` | Desktop/mobile section links, current-section state            |
| `panes.css`              | Resize handles and sidebar toggle                              |
| `outline-map.css`        | Collapsed document map, heading marks, and heading previews    |
| `navigation.css`         | Tree, outline, markers, pinned stacks                          |
| `breadcrumbs.css`        | Breadcrumb selectors and popovers, also used by header More    |
| `search.css`             | Material search trigger/dialog and borderless shortcut chips   |
| `theme.css`              | Theme cycle button and active-mode icon                        |
| `components.css`         | Cards, callouts, Markdown tables                               |
| `pdf-reader.css`         | PDF link badge and the inline PDF reader                       |
| `collections.css`        | Homepage and section browse lists                              |
| `settings.css`           | Settings page/dialog and controls                              |
| `layout.css`             | Shared shell width, responsive panes, density, reading measure |
| `drawers.css`            | Navigation dialog and native outline popover                   |

The local bundle is unlayered and follows the theme CSS. Keep overrides local;
`themes/hextra/`, `public/`, `resources/`, and legacy `assets/scss/` are not editing
surfaces. Configuration and behavior ownership are in [frontend.md](../frontend.md).
The shared alias-redirect stylesheet is assembled from the same tokens and link rules.

[styles/tokens.html](../../layouts/_partials/styles/tokens.html) combines the three
token modules before generated configuration. Hugo alias pages load only the scale,
palette, configuration, and link rules; pane geometry stays in the main site bundle.
The icon authoring tool reads the palette module directly.

Use `--site-layout-gap` for the shared layout/button spacing. Keep a separate
property when it has an actual override or a different role: pane gutters,
content insets, control padding, and palette aliases retain their own names.
One-component dimensions belong in that component's stylesheet, scoped to its
container. Breadcrumb chooser bounds, table cell gaps/padding, Settings width,
and brand-mark size follow this rule.

JavaScript-owned measurements and layout mode properties are a CSS/JS interface;
do not remove them based on a text-only unused-value scan. The audit and rename
map are recorded in [css-audit.md](css-audit.md).

## Local contracts

| Area               | Contract to preserve                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header             | Height is the shared control height plus the layout gap. The icon-only Home control leads one section group; search and preferences share the fitted outline width and growth limit; Theme and Settings close the row on the right.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Alignment          | Home aligns with the leading sidebar action; the search/preferences group aligns with the outline. Global navigation stays anchored as panes resize. Documents without headings reserve its column.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Breadcrumbs        | The Home icon links home, and its adjacent chevron browses top-level sections. The text trail starts at the collection. Surfaces keep equal pane gaps, opaque backing, and the shared layout gap below the header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Navigation         | Document labels reserve the section-chevron gutter. Section chevrons and outline branch toggles are 24px round disclosures (`--site-round-control-size`) centered on the first label line, with the `card-hover` circle on hover; the chevron points down when open and turns without a transition. The sidebar tree and page outline share this geometry. Top-level circles take the pane heading's round-control slot (12px inset, 8px gap), so they and their labels line up with the heading toggle and title. Nested levels start the circle at the row edge, and each branch's 1px guide descends from its parent's chevron center; each level steps in about 16px, 12px in compact density. Branches without subbranches keep the narrower 24px document gutter, so their labels sit closer to the guide; their items beside subbranches keep the chevron slot to align with sibling labels. Current markers are 3px wide with an 8px label gap. Only individual documents receive the left marker. Hovered links in both panes take the `panel` fill of the current item. The current outline heading keeps its marker between the chevron slot and its label. |
| Parent stacks      | Use the actual ancestor hierarchy. JavaScript measures wrapping rows and sticky offsets; CSS supplies colors, geometry, and layers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Resize handles     | 24px-wide hit area fixed at the context row, with a centered 2px × 24px grip in each gap beside the breadcrumbs. Scrolling does not move the handles. Pointer use stays neutral; keyboard focus marks only the grip.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Pane visibility    | Toggles sit in pane headings. The sidebar and outline headings, and the outline popover header, end with a bulk section control at the round-control inset, mirroring the leading toggle and placed before the outline's top-bar toggle; it shows the next action: double chevron up (Collapse all), U-turn arrow (Restore) or double chevron down (Expand all). The left rail fits one control plus two layout gutters. The collapsed right rail fits the Theme and Settings buttons plus two gutters, its two round controls centered under them. Preserve focus and saved pane widths.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Scrollbar          | Native scrollbars stay hidden sitewide, including on hover and in scrollable menus, dialogs, tables, and code. Wheel, touch, and keyboard scrolling remain native. The PDF reader's pages are the one exception: a 12px track with a `muted` pill thumb (`foreground` on hover), so long documents can be dragged.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Material surfaces  | Cards/callouts are borderless. Tables have 4px row/column gaps, brighter headers, square inner cells, and only four rounded outer corners.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Browse lists       | Native `details`; thin chevrons rotate on expansion. The summary uses the filled-control surface and label color. Surface and child list share rounded outside corners.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Settings           | Native dialog/page share one form. Header close control cannot overlap wrapping text. Choice controls use filled cycle buttons with the shared control height, wrapping labels, and current/next accessible names. Toggles and sliders remain native.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Search             | Shared header surface, borderless shortcut chips and dialog, soft result selection; preserve native keyboard shortcuts and focus cues.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Theme selector     | Square icon-only header control before Settings and search. Each activation cycles Light → Dark → System → Light. Show the current icon and name the next mode in its tooltip and accessible name.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| PDF reader         | PDF links end with a small muted `PDF` badge outside the underline. The reader is a borderless `card-surface` card with the shared radius whose start edge lines up with the text column, also from inside list items; widened, it runs on to the article area's end edge. Its bar wraps the title and page status before right-aligned 32px square actions (control height minus two layout gaps) with 16px icons that hover with `card-hover`. A find row below it pairs a `page-background` field with the match count and the same actions. The Contents outline overlays the pages from the start edge, up to 20rem or 85% wide, on `card-surface` with the floating shadow; entries use navigation text and hover like the bar. Pages fit the card's width, are separated by the layout gap, and scroll inside a viewport of `min(75vh, 60rem)`.                                                                                                                                                                                                                                                                                                                 |
| Reading navigation | Previous/Next stay at the article end. A gentle reading fade matches the side-control footer and clears as the ending enters view. Scroll to top stays outside the outline scroller.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Geometry and typography

The outline heading includes a round top-bar toggle. It stays beside the outline
restore control when that pane is collapsed, and uses a floating bottom-right
position when no inline outline is available. Hiding the top bar sets the shared
navbar height to zero so context rows and heading clearance use the freed space.

Inline panes share the visible height above the site footer. Their scroll areas
shrink as it enters view, keeping both headings aligned with the breadcrumbs.
The shell retains its viewport minimum so this does not change document height.
Sticky bounds use the panes' minimum usable height, so scrolling cannot push a
heading up before the next frame updates its scroll area.
Bottom action rows stick independently of those scroll areas, so the browser
moves them with the site footer immediately instead of waiting for a measured resize.

The left navigation uses the full available height after moving Theme/Settings
to the header. It reserves no empty button row. A decorative bottom fade shares
the article's gradient, follows the page footer, and clears at the end of the
menu or when all links fit. Native scrolling and the edge scrollbar stay usable;
keyboard-focused links scroll above the fade. The mobile drawer uses the same behavior.

Set `layoutGapPixels` in [style.json](../../data/ui/style.json), currently **8px**,
to change the page's shared layout spacing. It controls the top inset, spacing
between header rows, gaps below pane headings, visible column gutters, outer
page edges, gaps between buttons, and padding below the bottom actions. Component insets are accounted
for so these visible gaps stay equal rather than adding together.

Set `articleTopGapPixels` in the same file, currently **24px**, to control the
gap between breadcrumbs and the first title or text in the main content.
Documents and section overviews use this spacing independently of the layout
gap. It accepts nonnegative pixel values, including zero.

Button groups use the same effective gap, including Theme, Settings, Search,
and Previous/Next. There is no separate control-spacing setting. On very narrow
or short windows, larger configured gaps are capped uniformly at 8px so the
toolbar and reading area remain usable. Bottom controls retain the breadcrumb
colors and surface edges.

This uses the spacing-scale and grouping approach described by
[Material](https://m2.material.io/design/layout/spacing-methods.html),
[Carbon](https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview),
and [Atlassian](https://atlassian.design/foundations/spacing). This site uses one
8px gap across the layout and button groups.

Short notes keep Previous/Next at the bottom of the page layout, level with
Scroll to top when the outline is inline. Longer notes keep the row after
their content. The reading-end marker reserves a minimum gap without moving
the fade's content boundary. All buttons retain the shared control height.
Previous/Next show only a directional chevron and the article title; their
accessible names retain the direction.

Without Previous/Next, Scroll to top stops at the overview content's bottom
edge rather than the outer layout's trailing whitespace. Its reading area
shrinks to that boundary as the page ending enters view, in both scroll
directions and after browse groups expand. Preserve the outline's minimum
usable height and the document's height while fitting it.

Documents without an outline reserve an empty column with the same fitted and
saved width as an inline outline. It has no heading, toggle, or resize handle;
compact layouts and the explicit Hidden preference release that space.

Set `cornerRadiusPixels` in [style.json](../../data/ui/style.json), currently **12px**.
Hugo emits one `--site-radius` property during stylesheet assembly; surfaces,
controls, and rounded outside table corners share it. Joined stack edges and
internal table cells keep square corners.

Set `contextHeaderMinHeightPixels` in the same configuration, currently **48px**,
to size the breadcrumbs, inline navigation heading, and outline heading together.
Hugo emits `--site-context-header-min-height`; the shared
`--site-context-header-height` follows the measured breadcrumb height when its
contents wrap and falls back to the configured minimum when breadcrumbs are hidden.
Breadcrumbs use the minimum directly so they can shrink again after wrapping.
Configuration checks require a finite, positive height.

`style.json` also owns `layout.standardWidthRem` (80), `layout.wideWidthRem` (90),
and `layout.readingWidthCh` (70). Header, page, and footer share the selected shell
width. `layout.sidebarWidthPercent` (20) and `layout.outlineWidthPercent` (25)
set automatic pane widths as shares of that shell, leaving about 55% for the
article on desktop. These proportions follow available CSS width, including
browser zoom, without changing text size. Existing minimum/maximum pane widths
and the article's reading minimum still apply. Tablet and phone layouts retain
their outline popup and navigation drawer breakpoints. A manual width overrides
the automatic share for that pane; resetting restores its responsive default.
The same defaults supply the settings sliders and outline placeholder.

Prose, tables, and code blocks share the reading measure in `ch`. Table
surfaces align with the prose on both sides, with gaps only between cells. Code
blocks use an outer wrapper so their smaller type does not change that measure.
Wide tables scroll inside it. Code lines wrap automatically, including long
tokens, with space reserved for the copy button. Indentation and copied line
breaks stay intact. Diagrams and homepage cards use extra space. The compact
settings form stays centered.

Section overviews use the same reading measure around their introduction, start
links, and browse groups, including the groups' heading rules and disclosures.
Their page outline includes both authored and generated headings. Generated
group targets stay stable across title changes; outline navigation opens any
containing disclosure, and reading-position tracking skips collapsed headings.

Spacing follows a 4px rhythm. Automatic density tightens tree indentation while
the shared layout spacing remains the configured 8px across all columns.

Both panes share `--site-pane-gutter`; the article uses the reading guide
established by `--site-content-gutter`. The breadcrumb surface extends around
that column by `--site-breadcrumb-inset` (16px, or 8px on phones), while its Home
icon and trail use the same inner slots as other controls. Surface gaps share
the configured layout spacing. Full-width pages keep the surface's outer right edge on the
search guide. Navigation cards use the pane's container width so native
scrollbar gutters do not move the visible card edge.

On phones, the homepage uses at least 1.25rem of reading margin on each side,
including safe-area insets, independently of the toolbar's tighter gaps. Its title
wraps with balanced lines and starts 2rem below the header. The introductory
callout keeps its icon beside the title while paragraphs use the card's full
inner width. At every screen width, an opaque layout gap below the header keeps
scrolling text away from the controls. On phones, Settings contains the top-bar
visibility option; its floating restore button appears only while the bar is
hidden so it does not cover the reading area during normal use.

`shell.css` supplies `.site-frame` for shared header/page/footer bounds.
`controls.css` supplies `.site-control` and `.site-surface-row`: filled colors, 14px medium labels,
21px line height, 12px vertical and horizontal padding, an 8px icon-to-label gap, a shared 48px
height, and 20px icons. Hover and keyboard focus states use the same rules.
Theme, Settings, Previous/Next, and Scroll to top use `.site-control`.
`--site-control-height` also sizes search, section links,
and dialog close buttons. It follows the configured context minimum with a 3rem
floor to accommodate a larger browser-default font. The top bar reserves that
height plus its context gap. Pane collapse controls are round controls centered
in their heading, including when wrapped breadcrumbs make the context row taller.

Context headings, breadcrumbs, and search use `.site-surface-row` with optional
`.site-surface-leading`, flexible `.site-surface-content`, and `.site-surface-actions`
slots. Labels use `.site-control-label` and fill the space before the shared trailing
inset; Previous/Next keep their note titles inside that label region. Theme and
Settings use square icon-only buttons immediately before search. Their accessible
names and tooltips remain available. The sidebar reserves empty reading-end space
in line with the article and outline actions.

Context content owns the vertical padding so its surface and heading actions
can follow wrapping breadcrumb height. Every leading icon uses the same frame:
`--site-control-icon-size` plus twice `--site-control-icon-frame-padding` (20px +
2 × 2px = 24px by default). The 12px surface inset and 8px slot-to-label gap then
leave 14px before the SVG box and 10px between that box and its label.
Round controls (the top-bar toggle, both pane toggles, the bulk section toggles
and Scroll to top) occupy a 24px slot (`--site-round-control-size`, the leading
frame). Their chevrons are drawn at
`--site-round-control-icon-size` (12px) with the shared 1.5px
`--site-chevron-stroke-width`, so they match the breadcrumb chevrons. They have
no resting fill and hover like the section bar's More chevron: a `card-hover`
rounded square (`--site-radius`) inset by `--site-layout-gap` from the 48px
control height, 32px by default, which is also the hit area. Focus draws the
accent ring on that square. The leading slot sits 12px (`--site-round-control-inset`, derived from the
control height) from the surface edge, matching the space above and below it in
a 48px heading and the breadcrumb Home circle. Labels follow the slot after the
8px slot gap (`--site-round-control-gap`; a ring larger than the frame would
shrink it by its overhang) and share the 44px label inset of square controls. A
trailing slot mirrors the edge inset. Scroll to
top stays a square 48px control with the icon centered inside. It sits at the
outer end of the outline footer, so its icon lines up with the heading's trailing
toggle above it; on hover only the inset square changes. The floating top-bar
restore button keeps its 48px filled circle.
`components/control-icon.html` supplies the shared slot and artwork; left/right chevrons use
Hextra's narrow shapes through `components/chevron-icon.html`, with adjusted
viewboxes that center the artwork in both axes without changing its proportions.
Breadcrumbs pair an icon-only Home link with a chooser for top-level sections;
the text trail starts at the collection. Hovered trail links and chooser items take
`--site-card-hover` and the accent color; trail links fill the full crumb row
without shifting their labels. The Home link and chooser triggers hover as 24px
circles; the house is drawn at 16px so the circle shows around it, and chevrons are
optically centered. Trail pills pad their labels by 8px, and labels sit 12px from
each circle, so hover pills and circles stay 4px apart. Chooser lists hide their scrollbars
while retaining wheel, touch, and keyboard scrolling. Soft surface fades and
small chevrons show which directions still have more items. They disappear at
the corresponding scroll edge and leave keyboard-focused links unobscured.
The local theme partial uses the original saved theme preference. Each click,
Enter, or Space activation advances Light → Dark → System → Light. Only the
active mode's icon appears; its tooltip and accessible name identify the current
and next modes. System follows OS color changes while keeping the System icon.
Pane headings reserve their leading column even before
enhancement; their
collapse controls precede the text in both visual and keyboard order. Restoring a
pane keeps that order. Other control icons also precede their labels.

Shared control dimensions live in `tokens/geometry.css`. The top row reserves the control
height plus one layout gap above it: 56px with the current 48px controls and 8px
layout spacing. The context row starts one layout gap below it and shares its measured
height. The layout gap separates the sidebar and outline headings from their
content; the breadcrumb-to-content gap uses `articleTopGapPixels`.
Each heading has opaque backing that matches its surrounding background,
keeping scrolling text clear of the heading without a shaded strip below it. The heading remains a
separate rounded card above any pinned parent sections.
The first row's text and controls center within the full 96px space above the
context surfaces, including the layout gap. Their upper edge is one layout gap
from the frame's top, matching the inset at its left and right edges.

The icon-only Home tile starts on the leading pane edge and centers over its
leading action. Equal padding surrounds the V. Primary sections share one filled
surface, with visible labels, subtle dividers, and a persistent tonal inset for
the current direction. Its inset uses `--site-layout-gap` on each edge (8px by
default), matching the spacing between header rows and buttons. The header's
vertical inset is capped to preserve the label's line height at larger configured
gaps. The selection keeps the shared radius and 600-weight link-colored text. The full link remains
clickable. `--site-nav-selected-surface` mixes the base link tint over the canvas at
12% in Light and 26% in Dark. Hover and keyboard focus replace any fill, the
selected one included, with `--site-card-hover`, the same hover surface as
breadcrumbs, Browse lists and controls; focus also draws an inset outline. The
selected fill returns after the pointer leaves.
The bar starts one shared gap after the logo and ends on the article breadcrumb's
right guide. One computed width sizes the utility column and positions the bar's
end, including when the tools need more room than the narrowest outline. Pane
resizing and configured spacing stay synchronized.
Links and the Home tile use the same control height, with explicit keyboard focus.

The labels and order come from `site.Menus.main`. The longest matching URL prefix
selects one direction, so Evaluation wins over its broader AI Engineering parent.
`aria-current="page"` marks an exact destination; `aria-current="true"` marks its
containing direction. These remain ordinary page links and work without JavaScript.
Desktop and the mobile Menu drawer render the same `navigation/section-links.html`
partial, including the longest-prefix selection and `aria-current` values.
Top-level collections the menu leaves out sit behind an icon-only down chevron
("More collections") that closes the section bar: it is at least one control
height wide, draws its chevron like the pane heading toggles (12px
`--site-round-control-icon-size`, 1.5px stroke), shares the links' divider,
hover, focus and current inset, and takes the selection while one of its
collections is current. It opens the breadcrumb chooser popover below the bar
with a "More collections" title and no group heading; the chevron points up while
it is open. The drawer lists those collections after the menu links instead. Mobile
links use the same tonal inset, at least 48px targets, and a 12px text inset inside
the highlighted shape. The collection tree keeps its separate document markers.
See the [visible-navigation guidelines](https://www.nngroup.com/articles/menu-design/).
The homepage keeps its title and reading inset independently of the header.
Below 24rem, the icon row uses 44px targets with the same shared gaps. Its header
height follows those targets so the vertical gap stays equal to the horizontal gaps.
Search, Theme, and Settings form one group, in that order, matching the outline heading's surface
edges, up to twice the outline's default heading width.
`--site-header-tools-max-width` subtracts both pane gutters from the responsive
default pane width, then doubles the result. The outline's own resize bounds may
cap growth sooner. Beyond
that width, the group keeps its right edge aligned and stops growing. The two
square buttons and both gaps count toward this limit; search fills the remaining
space and hides its label when only its icon fits. The rendered
outline width drives the search column. A collapsed outline keeps the last
rendered or saved width, so the header stays in place; hidden or absent outlines
use the default pane width. The Home column fits its control,
so it and the following section links stay fixed while either pane is resized.

Automatic panes follow the configured sidebar/outline proportions around a
480px reading minimum. The left pane ranges from 192px to 448px. The outline's maximum is 60% larger: 44.8rem (716.8px at the
default font size), controlled by `--site-outline-max-width-scale`. Available
reading space may limit it sooner. The outline's minimum uses
`--site-header-tools-min-width`: three square header controls, two shared gaps,
and both pane gutters. Dragging, keyboard
resizing, restored widths, collapsed outlines, and Settings share that limit.
Below 1280px, inline panes prefer 192px; the left pane caps at 224px and the
outline at 358.4px. Its three-control minimum still takes precedence. Settings
uses the full outline range, and saved wide-screen widths survive.

Collapsed outline marks follow authored H1–H6 levels, with widths of 20, 16, 12,
10, 8, and 6px at the default root size. Their shared end guide indents deeper
headings. The current mark is slightly thicker; the full 48×24px link remains
clickable around each mark.

Section-bar links, breadcrumbs, and both navigation panes share
`--site-navigation-font-family` (IBM Plex Sans) and `--site-navigation-text-size`:
`0.875rem` (14px at the default root size). Pane
headings, navigation drawers, breadcrumb choosers, and shared control labels use
the same size. Compact density changes spacing, not text size. The navigation
family also covers mobile menus and outline previews. Article text and content
headings keep the System/Jost reading-font preference.

Plex Sans is self-hosted through `@fontsource/ibm-plex-sans`; Hugo mounts the Latin
WOFF2 files for Regular (400), Medium (500), Semibold (600), and Bold (700), plus
their OFL license. `base.css` owns the faces and navigation scope. No third-party
font service is needed. See [IBM Plex](https://github.com/IBM/plex) and
[Carbon typography](https://www.carbondesignsystem.com/building-blocks/foundations/typography/overview).

Code blocks, inline code, and sample output use `--site-code-font-family`
(IBM Plex Mono). `@fontsource/ibm-plex-mono` supplies locally hosted Latin WOFF2
faces: 400/500/600/700 normal and 400/700 italic, with their OFL license. Code
retains the theme's sizes and syntax highlighting; the outer block still measures
its width using the reading font. Block backgrounds use the `code-surface` palette
role from `components.css`, without the theme's contrast filter; see
[colors](colors.md). Both font families and their scopes live in `base.css`.

Boundaries below assume a 16px browser-default font.
Component and shell media queries use the same rem boundaries; avoid adding
parallel pixel thresholds for the same viewport transition.

| Boundary           | Local behavior                                     |
| ------------------ | -------------------------------------------------- |
| Below 768px        | Article, navigation drawer, header outline button  |
| From 640px         | “Prefer visible” can keep an inline outline        |
| 768–1023px         | Article and outline; left navigation uses a drawer |
| 1024–1279px        | Three compact columns and aligned header grid      |
| From 1280px        | Roomy columns; saved pane widths apply             |
| Height up to 500px | Keep pane titles pinned; disable parent stacks     |

With the outline hidden or absent, document navigation can remain inline from
768px. Layout CSS owns the mode properties consumed by JavaScript; avoid a second
set of breakpoint calculations in controllers. Breakpoints use `rem` to respect
larger browser-default fonts as well as zoom. Outline popovers work natively
without JavaScript. Short windows cap breadcrumbs with internal scrolling to preserve reading space.

Layers are local: breadcrumb 10, navbar 20, parent stacks 100 minus depth, and
pane titles 101. Short-viewport and sticky-clearance rules stay in CSS.
Hidden scrollbars do not reserve a visible track beside the shared column guides.
Render breadcrumb separator slots, navigation spacing, and root surfaces at their
final size before enhancement; restore saved pane widths in the head script.

## Checks and upstream reference

Run scoped format checks, the production build, and affected browser checks;
commands are in the [runbook](../runbook.md#navigation-checks).
Check Light/Dark, System/Jost, mobile/desktop, long labels, sticky masks, keyboard
focus, and the System Design callout catalog. Use Chrome and WebKit for geometry.

Generic configuration and theme APIs belong upstream:
[Hextra configuration](https://imfing.github.io/hextra/docs/guide/configuration/),
[Hextra customization](https://imfing.github.io/hextra/docs/advanced/customization/),
and [Hugo configuration](https://gohugo.io/configuration/).
