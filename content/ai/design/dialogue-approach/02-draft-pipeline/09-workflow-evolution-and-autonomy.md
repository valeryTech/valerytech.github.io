---
draft: false
toc: true
title: "Working Ideas: Workflow Evolution and Autonomy"
description: "Open hypotheses about risk-based autonomy and evolving workflows, contrasting deterministic-first design with introducing structure after observing LLM behavior in practice."
linkTitle: "Workflow Evolution"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

These are working hypotheses from the original note: risk as an autonomy factor, guardrails versus main-path logic, and deterministic-first versus LLM-first development.

## Open design ideas


- Possible CQRS-inspired separation for agentic workflows: read-side components could have more autonomy where the risk is lower. Risk could be one factor in deciding the level of agency and autonomy.
- Hypothesis: relying only on guardrails is an antipattern, similar to implementing business logic through exception handling. The relevant logic should be part of the main execution path.
- Open question: how should an LLM workflow be started and developed? One approach begins with fully deterministic flows and adds LLMs where needed. Another starts with an LLM-led flow and adds structure, such as guardrails and graphs, where required. The second resembles grounded theory: features emerge from practice, from the bottom up. The first is a top-down approach; a concern is that it may be restrictive or fragile and exclude useful possibilities.

---

Related: [Three-layer model for task assistance]({{< ref "ai/design/dialogue-approach/01-framing/02-three-layer-model" >}}) · [Action policy, readiness, and execution gates]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/03-action-policy-and-execution-gates" >}}) · [Draft refinement loop]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/01-draft-refinement-loop" >}}).

Original text: [ds.md](/ai/design/dialogue-approach/02-draft-pipeline/09-workflow-evolution-and-autonomy.assets/ds.txt).
