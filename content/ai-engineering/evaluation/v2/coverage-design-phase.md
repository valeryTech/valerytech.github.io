---
draft: false
toc: true
title: "Coverage Design Phase"
linkTitle: "Coverage Design Phase"
---

We could reframe the existing user-input work as an upstream coverage-design phase, with user inputs as one artifact, and connect it bidirectionally with failure understanding.

## Role in Discovery and Delivery


The coverage method remains the same, but its source and purpose change.

|Context|Coverage starts from|Main purpose|
|---|---|---|
|**Discovery**|Provisional solution behaviour, feasibility and safety hypotheses|Expose whether the proposed behaviour is plausible and where it fails|
|**Productization decision**|Proposed production scope and known behavioural boundaries|Make residual behavioural uncertainty visible|
|**Delivery development**|Production Slice Contract and targeted change hypothesis|Compare a candidate with the baseline and detect regressions|
|**Release**|Committed behaviour, guarantees, invariants, production constraints|Produce release-relevant evidence|
|**Production**|Active product scope and defined live population|Observe real behaviour, outcomes, drift, and new failure conditions|
|**Quality Understanding**|Known failure modes, ambiguous cases, and coverage gaps|Refine cases, contrasts, criteria, and regression protection|

In Discovery, a small diagnostic or challenge set may be enough to answer a feasibility question.

In Delivery, the set becomes more stable because it must protect committed behaviour.

In production, the team also needs a declared sampling method. A curated offline case set and a production sample support different claims.
