---
draft: false
toc: true
title: "Layer 1b Final Scheme"
linkTitle: "Layer 1b Final Scheme"
---
# Layer 1B -- Learned Behavioral LLM Features

## Purpose


Layer 1B defines stable learned behavioral properties of large language models that are causal, but are not themselves faults.

Layer 1B explains why certain behavioral outcomes become possible or likely under particular prompts, contexts, tasks, domains, policies, evidence conditions, and system designs.

Layer 1B answers:

```text
What learned property of the model made this behavior possible?
```


Layer 1B does **not** answer:

```text
What natural-language property created the interface condition?  → Layer 0
What primitive model or inference mechanism is involved?        → Layer 1A
What deployed-system feature shaped the behavior?               → Layer 1C
What behavioral failure occurred?                               → Layer 2
What control was missing or ineffective?                        → Layer 3
What impact did the failure produce?                            → Layer 4
```


A Layer 1B feature may contribute to a downstream failure, but it should not be named as the failure itself.

## Definition


A **Layer 1B learned behavioral feature** is a stable property of LLM behavior produced by the interaction of learned parameters, post-training, prompt conditioning, context integration, and inference-time generation.

These features are not primitive architectural operations. They are learned behavioral regularities that emerge from the model's training and deployment interface.

They are also not downstream fault modes. A feature such as task induction, in-context conditioning, cooperative completion, policy-boundary generalization, or knowledge-signal blending may make a fault more likely, but the fault itself belongs in Layer 2.

## Taxonomy structure


Layer 1B is divided into two sublayers:

```text
Layer 1B-A — Primary learned behavioral mechanisms
Layer 1B-B — Cross-cutting behavioral axes
```


The split prevents category drift.

**Primary learned behavioral mechanisms** describe learned behaviors that directly participate in generation. They explain what the model is doing behaviorally: inferring a task, adapting to context, choosing a completion posture, mapping a request into a policy-like region, blending knowledge signals, or realizing a response in an interaction style.

**Cross-cutting behavioral axes** describe dimensions along which those mechanisms vary, destabilize, or become operationally risky. They are usually used as modifiers rather than as the primary causal label.

This means Layer 1B attribution should usually have a compositional form:

```text
Primary mechanism:
  one or more Layer 1B-A features

Modifiers:
  zero or more Layer 1B-B axes

Observed fault:
  Layer 2 behavioral fault mode

System control or control gap:
  Layer 3 control family or system fault
```

## Feature and axis index


The B-codes remain stable identifiers. The reading order below follows diagnostic flow rather than numerical order.

| Code | Name | Type | Core diagnostic question | Not itself |
|---|---|---|---|---|
| **B1** | Task Induction | Primary learned behavioral mechanism | What operation does the model infer from the prompt and context? | Task misinduction |
| **B2** | In-Context Conditioning | Primary learned behavioral mechanism | How does prompt-local information condition runtime behavior? | Example overfitting or context misuse |
| **B8** | Cooperative Completion Prior | Primary learned behavioral mechanism | Why does the model tend to answer or complete? | Hallucination, sycophancy, or over-compliance |
| **B9** | Policy-Boundary Generalization | Primary learned behavioral mechanism | How does the model generalize comply/refuse/redirect/constrain behavior? | Policy compliance or policy enforcement |
| **B10** | Knowledge-Signal Blending | Primary learned behavioral mechanism | How do parametric, retrieved, contextual, and temporal knowledge signals interact? | Hallucination or RAG failure |
| **B5** | Interaction-Style Realization | Primary learned behavioral mechanism / realization prior | How does the selected behavior surface conversationally? | Product-tone inconsistency |
| **B3** | Interface Sensitivity | Cross-cutting behavioral axis | How much does behavior change under wording, order, framing, genre, language, or formatting variation? | Prompt fragility |
| **B4** | Output Equivalence Space | Cross-cutting behavioral axis | How broad or narrow is the valid-output space for the task? | Inconsistent output |
| **B6** | Epistemic Expression | Cross-cutting behavioral axis | How does the model express confidence, uncertainty, evidence, or self-assessment? | Weak calibration |
| **B7** | Distributional Fit / Competence Envelope | Cross-cutting behavioral axis | How well does the task fit the model's learned, post-trained, contextual, and tool-supported competence region? | Domain failure |

# Layer 1B-A -- Primary Learned Behavioral Mechanisms

## Definition


Layer 1B-A contains learned behavioral mechanisms that directly shape the generation process.

They explain how the model:

- infers the requested operation;
- adapts to local examples, schemas, definitions, rubrics, or source documents;
- tends toward answer production or task completion;
- maps requests into comply/refuse/redirect/constrain regions;
- blends parametric, retrieved, contextual, temporal, and conversation-local knowledge signals;
- realizes the selected behavior through learned assistant-like interaction style.

These mechanisms are not isolated modules. They are diagnostic abstractions over learned behavior. Multiple Layer 1B-A mechanisms may be active in the same incident.

## B1. Task Induction

### Type


Primary learned behavioral mechanism.

### Core question

```text
What operation does the model infer from the prompt, conversation, examples,
formatting, role structure, and pragmatic context?
```

### Canonical statement


> The model infers task intent and output expectations from natural-language, pragmatic, structural, and in-context cues rather than from a hard executable task contract.

### Definition


Task induction is the learned ability of an instruction-tuned or chat-tuned LLM to infer an intended operation from natural-language and contextual cues.

The model is not normally given a hard executable task contract. It receives a token sequence and generates a continuation conditioned on that sequence. Through pretraining and post-training, the model has learned that particular natural-language cues correspond to task-like behaviors such as answering, summarizing, translating, extracting, classifying, rewriting, critiquing, planning, formatting, or preparing tool calls.

Task induction is therefore not a separate internal function such as:

```text
summarize()
classify()
extract()
translate()
```


It is a learned conditioning effect: the prompt and context shift the model toward a task-specific continuation regime.

### What the model may infer


Task induction may involve inferring:

- the requested operation;
- the target object or scope;
- the intended output form;
- the relevant audience;
- the expected level of detail;
- which constraints are hard requirements;
- which constraints are preferences;
- whether the task asks for an answer, action, transformation, judgment, plan, critique, or tool call;
- whether the user expects direct completion, clarification, abstention, refusal, or escalation.

### Why this belongs in Layer 1B


Task induction is not a primitive architecture mechanism. It depends on lower-level mechanisms such as learned parametric associations, finite ordered context, attention-mediated context integration, in-band control/data representation, autoregressive generation, and distributional token scoring. But it is not identical to any one of them.

It belongs in Layer 1B because it is a stable learned behavioral feature that explains how a general-purpose language model behaves as if it can perform many different tasks through a single natural-language interface.

### Soft-contract example


A typed software interface can expose a hard contract:

```text
summarize(
  text=contract,
  max_words=150,
  preserve_all_exceptions=true,
  output_format="numbered_list",
  quote_defined_terms=true
)
```


A natural-language prompt usually exposes a soft contract:

```text
Summarize this contract in a short numbered list, preserving all exceptions and defined terms.
```


The second form requires task induction. The model must infer what "summarize" means, what "short" permits, what counts as an exception, whether defined terms should be quoted or paraphrased, how much compression is acceptable, and whether legal fidelity or readability has priority.

The prompt can strongly condition behavior, but it is not equivalent to a typed API, parser, validator, schema, or deterministic program.

### Downstream fault modes it can contribute to


B1 can contribute to Layer 2 faults such as:

- task misinduction;
- task blending;
- scope misinterpretation;
- constraint misclassification;
- output-contract drift;
- control/data confusion;
- tool-routing error;
- prompt-surface fragility when equivalent prompts induce different task interpretations.

### Boundary


B1 is not the same as in-band control/data representation.

```text
Layer 1A:
  Instructions, data, examples, and evidence share the same token channel.

B1:
  The model infers what operation is being requested from that channel.
```


B1 is not the same as decoding path selection.

```text
Layer 1A:
  A decoding procedure selects one path through scored continuations.

B1:
  The model's scored continuations are shaped by the task it has inferred.
```


B1 is not itself a fault.

```text
Layer 1B feature:
  The model infers a task from natural-language context.

Layer 2 fault:
  The model infers the wrong task, wrong scope, or wrong constraint force.

Layer 3 control:
  The system uses task contracts, prompt structure, schema validation,
  clarification rules, or tool-routing gates to bound task interpretation.
```

### Diagnostic use


Use B1 as the primary Layer 1B contributor when the model's failure is best explained by the wrong inferred operation, scope, or success criterion.

Use a different primary contributor when:

- the task was inferred correctly but the model answered despite missing evidence -> **B8**;
- examples or local rubrics distorted the behavior -> **B2**;
- the policy boundary drove comply/refuse/redirect behavior -> **B9**;
- stale or conflicting knowledge shaped the answer -> **B10**;
- wording variation changed behavior materially -> **B3** as a modifier.

## B2. In-Context Conditioning

### Type


Primary learned behavioral mechanism.

### Core question

```text
How does prompt-local information condition runtime behavior without weight updates?
```

### Canonical statement


> The model can adapt its runtime behavior from prompt-local examples, demonstrations, labels, schemas, rubrics, definitions, corrections, source documents, and conversation-local facts without changing its parameters.

### Definition


In-context conditioning is the learned behavioral ability to use information inside the current context to shape the current response.

The model's weights do not change during ordinary inference. Instead, prompt-local content changes the activation state and token probabilities for the current generation. This can make the model behave as if it has learned a local task, label space, style, schema, or rubric for the duration of the context.

In-context conditioning includes, but is not limited to, few-shot demonstration conditioning.

### What can condition behavior


Prompt-local conditioning can come from:

- examples;
- demonstrations;
- labels;
- schemas;
- glossaries;
- local definitions;
- corrections;
- source documents;
- formatting contracts;
- domain-specific rubrics;
- temporary conventions;
- conversation-local facts;
- instruction hierarchies;
- tool outputs;
- quoted policies or standards.

### Demonstration-conditioned case

```text
Input: "The battery lasts two hours."
Label: negative

Input: "The screen is bright and sharp."
Label: positive

Input: "The keyboard feels cheap."
Label:
```


The examples define the label space, output format, and classification standard. The model has not been retrained, but its runtime behavior is conditioned by the demonstrated pattern.

### Non-demonstration case

```text
For this review, treat "P0" as requiring immediate executive escalation.
Classify the following incident using only this rubric.
```


No input-output examples are provided, but the local definition and rubric still condition behavior.

### Why this belongs in Layer 1B


In-context conditioning is not a primitive tensor operation, a training update, or a deterministic program. It is a learned behavioral feature produced by the interaction of context integration, learned priors, task induction, and generation.

It deserves separate treatment from B1 because B1 concerns inferring the requested operation from natural-language and pragmatic cues. B2 concerns runtime adaptation from information supplied inside the current context.

### Downstream fault modes it can contribute to


B2 can contribute to Layer 2 faults such as:

- example overgeneralization;
- rubric misapplication;
- context priority misweighting;
- task blending;
- format imitation without semantic compliance;
- source authority confusion;
- distractor assimilation;
- local convention misapplication.

### Boundary


B2 is not ordinary context availability.

```text
Context availability:
  Information is present or absent in the runtime context.

B2:
  Prompt-local information changes the model's runtime behavior.
```


B2 is not a weight update.

```text
Training:
  Parameters change.

In-context conditioning:
  The prompt changes the current activation and probability landscape.
```


B2 is not itself a fault.

```text
Layer 1B feature:
  The model adapts behavior from local context.

Layer 2 fault:
  The model overgeneralizes examples, misapplies a rubric, or follows a local pattern incorrectly.

Layer 3 control:
  The system separates examples from task payloads, labels evidence, validates output,
  and tests sensitivity to example order and content.
```

### Diagnostic use


Use B2 as the primary Layer 1B contributor when the behavior is best explained by prompt-local examples, labels, schemas, rubrics, definitions, source documents, or corrections shaping the response.

Use B1 instead when the issue is the general inferred task rather than a local pattern. Use B3 as a modifier when small prompt-surface changes materially alter the conditioning effect.

## B8. Cooperative Completion Prior

### Type


Primary learned behavioral mechanism.

### Core question

```text
Why does the model tend to produce a helpful-looking answer or continuation?
```

### Canonical statement


> The model has learned a response posture that often favors direct completion, answer production, helpfulness, and conversational progress over abstention, interruption, refusal, clarification, or evidence-demanding behavior.

### Definition


The cooperative completion prior is the learned tendency for an assistant-like model to continue the interaction by producing a useful-looking response.

This prior is shaped by pretraining, instruction tuning, preference optimization, safety training, assistant-role conventions, and product interaction patterns. It makes the model useful in ordinary cases because users usually expect an answer. But it can become risky when the correct behavior is to stop, ask for clarification, request evidence, refuse, escalate, route to a tool, or abstain.

### What it explains


B8 explains why the model may continue even when:

- the task is underspecified;
- relevant evidence is missing;
- the user should be asked a clarifying question;
- the correct behavior is abstention;
- the answer depends on current information not present in context;
- the system should route to a tool or human;
- a safety, authority, or confidence boundary is unresolved.

### Why this belongs in Layer 1B


B8 is not a primitive inference mechanism and not a downstream hallucination label. It is a learned behavioral prior over response posture.

The same model behavior that enables helpful direct answers can also increase the probability of unsupported assertions, premature answers, over-compliance, or failure to clarify when deployed without adequate controls.

### Downstream fault modes it can contribute to


B8 can contribute to Layer 2 faults such as:

- unsupported assertion;
- fabricated answer;
- failure to ask clarification;
- premature completion;
- over-compliance;
- sycophantic answer pattern;
- unsafe direct completion;
- answering from weak or absent evidence.

### Boundary


B8 is not hallucination.

```text
B8:
  The learned pressure toward producing a completion.

Layer 2 hallucination / unsupported assertion:
  The produced content is unsupported, fabricated, or not grounded in available evidence.
```


B8 is not interaction style.

```text
B8:
  Whether the model tends toward direct completion.

B5:
  How the selected response posture is expressed in tone, persona, hedging,
  verbosity, apology, or refusal wording.
```


B8 is not policy-boundary behavior.

```text
B8:
  The model tends to complete.

B9:
  The model maps the request into comply, refuse, redirect, constrain,
  or escalate regions.
```

### Diagnostic use


Use B8 when the task was broadly understood but the model should not have answered directly under the available evidence, authority, safety, or completeness conditions.

Use B1 when the wrong task was inferred. Use B10 when competing knowledge signals shaped the answer. Use B6 as a modifier when the completion was expressed with misleading confidence.

## B9. Policy-Boundary Generalization

### Type


Primary learned behavioral mechanism.

### Core question

```text
How does the model generalize comply/refuse/redirect/constrain behavior
across natural-language requests?
```

### Canonical statement


> The model maps requests into policy-like behavioral regions through learned semantic generalization rather than deterministic rule enforcement.

### Definition


Policy-boundary generalization is the learned behavioral tendency to classify requests into response regions such as:

```text
comply
refuse
redirect
constrain
answer partially
ask for clarification
escalate
provide a safe alternative
```


This behavior is shaped by post-training, safety examples, preference data, system prompts, policy text, refusal patterns, and product-specific interaction conventions.

B9 describes the model-side learned approximation of policy-boundary behavior. It is not the product policy itself and it is not enforceable access control.

### What it explains


B9 explains why semantically related requests may receive different treatment depending on how the model generalizes from learned policy examples and boundary cases.

It is especially relevant for:

- safety-sensitive requests;
- dual-use domains;
- regulated or restricted advice;
- ambiguous user intent;
- requests with both benign and harmful interpretations;
- policy-adjacent transformations such as summarization, rewriting, classification, or explanation;
- requests that require refusal, redirection, narrowing, or escalation.

### Why this belongs in Layer 1B


B9 is a learned behavioral feature, not a hard control. The model may approximate policy behavior, but a deployed system cannot treat that approximation as sufficient policy enforcement.

Actual policy enforcement, authorization, escalation, refusal rules, and auditability belong in Layer 3.

### Downstream fault modes it can contribute to


B9 can contribute to Layer 2 faults such as:

- under-refusal;
- over-refusal;
- unsafe compliance;
- safe-context refusal;
- inconsistent refusal under paraphrase;
- failure to redirect;
- vague refusal without useful alternative;
- dual-use misclassification;
- policy-boundary instability across language, role framing, or genre.

### Boundary


B9 is not product policy.

```text
Product policy:
  The system's intended rules for allowed, disallowed, restricted, or escalated behavior.

B9:
  The model's learned tendency to approximate those regions from natural-language context.
```


B9 is not policy enforcement.

```text
Layer 1B feature:
  The model generalizes policy-boundary behavior.

Layer 3 control:
  A policy classifier, permission gate, refusal rule, audit rule, or human escalation path
  enforces the operating boundary.
```


B9 is not refusal style.

```text
B9:
  Which policy-like region is selected.

B5:
  How the selected response sounds.
```

### Diagnostic use


Use B9 when the main causal issue is the learned comply/refuse/redirect/constrain boundary.

Use B3 as a modifier when the boundary is unstable under paraphrase, formatting, language, or framing variation. Use B5 when the issue is the tone or style of the refusal or redirection rather than the boundary decision itself.

## B10. Knowledge-Signal Blending

### Type


Primary learned behavioral mechanism.

### Core question

```text
How do parametric, retrieved, contextual, temporal, and conversation-local
knowledge signals interact during generation?
```

### Canonical statement


> The model's parametric prior can persist alongside newer, conflicting, retrieved, or context-provided information, causing generation to blend, privilege, or confuse competing knowledge signals unless authority and freshness are made explicit.

### Definition


Knowledge-signal blending is the learned tendency for multiple knowledge sources to influence generation at once.

Relevant knowledge signals may include:

- older parametric associations;
- newer parametric associations;
- prompt-local facts;
- retrieved documents;
- tool outputs;
- conversation history;
- memory records;
- source metadata;
- examples in the prompt;
- user assertions;
- generated intermediate summaries;
- freshness and authority cues;
- domain conventions learned during training.

The model may not reliably preserve a clean operational distinction among these signals unless the system represents authority, freshness, provenance, and evidence requirements explicitly.

### Why this belongs in Layer 1B


B10 is not merely stale knowledge. Temporal blending is one visible subtype, but the broader feature is competition among knowledge signals.

A model can blend:

```text
old fact + new fact
parametric memory + retrieved source
user assertion + authoritative source
conversation summary + original document
example content + task payload
outdated API pattern + current documentation
```


This belongs in Layer 1B because the blending behavior is a learned generative property. Whether the system prevents, detects, verifies, or corrects it belongs in Layer 3.

### Downstream fault modes it can contribute to


B10 can contribute to Layer 2 faults such as:

- stale factual answer;
- parametric-prior override;
- retrieved-evidence underuse;
- source authority confusion;
- temporal hallucination;
- deprecated API usage;
- old/new policy blending;
- current-role mistake;
- evidence-claim mismatch;
- source-grounding failure.

### Boundary


B10 is not hallucination.

```text
B10:
  Competing knowledge signals influence generation.

Layer 2 hallucination / unsupported claim:
  The final claim is unsupported, false, stale, or not grounded in the governing source.
```


B10 is not retrieval failure.

```text
Retrieval failure:
  The system did not retrieve or supply the right evidence.

B10:
  The model blends, privileges, or confuses knowledge signals that are parametric,
  retrieved, contextual, temporal, or conversation-local.
```


B10 is not the same as distributional competence.

```text
B7:
  How well the task fits the model's competence region.

B10:
  Which knowledge signals influenced the answer and whether they conflicted or blended.
```

### Diagnostic use


Use B10 when the failure is best explained by stale, conflicting, low-authority, retrieved, contextual, or parametric knowledge signals interfering during generation.

Use B7 as a modifier when the relevant domain is freshness-sensitive, rare, technical, multilingual, jurisdiction-specific, or otherwise outside the model's reliable competence envelope. Use B6 as a modifier when the blended answer is presented with misleading confidence.

## B5. Interaction-Style Realization

### Type


Primary learned behavioral mechanism / realization prior.

### Core question

```text
How does the model express the selected response posture conversationally?
```

### Canonical statement


> The model's response is shaped not only by task content, but also by learned interaction-style priors about tone, persona, politeness, hedging, verbosity, refusal style, explanation style, and conversational posture.

### Definition


Interaction-style realization is the learned tendency for the model to surface behavior through assistant-like conversational forms.

This includes learned patterns for:

- tone;
- persona;
- politeness;
- apology;
- hedging;
- certainty markers;
- verbosity;
- helpfulness framing;
- refusal wording;
- safe-alternative phrasing;
- deference or assertiveness;
- explanation style;
- brand or role posture.

B5 operates late in the behavioral chain. It shapes how the selected task, answer, refusal, clarification, or escalation is presented.

### Why this belongs in Layer 1B


B5 is a learned model-side feature shaped by pretraining, supervised fine-tuning, preference training, safety training, system prompts, product prompts, and conversational context.

It is not the same as product UX policy. A system can specify a desired tone, but the model realizes that tone through learned linguistic behavior.

### Downstream fault modes it can contribute to


B5 can contribute to Layer 2 faults such as:

- misleadingly confident tone;
- excessive hedging;
- sycophantic phrasing;
- over-apologetic refusal;
- vague refusal;
- brand-inconsistent posture;
- unclear escalation language;
- tone that masks uncertainty, lack of evidence, or policy limitation.

### Boundary


B5 is not cooperative completion pressure.

```text
B8:
  Whether the model tends to answer or complete.

B5:
  How the selected response posture is expressed.
```


B5 is not policy-boundary generalization.

```text
B9:
  Whether the model maps the request to comply, refuse, redirect, constrain,
  or escalate.

B5:
  Whether that refusal, compliance, redirection, or escalation is terse,
  apologetic, firm, verbose, hedged, or explanatory.
```


B5 is not epistemic calibration.

```text
B6:
  How confidence, uncertainty, evidence, or self-assessment are expressed.

B5:
  The broader interaction style in which that expression appears.
```

### Diagnostic use


Use B5 when the selected behavior is broadly correct or at least identifiable, but the surface realization creates risk, confusion, over-trust, frustration, sycophancy, or product inconsistency.

Use B8 when the issue is direct-completion pressure. Use B9 when the issue is the policy-boundary decision. Use B6 when the issue is the epistemic content of confidence or uncertainty language.

# Layer 1B-B -- Cross-Cutting Behavioral Axes

## Definition


Layer 1B-B contains dimensions that modulate, qualify, or expose the operation of Layer 1B-A mechanisms.

Cross-cutting axes are usually not the primary causal label. They answer questions such as:

```text
How sensitive is the behavior to wording or framing?
How many outputs could validly satisfy the task?
How does the model express confidence or uncertainty?
How well does the task fit the model's competence region?
```


Use them as modifiers in diagnosis.

Example:

```text
Primary mechanism:
  B9 Policy-Boundary Generalization

Modifier:
  B3 high Interface Sensitivity

Layer 2 fault:
  refusal inconsistency under paraphrase

Layer 3 control gap:
  no policy classifier or paraphrase-robust policy evaluation
```

## B3. Interface Sensitivity

### Type


Cross-cutting behavioral axis.

### Core question

```text
How much does behavior change when the natural-language surface changes?
```

### Canonical statement


> Model behavior can shift under wording, ordering, formatting, framing, genre, language, or example variation even when the intended task is operationally equivalent.

### Definition


Interface sensitivity is the degree to which model behavior changes under variation in the natural-language interface.

Relevant interface changes include:

- wording;
- paraphrase;
- order;
- formatting;
- delimiters;
- examples;
- role framing;
- genre;
- language;
- politeness;
- specificity;
- prompt length;
- instruction placement;
- source presentation;
- conversational framing.

B3 is cross-cutting because it can modulate almost every primary learned mechanism.

### Mechanisms it can modify


B3 can modify:

- **B1 Task Induction** -- different wording induces a different task;
- **B2 In-Context Conditioning** -- example order or format changes the inferred pattern;
- **B8 Cooperative Completion Prior** -- framing changes whether the model asks, abstains, or answers;
- **B9 Policy-Boundary Generalization** -- paraphrase changes comply/refuse/redirect behavior;
- **B10 Knowledge-Signal Blending** -- source presentation changes which knowledge signal dominates;
- **B5 Interaction-Style Realization** -- tone and genre cues change response style.

### Downstream fault modes it can contribute to


B3 can contribute to Layer 2 faults such as:

- prompt-surface fragility;
- semantic inconsistency under equivalent wording;
- policy inconsistency under paraphrase;
- tool-routing instability;
- output-format drift after minor prompt edits;
- source-priority shifts caused by presentation changes.

### Boundary


B3 is not a separate task feature when strict attribution is needed.

```text
Primary mechanism:
  The learned behavior being perturbed.

B3:
  The sensitivity of that behavior to interface variation.
```


B3 is not a fault unless the behavioral outcome changes materially.

```text
Harmless variation:
  Different wording, same operational outcome.

Layer 2 fault:
  Equivalent prompts produce materially different behavior.
```

### Diagnostic use


Use B3 as a modifier when behavior changes under semantically equivalent or near-equivalent prompt variation.

Diagnostic form:

```text
Primary mechanism:
  B1 Task Induction

Modifier:
  B3 high Interface Sensitivity

Fault:
  task misinduction under paraphrase
```

## B4. Output Equivalence Space

### Type


Cross-cutting behavioral axis.

### Core question

```text
How many different outputs can legitimately satisfy the task?
```

### Canonical statement


> Some tasks have many valid outputs, while others require narrow, exact, schema-bound, source-bound, or symbolically precise outputs.

### Definition


Output equivalence space describes the size and shape of the set of acceptable outputs for a task.

Some tasks permit many valid completions. Others have a narrow valid-output space where small deviations are operationally wrong.

### Wide output equivalence space


Examples:

```text
Brainstorm ten product names.
Draft a friendly reply.
Summarize this article informally.
Suggest three ways to improve the design.
Write a concise explanation for a non-technical audience.
```


In these tasks, multiple outputs may be valid because success is semantic, rhetorical, or preference-dependent.

### Narrow output equivalence space


Examples:

```text
Return JSON matching this schema.
Extract the exact contract clause.
Quote the source span verbatim.
Classify using only these labels.
Calculate the numeric answer.
Use this exact account ID.
Generate a tool argument with this exact enum value.
```


In these tasks, small deviations can break downstream systems or change meaning.

### Why this belongs in Layer 1B-B


B4 is not a primary mechanism. It is an axis describing the task's valid-output geometry.

The same primary mechanism can be safe in a wide equivalence space and risky in a narrow one.

Example:

```text
B1 Task Induction + wide output space:
  Draft a friendly summary.

B1 Task Induction + narrow output space:
  Extract all termination clauses exactly and preserve defined terms.
```

### Downstream fault modes it can contribute to


B4 can contribute to Layer 2 faults such as:

- output-contract drift;
- schema violation;
- semantic error in structured output;
- inconsistent answer where exactness was required;
- over-paraphrase of source text;
- loss of symbolic integrity;
- incorrect tool argument formatting.

### Boundary


B4 is not output inconsistency itself.

```text
B4:
  The task permits a broad or narrow set of valid outputs.

Layer 2 fault:
  The model produces an output outside the valid set.
```


B4 is not a parser or validator.

```text
B4:
  The output space is narrow.

Layer 3 control:
  Schema validation, parser enforcement, constrained decoding, exact-span extraction,
  or symbolic integrity checks bound the output.
```

### Diagnostic use


Use B4 as a modifier when task success depends on exactness, schema compliance, source fidelity, symbolic integrity, or narrow output constraints.

Diagnostic form:

```text
Primary mechanism:
  B2 In-Context Conditioning

Modifier:
  B4 narrow Output Equivalence Space

Fault:
  schema-compliant-looking output with semantically invalid field values
```

## B6. Epistemic Expression

### Type


Cross-cutting behavioral axis.

### Core question

```text
How does the model express confidence, uncertainty, evidence, limitation,
verification, or self-assessment?
```

### Canonical statement


> The model's confidence language is generated text, not a native calibrated measure of correctness, evidence support, or epistemic certainty.

### Definition


Epistemic expression is the way a model expresses confidence, uncertainty, evidential support, limitation, verification, or self-assessment in generated text.

This includes phrases and structures such as:

- "I am confident...";
- "It appears...";
- "The evidence suggests...";
- "I cannot verify...";
- "Based on the provided source...";
- "This may be outdated...";
- "I don't have enough information...";
- "The most likely answer is...";
- "I checked...";
- "This is definitely...".

B6 is cross-cutting because confidence and uncertainty language can attach to many different primary mechanisms.

### Mechanisms it can modify


B6 can modify:

- **B8 Cooperative Completion Prior** -- direct answer with high confidence despite missing evidence;
- **B10 Knowledge-Signal Blending** -- stale or blended knowledge stated as current fact;
- **B9 Policy-Boundary Generalization** -- overconfident safety classification or vague refusal;
- **B7 Distributional Fit / Competence Envelope** -- confident answer outside reliable competence range;
- **B1 Task Induction** -- confident execution of the wrong inferred task;
- **B5 Interaction-Style Realization** -- tone makes uncertainty appear stronger or weaker than warranted.

### Why this belongs in Layer 1B-B


B6 is not a native confidence meter. It is generated language.

The model may produce uncertainty markers, confidence markers, citations, or apparent self-assessment, but those signals do not automatically correspond to correctness, evidence support, source authority, or calibrated probability.

### Downstream fault modes it can contribute to


B6 can contribute to Layer 2 faults such as:

- weak confidence calibration;
- high-confidence wrong answer;
- misleading uncertainty;
- unsupported justification;
- false verification;
- over-trust caused by confident style;
- under-trust caused by unnecessary hedging;
- failure to communicate evidence limitations.

### Boundary


B6 is not correctness.

```text
Correctness:
  Whether the answer is true, valid, supported, or operationally acceptable.

B6:
  How the generated text expresses confidence, uncertainty, evidence, or limitation.
```


B6 is not calibrated probability.

```text
Generated phrase:
  "I am confident."

Not equivalent to:
  A reliable probability estimate that the answer is correct.
```


B6 is not the same as broad interaction style.

```text
B5:
  Overall tone, persona, and conversational posture.

B6:
  Epistemic expression within that posture.
```

### Diagnostic use


Use B6 as a modifier when the risk comes from how the model expresses confidence, uncertainty, evidential support, verification, or limits.

Diagnostic form:

```text
Primary mechanism:
  B10 Knowledge-Signal Blending

Modifier:
  B6 misleadingly high Epistemic Expression

Fault:
  stale factual answer stated as current verified fact
```

## B7. Distributional Fit / Competence Envelope

### Type


Cross-cutting behavioral axis.

### Core question

```text
How well does the current task fit the model's learned, post-trained,
contextual, linguistic, domain, format, and tool-supported competence region?
```

### Canonical statement


> LLM capability is distribution-conditioned: performance varies with domain, format, language, task framing, evidence availability, and similarity to learned or post-trained patterns.

### Definition


Distributional fit describes how well the current task matches the conditions under which the model can reliably perform.

The competence envelope is not a single global capability level. It varies across:

- domain;
- task type;
- language;
- dialect;
- jurisdiction;
- freshness sensitivity;
- source availability;
- input format;
- output format;
- symbolic exactness;
- tool support;
- prompt framing;
- interaction pattern;
- rarity or frequency of the task in training and post-training distributions.

B7 is not itself a failure. It becomes operationally relevant when the system assumes uniform competence across slices where performance is actually uneven.

### Why this belongs in Layer 1B-B


B7 modifies almost every learned behavioral mechanism.

Examples:

```text
B1 Task Induction:
  Rare task format increases task misinduction risk.

B2 In-Context Conditioning:
  Unusual local schema increases rubric misapplication risk.

B8 Cooperative Completion Prior:
  Low competence plus answer pressure increases unsupported assertion risk.

B9 Policy-Boundary Generalization:
  Rare dual-use domain increases boundary-classification risk.

B10 Knowledge-Signal Blending:
  Freshness-sensitive domain increases stale-knowledge risk.

B5 Interaction-Style Realization:
  Unfamiliar professional genre increases register mismatch risk.
```

### Downstream fault modes it can contribute to


B7 can contribute to Layer 2 faults such as:

- domain failure;
- rare-format brittleness;
- weak multilingual performance;
- symbolic exactness failure;
- benchmark/product mismatch;
- regression on changed slices;
- competence overstatement;
- failure in freshness-sensitive or jurisdiction-specific domains.

### Boundary


B7 is not a fault by itself.

```text
B7:
  Capability varies by distributional fit.

Layer 2 fault:
  The model fails on a task, domain, format, language, or slice.

Layer 3 control:
  The system detects competence boundaries, routes, abstains, retrieves,
  verifies, or escalates when fit is weak.
```


B7 is not the same as knowledge-signal blending.

```text
B7:
  Is this task inside the model's reliable competence region?

B10:
  Which knowledge signals shaped the answer, and did they conflict?
```

### Diagnostic use


Use B7 as a modifier when risk is increased because the task is rare, current, specialized, multilingual, jurisdiction-specific, symbolic, format-sensitive, tool-dependent, or otherwise outside the model's reliable competence envelope.

Diagnostic form:

```text
Primary mechanism:
  B8 Cooperative Completion Prior

Modifier:
  B7 weak Distributional Fit / outside Competence Envelope

Fault:
  confident unsupported answer in a rare technical domain
```

# Diagnostic Attribution Pattern


Layer 1B should be used compositionally. Avoid forcing a single B-code to carry the whole explanation.

## Recommended notation

```text
Layer 1B-A primary mechanism:
  B-code and feature name

Layer 1B-B modifiers:
  B-code and axis name, if relevant

Layer 2 observed fault:
  behavioral fault mode

Layer 3 control / control gap:
  system control that prevented, detected, recovered from, or failed to contain the fault
```

## Example 1 -- Wrong task inferred

```text
Observed behavior:
  The model summarizes a contract section when asked to extract obligations exactly.

Layer 1B-A primary mechanism:
  B1 Task Induction

Layer 1B-B modifiers:
  B4 narrow Output Equivalence Space
  B3 high Interface Sensitivity, if the behavior changes under small prompt edits

Layer 2 fault:
  task misinduction
  output-contract drift

Layer 3 control gap:
  no explicit extraction contract
  no exact-span validation
  no schema or source-fidelity check
```

## Example 2 -- Answer produced without evidence

```text
Observed behavior:
  The model answers a current-policy question even though no current policy source is present.

Layer 1B-A primary mechanism:
  B8 Cooperative Completion Prior

Layer 1B-B modifiers:
  B6 misleadingly high Epistemic Expression
  B7 weak Distributional Fit for freshness-sensitive policy knowledge

Layer 2 fault:
  unsupported assertion
  weak confidence calibration

Layer 3 control gap:
  no evidence requirement
  no freshness check
  no abstention rule when governing source is absent
```

## Example 3 -- Stale knowledge overrides retrieved evidence

```text
Observed behavior:
  The model gives an outdated API answer despite a current documentation excerpt in context.

Layer 1B-A primary mechanism:
  B10 Knowledge-Signal Blending

Layer 1B-B modifiers:
  B7 weak Distributional Fit for current API details
  B6 overconfident Epistemic Expression

Layer 2 fault:
  parametric-prior override
  evidence-claim mismatch
  stale factual answer

Layer 3 control gap:
  no source-priority rule
  no claim-source support check
  no current-documentation requirement
```

## Example 4 -- Inconsistent refusal under paraphrase

```text
Observed behavior:
  One phrasing receives a refusal, while an operationally equivalent phrasing receives compliance.

Layer 1B-A primary mechanism:
  B9 Policy-Boundary Generalization

Layer 1B-B modifiers:
  B3 high Interface Sensitivity

Layer 2 fault:
  policy-boundary inconsistency under paraphrase

Layer 3 control gap:
  no paraphrase-robust policy evaluation
  no policy classifier or external safety gate
  no escalation rule for ambiguous boundary cases
```

## Example 5 -- Correct answer, misleading style

```text
Observed behavior:
  The model gives a technically correct but overly certain answer where the source only weakly supports the claim.

Layer 1B-A primary mechanism:
  B5 Interaction-Style Realization

Layer 1B-B modifiers:
  B6 misleading Epistemic Expression

Layer 2 fault:
  misleading confidence / unsupported strength of claim

Layer 3 control gap:
  no confidence-communication rule
  no claim-strength validation
  no evidence-quality disclosure requirement
```

# Minimal Attribution Rule


Use the following rule to prevent category drift:

```text
If the question is "what learned behavior is operating?":
  use Layer 1B-A.

If the question is "along what dimension did that behavior vary, destabilize, or become risky?":
  use Layer 1B-B.

If the question is "what went wrong behaviorally?":
  use Layer 2.

If the question is "what control should have bounded, detected, recovered from, or governed it?":
  use Layer 3.
```

# Naming Notes


The proposed names intentionally preserve the existing B-code identifiers while tightening the taxonomy.

| Existing / prior label | Proposed label | Reason |
|---|---|---|
| B1 Learned Natural-Language Task Induction | B1 Task Induction | Shorter; keeps the same concept. |
| B2 In-Context Demonstration Conditioning / In-Context Learning | B2 In-Context Conditioning | Broader than demonstrations; includes schemas, rubrics, local definitions, source documents, and corrections. |
| B3 Natural-Language Interface Sensitivity | B3 Interface Sensitivity | Shorter; explicitly treated as an axis. |
| B4 Plural Valid-Output Space | B4 Output Equivalence Space | More precise; describes the geometry of valid outputs. |
| B5 Learned Interaction-Style and Persona Priors | B5 Interaction-Style Realization | Narrows the scope to surface realization, avoiding overlap with B8 and B9. |
| B6 Generated Self-Assessment and Confidence Language | B6 Epistemic Expression | Broader; includes uncertainty, evidence, verification, limitation, and self-assessment language. |
| B7 Distribution-Conditional Competence | B7 Distributional Fit / Competence Envelope | Makes the modifier role clearer. |
| B8 Learned Cooperative Completion Prior | B8 Cooperative Completion Prior | Shorter; keeps the same concept. |
| B9 Learned Policy-Boundary Generalization | B9 Policy-Boundary Generalization | Shorter; keeps the same concept. |
| B10 Parametric Prior Persistence and Temporal Blending | B10 Knowledge-Signal Blending | Broader than temporal staleness; includes parametric, retrieved, contextual, temporal, and conversation-local signal conflict. |

# Relationship to Adjacent Layers

## Relationship to Layer 0


Layer 0 describes natural language as the communication substrate. It includes ambiguity, vagueness, underspecification, context dependence, pragmatic inference, discourse structure, and social meaning.

Layer 1B describes the learned behavioral features that let the model operate over that substrate.

```text
Layer 0:
  Natural-language inputs are ambiguous, context-sensitive, pragmatic,
  discourse-dependent, and socially framed.

Layer 1B:
  The model learns behavioral regularities for inferring tasks, using context,
  completing requests, expressing confidence, and mapping requests into
  assistant-like response regions.
```

## Relationship to Layer 1A


Layer 1A describes primitive model and inference mechanisms, such as tokenization, static parametric priors, finite context, in-band control/data representation, attention-mediated context integration, autoregressive generation, distributional token scoring, and decoding path selection.

Layer 1B describes learned behavioral features built on top of those mechanisms.

```text
Layer 1A:
  The model processes and generates token sequences.

Layer 1B:
  The model behaves as if it can infer tasks, adapt to local context,
  follow assistant-style conventions, and blend knowledge signals.
```

## Relationship to Layer 2


Layer 2 names the recurring behavioral fault mode.

```text
Layer 1B feature:
  The model infers a task from natural-language context.

Layer 2 fault:
  The model infers the wrong task.
```

```text
Layer 1B feature:
  The model tends to produce a cooperative completion.

Layer 2 fault:
  The model produces an unsupported assertion instead of abstaining.
```

## Relationship to Layer 3


Layer 3 names the system control, missing control, or control failure around the model behavior.

```text
Layer 1B feature:
  B10 Knowledge-Signal Blending

Layer 2 fault:
  stale factual answer

Layer 3 control:
  source freshness rule, retrieval authority ranking, claim-source validation,
  abstention when current evidence is absent
```


Layer 3 controls do not remove Layer 1B features. They bound, detect, recover from, monitor, or govern the downstream fault modes those features can produce.

# Short Form

```text
Layer 1B — Learned Behavioral LLM Features

1B-A. Primary learned behavioral mechanisms
  B1  Task Induction
  B2  In-Context Conditioning
  B8  Cooperative Completion Prior
  B9  Policy-Boundary Generalization
  B10 Knowledge-Signal Blending
  B5  Interaction-Style Realization

1B-B. Cross-cutting behavioral axes
  B3  Interface Sensitivity
  B4  Output Equivalence Space
  B6  Epistemic Expression
  B7  Distributional Fit / Competence Envelope
```
