---
draft: false
toc: true
title: "LLM Features"
description: "The properties of language, the model, and the deployed system that make LLM behavior possible, sorted into five classes, with how long findings about each class have lasted across model releases and what a product does with each."
linkTitle: "LLM Features"
---

[LLM capabilities]({{< ref "ai/heuristics/llm-capabilities" >}}) say what a product does for a kind of user; [LLM primitives]({{< ref "ai/heuristics/llm-primitives" >}}) say which operation the system performs on information. Features sit one level lower: a feature is a stable property of the language interface, the model, or the deployed system that makes a behavior possible or likely. A feature is not a fault. The pressure to answer (B8) is a feature; an answer without support is the fault. For the useful abilities in plain terms, with examples, see [What LLMs are good at]({{< ref "ai/heuristics/what-llms-are-good-at" >}}).

The classes restore the feature sets of the former causal stack, which the [causal-stack refactoring]({{< ref "ai-engineering/causal-stack/review-and-refactoring" >}}) retired as a diagnostic taxonomy while keeping as a design vocabulary. A second axis is how long findings about each kind of feature have held as models were released ([Queen and Zou 2026](#queen-2026)).

## Three levels


| Level | Question | Example | Where |
| --- | --- | --- | --- |
| **Capability** | What does the product do for a kind of user? | C2 learning the person's situation through conversation | [LLM capabilities]({{< ref "ai/heuristics/llm-capabilities" >}}) |
| **Primitive** | What operation does the system perform on information? | P6 decide whether there is enough to act | [LLM primitives]({{< ref "ai/heuristics/llm-primitives" >}}) |
| **Feature** | What about language, the model, or the system makes that operation work, fail, or need a surrounding system? | B8 the learned pressure to answer rather than abstain | This note |

## Five classes


| Class | Codes | What it is a property of | Changes with model releases? | What a product does with it |
| --- | --- | --- | --- | --- |
| 1. Natural-language conditions | N1-N5 | The input: language itself | No: they belong to language | Handles them: clarify, ground, keep history |
| 2. Architectural mechanisms | A1-A10 | The Transformer and its inference | Rarely within the model family; providers wrap them | Builds around them: each one calls for a system part |
| 3. Learned behaviors | B1, B2, B5, B8, B9, B10 | Training and post-training | Yes, with every release | Sells the useful side; guards the risky side |
| 4. Behavioral axes | B3, B4, B6, B7 | How the learned behaviors vary | The measured values change; the axes stay | Measures along them in evaluation |
| 5. Deployed-system features | D1-D10 | The model inside a product | No: they belong to the product | Operates them: traces, gates, budgets |

The A and B codes are the former stack's. The former system features were C1-C8; they are D1-D10 here, because C is taken by the capabilities.

## Class 1. Natural-language conditions


The medium is natural language, so the input is not a schema-complete command. These are conditions of the interface, not defects to remove; the former Layer 0 grouped them in five groups.

| Code | Group | Includes | Example | What it asks of the system |
| --- | --- | --- | --- | --- |
| N1 | Indeterminacy of meaning | Ambiguity, vagueness, underspecification, prototype categories, metaphor | "Schedule a meeting"; "nearby" | Ask instead of guessing (P6) |
| N2 | Context dependence | Implicit context, deixis, coreference, ellipsis, presupposition | "Do it like last time"; "tomorrow"; "she" | Resolve against the environment and history (P3, P8) |
| N3 | Pragmatic meaning and intent | Speech acts, implicature, relevance, politeness and indirectness, modality | "Some tests passed"; "Is John available?" | Infer the act being performed (B1) |
| N4 | Discourse structure | Discourse relations, repair and correction, mixed initiative, redundancy, incremental refinement | "No, I meant the 14-inch ones" | Apply corrections and keep them across steps (P8, G1) |
| N5 | Social framing | Epistemic stance, affective stance, authority and obligation, urgency, commitment strength | "ASAP"; "you must"; "I think" | Tell a preference from a requirement (B1, B9) |

## Class 2. Architectural mechanisms


Primitive properties of how a Transformer language model processes and generates tokens (the former Layer 1A). Each one is a reason a product needs a part outside the model. A hosted service may already hold some of these parts, such as history or caching; "the model is stateless" then describes the model, not the service.

| Code | Mechanism | Statement | The system part it calls for |
| --- | --- | --- | --- |
| A1 | Tokenized representation | Text, numbers, and identifiers reach the model as tokens whose boundaries need not match symbols | Exact values, counts, and identifiers handled by code or tools (C6) |
| A2 | Static parametric prior | Background knowledge is a fixed, compressed prior, not a lookup in an authoritative store | Current and private knowledge acquired at run time (P4); private entities supplied, since the prior cannot hold them (P3) |
| A3 | Finite ordered context | The model can condition only on what is in the bounded input sequence | Selection: retrieval, filtering, summaries, and a check that required facts survived them |
| A4 | Attention- and position-mediated integration | Information in the context has unequal influence | Layout and fewer distractors; a check that the used evidence is the one that mattered |
| A5 | In-band control and data | Instructions, data, examples, and evidence share one token channel | Isolation of untrusted text, and permissions enforced outside the model, for any agent that reads posts, mail, documents, or tool output |
| A6 | Stateless invocation | No native state across calls; continuity is reintroduced context | Memory and task state (P8, M3) |
| A7 | Autoregressive generation | Output extends a prefix token by token, so early tokens condition later ones | Plan before writing; check for early commitments that the rest defends |
| A8 | Distributional token scoring | The model scores continuations, not truth, evidence, or action correctness | Correctness judged outside generation (P5, validators); diversity not assumed |
| A9 | Decoding path selection | The output is one decoded path through the scores | Repeated runs; a decision about sampling settings (D1) |
| A10 | Compute limits | Token, latency, and compute budgets bound each request | The operating envelope (D10) |

## Class 3. Learned behaviors


Behaviors that emerge from training, post-training, and in-context conditioning (the former Layer 1B-A). They are why an LLM is useful at all, and each has a side that needs guarding.

| Code | Behavior | Statement | What it enables | What it risks |
| --- | --- | --- | --- | --- |
| B1 | Task induction | The model infers the operation, scope, and output form from natural-language cues, not from a typed contract | One interface for many tasks; every capability C1-C14 rests on it | Wrong task, scope, or constraint force |
| B2 | In-context conditioning | Examples, schemas, rubrics, definitions, corrections, and documents in the prompt change behavior without changing weights | Customization without training: a client's entity set, a rubric, a house style | Overfitting to examples; instructions lost across many turns |
| B8 | Cooperative completion prior | A learned posture that favors answering and progress over abstaining, asking, or refusing | Useful answers by default | Answers without evidence; no clarifying question; agreeing with the user |
| B9 | Policy-boundary generalization | Requests are mapped to comply, refuse, redirect, or escalate by semantic generalization, not by rules | Sensible handling of requests nobody anticipated | Inconsistent refusals under paraphrase; over-refusal |
| B10 | Knowledge-signal blending | Parametric, retrieved, contextual, and conversational knowledge all shape the output unless authority and freshness are explicit | Background knowledge combined with supplied facts | Stale or competing sources blended; invented names, packages, and cases |
| B5 | Interaction-style realization | Tone, persona, hedging, verbosity, and refusal wording are learned priors of their own | Conversation that people want to continue | Style that misleads about substance; praise that follows the user |

## Class 4. Behavioral axes


Dimensions along which the learned behaviors vary (the former Layer 1B-B). They are modifiers, not causes; evaluation varies them on purpose.

| Code | Axis | Question | What an evaluation varies |
| --- | --- | --- | --- |
| B3 | Interface sensitivity | Does behavior change under equivalent wording, order, format, language, or framing? | Paraphrases, orderings, languages, answer positions |
| B4 | Output equivalence space | Does the task have many valid outputs or one exact one? | Judgment by meaning for wide spaces; reference checks (RF) for narrow ones |
| B6 | Epistemic expression | Is the confidence language a calibrated measure? It is generated text | Stated confidence against measured correctness; abstention on unanswerable cases |
| B7 | Competence envelope | How close is the task to what the model was trained and post-trained on? | Slices by domain, language, format, and evidence availability |

## Class 5. Deployed-system features


Properties that appear once a model is inside a product (the former Layer 1C). They make the system empirical: quality has to be observed under representative conditions, not inferred from its structure.

| Code | Former | Feature | Question |
| --- | --- | --- | --- |
| D1 | C1 | Behavioral outcome variability | Does equivalent behavior hold across repeated and varied runs? |
| D2 | C2 | Soft correctness surface | What counts as acceptable when there is no single exact answer? |
| D3 | C3 | Compositional pipeline | Which component's handoff produced the first mismatch? |
| D4 | C4 | Agentic state-action loop | How does generation become tool calls, state changes, and external effects? |
| D5 | C5a | Runtime context drift | Did hidden conditions (sources, versions, state) change while the input stayed the same? |
| D6 | C5b | Feedback and data-action coupling | Does the system's own output return later as evidence or as state? |
| D7 | C5c | Change non-locality | Did a local change degrade another slice or workflow? |
| D8 | C6 | Weak native observability | Can a failure be traced to the component or condition responsible? |
| D9 | C7 | Policy and trust-boundary mediation | Where are safety, privacy, and authorization actually enforced? |
| D10 | C8 | Quality-cost-latency envelope | What quality is feasible within the budget, and what is cut when a limit is reached? |

## Durability across model releases


Queen and Zou revisited 50 published findings about LLMs on 20 models released from July 2024 to February 2026 ([Queen and Zou 2026](#queen-2026)). By February 2026, 22 had expired (the effect fell to a fifth of the paper's or less), 17 had weakened, 8 persisted, and 3 had strengthened. Expired claims lasted 14.7 months from publication to expiration at the median. Their reading: failures with one right answer, which developers can measure and train against, fade; preferences and judgment stay ([Queen and Zou 2026](#queen-2026)).

Sorted by the classes above, the findings fall into three bands. The article groups claims by research area; the features in brackets are this note's assignment ([Queen and Zou 2026](#queen-2026)). The article's claim numbers (C1-C50) are its own, not the capabilities. *e* is the remaining effect at February 2026 (1 is as strong as in the paper, 0 is gone).

| Band | Kind of finding | Claims: *e* [features] |
| --- | --- | --- |
| **Fading** | Capability failures with a right answer | Miscounting letters, C35: 0.02 [A1]; base-9 arithmetic, C6: 0.02 [B7]; facts lost in the middle of long contexts, C7: 0.07 [A4]; fabricated citations, C11: 0.03 [B8, B10]; abandoning a correct answer when challenged, C16: 0.08 [B8, B5]; injected tool output hijacking agents, C25: -0.02 [A5]; answer-letter bias, C12: 0.02 [B3]; premise order, C22: 0.26 [B3] |
| **Shrinking** | Structural limits, weaker but measurable | Reversal curse, C13: 0.53 [A2, A7]; two-hop questions, C1: 0.32 [A2]; instructions arriving over many turns, C39: 0.28 [N4, B2]; "ignore previous instructions", C2: 0.25 [A5]; invented packages, C30: 0.31 [B10]; legal hallucinations, C20: 0.73 [B10, B7]; judges swayed by answer order, C4: 0.53 [B3] |
| **Persistent** | Preferences and judgment, no single right answer | Answering from answerless documents, C10: 1.29 [B8]; not abstaining on unanswerable questions, C41: 1.16 [B8, B6]; praise that follows the user, C17: 1.85 [B8, B5]; affirming users more than humans do, C42: 1.06 [B8, B5]; endorsing problematic actions, C43: 1.12 [B8]; judges preferring their own output, C28: 2.36 [A8, B7]; near-identical answers to open prompts, C45: 1.00 [A8, A9, B4]; non-uniform random numbers, C29: 1.70 [A8, A9]; a left political lean, C21: 0.99 [A2] |

The article adds two cautions ([Queen and Zou 2026](#queen-2026)). A verdict is a trend across the panel, not every model: fabricated citations expired overall, yet one recent model still fabricated 69% of its references. And a finding describes particular models at a particular date, so a note that relies on one should carry the model and the date.

## Reading the classes for ideas


1. **Build on what lasts.** Classes 1, 2, and 5 do not expire with a model release. The parts they call for stay needed: acquisition because of A2 and A3, memory because of A6, isolation because of A5, exact computation because of A1 and A8. A provider may absorb some of them (longer context, hosted memory), but a client's private entities, records, and state stay outside any model.
2. **Do not build on a fading failure.** An idea whose value is compensating for a capability failure (counting, citation fabrication, a fact lost in a long context) loses that value in about 15 months at the median. This adds a time horizon to the bare-model test in [Deciding whether to build an idea]({{< ref "ai/heuristics" >}}#3-deciding-whether-to-build-an-idea): ask not only whether today's chat assistant already solves the problem, but whether the next model release will absorb a wrapper built around a current error.
3. **Guard the persistent dispositions.** The persistent band is where a product layer keeps its value. In this list, "claim" marks a claim number from the shelf-life study ([Queen and Zou 2026](#queen-2026)), not a capability code:
   - Answering without support and not abstaining (claims C10 and C41; B8) are what `G4` Sufficiency and `G5` No implied completeness in [LLM primitives]({{< ref "ai/heuristics/llm-primitives" >}}) guard against. An evidence-and-decision layer aims at a persisting effect, not a fading one.
   - Agreeing with and praising the user (claims C17, C42, and C43; B8, B5) bear on every product that uses capability `C2` or `C4`: intake assistants, interview or sales coaching, and reflective check-ins need an explicit rule against affirming by default, judged by a reviewer (`HR`, `EV`).
   - Judges preferring their own output (claim C28, strengthened) bears on any LLM-as-judge evaluation: use a judge from another model family and validate it against human-reviewed examples (`EV`).
   - Sameness across open answers (claims C45 and C29; A8, A9, B4) bears on recommendation, brainstorming, and simulation products (capabilities `C1`, `U9`): diversity has to be designed, not sampled.
4. **Measure along the axes at every release.** Class 4 and D1 are what an evaluation varies. A finding about a model is checked again on the next model before it is relied on.

## Features behind the primitives


| Primitive | Relies on | Needed because of | Has to guard |
| --- | --- | --- | --- |
| P1 Recognize | B7 on noisy speech and images | N1, N2: names and homophones | B8: guessing an unclear word |
| P2 Extract | B1, B2: a schema in context | A1, B4: exact, narrow outputs | B8: filling a missing field |
| P3 Ground | B2: the entity set in context | A2: private entities are not in the prior; N2 | B10: the prior winning over the client's entity |
| P4 Acquire | B1: forming a query | A2, A3 | B10: blending sources of different authority and age |
| P5 Judge | B2: a rubric in context | A8: scores are not truth | B6; a judge's preference for its own output |
| P6 Decide sufficiency | -- | N1: underspecified requests | B8: answering anyway (claims C10 and C41 persist) |
| P7 Compose | B1, B5 | A7: path-dependent writing | B10, B6: provenance lost, overconfident wording |
| P8 Remember | B2: reintroduced context | A6, A3 | D6: own output returning as evidence; B10: stale memory |
| P9 Link | B2: earlier records in context | A6, A3: earlier records must be retrieved and reintroduced; N2 | D6: the system's own links returning as evidence; B8: merging rather than leaving two records apart |

## Using these labels


The labels are a vocabulary for designing ideas and for forming hypotheses. They are not diagnoses: the current [causal-stack guide]({{< ref "ai-engineering/causal-stack" >}}) keeps observation, possible explanation, proposed change, and customer outcome apart, and warns against reading a mechanism from a symptom. An omitted fact does not show an attention failure (A4), and confident wording does not show calibration (B6). See [Model and system behavior]({{< ref "ai-engineering/causal-stack/reference/model-and-system" >}}) for the scoped background findings, and [Debugging]({{< ref "ai-engineering/causal-stack/debugging" >}}) for investigating a concrete case.

## Further reading


- [Huang et al. 2023](/sources/6e9cd984736f39e4b45df0660d4254f8.bin), *A Survey on Hallucination in Large Language Models* ([doi:10.1145/3703155](https://doi.org/10.1145/3703155))
- [Lin et al. 2025](/sources/52025ac74c2419770ceb4b6df4045974.bin), *LLM-based Agents Suffer from Hallucinations: A Survey of Taxonomy, Methods, and Directions* ([arXiv:2509.18970](https://arxiv.org/abs/2509.18970))

## References


- Queen and Zou (2026). [The shelf life of LLM findings](https://zou-group.github.io/llm-claims-shelf-life/). Saved copy: [The shelf life of LLM findings]({{< ref "ai/capabilities/input/shelf-life" >}}). ^queen-2026
