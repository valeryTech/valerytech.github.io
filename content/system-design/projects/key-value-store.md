---
draft: false
toc: true
title: "Key-Value Store: Cache Policy Notes"
description: "Introductory key-value-store notes comparing write-through, write-around, and write-back cache policies, with open questions about failures, consistency, and hashing."
linkTitle: "Key-Value Store"
---

A short collection of write-policy notes, rather than a complete key-value-store design. Compare the balance of read, write, and memory requirements in a concrete workload.

## Cache write policies


| Policy | Write path and acknowledgment in the notes |
| --- | --- |
| Write-through | Write to cache and database; acknowledge after both writes complete. |
| Write-around | Write directly to the database, bypassing the cache. |
| Write-back | Write to the cache and acknowledge there; persist to the database asynchronously. |

## Questions to develop


Clarify the failure behavior, consistency, and workload that would favor each policy. Consistent hashing is another topic identified for study; see the [building-block map]({{< ref "system-design/elements/elements" >}}#topics-to-develop) and [distributed-systems notes]({{< ref "engineering/topics/distributed-systems" >}}).

Use the [case template]({{< ref "system-design/projects/case-template" >}}) when developing a full store design.
