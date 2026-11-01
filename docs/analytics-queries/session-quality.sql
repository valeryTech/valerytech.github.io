-- Weekly observed sessions split into reader sessions and no-signal sessions (see reader-sessions-view.sql).
SELECT
    toStartOfWeek(session_start) AS week,
    countIf(NOT is_no_signal) AS reader_sessions,
    countIf(is_no_signal) AS no_signal_sessions
FROM reader_sessions
WHERE session_start >= now() - INTERVAL 90 DAY
GROUP BY week
ORDER BY week
