---
draft: false
toc: true
title: "Evaluation"
linkTitle: "Evaluation"
---
How an AI team connects product intent and observed executions, turns human and automated judgment into reusable evaluation knowledge, and uses the resulting evidence to make product decisions.

## What Are AI Evaluations?


AI evaluation is the ongoing practice of understanding, judging, and improving how an AI system behaves.

It connects five activities:

1. **Specify intended behavior.** Make explicit what the system should and should not do.
2. **Observe actual behavior.** Collect executions, outcomes, feedback, and other evidence from testing and production.
3. **Judge the behavior.** Decide whether the observed behavior is acceptable using code checks, scenarios, model-based evaluators, or human review.
4. **Turn judgment into reusable knowledge.** Create failure categories, labeled examples, datasets, rubrics, evaluators, thresholds, and decision rules.
5. **Use the evidence to improve and govern the product.** Support product changes, regression testing, release decisions, monitoring, and risk control.

AI evaluation is therefore broader than checking whether a system passes a test. It is an iterative, evidence-driven part of AI engineering that helps a team understand what the product does, decide whether that behavior is acceptable, and improve both the product and the way it is evaluated over time.

More details and reasoning in the [Application Problems](#application-problems)

## About Step-by-Step Instructions


AI evaluation can be presented as a step-by-step process. This is useful, especially for teams that are just getting started, because it helps them establish the first version of an evaluation system.

However, this view can make the work seem more linear than it really is. AI development is iterative. In practice, the product, evaluation knowledge, and evaluation infrastructure evolve through several connected loops that run continuously (see [[operating-model]]).

We can still define a startup sequence to put these loops into operation. That sequence explains how to begin, while the loops explain how the work continues over time. The startup sequence should therefore be understood as a set of initial actions within a broader operating system.

#todo add picture with gears and starting the machine

## Startup (Kick-off) Sequence: Putting the Loops into Operation


The operating model consists of several continuous learning loops:

- the **product-improvement loop**, which changes system behavior;
- the **evaluation-knowledge loop**, which develops the team's understanding of desired behavior and failure;
- the **evaluation-infrastructure loop**, which improves how evidence is captured and evaluated.

These loops describe how the system operates once the necessary components are in place. They do not, by themselves, explain how a team gets started.

The startup sequence provides that initial path.

A useful metaphor is a mechanism made of several gears. Before the mechanism can run continuously, the gears must be placed in the correct positions, connected, and given enough initial material to begin turning.

The startup sequence can be reduced to six actions:

> **Build -> Instrument -> Execute -> Review -> Systematize -> Operationalize**

These actions place the initial gears into position.

```text
Build an executable product path
              ↓
Make its behavior observable
              ↓
Collect representative executions
              ↓
Review behavior openly
              ↓
Systematize quality and failure knowledge
              ↓
Create initial evaluation assets
              ↓
Use the findings to improve the product
              ↓
Run the learning loops continuously
```

### Build an executable product path


Start with a narrow end-to-end system that can produce realistic behavior.

It does not need to be complete. It must include enough of the intended workflow to expose relevant model interactions, retrieval, tool use, state changes, business logic, and user outcomes.

### Establish minimum evaluation infrastructure


Capture enough information to reconstruct executions and review them.

The initial evidence path may be simple:

```text
Execution
    ↓
Trace and outcome capture
    ↓
Storage
    ↓
Human review
```


The objective is to establish a usable evidence path, not to build a complete evaluation platform immediately.

This places the evaluation-infrastructure gear in position.

### 01 Establish the Evaluation Evidence Layer


Begin by identifying the minimum evidence required to reconstruct, understand, and evaluate an AI-system execution. Define an initial trace schema that captures the user context, system instructions, model and prompt versions, retrieved information, tool calls, intermediate actions, outputs, operational conditions, and downstream outcomes.

Instrument the application using this initial schema and collect representative executions from production, dogfooding, structured test scenarios, or simulated users. Treat this configuration as a starting hypothesis.

Advice: Use Brain Trust, LangSmith, Arize, or build your own. The tool doesn't matter. What matters is capturing traces and being able to take notes on them later for error analysis.

The broader objective: observability supplies evolving behavioral evidence to the evaluation and improvement cycle.

xx

During trace review, record both behavioral failures and cases where the available evidence is insufficient to explain or evaluate the system.

Use these findings to iteratively refine the application, the observability layer, the evaluation criteria, the evaluation datasets, and the evaluators. The objective is to develop an evidence layer that evolves with the system and supports continued error analysis, regression testing, and production evaluation.

### Collect representative executions


Run the product on a mix of:

- structured scenarios;
- domain-expert examples;
- historical cases;
- edge cases;
- dogfooding;
- simulated users;
- limited production traffic.

The initial goal is learning rather than producing a definitive quality score.

### Review behavior openly


Reviewers record concrete observations without relying only on a predefined taxonomy.

They should capture:

- what happened;
- what should have happened;
- why the difference matters;
- which evidence supports the judgment;
- whether evidence is missing;
- which object may need to change.

Open review allows unexpected categories to emerge from actual behavior.

### Systematize quality knowledge


Recurring observations are organized into:

- behavioral requirements;
- failure categories;
- representative examples;
- severity levels;
- evaluation criteria;
- labeled datasets.

### Create initial evaluation assets


Convert important knowledge into reusable checks, datasets, rubrics, evaluators, and review procedures.

Use the simplest reliable method for each requirement.

### Begin continuous operation


Once the initial product, knowledge, and infrastructure objects exist, the startup sequence gives way to the continuous operating model.

The team no longer follows a rigid linear process. Findings move directly into the loop or loops that own the required change.

## The Startup Sequence and the Continuous Loops


The two views answer different questions.

| View                               | Question answered                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| **Startup sequence**               | What must we do first to establish the operating mechanism?                           |
| **Product-improvement loop**       | How do we change the system's behavior?                                               |
| **Evaluation-knowledge loop**      | How do we improve our definition and understanding of quality?                        |
| **Evaluation-infrastructure loop** | How do we improve the capture and application of evaluation evidence?                 |
| **Data flywheel**                  | How does evidence move between the product, evaluation knowledge, and infrastructure? |

The startup sequence is temporarily ordered because some capabilities depend on others. A system must produce behavior before that behavior can be observed. Evidence must be available before failures can be studied systematically. Recurring failures must be understood before reliable evaluators can be constructed.

After startup, the work becomes iterative rather than sequential. A finding can cause simultaneous changes to the product, evaluation knowledge, and evaluation infrastructure.

## Components or Views (draft)


We could select important topics, system views, or areas (or propose another name). They could be interleaving, or be just views of the system.

### Evaluator Design and Validation


...

### Automated Evals


Build Binary LLM Judges: Write judge prompt with three parts: evaluation criteria (when is it a failure?), what's NOT a failure (prevents false positives), and output format (return only true or false). Binary scores work better than 1-5 scales. You only verify two things instead of five.

Validate Judge With TPR and TNR: Test your judge against human labels from error analysis. Don't use overall agreement (trap metric). Measure TPR (catches real errors) and TNR (doesn't false alarm) separately. Both must be above 80%. If low, add examples to prompt and iterate.

## Operating model


The evaluation domain operates through three learning loops, each defined by the object being changed.

Each feedback path forms a distinct learning loop:

```text
Product Improvement Loop
Finding → Product change → Validation → New executions → Finding
```

```text
Evaluation Knowledge Loop
Observation → Criteria, labels, datasets, or evaluators
            → Application to new executions → Refined knowledge
```

```text
Evaluation Infrastructure Loop
Evidence or execution gap → Instrumentation or pipeline change
                          → Improved capture and evaluation
                          → New gap
```


More details are in [[operating-model]].

### Execution topology


Defines where evaluations run: offline, online synchronous, online asynchronous (Offline and Online Planes)

### Evaluation Pyramid and Integration to the Test Pyramid


07 Use Code Evals When Possible: Format validation? Check for markdown symbols with regex. Required field checks? Verify parameters exist. Tool selection? Confirm correct tool was called. No LLM needed. Code evals are faster, cheaper, more reliable. Save LLM judges for subjective judgment only.

### Integration into CI/CD and Gates


...

## Architectural interpretation


The subsystem can be represented as:

```text
AI Evaluation Subsystem
│

```

## Example


we're going to use example: All the different activities that you might be engaged in as a property manager, their application is helping you manage that with the assistance of AI

real world app messiness: It's a really good example because it incorporates all the messiness of a real-world AI application. There are tool calls, there's RAG, multi-turn conversations. There are even multiple channels you can interact with the application through: voice, text message, or chatbot. So it's a lot of different messiness of the real world. This is not a simplified example. This is something that you will encounter in the real world. Your application might have these complexities.

problem set up: they had something initially that worked, but they really wanted to know, number one, how do we figure out what's going wrong, and number two, how do we improve the application systematically beyond just doing vibe checks? They already did vibe checks.

## Taxonomy


See [Taxonomy]({{< ref "ai-engineering/evaluation/taxonomy" >}})

## Application: Placing Evals into context

### 1. Start from the AI-engineering problem


An AI application produces behavior that is:

- probabilistic and context-dependent;
- distributed across models, prompts, retrieval, tools, state, business logic, and UX;
- only partially specified in advance;
- exposed to an open and changing input distribution;
- difficult to assess using a single correctness oracle;
- susceptible to broad and unexpected regressions when one component changes.

This creates the root AI-engineering problem:

> **How can a team intentionally improve and safely operate a context-sensitive, probabilistic product when its desired behavior is only partially specified, its actual behavior emerges during execution, and product changes can have uncertain effects?**

Evaluation addresses the knowledge and control uncertainty in that problem. Product engineering applies the resulting decisions to the implementation.

A corresponding root evaluation problem is:

> **Given product intent, an evolving AI system, and a changing operating environment, how can a team produce trustworthy, scoped, and decision-relevant evidence about what the product does, whether that behavior is acceptable, why failures occur, and whether a proposed change improves the product?**

This places evaluation inside AI engineering rather than treating it as an isolated measurement discipline.

### Purpose and Definition


The **problems being solved** should define the domain boundaries.

AI evaluation exists to support decisions about an AI product. It should provide (in ideal) a systematic way to understand how the product behaves, determine whether that behavior is acceptable, and establishes with sufficient confidence whether a change improved outcomes without unacceptable regressions.

{{< callout context="note" title="Note" icon="outline/info-circle" >}}
AI evaluation is an iterative evidence-driven cycle. We begin with an initial definition of expected behavior and a minimal observability configuration. We collect and inspect traces to discover failures, missing evidence, and ambiguous requirements. Those findings are used to refine the application, the instrumentation, the evaluation datasets, and the evaluators. The updated system is then validated and deployed, producing new traces that initiate the next iteration.
{{< /callout >}}


More abstract version:

{{< callout context="note" title="Note" icon="outline/info-circle" >}}
AI evaluation is an iterative, evidence-driven engineering process that makes expected behavior explicit, captures representative evidence of actual behavior, applies validated judgment, compiles that judgment into reusable evaluation assets, and uses the resulting claims to improve and govern the product over time
{{< /callout >}}

### What are the main problems?


The main problems are:

- **Definition:** It is often unclear what "good behavior" means.
- **Observability:** We may not capture enough information to understand what happened.
- **Judgment:** Some behavior is subjective or difficult to evaluate reliably.
- **Coverage:** Test cases cannot represent every real-world situation.
- **Change:** The product, users, and failure modes continue to evolve.

In one sentence:

> AI evaluations define how a system should behave, collect evidence of how it actually behaves, judge the difference, and use the findings to improve both the system and the evaluation process.
