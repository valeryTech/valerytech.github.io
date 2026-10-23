# Legacy URL redirects

Published links should remain useful when notes are renamed, moved, combined,
split, or removed. Someone following an old LinkedIn post, bookmark, search
result, or AI-generated reference should reach the current material or an
explanation with relevant choices. Future reorganizations should fail validation
when an old address disappears without an explicit decision.

## Visitor behavior

The site generates a physical HTML page at each mapped old address. This works
with GitHub Pages static hosting and local Hugo preview.

| Situation | Intended behavior |
| --- | --- |
| A note moved to one current page | Redirect automatically and include a visible destination link and an explanation. |
| A note was split or substantially rewritten | Show the explanation and links to the relevant current pages. Let the visitor choose. |
| A draft was removed and has no exact replacement | Explain that it is no longer published and offer related reading. Use multiple destinations so the page does not silently imply an exact replacement. |
| An existing Hugo alias already handles the old address | Keep the alias and validate that its output still exists. Do not create a conflicting page from the JSON map. |
| The requested address is unknown | Serve the normal 404 page. Do not guess a replacement from a similar title or URL prefix. |

Single-destination pages use JavaScript to replace the current browser history
entry and preserve the incoming query string and fragment. A meta refresh
provides a fallback when JavaScript is unavailable; that fallback uses the
mapped destination without explicitly copying those URL parts. Choice-page
links use their mapped destination URLs.

The generated pages are marked `noindex, follow`, stay out of site search and
the agent navigation maps, and do not send their own analytics page views.
Destination pages retain the site's normal analytics. These redirects operate
in HTML; they do not configure an HTTP 301 response or intercept arbitrary
requests on the server.

## The routing decision map

`data/redirects.json` contains the maintained decisions. Each old address has a
`to` array of current website paths and a `comment` explaining what happened.
The comment is displayed to visitors.

```json
{
  "version": 1,
  "redirects": {
    "/old-note/": {
      "to": ["/engineering/current-note/"],
      "comment": "This note moved into the engineering collection."
    },
    "/old-draft/": {
      "to": ["/ai/approach/evaluations/", "/ai/operating-model/discovery-and-delivery/"],
      "comment": "This draft was consolidated into the evaluation and operating-model notes."
    }
  }
}
```

Destinations must be published pages in the current build. A mapping cannot
replace a live page, point to another redirect, or form a loop. Equivalent source
paths, such as `/old-note/` and `/old-note/index.html`, cannot have competing
entries. The map uses exact paths rather than wildcard rules.

## Automatic discovery and generation

`data/url-history.json` retains previously published addresses, their titles,
and their source files. The initial history covers the last snapshot before the
April 2026 migration and subsequent content and configuration changes. Later
runs import additional Git snapshots and remember current uncommitted pages,
surviving Hugo aliases, and manually recovered shared addresses.

Hugo determines the published URLs from each historical snapshot's configuration
and clock. Filename changes alone do not establish the correct replacement.
Discovery updates the URL ledger and produces missing-mapping suggestions;
maintainers make the final routing decisions in `data/redirects.json`.

Both `make migrate` and `make build` invoke preparation. Migration prepares the
redirects after syncing notes, while the build prepares them before rendering
the production site. `make up` uses migration before starting preview.
`make site-map` also regenerates the redirect pages, and `make site-map-check`
checks that generated files and the ledger are current.

The generated HTML lives in `.generated/redirects/`, which Hugo mounts as static
files. Commit the decision map and ledger changes; generated HTML remains
ignored and is recreated on the other computer and in CI. Full Git history is
required to discover earlier unrecorded commits. A source archive without
`.git` can still validate the addresses already in the committed ledger.

## Failure behavior

Preparation must fail when a recorded address has neither a current page, a
surviving Hugo alias, nor a mapping. It must also fail for invalid mapping
destinations and missing internal hyperlink destinations.

The failure identifies the old address and its historical title and source, or
the current pages containing the broken link. `.generated/redirect-report.json`
contains the full list and JSON mapping stubs. When one current page has the
same title or source file, its address is offered as a candidate for review.
Candidates are never applied automatically.

To resolve a failure, correct the source link or add a mapping with verified
destinations and a public explanation, then rerun the command. If a destination
later moves, update every affected mapping to the final current address.
Deleting an old ledger entry is not a resolution: the old address remains part
of the site's published interface.

## Continuing with the original notes

Keep routing decisions in this repository. Correct imported content in the
original notes as well, because migration regenerates its managed `content/`
directories.

Two source notes need the link corrections already made in the published
content:

- `ai/operating-model/discovery-and-delivery.md`: link the ready-fire-aim citation
  to `https://www.svpg.com/build-to-learn-faq/` instead of a local notes file.
- `topics/engineering/engineering-review-framework/review-tools-and-skills-catalog.md`:
  remove the two hyperlinks to local harness checkout files, or replace them
  with published source URLs. Keep the descriptive labels and surrounding text.

After applying those changes on the computer with the original notes, run
`make migrate` and `make build`, review any new routing decisions, and commit the
updated content and URL ledger together. Operational details are in the
[local runbook](runbook.md#preserve-urls-when-moving-or-removing-notes).

## Acceptance criteria

- Every recorded historical address has a physical output page or a surviving
  Hugo alias in the production artifact.
- Every generated destination exists and leads directly to current content.
- Single-destination and choice pages behave differently as described above.
- Removing a required mapping, deleting its destination, or introducing a broken
  internal hyperlink stops preparation with an actionable error.
- Stale generated redirects cannot hide missing mappings.
- Repeated generation with unchanged content, history, and decisions produces
  unchanged files.
- Migration and production builds exercise the same routing checks.

The redirect regression tests run during the production build, including checks
of all generated pages and recorded historical addresses.
