# Reader analytics reports

Saved PostHog dashboard:
[Reader journeys and content value](https://us.posthog.com/project/631264/dashboard/2254879).
Definitions and limitations are in the [measurement plan](../analytics-measurement-plan.md).

| Report | SQL | Saved insight | Unit |
| --- | --- | --- | --- |
| Content engagement | [content-engagement.sql](content-engagement.sql) | [Open](https://us.posthog.com/project/631264/insights/QuQycBlu) | Session/path pairs with page views; regular content pages |
| Navigation paths | [navigation-paths.sql](navigation-paths.sql) | [Open](https://us.posthog.com/project/631264/insights/ZaS3E8Nb) | Link activations and sessions per source/destination/area |
| Search and reuse | [search-and-reuse.sql](search-and-reuse.sql) | [Open](https://us.posthog.com/project/631264/insights/yfgHEx4O) | Independent event counts and sessions |
| Country and device | [audience-context.sql](audience-context.sql) | [Open](https://us.posthog.com/project/631264/insights/a4u8E8N7) | Browser sessions with page views; all page types |

All queries were validated and saved on 24 October 2026. They use a fixed rolling
30 days, hostname `valery.tech`, and events with session IDs. Dashboard date
controls do not override their SQL. Owner visits and undetected automation remain;
Web Analytics bot filters do not apply automatically to these queries.

Content results show the top 30 paths, navigation the top 50 edges, and audience
the top 50 country/device combinations. These are not full site totals. Show
counts with rates; missing rows are missing observations. Copy/downloads are
requests, and search counts do not establish success or form a funnel.

Repository edits do not update cloud insights. Run changed SQL in PostHog, check
scope, units, columns, and sample rows, then update the saved insight explicitly.
The optional [reader survey](../analytics-measurement-plan.md#reader-research-draft)
remains unpublished.
