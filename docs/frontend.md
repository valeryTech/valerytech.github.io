# Frontend conventions

Hugo renders semantic HTML, CSS controls appearance and layout, and JavaScript
adds behavior. Keep a change with the component or feature that owns it. The
[styling guide](styling.md) covers the CSS hierarchy, cascade, spacing, responsive
boundaries, and visual checks.

## Configuration ownership

| Source | Owns |
| --- | --- |
| `config/_default/` | Hugo/theme settings, menus, environment integration |
| `assets/css/site/tokens.css` | Visual scale, theme colors, shared layout contracts |
| `data/ui.json` | Settings choices/defaults, preference cookies, pane keyboard step, outline policy |
| `data/callouts.json` | Callout types, importer aliases, legacy icons, fallback style |
| `data/analytics.json` | Engagement/completion thresholds and sampling interval |
| `.infra/versions.env` | Shared toolchain versions |
| `scripts/migrate/config.toml` | Imported source selection and destination mappings |

Group settings by their consuming feature. Include units in behavioral setting
names, such as `tickMilliseconds` and `requiredActiveSeconds`. A default, its
allowed choices, and compatibility aliases belong together. The font head
script and deferred selector consume the same configuration.

Keep configuration declarative. DOM selectors, module imports, event names,
rendering algorithms, and stylesheet assembly order are implementation contracts
and stay in code. Visual tokens remain native CSS; there is no second copy of
the palette in JSON. Adding a font option also requires its CSS and asset mount.
Callout classes must exist in Hextra's shipped CSS or a site-owned stylesheet;
local builds do not generate arbitrary Tailwind utilities.

Hugo reads the data during rendering and passes UI/engagement settings to
`js.Build` through `@params`. The browser receives bundled values, without a
configuration fetch or global settings object. Provider identifiers and
environment overrides retain their existing configuration paths.

`npm run check:config` validates cross-references, font defaults, duplicate
identifiers, and threshold ranges before preview startup and production builds.
After editing data during a running preview, run it explicitly; file watching
does not rerun npm hooks. Invalid configurations fail the build. Unknown authored
callout contexts still use the configured fallback for compatibility.

## Module hierarchy

`assets/js/custom.js` is the browser composition entrypoint. It supplies
configuration and initializes the feature modules once per document:

| Module | Responsibility |
| --- | --- |
| `navigation/index.mjs` | Coordinate pane resizing, outline, accordion, and sticky context |
| `navigation/resize.mjs` | Independent pane widths and drag/keyboard controls |
| `navigation/outline.mjs` | Reading position, heading selection, ancestor states |
| `navigation/sticky-context.mjs` | Measure wrapping rows and place pinned context |
| `navigation/accordion.mjs` | Open one top-level sidebar group at a time |
| `navigation/hierarchy.mjs` | Shared DOM ancestry and heading ID decoding |
| `preferences/font.mjs` | Build the font control and persist a selected choice |
| `preferences/font-settings.mjs` | Font normalization and legacy value compatibility |
| `preferences/cookies.mjs` | Shared js-cookie adapter and cookie attributes |
| `preferences/panes.mjs` | Pane preference validation, cookie storage, legacy migration |
| `preferences/display.mjs` | Normalize and apply breadcrumbs, reading size/spacing, parent stacks |
| `preferences/settings.mjs` | Connect the settings form to the preference modules |
| `preferences/restore-preferences.js` | Restore font and display preferences before first paint |
| `analytics/interactions.mjs` | Translate user actions into analytics events |
| `analytics/engagement.mjs` | Visible reading time, engagement, page-exit summary |

Keep the entrypoint small. Extract a module when it has a distinct responsibility,
shared rules, or an independently testable policy. Avoid splitting every helper
into its own file or creating a generic framework for a single use case.

Navigation follows the actual HTML hierarchy. An H6 can have an H3 as its nearest
authored parent; do not infer parents by subtracting heading levels or impose a
fixed depth. Sticky layout and highlighting use the same traversal. CSS supplies
resolved scroll clearance and compact-viewport policy; JavaScript measures
geometry rather than duplicating spacing or media queries.

Pane sizing consumes CSS minimum/maximum widths and the article column's minimum
width. Saved choices use the `navigation.resize.cookie` configuration and are
clamped to the available space without discarding the preferred widths when a
window narrows. Storage failures leave the controls usable. Resize handles are
focusable vertical separators; arrow keys move the divider, Home/End select its
limits, Enter or double-click resets one pane, and Escape cancels a drag. Mobile
drawers retain their full width and have no resize handle. The outline's sticky
frame contains its handle outside the clipped scroll area.

Font, display, and pane preferences use [js-cookie](https://github.com/js-cookie/js-cookie)
through one shared adapter. Cookie names and lifetimes remain with their owning
feature in `data/ui.json`; all currently expire after one year. Cookies use
`Path=/`, `SameSite=Lax`, and `Secure` on HTTPS, with no Domain attribute. The
library is bundled locally, including the font's early restoration script.

The `navigation-widths` cookie stores only numeric sidebar/outline widths. It
takes precedence over the old `site-navigation-widths` local-storage entry.
Migration deletes the legacy entry only after verifying the cookie was saved.
Resetting removes the cookie and legacy entry so old sizes cannot reappear.
Rejected cookies leave the controls usable and preserve legacy data for a later
migration attempt.

## Settings page and defaults

`/settings/` is linked in the footer and document sidebar controls. Its Hugo
shortcode renders labeled native controls from the same `data/ui.json` choices
used by the preference modules. The page offers font, article text size, line
spacing, breadcrumb behavior, parent stacks, and both navigation widths. Changes
apply immediately, and the footer font selector stays in sync. Reset removes
the three preference cookies and any legacy pane-width entry.

Site defaults live beside each setting's options in `ui.display` and `ui.fonts`.
The settings page edits this browser's overrides. The display cookie stores only
values that differ from the configured defaults. Unknown values fall back to
those defaults; validation rejects options without CSS support and cookie-name
collisions. Preference storage failures are reported on the settings page while
the controls remain usable.

Breadcrumbs support `sticky`, `static`, and `hidden`. Only a sticky breadcrumb
contributes to heading scroll clearance. A display-change event requests new
sticky measurements, including when pinning changes without a size change.
Small-viewport limits continue to take precedence over enabling parent stacks.
Reading text size and line spacing use CSS tokens; pane slider bounds are
measured from the same CSS width tokens as the drag controls.

`assets/js/core/toc-scroll.js` is intentionally an empty override of Hextra's
observer. Hextra concatenates core scripts without module bundling, so the site
outline is initialized from the bundled navigation feature. Keep the override
when upgrading to avoid running two outline controllers.

## Dependencies and events

UI modules own visible behavior; analytics owns event vocabulary and delivery.
Font changes emit `site:font-change` with a normalized preference. Analytics
listens and emits `display_preference_changed`; the control works independently
of analytics availability.

Navigation emits `site:outline-change` when selection changes and
`site:navigation-layout` after measuring stacks. The former requests measurement;
the latter refreshes selection and visibility. Coalesce scroll/resize work with
animation frames and avoid notifying listeners when state is unchanged.

Templates act as adapters: the callout shortcode normalizes imported syntax,
selects a configured type/icon, and delegates rendering to Hextra. Keep importer
authoring syntax independent of the selected theme.

## Compatibility and verification

Retain native links, headings, tables, and disclosure controls. Breadcrumbs,
section navigation, and content remain useful without the deferred bundle. The
inline preference script restores choices independently of the deferred controls.

Run checks that exercise the changed behavior:

Use `npm run format:ui` to format feature modules and their configuration;
`npm run lint:ui` verifies that formatting in CI alongside the CSS check.

```bash
npm run check:config
npm run lint:ui
npm run test:ui
npm run test:analytics
make build
npm run test:navigation
```

Unit checks cover invalid configuration, legacy/corrupt cookies, custom defaults,
configured engagement thresholds, background time, and one-time delivery.
Browser checks cover saved fonts with the deferred bundle blocked, preference
events, nested navigation, active headings, keyboard controls, responsive
boundaries, callouts, and sticky paint behavior. Use WebKit as well as Chrome for
geometry/scrolling changes; commands are in the [runbook](runbook.md#check-navigation-in-chrome-or-webkit).

Test public behavior and failure modes rather than repeating token declarations
or asserting an internal file arrangement. Preserve routes, content semantics,
analytics event contracts, and the pinned theme version during refactors.
