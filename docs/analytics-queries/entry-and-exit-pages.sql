-- Where reader sessions start and end; excludes no-signal sessions.
-- single_page_sessions: readers who saw only this page. exits_after_browsing: last page of sessions with 2+ page views.
WITH readers AS (
    SELECT entry_path, exit_path, pageviews
    FROM reader_sessions
    WHERE session_start >= now() - INTERVAL 30 DAY
      AND NOT is_no_signal
)
SELECT
    path,
    sum(is_entry) AS entries,
    sum(is_single_page) AS single_page_sessions,
    round(100.0 * sum(is_single_page) / nullIf(sum(is_entry), 0), 1) AS single_page_pct,
    sum(is_exit) AS exits_after_browsing
FROM (
    SELECT entry_path AS path, 1 AS is_entry, if(pageviews = 1, 1, 0) AS is_single_page, 0 AS is_exit
    FROM readers
    UNION ALL
    SELECT exit_path AS path, 0 AS is_entry, 0 AS is_single_page, 1 AS is_exit
    FROM readers
    WHERE pageviews > 1
)
GROUP BY path
ORDER BY entries DESC, exits_after_browsing DESC
LIMIT 30
