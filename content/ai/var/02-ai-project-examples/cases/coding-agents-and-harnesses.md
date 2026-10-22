---
draft: false
toc: true
description: "A coding agent's engineering loop links repository changes to execution feedback and review; harnesses manage tools, context, permissions, and session state as the work moves toward integration and delivery."
title: "Coding Agents And Harnesses"
linkTitle: "Coding Agents And Harnesses"
---
# Coding agents and software engineering workspaces


Supporting engineering notes: [[ai-engineering/agents/coding-agents|Coding Agents: Specifications and Workflows]].

Coding agents assist with or perform software engineering work by interacting directly with repositories, development tools, and executable environments.

They can inspect and modify code, navigate project structures, execute commands, run tests, analyze failures, inspect application behavior, and iteratively develop solutions.

**A central characteristic is the ability to work within a programmable environment and use execution feedback to guide subsequent actions.**

The agent may decide which files to inspect, which commands to execute, how to modify an implementation, and what further verification is needed. The extent of this autonomy depends on the task and the constraints imposed by the system.

Unlike systems limited to predefined business operations, coding agents may use general-purpose tools such as shells, interpreters, and programming languages to construct new computational procedures. This flexibility introduces significant requirements for execution isolation, permissions, resource controls, and the management of changes.

## Harnesses and execution environments


An agent harness provides the runtime that connects the LLM to its tools and environment. It can manage the interaction loop, context, tool execution, approvals, session state, and other aspects of agent operation.

The execution environment provides the resources on which the agent works, potentially including filesystems, development tools, dependencies, application instances, browsers, and external integrations.

Sandboxes can isolate execution and restrict access to resources. Version control and isolated workspaces allow changes to be inspected, compared, revised, or discarded.

## Collaboration and verification


Coding agents may work interactively with a developer or perform delegated tasks with limited supervision.

Users can inspect code changes, review execution results, provide corrections, and decide whether to accept or integrate the work.

Verification can involve compilation, automated tests, static analysis, application execution, and human review. Successful execution or passing tests provides evidence about the result, but does not establish correctness beyond what those checks actually cover.

## Engineering workflow questions


The supporting engineering notes raise several open design questions:

- **Specification and discovery:** How much detail is useful before implementation, and how can experimentation refine the specification as understanding develops?
- **Agent legibility:** How should repositories, documentation, tools, and feedback help an agent understand the system and its constraints?
- **Recurring problems:** How can failures such as overengineering or stale documentation inform changes to the harness, environment, and development workflow?
- **Completion and integration:** How can the agent determine that required work is complete and contributes to a delivered feature and a maintainable system?

## Beyond software engineering


The same harness and execution-environment approach can support other work requiring programmable tools, files, persistent state, and iterative execution.

Examples include data analysis, document processing, technical investigation, research, and computational workflows.

**Examples:** Codex, Claude Code, repository-level software engineering agents, and development environments supporting multiple collaborating agents.
