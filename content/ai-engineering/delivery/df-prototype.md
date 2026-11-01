---
draft: false
toc: true
title: "Baseline, Prototype, and Feasibility"
description: "Defines a thin, instrumented end-to-end baseline for testing feasibility, establishing deterministic foundations, and comparing later changes before production hardening."
linkTitle: "Baseline and Prototype"
---
### Objective


Create a working, reproducible baseline that exercises the real workflow and tests the feasibility of the proposed system before production hardening.

### Purpose


Specifications cannot resolve every uncertainty in an AI system. Ad hoc implementation creates architecture by speculation, anecdotal tuning, and changes without a stable reference. A thin, instrumented baseline makes uncertain assumptions executable and provides a reference against which later experiments and evaluations can be compared.

The baseline may use no ML, limited AI behaviour, or a deliberately simple model. Its purpose is to establish an executable reference and answer feasibility questions, rather than maximize model quality.

### Feasibility questions


- Can the representative workflow run end to end?
- Are the required interfaces, data, permissions, and knowledge sources available?
- Can the necessary context be assembled with adequate provenance and freshness?
- Is the proposed model or model class sufficiently capable?
- Are latency, cost, and capacity plausibly within bounds?
- Can executions be reproduced and compared?
- Can failures be attributed to specific components or decisions?
- Can the required safeguards, fallback paths, and human controls be implemented?

### Key decisions and activities


- implement the deterministic domain, service, API, storage, validation, and permission foundations;
- build the smallest end-to-end vertical slice through the actual user workflow;
- add the minimum AI behaviour needed for the slice;
- avoid building a generalized AI platform before the vertical slice requires it;
- version prompts, models, schemas, retrieval configuration, tools, and relevant data assets;
- connect the system to an evaluation harness;
- capture traces and intermediate artefacts required for replay, comparison, and diagnosis;
- create an initial representative and risk-relevant case set;
- establish baseline product, behavioural, quality, cost, and latency measurements;
- use [disciplined experimentation]({{< ref "ai-engineering/approach/experimentation" >}}) to test consequential architectural and behavioural assumptions;
- record failed assumptions, limitations, and experiment results.

### Outputs


- a runnable end-to-end vertical slice and deterministic product foundation;
- versioned prompts, models, schemas, tools, retrieval configuration, and relevant data identity;
- reproducible executions with captured traces and intermediate artefacts;
- an evaluation-harness integration capable of comparing candidate changes with the baseline;
- baseline product, behavioural, quality, cost, latency, and reliability measurements;
- known limitations, failed assumptions, and an experiment log;
- evidence supporting or rejecting the proposed feasibility assumptions.

Requirements are validated here. A requirement may prove ambiguous, infeasible, unnecessary, incomplete, or incorrectly prioritized. Such findings trigger re-entry into Product Framing or System Design.

### Exit evidence


Proceed when representative workflows run end to end and can be repeated; important configuration and dependencies are versioned; the system emits enough evidence to inspect its behaviour; baseline measurements exist; major feasibility questions have answers; known limitations are recorded; and consequential uncertainties are explicit experiments rather than implicit guesses.

### Re-entry conditions


Revisit this phase when runs are not reproducible, important evidence is missing, variance prevents comparison, experiments invalidate implementation assumptions, or evaluation and production failures point to an actionable code, prompt, retrieval, tool, model, or data change that should first be reproduced in the baseline.

## Library sources


- [Babushkin and Kravchenko 2025](/sources/39e0cbe26b72ead73bbe6633505b42c1.bin), *Machine Learning System Design*
- [Zinkevich 2016](/sources/903c644dfdc4b32ef0ad55c8393288d6.bin), *Rules of Machine Learning: Best Practices for ML Engineering*

Further reading:

- Thompson 2023, *Delivering Machine Learning Projects: From Design to Deployment*
