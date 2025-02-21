---
contributors: []
date: 2025-02-21T17:37:47.894084
description: Default Description
draft: false
lastmod: 2025-02-21T17:37:47.894084
summary: ''
title: Key Value Store
toc: true
weight: 810
---

There is no perfect design. Each design archieves a specific balance regarding the tradeoffs of the read, write and memory considerations.

Write-through: data is written in cache & DB; I/O completion is confirmed only when data is written in both places Write-around: data is written in DB only; I/O completion is confirmed when data is written in DB Write-back: data is written in cache first; I/O completion is confirmed when data is written in cache; data is written to DB asynchronously (background job) and does not block the request from being processed

terms: \<- should be in the paper

consistent hashing: [system-design > hashing](../system-design.md#hashing)
