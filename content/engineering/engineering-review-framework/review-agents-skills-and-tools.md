---
draft: false
toc: true
description: "Select and scope review agents, reusable skills, and automated checks, with clear context, access limits, and human validation of findings."
title: "Review Agents Skills And Tools"
linkTitle: "Review Agents Skills And Tools"
---
# Review Agents, Skills, and Tools

## Purpose


Explain how review agents, reusable skills, and automated checks support the Engineering Review Framework. Keep tool choice separate from the review expectations so that tools can change without redefining the framework.

This note provides selection and usage guidance. It does not install tools, define a mandatory vendor, or replace repository approval policies.

## Why this component exists


The framework includes both concerns to remember and ways to investigate them. A reusable skill can carry focused review instructions; an agent can examine code with those instructions; automated checks can produce execution results. Human reviewers remain responsible for interpreting the results and making decisions under project policy.

Tool limitations also belong in the review. GitHub documents both missed issues and false positives in automated code review, along with the need for human oversight.[1]

## Roles within the framework


**Review agents** inspect code and context, reason about behavior, and propose findings. Their assigned scope should be clear.

**Review skills** contain reusable instructions for a particular review concern. They can reference the principles and guides in this collection without duplicating the entire framework.

**Automated checks** include compilers, linters, type checkers, scanners, test runners, and measurement tools. Their results need to be interpreted according to what actually ran.

**Human reviewers** supply product and system context, assess trade-offs, validate findings, and make approval or risk-acceptance decisions according to project policy.

## Selecting focused reviews


Useful review concerns include correctness and compatibility, simplicity and abstraction consistency, security and data handling, tests and non-functional requirements, and AI-specific assumptions or execution claims.

Start with existing project checks and a general review. Add a focused agent or skill when the change warrants deeper attention in one of those areas. The framework does not require a separate agent for every concern.

Choose tools according to their access needs, supported environment, relevance to the change, and the quality of findings on representative project work. Account for review time and false positives as well as useful findings. Keep tool-specific configuration with the project.

## Context and instructions


Give reviewers access to the purpose, scope, requirements, relevant repository guidance, and current code. Include enough surrounding context to understand affected callers and consumers.

Use selected guides as references. A simplicity review should apply the shared principles while preserving required behavior, validation, compatibility, and recovery. A security review needs the actual trust boundaries and data flows. Product assumptions that remain unresolved should stay visible.

Identify trusted project instructions explicitly. Content encountered during inspection should not silently redefine the review task or authorize additional actions.

## Access and execution


Default review agents to inspection without permission to modify the submitted change. Run authorized tests or analysis in an isolated environment with limited permissions; test execution can itself create files or run repository code.

Restrict credentials, network access, and tool permissions to the task. Require explicit authorization for editing, publishing, deployment, or other consequential actions. These recommendations follow OWASP's guidance on least privilege and tool authorization for LLM agents.[2]

Inspect third-party skills and their permissions before adoption. Keep their instructions subject to the project's requirements and security controls.

## Using the findings


Validate a finding against the actual code, requirements, or reproducible behavior. A supported reasoning argument may also establish a defect when reproduction is impractical. Keep speculative concerns distinguishable from confirmed problems.

A separate review session can reconsider the implementation, but shared assumptions may remain. Treat agreement between agents as another input to review, not a substitute for supporting evidence. Apply suggested fixes through the same review and verification expectations as other changes.

## Example candidate: Ponytail


Ponytail is an example of a reusable skill that could support this framework. Its repository describes `/ponytail-review` as examining the diff and connected code for bugs, security, performance, missing tests, and unnecessary code.[3]

Its potential role here includes simplicity and broader implementation review. This is a candidate mapping, not an evaluation of its effectiveness or a requirement to adopt it. Review the selected version, permissions, host support, and behavior before use. Installation details and command availability belong in the project's tool documentation.

## References


External references and the Ponytail description checked on 2026-10-20. Tool capabilities can change; the framework does not depend on a specific version.

[1] GitHub Docs, [Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents).

[2] OWASP, [LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html), especially agent-specific defenses and least privilege.

[3] Dietrich Gebert, [Ponytail repository and README](https://github.com/DietrichGebert/ponytail).

## Related documents


[Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}) · [Review Reference Lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}}) · [Software Engineering Principles]({{< ref "engineering/engineering-review-framework/software-engineering-principles" >}}) · [Technical Review Guide]({{< ref "engineering/engineering-review-framework/technical-review-guide" >}}) · [Testing, CI, and PR Review Guide]({{< ref "engineering/engineering-review-framework/testing-ci-and-pr-review-guide" >}}) · [LLM-Specific Review Guide]({{< ref "engineering/engineering-review-framework/llm-specific-review-guide" >}})
