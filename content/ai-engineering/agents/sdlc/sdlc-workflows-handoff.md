---
draft: false
toc: true
title: "Handoff: SDLC Workflows and the Deliberate Approach"
description: "Handoff brief synthesizing the domain-modeling and SDLC workflow reasoning from prior threads so the next agent can write sdlc-workflows-and-approach.md cleanly without re-mining thread logs."
linkTitle: "SDLC Workflows Handoff"
---
## 3. Synthesized Content Blueprint for `sdlc-workflows-and-approach.md`


Use the structure and substance below (synthesized from the earlier conversation logs and the vault notes). Keep prose clear, concrete, and grounded rather than repetitive.

### Section 1: Why Start from SDLC Workflows Before `AGENTS.md` Rules


- **Core premise:** Do not start by listing rules for `AGENTS.md` or optimizing abstract agent properties in isolation. A software assistant does not merely emit text or diffs--it participates inside human engineering workflows.
- **Two distinct goal planes:**
  - **Plane 1 -- Product, Engineering & Workflow Goals (Primary):**
    1. Make deliberate engineering cheaper and more natural than the "generate-and-accept" shortcut.
    2. Keep decision-making and trade-offs explicit and human-owned (product scope, architecture, contracts, risk boundaries, production commitments).
    3. Maintain traceability across `intent -> assumptions -> design rules -> code -> failure-mode verification -> operation`.
    4. Preserve and compound team understanding--preventing simultaneous **technical debt**, **comprehension (cognitive) debt**, and **intent debt** ([project-ownership.md]({{< ref "ai-engineering/agents/project-ownership" >}}), citing Storey 2026 and Tavantzis et al. 2026).
    5. Deliver dependable production behavior within explicit limits (production-commitment.md).
  - **Plane 2 -- Agent-System & Environment Goals (Instrumental):**
    1. *Alignment with local reality* (feedforward guidance toward local sources of truth and conventions).
    2. *Fast self-correction* (inner-loop feedback via commands, linters, structural checks, and tests).
    3. *Evidence-backed outputs and clear escalation* (carrying verification evidence and stopping at human-owned decisions).
    4. *Reliable autonomy*--completing meaningful units of work within an assigned step *only while Plane 1 goals hold*.
- **Vault synthesis:** Note how this unifies threads previously scattered across discovery-and-delivery.md, production-commitment.md, design-and-delivery.md, goals.md, [project-ownership.md]({{< ref "ai-engineering/agents/project-ownership" >}}), the [Building with AI]({{< ref "ai-engineering/agents/ai-assisted-development" >}}) series, the Engineering Review Framework, and the long-standing goal in reflection_2024_q3.md (*"Strengthen SDLC Practices: write guides on creating and analyzing requirements and on designing complex systems"*).

### Section 2: How Engineering Workflows Actually Work (Discovery & Delivery Baseline)


- **Discovery and Delivery by purpose, not waterfall stage** (discovery-and-delivery.md):
  - **Discovery:** Work done mainly to reduce uncertainty that matters to a decision.
  - **Delivery:** Work done mainly to build, verify, release, and operate behavior people can rely on in production.
  - Both overlap continuously: implementation exposes hidden constraints; production provides evidence unavailable locally.
- **The recurring commitment loop:**
  `frame the decision -> act within justified limits -> inspect the result -> revise the next commitment`
  Ask: *Is the evidence sufficient for the next commitment, given its cost, consequences, reversibility, and remaining uncertainty?*
- **Six connected lifecycle activities:**
  1. Problem & Product Framing
  2. Investigation & Uncertainty Reduction (including bug triage & diagnosis)
  3. Trade-Off Analysis & System Design
  4. Implementation & Refactoring
  5. Verification, Testing & Review
  6. Release, Operation & Environment/Knowledge Upkeep
- **Dual output of a healthy workflow:**
  1. A **dependable system in production** with explicit supported behavior, limits, failure handling, and recovery.
  2. **Shared team understanding and ownership** of *what* the system does, *why* choices were made, and *how* it can fail.

### Section 3: How People Use and Misuse Software Assistants in SDLC Workflows


- **The default "Generate-and-Accept" shortcut:**
  `Vague ticket/prompt -> Agent generates code & tests -> Tests pass & explanation sounds fluent -> Human merges`
- **Why LLMs amplify this shortcut:** An LLM acts by default as a **single-path completion engine**--it silently picks one interpretation of an ambiguous requirement, commits to its first plausible design or bug hypothesis, buries trade-offs inside confident prose, and writes tests from the same assumption.
- **Five breakdown mechanisms:**
  1. *Skipped framing ("ready-fire-aim"):* Guessing unclear product intent instead of surfacing open choices ([common-mistakes.md]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}})).
  2. *Accidental design & symptom patching:* Sticking with the first idea, adding unnecessary abstractions, or piling retries/locks onto a broken assumption.
  3. *Circular verification:* Code, mocks, and PR explanations all share the same false premise (e.g., mocking a timeout before any server write occurs, missing the lost-response-after-commit case).
  4. *Shift from cognitive offloading to cognitive surrender:* Letting the assistant lead before forming a mental model reduces comprehension ([project-ownership.md]({{< ref "ai-engineering/agents/project-ownership" >}}), citing Osmani 2026, Martin-Lopez et al. 2026, Alakmeh et al. 2026).
  5. *Three simultaneous debts:* Technical debt (code), comprehension/cognitive debt (team), and intent debt (unrecorded goals, constraints, and rationale).
- **Side-by-side table:** Contrast *Suboptimal Shortcut ("Generate & Accept")* vs. *Deliberate Workflow with a Software Assistant* across all six lifecycle activities.

### Section 4: The Approach -- Core Elements of Deliberate Work Across All Workflows


Explain why this discipline sits between *Goals* and *Types of Work* and governs **all** non-trivial tasks (product framing, bug investigation, design, coding, review)--not just big architecture docs:

1. **Separate Epistemic Status (Knowns vs. Observations vs. Assumptions vs. Open Questions):**
   - Distinguish *agreed requirements/invariants*, *observed current behavior* (which may contain bugs), *assumptions/hypotheses* (and what breaks if false), and *open questions* that affect the next decision.
2. **Generate Multiple Options or Competing Hypotheses:**
   - Counteract single-path completion. In design, compare distinct alternatives including the smallest/simplest viable change ([review-process.md]({{< ref "ai-engineering/agents/ai-assisted-development/review-process" >}})). In bug resolution/investigation, list competing root-cause hypotheses and competing fix levels (symptom guard vs. caller fix vs. contract/design change).
3. **Analyze Trade-Offs Against Shared Requirements:**
   - Compare options under the *same* required properties and constraints (workflow-trial-and-recommendations.md): correctness under partial failure/interruption, blast radius, compatibility, operational/rollback cost, and code complexity.
4. **Run Targeted, Discriminatory Checks Before Committing:**
   - When an unknown could flip the choice between options or hypotheses, run a focused check first (read the contract, query logs/traces, write a minimal reproducer, measure a workload) rather than building a full implementation on a guess ([system-design-decisions.md]({{< ref "ai-engineering/agents/ai-assisted-development/system-design-decisions" >}}), [working-with-an-agent.md]({{< ref "ai-engineering/agents/ai-assisted-development/working-with-an-agent" >}})). Keep prototype conveniences separate from production choices.
5. **Make Decision Points, Ownership, and Preservation Rules Explicit:**
   - Treat consequential choices as explicit checkpoints: *What is being decided? Who owns it (assistant for routine local details vs. product/architecture owner for scope, invariants, contracts, risk)? What must downstream implementation preserve? What would trigger reconsideration?*
6. **Work Backward from Outcomes and Verify Independently:**
   - *Backward derivation:* `Product framing -> intended outcome & workflow -> necessary conditions -> system responsibilities -> design` (backward-design-and-independent-verification.md).
   - *Independent verification:* `Required properties -> consequential failure scenarios -> test intents & expected observations -> executable checks`. Ask *"Would this test fail if the plausible defect were present?"* and state both what was checked and what remains unchecked ([testing-during-review.md]({{< ref "ai-engineering/agents/ai-assisted-development/testing-during-review" >}})). Also attempt to disprove findings by checking upstream/surrounding protections before asserting a defect (workflow-trial-and-recommendations.md).
7. **Revisit Earlier Decisions When Evidence Disproves an Assumption (Proportional Rigor):**
   - Trace failed assumptions back to the design or requirement choices that depend on them instead of patching around a broken premise ([code-review.md]({{< ref "ai-engineering/agents/ai-assisted-development/code-review" >}})).
   - Scale ceremony to **consequence, uncertainty, and reversibility** (framework-rationale-and-use.md).

Include:

- **Cross-Workflow Matrix:** How Elements 1--7 manifest in *Product Framing*, *Investigation & Bug Resolution*, *System Design*, *Implementation*, and *Verification & Review*.
- **Worked Contrast (Bug Resolution & Retry Correctness):** Contrast naive symptom patching vs. deliberate multi-hypothesis diagnosis using the vault's payment-retry / lost-response-after-commit example from [testing-during-review.md]({{< ref "ai-engineering/agents/ai-assisted-development/testing-during-review" >}}) and workflow-trial-and-recommendations.md (recording completion *after* remote charge risks duplicate debit `2` when response is lost; flipping to record *before* charge eliminates duplicates but creates `0` debits if interrupted before the call; durable provider deduplication with a stable operation key preserves `1` across interruptions).

### Section 5: Taxonomy and Anatomy of the Six SDLC Workflow Types


Provide a summary comparison table plus a focused subsection for each of the six work types covering:

- *Purpose & triggers*
- *How people & assistants run it well (vs. common shortcut)*
- *Explicit decision points & owner*
- *Inputs / environment resources needed by the assistant*
- *Primary output / lightweight working record*
- *Baseline checks vs. acceptance ("done") criteria*

The six workflow types:

1. **Product Framing & Scoping** ([product-framing.md]({{< ref "ai-engineering/agents/ai-assisted-development/product-framing" >}}), production-commitment.md)
2. **Investigation, Triage & Bug Diagnosis** ([working-with-an-agent.md]({{< ref "ai-engineering/agents/ai-assisted-development/working-with-an-agent" >}}), [common-mistakes.md]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}}))
3. **System Design & Planning** ([system-design-decisions.md]({{< ref "ai-engineering/agents/ai-assisted-development/system-design-decisions" >}}))
4. **Implementation & Refactoring** ([ade.md]({{< ref "ai-engineering/agents/environment/ade" >}}), [command-layer.md]({{< ref "ai-engineering/agents/environment/command-layer" >}}))
5. **Verification, Testing & Review** ([review-process.md]({{< ref "ai-engineering/agents/ai-assisted-development/review-process" >}}), [code-review.md]({{< ref "ai-engineering/agents/ai-assisted-development/code-review" >}}), [testing-during-review.md]({{< ref "ai-engineering/agents/ai-assisted-development/testing-during-review" >}}), engineering-review-framework.md)
6. **Release, Operation & Environment/Knowledge Upkeep** (production-commitment.md, [ade.md]({{< ref "ai-engineering/agents/environment/ade" >}}), build-protocol.md)

### Section 6: How Workflows Connect -- Participants, Substrates, Nested Loops, and Coordination


- **Active Participants vs. Passive Substrates:**
  - *Human roles:* Intent/Product Owner, System/Architecture Owner, Reviewer, Environment Maintainer.
  - *Assistant roles:* Collaborator/Executor, Independent Checker/Reviewer, Upkeep/Cleanup Agent.
  - *Substrates:* **Agent Harness / Runtime** (loop, model, tools, context management, `allow/ask/deny` permissions) vs. **Agent Development Environment (ADE) & Repository** (subject system + running stack/logs, knowledge layer, command & control layer).
- **Four Nested Process Loops & Non-Linear Back-Transitions:**
  1. *Framing & Specifying Loop*
  2. *Session Execution Loop (Inner Loop)*
  3. *Verification & Review Loop (Middle Loop)* -- routes back to Investigation, Design, or Framing when an assumption fails
  4. *Operation & Environment/Knowledge Maintenance Loop (Outer Loop)* -- turns production learning and repeated agent friction into tests, commands, structural checks, canonical docs, or `AGENTS.md` updates
- **Five Coordination Mechanisms & Implications for `AGENTS.md`:**
  1. Progressive disclosure (routing map vs. deep docs)
  2. Epistemic authority (source-of-truth hierarchy; current code behavior vs. intended behavior)
  3. Feedforward guidance vs. mechanical enforcement
  4. Decision ownership & escalation boundaries
  5. Cross-session & cross-tool continuity (`plan.md`, `handoff.md`, decision records, change rationale with `trigger`, `expected effect`, `removal condition`)
  - Conclude by tying back to the three jobs of `AGENTS.md` (*Where to look*, *What differs here*, *What done means*) across all six workflows rather than coding alone.

---

## 4. Related Notes


The list of related notes moved to the [Reading Map]({{< ref "ai-engineering/agents/sdlc/reading-map" >}}), with links that work from this folder. The inline links in section 3 still use paths from an older folder layout.
