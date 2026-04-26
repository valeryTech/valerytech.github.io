---
draft: false
toc: true
title: "Coding Agents"
linkTitle: "Coding Agents"
---

problem: we're creating specifications. but beforehand we don't know exactly what we want to build. So there is a balance between specification detailed and code build. Of course, based on presumption, that other variables are maximized. One part of dev spectrum: start without spec, another: build spec fist from start to finish with all imagined details and relations. How to find this sweet spot? How to help coding agent to find it?

similar point: ## Throughput changes the merge philosophy. The repository operates with minimal blocking merge gates. Pull requests are short-lived. Test flakes are often addressed with follow-up runs rather than blocking progress indefinitely. In a system where agent throughput far exceeds human attention, corrections are cheap, and waiting is expensive.

problem: overengineering. Then ask a question how we could help agent to help itself to prevent it and move in the right direction? Two possible tools here is instructions: step-by-step with how to check in documents or somewhere in the context; then it's loop itself

actions:

- find typical problems -- during reflection, I think. For example, it could be over-engineering.

constantly use and hold a set of engineering principles: start simple, simplicity, minimlism, decoupling, step-by-step (~minimalism in ..)

skills from Hamel

experimentation as a framework (?)

sources: openai, kent beck, ?, bench https://scale.com/blog/swe-atlas (testing, experimenting, ..), orchestrator [symphony](#symphony);

also question: how agent could find if all is done?

stale documentation problem

use domain expert prompts, skills and CI loops;

# goals


end goals: working system, delivered feature.

but also: maintanable code base, observable product, other characteristics? like modularity, etc. one criteria here could be developer (and agent) should be able to quickly and easily understand what is going on.

agent legibility is the goal

# workflows and principles


workflow organization principle: "Human steer, agents execute". To do that, we needed to understand what changes when a software engineering team's primary job is no longer to write code, **but to** design environments, specify intent, and build feedback loops that **allow** Codex agents to do reliable work.

Throughout the development process, humans never directly contributed any code. This became a core philosophy for the team: **no manually-written code**.

## Redefining the role of the engineer


The lack of hands-on human coding **introduced a different kind of engineering work, focused on systems, scaffolding, and leverage**.

Early progress was slower than we expected, not because Codex was incapable, but because the environment was underspecified. The agent lacked the tools, abstractions, and internal structure required to make progress toward high-level goals. The primary job of our engineering team became enabling the agents to do useful work.

In practice, this meant working depth-first: breaking down larger goals into smaller building blocks (design, code, review, test, etc), prompting the agent to construct those blocks, and using them to unlock more complex tasks. When something failed, the fix was almost never "try harder." Because the only way to make progress was to get Codex to do the work, human engineers always stepped into the task and asked: "what capability is missing, and how do we make it both legible and enforceable for the agent?"

Humans interact with the system almost entirely through prompts: an engineer describes a task, runs the agent, and allows it to open a pull request. To drive a PR to completion, we instruct Codex to review its own changes locally, request additional specific agent reviews both locally and in the cloud, respond to any human or agent given feedback, and iterate in a loop until all agent reviewers are satisfied (effectively this is a [Ralph Wiggum Loop ⁠ (opens in a new window)](https://ghuntley.com/loop/)). Codex uses our standard development tools directly (gh, local scripts, and repository-embedded skills) to gather context without humans copying and pasting into the CLI.

Humans may review pull requests, but aren't required to. Over time, we've pushed almost all review effort towards being handled agent-to-agent.

# tools


our standard development tools directly (gh, local scripts, and repository-embedded skills) to gather context without humans copying and pasting into the CLI

# env configuration


Environment configurations in [OpenAI Codex](https://developers.openai.com/codex/cloud/environments/) (specifically the AI agent/cloud platform) define the isolated container, runtime, and tools used for tasks. They allow developers to customize dependencies, pin language versions, set environment variables, securely manage secrets, and use to prepare the environment for coding tasks. [[1](https://developers.openai.com/codex/cloud/environments/#:~:text=Codex%20environments%20control%20what%20Codex%20installs%20and,You%20can%20configure%20environments%20in%20Codex%20settings.), [2](https://developers.openai.com/codex/app/local-environments/), [3](https://developers.openai.com/codex/security/)]

Key aspects of Codex environment configuration include:

- Setup Scripts: Automatically run commands (e.g., , ) when a new worktree/session starts, ensuring dependencies are present.
- Customization: You can configure runtime versions (Python, Node.js) and install necessary tools like linters or formatters.
- Secure Secrets: Secrets are stored with encryption and, in cloud environments, are only accessible during setup, not during the main agent phase.
- Configuration Files: Defined in in the project root.
- Variable Management: Use for mapping literal values and to reference shell-exported variable names, ensuring security.
- Sandbox Control: Configures security, such as network access and file system permissions, particularly for local IDE extensions.

## symphony


https://github.com/openai/symphony

# harness


There isn't an official term for this yet, but I've appreciated the name Mitchell Hashimoto (creator of Terraform, Ghostty, and many other software tools) has used: "[harness engineering](https://mitchellh.com/writing/my-ai-adoption-journey)." A harness is the set of constraints, tools, documentation, and feedback loops that keep an agent productive and on track. Think of it as the difference between dropping a new hire into a company with no onboarding versus one with clear architecture docs, linting rules, a fast CI pipeline, and well-defined module boundaries.

According to Hashimoto, "it is the idea that anytime you find an agent makes a mistake, you take the time to engineer a solution such that the agent never makes that mistake again." And across the examples I've been seeing, four practices keep showing up.

# sdlc


automations tools

- we could move some engines from LLM to more robust platform/base
- as an option we could write a separately deployed (rest)/ cloud service to automate and then write a plugin
- so basically we can decouple some flows to task/workflow state management to a separate service; and also document filing flow - because now it's tighly coupled to the product code in the repo.
- so kind of task management layer
- perhaps we have two separate agents/flows (or even three) : to do work, to manage state, to manage documentation, to do something else..
- agent-native task and project management; knowledge base management;
- so, we have to choose one / several stage graphs for tasks and need to enforce them; as well as documentation/knowledge maintenance

desinging agent-oriented SDLC

we will have agents on each layer. for example for harness layer there will be specified prompts and roles for it. And for product-level layer there will be domain-specific roles and agents. and for example for specification building also...

so we need to build a team of agents and adjust SDLC to the LLM-based agents

every task should go through a set of phases/steps. and at start and end of each step we should set a gate .. where manager (orchestrator) agent will ask domain-specific set of other agents on their output on ... and then route accordingly. rearrange a flow of authority, or information flow..

phase 0. I'll be an orchestrator with lightweight set of operational playbooks per task type

# integration surface definition


The external tool ecosystem is now strong enough to support this shape. Claude Code officially supports hooks, skills, subagents, MCP, and plugin surfaces; Codex officially supports `AGENTS.md`, skills, MCP, and multi-agent workflows. That means you do not need to embed everything inside your repo conventions alone; you can put your control and knowledge services behind MCP/plugin-style interfaces and invoke them from hooks or skills.

# phrases


standard deployment paradigms (Docker/Kubernetes)
