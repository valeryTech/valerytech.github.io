# Frontend conventions

[Styling](design/styling.md) owns visual contracts; [colors](design/colors.md) owns the palette.
This guide records site-specific behavior and configuration boundaries.

## Configuration ownership

| Source                        | Owns                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `config/_default/`            | Hugo/theme settings, menus, environment integration                           |
| `assets/css/site/tokens/`     | Palette, spacing/type scales, and shared geometry                             |
| `data/ui/style.json`          | Shared corners, header height, control/context spacing, and layout dimensions |
| `data/ui/fonts.json`          | Reading-font default, options, aliases, cookie                                |
| `data/ui/display.json`        | Reading/breadcrumb/visibility defaults and cookie                             |
| `data/ui/navigation.json`     | Pane and section storage, keyboard step, outline and swipe policy             |
| `data/ui/settings.json`       | Settings sections, field order/types/labels/help                              |
| `data/ui/palette.json`        | Palette tokens, site presets, cookie, saved-palette storage and messages      |
| `data/callouts.json`          | Callout types, aliases, icons, fallback                                       |
| `data/analytics.json`         | Engagement and sampling policy                                                |
| `.infra/versions.env`         | Shared toolchain pins                                                         |
| `scripts/migrate/config.toml` | Imported source selection and destination mappings                            |

Defaults and options live together. Settings fields reference their source
instead of copying options. Configuration stays declarative; algorithms, DOM
selectors, events, and CSS assembly order stay in code. Configured design dimensions
become shared CSS properties; visual roles and the spacing scale remain in CSS.
Theme utility classes must exist in the pinned compiled stylesheet.

`custom.js` receives UI data through `js.Build` parameters and composes modules
under `navigation/`, `preferences/`, `settings/`, and `analytics/`. Early preference
restoration consumes font, display, and pane-width data before the first paint.
The `darkreader-lock` meta opts the site out of the Dark Reader extension, and
`js/head/dark-reader.js` removes its Safari fallback, which otherwise paints each
page `#181a1b` for a moment on every navigation.
CSS fits preferred pane widths to the reading space; the resize controller reads
those rendered bounds. Run `task quality:test`, which starts with `check:config`, after data
edits; a running preview does not rerun npm hooks.

## Navigation contracts

- Traverse actual HTML ancestry, including skipped heading levels. Outline,
  highlighting, and sticky layout share `navigation/hierarchy.mjs`.
- Section overviews derive their outline from the rendered index so generated
  browse headings appear alongside authored headings. Desktop, compact, and
  collapsed outlines share `navigation/page-outline.html`; group anchors use
  section paths and remain stable when titles change.
- Section labels navigate; their chevrons expand and collapse the branch. The
  chevron points down for an open branch. Render the current and authored-open
  branches without JavaScript, with one top-level branch open; without
  JavaScript the chevron is decorative and the button stays `hidden`.
- Choose that branch during rendering. The inline `sidebar/initialize.html`
  reveals the disclosure buttons, applies saved branch choices, prepares sticky
  offsets and reveals the current document before the menu paints; deferred
  controllers reuse that geometry without changing its initial position.
- Branch choices are kept in `sessionStorage` under
  `navigation.sections.storageKey` as `branches` keyed by section path, so they
  last for the tab session and need no reset or export. The current page's
  branch and its ancestors open on arrival even if they were collapsed. Blocked
  storage leaves the toggles working on the current page.
- A trailing button in the sidebar heading cycles Collapse all sections →
  Restore sections → Expand all sections; its icon and accessible name show the
  next action. Collapse all saves the arrangement it started from as
  `snapshot`, which Restore reapplies; Expand all followed by Collapse all keeps
  that snapshot. Opening or closing a section by hand makes the new arrangement
  the one to restore: it drops the snapshot and the cycle starts again at
  Collapse all. The next action is saved as `next`, and the startup script
  reveals the button only when the tree has sections.
- The page outline uses the same disclosures, through `navigation/disclosures.mjs`.
  `navigation/page-outline.html` wraps each heading with subheadings in a
  `.site-outline-row` holding a hidden leading toggle and its link, so pinned
  parent headings stick with their toggle. The inline `outline-startup.js`, after
  the popover copy, reveals the toggles and applies saved choices before the
  first paint. The desktop outline and popover share one state per page, keyed
  by heading, under `navigation.outline.storageKey` plus the page path. A deep
  link opens the branches around its heading on arrival. A current heading inside
  a collapsed branch marks its visible parent and scrolls that parent into view.
  The outline heading and the popover header carry the same bulk cycle button.
- `navigation/child-groups.html` orders documents/subsections for both sidebar and
  breadcrumb selectors; retain reading-guide order and omit generated Overview children.
- Section overviews keep `aria-current`, while only real documents get
  `site-sidebar-current-document`. An introductory note is current only at its own URL.
- Breadcrumb text stays a normal link. Adjacent chevrons open child selectors;
  arrows/Home/End navigate their list and Escape restores trigger focus. Position
  relative to the whole breadcrumb card; preserve internal scrolling when repositioning.
- `navigation/section-entries.html` pairs the `main` menu with the top-level
  sections it omits, taken from the breadcrumb's root list, so a new collection
  appears without a menu edit. The longest prefix across both selects one
  direction. The header shows the omitted ones behind an icon-only More
  collections chevron whose popover
  reuses the breadcrumb chooser markup and `navigation/choosers.mjs`, positioned
  below the section bar; the mobile drawer lists them inline. More renders before
  the footer bundle loads so the bar does not reflow after first paint; a
  `<noscript>` style and `@supports not selector(:popover-open)` remove it where
  it could not open.
- Pane drag and keyboard controls share CSS-derived bounds. Escape cancels a drag;
  Enter/double-click resets one pane. Pointer focus never leaves a selection ring.
- Native scrollbar chrome stays hidden; scrolling remains native.
- Keep the `assets/js/core/menu.js` and `toc-scroll.js` theme overrides; bundled
  site controllers own responsive navigation and outline highlighting. The local
  `back-to-top.js` keeps the outline footer action available without scroll thresholds.
  The `sidebar.js` override suppresses the theme's late automatic scroll.
- `assets/js/core/theme.js` cycles Light/Dark/System through one native button,
  keeping the `color-theme` preference and Hextra's early color restoration.
  System follows OS color changes; Enter and Space use native button activation.

## PDF reader

`layouts/_markup/render-link.html` marks links whose path ends in `.pdf` with
`data-pdf-reader` and flags the page, and only flagged pages render
`scripts/pdf-reader.html`: a `<template>` for the reader shell and the ES module
`assets/js/pdf-reader.mjs`. Activating a PDF link inserts a reader after the
link's paragraph, inside its list item, or after its table. The first one loads
PDF.js from `/vendor/pdfjs/` (see [dependencies](dependencies.md)). The reader
spans the text column: inside a list item or quote it reaches back to the
text's left edge. Pages fit the reader's width until zoomed; the bar shows the
current page and these actions:

- **Contents** appears only when the PDF has an outline. It opens the outline
  over the pages; choosing an entry jumps there and closes it.
- **Find in document** (also Ctrl/Cmd+F inside the reader) opens a find row that
  highlights every match, counts them, and steps with Enter/Shift+Enter or the
  arrows. Escape closes the find row first, then the outline, then the reader.
- **Page colors** cycles Original → Site theme → Sepia → Inverted, naming the
  current and next mode. Site theme and Sepia use PDF.js page colors: text and
  lines take `page-background`/`body-foreground` or the reader's sepia colors,
  images keep theirs, and the reader sets the document up again at the same page
  and zoom. Site theme follows Light/Dark and palette changes while open.
  Inverted filters the rendered canvas in CSS, images included. The mode is saved
  in `localStorage` under `site-pdf-reader-colors` and applies to every reader.
- Zoom out/in.
- **Widen the reader** stretches it from the text's left edge to the right edge
  of the article area, which grows when the sidebar or outline is hidden; the
  same button fits it back to the text. It appears only while widening adds at
  least 64px, so not on phones. The reader re-measures when the panes or window
  change, and the choice is saved under `site-pdf-reader-width` for every
  reader.
- Open in a new tab, and close.

Activating the link again, Close or Escape removes the reader and returns focus
to the link. Modified clicks keep normal navigation, and without JavaScript the
link opens the PDF itself. Its click listener runs in the capture phase, so
analytics does not report an opened reader as a download. A PDF that fails to
load leaves a message pointing to the new-tab action.

## Not-found page

There is no per-URL redirect map. `layouts/404.html` lists the collections that
have agent maps, in breadcrumb order, each with its description, landing page and
collection map, then links the website map and the homepage. The inline
`assets/js/not-found.js` reads the first segment of the missing path and moves
matching collections to the top: an exact match, or a collection whose name starts
with that segment and a hyphen, so `/ai/…` highlights AI and AI Engineering. It
never navigates on its own. Without JavaScript or a match the full list stays in
order.

## Preferences and settings

`preferences/store.mjs` coordinates feature adapters, the shared settings form,
footer font selector, and pane resizing. Controls use its API and never access
cookies directly. Snapshots are copies; reset notifies views once with coherent defaults.

Storage uses the shared js-cookie adapter: root path, SameSite=Lax, Secure on
HTTPS, names/lifetimes from feature JSON. Display cookies store overrides only.
Pane migration removes old local storage only after verifying the new cookie;
blocked storage leaves in-memory controls usable. Reset clears both forms of pane storage.

`/settings/` and its lazy native dialog use the same form/field partials with
unique ID prefixes. Native controls remain disabled until binding succeeds.
Settings with a fixed list of choices use filled cycle buttons: each activation
advances through the owning configuration's option order and wraps to the first
choice. The visible text shows the current value; the tooltip and accessible
name identify the current and next values. Native button activation supports
touch, Enter, and Space. Checkboxes and pane-width sliders retain their native
controls. Both settings views and the footer font control stay synchronized.
Modified links keep normal navigation; unavailable JavaScript/dialog support
falls back to the page. Closing returns focus to the opener or visible sidebar
restore button if the opener was hidden.

Breadcrumb modes are sticky/static/hidden. Only sticky mode contributes heading
clearance. Width, density, and outline preferences use the same display cookie
and restore before paint. Older cookies receive the configured defaults.

`display.textBrightness` in `data/ui/display.json` selects `soft` (the default)
or `bright` for dark-mode body text, content headings, and menu labels. Top
navigation, the sidebar, the page outline, and the mobile drawer share the
navigation foreground. Links, breadcrumbs, toolbar controls, secondary
text, and the Settings dialog also follow the profile. The shared Reading
settings expose this profile and preview body text and headings. Set `textBrightness.default`
to change the site default; visitor overrides use the display cookie and restore
before paint. Colors remain in `tokens/colors.css`.

### Site configuration and visitor configuration

Settings are layered. The site configuration in the repository is the default:
`data/ui/*.json` for options and `tokens/colors.css` for colors. Visitor
configuration stores only overrides in cookies, so a changed site default reaches
everyone who has not overridden it. `preferences/store.mjs` owns every visitor
preference (`font`, `display.*`, `widths.*` and `palette`); `restore()` replaces
all of them in one notification for resets and imports.

| Visitor data   | Storage                                      | Restored before paint |
| -------------- | -------------------------------------------- | --------------------- |
| Font           | `font-preference` cookie                     | Yes                   |
| Display        | `display-preferences` cookie                 | Yes                   |
| Pane widths    | `navigation-widths` cookie                   | Yes                   |
| Active palette | `palette-preferences` cookie                 | Yes                   |
| Named palettes | `localStorage` (`palette.presetsStorageKey`) | Not needed            |

Settings → Colors → Edit color palette opens a floating editor
(`settings/palette.mjs`, `settings/palette.html`) for the tokens listed in
`data/ui/palette.json`. Opening it closes the modal Settings dialog; the editor is
a non-modal manual popover, so the page stays scrollable and the header theme
button still works. It edits the profile in view (Light or Dark) and follows theme,
text-brightness, reset and import changes. Desktop panels drag by their header and
stay inside the viewport; phones dock it as a bottom sheet over half the screen.
Each color input resolves the token through aliases and `color-mix()` to its
current hex. A token with a `contrast` entry (`against`, another listed token, and
`minimum`) also shows its live WCAG 2 ratio against that token, worded by
`contrastText`, or by `contrastWarning` when it falls below the minimum.

The active palette is saved through the store in the `palette-preferences`
cookie as `light=token:rrggbb|token:rrggbb&dark=...`. Token names, not positions,
keep saved colors valid when `palette.json` is reordered; every role in both
profiles fits in about 1 KB. `preferences/palette.mjs` restores it before paint
as one `<style id="site-palette-overrides">` whose `html:root` selectors outrank
the brightness profiles. Article text, section descriptions and content headings
use `body-foreground` and `heading-foreground` in both themes, so those rows
recolor all ordinary reading text. "Navigation labels and breadcrumbs" sets
`context-foreground`, shared by top navigation, both pane headings and the
breadcrumbs.

The preset menu lists the site presets from `palette.presets` (the first, with no
colors, is the unchanged site palette) and the visitor's named palettes. Choosing
one replaces both profiles. The menu shows the preset that matches the current
colors, or "Custom colors". Named palettes outgrow a cookie, so they stay in
`localStorage`, capped at `palette.maxSavedPresets`; saving an existing name
replaces it. "Reset this theme" clears one profile; "Reset to site defaults"
clears the palette with every other preference but keeps named palettes.
"Copy CSS" copies the overrides as `:root` / `.dark` blocks to paste into
`tokens/colors.css` when a visitor palette should become the site default; a
palette worth offering to everyone belongs in `palette.presets` instead.

Export settings downloads `valerytech-settings.json`
(`format: "valerytech-site-settings"`, `version: 1`) with the store snapshot and
named palettes. Import validates the format and version, normalizes every value
against the current configuration, replaces all preferences and merges named
palettes by name. A rejected file changes nothing. Bump the version when a field
changes meaning, and keep reading older versions.

`layout.css` supplies sidebar/outline modes from available CSS width. The drawer
controller reads those modes, moves the original sidebar into a native dialog,
and returns it on close or resize. It preserves reading position and focus.
Theme and Settings are icon-only header controls before search, available without
opening the navigation drawer. A round button in the outline heading hides or
shows the whole top bar and saves the choice with display preferences before
paint. It follows the collapsed outline's restore control; layouts without an
inline outline use a floating button at the bottom right. The hidden bar releases
its height for pane sticking and heading clearance. On phones, Settings owns
hiding the bar and the floating button appears only to restore it. Restoring
returns focus to Settings when that floating button disappears. Without JavaScript the bar
remains visible. The header outline button uses a native
popover sharing the desktop outline's heading IDs and selection state. A leftward
touch swipe from the right edge also opens it in popup layouts, including when
the top bar is hidden. `navigation.swipe` configures the edge width, minimum
distance, and horizontal direction ratio. Vertical scrolling, multi-touch,
controls, code blocks, and other open dialogs/popovers keep their native gestures.
Hiding the left pane leaves a narrow rail. The collapsed right outline narrows to
the width of the header's Theme and Settings buttons, and the article and
breadcrumbs widen into the freed space. Toggling either pane keeps the passage
at the reading line in place. Both reopen buttons stay beside the
breadcrumbs. `navigation/outline-map.mjs` builds the collapsed document map from
the original outline and follows its current-heading event. Main sections remain
visible; only the active ancestor branch reveals its children. Native heading
links, hover/focus previews, and arrow/Home/End keyboard browsing share the same
heading IDs and reading position. An authored
H1 wrapping the document is an introduction marker, with its children serving as
main sections. The map scrolls independently in short windows and stays hidden
when the full outline or mobile layout is active. Its rail fits the remaining
article height near the footer so the map and restore button stay reachable. Heading previews
use manual native popovers, keeping them above the article without changing layout.
Both toggles share their markup,
styling, and preference controller. Their independent expanded states are saved
with display preferences and leave pane widths intact. Rails leave room for
future auxiliary controls. Drawer and popover access remain available.
Small-window limits take precedence over saved pane and parent-stack preferences.

## Events and verification

- `site:font-change`: normalized font preference; analytics listens independently.
- `site:outline-change`: selection changed; request sticky measurement.
- `site:navigation-layout`: measured stacks changed; refresh outline visibility.
- `site:drawer-change`: sidebar moved between page and drawer; remeasure stacks.
- Display, width, and sidebar changes request geometry updates through their
  feature events. Coalesce scroll/resize work with animation frames.

Keep native links and no-JavaScript fallbacks. Test public behavior and storage
failure modes rather than mirroring implementation. Run configuration, preference,
analytics, build, and affected browser checks from the [runbook](runbook.md).
Use Chrome and WebKit for scrolling or geometry changes.
