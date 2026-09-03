---
draft: false
toc: true
title: "Collab Transfer"
linkTitle: "Collab Transfer"
---
I'd name the underlying lens **joint activity** or **collaborative work**, not simply "team collaboration."

The core assumption is:

> Two or more actors are trying to achieve a shared outcome while information, capabilities, judgment, and authority are distributed between them.

From that, we ask:

- How do they align on the goal?
- How do they establish shared understanding?
- How do they divide and coordinate work?
- How do they observe and steer each other?
- How do they evaluate each other's contributions?
- How do they recover when something goes wrong?

That is the basis of the collaboration model we derived.

"Teamwork" research is one useful source, but our lens is broader. It also covers:

- two people collaborating,
- expert + learner,
- customer + support agent,
- manager + employee,
- human + AI,
- several humans + AI.

So I'd describe our approach as:

**Use the mechanics of joint human work as a design lens for human-AI interaction.**

Then there are three underlying bodies of ideas we've implicitly used:

1. **Joint activity / common ground** -- how collaborators maintain shared understanding and coordinate intentions.
2. **Coordination / collaborative work** -- how work is divided, dependencies managed, and handoffs handled.
3. **Teamwork** -- goals, roles, monitoring, adaptation, backup, trust, communication.

And our AI-specific move is:

> Treat AI as another participant in the work, then ask how information, action, judgment, and authority should be distributed between human and AI.

That last sentence is probably the most precise statement of the approach.

## practices/principles-v0.1


Once we frame AI as a collaborator, a much larger set of design principles becomes available. Teresa's proposal/change-set pattern is one instance: the AI contributes to shared work in a way the user can inspect and revise.

From there, I'd transfer principles from good human collaboration:

|Collaboration principle|AI design implication|
|---|---|
|**Shared goal**|AI should know what outcome both sides are working toward, not merely respond to the latest message.|
|**Clear roles**|Make clear what AI owns, what the user owns, and what requires joint judgment.|
|**Shared context**|Both sides should work from the same relevant facts, constraints, artifacts, and current state.|
|**Visible contributions**|Show what AI added, changed, inferred, or proposed.|
|**Review before commitment**|For consequential work, separate `propose` from `apply`.|
|**Ground claims in evidence**|Let the user trace an AI conclusion back to source material, data, or observations.|
|**Support disagreement**|The user should be able to say "that grouping is wrong" or "use this assumption," and AI should adapt.|
|**Repair misunderstandings**|Good collaboration includes detecting that the parties mean different things and re-establishing shared understanding.|
|**Explicit handoffs**|Make transitions clear: "I've done the analysis; I need you to choose between A and B."|
|**Track commitments and decisions**|Preserve what was agreed, rejected, deferred, or still unresolved.|
|**Expose uncertainty**|A collaborator should distinguish what it knows, assumes, and needs to verify.|
|**Respect authority boundaries**|AI shouldn't take an action merely because it can; authority should match the role it was given.|
|**Make work reversible**|Shared work should tolerate experimentation, revision, and undo.|
|**Escalate appropriately**|Know when the other collaborator has information, authority, or expertise the AI lacks.|

A few of these feel especially strong as AI product principles.

**Shared goal + clear roles** may be the foundation. A lot of weak AI experiences are vague about the relationship: is AI advising me, doing the task, reviewing my work, or making the decision? Collaboration works better when that division is explicit.

Then **proposal before commitment** is the pattern you already identified:

`AI contribution → inspect → discuss/modify → commit`

And **repair** is probably underexplored. Human collaborators constantly repair shared understanding:

> "When you say 'conversion,' do you mean checkout conversion or signup conversion?"

That is more than clarification. It is maintaining **common ground**--a shared understanding of what the team is talking about.

Another useful one is **handoff design**. Good collaboration doesn't mean both parties participate equally in every step:

`AI investigates → human decides → AI executes → human reviews`

The product should make those boundaries visible.

So I might frame the overall area as:

**Design AI using the mechanics of effective collaboration: shared goals, clear roles, common ground, reviewable contributions, disagreement and repair, explicit handoffs, and reversible decisions.**

And then **inspectability / controllability / verifiability** become one subset of that broader collaborative-design model, rather than the whole model.

## Subset


In good collaboration, one participant usually doesn't silently modify shared work. They:

`propose → show what changed → explain if needed → other person reviews → accept / modify / reject`

So the broader design principle could be:

> Design AI actions using the same properties we need in collaborative work.

That naturally gives you:

- **Inspectability** -- I can see what you changed or propose.
- **Controllability** -- I can accept, reject, or modify it.
- **Justification** -- I can ask why you proposed it.
- **Verifiability** -- I can check it against evidence or source material.
- **Reversibility** -- We can undo or revise it.
- **Negotiability** -- I can disagree, and the collaborator can adapt.

The last one may be especially important. Collaboration isn't just "AI explains itself." It supports disagreement and revision.

> AI as a collaborator should make its contributions reviewable, challengeable, and revisable.

## Completeness reasoning and justifications


You can't prove you've found _all_ collaboration mechanics, but you can get much closer by triangulating several established collaboration theories and checking whether new sources keep adding new categories. I'd treat this as a coverage/saturation exercise, not a brainstorming exercise.

A first finding from the literature is that our previous list was still mixing levels. "Shared goal" is a precondition, "handoff" is a coordination mechanism, and "trust" is an enabling condition. We should separate those before judging completeness.

XXX

I'd verify it by triangulating established collaboration research, then checking whether additional frameworks keep adding new categories. We can't prove absolute completeness, but we can get to a point where the taxonomy is stable.

I checked four fairly independent traditions:

- Clark & Brennan's work on **common ground**: collaborators have to coordinate both what they are doing and how they are doing it, and continually update shared understanding. ([CMU School of Computer Science](https://www.cs.cmu.edu/~illah/CLASSDOCS/Clark91.pdf?utm_source=chatgpt.com "GROUNDING IN COMMUNICATION"))
- Klein et al.'s work on **joint activity**, including human-automation teams: joint work requires commitment to the joint activity, mutual predictability, mutual directability, and common ground. ([ResearchGate](https://www.researchgate.net/publication/227992178_Common_Ground_and_Coordination_in_Joint_Activity?utm_source=chatgpt.com "(PDF) Common Ground and Coordination in Joint Activity"))
- Team research from Marks et al. and Salas et al.: teams plan, set goals, coordinate action, monitor progress and one another, provide backup, adapt, communicate, and maintain shared models and trust. ([studylib.net](https://studylib.net/doc/8897423/a-temporally-based-framework-and-taxonomy-of-team-processes?utm_source=chatgpt.com "Team Processes: Framework & Taxonomy"))
- Coordination/CSCW research: collaboration involves managing dependencies between activities and continually "meshing" distributed tasks and efforts when reality diverges from the plan. ([Bishtref](https://bishtref.com/articles/10.1145/174666.174668?utm_source=chatgpt.com "The interdisciplinary study of coordination (1994)"))

When I normalize those, I get something cleaner than our previous list.

### 1. Establish the collaboration


Before useful collaboration can happen:

**Goal** -- What are we trying to achieve together?

**Roles** -- Who is responsible for what?

**Authority** -- What may each participant decide or change?

**Commitment** -- Are both participants actually operating toward the joint goal?

For AI this gives questions like:

> What job has the AI accepted?
> What remains the user's responsibility?
> What can AI do autonomously?

This corresponds quite closely to Klein et al.'s "Basic Compact." ([ResearchGate](https://www.researchgate.net/publication/3454232_Ten_Challenges_for_Making_Automation_a_Team_Player_in_Joint_Human-Agent_Activity?utm_source=chatgpt.com "(PDF) Ten Challenges for Making Automation a \"Team Player\" in Joint Human-Agent Activity"))

### 2. Maintain common ground


Both collaborators need enough shared understanding of:

`goal + current state + relevant context + assumptions + terminology + previous decisions`

And they need mechanisms to repair that understanding:

`explain → acknowledge → clarify → correct`

Clark and Brennan treat this continual grounding as foundational to collective action. ([CMU School of Computer Science](https://www.cs.cmu.edu/~illah/CLASSDOCS/Clark91.pdf?utm_source=chatgpt.com "GROUNDING IN COMMUNICATION"))

For AI, this gives us things such as context awareness, clarification, confirmation, memory of decisions, and making assumptions explicit.

### 3. Coordinate the work


Once the goal is shared, somebody still has to organize the work:

`divide work`

`order steps`

`manage dependencies`

`manage resources`

`handoff`

`wait/synchronize`

`reassign when necessary`

Malone and Crowston's very general definition of coordination is essentially **managing dependencies among activities**. ([Bishtref](https://bishtref.com/articles/10.1145/174666.174668?utm_source=chatgpt.com "The interdisciplinary study of coordination (1994)"))

This suggests that "handoffs" from our previous list are one instance of a larger category: **coordination**.

### 4. Stay mutually observable and directable


Collaborators need enough visibility to answer:

> What are you doing?
> What state are we in?
> Are you stuck?
> Why did you take that direction?

And they need ways to influence one another:

> Stop.
> Try this.
> Change direction.
> Let me handle this part.

Klein et al. call out **mutual predictability** and **mutual directability** as requirements for joint activity. ([ResearchGate](https://www.researchgate.net/publication/227992178_Common_Ground_and_Coordination_in_Joint_Activity?utm_source=chatgpt.com "(PDF) Common Ground and Coordination in Joint Activity"))

This is where several of our AI concepts fit:

**inspectability, controllability, progress visibility, intent visibility.**

They aren't isolated principles. They support a fundamental collaboration requirement: **I need to understand and steer my collaborator sufficiently to work with them.**

### 5. Evaluate and commit contributions


Collaborators contribute things:

`idea`

`interpretation`

`change`

`decision`

`work product`

The other participant may need to:

`inspect → understand → verify → challenge → modify → accept`

This is exactly Teresa's change-set design:

`AI proposes → human evaluates → human changes → AI adapts`

This is where I would place:

- inspectability
- justification
- verifiability
- accept/reject/edit
- provenance/evidence
- explicit commitment

So your earlier **proposal interface** is one concrete implementation of a general collaboration mechanic: **contributions need a review and commitment process when judgment matters.**

### 6. Handle breakdowns and adapt


Real collaboration never follows the plan perfectly.

People misunderstand each other. Evidence changes. Someone cannot do their part. A proposed approach fails.

Good collaboration therefore needs:

`detect breakdown → surface it → diagnose → repair/replan → continue`

This comes through strongly in both CSCW's "articulation work" and teamwork research on adaptability and backup behavior. Schmidt and Bannon argue that real work requires ongoing adjustment because contingencies cannot all be planned in advance. ([Welcome to DTU Research Database](https://orbit.dtu.dk/en/publications/taking-cscw-seriously-supporting-articulation-work/?utm_source=chatgpt.com "Taking CSCW seriously. Supporting articulation work - Welcome to DTU Research Database")) Salas et al. similarly include adaptability and backup behavior among their core teamwork components. ([Sage Journals](https://journals.sagepub.com/doi/pdf/10.1177/1046496405277134 "Is there a "Big Five" in Teamwork? - Eduardo Salas, Dana E. Sims, C. Shawn Burke, 2005"))

For AI that includes clarification, disagreement, correction, escalation, undo, retries, alternative plans, and admitting inability.

I'd therefore reorganize our model into:

```text
COLLABORATION

1. Align
   goal · roles · authority · commitment

2. Ground
   shared context · assumptions · understanding

3. Coordinate
   divide work · dependencies · sequencing · handoffs

4. Observe & direct
   visibility · monitoring · steering

5. Review & commit
   inspect · justify · verify · challenge · accept

6. Repair & adapt
   disagreement · correction · replan · recover
```


Then there are **conditions that make those mechanics work well**, such as trust. Salas et al. explicitly treat mutual trust, shared mental models, and closed-loop communication as coordinating mechanisms supporting teamwork. ([Sage Journals](https://journals.sagepub.com/doi/pdf/10.1177/1046496405277134?utm_source=chatgpt.com "Is there a "Big Five" in Teamwork? - Eduardo Salas, Dana E. Sims, C. Shawn Burke, 2005")) Psychological safety is particularly relevant to human teams because it supports speaking up, admitting mistakes, and learning. ([Sage Journals](https://journals.sagepub.com/doi/pdf/10.2307/2666999?utm_source=chatgpt.com "Psychological Safety and Learning Behavior in Work Teams - Amy Edmondson, 1999")) I wouldn't mix these into the same taxonomy as "handoff" or "review," though.

And this gives us a way to test completeness.

Take any collaborative episode and walk through its lifecycle:

```text
Do we agree what we're doing?
↓
Do we understand the situation similarly?
↓
Do we know who is doing what and how the work connects?
↓
Can we see and influence each other's work?
↓
Can we evaluate and commit contributions?
↓
Can we recover when our understanding or plan breaks?
```


Then bring in another established collaboration framework. If it introduces a behavior that cannot fit anywhere in those six categories, our taxonomy is incomplete. If several independent frameworks stop adding categories and only add submechanisms, we have reached reasonable **conceptual saturation**.

I think this is a better way to verify the set than trying to brainstorm a longer list of principles. It also suggests that **inspectability, controllability, justification, verifiability, reversibility, handoffs, disagreement, etc. are lower-level mechanisms within a smaller collaboration model**, which is likely the structure you're looking for.

## Model


I'd formulate the model like this:

### Collaboration model


1. **Align** -- establish the shared goal, roles, responsibilities, and authority.
    _Why:_ Collaboration breaks down if participants are pursuing different outcomes or don't know who owns which decisions.
2. **Build common ground** -- maintain shared context, terminology, assumptions, and understanding of the current situation.
    _Why:_ Participants can't coordinate well if they are working from different interpretations of the problem.
3. **Coordinate** -- divide work, sequence actions, manage dependencies, and handle handoffs.
    _Why:_ Even when goals are aligned, the work still has to fit together.
4. **Make work observable and directable** -- make actions, state, and intent visible enough for the other participant to monitor and steer.
    _Why:_ A collaborator needs to understand what the other is doing and be able to redirect them when necessary.
5. **Review and commit** -- make important contributions inspectable, challengeable, verifiable, and explicitly accepted or changed.
    _Why:_ Shared work often involves judgment; collaborators need a way to evaluate a contribution before it becomes part of the shared result.
6. **Repair and adapt** -- detect misunderstandings, failures, disagreement, or changed conditions and adjust the plan.
    _Why:_ Collaboration happens under uncertainty, so the ability to recover is part of the normal process.

A compact version:

`align → ground → coordinate → observe/direct → review/commit → repair/adapt`

And I'd treat things like **trust, predictability, reversibility, transparency, and communication quality** as properties that support these mechanics, rather than additional stages.

## Collaboration Patterns

### Shared reasoning loop


**Definition:**

AI helps move the reasoning process forward by forming hypotheses, proposing interpretations or next steps, while the human retains judgment at the points where evaluation, context, or decisions matter.

Typical loop:

`AI proposes → human evaluates → human changes/questions → AI adapts`

That is exactly the pattern your notes extract from Teresa's opportunity-tree example.

**When to use it:**

Use it when the task involves interpretation, ambiguity, or judgment, and where fully delegating the reasoning would reduce the user's understanding or control. Your notes make this distinction explicitly: the aim is to improve the reasoning process while keeping the user engaged in meaningful decisions.

It depends on several collaboration mechanics:

- **Align** -- agree on what you are trying to figure out.
- **Common ground** -- work from the same evidence and assumptions.
- **Observe/direct** -- the human can see and steer the AI's reasoning.
- **Review/commit** -- proposals can be challenged, changed, or accepted.
- **Repair/adapt** -- disagreement updates the next AI move.

So I'd structure it like this:

**Collaboration model** = the general mechanics required for collaboration.

**Shared reasoning loop** = one important interaction pattern built from those mechanics.

Other patterns could sit at the same level, for example:

`delegation` -- AI owns a bounded task

`proposal/review` -- AI proposes, human approves

`shared reasoning` -- both iteratively build an interpretation

`handoff` -- work moves between human and AI at defined points

That separation keeps the model cleaner.

### Teresa Torres Pattern Set


I'd extract the patterns around **how work and judgment move between human and AI**. That gives a cleaner set than listing UI features.

From Teresa's examples, I'd highlight these:

1. **Guided practice**
    `user works → AI evaluates → AI gives feedback → user revises`
    Use when the user benefits from doing the work themselves while receiving expert feedback. Outcome Coach and Interview Coach fit here.
2. **Proposal → review**
    `AI proposes change → human inspects → accepts/edits/rejects → AI updates`
    Use when AI can do substantial work, but the human should retain control over consequential changes. Teresa's opportunity-tree change set is the clearest example.
3. **Shared reasoning**
    `AI forms hypothesis → human contributes evidence/judgment → AI revises → repeat`
    Use when neither side has enough information or judgment to solve the problem alone. Your support-diagnosis example fits this well.
4. **Elicitation**
    `user gives weak signal → AI asks targeted questions → richer understanding emerges`
    Here AI's role is to obtain missing context. Teresa's "I didn't like this article" example fits directly.
5. **Delegation**
    `human assigns bounded task → AI executes → human receives result`
    Use when doing the work itself doesn't need to remain part of the user's reasoning. This is closer to Teresa's administrative-agent examples than to her synthesis tools.
6. **Critique / second opinion**
    `human creates or decides → AI challenges/checks → human decides whether to revise`
    This is related to guided practice, but the emphasis is different: AI is there to find weaknesses, contradictions, missing evidence, or alternatives.

I'd add two patterns from broader collaboration theory, though they are less directly grounded in Teresa's talk:

7. **Handoff**
    `human works → AI takes over a defined part → human resumes`
    Useful when responsibility shifts clearly between collaborators.
8. **Escalation / request for help**
    `AI reaches uncertainty/authority boundary → asks human to decide or intervene`
    A good collaborator knows when it should stop driving.

The important distinction is that these are **patterns**, while things like inspectability, common ground, reversibility, and controllability are **mechanics that make the patterns work well**.

I'd probably keep five as the core set:

`guided practice`

`proposal & review`

`shared reasoning`

`elicitation`

`delegation`

They cover quite different distributions of **initiative, work, and judgment** between human and AI.

## Patterns from the common ground


Yes. I'd derive them from the structure of collaborative work itself, without starting from any existing AI examples.

A collaborative task has a few basic ingredients:

`goal → understand situation → decide what to do → act → observe result → adjust`

And two collaborators differ in four things:

- what they **know**
- what they can **do**
- what they are allowed to **decide**
- how much **judgment** they should exercise

Collaboration patterns then fall out of how those responsibilities are distributed.

### 1. Elicitation


**Condition:** one collaborator has information the other needs.

`AI needs context ← human has context`

So:

`AI asks → human provides evidence → AI updates understanding`

This isn't specifically an AI pattern. A doctor interviewing a patient or an engineer debugging with a customer works the same way.

**Derived from:** asymmetric information.

### 2. Delegation


**Condition:** one collaborator knows the desired result, while the other is better positioned to perform the work.

`human defines task → AI executes → result returned`

The human retains the goal; AI owns a bounded piece of execution.

**Derived from:** asymmetric capability, cost, or available attention.

### 3. Proposal and review


**Condition:** AI can produce a candidate result, while the human retains authority or important judgment.

`AI proposes → human evaluates → accept / change / reject`

For example, changing a configuration, restructuring a plan, or making a diagnosis.

**Derived from:** separation between the ability to generate a solution and authority to commit it.

This is where inspectability and controllability become essential mechanics.

### 4. Critique / coaching


**Condition:** the human should perform the work, but another participant can improve its quality through evaluation.

`human acts → AI observes → AI gives feedback → human adjusts`

The important point is that the work remains with the human.

**Derived from:** separation between performing work and evaluating work.

This covers coaching, reviewing, checking, challenging, and second opinions.

### 5. Shared reasoning


**Condition:** neither collaborator can determine the answer independently because information or judgment is distributed.

`AI hypothesis`

→ `human evidence/judgment`

→ `AI updates`

→ `human challenges`

→ `...`

Neither side merely approves the other's result. The answer emerges through interaction.

**Derived from:** distributed information + distributed judgment.

This is genuine joint problem solving.

### 6. Joint construction


There's another pattern I would distinguish from shared reasoning.

**Condition:** both participants contribute directly to the evolving work product.

`human contribution → AI contribution → human edit → AI extension → ...`

Examples: jointly writing a plan, designing an architecture, constructing a model.

The difference from shared reasoning is the object of collaboration:

- shared reasoning builds **understanding or a decision**
- joint construction builds **an artifact**

**Derived from:** complementary contributions to shared state.

### 7. Handoff / escalation


**Condition:** who should own the next step changes during the work.

`AI works → reaches boundary → human takes over`

or:

`human works → delegates a subproblem → AI works → returns control`

The boundary might come from authority, uncertainty, capability, risk, or access.

**Derived from:** changing responsibility across stages of a task.

This gives us a fairly principled taxonomy:

|Fundamental situation|Collaboration pattern|
|---|---|
|I need information you have|**Elicitation**|
|You can perform work I don't need to perform myself|**Delegation**|
|You can generate, but I should decide|**Proposal & review**|
|I should perform, but you can improve my performance|**Critique / coaching**|
|We each hold part of the reasoning|**Shared reasoning**|
|We both contribute to the same artifact|**Joint construction**|
|Responsibility needs to move between us|**Handoff / escalation**|

I like this more than the earlier list because the patterns aren't arbitrary. Each follows from a particular **distribution of information, capability, judgment, and authority**.

And it gives us a practical way to identify the right AI pattern. For any task, ask:

> **Who has the information? Who should make the judgment? Who can perform the action? Who has authority to commit the result?**

The answers determine the collaboration pattern.

This also clarifies why **"AI collaborator" isn't one interaction model**. Collaboration is the deliberate allocation and movement of these responsibilities between human and AI.
