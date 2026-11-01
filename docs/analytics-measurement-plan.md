# Reader analytics measurement plan

Help engineers find, understand, evaluate, and apply useful ideas. These reader
goals are hypotheses; traffic or engagement alone does not establish usefulness.
Implementation is in [analytics.md](analytics.md), and the
[reader dashboard and SQL](analytics-queries/README.md) provide the baseline.

## Reader goals

| Goal | Evidence to inspect | Editorial action |
| --- | --- | --- |
| Solve an engineering problem | Relevant note, heading navigation, examples/references followed | Improve practical examples, prerequisites, and summaries |
| Learn a subject | Starting point, related notes, later return | Curate reading sequences |
| Explore connected ideas | Navigation within and across collections | Explain useful connections |
| Reuse material | Copy/download requests and voluntary reports of application | Improve reusable material and context |
| Evaluate or discuss the work | Supporting evidence and voluntary feedback | Clarify claims, limitations, and routes for discussion |

Readers can enter at any note and leave successfully after one page. More
clicks, time, or returns can also indicate confusion. Roles and expertise need
voluntary answers; they cannot be inferred from page choice or country.
Non-JavaScript crawlers and agents are outside browser analytics coverage.

## Units and limits

| Measure | Definition |
| --- | --- |
| Page view | One captured `$pageview`; reloads count again |
| Observed session | PostHog `$session_id`, not a unique person |
| Page session | One session/path pair with a page view in the window |
| Engaged page session | Page session with `reader_engaged`; show count and denominator beside the rate |
| Reuse signal | Page session with a copy/download request, not confirmed reuse |
| Summary coverage | Page sessions with `reading_summary` divided by page sessions |

Content reports cover regular pages in the six main collections; index,
homepage, legal, and 404 activity needs separate interpretation. Queries use a
fixed rolling 30 days and `valery.tech`, independently of dashboard date controls.

- Engagement is a coarse proxy: 10 visible seconds, an interaction, and 25%
  document visibility. Visible time includes idle time; short pages can start
  near full depth. `completed` is a depth proxy, not proof of reading.
- Exit summaries can be lost on mobile termination or selective after
  back/forward-cache restores. Missing summaries are not zero reading.
- Events lack page-view/search-attempt IDs. Use page-session units; search
  counts are activity, not a conversion funnel. Navigation means link activation,
  not confirmed arrival. Homepage cards can currently be classified as `other`.
- Owner visits and undetected automation remain. SQL does not inherit Web
  Analytics bot filters. Clarity's denied storage limits continuity. Keep tool
  counts separate and use event properties because person profiles are disabled.

## Reader research draft

[Reader research — goals, role and topic experience](https://us.posthog.com/project/631264/surveys/01a16f37-6e79-0000-f3ec-d04d07009d3c)
is saved as **Draft** and collects no responses until launched. It asks three
optional single-choice questions: today's task, current role, and hands-on
familiarity with the topic. Every question includes “Prefer not to say.” Topic
familiarity is not career seniority.

Targeting uses production collection URLs, `.page-footer-meta` for article
pages, and `reader_engaged` as a trigger; repeated triggering is disabled.
Before a pilot, verify the saved URL regex (the summary labels it “contains”),
preview all steps, test SDK delivery and dismiss/repeat behavior without person
profiles, consider display delay, and update the privacy notice. This survey has
not been tested on visitors.

Use native survey event/answer IDs and bounded categories. Report exposure,
response/skip counts, page context, and sample sizes; responses are self-selected.
Keep names, email, company, exact location, and raw free text out of analytics.
A separate helpfulness question can later connect reader goals with outcomes.

## Review loop

Review a few notes and relevant Clarity recordings, choose one concrete
hypothesis, change one thing, and compare subsequent periods with their sample
sizes, sources, devices, and content mix. Prioritize explicit homepage areas,
page-view/search-attempt IDs, and deduplicated lifecycle delivery before adding
more derived metrics. Pilot voluntary research after validating its targeting.
