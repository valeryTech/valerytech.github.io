-- Reader sessions by country from GeoIP of the first event; excludes no-signal sessions. Not nationality or role.
SELECT
    country,
    count() AS reader_sessions,
    countIf(engaged) AS engaged_sessions,
    round(100.0 * countIf(engaged) / count(), 1) AS engaged_pct,
    sum(pageviews) AS total_pageviews,
    round(avg(pageviews), 1) AS pages_per_session
FROM reader_sessions
WHERE session_start >= now() - INTERVAL 30 DAY
  AND NOT is_no_signal
GROUP BY country
ORDER BY reader_sessions DESC
LIMIT 50
