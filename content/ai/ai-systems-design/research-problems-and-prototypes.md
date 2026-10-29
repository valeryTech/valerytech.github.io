---
draft: false
toc: true
title: "Twenty research problems for AI systems design"
description: "A research agenda connecting twenty foundational problems to end-to-end prototypes, language comparisons, and evidence about construction, composition, human understanding, and change over time."
linkTitle: "Twenty research problems for AI systems design"
---

The next step is to make the proposed principles concrete enough to challenge. We can build small, complete systems in several languages, observe where their representations help or fail, and use those observations to revise the conceptual account.

This map develops the [foundations note]({{< ref "ai/ai-systems-design/representations-composition-and-understanding" >}}) and the earlier [design-research collection]({{< ref "ai/design-research/00-index" >}}). It selects twenty problems around construction, composition, inquiry, collaboration, and change. Each problem connects a conceptual question to a prototype comparison and something we could learn from it.

The selection is a proposed agenda. Its importance comes from three considerations: the problems recur across the notes, they affect whether people can build and understand useful systems, and they admit contrasting implementations or revealing counterexamples. Their priority can change as the prototypes expose stronger questions.

The intended industry contribution is a set of worked explanations: which distinctions a design needs, what those distinctions make possible, what a mechanism actually establishes, and where its assumptions stop holding. The prototypes can become runnable examples accompanying those explanations and, eventually, more focused papers.

**How the problems connect.** Problems 1–4 concern constructing ideas and programs. Problems 5–8 concern composition and boundaries. Problems 9–12 concern inquiry and evidence. Problems 13–16 concern joint work and revision. Problems 17–20 concern recovery, reusable behavior, and the evidence needed to justify improvement. These groupings are navigation aids; several problems cross them.

1. **Domain meaning beyond data shape.** Which distinctions must a system represent for its operations to have the intended meaning? Two values can have the same fields while referring to different units, periods, purposes, or levels of support. This is a foundational problem for exchanging work among people, models, and programs.

   **Prototype comparison:** Build a document comparison that starts with generic records, then introduce explicit distinctions for source passages, claims, interpretations, and decisions. Include a structurally valid result that compares incompatible periods or treats a proposal as an established fact.

   **What we could learn:** Which mistakes become detectable, which still require judgment, and what modeling effort the distinctions add. The vocabulary should earn its place through the misunderstandings it resolves. [Basis: domain semantics and operation contracts]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts" >}}).

2. **Representations that help construct unfinished work.** How can a representation guide the next useful move while preserving what remains unknown? A partial program or model may carry enough structure to reveal a missing input, a possible completion, or an incompatible assumption.

   **Prototype comparison:** Give a person and an LLM the same unfinished investigation in two forms: prose and a structured model with explicit gaps. Let both reach a usable result. Compare supplying structure only at final validation with supplying it during construction.

   **What we could learn:** Whether gaps and diagnostics help find useful next steps, reduce mistaken completions, or instead encourage premature commitment to the supplied model. [Basis: program authoring and typed planning]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}) and the [language research alignment]({{< ref "ai/design-research/input/research-llm-programming-languages/alignment" >}}).

3. **Discovering and revising intent through formalization.** How should a system respond when a valid formalization exposes a problem with the original request? A failure may call for repairing the program, obtaining missing evidence, or changing the question. Those are different forms of progress.

   **Prototype comparison:** Begin with an ambiguous request such as “compare the most reliable designs.” Expose the proposed meaning of reliability, examples, and consequences. Allow the user to change the criterion after seeing a counterexample, and carry the revision through to a new result.

   **What we could learn:** Whether the interaction helps participants identify their actual question and preserve the reasons for changing it. A useful outcome may be a better formulation. [Basis: language intent and hybrid interaction]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}) and its [comments on intent agreement]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction-comments" >}}).

4. **Constraints that enable useful construction.** Which restrictions make more useful combinations dependable, and which merely make work harder to express? The central question concerns the relationship between restrictions, guarantees, and the range of useful systems people can construct.

   **Prototype comparison:** Express the same family of tasks using a fixed workflow, extensible operations with explicit contracts, and general code with explicit checks. Add an unanticipated operation after the first tasks work. Include useful tasks that a restrictive design cannot express.

   **What we could learn:** Which guarantees each restriction buys, how much extension work it requires, and what legitimate work it excludes. A task family provides a bounded way to examine useful generativity; it does not define a universal score. [Basis: constrained generativity]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}).

5. **Preserving properties under composition.** What must be true of the relationship between parts for a property to survive their combination? Locally acceptable outputs can produce a misleading or invalid whole.

   **Prototype comparison:** Build extraction, comparison, and synthesis components whose individual outputs retain source qualifications. Combine them into a report and introduce a composition that silently drops a qualification. State one precise preservation condition, then compare local checks with checks that account for the combination.

   **What we could learn:** Which assumptions a composition rule needs, where the counterexample breaks them, and whether those assumptions can be stated independently of an implementation language. [Basis: constraint, guarantee, and composition models]({{< ref "ai/design-research/01-foundations/07-constraint-guarantee-and-composition-models" >}}).

6. **Replacing and extending components without changing their meaning unexpectedly.** When is a new component an acceptable substitute? Matching an input/output schema leaves questions about units, failure behavior, ordering, evidence, and effects unresolved.

   **Prototype comparison:** Replace a retrieval or aggregation component inside a complete investigation. Include replacements that preserve signatures but change the meaning of a score, omit failed records, or interpret a missing value differently. Then add a separately developed component using only the published contract.

   **What we could learn:** Which behavioral assumptions belong at the boundary, how violations become visible, and whether new contributors can participate without knowing the original implementation. [Basis: the semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}).

7. **Preserving meaning across languages and representations.** What should count as the same system when it is expressed as a typed program, a rule set, a structured plan, or an interactive view? Agreement requires a definition of the observations that matter.

   **Prototype comparison:** Implement one complete task in Python, Haskell, and Scala. Run shared cases covering missing values, ordering, errors, revisions, and permitted actions. Compare results and relevant events under a stated equivalence rule. Later, change a representation without changing the intended task.

   **What we could learn:** Which abstractions survive translation, which assumptions a host language makes easy to overlook, and where apparently equivalent implementations diverge. Identical text output is rarely a sufficient definition of equivalence. [Basis: language and formalism choices]({{< ref "ai/design-research/03-language-and-compiler/06-language-and-formalism-choices" >}}).

8. **Authority and information flow through a composition.** How can a system preserve limits on what information and actions may cross a boundary? Permission to read a document and permission to publish a report leave the relationship between those operations unresolved.

   **Prototype comparison:** Use synthetic public and restricted documents to prepare a report for a local publication simulator. Follow information through extraction, summaries, model inputs, logs, and the final artifact. Vary the recipient or policy after a draft is prepared, and test both prohibited flows and legitimate releases.

   **What we could learn:** Which boundaries actually enforce the chosen rule, what they must trust, and which useful tasks the rule blocks. The experiment needs an explicit scope for its information-flow claim. [Basis: trusted effect boundaries]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) and the [composition analysis]({{< ref "ai/design-research/input/research-llm-programming-languages/alignment" >}}).

9. **The relationship between evidence and a claim.** What makes a result supportable? Recording where text came from establishes a different relationship from showing that the text supports a conclusion.

   **Prototype comparison:** Answer questions over a small corpus with independently reviewed support cases. Compare citation existence, exact source links, and explicit claim–evidence relations. Include genuine quotations that are arranged to imply an unsupported conclusion.

   **What we could learn:** Which checks expose missing support, which need contextual interpretation, and how people can inspect the argument. Support by a source also remains distinct from the source being correct. [Basis: provenance and argumentation foundations]({{< ref "ai/design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations" >}}) and [verification and acceptance]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}).

10. **Keeping uncertainty, conflict, and coverage distinct.** How can an investigation retain what is unresolved without collapsing every condition into a confidence score? Supported claims, contradictory evidence, unexamined material, and absence of evidence have different implications.

   **Prototype comparison:** Introduce conflicting document versions, a missing source, a parsing failure, and an answerable control case. Carry those conditions into the final answer or abstention. Let the user inspect and revise the policy for interpreting a source conflict.

   **What we could learn:** Whether distinctions survive synthesis, help appropriate decisions, and avoid both unsupported certainty and unnecessary abstention. Examining every listed document does not establish that every relevant fact was found. [Basis: bounded-corpus evidence synthesis]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}) and its [coverage critique]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis-comments" >}}).

11. **Selecting context without losing the meaning of the question.** How do representations determine what becomes visible to a model or person? Retrieval and summarization select information; that selection can remove a qualification or favor one interpretation before reasoning begins.

   **Prototype comparison:** Solve the same question using passages, structured relations, and a combination of both. Expose the interpreted information need and selected context for correction. Include a relevant passage whose importance depends on neighboring text or a relationship elsewhere in the corpus.

   **What we could learn:** Which representations preserve the needed relationships, how omissions become discoverable, and whether intervention improves the answer enough to justify its effort. [Basis: multi-representation retrieval and projections]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}).

12. **Reasoning about sufficient investigation under limited resources.** When should a system continue, ask for help, stop with an answer, or stop with unresolved questions? Exhausting a budget and satisfying an information need are different stopping conditions.

   **Prototype comparison:** Give an iterative investigation fixed time and model-call budgets. Compare fixed retrieval, gap-directed retrieval, and a human-directed continuation. Include questions that cannot be resolved from the available corpus.

   **What we could learn:** How each strategy trades cost, useful evidence, missed evidence, and uncertainty; whether the final result explains why work stopped; and whether resource limits remain effective across branches and retries. [Basis: resource-aware investigation planning]({{< ref "ai/design-research/05-runtime-and-execution/03-resource-aware-investigation-planning" >}}).

13. **Allocating work and responsibility among different participants.** What should determine whether a human, model, or deterministic program performs a step? Competence, available information, responsibility, and permission are separate considerations.

   **Prototype comparison:** Complete the same design investigation with several allocations of extraction, calculation, interpretation, critique, and acceptance. Introduce a handoff where the next participant lacks an important assumption. Make escalation and reassignment possible.

   **What we could learn:** Where a division of work improves the combined outcome, where coordination costs exceed its benefit, and what must be communicated for a meaningful handoff. Participant labels alone do not establish competence. [Basis: participant profiles and work allocation]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) and [joint activity]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}).

14. **Representations that support human understanding and intervention.** Which explicit views help people explain, challenge, and change the work? A visible trace or diagram can still be difficult to interpret.

   **Prototype comparison:** Present the same investigation through a conversation, an editable claim–evidence table, and a dependency view. Ask participants to explain a conclusion, identify a mistaken assumption, predict the consequence of an edit, and make a justified revision.

   **What we could learn:** Which views support those abilities, for whom, and at what cognitive cost. Task correctness, confidence, and later performance without assistance should remain separate observations. [Basis: sensemaking and epistemic action]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}) and [collaboration evaluation comments]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation-comments" >}}).

15. **Combining concurrent contributions and resolving disagreement.** Under what conditions can independently produced work be merged? Conflict may concern incompatible assumptions or purposes even when contributors edit different fields.

   **Prototype comparison:** Let two contributors revise a design analysis from the same starting point. Introduce one compatible pair of edits, one direct conflict, and one pair that is structurally mergeable but semantically inconsistent. Compare automatic merging, explicit alternatives, and review of the combined result.

   **What we could learn:** Which changes can commute, what a merge must preserve, and when disagreement should remain visible. Successful coordination includes reaching a usable result as well as avoiding an invalid combination. [Basis: composable investigation workspaces]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}) and [collaboration framework research routes]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes" >}}).

16. **Continuity when goals, evidence, and programs change.** What remains valid after a revision? Understanding can evolve while earlier work remains useful, partly useful, or misleading for the new purpose.

   **Prototype comparison:** Finish an investigation, then separately change its question, a source, an operation, or its configuration. Resume the work and decide which results can be reused. Include a computation that finishes after the inputs have changed.

   **What we could learn:** Which dependencies matter, how to distinguish a historical result from a current one, and how much work can be retained without carrying obsolete assumptions forward. [Basis: program versions, runs, and results]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}), its [comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}), and [application-state analysis]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}).

17. **Recovery after incomplete computation and external effects.** What does it mean to resume correctly when the system cannot initially tell how much work took effect? Persistence, replay, retry, cancellation, and undo address different situations.

   **Prototype comparison:** Interrupt a complete report workflow before an operation, after its local effect, and before its acknowledgment. Resume it against a controlled local service. Separately compare consuming recorded model responses with making new calls, and show the difference in the resulting history.

   **What we could learn:** Which operations can be repeated, where uncertainty must remain explicit, and what evidence is needed to reconcile state. Recovery claims must include the behavior of the service receiving an effect. [Basis: generalized agent runtime]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) and [builder-method recovery comments]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method-comments" >}}).

18. **From examples and provisional answers to reusable programs.** When does successful behavior on a few instances justify a procedure for future cases? An example helps communicate intent but can also carry an error or hide an important exception.

   **Prototype comparison:** Start with example transformations of maintenance records, an independently stated task contract, and provisional LLM outputs. Generate a reusable procedure, run it on new records, and revise it using counterexamples. Include cases where matching the provisional answer violates the contract.

   **What we could learn:** Whether the procedure generalizes within its declared scope, when reuse is worthwhile, and how failure reveals an inadequate specification or abstraction. [Basis: behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) and [its evaluation questions]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}).

19. **Learning which decisions to automate from interaction.** How can observations of human corrections improve a system without treating every correction as a universal rule? Repeated behavior may reflect local context, temporary preferences, or a current review obligation.

   **Prototype comparison:** Let people intervene in evidence selection or classification. Record the circumstances and reasons, derive a candidate policy, and compare its behavior on unseen cases. Preserve the ability to correct it when the task changes.

   **What we could learn:** Which decisions become repeatable, where automation increases mistakes or reduces useful engagement, and which interventions retain their own purpose. Observed approvals do not grant future authority. [Basis: exploratory pipeline design and progressive automation]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}) and the [critique of its proposed conditions]({{< ref "ai/design-research/interactive-systems/12-exploratory-pipeline-design-goals-and-principles-comments" >}}).

20. **Establishing what a successful prototype actually demonstrates.** How can we separate an appealing demonstration from evidence for a proposed principle? A system can satisfy its formal checks while missing the task, or produce a useful answer while leaving its user confused.

   **Prototype comparison:** Use a shared case collection across implementations. Vary the representation, construction feedback, or interaction while keeping other conditions as comparable as possible. Include failures, valid cases that should pass, and cases withheld during development. Record correctness, rule violations, effort, resource use, and relevant human outcomes separately.

   **What we could learn:** Which mechanism accounts for an improvement, where the effect disappears, and what further evidence a broader claim needs. Finite cases, formal arguments, and observations of people answer different questions. [Basis: research method and claim validation]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation" >}}).

**Four prototype families can cover the agenda.** Each family should complete a recognizable piece of work. For an investigation, that means a question, explicit working artifacts, model proposals, computation on actual local data, an inspectable result, and a revision that reaches a new result. Appropriate abstention or a clarified question can be a legitimate outcome. For a system that performs actions, completion also includes the observable action and its handling after interruption.

| Family | Complete example | Main problems | A revealing disturbance |
|---|---|---|---|
| A. Evidence investigation | Ask why two engineering reports disagree; inspect sources and interpretations; produce a qualified explanation; revise it after a source correction. | 1–3, 9–12; also 14 and 16 | A persuasive answer cites genuine passages but misses a qualification and an unparsed document. |
| B. Shared design workspace | Compare two system designs; make assumptions and criteria explicit; let a person and an LLM propose changes; reconcile contributions into a reasoned decision. | 13–16, 19 | The team changes its criterion while two contributors work from different assumptions. |
| C. Controlled report workflow | Derive a report from synthetic restricted material; review the relevant version; deliver permitted content to a local simulated destination; resume after interruption. | 5, 8, 17; also 15 and 16 | The recipient changes after review, or delivery succeeds but its acknowledgment is lost. |
| D. Reusable data procedure | Turn examples and rules for maintenance-record normalization into a program; execute it on new data; inspect exceptions; revise and reuse it. | 4, 6, 18; also 2 and 19 | A new input satisfies the old schema but changes an assumption the procedure relied on. |

Problems 7 and 20 run across the families: compare meanings across implementations and keep the evidence for each claimed benefit explicit. The families can share corpora, adapters, and case fixtures while retaining separate questions. There is no need to commit to a universal runtime before those questions become clearer.

**Languages provide different ways to investigate the same problem.** I propose an initial comparison among Python, Haskell, and Scala 3. This extends the earlier [language discussion]({{< ref "ai/design-research/03-language-and-compiler/06-language-and-formalism-choices" >}}) with a Python reference implementation. The choices are experimental media, not a ranking of languages or an adoption forecast.

| Implementation | Proposed construction style | Question it helps investigate |
|---|---|---|
| Python | Explicit domain objects, runtime validation, and visible operations; declare any static checks used. Python annotations are not enforced by the runtime. ([Python typing documentation](https://docs.python.org/3/library/typing.html)) | How far can explicit modeling and checks take us before moving more obligations into a host type system? |
| Haskell | A small operation algebra, typed representations, and separate interpretations for execution and inspection. GADTs can express constructors with more specific result types. ([GHC GADT documentation](https://ghc.gitlab.haskell.org/ghc/doc/users_guide/exts/gadt.html)) | Which obligations become structural, which errors appear earlier, and what does the encoding make harder to change? |
| Scala 3 | Domain APIs and an embedded language, using opaque types to hide representations outside their defining scope. ([Scala opaque-type documentation](https://docs.scala-lang.org/scala3/book/types-opaque-types.html)) | Can the distinctions remain usable and effective when embedded in a broader application? |

Each host-language version should complete the same small scenario: load inputs, obtain a model contribution, validate it, perform the required computation, expose the result for inspection, and handle a correction. A common interface or model adapter can reduce duplicated work. The central behavior should be implemented in each host, so that a second frontend over the same engine is identified as a frontend comparison.

The host language, the language in which an LLM proposes work, and the representation a person edits are separate choices. A Haskell implementation could receive a structured plan; a Python implementation could execute a restricted DSL. Record these choices so that changing all three is understood as a comparison of complete designs, with subsequent experiments needed to isolate a language feature.

A later Datalog variant could investigate evidence and dependency rules within one complete application. Soufflé's [provenance facility](https://souffle-lang.github.io/provenance) explains symbolic derivations; such an explanation does not establish the truth of an input fact or the adequacy of a claim–evidence link. This would test a particular layer rather than add another mandatory implementation of every family.

The comparison should give each implementation the same task obligations, data, tools, and resource limits. Python should receive explicit validation where needed; typed implementations still need checks for external inputs, generated proposals, and properties outside their types. Both the cost of preventing an error and the cost of understanding or changing the design matter.

Use recorded responses for repeatable semantic and failure cases, and separate live-model runs for studying construction and variability. Share observable cases and result definitions first. Allow different internal models while we discover the abstractions; any shared intermediate representation should be justified by that comparison.

**A useful starting sequence.** Start with family A: a bounded-corpus investigation with a missing input, conflicting evidence, and one source revision. Its first focus would be problems 1, 2, 5, 9, 10, and 16, with problem 20 guiding what conclusions we draw. This connects the three foundational interests through one complete piece of work: constructing an explanation, preserving its qualifications, and helping a person understand and revise it.

Build that small scenario in Python and Haskell, then add Scala 3 to challenge which parts of the model are portable. Extend the investigation into family B to study human understanding and joint revision. Use families C and D to test whether the concepts also explain controlled effects and reusable computation. Choose later extensions in response to the conceptual disagreements and failures these cases reveal.

For each prototype, publish the question, the runnable example, its language and boundary assumptions, a successful case, a revealing failure, and the resulting revision to the conceptual account. Retain useful excerpts of the design dialogue and the reasons for changing direction. This makes the process of learning from implementation part of the contribution.

*Editorial note, 2026-10-29: Drafted with Codex from the research notes and the author's request for a set of important problems to investigate through end-to-end prototypes in different languages. The comparisons and sequence are proposals; this note reports no completed prototypes or experimental results.*
