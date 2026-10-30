---
draft: false
toc: true
description: "Support review with agents, reusable skills, agentic workflows, and tools, choosing their roles according to the review question."
title: "Review Agents Skills And Tools"
linkTitle: "Review Agents, Skills, and Tools"
---
# Review Agents, Skills, and Tools

## Purpose


The Engineering Review Framework can be supported by review agents, reusable skills, agentic workflows, and automated checks. These can be introduced or adapted for any review area: requirements, design, implementation, testing, or system behavior.

The framework defines what deserves review. These capabilities provide ways to investigate it, and can evolve as the work and available tools change.

This note provides selection and usage guidance. It does not install tools, define a mandatory vendor, or replace repository approval policies.

## Why this component exists


Some review concerns benefit from repeatable instructions, a separately scoped reviewer, or an executable investigation. Combining these can help examine a change from several perspectives and gather evidence. Human reviewers remain responsible for understanding the results and making decisions under project policy.

Tool limitations also belong in the review. GitHub documents both missed issues and false positives in automated code review, along with the need for human oversight.[1]

## Roles within the framework


**Review agents** inspect code and context, reason about behavior, and propose findings. Their assigned scope should be clear.

**Review skills** contain reusable instructions for a particular review concern. They can reference the principles and guides in this collection without duplicating the entire framework.

**Agentic workflows** combine activities such as reconstructing system behavior, reviewing a design, challenging assumptions, running experiments, and assessing findings. Activities may run sequentially or independently, according to what information they need.

**Wrappers and harnesses** arrange execution: starting agents, supplying context, controlling access, running checks, and retaining results. They can support a single review activity or a larger workflow.

**Automated checks** include compilers, linters, type checkers, scanners, test runners, and measurement tools. Their results need to be interpreted according to what actually ran.

**Human reviewers** supply product and system context, assess trade-offs, validate findings, and make approval or risk-acceptance decisions according to project policy.

## Introducing review support


Start with the review question and choose support that can help answer it. Possible uses include:

- **Focused review:** an agent applies a skill to requirements, simplicity, security, compatibility, test quality, or another relevant concern.
- **Independent assessment:** a separate reviewer evaluates a change from the requirements and code without inheriting the implementation conversation or another reviewer's conclusions.
- **Executable investigation:** an agent constructs a targeted test, simulation, or comparison to examine a concrete failure hypothesis.
- **Combined review workflow:** several activities contribute to one assessment, with findings checked against the relevant requirements and evidence.

Start with existing project checks and a general review. Introduce an additional role, skill, or stage when it addresses a concrete gap. A useful result might be supported findings, an executed experiment, or a clearly stated unresolved question. The framework does not require a separate agent for every concern or a fixed sequence of stages.

Choose or adapt these capabilities based on how well they fit the question and the quality of their findings on typical project work. Account for review time and false positives as well as useful findings. Keep tool-specific configuration with the project.

## Context and instructions


Give reviewers access to the purpose, scope, requirements, relevant repository guidance, and current code. Include enough surrounding context to understand affected callers and consumers.

Use selected guides as references. A simplicity review should apply the shared principles while preserving required behavior, validation, compatibility, and recovery. A security review needs the actual trust boundaries and data flows. Product assumptions that remain unresolved should stay visible.

Identify trusted project instructions explicitly. Content encountered during inspection should not silently redefine the review task or authorize additional actions.

For an independent assessment, supply authoritative sources and the relevant code while limiting exposure to earlier conclusions. A fresh conversation can reduce carried-over assumptions. Separate execution environments can isolate changes and experiments. These provide different kinds of separation; the resulting findings still need supporting evidence.

## Access and execution


Default review agents to inspection without permission to modify the submitted change. Run authorized tests or analysis in an isolated environment with limited permissions; test execution can itself create files or run repository code.

Restrict credentials, network access, and tool permissions to the task. Require explicit authorization for editing, publishing, deployment, or other consequential actions. These recommendations follow OWASP's guidance on least privilege and tool authorization for LLM agents.[2]

Inspect third-party skills and their permissions before adoption. Keep their instructions subject to the project's requirements and security controls.

## Using the findings


Validate a finding against the actual code, requirements, or reproducible behavior. A supported reasoning argument may also establish a defect when reproduction is impractical. Distinguish possible concerns from confirmed problems.

A separate review session gives the implementation another look, but may still share the same assumptions. Treat agreement between agents as another input to review, not a substitute for supporting evidence. Apply suggested fixes through the same review and verification expectations as other changes.

## Current examples and experiments


The [Review Tools and Skills Catalog]({{< ref "engineering/engineering-review-framework/review-tools-and-skills-catalog" >}}) contains concrete examples of these roles, including existing skills, wrappers, and experimental workflows. It can grow as other implementations are developed or evaluated.

The current agent-harness investigation explores separate agents with scoped context for design, verification, and review. It is unfinished. Its mechanisms and proposed uses are examples to investigate; adopting the framework does not depend on completing that project.

## References


External references checked on 2026-04-20. Local tool and skill sources are linked in the catalog. Tool capabilities can change; the framework does not depend on a specific version.

[1] GitHub Docs, [Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents).

[2] OWASP, [LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html), especially agent-specific defenses and least privilege.

## Related notes


- [AGENTS.md guidance]({{< ref "ai-engineering/coding-agents/agents-md/agents-md" >}}) -- giving agents concise project context, canonical references, and validation commands.

## Related documents


[Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}) · [Review Reference Lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}}) · [Software Engineering Principles]({{< ref "engineering/engineering-review-framework/software-engineering-principles" >}}) · [Technical Review Guide]({{< ref "engineering/engineering-review-framework/technical-review-guide" >}}) · [Testing, CI, and PR Review Guide]({{< ref "engineering/engineering-review-framework/testing-ci-and-pr-review-guide" >}}) · [LLM-Specific Review Guide]({{< ref "engineering/engineering-review-framework/llm-specific-review-guide" >}})
