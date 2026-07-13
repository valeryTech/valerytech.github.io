---
draft: false
toc: true
title: "Failure Operators"
linkTitle: "Failure Operators"
---

Status: draft

Layer: Layer 2 product-facing classification vocabulary

Intended users: product engineers, AI engineers, evaluators, incident reviewers, reliability owners, and control designers

## Purpose


This document defines **failure operators** for AI product debugging.

A failure operator is a reusable descriptor of **what happened to an affected artifact**.

It is the verb-like layer of the product debugging taxonomy:

```text
product_family + affected_artifact + failure_operator
```


Examples:

```text
P3 + citation_or_source_reference + invented
P3 + claim + unsupported
P4 + exact_value + corrupted
P5 + tool_call + misselected
P6 + external_action + unauthorized
P7 + scenario_outcome + unstable
P2 + state_or_memory + stale
```


This file is meant to make incident classification compositional rather than forcing each real product failure into one supposedly atomic fault code.

Use it for:

- incident review;
- debugging and trace inspection;
- evaluation-case design;
- release-gate failure triage;
- control-gap analysis;
- production monitoring labels;
- communication between product, engineering, evaluation, policy, and operations teams.

## Relationship to the causal stack


This file preserves the stack boundaries used by the rest of the taxonomy.

```text
Layer 0
  natural-language interface conditions

Layer 1
  model and system features that make behavior possible

Layer 2
  recurring behavioral failure patterns

Evaluation view
  methods that reveal, measure, reproduce, or compare those failures

Layer 3
  controls that prevent, detect, recover from, monitor, or prove acceptable behavior

Layer 4
  user, workflow, safety, legal, business, or operational impact
```


Failure operators sit inside **Layer 2**, but they are not standalone fault families. They are cross-cutting descriptors used inside product-facing incident records.

They answer:

> What happened to the affected artifact?

They do **not** answer:

> Which model mechanism caused it?
> Which system control was missing?
> Which evaluation detected it?
> Which user, business, legal, or safety impact resulted?

Those belong to Layer 1, Layer 3, the evaluation view, and Layer 4 respectively.

## Relationship to product fault families


`product-fault-families.md` answers:

> Where did the product failure show up?

`failure-operators.md` answers:

> What happened to the object that failed?

A product incident should normally include both.

```yaml
product_family: P3 Claim, Grounding, and Epistemic Failure
affected_artifact: citation_or_source_reference
primary_operator: invented
secondary_operators:
  - unsupported
  - overstated
evaluation_methods:
  - EM4
  - EM5
  - EM9
control_gap:
  - L3B5 Claim Grounding and Citation Controls
  - L3B6 Claim Verification Controls
  - L3B7 Confidence Communication Controls
legacy_tags:
  - F33
  - F30
  - F36
  - FF3
  - FF4
  - FF5
```

## Core distinction


Failure operators are **artifact-local**.

They should complete this sentence:

```text
The [affected artifact] was [operator].
```


Good examples:

```text
The citation was invented.
The claim was unsupported.
The exact value was corrupted.
The policy decision was unstable.
The external action was unauthorized.
The retrieved evidence was ignored.
The state was stale.
```


Bad examples:

```text
The answer was hallucination.
The user was harmed.
The validator was missing.
The model had attention failure.
```


Those are, respectively:

- a broad fault-family label;
- a Layer 4 impact;
- a Layer 3 control gap;
- a Layer 1 causal hypothesis.

## Classification syntax


Use this compact syntax in incidents, test failures, release gates, and monitoring records:

```text
P-family + affected_artifact + primary_operator + evaluation_method + control_gap
```


Examples:

```text
P3 + claim + unsupported + EM4 + L3B5 gap
P4 + output_payload + malformed + EM6 + L3A4 gap
P5 + tool_arguments + corrupted + EM8/EM6 + L3C5 gap
P6 + external_action + unauthorized + EM10/EM8 + L3C8 gap
P7 + scenario_outcome + unstable + EM1/EM13 + L3D5 gap
```


Use this expanded form when debugging:

```yaml
incident_id: string
product_surface: chat | search | copilot | agent | workflow | API | batch

observed_behavior: string
expected_behavior: string

product_family: P1 | P2 | P3 | P4 | P5 | P6 | P7
secondary_families: []

affected_artifact:
  type: task_contract | instruction_set | context_packet | state_or_memory | evidence | claim | citation_or_source_reference | confidence_or_uncertainty | output_payload | exact_value | reasoning_or_plan | tool_call | tool_arguments | tool_result_interpretation | external_action | policy_decision | interaction_behavior | scenario_outcome
  identifier: string
  location: user_input | prompt_assembly | retrieval | memory | generation | validator | tool | orchestrator | policy_layer | UI | state_store | external_system

primary_operator: OPxx
secondary_operators: []

condition_modifiers: []

evaluation_methods: []
layer_3_control_gap: []
legacy_tags: []
```

## Operator design principles

### 1. Operators describe artifacts, not incidents as wholes


An incident may have several artifacts. Each operator should attach to a specific artifact.

Poor:

```yaml
operator: unsupported
```


Better:

```yaml
affected_artifact: claim
primary_operator: unsupported
```

### 2. Operators are observable or traceable


Prefer operators that can be assigned from outputs, traces, tool logs, retrieval snapshots, validators, eval results, or incident evidence.

Avoid operators that require guessing hidden model cognition.

### 3. Operators are not root causes


`stale` says that an obsolete artifact was used as current.

It does not say why that happened. Possible causes might include stale retrieval, cache invalidation failure, memory rehydration, prompt assembly, state sync, or learned prior override.

### 4. Operators are not controls


`unsupported` describes a claim.

`no claim-source checker` describes a Layer 3 control gap.

Keep them separate:

```yaml
affected_artifact: claim
primary_operator: unsupported
control_gap:
  - L3B5 Claim Grounding and Citation Controls
```

### 5. Operators are not impacts


`unauthorized` may cause user, legal, safety, trust, or business impact. The operator itself is not the impact.

```yaml
primary_operator: unauthorized
impact: customer record was modified without approval
```

### 6. Operators are composable but should be sparse


Use one primary operator. Add secondary operators only when they materially change diagnosis, evaluation design, or control design.

Good:

```yaml
primary_operator: invented
secondary_operators:
  - unsupported
  - overstated
```


Bad:

```yaml
operators:
  - missing
  - incomplete
  - ignored
  - misweighted
  - stale
  - unsupported
  - overstated
  - premature
  - unrecovered
```

### 7. Prefer the sharpest operator


A fabricated citation is usually also unsupported, but `invented` is sharper.

A valid JSON object with the wrong customer ID is not primarily malformed. It is `corrupted` or `misselected`, depending on whether the intended value was altered or the wrong existing value was selected.

A tool action without confirmation is not primarily premature if the central issue is permission. It is `unauthorized`.

## Operator groups


The canonical operators fall into six practical groups.

| Group | Operators | Debug focus |
|---|---|---|
| **Availability and use** | missing, incomplete, ignored, misweighted, stale, contaminated | Was the right information present, current, trusted, and used appropriately? |
| **Classification and interpretation** | misclassified, misinterpreted, misselected | Did the system assign the right role, meaning, category, route, or choice? |
| **Representation and transformation** | malformed, corrupted, distorted | Did structure, exactness, or semantic fidelity survive generation and transformation? |
| **Epistemic support and communication** | invented, unsupported, overstated | Did claims, sources, citations, and confidence match evidence and verification status? |
| **Generalization and reliability** | overgeneralized, unstable | Does behavior hold across domains, slices, variants, versions, and repeated runs? |
| **Process, action, and recovery** | premature, unauthorized, unrecovered | Did the system finish, act, or fail-open before it was ready or allowed to proceed? |

## Master operator table


| Code | Operator | Core question | Example |
|---|---|---|---|
| **OP01** | `missing` | Was a required artifact absent? | Required source span was not in context. |
| **OP02** | `incomplete` | Was the artifact present but partial? | Summary omitted a required exception. |
| **OP03** | `ignored` | Was a present artifact not used? | Supplied policy was not applied. |
| **OP04** | `misweighted` | Was the artifact given the wrong priority or authority? | Older source outweighed current policy. |
| **OP05** | `stale` | Was obsolete state treated as current? | Old user preference was used after update. |
| **OP06** | `contaminated` | Did irrelevant, misleading, or untrusted content shape behavior? | Prompt-injection text affected the answer. |
| **OP07** | `misclassified` | Was role, type, risk, authority, or constraint force classified incorrectly? | Soft preference treated as hard rule. |
| **OP08** | `misinterpreted` | Was the artifact semantically read incorrectly? | Tool result treated as proof when it was partial. |
| **OP09** | `misselected` | Was the wrong item chosen from an available set? | Wrong tool, source, route, enum, or action chosen. |
| **OP10** | `malformed` | Did the artifact violate syntax, schema, format, or boundary requirements? | Invalid JSON or extra text after a payload. |
| **OP11** | `corrupted` | Was exact representation changed? | ID, URL, date, number, or field value altered. |
| **OP12** | `distorted` | Did transformation or compression change operational meaning? | Summary preserved gist but dropped a binding exception. |
| **OP13** | `invented` | Was the artifact fabricated? | Non-existent citation, source, fact, or tool result. |
| **OP14** | `unsupported` | Did the artifact lack required evidence or justification? | Material claim had no source-span support. |
| **OP15** | `overstated` | Did it express too much certainty, completeness, authority, or safety? | High-confidence answer despite weak evidence. |
| **OP16** | `overgeneralized` | Was a familiar pattern applied outside its valid domain? | Common workflow applied to a rare regulatory edge case. |
| **OP17** | `unstable` | Did material behavior vary when it should remain invariant? | Different escalation decisions for paraphrases. |
| **OP18** | `premature` | Did the system finalize before enough evidence, validation, or readiness? | Answered before required lookup completed. |
| **OP19** | `unauthorized` | Did the system act, recommend, or disclose without required permission or policy basis? | Email send prepared without confirmation. |
| **OP20** | `unrecovered` | Did the system fail after error, uncertainty, contradiction, or missing input? | Tool error ignored; workflow continued. |

## Condition modifiers


Condition modifiers describe operating circumstances that shaped the failure. They are not primary operators because they do not say what happened to the artifact.

Use condition modifiers after choosing the primary operator.

| Modifier | Meaning | Usually pairs with |
|---|---|---|
| `budget_constrained` | Cost, token, latency, compute, or reliability budget constrained the behavior. | incomplete, distorted, premature, unsupported, unrecovered, unstable |
| `long_context` | Long or dense context increased omission, underuse, truncation, or distortion pressure. | missing, incomplete, ignored, distorted, unstable |
| `retrieval_conditioned` | Behavior depended on retrieval, ranking, reranking, metadata, or source packaging. | missing, incomplete, ignored, misweighted, stale, contaminated, unsupported |
| `tool_conditioned` | Behavior depended on tool choice, tool arguments, tool result interpretation, or tool availability. | misselected, corrupted, misinterpreted, premature, unauthorized, unrecovered |
| `multi_turn` | Behavior depended on turn history, continuity, commitments, or clarification. | missing, stale, distorted, ignored, premature |
| `cross_session` | Behavior depended on persisted memory, profile, external state, or workflow state. | missing, stale, distorted, unauthorized |
| `policy_conditioned` | Behavior depended on safety, compliance, privacy, refusal, escalation, or authorization. | misclassified, misweighted, overstated, unauthorized, unstable |
| `version_changed` | Behavior changed across model, prompt, retrieval, policy, schema, or tool version. | unstable, stale, corrupted, unsupported, unrecovered |
| `low_observability` | Trace data was insufficient to localize the artifact or control boundary. | any operator |
| `high_risk_action` | The affected artifact controlled a write, transaction, disclosure, escalation, or irreversible action. | premature, unauthorized, corrupted, misselected, unrecovered |

Example:

```yaml
product_family: P7 Reliability and Operating-Envelope Failure
affected_artifact: evidence
primary_operator: incomplete
condition_modifiers:
  - budget_constrained
  - long_context
legacy_tags:
  - F48
  - F50
  - FF15
```


Do not use this instead:

```yaml
primary_operator: budget_constrained
```


`budget_constrained` explains pressure on the system; it does not describe what happened to the artifact.

## Operator record schema


Each detailed operator record uses this structure:

```text
## OPxx. operator_name

### Definition
What this operator means.

### Canonical statement
Reusable one-sentence formulation.

### Applies to artifacts
Common affected artifact types.

### Observable signals
What can be seen in output, trace, eval, logs, or review.

### Common product families
P-families where this operator often appears.

### Typical legacy tags
Relevant older Fxx or FFx tags. These are examples, not exact replacements.

### Typical evaluation methods
EM methods that commonly reveal this operator.

### Typical Layer 3 controls
Control families that commonly prevent, detect, recover from, monitor, or prove behavior around this operator.

### Common confusions
Nearby operators that should not be collapsed.

### Not this
Boundary guidance.

### Example
Short incident classification.
```

# Detailed operator records

## OP01. `missing`

### Definition


A required artifact was not present at the point where the system needed it.

### Canonical statement


> The affected artifact was required for correct behavior but was absent from the available context, state, trace, tool result, or control boundary.

### Applies to artifacts


task_contract, instruction_set, context_packet, state_or_memory, evidence, output_payload fields, tool_result_interpretation, external_action approval, policy_decision basis.

### Observable signals


- The answer falls back to a generic default where task-specific evidence was required.
- A required field, source span, approval, state value, or tool result is absent from the trace.
- The system asks for information that should have been carried through but was not supplied.
- A downstream validator fails because a required value was never produced or passed forward.

### Common product families


P1, P2, P3, P4, P5, P6.

### Typical legacy tags


F01, F04, F48, FF10, FF11.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM3, EM6, EM8, EM10, EM11, EM14.

### Typical Layer 3 controls


L3A1, L3A3, L3B1, L3B2, L3B4, L3C1, L3C8, L3X1.

### Common confusions


Use ignored when the artifact was present but not used. Use incomplete when the artifact was present but partial. Use stale when an obsolete artifact was present and treated as current.

### Not this


Do not use missing as a generic label for any failure. Name the artifact that was absent and where it should have appeared.

### Example

```text
P2 + evidence + missing: required policy source was not retrieved, so the answer used a generic policy prior.
```

## OP02. `incomplete`

### Definition


An artifact was present, but it lacked required coverage, fields, spans, steps, exceptions, or conditions.

### Canonical statement


> The affected artifact existed, but it was materially incomplete for the product decision or output it had to support.

### Applies to artifacts


context_packet, evidence, state_or_memory, output_payload, claim set, reasoning_or_plan, summary, retrieved result set.

### Observable signals


- A summary omits a binding exception, condition, risk signal, or required detail.
- A retrieval result contains some relevant evidence but misses the controlling source or span.
- A structured output is syntactically valid but lacks required semantic coverage.
- The plan contains plausible steps but omits a required validation, approval, or recovery step.

### Common product families


P1, P2, P3, P4, P5, P7.

### Typical legacy tags


F01, F11, F21, F27, F49, FF4, FF10, FF15.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM3, EM4, EM6, EM7, EM8, EM11, EM14.

### Typical Layer 3 controls


L3A1, L3A4, L3B1, L3B2, L3B4, L3B5, L3C3, L3X2.

### Common confusions


Use missing when the artifact was absent. Use distorted when compression or transformation changed meaning. Use premature when the system finalized before completing required information gathering.

### Not this


Do not use incomplete only because the output could have included more detail. The omitted material must be required for the task, risk level, or downstream consumer.

### Example

```text
P2 + evidence + incomplete: retrieval found the contract section but omitted the exception clause that governed the answer.
```

## OP03. `ignored`

### Definition


A relevant artifact was present and available, but it had little or no material effect on the output, decision, tool call, or action.

### Canonical statement


> The affected artifact was available to the system but was not materially applied.

### Applies to artifacts


instruction_set, context_packet, evidence, state_or_memory, tool_result_interpretation, policy_decision basis, examples.

### Observable signals


- The output contradicts supplied task-specific evidence or instructions.
- Trace shows the source, policy, or tool result was present but the answer follows a parametric prior.
- A required in-context example, exception, or constraint has no visible influence on the result.
- A tool result is available but the workflow proceeds as if the call never happened.

### Common product families


P1, P2, P3, P5, P6.

### Typical legacy tags


F02, F14, F34, F35, FF4, FF10.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM2, EM3, EM4, EM7, EM8, EM10, EM14.

### Typical Layer 3 controls


L3A1, L3A2, L3A3, L3B4, L3B5, L3C3, L3C6, L3X1.

### Common confusions


Use missing when the artifact was absent. Use misweighted when it influenced the result but at the wrong priority. Use misinterpreted when it was used but read incorrectly.

### Not this


Do not infer ignored from a bad answer alone. Confirm that the artifact was actually available in the effective runtime scenario.

### Example

```text
P3 + evidence + ignored: the retrieved source explicitly says the feature is unavailable, but the answer says it is supported.
```

## OP04. `misweighted`

### Definition


The system used an artifact, but assigned it the wrong priority, authority, evidential weight, recency, or normative force relative to competing artifacts.

### Canonical statement


> The affected artifact was used with the wrong relative weight.

### Applies to artifacts


instruction_set, context_packet, evidence, source authority metadata, state_or_memory, examples, policy_decision basis.

### Observable signals


- A low-authority source overrides a high-authority source.
- A recent but weakly relevant span outweighs an older but governing source, or vice versa.
- An example is treated as a rule, or a hard requirement is treated as a preference.
- Policy text, user speculation, retrieved commentary, and source evidence are treated as equal.

### Common product families


P1, P2, P3, P6, P7.

### Typical legacy tags


F03, F07, F12, F35, FF2, FF4, FF10.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM2, EM3, EM4, EM10, EM13, EM14.

### Typical Layer 3 controls


L3A1, L3A2, L3B3, L3B4, L3B5, L3D1, L3X1.

### Common confusions


Use ignored when a relevant artifact had no effect. Use misclassified when the main issue is wrong type, role, risk, or constraint-force classification. Use stale when the wrong weight comes from obsolete status treated as current.

### Not this


Do not use misweighted for every disagreement between sources. Use it when the system's resolution violates the intended priority or authority order.

### Example

```text
P2 + evidence + misweighted: an unofficial blog post outweighed the current product policy in the generated answer.
```

## OP05. `stale`

### Definition


An artifact that was previously valid but no longer current was used as if it still governed the task, state, evidence, or decision.

### Canonical statement


> The affected artifact was obsolete, but the system treated it as current.

### Applies to artifacts


state_or_memory, context_packet, evidence, retrieval index entry, tool result, policy version, prompt version, task_contract.

### Observable signals


- An old user preference is applied after the user changed it.
- A deprecated policy, stale cache entry, old tool result, or obsolete workflow state controls behavior.
- A version change is not reflected in retrieval, prompt assembly, memory, or routing.
- The system continues an old plan after the task or environment changed.

### Common product families


P2, P3, P5, P6, P7.

### Typical legacy tags


F05, F35, F50, FF10, FF11, FF15.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM3, EM8, EM10, EM11, EM13, EM15.

### Typical Layer 3 controls


L3B3, L3C1, L3C2, L3C3, L3D7, L3X1, L3X3.

### Common confusions


Use missing when no state was available. Use misweighted when freshness was present but prioritized incorrectly. Use corrupted when the value changed rather than becoming obsolete.

### Not this


Do not use stale simply because information is old. Use it when the system treats obsolete information as operationally current.

### Example

```text
P2 + state_or_memory + stale: the assistant used a saved shipping address after the user updated it in the previous turn.
```

## OP06. `contaminated`

### Definition


An artifact was polluted by irrelevant, adversarial, low-trust, or misleading material that materially influenced the output, decision, tool call, or action.

### Canonical statement


> The affected artifact was contaminated by content that should not have shaped the product behavior.

### Applies to artifacts


context_packet, evidence, instruction_set, retrieval result set, task_contract, tool_result_interpretation, policy_decision basis.

### Observable signals


- Prompt-injection text inside retrieved content affects instructions, tool use, or refusal behavior.
- Facts from a neighboring entity, record, document, or customer leak into the answer.
- A distractor example or irrelevant source changes classification or routing.
- Untrusted content is treated as if it were trusted instruction or evidence.

### Common product families


P1, P2, P3, P5, P6, P7.

### Typical legacy tags


F06, F15, F16, F34, FF4, FF10, FF14.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM2, EM3, EM4, EM8, EM10, EM12, EM14.

### Typical Layer 3 controls


L3A2, L3A3, L3B2, L3B3, L3B4, L3C6, L3D1, L3X1.

### Common confusions


Use misclassified when the main issue is wrong role or authority classification. Use misinterpreted when a trusted artifact was semantically read incorrectly. Use unsupported when the artifact lacks support without a contaminating source.

### Not this


Do not use contaminated for every false claim. Use it when an identifiable irrelevant, misleading, or untrusted input shaped the behavior.

### Example

```text
P6 + policy_decision + contaminated: a retrieved webpage includes `ignore prior instructions`, and the agent follows it as active control text.
```

## OP07. `misclassified`

### Definition


The system assigned the wrong category, role, type, risk level, authority status, policy class, or normative force to an artifact or scenario.

### Canonical statement


> The affected artifact or scenario was put into the wrong operational class.

### Applies to artifacts


task_contract, instruction_set, evidence, source authority metadata, policy_decision, tool_call, external_action, interaction_behavior, output label.

### Observable signals


- A hard constraint is treated as optional guidance, or a soft preference as a hard rule.
- User-provided data is treated as instruction, or instruction is treated as quoted data.
- A safe request is refused, or a risky request is allowed, because the policy class was wrong.
- The wrong intent, object type, entity, label, or escalation class is assigned.

### Common product families


P1, P2, P4, P5, P6, P7.

### Typical legacy tags


F07, F11, F12, F15, F39, F41, FF2, FF14.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM2, EM3, EM6, EM8, EM10, EM12, EM14.

### Typical Layer 3 controls


L3A1, L3A2, L3A6, L3B3, L3C4, L3D1, L3D2, L3D3.

### Common confusions


Use misselected when the wrong item was chosen from a set. Use misweighted when the category is right but priority is wrong. Use contaminated when untrusted content caused the wrong classification.

### Not this


Do not use misclassified for every wrong answer. Use it when the failure is specifically an incorrect operational categorization.

### Example

```text
P1 + instruction_set + misclassified: `please keep it brief` is treated as a hard prohibition against required safety detail.
```

## OP08. `misinterpreted`

### Definition


The system used an artifact, but drew the wrong meaning, implication, relation, condition, or conclusion from it.

### Canonical statement


> The affected artifact was available and used, but its meaning was interpreted incorrectly.

### Applies to artifacts


evidence, tool_result_interpretation, instruction_set, task_contract, claim, reasoning_or_plan, source span, policy text.

### Observable signals


- A tool result that says `no rows returned` is treated as evidence that a condition is false rather than unknown.
- A source exception, qualifier, or condition is read as applying to the wrong case.
- A policy, contract clause, or user instruction is summarized with the wrong operational meaning.
- The model draws an invalid conclusion from otherwise correct intermediate information.

### Common product families


P1, P2, P3, P5, P6.

### Typical legacy tags


F11, F12, F21, F27, F29, F34, F53, FF4, FF9, FF12.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM3, EM4, EM7, EM8, EM10, EM14.

### Typical Layer 3 controls


L3A1, L3B4, L3B5, L3B6, L3C3, L3C6, L3X1, L3X5.

### Common confusions


Use ignored when the artifact did not affect behavior. Use distorted when a transformation changed the artifact before interpretation. Use corrupted for exact-value change.

### Not this


Do not use misinterpreted when the artifact was absent or fabricated. Use missing or invented instead.

### Example

```text
P5 + tool_result_interpretation + misinterpreted: an API timeout is treated as confirmation that no matching record exists.
```

## OP09. `misselected`

### Definition


The system selected the wrong tool, source, route, label, enum, entity, record, action, plan branch, or output option from a set of possible choices.

### Canonical statement


> The affected artifact was the wrong selection for the scenario.

### Applies to artifacts


tool_call, tool_arguments, evidence source, route, model choice, output label, external_action, policy_decision, retrieval result.

### Observable signals


- Wrong tool selected for the task, or required tool omitted in favor of an inappropriate one.
- Wrong customer, account, source, citation, enum value, recipient, date, or route chosen.
- Classifier picks a plausible but incorrect label.
- Agent chooses a locally reasonable action that is not valid for the actual goal or state.

### Common product families


P1, P2, P4, P5, P6, P7.

### Typical legacy tags


F09, F11, F21, F27, F51, F52, F54, FF9, FF13.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM2, EM3, EM6, EM8, EM10, EM12, EM13, EM14.

### Typical Layer 3 controls


L3A1, L3A5, L3B2, L3C4, L3C5, L3C8, L3D4, L3X2.

### Common confusions


Use misclassified when the wrong category is the central issue. Use corrupted when the intended exact value was altered. Use unauthorized when the selected action lacked permission or policy basis.

### Not this


Do not use misselected when there was no valid available option. Use missing, incomplete, unsupported, or premature as appropriate.

### Example

```text
P5 + tool_call + misselected: the agent used the email tool when the task required searching the ticketing system first.
```

## OP10. `malformed`

### Definition


An artifact fails the required syntactic, structural, boundary, delimiter, type, or machine-readable contract.

### Canonical statement


> The affected artifact was not well-formed according to its required contract.

### Applies to artifacts


output_payload, JSON/XML/YAML/CSV, tool_arguments, code block, citation format, table, delimiter, message boundary.

### Observable signals


- Invalid JSON, extra prose around a payload, wrong delimiter, missing closing tag, or wrong field type.
- Output does not satisfy a parser, schema, API contract, or downstream consumer boundary.
- Generated segments bleed into each other or fail to stop at the required boundary.
- Tool arguments cannot be parsed or validated because the structure is invalid.

### Common product families


P4, P5, P6, P7.

### Typical legacy tags


F17, F18, F21, F43, F52, FF6, FF13.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM6, EM8, EM10, EM11, EM13, EM15.

### Typical Layer 3 controls


L3A4, L3A5, L3C5, L3C7, L3D6, L3X2, L3X3.

### Common confusions


Use corrupted when the structure is valid but exact values are wrong. Use incomplete when required fields are missing but the payload remains parseable. Use distorted when meaning changes through transformation.

### Not this


Do not use malformed for a semantically wrong but syntactically valid payload. Use misselected, corrupted, unsupported, or misinterpreted.

### Example

```text
P4 + output_payload + malformed: the assistant returns natural-language explanation after a JSON object that must be parser-clean.
```

## OP11. `corrupted`

### Definition


An artifact that should have been copied, preserved, compared, transformed symbolically, or emitted exactly was altered.

### Canonical statement


> The affected exact value was changed when it needed to be preserved.

### Applies to artifacts


exact_value, ID, URL, date, number, code token, account number, case name, citation, enum, table cell, tool argument.

### Observable signals


- Identifier, URL, date, number, spelling, enum, or code token is changed.
- Numerical, symbolic, or formal operation produces an invalid value.
- Tool argument contains the right-looking but wrong exact record ID or recipient.
- A structured payload is valid but carries altered values.

### Common product families


P4, P5, P7.

### Typical legacy tags


F19, F20, F21, F43, F52, FF13.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM6, EM7, EM8, EM11, EM13, EM15.

### Typical Layer 3 controls


L3A5, L3A4, L3C5, L3C8, L3C9, L3X1, L3X2.

### Common confusions


Use malformed when syntax or schema is invalid. Use misselected when the system intentionally chose the wrong existing value. Use invented when the value has no source or existence.

### Not this


Do not use corrupted for paraphrase or style variation. Use it only when exact identity, symbolic value, or formal relation matters.

### Example

```text
P5 + tool_arguments + corrupted: the ticket ID `INC-10894` becomes `INC-10984` in the update call.
```

## OP12. `distorted`

### Definition


An artifact preserved an approximate surface or gist, but a summarization, compression, translation, memory rehydration, or transformation changed material meaning.

### Canonical statement


> The affected artifact was transformed in a way that changed its operational meaning.

### Applies to artifacts


summary, context_packet, state_or_memory, evidence, claim set, reasoning_or_plan, translated text, compressed trace.

### Observable signals


- A summary preserves the general topic but drops a binding exception or qualifier.
- Memory rehydration changes a user preference, approval status, or constraint.
- Compression turns a conditional claim into an unconditional one.
- A retrieved or quoted span is paraphrased in a way that changes its legal, policy, or procedural effect.

### Common product families


P1, P2, P3, P5, P7.

### Typical legacy tags


F04, F22, F25, F26, F49, FF11, FF12, FF15.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM3, EM4, EM7, EM8, EM11, EM14.

### Typical Layer 3 controls


L3A3, L3B1, L3B4, L3B5, L3C2, L3C3, L3D6, L3X1.

### Common confusions


Use incomplete when material is simply omitted. Use corrupted for exact-value changes. Use misinterpreted when the artifact was intact but read incorrectly.

### Not this


Do not use distorted for harmless paraphrase. The transformation must alter task-relevant meaning, constraints, or decisions.

### Example

```text
P2 + state_or_memory + distorted: `do not contact legal without approval` is rehydrated as `avoid contacting legal unless necessary`.
```

## OP13. `invented`

### Definition


The system produced an artifact that did not exist in the approved sources, tools, state, or world context relevant to the task.

### Canonical statement


> The affected artifact was fabricated.

### Applies to artifacts


claim, citation_or_source_reference, source, tool_result_interpretation, exact_value, policy basis, external_action prerequisite.

### Observable signals


- Non-existent citation, source, URL, case, document, function, field, database record, or tool result.
- Answer attributes a claim to a source that does not contain it.
- Generated explanation asserts a step, check, approval, or tool result that never happened.
- A concrete fact is created without evidence and cannot be verified.

### Common product families


P3, P4, P5, P6, P7.

### Typical legacy tags


F31, F32, F33, F37, F53, FF3, FF4.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM4, EM5, EM6, EM8, EM10, EM14.

### Typical Layer 3 controls


L3B4, L3B5, L3B6, L3C6, L3C8, L3X1, L3X2.

### Common confusions


Use unsupported when the artifact may exist or may be true but lacks required support. Use corrupted when a real exact value was altered. Use misattributed source cases as invented only if the cited support does not exist or was fabricated.

### Not this


Do not use invented for every false claim. A false claim may be unsupported, misinterpreted, stale, or contaminated without being fabricated as an artifact.

### Example

```text
P3 + citation_or_source_reference + invented: the answer cites a paper title that is not in the retrieval corpus and does not exist.
```

## OP14. `unsupported`

### Definition


An artifact was asserted, recommended, classified, or used without the evidence, proof, trace, source span, or policy basis required by the product context.

### Canonical statement


> The affected artifact lacked the support required for its use.

### Applies to artifacts


claim, recommendation, classification, citation_or_source_reference, policy_decision, tool_call, external_action, confidence_or_uncertainty.

### Observable signals


- Material claim has no source-span support in the provided or approved evidence.
- Recommendation is presented without the required user data, policy basis, or calculation.
- Classification or escalation decision lacks traceable criteria.
- The system continues despite missing support that should cause abstention, retrieval, clarification, or review.

### Common product families


P2, P3, P5, P6, P7.

### Typical legacy tags


F30, F31, F34, F35, F36, FF3, FF4, FF5.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM4, EM5, EM7, EM8, EM9, EM10, EM14.

### Typical Layer 3 controls


L3B4, L3B5, L3B6, L3B7, L3C3, L3C8, L3D2, L3X1.

### Common confusions


Use invented when the support artifact itself was fabricated. Use false only as an evaluation finding, not an operator; a claim can be unsupported even if true. Use premature when the system ended before support could be gathered.

### Not this


Do not use unsupported when the product does not require support for that artifact. Tie the support requirement to task risk, user promise, policy, or downstream action.

### Example

```text
P3 + claim + unsupported: the answer says a customer qualifies for a refund but cites no policy span or transaction evidence.
```

## OP15. `overstated`

### Definition


The system communicated or encoded a stronger level of certainty, completeness, reliability, authority, compliance, or action-readiness than the available evidence and controls warranted.

### Canonical statement


> The affected artifact overstated what was known, verified, safe, complete, or authorized.

### Applies to artifacts


confidence_or_uncertainty, claim, citation_or_source_reference, recommendation, policy_decision, external_action readiness, interaction_behavior.

### Observable signals


- High-confidence language appears despite weak, missing, conflicting, or stale evidence.
- The answer implies exhaustive search, verification, legal certainty, or policy clearance that did not happen.
- A risk-sensitive recommendation is framed as safe or final without required checks.
- The system hides uncertainty, source limitations, or incomplete context from the user.

### Common product families


P3, P5, P6, P7.

### Typical legacy tags


F36, F37, F38, F39, F41, FF5, FF7, FF14.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM4, EM5, EM8, EM9, EM10, EM14, EM15.

### Typical Layer 3 controls


L3B7, L3B5, L3B6, L3C3, L3D1, L3D2, L3X2, L3X3.

### Common confusions


Use unsupported for the evidence gap. Use invented for fabricated evidence. Use unauthorized for permission or policy-basis failure. Use overstated for the communicated strength of the artifact.

### Not this


Do not use overstated merely because the model sounds confident. Use it when confidence, completeness, authority, or safety communication is materially misleading.

### Example

```text
P3 + confidence_or_uncertainty + overstated: the assistant says `this is definitely compliant` after checking only one partial policy excerpt.
```

## OP16. `overgeneralized`

### Definition


The system extended an example, learned pattern, workflow, policy, heuristic, or domain routine beyond the scope where it was valid.

### Canonical statement


> The affected artifact applied a familiar pattern outside its valid operating range.

### Applies to artifacts


task_contract, instruction_set, examples, reasoning_or_plan, policy_decision, route, tool_call, output_payload.

### Observable signals


- An in-context example is treated as exhaustive or extended to a materially different case.
- A common workflow is applied to a rare, regulated, locale-specific, or edge-case scenario.
- The model supplies a familiar answer pattern instead of adapting to the user's actual scope.
- A capability that works on common slices fails on long-tail domains, languages, formats, or risk classes.

### Common product families


P1, P3, P5, P6, P7.

### Typical legacy tags


F13, F23, F27, F46, F47, FF2, FF8, FF12.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM2, EM7, EM8, EM10, EM12, EM13, EM14.

### Typical Layer 3 controls


L3A1, L3A2, L3C3, L3D3, L3D4, L3D5, L3X2, L3X3.

### Common confusions


Use misclassified when the scenario category is wrong. Use misselected when the wrong route/tool/action was chosen. Use unsupported when the generalized output lacks evidence.

### Not this


Do not use overgeneralized for any abstraction. Use it when the extrapolation crosses a task, domain, policy, or operating-boundary limit.

### Example

```text
P7 + task_contract + overgeneralized: a support bot applies the standard refund workflow to a jurisdiction-specific dispute case requiring specialist review.
```

## OP17. `unstable`

### Definition


The system produces materially different outcomes across repeated runs, prompt variants, equivalent contexts, versions, environments, slices, or operational conditions where the product expects invariance.

### Canonical statement


> The affected behavior was unstable under conditions where it should have remained materially equivalent.

### Applies to artifacts


scenario_outcome, final answer, classification, policy_decision, tool_call, tool_arguments, citation choice, external_action, interaction_behavior.

### Observable signals


- Same scenario yields different classifications, refusal decisions, citations, or tool calls.
- Paraphrases with equivalent operational meaning produce materially different outcomes.
- A release change fixes one scenario while regressing adjacent slices.
- Behavior changes under budget, latency, retrieval, or environment variation beyond accepted tolerance.

### Common product families


P1, P2, P3, P5, P6, P7.

### Typical legacy tags


F08, F44, F45, F50, FF1, FF7, FF15.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM1, EM2, EM11, EM12, EM13, EM15.

### Typical Layer 3 controls


L3D5, L3D6, L3D7, L3X2, L3X3, L3X4.

### Common confusions


Use malformed, unsupported, misselected, or unauthorized when the problem is a specific artifact failure in a single run. Use unstable when unacceptable variation across runs or variants is the salient failure.

### Not this


Do not require exact text equality. Natural-language wording may vary while preserving product behavior. Use unstable only for material behavioral variation.

### Example

```text
P7 + policy_decision + unstable: semantically equivalent support requests alternately produce refund approval and human escalation.
```

## OP18. `premature`

### Definition


The system produced an answer, decision, plan, tool call, action, or user-facing commitment before completing required evidence gathering, validation, clarification, approval, or process steps.

### Canonical statement


> The affected behavior was finalized before the product was ready to finalize it.

### Applies to artifacts


claim, recommendation, reasoning_or_plan, tool_call, tool_arguments, external_action, policy_decision, interaction_behavior.

### Observable signals


- The assistant answers before required retrieval, calculation, clarification, or tool execution.
- Agent stops after a plausible intermediate step rather than completing the workflow.
- Decision is emitted before validators, policy checks, source checks, or approval gates run.
- The system commits to a plan or action while known uncertainty remains unresolved.

### Common product families


P1, P3, P5, P6, P7.

### Typical legacy tags


F24, F26, F28, F30, F55, FF9, FF12.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM7, EM8, EM10, EM11, EM14, EM15.

### Typical Layer 3 controls


L3A1, L3C3, L3C7, L3C8, L3D2, L3D4, L3X1, L3X2.

### Common confusions


Use unauthorized when the issue is lack of permission or authority. Use unsupported when the result lacks evidence. Use unrecovered when the system encountered an error and failed to repair or escalate.

### Not this


Do not use premature merely because an output is concise. Use it when a required readiness condition was skipped.

### Example

```text
P5 + reasoning_or_plan + premature: the agent concludes no escalation is needed before checking the policy tool required for high-severity complaints.
```

## OP19. `unauthorized`

### Definition


The system generated, recommended, initiated, or completed behavior requiring authorization, consent, policy clearance, role authority, privacy basis, or safety approval that was not present.

### Canonical statement


> The affected action, disclosure, or decision lacked required authorization.

### Applies to artifacts


external_action, tool_call, tool_arguments, policy_decision, recommendation, disclosure, state update, transaction, interaction_behavior.

### Observable signals


- Write action, email, purchase, record update, escalation, or notification occurs without required confirmation.
- Sensitive information is disclosed without adequate user, role, or policy basis.
- The system recommends an action that policy should have blocked or escalated.
- A tool call crosses from read-only to write/action mode without an authorization gate.

### Common product families


P5, P6, P7.

### Typical legacy tags


F16, F38, F39, F40, F54, FF9, FF14.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM8, EM10, EM13, EM14, EM15.

### Typical Layer 3 controls


L3C8, L3C9, L3D1, L3D2, L3X1, L3X2, L3X5.

### Common confusions


Use premature when readiness checks were skipped but authorization was not the issue. Use misclassified when the system assigned the wrong policy class. Use overstated when action-readiness was merely communicated too strongly.

### Not this


Do not use unauthorized for every bad action. Use it when permission, role, consent, safety, compliance, or policy authority was required and absent or invalid.

### Example

```text
P6 + external_action + unauthorized: an agent sends a cancellation email without explicit user confirmation after drafting it.
```

## OP20. `unrecovered`

### Definition


The system encountered or detected a failure condition but did not retry, repair, abstain, clarify, roll back, route, escalate, or otherwise recover appropriately.

### Canonical statement


> The affected process failed to recover after a recoverable failure condition appeared.

### Applies to artifacts


reasoning_or_plan, tool_result_interpretation, tool_call sequence, output_payload, external_action, policy_decision, recovery path, interaction_behavior.

### Observable signals


- Parser failure, tool error, contradiction, low confidence, or missing evidence is ignored.
- A retry loop repeats the same failure without repair or escalation.
- The agent continues after a failed tool call as if the operation succeeded.
- The system fails open instead of asking clarification, abstaining, routing, or escalating.

### Common product families


P3, P4, P5, P6, P7.

### Typical legacy tags


F28, F29, F43, F53, F55, FF9, FF12.

These tags are examples and search handles, not exact replacements for the operator.

### Typical evaluation methods


EM6, EM7, EM8, EM10, EM11, EM13, EM15.

### Typical Layer 3 controls


L3C7, L3C8, L3C9, L3D2, L3D4, L3X1, L3X3, L3X5.

### Common confusions


Usually use unrecovered as a secondary operator after naming the initial failure, such as malformed + unrecovered or unsupported + unrecovered. Use it as primary only when the recovery path is the main product fault.

### Not this


Do not use unrecovered if no error, uncertainty, contradiction, or missing-input condition was observable or expected to be detected.

### Example

```text
P5 + tool_result_interpretation + unrecovered: a payment API returns an error, but the assistant tells the user the payment was completed.
```

# Operator selection rules

## 1. Choose the affected artifact first


Do not start by asking which operator sounds familiar. Start by locating the artifact that was wrong, absent, misused, unsafe, or unstable.

Useful artifact questions:

```text
Was the task contract wrong?
Was the context packet wrong?
Was the evidence package wrong?
Was the claim wrong?
Was the citation wrong?
Was the confidence expression wrong?
Was the output payload wrong?
Was the exact value wrong?
Was the tool call wrong?
Was the tool argument wrong?
Was the action wrong?
Was the policy decision wrong?
Was the recovery path wrong?
Was the scenario outcome unstable?
```

## 2. Pick one primary operator


The primary operator should identify the most specific artifact-local failure.

Use this priority order when several operators seem plausible:

```text
invented beats unsupported
corrupted beats malformed when structure is valid but exact value is wrong
unauthorized beats premature when permission or policy basis is the core issue
stale beats misweighted when the artifact was obsolete
ignored beats unsupported when the central evidence was present but unused
distorted beats incomplete when transformation changed meaning rather than merely omitting material
unrecovered is usually secondary unless recovery failure is the core defect
```

## 3. Add secondary operators sparingly


Add a secondary operator only when it changes one of these:

- the evaluation method;
- the trace evidence needed;
- the Layer 3 control gap;
- the severity or actionability of the incident;
- the owner who should fix the system.

## 4. Use condition modifiers for operating pressure


Do not inflate the operator vocabulary with conditions such as budget, latency, long context, low observability, or version churn.

Use:

```yaml
primary_operator: incomplete
condition_modifiers:
  - budget_constrained
```


not:

```yaml
primary_operator: budget_constrained
```

## 5. Separate operator from evidence confidence


An incident record should distinguish:

```yaml
primary_operator: unsupported
classification_confidence: medium
```


from:

```yaml
primary_operator: unsupported
secondary_operators:
  - overstated
```


The first says the reviewer is moderately confident in the classification. The second says the system overstated its own confidence or authority.

# Important operator distinctions

## `missing` vs `incomplete` vs `ignored`


Use `missing` when the required artifact was absent.

Use `incomplete` when the artifact was present but partial.

Use `ignored` when the artifact was present and sufficient but not used.

```yaml
artifact: evidence
primary_operator: missing
case: required policy document was not retrieved
```

```yaml
artifact: evidence
primary_operator: incomplete
case: retrieved policy omitted the exception that governed the case
```

```yaml
artifact: evidence
primary_operator: ignored
case: retrieved policy contained the answer but output followed model prior
```

## `ignored` vs `misweighted`


Use `ignored` when the artifact had no material influence.

Use `misweighted` when the artifact influenced the result but at the wrong strength, authority, or priority.

```yaml
artifact: evidence
primary_operator: ignored
case: the official policy was supplied but not applied
```

```yaml
artifact: evidence
primary_operator: misweighted
case: the official policy was considered but outweighed by an informal blog post
```

## `misweighted` vs `misclassified`


Use `misweighted` when the relative priority is wrong.

Use `misclassified` when the role, type, risk class, authority class, or constraint force is wrong.

```yaml
artifact: instruction_set
primary_operator: misweighted
case: user preference outweighed system instruction
```

```yaml
artifact: instruction_set
primary_operator: misclassified
case: soft preference was classified as a hard rule
```

## `contaminated` vs `misinterpreted`


Use `contaminated` when irrelevant, misleading, or untrusted material should not have shaped the artifact.

Use `misinterpreted` when the relevant artifact was trusted and in scope but semantically read incorrectly.

```yaml
artifact: context_packet
primary_operator: contaminated
case: prompt injection inside a retrieved page shaped the answer
```

```yaml
artifact: evidence
primary_operator: misinterpreted
case: source exception was read as applying to the wrong customer type
```

## `malformed` vs `corrupted` vs `distorted`


Use `malformed` for syntax, schema, format, delimiter, or boundary failure.

Use `corrupted` for exact-value or symbolic identity failure.

Use `distorted` for meaning change during summarization, compression, translation, transformation, or memory rehydration.

```yaml
artifact: output_payload
primary_operator: malformed
case: invalid JSON
```

```yaml
artifact: exact_value
primary_operator: corrupted
case: customer ID changed from C-1098 to C-1908
```

```yaml
artifact: state_or_memory
primary_operator: distorted
case: `never contact legal directly` became `avoid unnecessary legal contact`
```

## `invented` vs `unsupported`


Use `invented` when the artifact was fabricated.

Use `unsupported` when the artifact may be true or plausible but lacks the support required in the product context.

```yaml
artifact: citation_or_source_reference
primary_operator: invented
case: cited source does not exist
```

```yaml
artifact: claim
primary_operator: unsupported
case: claim has no source-span support in the supplied evidence
```


A fabricated citation is usually also unsupported, but `invented` is the sharper primary operator.

## `unsupported` vs `overstated`


Use `unsupported` for the evidence basis.

Use `overstated` for communicated certainty, completeness, authority, or safety.

```yaml
artifact: claim
primary_operator: unsupported
```

```yaml
artifact: confidence_or_uncertainty
primary_operator: overstated
```


The same incident may need both when a weakly supported claim is presented as verified or certain.

## `premature` vs `unauthorized`


Use `premature` when the system finalized before enough evidence, validation, clarification, or process completion.

Use `unauthorized` when the system lacked required user permission, policy basis, role authority, privacy basis, or safety clearance.

```yaml
artifact: external_action
primary_operator: premature
case: message drafted before checking the recipient
```

```yaml
artifact: external_action
primary_operator: unauthorized
case: message sent without confirmation
```

## `unrecovered` is usually second-stage


Use `unrecovered` when the system encountered or detected a problem and then failed to recover.

```yaml
primary_operator: malformed
secondary_operators:
  - unrecovered
case: model emitted invalid JSON, parser failed, and the system passed the bad payload downstream
```


The initial failure is `malformed`. The recovery failure is `unrecovered`.

# Common operator combinations


| Incident pattern                                  | Primary operator             | Common secondary operators      |
| ------------------------------------------------- | ---------------------------- | ------------------------------- |
| Fake citation with confident explanation          | `invented`                   | `unsupported`, `overstated`     |
| Retrieved source present but not used             | `ignored`                    | `unsupported`                   |
| Old policy used over new policy                   | `stale`                      | `misweighted`                   |
| Prompt injection in retrieved page changes answer | `contaminated`               | `misclassified`, `unauthorized` |
| Valid JSON with wrong customer ID                 | `corrupted`                  | `misselected`                   |
| Valid JSON with wrong classification label        | `misselected`                | `misclassified`                 |
| Output is not parseable                           | `malformed`                  | `unrecovered`                   |
| Summary drops binding exception                   | `distorted`                  | `incomplete`                    |
| Tool call uses wrong recipient/date/filter        | `corrupted` or `misselected` | `unauthorized` if action-risky  |
| Agent stops before required verification          | `premature`                  | `unsupported`, `unrecovered`    |
| Same case yields different escalation decisions   | `unstable`                   | `misclassified`                 |
| Rare slice gets generic workflow                  | `overgeneralized`            | `misselected`, `unsupported`    |

# Operator-to-evaluation mapping


| Operator | Typical evaluation methods |
|---|---|
| `missing` | EM3 context ablation/insertion, EM6 schema validation, EM8 agent trace evaluation, EM14 human rubric |
| `incomplete` | EM3 context tests, EM4 grounding, EM6 schema validation, EM7 process evaluation, EM11 stress testing, EM14 human rubric |
| `ignored` | EM2 prompt perturbation, EM3 context tests, EM4 grounding, EM8 trace evaluation, EM14 human rubric |
| `misweighted` | EM2 prompt perturbation, EM3 context conflict tests, EM4 grounding, EM10 policy tests, EM13 regression, EM14 human rubric |
| `stale` | EM3 freshness tests, EM8 trace evaluation, EM10 policy tests, EM13 regression, EM15 production monitoring |
| `contaminated` | EM3 context insertion tests, EM8 trace evaluation, EM10 adversarial tests, EM12 slice tests, EM14 human rubric |
| `misclassified` | EM2 prompt perturbation, EM6 schema/label validation, EM8 trace evaluation, EM10 policy tests, EM12 slice tests, EM14 human rubric |
| `misinterpreted` | EM3 context tests, EM4 grounding, EM7 process evaluation, EM8 trace evaluation, EM14 human rubric |
| `misselected` | EM6 schema/enum validation, EM8 trace evaluation, EM10 policy tests, EM12 slice tests, EM13 regression |
| `malformed` | EM6 schema and parser validation, EM8 trace evaluation, EM11 stress testing, EM13 regression, EM15 monitoring |
| `corrupted` | EM6 schema/value validation, EM7 process evaluation, EM8 trace evaluation, EM13 regression |
| `distorted` | EM3 context tests, EM4 grounding, EM7 process evaluation, EM11 stress testing, EM14 human rubric |
| `invented` | EM4 grounding and citation evaluation, EM5 factuality evaluation, EM8 trace evaluation, EM14 human rubric |
| `unsupported` | EM4 grounding, EM5 factuality, EM7 process evaluation, EM8 trace evaluation, EM9 calibration, EM14 human rubric |
| `overstated` | EM4 grounding, EM5 factuality, EM8 trace evaluation, EM9 calibration, EM10 policy tests, EM14 human rubric |
| `overgeneralized` | EM2 prompt perturbation, EM7 process evaluation, EM8 trace evaluation, EM10 policy tests, EM12 slice testing, EM13 regression |
| `unstable` | EM1 repeated-run testing, EM2 prompt perturbation, EM11 stress testing, EM12 slice testing, EM13 regression, EM15 production monitoring |
| `premature` | EM7 process evaluation, EM8 agent trace evaluation, EM10 policy tests, EM11 stress testing, EM14 human rubric |
| `unauthorized` | EM8 agent trace evaluation, EM10 safety and policy testing, EM13 regression, EM14 human rubric, EM15 monitoring |
| `unrecovered` | EM6 parser validation, EM7 process evaluation, EM8 trace evaluation, EM10 policy tests, EM11 stress testing, EM15 monitoring |

# Operator-to-control mapping


| Operator | Typical control direction |
|---|---|
| `missing` | context assembly audits, retrieval coverage checks, required-field gates, approval-presence checks |
| `incomplete` | coverage validators, required-span checks, completeness rubrics, process checkpoints |
| `ignored` | evidence-use checks, source-span requirements, task-contract validators, trace review |
| `misweighted` | instruction hierarchy, source-priority rules, authority metadata, conflict-resolution policy |
| `stale` | freshness metadata, state versioning, cache invalidation, timestamp checks, deployment/version controls |
| `contaminated` | instruction/data isolation, prompt-injection filtering, source sandboxing, evidence packaging |
| `misclassified` | typed task contracts, policy classifiers, risk classifiers, source-role labels, reviewer rubrics |
| `misinterpreted` | tool-result schemas, source-span preservation, semantic validators, human review for high-risk cases |
| `misselected` | routers, allowlists, tool-selection tests, enum validation, action-choice gates |
| `malformed` | schemas, parsers, constrained decoding, output repair, retry loops |
| `corrupted` | exact-match validators, copy mechanisms, ID allowlists, symbolic tools, transaction previews |
| `distorted` | summary-fidelity checks, source-span preservation, memory review, loss-aware compression |
| `invented` | citation existence checks, source allowlists, claim-source validation, tool-result provenance checks |
| `unsupported` | grounding checks, claim verification, abstention rules, required-source gates |
| `overstated` | calibration checks, confidence policy, uncertainty rewriting, source-limitation disclosure |
| `overgeneralized` | slice testing, specialist routing, domain gating, competence-boundary detection |
| `unstable` | repeated-run gates, invariance tests, regression monitoring, slice-level production monitors |
| `premature` | process checkpoints, required-tool gates, completion criteria, clarification requirements |
| `unauthorized` | permission checks, action approval gates, transaction controls, privacy and policy gates |
| `unrecovered` | retry policies, fallback paths, escalation, rollback, fail-closed behavior |

# Anti-patterns

## Anti-pattern 1: using operators as root causes


Bad:

```yaml
root_cause: invented
```


Better:

```yaml
primary_operator: invented
causal_hypotheses:
  - retrieval returned no valid source
  - generation was allowed without citation validation
  - claim-source support check was absent
```

## Anti-pattern 2: using controls as operators


Bad:

```yaml
primary_operator: no_validator
```


Better:

```yaml
primary_operator: malformed
control_gap:
  - no parser validation before downstream handoff
```

## Anti-pattern 3: using impacts as operators


Bad:

```yaml
primary_operator: user_harmed
```


Better:

```yaml
primary_operator: unauthorized
impact: user account was modified incorrectly
```

## Anti-pattern 4: tagging every possible operator


Bad:

```yaml
operators:
  - missing
  - ignored
  - misweighted
  - stale
  - unsupported
  - overstated
  - premature
  - unrecovered
```


Better:

```yaml
primary_operator: stale
secondary_operators:
  - misweighted
```

## Anti-pattern 5: using broad labels as operators


Bad:

```yaml
primary_operator: hallucinated
```


Better:

```yaml
affected_artifact: citation_or_source_reference
primary_operator: invented
secondary_operators:
  - unsupported
```


or:

```yaml
affected_artifact: claim
primary_operator: unsupported
secondary_operators:
  - overstated
```

# Worked examples

## Example 1: fabricated citation

```yaml
product_family: P3 Claim, Grounding, and Epistemic Failure
affected_artifact: citation_or_source_reference
primary_operator: invented
secondary_operators:
  - unsupported
  - overstated
evaluation_methods:
  - EM4
  - EM5
  - EM9
control_gap:
  - L3B5 Claim Grounding and Citation Controls
  - L3B6 Claim Verification Controls
  - L3B7 Confidence Communication Controls
legacy_tags:
  - F33
  - F30
  - F36
  - FF3
  - FF4
  - FF5
```


Debug interpretation:

```text
Do not diagnose this only as hallucination.
The citation artifact was invented.
The claim was unsupported.
The confidence expression was overstated.
The likely control gaps are citation existence checking, claim-source support validation, and confidence communication policy.
```

## Example 2: wrong tool argument

```yaml
product_family: P5 Process, Tool, and Action Failure
affected_artifact: tool_arguments
primary_operator: corrupted
secondary_operators:
  - unauthorized
evaluation_methods:
  - EM6
  - EM8
  - EM10
control_gap:
  - L3C5 Tool Argument Controls
  - L3C8 Action Authorization Controls
legacy_tags:
  - F52
  - F54
  - FF9
  - FF13
  - FF14
```


Debug interpretation:

```text
The tool call may have been structurally valid, but the exact argument was wrong.
If the call could modify external state, authorization and transaction controls also matter.
```

## Example 3: stale state

```yaml
product_family: P2 Context, State, and Evidence Availability Failure
affected_artifact: state_or_memory
primary_operator: stale
secondary_operators:
  - misweighted
evaluation_methods:
  - EM3
  - EM8
  - EM13
  - EM15
control_gap:
  - L3C1 State Persistence Controls
  - L3C2 Memory Rehydration Controls
  - L3B3 Source Authority and Freshness Controls
legacy_tags:
  - F05
  - F04
  - FF11
```


Debug interpretation:

```text
The issue is not only that the system had memory.
The issue is that obsolete memory was treated as current and given operational weight after newer state existed.
```

## Example 4: premature agent completion

```yaml
product_family: P5 Process, Tool, and Action Failure
affected_artifact: reasoning_or_plan
primary_operator: premature
secondary_operators:
  - unsupported
  - unrecovered
evaluation_methods:
  - EM7
  - EM8
control_gap:
  - L3C3 Planning and Process Integrity Controls
  - L3C7 Recovery and Retry Controls
legacy_tags:
  - F28
  - F30
  - F55
  - FF9
  - FF12
```


Debug interpretation:

```text
The agent stopped before required evidence gathering or validation.
The resulting answer lacked support.
If the system had enough signals to know support was missing but continued anyway, recovery also failed.
```

## Example 5: prompt-injection contamination

```yaml
product_family: P6 Policy, Trust, and Interaction Failure
affected_artifact: context_packet
primary_operator: contaminated
secondary_operators:
  - misclassified
  - unauthorized
evaluation_methods:
  - EM3
  - EM8
  - EM10
control_gap:
  - L3A2 Instruction Hierarchy Controls
  - L3B4 Evidence Packaging Controls
  - L3D1 Policy Boundary Controls
  - L3C8 Action Authorization Controls
legacy_tags:
  - F15
  - F16
  - F40
  - F54
  - FF14
```


Debug interpretation:

```text
The retrieved document carried text that should have remained data.
The system treated it as operative instruction or allowed it to affect policy/action behavior.
The fix is not only prompt wording; the system needs instruction/data isolation, source labeling, action gates, and traceability.
```

# Minimal incident label format


For issue titles or dashboards, use:

```text
P-family / artifact / operator / eval / control-gap
```


Examples:

```text
P3 / citation_or_source_reference / invented / EM4 / L3B5
P4 / output_payload / malformed / EM6 / L3A4
P5 / tool_arguments / corrupted / EM8 / L3C5
P6 / external_action / unauthorized / EM10 / L3C8
P7 / scenario_outcome / unstable / EM1 / L3D5
```

# File boundary


This file defines the canonical operator vocabulary.

It should not contain:

- full product family definitions;
- full Layer 1 causal derivations;
- full Layer 3 control records;
- detailed user/business/safety impact taxonomy;
- full evaluation-method definitions;
- a replacement for the legacy `Fxx` inventory.

It should be used with:

```text
product-fault-families.md
classification-views.md
layer-3-control-families.md
fault-inventory.md
fault-family-index.md
```
