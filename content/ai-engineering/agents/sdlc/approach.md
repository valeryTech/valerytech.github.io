---
draft: false
toc: true
title: "Features of a Good Approach to Engineering Work"
description: "Ten practices for reasoning and deciding in any engineering task, grouped by the four parts of the problem-solving cycle, with one rule for scaling their depth, examples for each of the six activities, and why assistants need them."
linkTitle: "Approach"
---

This note describes the Approach: the reasoning and decision-making practices for any engineering task, such as framing a feature, investigating an incident, fixing a bug, designing a system, reviewing a change, or releasing it. Goals say why we work, [activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) say what we work on, and the Approach says how we work. The features apply with or without an assistant. They started as step 5 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}); step 12 there explains why they're grouped by the problem-solving cycle. The [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) treats them as hypotheses that real tasks test.

## Why Assistants Need This


By default, an LLM follows a single path. Given a prompt, it picks the first plausible interpretation, commits to the first plausible hypothesis or design, treats unverified assumptions as facts, hides trade-offs inside fluent output, and writes checks that confirm its own assumption. People do the same under time pressure, and an assistant makes it cheaper: the ["generate and accept" shortcut]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) skips framing, choosing, and looking back. The features below counter this habit in every activity.

## The Features


The features are grouped by the four parts of the [problem-solving cycle]({{< ref "ai-engineering/agents/sdlc/cycles" >}}#the-problem-solving-cycle): frame, choose, act, and look back and learn. One rule applies across all parts.

### Frame


1. **Start from the outcome.** State what result is needed and how we'll know we have it. Derive what the work needs from that outcome, and question anything the outcome doesn't need. For a feature, the outcome is a change in what users can do; for a bug fix, the correct behavior; for an investigation, an answer that a decision depends on; for a review, a decision to merge, request changes, or escalate.
2. **Separate what is known, what is assumed, and what is unknown.**
   - **Agreed constraints:** what must hold, such as requirements, contracts, and limits.
   - **Observed facts:** what was seen, and where. Current behavior can include bugs, so it can differ from intended behavior.
   - **Assumptions:** what we believe without having checked, and what breaks if it's false.
   - **Open questions:** unknowns whose answer could change the next decision.

### Choose


3. **Consider more than one option or explanation.** Don't stop at the first plausible one, and include the smallest option that could do the job. In an investigation, the options are competing hypotheses. In a bug fix, they include guarding the symptom, fixing the caller, and changing the contract. In framing, they include a smaller scope and not building anything.
4. **Compare the options against criteria that fit the situation.** The criteria depend on the work. A design compares correctness under failure, compatibility, complexity, and operating cost. A fix compares how complete it is with what else it could break and how easily it can be undone. An investigation compares how much a check would narrow the hypotheses with what the check costs. Write the criteria down, so the trade-off is visible to whoever owns the decision.
5. **Before committing, check the uncertainty that would change the choice.** If different answers to an open question would lead to different options, run a small check first: read the contract, run a reproducer or a query, or build a small prototype. Skip checks whose answer wouldn't change the choice.
6. **Make the decision explicit and give it an owner.** State what is being decided and which option is chosen. Routine local choices stay with the assistant or the implementer. Unclear requirements, architecture trade-offs, contract changes, and accepting risk go to the responsible person, with the options and trade-offs stated. Record what later work must preserve and what would make us reconsider.

### Act


7. **Act within the decision, in steps small enough to check and undo.** Carry out the chosen option without widening it. Keep each step small enough that its result can be checked before the next one, and when the consequences are large, choose steps that can be undone: a prototype before a full build, or a narrow release before a wide one. If acting shows that the decision needs to change, stop and go back to choosing.

### Look Back and Learn


8. **Check the result independently of the explanation.** Treat explanations, from a person or an agent, as claims to check. Base the checks on the outcome and on the failures that matter, with nearby variations, so they don't repeat the author's assumption. State what was checked and what remains unchecked.
9. **When an assumption fails, revisit the decisions that depend on it.** Trace which decisions rest on the failed assumption and revise them. Don't pile retries, locks, or local patches around a broken premise. The revision can send work to an earlier part of the cycle or to an earlier activity: a design assumption that fails during implementation goes back to design.
10. **Record what was learned where the next task will find it.** Decisions, contracts, findings, and repeated mistakes go where the team and the agent will look: decision records, docs, checks, commands, or `AGENTS.md`. This keeps the team's understanding, which is the second output of the [engineering workflow]({{< ref "ai-engineering/agents/sdlc/workflows" >}}), and gives the Engineering Knowledge Loop and the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) cases to compare.

### Across All Parts: Scaling the Depth


Scale the depth of each feature to the consequence, uncertainty, and reversibility of the work. A small step that's easy to undo needs brief framing and a quick check. A consequential step, or one that's hard to undo, needs several options, stronger evidence, and a decision by its owner.

## The Features in Each Activity


The table shows what each feature looks like in each of the six [activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}). [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}#the-cycle-inside-each-activity) shows the four parts of the cycle in each activity.

| Feature | Framing | Investigation | Design decisions | Implementation | Verification and review | Release and operation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Start from the outcome** | Name the change in what users can do, and check that each proposed feature serves it | State the decision the answer will feed | Derive the needed parts from the intended behavior, and question extra machinery | Know what the change must make true before writing it | Derive checks from the intended behavior and the failures that matter | State what people may rely on after release and how we'll see that it holds |
| **2. Known, assumed, unknown** | Separate agreed requirements from current behavior, assumptions, and open product choices | Separate observed symptoms and logs from candidate causes | Separate verified system and API behavior from design assumptions | Separate what the code shows from what the plan assumed | Separate what the tests exercised from what the PR description claims | Separate measured production behavior from expected behavior |
| **3. More than one option** | Consider other ways to meet the need, including a smaller scope or no build | List competing hypotheses for the cause | Compare useful alternatives, including the simplest that meets the requirements | Consider the smallest change that fits the design before broader ones | Ask whether a simpler approach or a different boundary would avoid the issue | Compare rollout options, such as a flag, a narrow audience, or a full release |
| **4. Criteria that fit** | Weigh user value against scope and support obligations | Weigh how much a check narrows the hypotheses against its cost | Weigh failure handling, consistency, latency, operating cost, and complexity | Weigh a smaller diff against duplicated or broken structure | Weigh blocking risks and code health against delivery urgency | Weigh rollout speed against how many people a failure would affect and the cost of recovery |
| **5. Check before committing** | Test the assumption that could invalidate the product direction | Run a reproducer, a log query, or a trace to rule hypotheses in or out | Test the API behavior, constraint, or workload the design relies on | Try an unfamiliar API in a small check before building on it | Exercise the failure mode that matters, such as a response lost after commit | Rehearse the migration and the rollback before the release |
| **6. Explicit decision and owner** | Send open product choices to the owner without guessing | Decide explicitly whether the cause is proven | Record the chosen option, its trade-offs, and what implementation must preserve | Stop and ask when a choice goes beyond the agreed design | State a merge, request-changes, or escalate decision | Make the release decision, its owner, and the rollback trigger explicit |
| **7. Act within the decision** | Draft the brief within the agreed scope, with open choices marked as open | Run one check at a time and record each result | Prototype the riskiest part before the full design | Make small changes and run baseline checks after each | Run the checks independently of the author | Release to a narrow scope first, with monitoring and a way to roll back |
| **8. Check independently** | Check that the brief lets the next step proceed without guessing intent | Check that the explanation predicts behavior beyond the first example | Review the design against failure scenarios its author didn't list | Make sure tests don't mock away the assumption the code depends on | Derive checks independently of the implementation's logic, and state what wasn't checked | Check the effect in production traces and metrics |
| **9. Revisit when an assumption fails** | Narrow or revise the commitment when evidence contradicts the brief | Drop a disproven hypothesis; send a broken design assumption to design | Revisit the decision when an assumption behind it fails | Send a broken premise back to design without patching around it | Send a broken premise back to design or requirements | Roll back or narrow the scope when production disproves an assumption |
| **10. Record what was learned** | Keep the brief, the decisions, and the open questions | Record what was observed and what remains unknown | Record the decision and its reasons, for example in a decision record | Update the docs and contracts the change affects | Leave a review record with the evidence | Turn incidents and repeated mistakes into checks, docs, commands, or `AGENTS.md` lines |

## Related Notes


Notes on review and design:

- [review-process.md]({{< ref "ai-engineering/agents/ai-assisted-development/review-process" >}}): eight review steps in lifecycle order. Step 1 resolves an unclear requirement with the responsible person, and step 4 asks whether a simpler approach would be better.
- [code-review.md]({{< ref "ai-engineering/agents/ai-assisted-development/code-review" >}}): follows the chain from the problem to the affected system, the design, and the implementation, and treats explanations as claims to check.
- [system-design-decisions.md]({{< ref "ai-engineering/agents/ai-assisted-development/system-design-decisions" >}}) and [common-mistakes.md]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}}): comparing useful alternatives, testing consequential assumptions, recording what implementation must preserve, and avoiding sticking with the first solution or patching around a broken assumption.
- [Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}), especially [framework-rationale-and-use.md]({{< ref "engineering/engineering-review-framework/framework-rationale-and-use" >}}) (gather enough context to choose a solution, keep assumptions visible, and scale the depth to consequence and reversibility) and [backward-design-and-independent-verification.md]({{< ref "engineering/engineering-review-framework/backward-design-and-independent-verification" >}}) (work backward from outcomes to necessary conditions, and verify independently around consequential failure scenarios).

General notes:

- Problem-solving framework: the four parts of the cycle, with trade-off analysis and the decision in the second part.
- [Discovery and Delivery]({{< ref "ai/product/operating-model/discovery-and-delivery" >}}): frame before acting, learn after acting, and use evidence to choose the next commitment.
- [My Perspective on AI Engineering]({{< ref "ai-engineering/approach/my-perspective" >}}): the enabling principles, including honesty about what we know and willingness to learn and change.
- [AI Engineering Working Assumptions]({{< ref "ai-engineering/working-assumptions" >}}): LLMs generate proposals, and evidence decides which ones to keep.
- [Cycles in Engineering Work]({{< ref "ai-engineering/agents/sdlc/cycles" >}}): the problem-solving cycle and the other cycles of engineering work.

## Appendix: Earlier Version from Step 5


This is step 5 of the [Reasoning Log]({{< ref "ai-engineering/agents/logs-reasoning" >}}) as it was before the features were regrouped by the problem-solving cycle, kept for comparison. Only the headings changed level and the link paths changed to work from this folder.

> *User note:* We need to introduce the features of a good approach: explicit decision points, considering different options, choosing between them, and explicitly considering trade-offs. This isn't only for software design. We also use these elements (explicit decisions and the analysis of several options or hypotheses) when we resolve bugs, search for something, or investigate.

Between **Goals** (*why* we work) and **Activities** (*what* we work on) sits **The Approach**: the reasoning and decision-making discipline that governs *how* we work with an assistant in any task--whether framing a feature, investigating an incident, resolving a bug, designing a system, or reviewing a change.

### A. Where This Connects to Existing Notes in the Vault


Previously, no single note in the vault covered SDLC phases, explicit decision points, and multi-option/trade-off analysis together across all activities. Pieces of this discipline appear in several places:

- **[review-process.md]({{< ref "ai-engineering/agents/ai-assisted-development/review-process" >}})** walks through eight review steps in lifecycle order (*agree on what should change \(\rightarrow\) read the relevant system \(\rightarrow\) find affected parts \(\rightarrow\) check design \(\rightarrow\) check implementation \(\rightarrow\) test important behavior \(\rightarrow\) check deployment and recovery \(\rightarrow\) write review conclusion*). Step 1 makes the explicit-decision rule clear: if an unclear requirement would lead to different implementations, resolve it with the responsible person rather than quietly picking whichever reading fits the code already written. Step 4 asks whether a simpler approach would be better.
- **[code-review.md]({{< ref "ai-engineering/agents/ai-assisted-development/code-review" >}})** follows the same chain from problem \(\rightarrow\) affected system \(\rightarrow\) design and implementation, and adds the rule to **treat explanations as claims to check** because code, tests, and PR descriptions can all repeat the same mistaken assumption.
- **[system-design-decisions.md]({{< ref "ai-engineering/agents/ai-assisted-development/system-design-decisions" >}})** and **[common-mistakes.md]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}})** cover comparing useful alternatives, testing consequential assumptions, recording what implementation must preserve, and avoiding the trap of sticking with the first solution or patching around a broken assumption.
- **[Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}})**--especially **[framework-rationale-and-use.md]({{< ref "engineering/engineering-review-framework/framework-rationale-and-use" >}})** ("Before implementation": gather enough context and requirements to choose a solution, keep assumptions visible, scale depth to consequence and reversibility) and **[backward-design-and-independent-verification.md]({{< ref "engineering/engineering-review-framework/backward-design-and-independent-verification" >}})** (work backward from outcomes to necessary conditions; verify independently around consequential failure scenarios).

Unifying these elements here turns them into a general cross-lifecycle approach for human-agent collaboration.

### B. Why This Layer Matters Especially with AI Assistants


By default, an LLM is a **single-path completion engine**: given a prompt, it picks the first plausible interpretation, commits to the first plausible hypothesis or design, treats unverified assumptions as facts, buries trade-offs inside fluent output, and writes checks that confirm its own assumption.

A good approach counteracts that single-path bias at every step--not only in architecture, but in **bug resolution, investigation, product framing, implementation, and review**.

### C. Seven Core Features of a Good Approach


1. **Separate What Is Known from What Is Assumed**
   - Explicitly distinguish:
     - **Agreed requirements / invariants** (what must hold)
     - **Observed facts / current behavior** (what the system actually does today, which may include bugs)
     - **Assumptions / hypotheses** (what we think is true, and what breaks if it is false)
     - **Open questions** (unknowns that could change the next decision)
2. **Generate Multiple Options or Hypotheses (Avoid Single-Path Tunnel Vision)**
   - Never jump straight to the first plausible code change or explanation.
   - In **design**, compare genuinely useful alternatives, always including the *simplest/smallest change* that can do the job.
   - In **investigation and bug resolution**, list competing hypotheses for the root cause and competing options for the fix (e.g., local symptom guard vs. fixing the caller vs. revising the contract/design).
3. **Analyze Trade-Offs Explicitly**
   - Compare options against the criteria that matter for the situation: correctness under failure, blast radius, compatibility, operational/rollback risk, added complexity, and cost/effort.
4. **Run Targeted Checks to Resolve Consequential Uncertainty Before Committing**
   - When different answers to an open question or assumption would change the choice between options, run a focused check first (inspect the contract, run a query/reproducer, build a small prototype, or test timeout behavior) rather than building a full solution on a guess.
5. **Make Decision Points and Ownership Explicit**
   - Treat decisions as explicit stops rather than letting the agent silently slide from ambiguity into implementation:
     - *What decision is being made now, and which option is chosen?*
     - *Who owns it?* (Routine local choices stay with the assistant/implementer; unclear requirements, architecture trade-offs, contract changes, and risk acceptance go to the responsible person with options and trade-offs stated.)
     - *What must downstream work preserve, and what would make us reconsider?*
6. **Work Backward from Outcomes and Verify Independently** *(cf. [backward-design-and-independent-verification.md]({{< ref "engineering/engineering-review-framework/backward-design-and-independent-verification" >}}))*
   - **Backward derivation:** Derive necessary conditions and responsibilities from the intended outcome and workflow, questioning unnecessary machinery.
   - **Independent verification:** Treat explanations (whether from a person or an agent) as claims to check. Design checks around consequential failure modes and nearby variations, and explicitly state **what was checked and what remains unchecked**.
7. **Revisit Earlier Decisions When Evidence Disproves an Assumption (Proportional Rigor)**
   - When an investigation, implementation detail, or test disproves an assumption, trace which decisions depend on it and revise them--rather than piling on retries, locks, or local patches around a broken premise ([common-mistakes.md]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}})).
   - Scale the depth of all these steps to the **consequence, uncertainty, and reversibility** of the work ([framework-rationale-and-use.md]({{< ref "engineering/engineering-review-framework/framework-rationale-and-use" >}})).

### D. How These Features Apply Beyond System Design (Across Activities)


| Feature of the Approach | In Product Framing | In Investigation & Bug Resolution | In System Design & Implementation | In Verification & Review |
| :--- | :--- | :--- | :--- | :--- |
| **1. Facts vs. Assumptions vs. Unknowns** | Separate agreed requirements from current behavior, assumptions, and open product choices | Separate observed symptoms/logs from candidate causes and untested assumptions | Separate verified API/system behavior and hard constraints from design assumptions | Separate what tests actually exercised from what the PR description claims |
| **2. Multiple Options / Hypotheses** | Consider different ways to solve the user's job (including smaller scope or non-AI options) | Formulate competing root-cause hypotheses; compare symptom patch vs. root-cause fix | Compare useful alternatives, including the simplest design that meets requirements | Ask whether a simpler approach or different boundary would avoid the issue |
| **3. Explicit Trade-Offs** | Weigh user value vs. scope complexity and support obligations | Weigh fix completeness vs. blast radius, regression risk, and rollback safety | Weigh consistency, failure handling, latency, operational burden, and code complexity | Weigh blocking risks and long-term code health against delivery urgency |
| **4. Targeted Check Before Committing** | Test the key assumption that could invalidate the product direction | Run a reproducer, log query, or trace check to rule hypotheses in or out before editing code | Test the specific API behavior, constraint, or workload the design relies on | Exercise the consequential failure mode (e.g., lost response after commit) |
| **5. Explicit Decision Points & Ownership** | Escalate open product choices to the owner instead of guessing | Decide explicitly whether the root cause is proven and which fix approach to take | Record the chosen option, trade-offs, and **what implementation must preserve** | State an explicit merge / request-changes / escalate decision |
| **6. Backward Derivation & Independent Check** | Check that every proposed feature is necessary for the user's workflow | Verify the fix against the bug *and* valid variations so it doesn't just mask the example | Ensure tests don't mock away the very assumption the code depends on | Derive failure-mode checks independently of the implementation's logic; state what wasn't checked |
| **7. Revisit When an Assumption Fails** | Narrow or revise the commitment when evidence contradicts the brief | Drop a disproven hypothesis; escalate to design if the bug reveals a broken architecture assumption | Stop patching around a failed assumption; revisit the design decision it supported | Send a broken premise back to design/requirements rather than patching lines in PR review |
