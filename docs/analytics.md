# Analytics

Production builds use GA4 (`G-XF1V06CDS3`), PostHog, and Microsoft Clarity.
Local development builds omit analytics. GA4 covers acquisition, PostHog covers
custom behavior, and Clarity provides recordings and heatmaps.

See the [measurement plan](analytics-measurement-plan.md) for reader goals and
metric definitions, and [saved SQL queries](analytics-queries/README.md) for the
reader dashboard.

## Events and privacy

| Event | Meaning |
| --- | --- |
| `internal_navigation` | Link activation with source, destination, and navigation area |
| `reader_engaged` | Once per page after 10 visible seconds, an interaction, and 25% document visibility |
| `reading_summary` | Visible/elapsed time, depth, interactions, and engagement on page exit |
| `toc_navigation`, `outbound_navigation` | Heading navigation, or external host and bounded destination category |
| `search_opened`, `search_completed`, `search_result_selected` | Search activity, result counts, and positions without query text |
| `copy_requested`, `resource_downloaded`, `display_preference_changed` | Use of the corresponding controls |
| `not_found_viewed` | Missing path, referral context, and deployed release |

GA4 records standard page views and content groups. PostHog adds Hugo page and
content metadata plus the deployed Git revision. Custom parameters exclude
search text, copied content, contact addresses, and user-entered values.
PostHog URL properties omit queries/fragments; standard UTM properties remain.

PostHog respects Do Not Track, creates no person profiles, and keeps its recorder
disabled. Clarity handles replay with inputs masked and both storage-consent
values initially denied, which limits session continuity. Keep the published
privacy notice consistent with these settings.

## 404 context

| Parameter | Value | Saved GA4 dimension |
| --- | --- | --- |
| `requested_path` | Runtime missing path | Missing URL path |
| `referrer_type` | `internal`, `external`, or `unknown` | Missing page referrer type |
| `referrer_host` | Referring hostname | Missing page referrer host |
| `referrer_path` | Same-origin source path only | Missing page internal source |
| `site_release` | Deployed revision | Site release |

These fields exclude queries/fragments. An absent referrer remains `unknown`.
GA4 and PostHog receive the parameters. Clarity receives the event plus
`page_kind = 404` and nonempty fields as tags, capped at 255 characters; other
custom events send names only.

Use `requested_path` for missing-URL reports: generated `page_path` describes
`/404.html`. Recovery clicks use the existing `internal_navigation` event.

## Reports

| Report | Scope |
| --- | --- |
| [PostHog: reader journeys and content value](https://us.posthog.com/project/631264/dashboard/2254879) | Content, navigation, search/reuse, and audience context; [SQL and units](analytics-queries/README.md) |
| [PostHog: 404 technical health](https://us.posthog.com/project/631264/dashboard/2254837) | Missing paths and source/release details; rolling 30 days, production hostnames |
| [GA4: 404 URLs and referrers](https://analytics.google.com/analytics/web/?authuser=2#/analysis/a346580592p479060226/edit/PPnR5gRPSVqFV8ms3puNqA) | Standard page path/referrer dimensions, 404 title filter, production hostnames |
| [Clarity: 404 recordings](https://clarity.microsoft.com/projects/view/yovpnq2dvg/impressions?date=Last%2030%20days&smartEvents=not_found_viewed) | Saved segment **404 visits — missing URLs**, rolling 30 days; use Today for fresh tests |

The five 404 GA4 dimensions above are event-scoped and already saved. New
custom dimensions can take 24–48 hours to appear and do not backfill older
custom-event data; the saved exploration uses standard historical dimensions.
For general reporting, use GA4 Traffic acquisition, Pages and screens, and Path
exploration. Navigation breakdowns can use event-scoped `source_path`,
`destination_path`, and `navigation_area` definitions if configured.

Review positive production 404 counts before adding
[redirect traffic evidence and mappings](legacy-url-redirects.md). Keep provider
counts separate. Browser analytics misses blocked or non-JavaScript requests;
owner visits and unrecognized automation can remain. Country or low engagement
alone does not identify bots or professional demographics.

## Configuration

Set these GitHub repository **variables** under Settings → Secrets and variables
→ Actions. They are public browser configuration, not credentials.

| Variable | Value |
| --- | --- |
| `POSTHOG_PROJECT_TOKEN` | Public project token |
| `POSTHOG_HOST` | Project ingestion host, such as `https://us.i.posthog.com` |
| `POSTHOG_PROJECT_ID` | Numeric project ID for source-map upload |
| `CLARITY_PROJECT_ID` | Clarity project ID |

Source-map upload also needs the **secret** `POSTHOG_CLI_API_KEY` with
error-tracking write access. Upload failure does not block deployment; source
maps are removed before publication and the key stays out of the website.
Empty provider identifiers omit that provider. PR builds omit production
repository variables.

For a local production build, the Docker wrapper forwards Hugo overrides:

```sh
HUGOxPARAMSxANALYTICSxPOSTHOGTOKEN=phc_example \
HUGOxPARAMSxANALYTICSxPOSTHOGHOST=https://us.i.posthog.com \
HUGOxPARAMSxANALYTICSxCLARITYID=example make build
```

Keep PostHog replay off and Clarity cookies off by default. In GA4, retain
page-load measurement and choose retention covering the reporting window.
Test owner-traffic filters before activating them; active exclusions discard
data. Reserve DebugView for targeted tests.

## Verification

Run `make verify`. For browser verification, serve a production build with a
real 404 fallback and a marked release such as `404-e2e-YYYY-MM-DD`. Follow an
internal broken link, an external broken link, and a direct missing URL. Check
all five context fields in PostHog and GA4 Realtime and the tags/recording in
Clarity, then follow a recovery link and confirm `internal_navigation`. Keep
test origins outside production report filters and allow for indexing delays.

After deployment, also check page views, internal navigation, and engagement
in GA4 Realtime using a browser without an analytics blocker.
