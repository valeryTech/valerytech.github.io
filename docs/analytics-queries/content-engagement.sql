-- Unit: session + canonical content path; fixed rolling 30 days, valery.tech.
-- Reloads add views, not page sessions. Engagement is a behavioral proxy.
-- Excludes no-signal sessions (see reader-sessions-view.sql). Active time and completion come from reading_summary.
WITH page_sessions AS (
    SELECT
        toString(properties.page_path) AS page_path,
        toString(properties.$session_id) AS session_id,
        countIf(event = '$pageview') AS pageviews,
        countIf(event = 'reader_engaged') > 0 AS engaged,
        countIf(event IN ('copy_requested', 'resource_downloaded')) > 0 AS reuse_signal,
        countIf(event = 'reading_summary') > 0 AS has_summary,
        maxIf(toFloat(properties.active_seconds), event = 'reading_summary') AS active_seconds,
        countIf(event = 'reading_summary' AND toString(properties.completed) = 'true') > 0 AS completed
    FROM events
    WHERE timestamp >= now() - INTERVAL 30 DAY
      AND properties.$host = 'valery.tech'
      AND properties.page_kind = 'page'
      AND properties.content_section IN (
          'ai-engineering', 'ai', 'system-design', 'engineering', 'projects',
          'functional-programming', 'type-driven-design'
      )
      AND properties.$session_id IS NOT NULL
      AND toString(properties.$session_id) NOT IN (
          SELECT session_id FROM reader_sessions WHERE is_no_signal
      )
      AND event IN (
          '$pageview', 'reader_engaged', 'reading_summary',
          'copy_requested', 'resource_downloaded'
      )
    GROUP BY page_path, session_id
    HAVING pageviews > 0
)
SELECT
    page_path,
    sum(pageviews) AS total_pageviews,
    count() AS page_sessions,
    countIf(engaged) AS engaged_page_sessions,
    round(100.0 * countIf(engaged) / count(), 1) AS engaged_pct,
    round(quantileIf(0.5)(active_seconds, has_summary)) AS median_active_seconds,
    countIf(completed) AS completed_page_sessions,
    countIf(reuse_signal) AS reuse_page_sessions,
    countIf(has_summary) AS summaries_received
FROM page_sessions
GROUP BY page_path
ORDER BY engaged_page_sessions DESC, page_sessions DESC
LIMIT 30
