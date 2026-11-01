---
draft: false
toc: true
title: "System Design Practice Cases"
description: "A catalog of system design exercises distinguishing substantial walkthroughs, partial designs, focused examples, and queued prompts, with links to reusable references."
linkTitle: "Practice Cases"
---

Attempt a case before reading its walkthrough. Use the [case template]({{< ref "system-design/projects/case-template" >}}) to record your own design, and the [mock-review questions]({{< ref "system-design/interview/mock-interviews" >}}) to identify the next gap.

The status below describes the notes, not a judgment that a design is complete or validated.

## Cases with substantial material


| Case | Material and focus |
| --- | --- |
| [URL shortener]({{< ref "system-design/projects/url-shortener" >}}) | Personal design, NFR explorations, implementation notes, and earlier alternatives. Read/write paths, redirects, identifiers, and caching. |
| [Dropbox]({{< ref "system-design/projects/dropbox" >}}) | Personal preparation notes plus a source walkthrough. Large files, metadata, synchronization, and sharing. |
| [Ticketmaster]({{< ref "system-design/projects/ticketmaster" >}}) | Source walkthrough with additional notes. Booking, reservations, contention, and high-demand events. |
| [Rate limiter]({{< ref "system-design/projects/rate-limiter" >}}) | Reading notes and design outline, including distributed-algorithm questions. |
| [Instagram]({{< ref "system-design/projects/instagram" >}}) | Collected discussion and prompts for further processing. |

## Focused and partial exercises


| Case | Current material |
| --- | --- |
| [TikTok]({{< ref "system-design/projects/tik-tok" >}}) | Requirements-gathering example: objects, mutability, and access patterns. |
| [Code deployment]({{< ref "system-design/projects/code-deployment" >}}) | Requirements, artifact types, API, and scale assumptions. |
| [Job scheduler]({{< ref "system-design/projects/job-scheduler" >}}) | Early requirements and open workload questions. |
| [Public chat room]({{< ref "system-design/projects/chat-room" >}}) | Interview report with an unresolved burst-handling question. |
| [Key-value store]({{< ref "system-design/projects/key-value-store" >}}) | Short notes on cache write policies and trade-offs. |
| [interviewing.io worked example]({{< ref "system-design/projects/iv4-example" >}}) | Source pointer to the guide's end-to-end example. |

## Queued prompts


These entries do not yet contain a design: [interviewing.io product]({{< ref "system-design/projects/interviewing-io" >}}), [live commenting]({{< ref "system-design/projects/live-commenting" >}}), [online file storage]({{< ref "system-design/projects/online-file-storage" >}}), [Spotify]({{< ref "system-design/projects/spotify" >}}), and [WhatsApp]({{< ref "system-design/projects/whatsapp" >}}).

## Reusable technical material


- [Messaging and events]({{< ref "system-design/elements/messaging" >}}).
- [Snowflake ID sources]({{< ref "system-design/projects/infra/slowflake-id" >}}).
