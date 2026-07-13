---
draft: false
toc: true
title: "Semantic Fault Family Index"
linkTitle: "Semantic Fault Family Index"
---

Status: proposed standalone semantic/analytical taxonomy.

This document defines semantic fault families for AI-system behavior. It is designed for conceptual diagnosis, evaluation planning, incident analysis, and test-suite design.

The focus is:

```text
What kind of semantic, epistemic, representational, procedural, or pragmatic failure occurred?
```


This document deliberately concentrates on:

- definitions;
- diagnostic questions;
- failure relations;
- examples;
- evaluation methods;
- evaluation scenarios;
- boundary notes.

## Core idea


A semantic fault family should classify the kind of meaning-bearing object that failed.

Examples of meaning-bearing objects:

- task meaning;
- user intent;
- instruction force;
- discourse state;
- source authority;
- evidence relation;
- factual claim;
- citation;
- confidence expression;
- structured output;
- symbolic value;
- reasoning step;
- tool action;
- refusal;
- clarification;
- privacy or authorization boundary;
- user-facing commitment.

A complete classification should not stop at the family name. It should also say how the object failed and how the failure should be evaluated.

Compact form:

```text
semantic family
+ failed object
+ failure relation
+ evaluation method
```


Example:

```yaml
family: SF4 Claim, Truth, and Support Failure
failed_object: citation-backed factual claim
failure_relations:
  - invented
  - unsupported
evaluation_methods:
  - EM4 Grounding and citation evaluation
  - EM5 Truth / factuality evaluation
```

## Classification principles

### 1. Families are not mutually exclusive


One incident may require several semantic family tags.

Example:

```text
A system cites a nonexistent source, states the answer confidently, and refuses to acknowledge uncertainty.
```


Reasonable classification:

```yaml
primary_family: SF4 Claim, Truth, and Support Failure
secondary_families:
  - SF5 Epistemic Posture and Calibration Failure
failure_relations:
  - invented
  - unsupported
  - miscalibrated
```

### 2. Families are not metrics


A metric can help reveal a fault. It is not the fault itself.

Bad classification:

```text
The fault is low accuracy.
```


Better classification:

```text
The fault is an unsupported claim, a source-authority error, or a representation error; accuracy is one measurement signal.
```

### 3. Families are not root causes


This taxonomy classifies observed behavioral and semantic failures. It does not assert why they occurred.

Bad classification:

```text
The root cause is attention failure.
```


Better classification:

```text
The observed failure is context underuse, source misweighting, or unsupported claim generation.
```

### 4. Families are not mitigations


A validator, reviewer, policy engine, parser, citation checker, or monitor may detect or reduce a failure. It should not be treated as the semantic family itself.

Bad classification:

```text
The fault is no validator.
```


Better classification:

```text
The output violated a schema, corrupted a required identifier, or made an unsupported claim.
```

### 5. Separate truth, grounding, and confidence


These are distinct questions:

```text
Truth:
  Is the claim correct?

Grounding:
  Is the claim supported by the evidence the system was allowed to use?

Confidence:
  Does the expressed certainty match the actual support and correctness status?
```


A claim can be true but ungrounded. A claim can be grounded in a supplied source but still require independent factual verification. A claim can be false without being confidently stated. A claim can be true but presented with unjustified certainty.

### 6. Evaluate behavior, not surface wording by default


For natural-language outputs, exact wording usually matters less than behaviorally material properties:

- final decision;
- factual content;
- evidence used;
- citation validity;
- tool choice;
- tool arguments;
- external action;
- refusal or escalation behavior;
- schema validity;
- privacy or authorization status;
- user-facing commitment.

Exact text should be evaluated only when exact text is itself the required artifact.

## Namespaces


This document uses two namespaces.

```text
SF = semantic fault family
EM = evaluation method
```


`SF` codes classify what kind of semantic object failed.

`EM` codes classify how the fault should be detected, reproduced, measured, or compared.

# Master family table


| Code    | Semantic family                                        | Core question                                                                                                                |
| ------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| **SF1** | Task, Intent, and Contract Interpretation Failure      | Did the system infer or preserve the wrong task, intent, scope, constraint, or normative force?                              |
| **SF2** | Context, Discourse, and State Integration Failure      | Did the system fail to preserve, use, update, or integrate relevant context, discourse, memory, or state?                    |
| **SF3** | Source, Evidence, and Authority Failure                | Did the system mishandle provenance, source priority, freshness, trust level, or evidential role?                            |
| **SF4** | Claim, Truth, and Support Failure                      | Did the system produce false, invented, unsupported, or source-unfaithful claims?                                            |
| **SF5** | Epistemic Posture and Calibration Failure              | Did the system misrepresent certainty, verification status, uncertainty, competence, or self-assessment?                     |
| **SF6** | Formal, Symbolic, and Representation Failure           | Did the system corrupt structure, schema, exact strings, numbers, identifiers, code, or formal relations?                    |
| **SF7** | Process, Reasoning, Tool, and Action Integrity Failure | Did a multi-step process, plan, tool call, action, or recovery path fail to preserve correctness?                            |
| **SF8** | Pragmatic, Interaction, and Policy Boundary Failure    | Did the system mishandle refusal, clarification, trust, privacy, authorization, social meaning, or policy-relevant behavior? |

# Failure relations


Failure relations describe how the relevant semantic object failed.

Use one or more failure relations with every family classification.

| Relation | Meaning | Example |
|---|---|---|
| **absent** | Required object was not available. | Required evidence, state, field, or clarification was missing. |
| **ignored** | Object was available but did not influence behavior enough. | A supplied constraint or evidence span was overlooked. |
| **misweighted** | Object received the wrong priority, authority, or normative force. | A weak source outweighed a governing source. |
| **contaminated** | Object was polluted by irrelevant, misleading, hostile, or out-of-scope material. | Distractor context shaped the answer. |
| **misinterpreted** | Object was read, applied, summarized, or inferred from incorrectly. | A source caveat was misunderstood. |
| **stale** | Object was outdated but treated as current. | Old policy, memory, or tool result was used as current. |
| **invented** | Object was fabricated. | Fake citation, fake source, fake tool result, or nonexistent fact. |
| **unsupported** | Claim, action, conclusion, or decision lacked adequate basis. | Recommendation made without evidence. |
| **false** | Claim was untrue. | Plausible but wrong factual statement. |
| **unfaithful** | Output failed to preserve source meaning or evidence relation. | Summary contradicted the cited document. |
| **miscalibrated** | Confidence or uncertainty did not track support or correctness. | High confidence on weak evidence. |
| **misrepresented** | User-facing wording distorted the status, certainty, evidence, action, or boundary condition. | Said an action was completed when it was only drafted. |
| **corrupted** | Exact representation was altered. | ID, number, citation key, code, or JSON field changed. |
| **unstable** | Material behavior varied where it should remain equivalent. | Equivalent prompts produced different escalation decisions. |
| **premature** | System finalized before required evidence, checks, or clarification. | Answered before resolving an ambiguous referent. |
| **unauthorized** | System crossed an authority, privacy, policy, or action boundary. | Sent, disclosed, changed, or recommended without required authority. |
| **unrecovered** | System failed to repair, retry, clarify, abstain, or escalate after failure or uncertainty. | Tool error was ignored and the answer proceeded. |

# Evaluation methods


Evaluation methods describe how to detect, reproduce, measure, or compare the fault.

| Code | Evaluation method | Core question |
|---|---|---|
| **EM1** | Repeated-run testing | Does the same scenario produce acceptably similar behavior across repeated runs? |
| **EM2** | Prompt perturbation / paraphrase testing | Does behavior remain stable under semantically equivalent prompt variation? |
| **EM3** | Context ablation / insertion testing | Does behavior change appropriately when relevant context is removed, added, reordered, buried, contradicted, or diluted? |
| **EM4** | Grounding and citation evaluation | Are generated claims supported by the supplied or approved evidence? |
| **EM5** | Truth / factuality evaluation | Are generated claims true, regardless of whether support was supplied in the current context? |
| **EM6** | Schema and parser validation | Does the output satisfy required syntax, schema, boundary, type, and formatting constraints? |
| **EM7** | Reasoning / process evaluation | Does the generated reasoning or plan preserve constraints, intermediate correctness, and goal alignment? |
| **EM8** | Agent trace evaluation | Are tool choices, tool arguments, intermediate steps, recovery behavior, state transitions, and actions correct? |
| **EM9** | Calibration evaluation | Does expressed confidence or uncertainty track correctness and support? |
| **EM10** | Safety and policy adversarial testing | Does the system preserve required safety, compliance, refusal, escalation, privacy, and authorization behavior? |
| **EM11** | Stress / budget testing | Does behavior degrade under long context, limited output budget, latency pressure, truncation, or task complexity? |
| **EM12** | Distributional slice testing | Does performance hold across domains, languages, formats, user segments, edge cases, and rare task patterns? |
| **EM13** | Regression / diff testing | Did a model, prompt, data, policy, schema, tool, or configuration change introduce new failures? |
| **EM14** | Human-review / rubric evaluation | Does the output satisfy task-specific semantic quality criteria that cannot be fully captured by deterministic checks? |
| **EM15** | Production monitoring / drift evaluation | Does deployed behavior remain within acceptable bounds over time? |

# Family record template


Each family record uses this structure.

```text
## SFx. Family Name

### Definition
What semantic, epistemic, representational, procedural, or pragmatic object fails.

### Core question
The diagnostic question this family answers.

### Failed objects
Meaning-bearing objects typically involved.

### Includes
Common manifestations.

### Common failure relations
Failure relations that commonly pair with this family.

### Examples
Short concrete examples.

### Primary evaluation methods
Evaluation methods usually applied first.

### Evaluation scenario design
How to construct useful tests.

### Observable signals
What to look for in outputs, traces, or reviews.

### Boundary notes
What not to confuse this family with.

### Common overlaps
Other analytical families commonly co-tagged.
```

# SF1. Task, Intent, and Contract Interpretation Failure

## Definition


The system infers, selects, blends, scopes, or preserves the wrong task, user intent, instruction force, constraint status, or success criterion.

This family concerns the interpretation of what the system is supposed to do.

## Core question


> Did the system infer or preserve the wrong task, intent, scope, constraint, or normative force?

## Failed objects


- task meaning;
- user intent;
- requested operation;
- task scope;
- object of action;
- time range;
- audience;
- success criterion;
- hard constraint;
- soft preference;
- example;
- exception;
- clarification condition;
- refusal or escalation precondition.

## Includes


- wrong task inferred from the request;
- task blended with another nearby task;
- scope too broad, too narrow, or assigned to the wrong object;
- examples treated as exhaustive rules;
- examples ignored when they define the task pattern;
- hard constraints treated as optional;
- soft preferences treated as mandatory;
- background notes treated as instructions;
- quoted or untrusted text treated as operative instruction;
- ambiguous referents resolved without enough basis;
- clarification omitted when task interpretation is materially ambiguous.

## Common failure relations


- absent;
- ignored;
- misweighted;
- contaminated;
- misinterpreted;
- unstable;
- premature;
- unauthorized.

## Examples

### Example 1: Wrong task inferred

```text
User request:
  Summarize this support ticket and decide whether it should be escalated.

Observed behavior:
  The system summarizes the ticket but never makes an escalation decision.

Classification:
  family: SF1
  failed_object: task success criterion
  failure_relations: [ignored, misinterpreted]
```

### Example 2: Scope error

```text
User request:
  Compare only the Q4 numbers for Argentina and Chile.

Observed behavior:
  The system compares full-year numbers for all Latin American markets.

Classification:
  family: SF1
  failed_object: scope constraint
  failure_relations: [misinterpreted, ignored]
```

### Example 3: Constraint force error

```text
User request:
  Prefer short answers, but do not omit safety warnings.

Observed behavior:
  The system omits the warning to keep the answer short.

Classification:
  family: SF1
  failed_object: hard-versus-soft requirement distinction
  failure_relations: [misweighted]
```

## Primary evaluation methods


- EM2 Prompt perturbation / paraphrase testing;
- EM14 Human-review / rubric evaluation;
- EM7 Reasoning / process evaluation, when the task must be preserved across steps;
- EM10 Safety and policy adversarial testing, when task interpretation affects refusal, escalation, privacy, or authorization;
- EM13 Regression / diff testing, when task templates or prompts change.

## Evaluation scenario design


Test whether semantically equivalent requests preserve the same task interpretation.

Useful scenario variants:

- paraphrases of the same task;
- different instruction order;
- hard and soft constraints mixed together;
- examples that are illustrative rather than exhaustive;
- examples that define the label space;
- ambiguous referents that require clarification;
- similar tasks with different success criteria;
- quoted text containing non-operative instructions;
- requests where scope is easy to overextend.

## Observable signals


- wrong task performed;
- missing subtask;
- extra task performed;
- wrong scope;
- wrong audience;
- wrong time range;
- wrong output objective;
- constraint dropped;
- constraint over-applied;
- example overfit;
- clarification skipped;
- materially different behavior across equivalent prompts.

## Boundary notes


Do not use SF1 merely because an answer is wrong. Use SF1 when the wrongness comes from task, intent, scope, constraint, example, or contract interpretation.

If the task was correctly understood but required context was missing or misused, use SF2 or SF3.

If the task was understood but the final claim was unsupported or false, use SF4.

If the task was understood but the output representation violated a schema, use SF6.

## Common overlaps


- SF2 Context, Discourse, and State Integration Failure;
- SF6 Formal, Symbolic, and Representation Failure;
- SF7 Process, Reasoning, Tool, and Action Integrity Failure;
- SF8 Pragmatic, Interaction, and Policy Boundary Failure;

# SF2. Context, Discourse, and State Integration Failure

## Definition


The system fails to preserve, reintroduce, update, use, or correctly integrate relevant context, discourse history, memory, or state.

This family concerns continuity and contextual meaning across turns, documents, workflow steps, tool results, or state updates.

## Core question


> Did the system fail to preserve, use, update, or integrate relevant context, discourse, memory, or state?

## Failed objects


- prior turn;
- discourse referent;
- conversation state;
- user preference;
- workflow state;
- memory record;
- retrieved context;
- tool result;
- source excerpt;
- state update;
- context summary;
- compressed state;
- temporal reference;
- unresolved pronoun or deictic expression.

## Includes


- required context absent from the current decision;
- relevant context present but ignored;
- relevant context buried and underused;
- old state treated as current;
- state change not reflected in later behavior;
- prior approval, denial, or constraint lost;
- referent from prior discourse resolved incorrectly;
- context summary distorts important detail;
- compression removes a critical exception;
- tool output not incorporated into later behavior;
- multi-turn task treated as a new independent task.

## Common failure relations


- absent;
- ignored;
- misweighted;
- contaminated;
- misinterpreted;
- stale;
- corrupted;
- unrecovered.

## Examples

### Example 1: Discourse referent lost

```text
Conversation:
  System presents three vendor options.
  User says: "The second one looks best. Make it cheaper."

Observed behavior:
  The system applies the price constraint to the first vendor.

Classification:
  family: SF2
  failed_object: discourse referent
  failure_relations: [misinterpreted]
```

### Example 2: Stale state reliance

```text
Scenario:
  User previously preferred email updates, then changed preference to Slack.

Observed behavior:
  The system continues sending email updates.

Classification:
  family: SF2
  failed_object: user preference state
  failure_relations: [stale]
```

### Example 3: Context compression distortion

```text
Scenario:
  A long contract is summarized before analysis.

Observed behavior:
  The summary omits an exception that changes the answer.

Classification:
  family: SF2
  failed_object: compressed context summary
  failure_relations: [absent, corrupted]
```

## Primary evaluation methods


- EM3 Context ablation / insertion testing;
- EM11 Stress / budget testing;
- EM13 Regression / diff testing;
- EM15 Production monitoring / drift evaluation;
- EM14 Human-review / rubric evaluation, when discourse or state correctness requires judgment.

## Evaluation scenario design


Test whether behavior changes for the right reasons when context is added, removed, reordered, contradicted, buried, compressed, or updated.

Useful scenario variants:

- relevant context present versus absent;
- relevant context placed early, middle, and late;
- high-priority context mixed with distractors;
- stale state versus updated state;
- multi-turn referent resolution;
- tool result used in later generation;
- memory rehydration before and after state change;
- long-context and compressed-context versions;
- tasks with prior approvals, denials, or constraints.

## Observable signals


- failure to use supplied context;
- fallback to generic answer;
- contradiction of prior turn;
- stale preference or state;
- wrong referent;
- forgotten constraint;
- summary-induced omission;
- tool result ignored;
- state update missing from later behavior;
- answer changes incorrectly when irrelevant context is added.

## Boundary notes


Use SF2 for context, discourse, memory, and state integration. Use SF3 when the central issue is source authority, provenance, freshness, or evidential role. Use SF4 when the central issue is the generated claim's truth or support.

## Common overlaps


- SF1 Task, Intent, and Contract Interpretation Failure;
- SF3 Source, Evidence, and Authority Failure;
- SF4 Claim, Truth, and Support Failure;
- SF7 Process, Reasoning, Tool, and Action Integrity Failure;

# SF3. Source, Evidence, and Authority Failure

## Definition


The system mishandles source provenance, trust level, authority, freshness, evidential role, or evidence selection.

This family concerns the status and use of evidence before or while it supports claims, decisions, summaries, or actions.

## Core question


> Did the system mishandle provenance, source priority, freshness, trust level, or evidential role?

## Failed objects


- source;
- citation target;
- evidence span;
- source authority label;
- provenance metadata;
- freshness metadata;
- governing document;
- draft or superseded source;
- retrieved chunk;
- user-provided assertion;
- tool result;
- generated summary used as evidence;
- quotation;
- source conflict.

## Includes


- low-authority source treated as governing;
- user speculation treated as verified fact;
- generated summary treated as source evidence;
- stale source treated as current;
- retrieved distractor treated as relevant evidence;
- wrong source span selected;
- source caveat ignored;
- unofficial document treated as policy;
- quoted text treated as endorsed by the current speaker;
- source conflict resolved by salience rather than authority;
- evidence that should be excluded treated as admissible.

## Common failure relations


- misweighted;
- contaminated;
- misinterpreted;
- stale;
- ignored;
- unsupported;
- unfaithful;
- absent.

## Examples

### Example 1: Wrong authority

```text
Scenario:
  The context contains an official policy and a user comment criticizing that policy.

Observed behavior:
  The system follows the user comment as if it were the official policy.

Classification:
  family: SF3
  failed_object: source authority
  failure_relations: [misweighted]
```

### Example 2: Stale evidence

```text
Scenario:
  Search results include a current price table and an older cached table.

Observed behavior:
  The system uses the older table without noting that it was superseded.

Classification:
  family: SF3
  failed_object: source freshness
  failure_relations: [stale, misweighted]
```

### Example 3: Distractor evidence

```text
Scenario:
  Retrieved chunks include two people with similar names.

Observed behavior:
  The answer mixes details from the wrong person into the target person’s profile.

Classification:
  family: SF3
  failed_object: selected evidence span
  failure_relations: [contaminated, misinterpreted]
```

## Primary evaluation methods


- EM3 Context ablation / insertion testing;
- EM4 Grounding and citation evaluation;
- EM5 Truth / factuality evaluation, when source failures produce factual claims;
- EM13 Regression / diff testing, when source selection or retrieval changes;
- EM15 Production monitoring / drift evaluation, when source freshness or corpus drift matters.

## Evaluation scenario design


Construct scenarios with explicit source conflicts, provenance differences, freshness differences, and distractors.

Useful scenario variants:

- official source versus unofficial commentary;
- current source versus stale source;
- source text versus generated summary;
- verified fact versus user speculation;
- two similar entities;
- quotation versus endorsement;
- retrieved relevant chunk versus semantically similar distractor;
- source caveat included versus omitted;
- high-authority source buried behind lower-authority material.

## Observable signals


- citation to wrong source;
- claim based on low-authority source;
- stale source used as current;
- source caveat omitted;
- distractor facts mixed in;
- generated summary treated as primary evidence;
- conflict resolved incorrectly;
- unsupported source priority in explanation;
- answer changes incorrectly when distractor evidence is inserted.

## Boundary notes


Use SF3 when the issue is evidence status, authority, provenance, source priority, or freshness.

Use SF4 when the issue is the generated claim's truth, support, or entailment relation.

Use SF2 when the evidence was simply missing from the usable context.

Use SF5 when the answer misstates how certain, verified, or reliable the evidence is.

## Common overlaps


- SF2 Context, Discourse, and State Integration Failure;
- SF4 Claim, Truth, and Support Failure;
- SF5 Epistemic Posture and Calibration Failure;

# SF4. Claim, Truth, and Support Failure

## Definition


The system produces claims, explanations, justifications, citations, or conclusions that are false, invented, unsupported, not entailed by evidence, or unfaithful to the cited source.

This family concerns the relation between generated propositions and truth or evidential support.

## Core question


> Did the system produce false, invented, unsupported, or source-unfaithful claims?

## Failed objects


- factual claim;
- causal claim;
- legal claim;
- medical claim;
- policy claim;
- numerical claim;
- explanation;
- citation;
- source reference;
- quote;
- summary statement;
- recommendation basis;
- conclusion;
- answer justification.

## Includes


- unsupported assertion;
- plausible but false claim;
- fabricated citation;
- fabricated source;
- real citation that does not support the claim;
- non-grounded justification;
- source-unfaithful summary;
- evidence-claim mismatch;
- learned prior overriding supplied evidence;
- conclusion stronger than evidence permits;
- false quote;
- invented legal, scientific, financial, or product fact;
- answer that should abstain because support is missing.

## Common failure relations


- invented;
- unsupported;
- false;
- unfaithful;
- misinterpreted;
- misweighted;
- stale;
- miscalibrated.

## Examples

### Example 1: Fabricated citation

```text
Observed behavior:
  The system cites a legal case that does not exist.

Classification:
  family: SF4
  failed_object: citation
  failure_relations: [invented, unsupported]
```

### Example 2: Source exists but does not support the claim

```text
Observed behavior:
  The answer cites a product manual as support for a warranty claim, but the cited page discusses installation only.

Classification:
  family: SF4
  failed_object: claim-source support relation
  failure_relations: [unsupported, unfaithful]
```

### Example 3: Plausible false claim

```text
Observed behavior:
  The system gives a plausible historical date that is wrong.

Classification:
  family: SF4
  failed_object: factual claim
  failure_relations: [false]
```

### Example 4: True but ungrounded claim

```text
Observed behavior:
  The answer contains a true statement, but the approved evidence supplied for the task does not support it.

Classification:
  family: SF4
  failed_object: evidence-supported claim
  failure_relations: [unsupported]
```

## Primary evaluation methods


- EM4 Grounding and citation evaluation;
- EM5 Truth / factuality evaluation;
- EM9 Calibration evaluation, when certainty language is attached;
- EM14 Human-review / rubric evaluation, when entailment or task-specific support requires expert judgment;
- EM13 Regression / diff testing, when answer quality changes after updates.

## Evaluation scenario design


Separate truth tests from grounding tests.

Useful scenario variants:

- claim with supporting evidence;
- claim with related but non-supporting evidence;
- claim with no evidence;
- true claim absent from approved sources;
- false claim present in a distractor source;
- source caveat that weakens the conclusion;
- fabricated-citation traps;
- citation exists but page/span mismatch;
- answer that should abstain when support is missing.

## Observable signals


- unsupported claim;
- false claim;
- citation does not exist;
- citation exists but does not support claim;
- cited span contradicts answer;
- source caveat omitted;
- explanation exceeds evidence;
- answer states inference as fact;
- answer fails to abstain when evidence is insufficient;
- high confidence attached to weak support.

## Boundary notes


Do not collapse truth into grounding.

Use truth evaluation to test whether claims are correct. Use grounding evaluation to test whether claims are supported by the evidence allowed for the task.

Use SF3 when the main issue is which source was selected or trusted. Use SF5 when the main issue is how certainty, verification, or uncertainty was communicated.

## Common overlaps


- SF3 Source, Evidence, and Authority Failure;
- SF5 Epistemic Posture and Calibration Failure;
- SF6 Formal, Symbolic, and Representation Failure, when claims are encoded in structured output;

# SF5. Epistemic Posture and Calibration Failure

## Definition


The system misrepresents certainty, uncertainty, verification status, competence, evidence strength, or self-assessment.

This family concerns the stance the system takes toward its own output.

## Core question


> Did the system misrepresent certainty, verification status, uncertainty, competence, or self-assessment?

## Failed objects


- confidence statement;
- uncertainty statement;
- verification claim;
- self-assessment;
- caveat;
- evidence-strength label;
- competence claim;
- abstention decision;
- recommendation strength;
- risk statement;
- user-facing assurance;
- "I checked" or "verified" claim.

## Includes


- high confidence despite weak evidence;
- over-hedging despite strong evidence;
- claiming to have verified without independent verification;
- self-evaluation treated as proof;
- competence overclaim;
- failure to signal uncertainty;
- failure to state source limitations;
- answer presents a guess as fact;
- answer presents a derived inference as directly observed;
- confidence language inconsistent with citation status;
- refusing to answer because uncertainty is overstated;
- asserting safety, legality, or correctness without sufficient basis.

## Common failure relations


- miscalibrated;
- unsupported;
- misrepresented;
- invented;
- false;
- unstable;
- premature;
- unrecovered.

## Examples

### Example 1: False verification claim

```text
Observed behavior:
  The system says "I verified this in the source" even though no source check was performed.

Classification:
  family: SF5
  failed_object: verification claim
  failure_relations: [unsupported, misrepresented]
```

### Example 2: Overconfidence

```text
Observed behavior:
  The system states a medical recommendation with certainty despite conflicting evidence.

Classification:
  family: SF5
  failed_object: confidence expression
  failure_relations: [miscalibrated]
```

### Example 3: Self-check misuse

```text
Observed behavior:
  The system says the answer is correct because it reviewed its own reasoning.

Classification:
  family: SF5
  failed_object: self-assessment
  failure_relations: [unsupported]
```

### Example 4: Over-hedging

```text
Observed behavior:
  The system refuses to make a straightforward source-supported statement and says it cannot determine the answer.

Classification:
  family: SF5
  failed_object: uncertainty expression
  failure_relations: [miscalibrated]
```

## Primary evaluation methods


- EM9 Calibration evaluation;
- EM5 Truth / factuality evaluation;
- EM4 Grounding and citation evaluation;
- EM1 Repeated-run testing, when confidence varies across equivalent runs;
- EM14 Human-review / rubric evaluation, when appropriate uncertainty is task-specific.

## Evaluation scenario design


Compare confidence or uncertainty expressions with known correctness and evidence support.

Useful scenario variants:

- correct answer with strong evidence;
- correct answer with weak evidence;
- false answer with plausible evidence;
- unsupported answer;
- conflicting evidence;
- known unknown where abstention is appropriate;
- source-supported answer where over-hedging is harmful;
- high-risk recommendation requiring careful uncertainty;
- repeated runs to measure confidence variance.

## Observable signals


- confidence does not track correctness;
- confidence does not track evidence support;
- verification claimed without verification evidence;
- uncertainty omitted;
- uncertainty overstated;
- self-check presented as independent proof;
- source limitation not disclosed;
- misleading assurance;
- inconsistent confidence across equivalent scenarios.

## Boundary notes


Use SF5 for epistemic stance. Use SF4 for the claim's truth or support. Use SF8 when misleading stance materially affects refusal, safety, privacy, authorization, or user trust interaction.

A statement can be correct but overconfident, incorrect but appropriately hedged, or unsupported but weakly stated. Keep these distinctions separate.

## Common overlaps


- SF3 Source, Evidence, and Authority Failure;
- SF4 Claim, Truth, and Support Failure;
- SF8 Pragmatic, Interaction, and Policy Boundary Failure;

# SF6. Formal, Symbolic, and Representation Failure

## Definition


The system corrupts or violates required form, structure, schema, exactness, symbolic relations, numerical correctness, code semantics, identifier integrity, or machine-readable representation.

This family concerns outputs whose correctness depends on formal or exact representation.

## Core question


> Did the system corrupt structure, schema, exact strings, numbers, identifiers, code, or formal relations?

## Failed objects


- JSON object;
- XML, YAML, CSV, SQL, or other structured output;
- schema field;
- enum value;
- type;
- delimiter;
- table;
- identifier;
- URL;
- citation key;
- account ID;
- date;
- number;
- mathematical expression;
- formula;
- code snippet;
- exact quote;
- copied string;
- parser boundary;
- serialized tool payload.

## Includes


- invalid JSON or malformed structured output;
- missing required field;
- wrong field name;
- wrong type;
- syntactically valid structure with wrong field semantics;
- enum value outside allowed set;
- extra prose around machine-readable output;
- incorrect delimiter or boundary;
- premature stop or overrun;
- exact string mutated;
- ID or URL corrupted;
- number, count, or comparison wrong;
- formula or code transformed incorrectly;
- table column shifted;
- unit conversion error;
- schema-valid output with wrong meaning.

## Common failure relations


- absent;
- corrupted;
- misinterpreted;
- false;
- unsupported;
- premature;
- unstable.

## Examples

### Example 1: Valid JSON with wrong meaning

```text
Observed behavior:
  The output is valid JSON, but the field "refund_eligible" is true when the source says the customer is not eligible.

Classification:
  family: SF6
  failed_object: structured field semantics
  failure_relations: [false, corrupted]
```

### Example 2: Identifier corruption

```text
Observed behavior:
  The system copies account ID AC-019883 as AC-018983.

Classification:
  family: SF6
  failed_object: exact identifier
  failure_relations: [corrupted]
```

### Example 3: Numeric fragility

```text
Observed behavior:
  The system compares two prices and selects the higher price as the cheaper option.

Classification:
  family: SF6
  failed_object: numeric comparison
  failure_relations: [false, misinterpreted]
```

### Example 4: Boundary failure

```text
Observed behavior:
  The system emits a JSON object followed by explanatory prose, causing the parser to fail.

Classification:
  family: SF6
  failed_object: output boundary
  failure_relations: [corrupted]
```

## Primary evaluation methods


- EM6 Schema and parser validation;
- EM5 Truth / factuality evaluation, for numeric, symbolic, or semantic field correctness;
- EM11 Stress / budget testing, when truncation or output limits affect representation;
- EM13 Regression / diff testing;
- EM14 Human-review / rubric evaluation, when semantic field correctness cannot be checked deterministically.

## Evaluation scenario design


Use deterministic checks where possible. Add semantic review only for fields whose correctness requires interpretation.

Useful scenario variants:

- strict schema validation;
- malformed output traps;
- missing required fields;
- wrong types and enums;
- exact-copy fields;
- IDs, URLs, dates, and codes;
- numeric comparisons;
- unit conversions;
- tables with aligned columns;
- source-to-structure extraction;
- long outputs that risk truncation;
- parser-only pass versus semantic-field pass.

## Observable signals


- parser failure;
- schema validation failure;
- wrong field value;
- field omitted;
- extra field;
- exact string mutation;
- numeric error;
- table misalignment;
- code does not run;
- invalid reference;
- truncation;
- parser-valid but semantically wrong structure.

## Boundary notes


Do not treat schema validity as semantic correctness. A valid structure can still encode the wrong meaning.

Use SF6 for representation, exactness, schema, symbolic, and formal failures. Add SF4 when the represented claim is false or unsupported. Add SF7 when the representation is part of a tool call, action, or multi-step process.

## Common overlaps


- SF1 Task, Intent, and Contract Interpretation Failure;
- SF4 Claim, Truth, and Support Failure;
- SF7 Process, Reasoning, Tool, and Action Integrity Failure;

# SF7. Process, Reasoning, Tool, and Action Integrity Failure

## Definition


A multi-step reasoning chain, plan, procedure, tool interaction, state transition, external action, or recovery path fails to preserve the task, constraints, evidence, state, or correctness conditions.

This family concerns behavior where correctness depends on process integrity, not only final answer text.

## Core question


> Did a multi-step process, plan, tool call, action, or recovery path fail to preserve correctness?

## Failed objects


- reasoning step;
- intermediate assumption;
- invariant;
- plan;
- decomposition;
- subtask;
- step ordering;
- tool choice;
- tool argument;
- tool output interpretation;
- state transition;
- action proposal;
- external action;
- retry;
- recovery path;
- loop termination;
- human handoff package.

## Includes


- locally plausible answer drifts from global objective;
- early false assumption locks in later answer;
- small errors accumulate across steps;
- global constraint lost during reasoning;
- plan drifts from original goal;
- task decomposed into invalid subtasks;
- final answer produced before enough checking;
- loop or repeated step;
- wrong tool selected;
- needed tool skipped;
- tool arguments malformed or semantically wrong;
- tool result misread;
- tool error treated as success;
- action proposed before evidence, authorization, or reversibility is checked;
- failure to retry, repair, clarify, abstain, or escalate after uncertainty or error.

## Common failure relations


- absent;
- ignored;
- misinterpreted;
- corrupted;
- unsupported;
- premature;
- unauthorized;
- unrecovered;
- unstable.

## Examples

### Example 1: Plan drift

```text
Observed behavior:
  The system starts by planning to compare two vendors, then gradually turns the task into a generic vendor-selection checklist.

Classification:
  family: SF7
  failed_object: plan trajectory
  failure_relations: [misinterpreted, unstable]
```

### Example 2: Tool argument error

```text
Observed behavior:
  The system calls a calendar tool with the wrong event ID even though the correct event was visible in the prior step.

Classification:
  family: SF7
  failed_object: tool argument
  failure_relations: [corrupted, misinterpreted]
```

### Example 3: Premature finalization

```text
Observed behavior:
  The system recommends a financial option before checking the user’s stated risk constraint.

Classification:
  family: SF7
  failed_object: process checkpoint
  failure_relations: [premature, ignored]
```

### Example 4: Recovery failure

```text
Observed behavior:
  A tool returns an error, but the system proceeds as if the tool succeeded.

Classification:
  family: SF7
  failed_object: recovery path
  failure_relations: [unrecovered, misinterpreted]
```

## Primary evaluation methods


- EM7 Reasoning / process evaluation;
- EM8 Agent trace evaluation;
- EM6 Schema and parser validation, for tool payloads and structured intermediate artifacts;
- EM10 Safety and policy adversarial testing, when external action, privacy, or authorization is involved;
- EM11 Stress / budget testing, when long or complex processes are likely to degrade;
- EM13 Regression / diff testing;
- EM15 Production monitoring / drift evaluation.

## Evaluation scenario design


Evaluate traces, not only final answers, when process correctness matters.

Useful scenario variants:

- multi-step problems with required invariants;
- tasks where a plausible decomposition is wrong;
- tool choice among similar tools;
- malformed, missing, stale, or adversarial tool outputs;
- tool error and timeout cases;
- required retry or repair;
- state transition correctness;
- action preconditions;
- reversible versus irreversible actions;
- long workflows with opportunities for drift;
- final answer correct but process unsafe.

## Observable signals


- missing step;
- wrong step order;
- invalid decomposition;
- dropped invariant;
- compounded intermediate error;
- wrong tool;
- wrong tool argument;
- tool output misread;
- tool failure ignored;
- loop;
- premature final answer;
- action without readiness;
- no recovery after detected error;
- final answer acceptable but trace invalid.

## Boundary notes


Final answer quality does not prove process quality.

Use SF7 when the failure depends on steps, plans, tool use, state transition, action, or recovery.

Use SF1 when the process failed because the task was misinterpreted at the start. Use SF6 when the main issue is formal payload representation. Use SF8 when authorization, privacy, refusal, escalation, or policy boundary is central.

## Common overlaps


- SF1 Task, Intent, and Contract Interpretation Failure;
- SF2 Context, Discourse, and State Integration Failure;
- SF4 Claim, Truth, and Support Failure;
- SF6 Formal, Symbolic, and Representation Failure;
- SF8 Pragmatic, Interaction, and Policy Boundary Failure;

# SF8. Pragmatic, Interaction, and Policy Boundary Failure

## Definition


The system mishandles the pragmatic, social, safety, privacy, authorization, refusal, clarification, escalation, or user-facing trust boundary of the interaction.

This family concerns what the system is doing with the response in context, not only what literal content it emits.

## Core question


> Did the system mishandle refusal, clarification, trust, privacy, authorization, social meaning, or policy-relevant behavior?

## Failed objects


- refusal decision;
- allowed/disallowed behavior distinction;
- clarification decision;
- escalation decision;
- privacy boundary;
- authorization state;
- user consent;
- safety warning;
- sensitive data;
- interaction tone;
- persona;
- detail level;
- user-facing commitment;
- implied promise;
- social stance;
- recommendation strength;
- safe alternative;
- handoff instruction.

## Includes


- refusing an allowed request;
- complying with a disallowed or unsafe request;
- giving unsafe instructions;
- leaking sensitive information;
- proceeding without authorization;
- failing to ask clarification when ambiguity is material;
- asking unnecessary clarification when the task is clear;
- sycophantic agreement with a false, harmful, or unsupported premise;
- misleading reassurance;
- unsafe or unsupported recommendation posture;
- tone inappropriate for product, risk, or user state;
- verbosity or detail level that changes safety or usefulness;
- inconsistent refusal or escalation behavior across equivalent cases;
- safe alternative that still enables the disallowed outcome.

## Common failure relations


- unauthorized;
- contaminated;
- ignored;
- misweighted;
- misinterpreted;
- miscalibrated;
- misrepresented;
- unstable;
- premature;
- unrecovered.

## Examples

### Example 1: Under-refusal

```text
Observed behavior:
  The system gives operational instructions for a clearly disallowed harmful request.

Classification:
  family: SF8
  failed_object: refusal boundary
  failure_relations: [unauthorized, misweighted]
```

### Example 2: Over-refusal

```text
Observed behavior:
  The system refuses a benign request because it superficially resembles a risky category.

Classification:
  family: SF8
  failed_object: allowed/disallowed distinction
  failure_relations: [misinterpreted]
```

### Example 3: Clarification failure

```text
Observed behavior:
  The user says "send it to Alex," and there are multiple plausible Alexes and multiple candidate attachments. The system proceeds without asking.

Classification:
  family: SF8
  failed_object: clarification condition
  failure_relations: [premature, unauthorized]
```

### Example 4: Privacy boundary failure

```text
Observed behavior:
  The system includes personal data from one user’s record in another user’s answer.

Classification:
  family: SF8
  failed_object: privacy boundary
  failure_relations: [unauthorized]
```

### Example 5: Sycophantic agreement

```text
Observed behavior:
  The user asserts a false premise and asks the system to confirm it. The system agrees instead of correcting or qualifying it.

Classification:
  family: SF8
  failed_object: interactional stance
  failure_relations: [misrepresented, unsupported]
```

## Primary evaluation methods


- EM10 Safety and policy adversarial testing;
- EM14 Human-review / rubric evaluation;
- EM2 Prompt perturbation / paraphrase testing;
- EM1 Repeated-run testing, when refusal or escalation should be stable;
- EM8 Agent trace evaluation, when tools or external actions are involved;
- EM9 Calibration evaluation, when confidence or uncertainty affects trust;
- EM13 Regression / diff testing;
- EM15 Production monitoring / drift evaluation.

## Evaluation scenario design


Construct boundary tests, not only obvious allowed and disallowed examples.

Useful scenario variants:

- clearly allowed request;
- clearly disallowed request;
- adjacent but allowed request;
- ambiguous request requiring clarification;
- risky request requiring escalation;
- prompt-injection-like content inside untrusted text;
- privacy-sensitive data access;
- action requiring confirmation;
- user false premise;
- emotionally loaded request;
- equivalent requests with different tone;
- safe alternative that must not preserve harmful operational detail.

## Observable signals


- over-refusal;
- under-refusal;
- unsafe compliance;
- privacy leak;
- missing clarification;
- unnecessary clarification;
- missing escalation;
- action without consent;
- sycophantic agreement;
- inconsistent policy behavior;
- misleading reassurance;
- unsafe safe-completion;
- product-tone mismatch;
- user-facing commitment without authority.

## Boundary notes


Use SF8 when the failure concerns pragmatic effect, user interaction, refusal, clarification, escalation, safety, privacy, authorization, or trust.

Do not use SF8 for every stylistically imperfect response. Use it when the interaction behavior materially changes task safety, user trust, policy correctness, privacy, authorization, or escalation.

Use SF5 when the central issue is confidence or uncertainty. Use SF7 when the central issue is process, tool, action, or recovery. Use SF1 when policy behavior failed because the task was misinterpreted.

## Common overlaps


- SF1 Task, Intent, and Contract Interpretation Failure;
- SF4 Claim, Truth, and Support Failure;
- SF5 Epistemic Posture and Calibration Failure;
- SF7 Process, Reasoning, Tool, and Action Integrity Failure;

# Evaluation-method selection guide


Use this section to choose evaluation methods for a classified fault.

## If behavior varies across repeated runs


Start with:

```text
EM1 Repeated-run testing
```


Then add:

```text
EM13 Regression / diff testing
EM10 Safety and policy adversarial testing, if rare failures are high-risk
EM15 Production monitoring / drift evaluation, if the failure is deployed
```

## If behavior changes after harmless wording changes


Start with:

```text
EM2 Prompt perturbation / paraphrase testing
```


Then add:

```text
EM14 Human-review / rubric evaluation
EM13 Regression / diff testing
```

## If the failure concerns context, memory, state, or discourse


Start with:

```text
EM3 Context ablation / insertion testing
```


Then add:

```text
EM11 Stress / budget testing, if context length or compression matters
EM14 Human-review / rubric evaluation, if discourse interpretation is semantic
EM15 Production monitoring / drift evaluation, if state drift appears in deployment
```

## If the failure concerns evidence, sources, or authority


Start with:

```text
EM3 Context ablation / insertion testing
EM4 Grounding and citation evaluation
```


Then add:

```text
EM5 Truth / factuality evaluation, if claims are factual
EM13 Regression / diff testing, if retrieval or source selection changed
EM15 Production monitoring / drift evaluation, if source freshness changes over time
```

## If the failure concerns factual correctness


Start with:

```text
EM5 Truth / factuality evaluation
```


Then add:

```text
EM4 Grounding and citation evaluation, if the product requires evidence-backed answers
EM9 Calibration evaluation, if confidence language matters
EM14 Human-review / rubric evaluation, if expert judgment is needed
```

## If the failure concerns grounding or citation support


Start with:

```text
EM4 Grounding and citation evaluation
```


Then add:

```text
EM3 Context ablation / insertion testing
EM5 Truth / factuality evaluation
EM13 Regression / diff testing
```

## If the failure concerns confidence, verification, or uncertainty


Start with:

```text
EM9 Calibration evaluation
```


Then add:

```text
EM5 Truth / factuality evaluation
EM4 Grounding and citation evaluation
EM1 Repeated-run testing, if confidence varies across runs
EM14 Human-review / rubric evaluation, if uncertainty is context-sensitive
```

## If the failure concerns output structure, exactness, or symbolic correctness


Start with:

```text
EM6 Schema and parser validation
```


Then add:

```text
EM5 Truth / factuality evaluation, if values or symbolic claims must be correct
EM11 Stress / budget testing, if truncation or output length matters
EM14 Human-review / rubric evaluation, if field semantics require judgment
```

## If the failure concerns reasoning or process integrity


Start with:

```text
EM7 Reasoning / process evaluation
```


Then add:

```text
EM8 Agent trace evaluation, if tools, state, or actions are involved
EM11 Stress / budget testing, if process length or complexity matters
EM13 Regression / diff testing, if workflow logic changed
```

## If the failure concerns tool use, state transitions, recovery, or external action


Start with:

```text
EM8 Agent trace evaluation
```


Then add:

```text
EM6 Schema and parser validation, for tool arguments or payloads
EM10 Safety and policy adversarial testing, for authorization or high-risk action
EM15 Production monitoring / drift evaluation, for deployed tool failure rates
```

## If the failure concerns refusal, safety, privacy, authorization, or escalation


Start with:

```text
EM10 Safety and policy adversarial testing
```


Then add:

```text
EM14 Human-review / rubric evaluation
EM2 Prompt perturbation / paraphrase testing
EM1 Repeated-run testing
EM8 Agent trace evaluation, if action or tools are involved
EM13 Regression / diff testing, if policy behavior changed
```

## If the failure appears only in certain domains, languages, formats, or rare cases


Start with:

```text
EM12 Distributional slice testing
```


Then add the method corresponding to the family:

```text
EM5 for factuality
EM4 for grounding
EM6 for structure
EM8 for tool/action traces
EM10 for safety and policy
EM14 for semantic quality
```

## If the failure appears after a change


Start with:

```text
EM13 Regression / diff testing
```


Then add the method corresponding to the observed regression:

```text
EM2 for prompt-fragility regressions
EM4 for grounding regressions
EM6 for schema regressions
EM8 for tool-use regressions
EM10 for safety regressions
EM12 for slice regressions
EM15 for deployed drift
```

# Example classifications

## Example 1: Nonexistent source with high confidence

```yaml
scenario: source_grounded_question_answering
observed_behavior: system cites a nonexistent report and says the answer is verified
expected_behavior: cite only existing approved sources or state that support is unavailable

primary_family: SF4 Claim, Truth, and Support Failure
secondary_families:
  - SF5 Epistemic Posture and Calibration Failure

failed_objects:
  - citation
  - verification claim
  - factual claim

failure_relations:
  - invented
  - unsupported
  - miscalibrated

analytical_views:

evaluation_methods:
  - EM4 Grounding and citation evaluation
  - EM5 Truth / factuality evaluation
  - EM9 Calibration evaluation
```

## Example 2: Ambiguous action request proceeds without clarification

```yaml
scenario: assistant_action_request
observed_behavior: user says "send it to Alex" and the system sends the wrong file to the wrong Alex
expected_behavior: ask for clarification before sending

primary_family: SF8 Pragmatic, Interaction, and Policy Boundary Failure
secondary_families:
  - SF1 Task, Intent, and Contract Interpretation Failure
  - SF7 Process, Reasoning, Tool, and Action Integrity Failure

failed_objects:
  - discourse referent
  - clarification condition
  - external action
  - recipient identity

failure_relations:
  - misinterpreted
  - premature
  - unauthorized

analytical_views:

evaluation_methods:
  - EM8 Agent trace evaluation
  - EM10 Safety and policy adversarial testing
  - EM14 Human-review / rubric evaluation
```

## Example 3: Valid structure with wrong semantic field

```yaml
scenario: structured_extraction
observed_behavior: output JSON is valid but marks a contract as auto-renewing when the source says renewal is manual
expected_behavior: valid JSON whose field values match the source

primary_family: SF6 Formal, Symbolic, and Representation Failure
secondary_families:
  - SF4 Claim, Truth, and Support Failure

failed_objects:
  - schema field
  - source-supported extracted value

failure_relations:
  - false
  - unfaithful

analytical_views:

evaluation_methods:
  - EM6 Schema and parser validation
  - EM4 Grounding and citation evaluation
  - EM14 Human-review / rubric evaluation
```

## Example 4: Long-context loss of exception

```yaml
scenario: long_document_summarization
observed_behavior: answer omits a buried exception that reverses the conclusion
expected_behavior: preserve all exceptions that affect the answer

primary_family: SF2 Context, Discourse, and State Integration Failure
secondary_families:
  - SF4 Claim, Truth, and Support Failure

failed_objects:
  - buried source exception
  - answer conclusion

failure_relations:
  - ignored
  - unsupported

analytical_views:

evaluation_methods:
  - EM3 Context ablation / insertion testing
  - EM4 Grounding and citation evaluation
  - EM11 Stress / budget testing
```

## Example 5: Stable task, unstable refusal

```yaml
scenario: policy_boundary_test
observed_behavior: semantically equivalent prompts produce alternating refusal and compliance
expected_behavior: materially equivalent requests receive the same policy behavior

primary_family: SF8 Pragmatic, Interaction, and Policy Boundary Failure
secondary_families:
  - SF1 Task, Intent, and Contract Interpretation Failure

failed_objects:
  - refusal decision
  - task interpretation

failure_relations:
  - unstable
  - misinterpreted

analytical_views:

evaluation_methods:
  - EM1 Repeated-run testing
  - EM2 Prompt perturbation / paraphrase testing
  - EM10 Safety and policy adversarial testing
```

# Short rule of thumb


Use semantic families to name what semantic object failed:

```text
task meaning
context or state
source authority
evidence support
claim truth
confidence posture
formal representation
process integrity
pragmatic or policy boundary
```


Use failure relations to say how it failed:

```text
absent
ignored
misweighted
contaminated
misinterpreted
stale
invented
unsupported
false
unfaithful
miscalibrated
misrepresented
corrupted
unstable
premature
unauthorized
unrecovered
```


Use evaluation methods to say how to reveal it:

```text
repeated runs
paraphrase tests
context ablations
grounding checks
truth checks
schema validation
process review
agent trace review
calibration evaluation
safety and policy tests
stress tests
slice tests
regression tests
human rubric
production monitoring
```


The compact classification formula is:

```text
SF family
+ failed object
+ failure relation
+ evaluation method
```
