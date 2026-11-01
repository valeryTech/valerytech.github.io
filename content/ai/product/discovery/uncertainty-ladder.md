---
draft: false
toc: true
title: "Uncertainty Ladder"
description: "Five kinds of unknown stand between an idea and its intended effect: whether it can be done, how, within constraints, in the real environment, and to any effect. For one claim, the ladder names which are open and what evidence would close each."
linkTitle: "Uncertainty Ladder"
---
## Purpose


"We do not know whether this will work" can mean five different things:

- nobody knows whether it can be done at all;
- it has been done, but nobody has a method that does it repeatably;
- the method works, but not under our cost, time, or reliability limits;
- it works in a controlled setting, but nobody knows what breaks in the real environment;
- it works, and nobody uses it, or they use it and nothing changes.

These call for different work, different time horizons, and different commitments. Treating one as another wastes effort: a team adds engineering effort to a problem that has no known method, or runs research on a problem whose only open question is cost.

The ladder names the five kinds of unknown. For one claim, it asks which are still open and what evidence would close each.

It applies to any undertaking: a product, an internal tool, a measurement instrument, a research programme, a change in how an organization works. AI work is treated at the end as a case in which the early rungs are open more often than usual, and reopen.

## The five rungs


| Rung | Question | Form the unknown takes | Evidence that closes it | Work it calls for |
| --- | --- | --- | --- | --- |
| **1. Possibility** | Can this be done at all, with means we can reach? | Nobody has shown it. There may be a reason nobody can. | An existence proof: the result on hard, representative instances under the most favorable conditions, with cost ignored and hand-steering allowed. | Probes on hard instances, decomposition into necessary parts, limit analysis. |
| **2. Approach** | Do we know how? | It has been done, but not repeatably, or not without an expert steering it. | A fixed, written-down method that gets the result on held-out instances with no hand-steering. | Generating, testing, and killing candidate methods. |
| **3. Feasibility** | Does the method hold under our constraints? | It works in the demo. Cost, latency, tail cases, data availability, and robustness are unknown. | The method meets the stated constraints on realistic inputs. A map of where it stops holding. | Constraint tests, trade-off probes, tail-performance evaluation. |
| **4. Operation** | Does it survive the real environment, and can its outcome be verified? | Nobody knows what breaks at scale, over time, with real people and real dependencies. | Behavior and required conditions observed in real use within limits. Failures detected. Outcomes verified against external state, not against the action that was taken. | Limited exposure, observation, recovery, maintenance. |
| **5. Value** | Is it chosen over the alternative, and does it change what it was meant to change? | It works and is not used. Or it is used and the target condition does not move. | Use chosen over the current alternative. A measured change in the target condition. | Comparative studies, controlled use, field evidence. |

The order is one of logical dependence: a method presupposes possibility, constraints presuppose a method. It is not an order of work. Evidence at a later rung is often cheaper to get first, and often changes what the earlier rungs mean. The bar that defines "possible" comes from value: what the result has to be for anyone to want it.

In conventional work, rungs 1 and 2 are usually closed before planning begins, and plans deal with 3 to 5. Where 1 or 2 is open, the planning posture has to change, because there is nothing yet to estimate.

## What the ladder is not


**Not stages.** Several rungs are open at once for most undertakings. A stand-in for the solution (a person doing the work by hand) can test value before possibility is settled. Operation can be probed with a narrow release before feasibility is fully mapped. Closing one rung can reopen another: a cheaper alternative appearing elsewhere reopens value while approach is still being worked.

**Not a process.** The ladder says what kind of unknown is in the way. The [`risk model`]({{< ref "ai/product/risk-areas/risk-areas-model" >}}) says how to turn it into an assumption, a consequence, evidence, and a decision.

**Not the solution utility ladder.** The [`solution utility ladder`]({{< ref "ai/product/operating-model/solution-utility-ladder" >}}) names what one solution must do, as progressively stronger claims (U1 to U7). This ladder names what is unknown about getting there. Any utility claim can be open at any rung: a U3 claim may be open at possibility, a U2 claim open only at feasibility.

**Not a rank of maturity.** "The project is on rung 4" is rarely true. Most undertakings are a mix: some claims closed through operation, others still open at approach.

## Ask per claim, not per undertaking


"Which rung are we on?" cannot be answered for a whole undertaking. "Which rungs are open for this claim, in this situation, at this bar?" can.

A claim is one behavior, in one stated situation, at one stated bar. The utility ladder and coverage table give the claims. For each, record which rungs are open:

```text
Claim:
Situation (coverage):
Bar:

Possibility:  open | closed (evidence, date) | not in question
Approach:     open | closed (evidence, date) | not in question
Feasibility:  open | closed (evidence, date) | not in question
Operation:    open | closed (evidence, date) | not in question
Value:        open | closed (evidence, date) | not in question

Next rung to work, and the probe:
Result that would move the decision:
Reconsider when:
```


Keep the record proportional. For most claims, three of the five lines read "not in question".

To choose the next rung, work the open rung whose result could change the next decision, and among those the one that is cheapest to probe. That is often not the lowest open rung. The [`risk model`]({{< ref "ai/product/risk-areas/risk-areas-model" >}}) decision loop is the same rule applied to assumptions.

### Example

```text
Claim:        Drafts replies to billing-dispute tickets that support agents send with light edits.
Situation:    English-language billing tickets, current product catalogue, refunds under the agent's own limit.
Bar:          At least 70% of drafts sent with light edits or none. No draft states a wrong refund amount.

Possibility:  closed (2026-10-20): 40 of the hardest tickets from last quarter, strongest available
              model, a support lead steering the prompt per ticket, cost ignored. 33 met the bar,
              none had a wrong amount.
Approach:     open: the result depends on the lead adjusting the prompt per ticket. No fixed
              pipeline yet.
Feasibility:  not in question: a draft costs cents against minutes of agent time, and drafts are
              written in the background, so latency does not bind.
Operation:    open, not yet worked.
Value:        open: agents may find editing a draft slower than writing from scratch.

Next rung to work, and the probe: value. For one week, the lead writes drafts by hand (a stand-in
              for the system) for six agents' billing tickets.
Result that would move the decision: fewer than half of stand-in drafts sent with light edits.
              Then stop, or reformulate to drafting only the refund calculation.
Reconsider when: a new model release (approach), or a change in the ticket mix.
```


Value comes before approach here because a week of stand-in drafts can stop the work, while closing approach would take longer and could not.

### Three tests that separate the rungs


The first four rungs are the ones most often confused. Three tests separate them.

| Boundary | Test |
| --- | --- |
| Possibility closed, approach open | An expert steering by hand, with cost ignored, can get the result on hard instances. Nobody can yet write down how. |
| Approach closed, feasibility open | A fixed, written-down method gets the result on held-out instances with no hand-steering. It has not been shown to meet the stated constraints. |
| Feasibility closed, operation open | The method meets the stated constraints, including reliability and robustness targets, on realistic inputs in a controlled setting: a test set, a replay of real traffic, a staged environment. It has not run in real use, with real people, real dependencies, and time passing. |

Each test names an observation. If neither of the first two has been made, the claim is open at possibility, whatever has been built. If the third has not been made, operation is open, however well the method does on the test set. Reliability and robustness belong to feasibility when measured in the controlled setting and to operation when observed in real use; the same target can be closed at one and open at the other.

## Working the possibility rung


Possibility here is relative to means that can be reached: the models, tools, data, people, and budget available to this undertaking. The budget limits how much probing can be done. It does not limit the cost of a single run inside an existence probe, which is ignored. Whether something is possible in principle is a different question, and usually not the one that matters.

### Formulate the question


A possibility question that can be answered has four properties:

- **About the capability, not a solution.** "Can reliable multi-step behavior on tasks of type Y be reached at all?", not "Can we build it with framework X and model Z?"
- **Outcome-defined.** The bar is stated: quality level, reliability level, input distribution, acceptable failures. A vague bar makes possibility unanswerable.
- **Scoped to the means.** Current means, or means expected within a stated horizon.
- **Falsifiable.** There is evidence that would make "probably not reachable soon" the honest conclusion.

> Is [capability, at bar] reachable with [means] on [input distribution], or is there reason to believe it is not?

### Run an existence probe


1. Collect or construct the hardest realistic instances of the target. Not the convenient ones.
2. Run under the most favorable conditions: the strongest means available, unlimited iteration, a person allowed to steer, cost ignored.
3. Read the failures qualitatively. A quantitative shortfall (right kind of result, not enough of it) and a qualitative gap (never recovers from its own errors, loses the goal, invents what it does not know) are different evidence.
4. Decompose. Name the two to four intermediate abilities any solution would need. Test the hardest of them alone. If a necessary intermediate is open at possibility, the whole claim inherits it.
5. Conclude with one of: closed positively; closed negatively, with the date and the means; narrowed, naming the intermediate that blocks; reformulated, naming the nearby claim that does look reachable.

This is deliberately cheap relative to the work it protects. Its purpose is to stop large efforts on claims whose possibility is open, and to turn ambition into a claim that can be attacked.

### Verdicts expire


A negative result is relative to the means available on the date. Record the date and the means. Keep the probe instances. Rerun them when the means change: a new model, new data, a new tool. "Reconsider when: means change" belongs on every negative verdict.

### Common mistakes at this rung


- Treating one failed approach as evidence of impossibility.
- Treating a demonstration on favorable instances as evidence of possibility.
- Leaving the bar vague, so no result can settle anything.
- Testing only the full target and never the hardest intermediate.
- Reading "nobody has done it" as "it cannot be done".

### When the probe is not enough


If existence probes fail at the bar and the claim matters, the question becomes a research question. Then the heavier methods apply: formal limit analysis, trying a different paradigm to see whether the barrier moves, structured elicitation from people who have worked near the frontier, and reference-class comparison with capabilities that looked blocked before they were not. Most undertakings never need these. Reaching for them before running an existence probe is a mistake.

## Signs that a rung has been misjudged

### Check the measurement first


Many signals of deep uncertainty are produced by a weak instrument, not by the problem:

- a small or noisy test set produces non-monotonic progress and high sensitivity to small changes on its own;
- a proxy metric that stops tracking real usefulness is a measurement failure by definition;
- a rubric written before any failures were observed yields nothing to learn from;
- an evaluator that agrees with reviewers 95% of the time at a 5% failure rate may have caught no failures at all.

Treat the evaluation as a claim with its own open rungs. Until it is sound, the signals below cannot be read.

Once it is sound, error analysis is the tool that reads them: look at individual failures, sort them by cause, and see whether the dominant causes are fixable (a missing instruction, missing context, a retrieval miss) or persist across methods. Only the second kind points to an early rung.

### Signals and the rung they point to


| Pattern | Likely open rung |
| --- | --- |
| Failures are structural and stable across several methods: the same qualitative gap under different recipes | Possibility |
| Many methods look promising and fail for the same underlying reason | Possibility, or early approach |
| An expert can get the result; nobody can write down how | Approach |
| It works in the demo; the production bar is not reachable at the cost or latency | Feasibility |
| Experienced people cannot assign a probability or a horizon | Possibility |
| Actions complete and nobody can tell whether the outcome occurred | Operation |
| It is used and the target condition does not move | Value |
| The goal keeps being rewritten under pressure, late | Early rungs were skipped |

When several of these appear together, the correct response is not more engineering effort. It is to name the open rung and run the probe for it.

## Measuring progress on the early rungs


Progress on rungs 1 and 2 produces different artifacts from delivery work:

- a sharper claim and bar;
- evidence from hard-instance probes;
- a map of constraints found;
- a reformulated goal;
- a decision to continue, change, or stop, with the result that would cause each named before the run.

The unit of progress is uncertainty reduced on a named claim. Counting experiments run is a proxy for this, and a tolerable one only while the options are unknown and no decision can yet be named. Once a decision can be named, the test for any experiment is whether its result could change that decision. At every rung, state before running what result would move you.

## Organizational mismatch


Pressure to adopt a new technology pushes undertakings onto the early rungs whether the organization is ready or not. Roadmaps with dates, and demos expected to become systems through ordinary effort, assume rungs 1 and 2 are closed. Where they are not, the result is demos that look like progress, do not close any rung, and end in "it does not work here" or the next round of pilots.

The pressure is not the problem. Treating early-rung work as late-rung delivery is. What changes:

- **Name the open rung per claim in every plan.** Dates are promised only for claims closed through feasibility. Claims open at earlier rungs get a time-boxed probe with the decision it informs and the result that would end it.
- **Report early-rung artifacts, not features.** Leadership sees what is promised, what is being learned, and why the two differ.
- **Protect the capacity.** Early-rung work is cheap and slow. Collapsing its timeline does not speed it up; it skips it.
- **Share the language.** "Open at approach" has to mean the same thing to engineering and to the people funding it.

## Relation to the other notes


| Rung | In the [`risk model`]({{< ref "ai/product/risk-areas/risk-areas-model" >}}) | In the [`utility ladder`]({{< ref "ai/product/operating-model/solution-utility-ladder" >}}) and [`production commitment`]({{< ref "ai/product/operating-model/production-commitment" >}}) |
| --- | --- | --- |
| Possibility, approach, feasibility | Feasibility dimension, as assumptions. Rungs 1 and 2 are "whether" and "how" in the risk model's definition of learning work. | Mostly enabling claims U1 to U4, one claim at a time. |
| Operation | Production and operation area. Assumption form before the commitment; obligation form after it. | A production commitment does not close this rung. It accepts the remaining uncertainty within limits and states what will be observed. |
| Value | Value dimension and the intended change, kept separate. | U6 and U7. |

Work on an open rung is discovery. Work to meet an obligation on a closed one is delivery ([`discovery-and-delivery.md`]({{< ref "ai/product/operating-model/discovery-and-delivery" >}})). The same concern moves from one to the other when its rung closes.

The capability notes ask the same per-claim question from the other side. Their [`inference ladder`]({{< ref "ai/capabilities/00-the-inference-ladder" >}}) names what is inferred in saying a system can do something. [`Capability claims and empirical method`]({{< ref "ai/capabilities/empirical-method-map" >}}) lines up the two ladders rung by rung.

## Related frameworks


| Framework | What it shares | Where it differs |
| --- | --- | --- |
| Technology Readiness Levels (NASA, DoD, MLTRL) | TRL 1-2 is possibility, 3 approach, 4-6 feasibility, 7-9 operation | A single maturity scale for a whole technology; no value rung; sequential by design |
| R&D definition of scientific or technological uncertainty (UK tax guidance, Frascati) | "Whether something is possible, or how to achieve it in practice" is exactly rungs 1 and 2 | A test for what counts as research, not a working tool |
| Stage-Gate for Technology Development (Cooper) | Early phases as uncertainty reduction, because a solution may not yet be envisionable | Gates are sequential |
| Eugene Yan's time-boxed experiment roadmaps | Data-feasibility window is roughly rungs 1 and 2, technical-feasibility window rung 3, prototype and A/B window rung 5. Each window ends in continue, pivot, or kill | Windows run in sequence; operation has no window of its own |
| Cagan's four product risks (value, usability, feasibility, viability) | Value and feasibility; the insistence that value is tested first | Feasibility is one bucket; the three early rungs are not separated |
| Knightian uncertainty vs risk | Possibility often has a Knightian character: the outcomes cannot be listed. Later rungs become ordinary risk | A property of the uncertainty, not a map of its kinds |
| Epistemic vs aleatoric uncertainty | Early rungs are epistemic; operation mixes both | Same |

## Where AI differs


AI does not need a different ladder. It stresses four parts of this one.

**The early rungs are open more often.** Capabilities are jagged: adjacent tasks sit on different sides of what current models can do, and the boundary is not visible from the outside. Many undertakings that would be a feasibility question elsewhere are a possibility question here, and are planned as if they were delivery.

**Verdicts expire fastest.** Means change every few months. A negative verdict at possibility is a dated statement about a model generation. Keep the probe set; rerun it on each release.

**The approach rung reopens.** A recipe tuned to one model version may not transfer to the next. A closed approach rung carries the version it was closed on.

**The measurement is itself on the ladder.** Whether an automated evaluator can be trusted at the bar is a possibility question, closed only by validation against trusted human judgments on held-out cases, including boundary cases. Until it is closed, the signals in the diagnostic section cannot be read, and most apparent deep uncertainty is a bad instrument.

For a product team, possibility is relative to the models it can call. The existence probe (best available model, unlimited prompting, a person allowed to steer, cost ignored, hard representative instances) usually answers it in days. The research-grade methods are for the cases where that probe fails at the bar and the claim still matters.

## Open questions


- Gate criteria beyond the three tests above: what observation closes operation, and how much real use is enough, in a form that works across undertakings.
- A view across many claims and undertakings for the people funding them: which rungs are open where, and what is promised versus being learned.
- Whether this note belongs under `ai/discovery/` or in a general place that the AI notes link to.

## Sources


Hamel Husain on why feature roadmaps fail for AI ([source](https://hamel.dev/blog/posts/field-guide/)). Bryan Bischof's capability funnel ([`experiments-vs-features.md`]({{< ref "ai/product/product-model/experiments-vs-features" >}})), which in these notes became the [`capability funnel`]({{< ref "ai/product/operating-model/working-notes/capability-funnel" >}}) working note and then the [`solution utility ladder`]({{< ref "ai/product/operating-model/solution-utility-ladder" >}}). Eugene Yan's time-boxed, experiment-based roadmaps, also in [`experiments-vs-features.md`]({{< ref "ai/product/product-model/experiments-vs-features" >}}). The earlier dialogue-derived draft of this note, with its longer treatment of research methods for possibility and the comparison with established frameworks, is kept as research support in [`uncertainty-ladder-sources.md`]({{< ref "ai/product/discovery/uncertainty-ladder-sources" >}}).

## Library sources


- [Nahar et al. 2023](/sources/ml-engineering/se-for-ml/nahar-2023-meta-summary-challenges-ml-products.pdf.enc), *A Meta-Summary of Challenges in Building Products with ML Components* ([arXiv:2304.00078](https://arxiv.org/abs/2304.00078)) -- on *Organizational mismatch*

Further reading:

- [Mohsin et al. 2025](/sources/ai-foundations/capabilities-and-measurement/mohsin-2025-fundamental-limits-of-llms-at-scale.pdf.enc), *On the Fundamental Limits of LLMs at Scale* ([arXiv:2511.12869](https://arxiv.org/abs/2511.12869))
- [Pita 2026](/sources/ai-foundations/capabilities-and-measurement/pita-2026-correct-codes-wrong-reasons.pdf.enc), *Correct codes for the wrong reasons? Validating LLMs as measurement instruments for theoretical constructs* ([arXiv:2606.28574](https://arxiv.org/abs/2606.28574))
- [Shojaee et al. 2025](/sources/ai-foundations/capabilities-and-measurement/shojaee-2025-illusion-of-thinking.pdf.enc), *The Illusion of Thinking*
- [Kalinowski et al. 2024](/sources/ml-engineering/se-for-ml/kalinowski-2024-naming-the-pain-ml-enabled-systems.pdf.enc), *Naming the Pain in Machine Learning-Enabled Systems Engineering*
- [Popper 1959](/sources/research-methods/philosophy-of-science/popper-1959-logic-of-scientific-discovery.pdf.enc), *The Logic of Scientific Discovery*
