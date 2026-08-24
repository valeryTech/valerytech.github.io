---
draft: false
toc: true
title: "Callouts"
linkTitle: "Callouts"
---

This page is the migration regression catalog for callouts.

It covers:

- Doks-documented callout contexts
- Hugo-documented alert syntax that extends beyond Doks
- local migration aliases handled by the current converter

Reference docs:

- [Doks shortcodes: callouts](https://getdoks.org/docs/basics/shortcodes/)
- [Hugo blockquote render hooks: alerts](https://gohugo.io/render-hooks/blockquotes/)

## Doks catalog

{{< callout context="note" title="Note" icon="outline/info-circle" >}}
Doks-documented `note` callout.
{{< /callout >}}

```
> [!note] Note
> Doks-documented `note` callout.
```

{{< callout context="tip" title="Tip" icon="outline/rocket" >}}
Doks-documented `tip` callout.
{{< /callout >}}

```md
> [!tip] Tip
> Doks-documented `tip` callout.
```

{{< callout context="caution" title="Caution" icon="outline/alert-triangle" >}}
Doks-documented `caution` callout.

- First caution item
- Second caution item
{{< /callout >}}

```md
> [!caution] Caution
> Doks-documented `caution` callout.
>
> - First caution item
> - Second caution item
```

{{< callout context="danger" title="Danger" icon="outline/alert-octagon" >}}
Doks-documented `danger` callout.

```bash
npm create thulite@latest -- --template doks
```
{{< /callout >}}

````md
> [!danger] Danger
> Doks-documented `danger` callout.
>
> ```bash
> npm create thulite@latest -- --template doks
> ```
````

## Hugo alert catalog

{{< callout context="note" title="Important" icon="outline/info-circle" >}}
Hugo documents `IMPORTANT`, but Doks does not expose a separate `important` context.
The migration currently maps it to Doks `note`.
{{< /callout >}}

```md
> [!important] Important
> Hugo documents `IMPORTANT`, but Doks does not expose a separate `important` context.
> The migration currently maps it to Doks `note`.
```

{{< callout context="caution" title="Radiation hazard" icon="outline/alert-triangle" >}}
Hugo documents optional fold signs and custom titles in alert designators.
The migration currently preserves the custom title, ignores the fold sign, and maps `warning` to Doks `caution`.
{{< /callout >}}

```md
> [!warning]+ Radiation hazard
> Hugo documents optional fold signs and custom titles in alert designators.
> The migration currently preserves the custom title, ignores the fold sign, and maps `warning` to Doks `caution`.
```

## Local migration aliases

{{< callout context="note" title="Info" icon="outline/info-circle" >}}
Local alias mapped to Doks `note`.
{{< /callout >}}

```md
> [!info] Info
> Local alias mapped to Doks `note`.
```

{{< callout context="note" title="Question" icon="outline/help-octagon" >}}
Local alias mapped to Doks `note` with a help icon.
{{< /callout >}}

```md
> [!question] Question
> Local alias mapped to Doks `note` with a help icon.
```

{{< callout context="note" title="Thumbup" icon="outline/thumb-up" >}}
Local alias mapped to Doks `note` with a thumb-up icon.
{{< /callout >}}

```md
> [!thumbup] Thumbup
> Local alias mapped to Doks `note` with a thumb-up icon.
```

{{< callout context="caution" title="Thumbdown" icon="outline/thumb-down" >}}
Local alias mapped to Doks `caution` with a thumb-down icon.
{{< /callout >}}

```md
> [!thumbdown] Thumbdown
> Local alias mapped to Doks `caution` with a thumb-down icon.
```

## Mapping reference


| Source callout | Documentation origin | Current migrated Doks context |
| --- | --- | --- |
| `note` | Doks, Hugo | `note` |
| `tip` | Doks, Hugo | `tip` |
| `caution` | Doks, Hugo | `caution` |
| `danger` | Doks | `danger` |
| `important` | Hugo | `note` |
| `warning` | Hugo | `caution` |
| `info` | local alias | `note` |
| `question` | local alias | `note` |
| `thumbup` | local alias | `note` |
| `thumbdown` | local alias | `caution` |
