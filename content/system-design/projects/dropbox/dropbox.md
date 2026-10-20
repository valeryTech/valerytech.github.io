---
draft: false
toc: true
title: "Dropbox: Personal Preparation Notes"
description: "Personal Dropbox preparation notes on upload, download, synchronization, large files, integrity, workload assumptions, and questions to resolve before completing the design."
linkTitle: "Personal Notes"
---

Partial design and reflection. The [source walkthrough]({{< ref "system-design/projects/dropbox/hello-interview-notes" >}}) is kept separately so its explanation can be compared with an independent attempt.

## Core operations


- Upload a file.
- Download a file.
- Automatically synchronize files across devices.

## Provisional quality and scale assumptions


The initial notes propose:

- Favor availability where delayed visibility is acceptable; define consistency needs separately for the relevant operations.
- Contextualize latency for each operation.
- Support files around 50 GB, motivating a discussion of resumable uploads.
- Preserve data integrity.
- Explore a workload of roughly 200–300 million daily active users.

These are exercise assumptions to confirm, rather than measured workload facts.

## Questions to resolve


- How do the file operations and object sizes lead to a choice of blob storage?
- How soon should an uploaded file become visible on another device?
- Which part of upload or synchronization must complete before the client sees success?
- What request rates and transfer volumes follow from the assumed active users?

## Reflection


Start by solving the core client problems. A source walkthrough can describe a familiar design quickly; during preparation, work through the lower-level reasoning needed to derive the design independently.

Use the [problem-solving checklist]({{< ref "system-design/frameworks/problem-solving-approach" >}}) to keep the client flow visible before adding components.
