---
draft: false
toc: true
description: "Proposes introducing AI into existing knowledge work through task-based allocation, substantive human decision points, independent verification, shared artifacts, and progressively expanded responsibility, including co-writing."
title: "01 Augmenting Human Work"
linkTitle: "01 Augmenting Human Work"
---

Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

Initial design question: How should a system of people and LLM-based agents collaborate, and on what kinds of tasks? The author's framing asks how the features of people and current and future LLMs should affect the design. It initially proposes that LLMs lack a world model and have capabilities rather than intelligence; the response below questions both assumptions. The introduction strategy is to augment workflows initially performed by people and identify explicit points for human decisions.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The [joint activity and collaboration model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) develops a related taxonomy with its original reasoning. [Human-AI collaboration patterns]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) keeps the complete interaction-pattern discussion separate from the general model.

## first reasoning


The proposal is to frame the system as a **human-LLM work system for complex knowledge work**: tasks that are multi-step, partly ambiguous, produce inspectable artifacts, and contain a smaller number of decisions with meaningful consequences.

Software engineering, research, product development, operations, investigations, and planning are good examples. A completely specified task with an objective verifier is closer to ordinary automation; a task whose outcome depends almost entirely on tacit social or physical context is still heavily human.

One terminology point from the working dictionary: if **intelligence = capacity to solve tasks**, then "LLMs have capabilities but not intelligence" is inconsistent with that definition. The working interpretation is that the distinction you want is:

> **LLMs have substantial task-solving intelligence, while their grounding, persistent agency, autonomy, and reliable world modeling are much weaker.**

The LLM critique also rejects requiring the claim that LLMs have _no_ world model. There is evidence that language models encode structured representations of space, time, and other state, while controlled evaluations also find major failures in causal, spatial, temporal, and physical prediction. So the proposal is to treat world-model quality as an empirical capability that can improve, not a binary architectural assumption. ([ICLR Proceedings](https://proceedings.iclr.cc/paper_files/paper/2024/hash/0a6059857ae5c82ea9726ee9282a7145-Abstract-Conference.html?utm_source=chatgpt.com "Language Models Represent Space and Time"))

### Allocate work based on task properties


The proposal is to use something like this rather than "humans do X; AI does Y."

|Task property|Default allocation|
|---|---|
|Clear objective, contained context, automatically verifiable, reversible|LLM executes|
|Clear objective, good verification, significant external impact|LLM prepares/executes up to approval boundary|
|Large search or synthesis space|LLM explores; human directs|
|Many plausible alternatives|LLM generates and compares|
|Ambiguous objective|Human defines or resolves objective|
|Values or business tradeoff|Human decides; LLM analyzes consequences|
|Tacit organizational/social context dominates|Human supplies judgment/context|
|Difficult to verify|Increase human involvement|
|Irreversible or high-cost action|Human authorization|
|Unexpected state / model outside tested conditions|Escalate|

So the governing function is roughly:

```text
AI autonomy ↑
    when
capability ↑
verification quality ↑
reversibility ↑
context completeness ↑

AI autonomy ↓
    when
consequence of error ↑
ambiguity ↑
novelty ↑
tacit-context dependence ↑
verification difficulty ↑
```


This also handles future generations of models. You don't redesign your organization every time model capability changes. You update capability evaluations and therefore change which work units meet the threshold for delegation.

That matters because autonomous task length is already moving quickly. METR's 2026 measurements show frontier agents completing increasingly long software tasks, while reliability still declines substantially as task duration increases; their February-March 2026 evaluation estimated about a 12-hour human-equivalent horizon at 50% success and about 1.5 hours at 80%, with substantial measurement uncertainty. ([Metr](https://metr.org/blog/2026-05-19-frontier-risk-report/?utm_source=chatgpt.com "Frontier Risk Report (February to March 2026) - METR"))

### Human decision points should be designed as decision points


The critique is that many systems make an architectural mistake here.

They produce:

```text
AI does something
→ human reviews
→ approve / reject
→ AI does something
→ human reviews
→ approve / reject
```


The human becomes a slow validation API.

Research on generative-AI workflows already identifies this shift from production to constant evaluation as a source of lost productivity. Humans can also become anchored on plausible AI output and accept errors. ([Microsoft](https://www.microsoft.com/en-us/research/publication/ironies-of-generative-ai-understanding-and-mitigating-productivity-loss-in-human-ai-interaction/?lang=ko-kr&utm_source=chatgpt.com "Ironies of Generative AI: Understanding and Mitigating Productivity Loss in Human-AI Interaction - Microsoft Research"))

Instead, use humans when there is an actual decision:

|Human gate|Question|
|---|---|
|Intent|What are we trying to accomplish?|
|Tradeoff|Which outcome do we prefer?|
|Commitment|Are we willing to incur this cost/consequence?|
|Ambiguity|Which interpretation reflects the actual situation?|
|Exception|Something outside the normal workflow happened; what now?|
|Residual risk|Verification cannot establish correctness; do we proceed?|
|Policy|Is this action allowed/desirable in this context?|

Everything between those gates can increasingly become machine work.

And when a human reaches a gate, the recommendation is not to give them 40 pages of generated reasoning. Give them a **decision packet**:

```text
Decision:
Should we deploy version A?

Options:
A / B / defer

Known facts:
...

Evidence:
...

Uncertain:
...

Predicted consequences:
...

Reversibility:
...

Checks performed:
...

Recommendation:
A

Human authority required because:
production impact is difficult to reverse
```


For particularly consequential decisions, the proposal is to consider having the person form an initial judgment from the evidence before revealing the model recommendation. That reduces the chance that "human oversight" becomes simple agreement with the machine. Automation bias remains a documented problem even when users know AI can make errors. ([PLOS](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0298037&utm_source=chatgpt.com "Putting a human in the loop: Increasing uptake, but decreasing accuracy of automated decision-making | PLOS One"))

### Verification deserves its own subsystem


The proposal is to explicitly distinguish:

```text
production ≠ verification ≠ decision
```


If Agent A writes code and Agent B says "looks good," you haven't necessarily gained much assurance. Their errors can be correlated.

Prefer heterogeneous verification:

```text
LLM-generated code
       ↓
compiler
       ↓
tests
       ↓
static analysis
       ↓
sandbox execution
       ↓
LLM review
       ↓
human only if needed
```


Likewise, for research:

```text
LLM claim
   ↓
source retrieval
   ↓
source/claim correspondence
   ↓
cross-source check
   ↓
uncertainty recorded
```


A powerful rule for choosing tasks is therefore:

> **AI delegation works especially well when producing the result is expensive but checking the result is cheap and reliable.**

If a human needs as much expertise, time, and concentration to verify an answer as they would have needed to create it, you may simply have moved the work around.

<a id="how-i-would-introduce-it-into-an-existing-organization"></a>

### Proposed introduction into an existing organization


Don't start by designing an autonomous organization. Start with the existing human workflow and progressively move boundaries.

|Stage|AI role|Human role|
|---|---|---|
|0. Baseline|None|Existing workflow; measure quality, time, failures|
|1. Shadow|Performs work privately|Humans work normally; compare results|
|2. Assist|Search, drafts, alternatives, analysis|Human produces/decides|
|3. Bounded delegation|Completes low-risk work units|Human handles exceptions and decisions|
|4. Supervised execution|Acts in real systems within permissions|Human approves consequential actions|
|5. Conditional autonomy|Runs whole verified branches|Human appears at defined decision gates|
|6. Workflow redesign|Machines perform most routine cognitive work|Humans set direction, handle novelty, make consequential decisions|

The transition criterion shouldn't be "people feel comfortable with it." Measure outcome quality, failure severity, human time including review time, escalation rate, override rate, cost, and performance when conditions differ from the normal case.

Microsoft's human-AI interaction work reaches a similar practical conclusion: systems should clearly communicate capability boundaries, support correction and dismissal, scope themselves when uncertain, and give users control over their behavior. ([Microsoft](https://www.microsoft.com/en-us/research/blog/guidelines-for-human-ai-interaction-design/?utm_source=chatgpt.com "Guidelines for human-AI interaction design - Microsoft Research"))

The Joint Activity literature is particularly relevant. Klein, Woods, Bradshaw, Hoffman and Feltovich wrote _Ten Challenges for Making Automation a "Team Player"_ in 2004. Their requirements include **mutual predictability, directability, and common ground**. That paper reads surprisingly well as a critique of present-day LLM agents. ([IEEE Xplore](https://ieeexplore.ieee.org/document/1363742/?utm_source=chatgpt.com "Ten challenges for making automation a \"team player\" in joint human-agent activity | IEEE Journals & Magazine | IEEE Xplore"))

For example, consider a coding system consisting of you and an agent. A typical LLM architecture thinks approximately:

```text
user request
    ↓
LLM
    ↓
tools
    ↓
answer
```


A joint-system model is closer to:

```text
                    shared objective
                         │
              ┌──────────┴──────────┐
              │                     │
            human                 agent
         goals/beliefs          goals/beliefs
              │                     │
              └──── shared task ────┘
                    state / plan
                         │
              interaction protocol
                         │
                tools + environment
                         │
                   observations
                         │
              runtime constraints
```


That changes the design problem substantially.

You start asking things such as:

```text
Who currently owns the next action?

What commitments have been made?

Which facts are common ground?

What does the human believe the agent is doing?

What does the agent believe the human expects?

Under which conditions may the agent act autonomously?

What requires approval?

When should one participant interrupt another?

What must be communicated when a plan changes?

How do we recover if the participants' models diverge?
```


Those are classic joint-activity questions, not specifically LLM questions.

Barbara Grosz and Sarit Kraus's **SharedPlans** work is another strong foundation. It formalizes collaboration in terms of beliefs, intentions, partial plans, individual responsibilities and joint activity. Importantly, it handles cases where collaborators don't yet know the complete plan. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/0004370295001034?utm_source=chatgpt.com "Collaborative plans for complex group action - ScienceDirect")) That's highly applicable to agentic software engineering, research, operations, etc., where the plan develops during execution.

There is then the question of **initiative**. Eric Horvitz's mixed-initiative work studied systems where either the human or machine may take initiative depending on context, uncertainty, expected value and cost. ([DOI](https://doi.org/10.1145/302979.303030?utm_source=chatgpt.com "Principles of mixed-initiative user interfaces | Proceedings of the SIGCHI conference on Human Factors in Computing Systems")) This gives a much richer model than a fixed "human-in-the-loop" checkpoint.

For example:

```text
agent confidence high + reversible operation
    → act

agent confidence medium
    → propose

uncertainty affects an important decision
    → ask

irreversible/high-cost operation
    → request authorization

human takes control
    → yield

environment changes significantly
    → renegotiate plan
```


That is a **policy for collaboration**, rather than a prompt.

### The deeper model


The working interpretation is that this leads to a somewhat different picture from "AI employees collaborating with human employees."

The durable architecture is:

```text
Human organization
    │
    ├── supplies goals
    ├── supplies values
    ├── supplies authority
    └── remains coupled to the real social/physical world
             │
             ▼
      socio-technical system
             │
     ┌───────┼────────┐
     │       │        │
 humans    LLMs     software
     │       │        │
     └───────┼────────┘
             │
      shared external state
             │
      actions in the world
             │
      observed consequences
```


Today, humans supply much of the grounding, continuity, goals, responsibility, and judgment, while LLMs supply cheap parallel cognitive capability: search, transformation, hypothesis generation, synthesis, coding, simulation, critique, and coordination.

As models improve, the **execution boundary moves**. The human decision boundary should move much more slowly, because some decisions are human due to authority and values, not because the machine happens to be insufficiently capable.

That distinction is probably the core of the proposed system:

> **Automate work according to capability. Delegate decisions according to authority, consequence, and the ability to verify them.**

It gives you an architecture that works with today's LLMs without assuming today's limitations are permanent, and it avoids assuming that greater task-solving capability automatically gives a system grounding, autonomy, responsibility, or legitimate decision authority.

### 6. Shared computation between humans and agents


The program should also become the shared object of collaboration.

The research notes move away from agents exchanging free-form messages and toward agents publishing typed artifacts into shared state.

That suggests another research question:

**What is the right shared computational substrate for mixed human-agent systems?**

Humans, planners, critics, retrievers, execution workers, and verification components could all modify the same typed state under different capabilities.

This is where blackboard systems, capability models, and provenance become especially relevant.

### 7. Program representation and interaction


The visual environment is then part of the research program, although not its theoretical core.

The important idea from the Hebbia analysis is that Matrix works because computation becomes visible and manipulable.

The generalized system proposal goes further:

```text
program
+
execution state
+
typed values
        ↓
Matrix
Graph
Timeline
Evidence view
Source view
Task view
Report
```


The research question becomes:

**Can humans understand, inspect, and safely modify probabilistic programs better through structured projections than through conversation alone?**

That gives you a human-computer interaction track alongside the PL/systems work.

One proposed conceptual distinction is:

**Automation**

`AI changes the state of the world.`

**Assistance**

`AI tells the human what to do.`

**Decision support**

`AI helps the human choose an action.`

**Sensemaking / epistemic augmentation**

`AI helps the human construct a better model of the world.`

And there is an even stronger version:

**Epistemic partnership**

`human and AI jointly construct, criticize, and revise a model, while the human retains epistemic agency.`

That last category appears close to the proposed design direction. It suggests that the central design object isn't a "task" at all. It's a **shared evolving representation of what is known, suspected, unknown, and contested**.

Further research question for AI tools in software engineering, research, and knowledge work: how could this literature map into concrete system-design patterns, such as an "epistemic copilot" compared with current coding agents?

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## From conversational interfaces to collaborative work


The following retained question and response from the [build-approach source]({{< ref "ai/collab-and-joint-work/build-approach" >}}) distinguish collaboration, active participation, and augmentation. The [participant profiles]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) retain the preceding model and later revision. The [design-practices note]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}) continues the framework, and the sibling [comments]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work-comments" >}}) explain the placement.

## first part (to rewrite)


Author question: How should the change in mindset for product design and discovery be named?

Example proposal: Replace the 'query-answer' model of a prompt-and-answer UI with collaborative work, or a system in which different participants work together toward a goal.

Additional proposal: Give AI an active role and augment human work. These are distinct principles and should be analyzed separately.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The proposal is to separate this into two related mindset shifts, because they lead to different design principles.

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

If humans, AI, tools, and services can all participate, the proposal is to describe the product as a **multi-participant work system** or, in more academic language, a **socio-technical system**. The latter is accurate but probably too academic as a product principle.

The second shift is specifically about AI:

**From AI as a tool to AI as an active participant.**

Here AI has some initiative. It can notice something, propose a next step, perform work, coordinate with other participants, maintain context, or act on behalf of the user within defined boundaries.

There's then another useful principle underneath it:

**From automation to augmentation.**

The design question becomes less "what can AI do instead of the human?" and more "how does the combined human-AI system perform better?" This includes dividing work according to strengths, letting humans steer and correct, preserving judgment and accountability, and having AI reduce cognitive or operational load.

So one tentative proposal is to organize the overall idea as:

1. **Interaction -> Collaboration**
    Design around shared goals and ongoing work, rather than exchanges of prompts and answers.
2. **Tool -> Participant**
    Give AI an active role in the work, with appropriate initiative, responsibilities, and boundaries.
3. **Automation -> Augmentation**
    Optimize the combined human-AI system, including how work and judgment are divided.

If you need one umbrella phrase for the whole shift, **"from conversational interfaces to collaborative systems"** is probably the clearest. "Conversational" describes the current UI paradigm; "collaborative system" describes the deeper product model you're moving toward.

The [source redirect]({{< ref "ai/collab-and-joint-work/build-approach" >}}) links the initial profiles, design practices, and later revision. The [mapping log]({{< ref "ai/design-research/reassembly-map" >}}#related-notes-pass-5-participant-profiles-and-design-practices) records the complete split.

## From rewriting prompts to a shared writing workspace


The following passage from the co-writer sketch (archived source 010) keeps the proposed meaning requirements, communication support, task context, Matrix idea, and closing reflection together. The earlier [workflow and complete examples]({{< ref "ai/design-research/interactive-systems/14-collaborative-writing-and-text-assembly" >}}) remain a separate application case.

The saved sketch does not label speakers, so the arrangement does not assign every sentence to the author or an LLM. The [sibling comments]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work-comments" >}}#co-writer-meaning-and-collaboration) distinguish faithful rewriting from developing an idea. The [split audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-10-co-writer-sketches) records the original order.

<!-- Co-writer communication source begins below. -->

## find and apply principles from (not) hebbia


  If left blank, Gemini would infer the domain. The prompt would require it to:

  1. Identify the domain and central argument.
  2. Preserve the writer's intended claim.
  3. Improve domain terminology and conceptual precision.
  4. Clearly distinguish faithful rewrites from alternatives that extend the idea.
  5. Avoid silently inventing facts.

And we're coming to the point that it's not text rewriter only. It could be helper in communication... communication facilitator..

to do this we could model the user,

task: blog post, .., message, paragraph in article, ...

collaborative surface.. first we could make it with Matrix

## reflections


yes - the step from prompt to collaboration surface is a big deal. It changes not only mechanich, but the mindset, points of view, really the mental model.
