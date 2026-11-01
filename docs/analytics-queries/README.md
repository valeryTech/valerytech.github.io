# Reader analytics reports

Saved PostHog dashboard: [Reader journeys and content value](https://us.posthog.com/project/631264/dashboard/2254879). Definitions and limitations are in the [measurement plan](../analytics-measurement-plan.md).

## Session filter

The saved PostHog view `reader_sessions` ([reader-sessions-view.sql](reader-sessions-view.sql)) has one row per observed session on `valery.tech` in the last 180 days, with country, device, browser, referring domain, entry and exit page, page view count and engagement flags. `is_no_signal` marks sessions with exactly one page view and no `reader_engaged`, no `reading_summary` and no other interaction. Page leave, web vitals, errors and 404 reports don't count as interaction, because browsers and scanners send them without a reader doing anything.

On 15 November 2026, 53% of sessions in the previous 30 days were no-signal sessions. Most came from a few country/browser groups (United States Windows Chrome, China Android Chrome, Russia Windows Chrome) that never send engagement or exit events. The rule also hides real readers who left within seconds, and phones sometimes lose the exit summary, so treat it as an estimate. Owner visits are not filtered.

Edit the view in the PostHog SQL editor (Views → `reader_sessions` → Update view) and keep the file here in sync. Insights that read the view pick up the change on their next refresh.

## Reports

| Report | SQL | Saved insight | Unit |
| --- | --- | --- | --- |
| Reader and no-signal sessions by week | [session-quality.sql](session-quality.sql) | [Open](https://us.posthog.com/project/631264/insights/d0P6yXHP) | Sessions per week, last 90 days |
| Reader sessions by country | [reader-countries.sql](reader-countries.sql) | [Open](https://us.posthog.com/project/631264/insights/dL3TRghY) | Reader sessions; GeoIP country of the first event |
| Country and device, readers only | [audience-context.sql](audience-context.sql) | [Open](https://us.posthog.com/project/631264/insights/MlsW082M) | Reader sessions with page views; all page types |
| Content engagement by note, readers only | [content-engagement.sql](content-engagement.sql) | [Open](https://us.posthog.com/project/631264/insights/84TSHNT8) | Session/path pairs with page views; regular content pages |
| Reader entry and exit pages | [entry-and-exit-pages.sql](entry-and-exit-pages.sql) | [Open](https://us.posthog.com/project/631264/insights/RWJiBxha) | First and last page of reader sessions |
| Page to next page | [page-transitions.sql](page-transitions.sql) | [Open](https://us.posthog.com/project/631264/insights/3X27IQdL) | Consecutive page views in a session |
| Page view paths | PostHog Paths insight | [Open](https://us.posthog.com/project/631264/insights/W1VmSkeu) | Page view sequences, 5 steps, host `valery.tech` |
| Navigation paths | [navigation-paths.sql](navigation-paths.sql) | [Open](https://us.posthog.com/project/631264/insights/ZaS3E8Nb) | Link activations and sessions per source/destination/area |
| Search and reuse | [search-and-reuse.sql](search-and-reuse.sql) | [Open](https://us.posthog.com/project/631264/insights/yfgHEx4O) | Independent event counts and sessions |

The first six queries were validated and saved on 15 November 2026; navigation and search on 24 October 2026. They use a fixed window, hostname `valery.tech`, and events with session IDs. Dashboard date controls do not override their SQL. Reports named "Reader" or "readers only" exclude no-signal sessions. Navigation, search and the Paths chart don't: no-signal sessions have no clicks and only one page view, so they add almost nothing there. Web Analytics bot filters do not apply to these queries.

The earlier unfiltered insights, [Content engagement by note](https://us.posthog.com/project/631264/insights/QuQycBlu) and [Audience context](https://us.posthog.com/project/631264/insights/a4u8E8N7), are off the dashboard but still saved.

Content results show the top 30 paths by engaged page sessions, with median active seconds and completed reads from `reading_summary`. Navigation shows the top 50 edges, transitions the top 50 page pairs, entry/exit the top 30 pages, and audience the top 50 country/device combinations. These are not full site totals. Show counts with rates; missing rows are missing observations. Copy/downloads are requests, and search counts do not establish success or form a funnel.

Repository edits do not update cloud insights. Run changed SQL in PostHog, check scope, units, columns, and sample rows, then update the saved insight explicitly. HogQL rejects an output alias that matches an aggregated column name (for example `sum(pageviews) AS pageviews`), so give totals a different name. The optional [reader survey](../analytics-measurement-plan.md#reader-research-draft) remains unpublished.
