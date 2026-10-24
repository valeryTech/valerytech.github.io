# Legacy URL redirects

Create mappings only for reviewed URLs with production 404 visits. Historical
URLs without observed traffic can return the normal 404 and do not block builds.
A recorded visit is sufficient; an explicit link-click event is not required.

## Files and behavior

| File | Purpose |
| --- | --- |
| `data/redirect-traffic.json` | Reviewed public paths, positive counts, report sources, and date windows |
| `data/redirects.json` | Exact old paths mapped to current destinations, with a public explanation |
| `data/url-history.json` | Historical URL inventory for discovery and title/source lookup |

One destination redirects automatically, preserving query strings and fragments.
A visible link and a no-JavaScript refresh provide fallbacks; the refresh does
not copy those URL parts. Multiple destinations show an explanation and choices
without automatic navigation. Existing Hugo aliases need no duplicate mapping.

Generated pages are static HTML for GitHub Pages, not HTTP 301 responses. They
are excluded from search, agent maps, and analytics, and marked `noindex, follow`.

## Update a mapping

1. Review the [404 reports](analytics.md#reports), excluding local/test visits.
   Fix malformed source links directly. No observed traffic in a reporting window
   does not prove that a URL was never visited.
2. Add the reviewed public path and positive count to `data/redirect-traffic.json`.
   Keep provider counts separate because they overlap. Retain approved evidence
   when it ages out of a rolling report; builds do not query analytics services.
3. If no current page or alias covers the path, add a decision:

   ```json
   "/old-note/": {
     "to": ["/current-note/"],
     "comment": "This note moved into the current collection."
   }
   ```

4. Run `make build` or `make migrate`. Correct imported links in the original
   notes too, because migration replaces managed content.

Preparation rejects missing coverage for reviewed traffic, mappings without
traffic, invalid destinations, loops, duplicate paths, output conflicts, and
broken internal links. Destinations must be current pages, not other redirects.
Missing-coverage suggestions are written to `.generated/redirect-report.json`.

Commit the map, traffic evidence, and inventory. Generated HTML stays ignored in
`.generated/redirects/`. Full Git history is needed to discover earlier URLs;
the inventory alone never requires a mapping. `make site-map-check` checks for
stale output, and `make verify` tests redirects and the production artifact.
