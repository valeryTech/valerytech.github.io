-- Saved PostHog view `reader_sessions`: one row per observed session on valery.tech, last 180 days.
-- `is_no_signal` marks sessions with one page view and no engagement, exit summary or other interaction.
-- Automatic events (page leave, web vitals, errors, 404 reports) don't count as interaction; scanners probing missing URLs send 404 reports.
-- Most of them are automated; some are real readers who left within seconds or lost the exit summary on mobile.
SELECT
    toString(properties.$session_id) AS session_id,
    min(timestamp) AS session_start,
    max(timestamp) AS session_end,
    argMin(coalesce(nullIf(toString(properties.$geoip_country_name), ''), 'Unknown'), timestamp) AS country,
    argMin(coalesce(nullIf(toString(properties.$geoip_country_code), ''), 'Unknown'), timestamp) AS country_code,
    argMin(coalesce(nullIf(toString(properties.$device_type), ''), 'Unknown'), timestamp) AS device_type,
    argMin(coalesce(nullIf(toString(properties.$browser), ''), 'Unknown'), timestamp) AS browser,
    argMin(coalesce(nullIf(toString(properties.$os), ''), 'Unknown'), timestamp) AS os,
    argMinIf(coalesce(nullIf(toString(properties.$referring_domain), ''), '$direct'), timestamp, event = '$pageview') AS referring_domain,
    argMinIf(toString(properties.$pathname), timestamp, event = '$pageview') AS entry_path,
    argMaxIf(toString(properties.$pathname), timestamp, event = '$pageview') AS exit_path,
    countIf(event = '$pageview') AS pageviews,
    uniqIf(toString(properties.$pathname), event = '$pageview') AS unique_pages,
    countIf(event = 'reader_engaged') > 0 AS engaged,
    countIf(event = 'reading_summary') > 0 AS has_summary,
    countIf(event NOT IN (
        '$pageview', 'reader_engaged', 'reading_summary', '$pageleave',
        '$web_vitals', '$exception', '$set', '$identify', 'not_found_viewed'
    )) > 0 AS has_interaction,
    pageviews = 1 AND NOT engaged AND NOT has_summary AND NOT has_interaction AS is_no_signal
FROM events
WHERE timestamp >= now() - INTERVAL 180 DAY
  AND properties.$host = 'valery.tech'
  AND properties.$session_id IS NOT NULL
GROUP BY session_id
HAVING pageviews > 0
