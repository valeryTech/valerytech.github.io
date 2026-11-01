-- Independent activity counts, not a conversion funnel or search success rate.
-- A missing event row means no matching events were observed in this window.
SELECT
    event,
    count() AS observed_events,
    count(DISTINCT properties.$session_id) AS observed_sessions
FROM events
WHERE timestamp >= now() - INTERVAL 30 DAY
  AND properties.$host = 'valery.tech'
  AND properties.$session_id IS NOT NULL
  AND event IN (
      'search_opened', 'search_completed', 'search_result_selected',
      'copy_requested', 'resource_downloaded', 'outbound_navigation'
  )
GROUP BY event
ORDER BY observed_events DESC
