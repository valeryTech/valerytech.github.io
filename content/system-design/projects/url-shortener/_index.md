---
draft: false
toc: true
title: "URL Shortener Design Case"
description: "A guide to URL-shortener design materials, linking the working architecture, competing quality targets, product perspectives, interview checklists, and implementation experiments."
linkTitle: "URL Shortener"
---
## Working design


- [URL-shortener design]({{< ref "system-design/projects/url-shortener/url-shortener" >}}): core requirements, API, baseline read/write flows, and deep-dive questions.
- [NFR explorations]({{< ref "system-design/projects/url-shortener/url-shortener-nfrs" >}}): competing workload and service-target assumptions, with their reasoning.
- [Interview checklist and design skeleton]({{< ref "system-design/projects/url-shortener/url-shortener-additional" >}}): estimation, completion checks, and degradation planning.

## Additional perspectives


- [Requirements and product context]({{< ref "system-design/projects/url-shortener/url-shortener-useful" >}}): core value, enablers, enhancements, user stories, and business context.
- [Consistency and NFR exploration]({{< ref "system-design/projects/url-shortener/url-shortener-nfrs-v0" >}}): reader/writer archetypes, replication, transactional outbox, PACELC, and latency tiers.
- [Implementation experiments with coding agents]({{< ref "system-design/projects/url-shortener/url-shortener-agentic" >}}): Roo-Code and Kiro workflow notes.
- [Earlier full design variants]({{< ref "system-design/archive/url-shortener-design-v0" >}}): preserves the read-first and write-first explanations and original open questions.
- [Earlier key-generation review]({{< ref "system-design/to-sort/sd-reviews" >}}#tiny-url): pre-generated keys, allocation, and concurrency.

The design files contain different assumptions. Choose a coherent set for an attempt and record it explicitly. In particular, availability percentages do not by themselves prescribe a deployment architecture, and a consistency choice needs an operation and user-visible behavior.
