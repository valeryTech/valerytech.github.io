---
draft: false
toc: true
title: "Agent guarantees"
description: "Research comparing capabilities, runtime enforcement, and information-flow controls for LLM agents, with examples and limits of enforceable permissions."
linkTitle: "Agent guarantees"
---

Final response from the **Agent guarantees** sub-agent in [Research LLM Programming Languages]({{< ref "ai/design-research/input/research-llm-programming-languages/conversation" >}}). Captured on 2026-04-29 from the signed-in sub-agent viewer. Wording, URLs, headings, lists, and tables are preserved; rich-text formatting is converted to Markdown. Retrieved-reference IDs are retained as written in the report.

---

## Best match: the user’s thesis is already an explicit research proposal

### 1. Martin Odersky et al., “Securing Agents With Tracked Capabilities” — CAIS 2026, published May 26, 2026


Authors: Martin Odersky, Yaoyu Zhao, Yichen Xu, Oliver Bračevac, Cao Nguyen Pham, all EPFL.

Primary sources:

- [Published paper](https://doi.org/10.1145/3786335.3813127)
- [Accessible full paper](https://arxiv.org/html/2603.00991v2)
- [TACIT implementation](https://github.com/lampepfl/tacit)

The arXiv title is “Tracking Capabilities for Safer Agents”; the full text explicitly identifies the changed publication title.

This is almost exactly the requested idea: agents produce Scala 3 programs; a type system tracks access to resources and effects; a compiler checks that generated actions stay within granted authority. The paper explicitly advocates strong expressive typing, enforceable contracts, and modular reasoning independent of model behavior.

It identifies three necessary language properties:

1. Capability safety: permissions cannot be forged or discarded from types.
2. Capability completeness: all relevant effects require permissions.
3. Local purity: selected computations can be proved free of external effects.

Limits: it does not establish output truth or functional correctness; timing and termination side channels are excluded; subprocesses require additional controls. Base capture checking has mechanized soundness proofs, but the paper says further semantic justification is needed for its safe mode. Full multiagent evaluation remains future work.

Useful retrieved refs: turn11search0, turn13view1, turn19view1.

### 2. Edoardo Debenedetti et al., “Defeating Prompt Injections by Design” — first posted March 24, 2025; SaTML 2026


Authors: Edoardo Debenedetti, Ilia Shumailov, Tianqi Fan, Jamie Hayes, Nicholas Carlini, Daniel Fabian, Christoph Kern, Chongyang Shi, Andreas Terzis, Florian Tramèr.

Primary sources:

- [Full paper](https://arxiv.org/html/2503.18813v2)
- [Author publication page identifying SaTML 2026](https://www.floriantramer.com/publications/camel25/)
- [Implementation](https://github.com/google-research/camel-prompt-injection)

CaMeL puts a custom Python interpreter around an LLM. It separates planning from processing untrusted content, tracks data origins and allowed recipients, and checks policies when tools execute. This directly supports the proposition that inspectable conventional software can enforce properties without making model internals interpretable.

Limits: trusted user request and uncompromised initial memory; no guarantee that a summary is truthful; data and control flow policies do not solve every harmful textual output. The public implementation is a research artifact whose authors explicitly warn it may contain security bugs.

Useful refs: turn2search1, turn2search2, turn7view2.

### 3. Haoyu Wang, Christopher M. Poskitt, Jun Sun, “AgentSpec: Customizable Runtime Enforcement for Safe and Reliable LLM Agents” — ICSE 2026


First preprint March 24, 2025; conference April 12–18, 2026.

Primary sources:

- [Official conference entry](https://conf.researchr.org/details/icse-2026/icse-2026-research-track/29/AgentSpec-Customizable-Runtime-Enforcement-for-Safe-and-Reliable-LLM-Agents)
- [Author-hosted paper](https://cposkitt.github.io/files/publications/agentspec_llm_enforcement_icse26.pdf)
- [ArXiv](https://arxiv.org/abs/2503.18666)

A small domain-specific language defines triggers, predicates, and enforcement actions. Examples include blocking an operation or requiring human inspection before an agent modifies sensitive information. Policies are external to the LLM, inspectable, modular, and evaluated at execution checkpoints.

This is a strong example for “agent should not delete something” or “deletion requires approval.”

Limits: reliability depends on the written rules, their predicates, and interception coverage. Some enforcement options themselves use LLM reflection, so the framework as a whole should not be described as guaranteeing arbitrary semantic safety. The paper explicitly lacks analysis of dangerous longer action trajectories.

Useful refs: turn2search4, turn13view3, turn15view3.

### 4. Manuel Costa et al., “Securing AI Agents with Information-Flow Control” — May 29, 2025; revised September 3, 2025


Authors: Manuel Costa, Boris Köpf, Aashish Kolluri, Andrew Paverd, Mark Russinovich, Ahmed Salem, Shruti Tople, Lukas Wutschitz, Santiago Zanella-Béguelin.

Primary sources:

- [ArXiv](https://arxiv.org/abs/2505.23643)
- [Full paper](https://arxiv.org/html/2505.23643v2)
- [Microsoft Research entry](https://www.microsoft.com/en-us/research/publication/securing-ai-agents-with-information-flow-control/)
- [Fides tutorial and code](https://github.com/microsoft/fides)

I verified it as a preprint; do not invent a conference venue.

Fides tracks confidentiality and integrity labels and deterministically checks tool actions. This adds a crucial property beyond basic permissions: an agent permitted to read private data and send messages still must not combine those permissions to leak private data.

Limits: trustworthy labeling, tool wrappers, policy definitions, and configuration are assumed. The paper distinguishes stronger noninterference guarantees from weaker explicit-flow secrecy. A policy that blocks forbidden data contents can still permit leakage through whether an action happens. Avoid calling all IFC policies complete information-flow security.

Useful refs: turn7view1, turn13view2, turn19view2.

### 5. Santiago Zanella-Béguelin et al., “Information-flow control: Moving toward secure, autonomous agents” — Microsoft, June 16, 2026


Authors: Santiago Zanella-Béguelin, Shruti Tople, Mark Russinovich, Aashish Kolluri, Boris Köpf, Manuel Costa.

Primary author blog:

[Information-flow control: Moving toward secure, autonomous agents](https://commandline.microsoft.com/information-flow-control-moving-toward-secure-autonomous-agents/)

A readable explanation by the Fides research team. It explains three steps: label data, propagate labels through derived results, and check policies before acting. It connects these mechanisms to tool permissions, private data, human approvals, and implementations using MCP and agent frameworks.

Particularly relevant to the user’s broader people + software + LLMs point: labels represent who may read data; software maintains those labels; people authorize exceptional sharing; the model supplies task judgments inside those controls.

Useful ref: turn19view3.

## Synthesis for parent


The strongest defensible claim is: LLMs increase the value of explicit, machine-checkable contracts and execution boundaries. Existing papers demonstrate this design; they do not establish an adoption boom for particular languages.

A no-delete guarantee requires every effective deletion route to be mediated: filesystem, API, shell, subprocess, database, and delegated agent. Merely typing a tool as ReadOnly or removing one named delete tool does not suffice if another granted tool can delete. Strong types become a security mechanism when the runtime preserves their assumptions and denies bypasses.

For reading order, lead with TACIT, then AgentSpec, then CaMeL/Fides. All directly address deployed agent systems; generic work about verifying AI-generated application code is a separate, adjacent argument.
