---
draft: false
toc: true
title: "Project Understanding and Ownership"
aliases:
  - "/ai-engineering/agents/comprehension/"
description: "Project ownership means knowing enough about a system to make and review changes safely. Coding agents can make gaps in that knowledge harder to spot: they produce working code and plausible explanations, even when key context is missing."
linkTitle: "Project Ownership"
---

Coding agents can explain code, suggest designs, write tests, and plan implementations. Their answers often sound like advice from a knowledgeable teammate.

That confidence can be misleading. Agents sometimes make up facts, assume unstated requirements, invent reasons for design choices, or produce code that works in isolation but violates system constraints. An agent can reason only from the context available to it. That context is incomplete, may be lost between sessions, and cannot substitute for someone accountable for the system. It may omit the project's history, production constraints, undocumented product decisions, operational risks, and maintenance costs.

The engineer or team responsible for the system has to account for those things when accepting changes. That responsibility is project ownership.

> You can delegate implementation to an agent, but responsibility for understanding the project stays with the team.

No one needs to understand every line of code. The team does need enough knowledge, held by people and recorded in the project, to make sound decisions today and maintain the system later. It's easy to miss when that knowledge is fading: the code still runs, and the agent can still explain what it wrote.

## What owners need to understand


The question is whether the team understands enough to make the decision in front of it. I use *comprehension debt* for the gap between what the team understands and what its work requires; Tavantzis et al. (2026) and Storey (2026) call this *cognitive debt*. Tavantzis et al. reviewed 76 practitioner articles and company reports. They define the problem as a mismatch between what a person or team knows and what current or future work demands. Nobody understands a whole system perfectly. The problem begins when a change requires knowledge that no one on the team has.

Consider two engineers who don't know a component's internals:

- *I don't know the internals, but I know the contract, how it can fail, and how to verify my change.* That can be enough.
- *I don't know why this abstraction exists, what depends on it, or whether the required behavior still holds, but the agent says it works.* The engineer cannot independently judge the change.

You also have to consider the next change. A gap that causes no trouble today may block work later, especially when requirements change in an unexpected way.

## Where project knowledge lives


Knowledge about a project lives in people, code, tests, specs, design records, documentation, tickets, and incident reports. Storey (2026) distinguishes three kinds of debt:

| Debt | Where it builds up | Example |
|---|---|---|
| Technical debt | Code | Duplicated logic, tangled dependencies |
| Cognitive debt (comprehension debt in this note) | People | Nobody can explain why the retry logic works the way it does |
| Intent debt | Documentation | The goals, constraints, and reasons for a decision were never written down |

Storey argues that cognitive and intent debt accumulate when agents produce code faster than teams can understand and document it.

Written design decisions help engineers and agents work from the same information. In Lopopolo's (2026) account, an OpenAI team kept design documents, product specs, plans, and architecture rules in the repository, where linters and CI jobs could check them. A recurring agent flagged documentation that had drifted from the code. Documentation cannot give the team understanding on its own, but keeping it accurate reduces the work needed to build that understanding.

There are two catches:

- Documentation and tests are useful only if they stay accurate. Vaccari (2026) interviewed 26 developers who worked with coding agents. Some no longer trusted that their tests checked the intended behavior after agents refactored the code and the tests together.
- Knowledge needs to be shared. As Shyamsundar (2026) points out, knowledge held by one engineer disappears from the team when that engineer leaves. The article flags a system as at risk if no engineer can explain its data flow in ten minutes.

## How much understanding is enough?


The answer depends partly on the code you're changing:

|Area|Required understanding|
|---|---|
|Throwaway scripts|Know the contract and the consequences of failure|
|Internal tools|Know the inputs, outputs, and operational risks|
|Core product logic|Know the architecture, invariants, tradeoffs, and failure modes|
|Evaluation harness|Know what it measures and what it misses|
|Agent/RAG reasoning pipeline|Know the data flow, retrieval assumptions, ranking and evaluation logic, and ways the output can be wrong|

The answer also depends on risk. Shyamsundar (2026) recommends different review approaches for different changes:

- Changes involving authentication, authorization, money movement, security, or destructive data operations need a detailed code review by a human. The author and reviewer should be different people.
- Isolated utilities and changes with few dependencies may need only a review of the design and behavior if strong tests and shadow rollouts cover them (a shadow rollout runs new code on live traffic without using its results).

The article suggests three questions: Does the change affect access, money, or data integrity? Could a failure cause more than fifteen minutes of downtime? Can it be rolled back without manual steps?

It helps to think in three levels:

- **System:** the main components, what they do, how they depend on one another, the invariants that must hold, and where to find further information. The owner needs this level of understanding throughout the project. In a large system, knowing where to find details can be enough.
- **Change:** the part of the system affected, the behavior being changed, its constraints, and the consequences if it fails. Whoever accepts the change needs to understand these before approving it.
- **Implementation:** the algorithms, state transitions, and data structures involved. This level is necessary for high-risk changes and whenever verifying a change depends on implementation details.

JetBrains Research proposes a similar review sequence: start with the overall change, move to the affected files, then inspect selected code (Fraser et al. 2026). The authors call the skill *trust calibration*: spending review time on the parts most likely to go wrong. Agents make this harder because they often describe safe and risky changes with equal confidence. With a human author, a reviewer can ask which decisions were uncertain; with an agent, they have to find those decisions themselves. Otherwise, reviewers may spend too much time on straightforward code and miss the riskier parts.

Unexpected dependencies call for deeper investigation. If an engineer cannot identify what else a change affects, or verify that the relevant constraints still hold, the change should not be approved yet.

## What automated checks can verify


Reading every generated line is one way to review a change. Willison (2026) notes that there are other ways to verify the result. Osmani (*Agentic Code Quality*, 2026) recommends checks throughout development: unit, property-based, and acceptance tests; mutation testing; complexity limits; architecture rules; and security scans. These checks can free up review time for decisions that need human judgment. Osmani still reads and reviews code. The OpenAI team, for example, used custom linters and structural tests to enforce its architecture rules.

Automated checks can reduce the need to read code, but only if the team understands what they verify:

- Know what the checks cover and what they miss. Passing tests tell you little if you do not know what they test.
- Keep the checks independent of the implementation they verify. Vaccari (2026) suggests customer-level acceptance tests, expressed in readable forms such as tables, as a shared contract between people and agents. Engineers review that contract, and changes to it require their attention.

## Decisions that remain with people


Automated checks cannot answer every question:

- **Should the change exist at all?** Ali (2026) describes discarding a change that passed tests, screenshot checks, and reviews by other agents. The checks established that it worked. They did not establish that the product needed it. The change might duplicate an existing feature or add a small convenience at a long-term maintenance cost. Deciding whether it belongs requires knowledge of the product and its direction.
- **What architecture should the system follow?** In the OpenAI project, agents wrote all the code, while engineers set the structure: layers within each business domain, rules for dependencies between layers, and conventions for logging, naming, and validation. Engineers also chose the work, translated user feedback into acceptance criteria, and checked the results.
- **Which checks should the team use?** Engineers still have to decide what to test and what a passing result means.

## How teams lose understanding


The risk is accepting agent output without independently checking whether it makes sense. Osmani (*Cognitive Surrender*, 2026), citing Shaw and Nave, calls this *cognitive surrender*. By contrast, *cognitive offloading* means letting a tool do the work while continuing to judge its results.

Two small controlled studies give some evidence:

- Martin-Lopez et al. (2026) asked 69 participants, mostly students, to complete two coding tasks, one with AI and one without it. With AI, median task completeness was more than twice as high, but participants scored 12.5% lower on questions about the code they had written. The questions came immediately after each task, so the result concerns short-term understanding.
- Alakmeh et al. (2026) studied 21 developers changing an existing codebase. Overall, comprehension scores were similar with and without AI. The differences emerged when the researchers grouped developers by how they used AI. The eight who let AI lead the work scored about half as well on comprehension; none completed a task without AI. The ten who first formed their own understanding and checked AI output scored as well as the three who could do the whole task without AI, although fewer of those ten completed the coding task.

How a developer uses an agent appears to make a difference.

A common failure starts with: "I don't fully understand this part yet, but the agent says it works." The problem is using the agent's confidence as a reason to accept the change. It is normal to leave questions open while investigating. It becomes risky when the team merges changes and builds on them without answering those questions. As with technical debt, the consequences may appear only after the debt has accumulated.

Practitioners cited in the Tavantzis et al. review recommend small, reviewable changes; checks that authors can explain their work before it is accepted; written explanations of design decisions; and regular knowledge sharing.

Some gaps are tolerable in scripts, experiments, migration helpers, or isolated developer tools, where requirements are narrow and the cost of failure is low. Core product code needs a higher standard.

{{< callout context="note" title="Project ownership rule" icon="outline/info-circle" >}}
For core product code, understanding is part of correctness. Before accepting a change, someone on the team must be able to explain why it works and how they know. Do not merge changes faster than the team can understand them.
{{< /callout >}}

## When code outpaces understanding


When a system changes faster than the team can understand it, each new change becomes harder to assess. The problem may go unnoticed at first: the code runs, tests pass, and agents can explain their work. Then an agent proposes another abstraction, class, state machine, or function with dozens of rules, and no one has enough context to question it. The code grows more complex without anyone checking whether that complexity is justified.

Failures may surface much later, after the team has already stopped requiring an explanation before accepting changes.

Two experience reports illustrate the problem and a possible response:

- Ali (2026) built an internal tool, botd, without understanding its architecture. Hidden design decisions made small changes require major rewrites, and the project eventually collapsed.
- An OpenAI team found that agents repeated the existing patterns in its repository, including the bad ones. The team initially spent every Friday cleaning up the resulting drift. It then wrote its coding rules into the repository and scheduled agents to find violations and propose small refactorings. This approach worked through an internal launch. The team does not yet know how well its architecture will hold up over years.

The evidence consists mainly of short studies and experience reports. It suggests that unresolved gaps can accumulate until a team struggles to judge new changes. There is no long-term data yet on how quickly this happens or how well continuous cleanup works.

## This can happen without agents, too


Human teams lose project knowledge as well. The same problems arise when only one person understands a module, ownership is unclear, documentation is outdated, or a component is abandoned. All of these increase the risk when people leave.

Agents can accelerate those existing problems. A team might already have unclear ownership, incomplete documentation, weak tests, or poorly defined architecture. An agent can keep adding code in those conditions, producing plausible local changes while fewer engineers understand the system as a whole.

People do not automatically understand every line they write, and agents are not always wrong. The question is who is responsible for the decisions. A human owner can retain context, explain tradeoffs, and take responsibility for the consequences. If that ownership is already weak, the team has a management problem to solve. Fluent agent explanations can make that problem harder to see.

## Sources


- Alakmeh et al. 2026, *Grasping AI Reliance in Program Comprehension and Coding through the AIRELI Persona Taxonomy*, ICPC 2026 ([doi:10.1145/3794763.3794804](https://doi.org/10.1145/3794763.3794804)) -- three ways developers relied on AI and their comprehension scores; on *How teams lose understanding*
- Ali 2026, [*Six Months of Writing Code Exclusively With Agents*](https://blog.exe.dev/engineering-with-ai), exe.dev blog -- deciding what to ship, and a tool that collapsed; on *Decisions that remain with people* and *When code outpaces understanding*
- Fraser, Sergeyuk and Zakharov 2026, [*Our Framework for Reviewing AI-Generated Code*](https://blog.jetbrains.com/research/2026/10/review-ai-generated/), JetBrains Research -- review from overview to code, and trust calibration; on *How much understanding is enough?*
- Lopopolo 2026, [*Harness engineering: leveraging Codex in an agent-first world*](https://openai.com/index/harness-engineering/), OpenAI -- a codebase written entirely by agents, with the repository as the record of intent and continuous cleanup; on *Where project knowledge lives*, *What automated checks can verify*, *Decisions that remain with people*, and *When code outpaces understanding*
- Martin-Lopez et al. 2026, *More Code, Less Understanding? On the Impact of AI Assistants on Developers' Productivity and Code Ownership*, IEEE Transactions on Software Engineering ([doi:10.1109/TSE.2026.3679627](https://doi.org/10.1109/TSE.2026.3679627)) -- more completed work and less understanding with AI; on *How teams lose understanding*
- Osmani 2026, [*Agentic Code Quality*](https://addyosmani.com/blog/agentic-code-quality/) -- checks throughout the delivery pipeline; on *What automated checks can verify*
- Osmani 2026, [*Cognitive Surrender*](https://addyosmani.com/blog/cognitive-surrender/) -- offloading compared with surrender; on *How teams lose understanding*
- Shyamsundar 2026, [*Principal Drift in Practice*](https://www.oreilly.com/radar/principal-drift-in-practice/), O'Reilly Radar -- review depth by risk, and a shared team model; on *Where project knowledge lives* and *How much understanding is enough?*
- Storey 2026, *From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in the Age of AI* ([arXiv:2603.22106](https://arxiv.org/abs/2603.22106)) -- technical, cognitive, and intent debt; on *What owners need to understand* and *Where project knowledge lives*
- Tavantzis et al. 2026, *Cognitive Debt in the GenAI Era - Listening to Practitioners' Voices on the Loss of Understanding*, manuscript under review ([arXiv:2610.37888](https://arxiv.org/abs/2610.37888)) -- understanding that is insufficient for the work, and practices against it; on *What owners need to understand* and *How teams lose understanding*
- Vaccari 2026, [*Tests as data*](https://martinfowler.com/articles/tests-as-data.html), martinfowler.com -- acceptance tests as the contract between people and agents; on *Where project knowledge lives* and *What automated checks can verify*
- Willison 2026, [*More than just code review*](https://simonwillison.net/2026/Aug/22/more-than-just-code-review/) -- ways to verify agent work besides reading every line; on *What automated checks can verify*

## Related notes


- [Reviewing Software Changes]({{< ref "ai-engineering/agents/ai-assisted-development/code-review" >}}) -- tracing a change from requirements through design, code, and tests, and choosing suitable checks.
- [Working with a Coding Agent]({{< ref "ai-engineering/agents/ai-assisted-development/working-with-an-agent" >}}) -- keeping agent changes understandable and making ownership of decisions explicit.
