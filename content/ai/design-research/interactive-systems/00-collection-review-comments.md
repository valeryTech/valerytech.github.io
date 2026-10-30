---
draft: false
toc: true
description: "A collection review identifies missing relationships between view edits, revisions, jobs, interventions, and result use, proposing a worked asynchronous example and comparison agenda without merging the source models."
title: "00 Collection Review Comments"
linkTitle: "00 Collection Review Comments"
---
# Review of the interactive systems collection


Date: 2026-04-01. The review is new editorial analysis, separate from the retained dialogues. The recommendations and example below are proposals for discussion, not an accepted system design.

Keep the retained passages in their current notes. The main overlap concerns different questions about the same work, rather than passages that should be merged. A topic-based reading path can make the distinctions easier to follow without removing repetitions or separating examples from their arguments.

The first detailed comparison concerns application state, program and run history, and inspectable pipeline workbenches. Their missing connection is a defined route from an edit in a view to a recorded change, a computation, and a decision about using its result.

## Scope of the review


I read all twelve main notes in this collection, their existing comment notes, and the collection index and comments. I also read the complete program-history note and its comments, the verification-and-acceptance note, the investigation-evaluation note and its comments, and the opening Matrix case note.

The wider boundary check used the retrieval examples and comments, selected runtime passages about traces and guarded procedure reuse, the substrate passages about revisions and effects, the concrete-authorization passage, and comments on domain contracts and the proposed investigation paper. The boundary check was not a complete review of design research or the Hebbia input folder.

No cited paper, product description, benchmark, economic prediction, or unavailable attachment was independently checked. Reading a saved claim does not verify it. No source passage was moved or rewritten during the review.

## A topic-based reading path


The [existing index]({{< ref "ai/design-research/interactive-systems/00-index" >}}) preserves the sequence of source passes. Use the following groups when reading for a design question. The groups are navigation choices, not proposed folders.

| Design question | Notes to read together | Distinction to retain |
|---|---|---|
| What prompted the investigation? | Read the [author's observations]({{< ref "ai/design-research/interactive-systems/04-design-observations-from-hebbia" >}}), then the Matrix critique. | The author's enthusiasm, proposed extensions, and the LLM's product interpretation have different sources. |
| What can people inspect and compose? | Read [shared state and views]({{< ref "ai/design-research/interactive-systems/01-shared-investigation-state-and-views" >}}), [stable components]({{< ref "ai/design-research/interactive-systems/02-stable-interface-components" >}}), and [composable workspaces]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}). | A domain object, an operation, and its displayed view are different concepts. The later user correction questions a fixed representation. |
| How do edits and computations behave over time? | Read [application state]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation" >}}), [program and run history]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}), and [workbench records]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}). | Current interaction, recorded attempts, and experimental observations need related but distinct records. |
| How does an expressed request become an interaction? | Read [language intent]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}), [generated workspaces]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition" >}}), and [domain boundaries]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}). | An interpretation, a view, an available operation, and permission to perform it are separate. |
| How can interaction help improve a pipeline? | Read the [design method]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}), [workbench example]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}), and [goals and principles]({{< ref "ai/design-research/interactive-systems/12-exploratory-pipeline-design-goals-and-principles" >}}). | Helping one execution differs from testing a rule for future executions. The third formulation remains marked for analysis. |
| Where can implementation examples be investigated? | Read the [complex-interface reading dialogue]({{< ref "ai/design-research/interactive-systems/06-complex-interface-reading-path" >}}) and its [comments]({{< ref "ai/design-research/interactive-systems/06-complex-interface-reading-path-comments" >}}). | The saved practitioner descriptions are leads for a later source review, not established implementation choices. |

Evidence representations belong beside the [retrieval discussion]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#interactive-rag-and-query-understanding). Questions about support and result use belong beside [verification and acceptance]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}). Linking the discussions does not require moving either into the interface collection.

## Application state, history, and workbenches should stay separate


The notes describe related work at different levels. Their vocabularies should be compared before any names are treated as equivalent types.

| Existing note | Main question | What remains open at its boundary |
|---|---|---|
| [Application state and computation]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation" >}}) | What happens when a person edits, starts work, cancels work, or receives a result? | The sketch does not define accepted transitions, concurrent editing, or the rule for applying a completion. |
| [Program versions, runs, and results]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | Which revisions, inputs, attempts, outputs, and decisions explain the work? | Recorded history does not select which result a current view should display or how a view requests a change. |
| [Inspectable pipeline workbenches]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}) | Which artifacts and judgments allow inspection, intervention, and comparison? | The record list does not define how an intervention affects a live run, a saved variant, or later experiments. |
| [Exploratory pipeline design]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}) | How could observations help discover a better procedure? | An observation does not, by itself, establish a reusable rule or permission to adopt it. |

The application example places editing, computing, results, and failure in one alternative state value. The accompanying text discusses edits while several jobs are in progress, but the example does not define how those conditions coexist. The [application comments]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}#separate-the-kinds-of-state) already separate document, interaction, job, and derived state. A later relationship note should connect those meanings to history rather than copy another state catalog.

A workbench's pipeline variant may include models, prompts, retrieval settings, and assembly rules. A saved program revision is a related idea, but the notes do not establish that every variant is a compiled program. Likewise, a scenario, a changing information need, and an accepted goal revision can concern the same task without being interchangeable records.

## The missing rules between the notes

### State ownership and view edits


The shared-state proposal favors several views over common objects. It does not require every participant's selection, focus, layout, or draft interpretation to be shared domain state.

A later design needs to state what each control changes. Reordering visible rows could change only a display order, while reordering the context sent to synthesis could change an input artifact. Similar gestures can therefore require different records and checks.

### Revisions, jobs, and result use


A job identifier distinguishes attempts without establishing that the returned result applies to the current inputs. The [history note]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#6-execute-and-retain-the-trace) proposes recording exact input and program revisions. The [revision-integrity passage]({{< ref "ai/design-research/01-foundations/05-constrained-common-substrate" >}}#revision-integrity) preserves earlier results while allowing dependent results to become stale.

The unresolved rule is how the application uses that information. The design must distinguish displaying an earlier result for inspection from selecting it for the current task. A changed source, goal, interpretation, configuration, or policy need not affect every result in the same way.

### Actions, reasons, and judgments


The workbench reply describes interventions as engineering observations rather than UI events. An action can still begin as a UI event, and only some events produce a domain change or a useful observation.

Promoting a passage records an action. A reason for promotion records the participant's interpretation, and a relevance label records a judgment. Neither the action nor the label proves that the passage is sufficient or that the change should apply to other scenarios. The [workbench comments]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches-comments" >}}#record-an-intervention-separately-from-its-meaning) provide the starting distinction.

A later design should identify whether an intervention changes one run's artifact, a saved pipeline variant, or a candidate policy. A correction to the current answer should not silently update the default procedure.

### Acceptance and authority


Evidence relevance, answer acceptance, policy adoption, and authorization of an external action concern different decisions. A single approval label would leave the scope unclear.

The [verification note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) already distinguishes checks from acceptance for a purpose. The [concrete-authorization passage]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#authorization-of-concrete-operations) concerns the separate operation and its arguments. The interface collection should link those distinctions rather than introduce a competing approval model.

### Inspection, repeated execution, and replay


Stored records allow inspection of an earlier outcome. Performing the same procedure again can produce a new outcome, and the notes do not define a single replay contract.

The second exploratory-design formulation requires every run to be replayable, while the third permits inspection as an alternative. The [history comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}#inspection-and-replay) already identify the limit of saved versions. Keep the differing formulations visible until a design states which operations reuse recorded outputs and which perform new work.

### Comparison and policy adoption


An intervention that helps one answer can suggest a policy without demonstrating that the policy improves other cases. Policy derivation and policy evaluation need separate cases or another stated method for avoiding evaluation on the examples used to form the rule.

The workbench also needs to distinguish the effect of a changed pipeline from the effect of additional reviewer effort. The [investigation evaluation proposal]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}#the-evaluation) concerns evidence and contract behavior. The [paper comments]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper-comments" >}}#evaluation-agenda-and-benchmark-boundaries) identify the separate need to observe people's understanding and correction effort.

The runtime already retains a [proposal for guarded procedure reuse]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#distribution-shift-and-deoptimization). The exploratory-design notes concern how a rule might be discovered, while the runtime passage concerns when a saved procedure might apply. Keep the questions connected without adopting either proposal through rearrangement.

## Repetition and differences to preserve


The initial shared-state reply favors an investigation graph, while the later composition question asks whether fixed shapes restrict the work. Keep the correction beside the earlier proposal through links rather than removing one version.

The Matrix passages use the name for a product, a view, and an operation. The meanings need explanation, not a merged definition that silently makes the operation determine every possible view.

The stable-component proposal and the generated-workspace proposal address different choices. Selecting a layout from familiar controls differs from generating a new interaction grammar or arbitrary application code. A future comparison should distinguish the choices instead of treating the notes as either identical or wholly opposed.

An execution edge records an operation's relationship to another operation. A derivation edge records how an artifact was produced, while an evidence-support relation concerns a claim and its sources. The diagrams can refer to the same work without requiring one graph with interchangeable arrows.

The workbench's demand for an artifact from every stage and the method's preference for selected interaction points also need separate interpretation. Persisting an output does not require exposing every internal step as a control. The sources have not selected what counts as a stage or which information a participant needs.

## A concrete example for a later design discussion


The following example is new and hypothetical. It can test the relationship rules without selecting a framework or implementing a prototype.

1. First, a person confirms an information need and starts retrieval against source revision 1 using pipeline variant A. The run records its exact inputs.
2. Second, the person changes the information need and starts another run before the first run finishes. The design needs a rule for associating each completion with its request and revision.
3. Third, the first run finishes last. The design needs to state whether its result is displayed as historical, becomes a comparison candidate, or is otherwise handled. Arrival order alone does not establish relevance to the current task.
4. Fourth, the person promotes a passage in the second result and adds a reason. The design needs to distinguish the changed artifact from the judgment, and to state whether downstream synthesis runs again.
5. Fifth, the person accepts a resulting answer for the current task. A later experiment may use the recorded intervention to propose a new policy, but answer acceptance does not establish policy adoption or permission to publish the answer.

Undo, cancellation, concurrent edits by another participant, and a changed source revision can extend the example later. Each extension needs a defined outcome rather than another unnamed status field.

## Recommended next work


First, use the topic groups above alongside the existing source reading path. The current review supplies the additional navigation, and no further movement of original text is recommended for the first comparison.

Second, discuss the concrete example and write a separate proposed relationship note. It should state what an edit targets, which revision a job reads, and when a result may be used. It should also distinguish intervention scope, judgment scope, and acceptance or authority decisions. Do not repeat the existing source catalogs or declare their names equivalent without a decision.

The [proposed relationship note]({{< ref "ai/design-research/interactive-systems/13-edits-runs-and-result-use" >}}) now develops the example for discussion. Its edit, run, intervention, judgment, and acceptance rules remain proposals rather than decisions adopted through the review.

Third, review the language-intent, generated-workspace, and domain-boundary group in the same detail. The specific question is how an editable interpretation and a displayed preview remain connected to the operation eventually submitted, especially after an input changes.

Folder renames, source merges, implementation choices, and new experiments remain unselected. The broader design-research collection and product source claims need separate reviews if their conclusions are taken further.

## Preservation and verification


The review adds commentary and a link from the collection index. It does not change the source mapping or the retained passage ranges recorded in the [reassembly log]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}).

The initial review's before-and-after comparison covered 140 existing Markdown and JSON files in interactive systems, design research, and the Hebbia input folder. The only changed existing file was the collection index, which received the review link. The other 139 files were unchanged.

All 48 mapped source passages across the eight current reassembly audits still reconstruct their original sources exactly, including their recorded line counts, bytes, checksums, and final-newline conditions. The checks validate preservation, not the sources' claims.

During the initial review, the review and updated index passed checks for 101 local links, including 23 heading anchors. New prose passed the whitespace check, and the scoped `git diff --check` passed. The repository's existing Git index was unchanged. No files were staged, unstaged, or committed by the initial review.
