---
draft: false
toc: true
title: "Empirical Nature 2"
linkTitle: "Empirical Nature 2"
---
# AI Products Need Evals, Not Just Tests


_A practical principle for designing, building, and operating AI products_

## The short version


An AI product is more than a model. Its behavior comes from the complete system: model, prompts, context, data, retrieval, tools, application code, policies, and runtime state.

We can often define the product clearly upfront:

- the job it should do;
- the capability we want to deliver;
- the users and situations we want to support;
- the quality bar;
- the failures we cannot accept;
- the cost, latency, and safety constraints.

What we usually cannot determine from architecture, code, prompts, and model choice alone is how reliably the complete product will meet that bar across the cases it will actually encounter.

Normal software checks remain necessary. They tell us whether the system is wired correctly and whether hard safeguards are enforced. But they are not enough to tell us whether the AI product works well.

For that, we need evals.

> **Code tells us whether we built the mechanisms and safeguards correctly. Evals tell us how the complete product actually behaves.**

In practice, AI engineering means:

```text
define what good looks like
→ run the product on realistic cases
→ inspect where it fails
→ make a targeted change
→ check whether it improved
→ check for regressions
→ decide what is ready to ship
→ learn from production
```


Hamel Husain describes a similar improvement loop as three connected activities: evaluating quality, debugging problems by inspecting data, and changing the system. Teams that focus only on the third activity often struggle to move beyond a convincing demo.

## The product target can still be clear


The need for evals does not mean that the team does not know what it is building.

A support assistant can have a clear job:

> Help support agents answer customer questions using the company's policies and customer data.

Its main properties can also be clear:

- answers should address the user's request;
- important statements should be grounded in approved sources;
- the system should not invent policy details;
- sensitive actions should require confirmation;
- the agent should be able to review and edit the answer;
- latency and cost should remain within agreed limits.

Experiments may improve how those properties are implemented, but they do not necessarily redefine the product.

The uncertainty is narrower:

> **Can the system meet the required quality bar, across the cases that matter, using the models, data, tools, and workflow available to us?**

And, when it cannot yet meet the bar:

> **Which change is most likely to improve it without breaking something else?**

That is why AI delivery needs a stronger measurement and iteration loop. The destination may be clear while the route to reliable performance is not.

## Three ways to make an AI product reliable


For every important product requirement, ask three questions.

### 1. Can we guarantee it in code?


Some requirements should not depend on the model behaving correctly.

Examples:

- the AI cannot call an unapproved tool;
- a sensitive operation requires explicit confirmation;
- tool inputs must match a schema;
- permissions are checked by the application;
- retries are bounded;
- operations are idempotent where necessary;
- a high-risk case cannot be automatically closed;
- every release records the model, prompt, policy, tool, and data versions.

These properties can be established through architecture, code review, deterministic tests, permissions, and runtime controls.

### 2. Do we need to test it with evals?


Other requirements depend on how the complete system behaves across different cases.

Examples:

- whether it recognizes the user's intent;
- whether it gives a correct answer;
- whether the answer is grounded in the right evidence;
- whether it notices ambiguity;
- whether it asks an appropriate follow-up question;
- whether it selects and uses the right tool;
- whether it completes the user's task;
- whether it handles indirect, unusual, or adversarial inputs;
- whether a change improves one group of cases but harms another.

These properties cannot usually be guaranteed by inspecting the implementation. They have to be tested by running the product.

### 3. What do we do when confidence is not high enough?


Some residual risk remains even after good engineering and evaluation.

The product therefore needs operating controls such as:

- human review;
- restricted automation;
- safe fallbacks;
- confidence-based routing;
- gradual rollout;
- allowlisted actions;
- monitoring;
- rollback;
- limits on irreversible actions.

The practical design rule is:

> **Use code for hard guarantees, evals for behavioral quality, and product controls for the risk that remains.**

Behavioral reliability should never be the only barrier protecting a high-impact or irreversible action.

## What an eval is


An eval is a repeatable way to run the product on cases that matter and judge whether the result meets the quality bar.

An eval normally includes:

```text
a task or user situation
+ the relevant context and system state
+ the version of the product being tested
+ one or more checks or graders
+ a result and, where useful, a critique
```


The grader may be:

- a deterministic check;
- a comparison with an expected outcome;
- a model applying a clear rubric;
- a domain expert;
- or a combination of these.

Anthropic distinguishes between **capability evals**, which ask what the system can do and where it still struggles, and **regression evals**, which check that previously working behavior has not broken. As capability becomes reliable, those cases can move into the regression suite.

Not every eval needs to be complex. Useful checks might include:

- Did the system call the correct tool?
- Did it use valid tool arguments?
- Did the resulting state change occur?
- Did the answer cite an approved source?
- Did the task finish within the latency limit?
- Did a domain expert mark the result as acceptable?
- Did the system avoid a known critical failure?

The goal is not to create one universal "AI quality score." The goal is to make the important product behaviors visible and testable.

## Start with actual outputs and failures


The fastest way to understand an AI product is usually to look at what it is doing.

A practical error-analysis process is:

```text
collect real or realistic interactions
→ review them in context
→ write down what went wrong
→ group similar failures
→ count their frequency and severity
→ choose a failure class to improve
→ turn representative failures into eval cases
```


Hamel recommends starting bottom-up: inspect actual conversations or task runs, capture open-ended notes, and let the product-specific failure categories emerge from the data. This is often more useful than beginning with generic metrics such as "helpfulness" or "hallucination."

Typical failure categories might include:

- missing important context;
- choosing the wrong source;
- incorrect tool use;
- mishandling dates;
- failing to hand off to a person;
- giving a plausible but unsupported answer;
- not recognizing an indirect request;
- breaking a workflow after several turns;
- completing the task but creating excessive user effort.

The categories should use the language of the product and domain. A legal assistant, support agent, coding agent, and sales assistant will not share the same useful failure taxonomy.

## Build a simple data and trace viewer


Teams cannot improve what they cannot inspect.

A useful internal viewer should put the relevant context in one place:

- user input and conversation history;
- final answer or action;
- retrieved documents;
- prompts and instructions;
- tool calls and results;
- application state;
- model and configuration version;
- eval results;
- reviewer notes;
- failure labels.

It should be easy to:

- move between examples;
- filter and sort;
- compare versions;
- mark an output as passing or failing;
- write a short critique;
- find similar failures;
- add a case to the eval set.

Hamel argues that a simple, product-specific data viewer is often more valuable than a generic evaluation dashboard because it removes the friction involved in understanding what happened. A spreadsheet may be sufficient at the beginning; the tool can evolve as the product and team mature.

Final-output evaluation alone is not always enough for debugging. If the answer is wrong, the team may need to see whether the problem came from routing, retrieval, ranking, prompt assembly, generation, tool use, parsing, validation, or a policy check.

## Involve domain experts directly


For many AI products, engineers cannot define quality alone.

A domain expert may be needed to determine:

- whether the answer is substantively correct;
- whether an important exception is missing;
- whether the reasoning follows accepted practice;
- whether the source is authoritative;
- whether the response is safe and appropriate;
- whether a result would actually be useful in the real workflow.

Domain experts should therefore participate in the improvement loop, not only in initial requirements gathering or final approval.

Their work can include:

- selecting representative cases;
- reviewing outputs;
- explaining failures;
- defining the quality bar;
- writing or refining evaluation rubrics;
- reviewing disagreements with automated graders;
- contributing directly to prompts and examples;
- checking production cases.

Hamel recommends giving domain experts direct access to prompts and realistic application context rather than forcing engineers to translate all domain knowledge indirectly. He also argues for removing unnecessary AI jargon so that experts can focus on the actual capability and behavior being built.

Automated graders can reduce review effort, but they should be calibrated against human judgment and checked regularly. The goal is not to remove experts from evaluation. It is to direct their time toward the cases where their judgment adds the most value.

## The working delivery loop


The behavioral improvement loop should sit inside the normal product delivery process.

```text
define the job and quality bar
→ design the product and safeguards
→ build and instrument the system
→ establish a baseline
→ run evals
→ inspect failures and traces
→ make a targeted change
→ rerun relevant evals
→ check for regressions
→ ship, limit, or route to a human
→ monitor production
→ add new failures to the eval set
→ repeat
```


This is not a replacement for product discovery, UX design, implementation, security, adoption work, or normal software delivery.

It is the loop that tells us whether the AI capability is becoming good enough to support those delivery decisions. The original engineering note similarly places instrumentation, evaluation, failure inspection, regression testing, release controls, and monitoring inside the delivery cycle.

## How to use this throughout delivery

### 1. Product and capability definition


Before discussing models or architecture, define:

- What job should the AI do?
- What outcome would make it useful?
- Which users and situations are in scope?
- Which situations are explicitly out of scope?
- What does a good result look like?
- Which failures are inconvenient?
- Which failures are release-blocking?
- What cost, latency, and reliability limits apply?

The result can be a short capability brief:

```text
Capability:
What the product should be able to do.

Supported scope:
The users, scenarios, languages, regions, and data conditions included.

Quality bar:
The properties and thresholds required for release.

Critical failures:
Outcomes that must block or restrict release.

Operating controls:
Cases that require confirmation, human review, fallback, or monitoring.
```


This does not need to become a large specification. Its purpose is to give the team something concrete to evaluate.

### 2. Feasibility and solution discovery


When the target capability is clear but feasibility is not, establish a baseline early.

Run a simple version of the product against representative cases and ask:

- Where does it work already?
- Where does it fail?
- Which failure classes are most important?
- Is the gap caused by the model, context, data, tools, workflow, or product design?
- Can the available system meet the quality bar?
- Is the remaining gap likely to be fixable?

Use time-boxed experiments when the team needs to compare approaches or test feasibility.

A useful experiment record can remain lightweight:

```text
Question:
What are we trying to learn?

Baseline:
How does the current version perform?

Change:
What are we changing?

Cases and measures:
How will we judge the result?

Result:
What improved, regressed, or stayed unchanged?

Decision:
Keep, revise, abandon, or investigate further.
```


Hamel's "capability funnel" is useful here: break a complex capability into progressive levels, from basic operation to reliably completing the user's job. It shows progress without pretending that partial capability is already a production-ready feature.

### 3. Product and system design


A design should explain both how the system will work and how the team will know whether it works.

Include:

- which properties are guaranteed in code;
- which properties require evals;
- what needs to be visible in traces;
- which cases will be used for initial evaluation;
- which actions require confirmation or human review;
- how failures will be contained;
- which versions and configuration must be captured;
- which production signals trigger investigation or rollback.

An AI system design is incomplete when it describes only model calls, retrieval, tools, and orchestration but does not explain how product behavior will be inspected and measured.

### 4. Implementation and iteration


During implementation:

1. Build the smallest useful end-to-end version.
2. Add enough tracing to understand its decisions and actions.
3. Create an initial eval set from realistic cases.
4. Record the baseline.
5. Inspect failures before choosing the next change.
6. Make one meaningful change or test one clear hypothesis.
7. Rerun the relevant capability and regression evals.
8. Keep the change only when the results support it.

Hamel suggests using different evaluation levels at different cadences: fast scoped checks on ordinary changes, human or model review on a regular cadence, and production experiments for larger product changes.

The team should capture versions of:

- models and prompts;
- retrieval indexes, embeddings, and rankers;
- policies and validators;
- tool definitions;
- source documents and datasets;
- runtime configuration.

A change to any of these can improve one area and degrade another. Without version capture, it becomes difficult to reproduce results or explain regressions.

### 5. Release readiness


A release decision should answer more than "Did the overall score go up?"

Review:

- which version was evaluated;
- which cases and user groups were covered;
- whether the quality bar was met;
- performance on important slices;
- known failure modes;
- regressions;
- critical safeguards;
- cost and latency;
- unsupported or weakly supported scenarios;
- required monitoring and rollback conditions.

The decision can then be expressed plainly:

```text
ship:
use cases that consistently meet the bar

limit:
use cases where performance remains weak

protect:
high-impact actions with code and human review

monitor:
known failure areas and important outcomes

improve:
add new failures to the eval set

recheck:
rerun the evals before expanding scope
```


A result applies to the version and cases that were tested. It should not be treated as proof that the system works equally well for other languages, regions, workflows, data conditions, user groups, or future configurations.

The practical rule is:

> **Ship the scope the results support.**

### 6. Production operation


Offline evals do not replace production feedback.

After release:

- sample real interactions;
- review high-impact failures;
- monitor important product outcomes by scenario;
- compare production behavior with the eval results;
- investigate new failure patterns;
- add important failures to the regression suite;
- recheck quality after meaningful model, prompt, data, tool, or workflow changes;
- restrict or roll back when production behavior falls below the bar.

OpenAI similarly describes evals as a maintained system that must evolve as models, data, business goals, and failure modes change. It also treats evals as complementary to A/B tests and normal product experimentation rather than a replacement for them.

## A practical example: account-compromise escalation


Consider an AI support assistant that identifies possible account compromise and decides whether to escalate a ticket.

### Define the quality bar


For supported English-language account-security tickets:

- recall for confirmed compromise cases must be at least 97%;
- recall must also be at least 97% for critical slices, including explicit and indirect reports;
- false-positive escalation must remain below 5%;
- a ticket identified as compromised must never reach the automatic close operation;
- p95 processing time must remain below eight seconds.

### Guarantee what we can in code


Code review and deterministic tests establish that:

- a ticket classified as compromised cannot call the close-ticket function;
- escalation requires a valid account identifier;
- the escalation API enforces authorization and idempotency;
- tool arguments must satisfy the API schema;
- model, prompt, routing, policy, and tool versions are recorded.

These checks establish that the safeguards are implemented correctly. They do not establish whether the model will recognize an indirect compromise report.

### Run the evals


On 1,200 representative cases, the complete system produces:

|Measure|Result|
|---|--:|
|Overall compromise recall|98.1%|
|False-positive escalation|4.3%|
|Explicit-report recall|99.2%|
|Indirect-report recall|92.4%|
|p95 latency|7.4 seconds|
|Confirmed compromise cases automatically closed|0 observed|

The overall result passes, but the indirect-report slice fails its 97% quality bar.

### Make a scoped release decision


The appropriate decision is not simply "pass" or "fail."

```text
ship:
explicit account-compromise scenarios

limit:
indirect, ambiguous, and low-confidence scenarios

protect:
send limited scenarios to human review
prohibit automatic closure for account-security tickets

monitor:
escalation outcomes by scenario
closure outcomes for confirmed compromise cases

improve:
add indirect-language failures to the regression set

recheck:
evaluate again before expanding autonomous handling
```


The release follows the results: ship the supported scope, restrict the weak slice, preserve hard safeguards, and gather stronger results before expanding.

## What an AI engineering system should provide


At minimum, teams need:

### A clear quality bar


A shared understanding of what good looks like, which failures matter, and which scope is supported.

### A living eval set


Realistic cases covering important capabilities, scenarios, users, edge cases, and known failures.

### A product-specific data viewer


A low-friction way for engineers, product people, and domain experts to inspect outputs, traces, context, and failures.

### An eval runner


A repeatable way to run the current system and compare results with a baseline.

### Trace and version capture


Enough information to reproduce behavior and identify which model, prompt, data, tool, or configuration produced it.

### Error analysis


A regular practice of looking at actual outputs, grouping failures, and selecting the next problem to solve.

### Domain-expert review


Direct expert participation in defining quality, judging outputs, explaining errors, and calibrating automated graders.

### Regression protection


Tests built from previously solved failures so that improvements do not quietly break existing behavior.

### Release controls


The ability to ship gradually, restrict weak scenarios, route cases to a person, monitor outcomes, and roll back.

### Production feedback


A process for turning real failures into new eval cases and engineering work.

These components do not need to begin as a large centralized platform. A small team can start with a spreadsheet, a trace viewer, a few dozen realistic cases, and a weekly review of failures. The system can become more automated and shared as the number of products and teams grows.

## What this changes in the organization

### Product teams own AI quality


The team building the capability should own:

- the quality bar;
- the eval set;
- important failure modes;
- release readiness;
- production behavior.

Quality should not be delegated entirely to a separate QA, platform, or governance function.

### Domain expertise becomes delivery capacity


Expert time must be planned as part of delivery. Domain experts are needed not only for requirements, but also for evaluation, error analysis, calibration, and improvement.

### Platform teams reduce repeated work


A shared AI engineering or platform team can provide:

- model access;
- tracing;
- eval execution;
- versioning;
- replay;
- deployment controls;
- monitoring;
- shared security and privacy controls.

Product-specific quality judgments and eval cases should remain close to the product and its domain.

### Roadmaps distinguish target from uncertainty


The roadmap can still commit to a product outcome or target capability.

Where feasibility or the path to the quality bar is uncertain, the plan should include:

- a baseline;
- time-boxed experiments;
- clear decision points;
- capability milestones;
- explicit quality thresholds;
- a decision to continue, change scope, pivot, or stop.

The goal is not to replace every feature with an experiment. It is to avoid making a delivery commitment before the team has enough evidence that the capability can meet the required bar. Hamel frames this as planning around capability progress and time-boxed feasibility work rather than treating an AI feature name as proof that the technology is ready to deliver it.

## Working principles


1. **Define what good looks like.**
2. **Look at actual outputs.**
3. **Start with failures that matter, not generic metrics.**
4. **Build evals from realistic user cases.**
5. **Use domain experts to judge domain quality.**
6. **Compare meaningful changes with a baseline.**
7. **Check whether a fix breaks something elsewhere.**
8. **Turn important production failures into regression tests.**
9. **Use code and permissions for hard guarantees.**
10. **Do not rely on model behavior alone for irreversible actions.**
11. **Ship only the use cases that meet the quality bar.**
12. **Rerun the evals when the model or surrounding system changes.**

## The core principle


> **Do not infer that an AI product works from its architecture, prompts, or implementation alone. Define the quality bar, run the complete product on cases that matter, inspect the failures, and use the results to decide what to improve and what is ready to ship.**
