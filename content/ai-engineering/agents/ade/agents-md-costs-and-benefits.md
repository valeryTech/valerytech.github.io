---
draft: false
toc: true
title: "Costs and Benefits of Optimizing AGENTS.md"
description: "Discussions of AGENTS.md count tokens because they are easy to measure, but the effects on agent work, human effort, code quality, and maintenance are usually larger. This note lists the costs and benefits and what to measure."
linkTitle: "Costs and Benefits"
---

Discussions of optimizing `AGENTS.md` usually focus on its length in tokens. Token cost is easy to see: it can be read from the file, multiplied by the number of sessions, and found on the invoice. The file's other effects are harder to see. It changes how agents explore the repository, how much review and correction their work needs, how the codebase holds up over many changes, and how much work the file itself takes to maintain. These effects are usually larger than the token cost, and leaving them out can lead to the wrong decision about the file.

This note lists the kinds of cost and benefit, explains why token cost gets most of the attention, compares the scale of the token cost with the other kinds, and describes what to measure. The same analysis applies to other changes to the [agent development environment]({{< ref "ai-engineering/agents/ade/ade" >}}), such as moving guidance into docs, scripts, or checks.

{{< callout context="tip" title="Summary" icon="outline/rocket" >}}
- A change to the file has seven kinds of cost and benefit. Token cost is one of them, and the only one that can be estimated from the file alone.
- For 100 developers, cutting a root file from 10,000 to 1,000 tokens saves about $3,400 a year with prompt caching. That equals about one second of human time per agent session.
- The other kinds are larger. Changes in agent behavior apply to the whole session bill, changes in human effort are priced at engineering rates, and changes in code quality affect every later task on the same code.
- The other kinds take experiments or long observation to measure, and they fall on different people at different times, so nobody sees them all at once.
- A decision about the file should therefore rest on its effects on human effort and quality. Token cost is a constraint to check, and a weak reason on its own.
{{< /callout >}}

## What is compared


The analysis compares two versions of a repository's instructions on the same workload, with the same agent, model, and harness.

|                      | Version A        | Version B                        |
| -------------------- | ---------------- | -------------------------------- |
| Root `AGENTS.md`     | 10,000 tokens    | 1,000 tokens                     |
| Detailed conventions | In the root file | In linked docs, read when needed |

Version B follows the design rules [Treat context as a budget]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#treat-context-as-a-budget) and [Make it a map, not a manual]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#make-it-a-map-not-a-manual). The figures in this note are illustrative assumptions unless a source is cited.

## Kinds of cost and benefit


A change to the file can move each of the following, in either direction.

| Kind                           | What it includes                                                                                         | Unit                        | Who bears it                                      | When it appears              |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------- | ---------------------------- |
| Context cost                   | Tokens of the root file in every model request; docs the agent reads during the session                  | Dollars                     | The organization (API bill or subscription quota) | Every session                |
| Execution cost                 | Exploration, tool calls, retries, reasoning and output tokens, CI runs, sandboxes                        | Dollars                     | The organization                                  | Every session                |
| Context capacity and attention | Share of the context window; how early the session is compacted; how well the agent follows each instruction | Not priced directly     | Shows up as quality and execution cost            | During the session           |
| Agent time                     | Wall-clock duration of the session                                                                       | Minutes                     | The developer, while waiting for the result       | During the session           |
| Human effort                   | Preparing the task, steering, answering the agent's questions, review, correction                        | Hours                       | Developers and reviewers                          | During and after the session |
| Quality and risk               | Constraint violations, defects found after acceptance, code that makes later tasks harder                | Rework hours, incident cost | Reviewers, future maintainers, users              | Weeks to months later        |
| Maintenance and evaluation     | Writing and reviewing changes to the file, rechecking after model upgrades, running experiments          | Hours and dollars           | Maintainers of the file                           | Ongoing                      |

Three points follow from the table.

**Each benefit can be negative.** Removing a line saves tokens but can remove a fact that prevented an expensive mistake. Moving guidance into a linked doc saves tokens in sessions that don't need it, but the agent may fail to find the doc in sessions that do ([RQ5]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/coding-agent-research-questions" >}}#rq5-when-does-routing-to-documentation-work-better-than-including-guidance-directly)). A longer file can raise execution cost by sending agents to explore and test more.

**Costs and benefits fall on different people at different times.** The maintainer pays once to write the file. Every session pays the context cost. Reviewers pay for mistakes the file failed to prevent. Future maintainers, human or agent, pay for code that is harder to change. A change that lowers one group's cost can raise another group's.

**How a token saving shows up depends on billing.** With API billing, it reduces the invoice. With fixed-price subscriptions, it shows up as more usage before developers hit their limits, and the invoice stays the same.

## Why token cost gets most of the attention


Token cost differs from the other kinds in ways that make it easier to notice.

| Property              | Token cost                         | The other kinds                                      |
| --------------------- | ---------------------------------- | ---------------------------------------------------- |
| Measured from         | The file and usage data            | Agent runs, reviews, and later work                  |
| When it appears       | Immediately, in every session      | Partly weeks or months later                         |
| Where it shows up     | The invoice                        | Developers' time, review queues, defect reports      |
| Who bears it          | The organization, as one number    | Many people, in small amounts                        |
| Direction of a change | Known: fewer tokens cost less      | Not known in advance; each effect can go either way  |

Each property makes token cost easier to count. None of them makes it more important. When one cost is easy to count, it tends to become the goal, and the costs that are hard to count drop out of the comparison. For `AGENTS.md`, this leads to three errors:

- **A shorter file is treated as a better file.** A shorter file is cheaper per session. Whether it is better depends on whether agents still find what they need and whether people spend less time on the agents' work.
- **Savings that cancel out are missed.** A line removed to save tokens can cost more in review time than it saved. Guidance moved into a linked doc can cost more in missed retrievals than it saved in context.
- **Effects that appear later are not counted.** A change that makes the codebase harder to change shows up in later tasks, often after the instruction change has been forgotten.

The same pattern appears in [why it is hard to tell whether AGENTS.md works]({{< ref "ai-engineering/agents/ade/agents-md/evaluation/agents-md-verification" >}}): reading the file and running static checks are cheap, and neither shows the file's effect on agent behavior.

## Levels of outcome


Human effort and quality cover several levels of outcome, from one task to the product. Each level helps the next one but doesn't guarantee it, so each is evaluated separately.

| Level                      | Question                                                                                        | Example measures                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1. Task effectiveness      | Did the agent complete the intended task correctly, completely, and within project constraints? | Acceptance rate, corrections before acceptance, constraint violations     |
| 2. Software system quality | Does the change keep the codebase easy and safe to change?                                      | Duplication, boundary violations, success of later tasks on the same code |
| 3. Delivery capability     | Can the team deliver changes reliably and with manageable effort?                               | DORA delivery metrics, review load, supervision needed per delegated task |
| 4. Product value           | Does the delivered software produce the intended outcomes for users and the business?           | Adoption, retention, users' task success                                  |

Examples of one level succeeding while the next fails:

- **The task passes, and the result is wrong.** An agent makes the tests pass by weakening assertions. A check based only on tests counts the task as done ([Plausible completion is not correctness]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#plausible-completion-is-not-correctness)).
- **The task is correct, and the system gets worse.** An agent adds a new domain variant by adding a conditional to five services. The feature works, and every later change to the variant now touches five places. Another agent follows the project's domain model and makes the same feature with one change. Both pass acceptance.
- **Agents are faster, and delivery is not.** Agents produce changes faster, and review and CI become the bottleneck. DORA's 2024 report found that higher AI adoption was associated with lower delivery stability.
- **Delivery works, and the product gains nothing.** A feature ships correctly and quickly, and users don't need it.

Existing frameworks cover levels 2 to 4: ISO/IEC 25010 lists quality characteristics such as maintainability, reliability, and security; DORA measures delivery throughput and instability; SPACE covers developer satisfaction, performance, activity, collaboration, and flow; HEART covers users' happiness, engagement, adoption, retention, and task success.

Each level also has an efficiency question:

| Level    | Effectiveness                           | Efficiency                                         |
| -------- | --------------------------------------- | -------------------------------------------------- |
| Task     | Was the task done correctly?            | How much agent cost and human effort did it take?  |
| System   | Did the change keep the system healthy? | How much do later changes and maintenance cost?    |
| Delivery | Are changes delivered reliably?         | How much time and coordination does delivery take? |
| Product  | Are user outcomes achieved?             | How much investment did they take?                 |

More effort at one level can lower cost at another. An agent that spends more tokens choosing the right abstraction raises the cost of the task and lowers the cost of later changes. Token cost belongs to the efficiency column of the first row only.

The file's design choices are expected to act on specific levels. Each row is a hypothesis to test.

| Design choice                                                                                               | Expected effect                                               | Level                  |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------- |
| [Name the sources of truth]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#name-the-sources-of-truth)                                           | The agent works from current, authoritative docs              | 1                      |
| Link to product framing and domain concepts                                                                 | Decisions consistent with the domain model and product intent | 1, 2, and indirectly 4 |
| Link to architecture and modeling principles, [backed by checks]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#prefer-enforcement-over-prose)  | Changes keep module boundaries and consistency                | 2                      |
| [Define done]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#define-done-and-when-to-ask) with exact baseline checks                            | Fewer results submitted without validation                    | 1                      |
| [Define when to ask]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#define-done-and-when-to-ask)                                                | Fewer decisions made without the people who own them          | 1, 3                   |
| [Keep the root file short]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#treat-context-as-a-budget)                                            | Lower context cost, fewer distractions                        | Efficiency at 1        |

`AGENTS.md` affects levels 1 and 2 most directly, and controlled agent experiments can measure those two. Effects on levels 3 and 4 also depend on many other causes, and linking them to the file takes long-term observation.

## Scale of the token cost


The figures below assume 100 developers with 440 agent sessions a day over 220 working days (96,800 sessions a year), 15 model requests per session, and the `gpt-5.3-codex` prices on [OpenAI's model page](https://developers.openai.com/api/docs/models/gpt-5.3-codex) when this note was written (\(1.75 per million input tokens, \)0.175 per million cached input tokens). With caching, the first request in a session pays the full price for the file and later requests pay the cached price. Engineering time is priced at $120 an hour.

| Fact                                                                          | Value                                       |
| ----------------------------------------------------------------------------- | ------------------------------------------- |
| Annual token cost of a 10,000-token root file                                 | About $4,070                                |
| Annual saving from cutting it to 1,000 tokens, after paying for docs read when needed | About $3,430                        |
| The same saving without prompt caching                                        | About $22,000                               |
| Annual cost of 100 tokens in the root file                                    | About $41, or 20 minutes of engineering time |
| First year of optimizing and maintaining the file (27 hours)                  | About $3,240                                |
| The $3,430 saving as human time                                               | 28.6 hours a year, or about 1 second per session |

The table supports three conclusions:

- **Caching decides the size of the token saving.** With caching, the saving is small. Without it, the saving is about six times larger, and still small next to engineering costs.
- **In its first year, optimizing roughly breaks even on tokens alone.** The \(3,430 saved is close to the \)3,240 of engineering time spent.
- **Small changes in human effort outweigh the token saving.** If the shorter file adds one 2-minute correction in every hundred sessions, it costs more than it saves. In the other direction, saving each developer 5 minutes a working day would equal about $220,000 a year in engineering time. Nobody has measured either effect.

## Execution cost


The file changes what agents do during a session: which files they open, which commands they run, how much they test, how often they retry, and how much they write. Gloaguen et al. 2026, *Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?* ([arXiv:2602.11988](https://arxiv.org/abs/2602.11988), read from the abstract and summaries), found that context files tended to reduce task success compared with no repository context, while raising inference cost by more than 20%. Agents followed the files' instructions and explored and tested more broadly.

Execution effects apply to the whole session bill, while the context saving applies only to the file's tokens. At \(1 a session, the same organization spends about \)97,000 a year on agent sessions. A 5% change in that bill is about $4,800, which is more than the whole context saving.

The direction isn't known in advance. Shorter instructions can cut exploration the task doesn't need. They can also cause failed attempts and retries when a needed fact is missing.

## Human effort


Human effort includes preparing the task, steering the agent, answering its questions, reviewing the result, and correcting it. Engineering time costs far more per unit than tokens, so small changes in human effort decide the result, as the break-even above shows.

Two cautions apply when converting time into money:

- **Saved time has value only when it is used.** It counts if people spend less effort or deliver more. Minutes that disappear into the working day produce no saving.
- **Agent time differs from human time.** A shorter unattended session saves a developer's time only when the developer is waiting for it.

Per-task cost also misses a change in what people can delegate. The design note's goal is [reliable autonomy]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#goal): agents completing larger tasks end to end with less supervision. If better instructions let people hand over tasks they used to do themselves, the benefit shows up as a different mix of work, which per-task measures don't capture.

## Quality and risk


**Rework and defects.** The quality benefit is the cost of rework and defects that the change prevents. Rework hours often also appear in the human effort measures. Count them in one place only.

**Effects on later tasks.** Effects on system quality show up in later work. *Is Agent Code Less Maintainable Than Human Code?* ([arXiv:2606.21804](https://arxiv.org/abs/2606.21804), read from search summaries, venue not confirmed) chained pairs of tasks so that the second task built on the first task's code. Agents resolved up to 13.1% fewer second tasks when building on agent code than on human code, and conventional maintainability metrics explained little of the gap. Measuring level 2 therefore needs follow-up tasks on the changed code, beyond metrics on the change itself.

**Rare failures with severe consequences.** The expected cost of a failure is its probability times its cost. A 30-token constraint costs about $12 a year in tokens. If it prevents one incident that costs a day of work every few years, it pays for itself. A check or permission setting may cover the same risk with no context cost ([Prefer enforcement over prose]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#prefer-enforcement-over-prose), [Low-frequency, high-risk constraints]({{< ref "ai-engineering/agents/ade/agents-md/agents-md" >}}#low-frequency-high-risk-constraints)).
