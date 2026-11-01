---
draft: false
toc: true
title: "Search for Domains: Variable Procedures and Design Claims (Dialogue 2)"
description: "Saved second-round dialogue widening domain selection from static requirement checks to task families with stable domain meanings, variable procedures, composition constraints, and early failure detection."
linkTitle: "Search for Domains (2)"
---
# Search for domains: variable procedures and design claims


Saved second-round dialogue kept as written; distilled rules appear in [Heuristics for finding LLM product ideas]({{< ref "ai/heuristics" >}}).

I would **broaden the search and change what we are selecting for**.

Our previous search emphasized workflows that turn requirements and evidence into a reviewed assessment. Your files describe a broader design problem: **how to give models freedom to interpret, plan, and construct procedures while independently controlling which compositions, state transitions, and external effects are permitted.** Evidence assessment is one application of that approach.

The most useful starting point is the reanalysis in _Behavioral compilation and specification_: identify the required property and its boundary, identify possible violations, represent the necessary domain distinctions, define contracts and enforcement, and then select components. That is a design method; a DSL, compiler, or shared runtime is a possible implementation. 11-behavioral-compilation-and-s...

That changes the search question to:

> **Which task families let us test whether explicit domain semantics, constrained composition, and controlled execution improve an AI system's correctness, adaptability, and cost?**

## 1. The files contain several research directions that need different examples


I would keep four directions separate when searching. They can eventually work together, but a successful experiment in one does not establish the others.

|Direction in the notes|What we need to test|What a suitable task family must provide|
|---|---|---|
|**Domain semantics and operation contracts**|Whether explicit meanings, relationships, preconditions, effects, and failure cases improve interpretation and composition.|Important distinctions that API schemas alone leave ambiguous, such as accounting definitions, identity, time, ownership, and lifecycle state.|
|**Program-mediated execution and compiler feedback**|Whether generating an inspectable program and repairing it through diagnostics improves reliability or reduces failure cost.|Multiple operations whose composition can be invalid even when individual calls are valid; useful checks before execution.|
|**Declarative collaborative programming**|Whether people and models can progressively construct and revise specifications while preserving constraints.|Incomplete plans, changing goals, contributions from several participants, and more than one acceptable execution.|
|**Behavioral compilation and reusable procedure induction**|Whether candidate solutions and observable traces can help produce procedures that work on future cases.|Repeated task families, independent tests, variation between cases, and enough reuse to justify synthesis and validation costs.|

These distinctions come directly from the operation-contract discussion, mediation model, declarative model, and behavioral-compilation proposal. 13-domain-semantics-and-operati... 04-dsl-as-mediation-layer 03-declarative-programming-model 11-behavioral-compilation-and-s...

For example, a clinical eligibility classifier might test semantic interpretation and evidence support very well. It may provide little evidence about dynamically revised programs or reusable procedure induction.

Conversely, a distributed-system scenario generator could test constrained synthesis, diagnostics, and executable verification without requiring a clinical decision or an authoritative policy document.

**We should select examples against a particular hypothesis, rather than expect one domain to demonstrate the entire approach.**

The map itself preserves this openness: maintained declarations and generated procedures may be layers or alternatives; the notes have not selected their relationship. document-map

## 2. How I would change the underlying selection criteria


The earlier properties -- heterogeneous evidence, uncertainty, time, review, and provenance -- remain useful. I would add several criteria that are more directly connected to your design method.

### Look for stable domain meanings with variable procedures


A useful candidate has meaningful domain concepts and operations, but the procedure cannot always be selected in advance.

For example, an analytical investigation might consistently involve transactions, reporting periods, reconciliations, and findings. Different questions require different queries, comparisons, evidence collection, and stopping decisions.

That is the setting where we can test whether a semantic model helps a model construct useful procedures.

Your kernel proposal explicitly centers typed artifacts and transformations rather than generic workflow steps. It also separates structural correctness from relevance, completeness, and professional judgment. 07-semantic-kernel 07-semantic-kernel

There are two useful boundary cases. A completely fixed procedure may be better implemented conventionally. A task whose meanings and outcomes cannot be evaluated independently may be difficult to use as the first research experiment.

### Look for faults that become detectable at different stages


For every candidate, I would ask:

> Which failures can be prevented or detected during construction, before execution, during execution, and after observing the result?

Your layered model makes this separation explicit. Type compatibility belongs in one place; current authorization and record existence in another; evidence support and user satisfaction require different evaluation. It also warns that extra layers introduce bugs, latency, and semantic mismatches. 05-layered-design-model

This gives us a stronger selection criterion than "high stakes":

**There should be identifiable failures whose detection becomes earlier, cheaper, or more reliable because of the proposed mechanism.**

### Look for composition problems


A candidate should contain cases where locally valid operations produce an invalid overall process.

Examples worth constructing include using a result from the wrong source revision, accepting a patch before its tests finish, retrying an operation whose outcome is uncertain, or executing an action using approval for different arguments.

The mediation note identifies exactly this motivation: individually valid tools do not automatically establish a valid sequence. 04-dsl-as-mediation-layer

This is where whole-program or protocol-level reasoning could provide value beyond well-designed tool adapters.

### Look for useful feedback and independent evaluation


Compiler acceptance alone is insufficient. We need cases where we can distinguish:

- A well-formed program.
- A program that implements the intended task.
- An execution that satisfies the relevant properties.
- A result that is useful and appropriately supported.

Your Tickloom comments make this concrete: a scenario can compile while describing the wrong experiment, and a test can successfully reproduce a failure without establishing the desired protocol property. 12-tickloom-semantic-model-and-...

### Look for change and reuse -- but only for the relevant research track


For declarative collaboration, search for changing specifications, concurrent contributions, and work already in progress.

For procedure induction, search for repeated cases with enough structural similarity to support reuse and enough variation to expose overfitting. Your notes explicitly distinguish instance-specific synthesis from reusable procedures and assign them different acceptance requirements. 11-behavioral-compilation-and-s...

A task does not need both properties to be useful.

### Remove several universal requirements from our search


I would stop requiring every candidate to have an external authoritative specification, regulatory exposure, a final human adjudicator, or a document-heavy input.

The authority may come from a user-approved task contract and domain semantics. Human involvement may concern plan construction or amendments rather than final review. The principal artifact may be a query program, test scenario, transformation, or change plan.

I would also preserve your preference for extensibility. A constrained language does not require a permanently closed operator catalog; the notes propose a stable core with registered operators whose contracts and adapters are controlled. 02-typed-dsl-and-compiler

## 3. The domain shortlist would change


I would now search for **specific computational tasks inside domains**. The following is my research shortlist, not a claim about market size or weak competition.

|Task family|Concrete example|Main part of your approach it could test|
|---|---|---|
|**Interactive data analysis and reconciliation**|Investigate a reported revenue change using transactions, business definitions, and explanatory documents.|Domain semantics, typed transformations, alternative query plans, diagnostics, and numerical versus interpretive verification.|
|**Iterative evidence investigation**|Resolve a question by gathering evidence, identifying gaps, adding branches, and deciding when to stop.|Hybrid model/tool programs, bounded iteration, evidence-state consistency, stopping criteria, and plan repair.|
|**Test-scenario generation and software repair**|Construct a failure scenario or propose a patch, run checks, inspect failures, and revise.|Constrained synthesis, executable feedback, intended versus observed behavior, and generalization across related cases.|
|**Incident investigation and controlled remediation planning**|Investigate a service failure and prepare a bounded change plan as new observations arrive.|Partial plans, runtime state, changing conditions, authorization, recovery, and collaborative amendments.|
|**Stateful customer or business operations**|Resolve a return, refund, or account issue across several systems and participants.|Business meanings, multi-step invariants, uncertain effects, retries, and coordination.|
|**Clinical evidence preparation**|Assemble a trial-screening or prior-authorization evidence package for review.|Source interpretation, temporal state, support obligations, exact revisions, and purpose-specific acceptance.|

The first three already appear explicitly in your project-candidate note. It proposes iterative retrieval, multi-stage querying, data exploration, and test-driven repair as distinct experiments. 08-typed-dsl-project-candidates 08-typed-dsl-project-candidates 08-typed-dsl-project-candidates

I also checked several existing test environments to see whether this broader search has practical starting points:

**BIRD-Interact** combines database documentation, a knowledge base, simulated user interaction, and executable tests for analytical and database-operation tasks. That makes it a candidate for studying interpretation and interactive procedure construction. Its availability does not validate your approach; it supplies part of a comparison environment. [Bird Interact](https://bird-interact.github.io/)

**τ-bench** evaluates tool-using agents through resulting database state and repeated trials. **τ²-bench** adds a shared environment in which both the simulated user and agent can act. These offer starting points for stateful operations and coordination, although they would need additional instrumentation to test evolving specifications and exact-revision acceptance. [arXiv](https://arxiv.org/abs/2406.12045) [arXiv](https://arxiv.org/abs/2506.07982)

**SWE-bench** applies generated patches to repositories and runs tests. It supplies executable evaluation for repair tasks, but passing its tests would not establish your proposed authority, provenance, or lifecycle properties. [SWE-bench](https://www.swebench.com/SWE-bench/guides/evaluation/)

This also changes our earlier priorities. Security evidence assessment remains a candidate. A static control-to-document classifier would test only part of your thesis. Security investigation with evolving plans and controlled actions would exercise more of it.

Likewise, contract entailment remains useful for semantic evaluation, but it is a limited standalone test of program composition or runtime adaptation.

## 4. Two issues in the notes should directly shape the search


The files contain useful tensions that our experiments should expose.

### Repairing a program must remain separate from weakening its requirements


The typed-planning example suggests several responses to a missing coverage obligation: add a screening operation, weaken the result type, or remove the coverage requirement. 10-program-authoring-and-typed-...

Those are different kinds of change.

Adding an operation may repair the procedure under the same contract. Changing the required result or dropping a requirement is a proposed amendment to the contract.

**An experiment must not count a relaxed task as a successful repair of the original task.**

I would therefore favor task families where this distinction is observable. A useful adversarial case would give the model an impossible or under-resourced task and test whether it reports the conflict, requests an authorized amendment, or silently lowers the requirement.

The declarative comments identify the related problem: adding constraints can eliminate every permitted completion. Preserving safety does not establish that work can finish. 03-declarative-programming-mode... 03-declarative-programming-mode...

### Declared operation contracts need an implementation boundary


The refund example's comments explicitly identify missing rules concerning positive amounts, currencies, ownership, concurrent balance changes, idempotency, and uncertain outcomes. They also distinguish a discoverable operation description from authority and implemented behavior. 13-domain-semantics-and-operati...

This means we should search for environments where we can test the relationship between:

**declared contract -> adapter behavior -> external observation -> recorded outcome.**

A schema with an `idempotent` field is not sufficient evidence. Nor is a type called `ApprovedPayment` sufficient unless its construction and use are controlled.

This favors controlled stateful environments for early experiments. They let us inject a timeout after a successful operation, a concurrent modification, or an approval for an obsolete revision and inspect what happens.

## 5. Change the research process from domain ranking to hypothesis testing


For each candidate, I would require a small dossier before assigning it a high research priority:

|Required information|Question it must answer|
|---|---|
|**Task family and variation**|What repeats, and what changes between cases?|
|**Required properties**|Which exact invariants and empirical quality requirements apply?|
|**Domain distinctions**|Which meanings, identities, states, and relationships must be represented?|
|**Operations and boundaries**|What can be inspected, proposed, executed, or changed, and by whom?|
|**Failure cases**|What concrete examples violate the properties?|
|**Evaluation**|Who or what determines task correctness independently of the generator?|
|**Simpler alternative**|Could a fixed workflow, ordinary library, rule engine, or well-designed tool agent already handle it?|
|**Cost of the approach**|What does modeling, implementation, validation, and maintenance add?|

The central evidence would be a demonstrated relationship:

> This failure occurs under these conditions. This mechanism addresses it under stated assumptions. These tests check that claim. These failures remain outside the mechanism.

That is closer to evaluating a design approach than collecting domains with superficially similar pipelines.

### Evaluate the design method separately from the resulting system


Because you are developing an approach to **designing** AI systems, I would conduct two different kinds of evaluation.

At design time, ask whether applying the method helps engineers identify missing domain distinctions, place checks at appropriate boundaries, expose unsupported guarantees, and revise the system when requirements change. Record implementation effort and maintenance cost.

At runtime, measure task completion, semantic errors, invariant violations, recovery, review effort, latency, and cost.

A better-performing prototype supports a claim about that implementation. It does not by itself establish that the method helps other engineers design better systems.

### Use strong comparison systems


I would compare your implementation with a tool-calling agent that receives the **same domain definitions, adapters, permissions, and model budget**. Otherwise, the experiment may merely show that good domain modeling and authorization outperform a poorly specified baseline.

A hand-authored structured workflow is another important comparison. For behavioral compilation, also compare against direct generation of the target program without the preliminary witness stage.

Then vary one mechanism at a time: explicit semantic definitions, program representation, compiler feedback, incremental repair, shared specification, or witness-based synthesis.

Report successful completion alongside violations and abstention. A system that rejects everything can preserve many invariants while providing no useful assistance.

### Use distinct tests for distinct claims


For reusable procedures, hold out changes in inputs, document structures, domain definitions, and task variants. Matching the initial model's answer is not an independent test; your behavioral-compilation note explicitly distinguishes teacher fidelity from correctness. 11-behavioral-compilation-and-s...

For collaborative specifications, test amendments during execution, conflicting contributions, cancellation, and changes that make completion impossible.

For controlled execution, test concurrency, duplicate requests, stale approvals, partial failure, and uncertain external results.

For semantic quality, use independently reviewed evidence and task expectations. Static checks cannot establish that a summary preserves meaning or includes all material information, as the compiler note itself states. 02-typed-dsl-and-compiler

## 6. The search brief I would use now


> Identify recurring task families suitable for evaluating a property-driven approach to AI-system design. The approach begins with required properties, possible violations, domain distinctions, and enforcement boundaries, then selects combinations of models, typed representations, validators, planners, runtimes, and human participation.
>
> Search for tasks involving meaningful domain semantics, variable procedures, multiple operations, independently checkable constraints, and measurable outcomes. Include analytical, investigative, constructive, and stateful operational work. Do not require regulation, an external policy document, or final human adjudication.
>
> For each candidate, identify the concrete task, domain objects and operations, useful generative freedom, exact invariants, remaining semantic judgments, failure cases, available data or simulators, independent evaluation, and the strongest simpler implementation.
>
> Assess suitability separately for domain-semantic modeling, program-mediated execution with diagnostic repair, collaborative refinement of declarative specifications, and reusable procedure induction. Include negative cases where the added architecture is unlikely to help.
>
> Keep research suitability separate from commercial attractiveness. Investigate buyers, competition, integration, data rights, and market size only as a separate assessment.

## My recommendation for your next experiment


I would put **interactive analytical investigation over structured data and a bounded document corpus** first.

It can combine domain definitions, typed transformations, variable queries, evidence gathering, bounded loops, inspectable plans, and corrections. Some results can be checked numerically; interpretive conclusions can be evaluated separately. This closely follows the analytical kernel and iterative-query examples already developed in your notes. 07-semantic-kernel 08-typed-dsl-project-candidates

I would initially test domain semantics and program-mediated execution there. Collaborative specification changes and reusable procedure induction would be separate extensions with separate experiments.

The healthcare workflow can remain the main application and later serve as a transfer case. A controlled test-scenario or stateful-operations environment can test properties that the clinical workflow does not expose clearly.

**The main change is that we should search for workflows that can discriminate between design choices.** Similarity to healthcare, complexity, and market size alone will not tell us whether the approach works -- or which parts of it generalize.
