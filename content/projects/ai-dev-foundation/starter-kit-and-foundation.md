---
draft: false
toc: true
title: "AI Project Foundation"
description: "Working notes on the AI Project Foundation: an effort to develop shared tools and practices for AI projects, starting from evaluation, system execution, and an expert workbench."
linkTitle: "AI Project Foundation"
---

The **AI Project Foundation** is a working name for the __ we are developing to (support experimentation with AI systems, __ ) and to learn how such systems can be (developed effectively, discovered and delivered successfully(?), __ ).

comment: we do not know whether a common architecture, shared components, or common development practices can be defined across these applications. Their needs and ways of working may differ substantially, and the research may reveal only limited common ground. My approach is **inspired by grounded theory**: start with concrete applications and observations, form tentative concepts, and compare what happens across experiments to understand both recurring patterns and differences between contexts. This is a direction for inquiry, not a claim that we are applying grounded theory as a formal research method. Shared elements are a possibility to investigate, not an expected outcome (?).

For now, the concrete starting points we can name are:

- **evaluation framework**, including an **evaluation subsystem**, as well as org mechanisms, like operating model
- system execution, runners, configurations (gitops, provisional things, manifests #todo get from w.example)
- **Expert Workbench** or **AI Development Workbench** as an umbrella concept that brings evaluations, datasets, and experimentation together. The interactive environment where domain experts and engineers explore system behavior and develop evaluation knowledge together.

## Packaging, Starter Kit and Sharing


The **AI Project Starter Kit** packages a usable implementation of the foundation. It may be one repository or a coordinated set of repositories, with a documented way to assemble them.
