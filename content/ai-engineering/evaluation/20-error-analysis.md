---
draft: false
toc: true
title: "20 Error Analysis"
linkTitle: "20 Error Analysis"
---
# Failure Understanding: Discovering and Structuring How LLM Systems Fail

## Intro


LLM applications rarely fail in only one visible place. A poor final response may originate in an earlier misunderstanding, an incorrect tool call, missing context, stale environment state, or a failure to preserve a user constraint. Evaluating only the final response can therefore conceal both the first visible problem and the way it propagates through the execution.

Effective evaluation requires a systematic way to identify how failures arise, how they differ, and which patterns recur across cases. We call this process **failure understanding**.

Failure understanding is an iterative method for developing an application-specific account of system failure. It draws on practices associated with grounded theory, particularly initial coding, constant comparison, theoretical sampling, and saturation reasoning. These practices are adapted for an engineering objective: producing a practical failure model that can support annotation, measurement, regression testing, and system improvement.

The primary result is an application-specific **failure model**: a structured account of the recurring ways the system fails, the conditions under which those failures appear, and the evidence required to identify them consistently.

The method connects two loops:

```text
discovery:
prepare discovery sample → run the system → inspect traces
→ initial coding → focused coding and category development
→ theoretical sampling and refinement → integrate the failure model

measurement:
failure model → operationalise failure modes → label traces
→ quantify and interpret → improve the system → observe again
```


Operationalisation prepares selected failure modes for consistent application. Labelling records where those failures occur. Quantification identifies recurring problems and supports prioritisation. After the system is changed, relevant traces are run and labelled again.

New or unclear failures may reopen discovery and lead to further refinement of the failure model.

## Part I. Prepare and Collect the Evidence

### 1. Prepare the Initial Discovery Sample


Failure understanding begins with a deliberately selected set of situations in which the application can be observed.

When real user traces exist, they can be sampled across important features, user contexts, tools, workflow stages, and operating conditions. When production data is sparse or inaccessible, synthetic cases can be constructed systematically and executed against a controlled environment.

The initial sample is primarily a **discovery sample**. Its purpose is to expose a broad range of behaviour and reveal recurring or consequential failures. It may intentionally differ from production traffic by emphasizing ambiguous, difficult, invalid, high-risk, or boundary cases.

See more details in [10 User Inputs]({{< ref "ai-engineering/evaluation/10-user-inputs" >}}).

### 2. Run the System and Collect Complete Traces


Once the cases have been validated, they should be run against a defined application and environment configuration.

A trace should preserve the full execution sequence: the initial input, relevant conversation and environment state, intermediate model outputs, tool invocations and results, state changes, and the final user-facing response or action.

Complete traces matter because the final output may conceal important failures. A tool call may use the wrong client context, an unsupported action may be attempted and later hidden, or a plausible final response may rely on fabricated state.

The trace should preserve enough configuration context to interpret and, where possible, reproduce the execution. This may include the relevant system version, prompt version, model configuration, fixture version, tool configuration, etc.

{{< callout context="tip" title="Tip" icon="outline/rocket" >}}
Long traces may require observability interfaces to make inspection practical. The methodological requirement is that an analyst can follow the execution sequence and connect each analytical claim to its supporting evidence.
{{< /callout >}}

## Part II. Discover and Develop the Failure Model

### Coding Phases


The grounded-theory-informed coding process moves through two main phases:

```text
initial coding
→ focused coding and category development
```


Initial coding stays close to trace incidents. Focused coding selects and synthesises analytically useful initial codes, while category development establishes recurring patterns, variation, boundaries, and relationships.

These phases are followed by an engineering-oriented analytical stage:

```text
developed categories
→ integrated failure model
```


The progression is iterative rather than rigidly linear. Further comparison or sampling may lead analysts to recode incidents, revise focused codes, divide or combine categories, and reconsider proposed relationships.

### Boundary Between Discovery and Measurement


Grounded-theory-informed discovery ends with an integrated failure model. Operationalisation, annotation, quantification, and regression testing are engineering evaluation activities.

The transition is:

```text
initial codes → focused codes → categories → failure model
→ operational criteria → labels → measurements
```


Maintaining this boundary prevents analytical categories from being narrowed prematurely to whatever is easiest to count.

### 3. Initial Coding


Reviewers assign short, descriptive labels to incidents that appear incorrect, unsupported, undesirable under product requirements, or otherwise worthy of investigation.

Unexpected behaviour may also be coded, but unexpected does not necessarily mean incorrect. The purpose is to preserve observations that may become analytically important after comparison with other cases.

At this stage, reviewers should not force incidents into a predefined taxonomy. They should remain close to the evidence in the trace and describe the observed behaviour directly.

Useful initial codes include:

```text
omitting the replacement preference
promising a carrier-unavailable date
using investor terminology for a first-time buyer
asserting an unsupported property feature
executing an action without user authorisation
```


These descriptions preserve details that broader labels such as _hallucination_, _irrelevance_, or _poor reasoning_ may obscure. Such general concepts can help reviewers notice potential problems, but they should not replace concrete descriptions of the observed behaviour.

Sometimes a reviewer can recognize that a trace is wrong without being able to describe the problem precisely. In that situation, familiar LLM failure concepts can be used as **sensitizing concepts**. They can help reviewers notice fabricated facts, lost constraints, malformed outputs, unsupported actions, or style violations. They should guide attention without replacing concrete descriptions of what occurred.

{{< callout context="note" title="Note" icon="outline/info-circle" >}}
The aim is to remain open to multiple analytical directions rather than immediately assigning observations to a stable taxonomy.
{{< /callout >}}


A practical initial strategy is to identify the **first observable failure** in each trace. An upstream misunderstanding may produce several downstream symptoms, and cataloguing every consequence can obscure the point at which the execution first became incorrect.

The earliest observable failure is not always the root cause. Reviewers should distinguish between what the trace demonstrates and what they infer about the system's internal mechanism.

The output of open coding is intentionally unstructured: a rich set of concrete observations grounded in actual executions.

> The output of this stage is a collection of provisional observations linked to specific evidence in the traces.

### 7. Focused Coding and Category Development

#### 7.1 Select and Test Focused Codes


Initial coding produces a rich but fragmented collection of observations. Different reviewers may use slightly different descriptions for related incidents, while superficially similar descriptions may conceal analytically important differences. Focused coding begins the process of synthesising this material without prematurely converting it into a fixed measurement taxonomy.

Analysts review the full body of initial codes together with the trace incidents to which they refer. They select initial codes with the greatest analytical usefulness and use them to organise and synthesise a broader set of incidents.

Selection may reflect recurrence, analytical reach, severity, or importance to a product guarantee. Frequency alone is insufficient. An uncommon behaviour may deserve focused attention because it produces a severe consequence, violates an important system boundary, or exposes a failure not represented by more frequent codes.

For example:

```text
omitting the buyer’s budget
omitting the pet requirement
omitting the replacement preference
```


may support the focused code:

```text
losing user-stated constraints
```


A focused code may be developed by elevating an especially significant initial code, combining several closely related initial codes, or reformulating a recurring pattern visible across multiple incidents. Grouping should be based on similarity in the observed failure behaviour, rather than only on shared words or surface features.

Analysts apply each candidate focused code back to the relevant incidents. They ask whether it accurately represents each incident, whether it conceals important differences, whether it excludes cases that appear to belong, and whether successful or contradictory cases challenge the proposed grouping. When a focused code fits only part of a group, analysts may narrow it, divide it, retain multiple provisional codes, or defer the decision until more evidence is available.

The mapping from focused codes to initial codes and trace incidents should be preserved. This traceability allows analysts to inspect the evidence behind a synthesis, reconsider earlier decisions, and recode incidents when focused codes change.

Initial codes that are not selected should not be discarded. They should remain available as unresolved, low-frequency, weakly developed, or currently out-of-scope observations. An uncommon code may later become analytically important when additional cases appear or the scope of the evaluation changes.

Selection requires product and domain judgment. When the interpretation of an incident depends on specialised domain rules, permissions, user roles, or product guarantees, an appropriate domain expert should participate in reviewing the proposed focused code and its supporting incidents.

An LLM may assist by organising a large collection of initial codes or suggesting candidate groupings. For example:

```text
Below is a collection of initial codes describing observed incidents in an
LLM application.

Propose candidate focused codes that could synthesise related incidents.

For each candidate:
- provide a short behaviour-based name;
- identify the initial codes that support it;
- explain the common pattern;
- flag incidents that only partially fit;
- identify possible alternative groupings or splits.

Do not invent incidents, force a fixed number of groups, or assume that the
groups must be mutually exclusive.
```


Such proposals are analytical aids rather than findings. Analysts should review them against the complete traces, product requirements, domain knowledge, and alternative interpretations. Lexically similar annotations may describe different failures, while differently worded annotations may represent the same recurring behaviour.

The output of this step is a provisional set of focused codes linked to their contributing initial codes and trace incidents. It should also preserve representative incidents, unresolved observations, alternative interpretations, and memos explaining why codes were selected, combined, retained separately, or deferred.

Focused codes remain revisable analytical instruments. Their purpose is to concentrate subsequent comparison and category development, rather than to serve as final operational definitions or measurement labels.

#### 7.2 Form Candidate Categories Through Constant Comparison


Focused codes provide inputs to category development. Analysts use them to identify broader recurring failure behaviours, test whether incidents belong together, and determine which distinctions should be preserved.

Constant comparison drives this work. Analysts compare:

- incident with incident;
- initial code with initial code;
- focused code with focused code;
- incidents with candidate focused codes and categories;
- candidate categories with neighbouring categories;
- unsuccessful cases with successful, contradictory, and ambiguous cases.

These comparisons should be conducted across the full body of coded traces rather than within isolated executions. Similar wording alone is not sufficient grounds for grouping. Analysts should examine whether incidents exhibit the same central failure behaviour, are judged incorrect for comparable reasons, affect the same product guarantee, and require similar evidence to recognise.

For each proposed grouping, analysts ask:

- What behaviour do the incidents have in common?
- Which evidence supports treating them as instances of the same pattern?
- Does the proposed category fit every included incident?
- Does it conceal differences that matter to interpretation or intervention?
- Are relevant incidents excluded?
- Which successful or contradictory cases test its boundary?
- Could the same incidents support a plausible alternative grouping?

Comparison may support combining several focused codes into a broader candidate category. For example:

```text
losing user-stated constraints
contradicting tool-returned constraints
```


may provisionally support:

```text
constraint-handling failure
```


The narrower focused codes should remain attached to the broader category. The source of the constraint may later prove important as a property, subcategory, or separate category.

Comparison may also support splitting a broad focused code. For example:

```text
fabricating information
```


may conceal a meaningful distinction between:

```text
unsupported external-state claim
unsupported user-intent attribution
```


The first describes an unsupported claim about the external world or application state. The second describes the system attributing a request, preference, decision, or authorisation to the user without adequate evidence.

Surface similarity may also conceal different failure behaviours. An email that uses investor terminology for a first-time buyer may indicate **persona misidentification**, while an informal or slang-filled email to a correctly identified client may indicate **inappropriate tone and style**. Both produce unsuitable communication, but the basis of the failure differs.

Successful contrast cases help determine where a proposed category does not apply. Comparing a trace that preserves an earlier constraint with one that omits it may reveal relevant variation in the observed behaviour or execution context. Such comparison can clarify boundaries and generate hypotheses, but it does not by itself establish an internal cause.

Candidate categories should remain linked to their contributing focused codes, initial codes, and trace incidents. Analysts should also retain incidents that only partially fit, cases removed from a grouping, and credible alternative interpretations. This traceability allows earlier decisions to be inspected and revised as the analysis develops.

The output of this step is a set of candidate categories supported by comparative evidence, together with unresolved grouping, merging, and splitting questions.

#### 7.3 Define and Distinguish Failure Modes


Initial coding produces a rich but unstructured collection of observations. Analysts review these observations across traces and group similar failure notes into broader, recurring failure modes.

Some groupings are straightforward. For example, traces in which the assistant proposes showings when the agent is unavailable, or recommends properties outside a buyer's stated budget, may be grouped under:

```text
violation of user constraints
```


Other observations require closer comparison. Failures that initially appear similar may need to be separated when they differ meaningfully.

For example, claiming that a property has a feature not present in the available data differs from scheduling an action the user never requested. These may be separated into:

```text
hallucinated listing metadata
hallucinated user actions
```


Similarly, using investor terminology for a first-time buyer differs from using an inappropriate tone for a correctly identified client. These may be separated into:

```text
persona misidentification
inappropriate tone and style
```


Analysts should merge failure notes that describe the same recurring mistake and split failure modes that conceal meaningful distinctions. When the correct grouping depends on specialised product or domain knowledge, they should consult an appropriate domain expert.

The goal is to produce a small, coherent, non-overlapping set of binary failure modes that can be recognised and applied consistently.

Each failure mode should include:

- a short descriptive title;
- a brief definition;
- representative examples.

The failure modes remain open to revision. As analysts review additional traces, they may merge similar modes, split modes that are too broad, or clarify definitions when edge cases appear.

#### 7.4 Optional Axial Analysis


When the evaluation requires a more explicit account of the relationships surrounding a category, analysts may draw on Strauss and Corbin's axial-coding concepts.

Axial analysis examines the conditions and context in which a category occurs, the actions or interactions associated with it, and its consequences. It may also clarify relationships between categories.

For example, analysts might examine when constraint loss occurs, how it affects a subsequent tool call, and how the resulting error appears in the final response.

Axial analysis is optional and does not replace focused coding or category development. Observed sequence or association should not be treated as evidence of causation without additional support.

### 8. Iteration and Refining the Failure Taxonomy


Error analysis is iterative. Analysts commonly conduct two or three rounds of reviewing traces and refining the failure taxonomy.

As additional traces are reviewed--either from the existing dataset or from newly sampled queries--analysts may identify failure modes that were missed during the initial analysis. New cases may also reveal that existing failure modes are too broad, insufficiently defined, or difficult to distinguish from one another.

Analysts should revise the taxonomy by:

- adding previously unrecognised failure modes;
- merging failure modes that describe the same recurring problem;
- splitting failure modes that conceal meaningful differences;
- clarifying definitions when edge cases appear;
- revising earlier annotations when the taxonomy changes.

For example, a later analysis round may reveal that the assistant sometimes interprets an ambiguous location using an unsupported default. A request for properties in "Springfield" might return results from the wrong state because the assistant did not request clarification. If this behaviour was not represented in the existing taxonomy, analysts might add:

```text
location ambiguity error
```


Taxonomy changes should be applied consistently. When a failure mode is added, split, merged, or redefined, analysts should revisit affected traces and update their labels where necessary.

Initial analysis may record only the first observed failure in each trace. This is an efficient way to identify common upstream problems and build the first version of the taxonomy.

Later evaluation may require more exhaustive annotation. For example, when measuring the effect of a fix for `inappropriate tone`, analysts may need to record every occurrence of that failure, including cases where it was not the first failure in the trace. In such cases, the relevant traces should be re-annotated exhaustively to establish a reliable baseline.

Iteration improves both the taxonomy and the consistency with which it can be applied. The taxonomy should not be treated as fixed while additional traces continue to reveal missing failure modes, unclear distinctions, or inconsistent definitions.

#### 8.1 Approaching Theoretical Saturation


Analysis continues until additional traces reveal few or no fundamentally new failure modes. This point is known as **theoretical saturation**.

As a practical rule of thumb, analysts should review at least 20 unsuccessful traces before concluding that the initial failure taxonomy is sufficiently broad. This number is a starting heuristic rather than a guarantee of saturation.

The amount of analysis required depends on the complexity of the system. Simple query types may reveal their major failure modes quickly. Multi-step applications involving tools, scheduling, permissions, client personalisation, or other agentic behaviour may require substantially more exploration.

In practice, two serious rounds of coding and re-annotation are often sufficient to approach saturation. Beyond that point, additional sampling commonly produces diminishing returns, with few genuinely new failure modes appearing.

Saturation should therefore be judged primarily by whether new traces continue to change the taxonomy, rather than by trace count alone.

### 9. Finalise the Failure Taxonomy


After iteration, analysts consolidate the current failure modes into a coherent taxonomy. Each failure mode should include:

- a short descriptive title;
- a brief definition;
- representative examples.

The result should be a small, coherent, non-overlapping set of binary failure modes that can be applied consistently during trace annotation.

The taxonomy remains open to revision. Later traces may expose new failure modes or reveal that existing definitions need to be merged, split, or clarified.
