-- All page types; country/device from the first observed event in the window.
-- Observed browser sessions, not people, nationality, or professional role.
WITH observed_sessions AS (
    SELECT
        toString(properties.$session_id) AS session_id,
        argMin(
            coalesce(nullIf(toString(properties.$geoip_country_name), ''), 'Unknown'),
            timestamp
        ) AS country,
        argMin(
            coalesce(nullIf(toString(properties.$device_type), ''), 'Unknown'),
            timestamp
        ) AS device_type,
        countIf(event = '$pageview') AS pageviews,
        countIf(event = 'reader_engaged') > 0 AS engaged
    FROM events
    WHERE timestamp >= now() - INTERVAL 30 DAY
      AND properties.$host = 'valery.tech'
      AND properties.$session_id IS NOT NULL
      AND event IN ('$pageview', 'reader_engaged')
    GROUP BY session_id
    HAVING pageviews > 0
)
SELECT
    country,
    device_type,
    count() AS observed_sessions,
    countIf(engaged) AS engaged_sessions,
    round(100.0 * countIf(engaged) / count(), 1) AS engaged_pct,
    sum(pageviews) AS pageviews
FROM observed_sessions
GROUP BY country, device_type
ORDER BY observed_sessions DESC
LIMIT 50
