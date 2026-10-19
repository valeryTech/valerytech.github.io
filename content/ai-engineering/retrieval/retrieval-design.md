---
draft: false
toc: true
title: "Retrieval Design"
linkTitle: "Retrieval Design"
---
# Retrieval Design: Simple Baselines, Interactive Experiments, and Shared Work


Retrieval design tests how to construct context that fits a user's current task and the operation that will consume it. A useful first implementation makes its requirements, acquisition choices, selected inputs, and checks visible enough to inspect, change, and compare. The flow itself is a design hypothesis.

An LLM can interpret a request, suggest queries, judge candidates, compress context, and synthesize an answer. Whether it should perform each operation is a separate design question. Assign a model a bounded responsibility, expose its actual output, and compare the resulting workflow with a simpler alternative.

This develops the engineering method behind the [domain model]({{< ref "ai-engineering/retrieval/model" >}}) and its [evidence-workflow specialization]({{< ref "ai-engineering/retrieval/reframing-proposed" >}}). The [contract note]({{< ref "ai-engineering/retrieval/conceptual-alignment" >}}) separates responsibilities, while [representation design]({{< ref "ai-engineering/retrieval/model-representation-design" >}}) develops access-view choices. The method also adapts the exploratory pipeline-design notes and their critical commentary. These are design proposals and sources of questions, rather than measured evidence that one workflow always works.

## State what the current operation needs


Begin with a task scenario, the next consuming operation, and a concrete uncertainty. The operation may be source inspection by a person, a deterministic calculation, a comparison, or generation. It should not default to an LLM answer when discovery is the user's current purpose.

Record enough to make a comparison interpretable:

| Element | Question to answer |
| --- | --- |
| Current purpose | What would count as progress or completion for the user now? |
| Consuming operation | Who or what will use the inputs, in what form, and under what limits? |
| Context requirements | What material must be available or checked, and why? |
| Available material | What is already supplied or retained, and what needs acquisition? |
| Assessment basis | What observations or reviewed examples would justify using the context? |
| Open uncertainty | Which assumption or failure does this experiment address? |

Requirements can be provisional. An exploratory task can begin with finding inspectable material and documenting search limitations, then develop more specific questions. An exact identifier request can already be a suitable lookup query. Separate conceptual roles without manufacturing transformations or model calls.

Context assessment asks whether particular inputs are adequate for the current operation. The experiment asks how reliably a proposed method constructs and assesses such inputs across cases. Check the resulting task outcome separately from both.

## Start with a small, real, inspectable baseline


Choose a bounded source scope and a concrete information need. For a retrieval experiment, make the initial behavior easy to explain: which sources were searched, what matched, what was returned, and what the user can inspect next. If supplied material is already sufficient, a no-new-acquisition baseline may be appropriate.

For an exact concept such as `DSL`, a useful baseline might be literal matching, original paragraphs, and a source reader. A paraphrase task may justify a simple semantic route immediately. The starting point should expose the uncertainty in the actual task; no particular retrieval algorithm is a universal first step.

Keep the first experiment narrow. It can establish whether people can find and inspect relevant material before adding automated evidence judgment or synthesis. Use a few real examples that expose different difficulties: exact vocabulary, paraphrases, conflicting notes, repeated text, and a subject the corpus does not cover.

Simplicity means a small set of explicit assumptions and observable decisions. A two-box `search → LLM` diagram can hide choices about source scope, granularity, ranking, omission, context order, and sufficiency. Record those choices even when the baseline automates them.

An automatic end-to-end baseline can be useful for comparison. Keep its intermediate results available so a plausible final answer does not become the only evidence that retrieval worked. A model might explain DSLs convincingly while missing the particular disagreement the user wanted to find in their notes.

## Decompose the flow into elementary decisions


Use an elementary step to isolate a decision or transformation with an independently inspectable output. It should be possible to ask what it consumed, what it changed, and how its result can be checked.

A practical test for a boundary is whether it lets the team replace one method, intervene on one decision, or localize one failure while retaining the surrounding work. Split further when a step still hides several decisions that fail differently. Combine implementation details when separating them provides no useful observation or control.

These are conceptual boundaries. Several steps can share a function, process, screen, or database. A prototype can materialize them as ordinary records without first building a workflow engine or a DSL.

### Prepare the searchable corpus


| Step | Inspectable output | Design question |
| --- | --- | --- |
| Declare source scope | Source list and snapshot or revision references | What material is available, current, and included? |
| Parse source structure | Blocks, headings, tables, and source coordinates | Did parsing preserve the material and its location? |
| Choose source units | Paragraphs, sections, or other addressable units | Which boundaries preserve meaning for this corpus? |
| Derive retrieval views | Source text, sentences, propositions, questions, or fields with mappings | What information does each view expose or lose? |
| Encode or otherwise index a view | Versioned searchable representation | Which input and transformations produced it? |
| Synchronize derived state | Index contents and coverage report | Which sources or representations are missing, changed, or stale? |

Generated views and embeddings are optional implementation choices. Prepare them for the intended task families; runtime work can select among existing views. Preserve enough information to inspect their source inputs and transformations. Corpus preparation deserves its own analysis: a reranker restricted to a candidate pool cannot recover text that parsing discarded or indexing omitted.

### Find and use material


| Step | Inspectable output | Design question |
| --- | --- | --- |
| Capture the request and current purpose | Original request, supplied material, and current task interpretation | What does the user currently want to discover or accomplish? |
| Identify the consuming operation | Purpose, actor or method, input form, and limits | What operation will use the context next? |
| Derive current context requirements | Information needs, constraints, ambiguities, and assessment basis | What must be available or checked for that operation? |
| Propose an interpretation or expansion, when useful | Editable interpretations, aliases, or alternative queries | What meaning was added, and should it affect this search? |
| Choose acquisition scope and routes | Sources, channels, queries, filters, and limits | Where will the system look, and under what restrictions? |
| Acquire candidates per route | Hits with actual query, rank, score, and route | What did each method return or miss? |
| Resolve matches to sources | Verified source occurrences or explicit mapping failures | Can every displayed match be recovered from the original material? |
| Reconcile source identity | Equal, contained, overlapping, or distinct occurrences | Which results concern the same source material? |
| Rank candidates, if another ranking is needed | Ranking with method and scores | Does changing order improve the task under the same candidate pool? |
| Expand reading context | Paragraphs, sections, or windows linked to their locators | What context is needed to interpret the matched material? |
| Attribute a match, when useful | Source-aligned words or spans with a stated method | What can the representation actually explain about the visible text? |
| Assess usefulness | Judgments, reasons, uncertainty, and disagreements | Relevant to which task, and useful in what role? |
| Collect material | Selected source occurrences and collection events | What has been retained for further work? |
| Assess gaps and coverage | Requirement status and unreviewed or missing material | What remains unknown, and what is the scope of the coverage claim? |
| Assemble working context | Input manifest, source units, ordering, and transformations | What will the downstream operation actually receive? |
| Assess assembled context | Findings against requirements and consumer limits, with remaining gaps and conflicts | Does the actual input view preserve what the next operation needs? |
| Choose the next action | Continue scanning, acquire more, revise, clarify, proceed, or stop with a reason | What warrants the next decision under the current uncertainty and budget? |
| Perform the consuming operation | Inspection, calculation, comparison, extraction, synthesis, or another result | Did the person or component use its declared inputs appropriately? |
| Verify the outcome | Result checks, observed effects where applicable, and unresolved issues | What supports accepting the outcome for its intended use? |

The table is an analysis vocabulary, not a mandatory linear pipeline. Routes can branch, reading can reopen acquisition, and some tasks finish with discovery. Source identity may be resolved before or after ranking according to the method. Keep the dependencies explicit when experimenting with a different order.

Acquisition obtains material; assembly selects and structures available material into working context. Assessment can be interleaved with both, but should also consider what survives the actual assembly. A useful collected set can still produce inadequate inputs if compression drops an exception, ordering obscures a qualification, or the consumer needs another data format.

The boundaries also separate quantities that are easily confused: retrieval similarity, ranking, word attribution, relevance judgment, collection, and visual emphasis. Changing highlight opacity can remain a display operation. Changing a filter or the passages passed to synthesis changes a different part of the work.

## Analyze a step before deciding who performs it


For an uncertain operation, write down:

- Its purpose and the exact input it can access.
- Its output and what it may change.
- The current method, parameters, and assumptions.
- A source or check against which the output can be inspected.
- Its important failure modes and their downstream effects.
- A simpler alternative and the evidence needed to prefer the more complex one.

Choose among direct user action, deterministic software, retrieval models, and generative models for that specific operation. A source-range union has a different contract from interpreting an ambiguous inquiry. General claims that humans provide judgment or models handle scale do not establish competence on the particular cases.

For example, before adding LLM relevance filtering, inspect the raw candidate set and the source context supplied to the reviewer. Determine what “relevant” means for the inquiry and how disagreements will be represented. Then compare model suggestions with reviewed cases and with the existing workflow. Measure both useful exclusions and useful material incorrectly removed. Keep relevance judgments separate from judgments about source authority or support for a particular claim.

A failed final answer can then be traced to a narrower question: was the source absent, the view poorly chosen, the candidate missed, the context insufficient, the judgment wrong, or the supplied evidence misused? Each diagnosis calls for a different experiment.

## Build shared human–AI work around the same artifacts


The collaborative unit is the evolving inquiry and its artifacts. A person, a model-backed operation, and deterministic software can contribute to the same candidate sets, selections, questions, and judgments.

For example:

| Contribution | Possible allocation to test |
| --- | --- |
| Define scope and examples of useful material | Person supplies intent; model suggests interpretations; person can revise them. |
| Find candidate passages | Search methods acquire results; software retains routes and source identity. |
| Explore missing vocabulary | Person and model propose aliases and counterexamples; each resulting search remains inspectable. |
| Expand a fragment to its reading context | Person chooses context interactively; software applies a structural rule; a model can propose an alternative boundary. |
| Assess a candidate | Person or model contributes a judgment with its target and reason; disagreement remains visible. |
| Preserve and compare work | Software records inputs, revisions, outputs, and changes; participants inspect the comparison. |

These allocations are hypotheses to evaluate, not permanent assignments. A person can perform an operation manually while its contract is being understood. A tested rule or model can later perform the same operation without changing source identity or the meaning of its output.

The model can also help design the system: propose decompositions, find counterexamples, challenge a relevance criterion, or explain differences between runs. That design role is distinct from automatically judging every candidate at runtime.

Support language, direct manipulation, and examples together. A user might describe an information need in prose, edit suggested aliases, select passages with ordinary controls, and mark one example as “related vocabulary, wrong subject.” Each contribution should affect explicit state rather than requiring the system to reconstruct the decision from conversation history.

Shared storage alone does not establish shared understanding. Show the operative interpretation, match rule, and scope where they matter. The person and model may otherwise use “all matches,” “selected,” or “relevant” in different senses. The joint-activity commentary identifies this distinction between stored context and common ground.

## Use interaction for two learning loops


**The investigation loop improves the current work.** A person inspects a passage, adds its parent section, revises a question, or disputes a model judgment. This can be valuable in its own right, including after the underlying pipeline is mature.

**The design loop improves future behavior.** The team examines such interventions across scenarios, identifies recurring failures, proposes a policy, and tests whether it improves the workflow.

One action can contribute to both loops, but the records have different meanings. Adding a paragraph records a change to a particular selected set. “The preceding paragraph defines the acronym” records a reason. “Always include the preceding paragraph” is a new policy hypothesis requiring separate evidence.

A click can express navigation, curiosity, disagreement, or collection according to the interface. It becomes a relevance label only under a defined interpretation. Preserve uncertainty and conflicting judgments instead of automatically turning observed behavior into training targets.

The workbench model and comments and edits/runs proposal provide related questions about these records.

## Introduce interaction where it resolves a concrete uncertainty


Expose a useful intervention when a decision has a material effect, benefits from domain knowledge, or is hard to diagnose from the final result. Useful examples include changing query scope, inspecting an alias, expanding source context, comparing channels, disputing a judgment, and inspecting what enters working context.

Keep the audience in mind. A developer may need model and ranking parameters. An investigator may need source passages, context controls, and selection. The underlying decomposition can support both without requiring every end user to operate every step.

Let someone inspect retrieved material before optional model review or synthesis. Model suggestions can appear alongside candidates or as another inspectable result. This makes it possible to discover useful material the reviewer would have excluded and to decide whether the reviewer adds value at all.

Distinguish display changes, local processing, and new computation. Reordering a navigation view, choosing evidence order for synthesis, and running a new ranking are different actions. A control should make its effect understandable, and results should remain associated with the inputs that produced them.

## Iterate through small comparisons


For the DSL inquiry, an illustrative sequence is:

1. **Inspect a literal baseline.** Show original matching passages and their source context. Try to find known useful passages and collect a small set. Record failures such as missing vocabulary, fragmentary context, and difficult navigation.
2. **Add one semantic acquisition route.** Retain its candidates and route information alongside the literal baseline. Compare unique useful source occurrences, misses, redundancy, and review effort. Keep the same downstream reading and collection behavior where possible.
3. **Test one context-expansion rule.** On the same candidate pool, compare the locator alone with a paragraph or section expansion. Judge whether the added context resolves ambiguity or introduces distracting material. Record the additional reading or model-input cost.
4. **Test model review if judgment is a demonstrated bottleneck.** Make its suggestions inspectable, retain the underlying candidates, and compare kept and excluded material against reviewed scenarios. Include counterexamples and disagreements.
5. **Assess the assembled inputs for the intended operation.** Check source identity, required reading context, task support, conflicts, and consumer limits. A discovery view can be useful with open questions; a comparison claiming to resolve them needs a different basis.
6. **Add downstream synthesis when it serves the current task.** Record the exact evidence supplied and compare the result with the discovery-only workflow. Check support independently from writing quality. Other operations, such as a calculation or direct human inspection, can use the same contract without a generator.

Each iteration answers a question about one boundary. The sequence can stop as soon as the workflow is useful, or change when another uncertainty becomes more important. Keep a full-pipeline comparison as well, because improving a local metric can worsen the overall task.

Hold the source snapshot, scenario, and budget comparable when attributing a difference to a method. Separate the cases used to invent a policy from cases used to challenge it. Include reviewer time, correction burden, and information lost through filtering alongside retrieval or generation metrics.

## Preserve enough evidence to learn


A small experiment record can contain the scenario, requirement revision, consumer contract, source snapshot, operation and configuration, input references, context-assessment findings, actual outputs, interventions with reasons, observed outcome, and the next hypothesis. Record what is needed to understand the comparison rather than requiring a full investigation schema for every trial. Saved files or a small local store can be sufficient initially.

Retain the original stage output when an intervention creates a revised artifact. Record which version a downstream operation consumed. A result from an earlier query should remain associated with that query when it finishes after a newer run.

An assessment applies to particular requirements and inputs. Changing a source, requirement, selection, or consuming operation can make it stale. Preserve the earlier finding when useful while making its applicability clear. Keep input snapshots distinct from the larger investigation state that can supply later operations.

Recorded outputs support inspection. A new model call can produce a different result, so distinguish inspecting a saved run from executing a variant again. A generated explanation of why a source was selected should also remain distinguishable from the actual query, scores, and selection events.

The durable product of an experiment can be a better vocabulary, a failure case, a rejected assumption, a comparison procedure, or a narrow rule. These assets can survive a disposable UI or implementation.

## Automate a bounded operation when the evidence supports it


Repeated interventions suggest candidate policies. Evaluate a candidate against an explicit purpose, baseline, failure tolerance, and additional cases before adopting it. Repetition alone does not establish that it generalizes.

Progressive automation can lead to a deterministic expansion rule, an improved representation, a tested model reviewer, a validator, or a user-controlled decision that remains interactive. The useful division of work can stay hybrid.

After adopting a method, retain access to its important inputs, outputs, and correction points. Version the policy and track which results depend on it. Keep both local checks and whole-task evaluation as the surrounding workflow changes.

The engineering progression is: choose a small real task, expose its uncertain decisions, inspect and intervene, compare alternatives, record what was learned, and automate the operations whose behavior is supported by the evidence.

## Related design-research notes


- Exploratory pipeline design and its comments: interaction as a design method, with automatic baselines and runtime review kept in scope.
- Inspectable pipeline workbenches and its comments: artifacts, interventions, observations, and comparisons.
- Goals and principles and its comments: proposed progressive automation and the evidence its adoption would require.
- Participant profiles and its comments: allocation based on task-specific competence and failure modes.
- Collaborative-system design practices and its comments: shared work, initiative, steering, and recovery.
- Language and hybrid interaction: combining natural-language requests with direct manipulation and examples.
