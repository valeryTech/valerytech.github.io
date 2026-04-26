---
draft: false
toc: true
title: "How To Structure Context For Ai Agents Without Wasting Tokens"
linkTitle: "How To Structure Context For Ai Agents Without Wasting Tokens"
---


source: "https://medium.com/@lnfnunes/how-to-structure-context-for-ai-agents-without-wasting-tokens-16dd5d333c8d"

published: 2026-01-25

created: 2026-03-05

[Sitemap](https://medium.com/sitemap/sitemap.xml)

![](https://miro.medium.com/v2/resize:fit:640/format:webp/1*TzxSxOYR9X4crOYRN_iHrA.jpeg)

A practical guide to AGENTS.md, progressive disclosure, and efficient documentation for code agents

> **TL;DR:** Providing context to AI agents is not about writing more documentation -- it's about structuring it better. The **AGENTS.md** standard helps reduce fragmentation across assistants, lower token usage, and make agents more predictable through organization, not complexity.

AI agents are now part of everyday development workflows -- with that shift comes a very practical question: **How do we provide reliable context to machines?**

In most projects, the issue is not lack of information.

It's **too much information, scattered and inconsistently structured**.

### Documentation for humans ≠ documentation for AI agents


Software projects already have READMEs, ADRs, Wikis, and Docs folders.

These remain essential -- **for humans**.

Agents, however, need a different kind of information:

- Direct instructions
- Executable commands
- Explicit constraints

In short:

- **Human documentation** explains *why*
- **Agent documentation** explains *how*

## A shared standard for agent context


To address this, [AGENTS.md](https://agents.md/) emerged as an **open, tool-agnostic standard** for describing how AI agents should operate within a repository.

AGENTS.md does not replace existing docs. It adds an operational layer specifically designed for agents. The idea is simple:

> A single, versioned file inside the repository that serves as the source of truth regarding standards, guidelines, and instructions for any AI agent -- regardless of the assistant being used.

```c
# AGENTS.md (example)
This repository contains a React web application.

- Install deps: \`pnpm install\`
- Start dev server: \`pnpm dev\`
- Run tests: \`pnpm test\`
- TypeScript strict mode
- Single quotes, no semicolons
- Use functional patterns where possible
```


Before a shared standard emerged, the ecosystem looked fragmented ([CLAUDE.md](https://claude.com/blog/using-claude-md-files), [GEMINI.md](https://geminicli.com/docs/cli/gemini-md/)), in many cases, critical context lived only inside prompts... this approach does not scale!

Today, [AGENTS.md](https://agents.md/) is widely adopted across open-source and private repositories as a best practice. Supported natively by most of the assistants (e.g. Codex, Copilot, Cursor, Windsurf...)

A practical workaround is to keep **AGENTS.md as the single source of truth** and create symbolic links for tool-specific files:

```c
ln -s AGENTS.md CLAUDE.md
ln -s AGENTS.md GEMINI.md
```


This avoids duplication and keeps future migration trivial.

### AGENTS.md as a "README for agents"


A useful mental model:

- README -> humans
- **AGENTS.md -> AI agents**

It typically answers questions like:

- What is this project?
- How do I run builds and tests?
- What must never be changed?

By making these rules explicit, AGENTS.md acts as a **clear contract**, reducing inference and unintended behavior.

The root AGENTS.md was never meant to document the entire system:

> \- Give agents a clear, predictable place for instructions.
> \- Keep READMEs concise and focused on human contributors.
> \- Provide precise, agent-focused guidance that complements existing README and docs.

In practice, even if you start with a concise AGENTS.md, it often grows over time as the project evolves. After a few development cycles, another issue usually becomes visible: **context budget**!

Every token in the root AGENTS.md is loaded on **every** request sent to the LLM, regardless of whether that information is relevant to the current task. As the file grows, it directly reduces the amount of context the agent can use to actually solve the problem at hand.

In other words, a large root file doesn't just hurt maintainability -- it actively limits agent performance.

### Progressive disclosure: less context upfront, better results


Instead of placing all instructions in AGENTS.md, provide only the context that is broadly applicable, and leave clear breadcrumbs to more detailed guidance when needed.

The goal is not to make the file as short as possible, but to ensure it contains **only information that is relevant to every task**.At its core, AGENTS.md core principle is **progressive disclosure**:

- Start with minimal, stable context
- Move detailed or specialized rules into separate documents
- Load additional information **only when** the task requires it

Simple Example:

```c
# Files structure
docs/
 ├─ BUILD.md
 ├─ TEST.md
 ├─ CODE_STYLE.md
 ├─ ...
AGENTS.md
README.md
```

```c
# AGENTS.md
This repository contains a React web application.

## Setup and run commands
- Install deps: \`pnpm install\`
- Start dev server: \`pnpm dev\`
[More](/docs/BUILD.md)

## Test commands
- Run tests: \`pnpm test\`
[More](/docs/TESTING.md)

## Code style
- TypeScript strict mode
- Single quotes, no semicolons
- Use functional patterns where possible
[More](/docs/CODE_STYLE.md)

More detailed instructions are located in [/docs](/docs).
```


> The agent reads AGENTS.md first and only consults files in docs/ if the task involves those areas.

### Separating human docs from agent docs


The separation does **not** need to be done by folder, but by intent.

Within the same /docs directory, it's common to have:

**Agent-oriented docs:**

- BUILD, TESTING, STYLE
- Short, operational instructions

**Human-oriented docs:**

- ADRs
- Architectural decisions
- Long-form explanations

AGENTS.md should point **only** to the documentation relevant for execution, preventing agents from loading large narrative texts unnecessarily.

### Nested AGENTS.md: how the standard scales to Monorepos


One important detail of the AGENTS.md standard is that it supports nesting.

In practice, this means that **multiple AGENTS.md files can coexist in the same repository**, each one scoped to a specific directory.

Agents should always apply the **closest** AGENTS.md in the directory tree, optionally inheriting context from higher levels.

This makes AGENTS.md particularly well suited for Monorepos.

```c
AGENTS.md      # global, cross-repo rules
packages/
  web/
    AGENTS.md  # frontend-specific context
  api/
    AGENTS.md  # backend-specific context
docs/
```

### How this fits with progressive disclosure


Nesting works naturally with progressive disclosure:

- Root AGENTS.md -> universal rules
- Package AGENTS.md -> local rules
- Docs -> detailed instructions

> If a rule only applies to one package, it should live in that package's AGENTS.md -- not in the root.

Each level adds context only where it is relevant. This keeps agent behavior predictable without overloading the global context.

### Frontmatter and XML: optional tools, not requirements


In some discussions, two concepts often appear: frontmatter and XML-like tags in Markdown.

**Frontmatter** is a block of structured metadata (usually YAML) at the top of a Markdown file. It describes the file, but is not part of the content itself.

It can help agents decide whether a document is relevant -- but it is entirely optional. AGENTS.md works perfectly without it.

Modern models already understand Markdown structure well.

XML is only useful when you want very explicit boundaries, such as critical rules or hard constraints.

```c
# AGENTS.md -> Optional example

---
domain: testing
tasks: [write-tests]
---

# Testing Guidelines

General guidance for tests in this repository.

```


> **Rule:** If this does not change how the agent behaves in your project, it's probably unnecessary.

### Conclusion


AGENTS.md is not "just another file". It solves a real ecosystem problem: fragmented context across AI assistants.

When context is clear, stable, and progressive:

- Agents behave more predictably
- Tokens are used more efficiently
- Manual prompting becomes the exception

> If a human has to explain something twice to an agent, it's not a model problem -- it's a context problem.

Start simple, evolve as needed, and treat context as part of your system architecture.

> Ready to try AGENTS.md in your project? Visit [agents.md](https://agents.md/) to learn more and see examples from real projects. The format is open, simple, and designed to work with any coding agent or tool you choose.
