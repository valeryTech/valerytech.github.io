---
draft: false
toc: true
description: "The original question about framing collaboration among humans, models, and software while balancing useful constraints with architectural freedom."
title: "01 Problem Framing"
linkTitle: "01 Problem Framing"
---
# Original framing question


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

These initial questions concern collaboration among people, models, and software. Later analysis separates the proposed system from the [general research scope]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}).

<a id="retained-prompt"></a>

## Initial questions and constraints


Open question: What approaches could frame the problem?

The existing sources discuss neuro-symbolic representations.

The system should be considered as several components, rather than a single component.

Open question: What counts as behavior in this system? One or more components could be people whose workflows the system augments. The components collaborate to solve one or more tasks, with human augmentation as a goal.

The initial framing treats current and possibly next-generation LLMs as both probabilistic and generative components that can generate possible scenarios. Intelligence is one capability among others.

Open question: Should the problem be framed by constraining selected aspects, as in programming or Unix-style composition?
