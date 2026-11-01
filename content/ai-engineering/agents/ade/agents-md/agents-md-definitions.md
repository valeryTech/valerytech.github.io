---
draft: false
toc: true
title: "Defining AGENTS.md"
aliases:
  - "/ai-engineering/agents/agents-md/agents-md-definitions/"
description: "How vendors, researchers, and practitioners define AGENTS.md and its per-tool relatives, the dimensions on which their definitions differ, and candidate definitions built from each view, as input for rewriting the design note's definition."
linkTitle: "Definitions"
---
## Definitions in the sources


The sources are grouped by the view each takes. Several take more than one view and are listed under their main one.

### Documentation for agents


- **The AGENTS.md project** ([agents.md](https://agents.md/), stewarded by the Agentic AI Foundation under the Linux Foundation): an open, plain-Markdown format for guiding coding agents, which it calls a *README for agents*. It holds the build steps, tests, and conventions that would clutter a README for people, and it complements that README rather than replacing it. There are no required fields, and the FAQ calls the file living documentation.
- **Chatlatanagulchai et al. 2025b**, *Agent READMEs: An Empirical Study of Context Files for Agentic Coding* ([arXiv:2511.12884](https://arxiv.org/abs/2511.12884)): agent context files are persistent, project-level instruction files that tell an agent how to behave in a repository. They work like a README for agents, and the background section also describes them as the agent's persistent long-term memory. The study of 2,303 files from Claude Code, Codex, and Copilot projects sorts their content into 16 categories in five groups: general, implementation, build, management, and quality.

### Instructions and configuration


- **OpenAI Codex docs**, *Custom instructions with AGENTS.md* ([developers.openai.com](https://developers.openai.com/codex/guides/agents-md), now redirecting to learn.chatgpt.com): extra instructions and context that Codex reads before doing any work. At startup, Codex builds an instruction chain: a global file, then at most one file per directory from the git root down to the working directory. The files are concatenated so that nearer files override, and the total is capped at 32 KiB by default.
- **GitHub Copilot docs**, *Adding repository custom instructions* ([docs.github.com](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)): repository custom instructions give Copilot extra context about how to understand the project and how to build, test, and validate changes. `AGENTS.md` is one form of these, called agent instructions, and the nearest file in the directory tree takes precedence.
- **Cursor docs**, *Rules* ([cursor.com](https://cursor.com/docs/context/rules)): rules are system-level instructions included at the start of the model's context. `AGENTS.md` is one type of rule: a plain Markdown alternative to structured project rules that carry metadata.
- **Chatlatanagulchai et al. 2025a**, *On the Use of Agentic Coding Manifests: An Empirical Study of Claude Code* ([arXiv:2509.14744](https://arxiv.org/abs/2509.14744)): *agentic coding manifests* are configuration files that give the agent project context, an identity, and operational rules. They are specialized Markdown files that define how an assistant should operate in a project. The study covers 253 Claude Code files.
- **Lulla et al. 2026**, *On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents* ([arXiv:2601.20404](https://arxiv.org/abs/2601.20404), abstract only): repository-level configuration artifacts that shape how coding agents behave and operate in a repository.
- **A practitioner's account**, *How I Structure CLAUDE.md After 1000+ Sessions* ([thoughts.jock.pl](https://thoughts.jock.pl/p/how-i-structure-claude-md-after-1000-sessions)): the file is not a prompt but closer to a role definition, setting the rules of engagement for every session.

### Persistent context


- **Claude Code docs**, *How Claude remembers your project* ([code.claude.com](https://code.claude.com/docs/en/memory)): `CLAUDE.md` files are Markdown files that give Claude persistent instructions for a project, a personal workflow, or an organization, read at the start of every session. Claude treats them as context, not as enforced configuration. Anything that must be blocked needs hooks or managed settings.
- **Gemini CLI docs**, *GEMINI.md* ([geminicli.com](https://geminicli.com/docs/cli/gemini-md/)): context files supply instructional context to the model, so instructions need not be repeated in every prompt. They can hold project instructions, a persona, or a style guide, and they are concatenated and sent with every prompt. The page notes that Gemini CLI was replaced by Antigravity CLI for some users in June 2026.
- **Mohsenimofidi et al. 2025**, *Context Engineering for AI Agents in Open-Source Software* ([arXiv:2510.21413](https://arxiv.org/abs/2510.21413), abstract only): AI context files are version-controlled Markdown files that describe project structure, code style, and build and test steps, and are added to every prompt automatically. Instead of sorting content by topic, the study classifies how context is given: descriptive, prescriptive, prohibitive, explanatory, or conditional.
- **Anthropic**, *Effective context engineering for AI agents* ([anthropic.com](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), 2025-09-29): `CLAUDE.md` is the part of Claude Code's context that is loaded up front, in contrast to the files the agent retrieves just in time with search tools.

### Onboarding


- **HumanLayer**, *Writing a good CLAUDE.md* ([humanlayer.dev](https://www.humanlayer.dev/blog/writing-a-good-claude-md), 2025-11-25, and stated to apply to `AGENTS.md`): the model is stateless, so the agent knows nothing about the codebase when a session starts. This file, the only one included by default, onboards it: what the project is and how it is laid out, why it exists, and how to work on it, including commands and verification.
- **The design note's three jobs**, [Three jobs]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#three-jobs): the agent starts every session without the project context a developer builds up during onboarding. The root file supplies the project-specific part: where to look, what differs here, and what done means.

### Map or routing layer


- **OpenAI**, *Harness engineering: leveraging Codex in an agent-first world* ([openai.com](https://openai.com/index/harness-engineering/), 2026-02-11): a single large file failed, so the team treats `AGENTS.md` as the table of contents rather than the encyclopedia. It is about 100 lines, injected into context, and serves mainly as a map with pointers into a structured `docs/` directory, which is the system of record.
- **The practitioner's account above**: the always-loaded file is the routing layer, and reference docs are the encyclopedia.

### Guidance for what the agent would get wrong


- **Claude Code docs**, *Best practices* ([code.claude.com](https://code.claude.com/docs/en/best-practices)): the file costs attention in every session, so it should hold only what Claude cannot find by reading the repository. Examples are exact commands, misleading code, undocumented decisions, and corrections you keep repeating. It is guidance the model weighs, unlike hooks and deny rules, which the harness enforces.
- **Böckeler 2026**, *Context Engineering for Coding Agents* ([martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html), 2026-02-05): `CLAUDE.md` is a rules file that holds the general conventions the agent should follow, loaded at the start of every session. It is guidance rather than instruction, and one of several context features alongside skills, subagents, hooks, and MCP. Its effect still depends on how the model interprets it.
- **Gloaguen et al. 2026**, *Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?* ([arXiv:2602.11988](https://arxiv.org/abs/2602.11988), abstract only): context files generally do not raise task success, and they add more than 20% to inference cost. Agents do follow the files' instructions, but repository overviews do not help. The files are useful mainly for non-standard practices. This is evidence for the view rather than a definition.

## Where the definitions differ


| Dimension | Range in the sources |
| --- | --- |
| What kind of thing it is | Documentation (agents.md, *Agent READMEs*); instructions or configuration (Codex, Copilot, Cursor, *manifests*); context or memory (Claude Code, Gemini CLI, context engineering); a map (harness engineering) |
| Who the agent is | A reader of documentation; an executor of instructions; a model whose context is being filled; a new colleague being onboarded |
| What belongs in it | Everything an agent needs to work in the project (README view); only what the agent cannot infer or would get wrong (Claude Code best practices, Gloaguen et al.); pointers to where the rest lives (map view) |
| Authority | Configuration with precedence rules (Codex, Copilot, Cursor); guidance the model weighs, not enforced (Claude Code, Böckeler) |
| Loading | Sent with every prompt (Gemini CLI, Mohsenimofidi et al.); read at session start (Claude Code, Codex); layered by directory, with nearer files overriding (Codex, Copilot, Cursor) |
| Scope | One open, tool-neutral format (agents.md); one of a family of per-tool files (Claude Code, Gemini CLI, Cursor, Copilot) |
| Kind of statement | Descriptive, prescriptive, prohibitive, explanatory, or conditional (Mohsenimofidi et al.). Most definitions assume prescriptive instructions, while real files mix all five. |

## Candidate definitions


Each candidate takes one view. None is meant to be final; they are material to compare and combine.

### 1. Documentation


> `AGENTS.md` is a repository's documentation for coding agents: a plain Markdown file, kept next to the README, that tells agents how to build, test, and work in the project.

- **Captures:** a familiar frame, neutrality across tools, and the relation to documentation for people.
- **Leaves out:** the per-session cost and the file's limited authority. Judged as documentation, the file invites completeness, which is how files grow too long.

### 2. Instructions


> `AGENTS.md` is a repository-level instruction file that coding agents load into their context before they work, layered by directory, to set project-specific behavior.

- **Captures:** what agents do with the file, and its scoping and precedence.
- **Leaves out:** that nothing enforces the instructions. It suggests configuration semantics that a model does not guarantee.

### 3. Context


> `AGENTS.md` is the part of a coding agent's context that the repository supplies by default: text loaded before the task in every session, and paid for in every session.

- **Captures:** the mechanism and the cost, which drive most of the design rules.
- **Leaves out:** what the text is for.

### 4. Onboarding


> `AGENTS.md` is the onboarding a coding agent receives at the start of every session: the project-specific knowledge that a capable engineer new to the repository would otherwise need a colleague to explain.

- **Captures:** the reader as a competent colleague, and why the file is needed at all.
- **Leaves out:** the cost. Onboarding for people can be long, and this file cannot.

### 5. Correction of defaults


> `AGENTS.md` records where a project departs from what a capable coding agent would assume, and what the agent cannot learn by reading the repository.

- **Captures:** a selection criterion for every line, which matches the Claude Code best practices and the evidence that repository overviews do not help.
- **Leaves out:** navigation, and constraints that agree with common practice but matter too much to leave implicit.

### 6. Map


> `AGENTS.md` is the agents' entry point to a repository's knowledge: a short map that routes them to the canonical docs, commands, and checks.

- **Captures:** progressive disclosure, and the file's relation to the rest of the documentation.
- **Leaves out:** the local defaults and hard constraints that must sit in the file itself rather than behind a link.

### 7. Part of the harness


> `AGENTS.md` is the always-loaded, unenforced layer of a repository's agent harness: guidance the model interprets, alongside the tests, linters, CI, and hooks that enforce.

- **Captures:** the file's authority, and the design note's [system view]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#the-system-around-the-file).
- **Leaves out:** content. On its own, it says more about what the file is not than about what it is.

### 8. Contract


> `AGENTS.md` is the standing agreement between a project and any agent working in it: the defaults to follow, the checks that define done, and when to stop and ask.

The design note's example file is titled "Agent Contract."

- **Captures:** obligations, the definition of done, and escalation.
- **Leaves out:** that a contract implies two parties who agreed and some means of enforcement. The agent agrees to nothing, and nothing enforces the file.
