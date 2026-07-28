---
draft: false
toc: true
title: "Layer 0 Alt"
linkTitle: "Layer 0 Alt"
---
# 0. Outline:

```
Layer 0 — Natural Language Interface Substrate

0. Front Matter
   0.1 Purpose
   0.2 Scope
   0.3 Core thesis
   0.4 Audience
   0.5 How to read this document
   0.6 Layer 0 invariants

1. Meaning as a Layered Phenomenon
   1.1 Surface form
   1.2 Lexical meaning
   1.3 Constructional meaning
   1.4 Compositional semantics
   1.5 Pragmatic meaning
   1.6 Discourse meaning
   1.7 Social and interactional meaning

2. Indeterminacy and Compression
   2.1 Ambiguity
       2.1.1 Lexical ambiguity
       2.1.2 Syntactic ambiguity
       2.1.3 Scope ambiguity
       2.1.4 Referential ambiguity

   2.2 Vagueness
       2.2.1 Fuzzy boundaries
       2.2.2 Gradable terms
       2.2.3 Context-relative thresholds

   2.3 Underspecification
       2.3.1 Missing parameters
       2.3.2 Recoverable omissions
       2.3.3 Defaults and assumptions
       2.3.4 User-side economy of expression

   2.4 Prototype-Based Categories
       2.4.1 Category resemblance
       2.4.2 Central and peripheral cases
       2.4.3 Domain-specific prototypes

   2.5 Metaphor and Conceptual Transfer
       2.5.1 Technical metaphor
       2.5.2 Evaluative metaphor
       2.5.3 Structural metaphor

   2.6 Summary: Why Natural-Language Meaning Is Partial, Graded, and Compressed

3. Context, Reference, and Grounding
   3.1 Implicit Context
       3.1.1 User context
       3.1.2 Task context
       3.1.3 Domain context
       3.1.4 Organizational context
       3.1.5 Preference context

   3.2 Deixis
       3.2.1 Person deixis
       3.2.2 Time deixis
       3.2.3 Place deixis
       3.2.4 Discourse deixis
       3.2.5 Social deixis

   3.3 Coreference
       3.3.1 Pronoun resolution
       3.3.2 Named-entity resolution
       3.3.3 Repeated descriptions
       3.3.4 Ambiguous referents

   3.4 Ellipsis
       3.4.1 Sentence-level ellipsis
       3.4.2 Turn-level ellipsis
       3.4.3 Task-state ellipsis
       3.4.4 Recoverability conditions

   3.5 Presupposition
       3.5.1 Entity presuppositions
       3.5.2 Event presuppositions
       3.5.3 Authority presuppositions
       3.5.4 State presuppositions

   3.6 Interface Grounding
       3.6.1 Selected object
       3.6.2 Active document
       3.6.3 Cursor position
       3.6.4 Viewport state
       3.6.5 Highlighted text
       3.6.6 Current UI focus

   3.7 Summary: How Meaning Depends on External, Prior, and Situated State

4. Communicative Force and Intent
   4.1 Pragmatics in the Broad Sense
       4.1.1 Meaning as use
       4.1.2 Literal meaning versus intended meaning
       4.1.3 Contextual inference

   4.2 Speech Acts
       4.2.1 Request
       4.2.2 Command
       4.2.3 Question
       4.2.4 Suggestion
       4.2.5 Warning
       4.2.6 Correction
       4.2.7 Confirmation
       4.2.8 Refusal
       4.2.9 Evaluation

   4.3 Indirect Speech Acts
       4.3.1 Ability question as request
       4.3.2 Observation as implied request
       4.3.3 Critique as revision request
       4.3.4 Preference as constraint

   4.4 Implicature
       4.4.1 Relevance implicature
       4.4.2 Scalar implicature
       4.4.3 Consequential implicature
       4.4.4 Domain-specific implicature

   4.5 Relevance Filtering
       4.5.1 Task-relevant interpretation
       4.5.2 Domain-relevant interpretation
       4.5.3 User-goal-relevant interpretation
       4.5.4 Salience and suppression of irrelevant meanings

   4.6 Action Fan-Out
       4.6.1 Single utterance to single action
       4.6.2 Single utterance to parameterized action
       4.6.3 Single utterance to workflow
       4.6.4 Single utterance to multi-step orchestration

   4.7 Summary: How Utterances Become Communicative Acts

5. Discourse State and Conversational Mutation
   5.1 Discourse Structure
       5.1.1 Sequence
       5.1.2 Contrast
       5.1.3 Cause
       5.1.4 Condition
       5.1.5 Exception
       5.1.6 Elaboration
       5.1.7 Summary

   5.2 Discourse Markers
       5.2.1 however
       5.2.2 therefore
       5.2.3 actually
       5.2.4 instead
       5.2.5 unless
       5.2.6 for example
       5.2.7 in short

   5.3 Repair and Correction
       5.3.1 Self-repair
       5.3.2 Other-repair
       5.3.3 Referent correction
       5.3.4 Parameter correction
       5.3.5 Intent correction
       5.3.6 Scope correction

   5.4 Incremental Refinement
       5.4.1 Adding constraints
       5.4.2 Removing constraints
       5.4.3 Narrowing the search space
       5.4.4 Broadening the search space
       5.4.5 Reprioritizing criteria

   5.5 Mixed Initiative
       5.5.1 User-led initiative
       5.5.2 System-led clarification
       5.5.3 Collaborative narrowing
       5.5.4 Reframing and negotiation

   5.6 Redundancy and Emphasis
       5.6.1 Repetition as priority signal
       5.6.2 Repetition as urgency signal
       5.6.3 Repetition as contrast
       5.6.4 Repetition as repair

   5.7 Non-Monotonicity
       5.7.1 Later turns invalidating earlier turns
       5.7.2 Retraction of extracted parameters
       5.7.3 Soft cancellation
       5.7.4 Partial revision
       5.7.5 Conflicting updates

   5.8 Conversational Memory Limits
       5.8.1 Stale references
       5.8.2 Lost salience
       5.8.3 Conflicting constraints
       5.8.4 Overloaded discourse context

   5.9 Summary: How Meaning Evolves Across Turns

6. Social, Epistemic, and Priority Signals
   6.1 Politeness and Face Management
       6.1.1 Softened requests
       6.1.2 Indirect criticism
       6.1.3 Deference
       6.1.4 Mitigation
       6.1.5 Face-saving formulations

   6.2 Epistemic Stance
       6.2.1 Certainty
       6.2.2 Uncertainty
       6.2.3 Inference
       6.2.4 Reported knowledge
       6.2.5 Evidence strength

   6.3 Affective Stance
       6.3.1 Frustration
       6.3.2 Concern
       6.3.3 Skepticism
       6.3.4 Satisfaction
       6.3.5 Reluctance

   6.4 Modality
       6.4.1 Possibility
       6.4.2 Necessity
       6.4.3 Permission
       6.4.4 Obligation
       6.4.5 Prohibition

   6.5 Authority and Role
       6.5.1 Speaker authority
       6.5.2 Addressee authority
       6.5.3 Institutional role
       6.5.4 Ownership
       6.5.5 Approval rights

   6.6 Urgency and Priority
       6.6.1 Explicit deadlines
       6.6.2 Relative deadlines
       6.6.3 Consequence framing
       6.6.4 Repeated emphasis
       6.6.5 Priority tradeoffs

   6.7 Commitment Strength
       6.7.1 Strong assertion
       6.7.2 Tentative assertion
       6.7.3 Preference
       6.7.4 Recommendation
       6.7.5 Hard requirement

   6.8 Summary: How Stance Changes Interpretation

7. Failure, Risk, and Repair Semantics
   7.1 Interpretive Failure Types
       7.1.1 Wrong referent
       7.1.2 Wrong intent
       7.1.3 Missing constraint
       7.1.4 Stale context
       7.1.5 Hallucinated context
       7.1.6 Over-execution
       7.1.7 Under-execution

   7.2 Ambiguity Severity
       7.2.1 Harmless ambiguity
       7.2.2 Recoverable ambiguity
       7.2.3 Execution-blocking ambiguity
       7.2.4 Safety-critical ambiguity

   7.3 Confidence and Commitment
       7.3.1 Infer silently
       7.3.2 Infer with disclosure
       7.3.3 Ask for clarification
       7.3.4 Offer alternatives
       7.3.5 Require confirmation
       7.3.6 Decline execution

   7.4 Repair Protocols
       7.4.1 Clarification question
       7.4.2 Confirmation
       7.4.3 Correction acceptance
       7.4.4 Rollback
       7.4.5 Partial execution
       7.4.6 Safe no-op

   7.5 Summary: When Uncertainty Requires Repair Rather Than Execution

8. Cross-Property Interaction
   8.1 How Properties Co-Occur
   8.2 Ambiguity plus Context Dependence
   8.3 Vagueness plus Urgency
   8.4 Deixis plus Interface Grounding
   8.5 Politeness plus Directive Force
   8.6 Repair plus Non-Monotonicity
   8.7 Modality plus Authority
   8.8 Examples of Multi-Property Utterances

9. Diagnostic Property Index
   9.1 Property Table
   9.2 Core Question Per Property
   9.3 Example Per Property
   9.4 Required Resolution Type
   9.5 Risk Level
   9.6 Downstream Obligation

10. Worked Examples
   10.1 “Move it to tomorrow.”
   10.2 “Make this less aggressive.”
   10.3 “Send that to Sarah before the meeting.”
   10.4 “Actually, not that one — the cheaper option from yesterday.”
   10.5 “We probably should not change the public API before launch.”
   10.6 “Onboard the new contractor.”
   10.7 “Same as before, but only the urgent ones.”

11. Glossary
   11.1 Ambiguity
   11.2 Vagueness
   11.3 Underspecification
   11.4 Deixis
   11.5 Coreference
   11.6 Ellipsis
   11.7 Presupposition
   11.8 Pragmatics
   11.9 Speech act
   11.10 Implicature
   11.11 Discourse repair
   11.12 Mixed initiative
   11.13 Epistemic stance
   11.14 Modality
   11.15 Commitment strength
   11.16 Interface grounding
   11.17 Non-monotonicity

12. Final Summary
   12.1 Layer 0 as an irreducible substrate
   12.2 Meaning is distributed across multiple dimensions
   12.3 Context and pragmatics should remain distinct but adjacent
   12.4 Natural-language interpretation is dynamic, situated, and repairable
```

# 0. Front Matter


Layer 0 defines the natural-language substrate that exists before parsing, planning, tool use, validation, execution, or system policy.

Its purpose is not to describe how a system should implement natural-language understanding. Its purpose is to define what natural-language input is like before implementation begins: how meaning is formed, how it depends on context, how intent is inferred, how discourse mutates over time, and how social, epistemic, and priority signals change interpretation.

Layer 0 is therefore the descriptive foundation for any architecture that accepts natural language at its boundary.

## 0.1 Purpose


This document defines the foundational properties of natural language as an interface substrate.

Natural language is not simply a less precise way to express formal commands. It is a situated communicative system. Speakers routinely use ambiguity, vagueness, underspecification, deixis, ellipsis, presupposition, indirectness, implicature, repair, and social signaling. These are not peripheral defects. They are normal operating features of natural language.

It answers questions such as:

|Question|Layer 0 concern|
|---|---|
|Why does the same utterance support multiple interpretations?|Indeterminacy and compression|
|Why does meaning depend on prior discourse, visible state, time, speaker, or task?|Context, reference, and grounding|
|How does a statement become a request, warning, refusal, or correction?|Communicative force and intent|
|How do later turns revise or invalidate earlier ones?|Discourse state and conversational mutation|
|How do certainty, urgency, politeness, authority, or reluctance affect interpretation?|Social, epistemic, and priority signals|
|When is inference acceptable, and when is repair required?|Failure, risk, and repair semantics|

The document is intended to prevent a recurring architectural mistake: treating natural-language failures as isolated model errors, prompt-design issues, or missing parameters when they are often consequences of deeper linguistic structure.

For example:

```text
"Move it to tomorrow."
```


This utterance is compact, natural, and ordinary. But it depends on several unresolved properties:

|Expression|Required resolution|
|---|---|
|"it"|Referent: meeting, task, deadline, document, event, item|
|"tomorrow"|Date relative to utterance time and timezone|
|"move"|Reschedule, reorder, relocate, defer, reassign|
|whole utterance|Likely directive, but exact action depends on task context|

Layer 0 does not treat this as malformed input. It treats it as a normal case of natural-language communication.

The purpose of the document is therefore:

```text
To define the irreducible properties of natural-language input that downstream systems must preserve, resolve, defer, or safely reject.
```

## 0.2 Scope


This document describes natural language at the interface boundary.

It covers the linguistic and semantic properties that shape interpretation before downstream execution occurs. It is concerned with what user language means, how that meaning is distributed, and why interpretation is often non-trivial.

Layer 0 includes:

|Included|Description|
|---|---|
|Surface and conventional meaning|How words, constructions, and sentence structure contribute meaning|
|Indeterminacy|Ambiguity, vagueness, underspecification, prototype categories, metaphor|
|Context dependence|Implicit context, deixis, coreference, ellipsis, presupposition, grounding|
|Pragmatic intent|Speech acts, indirect requests, implicature, relevance, action fan-out|
|Discourse mutation|Repair, correction, refinement, non-monotonic updates, memory limits|
|Social and epistemic stance|Politeness, certainty, affect, authority, urgency, commitment strength|
|Interpretive failure|Wrong referent, wrong intent, missing constraints, over-execution, under-execution|
|Repair semantics|Clarification, confirmation, correction acceptance, rollback, partial execution, safe no-op|

Layer 0 excludes implementation architecture.

It does not define:

|Excluded|Reason|
|---|---|
|Parsing algorithms|These belong to implementation layers|
|Model architecture|Layer 0 describes input properties, not model internals|
|Tool-calling strategy|Tool orchestration happens after interpretation|
|Policy enforcement|Policy determines what may be done, not what language means|
|Memory architecture|Memory design implements discourse tracking but is not itself Layer 0|
|Validation systems|Validation checks downstream commitments against constraints|
|Execution semantics|Execution belongs to later operational layers|
|UI design patterns|UI may supply grounding, but Layer 0 describes the grounding need itself|

Layer 0 therefore remains descriptive rather than prescriptive.

It defines the input substrate. It does not define the machinery that processes it.

This separation is deliberate. Without it, the document would conflate three different questions:

|Question|Belongs to|
|---|---|
|What linguistic phenomena are present in natural-language input?|Layer 0|
|How should a system represent, infer, or track those phenomena?|Later architecture layers|
|What actions should a system be allowed to take?|Policy, validation, and execution layers|

Layer 0 is restricted to the first question.

## 0.3 Core Thesis


Natural language is a situated, context-sensitive, pragmatically inferred, socially mediated communicative system.

Its meaning is not located only in words or syntax. Meaning is distributed across multiple dimensions:

```text
Natural-language meaning
├── surface form
├── conventional semantic content
├── implicit context
├── reference and grounding
├── pragmatic intent
├── discourse history
├── social and epistemic stance
├── priority and urgency
└── repair and revision over time
```


The core thesis of this document is:

```text
Natural language is not an imprecise command language.
It is a distinct interface substrate whose normal operation depends on indeterminacy, context, inference, discourse mutation, and social stance.
```


This thesis has several consequences.

First, natural-language interpretation cannot be reduced to sentence decoding.

A sentence may be grammatically complete and still be uninterpretable without context:

```text
"Send it to her tomorrow."
```


The sentence contains an action, object, recipient, and time expression. Yet each depends on context:

|Element|Dependency|
|---|---|
|"it"|Prior discourse, selected object, active task, visible artifact|
|"her"|Prior referent, social context, contact list, discourse salience|
|"tomorrow"|Utterance date, timezone, relevant calendar|
|"send"|Channel, permission, version, approval status|
|whole utterance|Request, command, reminder, correction, or hypothetical instruction|

Second, natural-language interpretation cannot be reduced to literal meaning.

A sentence may literally ask one thing while pragmatically doing another:

```text
"Can you send this to Anna?"
```


Literal meaning:

```text
Are you able to send this to Anna?
```


Typical intended meaning:

```text
Please send this to Anna.
```


The ability question functions as a request. The literal form remains relevant, but it does not exhaust the communicative act.

Third, natural-language interpretation cannot be reduced to filling missing parameters.

Underspecification is not merely absence. It is often efficient compression.

A user normally does not say:

```text
Please create a 30-minute calendar event with Alex Chen from the design team,
using the first mutually available slot next week during working hours,
with the title "Roadmap review",
using video conferencing,
and include the current project document as context.
```


The user says:

```text
"Schedule a roadmap review with Alex next week."
```


This is not defective language. It is economical language. It assumes context, shared conventions, defaults, and follow-up repair.

Fourth, natural-language interpretation is non-monotonic.

Later utterances can revise earlier ones:

```text
"Make it shorter."
"Actually, keep the detail but shorten the introduction."
```


The second turn does not simply add information. It changes the interpretation of the first turn. "Shorter" is no longer a general compression instruction. It becomes a localized revision targeting the introduction while preserving detail.

Fifth, natural-language meaning includes stance.

Compare:

|Utterance|Interpretation difference|
|---|---|
|"Change the API."|Direct instruction|
|"You can change the API."|Permission|
|"You should change the API."|Recommendation or weak obligation|
|"You must change the API."|Strong obligation|
|"Maybe avoid changing the API."|Tentative warning or preference|
|"Do not change the API."|Prohibition|

The underlying topic is the same. The stance changes the force.

Sixth, natural-language failure is not binary.

An utterance can be:

|Failure status|Example|
|---|---|
|Interpretable enough to proceed|"Make this clearer."|
|Interpretable but assumption-sensitive|"Make this more professional."|
|Ambiguous but recoverable|"Use the other one."|
|Execution-blocking|"Delete the old file."|
|Safety-critical|"Share this externally."|

The appropriate response depends on confidence, consequence, reversibility, and available repair.

### Why this structure follows from the thesis


The document structure is chosen to follow the path by which natural-language meaning becomes actionable interpretation.

It begins with meaning itself, then moves through the forces that make meaning partial, situated, intentional, dynamic, stance-bearing, and risk-sensitive.

The structure is not organized as a traditional linguistics survey. It is organized around the interpretive obligations created by natural-language input.

The sequence is:

```text
1. Meaning as a Layered Phenomenon
2. Indeterminacy and Compression
3. Context, Reference, and Grounding
4. Communicative Force and Intent
5. Discourse State and Conversational Mutation
6. Social, Epistemic, and Priority Signals
7. Failure, Risk, and Repair Semantics
```


Each section answers a different interpretive question.

|Section|Core question|Why it comes here|
|---|---|---|
|1. Meaning as a Layered Phenomenon|What kinds of meaning exist?|Establishes that language has multiple simultaneous meaning layers.|
|2. Indeterminacy and Compression|Why is meaning not fully explicit or exact?|Shows why natural-language input often lacks a single fully specified interpretation.|
|3. Context, Reference, and Grounding|What external or prior state is needed?|Explains how underspecified language becomes interpretable through context.|
|4. Communicative Force and Intent|What is the speaker doing by saying this?|Moves from semantic content to action-oriented intent.|
|5. Discourse State and Conversational Mutation|How does meaning change across turns?|Accounts for repair, refinement, correction, and non-monotonic updates.|
|6. Social, Epistemic, and Priority Signals|How strongly, urgently, or authoritatively is meaning presented?|Adds stance, authority, urgency, certainty, and commitment strength.|
|7. Failure, Risk, and Repair Semantics|When is inference insufficient?|Defines when ambiguity can be tolerated, clarified, confirmed, or blocked.|

This ordering is intentional.

Sections 1-3 establish the **semantic substrate**:

```text
What does the utterance say?
Why is it incomplete or non-exact?
What context is needed to interpret it?
```


Sections 4-6 establish the **interactional substrate**:

```text
What is the speaker trying to do?
How does the conversation change over time?
How does stance alter force, priority, and commitment?
```


Section 7 establishes the **repair substrate**:

```text
What can go wrong?
How severe is the uncertainty?
When should interpretation proceed, pause, ask, confirm, roll back, or safely no-op?
```


This structure reflects the central claim of the document:

```text
Natural-language understanding is not a single operation.
It is the coordinated resolution of layered meaning, indeterminacy, context, intent, discourse state, stance, and risk.
```

## 0.4 Audience


This document is written for people who design, evaluate, or reason about systems that accept natural-language input.

Primary audiences include:

|Audience|Use of this document|
|---|---|
|System architects|Identify which linguistic phenomena must be represented or controlled downstream|
|AI engineers|Distinguish linguistic ambiguity from model failure, missing context, or unsafe inference|
|Product designers|Understand why users phrase tasks indirectly, elliptically, or incrementally|
|UX researchers|Analyze how users rely on context, repair, and social stance in interaction|
|Prompt and conversation designers|Recognize when clarification, confirmation, or assumption disclosure is required|
|Policy and safety designers|Identify where uncertainty becomes operationally or socially risky|
|Technical writers|Use stable terminology for natural-language interface behavior|
|Researchers|Map interface behavior to linguistic categories without collapsing them into implementation details|

The document assumes the reader is comfortable with technical systems, but it does not require formal training in linguistics.

It introduces linguistic concepts only where they clarify interface behavior.

For example, the document does not discuss deixis as an abstract linguistic category for its own sake. It discusses deixis because expressions such as:

```text
this
that
here
there
now
tomorrow
the other one
same as before
```


are common in natural-language interfaces and cannot be interpreted without situational grounding.

Similarly, the document does not discuss speech acts for theoretical completeness. It discusses speech acts because systems must distinguish between:

```text
"Can you send this?"
"Did you send this?"
"Do not send this."
"Maybe send this later."
"I’m not comfortable sending this."
```


These utterances concern similar objects and actions, but they carry different communicative force.

The document is also useful for teams diagnosing natural-language interface failures.

A failure such as:

```text
The system sent the wrong file to the wrong Alex.
```


may involve several Layer 0 phenomena:

|Failure component|Layer 0 phenomenon|
|---|---|
|Wrong file|Referential ambiguity, stale context, interface grounding failure|
|Wrong Alex|Named-entity ambiguity, missing disambiguation|
|Premature send|Wrong intent, over-execution, missing confirmation|
|User dissatisfaction|Failed repair semantics, ignored risk level|

The audience should use Layer 0 as a diagnostic vocabulary before assigning responsibility to a model, prompt, memory component, UI state manager, policy layer, or execution system.

## 0.5 How to Read This Document


This document should be read as a layered specification of natural-language input properties.

It is not a linear pipeline in which every utterance passes cleanly through each section. Real utterances often involve many properties at once.

Example:

```text
"Could you maybe send that to Sarah before the meeting?"
```


This single utterance contains:

|Phrase|Layer 0 property|
|---|---|
|"Could you"|Indirect speech act, politeness|
|"maybe"|Softening, weak modality|
|"send"|Action intent|
|"that"|Deixis, referential grounding|
|"Sarah"|Named-entity reference, possible ambiguity|
|"before the meeting"|Temporal reference, presupposition|
|whole utterance|Request framed as ability question|

No single section fully explains the utterance. The sections are analytical lenses.

The recommended reading order is the document order:

```text
1 → 2 → 3 → 4 → 5 → 6 → 7
```


This order moves from lower-level meaning to higher-level interactional and repair behavior.

However, the document can also be read diagnostically.

|Problem observed|Start with|
|---|---|
|User input has multiple possible meanings|Section 2: Indeterminacy and Compression|
|User refers to "this," "that," "tomorrow," or "same as before"|Section 3: Context, Reference, and Grounding|
|User seems to imply an action without stating it directly|Section 4: Communicative Force and Intent|
|User corrects, revises, or changes their mind|Section 5: Discourse State and Conversational Mutation|
|User sounds hesitant, urgent, certain, frustrated, or authoritative|Section 6: Social, Epistemic, and Priority Signals|
|System is unsure whether to infer, ask, confirm, or stop|Section 7: Failure, Risk, and Repair Semantics|

Each section follows the same basic pattern:

```text
Concept
→ Explanation
→ Examples
→ Subtypes
→ Interpretive consequences
→ Summary
```


The summaries are intended to serve as quick operational references. The examples are intended to show how the phenomenon appears in ordinary user language.

### Why the document uses this structure instead of the original A-E grouping


The original taxonomy grouped the properties as:

```text
A. Indeterminacy of meaning
B. Context dependence
C. Pragmatic meaning and speaker intent
D. Discourse and conversational structure
E. Social and communicative framing
```


Those groups remain conceptually valid. They are preserved in substance.

The revised document reorganizes them into a more interface-oriented sequence:

```text
Meaning
→ Indeterminacy
→ Context
→ Intent
→ Discourse mutation
→ Stance
→ Failure and repair
```


This change has three reasons.

First, the revised structure separates introductory linguistic layering from the main property taxonomy.

Syntax, semantics, pragmatics, discourse, and social meaning are foundational layers. They explain that meaning is distributed. But they should not be mixed with every downstream property as if they were mutually exclusive categories.

Second, the revised structure makes the interpretation flow clearer.

A system or analyst must often reason in this order:

```text
What was said?
What is ambiguous, vague, or missing?
What context grounds it?
What act is being performed?
How does this update the conversation?
How does stance affect force?
Is it safe to infer, or is repair needed?
```


The revised outline follows that reasoning path.

Third, the revised structure gives failure and repair their own section.

The original taxonomy correctly identified repair and conversational structure, but risk-sensitive interpretation deserves explicit treatment. Natural-language uncertainty is not always benign. Some ambiguity is harmless. Some is recoverable. Some blocks execution. Some is safety-critical.

Separating **Failure, Risk, and Repair Semantics** makes the document more useful for real interface analysis without turning it into an implementation manual.

## 0.6 Layer 0 Invariants


Layer 0 is governed by a small set of invariants.

These invariants are the assumptions the rest of the document relies on.

### Invariant 1: Natural-language properties are irreducible


Layer 0 phenomena cannot be engineered away by asking users to be fully explicit, context-free, literal, unambiguous, and parameter-complete.

Users will continue to say things like:

```text
"Move it to tomorrow."
"Make this less aggressive."
"Same as before, but cheaper."
"Actually, not that one."
"Can you send this to Anna?"
"Maybe avoid changing the public API."
```


These utterances are not malformed. They are normal.

A system may constrain what it accepts, but natural language itself remains indeterminate, contextual, pragmatic, discourse-sensitive, and socially mediated.

### Invariant 2: Meaning is distributed, not localized


Meaning is not contained in a single token, sentence, or syntax tree.

It may be distributed across:

|Source|Example|
|---|---|
|Words|"send," "cancel," "urgent"|
|Grammar|Imperative, question, conditional|
|Context|selected file, current date, user role|
|Prior discourse|"the other one," "same as before"|
|Task state|current workflow or active document|
|Social stance|politeness, hesitation, authority|
|Domain convention|"breaking change," "client-ready"|
|Repair history|"No, I meant Monday"|

This invariant justifies the document's layered structure.

### Invariant 3: Indeterminacy is functional, not merely defective


Ambiguity, vagueness, and underspecification are not only sources of error. They also make communication efficient.

For example:

```text
"Find a reasonable hotel nearby."
```


This utterance omits exact price, distance, quality threshold, dates, room type, and amenities. Yet it is useful because the speaker expects context, defaults, preferences, and follow-up interaction to do part of the work.

Natural-language interfaces must therefore distinguish between:

|Case|Treatment|
|---|---|
|Productive underspecification|Infer or ask only where needed|
|Recoverable vagueness|Proceed with visible assumptions|
|Blocking ambiguity|Clarify before action|
|Safety-critical ambiguity|Confirm, restrict, or refuse|

The goal is not to eliminate indeterminacy. The goal is to handle it according to context and risk.

### Invariant 4: Context supplies grounding; pragmatics derives intent


Context and pragmatics are distinct but adjacent.

Context answers:

```text
What background state is relevant?
What does this refer to?
What prior discourse matters?
What is visible, selected, assumed, or presupposed?
```


Pragmatics answers:

```text
What is the speaker trying to do?
Is this a request, warning, correction, refusal, suggestion, or evaluation?
What is implied but unstated?
Which interpretation is relevant?
```


Example:

```text
"This is a little too aggressive."
```


Context resolves:

|Question|Example resolution|
|---|---|
|What is "this"?|Current draft|
|Which part?|Selected paragraph|
|What genre?|Client email|
|What audience?|External recipient|

Pragmatics infers:

|Question|Example resolution|
|---|---|
|What act is performed?|Evaluation plus revision request|
|What is implied?|Soften tone|
|Why "a little"?|Politeness and mitigation|
|What should change?|Less confrontational wording|

The document keeps context and pragmatics adjacent because interpretation normally requires both.

### Invariant 5: Natural-language interpretation is discourse-sensitive


Utterances are not isolated events. They occur inside a changing discourse state.

Example:

```text
"Find three options."
"The second one looks best."
"Make it cheaper."
"Actually, prioritize reliability."
```


Each turn depends on the previous ones.

The active meaning changes over time:

|Turn|State update|
|---|---|
|"Find three options."|Creates candidate set|
|"The second one looks best."|Marks option 2 as salient/preferred|
|"Make it cheaper."|Modifies option 2 or its plan|
|"Actually, prioritize reliability."|Revises priority ordering|

This invariant justifies the section on discourse mutation, repair, incremental refinement, and non-monotonicity.

### Invariant 6: Later turns can revise earlier meanings


Natural-language discourse is non-monotonic.

A later utterance can cancel, weaken, or replace an earlier one:

```text
"Send it today."
"Actually, wait for legal approval."
```


The second utterance changes the status of the first. It does not merely add a new independent instruction.

Possible update types include:

|Update type|Example|
|---|---|
|Cancellation|"Actually, don't send it."|
|Replacement|"Use Monday instead."|
|Narrowing|"Only the urgent ones."|
|Broadening|"Include contractors too."|
|Reprioritization|"Accuracy matters more than speed."|
|Softening|"It does not have to be that formal."|
|Repair|"No, Sarah from legal."|

This invariant is essential because natural-language interaction often constructs intent over multiple turns rather than stating it completely at the beginning.

### Invariant 7: Social stance is part of meaning


Politeness, certainty, urgency, affect, role, and commitment strength are not decorative additions to semantic content. They change interpretation.

Compare:

```text
"Send this today."
"Could you send this today?"
"Can you maybe send this today?"
"I need this sent today."
"Do not send this today."
"I’m not comfortable sending this today."
```


All concern sending and timing. But they differ in force, authority, politeness, urgency, and prohibition.

Social and epistemic signals affect whether an utterance should be interpreted as:

|Stance-sensitive interpretation|Example|
|---|---|
|Request|"Could you..."|
|Weak suggestion|"Maybe we should..."|
|Strong requirement|"We must..."|
|Warning|"This seems risky."|
|Refusal|"I'm not comfortable..."|
|Tentative claim|"I think..."|
|High-confidence assertion|"This is definitely..."|

This invariant justifies treating stance as structurally central rather than peripheral.

### Invariant 8: Interpretation must be risk-sensitive


The same degree of ambiguity can require different responses depending on consequence and reversibility.

Example:

```text
"Make this cleaner."
```


In a draft-editing context, this may be safe to infer.

Example:

```text
"Delete the old records."
```


In a data-management context, this may require clarification or confirmation.

Layer 0 therefore distinguishes between linguistic ambiguity and operational risk.

|Situation|Appropriate response pattern|
|---|---|
|Low-risk, reversible ambiguity|Infer silently or with disclosure|
|Medium-risk ambiguity|Ask clarification or offer alternatives|
|High-risk action|Require confirmation|
|Unsafe or impossible action|Decline execution or safe no-op|
|Conflicting constraints|Ask for prioritization or restate conflict|

This invariant justifies the final section on failure, risk, and repair semantics.

### Invariant 9: Repair is part of normal interpretation


Repair is not an exception path. It is a basic feature of natural-language interaction.

Users naturally correct, revise, clarify, and change their minds:

```text
"No, the other one."
"Actually, make it shorter."
"Sorry, I meant next Friday."
"Let me rephrase."
"Keep the structure, but change the tone."
```


Repair allows meaning to be negotiated over time.

Layer 0 treats repair as a first-class property because natural-language interpretation often becomes reliable only through interaction.

### Invariant 10: Layer 0 defines obligations, not implementations


Layer 0 identifies the interpretive obligations created by natural-language input.

It does not specify how those obligations must be implemented.

For example:

|Layer 0 obligation|Later implementation question|
|---|---|
|Resolve referents|Use memory, UI state, entity linking, or clarification?|
|Interpret speech act|Use classifier, model inference, rules, or hybrid method?|
|Track discourse updates|Use conversation state, summaries, event log, or task graph?|
|Detect risk|Use policy engine, validator, permissions model, or human review?|
|Repair ambiguity|Ask question, offer options, require confirmation, or no-op?|

This invariant preserves the document's role as a substrate specification.

The document defines the **what**:

```text
What properties does natural-language input have?
What interpretive obligations do those properties create?
```


It does not define the **how**:

```text
How should a particular system represent, validate, execute, or enforce those obligations?
```

## 0.7 Front-Matter Summary


Layer 0 is the natural-language interface substrate.

Its central claim is that natural language is not an imprecise formal command language. It is a situated communicative system whose meaning is distributed across words, syntax, context, intent, discourse, stance, and repair.

The structure of this document follows from that claim.

```text
Meaning is layered.
Meaning is often compressed or indeterminate.
Meaning requires context and grounding.
Meaning expresses communicative force.
Meaning changes across discourse.
Meaning carries social, epistemic, and priority signals.
Meaning can fail and require repair.
```


The rest of the document expands these claims into a taxonomy of natural-language properties and their interpretive consequences.

# 1. Meaning as a Layered Phenomenon


Natural-language meaning is not produced by words alone. It is distributed across multiple interacting layers: surface form, lexical meaning, constructional meaning, compositional semantics, pragmatic meaning, discourse state, and social or interactional signals.

These layers are analytically separable, but they are not independent. A single utterance can carry grammatical structure, conventional word meaning, contextual reference, implied intent, discourse function, and social stance at the same time.

Consider:

> "Could you make this a little less aggressive?"

This utterance contains several layers of meaning:

|Layer|Contribution|
|---|---|
|Surface form|An interrogative sentence beginning with "could you"|
|Lexical meaning|Words such as "make," "this," "little," "less," and "aggressive" contribute conventional meanings|
|Constructional meaning|The "could you..." construction often functions as a polite request|
|Compositional semantics|The utterance asks whether the addressee is able to change something so it becomes less aggressive|
|Pragmatic meaning|The speaker likely wants a revision, not a literal answer about ability|
|Discourse meaning|"this" refers to some salient prior object, such as a draft, message, design, or proposal|
|Social meaning|"a little" softens criticism and reduces interpersonal friction|

Layer 0 treats this layered structure as foundational. A natural-language interface must not assume that the full meaning of an utterance is contained in its literal sentence meaning. Meaning often depends on what the speaker is doing, what has already happened, what is currently salient, what is socially implied, and what can reasonably be inferred.

## 1.1 Surface Form


Surface form is the directly observable shape of an utterance: its words, order, punctuation, morphology, and grammatical pattern.

Examples:

> "Move the meeting to tomorrow."

> "Can you move the meeting to tomorrow?"

> "Maybe move the meeting to tomorrow?"

> "The meeting should probably be moved to tomorrow."

These utterances are closely related, but their surface forms differ. The first is an imperative. The second is an interrogative. The third is a softened suggestion. The fourth is a passive construction with modal and epistemic marking.

Surface form provides important clues, but it does not determine meaning by itself. Interrogative form does not always mean the speaker is asking a literal question. Imperative form does not always mean the speaker has authority. Declarative form does not always mean the speaker is merely stating a fact.

Examples:

|Utterance|Surface form|Likely communicative function|
|---|---|---|
|"Can you send me the file?"|Question|Request|
|"You might want to check the logs."|Statement|Suggestion or warning|
|"I need this by Friday."|Statement|Requirement|
|"Why don't we simplify this?"|Question|Proposal|
|"That argument is weak."|Statement|Evaluation, possibly revision request|

Surface form is therefore an entry point into interpretation, not the whole interpretation.

## 1.2 Lexical Meaning


Lexical meaning is the conventional meaning contributed by individual words and fixed expressions.

For example:

> "Cancel my next meeting."

The words contribute conventional meanings:

|Word or phrase|Conventional contribution|
|---|---|
|"cancel"|stop, invalidate, or remove a planned event|
|"my"|associated with the speaker|
|"next"|nearest upcoming item in an ordered sequence|
|"meeting"|scheduled interaction involving participants|

Lexical meaning is necessary but rarely sufficient. The word "meeting" may refer to a calendar event, a recurring sync, a video call, an in-person appointment, or an informal discussion. The word "cancel" may mean delete the event, decline attendance, notify participants, or mark it as no longer happening. The word "next" requires a reference time.

Lexical meaning also includes polysemy: a word may have several related meanings.

Examples:

|Word|Possible meanings|
|---|---|
|"run"|execute code, operate a process, move quickly, manage something|
|"table"|furniture, spreadsheet region, database relation, chart, agenda item|
|"file"|document, legal submission, stored record, folder-like artifact, action verb|
|"branch"|tree limb, organizational unit, source-control line, decision path|
|"deploy"|release software, position personnel, allocate resources|

Natural-language interpretation must therefore distinguish between the conventional possibilities available for a word and the meaning most relevant in context.

## 1.3 Constructional Meaning


Constructional meaning is meaning contributed by grammatical patterns or conventional phrasings, not just by individual words.

For example:

> "Can you X?"

This construction often functions as a request:

> "Can you send the report?"

The literal semantic content concerns ability:

> Are you able to send the report?

But the construction commonly carries a request function:

> Please send the report.

Other constructions similarly carry conventional pragmatic force.

|Construction|Example|Typical function|
|---|---|---|
|"Can you X?"|"Can you resend that?"|Request|
|"Could you maybe X?"|"Could you maybe shorten this?"|Polite or softened request|
|"Why don't we X?"|"Why don't we revisit this tomorrow?"|Suggestion|
|"I need X"|"I need the final version by noon."|Requirement or constraint|
|"It looks like X"|"It looks like the job failed."|Tentative diagnosis|
|"You might want to X"|"You might want to check the cache."|Suggestion, warning, or indirect instruction|
|"I'm not sure X"|"I'm not sure this is correct."|Softened disagreement or uncertainty|

Constructional meaning matters because natural language does not always build meaning from isolated word meanings upward. Some sentence patterns are conventionalized ways of performing actions, expressing stance, softening criticism, or marking uncertainty.

A natural-language interface that treats every interrogative as a literal information request will misinterpret common requests. A system that treats every declarative as a passive statement will miss warnings, objections, and implied tasks.

## 1.4 Compositional Semantics


Compositional semantics concerns how word meanings combine into phrase and sentence meanings.

Example:

> "Send the revised contract to Anna before noon."

The sentence combines several elements:

|Element|Semantic contribution|
|---|---|
|"send"|transfer or deliver something|
|"the revised contract"|object to be sent|
|"to Anna"|recipient|
|"before noon"|temporal constraint|

Compositional semantics gives the utterance its conventional propositional structure. It identifies events, participants, properties, relations, and constraints.

However, even a compositionally clear sentence may remain under-resolved.

In:

> "Send the revised contract to Anna before noon."

open questions may include:

|Expression|Remaining issue|
|---|---|
|"the revised contract"|Which contract? Which revision?|
|"Anna"|Which Anna?|
|"send"|By email, chat, document-sharing system, or another channel?|
|"noon"|Noon in which timezone?|
|whole utterance|Is this a request, command, reminder, or delegated task?|

Compositional semantics provides a structured meaning. It does not necessarily provide an executable interpretation.

## 1.5 Pragmatic Meaning


Pragmatic meaning is meaning inferred from use in context. It concerns what the speaker is trying to do by saying something.

Example:

> "It's getting late."

The literal semantic content is a statement about time. Depending on context, the pragmatic meaning may be:

|Context|Likely pragmatic meaning|
|---|---|
|Meeting|We should wrap up|
|Dinner|We should leave soon|
|Work session|We should stop for today|
|Travel|We should hurry|
|Child bedtime routine|It is time to begin bedtime preparation|

Pragmatic meaning includes requests, warnings, suggestions, confirmations, refusals, objections, corrections, and implied actions.

Examples:

|Utterance|Likely pragmatic meaning|
|---|---|
|"Can you open the window?"|Request to open the window|
|"This might break production."|Warning|
|"I'm not sure this argument works."|Objection or revision request|
|"That version."|Selection or confirmation|
|"Actually, use the other file."|Correction|
|"Some tests are still failing."|Status report, warning, or blocker|

Pragmatic interpretation depends on context, relevance, shared assumptions, and the current task. The same sentence can perform different communicative acts in different situations.

## 1.6 Discourse Meaning


Discourse meaning arises across multiple sentences, turns, paragraphs, or interactional moves. It tracks how utterances relate to prior and future utterances.

Example:

> "Find three options. The second one looks best. Make it cheaper."

The third sentence cannot be interpreted in isolation. "It" refers to "the second one," and "make it cheaper" modifies an ongoing selection or proposal. The instruction depends on prior discourse state.

Discourse meaning includes:

|Phenomenon|Example|
|---|---|
|Sequencing|"First summarize the issue, then propose a fix."|
|Contrast|"The design is clear, but it feels too dense."|
|Correction|"Not that one -- the other version."|
|Elaboration|"The issue is authentication. Specifically, token refresh is failing."|
|Conditionality|"If the build passes, deploy it."|
|Exception|"Use the default settings, except for admin users."|
|Refinement|"Only show the urgent ones."|
|Retraction|"Actually, ignore that requirement."|

Discourse meaning is dynamic. Later turns can extend, narrow, revise, or invalidate earlier interpretations.

Example:

> "Schedule it for Friday. Actually, Monday is better."

The second sentence does not simply add a new date. It revises the prior date. A natural-language interface must therefore model conversational state as mutable rather than purely additive.

## 1.7 Social and Interactional Meaning


Natural language carries social and interactional signals in addition to informational content. These signals include politeness, certainty, authority, urgency, hesitation, frustration, preference strength, and interpersonal stance.

Example:

> "Maybe we should avoid changing the public API before launch."

This utterance does not merely describe an API. It carries several signals:

|Signal|Contribution|
|---|---|
|"Maybe"|Uncertainty or softening|
|"should"|Recommendation or weak obligation|
|"avoid"|Negative preference or caution|
|"before launch"|Temporal constraint|
|whole utterance|Warning, recommendation, or architectural concern|

Social and interactional meaning affects interpretation. A softened request is still often a request. A tentative warning may still mark serious risk. A frustrated statement may require more careful repair than a neutral one.

Examples:

|Utterance|Social or interactional signal|
|---|---|
|"Could you maybe take another pass?"|Politeness, softening|
|"This is definitely wrong."|High certainty|
|"I'm worried about this migration."|Concern|
|"We absolutely need this today."|Urgency and strong priority|
|"I think we may be missing the main point."|Softened disagreement|
|"No, not that one."|Correction, possible frustration depending on context|

These signals are not decorative. They are part of meaning. They influence how strongly an utterance should constrain interpretation, whether a response should be direct or cautious, and whether clarification or confirmation is appropriate.

## 1.8 Summary


Meaning in natural language is layered.

A compact model:

```text
Natural-language meaning
├── surface form
├── lexical meaning
├── constructional meaning
├── compositional semantics
├── pragmatic meaning
├── discourse meaning
└── social and interactional meaning
```


Each layer contributes different information:

|Layer|Core question|
|---|---|
|Surface form|What was said, grammatically and visibly?|
|Lexical meaning|What do the words conventionally mean?|
|Constructional meaning|What does the phrasing pattern conventionally signal?|
|Compositional semantics|How do the parts combine into sentence meaning?|
|Pragmatic meaning|What is the speaker trying to do?|
|Discourse meaning|How does this relate to prior or future utterances?|
|Social and interactional meaning|What stance, force, urgency, or interpersonal signal is present?|

Layer 0 begins with this premise: a natural-language utterance is not merely a string to decode. It is a situated communicative act whose meaning is distributed across form, convention, context, intent, discourse, and stance.

# 2. Indeterminacy and Compression


Natural language often does not map cleanly to one exact interpretation. Expressions may be ambiguous, vague, underspecified, prototype-based, metaphorical, or intentionally compressed.

This is not accidental. Natural language is optimized for situated communication, not exhaustive specification. Speakers routinely omit information that can be inferred from context, defaults, shared routines, prior discourse, or follow-up interaction. In many cases, saying less is not a failure of precision; it is an efficient communicative strategy.

Indeterminacy and compression include:

```text
Indeterminacy and compression
├── ambiguity
├── vagueness
├── underspecification
├── prototype-based categories
├── metaphor and conceptual transfer
└── economy of explicitness
```


These properties explain why many natural-language utterances are only partially specified at the moment they are produced. Interpretation often requires resolving, ranking, deferring, or explicitly repairing possible meanings.

## 2.1 Ambiguity


Ambiguity occurs when an expression has more than one discrete interpretation.

Example:

> "Book a table."

Possible interpretations include:

|Expression|Possible meaning|
|---|---|
|"book"|reserve, record, purchase|
|"table"|restaurant table, furniture, data table, spreadsheet table|
|whole utterance|reserve a restaurant table, buy a table, create a data table, add something to a table|

Ambiguity differs from vagueness. Ambiguity asks:

```text
Which meaning is intended?
```


Vagueness asks:

```text
Where is the boundary?
```


Ambiguity can occur at several levels.

### 2.1.1 Lexical Ambiguity


Lexical ambiguity occurs when a word or expression has multiple possible meanings.

Examples:

|Word|Possible meanings|
|---|---|
|"bank"|financial institution, river edge|
|"table"|furniture, data table, chart, agenda item|
|"file"|document, folder-like record, legal submission, action verb|
|"run"|execute code, operate, move quickly, manage|
|"draft"|preliminary document, current version, bank withdrawal, air current|
|"server"|machine, software process, person serving food|
|"branch"|source-control branch, tree branch, office location, decision path|

Lexical ambiguity is usually resolved through context.

Example:

> "Run the migration."

In a software context, "run" likely means execute. In an organizational context, it could mean manage. In a physical event context, it could mean operate or coordinate.

### 2.1.2 Syntactic Ambiguity


Syntactic ambiguity occurs when a sentence allows multiple grammatical parses.

Example:

> "I saw the man with the telescope."

Possible interpretations:

1. I used a telescope to see the man.
2. I saw a man who had a telescope.

Another example:

> "Review the documents from Anna with comments."

Possible interpretations:

1. Review the documents from Anna, and include comments.
2. Review the documents from Anna that already contain comments.
3. Review the documents using Anna's comments.

Syntactic ambiguity can affect task interpretation because the grammatical attachment of a modifier changes what the instruction applies to.

### 2.1.3 Scope Ambiguity


Scope ambiguity occurs when an operator, quantifier, negation, or modifier may apply to different parts of an utterance.

Example:

> "Email all managers and engineers in Berlin."

Possible interpretations:

1. Email all managers, plus engineers who are in Berlin.
2. Email all managers and all engineers who are in Berlin.

Another example:

> "Do not archive urgent and unresolved tickets."

Possible interpretations:

1. Do not archive tickets that are both urgent and unresolved.
2. Do not archive urgent tickets or unresolved tickets.
3. Do not archive urgent tickets, and do not archive unresolved tickets.

Scope ambiguity is especially important when an utterance contains quantifiers, negation, conjunction, conditionals, or modifiers.

Common scope-sensitive expressions include:

|Expression type|Examples|
|---|---|
|Quantifiers|all, every, some, only, each|
|Negation|not, never, no, without|
|Modifiers|urgent, recent, approved, active|
|Connectives|and, or, unless, except|
|Conditionals|if, when, provided that|

### 2.1.4 Referential Ambiguity


Referential ambiguity occurs when a referring expression could point to more than one entity.

Example:

> "Send it to Alex."

Open questions:

|Expression|Ambiguity|
|---|---|
|"it"|Which object, file, message, result, or link?|
|"Alex"|Which person named Alex?|
|"send"|Send through which channel?|

Another example:

> "Use the second one."

Possible referents for "the second one" may include:

- the second search result
- the second paragraph
- the second design
- the second person mentioned
- the second file in a list
- the second option from a prior turn

Referential ambiguity depends heavily on salience. The most recently mentioned or currently visible entity is often preferred, but this is not guaranteed.

## 2.2 Vagueness


Vagueness occurs when a term has fuzzy boundaries rather than a fixed exact threshold.

Examples:

|Vague term|Boundary question|
|---|---|
|"soon"|How soon? Minutes, hours, days?|
|"cheap"|Cheap relative to what budget, market, or baseline?|
|"nearby"|How far counts as nearby?|
|"simple"|Simple for whom, and by what measure?|
|"senior"|Based on years, scope, autonomy, impact, or title?|
|"fast"|Low latency, short delivery time, high throughput, or quick perceived response?|
|"safe"|Safe legally, technically, operationally, reputationally, or physically?|
|"clean"|Visually clean, architecturally clean, logically clean, or easy to maintain?|

Vagueness is not the same as ambiguity.

|Phenomenon|Core issue|Example|
|---|---|---|
|Ambiguity|Multiple discrete meanings|"table" as furniture or data structure|
|Vagueness|Fuzzy boundary|"nearby" as within 5, 10, or 30 minutes|

Vague terms are often gradable. Something can be:

- somewhat cheap
- very cheap
- cheap for Tokyo
- cheap compared with competitors
- cheap for enterprise software
- cheap for a weekend trip
- cheap relative to the user's usual choices

Vagueness is often context-relative. The same term can imply different thresholds in different domains.

Example:

> "Find a fast database."

"Fast" could mean:

|Context|Possible interpretation|
|---|---|
|Transactional workload|Low write latency|
|Analytics workload|High scan throughput|
|User-facing application|Low response time|
|Migration project|Fast to deploy|
|Engineering discussion|Fast under benchmark conditions|
|Product discussion|Perceived as responsive by users|

Vague terms often require a threshold. Sometimes the threshold can be inferred; sometimes it must be clarified.

## 2.3 Underspecification


Underspecification occurs when an utterance leaves out information that may be needed for a fully resolved interpretation.

Example:

> "Schedule a meeting with Alex."

Missing information may include:

|Missing detail|Why it matters|
|---|---|
|Which Alex?|Multiple people may match|
|Date|Needed to place the meeting|
|Time|Needed to create the event|
|Duration|Needed to block time|
|Topic|Needed for title or agenda|
|Medium|In person, phone, video, async?|
|Location|Physical room or virtual link?|
|Participants|Only Alex, or others too?|
|Priority|Should conflicts be avoided or overridden?|

Underspecification is normal. Speakers do not usually provide every parameter in a single utterance because many details can be inferred from prior interaction, task conventions, user preferences, or follow-up dialogue.

Other examples:

|Utterance|Underspecified information|
|---|---|
|"Send the report."|Which report, to whom, by what channel?|
|"Make it cleaner."|What is "it," and what kind of cleanliness matters?|
|"Move this to next week."|What object, which day, what time, what timezone?|
|"Find me a good option."|Good by which criteria?|
|"Turn this into a proposal."|What format, audience, length, and tone?|
|"Fix the bug."|Which bug, what root cause, what acceptable fix?|

Underspecification differs from ambiguity. Ambiguity gives multiple possible meanings. Underspecification gives an incomplete meaning.

Example:

> "Schedule a meeting."

This is not necessarily ambiguous. The action type is reasonably clear. But it is underspecified because required details are missing.

### 2.3.1 Missing Parameters


Some underspecification involves missing parameters.

Example:

> "Book a flight to Berlin."

Likely missing parameters:

- origin
- date
- return date
- budget
- airline preferences
- baggage requirements
- passenger identity
- seat preference
- acceptable layovers
- refundability requirements

Parameter omission can be harmless, recoverable, or blocking.

|Type|Example|Interpretation consequence|
|---|---|---|
|Harmless omission|"Summarize this."|The system may infer standard summary length|
|Recoverable omission|"Schedule a meeting with Alex."|The system may ask for date/time|
|Blocking omission|"Transfer the money."|The system needs amount, recipient, account, and confirmation|
|Safety-critical omission|"Delete those."|The system must resolve referent and risk before acting|

### 2.3.2 Recoverable Omissions


An omission is recoverable when the missing material can be inferred with acceptable confidence from context.

Example:

> "Same time tomorrow?"

If the current conversation concerns a recurring meeting, "same time" may be recoverable from the prior scheduled event. If there are several recent times under discussion, it may not be recoverable.

Recoverability depends on:

|Factor|Question|
|---|---|
|Recency|Was the missing information recently mentioned?|
|Salience|Is one candidate clearly more prominent?|
|Uniqueness|Is there only one plausible referent?|
|Risk|What happens if the inference is wrong?|
|Reversibility|Can the action be undone easily?|
|User pattern|Does the user have stable preferences or routines?|

### 2.3.3 Defaults and Assumptions


Natural-language interpretation often uses defaults.

Example:

> "Set up a call with Maya."

Possible defaults:

|Parameter|Possible default|
|---|---|
|Duration|30 minutes|
|Medium|Video call|
|Participants|User and Maya|
|Calendar|User's primary calendar|
|Timezone|User's current timezone|
|Title|"Call with Maya"|

Defaults are useful, but they are not neutral. They encode assumptions. A default can be wrong even when it is plausible.

A natural-language interface should distinguish between:

```text
explicit instruction
inferred value
default value
unresolved value
```


These should not be treated as equivalent. Explicit instructions carry stronger interpretive force than inferred defaults.

### 2.3.4 User-Side Economy of Expression


Underspecification is often an efficiency strategy. Speakers compress meaning because explicit specification has a cost.

Consider the difference between:

> "Schedule a meeting with Alex."

and:

> "Create a 30-minute video meeting with Alex Chen from the product team next Tuesday at 10:00 AM Buenos Aires time, title it 'Roadmap sync,' invite only Alex and me, use my work calendar, include the usual video link, and avoid conflicts unless the conflict is marked optional."

The second version is more explicit, but it is also slower, heavier, and cognitively expensive. Natural language typically avoids this burden unless the details matter.

This is the economy of explicitness:

```text
Speakers usually specify only what they believe is necessary for the listener to infer the intended meaning.
```


This principle explains why underspecification is not simply a defect. It is part of how natural language reduces interaction cost.

A natural-language interface must therefore treat omitted information carefully. Missing details may indicate:

- the user expects the system to infer them
- the user expects a follow-up question
- the user does not care about the omitted detail
- the detail is conventionally defaulted
- the detail is unavailable to the user
- the user has not yet decided
- the user assumes shared context

The same omission can require different handling depending on risk, reversibility, and confidence.

## 2.4 Prototype-Based Categories


Many natural-language categories are not defined by strict necessary-and-sufficient conditions. Instead, they are organized around prototypes: central, typical examples of a category.

Example:

> "Find startup-like companies."

There may be no exact definition of "startup-like." The phrase suggests a cluster of features:

- relatively young company
- growth-oriented
- technology-oriented
- venture-backed or venture-style
- experimental product culture
- high uncertainty
- high upside
- relatively informal operating style
- small or rapidly scaling team

A company may be more or less startup-like. The category is graded rather than binary.

Another example:

> "Make the design feel more enterprise."

This may imply:

|Feature|Possible interpretation|
|---|---|
|Visual tone|More formal and conservative|
|Information density|More structured, less playful|
|Trust signals|Security, compliance, reliability|
|Workflow|Administrative controls and approvals|
|Access model|Roles, permissions, auditability|
|Language|More precise, less casual|
|Layout|More predictable and standardized|

Prototype-based categories are common in product, design, hiring, strategy, and technical evaluation.

Examples:

|Phrase|Prototype-based meaning|
|---|---|
|"senior engineer"|Autonomy, judgment, scope, mentoring, technical depth|
|"enterprise-ready"|Security, compliance, reliability, admin controls|
|"clean architecture"|Separation of concerns, low coupling, comprehensible structure|
|"good candidate"|Fit across skills, experience, communication, trajectory|
|"risky migration"|Uncertainty, possible breakage, operational exposure|
|"healthy team"|Trust, delivery, communication, sustainable workload|

Prototype categories are powerful because they allow speakers to communicate complex clusters of expectations compactly. But they also create interpretive uncertainty because different speakers may have different prototypes.

## 2.5 Metaphor and Conceptual Transfer


Metaphor uses one conceptual domain to structure another.

Examples:

|Metaphor|Likely meaning|
|---|---|
|"This code is brittle."|It breaks easily under change|
|"The UI feels heavy."|It feels dense, slow, overloaded, or visually burdensome|
|"The argument has holes."|It contains weaknesses or missing support|
|"The project is blocked."|Progress is prevented by an obstacle|
|"The architecture is clean."|The structure is coherent, separable, and understandable|
|"The team is underwater."|The team is overloaded|
|"This process has too much friction."|The process is effortful or difficult to complete|
|"The roadmap is bloated."|It contains too many items or excessive scope|

Metaphor is not merely decorative. It is a normal way of reasoning. Many technical and organizational terms are metaphorical:

- threads
- locks
- queues
- pipelines
- memory
- garbage collection
- branches
- forks
- roots
- leaves
- deadlocks
- bottlenecks
- ownership
- handoff
- rollback
- health checks

Metaphors often compress complex judgments. Saying:

> "This interface feels heavy."

may imply several possible issues:

- too many visible controls
- excessive visual weight
- slow perceived responsiveness
- too much text
- too much cognitive load
- unclear hierarchy
- too many required decisions

Because metaphor transfers structure from one domain to another, interpretation requires identifying which aspects of the source domain are relevant.

Example:

> "This proposal needs a stronger spine."

Possible intended meanings:

- clearer central argument
- stronger logical structure
- more explicit thesis
- better sequencing
- more support for conclusions

Metaphor therefore often requires pragmatic and domain-sensitive interpretation.

## 2.6 Economy of Explicitness


The economy of explicitness is the principle that natural-language speakers usually avoid specifying everything they could specify.

This economy is not laziness. It is part of efficient communication.

Natural-language utterances are shaped by tradeoffs:

|Tradeoff|Description|
|---|---|
|Precision vs. effort|More precision requires more time and cognitive load|
|Brevity vs. recoverability|Shorter utterances depend more on context|
|Explicitness vs. naturalness|Fully explicit language can sound unnatural or burdensome|
|Completeness vs. adaptability|Leaving details open allows negotiation and refinement|
|Speed vs. certainty|Fast communication often defers exact resolution|

Example:

> "Same as last time, but cheaper."

This short utterance compresses a large amount of information:

|Phrase|Compressed dependency|
|---|---|
|"same"|Reuse prior configuration or criteria|
|"last time"|Retrieve a prior event, decision, search, or action|
|"but"|Preserve most properties while changing one|
|"cheaper"|Optimize against a cost dimension|
|whole utterance|Modify a prior pattern rather than starting from scratch|

The speaker avoids restating everything because prior context is assumed to be available.

This creates a central Layer 0 constraint:

```text
Natural-language input is often a compressed representation of intent.
```


Interpreting it requires decompression:

- recover omitted entities
- infer relevant defaults
- bind references
- identify implied constraints
- determine which prior state still applies
- distinguish hard requirements from preferences
- identify when clarification is necessary

Compression is useful, but it creates risk. A listener or system can decompress incorrectly.

Example:

> "Use the usual format."

Possible interpretations:

- the format used in the last document
- the team's standard template
- the user's personal preference
- the organization's style guide
- the format used for this document type
- the format previously approved by a stakeholder

The more compressed the utterance, the more interpretation depends on context and shared assumptions.

## 2.7 Summary


Indeterminacy and compression explain why natural-language meaning is often partial, graded, or multiply interpretable.

|Property|Core issue|Example|
|---|---|---|
|Ambiguity|Which discrete meaning is intended?|"Book a table."|
|Vagueness|Where is the boundary?|"nearby," "cheap," "soon"|
|Underspecification|What information is missing?|"Schedule a meeting."|
|Prototype categories|What does it resemble?|"startup-like," "enterprise-ready"|
|Metaphor|What cross-domain meaning applies?|"brittle code," "heavy UI"|
|Economy of explicitness|What has been intentionally compressed?|"Same as last time."|

A compact model:

```text
Natural-language utterances often compress intent.

Compression appears as:
├── multiple possible meanings
├── fuzzy thresholds
├── omitted parameters
├── graded categories
├── metaphorical transfer
└── reliance on shared context
```


The interpretive task is not always to eliminate indeterminacy immediately. Sometimes the correct response is to infer. Sometimes it is to ask. Sometimes it is to preserve alternatives. Sometimes it is to delay resolution until more context is available. Sometimes it is to decline action until the ambiguity is resolved.

# 3. Context, Reference, and Grounding


Natural-language meaning often depends on context. An utterance may not be interpretable from the sentence alone because it relies on the speaker, addressee, time, location, prior discourse, shared knowledge, visible objects, task state, or interface state.

Example:

> "Move this to tomorrow."

This utterance requires several contextual resolutions:

|Expression|Required grounding|
|---|---|
|"this"|What object, task, meeting, document, issue, or event is being referred to?|
|"tomorrow"|Tomorrow relative to which date and timezone?|
|"move"|Reschedule, relocate, reorder, transfer, or reposition?|
|whole utterance|Is this a command, request, suggestion, or tentative proposal?|

Context dependence includes:

```text
Context, reference, and grounding
├── implicit context
├── deixis
├── coreference
├── ellipsis
├── presupposition
├── temporal and spatial grounding
├── discourse grounding
└── interface grounding
```


This section focuses on how expressions attach to the world, the conversation, the task, and the active interface.

## 3.1 Implicit Context


Implicit context is unspoken background information that speakers assume is available.

Example:

> "Do it like last time."

This short utterance depends on several unstated facts:

|Expression|Required context|
|---|---|
|"it"|The current task or object|
|"like"|Which properties should be repeated?|
|"last time"|Which prior event, action, or output?|
|whole utterance|Which aspects should stay the same and which may change?|

Implicit context may come from:

- previous conversation
- shared work history
- current task state
- visible interface state
- active document or selected object
- user preferences
- organizational conventions
- domain norms
- physical environment
- cultural assumptions
- prior decisions
- recurring routines

Implicit context is not an edge case. It is a normal operating condition of natural language.

Examples:

|Utterance|Implicit context required|
|---|---|
|"Use the usual format."|What format is usual for this user, team, artifact, or situation?|
|"Send it to the client."|Which item, which client, and through which channel?|
|"Make this more polished."|What object is "this," and what counts as polished?|
|"Let's go with the safer option."|Which options are under discussion, and what risk dimension matters?|
|"Same process as before."|Which prior process, and which parts should be repeated?|

Implicit context is closely related to pragmatics, but the two are distinct.

```text
Implicit context supplies background information.
Pragmatics uses that background to infer intended meaning.
```


For example:

> "It's cold in here."

Context may identify the location, temperature, open window, thermostat, car, room, or user preference. Pragmatics determines whether the speaker is merely observing, complaining, asking for the heat to be increased, or requesting that a window be closed.

## 3.2 Deixis


Deixis refers to expressions whose meaning depends on the situation of utterance. Deictic expressions point to people, times, places, discourse segments, social roles, or visible objects.

Common deictic categories:

|Type|Examples|Depends on|
|---|---|---|
|Person deixis|I, me, you, we, they|speaker and addressee|
|Time deixis|now, today, tomorrow, later, next week|time of utterance|
|Place deixis|here, there, nearby, upstairs|spatial frame or location|
|Discourse deixis|this, that, the above, the former, the latter|surrounding discourse|
|Social deixis|sir, professor, Your Honor, team, client|social roles and relationships|
|Interface deixis|this column, that chart, the selected text|current interface state|

Example:

> "I need this by tomorrow."

Interpretation requires:

|Expression|Context needed|
|---|---|
|"I"|speaker identity|
|"this"|current object, document, task, issue, or deliverable|
|"tomorrow"|date relative to utterance time and timezone|
|"need"|whether this is a preference, requirement, dependency, or deadline|

Deixis makes natural language compact. Speakers can say "this" instead of restating a full object description, and "tomorrow" instead of giving an absolute date.

But deixis also creates risk when the anchor is unclear.

Example:

> "Move that over there."

This utterance may be perfectly clear in a shared visual workspace. It may be impossible to interpret in a text-only context.

### 3.2.1 Person Deixis


Person deixis identifies participants relative to the speech situation.

Examples:

|Expression|Possible referent|
|---|---|
|"I"|the speaker|
|"you"|the addressee|
|"we"|speaker plus addressee, speaker plus team, organization, or broader group|
|"they"|previously mentioned group, external party, institution, or unspecified people|

The pronoun "we" is especially context-sensitive.

Example:

> "We should delay the launch."

Possible meanings of "we":

- the speaker and addressee
- the product team
- the engineering organization
- the company
- a leadership group
- everyone involved in launch planning

The scope of "we" can affect authority, responsibility, and actionability.

### 3.2.2 Time Deixis


Time deixis anchors expressions to a reference time.

Examples:

|Expression|Needs reference|
|---|---|
|"today"|current date in a relevant timezone|
|"tomorrow"|day after the reference day|
|"next Friday"|which Friday counts as next|
|"later"|later than what, and within what expected interval?|
|"soon"|threshold depends on task and context|
|"before the meeting"|which meeting and when it occurs|

Example:

> "Send this tomorrow morning."

Open questions:

- What date is tomorrow?
- Which timezone applies?
- What counts as morning?
- Is the instruction tied to the user's location, recipient's location, or organization's working hours?

Time deixis is especially sensitive when participants, systems, or events span timezones.

### 3.2.3 Place Deixis


Place deixis anchors expressions to a spatial frame.

Examples:

|Expression|Possible anchor|
|---|---|
|"here"|speaker's location, current app location, current document section, current context|
|"there"|visible location, previously mentioned location, target destination|
|"nearby"|near the speaker, near a searched location, near the user's saved location|
|"upstairs"|physical environment|
|"in this section"|document structure or visible viewport|

Example:

> "Find a hotel nearby."

"Nearby" may depend on:

- the user's current location
- a destination under discussion
- an event venue
- a map viewport
- a selected address
- a prior search result

Place deixis can be physical, digital, or discourse-based.

### 3.2.4 Discourse Deixis


Discourse deixis refers to parts of the surrounding discourse.

Examples:

|Expression|Possible referent|
|---|---|
|"this"|current topic, prior sentence, selected artifact, visible output|
|"that"|previous proposal, mentioned object, rejected option|
|"the above"|preceding text|
|"the former"|first of two mentioned items|
|"the latter"|second of two mentioned items|
|"the previous one"|prior item in an ordered list or interaction|
|"same as before"|earlier configuration, answer, or action|

Example:

> "This is too long. Cut it by half."

"This" and "it" likely refer to a prior generated text, selected text, or visible artifact. The utterance cannot be interpreted without discourse or interface grounding.

### 3.2.5 Social Deixis


Social deixis encodes social relationships, roles, status, or institutional position.

Examples:

|Expression|Social grounding|
|---|---|
|"my manager"|speaker's reporting relationship|
|"the client"|relevant external customer or stakeholder|
|"legal"|legal department, counsel, or named legal contact|
|"the approver"|person or role authorized to approve|
|"the owner"|accountable person, document owner, service owner, or task owner|
|"the team"|which team is relevant in this context|

Example:

> "Send this to legal before sharing it with the client."

This requires grounding both "legal" and "the client." These are not merely nouns; they invoke organizational roles and process expectations.

## 3.3 Coreference


Coreference occurs when multiple expressions refer to the same entity.

Example:

> "Sarah sent the contract yesterday. She said it was ready. Forward it to legal."

Coreference links:

|Expression|Referent|
|---|---|
|"Sarah"|Sarah|
|"She"|Sarah|
|"the contract"|contract document|
|first "it"|contract document|
|second "it"|contract document|
|"legal"|legal team, department, or contact|

Coreference allows speakers to avoid repeating full descriptions. It also creates dependency across clauses and turns.

Example with ambiguity:

> "Anna sent Maria the report after she revised it."

Open questions:

|Expression|Possible referents|
|---|---|
|"she"|Anna or Maria|
|"it"|the report or another salient object|

Coreference resolution depends on grammar, salience, recency, world knowledge, discourse structure, and plausibility.

### 3.3.1 Pronoun Resolution


Pronoun resolution identifies what pronouns refer to.

Examples:

|Utterance|Resolution issue|
|---|---|
|"Send it to Maya."|What is "it"?|
|"Ask him to approve it."|Who is "him," and what is "it"?|
|"They said it was blocked."|Who are "they," and what was blocked?|
|"Move that after it."|What are "that" and "it"?|

Pronouns are efficient but risky when multiple candidate referents are available.

### 3.3.2 Named-Entity Resolution


Named-entity resolution identifies which real or discourse entity a name denotes.

Example:

> "Send it to Alex."

Possible issues:

- multiple contacts named Alex
- Alex as person vs. team alias
- Alex in different organizations
- Alex from recent conversation vs. Alex from user's address book
- incomplete or outdated contact information

Named entities may look explicit while still being ambiguous.

Examples:

|Name|Ambiguity|
|---|---|
|"Sarah"|Which Sarah?|
|"the Q3 report"|Which Q3, which report, which version?|
|"the launch doc"|Which launch, which document?|
|"the client"|Which client?|
|"the staging branch"|Which repository or environment?|

### 3.3.3 Repeated Descriptions


Coreference is not limited to pronouns. Repeated or varied descriptions may refer to the same entity.

Example:

> "The vendor sent over the agreement. The contract still needs legal review."

"The agreement" and "the contract" may refer to the same document.

Another example:

> "The migration plan is risky. This proposal needs another review."

"The migration plan" and "this proposal" may refer to the same artifact, depending on context.

Natural language often uses different descriptions for the same thing to emphasize different properties.

|First expression|Later expression|Possible reason for variation|
|---|---|---|
|"the contract"|"the agreement"|Legal or document type framing|
|"the design"|"this mockup"|Artifact vs. visual representation|
|"the bug"|"the production issue"|Technical cause vs. operational impact|
|"Alex"|"the approver"|Person vs. role|
|"the API change"|"the breaking change"|Neutral description vs. risk framing|

### 3.3.4 Ambiguous Referents


A referent is ambiguous when more than one candidate fits.

Example:

> "Compare the two proposals and send the stronger one to Maya."

Open questions:

- stronger by what criterion?
- which proposal is stronger?
- who is Maya?
- should the weaker one be retained, ignored, or summarized?

Referential ambiguity is especially common when an utterance includes:

- pronouns
- demonstratives
- names shared by multiple entities
- ordinal expressions
- comparative descriptions
- role labels
- recent lists or options
- visible interface objects

## 3.4 Ellipsis


Ellipsis occurs when part of an expression is omitted because it can be recovered from context.

Example:

> "Find flights to Berlin. Cheapest, not fastest."

The second sentence omits much of the full structure:

> "Find the cheapest flights to Berlin, not the fastest flights to Berlin."

Ellipsis is common in multi-turn interaction.

Examples:

|Elliptical expression|Recovered meaning|
|---|---|
|"Same as before."|Use the same settings, criteria, or procedure as before|
|"Only the urgent ones."|Filter the previous set to urgent items|
|"Not Friday -- Monday."|Replace Friday with Monday|
|"With more examples."|Revise the prior output to include more examples|
|"Alex too."|Add Alex to the relevant set|
|"The cheaper one."|Select or use the cheaper option from the current candidate set|
|"Less formal."|Revise the prior artifact to reduce formality|
|"Again, but shorter."|Repeat the prior operation with a length constraint|

Ellipsis is efficient because speakers do not need to repeat shared or recently mentioned material. It is also highly context-dependent.

### 3.4.1 Sentence-Level Ellipsis


Sentence-level ellipsis omits material recoverable from the same sentence or adjacent sentence.

Example:

> "Maya wants the PDF, and Alex the spreadsheet."

Recovered meaning:

> "Maya wants the PDF, and Alex wants the spreadsheet."

Another example:

> "I'll handle backend; you frontend."

Recovered meaning:

> "I'll handle backend; you handle frontend."

### 3.4.2 Turn-Level Ellipsis


Turn-level ellipsis depends on prior conversational turns.

Example:

> "Find three candidates."
> "Only senior ones."
> "With Rails experience."
> "Not contractors."

The later turns are fragments. They modify the original search criteria.

Recovered interpretation:

```text
Find three candidates who are senior, have Rails experience, and are not contractors.
```


But even this recovered interpretation may need further refinement. "Senior" and "Rails experience" are vague. "Not contractors" may mean exclude independent contractors, staffing-agency candidates, temporary workers, or non-employees.

### 3.4.3 Task-State Ellipsis


Task-state ellipsis depends on the current task rather than only prior text.

Example:

> "Run it again."

To interpret this, one must know the current task state:

- What was run?
- With what parameters?
- Should the same inputs be reused?
- Should failed steps be retried only, or the whole process?
- Should outputs be overwritten or versioned?

Another example:

> "Same settings, different file."

This requires identifying both prior settings and the new file.

Task-state ellipsis is common in workflows because users often operate over a current object or active process.

### 3.4.4 Recoverability Conditions


Ellipsis is interpretable only when omitted material is recoverable.

Recoverability depends on:

|Condition|Question|
|---|---|
|Recent antecedent|Was the omitted material recently mentioned?|
|Salient task|Is there an active task that supplies the missing structure?|
|Unique candidate|Is there only one plausible completion?|
|Stable pattern|Is there a known routine or template?|
|Low risk|Is an incorrect recovery harmless or reversible?|
|Clarifiable gap|Can uncertainty be resolved through a targeted question?|

When recoverability is weak, ellipsis becomes a source of interpretive failure.

Example:

> "Do the same thing with the other one."

This is easy if there are exactly two visible files and one prior operation. It is difficult if the conversation contains several prior operations and several candidate objects.

## 3.5 Presupposition


A presupposition is background information that an utterance treats as already true.

Example:

> "Cancel my next meeting with Anna."

Presuppositions:

1. The speaker has meetings.
2. There is at least one upcoming meeting with Anna.
3. One of those meetings is the next relevant one.
4. The speaker has some authority or ability to cancel it.

Presuppositions differ from direct assertions. They are not the main point of the utterance, but the utterance depends on them.

Another example:

> "Stop sending weekly reports to the client."

Presuppositions:

- weekly reports are currently being sent
- there is a relevant client
- the reports are sent on a recurring basis
- the sending can be stopped
- the speaker has standing to request the change

Presuppositions can fail.

Example:

> "Reschedule my call with Jordan."

Possible presupposition failures:

- there is no call with Jordan
- there are multiple calls with Jordan
- Jordan cannot be identified
- the call is already canceled
- the speaker does not have permission to reschedule it

Presupposition failure often requires repair:

|Failure|Possible repair|
|---|---|
|No matching entity|"I don't see a call with Jordan. Which event do you mean?"|
|Multiple matches|"I found two calls with Jordan. Which one should be rescheduled?"|
|Missing authority|"You may not have permission to modify this event."|
|Conflicting state|"That event has already been canceled."|

Presuppositions are important because they reveal assumed state. An utterance often asks for an action while also implying that certain background conditions already hold.

## 3.6 Temporal and Spatial Grounding


Temporal and spatial grounding resolve expressions to time and place.

These are related to deixis but deserve separate attention because time and place often determine whether an utterance can be acted on.

### 3.6.1 Temporal Grounding


Temporal grounding resolves expressions such as:

- now
- today
- tomorrow
- yesterday
- next week
- this Friday
- end of day
- before lunch
- after the meeting
- later
- soon
- in a bit
- by launch
- before the deadline

Example:

> "Remind me before the meeting."

Open questions:

|Expression|Required grounding|
|---|---|
|"the meeting"|Which meeting?|
|"before"|How long before?|
|whole utterance|Reminder through which channel?|

Temporal expressions may be absolute, relative, vague, recurring, or event-based.

|Type|Example|
|---|---|
|Absolute|"June 30 at 14:00"|
|Relative|"tomorrow," "next week"|
|Vague|"soon," "later," "in a bit"|
|Recurring|"every Monday," "weekly"|
|Event-based|"before the launch," "after the meeting"|

Temporal grounding must often account for timezone, locale, working hours, holidays, and event calendars.

### 3.6.2 Spatial Grounding


Spatial grounding resolves expressions such as:

- here
- there
- nearby
- around me
- in this room
- on the left
- above
- below
- in the next section
- at the top
- in the sidebar
- on the map

Example:

> "Move this above the chart."

This may refer to a document layout, dashboard, slide, web page, or design canvas. The spatial frame must be known.

Spatial grounding can be:

|Type|Example|
|---|---|
|Physical|"Find a printer nearby."|
|Interface-based|"Move this to the left."|
|Document-based|"Put this above the conclusion."|
|Map-based|"Show options near the venue."|
|Discourse-based|"The point above is unclear."|

Spatial expressions are often easy for humans in a shared visual environment and difficult without the relevant visual or interface state.

## 3.7 Discourse Grounding


Discourse grounding binds expressions to prior or surrounding discourse.

Example:

> "Use the second option, but make it cheaper."

This requires identifying:

- the relevant option set
- which item is second
- what "it" refers to
- what "cheaper" means in relation to that option
- which properties should remain unchanged

Discourse grounding is required for expressions such as:

|Expression|Grounding target|
|---|---|
|"the first one"|item in a prior list|
|"the other one"|alternative from prior contrast|
|"same as before"|prior configuration or action|
|"that approach"|previous proposal or method|
|"this issue"|current topic|
|"the above"|previous text|
|"the previous answer"|earlier generated response|
|"the cheaper option"|option set with cost dimension|
|"that version"|prior artifact version|

Discourse grounding must track salience. The most recent entity is not always the intended referent. A speaker may refer back to something earlier if it remains topically important.

Example:

> "The migration plan is risky. The API change is manageable. The bigger issue is that it affects billing."

"It" might refer to the migration plan, the API change, or a specific subcomponent depending on discourse focus and domain knowledge.

## 3.8 Interface Grounding


Interface grounding occurs when natural-language meaning depends on the active software environment.

Examples:

> "Delete this row."

> "Make this chart larger."

> "Move that section above the summary."

> "Use the selected text."

> "Change this column to currency."

These utterances cannot be resolved from language alone. They require access to interface state.

Interface grounding may include:

|Interface signal|Example|
|---|---|
|Selected object|highlighted text, selected row, chosen image|
|Active document|current file, draft, slide, sheet, design|
|Cursor position|insertion point in editor or document|
|Viewport state|visible area of page, map, canvas, dashboard|
|UI focus|active field, modal, tab, panel, or component|
|Hovered object|object under pointer|
|Recent click|last selected or activated item|
|Current route|active screen or app location|
|Open artifact|current document, ticket, chart, or record|
|Visible list|search results, candidate options, rows, files|
|Application mode|edit mode, preview mode, comment mode, review mode|

Interface grounding extends deixis into digital environments. In a physical conversation, "this" may be resolved by pointing. In a software environment, "this" may be resolved by selection, cursor position, viewport, or UI focus.

Example:

> "Make this shorter."

Possible interface-grounded referents:

- selected paragraph
- current draft
- highlighted sentence
- previous assistant response
- active document
- text box with focus
- visible email draft
- current slide

Without interface grounding, the utterance remains ambiguous.

### 3.8.1 Selected Object


The selected object is often the strongest grounding signal.

Example:

> "Summarize this."

If a paragraph is highlighted, "this" likely refers to the highlighted paragraph. If a file is selected, "this" may refer to the file. If no object is selected, the referent may be the current document or previous message.

Selection can bind:

- text
- rows
- columns
- cells
- images
- shapes
- slides
- files
- tickets
- emails
- calendar events
- map regions
- search results

### 3.8.2 Active Document


The active document supplies context for references such as:

- "this draft"
- "the title"
- "the intro"
- "the conclusion"
- "the table"
- "the current section"
- "the second paragraph"
- "the chart on page 3"

Example:

> "Make the introduction less formal."

The active document tells the system which introduction is meant.

If multiple documents are open, active-document grounding may be insufficient. The system may need to distinguish between the focused document, most recently edited document, visible document, or explicitly named document.

### 3.8.3 Cursor Position


Cursor position can ground insertion and local revision.

Examples:

|Utterance|Cursor-dependent meaning|
|---|---|
|"Add a note here."|Insert at cursor position|
|"Put the citation here."|Insert citation where cursor is placed|
|"Continue from here."|Generate continuation after cursor|
|"Rewrite this paragraph."|Possibly paragraph containing cursor|
|"Add one more example below."|Insert after current location|

Cursor grounding is useful but can be fragile. If the cursor was accidentally left in an unrelated place, the interpretation may be wrong.

### 3.8.4 Viewport State


Viewport state is the visible region of an interface.

Example:

> "Move the chart above the table."

If only one chart and one table are visible, viewport state may resolve the referents. If the full document contains many charts and tables, visibility matters.

Viewport grounding applies to:

- documents
- spreadsheets
- dashboards
- maps
- design canvases
- code editors
- slide decks
- search results
- ticket boards

Viewport state can also influence salience. Visible objects are more likely to be intended by "this," "that," or "the one on the left."

### 3.8.5 Highlighted Text


Highlighted text is a common grounding anchor for revision requests.

Examples:

|Utterance|Likely target|
|---|---|
|"Make this clearer."|highlighted text|
|"Turn this into bullets."|highlighted passage|
|"Translate this."|highlighted content|
|"Delete this."|highlighted text or object|
|"Add examples here."|highlighted section or cursor-adjacent area|

Highlighted text can narrow scope. Without highlighting, "make this clearer" might refer to the whole document, current paragraph, previous response, or active section.

### 3.8.6 Current UI Focus


UI focus identifies the active element or current interaction mode.

Examples:

|UI focus|Utterance|Likely interpretation|
|---|---|---|
|Email compose box|"Make this warmer."|Revise email draft|
|Spreadsheet cell|"Format this as currency."|Format selected cell or column|
|Calendar event|"Move this to Monday."|Reschedule event|
|Search result list|"Open the second one."|Open second result|
|Design canvas|"Make this larger."|Resize selected design object|
|Code editor|"Explain this function."|Explain focused or selected code|

UI focus is not linguistic content, but it is part of the interpretive context for interface-mediated language.

## 3.9 Relationship Among Context Mechanisms


The mechanisms in this section are related but distinct.

```text
Context dependence
├── implicit context
│   └── broad unstated background assumptions
│
├── deixis
│   └── expressions anchored to speaker, time, place, discourse, or interface
│
├── coreference
│   └── multiple expressions referring to the same entity
│
├── ellipsis
│   └── omitted structure recovered from context
│
├── presupposition
│   └── background facts treated as already true
│
├── temporal/spatial grounding
│   └── time and place resolution
│
├── discourse grounding
│   └── binding to prior conversational state
│
└── interface grounding
    └── binding to active digital environment
```


They often co-occur.

Example:

> "Actually, move that to next Friday instead."

This includes:

|Phrase|Phenomenon|
|---|---|
|"Actually"|discourse repair marker|
|"move"|action requiring contextual interpretation|
|"that"|deixis / referential grounding|
|"next Friday"|temporal grounding|
|"instead"|replacement of prior plan|
|whole utterance|correction of previous instruction|

Another example:

> "Use the same format, but only for the selected rows."

This includes:

|Phrase|Phenomenon|
|---|---|
|"same format"|ellipsis and prior-state dependency|
|"but"|contrast / partial modification|
|"only"|scope restriction|
|"selected rows"|interface grounding|
|whole utterance|refinement of an existing operation|

## 3.10 Summary


Context, reference, and grounding explain how natural-language expressions attach to the world, the task, the conversation, and the interface.

|Property|Core issue|Example|
|---|---|---|
|Implicit context|What background is assumed?|"Do it like last time."|
|Deixis|What is the anchor?|"this," "here," "tomorrow"|
|Coreference|Which expressions share a referent?|"Sarah... she... it"|
|Ellipsis|What omitted material is recoverable?|"Cheapest, not fastest."|
|Presupposition|What is treated as already true?|"Cancel my next meeting."|
|Temporal grounding|What exact time is meant?|"next Friday," "before lunch"|
|Spatial grounding|What location or spatial frame is meant?|"nearby," "above this"|
|Discourse grounding|What prior utterance or object is referenced?|"the second one," "same as before"|
|Interface grounding|What UI state anchors the expression?|"this column," "selected text"|

A compact model:

```text
Natural-language meaning is situated.

It may depend on:
├── who is speaking
├── who is being addressed
├── when the utterance occurs
├── where the utterance occurs
├── what has already been said
├── what task is active
├── what object is visible or selected
├── what assumptions are shared
└── what prior state remains salient
```


The central point of Section 3 is that natural language is not self-contained. Meaning is often distributed across the utterance, the surrounding situation, prior discourse, task state, and the active interface.

Below is a document-ready draft for **Sections 4-7**. It keeps the structure you specified, assumes Sections 1-3 already cover layered meaning, indeterminacy/compression, and context/reference/grounding, and excludes boundaries/comparisons with formal systems. This draft extends the uploaded taxonomy and incorporates the critique additions around action fan-out, non-monotonicity, and repair semantics.

# 4. Communicative Force and Intent


Natural-language utterances do not merely describe states of affairs. They perform communicative actions.

A user may ask, request, command, warn, suggest, correct, confirm, evaluate, refuse, or imply a desired course of action without explicitly naming the action type. The communicative force of an utterance is therefore not always recoverable from syntax alone. It depends on surface form, context, speaker goals, discourse history, social stance, and the current task.

This section describes how utterances become communicative acts: how a sentence, fragment, or conversational move comes to count as something the speaker is trying to do.

## 4.1 Pragmatics in the Broad Sense


Pragmatics concerns meaning in use. It asks how people infer intended meaning from context, shared assumptions, goals, conventions, and prior discourse.

The same sentence can perform different functions in different contexts. Conversely, the same communicative function can be expressed through many different surface forms.

Example:

> "Can you send this to Anna?"

Literal content:

> Are you able to send this to Anna?

Typical intended meaning:

> Please send this to Anna.

The literal meaning is not false or irrelevant. Rather, it is only one layer of the utterance. The communicative force is usually a request, not a neutral inquiry about ability.

### 4.1.1 Meaning as use


Meaning is not limited to what words conventionally denote. In natural language, meaning also includes what an utterance accomplishes in a situation.

Example:

> "The deadline is tomorrow."

Possible uses:

|Context|Likely use|
|---|---|
|Project check-in|Reminder|
|Delayed task|Warning|
|Planning conversation|Constraint|
|Performance review|Criticism|
|Scheduling discussion|Reason to prioritize|

The sentence has stable semantic content: there is a deadline, and it is tomorrow relative to the relevant reference time. But its use varies. It may function as a reminder, warning, justification, criticism, or scheduling constraint.

This is why natural-language interpretation must account for communicative purpose, not only sentence meaning.

### 4.1.2 Literal meaning versus intended meaning


Literal meaning is the conventional semantic content of an expression. Intended meaning is what the speaker is trying to communicate or accomplish with that expression in context.

Example:

> "It's cold in here."

Literal meaning:

> The temperature in the current place is low.

Possible intended meanings:

|Context|Likely intended meaning|
|---|---|
|Room with open window|Close the window|
|Smart home interface|Increase the temperature|
|Meeting room|Adjust the thermostat|
|Casual conversation|Complaint or observation|
|Caregiving context|Check someone's comfort|

The utterance does not explicitly request an action. However, depending on the situation, it may strongly imply one.

Literal meaning and intended meaning can diverge in several ways:

|Divergence type|Example|Likely intended meaning|
|---|---|---|
|Question as request|"Can you move this?"|Move this|
|Statement as warning|"That file is public."|Be careful before sharing|
|Observation as criticism|"This section is hard to follow."|Revise this section|
|Preference as constraint|"I prefer not to use vendors."|Avoid vendor-based options|
|Possibility as suggestion|"We could simplify this."|Consider simplifying this|

The intended meaning does not replace the literal meaning. It is inferred from the literal meaning plus context.

### 4.1.3 Contextual inference


Contextual inference is the process by which a listener uses surrounding information to infer what the speaker means.

Relevant context may include:

|Context type|Example|
|---|---|
|Current task|The user is editing a draft|
|Prior discourse|A previous message introduced "the second option"|
|Visible object|A paragraph is selected|
|User preference|The user usually prefers concise answers|
|Domain convention|"Ship it" means release or deploy in a software context|
|Social relation|A manager's suggestion may carry directive force|
|Time pressure|"Soon" means something different before a launch|

Example:

> "This is a little too aggressive."

Possible interpretation:

|Layer|Interpretation|
|---|---|
|Deictic reference|"This" refers to the current text, tone, proposal, or design|
|Evaluation|The object is judged too forceful|
|Politeness|"A little" softens the criticism|
|Intent|The speaker likely wants revision|
|Implied direction|Make it less harsh, less confrontational, or less assertive|

The utterance is grammatically a statement. In context, it functions as a revision request.

## 4.2 Speech Acts


A speech act is an action performed through language.

Natural language does not only encode propositions. It allows speakers to perform acts such as requesting, commanding, warning, confirming, refusing, correcting, and evaluating. These acts are often inferred rather than explicitly labeled.

Example:

> "No, use the other file."

This utterance performs several acts at once:

|Component|Function|
|---|---|
|"No"|Rejection or correction|
|"use"|Directive|
|"the other file"|Referential contrast|
|Whole utterance|Corrects a prior interpretation and redirects action|

Speech-act recognition is central to natural-language interpretation because the same propositional content can have different force.

Compare:

|Utterance|Likely speech act|
|---|---|
|"The meeting is tomorrow."|Statement|
|"Is the meeting tomorrow?"|Question|
|"Move the meeting to tomorrow."|Command or request|
|"Could we move the meeting to tomorrow?"|Suggestion or request|
|"The meeting should be tomorrow."|Recommendation|
|"The meeting must be tomorrow."|Requirement|

### 4.2.1 Request


A request asks another participant to do something.

Requests may be direct:

> "Send me the document."

They may also be indirect:

> "Could you send me the document?"

Or highly softened:

> "When you have a chance, could you send me the document?"

Requests often contain politeness markers, optionality, or timing softeners, but these do not necessarily make the request weak. A polite request can still be operationally important.

Common request forms:

|Form|Example|
|---|---|
|Imperative|"Send me the file."|
|Ability question|"Can you send me the file?"|
|Willingness question|"Would you send me the file?"|
|Need statement|"I need the file."|
|Preference statement|"I'd like the file today."|
|Problem statement|"I don't have the file yet."|

The last example is not grammatically a request, but in many contexts it functions as one.

### 4.2.2 Command


A command directs another participant to perform an action, usually with stronger force than a request.

Examples:

> "Delete the duplicate rows."
> "Restart the service."
> "Do not publish this version."

Commands may be marked by imperative syntax, urgency, authority, or explicit prohibition.

Commands differ from requests in force, not always in grammatical form. The same imperative can function as a command, instruction, suggestion, or routine step depending on context.

Example:

> "Try the second option."

Possible force:

|Context|Likely force|
|---|---|
|Supervisor to employee|Command or instruction|
|Peer brainstorming|Suggestion|
|Tutorial|Instruction|
|Debugging session|Diagnostic step|

Commands require attention to authority, obligation, and risk. Some commands are routine; others require confirmation, especially when they affect important objects or irreversible outcomes.

### 4.2.3 Question


A question seeks information, confirmation, clarification, or a decision.

Examples:

> "When is the meeting?"
> "Is this the final version?"
> "Which Sarah do you mean?"
> "Are we comfortable with this risk?"

Questions can perform several functions:

|Question type|Example|Function|
|---|---|---|
|Information question|"Where is the file?"|Seek missing information|
|Confirmation question|"This one, right?"|Verify assumption|
|Clarification question|"Which account?"|Resolve ambiguity|
|Rhetorical question|"Do we really want to risk that?"|Express doubt or objection|
|Leading question|"Wouldn't option B be safer?"|Suggest answer|
|Diagnostic question|"Did the error start after deployment?"|Narrow cause|

Questions are not always neutral requests for information. They can imply criticism, warning, skepticism, or recommendation.

### 4.2.4 Suggestion


A suggestion proposes a possible course of action without necessarily requiring it.

Examples:

> "We could simplify this section."
> "Maybe use the second chart."
> "It might be better to wait until Monday."

Suggestions often use modal expressions:

|Marker|Effect|
|---|---|
|"could"|Presents possibility|
|"might"|Weakens commitment|
|"maybe"|Softens proposal|
|"consider"|Frames as optional|
|"one option is"|Avoids directive force|

Suggestions can become stronger when combined with role, expertise, urgency, or repeated emphasis.

Example:

> "I really think we should not change the API before launch."

Although phrased as a recommendation, this may function as a strong warning or constraint.

### 4.2.5 Warning


A warning alerts the listener to possible risk, harm, failure, or undesirable consequence.

Examples:

> "This might break production."
> "The client will see this if we publish it."
> "That deadline is not realistic."
> "We do not have approval yet."

Warnings may be explicit or implicit.

Explicit warning:

> "Be careful -- this includes private data."

Implicit warning:

> "This includes private data."

The second sentence does not contain the words "be careful," but in many contexts it functions as a warning.

Warning force often depends on consequence framing:

|Utterance|Implied risk|
|---|---|
|"The database is live."|Avoid destructive action|
|"That branch has customer changes."|Do not overwrite casually|
|"Legal has not approved this."|Do not publish yet|
|"The numbers are preliminary."|Do not treat as final|

A warning can override otherwise plausible interpretations. If an utterance marks high risk, later interpretation should treat the situation as more constrained.

### 4.2.6 Correction


A correction revises a previous statement, assumption, action, or interpretation.

Examples:

> "No, I meant the other file."
> "Actually, use Monday, not Tuesday."
> "That's not the final version."
> "I meant Sarah from legal."

Corrections often target one of several dimensions:

|Correction target|Example|
|---|---|
|Referent|"Not that one -- the other one."|
|Time|"Tomorrow, not today."|
|Identity|"Alex Chen, not Alex Rivera."|
|Scope|"Only the urgent ones."|
|Intent|"I'm not asking you to send it, just summarize it."|
|Priority|"Cost matters, but reliability matters more."|

Corrections are discourse-sensitive. Their meaning depends on what was previously said, inferred, selected, or done.

### 4.2.7 Confirmation


A confirmation accepts, validates, or affirms a prior interpretation.

Examples:

> "Yes."
> "Exactly."
> "That one."
> "Correct."
> "Yes, use that version."

Confirmations may confirm different things:

|Confirmation target|Example|
|---|---|
|Referent|"Yes, that file."|
|Interpretation|"Exactly, make it less formal."|
|Action|"Yes, send it."|
|Constraint|"Correct, only internal users."|
|Result|"That looks right."|

Minimal confirmations are often underspecified. A bare "yes" may confirm the immediately prior question, the visible option, the proposed action, or the system's interpretation. The target must be recovered from discourse state.

### 4.2.8 Refusal


A refusal rejects a proposed action, claim, request, or assumption.

Examples:

> "No."
> "I can't approve that."
> "Let's not do that."
> "That won't work."
> "I'm not comfortable with this."

Refusals may be direct or softened.

|Direct refusal|Softened refusal|
|---|---|
|"No."|"I don't think that's the right move."|
|"That is wrong."|"I'm not sure that's accurate."|
|"I won't approve it."|"I'm not comfortable approving it yet."|

Refusals often imply an alternative path, even when unstated.

Example:

> "Let's not send this today."

Possible implications:

|Implied next step|
|---|
|Wait for review|
|Revise before sending|
|Seek approval|
|Delay until more information is available|

Refusal can also function as a safety or boundary signal when a proposed interpretation would be inappropriate, risky, unauthorized, or unwanted.

### 4.2.9 Evaluation


An evaluation expresses a judgment about quality, suitability, correctness, desirability, risk, or priority.

Examples:

> "This is too long."
> "Option B is safer."
> "The argument is weak."
> "That looks good."
> "This feels risky."

Evaluations often imply action.

|Evaluation|Possible implied action|
|---|---|
|"This is too long."|Shorten it|
|"The tone is too harsh."|Soften it|
|"Option B is safer."|Prefer or select option B|
|"This feels risky."|Reconsider or add mitigation|
|"That looks good."|Proceed or accept|

Evaluations can carry different levels of commitment:

|Utterance|Commitment level|
|---|---|
|"This is wrong."|Strong|
|"This seems wrong."|Moderate|
|"This might be wrong."|Weak|
|"I'm not sure this is right."|Tentative|

Evaluation is often where semantics, pragmatics, social stance, and intended action converge.

## 4.3 Indirect Speech Acts


An indirect speech act occurs when the literal form of an utterance differs from its intended communicative function.

Indirectness is not a rare exception. It is a normal feature of natural language. Speakers often use indirect forms to preserve politeness, reduce imposition, signal uncertainty, avoid confrontation, or leave room for negotiation.

Example:

> "Could you make this shorter?"

Literal form:

> Question about ability.

Likely speech act:

> Request to shorten the text.

### 4.3.1 Ability question as request


Ability questions frequently function as requests.

Examples:

|Utterance|Literal form|Likely intent|
|---|---|---|
|"Can you open the file?"|Ability question|Open the file|
|"Could you send this to Maria?"|Ability question|Send this to Maria|
|"Are you able to join at 3?"|Availability question|Join at 3 if possible|
|"Can you take another look?"|Ability question|Review it again|

The ability question creates a polite frame. It allows refusal or negotiation while still communicating a desired action.

However, not every ability question is a request.

Example:

> "Can you export this system to PDF?"

Possible interpretations:

|Context|Likely interpretation|
|---|---|
|User needs the file|Request|
|User is evaluating capability|Capability question|
|User is writing documentation|Feature inquiry|
|User is debugging permissions|Diagnostic question|

The distinction depends on context and discourse state.

### 4.3.2 Observation as implied request


An observation can imply a request when it identifies a problem, gap, or undesirable state.

Examples:

|Observation|Possible implied request|
|---|---|
|"This paragraph is too long."|Shorten it|
|"The chart is hard to read."|Improve the chart|
|"The meeting is still on my calendar."|Remove or reschedule it|
|"I don't see Alex on the invite."|Add Alex|
|"The tone feels too casual."|Make it more formal|

Observation-as-request is common in editing, design, planning, and task management contexts.

The implied request is stronger when:

- the speaker is reviewing an object;
- the listener is expected to modify it;
- the observation identifies a fixable defect;
- the current activity is revision-oriented;
- the statement follows a prior request for feedback or action.

### 4.3.3 Critique as revision request


Critique often functions as an implicit instruction to revise.

Example:

> "The opening is too vague."

Possible intended meaning:

> Revise the opening to be more specific.

Critique can target many dimensions:

|Critique|Likely revision direction|
|---|---|
|"Too vague"|Add specificity|
|"Too aggressive"|Soften tone|
|"Too dense"|Simplify or break up|
|"Not credible enough"|Add evidence|
|"Too salesy"|Make more neutral|
|"Not technical enough"|Add technical detail|

Critique may be softened for social reasons:

> "This might be a little too direct."

The softening does not eliminate the revision request. It modulates the social force of the critique.

### 4.3.4 Preference as constraint


A preference can function as a constraint on future interpretation or action.

Examples:

|Preference statement|Likely constraint|
|---|---|
|"I prefer shorter answers."|Keep responses concise|
|"I'd rather avoid vendors."|Exclude vendor-based options|
|"I like option B better."|Favor option B|
|"I don't want anything too formal."|Avoid formal tone|
|"Reliability matters more than cost."|Prioritize reliability|

Preferences vary in strength. Some are weak tendencies; others are hard constraints.

Compare:

|Utterance|Constraint strength|
|---|---|
|"I slightly prefer option A."|Weak preference|
|"I'd rather use option A."|Moderate preference|
|"We should use option A."|Recommendation|
|"We need to use option A."|Strong requirement|
|"Only use option A."|Hard constraint|

A natural-language interface must distinguish preference from requirement where possible, but it must also recognize that speakers often express requirements indirectly.

## 4.4 Implicature


Implicature is meaning that is implied but not explicitly stated.

Implicature relies on assumptions about relevance, informativeness, cooperation, and shared context. Speakers often communicate more than they literally say, and listeners infer the unstated content.

Example:

> "Some of the tests passed."

Literal meaning:

> At least some tests passed.

Common implicature:

> Not all tests passed.

The implicature arises because, if all tests had passed, the speaker would normally be expected to say so.

### 4.4.1 Relevance implicature


A relevance implicature arises when the listener assumes that the speaker's utterance is relevant to the current situation.

Example:

> "The client is on the call."

Possible implicatures:

|Context|Likely implication|
|---|---|
|Internal discussion|Be careful what you say|
|Presentation prep|Start or switch tone|
|Confidential topic|Stop discussing sensitive information|
|Delay in meeting|Begin now|

The utterance does not explicitly command caution, but its relevance in context may make that implication clear.

Other examples:

|Utterance|Possible relevance implicature|
|---|---|
|"Legal hasn't reviewed this."|Do not publish yet|
|"The database is live."|Avoid risky changes|
|"The deadline is today."|Prioritize this task|
|"Alex is out this week."|Do not assign Alex|

Relevance implicature is highly context-sensitive. The same utterance can imply different actions in different settings.

### 4.4.2 Scalar implicature


A scalar implicature occurs when a weaker expression implies that a stronger one does not apply.

Example:

> "Some users are affected."

Common implication:

> Not all users are affected.

The implication comes from a scale:

```text
some < many < most < all
```


If the speaker knew that all users were affected, they would normally say "all."

Common scalar terms:

|Scale|Weaker term|Stronger term|
|---|---|---|
|Quantity|some|all|
|Frequency|sometimes|always|
|Likelihood|possible|certain|
|Quality|acceptable|excellent|
|Urgency|soon|immediately|
|Obligation|should|must|

Examples:

|Utterance|Common implication|
|---|---|
|"This is possible."|It is not certain|
|"The draft is acceptable."|It may not be excellent|
|"We should do this."|It may not be mandatory|
|"Most checks passed."|Some checks failed or are unknown|
|"It is somewhat risky."|Risk exists but may not be extreme|

Scalar implicatures are defeasible. They can be cancelled.

Example:

> "Some of the tests passed -- in fact, all of them did."

The second clause cancels the usual implication.

### 4.4.3 Consequential implicature


A consequential implicature arises when an utterance implies practical consequences, risks, or next steps.

Example:

> "The contract expires Friday."

Possible implications:

|Context|Implied consequence|
|---|---|
|Renewal discussion|Renew or renegotiate before Friday|
|Procurement|Avoid service interruption|
|Legal review|Review terms quickly|
|Budget planning|Account for renewal cost|

The utterance itself reports a fact. But the fact is relevant because it changes what should happen next.

Other examples:

|Utterance|Possible consequential implicature|
|---|---|
|"The customer is waiting."|Respond soon|
|"We are over budget."|Reduce cost or seek approval|
|"The data includes minors."|Apply stricter handling|
|"The launch is tomorrow."|Avoid risky changes|
|"The file is shared externally."|Be careful with edits or comments|

Consequential implicature is especially important when the speaker states a condition rather than a direct instruction.

### 4.4.4 Domain-specific implicature


Domain-specific implicature depends on conventions, norms, or expectations within a particular field or activity.

Examples:

|Domain|Utterance|Possible implication|
|---|---|---|
|Software|"This is a breaking change."|Requires caution, migration, or approval|
|Legal|"This has not been reviewed."|Do not rely on or publish it|
|Medicine|"The patient is unstable."|Escalate attention|
|Finance|"The numbers are unaudited."|Treat as provisional|
|Design|"This feels off-brand."|Revise visual or tonal alignment|
|Sales|"The client is procurement-led."|Expect price scrutiny|

Domain-specific implicature can be opaque to outsiders. The words may be ordinary, but their significance depends on the domain.

Example:

> "The API is public."

In a software context, this may imply compatibility constraints, documentation requirements, versioning concerns, and higher risk for changes.

## 4.5 Relevance Filtering


Natural language usually permits many possible interpretations. Relevance filtering is the process by which the listener selects the interpretation that best fits the current task, context, domain, and user goal.

Example:

> "Is Jordan available tomorrow?"

Possible meanings of "available" include:

- free for a meeting;
- available for work;
- available by phone;
- available as a contractor;
- emotionally available;
- visible in a scheduling system;
- not blocked by permissions.

In a scheduling context, the relevant interpretation is usually:

> Is Jordan free for a meeting tomorrow?

Natural-language interpretation therefore requires selecting among plausible meanings, not merely listing them.

### 4.5.1 Task-relevant interpretation


Task-relevant interpretation selects the meaning that best fits the active task.

Example:

> "Make it lighter."

Possible meanings:

|Active task|Likely meaning|
|---|---|
|Editing text|Make the tone less serious|
|Visual design|Use lighter colors or reduce visual weight|
|Product design|Reduce complexity|
|File compression|Reduce file size|
|Physical object|Reduce weight|

The same phrase changes meaning depending on the task frame.

Task relevance is often established by prior turns:

> "Revise this email."
> "Make it lighter."

Here, "lighter" likely refers to tone, not color, weight, or file size.

### 4.5.2 Domain-relevant interpretation


Domain-relevant interpretation selects the meaning that fits the specialized vocabulary and norms of the domain.

Example:

> "The branch is stale."

Possible meanings:

|Domain|Interpretation|
|---|---|
|Software development|Code branch is behind or outdated|
|Botany|Tree branch is dry or dead|
|Organization|Local branch is inactive|
|Banking|Physical branch has outdated operations|

In a code-review context, the software interpretation is dominant.

Domain relevance can also resolve metaphor.

Example:

> "The pipeline is blocked."

In a data engineering context, this likely concerns a processing pipeline. In a construction context, it may refer to a literal pipe or project pipeline.

### 4.5.3 User-goal-relevant interpretation


User-goal relevance selects the interpretation that best serves the user's likely objective.

Example:

> "I need something more polished."

Possible meanings:

|User goal|Likely interpretation|
|---|---|
|Preparing an executive memo|Improve tone, structure, and clarity|
|Designing a landing page|Refine visual presentation|
|Preparing code|Improve style and maintainability|
|Preparing slides|Improve layout, hierarchy, and wording|

The phrase "more polished" is vague, but the user's goal narrows the expected interpretation.

User-goal relevance may come from:

- explicit stated goals;
- prior preferences;
- current project;
- selected artifact;
- constraints already introduced;
- audience or use case.

### 4.5.4 Salience and suppression of irrelevant meanings


Salience determines which meanings are prominent enough to consider. Relevance filtering also suppresses technically possible but contextually irrelevant meanings.

Example:

> "Book a table."

In a restaurant-planning context, "book" means reserve and "table" means restaurant seating. The possible interpretation "create a database table" is suppressed.

Suppression is not deletion. If later context changes, a suppressed interpretation can become relevant.

Example:

> "Book a table in the reservations database."

Now "table" may refer to a database object, and "book" may be interpreted as recording or creating an entry.

Salience can be affected by:

|Salience source|Example|
|---|---|
|Recent mention|"the second one" refers to a recent list|
|Visual prominence|"this" refers to selected text|
|Task frame|"lighter" in design means visual weight|
|User role|"deploy" means something specific for an engineer|
|Frequency|Common meanings are considered first|
|Risk|High-risk meanings may require explicit confirmation|

Relevance filtering is therefore both enabling and dangerous. It makes efficient communication possible, but it can also produce wrong assumptions when context is incomplete or misleading.

## 4.6 Action Fan-Out


Action fan-out occurs when a single utterance implies more than one underlying action.

Natural language often compresses complex activity into a short phrase. A user may describe an outcome, process, or goal without listing every required step.

Example:

> "Onboard the new contractor."

Possible implied actions:

|Implied action|
|---|
|Create account|
|Add to communication channels|
|Assign onboarding documents|
|Grant project access|
|Schedule introductory meetings|
|Notify manager|
|Confirm compliance requirements|

The utterance is a single speech act at the conversational level, but it may correspond to a multi-step activity at the task level.

Action fan-out is not implementation detail by itself. It is a semantic property of natural-language intent: speakers often name a high-level activity and expect its conventional sub-actions to be understood.

### 4.6.1 Single utterance to single action


Some utterances map naturally to one primary action.

Examples:

|Utterance|Primary action|
|---|---|
|"Delete this paragraph."|Delete selected paragraph|
|"Call Maria."|Place or initiate call|
|"Open the report."|Open document|
|"Summarize this."|Produce summary|
|"Move the meeting to Friday."|Reschedule meeting|

Even simple action mappings may still require reference resolution, permissions, or clarification. But the intended action type is relatively narrow.

### 4.6.2 Single utterance to parameterized action


Some utterances imply one action type but require parameters to be filled.

Example:

> "Schedule a meeting with Alex."

Primary action:

> Schedule meeting.

Missing or inferable parameters:

|Parameter|Possible source|
|---|---|
|Which Alex|Contacts, prior discourse, organization|
|Date|User preference, calendar availability, follow-up|
|Time|Calendar constraints|
|Duration|Default meeting length|
|Topic|Prior task context|
|Medium|Default meeting channel|
|Participants|Explicit and implicit invitees|

The utterance names the action but leaves many arguments underspecified. This is normal in natural language.

### 4.6.3 Single utterance to workflow


Some utterances name an outcome that conventionally requires a sequence of actions.

Examples:

|Utterance|Implied workflow|
|---|---|
|"Prepare the launch announcement."|Draft, review, revise, schedule|
|"Clean up this spreadsheet."|Detect issues, normalize fields, remove duplicates, format|
|"Get approval from legal."|Identify reviewer, send materials, track response|
|"Plan the offsite."|Select date, venue, agenda, attendees, logistics|
|"Make this presentation client-ready."|Revise content, improve visuals, check tone, verify data|

Workflow-level utterances often combine intent, quality criteria, and domain expectations.

Example:

> "Make this investor-ready."

This may imply:

- sharpen the narrative;
- improve credibility;
- add metrics;
- reduce internal jargon;
- improve visual polish;
- anticipate objections;
- check consistency.

The phrase compresses a broad standard into a compact request.

### 4.6.4 Single utterance to multi-step orchestration


Some utterances imply coordinated actions across multiple objects, people, times, or systems.

Examples:

|Utterance|Possible orchestration|
|---|---|
|"Move the workshop to next week."|Find new time, update invite, notify participants, adjust room, update agenda|
|"Set up Alex for the project."|Add to workspace, share docs, grant access, assign tasks, introduce team|
|"Prepare everything for Monday."|Identify required materials, update documents, schedule reminders, confirm stakeholders|
|"Follow up with everyone who has not replied."|Determine non-respondents, draft message, choose channel, send or queue follow-up|
|"Roll this out to the pilot group."|Identify group, prepare communication, enable feature, monitor response|

At this level, the utterance does not only specify an action. It invokes a socially or institutionally recognized activity pattern.

Action fan-out creates several interpretation questions:

|Question|Example|
|---|---|
|What sub-actions are conventionally included?|Does "onboard" include access provisioning?|
|Which sub-actions are optional?|Does "prepare" include sending?|
|What order is implied?|Review before publication|
|Which actors are involved?|Legal, manager, owner, recipient|
|Which steps require confirmation?|External sending, deletion, permission changes|
|Which assumptions are unsafe?|Granting access without approval|

Action fan-out is one reason high-level natural-language intent cannot be treated as a single flat instruction.

## 4.7 Summary: How Utterances Become Communicative Acts


Communicative force and intent explain how utterances become actions in context.

A sentence may look like a question but function as a request. A statement may function as a warning. A critique may function as a revision instruction. A preference may function as a constraint. A short phrase may imply a multi-step activity.

Key properties:

|Property|Core question|Example|
|---|---|---|
|Pragmatics|What does the speaker mean in context?|"It's cold in here."|
|Speech act|What act is being performed?|request, warning, correction|
|Indirect speech act|Does the form differ from the function?|"Can you send this?"|
|Implicature|What is implied but unstated?|"Some tests passed."|
|Relevance filtering|Which interpretation matters here?|"Is Jordan available?"|
|Action fan-out|What action structure is implied?|"Onboard the contractor."|

The central principle of this section is:

```text
Natural-language interpretation requires identifying not only what an utterance says, but what the speaker is doing by saying it.
```

# 5. Discourse State and Conversational Mutation


Natural-language meaning evolves across turns.

Users rarely express all constraints, corrections, preferences, and clarifications in a single complete utterance. They refine meaning incrementally. They correct themselves. They revise earlier instructions. They add constraints, retract assumptions, shift priorities, and rely on prior conversational state.

Discourse is therefore not just a sequence of sentences. It is a changing state of commitments, referents, constraints, goals, assumptions, and salience.

This section describes how meaning is organized and mutated across conversational context.

## 5.1 Discourse Structure


Discourse structure concerns how clauses, sentences, turns, and larger units relate to one another.

Natural language uses explicit markers, ordering, and contextual inference to express relations such as sequence, contrast, cause, condition, exception, elaboration, and summary.

Example:

> "First summarize the report, then extract the risks, but skip the appendix unless it contains financial data."

This utterance contains multiple discourse relations:

|Segment|Relation|
|---|---|
|"First summarize the report"|Initial step|
|"then extract the risks"|Sequence|
|"but skip the appendix"|Contrast or exception|
|"unless it contains financial data"|Conditional exception|

Discourse structure affects how instructions combine. It determines whether clauses are additive, contrastive, conditional, corrective, or subordinate.

### 5.1.1 Sequence


Sequence indicates ordering among events, actions, or ideas.

Markers include:

```text
first
then
next
after that
before
finally
once
after
```


Example:

> "First clean the data, then generate the chart."

Meaning:

|Step|Action|
|---|---|
|1|Clean the data|
|2|Generate the chart|

Sequence can be temporal, procedural, narrative, or argumentative.

Examples:

|Utterance|Sequential relation|
|---|---|
|"Review the draft before sending it."|Review precedes sending|
|"After Alex approves it, publish the update."|Approval precedes publication|
|"Start with the summary, then add the details."|Summary precedes details|
|"Once the data is final, update the report."|Data finalization precedes update|

Sequential interpretation matters because later actions may depend on earlier ones.

### 5.1.2 Contrast


Contrast indicates difference, opposition, or correction between discourse units.

Markers include:

```text
but
however
although
though
instead
rather
whereas
not X but Y
```


Example:

> "The draft is clear, but the tone is too casual."

Meaning:

|Segment|Function|
|---|---|
|"The draft is clear"|Positive evaluation|
|"but the tone is too casual"|Contrasting negative evaluation|

Contrast often shifts focus to the second element.

Example:

> "Use the shorter version, not the more detailed one."

The contrast identifies the intended choice by excluding an alternative.

Contrast can also indicate preference:

> "Cost matters, but reliability matters more."

The second criterion has higher priority.

### 5.1.3 Cause


Cause indicates that one event, state, or fact explains another.

Markers include:

```text
because
since
as
due to
therefore
so
that means
as a result
```


Example:

> "The import failed because the file is malformed."

Meaning:

|Effect|Cause|
|---|---|
|Import failed|File is malformed|

Causal relations support diagnosis, explanation, and prioritization.

Examples:

|Utterance|Causal interpretation|
|---|---|
|"The page is slow because the images are too large."|Image size explains latency|
|"We missed the deadline because approval came late."|Late approval explains delay|
|"The numbers changed because the source data was updated."|Data update explains numerical change|

Cause can be explicit or inferred.

Example:

> "The file is locked. I can't edit it."

The causal connection is not marked by "because," but it is strongly implied.

### 5.1.4 Condition


Condition indicates that one action, claim, or outcome depends on another.

Markers include:

```text
if
unless
provided that
as long as
only if
when
in case
```


Example:

> "If Alex approves it, send it to the client."

Meaning:

|Condition|Consequent|
|---|---|
|Alex approves it|Send it to the client|

Conditional structure can affect permission, timing, and action eligibility.

Examples:

|Utterance|Conditional meaning|
|---|---|
|"If the numbers are final, include them."|Include only if final|
|"Unless legal objects, proceed."|Proceed unless blocked|
|"Only send it if Maria confirms."|Confirmation required|
|"When the file is ready, share it."|Readiness triggers sharing|

Conditional interpretation is often critical because it determines whether an action should occur at all.

### 5.1.5 Exception


Exception indicates that a general rule, instruction, or description does not apply in a specific case.

Markers include:

```text
except
except for
unless
other than
apart from
but not
excluding
```


Example:

> "Invite everyone except contractors."

Meaning:

|General set|Excluded subset|
|---|---|
|Everyone|Contractors|

Exceptions can apply to people, objects, time ranges, actions, or conditions.

Examples:

|Utterance|Exception|
|---|---|
|"Use the default settings except for admins."|Admins differ from default|
|"Send it to the team, but not the external list."|External list excluded|
|"Archive all old files except the signed contracts."|Signed contracts preserved|
|"Apply this everywhere except production."|Production excluded|

Exceptions are easy to miss because they may appear after a broad instruction. The later exception narrows or overrides the earlier generalization.

### 5.1.6 Elaboration


Elaboration adds detail, specification, examples, or clarification to a prior statement.

Markers include:

```text
specifically
in particular
for example
that is
meaning
namely
especially
```


Example:

> "The issue is access control. Specifically, external users can view internal comments."

Meaning:

|General statement|Elaboration|
|---|---|
|Access control issue|External users can view internal comments|

Elaboration narrows or enriches interpretation.

Examples:

|Utterance|Elaboration function|
|---|---|
|"Make it more professional -- specifically, less casual and more concise."|Defines "professional"|
|"Focus on risk, especially launch risk."|Narrows focus|
|"The data is incomplete, meaning the last two weeks are missing."|Explains incompleteness|
|"Use senior reviewers, for example Priya or Daniel."|Gives examples|

Elaboration is often used to resolve vagueness or provide operational criteria.

### 5.1.7 Summary


Summary compresses prior discourse into a shorter formulation.

Markers include:

```text
in short
overall
basically
the main point is
to summarize
bottom line
```


Example:

> "In short, the migration is risky but necessary."

A summary may preserve only the most salient claims, dropping details that were previously discussed.

Summaries can function as:

|Function|Example|
|---|---|
|Compression|"Bottom line: delay the launch."|
|Decision framing|"Overall, option B is safest."|
|Priority signal|"The main issue is reliability."|
|Transition|"In short, we need a simpler plan."|
|Confirmation candidate|"So, we are waiting for legal."|

A summary can also establish the current discourse state. Once a speaker summarizes, later references may attach to the summary rather than to every prior detail.

## 5.2 Discourse Markers


Discourse markers are words or phrases that guide how one part of discourse relates to another.

They do not always contribute ordinary propositional content. Instead, they signal structure, stance, correction, contrast, inference, exception, example, or compression.

Examples:

```text
however
therefore
actually
instead
unless
for example
in short
```


A discourse marker can change how an utterance updates conversational state.

Compare:

|Utterance|Effect|
|---|---|
|"Use the first option."|Selects first option|
|"Actually, use the first option."|Revises or corrects prior state|
|"Instead, use the first option."|Replaces a previous option|
|"Therefore, use the first option."|Frames selection as conclusion|

### 5.2.1 however


"However" marks contrast, qualification, or partial opposition.

Example:

> "The proposal is strong. However, the timeline is unrealistic."

Function:

|First clause|Second clause|
|---|---|
|Positive evaluation|Contrasting limitation|

"However" often shifts interpretive weight to the second statement. The second statement may identify the main caveat.

Other examples:

|Utterance|Function|
|---|---|
|"The design is clean. However, accessibility is weak."|Positive plus caveat|
|"The plan is feasible. However, it requires approval."|Feasible with condition|
|"The data is useful. However, it is incomplete."|Useful but limited|

### 5.2.2 therefore


"Therefore" marks inference or conclusion.

Example:

> "The client has not approved the draft. Therefore, do not publish it yet."

Function:

|Premise|Conclusion|
|---|---|
|Client has not approved|Do not publish|

"Therefore" signals that the second clause follows from the first. It often converts facts into action-relevant conclusions.

Other examples:

|Utterance|Function|
|---|---|
|"The numbers are provisional; therefore, label them clearly."|Fact -> instruction|
|"The file is public; therefore, remove internal comments."|Risk -> action|
|"The deadline moved; therefore, update the timeline."|Change -> consequence|

### 5.2.3 actually


"Actually" often marks correction, revision, contrast with expectation, or change of mind.

Examples:

> "Actually, use the other file."
> "Actually, make it more concise."
> "Actually, I meant next Thursday."

Functions:

|Use|Example|
|---|---|
|Self-correction|"Actually, I meant Maria."|
|Change of preference|"Actually, option B is better."|
|Correction of assumption|"Actually, the file is already approved."|
|Topic adjustment|"Actually, let's focus on risk first."|

"Actually" is a strong signal that prior discourse state may need to be updated or partially invalidated.

### 5.2.4 instead


"Instead" marks replacement.

Example:

> "Don't send the email. Instead, save it as a draft."

Meaning:

|Rejected action|Replacement action|
|---|---|
|Send email|Save as draft|

"Instead" differs from simple addition. It usually means the new action supersedes an earlier action, option, or plan.

Examples:

|Utterance|Replacement|
|---|---|
|"Use the chart instead."|Chart replaces previous object|
|"Invite Priya instead of Alex."|Priya replaces Alex|
|"Make it shorter instead of more formal."|Brevity replaces formality as revision direction|

### 5.2.5 unless


"Unless" marks a negative condition or exception.

Example:

> "Send it tomorrow unless legal objects."

Meaning:

|Default action|Blocking condition|
|---|---|
|Send tomorrow|Legal objects|

"Unless" can make an action conditional even when the main clause appears directive.

Examples:

|Utterance|Interpretation|
|---|---|
|"Proceed unless Maria says no."|Proceed by default|
|"Use the default settings unless the account is external."|External accounts are exception|
|"Publish it unless the numbers change."|Do not publish if numbers change|

"Unless" requires tracking both default behavior and exception conditions.

### 5.2.6 for example


"For example" introduces an instance, illustration, or non-exhaustive member of a broader category.

Example:

> "Add stronger evidence, for example customer quotes or usage data."

The examples illustrate possible evidence types. They may not be the only acceptable options.

Interpretation question:

```text
Are the examples mandatory, preferred, illustrative, or exhaustive?
```


In many contexts, "for example" indicates non-exhaustiveness. But in task settings, examples may still guide expected output.

Other examples:

|Utterance|Function|
|---|---|
|"Use a warmer tone, for example less legalistic phrasing."|Illustrates tone shift|
|"Focus on risks, for example privacy and launch timing."|Suggests salient risks|
|"Mention stakeholders, for example sales and support."|Gives candidate categories|

### 5.2.7 in short


"In short" introduces a compressed summary or conclusion.

Example:

> "In short, the plan is viable but risky."

Function:

|Prior discourse|Summary|
|---|---|
|Detailed evaluation|Compressed judgment|

"In short" often signals that the speaker is establishing the high-level takeaway. Later interpretation may treat this summary as the current salient state.

Other examples:

|Utterance|Function|
|---|---|
|"In short, wait for approval."|Converts discussion into recommendation|
|"In short, option B wins."|Establishes selection|
|"In short, the draft needs evidence."|Establishes main revision direction|

## 5.3 Repair and Correction


Repair occurs when a speaker fixes, revises, clarifies, or replaces part of a prior utterance or interpretation.

Natural language supports repair as a normal part of communication. Speakers often do not produce final, fully specified meaning in one pass. They rely on later turns to adjust reference, constraints, scope, priority, and intent.

Examples:

> "No, I meant the other file."
> "Actually, make it shorter, not more formal."
> "Sorry, I meant Sarah from legal."
> "Let me rephrase that."

Repair may target:

|Target|Example|
|---|---|
|Referent|"Not that one."|
|Parameter|"Use Friday, not Thursday."|
|Intent|"I'm not asking you to send it yet."|
|Scope|"Only the external users."|
|Priority|"Actually, speed matters more than cost."|
|Assumption|"The file is already approved."|

### 5.3.1 Self-repair


Self-repair occurs when the speaker corrects or revises their own utterance.

Examples:

> "Send it to Alex -- sorry, I mean Jordan."
> "Schedule it for Friday. Actually, Monday is better."
> "Make it more formal -- no, more concise."

Self-repair may occur immediately or after intervening discourse.

Immediate self-repair:

> "Use the blue version -- sorry, the green one."

Delayed self-repair:

> "Earlier I said to use the green version. Actually, use the blue one."

Self-repair requires updating prior state. The corrected material may replace, narrow, or cancel the original material.

### 5.3.2 Other-repair


Other-repair occurs when another participant identifies or corrects a problem in the speaker's utterance or interpretation.

Examples:

> "Do you mean Alex Chen or Alex Rivera?"
> "That meeting is already cancelled."
> "There are two files with that name."
> "I think you meant next Tuesday, not this Tuesday."

Other-repair may take the form of:

|Form|Example|
|---|---|
|Clarification request|"Which Alex?"|
|Candidate interpretation|"Do you mean the Q4 report?"|
|Contradiction|"That file does not exist."|
|Correction|"The meeting is on Wednesday."|
|Constraint reminder|"External sharing is not approved."|

Other-repair is not merely error handling. It is part of collaborative meaning construction.

### 5.3.3 Referent correction


Referent correction changes which entity an expression refers to.

Examples:

> "Not that file -- the one from yesterday."
> "I meant Sarah from legal, not Sarah from finance."
> "Use the second chart, not the first."
> "No, the other Alex."

Referent correction often relies on contrastive language:

```text
not X, Y
the other one
the one from yesterday
the second one
that one, not this one
```


Referent correction can also affect previous actions or planned actions. If the wrong referent was selected, subsequent instructions may need to be reattached to the corrected referent.

### 5.3.4 Parameter correction


Parameter correction changes a value associated with an action, object, or constraint.

Examples:

> "Use Monday, not Friday."
> "Make it 30 minutes instead of an hour."
> "Send it to the internal list, not the full list."
> "Actually, use the latest version."

Parameters may include:

|Parameter type|Example|
|---|---|
|Time|Monday, 3 PM, next week|
|Quantity|three options, 500 words|
|Scope|internal users, urgent items|
|Format|PDF, spreadsheet, bullet list|
|Tone|formal, concise, softer|
|Recipient|Alex, legal, client|
|Threshold|under \$500, within 10 miles|

Parameter correction is often local: it changes one part of an otherwise stable intent.

### 5.3.5 Intent correction


Intent correction changes the action or communicative force itself.

Examples:

> "I'm not asking you to send it, just summarize it."
> "Don't rewrite it -- explain what's wrong."
> "I only wanted a recommendation, not a full plan."
> "I meant compare them, not choose one."

Intent correction is deeper than parameter correction. The object or topic may remain the same, but the requested act changes.

Compare:

|Original interpretation|Intent correction|
|---|---|
|Send the file|"Just summarize it."|
|Rewrite the draft|"Only comment on it."|
|Choose an option|"Compare the options."|
|Schedule meeting|"Find possible times first."|
|Delete records|"Flag them for review."|

Intent correction can invalidate an entire action path.

### 5.3.6 Scope correction


Scope correction changes the range of objects, people, cases, or conditions to which an instruction applies.

Examples:

> "Only the urgent ones."
> "Not all customers -- just enterprise accounts."
> "Apply that to the summary, not the whole document."
> "Use it for internal emails only."

Scope correction can narrow, broaden, or shift the target set.

|Scope change|Example|
|---|---|
|Narrowing|"Only active users."|
|Broadening|"Actually, include contractors too."|
|Exclusion|"Everyone except vendors."|
|Domain shift|"Use that rule for renewals, not new sales."|
|Section shift|"Only the introduction."|

Scope correction is especially important because users often express broad instructions first and then constrain them later.

## 5.4 Incremental Refinement


Incremental refinement occurs when a speaker gradually modifies an earlier request, search, plan, or interpretation.

Example:

> "Find hotels in Madrid."
> "Under \$200."
> "Near the conference venue."
> "Actually, prioritize quiet ones."

Each turn modifies the active task. Later utterances may be fragmentary because they rely on the prior state.

Incremental refinement is normal because users often discover their requirements through interaction. Natural language allows the task representation to be built progressively.

### 5.4.1 Adding constraints


Adding constraints narrows or conditions the current task.

Examples:

> "Only include open-source options."
> "Make it under 500 words."
> "Use examples from healthcare."
> "Avoid anything too technical."
> "Include the risks."

Added constraints attach to an existing task or object.

Example:

> "Draft a message to the team."
> "Make it more direct."
> "Also mention the Friday deadline."

The later utterances do not start new tasks. They refine the original drafting task.

### 5.4.2 Removing constraints


Removing constraints relaxes a prior condition.

Examples:

> "Actually, budget does not matter."
> "Ignore the word limit."
> "It does not have to be in table format."
> "You can include vendors after all."
> "No need to keep it formal."

Constraint removal can broaden the solution space or change the interpretation of earlier instructions.

Example:

> "Find options under \$100."
> "Actually, remove the price limit."

The price constraint no longer applies.

### 5.4.3 Narrowing the search space


Narrowing reduces the set of acceptable options.

Examples:

> "Only show remote roles."
> "Just the last quarter."
> "Focus on enterprise customers."
> "Use the top three."
> "Exclude anything deprecated."

Narrowing often appears in elliptical fragments:

> "Only 14-inch ones."
> "Just internal users."
> "No vendors."
> "Last month only."

These fragments depend on the current task state for interpretation.

### 5.4.4 Broadening the search space


Broadening expands the set of acceptable options.

Examples:

> "Include contractors too."
> "Show options outside New York."
> "It can be longer if needed."
> "Consider paid tools as well."
> "Include last year's data too."

Broadening may cancel an earlier narrowing constraint.

Example:

> "Only open-source tools."
> "Actually, include commercial tools if they are clearly better."

The new instruction broadens the candidate set while adding a condition.

### 5.4.5 Reprioritizing criteria


Reprioritizing changes the relative importance of criteria.

Examples:

> "Actually, speed matters more than cost."
> "Prioritize reliability over elegance."
> "Make accuracy the main thing."
> "Tone matters more than length here."
> "Focus less on features and more on risk."

Reprioritization may not add or remove constraints. Instead, it changes how tradeoffs should be resolved.

Example:

> "Find a cheap laptop with strong battery life."
> "Actually, battery life matters more than price."

The criteria remain, but their ordering changes.

## 5.5 Mixed Initiative


Mixed initiative means that more than one participant can guide the interaction.

In natural conversation, the user does not always provide a complete instruction, and the other participant does not merely execute. Either side may ask clarifying questions, propose interpretations, identify constraints, suggest next steps, or reframe the problem.

Example:

> User: "Help me compare these options."
> Response: "Do you care more about cost, risk, or speed?"
> User: "Risk first."

The interaction jointly constructs the task.

### 5.5.1 User-led initiative


User-led initiative occurs when the user controls the direction of the interaction.

Examples:

> "Start with the risks."
> "Now compare the pricing."
> "Ignore that and focus on implementation."
> "Ask me one question at a time."
> "Use the second option."

User-led initiative may introduce:

|Initiative type|Example|
|---|---|
|Topic shift|"Now let's talk about launch."|
|Constraint|"Keep it under 300 words."|
|Priority|"Accuracy matters most."|
|Method|"Use a table."|
|Correction|"No, I meant the other file."|

### 5.5.2 System-led clarification


System-led clarification occurs when the other participant asks for information needed to interpret or proceed.

Examples:

> "Which Alex do you mean?"
> "Should this be formal or casual?"
> "Do you want a summary or a full rewrite?"
> "Should I include external recipients?"
> "Is the deadline today or tomorrow?"

Clarification is appropriate when the missing information materially affects interpretation, risk, or outcome quality.

Clarification questions can target:

|Target|Example|
|---|---|
|Referent|"Which file?"|
|Intent|"Do you want me to send it or draft it?"|
|Scope|"All users or only admins?"|
|Threshold|"What counts as cheap?"|
|Priority|"Speed or accuracy?"|
|Permission|"Should external sharing be included?"|

### 5.5.3 Collaborative narrowing


Collaborative narrowing occurs when participants jointly reduce uncertainty or narrow a broad request.

Example:

> User: "Find a good venue."
> Response: "Should I prioritize price, capacity, or location?"
> User: "Capacity first, then location."

The task becomes clearer through interaction.

Collaborative narrowing is useful when:

- the initial request is broad;
- multiple reasonable interpretations exist;
- user preferences are unknown;
- tradeoffs are unavoidable;
- proceeding without clarification would require unstable assumptions.

### 5.5.4 Reframing and negotiation


Reframing changes the way the task or problem is represented. Negotiation adjusts goals, constraints, or acceptable outcomes.

Examples:

> "Instead of rewriting the whole memo, maybe revise the executive summary first."
> "The issue may not be tone; it may be missing evidence."
> "Rather than scheduling a meeting, we could send a decision memo."
> "If speed matters most, we should drop the custom design."

Reframing can be initiated by either participant.

Negotiation may involve:

|Negotiation object|Example|
|---|---|
|Scope|"Do we need the full report or just findings?"|
|Priority|"Accuracy will take longer than a quick summary."|
|Constraint|"Under 200 words may be too short for this audience."|
|Risk|"Sending externally before approval is risky."|
|Goal|"Maybe the goal is alignment, not documentation."|

Reframing is a discourse-level operation because it changes the interpretation of the entire task, not just a local parameter.

## 5.6 Redundancy and Emphasis


Natural language uses repetition and redundancy for more than error tolerance. Redundancy can signal importance, urgency, contrast, emotional force, correction, or priority.

Example:

> "I need this today, before end of day, ideally by 5."

The deadline is repeated in several forms. The repetition reinforces urgency and reduces the chance of misinterpretation.

Redundancy is not automatically noise. It may be semantically meaningful.

### 5.6.1 Repetition as priority signal


Repetition can indicate that something matters more than other criteria.

Examples:

> "Keep it simple. Very simple."
> "The main issue is trust -- trust is the thing to solve."
> "Accuracy matters here. Accuracy over speed."
> "Do not change the API. No API changes."

Priority repetition often identifies a dominant constraint.

Example:

> "Reliability, reliability, reliability."

This may mean reliability should override competing goals.

### 5.6.2 Repetition as urgency signal


Repetition can intensify time pressure.

Examples:

> "Today, not tomorrow."
> "I need this now -- really now."
> "Before the meeting. Before 3 PM."
> "This has to go out today."

Urgency repetition may combine with deadlines, consequences, or emotional stance.

Example:

> "We need this before the client call, otherwise we lose the window."

The repetition plus consequence framing signals high priority.

### 5.6.3 Repetition as contrast


Repetition can mark contrast between accepted and rejected alternatives.

Examples:

> "The internal version, not the external version."
> "Monday, not Tuesday."
> "The summary, not the full report."
> "Shorter, not less detailed."

Contrastive repetition clarifies which dimension is being changed.

Example:

> "Make it simpler, not shorter."

This indicates that simplification, not length reduction, is the intended revision direction.

### 5.6.4 Repetition as repair


Repetition can repair a misheard, misunderstood, or wrongly inferred element.

Examples:

> "No, Alex Chen. Alex Chen from legal."
> "The Q4 report -- Q4, not Q3."
> "I said internal users, internal only."
> "Use the draft version. The draft version."

Repair repetition increases salience and reduces ambiguity.

Repetition may also indicate frustration if prior corrections were missed.

Example:

> "No, not that one. The other one. The other one from yesterday."

Here repetition functions as both repair and affective signal.

## 5.7 Non-Monotonicity


Non-monotonicity means that later discourse can invalidate, revise, weaken, or cancel earlier discourse.

In natural conversation, adding new information does not always simply add to the previous state. It may change what counts as the current instruction, current referent, current constraint, or current belief.

Example:

> "Make it larger. Actually, leave it as-is."

The second sentence cancels the first. The conversational state does not contain both instructions as equally active.

Non-monotonicity is central to repair, correction, and refinement.

### 5.7.1 Later turns invalidating earlier turns


A later turn may invalidate an earlier instruction or assumption.

Examples:

> "Send it to Alex. Actually, don't send it yet."
> "Use the first version. No, use the second."
> "Schedule it for Friday. Wait, Monday is better."
> "Summarize the whole report. Actually, just the risks."

The later turn changes the active state.

Invalidation may be explicit:

```text
actually
no
wait
scratch that
instead
I changed my mind
```


Or implicit:

> "Use the second version."

If a first version had previously been selected, this may replace it.

### 5.7.2 Retraction of extracted parameters


A speaker may retract a parameter that was previously introduced.

Examples:

> "Make it under 500 words. Actually, length does not matter."
> "Schedule it with Maria. No, leave Maria out."
> "Use the New York data. Actually, exclude New York."
> "Send it tomorrow. Wait, do not send it yet."

Retraction differs from overwriting. The earlier parameter may become inactive rather than replaced by a new specific value.

Example:

> "Under \$100."
> "Actually, no price limit."

The price parameter is not changed from `$100` to another number. It is removed.

### 5.7.3 Soft cancellation


Soft cancellation weakens or partially cancels a prior instruction without an explicit contradiction.

Examples:

> "Maybe don't worry about the formatting."
> "Actually, the tone is more important than the length."
> "Leave the details if they help."
> "It does not have to be that short."

Soft cancellation often uses hedges or reframing rather than direct negation.

Example:

> "Make it concise."
> "But don't cut the examples."

The second utterance partially cancels one likely interpretation of "concise": removing examples.

### 5.7.4 Partial revision


Partial revision changes one component while preserving others.

Examples:

> "Keep the structure, but make the tone warmer."
> "Use the same content, just shorten the intro."
> "Leave the chart, but update the labels."
> "Keep option B, but change the rollout date."

Partial revision requires distinguishing stable elements from revised elements.

|Stable element|Revised element|
|---|---|
|Structure|Tone|
|Content|Introduction length|
|Chart|Labels|
|Option B|Rollout date|

Partial revision is one of the most common conversational operations in editing, planning, and decision support.

### 5.7.5 Conflicting updates


Conflicting updates occur when later information is incompatible with earlier information, but the discourse does not clearly resolve which should dominate.

Example:

> "Keep it under 300 words."
> "Include all technical details."

These constraints may conflict.

Other examples:

|Earlier update|Later update|Potential conflict|
|---|---|---|
|"Make it informal."|"Use legal language."|Tone conflict|
|"Only internal users."|"Send it to the client."|Scope conflict|
|"Prioritize speed."|"Be exhaustive."|Priority conflict|
|"Do not change the structure."|"Move the recommendations to the top."|Structural conflict|

Conflicting updates require resolution through context, priority, clarification, or repair.

## 5.8 Conversational Memory Limits


Conversational meaning depends on memory, salience, and state tracking. But discourse context is limited. References can become stale, priorities can be forgotten, constraints can conflict, and earlier assumptions can become unreliable.

Memory limits are not only technical. Human conversations also suffer from drift, overload, and loss of salience.

### 5.8.1 Stale references


A stale reference points to an object or state that is no longer current, salient, available, or valid.

Examples:

> "Use that one."
> "Same as before."
> "The previous version."
> "Move it to tomorrow."

These references may become stale if:

- many turns have passed;
- multiple candidates have been introduced;
- the visible object has changed;
- a previous selection was replaced;
- the referenced item no longer exists;
- the task frame has shifted.

Stale references require caution because the speaker may assume a referent is still obvious when it is no longer uniquely recoverable.

### 5.8.2 Lost salience


Lost salience occurs when a previously important entity, constraint, or goal is no longer prominent in the discourse.

Example:

> "Make it shorter."
> Several turns later:
> "Also include the full methodology."

The earlier brevity constraint may still matter, but it may no longer be salient.

Lost salience can affect:

|Item type|Example|
|---|---|
|Referent|Which file is "it"?|
|Constraint|Was the 500-word limit still active?|
|Priority|Was speed still more important than cost?|
|Audience|Was this still for executives?|
|Tone|Was it still supposed to be informal?|

Salience must be maintained, refreshed, or checked when needed.

### 5.8.3 Conflicting constraints


Conflicting constraints arise when active discourse state contains requirements that cannot all be satisfied.

Examples:

> "Make it comprehensive but under 100 words."
> "Use simple language but keep all legal precision."
> "Do it today, but wait for next week's data."
> "Send it to everyone, but keep it confidential."

Some conflicts are hard contradictions. Others are tradeoffs.

|Conflict type|Example|
|---|---|
|Logical conflict|"Send it and do not send it."|
|Scope conflict|"Everyone except everyone external"|
|Quality tradeoff|"Very short and very detailed"|
|Timing conflict|"Today using tomorrow's data"|
|Permission conflict|"Share broadly but keep private"|

Conflicts often require clarification, prioritization, or restatement of the current active constraints.

### 5.8.4 Overloaded discourse context


Overloaded discourse context occurs when too many entities, constraints, revisions, or topics are active at once.

Example:

> "Use the second option, but only for internal users, except contractors, unless they are in the pilot group, and keep the old version for Europe until legal approves the new terms."

This utterance may be interpretable, but it places heavy demands on state tracking.

Overload signs include:

- many candidate referents;
- nested exceptions;
- multiple unresolved constraints;
- repeated corrections;
- long-distance pronouns;
- topic shifts;
- changing priorities;
- ambiguous "this," "that," or "it."

When discourse state is overloaded, interpretation becomes fragile. Summarizing the current state can become necessary.

## 5.9 Summary: How Meaning Evolves Across Turns


Discourse state explains how meaning persists, changes, and breaks across conversation.

Key properties:

|Property|Core question|Example|
|---|---|---|
|Discourse structure|How do parts relate?|"First..., then..., unless..."|
|Discourse markers|What relation is signaled?|"however," "actually," "instead"|
|Repair and correction|What prior state is changed?|"No, the other one."|
|Incremental refinement|How is the task modified?|"Only urgent ones."|
|Mixed initiative|Who guides the next move?|"Do you mean cost or risk?"|
|Redundancy and emphasis|What is being reinforced?|"Today, not tomorrow."|
|Non-monotonicity|What earlier state is invalidated?|"Actually, leave it."|
|Memory limits|What state may be stale or overloaded?|"Same as before."|

The central principle of this section is:

```text
Natural-language meaning is dynamic: later turns can extend, narrow, repair, replace, or invalidate earlier meanings.
```

# 6. Social, Epistemic, and Priority Signals


Natural-language utterances carry more than propositional content and task intent. They also encode stance.

A speaker may signal politeness, hesitation, certainty, doubt, urgency, authority, reluctance, preference, emotional attitude, or strength of commitment. These signals affect interpretation. They help determine whether an utterance is a hard requirement, weak suggestion, tentative inference, urgent warning, softened criticism, or socially managed refusal.

This section describes the signals that shape how strongly, urgently, authoritatively, or cautiously an utterance should be interpreted.

## 6.1 Politeness and Face Management


Politeness and face management concern how speakers preserve social relations, reduce imposition, soften criticism, and allow room for disagreement or refusal.

Politeness does not mean the utterance is unimportant. A softened request may still be a real request. A mitigated criticism may still require revision.

Example:

> "Could you maybe make this a bit shorter?"

This is polite and softened, but the intended action is still likely:

> Make this shorter.

### 6.1.1 Softened requests


Softened requests reduce directness or imposition.

Examples:

|Direct request|Softened request|
|---|---|
|"Send me the file."|"Could you send me the file?"|
|"Rewrite this."|"Could you take another pass at this?"|
|"Move the meeting."|"Would it be possible to move the meeting?"|
|"Explain the issue."|"Can you help me understand the issue?"|

Softeners include:

```text
could
would
maybe
possibly
when you have a chance
if you do not mind
I was wondering if
```


Softening affects social tone, not necessarily task importance.

### 6.1.2 Indirect criticism


Indirect criticism expresses a negative evaluation without stating it bluntly.

Examples:

|Direct criticism|Indirect criticism|
|---|---|
|"This is wrong."|"I'm not sure this is quite right."|
|"This is too aggressive."|"This may come across a little strong."|
|"The argument is weak."|"This part might need stronger support."|
|"The design is confusing."|"Users may have trouble following this."|

Indirect criticism often implies a revision request.

Example:

> "This may be a little too casual for the client."

Likely interpretation:

> Make it more formal before sending to the client.

### 6.1.3 Deference


Deference signals respect for authority, expertise, role, seniority, or ownership.

Examples:

> "You may already have considered this, but..."
> "I defer to legal on this."
> "If you think it makes sense..."
> "With your approval, we can proceed."
> "I may be missing context."

Deference can reduce apparent commitment strength even when the underlying concern is important.

Example:

> "I may be missing something, but this looks risky."

Despite the hedge, the utterance may function as a serious warning.

### 6.1.4 Mitigation


Mitigation weakens the apparent force of an utterance.

Common mitigators:

```text
a little
somewhat
kind of
maybe
I think
it seems
possibly
not ideal
could be better
```


Examples:

|Mitigated utterance|Possible intended meaning|
|---|---|
|"This is a little unclear."|This is unclear|
|"The tone might be slightly off."|Revise the tone|
|"This may not be ideal."|This is problematic|
|"I'm not sure this works."|This likely does not work|

Mitigation is often used to preserve face, avoid overclaiming, or reduce conflict.

### 6.1.5 Face-saving formulations


Face-saving formulations allow a speaker to express disagreement, correction, or criticism without directly threatening the listener's competence or status.

Examples:

> "We may be looking at different versions."
> "I think there may be a mismatch here."
> "Maybe I explained that poorly."
> "Let's try a different framing."
> "This might be clearer if we reorganize it."

Face-saving formulations often distribute responsibility.

Compare:

|Face-threatening|Face-saving|
|---|---|
|"You misunderstood."|"I may not have been clear."|
|"You used the wrong file."|"We may be looking at different files."|
|"This is badly written."|"This could be clearer with a different structure."|

These formulations alter social interpretation while preserving the underlying repair or revision function.

## 6.2 Epistemic Stance


Epistemic stance indicates how certain the speaker is, what evidence they have, and how strongly they commit to a claim.

Examples:

> "This is broken."
> "This seems broken."
> "This might be broken."
> "Apparently, this is broken."
> "I know this is broken."

Each version expresses a different relationship between the speaker and the claim.

### 6.2.1 Certainty


Certainty signals strong commitment to a proposition.

Examples:

```text
definitely
clearly
certainly
I know
there is no doubt
this is
```


Examples in context:

|Utterance|Epistemic stance|
|---|---|
|"This is definitely the wrong file."|High certainty|
|"The issue is clearly authentication."|High confidence diagnosis|
|"I know this was approved."|Strong evidence or memory|
|"There is no doubt this affects customers."|Strong commitment|

Certainty can increase the weight of an utterance, but it does not guarantee correctness. It indicates the speaker's stance toward the claim.

### 6.2.2 Uncertainty


Uncertainty signals weak or incomplete commitment.

Examples:

```text
maybe
possibly
might
could
I am not sure
it seems
it looks like
I think
```


Examples:

|Utterance|Epistemic stance|
|---|---|
|"This might be outdated."|Possibility|
|"I'm not sure this is final."|Uncertainty|
|"It seems like the numbers changed."|Appearance-based inference|
|"Maybe Alex already handled it."|Weak conjecture|

Uncertainty can indicate that further verification is needed or that the speaker is leaving room for correction.

### 6.2.3 Inference


Inference signals that the speaker is drawing a conclusion from evidence rather than reporting direct knowledge.

Examples:

```text
it looks like
it seems
I assume
I infer
that suggests
probably
given that
```


Example:

> "The invite is gone, so I assume the meeting was cancelled."

Structure:

|Evidence|Inference|
|---|---|
|Invite is gone|Meeting was cancelled|

Inference is defeasible. New information can overturn it.

Example:

> "The invite is gone, so I assumed the meeting was cancelled -- but it was actually moved to another calendar."

### 6.2.4 Reported knowledge


Reported knowledge indicates that the speaker's claim comes from another source.

Examples:

```text
apparently
I heard
according to
they said
the report says
legal mentioned
```


Examples:

|Utterance|Source type|
|---|---|
|"Apparently, the deadline moved."|Unspecified report|
|"Legal said not to publish it."|Institutional source|
|"According to the report, revenue increased."|Document source|
|"I heard Alex is out."|Informal report|

Reported knowledge carries source-dependent reliability. "Legal said" may carry more institutional force than "I heard."

### 6.2.5 Evidence strength


Evidence strength indicates how well-supported a claim is.

Examples:

|Utterance|Evidence strength|
|---|---|
|"The logs show the request failed."|Strong evidence|
|"It looks like the request failed."|Moderate evidence|
|"I think the request failed."|Weak or unspecified evidence|
|"Someone said the request failed."|Reported evidence|
|"The request probably failed."|Inferred likelihood|

Evidence strength affects whether a claim should be treated as fact, hypothesis, warning, or candidate explanation.

## 6.3 Affective Stance


Affective stance expresses emotional or evaluative attitude.

It can be explicit:

> "I'm frustrated with this process."

Or implicit:

> "Great, another last-minute change."

Affective stance affects how an utterance should be interpreted interpersonally. It may signal urgency, dissatisfaction, risk sensitivity, reluctance, approval, or escalation.

### 6.3.1 Frustration


Frustration signals dissatisfaction, friction, repeated failure, or unmet expectations.

Examples:

> "This is frustrating."
> "We keep going in circles."
> "I already explained this."
> "This still is not what I asked for."

Frustration may indicate:

|Possible meaning|
|---|
|Prior attempts failed|
|The speaker wants a course correction|
|Tolerance for more clarification is low|
|The speaker expects closer adherence|
|The issue has become more urgent or sensitive|

Frustration often co-occurs with repair and repetition.

### 6.3.2 Concern


Concern signals perceived risk, caution, or unease.

Examples:

> "I'm worried about this migration."
> "This feels risky."
> "I'm concerned the client will misunderstand this."
> "This may create problems later."

Concern may function as warning, objection, or request for mitigation.

Example:

> "I'm concerned this sounds too definitive."

Likely implied action:

> Qualify or soften the claim.

### 6.3.3 Skepticism


Skepticism signals doubt, challenge, or weak acceptance.

Examples:

> "Are we sure about that?"
> "I'm not convinced."
> "That seems optimistic."
> "Do we have evidence for this?"
> "I would not assume that."

Skepticism may target:

|Target|Example|
|---|---|
|Claim|"Is that actually true?"|
|Plan|"That seems risky."|
|Evidence|"What supports that?"|
|Timeline|"That deadline seems optimistic."|
|Interpretation|"I don't think that's what they meant."|

Skepticism often invites justification, evidence, revision, or caution.

### 6.3.4 Satisfaction


Satisfaction signals acceptance, approval, or positive evaluation.

Examples:

> "This looks good."
> "That works."
> "Much better."
> "I like this version."
> "This is close."

Satisfaction can imply different next steps:

|Utterance|Possible implication|
|---|---|
|"This looks good."|Accept or proceed|
|"This is close."|Continue refining|
|"Much better."|Improvement acknowledged, possibly not final|
|"That works."|Use this option|
|"I like this version."|Favor this version|

Satisfaction is not always final approval. Phrases such as "close" or "better" may indicate progress without completion.

### 6.3.5 Reluctance


Reluctance signals hesitation, discomfort, or unwillingness.

Examples:

> "I'd rather not do that."
> "I'm not comfortable with this."
> "I hesitate to send this."
> "I do not love that option."
> "If we have to, but it is not ideal."

Reluctance can signal a weak refusal, risk concern, preference, or need for approval.

Example:

> "I'm not comfortable sending this externally yet."

Likely meaning:

> Do not send externally until the concern is resolved.

## 6.4 Modality


Modality expresses possibility, necessity, permission, obligation, prohibition, likelihood, or ability.

Modal expressions shape how strongly an utterance constrains interpretation.

Examples:

```text
can
could
may
might
must
should
need to
have to
allowed to
not allowed to
```


Modality interacts with authority, certainty, politeness, and commitment strength.

### 6.4.1 Possibility


Possibility indicates that something may occur, may be true, or may be an available option.

Examples:

> "This could work."
> "We might use the second option."
> "It may be delayed."
> "There is a chance the numbers change."

Possibility is weaker than commitment.

Compare:

|Utterance|Strength|
|---|---|
|"This will work."|Strong prediction|
|"This should work."|Moderate expectation|
|"This could work."|Possibility|
|"This might work."|Weak possibility|

Possibility may invite exploration rather than execution.

### 6.4.2 Necessity


Necessity indicates that something is required or unavoidable.

Examples:

> "We need to update the timeline."
> "This has to be approved first."
> "The report must include the risk section."
> "You need to remove the private data."

Necessity can be practical, logical, institutional, social, or safety-related.

|Necessity type|Example|
|---|---|
|Practical|"We need the file before the meeting."|
|Institutional|"Legal must approve it."|
|Logical|"The totals have to match."|
|Safety|"Private data must be removed."|
|Social|"We need to tell the team."|

### 6.4.3 Permission


Permission indicates that an action is allowed.

Examples:

> "You can share this internally."
> "You may use the shorter version."
> "It is okay to skip the appendix."
> "Feel free to include examples."

Permission does not always imply recommendation.

Compare:

|Utterance|Meaning|
|---|---|
|"You can include examples."|Examples are allowed|
|"You should include examples."|Examples are recommended|
|"You must include examples."|Examples are required|

Permission can also be conditional:

> "You can send it if Maria approves."

### 6.4.4 Obligation


Obligation indicates that an action should or must be performed.

Examples:

> "You should update the owner."
> "We have to notify the client."
> "The draft must include the disclaimer."
> "Please make sure legal reviews this."

Obligation strength varies:

|Expression|Typical force|
|---|---|
|"should"|Recommendation or weak obligation|
|"need to"|Strong practical obligation|
|"have to"|Strong requirement|
|"must"|Strong requirement|
|"required to"|Formal obligation|

Obligation can come from speaker authority, policy, task logic, social expectation, or risk.

### 6.4.5 Prohibition


Prohibition indicates that an action should not or must not occur.

Examples:

> "Do not share this externally."
> "You must not delete those records."
> "We should avoid changing the API."
> "Do not include private data."
> "This cannot go to the client yet."

Prohibition strength varies:

|Utterance|Strength|
|---|---|
|"Maybe avoid sharing this."|Weak caution|
|"Try not to share this."|Soft prohibition|
|"Do not share this."|Direct prohibition|
|"You must not share this."|Strong prohibition|
|"This is not allowed to be shared."|Rule-based prohibition|

Prohibitions often override competing requests unless explicitly revised.

## 6.5 Authority and Role


Authority and role affect how utterances should be weighted.

A statement from a decision-maker, owner, reviewer, legal approver, manager, customer, or affected party may carry different force from the same statement by someone without that role.

Example:

> "This must be approved before launch."

The force of this utterance depends partly on who says it and what authority they have.

### 6.5.1 Speaker authority


Speaker authority concerns the speaker's right or standing to make claims, issue instructions, grant permission, or impose constraints.

Examples:

|Speaker role|Utterance|Likely force|
|---|---|---|
|Project owner|"Use option B."|Decision or directive|
|Legal reviewer|"Do not publish this yet."|Strong constraint|
|Team member|"Maybe option B is better."|Suggestion|
|Customer|"This does not solve our problem."|Important evaluation|
|Manager|"This needs to be done today."|Directive or priority|

Speaker authority can be explicit or inferred from context.

### 6.5.2 Addressee authority


Addressee authority concerns whether the listener has the ability, permission, or role required to act.

Examples:

> "Can you approve this?"
> "Please publish the update."
> "Could you grant Alex access?"
> "Can you make the final call?"

These utterances presuppose or ask about the addressee's authority.

If the addressee lacks authority, the appropriate interpretation may be referral, refusal, clarification, or escalation.

### 6.5.3 Institutional role


Institutional roles shape rights, obligations, and expected interpretation.

Examples:

|Role|Possible authority|
|---|---|
|Legal|Approve, block, qualify, or require review|
|Finance|Validate budget, cost, or payment|
|Security|Approve access, flag risk|
|Manager|Assign priority or ownership|
|Customer|Define acceptability or dissatisfaction|
|Owner|Decide scope or final direction|

Role-based authority can make indirect language stronger.

Example:

> Legal reviewer: "I'm not comfortable with this wording."

Likely interpretation:

> Do not use this wording without revision or approval.

### 6.5.4 Ownership


Ownership concerns who is responsible for an object, decision, task, or domain.

Examples:

> "This is Maria's doc."
> "Alex owns the rollout."
> "The design team owns the final call."
> "Finance owns the budget assumptions."

Ownership affects who can approve, revise, delegate, or object.

Example:

> "Ask Priya before changing that section -- she owns the policy language."

The utterance implies that Priya's role constrains permissible changes.

### 6.5.5 Approval rights


Approval rights concern who can authorize an action or mark something as final.

Examples:

> "This needs legal approval."
> "Only the owner can approve this."
> "Wait for client sign-off."
> "Do not send until Maria confirms."
> "Finance has to approve the budget."

Approval rights often create conditional discourse states.

Example:

> "Send it after legal approves."

The action is not simply "send it." It is conditional on approval.

## 6.6 Urgency and Priority


Urgency and priority indicate how soon something matters and how it should be ranked against competing goals.

Urgency concerns time sensitivity. Priority concerns relative importance. They often overlap but are not identical.

Example:

> "This is important, but not urgent."

Meaning:

|Signal|Interpretation|
|---|---|
|Important|High value or consequence|
|Not urgent|No immediate deadline|

### 6.6.1 Explicit deadlines


Explicit deadlines specify a time, date, or event boundary.

Examples:

> "By 5 PM."
> "Before the meeting."
> "No later than Friday."
> "Before launch."
> "By the end of the quarter."

Explicit deadlines still require grounding. "Friday" depends on the relevant week, and "before the meeting" depends on which meeting.

Deadlines may be absolute or relative:

|Deadline type|Example|
|---|---|
|Clock time|"By 3 PM."|
|Calendar date|"By June 30."|
|Event-relative|"Before the client call."|
|Period-relative|"By end of day."|
|Sequence-relative|"Before publishing."|

### 6.6.2 Relative deadlines


Relative deadlines express urgency without exact time.

Examples:

```text
soon
ASAP
when you can
as soon as practical
before too long
later
eventually
```


Relative deadlines depend on context.

Example:

> "Send this soon."

Possible interpretations:

|Context|Likely threshold|
|---|---|
|Crisis|Minutes|
|Same-day work|Hours|
|Routine follow-up|Days|
|Long-term planning|Weeks|

Relative urgency is inherently vague. It may require inference or clarification when timing matters.

### 6.6.3 Consequence framing


Consequence framing signals urgency or priority by describing what happens if action is delayed, omitted, or mishandled.

Examples:

> "Otherwise we miss the launch."
> "The client is waiting."
> "If this goes out wrong, legal will object."
> "We need this before procurement closes."
> "Without this, the team is blocked."

Consequence framing can make an otherwise ordinary request urgent.

Example:

> "Can you review this today? The client call is tomorrow morning."

The second sentence increases urgency.

### 6.6.4 Repeated emphasis


Repeated emphasis reinforces importance or urgency.

Examples:

> "Today, not tomorrow."
> "This is really important."
> "No changes to the public API -- none."
> "Please keep this very simple."
> "We need a final answer, not a draft."

Repetition may indicate priority, frustration, or risk sensitivity.

Repeated emphasis should not be automatically collapsed as duplicate content. It can change the weight of an instruction.

### 6.6.5 Priority tradeoffs


Priority tradeoffs indicate how to resolve competing goals.

Examples:

> "Speed matters more than polish."
> "Accuracy over brevity."
> "Keep it simple, even if it is less complete."
> "Cost matters, but reliability matters more."
> "Do not optimize for elegance; optimize for maintainability."

Tradeoffs are central when multiple criteria cannot be maximized at once.

Common tradeoff pairs:

|Criterion A|Criterion B|
|---|---|
|Speed|Accuracy|
|Cost|Quality|
|Brevity|Completeness|
|Formality|Warmth|
|Simplicity|Precision|
|Risk reduction|Convenience|
|Flexibility|Consistency|

Priority signals help determine which interpretation is preferred when constraints conflict.

## 6.7 Commitment Strength


Commitment strength indicates how strongly the speaker endorses a claim, preference, judgment, or instruction.

Two utterances may have similar content but different force.

Compare:

|Utterance|Commitment strength|
|---|---|
|"This is the cause."|Strong assertion|
|"This is probably the cause."|Moderate confidence|
|"This might be the cause."|Weak possibility|
|"I wonder if this is the cause."|Tentative hypothesis|

Commitment strength is closely related to epistemic stance, modality, and authority.

### 6.7.1 Strong assertion


A strong assertion expresses high confidence or firm commitment.

Examples:

> "This is incorrect."
> "The launch date is Friday."
> "Option B is the safest choice."
> "The customer will reject this."
> "This must be fixed before release."

Strong assertions often use direct declarative forms, certainty markers, or strong modals.

Strong assertions may still be wrong. The point is not truth, but speaker commitment.

### 6.7.2 Tentative assertion


A tentative assertion expresses a claim while leaving room for revision.

Examples:

> "This seems incorrect."
> "I think option B is safer."
> "It looks like the deadline moved."
> "This may be the latest version."
> "I suspect the issue is authentication."

Tentative assertions are useful when evidence is incomplete.

They may invite verification, clarification, or alternative interpretations.

### 6.7.3 Preference


A preference expresses desire or ranking without necessarily creating a requirement.

Examples:

> "I prefer option A."
> "I'd rather keep this short."
> "I like the second version better."
> "I would avoid a formal tone."
> "I prefer not to use vendors."

Preferences can become constraints when they are strong, repeated, role-backed, or tied to consequences.

Example:

> "I really prefer not to use vendors because procurement will delay us."

This is stronger than a simple aesthetic preference.

### 6.7.4 Recommendation


A recommendation proposes what should be done.

Examples:

> "We should use option B."
> "I recommend delaying launch."
> "It would be better to revise this first."
> "You may want to add a disclaimer."
> "I'd suggest confirming with legal."

Recommendations vary in strength.

|Utterance|Strength|
|---|---|
|"You might consider option B."|Weak|
|"Option B may be better."|Moderate|
|"We should use option B."|Strong|
|"I recommend option B."|Strong, explicit|
|"We need to use option B."|Requirement|

Recommendations often sit between preference and obligation.

### 6.7.5 Hard requirement


A hard requirement expresses a non-negotiable or strongly binding constraint.

Examples:

> "Do not share this externally."
> "This must include the disclaimer."
> "Only use approved vendors."
> "The final answer has to be under 500 words."
> "We need legal approval before sending."

Hard requirements often use:

```text
must
need to
have to
only
do not
required
not allowed
```


Hard requirements should be treated as active constraints unless later revised or invalidated.

## 6.8 Summary: How Stance Changes Interpretation


Social, epistemic, and priority signals shape how utterances should be interpreted beyond their literal content.

Key properties:

|Property|Core question|Example|
|---|---|---|
|Politeness|Is force softened or socially managed?|"Could you maybe..."|
|Epistemic stance|How certain is the speaker?|"This seems wrong."|
|Affective stance|What attitude is expressed?|"I'm concerned."|
|Modality|Is this possible, required, allowed, or prohibited?|"must," "may," "might"|
|Authority and role|Who has standing to decide or constrain?|"Legal has not approved."|
|Urgency and priority|How soon and how important is it?|"Today, not tomorrow."|
|Commitment strength|How strongly is this endorsed?|"I prefer" versus "must"|

The central principle of this section is:

```text
Natural-language meaning includes stance: how strongly, urgently, confidently, authoritatively, or socially the speaker presents the utterance.
```

# 7. Failure, Risk, and Repair Semantics


Natural-language interpretation can fail.

Failure does not always mean the utterance is malformed. Natural language often leaves information implicit, compresses detail, relies on context, and permits multiple plausible interpretations. In many cases, this works well. In other cases, the same properties create risk.

This section describes common interpretive failures, how severe ambiguity can be, how confidence affects commitment, and when repair is required before proceeding.

## 7.1 Interpretive Failure Types


Interpretive failure occurs when the meaning inferred from an utterance does not match the speaker's intended meaning or the situation's requirements.

Failure may involve the wrong referent, wrong intent, missing constraint, stale context, hallucinated context, over-execution, or under-execution.

Example:

> "Send it to Alex."

Possible failure points:

|Element|Failure risk|
|---|---|
|"it"|Wrong document selected|
|"Alex"|Wrong Alex selected|
|"send"|Wrong channel used|
|Missing timing|Sent too early or too late|
|Missing permission|Sent without required approval|
|Missing scope|Sent full document instead of excerpt|

Natural language often allows these details to remain unstated. The risk depends on whether the missing or ambiguous information matters.

### 7.1.1 Wrong referent


Wrong referent failure occurs when an expression is attached to the wrong entity.

Examples:

> "Send that to Maria."
> "Open the other file."
> "Use the second version."
> "Move it to tomorrow."

Possible wrong referents:

|Expression|Risk|
|---|---|
|"that"|Wrong selected object|
|"Maria"|Wrong person|
|"the other file"|Wrong file among candidates|
|"second version"|Wrong ordering basis|
|"it"|Wrong task, document, meeting, or item|

Wrong referent failure is common when multiple candidate entities are salient.

### 7.1.2 Wrong intent


Wrong intent failure occurs when the listener infers the wrong speech act or action.

Examples:

|Utterance|Possible wrong interpretation|
|---|---|
|"Can you send this?"|Treated as capability question instead of request|
|"This is too long."|Treated as observation instead of revision request|
|"Maybe don't publish this yet."|Treated as weak suggestion instead of serious warning|
|"I'm not sure about this."|Treated as minor doubt instead of objection|
|"Compare these."|Treated as choose one|

Wrong intent failure is especially likely with indirect speech acts, softened criticism, and implied requests.

### 7.1.3 Missing constraint


Missing constraint failure occurs when an important limitation is not included, not inferred, or not preserved.

Examples:

> "Summarize this."
> Missing constraint: for executives, under 200 words, no technical detail.

> "Find a hotel."
> Missing constraint: budget, location, dates, accessibility, cancellation policy.

> "Send the update."
> Missing constraint: only after approval, internal recipients only, use final version.

Constraints may be unstated because the speaker assumes they are obvious from context.

Missing constraints can produce outputs or actions that are technically responsive but situationally wrong.

### 7.1.4 Stale context


Stale context failure occurs when interpretation relies on context that is no longer current.

Examples:

> "Use that version."
> "Same as before."
> "Move it to tomorrow."
> "Apply the same settings."

The relevant prior object or setting may have changed.

Stale context can result from:

- long conversations;
- topic shifts;
- changed selected object;
- revised priorities;
- updated files;
- cancelled meetings;
- replaced options;
- lost salience.

A stale reference can be more dangerous than an explicit ambiguity because it may appear resolved while actually pointing to an outdated state.

### 7.1.5 Hallucinated context


Hallucinated context failure occurs when missing information is filled with an unsupported assumption.

Examples:

> "Send it to Alex."

Unsupported assumptions might include:

|Missing detail|Hallucinated assumption|
|---|---|
|Which Alex|Most recent Alex|
|Which document|Current visible document|
|Channel|Email|
|Timing|Immediately|
|Permission|User has authority|
|Version|Latest version|

Some assumptions may be reasonable; others may be unsafe. The problem is not inference itself, but ungrounded inference treated as fact.

Hallucinated context is especially likely when the utterance is underspecified and the surrounding context is weak, stale, or conflicting.

### 7.1.6 Over-execution


Over-execution occurs when the response or action goes beyond what the user intended.

Examples:

|User utterance|Over-execution|
|---|---|
|"Draft a reply."|Sends the reply|
|"Look at this file."|Edits the file|
|"Summarize the risks."|Rewrites the entire document|
|"Find possible times."|Schedules the meeting|
|"Clean up the data."|Deletes rows without confirmation|

Over-execution often results from inferring a stronger intent than the speaker expressed.

It is particularly likely with high-level action phrases:

> "Handle the onboarding."
> "Take care of the client follow-up."
> "Fix the spreadsheet."

These may imply broad workflows, but the permissible scope may still be limited.

### 7.1.7 Under-execution


Under-execution occurs when the response or action does less than the user intended.

Examples:

|User utterance|Under-execution|
|---|---|
|"Make this client-ready."|Only fixes grammar|
|"Prepare for the meeting."|Only summarizes agenda|
|"Clean up the spreadsheet."|Only formats columns|
|"Compare these options."|Lists features without evaluation|
|"Onboard the contractor."|Sends one welcome email only|

Under-execution often results from interpreting a high-level activity too narrowly.

The challenge is that natural language often names outcomes rather than every required sub-action. Correct interpretation requires recognizing conventional activity structure and user expectations.

## 7.2 Ambiguity Severity


Not all ambiguity has the same consequence.

Some ambiguity is harmless. Some is recoverable. Some blocks meaningful action. Some creates unacceptable risk.

Severity depends on:

- consequence of error;
- reversibility;
- number of plausible interpretations;
- confidence in context;
- user expectation;
- affected parties;
- sensitivity of the object;
- whether action is external, destructive, or irreversible.

### 7.2.1 Harmless ambiguity


Harmless ambiguity has little or no material consequence.

Example:

> "Make this a bit cleaner."

Possible interpretations:

- improve wording;
- improve formatting;
- reduce clutter;
- simplify structure.

If the context is low-risk and revision is reversible, the ambiguity may be acceptable.

Other examples:

|Utterance|Why ambiguity may be harmless|
|---|---|
|"Make it nicer."|Low-stakes style improvement|
|"Use a friendlier tone."|Several acceptable outputs possible|
|"Summarize this roughly."|Precision not required|
|"Give me a few ideas."|Open-ended response expected|

Harmless ambiguity can often be resolved through best-effort interpretation.

### 7.2.2 Recoverable ambiguity


Recoverable ambiguity may produce a wrong first attempt, but the error is easy to detect and repair.

Example:

> "Make the intro shorter."

If the wrong amount is cut, the user can say:

> "A little less -- keep the second example."

Recoverable ambiguity is common in drafting, brainstorming, search, summarization, and low-risk planning.

Examples:

|Utterance|Recovery path|
|---|---|
|"Make it more formal."|User can revise tone|
|"Find better examples."|User can select or reject examples|
|"Show cheaper options."|User can adjust price threshold|
|"Simplify this."|User can restore missing detail|

Recoverability depends on whether the action can be inspected, adjusted, or undone.

### 7.2.3 Execution-blocking ambiguity


Execution-blocking ambiguity prevents responsible interpretation without additional information.

Examples:

> "Delete the old one."
> "Send it to Alex."
> "Cancel my meeting."
> "Approve the request."
> "Move the deadline."

These utterances may be clear in intent but ambiguous in referent, scope, authority, or consequence.

Execution-blocking ambiguity usually requires clarification when:

- multiple plausible referents exist;
- the action affects others;
- the action cannot be easily undone;
- the missing parameter determines the action;
- context does not strongly favor one interpretation.

Example clarification:

> "Which meeting should be cancelled?"

### 7.2.4 Safety-critical ambiguity


Safety-critical ambiguity occurs when a wrong interpretation could cause serious harm, rights violation, exposure, loss, legal risk, financial risk, security risk, or irreversible damage.

Examples:

> "Share the file externally."
> "Delete all inactive accounts."
> "Approve the transfer."
> "Publish the report."
> "Remove the safety note."
> "Give them access."

Safety-critical ambiguity requires conservative interpretation.

Potential risk dimensions:

|Risk dimension|Example|
|---|---|
|Privacy|Sharing private data|
|Security|Granting access|
|Financial|Authorizing payment|
|Legal|Publishing unreviewed terms|
|Operational|Deleting records|
|Reputational|Sending wrong communication|
|Safety|Removing warning or compliance language|

In safety-critical contexts, plausible inference is not always enough. Explicit confirmation or refusal may be required.

## 7.3 Confidence and Commitment


Confidence is the estimated reliability of an interpretation. Commitment is the degree to which one proceeds as though the interpretation is correct.

The two should remain distinct.

A listener may have moderate confidence in an interpretation but low commitment because the consequences are high. Conversely, a listener may proceed with low certainty when the stakes are trivial and recovery is easy.

Example:

> "Make this friendlier."

Confidence may be moderate, and commitment may be acceptable because the action is reversible.

Example:

> "Send this to the client."

Confidence may be high, but commitment may still require confirmation if the object, recipient, or approval status is uncertain.

### 7.3.1 Infer silently


Silent inference is appropriate when the missing information is low-risk, highly conventional, and easily recoverable.

Example:

> "Make this more concise."

Reasonable silent inferences:

|Inference|
|---|
|Reduce length|
|Preserve core meaning|
|Remove redundancy|
|Improve clarity|

Silent inference is less appropriate when the action is external, destructive, irreversible, permission-sensitive, or high-impact.

### 7.3.2 Infer with disclosure


Inference with disclosure is appropriate when an interpretation is plausible but not certain, and the user benefits from seeing the assumption.

Example:

> "I'll treat 'more polished' as improving structure, tone, and wording while preserving the substance."

This allows progress while making assumptions visible.

Useful disclosure patterns:

|Pattern|Example|
|---|---|
|Assumption statement|"Assuming this is for executives..."|
|Interpretation preview|"I'll interpret 'shorter' as about 30% shorter."|
|Scope statement|"I'll focus on tone, not content."|
|Constraint restatement|"Keeping the technical detail intact."|

Disclosure is especially useful for vague quality terms, soft preferences, and underspecified revision requests.

### 7.3.3 Ask for clarification


Clarification is appropriate when missing information materially changes the interpretation.

Examples:

> "Which Alex do you mean?"
> "Should this go to the client or stay internal?"
> "Do you want a full rewrite or comments only?"
> "Should I preserve the examples?"
> "Which meeting should be moved?"

Clarification should target the smallest missing distinction that matters.

Good clarification:

> "Which Alex should receive it: Alex Chen or Alex Rivera?"

Less useful clarification:

> "Can you clarify?"

Clarification is especially important for ambiguous referents, destructive actions, external communication, permissions, and conflicting constraints.

### 7.3.4 Offer alternatives


Offering alternatives is appropriate when multiple interpretations are plausible and the user may choose among them.

Example:

> "I can interpret 'make it lighter' in three ways: lighter tone, shorter content, or less visual density. Which one do you mean?"

Alternative presentation is useful when:

- ambiguity is real;
- there are a small number of plausible interpretations;
- the user's preference cannot be safely inferred;
- choosing incorrectly would waste effort or create risk.

Examples:

|Utterance|Alternatives|
|---|---|
|"Make it stronger."|Stronger evidence, stronger tone, stronger conclusion|
|"Clean this up."|Format, deduplicate, rewrite, simplify|
|"Fix the intro."|Shorten, clarify, change tone, add hook|
|"Use the other one."|Candidate A or candidate B|

### 7.3.5 Require confirmation


Confirmation is appropriate when an interpretation is plausible but the action is consequential.

Example:

> "Confirm before I send this externally to the client."

Confirmation is often required for:

|Situation|Example|
|---|---|
|External communication|Sending to clients|
|Destructive action|Deleting records|
|Permission change|Granting access|
|Financial action|Approving payment|
|Publication|Making content public|
|Irreversible change|Replacing source material|
|Sensitive data|Sharing private information|

Confirmation should restate the interpreted action clearly.

Example:

> "Please confirm: send the final Q4 report to Alex Chen by email today."

### 7.3.6 Decline execution


Declining execution is appropriate when the requested action is unsafe, unauthorized, impossible, contradictory, or too ambiguous to proceed responsibly.

Examples:

> "I cannot determine which file you mean."
> "I cannot proceed without knowing whether external sharing is approved."
> "These constraints conflict: the answer cannot be both under 50 words and include every section in detail."
> "I do not have enough information to identify the correct recipient."

Declining execution can still preserve helpfulness by explaining the blocking condition and identifying the minimum information needed.

Decline does not always mean refusal of the overall task. It may mean refusal to perform one unsafe or under-specified step.

## 7.4 Repair Protocols


Repair protocols are interaction patterns for resolving uncertainty, error, conflict, or failed interpretation.

Repair can occur before action, during interpretation, after a mistaken output, or after the user revises the task.

Repair protocols include clarification questions, confirmation, correction acceptance, rollback, partial execution, and safe no-op.

### 7.4.1 Clarification question


A clarification question asks for missing information needed to interpret the utterance.

Examples:

> "Which file should I use?"
> "Do you mean Sarah Kim or Sarah Patel?"
> "Should the tone be formal or conversational?"
> "What counts as 'nearby' here?"
> "Should this include external users?"

Clarification questions should be:

|Quality|Description|
|---|---|
|Specific|Target the ambiguous element|
|Minimal|Ask only what is needed|
|Context-aware|Mention plausible candidates|
|Actionable|Let the user answer directly|
|Non-redundant|Avoid asking for already available information|

Poor clarification:

> "Please clarify your request."

Better clarification:

> "Which meeting should I move: the 10 AM product sync or the 2 PM client review?"

### 7.4.2 Confirmation


Confirmation verifies an inferred interpretation before treating it as final.

Examples:

> "Confirming: you want the shorter version sent to Maria today."
> "Just to confirm, should I exclude contractors?"
> "Before proceeding: do you want the public version or internal version?"
> "Please confirm that external sharing is approved."

Confirmation differs from clarification. Clarification asks for missing information. Confirmation checks whether an inferred complete interpretation is correct.

### 7.4.3 Correction acceptance


Correction acceptance incorporates the user's correction into the active discourse state.

Example:

> User: "No, I meant the other file."
> Response: "Understood -- the other file is now the target."

Correction acceptance should identify what changed.

Examples:

|User correction|Accepted state|
|---|---|
|"Not Friday -- Monday."|Date changed to Monday|
|"Sarah from legal."|Recipient resolved to Sarah from legal|
|"Only the summary."|Scope narrowed to summary|
|"Do not send it yet."|Sending cancelled or deferred|

Correction acceptance is important because users need confidence that the repair was understood.

### 7.4.4 Rollback


Rollback restores a prior state or reverses an action when possible.

Examples:

> "Undo that."
> "Revert to the previous version."
> "Go back to the shorter draft."
> "Restore the original wording."
> "Cancel the change."

Rollback may apply to:

|Object|Example|
|---|---|
|Text|Restore previous paragraph|
|Selection|Return to prior option|
|Plan|Revert to earlier timeline|
|Parameters|Restore prior filters|
|Action|Cancel queued message|

Rollback is only possible when a prior state is recoverable. If rollback is partial or impossible, that limitation should be made explicit.

### 7.4.5 Partial execution


Partial execution completes the safe or unambiguous part of a request while deferring uncertain or risky parts.

Example:

> "I can draft the message now, but I need confirmation before sending it externally."

Partial execution is useful when:

- one part is clear and low-risk;
- another part is ambiguous or high-risk;
- progress is valuable;
- blocking the entire task would be unnecessary.

Examples:

|Request|Partial execution|
|---|---|
|"Send a summary to the client."|Draft summary, ask before sending|
|"Clean and delete duplicates."|Identify duplicates, ask before deletion|
|"Schedule with Alex."|Find candidate Alexes or times, ask which one|
|"Publish the update."|Prepare publication draft, ask for approval confirmation|

Partial execution should clearly separate completed, deferred, and blocked components.

### 7.4.6 Safe no-op


A safe no-op occurs when no action is taken because acting would be unsafe, ambiguous, impossible, or unauthorized.

Examples:

> "I did not send anything because the recipient was ambiguous."
> "No changes were made because the target file was unclear."
> "I did not delete records because the scope was not confirmed."
> "I did not publish the draft because approval status is unknown."

Safe no-op is preferable to risky action when uncertainty is consequential.

A safe no-op should communicate:

|Element|Example|
|---|---|
|No action taken|"I did not send the email."|
|Reason|"The recipient was ambiguous."|
|Needed resolution|"Please confirm Alex Chen or Alex Rivera."|
|Preserved state|"The draft remains unchanged."|

Safe no-op is a repair-supporting behavior. It protects the current state while keeping the conversation open.

## 7.5 Summary: When Uncertainty Requires Repair Rather Than Execution


Natural-language uncertainty is normal, but not all uncertainty should be handled the same way.

Some ambiguity can be inferred through. Some should be disclosed. Some requires clarification. Some requires confirmation. Some should block action entirely.

Key properties:

|Property|Core question|Example|
|---|---|---|
|Wrong referent|Was the wrong entity selected?|"Send it to Alex."|
|Wrong intent|Was the wrong action inferred?|"This is too long."|
|Missing constraint|Was an important limit omitted?|"Summarize this."|
|Stale context|Is the context still valid?|"Same as before."|
|Hallucinated context|Was missing information invented?|"Send it to Alex."|
|Over-execution|Did action exceed intent?|Drafting versus sending|
|Under-execution|Did action undershoot intent?|"Make this client-ready."|
|Ambiguity severity|How risky is uncertainty?|Harmless versus safety-critical|
|Confidence and commitment|How far should interpretation proceed?|Infer, ask, confirm, decline|
|Repair protocol|How should uncertainty be resolved?|Clarify, confirm, rollback, no-op|

The central principle of this section is:

```text
Natural-language interfaces should not treat every ambiguity as equal. Interpretation depends on risk, reversibility, confidence, consequence, and the availability of repair.
```


Sections 4-7 together complete the movement from utterance-level intent to discourse-level mutation, stance interpretation, and risk-sensitive repair.

# 8. Cross-Property Interaction


Natural-language properties rarely appear in isolation. A real utterance often combines indeterminacy, context dependence, pragmatic force, discourse history, and social stance in the same expression. The properties in this document should therefore be treated as **analytical lenses**, not as mutually exclusive categories. The existing taxonomy already demonstrates this with examples such as "Could you maybe send that to Sarah before the meeting?" and "Actually, not that one -- the cheaper option from yesterday," where a single utterance activates several Layer 0 phenomena at once.

The purpose of this section is to show how Layer 0 properties interact when they are jointly present. These interactions matter because the interpretive difficulty of an utterance is rarely caused by one property alone. More often, risk emerges from the combination.

A useful diagnostic pattern is:

```text
Utterance
→ surface segment
→ active Layer 0 properties
→ unresolved interpretive questions
→ required resolution
→ risk created by the combination
```


For example:

> "Send that to Sarah before the meeting."

This utterance contains no exotic vocabulary. It is grammatically simple. Its difficulty comes from property interaction:

|Segment|Active properties|Interpretive question|
|---|---|---|
|"Send"|speech act, action intent|What kind of sending is intended? Email, message, share link, file transfer?|
|"that"|deixis, interface grounding, prior discourse|Which object is being referred to?|
|"Sarah"|named-entity reference, possible ambiguity|Which Sarah?|
|"before the meeting"|temporal reference, presupposition|Which meeting? What deadline follows from "before"?|
|whole utterance|request, underspecification, priority|Is this a low-risk communication action or a high-risk external transmission?|

The utterance is not difficult because it is "unclear" in a generic sense. It is difficult because several different kinds of meaning must be resolved together.

## 8.1 How Properties Co-Occur


Layer 0 properties co-occur because natural language compresses meaning. Speakers routinely omit details, rely on visible or shared context, use socially softened phrasing, and expect the listener to infer the intended action. This is not accidental inefficiency. It is one of the normal operating principles of natural language. The analysis file identifies this as an "economics of explicitness": users do not specify every parameter because doing so is cognitively and interactionally expensive.

Consider:

> "Could you maybe make this less aggressive?"

This single utterance contains at least six properties:

|Expression|Property|Role in interpretation|
|---|---|---|
|"Could you"|indirect speech act, politeness|Surface question functions as a request.|
|"maybe"|softening, reduced imposition|Weakens social force without eliminating the request.|
|"make"|action intent|Indicates that some transformation is expected.|
|"this"|deixis, interface grounding|Requires a currently salient text, design, message, object, or prior output.|
|"less aggressive"|vagueness, affective/evaluative stance|Requires a tone or style threshold.|
|whole utterance|revision request|The user likely wants an edit, not an explanation of aggression.|

The important point is that no single property explains the utterance. The system must combine context grounding, pragmatic intent, social softening, and vague evaluative meaning.

## 8.2 Ambiguity plus Context Dependence


Ambiguity becomes more difficult when the correct interpretation depends on context.

Example:

> "Send the table to Alex."

Possible ambiguity:

|Expression|Possible interpretations|
|---|---|
|"send"|email, share, export, attach, message, physically deliver|
|"table"|spreadsheet table, database table, document table, chart, furniture|
|"Alex"|one of several people named Alex|
|whole utterance|data-sharing action, document-editing action, logistics action|

The ambiguity is not merely lexical. The current context determines which meanings are plausible. If the user is looking at a spreadsheet, "table" probably refers to a data table. If the user is browsing furniture, it may refer to a physical object. If the user is editing a report, it may refer to a table embedded in the document.

The combined diagnostic question is:

```text
Which meaning is live in this context?
```


Required resolution:

1. Identify the active domain.
2. Bind the relevant object.
3. Resolve the action sense.
4. Resolve the recipient.
5. Ask for clarification if multiple plausible candidates remain and the action has material consequences.

This interaction is common because many ambiguous words are only ambiguous in abstraction. In context, one interpretation may become overwhelmingly likely.

## 8.3 Vagueness plus Urgency


Vagueness becomes riskier when paired with urgency.

Example:

> "Find a cheap flight as soon as possible."

Layer 0 properties:

|Expression|Property|Interpretive issue|
|---|---|---|
|"cheap"|vagueness, preference|What price threshold counts as cheap?|
|"flight"|category, domain context|One-way or round trip? Which class? Which route?|
|"as soon as possible"|urgency, temporal vagueness|Earliest possible departure, fastest booking, or urgent response?|
|whole utterance|tradeoff|Does the user prioritize low price or speed?|

The interaction creates a tradeoff. "Cheap" pushes toward lower cost; "as soon as possible" may push toward speed. The phrase does not specify which criterion dominates.

A better diagnostic framing is:

```text
Which vague threshold controls the decision, and what priority does urgency impose?
```


Possible resolution obligations:

|Situation|Required resolution|
|---|---|
|Low-risk search|Rank options by a reasonable price/speed tradeoff and state the assumption.|
|Booking or purchase|Ask the user to choose the tradeoff or confirm a threshold.|
|Deadline-sensitive task|Convert "as soon as possible" into a concrete time target or ask for one.|
|Multiple plausible thresholds|Preserve alternatives rather than collapsing them into one silent assumption.|

Urgency does not remove vagueness. It raises the cost of resolving vagueness incorrectly.

## 8.4 Deixis plus Interface Grounding


Deixis becomes operationally important when the referent is grounded in an interface rather than in the preceding text.

Example:

> "Change this column."

Layer 0 properties:

|Expression|Property|Required grounding|
|---|---|---|
|"this"|deixis|What is currently selected, highlighted, visible, or focused?|
|"column"|category/reference|Spreadsheet column, database column, document layout column, chart column?|
|"change"|underspecified action|Rename, resize, reformat, delete, move, calculate, sort?|
|whole utterance|action request|Determine whether the request is safe to execute directly.|

This is not ordinary discourse reference. The referent may be supplied by cursor position, selection state, viewport state, UI focus, or active document state. The critique file identifies this as a necessary addition: natural-language interpretation in software contexts often depends on interface telemetry, not only prior conversation.

Failure modes include:

|Failure mode|Example|
|---|---|
|No selected object|User says "this," but nothing is selected.|
|Multiple selected objects|"this column" could refer to several columns.|
|Stale selection|The interface focus changed after the user formed the intent.|
|Visual/reference mismatch|The user is looking at one object, but another object is technically focused.|
|Ambiguous action|"change" does not specify the transformation.|

The combined diagnostic question is:

```text
Which interface object anchors the deictic expression, and what operation is intended on it?
```


If the action is reversible and low-risk, the system may infer from the active selection. If the action is destructive, external, or hard to undo, the system should require explicit confirmation.

## 8.5 Politeness plus Directive Force


Politeness often disguises directive force.

Example:

> "Could you maybe make this shorter?"

Surface form:

```text
Question about ability + hedge + vague request
```


Likely communicative force:

```text
Please shorten this.
```


Layer 0 properties:

|Expression|Property|Interpretive issue|
|---|---|---|
|"Could you"|indirect speech act, politeness|This is probably a request, not an ability question.|
|"maybe"|politeness, mitigation|Softens the request but does not necessarily make it optional.|
|"make"|action intent|A transformation is expected.|
|"this"|deixis/context dependence|The target must be identified.|
|"shorter"|vagueness/comparison|Shorter by how much? What should be preserved?|

The key interaction is that politeness changes the social presentation of the request, not necessarily the underlying task. Treating the utterance as merely optional because it contains "maybe" would misread the directive force.

The combined diagnostic question is:

```text
Is the speaker softening a directive, weakening a preference, or genuinely asking whether the action is possible?
```


Examples:

|Utterance|Likely reading|
|---|---|
|"Could you send this?"|Request.|
|"Could this be shorter?"|Possible revision request, possibly evaluation.|
|"Maybe make this shorter."|Softened instruction.|
|"I wonder if this is too long."|Indirect critique; possible request for revision.|
|"This might be a bit long."|Evaluation that may imply revision.|

Politeness and indirectness are especially important because a literal reading can under-execute the user's intent.

## 8.6 Repair plus Non-Monotonicity


Repair is not merely additive. Later turns can invalidate earlier interpretations.

Example:

> "Actually, not that one -- the cheaper option from yesterday."

Layer 0 properties:

|Expression|Property|Interpretive issue|
|---|---|---|
|"Actually"|repair marker|A previous assumption or action path is being revised.|
|"not that one"|correction, deixis|The prior referent is rejected.|
|"the cheaper option"|comparative vagueness|Cheaper than which alternative?|
|"from yesterday"|temporal deixis, prior discourse|Which prior context or result set is being referenced?|
|whole utterance|non-monotonic update|A prior interpretation must be retracted, not merely supplemented.|

The critique file identifies this as **non-monotonic truth and state mutation**: in natural language, new information can retract or invalidate a previously accepted interpretation without requiring an explicit formal undo command.

Compare:

```text
User: Move the meeting to Friday.
User: Actually, Monday.
```


The second utterance does not mean:

```text
Move the meeting to Friday and Monday.
```


It means:

```text
Replace Friday with Monday.
```


The combined diagnostic question is:

```text
What prior interpretation is being corrected, narrowed, replaced, or cancelled?
```


Common repair patterns:

|Pattern|Example|Required interpretation|
|---|---|---|
|Replacement|"No, Monday."|Replace prior value.|
|Referent correction|"Not that one, the other file."|Rebind object.|
|Scope correction|"Only the urgent ones."|Narrow previous set.|
|Cancellation|"Actually, leave it."|Retract prior action.|
|Reprioritization|"Actually, prioritize battery life."|Reweight criteria.|

This is one of the most important cross-property interactions because the system must preserve the ability to revise meaning over time.

## 8.7 Modality plus Authority


Modality expresses possibility, permission, necessity, obligation, or prohibition. But modal expressions often require authority context before their force can be interpreted.

Example:

> "You can publish this after legal approves it."

Layer 0 properties:

|Expression|Property|Interpretive issue|
|---|---|---|
|"can"|modality|Ability, permission, or possibility?|
|"publish"|action intent|What publication channel or audience?|
|"after legal approves it"|condition, authority, presupposition|Has legal approval occurred? Who counts as legal?|
|whole utterance|conditional permission|The action may be allowed only after a condition is satisfied.|

The key interaction is that modality alone does not determine social or procedural force.

Compare:

|Utterance|Possible force|
|---|---|
|"You can publish this."|Permission, ability, or casual suggestion.|
|"You may publish this."|Permission, if the speaker has authority.|
|"You should publish this."|Recommendation or weak obligation.|
|"You must publish this."|Strong obligation.|
|"You must not publish this."|Prohibition.|
|"We probably should not publish this yet."|Cautious recommendation, possibly risk warning.|

Authority determines whether the modal expression is binding.

The combined diagnostic question is:

```text
Does the speaker have the authority to make the modal force binding?
```


Examples:

|Speaker context|Utterance|Interpretation|
|---|---|---|
|Legal reviewer|"You may publish this."|Permission.|
|Peer reviewer|"You may publish this."|Opinion or informal approval.|
|Manager|"You must send this today."|Strong directive.|
|External observer|"You must send this today."|Possibly advice, not institutional obligation.|
|User without access rights|"Delete the archive."|Directive intent, but authority must be checked.|

Modality plus authority is especially high-risk when the requested action affects other people, external systems, legal status, money, permissions, or irreversible state.

## 8.8 Multi-Property Utterance Examples


The following examples should function as reusable diagnostic cases throughout the document. They show that most natural-language interpretation problems are interaction effects, not isolated phenomena.

|Utterance|Active properties|Primary diagnostic risk|Required resolution|
|---|---|---|---|
|"Move it to tomorrow."|deixis/coreference, temporal deixis, underspecification, speech act|Wrong object or wrong date|Bind "it"; resolve "tomorrow"; infer move type.|
|"Make this less aggressive."|deixis, vagueness, affective stance, indirect revision request|Wrong target or wrong tone transformation|Identify target; infer genre-specific tone shift.|
|"Send that to Sarah before the meeting."|deixis, named-entity ambiguity, temporal reference, presupposition, request|Wrong recipient, object, or deadline|Resolve object, Sarah, meeting, channel, and timing.|
|"Actually, not that one -- the cheaper option from yesterday."|repair, non-monotonicity, deixis, comparative vagueness, temporal reference|Prior referent incorrectly preserved|Retract previous referent and bind replacement.|
|"Onboard the new contractor."|underspecification, action fan-out, authority, presupposition, workflow intent|Under-execution or unauthorized execution|Determine contractor, onboarding scope, permissions, and required sub-actions.|
|"Same as before, but only the urgent ones."|ellipsis, prior discourse, incremental refinement, vagueness, priority|Incorrect reuse of old settings or wrong urgency threshold|Retrieve prior operation; narrow set by urgency.|
|"We probably should not send this yet."|epistemic stance, modality, politeness/indirectness, risk warning|Treating a warning as a casual comment|Determine whether this is advice, objection, or soft prohibition.|
|"Can we just do the simple version for now?"|indirect request, vagueness, temporality, scope limitation, preference|Misreading temporary simplification as final requirement|Define "simple," "for now," and intended action.|

These examples can also be referenced from the Diagnostic Property Index in Section 9.

# 9. Diagnostic Property Index


The Diagnostic Property Index converts the Layer 0 taxonomy into a practical analysis tool. It should be used to inspect an utterance, identify which properties are active, and determine what kind of resolution is required before the meaning can be safely acted upon.

The index is not a second taxonomy. It is a diagnostic layer over the existing taxonomy. Its purpose is to prevent teams from treating all interpretation failures as the same kind of problem. For example, a referent failure, a vague threshold, an indirect speech act, and a repair marker all require different responses. The source document makes this point in its purpose: without an explicit model of linguistic mechanisms, teams misdiagnose failures and assign fixes to the wrong layer.

The index uses six fields:

```text
Property
Core question
Example
Required resolution type
Risk level
Downstream obligation
```

## 9.1 Property Table


Risk levels are default values. Actual risk depends on domain, user authority, reversibility, external side effects, and whether the action affects other people or systems.

|Family|Property|Core question|Example|Required resolution type|Default risk|Downstream obligation|
|---|---|---|---|---|---|---|
|Indeterminacy|Ambiguity|Which meaning is intended?|"Book a table."|Sense/domain disambiguation|Medium|Select the intended meaning or ask if multiple candidates remain plausible.|
|Indeterminacy|Vagueness|Where is the boundary?|"Find something nearby."|Threshold selection|Medium|Infer or request a usable threshold; preserve uncertainty when relevant.|
|Indeterminacy|Underspecification|What required information is missing?|"Schedule a meeting."|Parameter completion|Medium / High|Identify missing parameters and decide whether defaults are safe.|
|Indeterminacy|Prototype-based category|What does this resemble?|"Make it feel more enterprise."|Feature-cluster mapping|Medium|Translate resemblance into concrete attributes.|
|Indeterminacy|Metaphor|What cross-domain meaning applies?|"The design feels heavy."|Metaphor interpretation|Low / Medium|Infer the intended target property, such as density, complexity, or perceived slowness.|
|Context|Implicit context|What background is assumed?|"Do it like last time."|Context retrieval|Medium / High|Identify the relevant prior event, object, settings, or convention.|
|Context|Deixis|What is the anchor?|"Move this to tomorrow."|Anchor binding|Medium / High|Bind expressions to speaker, time, place, discourse, or interface state.|
|Context|Coreference|Which expressions share a referent?|"Sarah sent the file. Forward it."|Entity-chain resolution|Medium|Resolve pronouns and repeated descriptions to the correct entities.|
|Context|Ellipsis|What omitted material is recoverable?|"Only the urgent ones."|Ellipsis recovery|Medium|Reconstruct the missing structure from prior context.|
|Context|Presupposition|What is treated as already true?|"Cancel my next meeting."|Presupposition verification|High|Verify existence, state, and authority before acting.|
|Context|Interface grounding|What visible or selected object is being referenced?|"Change this column."|UI/context binding|Medium / High|Bind language to active document, selection, viewport, cursor, or focus state.|
|Communicative force|Speech act|What act is being performed?|"Can you send this?"|Speech-act classification|Medium|Distinguish question, request, warning, correction, confirmation, refusal, or evaluation.|
|Communicative force|Indirect speech act|What is meant beyond the surface form?|"Could this be shorter?"|Pragmatic inference|Medium|Detect implied requests, critiques, or constraints.|
|Communicative force|Implicature|What is implied but unstated?|"Some tests passed."|Implicature inference|Medium|Infer likely unstated meaning while preserving defeasibility.|
|Communicative force|Relevance filtering|Which interpretation matters here?|"Is Alex available?"|Salience selection|Medium|Choose the task-relevant interpretation.|
|Communicative force|Action fan-out|How many sub-actions are implied?|"Onboard the contractor."|Workflow decomposition|High|Expand one conceptual intent into required sub-actions without over-executing.|
|Discourse|Discourse structure|How do clauses or turns relate?|"Do X, then Y, unless Z."|Relation parsing|Medium|Preserve sequence, condition, contrast, exception, and causality.|
|Discourse|Repair/correction|What previous meaning is revised?|"No, the other one."|Repair resolution|High|Identify and update the prior interpretation being corrected.|
|Discourse|Mixed initiative|Who should guide the next move?|"Risk, cost, or speed?"|Initiative handling|Low / Medium|Allow clarification, narrowing, or reframing when the utterance invites it.|
|Discourse|Redundancy/emphasis|What is being reinforced?|"Today, not tomorrow."|Priority weighting|Medium|Treat repetition as signal, not noise.|
|Discourse|Incremental refinement|How is the task being narrowed or revised?|"Only 14-inch ones."|State mutation|Medium|Apply the new constraint to the existing task state.|
|Discourse|Non-monotonicity|What prior state is invalidated?|"Actually, leave it."|Retraction / replacement|High|Retract, replace, or cancel prior assumptions without treating the new turn as merely additive.|
|Social / stance|Politeness and face|What social softening is present?|"Could you maybe..."|Force recovery|Medium|Infer directive force without ignoring mitigation.|
|Social / stance|Epistemic stance|How certain is the speaker?|"I suspect this is the cause."|Confidence interpretation|Low / Medium|Preserve uncertainty and defeasibility.|
|Social / stance|Affective stance|What attitude is expressed?|"I'm worried about this."|Stance interpretation|Low / Medium|Treat affect as meaningful context for response and risk.|
|Social / stance|Modality|What is possible, required, permitted, or forbidden?|"You should not publish this yet."|Modal-force interpretation|Medium / High|Determine obligation, permission, possibility, recommendation, or prohibition.|
|Social / stance|Authority and role|Who has standing to request or approve this?|"Delete the archive."|Authority validation|High / Critical|Check whether the speaker can authorize the action.|
|Social / stance|Urgency and priority|How time-sensitive or important is this?|"ASAP, before EOD."|Priority/deadline resolution|Medium / High|Convert urgency into usable ordering, deadline, or clarification.|
|Social / stance|Commitment strength|How strongly is the claim or instruction endorsed?|"This might be the cause."|Commitment weighting|Low / Medium|Distinguish hard requirements from tentative claims or preferences.|

## 9.2 Core Question Per Property


Each property should be associated with a core diagnostic question. The question is the fastest way to identify what kind of interpretive work is needed.

Examples:

|Property|Core question|
|---|---|
|Ambiguity|Which meaning?|
|Vagueness|Where is the threshold?|
|Underspecification|What is missing?|
|Deixis|What is the anchor?|
|Coreference|Which expressions refer to the same thing?|
|Ellipsis|What omitted material must be recovered?|
|Presupposition|What is assumed to already exist or be true?|
|Speech act|What is the speaker doing with the utterance?|
|Implicature|What is implied but unstated?|
|Repair|What earlier interpretation is being revised?|
|Non-monotonicity|What previous state is invalidated?|
|Modality|What is required, permitted, possible, or prohibited?|
|Authority|Who has the right to authorize the action?|
|Urgency|What priority or deadline is implied?|

The diagnostic question should be asked before selecting a resolution strategy. Otherwise, the system may apply the wrong remedy: asking for clarification when it should resolve a referent, inferring a default when it should verify authority, or treating a repair as a new independent instruction.

## 9.3 Example Per Property


Examples in the index should be short, ordinary, and reusable. The goal is not to produce unusual edge cases, but to capture the kinds of expressions users naturally produce.

Good examples have three traits:

1. They isolate the property clearly.
2. They remain realistic.
3. They can be recombined into multi-property examples.

For instance:

|Property|Minimal example|Multi-property version|
|---|---|---|
|Deixis|"this"|"Send this to Sarah before the meeting."|
|Vagueness|"soon"|"Find a cheap flight as soon as possible."|
|Repair|"No, the other one."|"Actually, not that one -- the cheaper option from yesterday."|
|Modality|"should"|"We probably should not send this yet."|
|Ellipsis|"Only the urgent ones."|"Same as before, but only the urgent ones."|

The minimal example teaches the property. The multi-property version tests whether the analysis can handle realistic interaction.

## 9.4 Required Resolution Type


The "required resolution type" field identifies what kind of interpretive operation is needed. This is more useful than simply naming the property.

Common resolution types:

|Resolution type|Used for|Example|
|---|---|---|
|Sense disambiguation|Lexical or structural ambiguity|"table" as data table or furniture|
|Threshold selection|Vagueness|"nearby," "cheap," "soon"|
|Parameter completion|Underspecification|Missing date, time, recipient, location|
|Context retrieval|Implicit context|"like last time"|
|Anchor binding|Deixis|"this," "here," "tomorrow"|
|Entity-chain resolution|Coreference|"Sarah... she... it"|
|Ellipsis recovery|Omitted material|"Only the urgent ones"|
|Presupposition verification|Assumed facts|"my next meeting"|
|Speech-act classification|Communicative force|question versus request|
|Implicature inference|Unstated meaning|"Some tests passed" implying not all|
|Salience selection|Relevance filtering|"available" in scheduling context|
|State mutation|Incremental refinement|"Only 14-inch ones"|
|Retraction / replacement|Repair and non-monotonicity|"Actually, Monday"|
|Modal-force interpretation|Modality|"must," "may," "should"|
|Authority validation|Role and permission|"Delete the archive"|
|Priority/deadline resolution|Urgency|"ASAP," "before EOD"|
|Workflow decomposition|Action fan-out|"Onboard the contractor"|

This field is the bridge between linguistic diagnosis and downstream handling. It says what kind of resolution the utterance requires, without prescribing a specific implementation.

## 9.5 Risk Level


Risk level indicates the cost of getting the interpretation wrong.

Risk is not determined by the linguistic property alone. The same property can be low-risk in one context and critical in another.

Example:

> "Delete that."

|Context|Risk|
|---|---|
|Deleting a draft paragraph in an editor|Medium|
|Deleting a production database table|Critical|
|Deleting a local temporary file|Medium / High|
|Deleting a shared legal document|Critical|

Recommended risk scale:

|Risk level|Meaning|Typical handling|
|---|---|---|
|Low|Misinterpretation has little consequence and is easy to correct.|Infer if confidence is high; disclose assumptions if useful.|
|Medium|Misinterpretation causes inconvenience, wrong output, or reversible task error.|Infer with visible assumptions, offer correction path, or ask targeted clarification.|
|High|Misinterpretation may affect other people, external communication, money, access, scheduling, or persistent state.|Ask for clarification or confirmation before acting.|
|Critical|Misinterpretation may cause irreversible, unsafe, unauthorized, legal, financial, privacy, or security consequences.|Require explicit confirmation, authority validation, or refusal to proceed.|

Some properties tend to raise risk more often:

|Property|Why risk increases|
|---|---|
|Deixis|Wrong object may be selected.|
|Presupposition|Assumed entity or authority may not exist.|
|Repair|Prior state may be incorrectly preserved.|
|Non-monotonicity|Cancelled instructions may still execute.|
|Modality|Permission and obligation may be misread.|
|Authority|User may lack standing to authorize the action.|
|Action fan-out|One utterance may trigger many hidden sub-actions.|
|Urgency|Speed pressure may cause premature inference.|

The analysis file's critique of conversational repair is relevant here: repair is useful, but not always sufficient. Some uncertainty should block action rather than trigger a casual clarification loop.

## 9.6 Downstream Obligation


The downstream obligation field describes what later layers must preserve, resolve, defer, or reject once a Layer 0 property has been detected.

The obligation is not always "answer the user." It may be:

|Obligation|Description|
|---|---|
|Preserve uncertainty|Do not collapse multiple plausible interpretations into a hidden assumption.|
|Expose assumption|State the assumed referent, threshold, deadline, or intent.|
|Ask targeted clarification|Ask only for the missing piece needed to proceed.|
|Require confirmation|Confirm before high-risk or irreversible action.|
|Validate authority|Check whether the speaker can authorize the requested action.|
|Bind context|Attach the utterance to the correct object, time, person, interface state, or prior turn.|
|Track mutation|Update prior state when the user revises, narrows, or cancels an instruction.|
|Avoid over-execution|Do not expand a compressed utterance into excessive hidden actions.|
|Avoid under-execution|Do not treat a broad intent as a trivial single action when it implies a workflow.|
|Preserve defeasibility|Keep tentative claims tentative.|
|Escalate or decline|Refuse or halt when ambiguity, authority, or safety conditions make action inappropriate.|

Examples:

|Utterance|Active property|Downstream obligation|
|---|---|---|
|"Move it to tomorrow."|deixis, temporal grounding|Bind "it" and resolve "tomorrow" before moving anything.|
|"Make this less aggressive."|vagueness, affective stance, deixis|Identify target and infer tone transformation.|
|"Actually, not that one."|repair, non-monotonicity|Retract the prior referent and bind the replacement.|
|"Delete the old archive."|vagueness, authority, risk|Resolve "old," identify archive, validate authority, require confirmation.|
|"Onboard the new contractor."|underspecification, action fan-out|Determine the intended onboarding scope before decomposing into sub-actions.|
|"We probably should not send this yet."|epistemic stance, modality, indirect warning|Treat as a caution or possible soft prohibition, not as neutral commentary.|

The final purpose of Section 9 is to make Layer 0 analyzable. It turns linguistic properties into diagnostic questions and resolution obligations while preserving the central Layer 0 constraint: natural-language meaning is distributed across wording, context, intent, discourse history, and social stance.

# 10. Worked Examples


This section applies the Layer 0 taxonomy to concrete utterances. The purpose is not to produce a final implementation policy, but to show how Layer 0 properties become visible in ordinary user input.

Each example follows the same diagnostic structure:

```text
1. Utterance
2. Why the example matters
3. Active Layer 0 properties
4. Diagnostic decomposition
5. Resolution obligations
6. Common failure modes
```


The examples should be read as multi-property cases. They demonstrate the central premise of Layer 0: natural-language meaning is distributed across wording, context, pragmatic intent, discourse history, and social stance.

## 10.1 "Move it to tomorrow."

### Utterance


> "Move it to tomorrow."

### Why this example matters


This is a compact, ordinary instruction. It appears simple, but it depends on several unstated assumptions. The utterance contains a pronoun, a temporal expression, an underspecified action, and an implied task state.

It is useful because it shows how a short sentence can require substantial grounding before it becomes actionable.

### Active Layer 0 properties


|Segment|Active properties|Diagnostic question|
|---|---|---|
|"Move"|speech act, underspecified action|What kind of move is intended? Reschedule, relocate, reorder, transfer, reposition?|
|"it"|deixis, coreference, implicit context|What object or event is being referred to?|
|"to tomorrow"|temporal deixis, context dependence|What date is "tomorrow," relative to what timezone and reference time?|
|whole utterance|directive force, presupposition|Is there an existing object that can be moved? Does the user have authority to move it?|

### Diagnostic decomposition


The utterance compresses several parameters:

```text
action = move
target = it
destination = tomorrow
```


But each parameter is incomplete.

Possible interpretations:

|Context|Likely interpretation|
|---|---|
|Calendar context|Reschedule a meeting to tomorrow.|
|Task manager|Move a task deadline to tomorrow.|
|Kanban board|Move a card into tomorrow's work queue.|
|Document editor|Move selected content to a section labeled "tomorrow."|
|Travel planning|Move a reservation or itinerary item to tomorrow.|

The expression "it" requires a salient referent. That referent may come from the previous message, selected UI object, active calendar event, open task, or recent system output.

The expression "tomorrow" requires temporal grounding. In a user-facing system, this includes date, timezone, and sometimes business-calendar interpretation.

### Resolution obligations


Before acting, downstream layers should resolve:

|Obligation|Explanation|
|---|---|
|Bind the target|Identify what "it" refers to.|
|Interpret the action|Determine what "move" means in the current domain.|
|Resolve the date|Convert "tomorrow" into a concrete calendar date.|
|Check constraints|Determine whether the move is possible.|
|Check authority|Determine whether the user can modify the target.|
|Decide whether confirmation is needed|Required if the action affects other people, external state, money, or irreversible records.|

### Possible safe interpretations


Low-risk context:

```text
Assumption: “it” refers to the currently selected task.
Action: Move the task due date to tomorrow.
```


Higher-risk context:

```text
Assumption: “it” refers to the client meeting.
Required confirmation: “Do you want me to reschedule the client meeting to tomorrow?”
```

### Common failure modes


|Failure mode|Description|
|---|---|
|Wrong referent|The system moves the wrong meeting, task, file, or object.|
|Wrong action sense|"Move" is interpreted as relocation rather than rescheduling.|
|Wrong date|"Tomorrow" is resolved using the wrong timezone or reference date.|
|Missing authority|The user cannot modify the target object.|
|Over-execution|The system moves all related items rather than the intended one.|
|Under-execution|The system changes only a local draft, not the actual scheduled object.|

### Summary

```text
Core issue:
A compact instruction depends on referent binding, temporal grounding, action interpretation, and authority validation.
```

## 10.2 "Make this less aggressive."

### Utterance


> "Make this less aggressive."

### Why this example matters


This utterance combines interface grounding, vagueness, affective stance, and pragmatic intent. It is common in editing, design, communication, and review workflows.

The user is probably not asking for an explanation of the word "aggressive." They are asking for a transformation.

### Active Layer 0 properties


|Segment|Active properties|Diagnostic question|
|---|---|---|
|"Make"|directive force, revision request|What transformation is being requested?|
|"this"|deixis, interface grounding|What text, design, message, paragraph, or artifact is being referenced?|
|"less aggressive"|vagueness, affective stance, prototype category|What counts as aggressive in this genre?|
|whole utterance|pragmatic intent|Should the system revise, explain, ask, or propose alternatives?|

### Diagnostic decomposition


The utterance contains an evaluative target:

```text
target = this
desired change = less aggressive
```


But "less aggressive" is not a fixed operation. Its meaning depends on genre, audience, and communicative goal.

Possible interpretations:

|Context|"Less aggressive" may mean|
|---|---|
|Email|Less accusatory, less direct, more diplomatic.|
|Legal letter|Firm but less threatening.|
|UI copy|Less pushy, less intrusive, less alarmist.|
|Sales message|Less forceful, less urgent, less manipulative.|
|Design|Less visually dominant, less high-contrast, less sharp.|
|Argument|Less confrontational, more qualified.|

### Resolution obligations


|Obligation|Explanation|
|---|---|
|Ground "this"|Identify the target artifact or selected content.|
|Infer the relevant dimension|Tone, design, argumentation, visual hierarchy, wording, or behavior.|
|Preserve intended function|Reduce aggression without removing necessary firmness, clarity, or urgency.|
|Consider audience|The same tone can be appropriate in one context and excessive in another.|
|Decide whether to act or clarify|If the target is clear and the action is low-risk, revision may be appropriate.|

### Example analysis


Input:

```text
“You ignored the deadline again. Send the missing files immediately.”
```


Possible revision:

```text
“We’re still missing the files needed for the deadline. Could you send them today?”
```


What changed:

|Original feature|Revised feature|
|---|---|
|Direct blame|Neutral description.|
|"again"|Removed repeated-failure framing.|
|Command form|Request form.|
|"immediately"|Concrete but softer deadline.|

### Common failure modes


|Failure mode|Description|
|---|---|
|Wrong target|The system edits the wrong selected passage or artifact.|
|Over-softening|The message becomes too weak or loses necessary urgency.|
|Under-editing|The wording remains confrontational.|
|Genre mismatch|The revision becomes too casual for a legal, executive, or formal context.|
|Ignoring affective stance|The system treats the request as purely lexical replacement.|

### Summary

```text
Core issue:
A vague affective evaluation must be translated into a concrete transformation while preserving genre, purpose, and target grounding.
```

## 10.3 "Send that to Sarah before the meeting."

### Utterance


> "Send that to Sarah before the meeting."

### Why this example matters


This example combines deictic reference, named-entity resolution, temporal presupposition, channel underspecification, and action intent. It is representative of high-frequency workplace language.

The sentence looks operational, but several parameters are missing.

### Active Layer 0 properties


|Segment|Active properties|Diagnostic question|
|---|---|---|
|"Send"|speech act, action intent, underspecification|Send by which channel and in what format?|
|"that"|deixis, interface grounding, prior discourse|What object is being sent?|
|"Sarah"|named-entity reference, ambiguity|Which Sarah?|
|"before the meeting"|temporal reference, presupposition|Which meeting? What deadline does "before" imply?|
|whole utterance|directive force, possible external side effect|Is this safe to execute without confirmation?|

### Diagnostic decomposition


The utterance implies a structured action:

```text
action = send
object = that
recipient = Sarah
deadline = before the meeting
```


Each slot requires resolution.

Possible interpretations of "send":

|Context|Likely action|
|---|---|
|Email client|Email an attachment or link.|
|Chat app|Send a message or file.|
|Document editor|Share a document.|
|Project management tool|Assign or forward a task.|
|File manager|Transfer or upload a file.|

Possible referents for "that":

```text
selected file
active document
previous message
last generated answer
highlighted text
visible chart
the second option from prior results
```


Possible referents for "the meeting":

```text
next calendar meeting
meeting already mentioned
meeting with Sarah
meeting about the relevant project
currently open calendar event
```

### Resolution obligations


|Obligation|Explanation|
|---|---|
|Resolve object|Identify what "that" refers to.|
|Resolve recipient|Determine which Sarah is intended.|
|Resolve channel|Email, chat, document share, task assignment, or another channel.|
|Resolve deadline|Identify the meeting and derive a concrete time boundary.|
|Check permissions|Determine whether the object can be shared with Sarah.|
|Confirm if needed|Required if the content is sensitive, the recipient is ambiguous, or the action is external.|

### Possible safe handling


If context is strong:

```text
Assumption: “that” = active document.
Assumption: “Sarah” = Sarah Lee from the current project.
Assumption: “the meeting” = today’s 3:00 PM project sync.
Action: Prepare or send the document before 3:00 PM, depending on confirmation requirements.
```


If context is weak:

```text
Clarification needed:
“Which Sarah should I send it to, and do you mean the 3:00 PM project sync?”
```

### Common failure modes


|Failure mode|Description|
|---|---|
|Wrong object|The wrong file, passage, or result is sent.|
|Wrong Sarah|Sent to a different person with the same name.|
|Wrong channel|Shared by chat when email was expected, or vice versa.|
|Wrong meeting|Deadline derived from the wrong calendar event.|
|Privacy breach|Sensitive content is sent externally without confirmation.|
|Premature execution|The system sends before resolving ambiguity.|

### Summary

```text
Core issue:
A simple workplace directive requires object binding, recipient disambiguation, temporal grounding, channel selection, and permission checks.
```

## 10.4 "Actually, not that one -- the cheaper option from yesterday."

### Utterance


> "Actually, not that one -- the cheaper option from yesterday."

### Why this example matters


This utterance demonstrates discourse repair and non-monotonicity. The user is not adding a new independent instruction. They are revising a previous interpretation.

The analysis critique identifies this kind of state mutation as a key systems-level addition: natural-language state is not merely additive; later turns can invalidate prior assumptions without an explicit formal undo command.

### Active Layer 0 properties


|Segment|Active properties|Diagnostic question|
|---|---|---|
|"Actually"|repair marker, discourse update|What previous assumption is being revised?|
|"not that one"|rejection, deixis, referent correction|Which prior referent is being rejected?|
|"the cheaper option"|comparative reference, vagueness|Cheaper than which option?|
|"from yesterday"|temporal deixis, prior discourse|Which prior result set or interaction from yesterday?|
|whole utterance|non-monotonicity|What earlier state should be invalidated or replaced?|

### Diagnostic decomposition


This utterance implies a prior context:

```text
previously selected option = rejected
replacement option = cheaper option from yesterday
```


The utterance does not stand alone. It requires access to earlier discourse, prior result sets, or task history.

Possible prior context:

```text
The system selected a travel option.
The user previously compared vendors.
The user reviewed two product choices yesterday.
The user is correcting a selected file, meeting, quote, or candidate.
```

### Resolution obligations


|Obligation|Explanation|
|---|---|
|Identify prior referent|Determine what "that one" refers to.|
|Retract prior selection|Mark the previous referent as rejected.|
|Recover yesterday's context|Retrieve the relevant prior option set.|
|Resolve "cheaper"|Determine the comparison basis.|
|Bind replacement|Select the intended cheaper option.|
|Preserve state mutation|Ensure subsequent actions use the corrected referent.|

### Example state transition


Before repair:

```text
selected_option = Option B
criteria = best overall
```


User says:

```text
“Actually, not that one — the cheaper option from yesterday.”
```


After repair:

```text
selected_option = Option A
criteria = cheaper than Option B
source_context = yesterday’s option set
prior_selection = rejected
```

### Common failure modes


|Failure mode|Description|
|---|---|
|Additive interpretation|The system treats the cheaper option as an additional item instead of replacing the prior one.|
|Wrong prior context|The system retrieves the wrong "yesterday" interaction.|
|Wrong comparison class|"Cheaper" is calculated against the wrong option set.|
|Stale state|The system continues to act on the rejected option.|
|Over-repair|The system discards too much prior context instead of only replacing the referent.|

### Summary

```text
Core issue:
The utterance mutates prior conversational state. Correct interpretation requires retracting one referent and binding another.
```

## 10.5 "We probably should not change the public API before launch."

### Utterance


> "We probably should not change the public API before launch."

### Why this example matters


This utterance carries epistemic stance, modality, group alignment, temporal constraint, and risk signaling. It may function as a recommendation, warning, objection, or soft prohibition depending on the speaker's authority and the project context.

It is useful because it shows that meaning is not only propositional. The utterance also communicates caution, priority, and commitment strength.

### Active Layer 0 properties


|Segment|Active properties|Diagnostic question|
|---|---|---|
|"We"|person deixis, group alignment|Who is included in "we"?|
|"probably"|epistemic stance, commitment strength|How certain is the speaker?|
|"should not"|modality, recommendation, weak prohibition|Is this advice, constraint, or directive?|
|"change"|underspecified action|What counts as changing the API?|
|"the public API"|domain reference, presupposition|Which API surface is public?|
|"before launch"|temporal constraint|What launch date or milestone is relevant?|
|whole utterance|warning or objection|Should this block action, trigger discussion, or revise plans?|

### Diagnostic decomposition


The utterance contains a modal recommendation:

```text
recommended constraint = avoid public API changes
time window = before launch
certainty = probable, not absolute
stance = cautious
```


The phrase "probably" weakens epistemic certainty, but "should not" still carries directive force. The utterance may be tentative in evidence while strong in practical consequence.

This distinction matters:

```text
“I’m not certain this will break users, but the downside is high enough that we should avoid it.”
```

### Resolution obligations


|Obligation|Explanation|
|---|---|
|Identify speaker role|Does the speaker have authority over API decisions?|
|Interpret modality|Determine whether this is advice, warning, objection, or constraint.|
|Resolve temporal boundary|Identify the relevant launch.|
|Clarify action scope|Determine what counts as a public API change.|
|Preserve uncertainty|Do not convert "probably" into certainty.|
|Preserve caution|Do not dismiss the utterance as casual speculation.|

### Possible interpretations


|Context|Likely interpretation|
|---|---|
|Senior engineer in design review|Architectural warning.|
|Product manager in planning meeting|Release-scope constraint.|
|External observer|Suggestion or opinion.|
|Legal/compliance context|Potential approval blocker.|
|Casual brainstorming|Tentative preference.|

### Common failure modes


|Failure mode|Description|
|---|---|
|Treating it as fact|The system records "API changes are forbidden" without preserving uncertainty.|
|Treating it as weak opinion|The system ignores a potentially serious risk warning.|
|Misreading authority|The system treats an informal suggestion as binding approval or prohibition.|
|Losing temporal scope|The constraint is applied permanently rather than only before launch.|
|Overgeneralizing "change"|Internal implementation changes are incorrectly treated as public API changes.|

### Summary

```text
Core issue:
A tentative epistemic marker can coexist with a strong practical constraint. Correct interpretation must preserve both uncertainty and caution.
```

## 10.6 "Onboard the new contractor."

### Utterance


> "Onboard the new contractor."

### Why this example matters


This utterance demonstrates action fan-out. It is short, but it may imply a multi-step workflow involving identity, access, communication, compliance, scheduling, and approvals.

The critique file identifies action fan-out as a necessary addition: one natural-language intent can map to many downstream actions rather than a single operation.

### Active Layer 0 properties


|Segment|Active properties|Diagnostic question|
|---|---|---|
|"Onboard"|speech act, action fan-out, prototype category|What does onboarding include in this organization?|
|"the new contractor"|presupposition, reference, ambiguity|Which contractor? What status makes them "new"?|
|whole utterance|underspecification, authority, workflow intent|What actions are authorized and required?|

### Diagnostic decomposition


The utterance compresses a workflow into one verb.

Possible implied sub-actions:

```text
create account
provision email
grant workspace access
add to Slack or Teams
add to project management tool
assign onboarding checklist
schedule intro meetings
send welcome message
collect tax or compliance documents
assign equipment
set contract start date
notify manager
apply role-based permissions
```


But not all organizations define onboarding the same way. "Onboard" is a prototype-based category: it refers to a recognizable cluster of actions, not a universally fixed list.

### Resolution obligations


|Obligation|Explanation|
|---|---|
|Resolve contractor identity|Identify which contractor is meant.|
|Resolve onboarding scope|Determine what onboarding includes in this context.|
|Validate authority|Check whether the user can initiate account creation, access grants, or HR workflows.|
|Identify required approvals|Some sub-actions may require manager, IT, legal, or finance approval.|
|Avoid over-execution|Do not silently trigger every possible onboarding action.|
|Avoid under-execution|Do not reduce onboarding to a single welcome message if broader workflow is expected.|
|Track partial completion|Workflows may succeed in some steps and fail in others.|

### Example decomposition


A reasonable interpreted plan might be:

|Step|Action|Risk|
|---|---|---|
|1|Identify contractor record|Medium|
|2|Confirm start date and manager|Medium|
|3|Create account request|High|
|4|Grant default project access|High|
|5|Send onboarding email|Medium|
|6|Schedule intro meeting|Medium|
|7|Record pending approvals|Medium|

### Common failure modes


|Failure mode|Description|
|---|---|
|Wrong contractor|The system picks the wrong person.|
|Excessive fan-out|The system performs too many actions without confirmation.|
|Incomplete fan-out|The system performs only one superficial action.|
|Unauthorized access|Permissions are granted without approval.|
|Missing dependency|Account creation depends on HR record, start date, or signed contract.|
|No rollback plan|Some workflow steps succeed before a later step fails.|

### Summary

```text
Core issue:
A single verb can encode a multi-system workflow. Correct interpretation requires scope control, authority validation, and staged execution.
```

## 10.7 "Same as before, but only the urgent ones."

### Utterance


> "Same as before, but only the urgent ones."

### Why this example matters


This utterance combines ellipsis, implicit context, incremental refinement, vagueness, and priority. It cannot be interpreted without knowing the prior task.

It is useful because it shows how users often refine an existing operation rather than restating it.

### Active Layer 0 properties


|Segment|Active properties|Diagnostic question|
|---|---|---|
|"Same as before"|ellipsis, implicit context, prior discourse|Same operation, same parameters, same output format, or same criteria?|
|"but"|contrast, refinement|What is being changed relative to the previous operation?|
|"only"|scope narrowing|What set should be filtered?|
|"the urgent ones"|vagueness, priority|What counts as urgent?|
|whole utterance|incremental refinement|How should the previous task state be modified?|

### Diagnostic decomposition


The utterance implies a previous operation:

```text
previous_task = before
new_task = previous_task filtered to urgent items
```


But "same as before" can refer to different aspects of the prior interaction.

Possible meanings:

|"Same as before" may preserve|Example|
|---|---|
|Same data source|Use the same inbox, file set, or result set.|
|Same output format|Return the same table or summary style.|
|Same ranking criteria|Sort as before.|
|Same action|Repeat the same operation.|
|Same recipients|Send to the same people.|
|Same timeframe|Use the same date range.|

"Urgent" is also vague. It may refer to deadline proximity, sender importance, severity, business impact, explicit labels, repeated escalation, or user-defined priority.

### Resolution obligations


|Obligation|Explanation|
|---|---|
|Retrieve prior task state|Identify the operation being referenced.|
|Determine preserved parameters|Decide what "same" carries forward.|
|Apply scope narrowing|Filter the relevant set to "urgent ones."|
|Resolve urgency threshold|Infer or ask what counts as urgent.|
|Preserve contrast|Apply the new constraint without discarding all prior settings.|
|Avoid stale context|Ensure "before" refers to the correct prior interaction.|

### Example state transition


Prior task:

```text
Find unread emails from this week and summarize them by sender.
```


User says:

```text
“Same as before, but only the urgent ones.”
```


Interpreted task:

```text
Find unread emails from this week.
Filter to urgent emails.
Summarize them by sender using the same format as before.
```


Urgency indicators might include:

```text
explicit “urgent” or “ASAP”
deadline today
sender is manager or client
repeated follow-up
high-priority label
time-sensitive subject
known escalation thread
```

### Common failure modes


|Failure mode|Description|
|---|---|
|Wrong prior task|The system applies the refinement to the wrong earlier operation.|
|Excessive carryover|Irrelevant prior parameters are preserved.|
|Insufficient carryover|Important prior constraints are lost.|
|Wrong urgency threshold|The system uses a threshold the user would not endorse.|
|Treating it as standalone|The system asks for all details again despite recoverable context.|
|Over-filtering|Relevant urgent items are excluded due to overly strict criteria.|

### Summary

```text
Core issue:
The utterance is an elliptical refinement over prior task state. Correct interpretation requires carrying forward some parameters while narrowing others.
```

## 10.8 Cross-Example Summary Matrix


|Example|Primary properties|Main risk|Required resolution|
|---|---|---|---|
|"Move it to tomorrow."|deixis, temporal grounding, underspecification, directive force|Wrong object or date|Bind target, resolve date, interpret action.|
|"Make this less aggressive."|interface grounding, vagueness, affective stance, revision intent|Wrong target or wrong tone shift|Identify target and infer genre-specific transformation.|
|"Send that to Sarah before the meeting."|deixis, named-entity ambiguity, temporal presupposition, action intent|Wrong recipient, object, channel, or deadline|Resolve object, recipient, meeting, channel, and permissions.|
|"Actually, not that one -- the cheaper option from yesterday."|repair, non-monotonicity, comparative reference, temporal context|Prior referent incorrectly preserved|Retract prior referent and bind replacement.|
|"We probably should not change the public API before launch."|epistemic stance, modality, commitment strength, temporal constraint|Warning ignored or over-hardened into fact|Preserve uncertainty while respecting practical caution.|
|"Onboard the new contractor."|underspecification, action fan-out, authority, prototype category|Over-execution or incomplete workflow|Resolve scope, identity, permissions, and workflow boundaries.|
|"Same as before, but only the urgent ones."|ellipsis, implicit context, incremental refinement, vagueness|Wrong carryover or wrong urgency threshold|Retrieve prior task state and apply narrowed priority filter.|

## 10.9 Cross-Example Pattern Summary


Across the examples, several recurring interpretation patterns appear.

### 10.9.1 Short utterances often carry large hidden state


Examples:

```text
“Move it to tomorrow.”
“Same as before.”
“Alex too.”
```


These utterances are compact because they depend on shared state. The absence of explicit detail does not make them abnormal. It makes them natural-language input.

### 10.9.2 Referential grounding is often the first bottleneck


Examples:

```text
“it”
“this”
“that”
“the other one”
“the cheaper option”
```


Before intent can be safely executed, the system must know what object the utterance is about.

### 10.9.3 Vague terms often become risky when paired with action


Examples:

```text
“less aggressive”
“cheap”
“urgent”
“simple”
“soon”
```


A vague term can be harmless in discussion but risky in execution. The downstream obligation depends on consequence and reversibility.

### 10.9.4 Repair changes state rather than adding information


Examples:

```text
“Actually, Monday.”
“Not that one.”
“Leave it.”
```


These utterances often invalidate previous assumptions. They should not be treated as ordinary additive constraints.

### 10.9.5 Social and epistemic signals affect operational interpretation


Examples:

```text
“probably”
“should not”
“maybe”
“could you”
“I’m worried”
```


These expressions determine how strongly the utterance constrains future action.

### 10.9.6 Broad verbs can imply workflows


Examples:

```text
“onboard”
“prepare”
“publish”
“clean up”
“handle”
“follow up”
```


These verbs may require decomposition into sub-actions. The central risk is either over-execution or under-execution.

# 11. Glossary


This glossary defines the core Layer 0 terms used throughout the document. The terms are not implementation mechanisms. They describe recurring properties of natural-language input that downstream layers must preserve, resolve, defer, confirm, or reject.

Layer 0 treats these properties as native features of natural language, not as malformed commands. Natural-language meaning is distributed across wording, context, pragmatic intent, discourse history, and social stance.

## 11.1 Ambiguity


**Ambiguity** occurs when an expression has more than one discrete possible interpretation.

Ambiguity asks:

```text
Which meaning is intended?
```


Examples:

|Expression|Possible interpretations|
|---|---|
|"Book a table."|Reserve a restaurant table; buy a table; create a database or spreadsheet table.|
|"Send it to Alex."|Which item? Which Alex? Which sending channel?|
|"I saw the man with the telescope."|I used a telescope; the man had a telescope.|
|"Email all managers and engineers in Berlin."|All managers plus Berlin engineers; or all Berlin managers and Berlin engineers.|

Ambiguity differs from vagueness. Ambiguity involves multiple distinct meanings. Vagueness involves fuzzy boundaries within a meaning.

```text
Ambiguity: Which meaning?
Vagueness: Where is the boundary?
```


Layer 0 relevance: ambiguous input may require contextual disambiguation, targeted clarification, or safe deferral when multiple interpretations remain plausible.

## 11.2 Vagueness


**Vagueness** occurs when a term has fuzzy boundaries rather than a fixed threshold.

Vagueness asks:

```text
Where is the boundary?
```


Examples:

|Vague term|Boundary problem|
|---|---|
|"soon"|Minutes, hours, days, or before a known deadline?|
|"cheap"|Cheap relative to what budget, market, or user expectation?|
|"nearby"|Nearby by distance, travel time, or convenience?|
|"simple"|Simple visually, conceptually, operationally, or technically?|
|"senior"|Senior by years, autonomy, scope, compensation, or title?|
|"fast"|Low latency, short delivery time, high throughput, or quick response?|

Vagueness is not the same as missing information. A vague expression may provide information, but the usable threshold remains context-dependent.

Example:

```text
“Find a cheap hotel nearby.”
```


The user has supplied preferences, but not exact thresholds.

Layer 0 relevance: vague terms often require threshold inference, ranking, alternatives, or clarification when the threshold materially affects the outcome.

## 11.3 Underspecification


**Underspecification** occurs when an utterance leaves out information that may be required for a fully explicit interpretation.

Underspecification asks:

```text
What required information is missing?
```


Example:

```text
“Schedule a meeting with Alex.”
```


Missing information may include:

|Missing parameter|Issue|
|---|---|
|Which Alex|Multiple possible people.|
|Date|No day specified.|
|Time|No time specified.|
|Duration|Meeting length omitted.|
|Topic|Agenda omitted.|
|Medium|In person, phone, video, async?|
|Location|Physical or virtual location?|

Underspecification is not always a defect. It is often an efficient compression strategy: users omit details because they expect context, defaults, prior routines, or follow-up interaction to fill the gaps. The analysis document identifies this as an "economics of explicitness": natural language shifts decompression work away from the speaker and onto the interpretive system.

Layer 0 relevance: underspecified input requires parameter recovery, default selection, clarification, or confirmation depending on risk.

## 11.4 Deixis


**Deixis** refers to expressions whose interpretation depends on the situation of utterance.

Deixis asks:

```text
What is the anchor?
```


Common deictic types:

|Type|Examples|Depends on|
|---|---|---|
|Person deixis|I, you, we, they|Speaker and addressee.|
|Time deixis|now, today, tomorrow, later|Time of utterance.|
|Place deixis|here, there, nearby|Location or spatial frame.|
|Discourse deixis|this, that, the above, the former|Prior or surrounding discourse.|
|Social deixis|sir, professor, Your Honor|Social roles and relations.|

Example:

```text
“I need this by tomorrow.”
```


Required anchors:

|Expression|Required anchor|
|---|---|
|"I"|Speaker identity.|
|"this"|Current object, issue, document, task, or prior utterance.|
|"tomorrow"|Date relative to the utterance time and timezone.|

Layer 0 relevance: deictic expressions must be grounded before interpretation is complete. In software settings, that grounding may come from conversation history, active documents, cursor state, selected objects, or visible UI state.

## 11.5 Coreference


**Coreference** occurs when two or more expressions refer to the same entity.

Coreference asks:

```text
Which expressions refer to the same thing?
```


Example:

```text
“Sarah sent the contract yesterday. She said it was ready. Forward it to legal.”
```


Coreference links:

|Expression|Referent|
|---|---|
|"Sarah"|Sarah|
|"She"|Sarah|
|"the contract"|Contract document|
|first "it"|Contract document|
|second "it"|Contract document|
|"legal"|Legal team or legal contact|

Coreference can become difficult when multiple candidate referents are present.

Example:

```text
“Anna sent Maria the report after she revised it.”
```


Open questions:

```text
Who revised the report: Anna or Maria?
What does “it” refer to: the report or another object?
```


Coreference differs from deixis. Deixis anchors meaning to the utterance situation. Coreference links expressions within discourse to the same referent.

Layer 0 relevance: incorrect coreference resolution can cause wrong-object actions, wrong-recipient communication, or incorrect interpretation of prior statements.

## 11.6 Ellipsis


**Ellipsis** occurs when part of an expression is omitted because it can be recovered from context.

Ellipsis asks:

```text
What omitted material is recoverable?
```


Examples:

|Elliptical expression|Recovered meaning|
|---|---|
|"Cheapest, not fastest."|Find the cheapest option, not the fastest option.|
|"Same as before."|Use the same settings, method, or criteria as before.|
|"Only the urgent ones."|Filter the previously relevant set to urgent items.|
|"Not Friday -- Monday."|Replace Friday with Monday.|
|"With more examples."|Revise the prior output to include more examples.|
|"Alex too."|Add Alex to the relevant set.|

Ellipsis is closely related to underspecification, but the emphasis is different.

```text
Underspecification: required details are not stated.
Ellipsis: linguistic material is omitted because prior context can supply it.
```


Layer 0 relevance: ellipsis requires discourse-state recovery. The system must identify the prior task, object, parameter, or operation being continued.

## 11.7 Presupposition


**Presupposition** is background information that an utterance treats as already true.

Presupposition asks:

```text
What is assumed to already exist or be true?
```


Example:

```text
“Cancel my next meeting with Anna.”
```


Presuppositions:

|Presupposed fact|Why it matters|
|---|---|
|The speaker has meetings.|There must be a relevant calendar or schedule.|
|There is at least one upcoming meeting with Anna.|The referent must exist.|
|One meeting counts as the next such meeting.|The target must be identified.|
|The speaker has authority to cancel it.|Action may require permission.|

Another example:

```text
“Stop sending weekly reports to the client.”
```


Presuppositions:

```text
Weekly reports are currently being sent.
There is a relevant client.
The sending can be stopped.
The user has standing to request the change.
```


Presupposition differs from assertion. In "The current CEO is leaving," the departure is asserted, while the existence of a current CEO is presupposed.

Layer 0 relevance: presuppositions may need verification before action, especially when the utterance implies existence, current state, authority, or ongoing process.

## 11.8 Pragmatics


**Pragmatics** concerns intended meaning in context: what the speaker is doing with an utterance and what should be inferred beyond literal content.

Pragmatics asks:

```text
What does the speaker mean or intend in this context?
```


Example:

```text
“Can you open the window?”
```


Literal semantic content:

```text
Are you able to open the window?
```


Typical pragmatic interpretation:

```text
Please open the window.
```


The same sentence can perform different functions depending on context.

Example:

```text
“You finished the report?”
```


Possible pragmatic functions:

|Context|Likely function|
|---|---|
|Neutral check-in|Question|
|Surprised tone|Expression of surprise|
|Manager before deadline|Status request|
|Skeptical tone|Challenge|
|After seeing poor quality|Criticism|

Pragmatics is adjacent to context dependence but not identical to it.

```text
Context supplies background.
Pragmatics uses that background to infer intent.
```


Layer 0 relevance: pragmatic interpretation determines whether an utterance is a request, warning, suggestion, correction, complaint, confirmation, refusal, or implied instruction.

## 11.9 Speech Act


A **speech act** is an action performed through language.

Speech act analysis asks:

```text
What act is being performed by saying this?
```


Common speech acts:

|Speech act|Example|
|---|---|
|Request|"Please send the document."|
|Command|"Send the document now."|
|Question|"Did you send the document?"|
|Suggestion|"We could simplify this."|
|Warning|"This might break production."|
|Correction|"No, I meant the other branch."|
|Confirmation|"Yes, that version."|
|Refusal|"I cannot approve this."|
|Evaluation|"This argument is weak."|
|Promise|"I'll send it tonight."|

Speech acts are not always signaled directly. Surface form and communicative force can diverge.

Example:

```text
“Could you send me the file?”
```


Surface form:

```text
Question about ability.
```


Likely speech act:

```text
Request.
```


Layer 0 relevance: speech-act classification determines whether the system should answer, act, ask a question, revise, confirm, decline, warn, or treat the utterance as feedback.

## 11.10 Implicature


**Implicature** is meaning that is implied or suggested but not directly stated.

Implicature asks:

```text
What is implied but unstated?
```


Example:

```text
“Some of the tests passed.”
```


Possible implicature:

```text
Not all of the tests passed.
```


The literal sentence is compatible with all tests passing, but conversational expectations make "not all" a likely inference.

Another example:

```text
“It’s getting late.”
```


Possible implicatures:

|Context|Implied meaning|
|---|---|
|Meeting|We should wrap up.|
|Dinner|We should leave soon.|
|Work session|We should stop for today.|
|Travel|We should hurry.|
|Child bedtime|Start bedtime routine.|

Implicature differs from presupposition.

```text
Presupposition: treated as already true.
Implicature: suggested by context and conversational expectations.
```


Layer 0 relevance: implicatures are defeasible. The system should not always treat them as hard commitments, but it should often preserve or surface them when they affect interpretation.

## 11.11 Discourse Repair


**Discourse repair** occurs when a speaker fixes, revises, corrects, or clarifies a previous utterance or interpretation.

Discourse repair asks:

```text
What previous meaning is being revised?
```


Examples:

|Utterance|Repair function|
|---|---|
|"No, I meant next Friday."|Corrects a date.|
|"Actually, use the other file."|Replaces a referent.|
|"Not Sarah from finance -- Sarah from legal."|Disambiguates a person.|
|"Sorry, I meant Berlin, not Bern."|Corrects lexical or entity choice.|
|"Let me rephrase that."|Signals reformulation.|
|"Actually, leave it."|Cancels or retracts a prior instruction.|

Discourse repair is central because users often do not produce final intended meaning in one pass. Meaning is negotiated, corrected, and refined across turns.

Layer 0 relevance: repair requires mutable discourse state. The system must know what prior interpretation is being corrected and avoid treating the repair as a wholly independent new instruction.

## 11.12 Mixed Initiative


**Mixed initiative** means that either participant can guide the direction of the interaction.

Mixed initiative asks:

```text
Who should guide the next move?
```


Example:

```text
User: “Help me compare these options.”
System: “Do you care more about cost, risk, or speed?”
User: “Risk first.”
```


Mixed initiative appears in:

```text
clarification questions
suggestions
objections
reframing
prioritization
topic shifts
criteria negotiation
partial answers
```


Mixed initiative differs from simple question-answering. In mixed initiative, the interaction is collaboratively shaped. The user may start with an incomplete goal, and the other participant may help structure the task.

Layer 0 relevance: some utterances are not executable commands. They are openings for collaborative narrowing, clarification, or goal formation.

## 11.13 Epistemic Stance


**Epistemic stance** concerns how certain the speaker is and what kind of knowledge claim they are making.

Epistemic stance asks:

```text
How certain is the speaker, and what is the basis of the claim?
```


Examples:

|Expression|Epistemic stance|
|---|---|
|"I know"|High certainty.|
|"I think"|Moderate commitment.|
|"I suspect"|Inference, not certainty.|
|"Apparently"|Reported evidence.|
|"It seems"|Appearance-based judgment.|
|"Probably"|High but incomplete likelihood.|
|"Maybe"|Possibility.|
|"Definitely"|Strong certainty.|

Compare:

```text
“This is broken.”
```


with:

```text
“This seems broken.”
```


The second utterance marks weaker certainty and leaves more room for revision.

Layer 0 relevance: epistemic stance affects confidence, escalation, response tone, and whether a claim should be treated as fact, suspicion, evidence, hypothesis, or preference.

## 11.14 Modality


**Modality** expresses possibility, necessity, permission, obligation, likelihood, or prohibition.

Modality asks:

```text
What is possible, necessary, permitted, required, likely, or forbidden?
```


Examples:

|Modal expression|Meaning type|
|---|---|
|"must"|Obligation or necessity.|
|"should"|Recommendation or weak obligation.|
|"may"|Permission or possibility.|
|"can"|Ability or permission.|
|"could"|Possibility, ability, or politeness.|
|"might"|Possibility or uncertainty.|
|"probably"|Likelihood.|
|"definitely"|High certainty.|
|"do not have to"|Absence of obligation.|
|"must not"|Prohibition.|

Compare:

|Utterance|Modal force|
|---|---|
|"Do not change the public API."|Strong prohibition.|
|"Try not to change the public API."|Preference or weak constraint.|
|"Maybe avoid changing the public API."|Tentative recommendation.|
|"You can change the public API if needed."|Permission with condition.|

Modality overlaps with authority and commitment strength, but it is not identical to either.

```text
Modality: what kind of force is expressed?
Authority: does the speaker have standing to impose that force?
Commitment strength: how strongly is the force endorsed?
```


Layer 0 relevance: modal expressions affect whether the utterance should be treated as permission, requirement, warning, option, constraint, or prohibition.

## 11.15 Commitment Strength


**Commitment strength** concerns how strongly the speaker endorses a proposition, preference, instruction, or evaluation.

Commitment strength asks:

```text
How strongly is this claim, preference, or instruction endorsed?
```


Examples:

|Utterance|Commitment strength|
|---|---|
|"This is the cause."|Strong factual commitment.|
|"This is probably the cause."|High but defeasible commitment.|
|"This might be the cause."|Weak possibility.|
|"I prefer option A."|Preference.|
|"Option A seems reasonable."|Tentative evaluation.|
|"We must choose option A."|Strong directive commitment.|
|"Maybe choose option A."|Weak or tentative recommendation.|

Commitment strength differs from epistemic stance, though they overlap.

```text
Epistemic stance: how certain is the speaker?
Commitment strength: how strongly does the utterance constrain interpretation or action?
```


Example:

```text
“I’m not completely sure, but we must stop the deployment.”
```


This combines weaker epistemic certainty with strong directive commitment.

Layer 0 relevance: commitment strength helps distinguish hard requirements from tentative suggestions, weak preferences, hypotheses, and casual observations.

## 11.16 Interface Grounding


**Interface grounding** occurs when a natural-language expression depends on the current state of a software interface or digital workspace.

Interface grounding asks:

```text
What interface object, state, or selection anchors the utterance?
```


Examples:

|Utterance|Required interface grounding|
|---|---|
|"Change this column."|Selected, visible, or focused column.|
|"Make this shorter."|Highlighted text, active draft, previous answer, or selected object.|
|"Move that below the chart."|Visual object and target location.|
|"Delete the selected rows."|Current selection state.|
|"Apply this to all of them."|Current object plus relevant set.|

Possible grounding sources:

```text
active document
selected object
highlighted text
cursor position
viewport state
current UI focus
visible chart or table
open file
active thread
prior model output
application state
```


Interface grounding extends ordinary context dependence into software environments. The critique identifies this as an important addition because expressions such as "this column" may depend on cursor position, viewport state, selected DOM node, or other application telemetry rather than prior text alone.

Layer 0 relevance: incorrect interface grounding can produce wrong-object actions. When grounding is ambiguous or the action is high-risk, the system should clarify or confirm before acting.

## 11.17 Non-Monotonicity


**Non-monotonicity** means that later utterances can invalidate, replace, narrow, or cancel earlier interpretations.

Non-monotonicity asks:

```text
What previous state or interpretation is being invalidated?
```


Example:

```text
User: “Move the meeting to Friday.”
User: “Actually, Monday.”
```


The second utterance does not mean:

```text
Move the meeting to both Friday and Monday.
```


It means:

```text
Replace Friday with Monday.
```


Other examples:

|Utterance|Non-monotonic function|
|---|---|
|"Actually, leave it."|Cancels prior instruction.|
|"No, the other one."|Replaces prior referent.|
|"Only the urgent ones."|Narrows prior set.|
|"Ignore what I said about price."|Retracts prior constraint.|
|"Same as before, except not for admins."|Reuses prior state but adds an exception.|
|"Actually, prioritize battery life."|Reweights prior criteria.|

Non-monotonicity is closely related to discourse repair, but it names the state behavior more precisely.

```text
Discourse repair: the conversational act of correction or revision.
Non-monotonicity: the fact that new information can invalidate prior interpretation.
```


The analysis document flags this as a necessary systems-level addition: natural-language state is destructible and revisable, not merely additive.

Layer 0 relevance: systems interpreting natural language must preserve mutable context. They must be able to retract, replace, or revise prior assumptions without treating every new utterance as an additive instruction.

# Compact Glossary Table


|Term|Core question|Minimal example|
|---|---|---|
|Ambiguity|Which meaning?|"Book a table."|
|Vagueness|Where is the boundary?|"nearby"|
|Underspecification|What is missing?|"Schedule a meeting."|
|Deixis|What is the anchor?|"this," "tomorrow"|
|Coreference|Which expressions share a referent?|"Sarah... she... it"|
|Ellipsis|What omitted material is recoverable?|"Only the urgent ones."|
|Presupposition|What is assumed true?|"Cancel my next meeting."|
|Pragmatics|What is intended in context?|"Can you open the window?"|
|Speech act|What act is performed?|request, warning, correction|
|Implicature|What is implied but unstated?|"Some tests passed."|
|Discourse repair|What previous meaning is revised?|"No, I meant Friday."|
|Mixed initiative|Who guides the next move?|"Risk, cost, or speed?"|
|Epistemic stance|How certain is the speaker?|"I suspect..."|
|Modality|What is possible, required, permitted, or forbidden?|"must," "may," "should"|
|Commitment strength|How strongly is it endorsed?|"might" versus "must"|
|Interface grounding|What UI state anchors it?|"Change this column."|
|Non-monotonicity|What prior state is invalidated?|"Actually, leave it."|
