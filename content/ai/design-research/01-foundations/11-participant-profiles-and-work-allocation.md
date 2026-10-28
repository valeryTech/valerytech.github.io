---
draft: false
toc: true
description: "Uses evolving human, LLM, and software capability profiles to derive augmentation, delegation, verification, grounding, mixed initiative, escalation, and autonomy proportional to reversibility."
title: "11 Participant Profiles And Work Allocation"
linkTitle: "11 Participant Profiles And Work Allocation"
---
# Participant profiles and work allocation


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The retained dialogue develops initial profiles for humans, LLMs, and conventional software, then revises them using a dictionary. Both versions and their complete derivations remain together. The sibling [comments]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation-comments" >}}) explain the differences and limits.

The [participant-neutral system model]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}) describes a separate architecture. [Augmenting human work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}#from-conversational-interfaces-to-collaborative-work) retains the intervening framing dialogue, and [collaborative-system design practices]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}) retains its practical continuation.

## Initial participant model and derivation

## definitive features as a foundation


Initial question: Could defining features of each participant provide a foundation for system design? Candidate LLM features include probabilistic output, summarization and natural-language understanding, text generation and its possible role in reasoning, and unreliability.

Open question: Which corresponding features should describe human participants?

Next question: Which existing or new system-building approaches follow from these participant features, including a move toward augmentation?

TODO: Clarify the original `XXX` marker; no further text is recorded here.

> I suspect this participant model could actually sit one level above the earlier principles. "Collaboration", "active AI", and "augmentation" then become consequences of how these participant types differ, rather than principles we chose arbitrarily.

The working interpretation is that this is the stronger route: define the participants by their structural properties first, then derive system design principles from those properties.

A useful distinction is between:

- what a participant can do,
- what it is good at,
- what failure modes it has,
- what kind of responsibility it can hold.

That gives us something more durable than a list of current LLM features.

For an LLM, the proposal is to describe the defining properties roughly like this:

|Property|LLM|
|---|---|
|Language|Can interpret and generate natural language across many domains|
|Generativity|Can produce new text, plans, representations, code, alternatives|
|Inference|Can perform multi-step reasoning and transformation over supplied context|
|Generality|Can operate across many tasks without task-specific programming|
|Probabilistic behavior|The same task does not imply a guaranteed result|
|Unreliable knowledge|Can produce plausible but false claims|
|Weak grounding|Does not inherently know whether its internal representation matches the external world|
|Context dependence|Behavior depends heavily on supplied context and framing|
|Scalability|Can process and generate large volumes of work cheaply and quickly|
|Persistence|Has no durable understanding unless the surrounding system provides memory/state|
|Responsibility|Cannot meaningfully bear accountability for consequences|
|Initiative|Can appear proactive if the system gives it goals, state, tools, and permission|

The key point is that "generates text" is only the surface behavior. Underneath it is something more important for product design:

> An LLM can construct and manipulate representations of a problem in language.

That gives it the ability to summarize, compare, classify, plan, explain, generate hypotheses, critique, synthesize, translate between representations, and propose actions.

But all of those outputs inherit its probabilistic and fallible nature.

For humans, the profile is almost complementary:

|Property|Human|
|---|---|
|Goals|Can originate goals and decide what is desirable|
|Values|Can apply preferences, ethics, taste, and social judgment|
|Context|Has lived, organizational, social, and tacit context|
|Grounding|Interacts directly with the physical and social world|
|Judgment|Can make decisions under ambiguity where criteria are incomplete|
|Learning|Can revise mental models from consequences and experience|
|Accountability|Can own decisions and consequences|
|Social understanding|Understands relationships, norms, incentives, status, trust|
|Attention|Limited|
|Memory|Limited and inconsistent|
|Processing capacity|Low compared with machines|
|Consistency|Variable|
|Bias|Systematic and sometimes hard to notice|
|Cost|Human time is expensive and scarce|

And then there is a third participant type considered essential here: conventional software and tools.

|Property|Software / tool|
|---|---|
|Execution|Can perform predefined operations exactly|
|Reliability|Usually highly reliable within specified conditions|
|State|Can maintain authoritative persistent state|
|Precision|Strong at computation, lookup, validation, and transactions|
|Permissions|Can enforce access and authorization|
|Semantics|Usually narrow; does not understand intent outside its schema|
|Adaptability|Low unless explicitly programmed|
|Accountability|Executes rules but does not own consequences|

This gives you three quite different participant types:

**Human:** goals, values, judgment, responsibility.

**LLM:** interpretation, generation, synthesis, flexible inference.

**Software:** reliable execution, state, constraints, precision.

That already suggests a system architecture.

Instead of asking:

> What can we automate with AI?

ask:

> How should we distribute work between participants with different properties?

That leads to several approaches.

### 1. Augmentation


Use the LLM to extend scarce human capabilities.

Human attention is limited; LLM processing is cheap.

So:

AI reads 500 items -> synthesizes -> human evaluates the important 5.

Human has an incomplete idea -> AI expands possibilities -> human applies judgment.

Human makes a decision -> AI turns it into artifacts, plans, communication, and execution steps.

This is augmentation in the strict sense: the system is designed around the combined capability.

### 2. Complementarity


Assign work based on relative strengths.

For example:

**LLM:** generate ten strategic options.

**Software:** calculate their financial consequences.

**Human:** determine which trade-offs are acceptable.

This is a stronger model than saying "human in the loop". The human does not merely approve AI output; each participant performs a different kind of work.

### 3. Delegation


Some tasks can be handed to AI when their cost of failure is low or their outputs are easy to verify.

For instance:

> "Research these suppliers and create an initial comparison."

The human delegates the work while retaining responsibility for the final decision.

This implies systems need explicit concepts of:

scope, completion criteria, authority, escalation, reporting.

### 4. Verification


Because LLM output is probabilistic, important outputs should often pass through a participant with a different failure mode.

For example:

LLM generates a calculation -> deterministic software checks it.

LLM extracts a contract clause -> source document provides evidence.

LLM proposes an important action -> human approves it.

A useful general principle is:

> Do not ask the same kind of participant to validate its own weakest property.

For example, another unconstrained LLM saying "yes, this factual claim is correct" is weaker than checking an authoritative source.

### 5. Constrained generation


Generation becomes safer and more useful when surrounded by deterministic constraints.

Instead of:

LLM -> final action

you get:

LLM proposes -> system validates -> permissions constrain -> action executes -> state records result.

The LLM handles ambiguity. Conventional software handles invariants.

This may become one of the core architectural patterns of AI systems.

### 6. Mixed initiative


Humans should not have to initiate every action, because one of the benefits of an AI participant is its ability to continuously interpret the situation.

But initiative should follow from role and state.

For example, if AI has been given the responsibility:

> "Keep this project on track."

then noticing that a dependency is three days late is a legitimate reason for intervention.

The system therefore needs a model of:

**responsibility + current state + events -> potential action**

rather than simply:

**new user message -> model response**

### 7. Escalation


Because different participants have different capabilities and authority, the system should know when to transfer a problem.

For example:

AI handles routine cases.

AI encounters ambiguity.

It gathers relevant information.

It presents the unresolved decision to the human.

Human decides.

AI continues execution.

This makes escalation part of the work model rather than treating every uncertainty as a conversational failure.

### 8. Reversible autonomy


LLMs are fallible, so the safe level of autonomy depends heavily on reversibility.

AI reorganizing a project board can have substantial autonomy if every change can be undone.

AI sending a legal agreement should have much less autonomy.

So a useful design relationship is roughly:

**greater reversibility -> more autonomy can be granted**

alongside cost, risk, confidence, and authority.

A more general framework may be derived from this.

Every participant can be described along perhaps seven dimensions:

1. **Capability** -- what work can it perform?
2. **Knowledge** -- what does it know, and how grounded is that knowledge?
3. **Reliability** -- what kinds of mistakes does it make?
4. **Capacity** -- how much work can it perform?
5. **Agency** -- can it initiate and pursue work?
6. **Authority** -- what is it permitted to do?
7. **Accountability** -- who owns the outcome?

Then product design becomes a problem of **composition**.

You decide which participant should:

understand -> propose -> decide -> execute -> verify -> monitor -> take responsibility.

That gives you a much more precise basis for concepts like augmentation.

For example, "augmentation" could then be defined as:

> A system design approach that distributes work across human, AI, and software participants according to their complementary capabilities and failure modes, while keeping decision authority and accountability appropriately assigned.

And several other system approaches naturally fall out of the same model:

**augmentation** -- combine complementary capabilities;

**delegation** -- transfer bounded work while retaining responsibility;

**verification** -- use participants with different failure modes to check important outputs;

**orchestration** -- coordinate specialized participants toward a shared goal;

**mixed initiative** -- allow multiple participants to initiate useful work;

**escalation** -- transfer work when the current participant reaches its capability or authority boundary;

**constrained autonomy** -- allow independent action inside explicit limits.

## Revised participant model and derivation


The later reply revises the initial profiles and dimensions. Its references to a dictionary remain as written, while the sibling comments link matching terminology context without claiming to identify the exact historical version.

# reframed


With the dictionary, the proposal is to change the earlier participant model quite a bit.

The biggest change is to stop using "intelligence" as one of the useful design dimensions. In the working dictionary, intelligence is just task-solving capability, while capability, competence, reasoning, understanding, grounding, agency, and autonomy are separate concepts.

That gives us a cleaner basis for system design.

### 1. Describe LLMs through capabilities, not "intelligence"


Instead of:

> LLMs are intelligent, generative, probabilistic...

The proposal is to say:

> An LLM has a broad and uneven set of task capabilities, expressed through language, with probabilistic and fallible performance.

Then separate several properties.

|Dimension|LLM|
|---|---|
|Capability|Can perform many linguistic and symbolic tasks under suitable conditions|
|Competence|Can be very strong on some task families and weak on nearby ones|
|Generation|Can construct new text, code, plans, classifications, representations, etc.|
|Reasoning|Can transform available information into intermediate conclusions that improve task performance|
|Understanding|Uncertain / domain-dependent; should not be inferred simply from competent output|
|Grounding|Primarily indirect when operating through text|
|Reliability|Variable; capable of plausible but incorrect output|
|Generality|Broad across task families, although uneven|
|Persistence|Normally supplied by the surrounding system|
|Agency|Limited in an isolated model call; can participate in a larger agentic system|
|Autonomy|Usually low because goals, invocation, context, permissions, and stopping conditions come from outside|
|Accountability|Cannot meaningfully bear human or institutional responsibility|

This follows the distinction in the document: high task competence does not imply grounding, understanding, agency, or autonomy.

And the proposal is to keep **generation** explicitly. "Capability" is too broad to capture what is special about LLMs for product design.

Generation is important because it lets the system create candidate representations: plans, summaries, explanations, hypotheses, decompositions, drafts, possible decisions, and so on.

Reasoning then describes one class of generative computation. The working definition is useful here because it doesn't require us to settle whether the model "understands": reasoning is information transformation that improves task performance.

So:

> generation is a capability; reasoning is a process that can be used while exercising capabilities; competence is the observed quality of the result.

That separation is useful.

<a id="2-id-also-revise-the-human-description"></a>

### 2. Revised description of human participants


The earlier LLM proposal described humans mostly in terms of strengths. With the working dictionary, we can make the comparison more symmetrical.

|Dimension|Human|
|---|---|
|Capability|Broad but limited by expertise, attention, time, and physical constraints|
|Competence|Highly dependent on experience and domain|
|Generation|Can construct ideas, explanations, plans, abstractions, artifacts|
|Reasoning|Can reason over explicit information and tacit knowledge|
|Understanding|Often grounded through lived interaction and accumulated experience|
|Grounding|Strong causal connection through perception and action in the world|
|Learning|Persistent modification through experience|
|Persistence|Continuous identity and history across interactions|
|Agency|Can select actions that affect future interaction with the environment|
|Autonomy|Relatively high; can form and regulate ongoing activity|
|Goals|Can originate, revise, abandon, and negotiate goals|
|Values / meaning|States and outcomes can matter to the person|
|Accountability|Can bear responsibility for decisions and consequences|
|Capacity|Scarce attention, memory, time, and processing capacity|
|Reliability|Variable; subject to error, bias, fatigue, incomplete knowledge|

This makes something important visible: **humans are not the "reliable component" either**.

The distinction is about different failure modes and different relationships with the world.

### 3. Conventional software becomes clearer too


|Dimension|Conventional software|
|---|---|
|Capability|Narrow, explicitly implemented capabilities|
|Competence|Often very high inside its specified domain|
|Generation|Usually constrained to programmed transformations|
|Reasoning|Can implement explicit algorithms/inference procedures|
|Grounding|Connected to external state through defined inputs, sensors, databases, APIs|
|Understanding|Usually not a useful attribution|
|Reliability|High when assumptions and inputs remain within specification|
|Persistence|Can maintain durable, authoritative state|
|Agency|Usually low; may participate in an agentic system|
|Autonomy|Usually externally specified|
|Authority|Can enforce permissions and perform consequential operations|
|Accountability|Lies with people/organizations operating the system|

This also avoids saying that software is "less intelligent" than an LLM, which doesn't tell us much architecturally.

A calculator has extremely strong capability and competence for arithmetic. It simply has a much narrower capability distribution.

<a id="4-i-would-change-the-dimensions-of-the-participant-model"></a>

## 4. Proposed changes to the participant-model dimensions


The earlier proposal was:

> capability, knowledge, reliability, capacity, agency, authority, accountability

The revised proposal is to expand and refine that.

A participant can be characterized by:

1. **Capabilities** -- what tasks can it perform, under what conditions?
2. **Competence** -- how well does it perform them?
3. **Generativity** -- can it construct new representations or candidate actions?
4. **Grounding** -- how is its information connected to the world?
5. **Understanding** -- what relations can it reliably model and use?
6. **Learning / persistence** -- does experience change its future behavior?
7. **Reliability** -- what kinds of errors does it make?
8. **Capacity** -- what volume/speed of work can it sustain?
9. **Agency** -- can it select actions affecting its future interaction?
10. **Autonomy** -- how much regulation comes from within the participant?
11. **Authority** -- what is it permitted to affect?
12. **Accountability** -- who is responsible for consequences?

Some of these describe the participant intrinsically; some describe its position in the system.

That distinction is valuable.

For example:

- capability belongs mainly to the participant;
- authority belongs mainly to the system;
- accountability belongs mainly to the social/organizational structure.

An LLM may be capable of sending a payment instruction. Whether it **may** do that is an authority question.

<a id="5-this-changes-how-we-derive-system-approaches"></a>

## 5. Consequences for deriving system approaches


Now "augmentation" becomes one consequence of mismatched capability profiles.

For example:

Human:

- grounded understanding,
- values,
- accountability,
- scarce attention.

LLM:

- broad generation,
- high processing capacity,
- weak reliability,
- weak grounding.

Software:

- narrow competence,
- high precision,
- authoritative state,
- deterministic enforcement.

That naturally gives us a composition like:

**Human defines / judges -> LLM explores / constructs -> software verifies / executes**

And from that we can derive the approaches more rigorously.

### Augmentation


Use one participant's capability to compensate for another participant's constraint.

Example:

human attention is scarce

-> LLM filters and synthesizes

-> human applies judgment.

### Complementarity


Assign different parts of the work according to capability profiles.

Example:

LLM generates possible interpretations

-> deterministic software calculates implications

-> human decides which implications are acceptable.

### Verification


Counter one participant's failure mode with another participant's stronger capability.

LLM factual uncertainty

-> retrieve grounded evidence.

LLM arithmetic weakness

-> deterministic calculation.

Human memory limitations

-> persistent system state.

### Grounding


Connect generative output to authoritative or causal external state.

This one becomes more important under the working vocabulary.

Instead of treating "AI knows X" as sufficient, ask:

> What connects this representation to the thing it claims to represent?

The cited document explicitly distinguishes grounding from understanding in this way.

### Delegation


Transfer a bounded capability while keeping authority/accountability explicit.

The interesting question becomes:

> What capability are we delegating, and what authority does the participant require to exercise it?

### Mixed initiative


Give multiple participants the ability to initiate actions, while preserving differences in agency and authority.

And here the working dictionary gives an important qualification: an isolated LLM inference has little agency; an LLM embedded in a persistent system may participate in an agent.

So the proposal is to avoid saying:

> "The LLM is proactive."

More precise:

> "The system gives the LLM-derived participant enough state, triggers, goals, and authority to initiate certain actions."

That is architecturally much clearer.

One broader conceptual change is proposed.

The proposal is to stop framing the design problem as:

> **human vs AI strengths**

and frame it as:

> **composition of participants with different capability profiles, grounding, failure modes, agency, authority, and accountability.**

That formulation gives you a direct path from the theory in the dictionary to concrete product and system design.

And it avoids needing to resolve philosophical questions about "how intelligent is the LLM?" before we can design with it.
