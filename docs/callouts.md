# Migrated callouts

The importer preserves the site's established callout shortcode syntax and
renders it through the local [adapter](../layouts/_shortcodes/callout.html).
Types, native icons, legacy icon aliases, and fallback styles live in
[data/callouts.json](../data/callouts.json).

## Import contract

A case-insensitive alert marker must start a blockquote line. Preserve its
custom title; parse `+` / `-` fold signs but ignore them visually.

```md
> [!warning]+ Custom title
> Callout body.
```

| Source kind                 | Shortcode context | Native type                 |
| --------------------------- | ----------------- | --------------------------- |
| `note`, `info`, `important` | `note`            | `info`                      |
| `tip`                       | `tip`             | `default`                   |
| `caution`, `warning`        | `caution`         | `warning`                   |
| `danger`                    | `danger`          | `error`                     |
| `question`                  | `note`            | `info`, question icon       |
| `thumbup`                   | `note`            | `info`, thumbs-up icon      |
| `thumbdown`                 | `caution`         | `warning`, thumbs-down icon |

Unknown imported kinds become `note`. Unknown directly authored adapter types
use the configured fallback. Native `type` is accepted alongside legacy `context`;
legacy `outline/...` icons map to configured native icons. Direct native
`important` remains available separately from the import mapping above.

## Verification

Change [conversion.py](../scripts/migrate/conversion.py), the adapter, and/or
configuration according to the affected contract. Run migration regressions,
`make build`, and inspect `/system-design/integrated-test-pages/callouts/` in both
profiles. The catalog source is under the configured external notes tree at
`system-design/integrated-test-pages/callouts.md`.

Importer regression coverage is in [tests/migrate/](../tests/migrate/); component
checks are in [tests/theme/](../tests/theme/) and [tests/navigation/](../tests/navigation/).
Nested behavior is limited by the importer's block parser.

For generic syntax and escaped shortcode examples, use
[Hextra callouts](https://imfing.github.io/hextra/docs/guide/shortcodes/callout/) and
[Hugo shortcode escaping](https://gohugo.io/content-management/syntax-highlighting/#escaping).
