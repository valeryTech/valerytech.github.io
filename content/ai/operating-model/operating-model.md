---
draft: false
toc: true
title: "Operating Model"
linkTitle: "Operating Model"
---
# Principles and Decision Logic for AI Product Work

## Purpose


This document explains how to reason about product work when we do not yet know which solution will work or how well it will behave.

It does not choose which problems deserve attention and does not prescribe one product development process.

It describes:

- what to understand before choosing a solution;
- how to make uncertainty explicit;
- how to decide what evidence is useful;
- how evidence should affect a commitment;
- what changes when a solution is put into production;
- how production use informs the next decision.

The model applies most strongly when the problem, the solution, or the expected product behavior is uncertain. A small and familiar change may need very little investigation. A consequential change with weak evidence may need much more.

## Core logic


For one decision:

```text
Current condition and intended change
                    ↓
      Possible explanations and solutions
                    ↓
    Assumptions, uncertainty, and risk
                    ↓
       Evidence for a named decision
                    ↓
Decision: continue | change | stop
                    ↓
       What we commit to next
```


Across decisions, discovery, delivery, operation, and observation overlap. Observation informs both discovery and delivery. Evidence can change the description of the current condition, the change being sought, the possible solutions, the assumptions, or an existing commitment. Several decisions may be active at once.

## How to use the principles


The principles are not a checklist that every piece of work must complete in full.

Use them to ask:

- What do we know?
- What are we assuming?
- What would happen if an important assumption were false?
- What decision are we trying to make?
- What evidence would be useful for that decision?
- What are we committing to?
- What uncertainty are we accepting?
- What will we learn from real use?

The amount of work should depend on the decision. Do not perform discovery work only because a process says it is required.

## 1. Start with the current condition, not a feature


**What:** Begin with the condition that needs attention, not with an output that someone wants built.

**Why:** If the work starts with a feature, success can quietly become "we shipped the feature." That does not show that anything useful changed.

**Reasoning:** Choosing a solution assumes that an action will change something. That assumption may be wrong. First describe what happens now and how it should be different.

A current condition may be a customer problem, a product failure, an operating constraint, or an unwanted result. The intended change says what should be different. It may concern:

- a user behavior;
- a product behavior;
- an operational condition;
- a customer result;
- a business result.

The change is a direction for investigation. It is not proof that the product can cause it. The description of the condition, our explanation of it, and the change we seek may all be revised when evidence changes.

**In practice:** Write down:

- the current condition;
- who or what is affected;
- why the condition matters;
- how the condition should change;
- what we would observe if the condition changed.

Treat a requested feature as one possible response to the condition.

**Common mistake:** Writing "we need feature X" as the problem. That makes the answer part of the question.

## 2. Keep the problem and possible solutions separate


**What:** Understand the problem before choosing a solution. Preserve meaningful alternatives while uncertainty is high.

**Why:** Evidence about one solution does not show that the underlying problem is understood or that the right alternatives were considered.

**Reasoning:** Finding good options and testing them are separate tasks. A careful test can reject a poor solution. It cannot create a better option that was never considered.

Moving directly from a broad problem to one solution also encourages circular reasoning:

```text
We chose this feature because it solves the problem.
We know it solves the problem because it is the feature we chose.
```


**In practice:**

- Describe needs, pains, failures, desires, and constraints without feature language.
- Consider more than one meaningfully different solution when the choice is uncertain.
- Compare the likely effect, important unknowns, and cost of learning for each candidate.
- Revisit the problem when new evidence does not fit the original explanation.
- Stop expanding the option set when more alternatives no longer improve the decision.

Alternatives are a way to improve a decision. They are not a required ceremony.

**Common mistake:** Generating small variations of the same solution and calling them alternatives.

## 3. Turn uncertainty into concrete assumptions


**What:** State what must be true, what evidence supports it, how uncertain it remains, and what would happen if it were false.

**Why:** A statement such as "there is feasibility risk" is too broad to investigate. A concrete assumption gives us something that evidence can support or weaken. Its consequence tells us why the uncertainty matters.

**Reasoning:** Keep four related ideas separate:

- **Assumption:** a specific statement that must be true for our understanding of the problem, for a solution to work, or for a commitment to hold.
- **Evidence:** what currently supports or weakens the assumption.
- **Uncertainty:** how limited our knowledge is after considering the evidence.
- **Risk:** why being wrong matters, expressed as the possible consequence if the assumption is false.

Our explanation of the problem, the change we seek, and each candidate solution all contain assumptions. Some assumptions are well supported. Some are uncertain but unimportant. An assumption deserves more attention when it could change the next decision, current evidence is weak, the consequence of being wrong is serious, and useful evidence can be obtained at a reasonable cost.

```text
Area of concern
        ↓
Assumption that must be true
        ↓
Evidence and remaining uncertainty
        ↓
Consequence if false
        ↓
Decision
```


Use three groups to look for important assumptions and obligations:

1. **Problem and intended change.** Do we understand the current condition, the people affected, and why it matters? Is there a clear reason to change it? Can a product reasonably contribute to that change?
2. **Candidate solution.** Look across five solution risk dimensions:
   - **Value:** Will the people or customers concerned choose, adopt, buy, or keep using the solution instead of the available alternatives?
   - **Usability:** Can the intended users understand it and complete the relevant work in realistic conditions?
   - **Feasibility:** Can the product provide the required behavior with the available technical capabilities, data, and constraints?
   - **Viability:** Can the solution be offered and sustained within the relevant economic, legal, commercial, and service constraints?
   - **Harm:** Could the solution cause unacceptable harm to users, other people, systems, or the wider environment, including through safety, privacy, security, or abuse failures?
3. **Production and operation.** What reliability, scale, capacity, security, privacy, observability, support, recovery, and cost conditions must hold in real use?

Value and intended change are not the same. People may choose and use a solution without it producing the change sought. A solution may also produce some benefit while still not being valuable enough for people to choose it over an alternative.

The groups are prompts for finding what matters. They are not a checklist or a claim that every concern fits only one group.

The same concern may be an assumption or an obligation, depending on the decision. If uncertainty about it could invalidate a candidate solution, state it as an assumption and gather evidence. When the solution is known and the concern states a condition the product must meet in production, record it as an obligation. For example, "Can this approach meet the required response time at an acceptable cost?" is an assumption. "Keep response time within the stated limit" is an obligation.

A fuller account of these groups is in [`risk-areas-model.md`]({{< ref "ai/risk-areas/risk-areas-model" >}}).

**In practice:** For each important assumption, ask:

- What exactly must be true?
- What happens if it is false?
- What evidence already exists?
- How uncertain are we?
- Can we examine this assumption without building the whole solution?
- Is the likely value of the evidence worth the cost of obtaining it?

**Common mistake:** Completing a standard risk checklist without identifying the particular ways this solution could fail.

## 4. Gather evidence for a named decision


**What:** Start with the decision, then choose what evidence to gather.

**Why:** A test can produce data without producing useful knowledge. Evidence matters when it can change what happens next.

**Reasoning:** The method must fit the claim.

- Interviews can help us understand problems, language, and context.
- Observed behavior can test claims about what people do.
- Prototypes can test comprehension, interaction, and some forms of demand.
- Technical tests can examine quality, latency, cost, scale, and failure modes.
- Business analysis can examine economics and operational constraints.
- Controlled production use can answer questions that cannot be answered elsewhere.

The aim is the cheapest credible evidence, not simply the cheapest activity. Fast evidence is weak if the sample, conditions, proxy, or measurement does not match the question.

**In practice:** Before collecting evidence, state:

- the next decision;
- the assumption being examined and the consequence if it is false;
- what observation would count as evidence;
- what result would support continuing;
- what result would cause a change or stop;
- what the investigation will still leave unknown.

Define these before seeing the result. Otherwise it is easy to reinterpret the evidence after the fact.

An eval can provide evidence only about the cases and criteria it contains. It does not decide whether those cases and criteria define a good product. [`reference-example-is-not-ground-truth.md`]({{< ref "ai/operating-model/reference-example-is-not-ground-truth" >}}) explains this problem.

**Common mistake:** Running an experiment because experimentation is considered good practice, without saying which decision its result could change.

## 5. Match commitment to evidence, consequences, and reversibility


**What:** Decide how much evidence is needed by looking at the next commitment, not by using one evidence standard for all work.

A commitment is what we decide to do and accept responsibility for next. It may be another investigation, an implementation step, a limited release, or supported production use.

**Why:** A small reversible choice and a costly production obligation do not create the same consequences if they are wrong.

**Reasoning:** Evidence reduces uncertainty. It cannot prove that a solution will keep working or remain safe in every situation.

The evidence bar should usually be higher when:

- the possible harm is greater;
- the cost is greater;
- the change is difficult to reverse;
- many people or systems will depend on it;
- failure will be difficult to detect;
- the remaining uncertainty is important for the commitment.

Less evidence may be reasonable when the decision is small, reversible, observable, and contained.

Before seeking more evidence, ask whether the commitment itself can be made smaller, more contained, easier to reverse, and able to produce useful feedback.

The amount of risk in the situation and the amount of evidence needed for the next commitment are related, but they are not the same thing. A risky idea may still support a small, controlled test. Strong evidence may still be insufficient for a much larger commitment.

**In practice:** State:

- the commitment being considered;
- the cost and possible downside;
- how reversible it is;
- the evidence supporting it;
- the limits of that evidence;
- the uncertainty that will remain;
- why accepting that uncertainty is reasonable.

Evidence may support continuing, changing the solution, testing another assumption, choosing another solution, reducing scope, returning to the problem, stopping, or making a larger commitment.

**Common mistake:** Treating more evidence as an automatic reason to invest more.

## 6. Treat discovery and delivery as concurrent kinds of work


**What:** Distinguish discovery and delivery by their main purpose, not by when they occur.

- Discovery is work done mainly to reduce uncertainty that could change a decision.
- Delivery is work done mainly to build and operate product behavior intended for production use.

**Why:** Implementation exposes new constraints. Production provides evidence that prototypes cannot. New evidence can change the problem, the solution, or the intended behavior.

**Reasoning:** Discovery and delivery are not departments, environments, artifacts, or phases. A technical spike may be discovery. An experiment in production may also be discovery. Delivery work may reveal a question that needs investigation.

The amount of discovery should change with the current risks and unknowns. Familiar and reversible work may need very little. Uncertain and consequential work may need more.

> A production commitment changes the obligations attached to a solution. It does not end discovery and start delivery as sequential phases.

**In practice:**

- Let implementation findings change the current assumptions.
- Let production evidence change the solution.
- Use discovery when a delivery question cannot be answered responsibly by implementation alone.
- Do not assume there are no more questions because delivery has begun.
- Do not use delivery as the default test when cheaper credible evidence is available.

**Common mistake:** Treating discovery as a stage that must finish before implementation begins.

## 7. A production commitment creates defined obligations


**What:** Treat production commitment as a decision to accept responsibility for defined product behavior in real use.

**Why:** A prototype may be useful for learning while remaining incomplete, unreliable, unsafe, or unsupported. A production solution must be something people can depend on within its stated scope.

**Reasoning:** Production status is not determined by the language, repository, environment, level of polish, or whether a person or an AI system generated the code. It is determined by the obligations that have been accepted.

A production commitment should define:

- the users and situations supported;
- other people, systems, or parts of the wider environment that may be affected;
- the expected behavior;
- the supported and unsupported scope;
- the required quality and reliability;
- harm that must be prevented or limited;
- safety, privacy, security, capacity, and cost limits;
- what should happen when the system is uncertain;
- known remaining uncertainty;
- observation and failure detection;
- rollout and rollback;
- recovery and maintenance.

Automated controls may check or block actions. They do not remove human responsibility for what the product does.

Do not treat the name of a model, prompt, agent, or a reference example as a complete statement of these obligations. Those things may help build or check the product, but they do not say by themselves what people may rely on. Some implementation constraints or fixed output requirements are still part of the commitment when they are required for safety, privacy, security, audit, or a contract.

A commitment may narrow the situations it supports, the useful behavior it promises, or both. Those limits must be explicit. Narrowing the promise is not permission to drop the obligations that make the promised behavior dependable.

Supported scope may grow, shrink, or be withdrawn as evidence changes.

**In practice:** When making or changing a production commitment, ask:

- What can users rely on?
- In which situations?
- What is explicitly unsupported?
- How will failure be detected?
- How can exposure be limited?
- How can the change be stopped or reversed?
- What will be maintained after release?

**Common mistake:** Allowing an experimental artifact to become a supported system only because it already works in a production repository or environment.

A practical template is in [`production-commitment.md`]({{< ref "ai/operating-model/production-commitment" >}}).

## 8. Production is part of learning


**What:** Treat operation and observation as part of both delivery and continued discovery.

**Why:** Real use reveals behavior, inputs, dependencies, costs, failure modes, and user responses that pre-production work cannot fully reproduce.

**Reasoning:** Production can provide evidence that is unavailable elsewhere, but it does not remove uncertainty. Poor instrumentation, unrepresentative use, missing cases, and weak measures can still produce misleading conclusions.

Production evidence can concern different claims:

- whether the product provides the required enabling behavior;
- whether intended users can understand it and complete the relevant work;
- whether people choose and continue using it instead of the available alternatives;
- whether use changes the target condition;
- whether that change contributes to the broader result that motivated the work.

Evidence for one claim does not establish the next. These are questions for reasoning, not release stages. Promised product behavior may include both enabling behavior and the ability to complete the relevant work. Choice, change in the target condition, and the broader result usually remain claims to examine. In parallel, production must show whether its operating obligations hold and whether the stated harm limits are respected.

**In practice:**

- Observe the behavior and required conditions stated in the production commitment.
- Detect and review important failures and harm.
- Compare observed behavior with the stated production commitment.
- Watch for changes in inputs and operating conditions.
- Feed findings back into assumptions and decisions.
- Reconsider the intended behavior when evidence shows that the original intent was wrong.

Release is not completion. It puts a system into real use and creates a new source of evidence.

**Common mistake:** Treating evidence about product behavior, use, or one result as proof of all the other claims.

## Practical decision record


Use a record when the decision is important enough that its reasoning should remain visible.

```text
Current condition and change sought:

Decision to make:

Options considered:

Important assumptions and consequences if false:
- current condition and intended change:
- candidate solution:
- production and operation:

Evidence and its limits:

Decision and reason:

Remaining uncertainty:

Commitment and obligations:

What will be observed:

When to reconsider:
```


The record should be proportional to the decision. A small reversible change may need only a few lines. A consequential production commitment may need more.

## Limits


This model does not:

- guarantee that a solution will produce the desired result;
- prescribe one risk taxonomy;
- prescribe one research or experiment method;
- define a universal evidence threshold;
- remove the need for judgment;
- replace detailed evaluation, engineering, safety, or operational practices.

Its purpose is narrower: make the reasoning behind product decisions, evidence, commitments, and production obligations clear enough to examine and change.
