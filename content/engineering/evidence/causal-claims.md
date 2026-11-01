---
draft: false
toc: true
title: "Causal Claims Need a Comparison"
description: "A claim that a practice or tool caused an outcome needs a counterfactual: name the experiment that would settle it, then look for the confounders and the patterns that only look like effects."
linkTitle: "Causal Claims"
---

Part of [Evidence in software engineering]({{< ref "engineering/evidence" >}}).

## Association is not cause


This becomes important when someone moves from:

> "Teams using agents merged 30% more PRs."

to:

> "Agents caused a 30% productivity improvement."

Those are different claims.

## The target trial


Causal inference requires specifying the intervention, outcome, population, time period, competing intervention, and plausible confounders. Randomized experiments are the cleanest way of controlling many confounders. When randomization isn't feasible, causal-inference research uses observational and quasi-experimental designs while making the assumptions explicit. Harvard's CAUSALab, for example, uses the "target trial" idea: define an ideal randomized experiment, then structure the observational analysis to emulate it as closely as possible. ([Harvard Chan School](https://hsph.harvard.edu/research/causalab/ "CAUSALab | Harvard T.H. Chan School of Public Health"))

That transfers extremely well to engineering organizations.

Suppose a company says:

> "After adopting coding agents, feature delivery became 25% faster."

Before attributing that change to agents, ask what the hypothetical experiment would have been.

An example definition is:

`Population`: experienced backend engineers working on ordinary product tasks

`Treatment`: coding agent with defined model/tools/configuration

`Control`: existing IDE/tooling

`Outcome`: total human engineering time required for an accepted production change

`Assignment`: comparable tasks randomly assigned to treatment/control

`Follow-up`: 90 days after merge

Now the claim has a scientific meaning.

## Confounders


Without that framing, organizational data can have dozens of confounders: different projects, engineer skill, deadlines, team changes, improved tooling, task selection, management pressure, or engineers selectively using agents on easy work.

## Patterns that look like effects


Some patterns in organizational data look like the effect of a change without showing it. Each of these appears in the [Zalando case critique]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/zalando-case-critique" >}}):

- **A change after a date.** Many things change in the same period as the one being studied. Temporal coincidence provides a hypothesis, not a counterfactual.
- **Shares of a whole.** When categories sum to 100%, a fall in one raises the combined share of the others. A change in shares does not show whether any absolute count changed.
- **A change in mix.** An organization-wide trend can come from a change in which teams or projects are active, even when no team changes its behaviour.
- **A self-selected comparison.** Comparing the items a rule picked out with all items mixes the effect of the rule with whatever made those items get picked.
- **A mechanical effect.** Removing a step shortens the time the step took. The question is what the removal costs elsewhere.
- **Unclear exposure.** When it is not recorded which units received the treatment, some supposed controls were treated, and adoption looks like a clean break when it was gradual.

## Library sources


- [Trochim et al. 2016](/sources/research-methods/empirical-methods/trochim-2016-research-methods-essential-knowledge-base.pdf.enc), *Research Methods: The Essential Knowledge Base* -- causal inference and threats to internal validity; on *Research Design and Causality* (8.2) and *Quasi-Experimental Design* (ch. 10)
