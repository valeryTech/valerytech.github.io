---
draft: false
toc: true
title: "Prompts 04 Tuples"
linkTitle: "Prompts 04 Tuples"
---
# Prompt: Construct a Machine-Reviewed Evaluation Tuple Set


You are designing the tuple set for an AI application's evaluation dataset.

You are given:

1. **Product materials** describing the application, its intended behavior, supported jobs, guarantees, important failures, architecture, and relevant interaction constraints.
2. An already-defined **dimension set**, including:
    - dimension names;
    - definitions;
    - permitted values;
    - applicability rules;
    - interpretation notes and examples.
3. Optionally, **coverage requirements**, known difficult cases, observed failures, regressions, or other evaluation priorities.

Your task is to construct a **coverage-driven, machine-reviewed set of tuples** representing the important parts of the user-query space.

Do not generate actual user inputs yet.

# 1. Definitions

## Dimension


A **dimension** is one axis of meaningful variation in the user-query space.

The dimension set has already been selected.

Do not redesign the dimension taxonomy unless you discover a serious inconsistency that makes tuple construction impossible. If that happens, report the issue rather than silently changing the dimensions.

## Tuple


A **tuple** is a selected combination containing one permitted value from each dimension relevant to an intended interaction.

A tuple is a structured description of an interaction that can later be instantiated as a realistic user input or message sequence.

A tuple:

- represents a meaningful region of the user-query space;
- may omit dimensions that do not apply;
- must describe a coherent interaction;
- should correspond to a plausible difference in application behavior or failure.

A tuple is a **representation mechanism**. The fact that a combination of dimension values exists does not by itself justify including it.

Do not generate the Cartesian product of the dimensions.

# 2. Objective


Construct a tuple set that provides sufficient representation of product-important user interactions.

Use as evidence, where available:

- main user jobs;
- product guarantees;
- critical or consequential failures;
- routing and interpretation responsibilities;
- conversational behavior;
- important action boundaries;
- important interactions between dimension values;
- plausible failure hypotheses;
- observed user behavior;
- known difficult cases;
- regressions;
- explicit coverage requirements, if supplied.

Prefer **behavioral coverage** over numerical balance.

Do not try to represent every possible dimension combination.

Do not give every dimension value equal representation simply because it exists.

Every accepted tuple should have a defensible answer to:

> Why should this interaction be represented in the evaluation set?

# 3. Product grounding


Treat the supplied product materials as the source of truth.

Before constructing tuples, understand:

- what users rely on the product to accomplish;
- what the AI must route, interpret, infer, clarify, or remember;
- what behavior the product is expected to preserve;
- which failures would be important;
- which forms of user interaction plausibly create different AI behavior.

Clearly distinguish:

1. behavior explicitly supported by the product materials;
2. reasonable failure hypotheses implied by the materials;
3. behavior that is insufficiently specified.

Do not silently invent product requirements.

If an unresolved product question materially affects tuple construction, record it under **Open product questions**.

# 4. Coverage basis


Do not require a formal coverage-requirement taxonomy unless one is supplied or clearly useful.

Instead, identify the **coverage basis** that should guide tuple construction.

A coverage basis may be:

- a main user job;
- a product guarantee;
- a critical failure;
- a plausible failure hypothesis;
- an important routing or interpretation distinction;
- an important conversational behavior;
- an important interaction between dimensions;
- a known difficult or regression case;
- an explicit coverage requirement, if supplied.

Examples:

```text
baseline coverage for the main search job

exercise clarification when a field is ambiguous

exercise recovery of meaning from a contextual follow-up

exercise an important interaction between correction and context dependence

preserve a known regression involving shorthand references

support coverage requirement CR-04
```


Do not create formal coverage requirements merely so every tuple can point to one.

Do not accept a tuple whose only justification is:

```text
this dimension combination has not been used yet
```

# 5. Review the supplied dimensions before use


Read the complete supplied dimension specification.

For each dimension understand:

- what property it represents;
- its permitted values;
- when it applies;
- how its values differ;
- any special interpretation rules.

Respect conditional applicability.

Do not force every dimension into every tuple.

If the dimension specification contains an ambiguity that affects classification, report it rather than inventing a new interpretation.

# 6. Construct the initial tuple set


Create approximately **20 deliberate seed tuples**, adjusted when product complexity clearly justifies fewer or more.

Do not allocate them uniformly.

Build the initial set in four passes.

## 6.1 Baseline tuples


Create straightforward cases representing the main supported user jobs.

Baseline tuples should generally use:

- clear intent;
- ordinary expression;
- sufficient information;
- minimal conversational complexity;
- one request at a time;

unless the product itself makes another condition baseline.

The purpose is to establish representation of basic product behavior before introducing additional difficulty.

Ensure that every main user job deserving evaluation has suitable baseline coverage.

## 6.2 Single-surface stress tuples


Starting from plausible baselines, deliberately vary one important user-query property at a time where practical.

Depending on the supplied dimension set, examples may include:

- incomplete information;
- fragmentary input;
- ambiguous intent;
- ambiguous field values;
- correction;
- contradiction;
- indirect intent expression;
- shorthand;
- noisy references;
- contextual dependence;
- multiple requests.

The purpose of these tuples is diagnostic clarity.

Prefer:

```text
baseline + one meaningful stress
```


when it exercises the intended behavior sufficiently.

## 6.3 Important interaction tuples


Some failures may emerge only from interactions between several dimensions.

Add such tuples only when there is a product-grounded reason to believe the combination can produce behavior different from its constituent dimensions individually.

Examples of the reasoning pattern might include:

```text
context dependence × correction

indirect expression × intent ambiguity

fragmentary input × conversational continuation

reference-only wording × repetition

multiple requests × cross-capability routing
```


These are examples only. Derive actual interactions from the supplied product and dimension set.

For every interaction tuple answer:

> Why does this combination deserve coverage beyond testing its constituent dimensions separately?

If there is no convincing answer, omit it.

Do not attempt exhaustive pairwise or higher-order combination coverage.

## 6.4 Unusual but plausible tuples


Add a limited number of less-common but realistic interactions when they could plausibly expose materially different behavior.

Examples may include:

- changing direction;
- correcting prior information;
- elliptical follow-ups;
- several requests in one message;
- describing an outcome rather than naming an operation;
- relying heavily on previous context.

Only include behaviors supported or reasonably implied by the product materials and supplied dimensions.

# 7. Tuple schema


Represent every candidate tuple using:

```yaml
id: T001

coverage_basis: >
  Why this part of the user-query space deserves representation.

dimensions:
  dimension_a: value
  dimension_b: value
  dimension_c: value

sequence_setup: >
  Optional. Describe only the minimum prior user-message context
  needed to instantiate this interaction later.

failure_surface: >
  What could plausibly behave or fail differently in this interaction.

nearest_related_tuple: Txxx | null

material_difference: >
  Why this tuple adds meaningful coverage beyond its nearest related tuple.
```


Omit irrelevant dimensions.

Do not include placeholder values merely to make every tuple structurally identical.

`sequence_setup` is metadata for later user-input generation. It is not an additional dimension.

Do not generate the actual natural-language user input yet.

# 8. First automated review


After constructing the seed tuples, switch roles.

Act as a skeptical reviewer whose job is to remove weak, redundant, unsupported, or incoherent tuples.

Review every tuple using the following checks.

## 8.1 Product-grounding check


Ask:

> Is this interaction explicitly supported or reasonably implied by the product materials?

Reject unsupported behavior.

If the product behavior is important but undefined, move it to **Open product questions**.

## 8.2 Coverage-basis check


Ask:

> Why does this interaction deserve representation?

Valid answers may point to:

- a main job;
- a guarantee;
- a critical failure;
- a failure hypothesis;
- an important behavioral variation;
- an important interaction;
- a known case;
- an explicit coverage requirement.

Reject tuples whose justification is only combinatorial novelty.

## 8.3 Coherence check


Ask:

> Could a realistic user input or message sequence instantiate all selected dimension values simultaneously?

Reject impossible or internally inconsistent combinations.

## 8.4 Dimension-validity check


For every included dimension verify:

- the dimension applies;
- the value is permitted;
- the value is being used according to the supplied definition.

Repair straightforward classification problems.

Do not reinterpret dimension definitions merely to preserve a candidate tuple.

## 8.5 Failure-surface check


Ask:

> Could this interaction plausibly expose different routing, interpretation, reasoning, conversational, or action-selection behavior?

If its only difference from another tuple is cosmetic, reject it.

## 8.6 Distinctiveness check


Compare every tuple with the current accepted set.

Identify its nearest related tuple.

Ask:

> If both were executed, what materially new evidence could this tuple provide?

If the answer is effectively nothing, merge or reject it.

## 8.7 Complexity check


If a tuple contains multiple difficult dimension values, ask:

> Are all of these values necessary to represent the intended interaction?

If not, simplify the tuple.

Prefer diagnostic simplicity unless the interaction between difficulties is itself the reason for coverage.

## 8.8 Applicability check


Do not include dimensions that are irrelevant to the intended interaction.

Conditional dimensions should be omitted when they do not apply.

## 8.9 Evaluation-boundary check


Keep tuple construction within the scope represented by the supplied dimensions.

Do not introduce hidden system properties, fixtures, permissions, database contents, tool state, or runtime conditions unless they are explicitly part of the supplied dimension model.

Such conditions can be added later when executable evaluation cases are assembled.

# 9. Repair and curate the seed set


Based on the review:

- accept strong tuples;
- repair correctable tuples;
- simplify unnecessarily complex tuples;
- split tuples that accidentally represent multiple unrelated purposes;
- merge near-duplicates;
- reject unsupported or superficial tuples.

Maintain a lightweight decision record:

```yaml
candidate: Txxx
decision: accepted | repaired | merged | rejected
reason: ...
```


Do not preserve a weak tuple merely to maintain the target number of seed tuples.

The number is a heuristic, not a quota.

# 10. Audit the tuple set


Review the accepted set collectively.

The objective is to find **meaningful missing coverage**, not empty cells in a combinatorial matrix.

## 10.1 Main-job coverage


For every main user job, ask:

- Is there a straightforward baseline?
- Are the important user-query variations represented?
- Are known or plausible failure surfaces represented?
- Would another tuple plausibly provide materially new evidence?

Unequal numbers of tuples across jobs are acceptable.

## 10.2 Product-behavior coverage


Review important:

- guarantees;
- routing distinctions;
- interpretation responsibilities;
- conversational behaviors;
- critical failures;
- failure hypotheses;
- known difficult cases;
- explicit coverage requirements, if supplied.

Identify behavior that has no adequate tuple representation.

## 10.3 Dimension-value coverage


List which supplied dimension values appear in the tuple set.

An unused or rare value is **not automatically a gap**.

For each unused or rare value ask:

> Is there a product-grounded reason this value needs deliberate representation?

If yes, flag a possible gap.

If no, leave it underrepresented.

## 10.4 Interaction coverage


Identify interactions between dimensions that could plausibly produce distinct system behavior.

Classify each important interaction as:

```text
covered
partially covered
uncovered
not currently justified
```


Only inspect product-important interactions.

Do not enumerate every possible pair.

## 10.5 Difficulty distribution


Check that the set contains both:

- straightforward baseline interactions;
- difficult interactions.

Avoid a set dominated entirely by edge cases.

Also avoid a set where difficult behavior appears only in highly compounded tuples that make failures hard to interpret.

## 10.6 Redundancy


Look for groups of tuples exercising effectively the same behavior.

Retain multiple tuples only when their semantic or behavioral differences justify separate coverage.

Do not preserve duplicates merely because they use different dimension values superficially.

# 11. Generate gap-filling candidates


Based on the audit, identify **justified gaps**.

Generate additional tuple candidates only for those gaps.

A justified gap might be:

- a main job with inadequate behavioral coverage;
- an important product guarantee with no suitable tuple;
- a plausible failure surface absent from the set;
- an important dimension interaction not yet represented;
- an important difficult behavior represented only indirectly;
- a known regression missing from the tuple set;
- an explicit coverage requirement with insufficient representation.

For every expansion candidate include:

```yaml
fills_gap: >
  What specific gap this candidate addresses.

coverage_basis: >
  Why the gap matters.

nearest_existing_tuple: Txxx | null

material_difference: >
  What new evidence this tuple could provide.
```


Reject a candidate immediately if its main justification is:

- numerical balance;
- unused combination;
- unused dimension value without behavioral justification;
- wording variation that belongs in later user-input generation.

# 12. Review expansion candidates


Run every expansion candidate through the same review checks:

- product grounding;
- coverage basis;
- coherence;
- dimension validity;
- failure surface;
- distinctiveness;
- complexity;
- applicability;
- evaluation boundary.

Compare each candidate against the entire accepted tuple set.

Accept only candidates that add meaningful coverage.

Then rerun the complete coverage audit.

# 13. Iterate toward saturation


Repeat:

```text
audit current tuple set
        ↓
identify justified coverage gaps
        ↓
generate targeted candidates
        ↓
adversarial review
        ↓
repair / merge / reject
        ↓
audit again
```


Use a maximum of **3 expansion rounds**.

Stop earlier when the tuple set reaches coverage saturation.

If meaningful unresolved gaps remain after the final round, report them rather than manufacturing weak tuples.

# 14. Coverage saturation


Treat the tuple set as saturated when:

1. main supported user jobs have appropriate baseline representation;
2. important product guarantees and failure surfaces have suitable tuple coverage;
3. important forms of user-query difficulty are represented where relevant;
4. important interactions between dimensions are represented;
5. contextual or multi-turn behavior is represented where relevant;
6. known difficult or regression cases are represented when supplied;
7. explicit coverage requirements are adequately represented when supplied;
8. there are no obvious product-important gaps;
9. most new candidate tuples would be:
    - duplicates;
    - cosmetic variants;
    - unsupported interactions;
    - unjustified combinations;
    - variations better handled during natural-language generation.

Coverage saturation does **not** mean every dimension combination has been created.

It means additional tuples are unlikely to add a materially new category of user interaction or failure surface given the current product model.

# 15. Final adversarial audit


Before finalizing, assume the tuple set is incomplete or poorly structured.

Try to disprove its adequacy.

Ask:

- Which important user behavior is absent?
- Which major user job has only trivial coverage?
- Which guarantee has no interaction capable of exercising it?
- Which plausible failure surface is missing?
- Which important dimension interaction is absent?
- Which accepted tuples are redundant?
- Which tuple relies on unsupported product behavior?
- Which tuple misuses a dimension?
- Which contextual tuple lacks sufficient sequence setup?
- Which complicated tuple should be decomposed?
- Which apparent gap is only a desire for numerical balance?

Repair supported issues.

Record unresolved specification issues as open product questions.

Then perform this adversarial audit once more.

# 16. Final output


Return the following sections.

## A. Coverage basis


Summarize the product-derived considerations that drove tuple selection.

Organize them under relevant categories such as:

- main user jobs;
- guarantees;
- important failure hypotheses;
- conversational behaviors;
- important interactions;
- known difficult cases;
- supplied coverage requirements.

Do not invent a formal coverage-requirement taxonomy unless one was supplied or materially useful.

## B. Open product questions


List only ambiguities in the supplied materials that materially affect tuple construction.

Do not resolve them using unsupported assumptions.

## C. Machine-reviewed tuple set


Use a table:

| ID | Dimensions | Coverage basis | Purpose | Failure surface |

Keep the actual dimension names and permitted values from the supplied dimension specification.

For tuples requiring conversational context, provide their `sequence_setup` immediately below the table.

Do not generate natural-language user messages.

## D. Coverage audit


Report:

### Main jobs


What behavioral breadth is represented for each main job.

### Product guarantees and important behavior


Which important behaviors are represented and where.

### Dimension coverage


Which values are common, rare, or unused, and whether that distribution is intentional.

### Important interactions


Which meaningful dimension interactions are represented.

### Known cases / explicit coverage requirements


If supplied, show how they are represented.

### Remaining gaps


List only genuine gaps.

## E. Review summary


Report:

```text
initial candidates generated
expansion candidates generated
accepted unchanged
repaired
merged
rejected
```


Summarize major rejection reasons:

- duplicate / near-duplicate;
- superficial variation;
- unsupported behavior;
- incoherent combination;
- incorrect dimension use;
- irrelevant dimension;
- no distinct failure surface;
- no product-grounded coverage basis.

## F. Saturation assessment


Answer:

1. Why did tuple generation stop?
2. What new behavior would another tuple need to represent to justify inclusion?
3. Which known product-grounded gaps remain unresolved?
4. Is the tuple set ready for user-input generation?

# 17. Strict rules


- Use the supplied dimension set.
- Do not silently redesign dimensions.
- Generate tuples, not user messages.
- Do not construct a Cartesian product.
- Do not balance dimension values mechanically.
- Do not require formal coverage requirements unless they are supplied or useful.
- Every accepted tuple must have a product-grounded coverage basis.
- Every accepted tuple must have a distinct purpose.
- Do not accept a tuple simply because its combination is unique.
- Prefer simple diagnostic tuples before complicated interactions.
- Keep complex tuples only when the interaction itself is meaningful.
- Omit dimensions that do not apply.
- Keep lexical and stylistic variation for the later user-input-generation stage.
- Do not prescribe ideal assistant responses.
- Do not invent unspecified product behavior.
- Keep hidden execution conditions out of tuples unless the supplied dimension model explicitly includes them.
- Treat the output as **machine-reviewed**, not human-approved.

# Supplied dimension set


[INSERT DIMENSION SET HERE]

Include:

- dimension names;
- definitions;
- permitted values;
- applicability;
- interpretation notes;
- examples.

# Optional evaluation inputs


[INSERT ANY EXISTING COVERAGE REQUIREMENTS, KNOWN FAILURES, REGRESSIONS, REAL-USER FINDINGS, OR OTHER PRIORITIES HERE]

If none are supplied, derive coverage directly from the product materials.

# Product materials


[INSERT PRODUCT SPECIFICATION, REQUIREMENTS, AI/ARCHITECTURE DOCUMENTATION, AND OTHER RELEVANT MATERIALS HERE]

Treat these materials as the source of truth.

Where the materials leave important behavior unspecified, report that under **Open product questions** rather than inventing an answer.
