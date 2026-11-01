---
draft: false
toc: true
title: "Callout Resolution Test Note"
description: "A migration test note with one callout per vault kind, plus title, case, fold sign and joined blockquote cases, to trace how each resolves to a site callout."
linkTitle: "Callout resolution"
---

Each callout below names its vault kind in the title. The import turns each one into a `callout` shortcode, and the site maps that shortcode to a theme type, icon and color.

## Blue info callouts

{{< callout context="note" title="note" icon="outline/info-circle" >}}
Imports as `note`, renders as `info`.
{{< /callout >}}

{{< callout context="note" title="info" icon="outline/info-circle" >}}
Imports as `note`, renders as `info`.
{{< /callout >}}

{{< callout context="note" title="question" icon="outline/help-octagon" >}}
Imports as `note` with the question icon.
{{< /callout >}}

{{< callout context="note" title="thumbup" icon="outline/thumb-up" >}}
Imports as `note` with the thumbs-up icon.
{{< /callout >}}

## Purple important callout

{{< callout context="important" title="important" icon="outline/alert-circle" >}}
Imports as `important`, renders as `important`.
{{< /callout >}}

## Green tip callouts

{{< callout context="tip" title="tip" icon="outline/rocket" >}}
Imports as `tip`, renders as `default`.
{{< /callout >}}

{{< callout context="tip" title="advice" icon="outline/rocket" >}}
Imports as `tip`, renders as `default`.
{{< /callout >}}

{{< callout context="tip" title="rule" icon="outline/rocket" >}}
Imports as `tip`, renders as `default`.
{{< /callout >}}

## Amber warning callouts

{{< callout context="caution" title="caution" icon="outline/alert-triangle" >}}
Imports as `caution`, renders as `warning`.
{{< /callout >}}

{{< callout context="caution" title="warning" icon="outline/alert-triangle" >}}
Imports as `caution`, renders as `warning`.
{{< /callout >}}

{{< callout context="caution" title="thumbdown" icon="outline/thumb-down" >}}
Imports as `caution` with the thumbs-down icon.
{{< /callout >}}

## Red error callout

{{< callout context="danger" title="danger" icon="outline/alert-octagon" >}}
Imports as `danger`, renders as `error`.
{{< /callout >}}

## Edge cases

{{< callout context="note" title="steps, an unknown kind" icon="outline/info-circle" >}}
Unknown kinds import as `note`.
{{< /callout >}}

{{< callout context="caution" title="WARNING in capitals" icon="outline/alert-triangle" >}}
Kind matching ignores case, so this imports as `caution`.
{{< /callout >}}

{{< callout context="tip" title="Tip" icon="outline/rocket" >}}
With no title, the import uses the kind as the title: "Tip".
{{< /callout >}}

{{< callout context="danger" title="danger with a fold sign" icon="outline/alert-octagon" >}}
The fold sign is dropped and the callout is always open.
{{< /callout >}}

{{< callout context="note" title="First callout in a joined blockquote" icon="outline/info-circle" >}}
The bare `>` line below keeps the blockquote going, so this callout takes in everything after it.

[!tip] Second callout in the same blockquote
This marker is not at the start of a blockquote, so it stays as text inside the first callout.
{{< /callout >}}

## Marker and title edge cases

{{< callout context="note" title="No space after the quote sign" icon="outline/info-circle" >}}
Vault notes often write `>[!kind]`. The import accepts it.
{{< /callout >}}

{{< callout context="note" title="Note" icon="outline/info-circle" >}}
A fold sign with no title. The title falls back to "Note".
{{< /callout >}}

{{< callout context="tip" title="Title with \"quotes\", **bold**, `code` and a [[callouts|wiki link]]" icon="outline/rocket" >}}
The quotes are kept. The bold, code and wiki link show as literal text, because the import does not render the title as Markdown.
{{< /callout >}}

{{< callout context="caution" title="Empty body" icon="outline/alert-triangle" >}}

{{< /callout >}}


> [!my-kind] Kind with a hyphen
> Kinds must be letters, digits or underscores. The import and Hugo both skip this one, so it renders as a plain blockquote with the marker as text.

{{< callout context="note" title="Marker with no quote sign" icon="outline/info-circle" >}}

{{< /callout >}}


The import makes the line above a callout with an empty body and leaves this line below it. Obsidian shows both lines as plain text.

A paragraph line directly above a callout.

{{< callout context="tip" title="Callout with no blank line above" icon="outline/rocket" >}}
The callout starts on the line after a paragraph.
{{< /callout >}}

## Body edge cases

{{< callout context="note" title="Body with a list, code, a quote and a link" icon="outline/info-circle" >}}
- First item
- Second item

```python
print("inside a callout")
```

> A quote inside the callout.

See the [callout catalog]({{< ref "system-design/integrated-test-pages/callouts" >}}).
{{< /callout >}}

{{< callout context="caution" title="Line after the callout without a quote sign" icon="outline/alert-triangle" >}}
The next line has no `>`.
{{< /callout >}}

Obsidian shows this line inside the callout. The site shows it below the callout.

{{< callout context="note" title="Outer callout" icon="outline/info-circle" >}}
> [!tip] Nested callout
> The import leaves the inner callout as a blockquote. Hugo renders it with the theme alert style, which does not use the site callout colors.
{{< /callout >}}


- A list item with a callout inside it:

  > [!tip] Indented callout
  > The import skips indented markers. Hugo renders this one with the theme alert style, like the nested callout.
