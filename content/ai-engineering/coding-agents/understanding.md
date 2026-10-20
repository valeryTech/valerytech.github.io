---
draft: false
toc: true
title: "Part 0: Observations from ~60B coding-agent token events over nine months"
description: "Introduces the author's coding-agent experience and workstream practices, providing background for the linked argument that project understanding remains a human responsibility."
linkTitle: "Coding-Agent Engineering Observations"
---

This account draws on nine months of the author's agentic engineering work, with roughly:

- 3.51B fresh input tokens
- 56.1B cached input tokens
- 282M output tokens
- 93M reasoning tokens

This scale creates enough surface area to observe recurring patterns: where coding agents help, where they fail, where they create hidden risk, and what kinds of human discipline they require.

The work centers on building agentic systems, mostly agent-oriented RAG and semantic reasoning over closed corpora. Around 60% of that work is software engineering and architecture: designing systems, building evaluation harnesses, debugging model behavior, maintaining retrieval pipelines, and turning ambiguous reasoning failures into concrete engineering problems.

Most of the usage came from heavy, high-context engineering sessions: research, design, implementation, evaluation, debugging, and refactoring. Longer workstreams used handoff notes, workstream notes, evaluation artifacts, explicit task state, and other workflow harnesses to make work recoverable without relying on a single chat session as memory. The goal was to prevent a session from becoming the only place where project memory lived.

## Project Understanding


[Project Ownership]({{< ref "ai-engineering/coding-agents/project-ownership" >}})
