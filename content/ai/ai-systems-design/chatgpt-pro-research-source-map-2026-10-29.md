---
draft: false
toc: true
title: "Source map for the twenty ChatGPT Pro research questions"
description: "Expanded, question-by-question attachment sets spanning the design research, relocated DSL material, source conversations, critiques, and prototype records."
linkTitle: "Source map for the twenty ChatGPT Pro research questions"
---

This file maps the existing 20 questions to broader source sets for separate research chats. It is an attachment and reading plan. The conversation log records the earlier, smaller submissions; this map does not mean the expanded sets have already been attached to those chats. For continuing those conversations, use the additional-source packets and second questions, chosen through description-catalog review by three agents and checked against the earlier source sets.

The map selects **164 distinct substantive files**. Each question uses the **four common files** below plus **every file in its own table**. File counts in the overview include the common set and count paired notes and comments separately.

## How to use this map in a separate chat


1. Select a question and use its existing full prompt. Its central question is repeated here, with a direct link to the prompt’s location.
2. Attach or add library references for all four common files and all files in that question’s table. Read them in table order: framing and mechanisms, competing accounts and critiques, then cases and evidence.
3. If bundling is more convenient, make one common-background packet and one or more question-specific packets. Include complete source text, the original filename and path, clear source boundaries, and a manifest. Keep a proposal with its paired critique. Retain examples and qualifications; excerpts used to prepare this map are not substitutes for the full attachments.
4. In ChatGPT, a Markdown link to a local filesystem path does not supply the file. Upload the files or packets, or select their actual library references. Attach this question’s section of the map as the reading guide. Do not assume that links inside an attached note load further notes automatically.
5. For a later run, use current local files and record the source date or revision. The prototype logs are evolving records. Reusing an older uploaded packet may omit later corrections.

**Suggested addition to the prompt:**

> Use the attached source map as a reading guide. Consider the full listed set before drawing conclusions. Trace the author’s questions, generated proposals, subsequent objections, and recorded observations separately. Preserve disagreements among the notes. Use the prototypes as bounded cases, and allow the broader conceptual question to change their interpretation. Identify inaccessible sources and claims whose original literature still needs verification.

## Common background for every question


| File | Why it belongs in every conversation |
| --- | --- |
| Purpose and reading map | The author’s purpose: practical system design and the development of understanding, including outcomes before implementation. |
| Representations, composition, and understanding | The current working connection among construction, composition, shared inquiry, incompleteness, and revision. |
| Research scope and hierarchy | The proposed distinction among a general theory, a builder method, and application tracks. |
| Collection critique | The collection-wide objections: compiler validity versus truth, competing design proposals, coverage, provenance, acceptance, and replay. |

The common set supplies context; it is not an agreed specification. The thematic notes contain mixed voices. A `comments` file is later editorial analysis, and sometimes reviews only an added passage rather than the whole sibling note. Saved research reports are sources of arguments and literature leads, not independent confirmation of every claim they repeat. Captured articles and papers have their own authorship. Prototype observations describe recorded activities; handoffs describe proposed work unless their current status says otherwise.

## Question overview


| Question | Topic files | Total with common background |
| --- | ---: | ---: |
| [1. What could unify construction, composition, and understanding?](#q01) | 17 | 21 |
| [2. What makes a representation an instrument of construction?](#q02) | 14 | 18 |
| [3. How do we discover which domain distinctions deserve to exist?](#q03) | 15 | 19 |
| [4. How can formalization help people discover what they mean?](#q04) | 15 | 19 |
| [5. How can structured incompleteness preserve room for discovery?](#q05) | 16 | 20 |
| [6. Under what conditions do constraints increase useful generativity?](#q06) | 15 | 19 |
| [7. What does it mean to preserve meaning under composition?](#q07) | 12 | 16 |
| [8. Can a component be substitutable independently of its use?](#q08) | 16 | 20 |
| [9. What should remain equivalent across languages and representations?](#q09) | 16 | 20 |
| [10. How can a builder derive boundaries from desired properties?](#q10) | 16 | 20 |
| [11. What makes an evidence-backed answer justified?](#q11) | 15 | 19 |
| [12. When has an investigation done enough to answer?](#q12) | 15 | 19 |
| [13. How should language, examples, and direct manipulation work together?](#q13) | 19 | 23 |
| [14. What does it mean for collaboration to improve understanding?](#q14) | 18 | 22 |
| [15. What makes human–model–software work collaborative?](#q15) | 18 | 22 |
| [16. What remains valid when goals, sources, or methods change?](#q16) | 18 | 22 |
| [17. When should independent contributions be merged, compared, or kept in disagreement?](#q17) | 17 | 21 |
| [18. When should a successful example become a reusable program?](#q18) | 16 | 20 |
| [19. What can human interventions teach a system about future automation?](#q19) | 18 | 22 |
| [20. What research contributions can these prototypes credibly support?](#q20) | 30 | 34 |

<a id="q01"></a>

## 1. What could unify construction, composition, and understanding?


**Central question:** Can the three interests support a coherent explanatory account, and where do they require different theories?

**Full prompt:** Question 1 in the question list.

**What this broader set should help examine:** Reconstruct how the inquiry moved from an architecture proposal to a broader account of construction, composition, and understanding. Compare possible unifying mechanisms without requiring every application to share one runtime.

**Attach:** the four common files + the 17 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Problem framing; Architectural framings; Refined research question | Read the original question, alternative architectural framings, and the later objection that the framing had already assumed a solution. |
| Constrained generativity; Constraint guarantee and composition models | Compare the proposed constraint–guarantee relationship with the stronger claim that it explains useful construction. |
| Semantic substrate design report; Architectural least commitment and precedents | Supply the broader precedents: refinement, interfaces, Unix, relational models, capabilities, and replicated data. |
| Augmenting human work; Augmenting human work — comments; Sensemaking and epistemic action | Keep augmentation and sensemaking in view, including the possibility that a changed understanding is the main outcome. |
| Analyze AI System Design — source conversation; Designing LLM Systems — source conversation | Recover the author’s system-design questions and the successive generated interpretations, rather than relying only on the later synthesis. |
| Programming languages and the research program; General conceptual design model — exported report | Compare three roles for representations with the broader work-system design model; treat both syntheses as proposals. |
| Programmable probabilistic agent computation | Use the probabilistic-computation survey as one concrete application and source of research leads, not as the definition of the program. |
| Research method and claim validation; Research method and claim validation — comments | Ask what kind of contribution each proposed connection could support: conceptual, formal, mechanistic, or empirical. |

<a id="q02"></a>

## 2. What makes a representation an instrument of construction?


**Central question:** How does a representation change the useful next moves available to a person or model?

**Full prompt:** Question 2 in the question list.

**What this broader set should help examine:** Examine how representations supply useful next moves during construction. Compare typed gaps, diagnostics, examples, and editable programs; keep information content and feedback timing separate from surface syntax.

**Attach:** the four common files + the 14 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Program authoring and typed planning; Typed DSL and compiler | Connect the authoring and introspection operations to typed intermediate programs, effects, operator contracts, and repair feedback. |
| Declarative programming model; Declarative programming model — comments | Use partial programs and maintained declarations, while examining whether permitted behavior leaves a useful completion available. |
| DSL reliability; Tickloom semantic model and scenario DSL; Tickloom semantic model and scenario DSL — comments | Read the original DSL article with the complete Tickloom case and its critique of compilation, scenario fidelity, and coverage claims. |
| Language thesis — typed holes and constrained generation; Programming languages and the research program | Add the typed-holes and type-constrained-generation research leads, with the distinction between constructing software and improving human understanding. |
| Behavioral types and protocols | Extend constructive reasoning from data types to interaction protocols and behavioral refinement. |
| Composable investigation workspaces; Sensemaking and epistemic action | Compare program construction with composing an investigation and revising a representation during sensemaking. |
| P02 — observations; P02 — next experiment | Use the recorded P02 comparison and its subsequent challenge to test explanations, without treating small completion counts as a general advantage. |

<a id="q03"></a>

## 3. How do we discover which domain distinctions deserve to exist?


**Central question:** When does a richer domain model improve reasoning, and when does it merely repackage the same checks?

**Full prompt:** Question 3 in the question list.

**What this broader set should help examine:** Study how useful domain concepts emerge through implementation, explanation, correction, and disagreement. A richer vocabulary must earn its distinctions through use, and its application to source material remains a judgment.

**Attach:** the four common files + the 15 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Domain semantics and operation contracts; Domain semantics and operation contracts — comments | Start with business meanings and operation descriptions; examine ownership, versioning, conflicting definitions, and enforcement gaps. |
| Semantic kernel | Compare a domain semantic kernel with generic records, and distinguish relational, behavioral, and authority questions. |
| Semantic substrate builder method; Semantic substrate builder method — comments | Read the iterative domain-design passages, especially “The Limits of Upfront Specification” and “Design Is Discovered Through Implementation.” |
| Tickloom semantic model and scenario DSL; Tickloom semantic model and scenario DSL — comments | Use the complete semantic-model/scenario-language case to examine how abstractions and tests develop together. |
| Multirepresentation retrieval and projections; Multirepresentation retrieval and projections — comments | Test the distinction between a useful generated retrieval representation and a justified interpretation of its source. |
| Intent environments and domain boundaries; Intent environments and domain boundaries — comments | Consider domain boundaries and cross-provider meanings without assuming that matching API schemas establishes agreement. |
| Analyze AI System Design — source conversation; Sensemaking and epistemic action | Connect the author’s distinction among domain models, types, and DSLs to the search for representations that make questions answerable. |
| P01 — observations; P01 — next experiment | Read the successive P01 stages and current next experiment; preserve differences between fixture checks, live inference, walkthroughs, and developer rehearsals. |

<a id="q04"></a>

## 4. How can formalization help people discover what they mean?


**Central question:** How should intent and formalization develop together when the original question is unsettled?

**Full prompt:** Question 4 in the question list.

**What this broader set should help examine:** Treat intent as something participants can discover and revise. Track when examples clarify an existing purpose and when they change it, including additions, retractions, and incompatible requirements.

**Attach:** the four common files + the 15 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Language intent and hybrid interaction; Language intent and hybrid interaction — comments | Read the natural-language, examples, and editable-interpretation proposal alongside the critique of silently invented thresholds and assumed agreement. |
| Program authoring and typed planning; Declarative programming model; Declarative programming model — comments | Compare intent compilation with incomplete declarative programs and amendments made while work is running. |
| Multirepresentation retrieval and projections; Multirepresentation retrieval and projections — comments | Use the editable information-need and retrieval examples to examine how evidence can change the question. |
| Sensemaking and epistemic action; Joint activity and collaboration model; Joint activity and collaboration model — comments | Connect sensemaking to clarification and repair of common ground, rather than equating stored context with shared meaning. |
| Edits runs and result use | Follow what happens to pending work and earlier results when the active interpretation changes. |
| Collaborative writing and text assembly; Collaborative writing and text assembly — comments | Use the writing example where intent and context evolve while a formulation is revised; retain the ambiguity about final acceptance. |
| P03 — observations; P03 — next experiment | Examine the actual P03 intent-editing failures and proposed follow-up, including omitted requirements and changes of objective. |

<a id="q05"></a>

## 5. How can structured incompleteness preserve room for discovery?


**Central question:** When should a difficulty lead to completing the work, obtaining evidence, changing the representation, or revising the goal?

**Full prompt:** Question 5 in the question list.

**What this broader set should help examine:** Separate gaps that can be filled within a model from gaps that question the model or purpose itself. Ask whether incompleteness can remain a useful outcome and how people recognize the need to reframe.

**Attach:** the four common files + the 16 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Declarative programming model; Declarative programming model — comments | Read legitimate holes, partial specifications, and the possibility that another constraint removes every permitted completion. |
| Program authoring and typed planning; Language thesis — typed holes and constrained generation; Programming languages and the research program | Compare typed gaps and compiler-guided repair with the broader question of discovering what should be specified. |
| Epistemic contracts for RAG; Bounded corpus evidence synthesis; Bounded corpus evidence synthesis — comments | Distinguish missing evidence, failed processing, incomplete screening, contradictory sources, and qualified findings. |
| Sensemaking and epistemic action; Language intent and hybrid interaction; Language intent and hybrid interaction — comments | Keep undecided preferences and evolving interpretations separate from missing data. |
| Semantic substrate builder method; Semantic substrate builder method — comments | Consider when implementation reveals an inadequate domain abstraction and requires extending the vocabulary. |
| P02 — observations; P03 — observations; P03 — next experiment | Use construction failures and intent-revision cases as different forms of incompleteness; read the proposed next study as a plan. |

<a id="q06"></a>

## 6. Under what conditions do constraints increase useful generativity?


**Central question:** How can limiting local freedom increase what people can successfully build together?

**Full prompt:** Question 6 in the question list.

**What this broader set should help examine:** Compare what constraints rule out with what they make dependably composable. Define useful generativity relative to tasks and properties, and include extension and maintenance costs.

**Attach:** the four common files + the 15 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Constrained generativity; Constraint guarantee and composition models | Read the original general principle and its behavior-space, refinement, composition, and extension-set formulations. |
| Architectural least commitment and precedents; Semantic substrate design report | Compare multiple precedents and the survey’s open questions; avoid treating all examples as instances of one established theorem. |
| Semantic substrate builder method; Semantic substrate builder method — comments | Connect the proposed minimum sufficient constraints to property-specific enforcement and counterexamples from use. |
| DSL reliability; Typed DSL and compiler; Tickloom semantic model and scenario DSL; Tickloom semantic model and scenario DSL — comments | Compare DSL expressivity and validator feedback with the limits of the article’s worked examples. |
| Composable investigation workspaces | Add the author’s objection to a fixed graph or matrix becoming the mandatory mental model for every investigation. |
| Type-oriented and functional harnesses — proposal and comparison; Object-Oriented Harness — captured paper | Compare proposed typed composition with the captured inheritance-and-routing approach. Their performance and software-property claims require different evidence. |
| P04 — observations; P04 — next experiment | Use the row-preserving interface and aggregation challenge to inspect both the benefit and excluded useful work. |

<a id="q07"></a>

## 7. What does it mean to preserve meaning under composition?


**Central question:** Which aspects of evidence, scope, assumptions, and uncertainty can survive combination by construction?

**Full prompt:** Question 7 in the question list.

**What this broader set should help examine:** Distinguish preserved structure, valid source relationships, interpretation, and argumentative support. Ask which guarantees survive composition under explicit assumptions and where the result changes meaning.

**Attach:** the four common files + the 12 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Constraint guarantee and composition models; Behavioral types and protocols; Constrained common substrate | Connect composition laws, behavioral contracts, typed contributions, obligations, and the distinction between proposal and commitment. |
| Typed DSL and compiler; DSL as mediation layer | Compare compiler-level guarantees with registered operator assumptions and execution mediation. |
| Epistemic contracts for RAG; Provenance and argumentation foundations | Read conditional evidence contracts together with provenance and argumentation; a derivation history is not automatically a supporting argument. |
| Agent guarantees — saved research report | Use the information-flow examples as a different kind of composition property, with their stated boundary assumptions. |
| Collaborative writing and text assembly; Collaborative writing and text assembly — comments | Include a natural-language counterexample: individually acceptable fragments can imply something different after assembly. |
| P05 — observations; P05 — next experiment | Read the semantic challenge and next experiment in full, including false acceptance and rejection of valid prose. |

<a id="q08"></a>

## 8. Can a component be substitutable independently of its use?


**Central question:** Which obligations belong to a reusable component, and which emerge from the consumer's question?

**Full prompt:** Question 8 in the question list.

**What this broader set should help examine:** Define replacement relative to what a consumer can observe and needs to accomplish. Allow legitimate implementation differences while making unmet assumptions and task-specific insufficiency visible.

**Attach:** the four common files + the 16 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Behavioral types and protocols; Architectural least commitment and precedents; Constraint guarantee and composition models | Read behavioral refinement, interface expectations, compatibility, and environmental assumptions as alternative accounts of substitutability. |
| Semantic substrate builder method; Semantic substrate builder method — comments | Use the unknown-component tests and the critique of deriving mechanisms directly from a work profile. |
| Investigation language and algebra; Llm operated investigation runtime; Resource aware investigation planning | Connect logical investigation operations to physical implementations, resource costs, and allowed planning substitutions. |
| Multirepresentation retrieval and projections; Multirepresentation retrieval and projections — comments | Examine how ranking and selected representations change which evidence reaches the consumer. |
| Declarative system configuration and instantiation; Declarative system configuration and instantiation — comments | Define which configured system is being replaced and which environment or invocation conditions also affect behavior. |
| Type-oriented and functional harnesses — proposal and comparison; Object-Oriented Harness — captured paper | Compare replaceable effect handlers with specialized harness routing, without assuming their guarantees or evaluation units coincide. |
| P06 — observations; P06 — next experiment | Use the adapter’s conformance and missing rollback evidence to separate contract satisfaction from investigation sufficiency. |

<a id="q09"></a>

## 9. What should remain equivalent across languages and representations?


**Central question:** Which observations define the same system when its code, proposal language, or user-facing representation changes?

**Full prompt:** Question 9 in the question list.

**What this broader set should help examine:** Specify which observations must be preserved across implementations and representations. Separate the implementation language, proposal language, runtime interpretation, and human-facing view.

**Attach:** the four common files + the 16 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Language and formalism choices; Typed DSL and compiler; DSL as mediation layer; Semantic kernel | Read the proposed language roles, typed core, mediation layer, and semantic kernel as distinct design choices. |
| Formal models for agent execution | Compare types, temporal logic, Petri nets, and process models by the behaviors each can describe. |
| Investigation language and algebra; Resource aware investigation planning | Use logical-to-physical investigation planning as a concrete semantic-preservation question. |
| Shared investigation state and views; Stable interface components | Include editable views and stable interface controls as representations whose useful equivalence is not limited to identical output text. |
| Language design — saved research report; Type-oriented and functional harnesses — proposal and comparison; Object-Oriented Harness — captured paper | Compare language mechanisms and complete system designs; retain the different evidential status of a captured paper and a proposed alternative. |
| Tickloom semantic model and scenario DSL; Tickloom semantic model and scenario DSL — comments | Distinguish equivalent scenario declarations, deterministic execution, and correctness of the protocol being tested. |
| P07 — observations; P07 — next experiment | Read the exact-byte Python/Haskell comparison and its limits, including the prose outside the checked projection. |

<a id="q10"></a>

## 10. How can a builder derive boundaries from desired properties?


**Central question:** How far can design proceed from a required property to suitable constraints and enforcement?

**Full prompt:** Question 10 in the question list.

**What this broader set should help examine:** Work from a desired property to candidate representations and enforcement points. Make the required behavioral model, trust assumptions, excluded useful work, and human judgments explicit.

**Attach:** the four common files + the 16 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Semantic substrate builder method; Semantic substrate builder method — comments; Constraint guarantee and composition models | Read the builder method, its critique, and the inverse constraint problem together. |
| Complexity and work structure; Complexity and work structure — comments | Use the work profile to identify possible requirements while questioning unvalidated dimensions and automatic derivation. |
| Verification and acceptance; Layered design model | Distinguish admissibility, result verification, acceptance, authorization, and where a check has enough information to be useful. |
| Trusted effect boundaries; Agent guarantees — saved research report; Language design — saved research report | Compare concrete authority, information-flow, protocol, and capability mechanisms with their trusted boundaries. |
| Formal verification for hybrid systems — report; Programming languages and the research program | Add the formal-verification survey and later alignment analysis; examine specification errors and the difference between enforcement and understanding. |
| Refined research question; General conceptual design model — exported report | Challenge premature commitment to one runtime and compare a work-system-centered derivation. |
| P08 — observations; P08 — next experiment | Read both the information-flow observations and next experiment, including the information supplied to the model in each condition. |

<a id="q11"></a>

## 11. What makes an evidence-backed answer justified?


**Central question:** What connects source material to a conclusion beyond having resolvable citations?

**Full prompt:** Question 11 in the question list.

**What this broader set should help examine:** Follow the full relationship from a source to a defensible conclusion. Include extraction, applicability, conflicting evidence, qualifications, and the opportunity to revise a support judgment.

**Attach:** the four common files + the 15 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Provenance and argumentation foundations; Epistemic contracts for RAG | Start with provenance and argumentation, then examine what evidence certificates can establish under stated operator assumptions. |
| Bounded corpus evidence synthesis; Bounded corpus evidence synthesis — comments | Read corpus, source-precedence, contradiction, and abstention requirements alongside their critique. |
| Multirepresentation retrieval and projections; Multirepresentation retrieval and projections — comments | Examine whether generated claims, hypothetical questions, and retrieval relations preserve the meaning of original passages. |
| Verification and acceptance; Domain semantics and operation contracts — comments | Separate check results and acceptance from the correctness of a domain interpretation. |
| Typed durable inspectable runtimes; Investigation systems and related work | Use the investigation-runtime survey and related systems as research leads; several detailed passages live in the thematic notes already listed. |
| Investigation evaluation and benchmarks; Investigation evaluation and benchmarks — comments | Compare proposed support and omission evaluations, including undisclosed, unregistered, and unused evidence. |
| P05 — observations; P06 — observations | Use composition and retrieval records as concrete counterexamples to equating preserved fields or conformance with support. |
| P09 — research handoff | Use the claim–evidence comparison as a proposed next case. Its handoff reports planned work, not observed outcomes. |

<a id="q12"></a>

## 12. When has an investigation done enough to answer?


**Central question:** How should evidence selection, unresolved questions, and resource limits determine the next step and stopping point?

**Full prompt:** Question 12 in the question list.

**What this broader set should help examine:** Explain when further inquiry would change the answer, when an unresolved result is informative, and when a budget simply prevents continuation. Keep omission, contradiction, and processing failure distinguishable.

**Attach:** the four common files + the 15 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Bounded corpus evidence synthesis; Bounded corpus evidence synthesis — comments | Read the original bounded-corpus requirements, explicit coverage states, and limits of corpus-screening claims. |
| Multirepresentation retrieval and projections; Multirepresentation retrieval and projections — comments; Epistemic contracts for RAG | Connect retrieval representations and candidate histories to evidence obligations and qualified results. |
| Resource aware investigation planning; Database centered runtime | Compare logical requirements with physical retrieval choices, cost estimates, query planning, and durable execution. |
| Typed durable inspectable runtimes | Use the broader investigation survey for the distinction between execution coverage and semantic evidence recall. |
| Investigation evaluation and benchmarks; Investigation evaluation and benchmarks — comments | Read proposed evaluation of critical omissions, false abstention, contradictory evidence, and resource-controlled comparisons. |
| P06 — observations; P06 — next experiment | Use the recorded missing-passage case and recovery attempt to test the meaning of sufficient investigation. |
| P10 — research handoff; P11 — research handoff; P12 — research handoff | Include three planned cases: conflict/coverage, context selection, and stopping under a budget. They are complementary proposals, not results. |

<a id="q13"></a>

## 13. How should language, examples, and direct manipulation work together?


**Central question:** Which interaction forms help people express, inspect, and revise complex intentions with manageable effort?

**Full prompt:** Question 13 in the question list.

**What this broader set should help examine:** Compare language, examples, familiar controls, and generated views as ways to express and revise work. Include the cost of learning the interface and the consistency of edits across views and running computation.

**Attach:** the four common files + the 19 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Language intent and hybrid interaction; Language intent and hybrid interaction — comments | Read the hybrid-interaction argument with its unresolved assumptions about interpretation and user agreement. |
| Shared investigation state and views; Stable interface components; Composable investigation workspaces | Follow the progression from shared views to stable components and freely composed operations; preserve the author’s correction to the initial graph framing. |
| Generated workspaces and application composition; Generated workspaces and application composition — comments | Examine generated workspaces, temporary tools, cross-application semantics, and the unmeasured costs behind the forecast. |
| Application state and computation; Application state and computation — comments; Complex interface reading path; Complex interface reading path — comments | Add application-state rules and practitioner examples, including asynchronous state and the cost of synchronization boundaries. |
| Multirepresentation retrieval and projections; Multirepresentation retrieval and projections — comments | Use editable information needs and coordinated evidence views as concrete interaction cases. |
| Interactive investigation position paper; Interactive investigation position paper — comments | Read the interaction principles and their proposed evaluation, including understanding, diagnosis, correction, and inspection cost. |
| Design observations from hebbia; Design observations from hebbia — comments | Keep the author’s Hebbia observations separate from the generated architecture and product interpretations. |
| P03 — observations; P03 — next experiment | Use the prototype’s terminology and interaction failures as bounded design evidence, with the proposed next comparison. |

<a id="q14"></a>

## 14. What does it mean for collaboration to improve understanding?


**Central question:** How can a system help someone develop a better explanation or mental model, including when no external task is completed?

**Full prompt:** Question 14 in the question list.

**What this broader set should help examine:** Make understanding an outcome that can develop through inquiry, including recognizing a mistaken question. Compare human learning and judgment with system reflection, task completion, and persuasive explanation.

**Attach:** the four common files + the 18 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Sensemaking and epistemic action; Augmentation literature and reading path | Read epistemic action, sensemaking, augmentation, mixed initiative, and the historical research paths. |
| Augmenting human work; Augmenting human work — comments | Examine the shift from producing answers to supporting participation, judgment, and shared work. |
| Research terms and levels of analysis; Research terms and levels of analysis — comments | Use the competing definitions and levels of analysis to avoid collapsing correct performance, understanding, grounding, and agency. |
| Designing LLM Guardrails — source conversation; Preventing overreliance on persuasive AI text — report | Recover the author’s concern about fluent explanations, independent reasoning, and outside checks. Focus on the report’s information-use and evaluation sections; its clinical material addresses a separate question. |
| Modeling Hybrid AI Systems — original research request; Reflection in hybrid AI systems — report | Read the original request with the reflection report; distinguish a system inspecting its operation from a person developing understanding. |
| Human AI collaboration patterns; Human AI collaboration patterns — comments | Compare coaching, shared reasoning, and joint construction, including the possibility that their useful outcomes differ. |
| Human AI collaboration evaluation; Human AI collaboration evaluation — comments; Interactive investigation position paper; Interactive investigation position paper — comments | Combine collaboration and interactive-investigation evaluation proposals, keeping learning, appropriate reliance, correction, and completion separate. |
| P14 — research handoff; P03 — observations | Use the proposed understanding study and the recorded intent-interpretation difficulties. Agent role exercises do not establish human learning. |

<a id="q15"></a>

## 15. What makes human–model–software work collaborative?


**Central question:** How should initiative, information, execution, judgment, and responsibility be distributed and renegotiated?

**Full prompt:** Question 15 in the question list.

**What this broader set should help examine:** Explain how information, execution, judgment, and authority move among participants as work changes. Test whether the proposed categories account for coordination costs, failed handoffs, and useful individual work.

**Attach:** the four common files + the 18 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Joint activity and collaboration model; Joint activity and collaboration model — comments; Human AI collaboration patterns; Human AI collaboration patterns — comments | Read joint activity, common ground, modes of collaboration, and the critiques of completeness and pattern selection. |
| Participant profiles and work allocation; Participant profiles and work allocation — comments | Use task-specific participant profiles while keeping capability, authority, accountability, persistence, and learning distinct. |
| Participant neutral system model; Participant neutral system model — comments | Compare the participant-neutral architecture with the correction that work roles do not require separate agents. |
| Collaborative system design practices; Collaborative system design practices — comments | Connect the model to initiative, steering, inspection, and recovery practices, with their unresolved conditions. |
| Collaboration framework; Collaboration framework — comments | Examine the framework implementation proposal and the gap between declaring a collaboration rule and enforcing it. |
| Collaboration patterns research synthesis; Collaboration patterns research synthesis — comments; Shared runtime landscape | Supply the wider collaboration synthesis and systems landscape while preserving uncertainty about classifications and product claims. |
| Human AI collaboration evaluation; Human AI collaboration evaluation — comments | Use the proposed tests of complementarity, handoffs, review, and directability. |
| P13 — research handoff | Include the proposed task with distributed information, arithmetic, interpretation, and an unresolved handoff assumption. |

<a id="q16"></a>

## 16. What remains valid when goals, sources, or methods change?


**Central question:** How can an inquiry retain useful work while revising its purpose and assumptions?

**Full prompt:** Question 16 in the question list.

**What this broader set should help examine:** Distinguish historical truth about a run from whether its result applies now. Examine semantic dependencies across source, goal, method, configuration, and policy changes, including uncertain effects during recovery.

**Attach:** the four common files + the 18 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Program versions runs and results; Program versions runs and results — comments | Read the task/procedure/provenance graphs, goal revisions, repair histories, and critique of their relationship rules. |
| Edits runs and result use; Application state and computation; Application state and computation — comments | Use the worked out-of-order completion example and separate document, interaction, job, and derived state. |
| Constrained common substrate; Verification and acceptance | Connect revision integrity and purpose-specific acceptance to the reuse of prior contributions. |
| Generalized agent runtime; Generalized agent runtime — comments; Database centered runtime | Compare replay, new execution, checkpointing, retries, and external service behavior. |
| Configuration publishing and version identity; Configuration publishing and version identity — comments; Prompt text composition and registry; Prompt text composition and registry — comments | Add exact component identity, mutable selectors, resolved prompts, and dependency changes that alter behavior without changing the containing file. |
| Long running work failures and field study; Long running work failures and field study — comments | Use the long-running-work taxonomy and its critique to distinguish observed failures from proposed causes. |
| P16 — research handoff; P17 — research handoff | Read the planned source-revision and interrupted-delivery cases as complementary tests of continuity and recovery. |

<a id="q17"></a>

## 17. When should independent contributions be merged, compared, or kept in disagreement?


**Central question:** What forms of collaboration benefit from convergence, and which require preserving alternative interpretations?

**Full prompt:** Question 17 in the question list.

**What this broader set should help examine:** Distinguish combining artifacts from resolving disagreement. Examine how apparently compatible edits can rely on different assumptions, and when preserving alternatives is the more useful result.

**Attach:** the four common files + the 17 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Composable investigation workspaces; Collaborative writing and text assembly; Collaborative writing and text assembly — comments | Compare operation composition with the concrete text-assembly case and the need to review whole-text meaning. |
| Augmenting human work; Augmenting human work — comments; Joint activity and collaboration model; Joint activity and collaboration model — comments | Read shared writing, contribution review, common ground, and repair; acceptance of fragments does not settle the joint argument. |
| Constraint guarantee and composition models; Architectural least commitment and precedents | Use the CRDT and composition precedents while distinguishing convergence from application meaning and editing intent. |
| Provenance and argumentation foundations | Add argumentation and provenance structures for disagreement, support, and invalidation. |
| Investigation evaluation and benchmarks; Investigation evaluation and benchmarks — comments | Use the proposed unreliable-report and private-information cases to examine preservation of dissent and evidence disclosure. |
| Program versions runs and results; Program versions runs and results — comments; Edits runs and result use; Formal models for agent execution | Connect alternatives, complements, and branches to versioned work, concurrent execution, and result applicability. |
| P15 — research handoff | Use the proposed semantic-merge case involving compatible edits, direct collisions, and inconsistent traffic assumptions. |

<a id="q18"></a>

## 18. When should a successful example become a reusable program?


**Central question:** How can provisional model outputs help discover a procedure without becoming an unquestioned specification?

**Full prompt:** Question 18 in the question list.

**What this broader set should help examine:** Examine the transition from a provisional answer to an independently specified, reusable procedure. Include erroneous examples, unseen inputs, maintenance costs, and the possibility that direct programming is preferable.

**Attach:** the four common files + the 16 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Behavioral compilation and specification; Behavioral compilation evaluation and failure modes | Read the complete behavioral-compilation sequence with the oracle problem, underdetermination, overfitting, correlated checking, and the proposed synthetic experiment. |
| Verification and acceptance | Keep teacher fidelity, task correctness, acceptance for a purpose, and authorization distinct. |
| Typed DSL and compiler; Declarative programming model; Declarative programming model — comments; Program authoring and typed planning | Connect the synthesis search space, partial specifications, authoring, and diagnostic feedback. |
| Resource aware investigation planning; Generalized agent runtime; Generalized agent runtime — comments | Examine the economics of compilation and reuse, explicit applicability conditions, and fallback after distribution changes. |
| Program versions runs and results; Program versions runs and results — comments | Read program revisions, execution histories, alternative candidates, and downstream reuse rules. |
| Investigation systems and related work | Compare the proposal with CEGIS, example-based synthesis, abstraction learning, and other saved related-work leads. |
| Language intent and hybrid interaction; Language intent and hybrid interaction — comments | Use examples as a way to communicate intent while preserving what they leave unspecified. |
| P18 — research handoff | Include the planned maintenance-record normalization case with independently checked obligations and held-out examples. |

<a id="q19"></a>

## 19. What can human interventions teach a system about future automation?


**Central question:** How can corrections reveal reusable policies while preserving the context and purpose of the intervention?

**Full prompt:** Question 19 in the question list.

**What this broader set should help examine:** Follow an intervention from local action to interpreted judgment to candidate policy. Preserve task context, disagreements, selective feedback, and the distinction between useful automation and permission to act.

**Attach:** the four common files + the 18 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Exploratory pipeline design and progressive automation; Exploratory pipeline design and progressive automation — comments | Read the successive method formulations and the critique distinguishing design learning from legitimate review of one execution. |
| Inspectable pipeline workbenches; Inspectable pipeline workbenches — comments | Use the workbench’s scenarios, variants, artifacts, interventions, and traces; distinguish an action from its recorded reason. |
| Exploratory pipeline design goals and principles; Exploratory pipeline design goals and principles — comments | Read the complete goals/principles proposal and the critique of repetition, testability, and low risk as sufficient automation conditions. |
| Edits runs and result use; Verification and acceptance | Bind judgments to the relevant revision and purpose, including what changes their applicability. |
| Human AI collaboration patterns; Human AI collaboration patterns — comments; Trusted effect boundaries | Keep coaching, delegation, review, and authority distinct when deciding which work should become automatic. |
| Declarative system configuration and instantiation; Declarative system configuration and instantiation — comments; Evaluation plans and system configuration; Evaluation plans and system configuration — comments | Identify the exact system, conditions, cases, and evaluators used to test a candidate policy. |
| Reflection in hybrid AI systems — report; Object-Oriented Harness — captured paper | Add persistent reflection and harness evolution as contrasting approaches to learning from execution; neither establishes that a human correction is ground truth. |
| P19 — research handoff | Use the planned evidence-selection study with unseen questions and a changed task as a concrete policy-generalization case. |

<a id="q20"></a>

## 20. What research contributions can these prototypes credibly support?


**Central question:** How should the program turn its examples, failures, and revisions into useful knowledge?

**Full prompt:** Question 20 in the question list.

**What this broader set should help examine:** Assess the contribution of the whole program using both its conceptual development and actual prototype records. Compare coherent research paths and identify evidence that could change the account.

**Attach:** the four common files + the 30 files linked below. Every link in a paired row is part of the set.

| Source files | Role in this inquiry |
| --- | --- |
| Research problems and prototypes; Prototype workspace agenda; P01–P08 results and next experiments | Read the conceptual agenda, implementation workspace, and collected P01–P08 follow-up status together; their numbering is not identical to these 20 questions. |
| Research method and claim validation; Research method and claim validation — comments; Research terms and levels of analysis; Research terms and levels of analysis — comments | Define the claim, unit of analysis, competing explanations, and appropriate evidence without treating claim categories as confidence scores. |
| Agent runtime evaluation and benchmarks; Agent runtime evaluation and benchmarks — comments; Investigation evaluation and benchmarks; Investigation evaluation and benchmarks — comments; Human AI collaboration evaluation; Human AI collaboration evaluation — comments | Compare runtime, investigation, and collaboration evaluation. An improvement in one category does not establish the others. |
| Evaluation plans and system configuration; Evaluation plans and system configuration — comments | State the system and evaluation conditions precisely; versioned configuration alone does not establish a valid study. |
| Collaboration framework research routes; Collaboration framework research routes — comments | Read the alternative prototype routes and the critique of inferring durable abstractions merely from repeated names. |
| Exploratory pipeline design and progressive automation; Exploratory pipeline design and progressive automation — comments; Interactive investigation position paper; Interactive investigation position paper — comments | Include research through design, reflective inquiry, and synthesis contributions, together with the limits of publication and novelty claims. |
| P01 — observations; P02 — observations; P03 — observations; P04 — observations | Read the domain, construction, intent, and constraint records directly, including unsuccessful runs and revisions. |
| P05 — observations; P06 — observations; P07 — observations; P08 — observations | Read composition, substitution, language-equivalence, and information-flow records directly; retain what each check leaves outside its guarantee. |
| P20 — research handoff | Use the planned claim-evaluation handoff to propose the next discriminating inquiry, not as an additional observed result. |

## Where the earlier DSL notes now live


All 12 content files in `ai/architecture-dsl-like/dsl-approach/` are short relocation pointers; the thirteenth Markdown file is its index. The table below maps those pointers to the substantive notes used above. Attach the destination, rather than spending an attachment on a pointer. Some original reports were distributed across several thematic notes, so the question sets include those continuations as well.

| Earlier file | Substantive destination | Questions using the destination |
| --- | --- | --- |
| DSLs Enable Reliable Use of LLMs.md | DSL reliability | [Q2](#q02), [Q6](#q06) |
| constrained-generativity-semantic-substrate-design.md | Semantic substrate design report | [Q1](#q01), [Q6](#q06) |
| db-approach.md | Database-centered runtime | [Q12](#q12), [Q16](#q16) |
| declarative-approach.md | Declarative programming model | [Q2](#q02), [Q4](#q04), [Q5](#q05), [Q18](#q18) |
| declarative-layer.md | DSL as mediation layer | [Q7](#q07), [Q9](#q09) |
| deep-research-report-formatted.md | Programmable probabilistic agent computation | [Q1](#q01) |
| design-model.md | Layered design model | [Q10](#q10) |
| dsl-ai.md | Typed DSL and compiler | [Q2](#q02), [Q6](#q06), [Q7](#q07), [Q9](#q09), [Q18](#q18) |
| dsl-for-rag.md | Epistemic contracts for RAG | [Q5](#q05), [Q7](#q07), [Q11](#q11), [Q12](#q12) |
| languages.md | Language and formalism choices | [Q9](#q09) |
| problem-framing.md | Problem framing | [Q1](#q01) |
| typed-durable-inspectable-runtimes-report.md | Typed, durable, inspectable runtimes | [Q11](#q11), [Q12](#q12) |

## Coverage, duplication, and limits of this map


- The folder review inventoried 177 Markdown files in `design-research` and read all 13 entries in `dsl-approach`. Selection used the collection’s reading maps, source/reassembly descriptions, substantive passages across the thematic notes, paired critiques, selected source conversations and reports, and prototype records. Long reports and dialogues were reviewed through selected sections; this was not a line-by-line audit of every file, code example, bibliography, or linked artifact.
- The map adds the newer language-research inputs, harness comparisons, original system-design conversations, and the reflection/overreliance reports where they answer a specific question. Their presence is not evidence for accepting their conclusions.
- The exported conceptual-design report under `input/reports/` is selected instead of also attaching the closely overlapping `input/General_Conceptual_Design_Model_with_References.md`. Repeated passages and repeated generated summaries should not be counted as independent evidence.
- Folder indexes, JSON maps, reassembly logs, citation metadata, and relocation pointers are navigation/provenance aids. They are not counted as substantive attachments. If exact provenance or an unresolved citation becomes part of a question, add the relevant metadata explicitly.
- The P01–P08 observation files contain evolving recorded work; the P09–P20 handoffs inspected for this map describe planned comparisons, and their observation files are placeholders. Those empty logs are not included as evidence. Prototype code, raw traces, fixtures, and screenshots linked from an observation file are not automatically part of its attachment; add the exact artifacts if the new chat needs to audit a particular result.
- Original questions and archived implementation instructions remain research material. The map creates no new implementation, experiment, publication, or browser-submission task.
- Literature and product claims were not independently re-verified for this local source-mapping pass. The future research chat should verify primary literature when relying on it, and preserve the distinction between reported results and its own synthesis.

*Prepared with Codex on 2026-10-29. Source selections, grouping, and relevance explanations are new editorial proposals for the author’s research workflow.*
