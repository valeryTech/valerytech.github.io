# Frontend conventions

[Styling](styling.md) owns visual contracts; [colors](colors.md) owns the palette.
This guide records site-specific behavior and configuration boundaries.

## Configuration ownership

| Source                        | Owns                                                  |
| ----------------------------- | ----------------------------------------------------- |
| `config/_default/`            | Hugo/theme settings, menus, environment integration   |
| `assets/css/site/tokens/`     | Palette, spacing/type scales, and shared geometry     |
| `data/ui/style.json`          | Shared corners, header height, control/context spacing, and layout dimensions |
| `data/ui/fonts.json`          | Reading-font default, options, aliases, cookie        |
| `data/ui/display.json`        | Reading/breadcrumb/visibility defaults and cookie     |
| `data/ui/navigation.json`     | Pane storage/migration, keyboard step, outline and swipe policy |
| `data/ui/settings.json`       | Settings sections, field order/types/labels/help      |
| `data/callouts.json`          | Callout types, aliases, icons, fallback               |
| `data/analytics.json`         | Engagement and sampling policy                        |
| `.infra/versions.env`         | Shared toolchain pins                                 |
| `scripts/migrate/config.toml` | Imported source selection and destination mappings    |

Defaults and options live together. Settings fields reference their source
instead of copying options. Configuration stays declarative; algorithms, DOM
selectors, events, and CSS assembly order stay in code. Configured design dimensions
become shared CSS properties; visual roles and the spacing scale remain in CSS.
Theme utility classes must exist in the pinned compiled stylesheet.

`custom.js` receives UI data through `js.Build` parameters and composes modules
under `navigation/`, `preferences/`, `settings/`, and `analytics/`. Early preference
restoration consumes font, display, and pane-width data before the first paint.
CSS fits preferred pane widths to the reading space; the resize controller reads
those rendered bounds. Run `npm run check:config` after data
edits; a running preview does not rerun npm hooks.

## Navigation contracts

- Traverse actual HTML ancestry, including skipped heading levels. Outline,
  highlighting, and sticky layout share `navigation/hierarchy.mjs`.
- Section overviews derive their outline from the rendered index so generated
  browse headings appear alongside authored headings. Desktop, compact, and
  collapsed outlines share `navigation/page-outline.html`; group anchors use
  section paths and remain stable when titles change.
- Section links navigate; their fixed chevrons are decorative. Render the current
  and authored-open branches without JavaScript. Keep one top-level branch open.
- Choose that branch during rendering. The inline `sidebar/initialize.html`
  prepares sticky offsets and reveals the current document before the menu paints;
  deferred controllers reuse that geometry without changing its initial position.
- `navigation/child-groups.html` orders documents/subsections for both sidebar and
  breadcrumb selectors; retain reading-guide order and omit generated Overview children.
- Section overviews keep `aria-current`, while only real documents get
  `site-sidebar-current-document`. An introductory note is current only at its own URL.
- Breadcrumb text stays a normal link. Adjacent chevrons open child selectors;
  arrows/Home/End navigate their list and Escape restores trigger focus. Position
  relative to the whole breadcrumb card; preserve internal scrolling when repositioning.
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
navigation foreground. Blue links, breadcrumbs, toolbar controls, secondary
text, and the Settings dialog also follow the profile. The shared Reading
settings expose this profile and preview body text and headings. Set `textBrightness.default`
to change the site default; visitor overrides use the display cookie and restore
before paint. Colors remain in `tokens/colors.css`.

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
Hiding the left pane leaves a narrow rail. The collapsed right outline reserves its
column width so the article and breadcrumb edges stay fixed; its reopen icon
keeps the same horizontal position. Both reopen buttons stay beside the
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
