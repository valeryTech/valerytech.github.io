---
draft: false
toc: true
description: "A proposed AI uncertainty ladder from solvability to adoption, with possibility probes and unfinished practices for moving between stages."
title: "Uncertainty Ladder"
linkTitle: "Uncertainty Ladder"
---
# AI uncertainty ladder

#ai-eng/collection How are problems framed, discovered, and documented, including through retrospectives?
#ai-eng/collection How are AI capabilities and features framed?

## Hamel's point about roadmaps


Excerpt attributed to Hamel Husain in the source notes:

> If you've worked in software development, you're familiar with traditional roadmaps: a list of features with target delivery dates. Teams commit to shipping specific functionality by specific deadlines, and success is measured by how closely they hit those targets.
>
> This approach fails spectacularly with AI.
>
> I've watched teams commit to roadmaps like "Launch sentiment analysis by Q2" or "Deploy agent-based customer support by end of year," only to discover that the technology simply isn't ready to meet their quality bar. They either ship something subpar to hit the deadline or miss the deadline entirely. Either way, trust erodes.
>
> The fundamental problem is that traditional roadmaps assume we know what's possible. With conventional software, that's often true - given enough time and resources, you can build most features reliably. With AI, especially at the cutting edge, you're constantly testing the boundaries of what's feasible.

Hamel's argument emphasizes feasibility: whether a proposed plan or project can work in practice. A [feasibility study](https://en.wikipedia.org/wiki/Feasibility_study) investigates this before a larger investment.

## Structural problems in AI engineering


The following analysis originated in a Grok-generated response. It develops the mismatch described in the opening excerpt:

> Traditional roadmaps assume we know what's possible. With conventional software, that's often true -- given enough time and resources, you can build most features reliably. With AI, especially at the cutting edge, you're constantly testing the boundaries of what's feasible.

### Why this assumption breaks so badly with AI


In conventional software engineering you can usually decompose a feature into known engineering work. You estimate the work, allocate people, and (with normal variance) deliver something that works. The uncertainty is mostly about *effort* and *integration*, not fundamental *possibility*.

With modern AI systems the uncertainty is deeper:

- You often don't know whether the model + context + tooling can actually reach the required quality bar.
- Breakthroughs can appear suddenly (new model, new prompting paradigm, better synthetic data, better judge), or months of work can produce almost nothing.
- The "feature" is not a deterministic piece of code; it is a capability whose reliability you are discovering.

Committing to "Ship agentic customer support by Q3" or "Launch reliable sentiment analysis by end of year" therefore creates a **false certainty** (and wrong commitment?). Teams then face two bad outcomes: ship something that fails the real quality bar, or miss the deadline and lose trust with leadership.

### What the article recommends instead (revise later)


1. **Capability funnels** (Bryan Bischof's framing)
   Break the desired outcome into progressive levels of usefulness rather than a binary "feature shipped." Example for a query assistant:
   - Can generate syntactically valid queries
   - Can generate queries that execute without errors
   - Can generate queries that return relevant results
   - Can generate queries that match user intent
   - Can generate near-optimal queries that solve the user's actual job

   Progress becomes visible even when the final level is not yet reached.
2. **Experiment-based roadmaps with hard time-boxes**
   Eugene Yan's pattern (originally from traditional ML, still highly relevant):
   - Short data-feasibility window
   - Technical-feasibility window
   - Prototype / A-B window
   At each gate you decide: continue, pivot, or kill. Leadership gets clear decision points instead of open-ended "we're exploring agents."
3. **Evaluation infrastructure as the real foundation**
   Without trustworthy offline (and later online) evaluation, you cannot tell whether an experiment moved the needle. The teams that later move fastest usually invested heavily here first (GitHub Copilot's large-scale offline evaluation against existing test suites is a classic example).
4. **Cultural shift toward visible learning**
   Normalize sharing failures (Eugene's "fifteen-five" updates and no-prep sharing sessions). Long periods that look like failure followed by sudden jumps are common; hiding the failures kills learning speed.

### Practical implication


The unit of planning changes from "features delivered by date" to "experiments run and insights gained per cycle." The key metric becomes how many high-quality experiments the team can execute and learn from, not how many items are checked off a traditional roadmap.

This is why the article insists that robust evaluation and error analysis are not "nice-to-haves" -- they are the only reliable compass once you accept that you are operating at the edge of what is currently possible.

## Possibility - Feasibility


**Feasibility uncertainty** in the engineering sense:

> Uncertainty about whether a _proposed_ AI system (a concrete approach, architecture, training setup, data regime, tooling, etc.) can actually deliver the required outcome under real constraints (compute, latency, cost, reliability, data availability, robustness, etc.).

This already assumes we have a candidate solution or at least a plausible direction. We are testing the boundaries of that approach.

**Possibility uncertainty** sits one level earlier -- **We do not yet know whether the problem is solvable at all** (with current paradigms, near-term scaling, or even in principle).

This is prior to feasibility. It is uncertainty about _possibility / solvability_, not yet about the practicality of a specific proposal.

| Layer                                  | Core question                                                                                 | Typical form of uncertainty                                                                                                           | Traditional software                                                                                       | Frontier AI                                                                                  |
| -------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Possibility / Solvability**          | Does a solution even exist? Is this within the reach of current (or near-term) AI paradigms?  | "We don't know if this class of problem is solvable." Open research question, possible need for new paradigms, or fundamental limits. | Almost always low. Most business problems are known to be computable and have known algorithmic solutions. | Often high. Many ambitious goals sit in the "we're not sure this is even possible yet" zone. |
| **Feasibility**(the quoted definition) | Given a proposed system/approach, can it achieve the required outcome under real constraints? | "This might work in principle, but can _this_ design deliver it reliably, cheaply, robustly enough?"                                  | Moderate (mostly cost/time/engineering risk).                                                              | High, and continuously tested because capabilities are jagged and emergent.                  |

### Why the distinction matters


In conventional software, the first layer is usually settled before you write a roadmap. You already know the problem is solvable; the roadmap is mostly about sequencing known work and managing delivery risk.

In cutting-edge AI the first layer is frequently still open. Examples of possibility uncertainty include:

- Can current (or near-future) models do reliable long-horizon agency without catastrophic drift?
- Can we get consistent, high-stakes scientific discovery or novel research-level reasoning out of the current paradigm?
- Are certain forms of robust causal or counterfactual reasoning actually attainable, or are we hitting deeper limits?
- Is the required level of reliability + generality jointly achievable, or is there a fundamental trade-off?

Until that question has a clearer answer, feasibility analysis may lack a stable proposal to evaluate. The inquiry is still about whether any solution of this type is possible.

## Investigating possibility uncertainty


Investigate fundamental possibility uncertainty by turning a vague "is this even possible?" into sharper, evidence-responsive questions. You almost never fully resolve it in one step. You reduce it.

Here are the main practical approaches:

### 1. Theoretical / formal limits analysis


Ask whether there are known or derivable barriers that make the target *impossible* (or only possible under assumptions that are unrealistic).

- Computational complexity, information-theoretic sample complexity, undecidability, or architectural expressivity limits.
- Results showing that certain classes of problems remain unsolvable even with infinite data (e.g., adversarial dynamical systems that force any learning method to 50/50 performance).
- Questions of the form: "Does any algorithm in this broad class succeed, or are there diagonalization / hardness arguments that rule it out?"

This is the strongest way to *resolve* the uncertainty when a negative result exists. When it does not, it still constrains the space of possible solutions.

### 2. Empirical probing with current systems as existence detectors


Treat today's frontier models + strong scaffolding as imperfect but informative probes.

- Design the hardest reasonable instances of the target capability and measure how close current systems get.
- Look for *qualitative* failure modes that look like fundamental gaps (consistent inability to backtrack productively, inability to generate novel hypotheses, systematic collapse under distribution shift) rather than mere quantitative shortfalls.
- Use techniques like shadow evaluations (giving agents the real unsolved research question and having domain experts grade the output) or carefully constructed adversarial test cases.

If current systems get nowhere after serious effort, the possibility probability drops. If they show partial, non-trivial traction, it rises. This does not prove possibility, but it updates it.

### 3. Decomposition into necessary intermediate capabilities


Break the high-level goal into sub-capabilities that are independently testable.

- Identify properties that any successful system would almost certainly need (e.g., reliable long-horizon credit assignment, certain forms of causal reasoning, stable multi-step self-critique, etc.).
- Assess the possibility of each intermediate on its own.
- If a necessary intermediate itself carries high possibility uncertainty, the original problem inherits it.

This converts one hard uncertainty into several clearer ones and often reveals where the real bottleneck sits.

### 4. Paradigm-sensitivity testing


Ask whether the uncertainty is specific to the current dominant paradigm or more general.

- Try small-scale versions of alternative approaches (different architectures, heavier use of search/symbolic methods, multi-agent debate, neuro-symbolic hybrids, pure evolutionary search, etc.).
- Check whether the barrier moves when you change the inductive bias or the search method.
- Distinguish "we don't know how to do it with transformers + scale + current post-training" from "we don't know how to do it with any known computational approach."

### 5. Reference-class and historical pattern matching


Compare to past cases where a capability looked impossible until it wasn't (or remained impossible).

- Identify the closest historical analogies: what did the difficulty look like before a breakthrough, and what kind of breakthrough resolved it?
- Separate cases that required a new scientific insight from cases that mainly required more scale, better data, or better engineering.
- Use this to calibrate how much weight to put on "no one has a clear idea yet."

### 6. Structured expert elicitation + forecasting


Get careful judgments from people who have spent years working near the relevant frontier.

- Force the distinction between "I don't currently know how to do it" and "I believe there is a deep barrier."
- Use prediction markets or well-designed surveys that separate timelines, required breakthroughs, and confidence.
- Treat the resulting distribution as a prior that you then update with the evidence from the other methods.

### How evidence changes uncertainty


| Action | Effect |
|--------|--------|
| Find a formal impossibility or strong hardness result | Can *resolve* it negatively |
| Get clear partial success on hard probes | Strongly reduces uncertainty in the positive direction |
| Get consistent, informative failure on well-designed probes | Reduces uncertainty in the negative direction |
| Decompose and clear the intermediates | Converts one hard uncertainty into several easier ones |
| Show the barrier is paradigm-specific | Narrows the uncertainty to "current methods" rather than "any method" |
| Identify concrete conditions that would make it possible (scaling laws, new algorithms, etc.) and monitor them | Turns static uncertainty into a trackable research programme |

**Important practical stance**

You rarely wait for full resolution. The useful move is usually:

1. Make the uncertainty as precise as possible.
2. Run the cheapest informative probes.
3. Decide whether to (a) invest in reducing it further, (b) design the system so it does not critically depend on the uncertain capability, or (c) treat it as a research bet with explicit optionality.

In short: treat fundamental possibility uncertainty as a research object. The goal is not philosophical closure but to convert "we don't know if this is even possible" into a set of concrete, evidence-generating questions that move the probability mass.

## The ladder of uncertainty


The proposed ladder distinguishes five kinds of uncertainty. The first is easy to overlook or collapse into the second.

1. **Possibility / Solvability uncertainty** Is this even achievable at all -- with current paradigms, near-term extensions of them, or in principle?
2. **Approach / Recipe uncertainty** Assuming it is possible, do we have (or can we find) a concrete method that works?
   We may know something is in reach but still have no reliable recipe.
3. **Feasibility uncertainty**
   Given a proposed approach, can it deliver the required outcome under real constraints (compute, data, latency, cost, reliability, robustness, etc.)?
4. **Production / Operational uncertainty**
   Even if a system works in controlled settings, can it be made reliable, maintainable, governable, and integrable in the real environment?
5. **Value / Adoption uncertainty**
   Even if it works operationally, does it create enough value and get used in the way that matters?

In traditional software the first two rungs are usually low or already cleared, so roadmaps mostly deal with 3-5.

In frontier AI the first two rungs are frequently still live, which is why the whole planning posture has to be different.

You move up the ladder by turning the current uncertainty into more specific, testable questions and gathering evidence that either reduces it or reveals you need to drop back down a level.

## Similar Approaches


Several established frameworks and theories provide comparisons for the proposed ladder (possibility/solvability -> approach/recipe -> feasibility under constraints -> production/operational).

Here are the closest and most useful ones:

### 1. Technology Readiness Levels (TRLs)


The most direct structural analog.

NASA (and later DoD, ESA, EU, and ML-specific versions) use a 1-9 scale that starts at pure possibility and climbs toward operational reality:

- **TRL 1-2**: Basic principles observed / technology concept formulated (closest to *possibility*).
- **TRL 3-4**: Experimental proof of concept / lab validation (approach existence + early feasibility).
- **TRL 5-6**: Validation in relevant environment (real constraints start to bite).
- **TRL 7-9**: Prototype in operational environment -> actual system proven.

There is also an **ML Technology Readiness Levels (MLTRL)** framework that adapts this specifically for machine learning systems, acknowledging that AI has different failure modes and maturity criteria than traditional hardware/software.

### 2. "Scientific or Technological Uncertainty" (R&D definitions)


In UK R&D tax credit guidance and related Frascati Manual thinking, the core definition is almost exactly the early rungs of the ladder:

> Uncertainty exists when knowledge of **whether something is scientifically possible or technologically feasible, or how to achieve it in practice**, is not readily available or deducible by a competent professional in the field.

This language cleanly separates *possibility* from *how to achieve it* (approach + feasibility).

### 3. Stage-Gate for Technology Development (Stage-Gate-TD)


Robert Cooper's classic Stage-Gate process works poorly for high-uncertainty technology projects. The specialized **Stage-Gate-TD** version was created precisely because early-stage technical success probability can be low and a viable technical solution often cannot even be envisioned yet. It treats the early phases as uncertainty-reduction exercises rather than linear delivery.

### 4. Knightian uncertainty vs risk


Frank Knight's distinction is useful for the first rung:

- **Risk**: You can assign meaningful probabilities.
- **Knightian (or radical) uncertainty**: You cannot even list the relevant possibilities or assign probabilities.

Fundamental *possibility* uncertainty in frontier AI often has a strong Knightian character. Later feasibility questions tend to become more like ordinary risk once a plausible approach exists.

### 5. Epistemic vs Aleatoric uncertainty


- **Epistemic**: Lack of knowledge (in principle reducible by more evidence, experiments, theory). Possibility and approach uncertainty are heavily epistemic.
- **Aleatoric**: Inherent randomness or variability that remains even with perfect knowledge.

Most of the early ladder is epistemic; later operational uncertainty mixes both.

### 6. Related practical frameworks


- **Front-end of innovation / Critical Uncertainties**: Focus on identifying and deliberately clearing the single most important unknown (often technological possibility or feasibility) before progressing.
- **Pharmaceutical / deep-tech stage models**: Discovery -> early proof-of-mechanism -> later clinical/engineering stages. High attrition early on is treated as normal because possibility is still open.
- **Cone of Uncertainty** (project estimation): Visualizes how uncertainty is highest at the beginning and narrows -- a related geometric intuition, though usually applied to cost/schedule rather than possibility itself.

### Summary mapping


| Our ladder rung              | Closest established concepts                          |
|-----------------------------|-------------------------------------------------------|
| Possibility / Solvability   | TRL 1-2, "scientifically possible", Knightian uncertainty, early Stage-Gate-TD |
| Approach / Recipe           | TRL 3, "how to achieve it in practice"                |
| Feasibility under constraints | TRL 4-6, technological feasibility studies            |
| Production / Operational    | TRL 7-9, system uncertainty, operational readiness    |

The proposed ladder adapts ideas that already exist in technology management, R&D accounting, systems engineering, and the philosophy of uncertainty. What is relatively distinctive in frontier AI is how often (and how long) projects remain stuck on the first two rungs compared with conventional software.

## AI ladder: version 0.1


**Applied to AI engineering (development of real systems)**

The ladder and its complementary dimensions can be applied to the development and deployment of AI systems.

### The ladder in AI engineering


**1. Possibility / Solvability**

"Is the target capability even attainable with current (or near-term) models + scaffolding + data regimes?"

Typical questions:

- Can current frontier models do reliable long-horizon tool use / multi-step agency on this class of tasks?
- Is the required level of consistency + robustness jointly achievable, or is there a fundamental trade-off?
- Does the problem sit inside the current jagged frontier or outside it?

This is still frequently live in ambitious AI products. Many teams skip it and jump straight to "let's fine-tune / RAG / agent-ify."

**2. Approach / Recipe**

"Do we have a concrete method that works at all?"

Examples of what gets discovered or invented here:

- Specific prompting + tool patterns
- Data mixture and curation strategies
- Scaffolding / multi-agent designs
- Evaluation harnesses that actually correlate with real performance
- Hybrid symbolic + neural approaches

You often expand the solution space first (many candidate recipes appear), then contract it hard.

**3. Feasibility under real constraints**

"Can this approach meet the actual bar under latency, cost, reliability, data availability, and robustness requirements?"

This is where most "it worked in the demo" projects die. Constraints that commonly bite:

- Tail performance (p95/p99 quality or latency)
- Cost at scale
- Distribution shift and long-tail inputs
- Consistency across sessions / users
- Safety / refusal / hallucination rates under adversarial or edge conditions

**4. Production / Operational**

"Can we run, monitor, maintain, update, and govern this system in the real environment?"

Includes:

- Evaluation in production (online metrics that don't collapse)
- Drift detection and retraining loops
- Human-in-the-loop / escalation paths that actually get used
- Observability of agent trajectories or reasoning traces
- Versioning, rollback, and incident response for non-deterministic systems

**5. Value realization / Adoption**

Even a working system can fail here if the workflow change, trust, or incentive alignment is missing.

### Complementary dimensions in AI engineering practice


| Dimension | What it looks like in AI development |
|-----------|--------------------------------------|
| **Knowledge construction** | Building internal models of "what actually moves the needle" on this task class -- which error modes dominate, which data slices matter, how scaffolding interacts with base model capability. |
| **Solution-space dynamics** | Early: many approaches look plausible (fine-tune, RAG variants, agents, process supervision, etc.). Later: most are eliminated; a small number of recipes survive under constraints. |
| **Constraint discovery** | Learning the real shape of the feasible region -- e.g., "we can get 80% quality easily but the last 15% is extremely expensive," or "latency budget forces us into a weaker model class." |
| **Problem reformulation** | Very common. "Build an autonomous research agent" becomes "build a high-recall literature triage + hypothesis ranking system with human final judgment." The original framing is often wrong. |
| **Team capability growth** | The engineering team develops better taste for experiments, better evaluation design, and faster kill criteria. This is one of the highest-leverage outcomes of early ladder work. |
| **Hypothesis precision** | Moving from "agents should help" to "if we add process supervision on step-level correctness, we should see X% reduction in irreversible errors on tasks longer than N steps." |
| **Rising irreversibility** | Early probes are cheap (API calls, small fine-tunes, synthetic data). Later stages involve production data pipelines, custom evaluation infrastructure, organizational process change, and reputation risk. |
| **Decision quality** | The practical output is better go / no-go / pivot decisions and clearer allocation of the next engineering cycle. |

### Practical implications for AI engineering teams


- Treat the early rungs as first-class work, not "research that delays the roadmap." Many failed AI projects are actually failures of possibility or approach discovery that were misclassified as delivery problems.
- Design experiments that maximize movement on multiple dimensions at once (uncertainty reduction + constraint discovery + problem reformulation).
- Explicitly track when you are still on rung 1-2 versus when you have genuinely reached feasibility under constraints. Teams that stay in "demo mode" for too long are usually stuck on the early rungs while pretending they are further along.
- Expect the solution space to expand before it contracts. Premature convergence on one architecture is a common failure mode.
- Invest in team taste and evaluation infrastructure early -- these compound across every subsequent project.

In short: AI engineering is not primarily a delivery problem once the requirements are clear. For any system that sits near or beyond the current frontier, it is first a structured process of climbing this ladder while simultaneously building knowledge, discovering constraints, and often rewriting the problem itself.

## Working with possibility uncertainty


**Possibility / Solvability -- how to structure and work the first rung**

This step is about answering (or sharply reducing uncertainty on):

> "Is the target capability attainable at all with current or near-term AI paradigms, under any reasonable recipe?"

Not "can *this* specific system work under our constraints" (that is feasibility).

Not "do we already have a working method" (that is approach/recipe).

### 1. Formulate the question correctly


A good possibility question has these properties:

- **Capability-focused, not solution-focused**
  Bad: "Can we build an agent that does X with LangGraph + GPT-4o?"
  Good: "Is reliable multi-step tool-using agency on tasks of type Y currently attainable at all?"
- **Outcome-defined with clear success criteria**
  Specify what "solved" would look like (quality bar, reliability level, distribution of inputs, acceptable failure modes). Vague goals make possibility unanswerable.
- **Scoped to a paradigm family**
  Explicitly state the relevant regime: current frontier models + scaffolding + data, or "any known computational approach," or "with 10-100× more scale," etc.
- **Falsifiable in principle**
  There should exist evidence that would make you update strongly toward "probably not attainable soon."

**Template**

> "Is [specific capability + success criteria] attainable with [paradigm family / resource regime] on [relevant input distribution], or are there reasons to believe it sits outside the current reachable set?"

### 2. Structure the investigation


Work in parallel on four complementary lines of evidence. None is decisive alone; together they move the probability.

| Line of work | Goal | Typical activities |
|--------------|------|--------------------|
| **A. Empirical probing** | See how close current systems get | Hardest reasonable instances, strong scaffolding, measure qualitative failure modes vs quantitative shortfalls |
| **B. Decomposition** | Break into necessary sub-capabilities | Identify intermediate abilities that any solution would need; test those independently |
| **C. Constraint & limit analysis** | Look for fundamental barriers | Known impossibility results, information-theoretic or complexity arguments, consistent failure patterns that look structural |
| **D. Paradigm sensitivity** | Test whether the barrier is paradigm-specific | Small-scale trials of alternative approaches (different architectures, heavier search, hybrid methods, etc.) |

### 3. Key questions to answer at this stage


**Core possibility questions**

- What would constitute clear positive evidence that this is attainable?
- What would constitute strong negative evidence that it is not (or not soon)?
- Where does the current jagged frontier actually sit on the relevant dimensions?
- Are the dominant failure modes looking like engineering gaps or deeper structural limits?

**Decomposition questions**

- What intermediate capabilities are almost certainly required?
- Which of those intermediates are themselves still in the "possibility uncertain" zone?
- If one necessary intermediate is blocked, does the whole target become blocked?

**Limit questions**

- Are there theoretical or empirical reasons this class of problem is hard even with infinite data / compute?
- Is there a known trade-off (e.g., reliability vs generality, consistency vs creativity) that appears binding?

**Reformulation questions**

- Is the original goal the right one, or is a nearby, more attainable version the real need?
- What is the strongest version of this capability that *does* look attainable?

### 4. How to generate useful evidence (practical methods)


- **Hard-instance probes**: Construct or collect the most demanding realistic cases. Run frontier models + best available scaffolding. Focus on *qualitative* behavior (does it make progress, recover from errors, maintain coherence?) more than raw scores.
- **Necessary-condition tests**: Isolate and stress-test the hardest required sub-capability.
- **Negative evidence design**: Actively try to find conditions under which the capability collapses in a way that looks fundamental.
- **Reference-class comparison**: Look at the closest capabilities that *were* recently unlocked and what the difficulty looked like just before they worked.
- **Expert calibration**: Ask people with deep experience on related problems to distinguish "I don't know how yet" from "I see structural reasons this may not work."

### 5. What "progress" looks like on this rung


You are not aiming for a binary yes/no in most cases. Useful outcomes include:

- Sharply reduced uncertainty in either direction
- Clearer statement of the real target (problem reformulation)
- Identification of the binding intermediate capability that is still uncertain
- Discovery of hard constraints that reshape what is worth pursuing
- A small set of high-value experiments that would move the probability further
- Explicit decision: continue investigating possibility, pivot the goal, or treat it as a research bet with known risk

### 6. Common failure modes at this stage


- Treating a failed specific approach as evidence of impossibility
- Treating a flashy demo as evidence of possibility
- Staying too vague on success criteria
- Skipping decomposition and only testing the full end-to-end goal
- Confusing "no one has done it yet" with "it is not attainable"

### Minimal working process


1. Write a precise possibility question using the template above.
2. Define success criteria and the relevant paradigm/resource regime.
3. Decompose into 2-4 necessary intermediate capabilities.
4. Run the strongest available probes on the full goal and on the hardest intermediates.
5. Look for structural limits or consistent qualitative failure modes.
6. Update the question (or reformulate the problem) based on what you learned.
7. Decide the next move: more possibility work, move to approach/recipe search, or change the goal.

This stage is deliberately slow and cheap relative to full development. Its job is to prevent large engineering efforts on targets that are still in the "we don't even know if this is possible" zone, and to turn vague ambition into a clearer, more attackable problem.

## Inherent uncertainty in AI development


**How inherent uncertainty in AI development reveals itself**

In ordinary software, uncertainty mostly shows up as estimation error, requirement drift, or integration friction. In AI development -- especially near the frontier -- inherent uncertainty reveals itself through a distinct set of patterns. These patterns are signals that you are still on the early rungs of the ladder (possibility or approach), not just facing normal delivery risk.

### 1. Non-monotonic and discontinuous progress


You improve a component and the overall system gets *worse*, or a small change unlocks a sudden qualitative jump.

Progress does not accumulate smoothly. This is one of the clearest signs that you are probing a capability boundary rather than optimizing a known method.

### 2. Persistent demo-to-reality gap that resists ordinary engineering


A system looks impressive in curated or short-horizon settings, yet collapses under realistic distribution, longer horizons, or higher reliability requirements.

When extra data, better prompts, more scaffolding, or standard fine-tuning fail to close the gap in a predictable way, you are usually looking at possibility or deep approach uncertainty rather than ordinary feasibility issues.

### 3. Qualitative failure modes that feel structural


The system does not merely score lower -- it fails in characteristic ways:

- loses coherence or goal over long trajectories
- cannot recover productively from its own errors
- hallucinates plausible but wrong intermediate steps
- shows high variance on seemingly similar inputs

When these modes remain stable across multiple recipes, they are revealing something about the reachable set of current paradigms.

### 4. Evaluation brittleness and metric collapse


Metrics that looked informative stop correlating with real usefulness.

Proxy tasks improve while the actual target capability does not.

This often signals that the underlying capability is still emergent or unstable, and that the evaluation is not yet measuring the relevant capability.

### 5. Solution-space explosion followed by rapid collapse


Many approaches appear promising at first. Most of them then fail for related reasons.

The field (or the team) repeatedly rediscovers the same underlying limitation under different names. This pattern reveals that the limitation is deeper than any single recipe.

### 6. Repeated forced reformulation of the problem


Teams keep discovering that the original goal was not the right one.

"Build an autonomous X" becomes "build a high-recall assistant for Y with human oversight on Z."

When this happens repeatedly and productively, it is a healthy sign that possibility work is occurring. When it happens late and under pressure, it is usually a sign that the early rungs were skipped.

### 7. High sensitivity to exact conditions


Small changes in model version, decoding parameters, data mixture, or scaffolding produce large swings in behavior.

This sensitivity is a symptom that the capability is sitting near a phase transition or is still poorly controlled, not yet in a stable feasible region.

### 8. Difficulty assigning meaningful probabilities or timelines


People with deep experience struggle to say "this has a 30% chance of working in 6 months."

The uncertainty feels Knightian: it is hard even to list the relevant ways the project could fail or succeed. This is characteristic of possibility-level uncertainty.

### 9. Team taste and experimental judgment become the bottleneck


Process, tooling, and velocity matter less than the ability to design the *right* next probe and interpret qualitative results.

When "better taste" starts outweighing "better process," you are usually still in the high-inherent-uncertainty regime.

### 10. Scaling or "more of the same" stops helping


Adding data, compute, or longer context yields diminishing or zero returns on the core failure mode.

This is often the moment when the team is forced to confront whether the target is still inside the current reachable set.

### How these signals map to the ladder


| Revealing pattern                        | Most often indicates you are on...      |
|------------------------------------------|---------------------------------------|
| Structural qualitative failures          | Possibility / Solvability             |
| Many recipes fail for similar reasons    | Possibility or early Approach         |
| Demo works, production bar unreachable   | Feasibility under constraints         |
| Metrics stop transferring                | Approach or Feasibility               |
| Forced repeated reformulation            | Possibility (healthy when early)      |
| Extreme sensitivity + high variance      | Still near capability boundary        |
| Cannot even assign probabilities well    | Strong possibility uncertainty        |

### Practical use


These patterns are diagnostic. When several appear together, the correct response is usually *not* to push harder on delivery or to add more engineering resources. It is to drop back and do explicit possibility or approach work: sharper formulation, harder probes, decomposition into necessary intermediates, and constraint discovery.

Inherent uncertainty in AI development does not stay hidden. It reveals itself through discontinuity, structural failure modes, evaluation breakdown, and the repeated need to rethink the problem itself. Recognizing these signals early is one of the highest-leverage skills in AI engineering.

## Organizational dynamics

### The dynamic


C-level and senior management pressure for "AI" is forcing teams onto the early rungs of the ladder -- especially **Possibility / Solvability** and **Approach / Recipe** -- whether the organization is ready or not.

Most of these organizations still operate with the mental model of conventional software or IT projects, where the early rungs are already cleared. They expect linear roadmaps, predictable delivery, and demos that turn into production systems through ordinary engineering effort. That model breaks when you are still on the first or second rung.

The result is a structural mismatch:

- Management wants movement and visible progress.
- The actual work required is uncertainty reduction, constraint discovery, and problem reformulation.
- Teams respond by producing demos, prototypes, and "AI features" that look like progress but do not systematically climb the ladder.
- When those efforts stall or fail to deliver reliable value, the organization often concludes "AI doesn't work here" or simply starts the next wave of pilots.

### What this implies


The pressure itself is not the problem. The problem is treating early-rung work as if it were late-rung delivery work. Under current market conditions, the correct response is to **change what the team optimizes for** and **deliberately build the foundations** that make proper movement up the ladder possible.

### What needs to change


**1. Reframe the early work**

Stop treating possibility and approach discovery as "research that delays the roadmap." In the current environment it *is* the critical path. Make this explicit to stakeholders: "We are still determining whether (and how) this class of capability is attainable under our conditions."

**2. Build foundations that compound**

These are the capabilities that let a team move cleanly from possibility -> approach -> feasibility instead of thrashing:

- **Problem formulation skill** -- the ability to write precise possibility questions and success criteria.
- **Hard-instance evaluation infrastructure** -- ways to test the actual target capability rather than convenient proxies.
- **Experimental taste and kill criteria** -- knowing what constitutes informative negative evidence and when to stop an approach.
- **Decomposition discipline** -- breaking ambitious goals into necessary intermediate capabilities and testing those.
- **Observation and failure-mode analysis** -- treating qualitative structural failures as primary data, not just noise.
- **Shared language for the ladder** -- so management and engineering can talk about which rung they are actually on.

**3. Change the artifacts and cadence**

Early-rung progress should produce different outputs than delivery work:

- Sharper problem statements
- Evidence from hard probes
- Constraint maps
- Reformulated goals
- Explicit decisions to continue, pivot, or kill

Velocity should be measured in uncertainty reduced and constraints discovered, not only in features shipped.

**4. Protect the necessary conditions**

Top-down pressure often collapses timelines and removes the space needed for proper early-rung work. Teams need to create protected capacity for possibility and approach investigation, and they need language that makes the cost of skipping it visible to leadership.

### The practical stance


In the current market, many organizations are being pushed onto the early steps of the ladder. That is reality. The adaptive response is not to pretend the early rungs do not exist, nor to resist the push entirely. It is to treat the situation as a forcing function: use the pressure to justify building the foundations and disciplines that allow the organization to climb the ladder properly instead of generating an endless series of demos that never mature.

Organizations that do this will convert the current wave of AI ambition into durable capability. Those that do not will mostly accumulate expensive experience of what does not work.

## Synthesis and practical directions


**Reflection and distillation**

The framework combines the possibility-feasibility distinction, a ladder of uncertainty, complementary dimensions of progress, methods for investigating possibility, diagnostic signals, and organizational implications.

The core insight is this: much of the difficulty and waste in current AI development comes from organizations being forced onto the early rungs of the ladder while still using the mental models, processes, and success metrics of later rungs.

### Core topics


1. **The ladder of uncertainty**
   Possibility / Solvability -> Approach / Recipe -> Feasibility under constraints -> Production / Operational -> Value realization.
   Different rungs require different questions, evidence, and work styles.
2. **Possibility as a first-class concern**
   In frontier-adjacent AI work, "is this even attainable?" is often still open. Treating it as already settled is a common source of failure.
3. **Complementary dimensions of progress**
   Moving up the ladder is simultaneously: reducing uncertainty, constructing knowledge, discovering constraints, reformulating the problem, growing team capability, and increasing commitment.
4. **Diagnostic signals of inherent uncertainty**
   Non-monotonic progress, structural qualitative failures, persistent demo-to-reality gaps, evaluation brittleness, solution-space collapse, forced reformulation, and difficulty assigning probabilities.
5. **Organizational mismatch under current pressure**
   C-level push for AI forces teams onto early rungs, but most organizations still expect linear delivery. This mismatch produces demo culture and repeated false starts.
6. **Foundations required for proper movement**
   Problem formulation skill, hard-instance evaluation, experimental taste and kill criteria, decomposition discipline, failure-mode analysis, and shared language for the ladder.

### Directions to act


**1. Make the ladder explicit**

Adopt the language internally. For every significant AI initiative, state which rung it is actually on. Do not allow projects to pretend they are in delivery mode when they are still in possibility or approach discovery.

**2. Diagnose before accelerating**

When a project shows the revealing patterns (structural failures, metric collapse, repeated reformulation, etc.), treat them as signals to drop back and do explicit early-rung work rather than adding more engineering velocity.

**3. Build the foundations deliberately**

Invest in the capabilities that compound across projects:

- Precise problem formulation
- Hard-instance evaluation infrastructure
- Experimental judgment and clear kill criteria
- Systematic decomposition of ambitious goals
- Shared diagnostic language

These are higher leverage than most tooling or process improvements when the organization is frequently on the early rungs.

**4. Change what early progress looks like**

Redefine useful artifacts for the first rungs: sharpened possibility questions, evidence from hard probes, constraint maps, reformulated goals, and explicit continue/pivot/kill decisions. Measure uncertainty reduced and constraints discovered, not only features shipped.

**5. Create protected capacity and honest communication**

Under top-down pressure, protect time and space for possibility and approach work. Develop clear ways to explain to leadership why certain initiatives are still on the early rungs and what proper movement requires.

**6. Use the current wave as a forcing function**

The market pressure is real. Convert it into organizational capability: use the demand for AI to justify building the disciplines and foundations that let the organization climb the ladder repeatedly and reliably, instead of generating an endless series of demos.

### Operating implication


Early-rung AI work requires practices suited to possibility and approach uncertainty. Diagnose where each effort actually sits on the ladder, build the foundations that enable proper movement, change the artifacts and metrics accordingly, and use the current top-down pressure to install these practices rather than fight them or collapse under them.

The organizations that do this will turn the present wave of AI ambition into durable engineering capability. The ones that do not will mostly accumulate expensive confirmation of what does not yet work.

## Open areas for development


**What is still absent (or only lightly sketched)**

The conceptual frame includes the ladder, complementary dimensions, diagnostic signals, and organizational mismatch. The operating practices needed to use it at scale remain largely unspecified.

Here are the main gaps:

### 1. Concrete practices, tools, and playbooks per rung


**Possibility** is developed in the most detail. The other rungs still lack detailed working methods.

Missing examples of what is needed:

- Approach/Recipe: systematic ways to generate, test, and kill candidate methods
- Feasibility: constraint-mapping techniques, cost/quality/latency trade-off probes, tail-performance evaluation
- Production/Operational: specific patterns for observability, drift detection, escalation design, and versioning of non-deterministic systems
- Value: ways to test actual workflow impact and adoption under realistic conditions

### 2. Engineering systems that support ladder movement


These are mostly absent as explicit design objects:

- **Evaluation systems** oriented to uncertainty reduction (hard-instance suites, necessary-intermediate tests, structural failure-mode tracking) rather than only model quality scores
- **Observability** for agentic / multi-step / non-deterministic systems that helps diagnose *which rung* a failure belongs to
- Experiment tracking and decision logs that capture why an approach was killed or a problem was reformulated
- Infrastructure that makes early-rung work cheap and high-signal

### 3. Organizational systems


Almost entirely missing:

- Stage-appropriate governance and funding (how to resource and review work that is still on Possibility or Approach)
- Progress reporting language and artifacts that leadership can understand without forcing early-rung work into delivery metrics
- Role and skill definitions (who is responsible for possibility diagnosis vs feasibility hardening)
- Incentive structures that do not punish killing approaches or reformulating problems
- Portfolio view: how to manage a mix of initiatives sitting on different rungs

### 4. Transition criteria and gates


Clear, evidence-based criteria for moving between rungs or returning to an earlier one remain to be developed. Without these, teams drift upward prematurely or stay stuck.

### 5. Metrics and signals of healthy progress per rung


What "good" looks like on Possibility is different from what "good" looks like on Feasibility or Production. These differentiated success signals are only sketched.

### 6. Feedback loops and anti-patterns


- How learnings from Production should systematically feed back into Possibility or Approach
- Catalog of common anti-patterns at each stage and how they appear in practice

### 7. Integration with existing ways of working


How the ladder overlays on (or replaces parts of) agile, OKRs, traditional stage-gate, product discovery, etc.

Three proposed priorities for further development are:

1. **Per-rung toolkits** -- concrete practices, templates, and evaluation methods for each stage.
2. **Engineering systems** -- especially evals and observability designed for ladder diagnosis and uncertainty reduction.
3. **Organizational systems** -- governance, reporting, incentives, and portfolio management that match the reality of the early rungs.

The conceptual frame is now strong enough to support that build-out. The absence is not more theory; it is the operational layer that turns the ladder into a repeatable organizational capability.

## Naming and scope


The proposed framework sits at the intersection of strategy, technology management, and organizational capability. It is closer to an **operating doctrine** or **strategic approach for developing AI systems under deep uncertainty** than to a set of engineering tactics.

### What category it belongs to


- **Not** just process or methodology (those usually assume the early rungs are already clear).
- **Not** pure research strategy (it is oriented toward building real systems).
- **Closer to**: a strategic frame + operating model for how an organization should move when significant technical possibility is still open.

It tells you:

- how to diagnose where you actually are,
- what kind of work is appropriate at each stage,
- what foundations you need,
- and how to respond when top-down pressure forces you onto the early rungs.

### Naming options


Here are the strongest directions, ranked by usefulness:

**1. The AI Uncertainty Ladder** (or simply **Uncertainty Ladder**)

Clear, memorable, and descriptive. Emphasizes the ladder structure. Easy to use in conversation with both engineers and leadership ("we're still on the first rung").

**2. Possibility-First AI Development**

Highlights the distinctive claim: in many current AI efforts, possibility/solvability must be treated as first-class work rather than assumed. Good when you want to stress the contrast with conventional software.

**3. Frontier Development Doctrine** (or **AI Frontier Doctrine**)

Positions it as an operating doctrine for work near or beyond the current capability frontier. Sounds more strategic and less purely technical.

**4. Structured Uncertainty Navigation for AI**

More precise and academic in tone. Useful if you need a formal name for internal documentation or papers.

**5. Capability Discovery Framework**

Emphasizes the positive side (discovering and unlocking capabilities) rather than only uncertainty reduction. Slightly softer for leadership audiences.

### Recommendation


The proposed everyday name is **"The AI Uncertainty Ladder"** (or **Uncertainty Ladder**), described as:

> a strategic approach and operating model for developing AI systems when significant possibility and approach uncertainty still exists.

This framing does three useful things at once:

- Gives people a shared language ("which rung are we on?")
- Signals that it is more than engineering tactics
- Makes the organizational implications legible to management
