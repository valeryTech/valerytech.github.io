---
draft: false
toc: true
title: "Decision Records for Uncertainty"
aliases:
  - "/ai/product/product-model/experimentation-apparatus/"
description: "A proposed record system for AI uncertainty preserves approach decisions, problem reformulations, and possibility judgments, linking experiment logs to durable reasons for continuing, changing, or abandoning work."
linkTitle: "Decision Records"
---

The apparatus should use records in the same family as ADRs: lightweight, durable, and focused on decisions. They should capture *why* something was stopped or reformulated, not only what was tried. Ordinary experiment trackers and model cards rarely preserve the reasoning behind a change in direction.

A practical apparatus has the following parts.

### 1. Core record types


Three specialized records, all short and ADR-like in spirit:

**A. Approach Record (AR)**

Used when the team adopts, significantly changes, or stops a concrete approach or recipe.

Required fields:

- Target capability / problem statement (at the time)
- Approach description (what was tried)
- Rung at the time (Possibility / Approach / Feasibility...)
- Key hypotheses being tested
- Evidence gathered (hard probes, metrics, qualitative failure modes)
- Decision: Continue / Modify / Kill
- Reasons for the decision (especially structural vs engineering failures)
- Consequences / what this implies for the problem or next approaches
- Links to related experiments and later records

**B. Reformulation Record (RR)**

Used whenever the problem itself is rewritten in a material way.

Required fields:

- Previous formulation
- New formulation
- What evidence or constraint discovery forced the change
- What was abandoned and what was preserved
- Impact on current approaches and evaluation
- Date and authors

**C. Possibility Judgment (PJ)**

Used for explicit assessments of whether a capability still looks attainable.

Required fields:

- Precise possibility question
- Current judgment (leaning possible / uncertain / leaning not attainable soon)
- Main lines of evidence (probes, decompositions, limits)
- Binding intermediate capabilities still open
- What would most change this judgment
- Decision: keep investigating / reformulate / park / kill the goal

These three cover the critical moments: adopting/killing methods, changing the problem, and updating belief about possibility.

### 2. Supporting log (not a full tracking system)


**Experiment Log entries** that are forced to feed the records above.

Minimal required fields per significant experiment:

- Linked Approach Record (or "exploratory")
- Hypothesis under test
- Hardest instances used
- Observed qualitative failure modes (structured tags help: coherence collapse, recovery failure, tail brittleness, etc.)
- What the result implies for the approach or the problem formulation
- Explicit note: does this evidence suggest staying, modifying, killing, or reformulating?

The log is the raw material; the AR / RR / PJ records are the durable decisions.

### 3. Lightweight protocol (the actual operating rule)


- Any decision to **kill an approach** requires a completed Approach Record.
- Any **material change to the problem statement** requires a Reformulation Record.
- Any explicit update to "is this still attainable?" requires a Possibility Judgment.
- Records are immutable once written (append-only clarifications allowed).
- They live in the same place the team already looks for technical decisions (next to ADRs or in the same docs system).
- Review is lightweight: the record is the review. No separate ceremony unless the decision has large resource consequences.

### 4. Naming and placement


Avoid soft process language. Treat them as engineering artifacts:

- Approach Records
- Reformulation Records
- Possibility Judgments
- (Optional) Constraint Log: a running list of discovered hard constraints that surviving approaches must respect

The set can be called **Decision Records for Uncertainty**, or each record type can keep its own name. The important point is that the records are first-class, searchable, and linked.

### 5. Why this works


ADRs capture architectural choice under relatively stable requirements.

These records capture choice under shifting possibility, collapsing solution spaces, and forced reformulation. Those are the actual dynamics of early-rung AI work.

They create organizational memory of *why* paths died and *how* problems evolved. Without them, teams repeatedly rediscover the same dead ends and lose the reasoning that should compound.

This is the minimal apparatus. It can later connect to richer evaluation systems and observability, but it already provides durable, reviewable traces of the decisions that matter most on the ladder.

## Library sources


- [Jansen and Bosch 2005](/sources/c9fd193b0b3901dc6fdd32f621d82604.bin), *Software Architecture as a Set of Architectural Design Decisions* -- on *Decision records for uncertainty*

Further reading:

- [Capilla et al. 2016](/sources/9205b55a215c638546426e3bddcab4f6.bin), *10 years of software architecture knowledge management* ([doi:10.1016/j.jss.2015.08.054](https://doi.org/10.1016/j.jss.2015.08.054))
