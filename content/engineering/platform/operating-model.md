---
draft: false
toc: true
title: "Engineering Operating Model"
description: "A four-layer sketch connecting engineering standards, repository and pipeline enforcement, service readiness, and delivery measurements."
document_status: "draft"
linkTitle: "Engineering Operating Model"
---
An engineering standards system can have four layers:

1. What engineers must do.
2. How repositories and pipelines enforce it.
3. What a service must satisfy before production.
4. How effectiveness is measured.

This sketch is the standards-and-enforcement side of [developer experience]({{< ref "engineering/platform/developer-experience" >}}#standards-and-enforcement): layer 3 corresponds to the [app-platform contract]({{< ref "engineering/platform/twelve-factor" >}}), and layer 4 to the [delivery measures]({{< ref "engineering/platform/developer-experience" >}}#measuring-it).
