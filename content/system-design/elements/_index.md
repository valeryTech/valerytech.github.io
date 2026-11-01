---
draft: false
toc: true
title: "System Design Building Blocks"
description: "An index of system design building blocks organized as design questions: boundaries, data across services, communication, the request path, containing failure, data at scale, and operating services."
linkTitle: "Building Blocks"
---

The building blocks are organized by the design question they answer. Start with the [pattern map]({{< ref "system-design/elements/elements" >}}) for the hub format and for how the questions lead into each other.

| Question | Hub |
| --- | --- |
| One deployable unit or several, and where are the boundaries? | [Architecture style and service boundaries]({{< ref "system-design/elements/boundaries" >}}) |
| Who owns the data, and how do operations and queries span services? | [Data across services]({{< ref "system-design/elements/data-across-services" >}}) |
| How do services talk to each other? | [Service communication]({{< ref "system-design/elements/communication" >}}) |
| How does a request reach a healthy instance? | [The request path]({{< ref "system-design/elements/request-path" >}}) |
| How do you stop a failure from spreading? | [Containing failure]({{< ref "system-design/elements/containing-failure" >}}) |
| How do you store and serve more than one machine can? | [Data at scale]({{< ref "system-design/elements/data-at-scale" >}}) |
| What does each service need in production? | [Operating services]({{< ref "system-design/elements/operating-services" >}}) |

Pattern notes with more detail: [API gateway]({{< ref "system-design/elements/api-gateway" >}}), [messaging]({{< ref "system-design/elements/messaging" >}}), and [control plane and data plane]({{< ref "system-design/elements/control-plane" >}}), which spans the request path, failure handling, and operations.

To prototype, start from [defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}): the default option for each question, when to move past it, and how to test the move. [Common trade-offs]({{< ref "system-design/elements/common-trade-offs" >}}) collects the choices that recur across questions, with the signal that tips each one. The pattern map also shows the [same patterns in engineering and AI/RAG notes]({{< ref "system-design/elements/elements" >}}#same-patterns-in-other-domains).

Quality requirements are the forces behind these choices; see [non-functional requirements]({{< ref "system-design/nfr" >}}). To apply the patterns, use the [practice cases]({{< ref "system-design/projects" >}}).
