---
draft: false
toc: true
title: "Discipline in AI Product Work"
description: "A cross-note reading map linking assumptions, proportionate experiments, evaluation, and decision records, with a distinction between experiment-led roadmaps and evidence for the next commitment."
linkTitle: "Discipline"
---

A possible common thread through the notes is:

**Problem and outcome -> concrete assumption -> evidence needed for a decision -> experiment when needed -> interpret the result -> continue, change, or stop.** Production use then supplies evidence for the next decision.

### Best places to read


|Topic|Note and relevant passage|
|---|---|
|**Hypotheses and risk**|Operating model (line 113) separates an assumption, its evidence, remaining uncertainty, and the consequence of being wrong. Its decision section (line 170) asks what result would change the next action _before_ collecting evidence.|
|**What makes an experiment disciplined**|Development approaches (line 9) connects a hypothesis, controlled change, representative conditions, evaluation method, expected evidence, and decision. It says experimentation is a mode used for material uncertainty, rather than a mandatory phase.|
|**Moving fast within discovery and delivery**|Discovery and delivery (line 26) describes a short loop: frame the decision, act within justified limits, inspect, and revise the next commitment.|
|**Evaluation as part of the discipline**|Goals of AI Evaluation (line 18) distinguishes the method for deciding what evidence means from the people, cases, tools, and routines that produce it. Findings inform decisions; they do not make product decisions by themselves.|
|**Why observation is necessary**|AI Systems Require Behavioral Evidence (line 15) explains why inspecting an AI system's implementation cannot establish its behavior across realistic conditions.|
|**A concrete working loop**|AI Products Need Evals, Not Just Tests (line 260) lays out baseline -> evals -> failure inspection -> targeted change -> regression check -> release and production feedback. It also has a small experiment-record template (line 319).|

### Related pieces


- Disciplined AI Experimentation (line 1) is the most direct note about the _discipline_: making iteration controlled, observable, reproducible, and useful for decisions. It is a rougher draft than the operating model.
- Development approaches: roadmap management (line 105) mixes hypotheses and experiments with capability milestones, product increments, and production readiness as uncertainty changes. Decision records for uncertainty (line 1) proposes how to retain the reasoning behind changing or abandoning an approach.
- Organizational principles (line 9) extends hypothesis-driven work to **the team's methods themselves**, as well as the AI product. The promotion note (line 17) names evaluation methodology, experimentation discipline, and openness to learning as desired conditions for a role.

**One distinction for the later perspective refactor:** the older "experiments vs. features" piece (line 18) argues strongly for experiment-led roadmaps. The newer operating model is more precise: run an experiment when it can resolve an important uncertainty for a decision, and scale the evidence to the next commitment. Operating model (line 202), development approaches (line 1)
