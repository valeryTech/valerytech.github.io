-- Unit: session + canonical content path; fixed rolling 30 days, valery.tech.
-- Reloads add views, not page sessions. Engagement is a behavioral proxy.
WITH page_sessions AS (
    SELECT
        toString(properties.page_path) AS page_path,
        toString(properties.$session_id) AS session_id,
        countIf(event = '$pageview') AS pageviews,
        countIf(event = 'reader_engaged') > 0 AS engaged,
        countIf(event IN ('copy_requested', 'resource_downloaded')) > 0 AS reuse_signal,
        countIf(event = 'reading_summary') > 0 AS has_summary
    FROM events
    WHERE timestamp >= now() - INTERVAL 30 DAY
      AND properties.$host = 'valery.tech'
      AND properties.page_kind = 'page'
      AND properties.content_section IN (
          'ai-engineering', 'ai', 'system-design', 'engineering', 'projects', 'blog'
      )
      AND properties.$session_id IS NOT NULL
      AND event IN (
          '$pageview', 'reader_engaged', 'reading_summary',
          'copy_requested', 'resource_downloaded'
      )
    GROUP BY page_path, session_id
    HAVING pageviews > 0
)
SELECT
    page_path,
    sum(pageviews) AS pageviews,
    count() AS page_sessions,
    countIf(engaged) AS engaged_page_sessions,
    round(100.0 * countIf(engaged) / count(), 1) AS engaged_pct,
    countIf(reuse_signal) AS reuse_page_sessions,
    countIf(has_summary) AS summaries_received
FROM page_sessions
GROUP BY page_path
ORDER BY page_sessions DESC
LIMIT 30
