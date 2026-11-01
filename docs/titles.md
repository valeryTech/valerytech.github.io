# Page titles

Every page has two names: `title`, its full name, and `linkTitle`, the short
label navigation shows. Set both in front matter. For imported notes, write
them in the vault note; the importer copies them to `content/` (see
[note imports](runbook.md)). For repo-authored pages, write them in the page
under `content/`.

```yaml
---
title: "Evidence Model for AI Evaluation"
linkTitle: "Evidence Model"
description: "..."
---
```

## Where each name appears

| Field       | Shown in                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`     | Page heading, browser tab (`<title>`), search results, section index lists, previous and next links, agent maps                                                |
| `linkTitle` | Sidebar, breadcrumb and its branch selectors, header sections and More collections, mobile drawer; the sidebar also sorts unweighted entries by it             |
| `seo.title` | Browser tab and search snippets only, replacing `title – Systems & Engineering`; use it rarely, when the page title needs a different form for search engines |

Hugo's `.LinkTitle` falls back to `title`, and the importer copies `title` into
`linkTitle` when a note has none.

## Rules

1. **Always set `title`.** Without one, the importer builds it from the file name:
   `map-flatmap.md` becomes "Map Flatmap" and `parse-dont-validate.md` becomes
   "Parse Dont Validate". Hyphens, apostrophes, acronyms and code names are lost.
2. **Use title case.** Capitalize major words. Keep articles, coordinating
   conjunctions and short prepositions lowercase unless they come first: "Judgment
   and Findings", "Coverage and Case Design for AI Evaluation". Keep acronyms and
   code identifiers as written: "AI Evaluation", "map and flatMap". Keep hyphenated
   compounds hyphenated: "Type-Driven Design".
3. **Make `title` stand alone.** It appears in tabs and search results without
   the breadcrumb, so it can carry the context the section supplies:
   "Evidence Model for AI Evaluation". Aim for 60 characters or fewer, so search
   results do not cut it off.
4. **Make `linkTitle` short.** The breadcrumb shows the `linkTitle` of every
   ancestor and of the page itself, and wraps long labels instead of cutting
   them. A missing `linkTitle` puts the full title there, so a deep page can push
   the breadcrumb onto several lines. Keep it to one to four words, about 30
   characters at most, so it fits the breadcrumb and the sidebar on one line.
   Drop words the parent section already says: "Framework" under Evaluation,
   "Request Path" for "The Request Path", "Evidence Model" for "Evidence Model
   for AI Evaluation". Drop number prefixes used for ordering ("10 Exploratory
   Pipeline Design" becomes "Exploratory Pipelines"); order with
   `sidebar_weights` instead. When the title is already short, set `linkTitle`
   to the same text.
5. **Name sections in `_index.md`.** A folder without one gets an index named
   from the folder: `type-driven-design` becomes "Type Driven Design" and `ai`
   becomes "Ai". Give every published folder an `_index.md` with `title` and
   `linkTitle`. For an import whose landing page is another note
   (`root_index_source`), that note's front matter names the section; for a
   synthesized root, `section_title` in `scripts/migrate/config.toml` does.
6. **Match or drop the leading `#` heading.** The importer removes a first-line
   `# Heading` that matches `title`, ignoring case and spacing. The page shows
   `title` as its heading unless the body opens with its own `# Heading`; a
   heading that differs from `title` would then replace it, so the page shows one
   name and navigation another. `#` headings further down, used for a note's main
   parts, stay in place below the title.
7. **Label wiki links.** `[[recursion-and-folds]]` renders as "Recursion And
   Folds", built from the file name, not the target's title. Write
   `[[recursion-and-folds|Recursion and folds]]` when the text matters.
8. **Changing a title does not move the page.** The URL comes from the file and
   folder names. When you rename or move a published note, add its old path to
   `aliases` as a YAML block list of URL paths, so the old link redirects:

   ```yaml
   aliases:
     - "/engineering/ddd/declarative/"
   ```

   Obsidian's own `aliases` (alternative note names such as
   `aliases: [semigroup_monoid]`) become broken Hugo redirects; remove them from
   published notes.

## Checking

After an import, list the pages whose title was built from the file name or
whose body still opens with a different heading:

```bash
task content:migrate:check
```

Then read `title:`, `linkTitle:` and the first body line of each new file under
`.migration/work/content/`. A `linkTitle` over 30 characters, or one identical
to a long `title`, needs a shorter label. In the preview, compare the sidebar, breadcrumb,
page heading and browser tab for each new section.
