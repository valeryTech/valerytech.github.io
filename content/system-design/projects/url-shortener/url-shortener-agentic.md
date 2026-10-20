---
draft: false
toc: true
title: "URL Shortener: Coding-Agent Experiments"
description: "Notes and prompts from URL-shortener implementation experiments with Roo-Code and Kiro, including planning workflows and questions about evaluating generated code."
linkTitle: "URL Shortener: Coding-Agent Experiments"
---

Implementation workflow experiments and prompts, separate from the [system-design case]({{< ref "system-design/projects/url-shortener" >}}). Tool references retain their original experiment context.

# 1. Roo-Code local service


Prompt to Architect mode in roo-code: I need to build and MVP of url-shortener. It will have minimal functionality: just what need to be implemented to enable Redirect and Write Paths from @/docs/url-shortener.md . Api is specified in @/api/openapi.yaml . About structure: it will be one service with db. Later I'll evolve it to microcervice architecture. Provide a plan to implement High-Level Design and write it to 'docs/plan.md' (for example)

Input: openapi spec (by gemini) and review (full not very structured notes)

output: initial structure;

# II. Kiro Code

# Actions


try to find system prompts from kiro and use them to apply kiro workflow

what should I check?

I don't know how to estimate source code / project quality.

use gpt-5 to discover and get into deep dives
