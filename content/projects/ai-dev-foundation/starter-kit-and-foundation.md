---
draft: false
toc: true
title: "AI Project Foundation: Working Draft"
description: "Working notes on the AI Project Foundation: an effort to develop shared tools and practices for AI projects, starting from evaluation, system execution, and an expert workbench."
linkTitle: "Working Draft"
---

The **AI Project Foundation** is a working name for an effort to find out which tools and practices AI projects can share, and to build the ones that turn out to be shared. It has two goals: to support experimentation with AI systems, and to learn how such systems can be developed and delivered effectively.

## Approach


We don't know whether a common architecture, shared components, or common development practices exist across these applications. Their needs and ways of working may differ a lot, and the research may find only limited common ground. Shared elements are a possibility to investigate.

The approach is inspired by grounded theory: start with concrete applications and observations, form tentative concepts, and compare what happens across experiments to find both recurring patterns and differences between contexts. We use grounded theory as a direction for inquiry and don't claim to follow it as a formal research method. The [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}#grounded-theory) note describes the same method for building engineering workflows with coding assistants.

## Areas to Compare


These are the first areas we will compare across the applications. Each area may turn out to be shared, partly shared, or specific to one application.

- **Evaluation**: the evaluation framework and the evaluation subsystem, plus organizational mechanisms such as an operating model.
- **System execution**: runners, configurations, GitOps, provisioning, and manifests.
- **Expert Workbench**: an interactive environment where domain experts and engineers explore system behavior and develop evaluation knowledge together. It builds on the evaluations and datasets from the evaluation area and adds experimentation.

## Starter Kit


If shared parts emerge, the **AI Project Starter Kit** packages a usable implementation of them. It may be one repository or a coordinated set of repositories, with a documented way to assemble them. [Phased]({{< ref "projects/phased" >}}) is the first concrete prototype testing how versioned artifact registries, a decoupled runner, and multi-repeat evaluation work together in one repository.

## Open Questions


- Does the second goal include product discovery (finding out what to build), or only engineering delivery?
