---
draft: false
toc: true
title: "Independent Verification Workflows for Coding Agents"
description: "Tests and reviews that an LLM writes after its own code tend to repeat the code's assumptions. These workflows separate who defines correctness, who implements, and who tries to disprove the result, using fresh agents."
linkTitle: "Independent Verification"
---
## Why LLM-written tests are often weak


When a coding agent writes code and then writes tests for it, both come from the same understanding of the task. If that understanding is wrong, the tests encode the same mistake and pass. The harness notes list the common patterns:

- Tests reproduce the implementation's error because they were written from the implementation.
- Tests check implementation details (method calls, internal structure) instead of required behavior.
- Tests cover the happy path and miss the failures with the largest consequences.
- Mocks reproduce the code's assumptions, so the failure that matters is never exercised. [Testing a Change During Review]({{< ref "ai-engineering/agents/ai-assisted-development/testing-during-review" >}}) shows this with a timeout mock that never saves anything, which hides a duplicate charge after a lost response.
- Assertions are weak: a test would still pass against an obviously wrong implementation.
- The implementation overfits to the visible tests.
- Asked to "generate 20 edge cases", a model returns conventional, repetitive cases with no specific defect in mind.
- A self-review by the same agent confirms its own assumptions.
- The agent claims it ran checks without running them, or weakens tests and fixtures until they pass.

The same pattern appears in evaluation data. [Coverage and Case Design for AI Evaluation]({{< ref "ai-engineering/evaluation/framework-v1/coverage-and-case-design" >}}) notes that generated cases can be repetitive or shaped by the generating model, and [Building a Starting Set of User Inputs]({{< ref "ai-engineering/evaluation/framework-v2/cases-and-coverage" >}}) derives coverage from product guarantees, risks, and meaningful variation before generating any input. Generating expected outputs together with synthetic inputs carries the generator's assumptions into the evaluation set. Tests written after faulty code carry the coder's assumptions into the test suite in the same way. The harness notes cite an empirical study in which independently generated tests found more faults than tests generated after a faulty implementation; the link to the paper is missing from the saved notes.

## Three rules


The harness investigation reduces the design to three rules:

1. The implementer does not define correctness.
2. The reviewer does not trust the implementer's claims.
3. The LLM does not verify what the orchestrator can verify deterministically.

The first rule separates three kinds of agents: agents that define correctness, agents that implement, and agents that try to show the implementation is wrong.

## Deriving tests before implementation


Verification is designed from the requirements before any implementation exists, in three steps. Each step mirrors a step in the evaluation-set method:

| Verification | Evaluation set |
| :--- | :--- |
| Verification requirements | Coverage requirements |
| Test intents | Tuples (selected combinations of dimension values) |
| Executable tests | Concrete user inputs |

A **verification requirement** is a property the system must have, with its sources in the design (responsibilities, invariants, state transitions). For example: *an order cannot become confirmed without an approved authorization*. **Test intents** for it describe situations and expected results without naming any component or technology: a valid order with an approved authorization is confirmed; with a declined authorization it is not; with an authorization from another attempt it is not; with an unknown authorization outcome it is not.

Coverage comes from responsibilities, invariants, state transitions, boundaries, external interactions, and the consequences of critical failures. Candidate dimensions include prior state, input boundaries, external outcomes, repetition, interruption, concurrency, permission context, and compatibility. Combinations are generated only where behavior could differ, and existing tests, bug reports, and real problem inputs take precedence over synthetic cases.

A separate **test author** then turns selected intents into executable tests. Its rule is to choose the highest-level existing test seam that can observe the required behavior without reproducing implementation logic. Before a test is accepted, the author asks which minimal wrong implementation the test should fail against: a removed guard, a reversed comparison, an ignored attempt ID, a reused stale value, skipped persistence, success returned without the effect, or the effect performed twice. If the test would pass against that wrong implementation, the assertion is too weak.

## Three kinds of tests


- **Contract and behavior tests** are written independently before implementation. They are the main correctness check. The implementer can't change them; a mistaken expectation goes back to verification design.
- **Implementation-local tests** (a parser, a serialization helper) may be added by the implementer. They support the work but don't show that the feature is correct.
- **Challenge (holdout) tests** are hidden from the implementer during the first implementation. They are variants of known requirements (a different state, ordering, boundary, duplicate call, or external result), not new requirements. They check whether the implementation follows the requirement or only the visible examples.

Not all independent tests are hidden. Visible intents define the contract clearly enough to implement efficiently; holdouts check that the implementation generalizes, in the same way a baseline eval set and a set of hard cases play different roles.

## Adversarial roles


- **Breaker.** Its objective is to construct the smallest plausible defect that would violate a stated requirement while still passing the current tests. A prompt such as "review this implementation and find bugs" tends to produce ordinary code review instead.
- **Holdout attacker.** A fresh agent gets the requirements, dimensions, and visible intents, but first works without the implementation. It looks for different ways a system could violate the requirements while passing the visible intents, and only then may look at the code. It attacks only the supplied requirements and doesn't paraphrase existing intents or list edge cases without a defect hypothesis.
- **Verifiers and critics.** They report findings only and can't redesign. Each finding needs a concrete case where the result fails, or an artifact whose removal would change nothing. The shared verification prompt says to prefer no findings over speculative findings, which keeps reports from being padded.

## How isolation is done


The main problem the isolation addresses is anchoring: a reviewer that has seen the author's reasoning tends to agree with it, and a stage that knows the plan shapes its output to fit the plan. The workflows apply isolation in three places:

1. **Verify after build.** The verifier gets only the result and the original inputs of its stage, and tries to show the result is wrong.
2. **Two critics that don't see each other.** One walks the main workflow forward through the design; the other checks coverage, boundaries, failure behavior, feasibility, and minimality. Neither sees the other's findings, so their mistakes are less likely to overlap.
3. **A fresh re-check after a correction.** The second verifier doesn't see the first report, so it checks the corrected result again rather than checking only whether the earlier findings were fixed.

The mechanisms:

- **Fresh context for every stage.** The harness starts a separate `codex exec` process; `$rws` starts a subagent with `fork_turns=none`.
- **Content without paths.** Earlier results are pasted in as text under role labels such as "primary workflow". The agent never sees their file names or attempt numbers, so it treats them as input to judge.
- **A limited view of the process.** The task name is random, and the message doesn't mention workstreams, other stages, or why the output file exists.
- **One file to write.** The parent creates the output file in advance, and the agent may change only that file. All state stays with the parent.
- **Behavior-only views for test authors.** In the implementation pipeline, test authors and holdout designers get the task's behavior without the implementation plan.
- **Mechanical protection and deterministic gates.** Independent test files are hashed and can't be changed by implementation or repair agents. The user's check command, run by the orchestrator, decides RED, GREEN, and completion; a model's statement never replaces a passing command. Tools answer decidable questions (do the tests pass, does the dependency exist, which files changed, were tests deleted or skipped), and the LLM answers semantic ones.

## The design pipeline


The `hld` runner derives a high-level design in a fixed order of stages. Python code decides what runs next; no agent does.

```text
workflow -> verify-workflow
  -> conditions -> verify-conditions
  -> responsibilities -> verify-responsibilities
  -> state-interface -> verify-state-interface
  -> architect -> critic-workflow -> critic-architecture -> repair
```


The workflow stage fixes one actor, trigger, main path, and observable outcome. The conditions stage reasons backward from the outcome to the necessary behavioral conditions. The responsibilities stage finds the smallest set of behaviors the system must own. Each verifier may trigger one correction, followed by one fresh re-check; findings that persist fail the run. The repair stage weighs both critics' findings against product intent and project evidence. A run ends as `complete` (a design document), `needs_input` (questions for the owner), or `failed`.

## The implementation pipeline


The `implement` runner takes an accepted design and keeps the correctness track separate from the implementation track until each task's gates:

```text
baseline checks
  -> verification requirements -> visible test intents
  -> repository reconnaissance -> realization -> task plan
  -> freeze accepted inputs -> semantic alignment contract
  -> per task: alignment -> test author -> verification alignment -> RED
               -> implement -> GREEN -> bounded breaker/challenge/repair
               -> conformance -> final gate -> task reconciliation
  -> integration test author -> final checks -> workflow alignment -> closure
```


Verification is derived before the repository is inspected, so the correctness criteria don't depend on how the code is currently structured. Specialist attackers (security, concurrency, recovery, performance, migration) run only when the design contains that risk. A separate conformance reviewer checks fit with the design, reuse, scope, and minimalism after behavior passes. A `delivery` runner coordinates several such trajectories in parallel worktrees and adds a trial against the real running system.

## Two ways to run the workflow


| | `agent-harness` | `$rws` skill |
| :--- | :--- | :--- |
| Location | `~/projects/skills/agent-harness` | `~/projects/skills/agent-workflow/src/agent_workflows/eml/skills/rws` |
| Who picks the next stage | Python code, in a fixed order | You, one stage at a time in a chat |
| Isolation | Separate `codex exec` process per stage, read-only sandbox for design and review roles | Subagent with no inherited conversation; shares the filesystem with the parent |
| Coverage | Design, implementation, and parallel delivery pipelines | Design stages, including verifiers, critics, and repair; no automatic correction step |
| Records | `data/hld-runs/`, `data/delivery-runs/` | Workstream folders with one file per stage attempt |

The stage prompts in `$rws` came from the harness, which is why `_correction.md` still contains `{{phase}}` placeholders. The `$rws` skill tells the parent never to work out the current stage from saved state.

## Current state


- **Harness runs.** Of 13 design runs in `data/hld-runs/` (2026-08-11 to 2026-08-12), 1 completed, 7 failed, 3 ended with questions, and 2 have no result file. None of the 6 delivery runs completed: 3 ended with questions, 2 failed, and 1 has no result. There is no `data/implementation-runs/` folder. The mechanisms are implemented, but these runs don't show how well the approach works.
- **Uncommitted work.** `agent-harness` has uncommitted changes to its delivery, design, and implementation prompts and runners. In `agent-workflow`, the handoff dated 2026-08-13 says the source changes were never committed, and the repository has one commit.
- **`$rws` stage table.** As of 2026-11-14, `SKILL.md` registers all twelve stages, including the three remaining verifiers (`verify-conditions`, `verify-responsibilities`, `verify-interface`), the two critics, and `repair`. A new stage-inputs table lists which earlier results each stage gets and under which label, copied from the harness's prompt code. It also states that the critics never see each other's results and that a verifier never sees an earlier verification result. The installed `eml@personal` plugin has the new stages only after a reinstall. The correction prompts (`_correction.md`, `_validation-correction.md`) still aren't connected to any stage, and the `roles/` folder is empty.
- **Open limits from the handoff.** Two parallel `$rws` calls can reserve the same output file name, and which results count as successful is partly a judgment call.

## Limitations to keep in mind


[Backward Design And Independent Verification]({{< ref "engineering/engineering-review-framework/backward-design-and-independent-verification" >}}) lists the limits of this approach. A wrong framing propagates into both design and tests. Fresh context is only one kind of separation: different agents can share the same assumptions, and separate processes don't automatically produce independent evidence. Isolation can also remove facts a test needs, which leads to unrealistic mocks or missed consumers. Passing checks support only the scenarios they cover.

## Related notes


- [Backward Design And Independent Verification]({{< ref "engineering/engineering-review-framework/backward-design-and-independent-verification" >}}): the approach in the review framework; its source links point to this harness.
- [Engineering Review Framework: Assessment and Trial]({{< ref "engineering/engineering-review-framework/workflow-trial-and-recommendations" >}}): a trial on a payment-retry change, with proposed revisions to property, failure, and test reasoning.
- [Review Agents, Skills, and Tools]({{< ref "engineering/engineering-review-framework/review-agents-skills-and-tools" >}}) and the [Review Tools And Skills Catalog]({{< ref "engineering/engineering-review-framework/review-tools-and-skills-catalog" >}}): where `agent-harness` and `rws` fit among other review tools.
- [Testing a Change During Review]({{< ref "ai-engineering/agents/ai-assisted-development/testing-during-review" >}}): a worked example of a test that misses the failure that matters.
- [Common Mistakes in AI-Assisted Development]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}}) and the [Llm Specific Review Guide]({{< ref "engineering/engineering-review-framework/llm-specific-review-guide" >}}): the failures these workflows try to catch.
- [Coverage and Case Design for AI Evaluation]({{< ref "ai-engineering/evaluation/framework-v1/coverage-and-case-design" >}}) and [Building a Starting Set of User Inputs]({{< ref "ai-engineering/evaluation/framework-v2/cases-and-coverage" >}}): the evaluation-set method the verification design copies.
- [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) and the [reading-map]({{< ref "ai-engineering/agents/sdlc/reading-map" >}}).

## Sources


Local files inspected on 2026-11-14:

- Harness: README, product concepts, architecture.
- Harness investigation: verification-engineering branch (LLM failure modes, three kinds of tests, breaker, deterministic gates), dual-track orchestration (visible and holdout intents), verification analyst and test strategist (holdout attacker, mutation thought experiment), per-task loop.
- `$rws`: SKILL.md, shared verification rules, workflow critic, architecture critic, repair, [[handoff]].
