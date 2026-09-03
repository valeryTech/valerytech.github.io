---
draft: false
toc: true
title: "Build Approach"
linkTitle: "Build Approach"
---
## definitive features as a foundation


perhaps we could extract definitive features of participants? Like, for llm it will be not only probabilistic output, ability to summarize and understand natural language but more that it could generate texts (on one level) and therefore make some reasoning, and also non-reliable.

for humans so

and then try to apply existing approaches or understand which approaches to build the system we could construct (like - moving to augmentation...)

XXX

> I suspect this participant model could actually sit one level above the earlier principles. "Collaboration", "active AI", and "augmentation" then become consequences of how these participant types differ, rather than principles we chose arbitrarily.

Yes. I think this is the stronger route: define the participants by their structural properties first, then derive system design principles from those properties.

A useful distinction is between:

- what a participant can do,
- what it is good at,
- what failure modes it has,
- what kind of responsibility it can hold.

That gives us something more durable than a list of current LLM features.

For an LLM, I would describe the defining properties roughly like this:

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

And then there is a third participant type that I think is essential: conventional software and tools.

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

From here I think you can reduce this to a more general framework.

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

## first part (to rewrite)


how would you name the shift in mindset when we're designing or discovering the product.

For example, instead of building 'query-answer' ui for prompts and answers we're considering this as a collaborative work, or a system includes different participants working with each other to achieve some goal?

Perhaps we could also introduce here some active role of AI and augmenting human work (of course, it's different principles)

XXX

I'd separate this into two related mindset shifts, because they lead to different design principles.

The first is about the product itself:

**From interaction design to collaboration design.**

The unit of design changes from "a user sends an input and the system returns an output" to "participants work together toward an outcome."

That changes the basic model:

|Query-answer model|Collaborative work model|
|---|---|
|User|Participant|
|Prompt|Contribution / instruction|
|Answer|Contribution / work product|
|Conversation|Shared working context|
|Turn|Action in a workflow|
|UI state|Shared state|
|Success = good response|Success = progress toward a goal|

If humans, AI, tools, and services can all participate, I'd describe the product as a **multi-participant work system** or, in more academic language, a **socio-technical system**. The latter is accurate but probably too academic as a product principle.

The second shift is specifically about AI:

**From AI as a tool to AI as an active participant.**

Here AI has some initiative. It can notice something, propose a next step, perform work, coordinate with other participants, maintain context, or act on behalf of the user within defined boundaries.

There's then another useful principle underneath it:

**From automation to augmentation.**

The design question becomes less "what can AI do instead of the human?" and more "how does the combined human-AI system perform better?" This includes dividing work according to strengths, letting humans steer and correct, preserving judgment and accountability, and having AI reduce cognitive or operational load.

So I'd probably organize the overall idea as:

1. **Interaction -> Collaboration**
    Design around shared goals and ongoing work, rather than exchanges of prompts and answers.
2. **Tool -> Participant**
    Give AI an active role in the work, with appropriate initiative, responsibilities, and boundaries.
3. **Automation -> Augmentation**
    Optimize the combined human-AI system, including how work and judgment are divided.

If you need one umbrella phrase for the whole shift, **"from conversational interfaces to collaborative systems"** is probably the clearest. "Conversational" describes the current UI paradigm; "collaborative system" describes the deeper product model you're moving toward.

# design framework


ok, now let's analyse these principles and approaches. And let's define the practices (or advices) that could help us build such systems.

XXX

I'd treat the three shifts as a design framework:

- interaction -> collaboration
- tool -> participant
- automation -> augmentation

They are related, but they solve different problems. The practices should follow from the consequences of each shift.

## 1. Interaction -> collaboration


The core change is the unit of design.

In a query-answer product, we design a turn: input -> response.

In a collaborative product, we design progress toward a goal over time. That means the system needs some concept of goal, state, participants, responsibilities, and next actions.

A useful mental model is:

**Goal -> shared state -> contributions -> coordination -> progress**

The UI is then one surface over that system. Chat may still be present, but it is no longer the product model.

|Principle|What it means|Useful practices|
|---|---|---|
|Design around goals|The system should understand what the user is trying to accomplish|Make goals explicit; allow them to evolve; distinguish immediate requests from the broader objective|
|Maintain shared state|Collaboration depends on a common understanding of what has happened and what remains|Represent decisions, artifacts, open questions, constraints, plans, and status separately from chat history|
|Make work visible|Participants need to understand what others have done|Show changes, decisions, assumptions, pending work, and provenance|
|Support continuity|Work often lasts longer than a single conversation|Make projects resumable; preserve important context; summarize state rather than replaying the whole conversation|
|Design for handoffs|Different participants may own different parts of the work|Make ownership, dependencies, inputs, outputs, and completion criteria explicit|
|Optimize for progress|A good answer may still fail to advance the work|Evaluate whether the system reduced uncertainty, completed work, or moved the project forward|

One important consequence is that **conversation history should not become your state model**.

If the only way the system knows that "we chose option B", "this constraint is fixed", or "this task is done" is by rereading 120 messages, the product will become fragile.

The collaboration model should have durable objects such as decisions, tasks, artifacts, goals, constraints, participants, and versions.

## 2. Tool -> participant


This shift introduces agency.

A tool waits for a command. A participant can observe, reason about the situation, propose actions, perform some actions, and coordinate with others.

The design problem therefore becomes: **what initiative should the AI have, under what conditions, and with what authority?**

A useful model is to separate four things:

**awareness -> initiative -> action -> authority**

An AI can have high awareness without high authority. For example:

> "The release date conflicts with the dependency schedule. I recommend moving it."

That is different from:

> "I moved the release date."

This distinction is critical.

|Principle|What it means|Useful practices|
|---|---|---|
|Give AI a defined role|"Assistant" is often too vague|Define what the AI is responsible for, what it watches, and what it should ignore|
|Make initiative intentional|Proactivity should have a reason|Let AI intervene when it can reduce risk, unblock work, surface a dependency, or advance an agreed goal|
|Separate proposing from acting|Suggesting and executing have different consequences|Define actions as recommend, prepare, execute, or execute-with-approval|
|Bound authority|AI should know where its autonomy ends|Set permissions by action type, reversibility, cost, risk, and scope|
|Expose rationale|Participants need to understand why AI acted|Show relevant evidence, assumptions, and the reason for interventions|
|Support correction|Collaboration requires negotiation|Make it easy to reject, revise, redirect, or undo AI actions|
|Make commitments explicit|An active participant should not silently invent responsibilities|Represent what the AI has agreed to do and what it is currently doing|

A good test here is:

> If the AI initiates something, can the user understand **why now**, **why this**, and **why the AI was allowed to do it**?

If those answers are unclear, the system will feel unpredictable.

## 3. Automation -> augmentation


This principle changes what you optimize for.

Automation asks:

> Can the machine perform this task?

Augmentation asks:

> What division of work produces the best overall outcome?

That means the answer may involve AI doing the work, humans doing the work, or both continuously adjusting each other.

The right division depends on the task.

|Human tends to be stronger at|AI tends to be stronger at|
|---|---|
|judgment under ambiguous values|processing large amounts of information|
|deciding what is desirable|generating and comparing alternatives|
|responsibility and accountability|repetitive transformation|
|understanding social context|monitoring many signals|
|setting priorities|maintaining consistency|
|handling novel exceptions|recalling and synthesizing context|

This should shape the product.

For example, instead of:

> AI writes the strategy.

The collaboration might look like:

> Human defines objectives and constraints -> AI explores possibilities -> human chooses direction -> AI develops it -> human challenges assumptions -> AI maintains the resulting plan.

The system is designed around the **combined loop**.

## Practices that apply across all three shifts


I'd turn the principles above into a set of concrete product practices.

### 1. Start discovery from work, not prompts


Do not begin with:

> "What prompts will users type?"

Study:

> "What are they trying to get done?"

Map the existing work:

**goal -> steps -> decisions -> information -> people -> tools -> artifacts -> failure points**

Then decide where AI belongs.

This prevents the product from becoming "chat pasted on top of an existing workflow."

### 2. Identify the participants


Treat the system almost like a team.

For each participant, define:

|Participant|Knows|Can do|Responsible for|
|---|---|---|---|
|User|goals, preferences, judgment|approve, edit, decide|final decisions|
|AI|project context, available information|analyze, draft, coordinate|selected work|
|External tool|system state|perform operations|execution|
|Other human|domain knowledge|review, contribute|specific decisions|

This immediately exposes unclear responsibilities.

### 3. Model the shared workspace


Ask:

> What would be on the table if these participants were working together in the same room?

Usually it is more than messages.

It might include:

tasks, plans, documents, evidence, decisions, hypotheses, open questions, constraints, comments, changes, status, owners.

Those are usually better product objects than "messages".

### 4. Design around transitions in work


Instead of focusing primarily on screens, design important transitions:

**unclear -> understood**

**options -> decision**

**decision -> plan**

**plan -> execution**

**execution -> review**

**problem -> resolution**

AI can play a different role in every transition.

This is often a more useful design abstraction than "user asks / AI responds."

### 5. Design explicit initiative rules


Do not simply tell the model "be proactive."

Specify what warrants intervention.

For example:

AI should act when:

- work is blocked,
- an important assumption appears false,
- new information changes a decision,
- the user has delegated a clear task,
- a deadline or dependency requires attention,
- there is a clear next step that can safely be performed.

This creates predictable proactivity.

### 6. Use progressive autonomy


Do not make autonomy binary.

A useful progression is:

**observe -> suggest -> prepare -> act with approval -> act and report**

Different actions can sit at different levels.

For example, AI might freely reorganize notes, ask before sending an email, and never authorize a payment.

Autonomy therefore becomes a property of an action, rather than a property of the whole AI.

### 7. Preserve human steering


A collaborative AI needs continuous steering, not only approval dialogs.

Users should be able to say things like:

> prioritize speed

> stop pursuing this direction

> keep this assumption fixed

> ask me before changing scope

> handle these decisions yourself

These instructions should become part of the working state.

### 8. Make uncertainty operational


AI uncertainty should influence behavior.

When confidence is high, it may act.

When uncertainty is moderate, it may propose.

When uncertainty concerns something consequential, it should ask or escalate.

So uncertainty should affect **control flow**, not just produce phrases such as "I may be wrong."

### 9. Make AI work inspectable


The user should be able to inspect important work at the appropriate level.

Usually this means showing:

sources, assumptions, changes, decisions, planned actions, results.

It does not mean exposing internal reasoning.

The practical question is:

> What information does the user need to confidently supervise this work?

### 10. Design for recovery


Active systems will make mistakes.

Recovery should therefore be a first-class interaction.

Design for:

undo, version history, retry, correction, rollback, reassigning responsibility, restoring previous state.

The more autonomous the system becomes, the more important reversibility becomes.

## A useful design test


When reviewing a feature, I would ask five questions:

**Goal:** What shared outcome are the participants working toward?

**State:** What does the system know about the work beyond conversation history?

**Role:** What responsibility does the AI have?

**Initiative:** When should AI speak or act without being explicitly prompted?

**Control:** How can the human steer, inspect, correct, or reverse what happens?

If the team cannot answer these, the design is probably still based on the query-answer model.

The deeper shift is therefore something like:

> **We are designing a system of coordinated work, where humans and AI have different capabilities, roles, and levels of agency, and where the product helps them maintain shared state and make progress toward a goal.**

That is a stronger foundation than treating AI primarily as a conversational UI.

# reframed


Yes. With the dictionary, I'd change the earlier participant model quite a bit.

The biggest change is to stop using "intelligence" as one of the useful design dimensions. In your dictionary, intelligence is just task-solving capability, while capability, competence, reasoning, understanding, grounding, agency, and autonomy are separate concepts.

That gives us a cleaner basis for system design.

### 1. Describe LLMs through capabilities, not "intelligence"


Instead of:

> LLMs are intelligent, generative, probabilistic...

I'd say:

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

And I would keep **generation** explicitly. "Capability" is too broad to capture what is special about LLMs for product design.

Generation is important because it lets the system create candidate representations: plans, summaries, explanations, hypotheses, decompositions, drafts, possible decisions, and so on.

Reasoning then describes one class of generative computation. Your definition is useful here because it doesn't require us to settle whether the model "understands": reasoning is information transformation that improves task performance.

So:

> generation is a capability; reasoning is a process that can be used while exercising capabilities; competence is the observed quality of the result.

That separation is useful.

### 2. I'd also revise the human description


Previously I described humans mostly in terms of strengths. With your dictionary, we can make the comparison more symmetrical.

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

## 4. I would change the dimensions of the participant model


Earlier I suggested:

> capability, knowledge, reliability, capacity, agency, authority, accountability

I'd now expand and refine that.

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

## 5. This changes how we derive system approaches


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

This one becomes more important under your vocabulary.

Instead of treating "AI knows X" as sufficient, ask:

> What connects this representation to the thing it claims to represent?

Your document explicitly distinguishes grounding from understanding in this way.

### Delegation


Transfer a bounded capability while keeping authority/accountability explicit.

The interesting question becomes:

> What capability are we delegating, and what authority does the participant require to exercise it?

### Mixed initiative


Give multiple participants the ability to initiate actions, while preserving differences in agency and authority.

And here your dictionary gives an important qualification: an isolated LLM inference has little agency; an LLM embedded in a persistent system may participate in an agent.

So I would avoid saying:

> "The LLM is proactive."

More precise:

> "The system gives the LLM-derived participant enough state, triggers, goals, and authority to initiate certain actions."

That is architecturally much clearer.

There is one broader conceptual change I'd make.

I would stop framing the design problem as:

> **human vs AI strengths**

and frame it as:

> **composition of participants with different capability profiles, grounding, failure modes, agency, authority, and accountability.**

That formulation gives you a direct path from the theory in the dictionary to concrete product and system design.

And it avoids needing to resolve philosophical questions about "how intelligent is the LLM?" before we can design with it.
