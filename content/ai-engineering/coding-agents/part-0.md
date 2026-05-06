---
draft: false
toc: true
title: "Part 0"
linkTitle: "Part 0"
---
# Part 0: What I understand about working with coding agents after ~60B token events in 9 months


Over the last 9 months, my agentic engineering workflow has consumed roughly:

- 3.51B fresh input tokens
- 56.1B cached input tokens
- 282M output tokens
- 93M reasoning tokens

This scale creates enough surface area to observe recurring patterns: where coding agents help, where they fail, where they create hidden risk, and what kinds of human discipline they require.

My work is also close to the subject itself. I build agentic systems, mostly agent-oriented RAG and semantic reasoning over closed corpora. Around 60% of that work is software engineering and architecture: designing systems, building evaluation harnesses, debugging model behavior, maintaining retrieval pipelines, and turning ambiguous reasoning failures into concrete engineering problems.

Most of the usage came from heavy, high-context engineering sessions: research, design, implementation, evaluation, debugging, and refactoring. For longer workstreams, I also did not rely on a single chat session as "memory." I introduced handoff notes, workstream notes, evaluation artifacts, explicit task state, and other workflow harnesses to make long-running work recoverable. The goal was to prevent a session from becoming the only place where project memory lived.

## Project Understanding


[Project Ownership]({{< ref "ai-engineering/coding-agents/project-ownership" >}})
