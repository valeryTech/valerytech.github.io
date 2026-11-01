-- Consecutive page views in the same session: which page readers opened next.
-- No-signal sessions have one page view, so they add no transitions. Reloads of the same page are skipped.
SELECT
    from_path,
    to_path,
    count() AS transitions,
    count(DISTINCT session_id) AS sessions
FROM (
    SELECT
        session_id,
        path AS to_path,
        lagInFrame(path, 1, '') OVER (
            PARTITION BY session_id ORDER BY ts
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS from_path
    FROM (
        SELECT
            toString(properties.$session_id) AS session_id,
            toString(properties.$pathname) AS path,
            timestamp AS ts
        FROM events
        WHERE timestamp >= now() - INTERVAL 30 DAY
          AND event = '$pageview'
          AND properties.$host = 'valery.tech'
          AND properties.$session_id IS NOT NULL
    )
)
WHERE from_path != '' AND from_path != to_path
GROUP BY from_path, to_path
ORDER BY transitions DESC
LIMIT 50
