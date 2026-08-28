---
draft: false
toc: true
title: "Prompts 03 Dimensions Set"
linkTitle: "Prompts 03 Dimensions Set"
---
```
# Prompt: Derive a Product-Grounded User-Query Dimension Set

You are designing the **user-query coverage model** for an AI application evaluation dataset.

Your task is to derive a small, defensible set of **dimensions** that can later be used to construct tuples and generate representative user inputs.

Do not generate the evaluation dataset yet. First establish and challenge the dimension set.

## Definition of a dimension

A **dimension** is a way to categorize a meaningful part or property of a user query. Each dimension represents one axis of variation in the user-query space.

Examples of possible dimensions include:

- what the user wants;
- the semantic subtype of the request;
- how explicitly the user expresses the request;
- whether required information is present;
- whether the wording is ambiguous;
- how the user refers to domain entities;
- whether the request depends on prior conversational context;
- whether the user combines multiple requests.

A dimension should represent variation that could plausibly cause **different AI behavior or a distinct failure mode**.

### Query-level boundary

For this task, dimensions must describe the **user input**, not the execution environment.

A candidate dimension should normally be classifiable from the user's message itself or, when the input is conversational, from the user's words in the relevant message sequence.

Do **not** treat these as user-query dimensions:

- database state;
- available records;
- account or object state known only to the system;
- permissions known only at execution time;
- runtime state;
- tool availability;
- model availability;
- backend configuration;
- hidden system state;
- test fixtures.

Those may later become fixtures, execution conditions, or separate evaluation-case variables. They do not belong in the user-query dimension set merely because they affect system behavior.

Use this diagnostic question:

> If I only had the user input, could I classify this dimension without inspecting hidden application or runtime state?

If the answer is no, it probably does not belong in this dimension set.

## Objective

Produce a dimension set that is:

- grounded in actual product behavior;
- small enough to understand and combine;
- broad enough to cover important forms of user variation;
- linked to plausible AI failure surfaces;
- composed of dimensions that are meaningfully distinct;
- suitable for later tuple construction and synthetic user-input generation.

Do not maximize the number of dimensions.

Prefer a smaller number of strong dimensions over a large taxonomy of superficial variation.

# Process

Follow the process below in order.

## 1. Understand the product from the user's perspective

Read the provided product specification, documentation, examples, and--if useful--relevant implementation code.

Identify:

- the main jobs users ask the AI to perform;
- the types of user requests the AI must distinguish;
- information the AI must extract or infer from natural language;
- conversational behaviors the AI is expected to handle;
- ambiguities or corrections it must resolve;
- domain references it must interpret;
- unsupported or difficult forms of user input, where product behavior is defined.

Focus on behavior exposed through user interaction.

Do not convert every product concept, field, API parameter, or implementation branch into a dimension.

Implementation details should only influence the dimension set when they reveal a genuine user-visible interpretation or routing failure surface.

Explicitly distinguish:

1. facts supported by the product materials;
2. reasonable hypotheses about likely user behavior;
3. things the materials do not specify.

Do not invent product requirements to complete the taxonomy.

## 2. Extract initial candidate dimensions

From the product understanding, identify candidate axes of user-query variation.

For each candidate, answer:

- What property of the user query does this dimension describe?
- What materially different values could it take?
- Why could variation along this axis change AI behavior?
- What failure could this expose?
- Can it be classified from the user input?
- Is it genuinely distinct from the other candidate dimensions?

Reject dimensions that are merely convenient categories but do not represent a meaningful behavioral or failure difference.

Also distinguish between:

### Dimensions

Axes worth deliberately combining during coverage design.

### Query details to vary

Properties that should appear naturally across generated inputs but do not currently justify becoming independent dimensions.

Examples might include:

- exact numeric values;
- message length;
- punctuation;
- incidental wording differences;
- particular entity names;
- arbitrary category names.

A property should not become a dimension simply because it can vary.

## 3. Model users by observable interaction behavior

Do not begin with demographic personas.

Instead, model users by **observable interaction behavior** and use those models to attack the dimension set.

Examples of behavioral user models might include users who:

- state requests explicitly;
- use terse command-like input;
- narrate what happened instead of naming an operation;
- omit information;
- express uncertainty;
- correct themselves;
- rely heavily on previous conversational context;
- use aliases, shorthand, or misspellings;
- combine several goals;
- describe a desired outcome instead of the operation needed to achieve it.

Derive the actual behavioral models from the product rather than copying this list mechanically.

For each behavioral user model:

1. describe the behavior;
2. sketch several realistic queries they might produce;
3. classify those queries using the candidate dimensions;
4. look for behavior that the candidate dimensions cannot describe cleanly.

The behavioral user models are a **tool for challenging the taxonomy**.

Do not automatically turn each user model into a dimension.

## 4. Attack the candidate dimension set

Actively search for weaknesses.

Construct realistic user queries that test:

- clear baseline requests;
- terse requests;
- incomplete requests;
- ambiguous requests;
- self-corrections;
- contradictory statements;
- indirect formulations;
- aliases and noisy references;
- contextual follow-ups;
- reference-only follow-ups;
- multiple requests in one message;
- changes of direction;
- unusual but plausible wording.

For each query, ask:

### Coverage test

Can the current dimensions describe what makes this query different?

### Independence test

Are two dimensions repeatedly encoding the same property?

### Coherence test

Do the values within each dimension represent one coherent axis?

For example, values such as:

- `self-contained`
- `correction`
- `follow-up detail`

may look related but describe different kinds of properties. Do not force heterogeneous concepts into one dimension.

### Failure-surface test

Would changing this dimension plausibly exercise different AI behavior?

### Observability test

Can the value be inferred from the user input without examining hidden system state?

### Combination test

Can the dimension combine meaningfully with other dimensions?

A good dimension should support useful combinations rather than only one narrow scenario.

## 5. Refine: split, merge, remove, or add dimensions

Use the challenge results to revise the candidate set.

### Split a dimension when

its values represent more than one underlying property.

### Merge dimensions when

they consistently describe the same behavioral variation and provide little independent coverage value.

### Remove a dimension when

- it produces mostly superficial variation;
- it cannot be classified from user input;
- another dimension already captures the same distinction;
- no plausible distinct failure surface is associated with it;
- it is actually a fixture or execution condition.

### Add a dimension when

the behavioral-user challenge repeatedly produces an important form of query variation that cannot be represented cleanly by the current set.

Treat the initial taxonomy as provisional.

## 6. Define the final dimensions precisely

For every retained dimension provide:

### Name

Use a short product-independent name where possible.

### Definition

State exactly what property of the user query it describes.

### Why it matters

Describe the AI behavior or failure surface the dimension exercises.

### Permitted values

Give a small initial controlled vocabulary.

Values should:

- be mutually understandable;
- belong to the same conceptual axis;
- be distinguishable during query classification;
- represent materially different behavior.

### Applicability

State whether the dimension:

- applies to every query; or
- is conditional on a particular intent or query type.

Do not force irrelevant dimensions into every tuple.

### Examples

Provide at least one short example demonstrating each important distinction.

## 7. Challenge the final set once more

Before approving it, generate approximately 15-20 varied example user queries covering the behavioral user models.

Classify each one using the proposed dimensions.

Do not optimize for equal distribution.

Instead, deliberately select examples that test whether the taxonomy breaks.

Report:

- queries that classify cleanly;
- queries that expose overlap;
- queries that expose missing dimensions;
- values that are difficult to distinguish;
- dimensions that seem unnecessary after classification.

Revise the set once more if necessary.

# Important distinctions
## Semantic type vs wording

A dimension can describe the semantics of a query even when the user does not explicitly name that semantic category.

For example:

> "Record a lunch expense."

and

> "I paid 20 for lunch."

may have the same semantic request type even though only one names the operation.

## Completeness vs ambiguity

Do not automatically combine these.

A request can be incomplete but clear:

> "I spent 20."

A request can contain the relevant information but remain ambiguous:

> "I spent either 20 or 30 on lunch."

These may exercise different system behavior.

## Correction vs contradiction

Treat explicit self-correction carefully.

> "It was 20--actually, 30."

usually expresses a correction with a clear final value.

That differs from unresolved contradiction:

> "It was definitely 20 and definitely 30."

Do not classify both mechanically as contradictory.

## Context dependence vs conversational role

A query being dependent on prior context is one property.

Whether the turn is providing information, correcting something, repeating a request, confirming, or changing direction may be a different property.

Do not put heterogeneous concepts into one dimension merely because they occur in multi-turn conversations.

## Explicit request vs inferred request

Consider whether the product must understand users who:

- name the operation;
- describe an event;
- describe their desired outcome.

If these formulations create meaningfully different interpretation difficulty, they may justify a dimension.

# Output format

Produce the analysis in the following sections.

## A. Product interaction model

Summarize the user-facing AI jobs and interpretation responsibilities derived from the provided materials.

Clearly identify any assumptions.

## B. Initial candidate dimensions

Use a table:

| Dimension | Candidate values | Query property represented | Failure surface | Keep for challenge? |

## C. Behavioral user models

Use a table:

| User model | Observable behavior | Example queries | Dimensions stressed |

Do not use demographic personas unless the product actually behaves differently for those users.

## D. Dimension-set challenge

Present representative difficult queries and explain what each one reveals about the taxonomy.

Call out:

- overlap;
- gaps;
- incoherent dimensions;
- fixture/system-state leakage;
- unnecessary axes.

## E. Revised dimension set

Use a table:

| Dimension | Definition | Values | Applies when | Why it matters |

This should be the proposed v1 set.

## G. Validation sample

Create 15-20 realistic user queries and classify them against the proposed dimensions.

Use these to perform a final sanity check.

## H. Final assessment

State:

- whether the dimension set is ready for tuple construction;
- which dimensions remain provisional;
- which open product questions could change the taxonomy.

The purpose of this exercise is to construct a **product-derived representation of the user-query space**, not a generic taxonomy of how humans communicate.
```
