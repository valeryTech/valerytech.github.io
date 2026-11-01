---
draft: false
toc: true
title: "Is a Separate Prompt Registry Needed?"
description: "A sourced decision note on when shared production prompts need a registry, contrasting runtime releases, collaboration, and rollback requirements with simpler repository-based versioning."
linkTitle: "Prompt Registry"
---

A separate prompt registry is only needed once prompts become a shared, fast-changing production surface area (multiple apps/agents, frequent edits, non-engineering contributors, and the need for safe rollouts/rollback). Prompt registries are commonly used to decouple prompts from code so teams can version, review, and deploy prompt changes without full application redeploys.[^1][^2]

## When a registry is worth it


- Multiple prompt versions in production (A/B tests, gradual rollouts, quick rollback) benefit from registry concepts like versions/labels and controlled release.[^3][^4][^1]
- Several teams or roles edit prompts (PMs, content, ops) and need collaboration and access controls separate from code merges.[^5][^2][^1]
- Reproducibility and auditability are required (immutable versions, diffs, "what prompt produced this output") which registries explicitly target.[^2][^3]

## When a separate registry is unnecessary


- Early-stage apps with a small number of prompts changing infrequently can keep prompts in the code repo (or simple config files) and rely on normal CI/CD and code review.[^2]
- If the only requirement is "track changes," Git alone often suffices; the extra registry layer is most useful when runtime updates, rollout controls, and prompt-performance monitoring are also needed.[^3][^2]

## Practical middle ground


- Start by standardizing prompts as templates in-repo, then add lightweight versioning conventions and an internal "prompt catalog" README.[^2] [Phased]({{< ref "projects/phased" >}}) ([`artifacts/registry/prompts/`](https://github.com/valery-judah/phased/tree/main/artifacts/registry/prompts)) illustrates this middle ground in practice: immutable `name@version` Markdown files paired with SHA-256 digests in run and judging lockfiles.
- Move to an off-the-shelf registry (rather than building) when runtime fetching/caching, role-based access, and release labels are needed -- capabilities provided by prompt management tools and registries.[^6][^5][^3]

The decision depends on the number of prompts, how often they change, who edits them, and whether A/B testing is needed.

Additional source references: [^10][^11][^12][^13][^14][^15][^7][^8][^9]

[^1]: [Prompt Registry](https://docs.promptlayer.com/features/prompt-registry/overview)

[^2]: [Prompt Versioning & Management Guide for Building AI Features](https://launchdarkly.com/blog/prompt-versioning-and-management/)

[^3]: [Prompt Registry (MLflow)](https://mlflow.org/docs/latest/genai/prompt-registry/)

[^4]: [Top 5 Prompt Testing and Deployment Workflows for LLM Apps](https://www.getmaxim.ai/articles/top-5-prompt-testing-and-deployment-workflows-for-llm-apps/)

[^5]: [Prompt management (PromptLayer)](https://docs.promptlayer.com/why-promptlayer/prompt-management)

[^6]: [Get Started with Prompt Management (Langfuse)](https://langfuse.com/docs/prompt-management/get-started)

[^7]: [Managing Prompts with the Prompt Registry and Templates](https://learning.sap.com/courses/solve-your-business-problems-using-prompts-and-llms-in-sap-generative-ai-hub/managing-prompts-with-the-prompt-registry-and-templates)

[^8]: [Best practices for designing prompts in BMC HPlatformGPT](https://docs.bmc.com/xwiki/bin/view/Service-Management/Employee-Digital-Workplace/BMC-HPlatformGPT/HPlatformgpt254/Getting-started/Best-practices-for-BMC-HPlatformGPT/Best-practices-for-designing-prompts-in-BMC-HPlatformGPT/)

[^9]: [8 best practices for effective prompt engineering](https://www.knime.com/blog/prompt-engineering)

[^10]: [Prompt reuse starts with a Registry](https://tessl.io/blog/agent-prompts-need-a-registry/)

[^11]: [langfuse/langfuse-docs get-started page on GitHub](https://github.com/langfuse/langfuse-docs/blob/main/pages/docs/prompts/get-started.mdx)

[^12]: [Langfuse Prompt Management: How It Works (+ A Flexible Alternative to Consider)](https://mirascope.com/blog/langfuse-prompt-management)

[^13]: [Prompt engineering best practices: Optimize AI performance and results](https://www.hostinger.com/in/tutorials/prompt-engineering-best-practices)

[^14]: [Open Source Prompt Management (Langfuse)](https://langfuse.com/docs/prompt-management/overview)

[^15]: [Prompt engineering best practices: Data-driven optimization guide (Braintrust)](https://www.braintrust.dev/articles/systematic-prompt-engineering)

## Library sources


- AI agent platform book, *O'Reilly early release, chapters 1-7*
