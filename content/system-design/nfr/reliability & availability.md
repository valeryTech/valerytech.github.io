---
contributors: []
date: 2025-02-21T18:43:34.178215
description: Default Description
draft: false
lastmod: 2025-02-21T18:43:34.178215
summary: ''
title: Reliability & Availability
toc: true
weight: 810
---

# reliability & availability

## patterns

There are two complementary patterns to support high availability: **fail-over** and **replication**. Active-Passive and Active-Active are two types of redundancy configurations that enable high availability in the event of systems failure.

**Active/passive failover.** Active/passive failover configurations provide a fully redundant instance of each node that is brought online only if its associated primary node fails.
**Active-active failover (Active Redundancy)** In active-active, both servers are managing traffic, spreading the load between them.

**Master-slave replication.**
**Master-master replication.**

Practices & principles.
You wanna make sure that first and foremost that your system doesn't have single point of failure.  => use redundancy

language:
failover plan

sources: fine-grained book,
