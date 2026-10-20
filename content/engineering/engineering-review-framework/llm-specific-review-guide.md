---
draft: false
toc: true
description: "Review AI-assisted changes for invented APIs, unsupported assumptions, unnecessary complexity, weak tests, and unverified execution claims."
title: "Llm Specific Review Guide"
linkTitle: "Llm Specific Review Guide"
---
# LLM-Specific Review Guide

## Purpose


Describe the additional concerns to consider when large language models (LLMs) assist with implementation, tests, documentation, or review. This note supports the **LLM-specific risks** component of the Engineering Review Framework.

These concerns can also appear in human-written work. Keep them visible when reviewing AI-assisted changes, alongside the same product requirements and engineering standards used elsewhere.

## Why a separate guide is useful


Generated code and explanations need verification. GitHub's documentation identifies inaccurate or insecure suggestions, missed issues, and false positives among the limitations of its agentic features.[1]

This guide collects the concerns that deserve deliberate attention in AI-assisted work. It does not assume that every tool has the same behavior or assign a frequency to any failure mode.

## Main review concerns


| Concern | What belongs here |
| --- | --- |
| Invented or incompatible references | APIs, packages, methods, configuration options, or documented behavior that have not been confirmed against the actual dependency and version. |
| Unsupported assumptions | Business rules, repository behavior, environment capabilities, or compatibility expectations inferred without sufficient context. |
| Unnecessary complexity | Speculative features, premature abstractions, unnecessary dependencies, and structure that exceeds the current requirements. |
| Duplicated functionality | New implementations of capabilities already provided by the repository, standard library, or platform. |
| Scope expansion and inconsistency | Unrelated edits, broad refactoring, changed conventions, or new configuration outside the intended change. |
| Weak or misleading tests | Expectations derived only from the generated implementation, excessive mocking, missing failure cases, and tests weakened or skipped to obtain a passing result. |
| Regressions in safeguards | Removed validation, weakened authorization, swallowed errors, unsafe defaults, and loss of compatibility or data protection. |
| Unsupported execution claims | Statements about tests, benchmarks, deployment, or compatibility without corresponding results from the relevant code and environment. |
| Incorrect review findings | Invented defects, misunderstood contracts, speculative failure scenarios, and suggested fixes that introduce new problems. |

The [Software Engineering Principles]({{< ref "engineering/engineering-review-framework/software-engineering-principles" >}}) note provides the shared guidance on simplicity, scope, and abstraction. Apply that guidance to generated changes without creating a separate design standard for them.

## Establishing the basis for a claim


Use the repository, relevant dependency versions, authoritative documentation, and actual execution results to resolve uncertain claims. Preserve the distinction between observed behavior, code-based reasoning, and an untested assumption.

Review expected behavior independently of how the implementation was produced. A generated test should express an intended contract or requirement. Agreement between generated code, generated tests, and an explanation is insufficient when all three depend on the same unconfirmed assumption.

For reported execution, retain enough context to understand what ran and which revision it covered. Work that was proposed, skipped, or blocked remains distinguishable from completed checks.

## Untrusted instructions and agent access


Prompt injection is an attempt to redirect an agent through content it reads. OWASP includes repository comments, documentation, and change descriptions among possible sources of such instructions.[2]

Keep review material separate from authorized instructions. Enforce permissions outside the model, limit access to secrets and external services, and require appropriate authorization for consequential actions.[2] The companion tools guide describes the framework's approach to agent access.

## Responding to findings


Confirm the relevant behavior before accepting an automated comment or applying a suggested fix. GitHub explicitly recommends reviewing agent feedback and testing suggested code.[1]

Keep corrections focused on the confirmed issue. Revisit affected tests and requirements after the correction. A reviewer can report uncertainty without inventing a defect or demanding an unrelated redesign.

## Scope boundary


This note concerns AI used in the engineering process. A product that itself uses an LLM may need additional product requirements, security analysis, and behavior evaluation. Include those in the relevant product and technical guidance when applicable.

## References


External references checked on 2026-10-20. The concern list and application guidance above are recommendations for this framework, not measured claims about all models.

[1] GitHub Docs, [Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents), especially the limitations and responsible-use guidance.

[2] OWASP, [LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## Related documents


[Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}) · [Review Reference Lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}}) · [Software Engineering Principles]({{< ref "engineering/engineering-review-framework/software-engineering-principles" >}}) · [Testing, CI, and PR Review Guide]({{< ref "engineering/engineering-review-framework/testing-ci-and-pr-review-guide" >}}) · [Review Agents, Skills, and Tools]({{< ref "engineering/engineering-review-framework/review-agents-skills-and-tools" >}})
