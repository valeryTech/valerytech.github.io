---
draft: false
toc: true
title: "Stack 1b Restructuring"
linkTitle: "Stack 1b Restructuring"
---
The sections overlap because the current document mixes **feature categories** with **cross-cutting behavioral dimensions**. Some B-codes are relatively discrete causal features. Others are better understood as axes that modulate several other features. Making them strictly mutually exclusive is possible only if the document shifts from "causal feature list" to a more formal classification system.

## Core issue


The current Layer 1B taxonomy is not fully mutually exclusive because several entries describe different views of the same generation process:

```text
User prompt
→ model infers task
→ examples and wording condition interpretation
→ model chooses response posture
→ model generates an output
→ output reflects style, policy, confidence, knowledge, and competence priors
```


The B-sections slice this process at different abstraction levels. That is why overlap appears.

The taxonomy currently contains three kinds of things:

```text
1. Primary behavioral mechanisms
   Example: task induction, demonstration conditioning, cooperative completion

2. Modulators of those mechanisms
   Example: interface sensitivity, distribution-conditional competence

3. Output/assessment properties
   Example: plural valid-output space, generated confidence language
```


Those are not the same kind of category. That is the main structural reason the sections overlap.

# 1. Major overlaps between current sections

## B1 / B2 / B3: task interpretation cluster

### Current overlap

```text
B1 — Learned Natural-Language Task Induction
B2 — In-Context Demonstration Conditioning
B3 — Natural-Language Interface Sensitivity
```


These three are tightly coupled.

B1 says the model infers the task from natural-language context.

B2 says examples inside that context shape the inferred task.

B3 says small changes in the natural-language interface can shift the inferred task, output, or decision boundary.

So B2 and B3 are not fully independent from B1. They are partly sub-mechanisms or modifiers of task induction.

### Cleaner distinction


A more exclusive version would define them this way:

|Feature|Exclusive scope|
|---|---|
|B1|Inferring the requested operation from context|
|B2|Inferring a runtime input-output mapping from examples|
|B3|Sensitivity of behavior to semantically small interface perturbations|

Under this framing, B3 is not a task feature itself. It is a **sensitivity axis** over B1, B2, B5, B8, B9, and B10.

### Recommendation


Do not treat B3 as a peer feature if strict exclusivity is required. Treat it as a cross-cutting axis:

```text
Interface sensitivity = how much behavior changes under equivalent or near-equivalent prompt variation.
```


Then B3 becomes a measurable property of other features, not a separate feature.

## B1 / B8: task inference vs response pressure

### Current overlap

```text
B1 — What task is being requested?
B8 — Should the model satisfy the apparent request directly?
```


These are related but separable.

B1 determines the model's interpretation of the operation:

```text
summarize, classify, extract, translate, answer, critique, plan
```


B8 determines the model's posture once a request-like context has been recognized:

```text
answer directly, clarify, abstain, challenge, refuse, use tool
```

### Cleaner distinction


|Feature|Question|
|---|---|
|B1|"What operation is this?"|
|B8|"Should I complete it directly?"|

### Recommendation


Keep B1 and B8 separate. They are not mutually exclusive in execution, but they are diagnosable as different causal stages.

Incident example:

```text
User asks: “Analyze this contract.”
Model gives a broad business summary instead of extracting obligations.

Primary issue: B1 task induction.
```

```text
User asks: “What are the termination risks?” but contract text is missing.
Model invents plausible risks.

Primary issue: B8 cooperative completion pressure.
```

## B5 / B8: assistant style vs answer-producing pressure

### Current overlap

```text
B5 — Learned Interaction-Style and Persona Priors
B8 — Learned Cooperative Completion Prior
```


These are also close. Both come from instruction tuning, preference optimization, and assistant-like interaction patterns.

The difference is:

```text
B5 = how the model presents itself
B8 = whether the model pushes toward completing the request
```

### Cleaner distinction


|Feature|Exclusive scope|
|---|---|
|B5|Tone, persona, hedging, politeness, conversational posture|
|B8|Direct-completion bias: answer rather than clarify, abstain, challenge, or stop|

### Recommendation


Keep both, but sharpen B5 so it excludes decision posture.

B5 should not include "willingness to ask clarifying questions" unless framed as style. Otherwise it overlaps heavily with B8.

Better B5 formulation:

```text
B5 covers generated interaction style after a response posture has been selected.
```


Better B8 formulation:

```text
B8 covers pressure toward selecting direct completion as the response posture.
```

## B5 / B9: refusal style vs policy-boundary behavior

### Current overlap

```text
B5 — Learned Interaction-Style and Persona Priors
B9 — Learned Policy-Boundary Generalization
```


The current document already distinguishes these, but overlap remains because both discuss refusal, hedging, redirection, and safe alternatives.

### Cleaner distinction


|Feature|Question|
|---|---|
|B9|"Is this request allowed, disallowed, constrained, or ambiguous?"|
|B5|"How should the response sound?"|

### Recommendation


Move refusal-style details out of B9 unless they affect the boundary decision.

B9 should own:

```text
comply / refuse / redirect / constrain / escalate
```


B5 should own:

```text
polite / terse / apologetic / firm / explanatory / brand-consistent
```


This gives a clean split:

```text
B9 = policy-region classification behavior
B5 = surface realization of the chosen posture
```

## B3 / B9: interface sensitivity and policy inconsistency

### Current overlap


B9 explicitly says policy behavior can change under paraphrase, role framing, genre, language, and obfuscation. But that is also B3.

This is a classic cross-cutting overlap.

### Cleaner distinction

```text
B9 = learned policy boundary
B3 = sensitivity of that boundary to linguistic variation
```


So "refusal inconsistency under paraphrase" should not be core B9. It is:

```text
B9 behavior + high B3 sensitivity
```

### Recommendation


Represent this compositionally:

```text
Primary feature: B9
Modifier: interface sensitivity
Fault mode: refusal inconsistency under paraphrase
```

## B7 / B10: competence distribution vs knowledge conflict

### Current overlap

```text
B7 — Distribution-Conditional Competence
B10 — Parametric Prior Persistence and Temporal Blending
```


These overlap because temporal freshness and conflicting facts are also distributional phenomena. A model is less competent on current, rare, changing, or source-specific facts.

But B10 is more specific.

### Cleaner distinction


|Feature|Exclusive scope|
|---|---|
|B7|Performance varies by task/domain/format/language/distribution|
|B10|Competing knowledge signals interfere during generation|

B7 answers:

```text
Is the model good at this class of task?
```


B10 answers:

```text
Which knowledge source is the model following, and did it blend sources?
```

### Recommendation


Keep B10 as a specialized feature because it is operationally important for RAG, tool use, and current facts.

But remove general competence language from B10 and keep it focused on:

```text
parametric prior vs retrieved/contextual/newer/conflicting evidence
```

## B4 / all output-generating features

```text
B4 — Plural Valid-Output Space
```


B4 is not a causal behavior in the same way as B1, B2, B8, or B10. It is a property of the output task space.

It applies to almost every generative feature.

For example:

```text
B1 induces task → B4 determines whether multiple outputs can satisfy it
B8 completes request → B4 means many completions may be acceptable
B5 shapes style → B4 means multiple styles may still be valid
B10 blends facts → B4 helps determine whether variation is harmless or material
```

### Recommendation


B4 should probably be moved out of the same list as the other B-features and treated as an **evaluation axis**:

```text
Output equivalence structure:
Does this task have one valid answer, a bounded valid set, or a broad semantic equivalence class?
```


This would reduce overlap.

## B6 / B5 / B8: confidence language, style, and completion pressure

```text
B6 — Generated Self-Assessment and Confidence Language
B5 — Interaction-style priors
B8 — Cooperative completion prior
```


B6 overlaps with B5 because confidence tone is part of interaction style.

It overlaps with B8 because cooperative completion can encourage confident, helpful-sounding answers even when evidence is weak.

### Cleaner distinction


|Feature|Exclusive scope|
|---|---|
|B6|Generated epistemic language is not native calibration|
|B5|General style/persona realization|
|B8|Pressure to produce a useful-looking answer|

### Recommendation


Keep B6 separate only if the taxonomy cares about calibration and trust. It is operationally important enough to preserve, but it should be defined narrowly:

```text
B6 covers the non-privileged status of generated confidence, uncertainty, justification, and self-assessment language.
```


Do not let B6 become a general "tone" feature.

# 2. Can the sections be made mutually exclusive?


Strictly: not cleanly, if they remain "features."

LLM behavior is compositional. A single production failure often involves several Layer 1B properties simultaneously.

Example:

```text
User asks a vague current-facts question.

B1: model infers task
B3: wording affects interpretation
B8: model tends to answer
B10: stale prior influences content
B6: confidence language makes answer look reliable
B4: output has multiple acceptable phrasings
```


Trying to force only one B-code onto that behavior would lose causal information.

But you can make them mutually exclusive for **diagnostic attribution** by distinguishing:

```text
primary causal feature
secondary contributing feature
cross-cutting modifier
downstream fault mode
```


That is probably the best compromise.

## Better model


Instead of:

```text
Each incident maps to exactly one B-code.
```


Use:

```text
Each incident has:
- one primary causal feature,
- zero or more contributing features,
- zero or more modifiers,
- one or more downstream fault modes.
```


Example:

```json
{
  "primary_feature": "B10 Parametric Prior Persistence",
  "contributing_features": ["B8 Cooperative Completion", "B6 Confidence Language"],
  "modifiers": ["high interface sensitivity", "freshness-sensitive domain"],
  "fault_mode": "temporal hallucination",
  "system_fault": "no source authority rule"
}
```


That is more faithful to real AI systems.

# 3. Underlying axes behind the taxonomy


The current taxonomy can be decomposed into a smaller set of underlying axes.

## Axis 1: Control-source axis


This answers:

```text
What is steering the model behavior?
```


Values:

```text
natural-language instruction
examples/demonstrations
conversation history
role/persona framing
policy-like cues
retrieved/contextual evidence
parametric prior
```


Relevant B-codes:

|Axis component|Current B-code|
|---|---|
|Instruction/task cues|B1|
|Examples|B2|
|Wording/framing|B3|
|Persona/context|B5|
|Policy cues|B9|
|Knowledge sources|B10|

This suggests B1, B2, B3, B5, B9, and B10 are partly different **control sources**.

## Axis 2: Response-posture axis


This answers:

```text
What kind of response action does the model choose?
```


Values:

```text
answer
ask clarification
abstain
refuse
redirect
use tool
escalate
challenge premise
```


Relevant B-codes:

|Posture pressure|Current B-code|
|---|---|
|Direct answer pressure|B8|
|Refusal/redirect pressure|B9|
|Clarification style|B5 / B8|
|Evidence-grounding need|B10|
|Competence-aware abstention|B7|

This axis is currently spread across B5, B8, B9, B7, and B10.

For mutual exclusivity, response posture should become its own dimension.

## Axis 3: Output-space axis


This answers:

```text
How many valid outputs exist, and how tightly constrained are they?
```


Values:

```text
single exact answer
bounded structured output
semantic equivalence class
open-ended creative output
policy-constrained output
source-grounded output
```


Relevant B-code:

```text
B4
```


B4 is not really a behavioral mechanism. It is an output-space property.

## Axis 4: Epistemic-authority axis


This answers:

```text
What should the model treat as authoritative?
```


Values:

```text
parametric prior
provided context
retrieved evidence
tool result
system instruction
domain policy
user assertion
conversation-local memory
```


Relevant B-codes:

|Authority issue|Current B-code|
|---|---|
|Generated confidence is not evidence|B6|
|Competence varies by distribution|B7|
|Old/new/source conflict|B10|
|Policy authority|B9|

This axis is crucial for RAG and agent systems.

## Axis 5: Distributional-fit axis


This answers:

```text
How close is the runtime task to learned or post-trained distributions?
```


Values:

```text
common task
rare domain
unusual language
unusual format
strict symbolic task
novel schema
out-of-distribution policy edge case
fresh/current fact
```


Relevant B-code:

```text
B7
```


B7 is best understood as a global competence modifier, not just one feature among peers.

## Axis 6: Surface-realization axis


This answers:

```text
How is the selected behavior expressed?
```


Values:

```text
tone
persona
verbosity
confidence language
hedging
refusal phrasing
citation style
formatting
```


Relevant B-codes:

|Surface realization|Current B-code|
|---|---|
|Persona and tone|B5|
|Confidence/uncertainty language|B6|
|Helpful-looking completion style|B8|
|Refusal style|B9|

This suggests B5 and B6 belong near each other, but B6 deserves special treatment because it affects trust and calibration.

# 4. Proposed restructuring


I would restructure the taxonomy into two layers:

```text
Layer 1B-A: Behavioral mechanisms
Layer 1B-B: Cross-cutting axes
```

## Layer 1B-A: Primary behavioral mechanisms


These are the features that most resemble discrete causal mechanisms:

|Code|Feature|Scope|
|---|---|---|
|B1|Task Induction|Inferring the requested operation|
|B2|Demonstration Conditioning|Inferring a mapping from examples|
|B8|Cooperative Completion Prior|Pressure toward direct helpful completion|
|B5|Interaction-Style Priors|Assistant-like tone/persona realization|
|B9|Policy-Boundary Generalization|Learned comply/refuse/redirect regions|
|B10|Knowledge-Signal Blending|Interference between parametric/contextual/retrieved facts|

## Layer 1B-B: Cross-cutting axes


These should not be peer "features" if exclusivity matters:

|Current code|Recast as axis|Reason|
|---|---|---|
|B3|Interface sensitivity|Modulates many behaviors|
|B4|Output equivalence space|Evaluation/output property|
|B6|Generated epistemic expression|Surface/epistemic trust property|
|B7|Distributional fit / competence envelope|Global competence modifier|

This is cleaner because B3, B4, B6, and B7 are not localized behaviors. They describe properties that apply across many behaviors.

# 5. Alternative: keep all B-codes, but add a classification schema


If you want to preserve the current B-codes, add metadata to each section.

Example:

|Code|Primary type|Causal stage|Cross-cutting?|Mutually exclusive?|
|---|---|---|---|---|
|B1|Mechanism|Task interpretation|No|Mostly|
|B2|Mechanism|Task interpretation|No|Mostly|
|B3|Modifier|Control sensitivity|Yes|No|
|B8|Mechanism|Response posture|No|Mostly|
|B4|Output property|Evaluation semantics|Yes|No|
|B6|Epistemic expression|Surface realization / trust|Partly|Partly|
|B5|Mechanism/style prior|Surface realization|Partly|Partly|
|B9|Mechanism/policy prior|Boundary decision|No|Mostly|
|B7|Modifier|Competence envelope|Yes|No|
|B10|Mechanism/knowledge conflict|Knowledge authority|No|Mostly|

This lets the taxonomy admit overlap explicitly instead of pretending the categories are all the same type.

# 6. A practical diagnostic decision tree


For engineering use, add a decision tree like this:

```text
1. Did the model infer the wrong operation?
   → B1

2. Did examples define or distort the mapping?
   → B2

3. Did equivalent wording, order, framing, or genre change the behavior?
   → B3 as modifier

4. Did the model answer when it should clarify, abstain, challenge, or use a tool?
   → B8

5. Is the issue that many outputs could be acceptable and evaluation lacks criteria?
   → B4

6. Did generated confidence, uncertainty, or justification mislead the user?
   → B6

7. Is the issue tone, persona, verbosity, hedging, or conversational posture?
   → B5

8. Is the issue comply/refuse/redirect boundary behavior?
   → B9

9. Is the issue uneven capability by domain, format, language, or task rarity?
   → B7 as modifier

10. Is the issue old/new/retrieved/contextual knowledge interference?
    → B10
```


This would make the sections operationally distinguishable even if they are not ontologically exclusive.

# 7. Best underlying classification system


The most robust structure would classify each behavior along five axes:

```text
A. Control source
B. Response posture
C. Output constraint
D. Epistemic authority
E. Distributional fit
```


Then current B-codes become named recurring patterns inside that space.

## Example mapping

```text
B1 Task Induction
Control source: natural-language instruction
Response posture: not specified
Output constraint: task-dependent
Epistemic authority: task-dependent
Distributional fit: affects reliability
```

```text
B8 Cooperative Completion
Control source: request-like context
Response posture: answer/complete
Output constraint: broad unless externally constrained
Epistemic authority: may be weak
Distributional fit: affects correctness
```

```text
B10 Temporal Blending
Control source: parametric prior + context/retrieval
Response posture: usually answer
Output constraint: factual/source-grounded
Epistemic authority: conflict-prone
Distributional fit: freshness-sensitive
```


This gives a cleaner compositional model.

# 8. Recommended rewrite principle


I would not try to make every B-code mutually exclusive. Instead, I would make the **section roles** mutually exclusive.

Use this split:

```text
Behavioral mechanisms:
- B1 Task Induction
- B2 Demonstration Conditioning
- B8 Cooperative Completion
- B5 Interaction-Style Priors
- B9 Policy-Boundary Generalization
- B10 Knowledge-Signal Blending

Cross-cutting axes:
- B3 Interface Sensitivity
- B4 Output Equivalence Space
- B6 Generated Epistemic Expression
- B7 Distributional Fit / Competence Envelope
```


Then define incident attribution as:

```text
primary mechanism + modifiers + fault mode + system gap
```


Example:

```text
Primary mechanism:
  B10 Knowledge-Signal Blending

Modifiers:
  B7 low distributional fit for current API details
  B3 high sensitivity to wording
  B6 overconfident epistemic expression

Fault mode:
  stale factual answer

System gap:
  no retrieval authority rule
```


That is more precise than forcing a single label.

## Bottom line


The sections should probably not be made strictly mutually exclusive as causal phenomena. LLM behavior is compositional. But the document can become much cleaner by separating:

```text
mechanisms
modifiers
output-space properties
epistemic-authority properties
evaluation implications
```


The strongest redesign is to treat B1, B2, B5, B8, B9, and B10 as primary learned behavioral mechanisms, while recasting B3, B4, B6, and B7 as cross-cutting axes that describe sensitivity, valid-output space, epistemic expression, and competence envelope.
