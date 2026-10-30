---
draft: false
toc: true
title: "Programming languages and the design research program"
description: "An alignment review connecting programming-language research to the wider design program, identifying existing overlap, useful additions, limits, and possible studies of enforcement and understanding."
linkTitle: "Programming languages and the design research program"
---

Editorial analysis by Codex, 2026-10-29. This note compares the [exported conversation and reports]({{< ref "ai/design-research/input/research-llm-programming-languages" >}}) with the wider collection. It distinguishes existing ideas, additional precedents, and proposed research questions. The source-check scope is recorded below; the exported text remains unchanged.

The material strongly aligns with the program. It gives concrete mechanisms for the relationship already being investigated: explicit constraints can preserve selected properties while allowing people, models, and software to construct useful combinations. Its main contribution to this collection is a more precise connection between a desired property, its representation, and its enforcement.

It also strengthens a productive question about understanding: **can a shared, executable representation help people discover what they mean, explain their decisions, and revise a system?** The language papers supply mechanisms and some evidence about program generation. The broader claim about human understanding still needs its own study.

## Where it fits


The [research hierarchy]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) separates general theory, a builder method, and applications. Programming-language mechanisms provide examples and possible implementations at those levels.

| Existing strand | Connection to the new material | What the material adds |
|---|---|---|
| [Constraints and composition]({{< ref "ai/design-research/01-foundations/07-constraint-guarantee-and-composition-models" >}}) | Effects, capabilities, and protocols restrict possible behavior so components can rely on stated properties. | Specific systems against which to examine assumptions and composition claims. Their results do not prove the collection's general theory. |
| [Builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | Work requirements lead to candidate contracts, boundaries, and enforcement mechanisms. | A useful mechanism taxonomy that can become a practical design worksheet. |
| [Program authoring and typed planning]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}) | Types and diagnostics help construct and revise programs. | Research on supplying relevant type context and constraining generation before a complete program exists. |
| [Trusted effect boundaries]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) | Authority comes from trusted mechanisms, and consequential actions must pass their checks. | Additional precedents for tracked capabilities, information flow, and approval protocols. |
| [Sensemaking]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}) and [verification]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | A representation can support inquiry, while acceptance and authorization remain distinct. | A hypothesis about using specifications and counterexamples in human–LLM dialogue; this is an extension proposed here. |

Several ideas already have a home. CaMeL and AgentSpec appear in the trusted-boundary note. ETAS is discussed extensively in the [typed functional harness report]({{< ref "ai/design-research/input/harness/type-oriented-functional-harnesses-with-references" >}}). Typed holes, compiler feedback, information-flow types, and proposal/commit separation also appear in the language notes. The new sources make parts of that discussion more concrete; repeated generated summaries are not independent confirmation.

## What deserves more attention

### Three roles for a language


The reports help separate three questions that can otherwise become one broad claim about richer languages:

1. **Producing software:** can language tools help an LLM generate a program that satisfies a specification?
2. **Running a system containing LLMs:** can the surrounding language and runtime restrict operations, data flows, and transitions during execution?
3. **Developing understanding:** can people and models use explicit representations to expose ambiguity, compare alternatives, and refine requirements?

A result about generated-code quality addresses the first question. A permission theorem addresses part of the second. Neither establishes the third. This separation gives the program clearer claims and evaluation targets.

A correct checker can enforce a mistaken specification, and a system can obey every policy while failing to complete the task. Requirements, enforcement, and usefulness each need evidence.

The [typed-holes work](https://arxiv.org/abs/2409.00921) supplies language-server context for incomplete programs and uses diagnostic feedback to refine completions. [Type-constrained generation](https://arxiv.org/abs/2504.09246) uses type rules during decoding. These support an active role for language structure throughout construction, beyond rejecting a finished candidate.

For this program, a useful hypothesis is that a missing typed input, an unmet precondition, or a counterexample can become a question people discuss. For example, a missing prior-period dataset may reveal either missing evidence or a mistaken requirement. Automatically repairing the program would not resolve that distinction by itself.

### Composition exposes failures that individual permissions miss


Permission to read a private document and permission to send a message do not, by themselves, specify whether the document's contents may be included in that message. The composition needs an information-flow policy, including rules for derived summaries and any permitted release of information.

[Fides](https://arxiv.org/html/2505.23643v2) provides a concrete comparison: it tracks confidentiality and integrity, and distinguishes preventing explicit disclosure from stronger guarantees that also constrain information revealed by control flow. This gives the composition strand a precise example in which a chosen restriction changes both security and the tasks the system can perform.

[TACIT](https://arxiv.org/html/2603.00991v2) adds a useful checklist: capabilities must resist forgery, relevant effects must be covered, and restricted computations must preserve their capability limits. Its paper excludes answer correctness and some side channels, and identifies external commands as a separate boundary. These are concrete assumptions to record when moving from a language judgment to a system guarantee.

### Inspectability has several meanings


An explicit artifact may be available to inspect, analyzable by a machine, understandable to a person, or useful for making a decision. Those are distinct properties.

The collaboration branch could investigate whether people can explain why an action is permitted, spot a mismatch between a requirement and its formalization, and revise a rule correctly. Showing more source code or a longer trace does not establish those outcomes. A human approval step likewise records a decision without proving that the person understood the consequences.

This preserves the broader aim in the [introduction]({{< ref "ai/design-research/00-introduction" >}}): supporting thinking and understanding alongside controlled execution. The research should include how people formulate and challenge a contract, as well as how software checks it.

## A concrete bridge to the builder method


Consider an illustrative requirement: a research assistant may analyze private documents and prepare a report; sending it requires approval of the exact report and recipient, and source documents must remain unchanged.

| Desired property | Candidate mechanism | Assumption or remaining question |
|---|---|---|
| Source documents remain unchanged | Restricted capabilities and mediated storage access | Shell commands, APIs, delegated work, and credentials must respect the same boundary. |
| Private information reaches only permitted destinations | Labels propagated through intermediate values, with checks before model calls and outbound actions | Who assigns labels, which services may receive data, and who may authorize release? |
| Approval applies to the intended action | Approval bound to the report revision, recipient, and operation; checks at commitment | What happens after an edit, revocation, retry, or concurrent change? |
| The report supports its claims | Evidence references, task-specific validation, and appropriate review | Valid references alone do not establish that the evidence supports the claims. |
| The user understands the result and its limits | Inspectable evidence, alternatives, and explanations of constraints | This requires observations of understanding and decisions, separate from runtime checks. |

The [Hard-KLAIM publisher abstract](https://www.sciencedirect.com/science/article/pii/S2352220826000830) reports a mechanized trace-safety result covering exact approval binding, capability non-amplification, and provenance under explicit boundary assumptions. It is a close precedent for the approval row. Its guarantee concerns represented traces at the agent–tool–workflow boundary, and depends on authoritative declarations and faithful adapters.

For each row, the builder could record the requirement, formal property, enforcement point, trusted assumptions, known bypasses, counterexample, and evidence. This extends the existing method into something practitioners could use to explain and review a design. It also makes the cost of a constraint visible: a policy may block a useful operation, require escalation, or make a workflow harder to express.

## Possible contribution and studies


A candidate contribution is **a method for choosing and revising representations and enforcement boundaries from the properties a collaborative system needs**, supported by worked cases and evidence about its usefulness.

The language literature raises the bar for claims about typed agents, explicit effects, or approval protocols alone. [ETAS](https://arxiv.org/abs/2607.17780) already treats model calls, approvals, policies, and traces as language elements. Its [repository](https://github.com/etas-project/etas) describes an experimental implementation with incomplete protocol and concurrency work. These are relevant precedents and possible experimental foundations, not a reason to select a new language immediately.

Two bounded studies could connect the material to the existing program:

- **Construction and enforcement:** compare runtime-enforced structured tool calls with typed programs using the same tools, policies, and final runtime checks. Add a separate condition supplying type context during construction. Measure invalid proposals, repair effort, valid-task completion, false rejection, and cost. Include indirect effects, stale approvals, changed recipients, and retries. Finite tests provide evidence about the implementation; they do not establish an all-executions guarantee.
- **Understanding and revision:** compare prose-only requirements with an inspectable contract and concrete examples or counterexamples. Ask participants to identify specification errors, explain permitted behavior, and revise requirements under a changed scenario. Assess correct reasoning and task outcomes separately from reported confidence or satisfaction.

These are proposals for the [language and runtime evaluations]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) and [human-collaboration evaluation]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}). They do not select the program's first experiment.

The forecast that strong languages will become more popular remains separate from these design claims. Useful semantic richness may live in a small DSL, an existing language, a policy system, or a restricted interpreter. The builder question is which distinctions and guarantees the work needs, and what they cost.

## Reading and verification scope


Read the [agent-guarantees report]({{< ref "ai/design-research/input/research-llm-programming-languages/agent-guarantees" >}}) alongside the trusted-boundary note; use [language design]({{< ref "ai/design-research/input/research-llm-programming-languages/language-design" >}}) as a mechanism checklist; use [language thesis]({{< ref "ai/design-research/input/research-llm-programming-languages/language-thesis" >}}) for the adjacent argument about generating and checking software. Continue the practical synthesis in AI systems design.

For this review, primary-source checks covered the relevant TACIT and Fides passages, the typed-holes and type-constrained-generation abstracts, the ETAS abstract and repository status, and the publisher-indexed Hard-KLAIM abstract. TACIT distinguishes proofs for its base capture-checking system from a further soundness argument needed for its safe mode. Hard-KLAIM's proof artifact was not independently checked here. The [LSL publisher material](https://doi.org/10.1145/3832776) supports its placement as a language research roadmap. The remaining bibliography, adoption predictions, and benchmark results were not comprehensively audited or reproduced.

This note is later analysis, separate from the exported reports and their manifest. Its proposed contribution and studies remain open to revision.

The separate conceptual note Representations, composition, and understanding develops candidate foundations for this direction: the constructive role of representations, preservation under composition, shared inquiry, and the role of incompleteness and revision.
