---
draft: false
toc: true
title: "Prompt Driven"
linkTitle: "Prompt Driven"
---
# Prompt-Specified Systems and Prompt-Only Enforcement


A **prompt-specified system** is one in which prompts specify a substantial part of the system's functional behavior and an LLM interprets that specification at runtime. The prompts may describe analysis steps, transformations, decision criteria, domain rules, workflows, constraints, or output structure.

This is not inherently a problem. Many tasks are appropriately performed by an LLM. The architectural problem begins when the system trusts prompt compliance more than the model and its surrounding controls can justify.

This note calls that problem **prompt-only enforcement**:

> Prompt-only enforcement occurs when an architecture relies on a prompt instruction to satisfy a system requirement without controls, evidence, and failure handling adequate to that requirement.

The deciding question is not whether the behavior is called "business logic" or whether it is written in a prompt. It is whether the implementation, controls, evidence, and failure handling justify relying on the system to meet the requirement at its stated boundary and failure tolerance.

```text
system claim
    ↓
are the controls, evidence, and failure handling adequate?
    ├─ yes → rely on the claim within its stated limits
    └─ no  → support gap
                  ↓
         strengthen controls or evidence, narrow scope,
         weaken the claim, or reject the design
```


A **support gap** exists when the implementation, controls, evidence, and failure handling do not justify relying on the system to meet the requirement under its stated conditions.

When that gap is material and remains unaddressed, the prompt-specified requirement has become an architectural problem.

## Specification, implementation, enforcement, and evidence


Four questions are easy to collapse in an LLM application:

| Responsibility | Question | Example |
|---|---|---|
| Specification | What should happen? | "Return an object with exactly these fields." |
| Implementation | What mechanism performs it? | The prompt/model combination constructs a candidate object. |
| Enforcement | What prevents an unacceptable result from being accepted? | Constrained generation or a schema validator rejects an invalid object. |
| Evidence | What shows that the implementation and enforcement work under the stated conditions? | Integration tests exercise rejection and failure paths, and review confirms that downstream processing cannot bypass validation. |

The prompt contains or serves as a runtime behavioral specification and also supplies instructions to the implementation. Neither role establishes that every result complies. Evidence shows how the implementation and its controls behave under stated conditions. Containment, detection, and recovery can reduce or manage failures, but they do not by themselves establish that the required property holds.

Prompt-specified systems make it tempting to collapse the first three questions into one natural-language artifact and then rely on the result without the fourth:

```text
prompt
  = specification
  + implementation instructions
  + assumed enforcement
              ↓
      unsupported trust
```


The mistake is treating the instruction as enforcement and the result as evidence. A statement of intent does not, by itself, justify relying on the system.

An output schema illustrates the distinction. A prompt that says "return JSON shaped like X" contains an output instruction. It does not by itself create an enforced output contract. Constrained decoding can prevent malformed candidates; parsing and schema validation can accept or reject candidates before downstream use.

## Classify the requirement first


The requirement class, failure tolerance, and consequences should drive the architecture. A useful starting point is to classify each property as hard, statistical, or best effort.

| Requirement class | Meaning | Example |
|---|---|---|
| Hard property or invariant | Must hold for every result accepted at a defined system boundary | Only user-selected passages enter the synthesis context. |
| Statistical requirement | Must meet a measurable target over a defined population | At least 95% of materially relevant evidence units are retrieved for supported queries within a defined review budget. |
| Best-effort behavior | Desirable, but no contractual success threshold is claimed | Group candidate passages usefully by subject. |

An **invariant** should remain a strict term. If a property may fail in 5% of accepted results while the system still satisfies its specification, it is not an invariant. It is a statistical requirement or best-effort behavior.

The same operation can belong to different classes in different systems. JSON formatting may be best effort when a human reads the result, but a hard property when an automated service consumes it. A business decision may be intentionally statistical, while a simple formatting rule may be critical. The subject matter of the rule does not determine its requirement class.

The words used in a prompt do not determine the class either. *Must*, *never*, and *guarantee* may signal a hard property, but the actual system contract and its boundary determine the class. Failure consequences determine how strict the contract, controls, and evidence should be.

### Hard properties


A hard property applies at a stated boundary, usually to every result the system accepts or every action it commits. Examples include:

- a payment does not exceed its approved limit;
- a workflow transition is valid from the current state;
- an access decision follows the applicable authorization policy;
- every source in a declared corpus is accounted for before synthesis, either as successfully ingested or as an explicit failure;
- a synthesis context contains only evidence the user selected; and
- every value accepted by a service conforms to its input schema.

"Hard" does not mean that ordinary application code is magically free of defects. It means that the architecture claims the property for every accepted result and therefore needs controls and evidence compatible with that claim. The model may still produce a bad candidate without violating the system-level invariant if the application reliably prevents that candidate from crossing the acceptance boundary.

### Statistical requirements


A statistical requirement permits individual failures while setting a performance target over a defined population. A useful requirement and evaluation plan together include at least:

```text
population
+ success criterion
+ target rate
+ uncertainty
+ failure severity
+ evaluation period
```


For example:

> On supported knowledge-reconstruction queries drawn from the production distribution, mean per-query recall of human-labeled materially relevant evidence units must be at least 95% within a defined candidate-review budget. The evaluation protocol must report uncertainty, the distribution across queries, and a complementary precision or review-burden target. Omissions of high-importance evidence are measured separately and are not covered by the general error budget.

For this kind of requirement, a prompt/model combination may be a suitable implementation. Evaluation is then the principal evidence for the system claim, while monitoring checks whether its assumptions continue to hold.

### Best-effort behavior


Best-effort requirements describe desired qualities without promising a particular success rate. Prompts are often sufficient when failures have limited consequences and the surrounding product can tolerate them. Tone, wording, optional observations, and exploratory categorization often fit here.

Calling a behavior best effort must not be used to hide a consequence that the product actually treats as mandatory.

## The prompt-only enforcement anti-pattern


The anti-pattern appears in a flow like this:

```text
requirement
    ↓
prompt instruction
    ↓
LLM output
    ↓
trusted result or committed action
```


The architecture assumes that because the requirement was clearly written, the output may be trusted as though the requirement had been enforced.

A design for a hard property makes the acceptance boundary visible:

```text
requirement
    ↓
prompt/model candidate
    ↓
acceptance control appropriate to the property
    ↓
accepted result or rejected candidate
```


Making the boundary visible is necessary but not sufficient. The control at that boundary must itself have failure properties and evidence adequate to the requirement.

A statistical requirement needs a different kind of evidence:

```text
requirement
    ↓
prompt/model behavior
    ↓
representative evaluation and production monitoring
    ↓
evidence that the population-level target is met
```


"Prompt-only" refers to the basis for trust, not merely the number of components in the diagram. Adding a second model call or a superficial format check does not close a support gap unless it materially addresses the relevant failure modes.

When the mismatched property is a hard invariant, **prompt-encoded invariant** is a useful name for the especially serious subtype.

## What changes when behavior is implemented with prompts


Moving behavior into a prompt does more than change where a rule is written. It changes the mechanism that interprets the rule. A prompt lets the system handle language, context, and judgment that may be hard to express as exact rules. In return, more behavior depends on how the model interprets the instruction, the context it receives, the model version, and the runtime state.

The causal stack traces these effects from [natural-language properties]({{< ref "ai-engineering/causal-stack/layer-0-natural-language-properties" >}}), through [base LLM mechanisms]({{< ref "ai-engineering/causal-stack/layer-1a-base-llm-mechanisms" >}}) and [learned model behavior]({{< ref "ai-engineering/causal-stack/layer-1b-final-scheme" >}}), to [AI-system causal features]({{< ref "ai-engineering/causal-stack/layer-1c-ai-system-causal-features" >}}). In short, the model infers the task from text and context, instructions and data share a model-readable channel, and the result depends on the full runtime scenario rather than on the visible prompt alone.

These conditions are not automatically failures. Variation and context sensitivity are often part of why a prompt is useful. The design question is whether their benefits fit the task and whether the system can measure and contain the resulting failures.

| Variant | Good fit | Main benefit | Main trade-offs |
|---|---|---|---|
| Application-owned rule or state machine | Exact relations, permissions, state changes, and hard boundaries | Explicit execution, direct testing, and usually low runtime cost | More formalization and maintenance; poor fit for fuzzy semantic judgment |
| One bounded prompt | A small semantic task with limited consequences | Simple flow, low orchestration cost, and the full task context in one call | Coupled instructions, prompt sensitivity, broad change effects, and more difficulty finding which part failed |
| Fixed mixed workflow | A known multi-step task containing both exact and semantic work | Smaller prompt tasks, explicit state, parallel work, local retries, and step-level tests | More handoffs, error propagation, orchestration, calls, latency, and trace requirements |
| Model-directed workflow | A task where the useful route cannot be fixed in advance | Adaptive routing and tool choice | Variable paths, cost, and stopping behavior; harder evaluation; greater state and action risk |

These choices can be combined within one system. Choose per task and system boundary, not once for the whole application. Use prompts where semantic judgment is needed. For a multi-step task that needs several stages, prefer a fixed mixed workflow over model-directed control when those stages are known. Use model-directed control only when the adaptive path adds measured value. Keep permissions, commit boundaries, hard rules, budgets, and stop conditions application-owned.

A prompt call does not by itself create a pipeline, a feedback loop, or a model-directed workflow. Those conditions arise when the application connects model output to later steps, stored state, tools, or actions.

Deterministic decoding can make one runtime scenario more repeatable without making its result correct. One successful run shows that the system worked once; it does not establish stable behavior over repeated runs or reasonable variations. A prompt/model combination can support a statistical claim when representative evaluation shows that it meets the target under stated conditions. It does not establish that a property holds for every accepted result.

For the Knowledge Assistant, corpus accounting, permissions, user selection state, and context construction remain application-owned. Alias generation, grouping, and synthesis are bounded prompt tasks inside a fixed mixed workflow. A model-directed discovery loop may be added only as an optional, read-only path with an explicit budget. It cannot change permissions or commit external actions.

The safer principle is:

> A prompt instruction states intended behavior. Measured behavior and runtime controls determine whether the system can be relied on.

## A middle pattern: task-specific prompts in a workflow


A complex task does not need to live in one large prompt. The application can split it into smaller tasks and use a separate prompt only for steps that need model judgment. This separates prompts by task while keeping their inputs and outputs explicit. The application owns the order of work, branches, state, routing, retry limits, permissions, and stop conditions. It defines the allowed nodes and connections; the model does not invent or change the workflow for each request.

Each prompt task should have:

- one clear job;
- named inputs;
- a defined output shape;
- only the context and tools it needs;
- a task-level test or evaluation; and
- a defined response to missing, invalid, or uncertain output.

A knowledge assistant could use a mixed workflow like this:

```text
user question
    ├─ literal retrieval [code] ─────────────────┐
    ├─ alias generation [prompt]                 │
    │       ↓                                    │
    │  expanded retrieval [code] ────────────────┤
    └─ semantic retrieval [retriever] ───────────┤
                                                  ↓
                                      merge and deduplicate [code]
                                                  ↓
                                      group candidates [prompt]
                                                  ↓
                                      user selection [application state]
                                                  ↓
                                      build selected context [code]
                                                  ↓
                                      synthesize [prompt]
                                                  ↓
                                      evaluate or review [prompt evaluator or human]
                                                  ↓
                                      accept, qualify, or reject [application state]
```


The independent retrieval branches can run in parallel. When node inputs and outputs are stored, a failed node can be retried without rerunning every earlier node. Separate prompts also make it easier to test, version, and trace each model task. Record the graph version, prompts, model settings, corpus and index snapshot, retriever settings, node inputs and outputs, and user decisions. This makes a run easier to reconstruct and compare, even when a model call cannot be replayed exactly.

This does not mean that every node should be a model call. Literal retrieval, merging, selection records, context construction, permission checks, and hard rules are better owned by the application when they can be expressed directly. Prompt nodes are useful for tasks that need semantic judgment, such as suggesting aliases, grouping passages, or writing a synthesis.

Instruction-like text inside retrieved documents remains source data when passed between nodes. It cannot by itself select prompts, change routing, grant permissions, or alter retry and stop rules. The application makes those decisions from trusted workflow state.

The forward workflow can be a directed acyclic graph, or DAG: nodes may branch or join, but their dependencies do not form a loop. Retrying one failed node repeats its execution without changing the graph. If review can send the user back to evidence discovery, the complete process has a loop and should be modeled as a workflow or state machine around the forward DAG.

This pattern organizes the work. It does not make model output correct, prevent errors from spreading to later nodes, make a model reviewer independent from the generator, or enforce a hard property. A structured output check establishes shape, not semantic correctness. Hard rules and authorization boundaries still need application-owned controls.

Each prompt node should be evaluated for its own task, and the full workflow should be evaluated end to end. Passing every node-level check does not show that the full workflow meets the system requirement.

## Controls answer different questions


Validators and other controls answer different questions. An architecture review should identify the type of control, the failure it addresses, the evidence that it works, and the limitations that remain.

| Control | Examples | What it checks or contributes | Important limitation |
|---|---|---|---|
| Structural acceptance control | Constrained decoding, parser, schema validator, type check, database constraint | Whether an output has an allowed structure or satisfies a mechanically checkable relation | Does not establish that its content is true or semantically supported |
| Rule-based acceptance control | Policy engine, calculation, state machine, referential check | Whether a precisely encoded relation holds for the supplied inputs | Depends on correct rules, trusted inputs, and implementation quality |
| Probabilistic verification | Classifier, entailment model, second LLM review | Additional measured evidence about a semantic property | Remains fallible and may share failures with the generator |
| Human verification | Editorial approval, domain review, two-person approval | Contextual judgment at a review boundary | Has capacity, consistency, fatigue, and training limits |

The first two kinds of control enforce a property only when the application connects them to an acceptance or commit boundary that blocks failures and cannot be bypassed. Moving a rule from a prompt into code is therefore not sufficient reasoning on its own. Application code may enforce `amount <= approved_limit` at a non-bypassable approval boundary when its inputs and arithmetic are trusted. A second LLM checking whether a claim is supported remains a probabilistic mechanism, even when it sits outside the generation prompt and is called a verifier.

Controls also play different roles in failure handling:

- **Prevention** restricts generation or blocks an invalid result before commitment.
- **Detection** makes a failure observable, possibly after it occurs.
- **Containment** limits what the model can access or the impact of a bad result.
- **Recovery** corrects, rolls back, or provides an appeal path after failure.

A complete design may need more than one. Detection does not prevent harm, containment does not correct the underlying error, and some disclosures or external actions cannot be recovered.

### Independence matters


A verifier's value as evidence depends on its own accuracy and coverage and on how its errors correlate with the generator's. Running the same model with the same evidence, assumptions, and similar instructions twice may reproduce the same mistake. Agreement between the two calls can then create apparent confidence without adding much support.

Independence can be improved by using controls based on different mechanisms or information:

- compare the output with authoritative application state;
- reconcile retrieval indexes with a versioned corpus manifest;
- use immutable source identifiers and anchored passages;
- combine retrieval channels with materially different failure modes;
- enforce numeric, authorization, or policy rules outside the model;
- keep untrusted instructions out of the verification context;
- use a separately trained classifier where its measured behavior is suitable;
- route high-consequence cases to human review; and
- measure the end-to-end failure rate instead of assuming that a second pass helps.

Independence is a matter of degree. Measure the verifier's added value against the failures that matter.

## Worked example: closed-corpus knowledge reconstruction


A knowledge assistant may promise:

> Given a topic or information need, recover all materially relevant information that exists anywhere in the user's notes before producing a synthesis.

This sounds like one behavior, but it bundles several properties with different failure modes:

1. An authoritative corpus manifest defines the versioned snapshot, and every source it names is accounted for.
2. Every source is parsed and indexed successfully, or its failure is made visible.
3. Every occurrence covered by the declared literal matching rules is returned.
4. Expanded lexical and semantic retrieval surface the materially relevant evidence.
5. User decisions to keep, exclude, or regroup passages are preserved exactly.
6. The synthesis context contains only selected evidence.
7. The synthesis faithfully represents the selected evidence, including material conflicts.

A prompt can request all of these properties:

> Search all my notes thoroughly. Find every materially relevant passage, do not miss anything important, and synthesize only the evidence I selected.

The instruction is useful, but it establishes none of the properties by itself. Accounting for a declared scope and preserving selection boundaries can be enforced mechanically. Semantic coverage and synthesis quality require measured or reviewed evidence.

| Knowledge-reconstruction property | Suitable control or evidence | Residual limitation |
|---|---|---|
| Every declared source is accounted for | Reconcile an authoritative, versioned corpus manifest with parse and index status | The declared scope may still differ from the user's intended scope; accounting also does not establish correct extraction |
| Declared literal matches are enumerated | Exhaustive lexical scan with tested normalization and matching rules | Coverage depends on correct extraction and the declared normalization rules; literal search also misses aliases and paraphrases |
| Materially relevant evidence is retrieved | Multi-channel retrieval plus coverage evaluation on representative query-corpus pairs, using evidence units aligned with the product claim and a defined review budget | Relevance is semantic, passage recall may not equal information coverage, and measured results apply only to conditions represented by the evaluation |
| User selection decisions are preserved | Application-owned selection records keyed by immutable passage IDs | Correct persistence does not establish that the user saw every relevant candidate |
| Only selected evidence enters synthesis | Build the model context from selected IDs rather than asking the model to remember exclusions | An allowed input set does not make the resulting synthesis faithful or complete |
| Synthesis reflects selected evidence | Semantic evaluation, conflict checks, or human review | Semantic judgment may remain probabilistic and share failures with generation |
| Grouping and presentation are useful | Product-quality evaluation and user correction | Presentation quality does not establish retrieval coverage |

A stronger design could use this flow:

```text
versioned corpus manifest [application state]
        ↓
parse and index coverage checks [code]
        ↓
literal and expanded lexical retrieval [code] + semantic retrieval [retriever]
        ↓
candidate passages with snapshot-bound IDs [application data]
        ↓
user keep, exclude, and regroup decisions [user + application state]
        ↓
build context from selected passage IDs [code]
        ↓
produce a synthesis candidate [prompt]
        ↓
faithfulness and conflict evaluation [prompt evaluator or human]
        ↓
accept, qualify, or return to discovery [application state]
```


The statistical claim needs a separate evidence path:

```text
independently labeled query-corpus cases
        ↓
per-channel and end-to-end coverage measurement
        ↓
regression gates and sampled corpus-wide audits
```


The evaluation must establish its denominator from the corpus rather than labeling only the candidates returned by the current retriever; otherwise, the omissions remain invisible. Its unit must match the product claim: passage recall is only a proxy for information coverage unless the relationship has been justified. Ordinary production monitoring can track observable signals such as ingestion failures, channel completion, drift, and truncation. Measuring recall in production requires sampled corpus-wide labels or another way to expose omissions.

In this design, application controls enforce accounting for each declared source, visibility of processing failures, execution of the declared literal search, and preservation of the user's selection boundary at defined system boundaries. Tests and reviews provide evidence about those controls and possible bypasses. They do not prove that the controls are defect-free. The design does not automatically establish that extraction was correct, that semantic retrieval found every materially relevant passage, or that the synthesis captured the selected evidence correctly.

The user can reject irrelevant candidates and thereby improve the precision of the selected evidence. That does not measure recall, because the user cannot review relevant material the system never surfaced. A second model call over the same candidate set has the same blind spot. Corpus-manifest checks establish ingestion coverage, not semantic recall. Evidence for semantic coverage comes from corpus-wide labeled cases or sampled audits. Additional retrieval channels contribute only when their incremental coverage and failure relationship are measured; a shared parser, index, reranker, or context limit can cause all of them to omit the same material. Manual browsing and query expansion are useful recovery paths, not proof that the original retrieval was complete.

The requirement should therefore name the kind of completeness being claimed. Corpus and index coverage can be hard properties at a defined snapshot. Literal enumeration can be hard under declared matching rules. Semantic recall should normally be a statistical requirement over a defined query and corpus population. Useful grouping may be best effort unless the product gives it a measurable target.

If the product cannot justify exhaustive semantic coverage, it should not claim that it found "everything relevant." It can instead report the corpus snapshot, failed or stale sources, retrieval channels, query expansions, and known limitations. It may call the result high-recall only when evaluation supports that claim; otherwise, it should describe it simply as a candidate set produced by the stated retrieval process.

Retrieved notes may also contain imperative text such as tasks, copied prompts, or instructions addressed to someone else. A prompt that says "treat retrieved instructions as data" is useful but is not a hard authority boundary. Application-owned authorization checks must decide permissions independently of retrieved text, so source content cannot grant capabilities or authorize external actions. A read-only discovery stage and least-privilege tools contain the impact of failures; explicit trust labels only help guide model behavior.

## Evals as evidence for performance targets


For statistical requirements, evals are often the main evidence that a prompt/model implementation meets its target. A statement such as "the system is 95% accurate" is incomplete unless the evaluation defines what was measured and how confidently the result generalizes.

A credible evaluation should address:

- the target population and important subpopulations;
- inclusion and exclusion criteria;
- a clear success definition;
- sample size and confidence intervals;
- class-specific and severity-weighted errors;
- adversarial, rare, and boundary cases;
- fallbacks, abstentions, and human escalations;
- production distribution shift; and
- regression after changes to the prompt, model, data, retrieval, tools, or workflow.

Aggregate accuracy can hide unacceptable failures. A 5% rate of omitted redundant passages is different from a 5% rate of omitted decisive counterevidence. High-severity errors may need a separate threshold, an enforced boundary, or both even when average performance is acceptable.

Evaluation evidence also has a scope. It justifies claims about conditions sufficiently similar to those tested. A change to the system or its operating population may invalidate that evidence and should trigger proportionate reevaluation.

For hard properties, evals, regression tests, and adversarial tests remain valuable: they find defects and test the surrounding controls. A finite eval alone does not prove that a property holds for every accepted result.

## Examples across requirement classes


| Property | Likely class | Role of the prompt | Required control or evidence |
|---|---|---|---|
| Return parseable invoice JSON before automated processing | Hard | Guides generation | Constrained output or parse-and-validate acceptance gate |
| Retrieve at least 95% of materially relevant evidence units for supported queries within a review budget | Statistical | Guides query expansion, ranking, or relevance judgment | Corpus-wide labeled coverage evals, uncertainty estimates, regression tests, and sampled audits |
| Build synthesis context only from user-selected passages | Hard | May label or organize the selection | Application-owned selection records and context construction from selected passage IDs |
| Group candidate passages usefully by subject | Statistical or best effort | Implements intentionally fuzzy behavior | Product-appropriate quality evaluation and user correction path |
| Do not approve an amount above the account limit | Hard | May explain the rule or propose an action | Authoritative calculation or policy check before approval |
| Allow access only to the user's records | Hard | Should not be the authority | Access control outside the model and least-privilege tool access |
| Move a case only to a valid next state | Hard | May propose a transition | State machine or transactional constraint validates it |
| Prefer concise explanations | Best effort | Implements the behavior | Ordinary product-quality review |

This table does not imply that every exact operation belongs in conventional application code. It shows that the trusted boundary must be supported by a mechanism whose failure properties match the requirement.

The familiar distinction between semantic/model logic, business policy, and deterministic application logic is useful description, but it is not the decision rule. Semantic work may need a hard review boundary. Business policy may intentionally permit measured error. Seemingly trivial formatting may be critical. The requirement class and failure tolerance decide.

## Architecture review method


Review each prompt-specified requirement through this sequence:

```text
Requirement
    ↓
Class, boundary, and failure tolerance
    ↓
Implementation mechanism
    ↓
Controls and evidence
    ↓
Failure handling
```

### 1. State the requirement precisely


Ask what must be true, at which boundary, for which inputs, and under which conditions. Avoid terms such as *reliable*, *safe*, *accurate*, and *grounded* unless they are given an operational meaning.

### 2. Classify the requirement and its failure tolerance


Determine whether the property applies to every accepted result, to a measured share of a defined population, or only as a best-effort objective. Record the severity, detectability, and reversibility of failure as well as its frequency.

### 3. Identify the actual implementation


Do not stop at "the prompt handles it." Identify the model, context, tools, application code, data sources, human steps, and the boundary at which the output becomes trusted.

### 4. Identify the evidence and controls


Ask:

- For a hard property, what runtime control applies the requirement at the trusted boundary?
- What evidence tests that control, its inputs, and possible bypasses?
- For a statistical requirement, what evaluation measures the target and its uncertainty?
- Which failures are prevented, detected, contained, or addressed through recovery?
- Is verification sufficiently independent from generation?
- What assumptions must hold for the controls to work?
- Which system changes require reevaluation?

"The prompt explicitly says so" is a specification answer, not evidence.

### 5. Close or acknowledge the gap


Possible responses include:

- introduce a stronger acceptance boundary;
- validate or constrain the output;
- reduce model permissions or action scope;
- add independent or human review for high-consequence cases;
- define and evaluate a statistical target;
- add monitoring and recovery;
- narrow the supported population; or
- weaken the requirement to match what the system can support.

If the gap cannot be closed, the system should not claim the stronger property.

## A compact review test


Start with:

> What exactly must hold, at which boundary, and with what failure tolerance? What controls apply it, what evidence tests them, and what happens when they fail?

Then branch by requirement type:

```text
Every accepted result
    → What prevents an invalid result from crossing the trusted boundary?

X% over population P
    → What representative evaluation, uncertainty estimate,
      and monitoring show that the target is met?

Best effort
    → Are the consequences of occasional failure actually acceptable?
```


For every branch, ask whether verification and control failures are sufficiently independent of the generator's failures, and whether remaining failures are detectable, containable, and recoverable.

Warning signs of prompt-only enforcement include one or more of the following:

- The consequence of violation exceeds the stated tolerance.
- The primary justification is that the prompt instructs the model correctly.
- Evaluation does not establish a claimed statistical reliability.
- Checks do not address the relevant semantic failure.
- A verifier is subject to substantially the same failures as the generator.
- No adequate enforcement, verification, containment, or recovery mechanism closes the gap.

## Terminology


**Prompt-specified system** is a neutral descriptive term in this note. It says where important behavior is specified without implying that the behavior is correct, reliable, or enforced.

**Prompt-only enforcement** is the proposed anti-pattern within that broader category. **Prompt-encoded invariant** names the hard-property subtype.

Related research uses [**promptware**](https://arxiv.org/abs/2503.02400) for systems that treat prompts as first-class software artifacts and use them as a primary interface for directing LLM behavior. [**Prompt programming**](https://doi.org/10.1145/3729342) describes the practice of developing prompts that function like programs. These are useful emerging terms, but neither makes prompt-heavy architecture an anti-pattern by itself. For an architecture review, the descriptive phrase *prompt-encoded logic* is often clearer than inventing a named architecture style.

## Rationale for this framing


This note makes several deliberate choices.

First, it uses **prompt-specified system** as a neutral umbrella rather than treating prompt-heavy design as an anti-pattern. Prompts are a natural place for semantic analysis, classification, synthesis, and other behavior whose intended semantics are judgmental. Calling the whole architecture defective would obscure the narrower problem and make the argument easy to dismiss.

Second, it defines **prompt-only enforcement** as a support gap rather than as "business logic in prompts." The category of the logic is only a rough clue. A business rule may legitimately be statistical, while a formatting rule may be a hard requirement when another service consumes the output. The requirement class and failure tolerance are better guides for the design.

Third, it keeps **invariant** strict. A property that may fail within an accepted error budget is not an invariant in the conventional software sense. Calling it a *probabilistic invariant* would blur the difference between a per-result contract and a population-level performance target. The hard, statistical, and best-effort classes make that distinction explicit.

Fourth, the note does not reduce the remedy to "put it in deterministic code." Code can contain defects, inputs can be untrusted, and some semantic properties cannot be decided mechanically. The relevant question is whether the chosen mechanism, controls, evidence, and failure handling justify relying on the system claim. Structural validation, rule-based enforcement, probabilistic verification, and human review answer different questions.

Fifth, task-specific prompt workflows are treated as an implementation choice, not an enforcement mechanism. Splitting a large prompt into smaller tasks can make inputs, outputs, and failures easier to inspect and test. It does not stop errors from spreading between nodes or replace application-owned controls for hard properties.

Sixth, verifier independence is explicit because adding another model call can look like defense in depth without providing it. A verifier adds useful evidence only when its accuracy, coverage, and shared failures with the generator are measured. Repeating the same assumptions through the same model may preserve the original failure.

Finally, closed-corpus knowledge reconstruction is the main example because it exposes the boundary between mechanically checkable scope and semantic completeness. Corpus membership, index status, literal matching, and selection records can often be checked directly. Whether retrieval found every materially relevant passage and whether a synthesis represented the evidence faithfully require semantic judgment. A user can curate the candidates shown but cannot identify an omission that retrieval never exposed. Treating these properties as one promise to "find everything" would hide the exact support gap the note is intended to reveal.

Together, these choices keep the claim narrow: prompts are not the problem, and probabilistic implementation is not the problem. The problem is trusting a mechanism beyond what its evidence and failure controls justify.

## Conclusion


Prompt-specified systems are a legitimate way to build software. Prompts can specify behavior, and prompt/model mechanisms can implement analysis, classification, transformation, workflow, and decision behavior. For statistical and best-effort requirements, a prompt/model mechanism may be exactly the right design.

The anti-pattern is not "important logic in prompts." It is an unsupported system claim: the system treats the presence of an instruction as sufficient reason to trust that the resulting property holds.

The durable principle is:

> Prompts may specify behavior, and prompt/model mechanisms may implement it. Trust their results only to the level justified by measured performance and by any controls and failure handling required for the consequences involved.

Or, as the review framework:

```text
Requirement → class, boundary, and failure tolerance
            → implementation mechanism → controls and evidence
            → failure handling
```


Do not confuse a requested behavior with a property the system enforces or supports with evidence.

## Related sources


- Chen et al., [*Promptware Engineering: Software Engineering for Prompt-Enabled Systems*](https://arxiv.org/abs/2503.02400).
- Liang et al., [*Prompts Are Programs Too! Understanding How Developers Build Software Containing Prompts*](https://doi.org/10.1145/3729342).
- NIST, [*Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*](https://doi.org/10.6028/NIST.AI.600-1).
- OWASP GenAI Security Project, [*LLM01:2025 Prompt Injection*](https://genai.owasp.org/llmrisk/llm01-prompt-injection/).
