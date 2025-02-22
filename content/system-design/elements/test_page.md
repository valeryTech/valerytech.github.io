---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
summary: ''
title: Test Page
toc: true
weight: 810
---

## Callouts

{{< callout context="note" title="information" icon="outline/info-circle" >}}
here we come
other line
{{< /callout >}}

{{< callout context="tip" title="use it" icon="outline/rocket" >}}
other
{{< /callout >}}

{{< callout context="caution" title="Caution" icon="outline/alert-triangle" >}}
If you're
- one
- second
```python
callout_pattern = re.compile()
```
{{< /callout >}}

 

{{< callout context="danger" title="be awsre" icon="outline/alert-octagon" >}}
of these things
{{< /callout >}}

code block example

```python
def convert_callout(match):
    """Convert an Obsidian callout to a Hugo Doks callout format."""
    callout_type = match.group(2).lower()  # Extract callout type (e.g., "info")
    title = match.group(3)  # Extract callout title
    content = match.group(4)  # Extract callout content

    # Remove leading '>' from multi-line content
    content_lines = [line.lstrip("> ").strip() for line in content.split("\n") if line.startswith(">")]
    content = "\n".join(content_lines)

    # Get Doks callout properties or fallback to "note"
    doks_data = doks_callout_mapping.get(callout_type, {"context": "note", "icon": "outline/info-circle"})


```

Test link to learning
[Learning]({{< ref "projects/learning" >}})

[Elements]({{< ref "system-design/elements/elements" >}})

link to heading in current document
[Courses](#courses)

link to heading in other document
[CDN Service]({{< ref "system-design/elements/elements" >}}#cdn)
