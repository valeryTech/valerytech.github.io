---
draft: false
toc: true
description: "Derives and compares elicitation, delegation, proposal/review, coaching, shared reasoning, and joint construction, with practitioner examples, failure modes, and responsibility-based guidance for changing modes."
title: "06 Human Ai Collaboration Patterns"
linkTitle: "06 Human Ai Collaboration Patterns"
---
# Human-AI collaboration patterns


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The retained LLM passages distinguish collaboration mechanics from interaction patterns. They preserve the shared reasoning loop, the complete Teresa-attributed discussion, and the later responsibility-based derivation. The sibling [comments]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments" >}}) explain the changing lists and their limits.

The [collaboration model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) retains the opening source and general mechanics. [Sensemaking]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}) discusses understanding as an outcome. The [source redirect]({{< ref "ai/collab-and-joint-work/collab-transfer" >}}) links both parts.

<a id="retained-dialogue"></a>

## Development of the proposal

## Collaboration Patterns

### Shared reasoning loop


**Definition:**

AI helps move the reasoning process forward by forming hypotheses, proposing interpretations or next steps, while the human retains judgment at the points where evaluation, context, or decisions matter.

Typical loop:

`AI proposes -> human evaluates -> human changes/questions -> AI adapts`

That is exactly the pattern the research notes extract from Teresa's opportunity-tree example.

**When to use it:**

Use it when the task involves interpretation, ambiguity, or judgment, and where fully delegating the reasoning would reduce the user's understanding or control. The research notes make this distinction explicitly: the aim is to improve the reasoning process while keeping the user engaged in meaningful decisions.

It depends on several collaboration mechanics:

- **Align** -- agree on what you are trying to figure out.
- **Common ground** -- work from the same evidence and assumptions.
- **Observe/direct** -- the human can see and steer the AI's reasoning.
- **Review/commit** -- proposals can be challenged, changed, or accepted.
- **Repair/adapt** -- disagreement updates the next AI move.

So the proposal is to structure it like this:

**Collaboration model** = the general mechanics required for collaboration.

**Shared reasoning loop** = one important interaction pattern built from those mechanics.

Other patterns could sit at the same level, for example:

`delegation` -- AI owns a bounded task

`proposal/review` -- AI proposes, human approves

`shared reasoning` -- both iteratively build an interpretation

`handoff` -- work moves between human and AI at defined points

That separation keeps the model cleaner.

### Teresa Torres Pattern Set


The proposal is to extract the patterns around **how work and judgment move between human and AI**. That gives a cleaner set than listing UI features.

From Teresa's examples, the proposal is to highlight these:

1. **Guided practice**
    `user works -> AI evaluates -> AI gives feedback -> user revises`
    Use when the user benefits from doing the work themselves while receiving expert feedback. Outcome Coach and Interview Coach fit here.
2. **Proposal -> review**
    `AI proposes change -> human inspects -> accepts/edits/rejects -> AI updates`
    Use when AI can do substantial work, but the human should retain control over consequential changes. Teresa's opportunity-tree change set is the clearest example.
3. **Shared reasoning**
    `AI forms hypothesis -> human contributes evidence/judgment -> AI revises -> repeat`
    Use when neither side has enough information or judgment to solve the problem alone. Your support-diagnosis example fits this well.
4. **Elicitation**
    `user gives weak signal -> AI asks targeted questions -> richer understanding emerges`
    Here AI's role is to obtain missing context. Teresa's "I didn't like this article" example fits directly.
5. **Delegation**
    `human assigns bounded task -> AI executes -> human receives result`
    Use when doing the work itself doesn't need to remain part of the user's reasoning. This is closer to Teresa's administrative-agent examples than to her synthesis tools.
6. **Critique / second opinion**
    `human creates or decides -> AI challenges/checks -> human decides whether to revise`
    This is related to guided practice, but the emphasis is different: AI is there to find weaknesses, contradictions, missing evidence, or alternatives.

The proposal is to add two patterns from broader collaboration theory, though they are less directly grounded in Teresa's talk:

7. **Handoff**
    `human works -> AI takes over a defined part -> human resumes`
    Useful when responsibility shifts clearly between collaborators.
8. **Escalation / request for help**
    `AI reaches uncertainty/authority boundary -> asks human to decide or intervene`
    A good collaborator knows when it should stop driving.

The important distinction is that these are **patterns**, while things like inspectability, common ground, reversibility, and controllability are **mechanics that make the patterns work well**.

One tentative proposal is to keep five as the core set:

`guided practice`

`proposal & review`

`shared reasoning`

`elicitation`

`delegation`

They cover quite different distributions of **initiative, work, and judgment** between human and AI.

## Patterns from the common ground


The proposal is to derive them from the structure of collaborative work itself, without starting from any existing AI examples.

A collaborative task has a few basic ingredients:

`goal -> understand situation -> decide what to do -> act -> observe result -> adjust`

And two collaborators differ in four things:

- what they **know**
- what they can **do**
- what they are allowed to **decide**
- how much **judgment** they should exercise

Collaboration patterns then fall out of how those responsibilities are distributed.

### 1. Elicitation


**Condition:** one collaborator has information the other needs.

`AI needs context <- human has context`

So:

`AI asks -> human provides evidence -> AI updates understanding`

This isn't specifically an AI pattern. A doctor interviewing a patient or an engineer debugging with a customer works the same way.

**Derived from:** asymmetric information.

### 2. Delegation


**Condition:** one collaborator knows the desired result, while the other is better positioned to perform the work.

`human defines task -> AI executes -> result returned`

The human retains the goal; AI owns a bounded piece of execution.

**Derived from:** asymmetric capability, cost, or available attention.

### 3. Proposal and review


**Condition:** AI can produce a candidate result, while the human retains authority or important judgment.

`AI proposes -> human evaluates -> accept / change / reject`

For example, changing a configuration, restructuring a plan, or making a diagnosis.

**Derived from:** separation between the ability to generate a solution and authority to commit it.

This is where inspectability and controllability become essential mechanics.

### 4. Critique / coaching


**Condition:** the human should perform the work, but another participant can improve its quality through evaluation.

`human acts -> AI observes -> AI gives feedback -> human adjusts`

The important point is that the work remains with the human.

**Derived from:** separation between performing work and evaluating work.

This covers coaching, reviewing, checking, challenging, and second opinions.

### 5. Shared reasoning


**Condition:** neither collaborator can determine the answer independently because information or judgment is distributed.

`AI hypothesis`

-> `human evidence/judgment`

-> `AI updates`

-> `human challenges`

-> `...`

Neither side merely approves the other's result. The answer emerges through interaction.

**Derived from:** distributed information + distributed judgment.

This is genuine joint problem solving.

### 6. Joint construction


Another proposed pattern can be distinguished from shared reasoning.

**Condition:** both participants contribute directly to the evolving work product.

`human contribution -> AI contribution -> human edit -> AI extension -> ...`

Examples: jointly writing a plan, designing an architecture, constructing a model.

The difference from shared reasoning is the object of collaboration:

- shared reasoning builds **understanding or a decision**
- joint construction builds **an artifact**

**Derived from:** complementary contributions to shared state.

### 7. Handoff / escalation


**Condition:** who should own the next step changes during the work.

`AI works -> reaches boundary -> human takes over`

or:

`human works -> delegates a subproblem -> AI works -> returns control`

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

The LLM response favors this over the earlier list because the patterns aren't arbitrary. Each follows from a particular **distribution of information, capability, judgment, and authority**.

And it gives us a practical way to identify the right AI pattern. For any task, ask:

> **Who has the information? Who should make the judgment? Who can perform the action? Who has authority to commit the result?**

The answers determine the collaboration pattern.

This also clarifies why **"AI collaborator" isn't one interaction model**. Collaboration is the deliberate allocation and movement of these responsibilities between human and AI.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Practitioner and research synthesis


The following retained report passages extend the earlier dialogue above with a terminology comparison and complete pattern catalog. The report separates six modes from handoff and escalation as transitions, while the earlier lists remain intact. The [report summary and bibliography]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}) and [pattern comments]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments" >}}#later-report-taxonomy) explain the relation.

## A first-principles model and the vocabulary practitioners actually use


The cleanest synthesis is to separate **collaboration modes**, **transition patterns**, and **collaboration mechanics**. Existing literature often mixes these levels, which is one reason the vocabulary appears fragmented. Gomez and colleagues explicitly note the lack of common terminology; their systematic review of 105 empirical AI-assisted decision-making papers identified seven interaction sequences rather than one canonical collaboration model. [^3]

### Comparison of the first-principles taxonomy with practitioner terminology


| First-principles pattern | Fundamental condition | Terms found in research/practice | Relationship to your term | Representative sources |
|---|---|---|---|---|
| **Elicitation** | AI lacks information/context the human possesses | *AI-guided dialogic user engagement*, clarification, disambiguation, grounding, request for information | Strong match | Gomez et al.; Clark & Brennan; Microsoft HAX; Anthropic Claude Code [^3][^7][^2][^12] |
| **Delegation** | Human specifies a goal; AI can perform bounded work | delegation, automation, AI-led work, agent, background task | Direct match and established term | Gomez et al.; Lubars & Tan; OpenAI Deep Research; GitHub coding agent [^3][^13][^14][^15] |
| **Proposal & review** | AI can generate a candidate, but human judgment/authority should govern commitment | review and approve, supervision, plan/review, diff review, AI-first or AI-follow assistance | Strong design pattern; less consistently named academically | Google PAIR; Microsoft HAX; OpenAI Codex; Anthropic Claude Code [^1][^2][^9][^10] |
| **Critique / coaching** | Human performs or owns the work; AI evaluates it | AI-follow assistance, secondary assistance, reviewer, feedback, tutor/coach | Useful higher-level synthesis; literature often separates feedback, review, and tutoring | Gomez et al.; OpenAI Study Mode; GitHub Copilot review; Anthropic Code Review [^3][^16][^17][^18] |
| **Shared reasoning** | Information and/or judgment is distributed across both participants | mixed-initiative interaction, interactive adjustment, dialogic interaction, joint problem solving | Strong conceptual pattern, but no universally accepted label | Horvitz; Gomez et al.; Klein et al. [^6][^3][^5] |
| **Joint construction** | Both parties directly contribute to an evolving shared artifact | co-creation, co-creativity, mixed-initiative co-creation, collaborative editing | Direct match with co-creative HCI literature | COFI; OpenAI Canvas; Codex [^19][^20][^9] |
| **Handoff / escalation** | The correct owner of the next step changes during the task | transfer/take back control, escalation, intervention, clarification stop, human review gate | Better treated as a **transition between modes** | Google PAIR; Klein et al.; Anthropic autonomy study; GitHub coding agent [^1][^5][^12][^21] |

The academic taxonomy from Gomez et al. is particularly useful as an external check. It found **AI-first assistance, AI-follow assistance, secondary assistance, request-driven assistance, AI-guided dialogic engagement, user-guided interactive adjustments, and delegation**. In the 131 interaction sequences coded from 105 papers, simple AI-first and AI-follow interactions dominated, while richer interactive patterns were substantially less common. Their conclusion is close to the design problem here: systems described as "collaborative" often amount to one participant producing an answer and the other receiving it. [^3]

That taxonomy is narrower than ours because it specifically examines **decision-support interactions**. It does not need a full-fledged "joint construction" category because co-writing or co-designing artifacts is outside much of its scope. Conversely, the co-creativity literature explicitly treats human and AI as contributors to a shared creative product and studies initiative, contribution, and communication between them. [^19][^22]

The human-automation tradition gives another useful test. Klein, Woods, Bradshaw, Hoffman, and Feltovich argue that meaningful joint activity requires a basic commitment to coordinate, plus **mutual predictability, mutual directability, and maintenance of common ground**. These are not collaboration *patterns*; they are requirements that any pattern must satisfy to behave like real joint work. [^5][^23]

Clark and Brennan supply an even deeper communication layer. Collaborative communication requires participants to establish enough common ground for the current purpose; contributions effectively involve presenting something and obtaining evidence that it was understood sufficiently. Common ground is continually updated rather than established once at the start. [^7]

This leads to a useful three-layer model:

```mermaid
flowchart TD
    A["Collaboration mode<br/>Who contributes information, work and judgment?"]
    B["Transition pattern<br/>When and why does responsibility move?"]
    C["Collaboration mechanics<br/>How do we stay coordinated and correct?"]

    A --> B
    B --> C
```


**Mode:** elicitation, delegation, proposal/review, critique/coaching, shared reasoning, joint construction.

**Transition:** handoff, escalation, takeover, delegation back, request for clarification.

**Mechanics:** common ground, role clarity, observability, directability, inspectability, evidence, verification, feedback, commitment controls, reversibility, memory, repair.

This hierarchy is more stable than treating every useful AI UX behavior as an equally sized "pattern."

## The collaboration pattern catalog


One product can move through several patterns in a single workflow. A coding agent, for example, may start with **elicitation**, move into **delegation**, present its plan using **proposal/review**, perform implementation, receive **critique**, and finally **handoff** a pull request to a human reviewer. Current agent products increasingly operate this way. [^10][^15]

**Elicitation -- get the missing information from the collaborator who has it.**

**Definition.** Elicitation applies when one participant cannot make progress reliably because another participant possesses relevant goals, constraints, observations, preferences, or domain knowledge. The collaboration therefore advances by actively reducing an information asymmetry:

`AI asks -> human contributes context -> AI updates -> possibly asks again`

This is more than "asking clarifying questions." In Clark and Brennan's terms, it is part of **grounding**: determining whether the parties' shared understanding is sufficient for the present task and repairing it when necessary. [^7]

**Practitioner terminology.** Gomez et al. call a close variant **AI-guided dialogic user engagement**: the AI asks iteratively for information needed to reach a decision. Microsoft HAX's related guideline is to "scope services when in doubt" and disambiguate user intent rather than confidently act on an uncertain interpretation. Modern agent literature frequently uses *clarification*, *ask the user*, or *pause for clarification*. [^3][^2][^12]

**Product examples.** ChatGPT Study Mode starts by using guiding questions calibrated to the learner's goals and skill level rather than simply giving a finished answer. [^16] Anthropic's 2026 analysis of deployed Claude Code sessions found that on complex tasks Claude itself paused to seek clarification more frequently than users interrupted it, illustrating agent-initiated elicitation as an active oversight mechanism. [^12] Microsoft's early LookOut mixed-initiative system was designed to infer user intentions and decide when dialog or intervention was warranted rather than operating as a purely command-driven tool. [^6]

**Key mechanics.** Elicitation depends on common ground, explicit assumptions, visibility into what information is missing, economical questioning, memory of answers already supplied, and acknowledgment that the new information changed the system's understanding. Microsoft HAX recommends remembering recent interactions, while Google's PAIR guidance advises showing users how feedback affects subsequent system behavior. [^2][^1]

**Common failure modes.** The AI can over-question users, ask for facts it already has, force the user to translate their situation into the AI's ontology, collect unnecessary sensitive context, or use questions merely to confirm an early hypothesis. A superficially conversational interface can therefore increase interaction cost without improving common ground. The grounding criterion should be *sufficient understanding for the current purpose*, not maximal information collection. [^7][^8]

**How to verify it.** Seed tasks with information that is essential but unavailable to the model. Test whether the system notices the gap, asks for the *right* missing information, correctly incorporates the answer, and stops asking once sufficient common ground exists. Track clarification success, repeated-question rate, unnecessary-question rate, task recovery after misunderstanding, and whether users can correct the system's inferred assumptions. These tests operationalize HAX's correction/disambiguation guidance and the grounding model. [^2][^7]

**Delegation -- give a collaborator bounded responsibility for execution.**

**Definition.** Delegation applies when the human has an objective but does not need to personally perform some part of the work:

`human defines outcome/boundary -> AI plans and executes -> AI reports result`

Delegation therefore transfers **execution responsibility**, not necessarily final authority. The distinction is crucial: "the AI did the task" does not imply "the AI had authority to commit every consequential action." Human-AI delegation research explicitly distinguishes levels such as full automation, AI-leading with human assistance, human-leading with AI assistance, and no AI. [^13]

**Practitioner terminology.** *Delegation* is already an academic term and appears directly in the Gomez taxonomy. Product teams more often say *agent*, *background task*, *assign an issue*, *run autonomously*, or *deep research*. [^3][^14]

**Product examples.** OpenAI Deep Research is explicitly designed to independently search, reason across, and synthesize many sources after receiving a research task from the user. [^14] GitHub's Copilot coding agent can be assigned an issue, inspect the repository, develop a plan, make changes, test them, open a pull request, and subsequently respond to review feedback. [^15] Claude Code also supports more autonomous modes; Anthropic's Routines run as autonomous cloud sessions within resources and connectors explicitly scoped by the user or organization. [^24]

**Key mechanics.** Delegation requires explicit scope, success criteria, tool and data boundaries, progress observability, interruptibility, outcome verification, and clear authority limits. For consequential actions, permissions should ideally be based on capability and consequence rather than indiscriminate approval prompts. Anthropic's sandboxing work illustrates the principle of defining a boundary inside which the agent can work more freely, rather than asking for every action individually. [^25]

**Common failure modes.** Under-specified goals cause an agent to optimize the wrong thing; hidden intermediate actions can create side effects; long-running work can drift from intent; too many confirmations lead to approval fatigue; too few leave users unable to intervene. Anthropic reports that Claude Code users approved about 93% of permission prompts before the company introduced a more automated permission architecture--an illustration of why "human approval on every action" can degenerate into ritual rather than meaningful oversight. [^26] Anthropic has also documented a long-horizon agent failure mode in which implementation appeared complete even though end-to-end testing was insufficient. [^27]

**How to verify it.** Evaluate *end-to-end outcome completion*, not merely plausible intermediate output. Include hidden side-effect tests, permission-boundary tests, interruption tests, partial-failure recovery, and independent verification of completion. Compare not only AI-only success but also human time saved, review burden, intervention frequency, and undetected failure rate. Delegation studies suggest that information about both task conditions and AI capability is important for people to allocate work effectively. [^28][^13]

**Proposal & review -- let AI do substantial cognitive or production work without silently committing the result.**

**Definition.** Here the AI has enough capability to construct a candidate, but the human retains meaningful evaluative judgment or authority:

`current state -> AI proposal -> inspect/evaluate -> accept/edit/reject -> committed state`

This is the pattern closest to the **proposal interface** we discussed earlier. Its essence is not generic transparency. It is a **commitment protocol for collaborative work**.

**Practitioner terminology.** Google PAIR uses the language **"let users supervise automation"** and specifically recommends enabling users to review and approve options. Microsoft HAX calls for efficient correction, explanations of why the AI acted, visibility into consequences, and controls. Coding-agent teams use concrete terms such as *plan mode*, *diff*, *review changes*, and *pull request*. [^1][^2][^10]

**Product examples.** The Codex app exposes an agent's changes in a thread, lets users inspect and comment on the diff, and lets them open the work in an editor for manual changes. [^9] Claude Code's recommended workflow separates exploration and planning from implementation; users can open and directly edit a proposed plan before allowing implementation. [^10] GitHub's coding-agent workflow places generated changes in pull requests and requires independent human review rather than allowing the agent to approve and merge its own work. [^21] Google PAIR's supervision pattern similarly recommends review/approval and warns against automation that provides neither choice nor undo. [^1]

**Key mechanics.** The minimum viable set is:

`inspectability + editability + explicit acceptance`

For higher-consequence work, add:

`evidence/provenance + justification + verification + reversibility + authority boundary`

This distinction is important. **Inspectability** answers "what would change?" **Justification** answers "why is this proposed?" **Verifiability** answers "what evidence lets me determine whether it is correct?" **Controllability** answers "what can I do about it?" They should not be collapsed into one vague property called explainability. Google similarly distinguishes explanation, trust calibration, data-source visibility, control, and supervision. [^29][^1]

**Common failure modes.** Proposal interfaces can create *rubber-stamping*: a human sees an impressive-looking candidate and clicks approve without independently judging it. AI-first decision support is particularly susceptible to anchoring and overreliance; AI-follow designs can reduce initial anchoring but introduce confirmation effects and additional cognitive effort. [^3] A huge diff can technically be "inspectable" while functionally impossible to review. Approval is therefore not proof that meaningful human oversight occurred.

**How to verify it.** Deliberately inject plausible errors into proposals and measure whether users detect them. Test different proposal sizes and representations. Measure review time, detection rate, false acceptance, edit frequency, evidence opening, and ability to explain what will change before committing. The relevant success criterion is not "we provided an approval button," but **whether the interface enables appropriately calibrated acceptance and rejection**. Microsoft's appropriate-reliance research explicitly frames the design problem as avoiding both overreliance and underreliance. [^11]

**Critique / coaching -- keep performance with the human, give evaluation to AI.**

**Definition.** In this mode, the human remains the primary actor or author while AI plays an evaluative role:

`human attempts -> AI observes/evaluates -> feedback -> human revises`

A **critic** optimizes the work product; a **coach** additionally optimizes the person's future ability. That distinction is worth preserving. A system that rewrites a student's answer may improve the artifact while undermining the learning goal; a coach intentionally keeps meaningful work with the learner.

**Practitioner terminology.** Decision-support research's **AI-follow assistance** is a close relative: the human makes an initial judgment before seeing AI advice and may then revise. *Secondary assistance* provides supplementary evidence rather than a direct answer. Product terminology includes *code review*, *inline feedback*, *study mode*, *reviewer*, and *coach*. [^3]

**Product examples.** ChatGPT Study Mode is explicitly designed to use guiding questions and feedback to help students build understanding rather than simply finish the task for them. [^16] GitHub Copilot code review identifies issues and suggests fixes but its review does not itself constitute a required human approval or block a merge, preserving a distinct reviewer role. [^17] Anthropic's Code Review similarly posts inline findings tagged by severity but does not approve or block the pull request, leaving the existing human review workflow intact. [^18] ChatGPT Canvas supports inline feedback while leaving users able to directly edit and restore their own writing or code. [^20]

**Key mechanics.** Critique requires clear evaluation criteria, localization of the issue, rationale or evidence, actionable feedback, user ownership of revision, and a way to challenge the critique. Coaching additionally requires calibration to the user's skill and goal, progressive assistance, and feedback that promotes learning rather than merely fixing the immediate artifact. [^16][^29]

**Common failure modes.** AI critique can be confidently wrong, generic, overwhelming, or biased toward stylistic conformity. It can also become disguised delegation: the "coach" eventually does the entire task. Conversely, excessive friction designed to force learning can frustrate users whose real objective is simply task completion. The intended outcome--better artifact versus stronger human capability--therefore has to be explicit.

**How to verify it.** Seed known defects and measure critique precision/recall; track whether the user can identify and correct issues after feedback; for genuine coaching, measure transfer to a later unassisted task rather than only improvement of the AI-assisted artifact. Compare against direct-answer conditions. Study-design research around cognitive forcing likewise shows that interventions intended to make users think can reduce overreliance while also carrying usability costs, so both quality and user burden need measurement. [^30]

**Shared reasoning -- distribute interpretation and judgment across both collaborators.**

**Definition.** Shared reasoning is appropriate when neither participant should simply produce an answer for the other because relevant information, hypotheses, or judgment are distributed:

`AI hypothesis -> human evidence/judgment -> AI revises -> human challenges -> ... -> joint conclusion`

The object being built is primarily an **understanding, diagnosis, plan, or decision**, not an artifact.

**Practitioner terminology.** The closest established HCI term is **mixed-initiative interaction**. Horvitz described mixed-initiative interfaces as coupling automated services with direct manipulation and studying when the system should intervene, query, or act. Gomez et al.'s *user-guided interactive adjustments*, *request-driven assistance*, and *dialogic engagement* each capture pieces of the same space. [^6][^3]

**Product and research examples.** Microsoft's LookOut is an early mixed-initiative case: it inferred likely intent, determined when dialog was useful, and selected when to intervene or act rather than following a fixed turn structure. [^6] Study Mode creates a more contemporary reasoning loop in which AI questions and scaffolding respond to the learner's evolving understanding. [^16] OpenAI's 2026 descriptions of advanced research use report researchers using ChatGPT iteratively to critique manuscripts, stress-test arguments, propose analyses, and work across code and notes rather than simply requesting a one-shot answer; that is a product-team example of a system being framed as a research partner. [^31]

**Key mechanics.** Shared reasoning has the strongest need for **common ground, explicit assumptions, turn-level responsiveness, disagreement support, hypothesis revision, provenance, and state continuity**. Both parties need to be able to introduce information and redirect the reasoning. Klein's concept of mutual directability is especially relevant: if the human can speak but cannot meaningfully alter the agent's trajectory, the interaction is conversational without being truly collaborative. [^5]

Modern human-agent communication research reinforces this. Bansal and colleagues organize agent communication problems around what the agent must tell the user, what the user must tell the agent, and cross-cutting challenges such as helping people verify behavior, maintaining consistent behavior, choosing the right level of detail, and deciding which prior interactions matter. [^32]

**Common failure modes.** AI can anchor the conversation with its first hypothesis, cause premature convergence, simulate agreement instead of exposing uncertainty, forget earlier constraints, or overwhelm the human with persuasive language. The human can also overcorrect a valid AI hypothesis. Fluency and turn-taking alone therefore do not demonstrate shared reasoning.

**How to verify it.** Use problems in which the human and AI each possess **complementary information** and neither can solve the problem alone. Compare joint performance with human-only, AI-only, AI-first, and AI-follow baselines. Introduce contradictory evidence midstream and test whether the pair revises. Measure uncorrected misunderstandings, hypothesis diversity, grounding repairs, evidence use, and whether user interventions actually change subsequent reasoning. That is a stronger test of collaboration than conversational satisfaction alone. [^3][^23]

**Joint construction -- contribute together to a persistent shared artifact.**

**Definition.** Joint construction differs from shared reasoning primarily in the object of collaboration:

`shared artifact state -> human contribution <-> AI contribution -> persistent revised state`

Both participants can directly shape a document, design, model, codebase, image, plan, or other artifact.

**Practitioner terminology.** HCI literature typically calls this **co-creation**, **human-AI co-creativity**, or **mixed-initiative co-creation**. The COFI framework explicitly studies human and AI collaborating as partners around a shared creative product and treats interaction dynamics as a first-class design concern. [^19]

**Product examples.** ChatGPT Canvas creates a shared writing/coding workspace in which the user can edit directly, select specific material for AI attention, request transformations, receive feedback, and restore earlier versions. [^20] Codex supports a related software-development form: the agent alters code, the user inspects and comments on diffs, and either participant can continue editing. [^9] GitHub's coding-agent workflow similarly lets an agent create changes and a human reviewer request revisions, with the agent iterating before merge. [^15]

**Key mechanics.** Joint construction requires a shared state, clear contribution boundaries, local rather than hidden global edits, version history, provenance of changes, selective acceptance, collision handling, direct manipulation by the human, and state recovery. Canvas's version restoration and direct editing are simple but important examples of this principle. [^20]

**Common failure modes.** AI may silently overwrite intentional human choices, make broad changes when only a local intervention was requested, homogenize voice, or create ambiguity about who authored or approved a consequential statement. Context can also drift as the artifact grows. "We both typed into the same document" is not sufficient; each participant needs to understand how the other's contribution changed the shared object.

**How to verify it.** Test intent preservation: ask AI to change one dimension while preserving others and measure collateral changes. Test undo, version comparison, selective acceptance, conflicting edits, and long-session state consistency. Observe whether users can accurately identify the current shared state and whether they can recover from an unwanted AI contribution. Artifact quality should be measured alongside user agency and revision cost.

**Handoff / escalation -- change who owns the next step.**

The proposal is to **not** put this at exactly the same conceptual level as the six patterns above. A handoff is a **transition in responsibility**:

`mode A -> boundary encountered -> communicate state -> transfer responsibility -> mode B`

An AI can hand off from delegation into proposal/review, from shared reasoning into a human decision, or from autonomous execution into human recovery.

**Practitioner terminology.** Google PAIR explicitly recommends **giving control back when automation fails** and designing a path for the user to continue manually. [^1][^33] Anthropic describes a deployed evolution from step-by-step approval toward **monitoring and intervening**: experienced Claude Code users auto-approve more actions but also interrupt the agent more frequently. Anthropic argues that effective oversight therefore requires more than placing a human in every approval chain. [^12]

**Product examples.** Claude Code pauses for clarification when it believes human input is needed, effectively initiating its own handoff of judgment. [^12] GitHub coding agents perform implementation but return work through a pull request that requires independent human review before merging. [^21] Google's PAIR guidance recommends manual takeover after automation failure. [^1] Modern agent security designs similarly preserve human approval for classes of consequential operations rather than treating every tool call as equally delegable. [^34]

**Key mechanics.** Good handoff needs a trigger, clear reason, state summary, unresolved questions, transfer of relevant context, clear authority after transfer, immediate directability, and a route to return responsibility later. The recipient should not have to reconstruct what the other collaborator has been doing.

**Common failure modes.** The classic danger is the **out-of-the-loop handoff**: the human is asked to take over precisely when the situation is difficult, after being uninvolved long enough to have poor situational awareness. The opposite failure is excessive escalation, where autonomy provides little benefit. Approval fatigue is a third failure: frequent handoffs become automatic clicks rather than genuine judgment. Anthropic's deployed permission research provides a contemporary example of this tradeoff. [^26][^12]

**How to verify it.** Simulate uncertainty, unavailable tools, conflicting instructions, high-consequence actions, and partial failures. Measure correct escalation rate, unnecessary escalation, late escalation, takeover time, situation awareness immediately after transfer, and whether humans know what has already happened. Then test the reverse transition: can users return responsibility to the AI without losing context?

The report's [general mechanics]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}#research-synthesis-of-collaboration-mechanics) remain with the collaboration model. The following selection guidance continues the original report without changing its decision diagram or design worksheet.

## Choosing the right pattern


The most reliable pattern-selection heuristic is to begin with **responsibility allocation**, not the AI capability.

Ask five questions:

| Question | What it diagnoses | Pattern it tends to suggest |
|---|---|---|
| **Who has necessary information?** | Information asymmetry | If the human has it and AI needs it -> **elicitation** |
| **Who should perform the work?** | Execution ownership | If AI can own a bounded task -> **delegation** |
| **Who should make or authorize the judgment?** | Decision authority | If AI can generate but human should commit -> **proposal & review** |
| **Who needs to develop capability by doing the work?** | Learning/skill objective | Human works, AI evaluates -> **critique/coaching** |
| **Is the value distributed across both parties?** | Complementarity | Distributed judgment -> **shared reasoning**; distributed artifact contribution -> **joint construction** |

Then ask a sixth question continuously:

> **Has something changed such that responsibility should move?**

That invokes **handoff/escalation**.

```mermaid
flowchart TD
    A["What progress is the user trying to make?"] --> B{"AI lacks essential<br/>human context?"}
    B -- Yes --> E["Elicitation"]
    B -- No --> C{"Should AI own<br/>bounded execution?"}

    C -- Yes --> D{"May AI commit<br/>the result itself?"}
    D -- Yes --> G["Delegation"]
    D -- No --> H["Delegation + Proposal & Review"]

    C -- No --> I{"Should the human<br/>do the work to learn<br/>or retain judgment?"}
    I -- Yes --> J["Critique / Coaching"]
    I -- No --> K{"Are both parties<br/>contributing judgment?"}

    K -- Yes --> L["Shared Reasoning"]
    K -- No --> M["Joint Construction<br/>if the shared object is an artifact"]

    E --> N["Monitor for handoff / escalation"]
    G --> N
    H --> N
    J --> N
    L --> N
    M --> N
```


There are four additional heuristics worth making explicit.

**Use the least autonomous pattern that delivers the intended value when consequences are difficult to reverse.** Google PAIR recommends balancing automation with risk and gradually increasing automation where appropriate; its guidance explicitly discourages removing user control in higher-stakes contexts. [^1]

**Do not require human judgment where there is no meaningful judgment to exercise.** A confirmation box on every low-risk action can create approval fatigue rather than oversight. Anthropic's permission studies and sandboxing work provide concrete evidence of this tension in deployed coding agents. [^26][^25]

**Do not delegate work that the human must perform in order to achieve the actual outcome.** If the outcome is "learn to diagnose this class of problem," doing the diagnosis for the user defeats the objective; coaching is the more appropriate pattern. Study Mode is an explicit contemporary example of designing for learning rather than mere completion. [^16]

**Choose the AI's initiative level deliberately.** Sometimes AI should wait to be invoked; sometimes it should suggest; sometimes it should proactively interrupt; sometimes it should work autonomously until it reaches a boundary. Mixed-initiative research has treated the timing and value of intervention as a first-class design problem for decades, and current agent products are rediscovering the same problem at greater scale. [^6][^12]

A concise design worksheet is therefore:

> **Goal:** What broader outcome are we jointly pursuing?
> **Information:** What does each side know?
> **Capability:** What can each side do well?
> **Judgment:** Where is human interpretation genuinely valuable?
> **Authority:** What may AI commit without approval?
> **Learning:** Does the human need to perform the work to develop capability?
> **Risk:** What happens if the AI is wrong?
> **Recovery:** Can the action be inspected, interrupted, reversed, or handed off?
> **Pattern:** Which allocation of work follows from those answers?

## Citation definitions for the collaboration-pattern report


The definitions below are local copies of the original entries cited in the imported passages. They are added reference support, separate from the moved source text. The [complete original bibliography]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}#references) remains in the synthesis note. The sources and claims have not been independently checked during reassembly.

[^1]: Google PAIR. "[Feedback + Control](https://pair.withgoogle.com/guidebook-v2/chapter/feedback-controls/)." *People + AI Guidebook*.

[^2]: Microsoft. "[Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/)." *HAX Toolkit*. The guidelines originate in Amershi et al., CHI 2019.

[^3]: Gomez, Catalina, Sue Min Cho, Shichang Ke, Chien-Ming Huang, and Mathias Unberath. "[Human-AI collaboration is not very collaborative yet: a taxonomy of interaction patterns in AI-assisted decision making from a systematic review](https://doi.org/10.3389/fcomp.2024.1521066)." *Frontiers in Computer Science* 6 (2025), 1521066.

[^5]: Klein, Gary, David D. Woods, Jeffrey M. Bradshaw, Robert R. Hoffman, and Paul J. Feltovich. "[Ten Challenges for Making Automation a 'Team Player' in Joint Human-Agent Activity](https://doi.org/10.1109/MIS.2004.74)." *IEEE Intelligent Systems* 19, no. 6 (2004): 91-95.

[^6]: Horvitz, Eric. "[Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/)." In *Proceedings of CHI '99* (1999): 159-166. DOI: 10.1145/302979.303030.

[^7]: Clark, Herbert H., and Susan E. Brennan. "[Grounding in Communication](https://doi.org/10.1037/10096-006)." In *Perspectives on Socially Shared Cognition*, edited by L. B. Resnick, J. M. Levine, and S. D. Teasley (1991): 127-149.

[^8]: Google PAIR. "[People + AI Guidebook -- Chapters](https://pair.withgoogle.com/guidebook-v2/chapters)."

[^9]: OpenAI. "[Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/)."

[^10]: Anthropic. "[Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)."

[^11]: Microsoft Research. "[Appropriate Reliance Research Initiative](https://www.microsoft.com/en-us/research/articles/appropriate-reliance-research-initiative/)." 2024.

[^12]: Anthropic. "[Measuring AI agent autonomy in practice](https://www.anthropic.com/research/measuring-agent-autonomy)." 2026.

[^13]: Lubars, Brian, and Chenhao Tan. "[Ask Not What AI Can Do, But What AI Should Do: Towards a Framework of Task Delegability](https://papers.neurips.cc/paper/8301-ask-not-what-ai-can-do-but-what-ai-should-do-towards-a-framework-of-task-delegability)." *Advances in Neural Information Processing Systems 32* (NeurIPS 2019).

[^14]: OpenAI. "[Introducing deep research](https://openai.com/index/introducing-deep-research/)."

[^15]: GitHub Docs. "[Get started with Copilot agents on GitHub](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/overview)."

[^16]: OpenAI. "[ChatGPT Study Mode -- FAQ](https://help.openai.com/en/articles/11780217-chatgpt-study-mode-faq)."

[^17]: GitHub Docs. "[Using GitHub Copilot code review on GitHub](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/copilot-code-review)."

[^18]: Anthropic. "[Code Review](https://code.claude.com/docs/en/code-review)." *Claude Code Docs*.

[^19]: Rezwana, Jeba, and Mary Lou Maher. "[Designing Creative AI Partners with COFI: A Framework for Modeling Interaction in Human-AI Co-Creative Systems](https://doi.org/10.1145/3519026)." *ACM Transactions on Computer-Human Interaction* 30, no. 5 (2023), Article 67.

[^20]: OpenAI. "[Introducing canvas](https://openai.com/index/introducing-canvas/)."

[^21]: GitHub Docs. "[Review output from Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output)."

[^22]: Rezwana, Jeba, and Mary Lou Maher. "[Understanding User Perceptions, Collaborative Experience and User Engagement in Different Human-AI Interaction Designs for Co-Creative Systems](https://arxiv.org/abs/2204.13217)." arXiv:2204.13217 (2022).

[^23]: Klein, Gary, Paul J. Feltovich, Jeffrey M. Bradshaw, and David D. Woods. "[Common Ground and Coordination in Joint Activity](https://doi.org/10.1002/0471739448.ch6)." In *Organizational Simulation*, edited by W. B. Rouse and K. R. Boff (2005).

[^24]: Anthropic. "[Automate work with routines](https://code.claude.com/docs/en/routines)." *Claude Code Docs*.

[^25]: Anthropic. "[Beyond permission prompts: making Claude Code more secure and autonomous](https://claude.com/blog/beyond-permission-prompts-making-claude-code-more-secure-and-autonomous)." 2025.

[^26]: Anthropic. "[How we built Claude Code auto mode: a safer way to skip permissions](https://www.anthropic.com/engineering/claude-code-auto-mode)." 2026.

[^27]: Anthropic. "[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)." 2025.

[^28]: Spitzer, Philipp, Joshua Holstein, Patrick Hemmer, Michael Vössing, Niklas Kühl, Dominik Martin, and Gerhard Satzger. "[Human Delegation Behavior in Human-AI Collaboration: The Effect of Contextual Information](https://arxiv.org/abs/2401.04729)." arXiv:2401.04729 (2024).

[^29]: Google PAIR. "[Explainability + Trust](https://pair.withgoogle.com/guidebook-v2/chapter/explainability-trust/)." *People + AI Guidebook*.

[^30]: Buçinca, Zana, Maja Barbara Malaya, and Krzysztof Z. Gajos. "[To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-Assisted Decision-Making](https://doi.org/10.1145/3449287)." *Proceedings of the ACM on Human-Computer Interaction* 5, CSCW1 (2021).

[^31]: OpenAI. "[Introducing GPT-5.5](https://openai.com/index/introducing-gpt-5-5/)." 2026.

[^32]: Bansal, Gagan, Jennifer Wortman Vaughan, Saleema Amershi, Eric Horvitz, Adam Fourney, Hussein Mozannar, Victor Dibia, and Daniel S. Weld. "[Challenges in Human-Agent Communication](https://www.microsoft.com/en-us/research/publication/human-agent-interaction-challenges/)." Microsoft Research Technical Report MSR-TR-2024-53 (2024).

[^33]: Google PAIR. "[Errors + Graceful Failure](https://pair.withgoogle.com/guidebook-v2/chapter/errors-failing/)." *People + AI Guidebook*.

[^34]: Anthropic. "[Our framework for developing safe and trustworthy agents](https://www.anthropic.com/news/our-framework-for-developing-safe-and-trustworthy-agents)." 2025.
