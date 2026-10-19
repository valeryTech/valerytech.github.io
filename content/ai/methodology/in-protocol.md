---
draft: false
toc: true
title: "In Protocol"
linkTitle: "In Protocol"
---
# AI Engineering Evidence Protocol


AI engineering needs an evidence culture because probabilistic systems are easy to evaluate poorly. Reports of heavy coding-agent adoption or high merged-PR counts do not establish better engineering outcomes. Overengineering, hallucinated assumptions, and downstream maintenance costs require explicit investigation.

A team could double merged PRs while increasing review time, defects, complexity, incidents, and maintenance cost. Once merged PRs become a target, splitting work into agent-friendly PRs can increase the count without increasing useful output.

A protocol adapted from experimental science should organize evidence around precise claims. It can support architecture reviews, vendor assessments, conference reports, internal experiments, and assessments of practitioner expertise.

For any serious claim such as:

> "Coding agents increased engineering productivity by 35%."

The supporting evidence should cover:

1. **State the claim precisely.** What improved? Lead time? Engineer hours? Production reliability? Cost? "Productivity" by itself isn't measurable.
2. **Describe the population.** Which repositories, languages, engineers, task types, time period, and agents? A result on dependency upgrades says little about designing a distributed system.
3. **Describe the intervention.** Agent, model version, prompts, tools, context available, approval rules, test environment, and human involvement.
4. **Define metrics before looking at the result.** Otherwise it's extremely easy to find a metric that moved in the desired direction.
5. **Have a baseline or control.** Compare comparable work with and without the agent. Ideally randomize tasks or engineers where practical.
6. **Measure downstream effects.** At minimum, include:
    - engineer time per completed task
    - reviewer time
    - number of review iterations
    - defects after merge
    - rollbacks/reverts
    - production incidents
    - rework during the following weeks/months
    - test failures or regressions
    - complexity/size of the resulting change
    - infrastructure and model cost
7. **Report failures.** What percentage of tasks did the agent fail? Where did humans abandon the generated solution? What classes of task consistently produced bad code?
8. **Preserve the experiment.** Dataset/task set, model version, prompts, configuration, evaluation procedure, and ideally enough artifacts for another engineer to reproduce the result.
9. **Separate observation from explanation.** "Lead time dropped 18%" is evidence. "The agent understands the architecture" is an interpretation requiring separate evidence.
10. **Give uncertainty.** Sample size, variance, confidence intervals where appropriate, and limitations.

Several scientific practices transfer well to AI engineering: preregistering the evaluation criteria, keeping test sets separate from development, doing ablation studies to find which part of a system caused the improvement, publishing negative results, replication by another team, and explicitly documenting threats to validity.

For coding agents, a useful additional metric is **human correction burden**. How much intellectual work does a senior engineer have to do after the agent has produced something?

For example, two agents might both produce a passing PR. Agent A requires a ten-minute review. Agent B requires forty minutes of understanding unnecessary abstractions, finding a subtle concurrency problem, removing invented assumptions, and simplifying 600 lines into 150. "PR merged" scores them equally. From an engineering perspective they are completely different systems.

To capture overengineering and other hidden overhead, measure:

`total human effort = task formulation + agent supervision + review + correction + later rework`

Then compare that with doing the task manually. This makes it much harder to hide agent overhead.

The same standard can help assess claims of expertise. Heavy tool use alone is weak evidence; stronger evidence answers questions such as:

- What hypothesis was tested?
- How was the evaluation set constructed?
- What supports the benchmark's representativeness of production work?
- What was the baseline?
- What failed?
- How were hallucinations detected?
- How were false positives and false negatives measured?
- What evidence attributes the improvement to the agent?
- How does the system behave outside the happy path?
- What changed after deployment?
- What would falsify the conclusion?

Someone who thinks this way can usually distinguish a demo from an engineering result.

There is an interesting broader principle here: **AI engineering should probably treat empirical evidence as a first-class engineering artifact**, alongside code, tests, design documents, and operational metrics.

For a conventional deterministic system, correctness can often be established primarily by reasoning about the implementation and testing known boundaries. For an AI system, a large part of the specification effectively becomes empirical: _under this distribution of inputs, with this model and this configuration, the system behaves this way with these measured failure modes._

That changes what competent engineering looks like.

A useful professional norm follows:

> A quantitative claim about an AI system should be supported by its evaluation dataset, methodology, baseline, metrics, failure cases, and uncertainty.

Without those, it should be treated as an anecdote, regardless of whether it comes from an individual engineer or a large company.

A concise evidence protocol can make these requirements repeatable across evaluations.
