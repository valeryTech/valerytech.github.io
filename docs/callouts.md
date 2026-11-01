# Migrated callouts

The importer preserves the site's established callout shortcode syntax and renders it through the local [adapter](../layouts/_shortcodes/callout.html). Types, native icons, legacy icon aliases, and fallback styles live in [data/callouts.json](../data/callouts.json).

## Import contract

A callout starts at a line that begins with `> [!kind]` or `>[!kind]`. The kind is matched without regard to case, and it must be letters, digits or underscores. The rest of the line is the title; with no title, the importer uses the kind, for example "Tip". The `+` and `-` fold signs are dropped, so every callout renders open. The body is every following line that starts with `>`.

```md
> [!warning]+ Custom title
> Callout body.
```

| Source kind                 | Shortcode context | Native type                 |
| --------------------------- | ----------------- | --------------------------- |
| `note`, `info`              | `note`            | `info`                      |
| `important`                 | `important`       | `important`                 |
| `tip`, `advice`, `rule`     | `tip`             | `default`                   |
| `caution`, `warning`        | `caution`         | `warning`                   |
| `danger`                    | `danger`          | `error`                     |
| `question`                  | `note`            | `info`, question icon       |
| `thumbup`                   | `note`            | `info`, thumbs-up icon      |
| `thumbdown`                 | `caution`         | `warning`, thumbs-down icon |

Unknown imported kinds become `note`. Unknown directly authored adapter types use the configured fallback. Native `type` is accepted alongside legacy `context`; legacy `outline/...` icons map to configured native icons.

## Edge cases

The importer reads callouts line by line, so some vault patterns render differently from Obsidian. The [resolution test note](#verification) shows each case.

| Vault pattern | Result on the site |
| --- | --- |
| A second `[!kind]` in the same blockquote, after a bare `>` line | Stays as text inside the first callout. Separate the callouts with a blank line. |
| A non-blank line right after the callout without `>` | Renders below the callout. Obsidian shows it inside the callout. |
| A `[!kind]` line without `>` | Becomes a callout with an empty body. Obsidian shows it as plain text. |
| Markdown or a wiki link in the title | Shows as literal text. The title is not rendered as Markdown. |
| A kind with a hyphen, such as `my-kind` | Renders as a plain blockquote with the marker as text. |
| A nested (`> > [!kind]`) or indented callout | The importer skips it, and Hugo renders it with the Hextra alert template, which bypasses the adapter and the site callout colors. That template supports only `note`, `tip`, `important`, `warning` and `caution`. |

## Verification

Change [conversion.py](../scripts/migrate/conversion.py), the adapter, and/or configuration according to the affected contract. Run migration regressions, `task site:build`, and inspect `/system-design/integrated-test-pages/callouts/` in both profiles in the `task site:up` preview; production builds leave the test pages out (see [unpublished fixtures](runbook.md#unpublished-fixtures)). The vault holds two test notes under `system-design/integrated-test-pages/`: `callouts.md` shows each supported kind next to its source, and `callout-resolution.md` has one callout per kind plus the edge cases above. Inspect `/system-design/integrated-test-pages/callout-resolution/` too.

Importer regression coverage is in [tests/migrate/](../tests/migrate/); component checks are in [tests/theme/](../tests/theme/) and [tests/navigation/](../tests/navigation/).

For generic syntax and escaped shortcode examples, use [Hextra callouts](https://imfing.github.io/hextra/docs/guide/shortcodes/callout/) and [Hugo shortcode escaping](https://gohugo.io/content-management/syntax-highlighting/#escaping).
