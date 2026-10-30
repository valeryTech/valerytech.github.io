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
| `data/ui.json` | Font choices/cookie compatibility and outline reading policy |
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
| `navigation/index.mjs` | Coordinate outline, accordion, and sticky context |
| `navigation/outline.mjs` | Reading position, heading selection, ancestor states |
| `navigation/sticky-context.mjs` | Measure wrapping rows and place pinned context |
| `navigation/accordion.mjs` | Open one top-level sidebar group at a time |
| `navigation/hierarchy.mjs` | Shared DOM ancestry and heading ID decoding |
| `preferences/font.mjs` | Build the font control and persist a selected choice |
| `preferences/font-settings.mjs` | Preference normalization and cookie parsing |
| `preferences/restore-font.js` | Restore the preference inline before first paint |
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

`assets/js/core/toc-scroll.js` is intentionally an empty override of Hextra's
observer. Hextra concatenates core scripts without module bundling, so the site
outline is initialized from the bundled navigation feature. Keep the override
when upgrading to avoid running two outline controllers.

## Dependencies and events

UI modules own visible behavior; analytics owns event vocabulary and delivery.
The font control emits `site:font-change` with a normalized preference. Analytics
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
inline font script restores a choice independently of the deferred selector.

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
