---
draft: false
toc: true
description: "Proposes designing around progress in shared work: explicit participants and state, initiative rules, human steering, operational uncertainty, inspectable contributions, recovery, and graduated autonomy."
title: "08 Collaborative System Design Practices"
linkTitle: "08 Collaborative System Design Practices"
---
# Collaborative-system design practices


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-04-01. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The retained question and reply propose practices for designing collaborative work, giving AI an active role, and augmenting human work. The complete three-part framework, ten shared practices, and final design test remain together. The sibling [comments]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices-comments" >}}) explain the placement and open choices.

The [participant profiles]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) retain the initial model and its later revision. The [framing dialogue]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}#from-conversational-interfaces-to-collaborative-work) explains the three shifts. The [semantic-substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) addresses the separate task of deriving constraints from guarantees.

# design framework


Design question: Which practices follow from these principles and approaches, and how could they help build such systems?

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The proposal is to treat the three shifts as a design framework:

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

One important consequence is that **conversation history should not become the state model**.

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


The proposal is to turn the principles above into a set of concrete product practices.

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


When reviewing a feature, the proposal is to ask five questions:

**Goal:** What shared outcome are the participants working toward?

**State:** What does the system know about the work beyond conversation history?

**Role:** What responsibility does the AI have?

**Initiative:** When should AI speak or act without being explicitly prompted?

**Control:** How can the human steer, inspect, correct, or reverse what happens?

If the team cannot answer these, the design is probably still based on the query-answer model.

The deeper shift is therefore something like:

> **We are designing a system of coordinated work, where humans and AI have different capabilities, roles, and levels of agency, and where the product helps them maintain shared state and make progress toward a goal.**

That is a stronger foundation than treating AI primarily as a conversational UI.
