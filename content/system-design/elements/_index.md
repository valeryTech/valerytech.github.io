---
draft: false
toc: true
title: "System Design Building Blocks"
description: "An index of system design building blocks, linking request routing, API gateways, messaging, scalability, consistency, reliability, identifiers, and study gaps."
linkTitle: "Building Blocks"
---

Start with the [building-block map]({{< ref "system-design/elements/elements" >}}) for the topic structure and a reusable study template.

| Topic | Notes |
| --- | --- |
| Routing and the request path | [DNS, CDN, load balancers, and proxies]({{< ref "system-design/elements/elements" >}}#request-routing-and-delivery) |
| API boundaries | [API gateway]({{< ref "system-design/elements/api-gateway" >}}) |
| Asynchronous communication | [Messaging and events]({{< ref "system-design/elements/messaging" >}}) |
| Growth and capacity | [Scalability]({{< ref "system-design/nfr/scalability" >}}) |
| State visibility | [Consistency]({{< ref "system-design/nfr/consistency" >}}) |
| Failure and recovery | [Reliability and availability]({{< ref "system-design/nfr/reliability-availability" >}}) |
| Identifiers | [Snowflake ID sources]({{< ref "system-design/projects/infra/slowflake-id" >}}) |
| Applying the concepts | [Practice cases]({{< ref "system-design/projects" >}}) |

The [study backlog]({{< ref "system-design/elements/elements" >}}#topics-to-develop) marks topics that need fuller treatment. It is a map of gaps, not a set of completed reference notes.
