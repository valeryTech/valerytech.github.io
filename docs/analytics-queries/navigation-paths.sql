-- Link activations, including new-tab intent; not confirmed destination loads.
SELECT
    toString(properties.source_path) AS source_path,
    toString(properties.destination_path) AS destination_path,
    toString(properties.navigation_area) AS navigation_area,
    count() AS link_activations,
    count(DISTINCT properties.$session_id) AS observed_sessions
FROM events
WHERE timestamp >= now() - INTERVAL 30 DAY
  AND properties.$host = 'valery.tech'
  AND properties.$session_id IS NOT NULL
  AND event = 'internal_navigation'
GROUP BY source_path, destination_path, navigation_area
ORDER BY link_activations DESC
LIMIT 50
