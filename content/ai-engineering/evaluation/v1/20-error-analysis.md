---
draft: false
toc: true
title: "20 Error Analysis"
linkTitle: "20 Error Analysis"
---
# Failure Analysis for AI Product Behavior

## Purpose


Failure analysis examines observed product failures.

It can be used to:

- describe one incident precisely;
- discover recurring failure patterns across executions;
- test the boundaries of a proposed failure pattern;
- turn selected patterns into operational failure modes;
- label and measure those modes when the evidence supports measurement;
- prepare evidence for technical diagnosis.

These are different tasks. Not every incident needs a failure taxonomy. A rule check or predictive evaluation may produce useful judgments and measurements without first developing failure categories or operational modes.

In the failure-oriented approach, an operational failure mode is the bridge to repeated labeling and measurement. It turns a supported failure pattern, a known criterion, or a risk grounded in an explicit evaluation basis into a precise question for each applicable unit: is the failure present or absent?

This document focuses on failure incidents and failure patterns. It does not replace the wider evaluation process, make a product decision, or establish a root cause by itself.

A failure exists only in relation to an evaluation basis. The basis may come from a provisional behavior claim, a product rule, a case-specific expectation, a comparison standard, or a proposed or active production commitment.

The main evidence terms are defined in [Evidence Model for AI Evaluation]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}).

## Start with the question and decision


State why the analysis is needed before choosing the method.

| Purpose | Main question | Failure-analysis contribution |
| --- | --- | --- |
| **Explore a candidate solution** | What unexpected or unacceptable behavior appears, and which distinctions may matter? | Concrete observations, possible failure incidents, provisional groupings, and open questions |
| **Examine a proposed production commitment** | What important failures and limits does the available evidence show? | Evidence about failure patterns, boundaries, consequences, and remaining uncertainty for the wider commitment review |
| **Check a change or regression** | Did a known failure return, or did the change produce another important failure? | Criteria, regression cases, comparative judgments, and concrete incidents |
| **Learn from production** | Which new failures appear, and how often do known failures occur in a defined population? | New incidents, revised categories or modes, and measurements supported by the sampling method |
| **Investigate an incident** | What failed, where did it become observable, and is it related to a known pattern? | An incident record, related categories or modes, reproduction material, and a handoff for technical diagnosis |

These purposes may exist at the same time. They are not project phases.

Record:

- the question or uncertainty;
- the decision the work may affect;
- the behavior and scope being examined;
- the evaluation basis and version;
- the consequence if the behavior is wrong;
- the case set, dataset, or production sample;
- how the cases, executions, or production examples were selected;
- what the analysis will not establish.

Exploratory work may begin before a stable behavior claim exists. State the provisional expectation and keep it open to revision.

Case and sample design are described in [Coverage and Case Design]({{< ref "ai-engineering/evaluation/v1/coverage-and-case-design" >}}). The working process for building test data is described in [Building a Starting Set of User Inputs]({{< ref "ai-engineering/evaluation/v1/10-user-inputs" >}}).

## Describe the product behavior


There is no single failure-analysis method for every AI product.

Janna Lipenkova's framework makes several useful distinctions. It separates rule-based and learned systems, describes predictive, generative, and agentic behavior, distinguishes degrees of automation, and describes language-model usage patterns.

These are separate axes. Do not turn them into one exclusive list of project types.

### Decision mechanism


| Mechanism | Meaning for the analysis |
| --- | --- |
| **Rule-based** | A human-defined rule or decision table controls some behavior. The analysis can compare the observed decision with the defined rule. |
| **Learned** | Behavior depends on patterns learned from data. The analysis must preserve the model and data context needed to interpret the result. |
| **Hybrid** | Rules and learned components both affect behavior. The analysis must preserve their boundary and the order in which they act. |

Rule-based and predictive are not opposites. A rule may turn a predictive score into a product decision. An agent may also use rules around a learned model.

Questions about missing, conflicting, or incorrectly implemented rules normally belong to later specification or technical diagnosis. Failure analysis first records the wrong product decision or action shown by the evidence.

### Behavior produced


| Behavior | Typical unit | Evidence commonly needed | Main analytical work |
| --- | --- | --- | --- |
| **Predictive** | One prediction, classification, ranking, or score, plus performance across a set | Input, reference outcome when available, prediction, score, threshold, model and data version, relevant group, outcome delay and label source | Prediction-level judgments or residuals, false-positive and false-negative sets, threshold effects, calibration, measurements, and comparisons across relevant groups or periods |
| **Generative** | One generated response or artifact | User input, instructions, conversation state, retrieved material, generated output, product and model version | Criteria that allow several acceptable outputs, human or domain review, concrete observations, and comparison of failed outputs |
| **Agentic** | One action or multi-step execution | Initial state, permissions, available tools, tool requests and results, actions, state changes, final result, downstream effects, and recovery | Step and state analysis, permission and action checks, failure propagation, recovery, and task-level consequences |

A compound product may need all three views. For example, an agent can use a predictive model, generate a tool request, and then perform an action. Preserve the boundaries between those parts.

### How an output is used


| Use pattern | What the analysis must distinguish |
| --- | --- |
| **Direct interaction** | The product output, prediction, recommendation, or decision; the interface that presents it; and any observed user response |
| **Programmatic use** | The output used as an instruction, query, code fragment, decision, or tool call; validation; permissions; execution; state changes; and downstream effects |
| **Predefined backend task** | The controlled input, expected schema or reference, validation, stored output, and later product behavior that depends on it |

A syntactically valid programmatic output can still be wrong. A valid SQL query, for example, may read the wrong records or perform an unsafe write.

### Human authority


| Relationship | Product-behavior evidence | Evidence that may require separate user research |
| --- | --- | --- |
| **Assisted** | What advice was shown and what controls were available | Whether people understood, trusted, detected, or corrected an error |
| **Augmented** | The handoff, recommendation, override path, and recorded combined decision | Whether the division of work was usable and supported a sound human decision |
| **Autonomous** | Permissions, limits, actions, state changes, stopping, reversal, and recovery | Whether affected people understood or accepted the autonomous behavior |

A product trace may support a hypothesis about user confusion or reliance. It does not establish that hypothesis without suitable user evidence.

## Use project size only to plan the work


Lipenkova also provides small, medium, and large project timeline templates. They combine team size, complexity, feedback speed, infrastructure, and regulatory work.

The table below adapts those project contexts to the organization of failure analysis. It does not set the evidence standard.

| Project context | Possible organization of the work |
| --- | --- |
| **Small project or small team** | One person may hold several roles. Manual review and simple records may be sufficient tools, but evidence must still remain traceable. |
| **Medium cross-functional project** | Shared evidence storage, named reviewers, domain review, versioned definitions, and repeatable checks can help several disciplines work from the same record. |
| **Large or slow-feedback project** | Dedicated capture, production sampling, several review roles, evaluator validation, change control, and an audit trail may be needed to coordinate the work. |

The required rigor follows from the question, consequence, reach, reversibility, autonomy, regulation, system complexity, and remaining uncertainty.

A small medical prototype or financial action system may need stricter evidence than a large low-consequence content tool.

## Choose the analytical path


Failure analysis can begin in different places.

### The failure-oriented branch


Use the failure-oriented branch when the team needs to understand recurring failures and later measure or monitor them. It has two entry routes.

~~~text
discovery-derived route:
observations and failure incidents
    → provisional groupings
    → supported failure categories

definition-derived route:
known criterion or anticipated risk under an explicit evaluation basis

both routes:
    → operational binary failure modes
    → reference labels
    → evaluator implementation and held-out validation
    → labels on the target set
    → measurements and comparisons
~~~


The binary requirement begins with the operational failure mode. Observations, provisional groupings, and failure categories may remain descriptive, uncertain, hierarchical, and overlapping.

Other analytical paths may use continuous scores, residuals, rankings, calibration, or set-level measurements. They do not need to be forced into binary failure modes.

### Path A: a known expectation or criterion


Use this path when a product rule, invariant, production commitment, reference outcome, or approved criterion already exists.

~~~text
question and evaluation basis
    → criterion
    → required evidence
    → judgment
    → failure incident when the judgment is FAIL
    → optional comparison of incidents
    → optional category development or operational-mode definition
~~~


An operational failure mode is not required before applying a known criterion. It is required when the failure-oriented approach will repeatedly label or measure the corresponding failure.

A known criterion or anticipated risk can lead directly to an operational mode. It does not need an observed failure category first.

### Path B: exploratory observation


Use this path when the team is still learning what behavior occurs or when the expected behavior is incomplete.

~~~text
question and provisional expectation
    → captured evidence
    → concrete observations
    → clarify the evaluation basis
    → judgments
    → failure incidents
    → comparison and provisional groupings
    → supported failure categories
    → selected operational binary failure modes
    → reference labels
    → evaluator implementation and validation when automation is needed
    → labels on the target set
    → measurements
~~~


An unexpected observation is not a failure incident until there is a basis for judging it unacceptable.

The path may stop at observations, incidents, or supported categories. If the work continues into failure-oriented labeling or measurement, the selected modes must be operationally defined first.

### Path C: aggregate predictive analysis


Predictive behavior often needs set-level analysis before or alongside qualitative pattern analysis.

~~~text
question, evaluation basis, and prediction target
    → dataset and reference outcomes
    → predictions and scores
    → error, residual, tolerance, or decision rule
    → prediction-level judgments or residuals
    → measurements and comparisons
    → scoped finding
    → optional comparison of failed prediction executions
    → optional failure categories or operational modes
~~~


Calibration and distribution change are properties observed across a set or period. They do not require every prediction to receive a pass or fail judgment.

### Path D: reported event or suspected failure


Use this path when a report or observed event may contain a failure.

~~~text
reported event and evidence
    → evaluation basis
    → judgment
    → failure-incident record when the judgment is FAIL
    → comparison with known categories, operational modes, and related incidents
    → reproduction material and cause hypotheses
    → technical diagnosis
~~~


One incident can justify immediate action because of its consequence. It does not by itself prove that a failure pattern is recurring.

## Adjust the method to the behavior

### Rule-defined decisions


For behavior controlled by rules:

- identify the product decision or action being judged;
- preserve the relevant input and state;
- identify the rule set and version used;
- test important decision-table combinations and boundaries;
- distinguish a wrong observed decision from a hypothesis about a bad rule;
- send rule gaps, conflicts, ordering problems, and implementation defects to specification review or technical diagnosis.

Qualitative failure-category development is useful only when several wrong decisions need to be understood as a recurring product pattern.

### Predictive behavior


For predictive behavior:

- define the target and the time at which the reference outcome becomes available;
- define the evaluation basis, metric, loss, tolerance, decision rule, or threshold used to interpret a prediction;
- record the source, quality, and missingness of reference labels;
- check whether delayed or missing outcomes distort the dataset;
- check whether an input contains information that would not have been available when the prediction was made;
- preserve predictions, scores, thresholds, model versions, and relevant data versions;
- separate false positives, false negatives, residuals, ranking errors, and other task-specific errors;
- examine threshold tradeoffs;
- when scores are used as probabilities or confidence, check whether similar scores match similar observed frequencies;
- compare performance across groups that follow from the product question or risk;
- compare periods when production or data conditions may have changed;
- inspect selected failed prediction executions when qualitative comparison can reveal a useful pattern.

An individual prediction may be a failure incident when the evaluation basis and criterion support that judgment. Poor calibration and overall error rate are measurements across prediction executions. Differences between groups or periods are comparisons of measurements.

A set-level problem may lead to targeted incident review, but it does not always need a qualitative failure category or operational mode.

### Generative behavior


For generative behavior:

- define criteria around the behavior that matters, not one exact reference text unless exact text is required;
- preserve user input, relevant context, retrieved sources, instructions, and output;
- use product or domain review when correctness depends on specialized knowledge;
- use more than one reviewer when subjective disagreement can change the conclusion;
- record concrete differences such as an unsupported claim, omitted constraint, or unsafe instruction;
- compare failed and acceptable outputs under similar conditions;
- preserve several acceptable examples when the task allows several good answers.

### Agentic behavior


For agentic behavior:

- define the task-level expectation and important step-level rules;
- preserve initial state, tool availability, permissions, requests, results, actions, and state changes;
- distinguish planning, selection, argument, execution, confirmation, and recovery failures when the evidence supports that distinction;
- record the first observable mismatch when it helps locate propagation;
- record later failures when they have separate consequences;
- examine whether a failed step was contained, corrected, or allowed to affect later actions;
- judge both the individual action and the completed task when both matter.

Do not infer private internal reasoning. Analyze the observable decisions, actions, and state transitions that were captured.

## Choose evidence that fits the question


For each judgment or analytical question, state which execution evidence must be captured. This is the capture contract.

Depending on the system, the capture contract may require:

- input and initial state;
- reference outcome or expected state;
- conversation context;
- retrieved information and source identity;
- prediction, score, threshold, or generated output;
- applicable model, prompt, tool, rule, fixture, and data versions;
- available tools and permissions;
- tool requests, results, and errors;
- actions and state changes;
- final response or result;
- direct downstream product effects;
- recovery behavior.

The evaluation basis, criterion, reviewer, and judgment method must also be preserved, but they are not execution evidence produced by the system. Keep them linked to the trace rather than treating them as part of the capture contract.

Capture observable product behavior. Do not assume that unrecorded internal reasoning is known.

A trace is captured evidence about an execution. It is not a complete copy of reality.

If the evidence required for a judgment is missing, record the judgment as **not judgeable** for that criterion and state what is missing. Do not call the behavior successful and do not fill the gap with an assumption.

### Keep designed cases and production samples distinct


A designed challenge set can reveal possible and serious failures. It cannot estimate their production rate.

A production sample can support an estimate only when its population, period, selection method, missing data, and denominator allow the conclusion to apply to that stated population.

Record the source and selection method of every execution used in the analysis.

## Define the unit of analysis


An **execution** is one run or observed instance of product behavior.

For predictive work, one application of the model to one input is an execution, even when it is evaluated later from saved batch data. The saved input, prediction, score, reference outcome, and version information are evidence about that execution.

An **observation** is a concrete statement supported by captured evidence.

A **judgment** applies an evaluation basis to the available evidence.

A **failure incident** is a concrete, evidence-linked instance of unacceptable behavior in one execution.

The judgment unit may be:

- one prediction;
- one generated response;
- one user turn;
- one conversation;
- one tool decision;
- one action;
- one workflow step;
- one complete task;
- one direct product-state change.

Choose the unit before grouping incidents. A response-level failure and a task-level failure are not automatically the same judgment or failure incident.

Do not use **downstream outcome** here without defining it. A direct product-state change is different from a later user, product, or business result.

## Choose scope and occurrence policy separately


Two choices are required.

### Analytical scope


- **Broad scope** records any observation or failure relevant to the question.
- **Targeted scope** records only a named behavior, criterion, failure category, or operational mode.

### Occurrence policy


- **First-observable policy** records the earliest point in a multi-step execution where the captured evidence is sufficient to establish a mismatch.
- **Exhaustive policy** records every relevant occurrence within the chosen analytical scope.

These choices can be combined. For example, an analysis may exhaustively record every occurrence of one target operational failure mode.

The first observable failure is not necessarily the internal origin or root cause. It is also not proof of where propagation began.

An earlier mistake may become visible only after later evidence appears. Revise the note when stronger evidence supports an earlier point.

A first-observable policy can hide later failures that have separate consequences. Use exhaustive review when those later failures matter to the question or measurement.

## Make observations and judgments in the right order


The failure-oriented evidence path can be:

~~~text
trace evidence
    → observation
    → judgment against an evaluation basis
    → failure incident when the judgment is FAIL
    → provisional grouping
    → supported failure category
    → selected operational binary failure mode
    → reference labels
    → evaluator implementation and validation when automation is needed
    → labels for the target units
    → measurement
~~~


The path may stop earlier. A useful observation does not always become a failure incident. A failure incident does not always need a reusable category. A supported category does not always need an operational failure mode.

### Record observations close to the evidence


Good observations are specific:

~~~text
The response omitted the replacement preference stated in the first turn.

The product reported that the booking succeeded after the scheduling tool returned an error.

The product performed the write action before the required confirmation.

The classifier assigned the positive class with a score of 0.42 while the configured threshold was 0.70.
~~~


Broad labels such as **hallucination**, **poor reasoning**, **bias**, or **tool failure** may help a reviewer notice an issue. They do not replace a concrete description.

Unexpected behavior is not automatically a failure. If the evaluation basis is missing, ambiguous, or disputed, preserve the observation and record the open product question.

A useful observation record contains:

~~~text
Analysis question:
Execution:
System, data, and evaluation versions:
Unit of analysis:
Evidence location:
Observed behavior:
Evidence limits:
Recorder:
~~~


When the observation is judged to be a failure, link a failure-incident record containing:

~~~text
Evaluation basis:
Criterion:
Judgment:
Known or possible consequence:
Reviewer:
~~

Keep any operational-mode label in a separate linked record. The label must identify the unit, mode and criterion versions, evidence source, evaluator, result, provenance, and review status.

Keep observations that are rare, unclear, or not yet part of a group. Low frequency does not mean low importance.

Use a product or domain expert when the judgment depends on specialized rules, permissions, user roles, safety requirements, or domain practice.

## Compare incidents before naming failure categories

For a small set, failure incidents may be compared directly.

For a larger or more consequential analysis, first create provisional groupings. A grouping is a working aid, not yet a supported failure category.

Compare:

- one incident with another;
- failed judgments with acceptable judgments under similar conditions;
- clear incidents with ambiguous or partly fitting incidents;
- one provisional grouping with a nearby grouping;
- the same behavior across users, routes, tools, states, and versions;
- incidents with the evaluation basis that made them failures.

Ask:

- What observable behavior do the incidents have in common?
- Do they violate the same expectation in the same observable way?
- Do they require the same evidence to recognize?
- Which incident only partly fits?
- Which acceptable or contrary case tests the boundary?
- Does the grouping hide a distinction that changes the product response?
- Could an incident reasonably belong to more than one grouping or category?

Similar words do not prove that incidents show the same failure. Different words do not prove that they show different failures.

Preserve the links from every grouping to its incidents, judgments, observations, executions, and evidence. Also preserve:

- observations that were not judged as failures;
- incidents that were not grouped;
- incidents removed from a group;
- alternative groupings;
- reviewer disagreement;
- notes explaining an important grouping, split, or rejection.

A model may suggest possible groupings. People responsible for the analysis must check those suggestions against the evidence. The model must not invent incidents or approve its own groupings.

One incident, anticipated failure, or failure hypothesis may suggest a provisional failure category. Comparison is normally needed before treating it as a general pattern.

## Develop supported failure categories

A **failure category** is a reusable analytical description of a pattern of observed failure. It helps explain what several incidents have in common. It is not yet a rule for labeling every execution.

For example, these incidents:

~~~

failed to preserve the buyer's budget

failed to preserve the user's pet requirement

failed to preserve the replacement preference

~~~

may support this provisional category:

~~~

failed to preserve a user-stated constraint

~~~

Track three properties separately:

| Property | Example values | Meaning |
| --- | --- | --- |
| **Evidence support** | proposed, supported for a named question, disputed | How the available evidence supports the category |
| **Operationalization** | not selected, draft modes, operational modes defined | Whether any part of the category has been made suitable for repeated labeling |
| **Lifecycle** | active, retired, superseded | Whether the team currently uses the category |

A supported category must link to the question, evidence set, and comparison that supported it.

A useful failure-category record includes:

- a short behavior-based name;
- a plain definition;
- the judgment unit;
- the product behavior and situations to which it applies;
- the evaluation basis that makes the pattern a failure;
- the evidence needed to recognize it;
- supporting incidents;
- acceptable and contrary cases;
- partly fitting or unresolved cases;
- nearby categories and the difference between them;
- broader, narrower, or related categories;
- known conditions in which it appears;
- possible consequences;
- known limits and open questions;
- evidence-support status;
- operationalization status;
- lifecycle status and version;
- the reason for each important change.

Failure categories may overlap or form a hierarchy. One execution may contain several patterns. Record these relationships instead of forcing every incident into one exclusive category.

Do not force every useful category into an operational failure mode. Operationalize the categories that need repeated labeling, comparison, or measurement.

Keep these properties separate from category and operational-mode definitions:

- frequency;
- consequence or severity;
- where the failure became visible;
- system component involved;
- cause hypothesis;
- confidence in the supporting evidence.

Combining these into one label makes later comparison and diagnosis harder.

## Examine relationships without claiming cause

Some analyses need more than a flat list of categories. This is especially true for multi-step and agentic behavior.

Record observed relationships such as:

- one incident occurred before another;
- two incidents repeatedly occurred in the same execution;
- a failure pattern appeared only under a particular permission, tool, route, or state;
- an early mismatch was followed by a later wrong action;
- a recovery step contained the effect;
- a later action increased the consequence.

For each relationship, keep the supporting executions and contrary cases.

Use language such as:

~~~

In the reviewed executions, the unsupported entity selection occurred before

the wrong tool action in four cases. One contrast case corrected the selection

before the action.

~~~

Do not write:

~~~

The unsupported entity selection caused the wrong action.

~~~

unless separate diagnostic evidence supports that causal claim.

Observed sequence, co-occurrence, and conditional patterns can guide diagnosis. They do not prove a root cause.

## Seek evidence that tests categories and modes

Once a category or operational mode is proposed, choose further cases or production examples that could change it.

Look for:

- another incident that should fit;
- a similar incident that should not fit;
- an acceptable execution under nearly the same conditions;
- a different user, route, tool, permission, state, or product version;
- a case that supports a competing interpretation;
- a high-consequence situation with little evidence;
- a case near the proposed boundary.

This is targeted evidence selection. Its purpose is to test the definition and its boundary, not to increase sample size for its own sake.

For each round, record:

- which category, mode, or boundary was tested;
- why the new evidence was selected;
- what changed;
- what did not change;
- which important situations remain untested.

No fixed number of traces or review rounds proves completeness.

For the current decision, pause development when new relevant evidence no longer changes the important categories, modes, or boundaries enough to change the conclusion. State the remaining gaps. New production evidence may reopen the analysis later.

## Revise and version the failure model

New evidence may require the team to:

- add a category or mode;
- narrow or broaden a definition;
- split a category or mode that hides important differences;
- merge categories or modes that describe the same behavior;
- allow overlap;
- move an incident;
- leave an incident unresolved;
- remove an unsupported category or mode;
- retire a category or mode that is no longer useful.

Version category and mode definitions and preserve the reason for each important change.

A category change does not invalidate downstream work when the operational mode and its meaning stay unchanged. A change to an operational mode or criterion may invalidate reference labels, evaluator validation, labels on the target set, and measurements. Review these dependencies and relabel or revalidate where needed. Do not compare numbers produced from materially different definitions as though they used the same measure.

The current collection of categories, operational modes, their mappings, and their observed relationships is the **failure model**. It is a working product artifact, not a universal taxonomy.

## Specify operational failure modes

Define an operational mode from a supported category, a known criterion, or an anticipated risk grounded in an explicit evaluation basis when the team needs to:

- label the failure repeatedly;
- compare product versions;
- protect committed behavior;
- monitor a production population;
- support a rollout or rollback rule;
- check that a known incident does not return.

An **operational failure mode** is a narrowly defined failure behavior that can be assessed on a named unit. Its specification states how to decide whether that failure is present or absent when the mode applies and the evidence is sufficient.

~~~

failure category, known criterion, or grounded anticipated risk

    -> operational binary failure mode

    -> reference judgments recorded as reference labels

    -> candidate evaluator implementation and refinement

    -> held-out evaluator validation

    -> evaluator results on the target set recorded as labels

    -> aggregate measurement

~~~

The evaluator steps are optional when the target set is labeled directly through the reference-judgment process. Not every category, criterion, or risk needs an operational mode. Every selected operational failure mode must have a binary core.

Keep the artifacts distinct:

| Artifact | Role |
| --- | --- |
| **Failure category** | Describes the wider pattern found during analysis |
| **Operational failure mode** | Names one precise failure behavior that will be assessed repeatedly |
| **Criterion** | States how presence or absence will be judged from evidence |
| **Evaluator** | Applies the criterion |
| **Evaluator result** | Records the direct output of one evaluator run |
| **Label** | Records a result for one unit and mode, with its source and review status |
| **Measurement** | Summarizes labels over a defined case set or population |

The operational failure-mode specification links these artifacts. It does not collapse them into one object.

Applying a criterion produces a judgment or evaluator result. Recording that result with the unit, mode and criterion versions, evidence source, evaluator, provenance, and review status produces a label. Its provenance may be **reference** or **evaluator-produced**. Its review status may be **raw**, **reviewed**, or **adjudicated**.

### Define the binary core

Example:

~~~

Failure category:

Confirmation failure.

Operational failure mode:

Required confirmation missing before a write.

Unit:

One attempted write action.

Applicable when:

The requested write is supported and requires participant confirmation.

PRESENT:

The write tool is called before participant-visible confirmation.

ABSENT:

Participant-visible confirmation occurs before the write tool is called.

~~~

Use four label states:

- **PRESENT** means the defined failure occurred;
- **ABSENT** means the mode applied and the defined failure did not occur;
- **NOT APPLICABLE** means the mode did not concern the unit;
- **NOT JUDGEABLE** means the mode applied but the required evidence was unavailable or insufficient.

The operational core is binary among applicable, judgeable units. Do not treat **NOT APPLICABLE** or **NOT JUDGEABLE** as **ABSENT**.

For an applicable, judgeable unit, the **PRESENT** and **ABSENT** criteria must cover the full boundary and must not both apply. If the criteria leave a gap or conflict, revise them or adjudicate the case. Do not use **NOT JUDGEABLE** to hide an unclear definition.

Severity, subtype, incident count, first occurrence, consequence, and confidence are separate attributes. Do not replace the present-or-absent judgment with one combined score.

### Allow several modes in one execution

Binary does not mean mutually exclusive. Treat each operational mode as a separate question. One execution may contain several present failure modes.

Definitions should be distinct enough that reviewers can apply them consistently. If modes overlap by design or form a hierarchy, record the relationship and the aggregation rule. Do not add their rates as though the modes were disjoint.

### Keep positive criteria and failure predicates connected

A positive criterion may express the acceptable side of the same boundary:

~~~

Positive criterion:

For a supported write that requires confirmation, participant-visible

confirmation must occur before the write tool is called.

~~~

For this criterion, **PASS** maps to failure **ABSENT** and **FAIL** maps to failure **PRESENT**. Keep the explicit failure predicate and this mapping. A positive criterion does not replace the operational failure mode in the failure-oriented approach.

Do not silently reverse the meaning of pass and fail when evaluator results are converted into failure-mode labels.

### Specify each mode

For each operational mode, define:

1. its identifier and version, plus its category when one exists;
2. the evaluation basis and version that make the behavior a failure;
3. the unit to which it applies;
4. the applicability criterion;
5. the criterion for **PRESENT**;
6. the criterion for **ABSENT**;
7. the evidence required;
8. inclusion, exclusion, and boundary examples;
9. how **NOT APPLICABLE** and **NOT JUDGEABLE** are handled;
10. any separate attributes, such as severity or subtype;
11. the analytical scope and occurrence policy;
12. overlap, hierarchy, and aggregation rules;
13. the process for disagreement, revision, and relabeling.

During reference labeling, apply each selected mode to every unit in the reference set. This produces a unit-by-mode label matrix. An execution can therefore receive **PRESENT** for several modes.

### Implement and validate evaluators

An evaluator applies the operational criterion. It does not define the category, mode, or criterion.

The evaluator may be a deterministic check, reference comparison, human reviewer, domain reviewer, or model-based evaluator.

One narrow evaluator per mode is a useful default. One mode may also have several evaluator implementations, such as a human rubric, a precise programmatic check, and a model-based evaluator.

Create reference labels through a process that is independent of the candidate evaluator. The process may use a specification, invariant, verified calculation, fixture, expected result, or human or domain judgment with suitable review or adjudication.

Test each candidate evaluator against the reference labels for that mode. Include present, absent, boundary, not-applicable, and not-judgeable cases where relevant. Check applicability and judgeability separately. Calculate binary evaluator quality only over applicable, judgeable units:

- **failure sensitivity** is the share of trusted **PRESENT** labels that the evaluator also labels **PRESENT**;
- **non-failure specificity** is the share of trusted **ABSENT** labels that the evaluator also labels **ABSENT**.

Inspect false failure detections, missed failures, and disagreements. A model-based evaluator should not be trusted only because its explanations sound plausible.

When an automated evaluator is tuned against examples, keep prompt examples, refinement cases, and final validation cases separate. Do not report refinement results as final validation. If evaluator agreement remains poor, narrow or divide the operational mode before making the evaluator prompt more complex.

An evaluator abstention, malformed result, or failure to return an answer is evaluator behavior. It does not make the product behavior **NOT JUDGEABLE** when the trace contains sufficient evidence. Route that evaluator result to review or another evaluator.

After validation, apply the evaluator to the target set and record each result as an evaluator-produced label with its evaluator and mode versions.

Not every operational mode needs a permanent automated evaluator. Manual labels may be enough for a small or temporary analysis. Automation becomes useful when the mode must be applied repeatedly or at a larger scale.

Detailed guidance belongs in [Judgment and Findings](30-judgment-and-findings.md).

## Measure only when the evidence supports measurement

Predictive analysis may begin with measurements rather than failure-category development. In the failure-oriented approach, measure an operational mode only after its definition and labels are stable enough for the question.

Select one declared label per unit, mode, and mode version for the measurement. State whether the selected label is a reference label, an adjudicated label, or an evaluator-produced label. Do not count repeated evaluator runs as separate product units. When several results exist, apply a defined selection, aggregation, or adjudication rule before calculating the measurement.

For one operational mode, the observed present-label rate is:

~~~

PRESENT / (PRESENT + ABSENT)

~~~

This denominator contains applicable, judgeable units. Report **NOT APPLICABLE** and **NOT JUDGEABLE** counts separately. Use another denominator only when it is explicitly defined and justified.

When the labels are trusted judgments, this rate describes the labeled set. Whether it estimates a wider population depends on the sampling method. When the labels come from an imperfect automated evaluator, it is the raw evaluator rate, not automatically the true failure prevalence. Report the evaluator's failure sensitivity and non-failure specificity, then correct for evaluator error or limit the claim.

Before reporting a number, state:

- the population or case set;
- the period;
- the selection method;
- why that method supports the stated conclusion;
- the denominator;
- inclusion and exclusion rules;
- missing evidence;
- how not-applicable and not-judgeable units are handled;
- the label-selection, aggregation, or adjudication rule;
- whether one unit can receive several mode labels;
- relevant product, model, data, prompt, criterion, and evaluator versions;
- sampling uncertainty;
- whether evaluator-error correction was used and how.

Report co-occurrence separately when several modes are present in the same unit. Do not add overlapping mode rates and call the result a total failure rate.

Keep product behavior and evaluator quality separate. An evaluator-produced label rate describes what the evaluator reported. A failure-prevalence estimate describes product behavior in a stated population or case set. Failure sensitivity, non-failure specificity, evaluator abstention, and disagreement describe the evaluator.

Keep occurrence and consequence separate. A common minor failure and a rare irreversible failure require different product responses.

A challenge set can show that a failure is possible. Its failure percentage does not estimate normal production behavior.

Use groups or slices only when they follow from the question, product scope, risk, or observed evidence. Do not create many slices merely because the data permits it.

Keep the evidence levels distinct:

~~~

Judgment:

Application of an evaluation basis to one unit. The result may be PASS, FAIL,

NOT APPLICABLE, or NOT JUDGEABLE.

Failure incident:

One evidence-linked instance of behavior judged unacceptable.

Failure category:

An analytical description of a recurring pattern.

Operational failure mode:

One precise failure behavior selected for repeated assessment.

Reference label:

A trusted recorded judgment for one unit, mode, criterion, and evidence source.

Evaluator result:

The direct output of one evaluator run.

Target-set label:

A recorded evaluator result or reviewed judgment with its provenance and status.

Measurement:

A defined summary of labels, judgments, or observations.

Finding:

An interpretation of the evidence for the named question, with its limits.

~~~

A raw evaluator result becomes an evaluator-produced label when it is recorded with the unit, operational mode, criterion, evidence source, evaluator, provenance, and review status. Review may confirm, change, or adjudicate that label. None of these is yet a product finding.

## Keep failure patterns and root causes separate

A failure category describes a broad pattern in observed product behavior. An operational failure mode states how one part of that pattern is assessed on a unit. A root cause explains why the behavior occurred.

Keep these records separate:

~~~

Failure incident:

The transfer was executed before the required confirmation.

First observable failure:

At step 3, the product issued the transfer request.

Failure category:

Confirmation failure.

Operational failure mode:

Action performed without required confirmation.

Cause hypothesis:

The confirmation state may not have been passed to the action policy.

Root cause:

Not established.

~~~

Sequence and correlation in a trace do not prove causation.

Prepare a diagnosis handoff containing:

- the incident and supporting evidence;
- the related failure category and operational mode, if any;
- the first observable failure when relevant;
- affected system and configuration versions;
- the conditions under which the incident appeared;
- a reproducible case when available;
- cause hypotheses clearly marked as hypotheses;
- missing evidence and open questions;
- the direct user or system consequence.

Technical diagnosis may require reproduction, implementation inspection, additional logging, controlled tests, specification review, or a separate experiment.

A diagnosis may show that the original category or operational mode was badly defined. Feed that evidence back into the failure model.

## Review responsibilities

Failure analysis normally needs several forms of judgment:

- people responsible for the product state the intended behavior and scope;
- domain experts interpret specialized rules and consequences;
- analysts compare incidents and maintain the failure model;
- engineers investigate mechanisms and causes;
- evaluation owners review criteria, review or adjudicate labels, check measurements, and validate evaluators.

One person may perform several roles in a small project. The responsibilities still need to be clear.

## Outputs

The output should match the purpose.

| Purpose | Minimum useful output |
| --- | --- |
| Exploration | Trace-linked observations, provisional expectations, possible incidents, provisional groupings or categories, and evidence gaps |
| Production-commitment review | Failure-analysis evidence about supported categories, operational-mode labels when available, boundary cases, consequences, coverage limits, and remaining uncertainty |
| Regression work | Operational modes, criteria, cases, reference labels, evaluator results, validation results, and version links |
| Predictive analysis | Dataset and reference definition, prediction-level judgments or residuals, measurements, thresholds, calibration where relevant, comparisons, and limits |
| Production learning | Sampling definition, incidents, new or revised categories and modes, per-mode measurements, and population limits |
| Incident investigation | Incident record, related category and operational mode, consequence, reproduction material, and diagnosis handoff |

A complete analysis package may contain:

- the question and decision context;
- evaluation basis and version;
- system and project context;
- case-set, dataset, or sampling definition;
- capture contract;
- trace-linked observations;
- judgments and failure incidents;
- analytical scope and occurrence policy;
- provisional groupings;
- versioned failure categories and observed relationships;
- representative, acceptable, contrary, and unresolved cases;
- operational failure-mode specifications and their source categories, criteria, or risks;
- reference labels and their review status;
- labels on the target set and their provenance;
- criteria, evaluator versions, and evaluator-validation results;
- reviewer disagreements;
- measurements, uncertainty, and any evaluator-error correction that the evidence supports;
- the finding and remaining uncertainty;
- diagnosis questions and handoffs.

## Workflow summary

Known-criterion path:

~~~

question and decision

    -> evaluation basis

    -> relevant system context

    -> criterion and required evidence

    -> direct judgments and failure incidents

    -> optional category analysis

    -> finding

~~~

Known-criterion failure-measurement path:

~~~

question and decision

    -> evaluation basis

    -> criterion and required evidence

    -> operational binary failure mode

    -> reference labels

    -> candidate evaluator implementation and refinement

    -> held-out evaluator validation

    -> labels on the target set

    -> measurement

    -> finding

~~~

Exploratory path:

~~~

question and decision

    -> provisional expectation and system context

    -> evidence and observations

    -> clarified evaluation basis

    -> judgments and failure incidents

    -> provisional groupings

    -> supported failure categories

    -> selected operational binary failure modes

    -> reference labels

    -> candidate evaluator implementation and refinement

    -> held-out evaluator validation

    -> labels on the target set

    -> per-mode measurements

    -> finding

~~~

Predictive aggregate path:

~~~

question and decision

    -> evaluation basis, prediction target, and relevant system context

    -> dataset and reference outcomes

    -> predictions and scores

    -> error, residual, tolerance, or decision rule

    -> prediction-level judgments or residuals

    -> measurements and comparisons

    -> optional qualitative category or mode analysis

    -> finding

~~~

Reported event and diagnosis path:

~~~

reported event and evidence

    -> evaluation basis and judgment

    -> failure-incident record when the judgment is FAIL

    -> related categories, operational modes, and observed relationships

    -> reproduction and cause hypotheses

    -> separate technical diagnosis

~~~

These are evidence paths, not sequences of project phases. New evidence can send the work back to any earlier part. When people label the target set directly, the candidate-evaluator and held-out-validation steps do not apply.

## Limits

Failure analysis cannot:

- prove that all important failures have been found;
- estimate a production rate from a deliberately designed challenge set;
- turn missing evidence into successful behavior;
- establish a root cause from sequence alone;
- infer user understanding, trust, or value from a system trace alone;
- make subjective judgment reliable without validation;
- replace user research, usability evidence, product analytics, or evidence about wider results;
- make one failure model valid for every product route, population, or system version.

State these limits with the finding.
~~~
