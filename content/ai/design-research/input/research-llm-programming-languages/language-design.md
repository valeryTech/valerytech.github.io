---
draft: false
toc: true
title: "Language design"
description: "A survey of agent-language proposals and their use of types, effects, capabilities, protocols, and traces, helping readers compare enforceable properties and limitations."
linkTitle: "Language design"
---

Final response from the **Language design** sub-agent in [Research LLM Programming Languages]({{< ref "ai/design-research/input/research-llm-programming-languages/conversation" >}}). Captured on 2026-10-29 from the signed-in sub-agent viewer. Wording, URLs, headings, lists, and tables are preserved; rich-text formatting is converted to Markdown. Retrieved-reference IDs are retained as written in the report.

---

## Recommended sources

### 1. ETAS: An Effect-Typed Language for Agent Systems — closest match to the entire idea


Huiri Tan, Yikun Wang, Puyang Zhang, Shangyu Li, Jiasi Shen. 20 July 2026; arXiv preprint, in submission.

- Paper: [https://arxiv.org/abs/2607.17780](https://arxiv.org/abs/2607.17780)
- Author’s publication listing confirming submission status: [https://hr.tan.pub/](https://hr.tan.pub/)
- Implementation and limitations: [https://github.com/etas-project/etas](https://github.com/etas-project/etas)
- Relevant retrieved refs: turn22academia7, turn22search3, turn23search3.

ETAS makes agents, tools, prompts, typed memory, human approvals, policies, and action traces explicit language elements. It distinguishes ordinary computation, nondeterministic model calls, and external actions. Its types record effects and requested-action traces; policies express allowed, forbidden, and ordered actions. Checks that depend on dynamic resources remain runtime obligations.

Suggested wording: “This paper proposes almost exactly the programming-language foundation you describe, including humans, model calls, external tools, permissions, and inspectable execution traces.”

Maturity caveat: Do not call it a mature or fully verified platform. The author lists it as in submission. The repository calls it an early research prototype and says protocol-state analysis, full concurrency, and its production runtime remain incomplete. The abstract says it states safety theorems. I could not retrieve its full paper to establish the strength/completeness of proofs. A secondary summary claims mechanization is future work; don’t rely on that without verifying the paper.

### 2. A Road Map for Tamed Interactions with Large Language Models — strongest established publication for the conceptual argument


Vincenzo Scotti, Jan Keim, Tobias Hey, Andreas Metzger, Anne Koziolek, Raffaela Mirandola. ACM Transactions on Software Engineering and Methodology, 35(9), article 279, 21 August 2026.

- Primary publisher URL: [https://doi.org/10.1145/3832776](https://doi.org/10.1145/3832776)
- Relevant retrieved refs: turn14search0, turn16search0, turn18search1.

It argues for LLM Scripting Language (LSL), making interaction structure explicit and inspectable, analyzable, and governable. It separates deterministic control flow from probabilistic generation and gives context, output constraints, and workflow paths explicit semantics. It is especially close to the user’s argument that opaque model internals increase the value of inspectable surrounding software.

Important qualification: This is explicitly a vision and research road map, illustrated with scenarios and a survey of 28 researchers/practitioners. It does not establish broad deployment benefits or language-adoption trends. It expressly excludes guarantees of factual accuracy and semantic correctness. The paper itself says the limitation in existing approaches concerns appropriate analyzable abstractions, not raw expressive power.

Suggested use: Pair this with ETAS: an established argument for the direction, followed by a concrete but immature language proposal.

### 3. Hard-KLAIM: Hardening MCP-Enabled Agentic Workflows with a Locality-Aware Type-and-Effect System for Trace Safety — strongest formal support for agent permissions and human approval


Marco Aldinucci, Andrea Bracciali, Iacopo Colonnelli, Doriana Medić, Alberto Mulone, Luca Roversi, Marco Edoardo Santimaria. Journal of Logical and Algebraic Methods in Programming; available online 9 October 2026, journal pre-proof; article 101191.

- Primary publisher URL: [https://www.sciencedirect.com/science/article/pii/S2352220826000830](https://www.sciencedirect.com/science/article/pii/S2352220826000830)
- DOI: [https://doi.org/10.1016/j.jlamp.2026.101191](https://doi.org/10.1016/j.jlamp.2026.101191)
- Earlier manuscript: [https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7139658](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7139658)
- Relevant retrieved refs: turn9search0, turn14search1, turn18search0.

Models an agent–tool–workflow boundary with effects, capabilities, provenance, and a proposal → approval → commitment → execution protocol. It claims a mechanized Rocq proof of trace safety, including exact approval binding and no capability amplification.

Scope: The proof concerns represented action traces, under assumptions about authoritative declarations, conservative tool schemas, faithful runtime adapters, and administrative closure. It does not establish correctness of model reasoning or permit arbitrary external actions to escape monitoring.

This paper helps substantiate “agent cannot delete” and “human approval must apply to this exact proposed action” better than ordinary data types alone.

## Other sources if needed


| Source | Status | Useful contribution | Limit |
| --- | --- | --- | --- |
| Prompting Is Programming: A Query Language for Large Language Models, Luca Beurer-Kellner, Marc Fischer, Martin Vechev | PLDI 2023 | LMQL combines prompt text, ordinary scripting, control flow, and output constraints under defined language semantics. | Constrained output and orchestration do not by themselves prove factual correctness or authorization. |
| Type-Constrained Code Generation with Language Models, Niels Mündler et al. | PLDI 2025 | Types can guide decoding, with a formal simply typed core and a TypeScript implementation. Reported reduction in compilation errors greater than half. | This is about generated-code well-typedness; it is a different issue from controlling a deployed agent’s authority. |
| Concordat: Typed Sessions for LLM Agents, Milad Sikaroudi | arXiv preprint, 27 October 2026 | Python library makes agent interfaces finite-state protocols, checks calls before side effects, reserves decisions for humans, and tracks budgets across handoffs. | Very recent, limited benchmark, not evidence of broad production reliability; only the mediated tool boundary is covered. |

Primary URLs:

- LMQL: [https://pldi23.sigplan.org/details/pldi-2023-pldi/81/Prompting-Is-Programming-A-Query-Language-for-Large-Language-Models](https://pldi23.sigplan.org/details/pldi-2023-pldi/81/Prompting-Is-Programming-A-Query-Language-for-Large-Language-Models) — turn6search1
- Type-constrained generation: [https://pldi25.sigplan.org/details/pldi-2025-papers/25/Type-Constrained-Code-Generation-with-Language-Models](https://pldi25.sigplan.org/details/pldi-2025-papers/25/Type-Constrained-Code-Generation-with-Language-Models) — turn12view3
- Concordat: [https://arxiv.org/abs/2610.37461](https://arxiv.org/abs/2610.37461) and [https://arxiv.org/html/2610.37461v1](https://arxiv.org/html/2610.37461v1) — turn12view2, turn18view0

## Taxonomy to use in the answer


The useful distinction is what the language makes explicit, followed by where it is enforced:

| Language feature | Property it can express | Enforcement |
| --- | --- | --- |
| Data types and schemas | Tool inputs have the required shape; success and failure are distinguished. | Type checking, decoding constraints, input validation. |
| Effect types | A computation can read files but cannot delete them or send network requests. | Static analysis, plus a faithful runtime controlling effects. |
| Capabilities | The agent has authority over a specific resource or operation. | Unforgeable handles and restricted tool/service credentials. |
| Typestate and protocol types | Approval must precede execution; no execution after cancellation. | Static checking where possible, stateful runtime monitors for dynamic decisions. |
| Refinements and contracts | Amount below limit, path within scope, preconditions satisfied. | Proof/solver checks for static facts; runtime checks for changing facts. |
| Information-flow rules | Sensitive data cannot flow into a public model call or outbound message. | Labels, conservative tracking, policy checks. |
| Linear/affine resources | An approval or budget allocation cannot be duplicated and reused. | Type discipline and runtime accounting. |
| Explicit traces and semantics | Review what was requested, authorized, denied, and committed. | Trace-preserving runtime, inspectable policy, audit storage. |

A static type such as Approved is insufficient when an LLM can simply return {"approved": true} or when unchecked external code can perform actions. The trusted boundary must create authorization evidence and mediate the side effect. The richest general-purpose language is therefore not automatically the best enforcement language; restricted, analyzable policy languages can give stronger practical guarantees.
