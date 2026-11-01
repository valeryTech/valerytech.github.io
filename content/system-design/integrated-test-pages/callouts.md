---
draft: false
toc: true
title: "Callout Migration Test Catalog"
description: "A migration regression catalog showing each supported vault callout kind next to its source, with the shortcode context, theme type and color it imports as."
linkTitle: "Callouts"
---

This page is the migration regression catalog for callouts. Each section shows a rendered callout and the vault source that produced it. Edge cases, such as missing titles, nested callouts and lines without a quote sign, are on the [callout resolution test note]({{< ref "system-design/integrated-test-pages/callout-resolution" >}}).

Reference docs:

- [Obsidian callouts](https://help.obsidian.md/callouts)
- [Hugo blockquote render hooks: alerts](https://gohugo.io/render-hooks/blockquotes/)
- [Hextra callout shortcode](https://imfing.github.io/hextra/docs/guide/shortcodes/callout/)

## Main kinds

{{< callout context="note" title="Note" icon="outline/info-circle" >}}
Imports as `note` and renders as the blue `info` type.
{{< /callout >}}

```md
> [!note] Note
> Imports as `note` and renders as the blue `info` type.
```

{{< callout context="tip" title="Tip" icon="outline/rocket" >}}
Imports as `tip` and renders as the green `default` type.
{{< /callout >}}

```md
> [!tip] Tip
> Imports as `tip` and renders as the green `default` type.
```

{{< callout context="caution" title="Caution" icon="outline/alert-triangle" >}}
Imports as `caution` and renders as the amber `warning` type.

- First caution item
- Second caution item
{{< /callout >}}

```md
> [!caution] Caution
> Imports as `caution` and renders as the amber `warning` type.
>
> - First caution item
> - Second caution item
```

{{< callout context="danger" title="Danger" icon="outline/alert-octagon" >}}
Imports as `danger` and renders as the red `error` type.

```bash
task site:up
```
{{< /callout >}}

````md
> [!danger] Danger
> Imports as `danger` and renders as the red `error` type.
>
> ```bash
> task site:up
> ```
````

{{< callout context="important" title="Important" icon="outline/alert-circle" >}}
Imports as `important` and renders as the purple `important` type.
{{< /callout >}}

```md
> [!important] Important
> Imports as `important` and renders as the purple `important` type.
```

## Kinds that share a type

{{< callout context="note" title="Info" icon="outline/info-circle" >}}
Imports as `note`, like `note`.
{{< /callout >}}

```md
> [!info] Info
> Imports as `note`, like `note`.
```

{{< callout context="caution" title="Radiation hazard" icon="outline/alert-triangle" >}}
Imports as `caution`, like `caution`. The custom title is kept and the fold sign is dropped.
{{< /callout >}}

```md
> [!warning]+ Radiation hazard
> Imports as `caution`, like `caution`. The custom title is kept and the fold sign is dropped.
```

{{< callout context="tip" title="Advice" icon="outline/rocket" >}}
Imports as `tip`, like `tip`. `rule` does the same.
{{< /callout >}}

```md
> [!advice] Advice
> Imports as `tip`, like `tip`. `rule` does the same.
```

## Kinds with their own icon

{{< callout context="note" title="Question" icon="outline/help-octagon" >}}
Imports as `note` with a question icon.
{{< /callout >}}

```md
> [!question] Question
> Imports as `note` with a question icon.
```

{{< callout context="note" title="Thumbup" icon="outline/thumb-up" >}}
Imports as `note` with a thumbs-up icon.
{{< /callout >}}

```md
> [!thumbup] Thumbup
> Imports as `note` with a thumbs-up icon.
```

{{< callout context="caution" title="Thumbdown" icon="outline/thumb-down" >}}
Imports as `caution` with a thumbs-down icon.
{{< /callout >}}

```md
> [!thumbdown] Thumbdown
> Imports as `caution` with a thumbs-down icon.
```

## Mapping reference


| Vault kind | Shortcode context | Theme type | Color | Icon |
| --- | --- | --- | --- | --- |
| `note`, `info` | `note` | `info` | blue | information circle |
| `question` | `note` | `info` | blue | question mark |
| `thumbup` | `note` | `info` | blue | thumbs up |
| `important` | `important` | `important` | purple | exclamation circle |
| `tip`, `advice`, `rule` | `tip` | `default` | green | light bulb |
| `caution`, `warning` | `caution` | `warning` | amber | exclamation |
| `thumbdown` | `caution` | `warning` | amber | thumbs down |
| `danger` | `danger` | `error` | red | ban |
| any other kind | `note` | `info` | blue | information circle |
