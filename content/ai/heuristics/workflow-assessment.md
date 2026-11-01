---
draft: false
toc: true
title: "Assessing Workflow Steps for AI"
description: "Janna Lipenkova's method for bringing AI into an existing workflow (map the user journey, score each step on value, feasibility, and desirability, start with one step that scores well on all three, divide the work in it between people and AI), with how to measure and widen the result."
linkTitle: "Workflow Assessment"
---

A whole workflow is usually too large to automate, and its steps differ in how much AI helps. Janna Lipenkova describes a method for this case: map the user journey, break it into steps, judge each step on value, feasibility, and desirability, start with one step that scores well on all three, and then decide how the work in that step is divided between people and AI ([Lipenkova 2025](#lipenkova-2025), ch. 3 and 10). Her newsletter adds how to measure the value once the step is running ([Lipenkova, AI for Business 15](#lipenkova-ai-value)).

This note describes the method and how it connects to the other heuristics. The full text of the book is in the Lipenkova note, and working notes that extend the method are in [Lipenkova's AI product method: framework notes]({{< ref "ai/product/product-framework/notes" >}}).

## The method in seven steps


1. **Map the user journey.** With customers and a design partner, write down the stages of the work as it is done today. In the book's example, sustainability reporting is split into five stages, one of which is report composition; the work includes defining the scope, collecting and analyzing data across the company, writing text for every topic, and coordinating with compliance, HR, and finance teams ([Lipenkova 2025](#lipenkova-2025), ch. 10.1.1).
2. **Break the stages into tasks, and expect many of them to stay with people.** The whole process is too complex to automate, and not every step suits AI.
3. **Score each step on value, feasibility, and desirability.** The questions are in the next section. Each dimension has its own partner: customers and users for value, engineers for feasibility (with users for the error tolerance), and users again for desirability.
4. **Choose one step to start with.** Plot the scores in an opportunity matrix and look for a quick win: a step that is valuable and desirable and can be built with reasonable effort. A first version usually covers one step. In the book's example, report composition scores high on all three ([Lipenkova 2025](#lipenkova-2025), ch. 10.1.1).
5. **Decide how the work in that step is divided.** Choose the level of automation and the interface, and give each side the work it does better. See [Dividing the work between people and AI](#dividing-the-work-between-people-and-ai).
6. **Check the cost with the mistakes counted.** The AI process costs its development and operation, the time people spend finding and fixing its mistakes, and the risk of mistakes nobody catches. All of that has to stay well below the cost of the manual process ([Lipenkova 2025](#lipenkova-2025), ch. 2.1.1).
7. **Test the design with realistic AI behavior before building it.** Prototypes should include plausible errors, such as a wrong figure, a misread regulation, or a misaligned table, so that you see how users react to them; a person can play the AI in a Wizard of Oz test ([Lipenkova 2025](#lipenkova-2025), ch. 10.1.3).

## Questions for each step


| Dimension | Questions | Whom to ask |
| --- | --- | --- |
| **Value** | How long does the step take by hand? How often does it happen? Small steps done hundreds of times a year add up, and so do large steps done once a year. Does AI have an advantage here, such as pulling figures out of hundreds of documents? What more useful work could people do with the time? | Customers and users |
| **Feasibility** | Is the step repetitive and based on patterns, or does it need judgment and creative synthesis? Can an existing model do it, or does it need custom development? How accurate can it get, and how hard is it for users to spot its errors? | Engineers; users for the error tolerance |
| **Desirability** | Is the step a burden people would be glad to hand off, or does it give them status, expertise, or control? Would automation leave them out of decisions they care about? | Users |

The questions come with two warnings ([Lipenkova 2025](#lipenkova-2025), ch. 10.1.1). Value is more than time saved: in the example, AI help with writing lets sustainability managers spend their time on planning and stakeholder work, which they are better at. And a step that needs a lot of human checking can lose all of its efficiency gain and even add cost, so the amount of oversight belongs in the feasibility estimate from the start.

## Dividing the work between people and AI


Lipenkova expects most AI products to assist or augment people. Full automation fits routine, tedious tasks that the AI performs with high confidence, such as routing calls on a service hotline to the right team ([Lipenkova 2025](#lipenkova-2025), ch. 3.3.2). She lists what each side does better:

| AI does better | People do better |
| --- | --- |
| Processing large amounts of data quickly | Intuition from experience |
| Finding patterns, trends, and anomalies in large data | Social and interpersonal skills |
| Consistent predictions | Understanding the wider context, such as the company's strategy |
| Running many processes at once | Common-sense reasoning in new situations |
| Scaling with the workload | Moral and ethical judgment |
| Repetitive and hazardous tasks | |
| Being available at any hour | |

Desirability also sets how much control the user keeps. For a tedious, low-impact task such as formatting a report, users prefer a single button that does the job quietly; for a task people want to own, they stay in charge and AI supports them ([Lipenkova 2025](#lipenkova-2025), ch. 10.1.1).

The book names three levels of automation ([Lipenkova 2025](#lipenkova-2025), ch. 3.3.2). The table lines them up with the five levels in [What the model may change]({{< ref "ai/heuristics/what-llms-are-good-at" >}}#what-the-model-may-change); the alignment is this note's reading.

| Level in the book | Meaning | Closest levels in What LLMs are good at |
| --- | --- | --- |
| Assisted intelligence | AI supports a person's decision without deciding | 1. Inform; 2. Interpret |
| Augmented intelligence | AI makes suggestions and takes an active part in the decision | 3. Draft; 4. Act after approval |
| Autonomous intelligence | AI decides and acts with little human involvement | 5. Act within limits |

For agents, the book's appendix names four ways to involve a person: fully automated, where the person monitors the outcomes; assisted, where the agent suggests and the person approves or edits; collaborative, where both work at the same time; and escalation, where the agent flags uncertain cases and the person decides. It recommends confidence thresholds for when the agent acts alone, clear paths for ambiguous cases, feedback from users, and changing the level as performance in use shows ([Lipenkova 2025](#lipenkova-2025), appendix A.9.1).

## Workflows run by agents


For a workflow that an agent carries out with tools, the book adds a readiness check ([Lipenkova 2025](#lipenkova-2025), appendix A.9.1):

- The tasks are high in volume, repetitive, and take up the team's time.
- Inputs and outputs are structured.
- APIs or integrations exist for the tools the agent needs.
- Human oversight is planned where full automation isn't feasible.

Agents that reach production today mostly come in two kinds: agents that take the easy majority of cases while people handle the hard rest, as in customer service, and agents that builders make for their own work and then give to users who accept failures, as with coding agents ([Lipenkova 2025](#lipenkova-2025), ch. 9). Once an agent runs, the book suggests tracking the completion rate, accuracy, latency, user ratings, and the share of cases escalated to a person, and improving the agent with fine-tuning on real cases, more tool integrations, regular audits, and user feedback before extending it to more workflows ([Lipenkova 2025](#lipenkova-2025), appendix A.9.2).

## Measuring the result


Lipenkova's newsletter separates three kinds of AI opportunity, which create value in different ways and need different measures ([Lipenkova, AI for Business 15](#lipenkova-ai-value)):

| Kind | What AI does | Early signs | Later signs | Main lever |
| --- | --- | --- | --- | --- |
| **Automation** | Takes over a task; people check outputs or handle the cases it escalates | Efficiency, minus the effort of finding and fixing mistakes; speed to insight | Cost savings, risk and compliance, scalability | Model accuracy, data coverage, and where the line for escalation is drawn |
| **Augmentation** | Supports experts in complex tasks with many steps | Quality and accuracy, speed to insight, work experience | Customer experience, lower costs, revenue growth | How the work is divided between people and AI |
| **Innovation** | Makes possible tasks, products, or operating models that were not feasible before | New tasks the organization can now do; for products, better customer experience and customers' willingness to pay | Revenue growth, new service categories, wider markets | A structured discovery process, experimentation, and a culture that allows it |

Automation is the easiest to measure but rarely sets a company apart for long, since competitors catch up. Augmentation pays off through a series of better decisions, so its early signs are qualitative, and management, expert users, and engineers have to agree on what counts as an improvement ([Lipenkova, AI for Business 15](#lipenkova-ai-value)).

## How this fits the other heuristics


- [Is a task worth building]({{< ref "ai/heuristics/what-llms-are-good-at" >}}#is-a-task-worth-building) judges one task. This method judges every step of a workflow and chooses among them; the cost check and the hand-off question are the same in both.
- [B2B and professional job families]({{< ref "ai/heuristics/b2b-job-families" >}}) name recurring jobs; each one is a workflow that can be assessed step by step.
- [Deciding whether to build an idea]({{< ref "ai/heuristics" >}}#3-deciding-whether-to-build-an-idea) judges a whole product idea: whether someone can evaluate the output, whether there is a buyer and a viable delivery form, and what the product does beyond a bare chat window or incumbent bundle.
- The structure of work in [Search for domains]({{< ref "ai/heuristics/input/search-for-domains" >}}) (requirements, evidence spread across sources, separate people who decide and approve) describes workflows where several steps share the same evidence and decisions.

## What the method leaves open


The method answers where in the journey AI should come in. It does not model how information and responsibility move through each task: the people involved, inputs, outputs, handoffs, decisions, and exceptions ([framework notes]({{< ref "ai/product/product-framework/notes" >}})). The same notes treat the level of automation as a design decision that determines the kind of intelligence, the interface, the data, and the evaluation, so the model is chosen after the workflow has been broken down and the work divided. [Workflow design]({{< ref "ai/design/workflow-design/workflow-design" >}}) and [Augmenting human work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}) cover more of that detail.

## References


- Lipenkova, J. (2025). [The Art of AI Product Development: Delivering Business Value](https://www.manning.com/books/the-art-of-ai-product-development). Manning. PDF; full text in the Lipenkova note. ^lipenkova-2025
- Lipenkova, J. [AI for Business #15: How to Measure AI Value](https://jannalipenkova.substack.com/p/ai-for-business-15-how-to-measure). Saved copy: clipping. ^lipenkova-ai-value
