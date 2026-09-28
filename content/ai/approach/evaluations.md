---
draft: false
toc: true
title: "Evaluations"
linkTitle: "Evaluations"
---
# Evaluation in AI Product Development


Evaluation is a maintained capability for understanding and characterizing how an AI product actually behaves and for turning observations of that behavior into justified evidence.

I treat it as foundational to AI product development because both discovery and delivery depend on that capability. Discovery needs evidence to investigate candidate solutions and decide what deserves further investment. Delivery needs evidence to establish and maintain the behavior that users will depend on. Production creates new observations that can change both.

Evaluation provides the behavioral evidence base for these decisions. It does not replace other forms of product evidence. User research, business and operating constraints, workflow observation, and evidence about actual outcomes answer different questions. Product and engineering responsibility remain responsible for deciding what to build, what to offer, and under which conditions.

## Two views of evaluation


Evaluation can be viewed through two complementary lenses.

From the **product-development perspective**, the focus is on how evidence about behavior participates in discovery, production commitments, delivery, release, and subsequent learning from production.

From the **evaluation-system perspective**, the focus is on how that evidence is produced: how behavior is observed, characterized, judged, compared, preserved, and turned into findings that can support decisions.

These are two views of the same capability.

The first explains where evaluation participates in product development. The second explains what needs to exist for that participation to be reliable and repeatable.

# Product-development perspective

## Evaluation in discovery


Discovery starts with a problem and a desired outcome.

A candidate solution carries assumptions about value, usability, feasibility, and business viability: whether users will choose it, whether they can use it, whether we can build it, and whether it works for the business.

When those assumptions depend on how an AI system behaves, evaluation gives us a way to investigate them.

We may know what we want an assistant to do without knowing which combination of model, instructions, information, retrieval, tools, application logic, and workflow will produce that behavior across the situations users encounter.

Evaluation helps investigate the relationship between what we build and how it behaves.

Before an experiment, I want to identify:

- the uncertainty being investigated;
- the decision that uncertainty affects;
- the evidence that could change the decision;
- and the limits of the test.

This makes the result interpretable.

The experiment itself can be small and fast. When it affects real users or systems, it also needs appropriate safeguards, observation, and a way to stop it.

Evaluation during discovery can help compare approaches, examine failures, identify unsupported assumptions, and refine the team's understanding of the required behavior.

A finding may justify another experiment, further investment in an implementation, a narrower scope, a different solution, or ending work on the current approach.

The depth of investigation should follow the decision and the consequences of being wrong.

Evaluation contributes behavioral evidence to discovery. It does not answer every discovery question. Whether users want the solution, whether the workflow is usable, whether the business can support it, and whether it produces the intended outcome require their own evidence.

## Establishing a production commitment


Discovery can eventually produce enough evidence to justify investment in a production solution.

That decision starts from a candidate solution, the evidence supporting it, the uncertainty that remains, and the relevant constraints.

The next question is what the team is prepared to support. Evaluation helps establish the behavioral part of that commitment. It provides evidence about what the system currently does, where its boundaries appear to be, and which important uncertainties remain.

Architecture, controls, release engineering, and operations provide the means to fulfill the commitment. A production commitment could be framed also as an [Solution Utility Ladder]({{< ref "ai/operating-model/solution-utility-ladder" >}}).

## Evaluation during delivery


During delivery, evaluation follows the product behavior the team has committed to support.

The implementation may change substantially while the intended product behavior remains stable. A model can change. Prompts can change. Retrieval can change. Tool use, application logic, controls, and the user interaction can change. For each change, the team needs to understand whether the intended behavior improved and whether behavior that already worked has degraded.

Evaluation therefore supports comparison between implementations, investigation of failures, regression detection, and release decisions. A finding can lead to a change in retrieval, instructions, application logic, workflow, interaction design, controls, or recovery.

It can also expose uncertainty about the expected behavior itself. In that case, the problem may no longer be purely a delivery problem. The finding can create a new discovery question, lead to a change in supported scope, or cause the team to reconsider the solution. Evaluation can reveal a mismatch. Explaining why the mismatch occurred may require further investigation.

## Evaluation in production


Release does not finish the work of understanding the product. Production introduces actual users, inputs, states, dependencies, operating conditions, and failures that earlier work may not have represented.

These observations become new evidence. They can reveal missing cases, previously unknown failures, differences between evaluation conditions and live use, or situations in which the current product expectations are incomplete.

Production findings can change engineering priorities, supported scope, evaluation cases, controls, or the solution itself. Discovery and delivery therefore continue together after release. The team continues to examine both the behavior it provides and whether the complete product helps users achieve the intended outcome.

## Example: a customer-support assistant


Consider a hypothetical assistant that drafts customer-support replies using company policies and order information. The desired outcome is to help support agents resolve requests with less effort while avoiding incorrect promises to customers.

Drafting replies is a candidate solution. During discovery, the team can examine whether drafts apply the relevant policies, including important exceptions. It can separately observe how agents review and correct those drafts.

These answer different questions. The first concerns whether the system produces the intended behavior. The second concerns whether the resulting workflow actually reduces the agents' effort.

Suppose evaluation shows that routine requests are handled acceptably but some policy exceptions remain unreliable. The team may decide that the evidence supports a limited production commitment: routine requests are supported, agent approval remains required, and unsupported situations are sent for manual handling.

Delivery then needs to implement those boundaries and establish that they work well enough for release.

If a later change improves handling of exceptions, the team still needs to assess its effect on situations that were already supported. The finding may justify extending the supported scope, keeping the existing limits, or performing more investigation.

At the same time, technically correct drafts may still require too much review and correction. That is a different product question. The team may need to change the interaction, narrow the workflow, or reconsider drafting as the solution.

Evaluation of system behavior contributes evidence to that decision, but it does not replace observation of the complete user workflow.

# Evaluation-system perspective


The product-development view explains where evaluation is used. The evaluation-system view asks what capability the team needs in order to produce and maintain that evidence.

## The evaluation subsystem


The questions described above recur throughout product development. A team therefore needs more than isolated experiments or one-time test results.

I use **evaluation subsystem** to describe the maintained capability for understanding and characterizing product behavior: the people, practices, data, methods, and software used to preserve relevant cases, observe behavior, compare changes, investigate failures, interpret results, and bring production findings back into development.

## Developing an understanding of quality


Evaluation also requires an evolving understanding of what behavior matters. Broad expectations become useful when people examine concrete situations.

For example, "follows company policy" becomes more precise when engineers and domain experts inspect a case where omitting a particular exception changes the correct response.

Cases help expose assumptions.

They can reveal that people disagree about what the product should do, that a criterion is incomplete, that an important distinction has been missed, or that a supposed failure is actually a disagreement about the expected behavior.

Engineers and domain experts therefore develop the evaluation practice together.

They select relevant situations, inspect behavior, make expectations more concrete, develop criteria, and revise those criteria as their understanding changes.

Disagreement is useful evidence about the evaluation system itself.

It can reveal unclear expectations, missing domain knowledge, insufficient context, or an evaluation method that does not distinguish the behavior people actually care about.

Shared cases and criteria give the team a more precise language for discussing product behavior and proposed changes.

## Producing useful evidence


An evaluation result has a scope. It reflects the situations examined, the system version, the available context, the criteria, and the way the judgments were made. A score or aggregate result needs that context before it can support a conclusion about the product.

Different evaluation designs also support different claims. A deliberately difficult case can demonstrate that a failure is possible. It does not establish how frequently that failure occurs in production. A selected case set can support a decision about particular behavior without establishing that the same behavior holds across every situation users will encounter. A comparison between two implementations can provide useful evidence for a specific change while leaving unrelated aspects of the product unexamined.

The conclusion therefore needs to match the question investigated and the limits of the evidence.

Remaining uncertainty does not automatically prevent action. It becomes part of the decision about scope, controls, rollout, observation, and recovery.

## Behavior and product success


Evidence about product behavior also has limits as evidence about product success.

The solution utility ladder helps keep different claims separate.

A system may:

1. produce a valid output;
2. provide the intended behavior;
3. allow the user to complete the job;
4. improve on the current alternative;
5. contribute to the intended outcome.

Evidence for one claim does not establish the next. A system can behave according to its specification while requiring too much user effort. A workflow can save time while failing to produce the intended business or user outcome. A technically capable solution can still be rejected by users.

These questions require their own investigation.

Evaluation provides evidence about product behavior. User research, workflow observation, product analytics, business evidence, and other methods contribute evidence about the broader product.

The people responsible for the product remain responsible for deciding what the evidence means for the product and what commitments to make.

## Maintaining the evaluation capability


> Evaluation as a product itself

The evaluation subsystem itself can become wrong or incomplete. Cases can become outdated. Recorded results can omit context needed for later investigation. Criteria can stop representing the behavior the product now needs. Automated evaluators can make unreliable judgments. Production can reveal situations absent from the existing evaluation set.

A change in an evaluation method can also look like a change in product quality if the team does not distinguish the two.

The subsystem therefore needs maintenance and its own methods must remain open to examination and revision. This does not imply that every team needs a large evaluation platform from the beginning.

The initial capability may require only a focused set of relevant cases, recorded results with enough context to review, people who can judge the behavior, and an explicit account of the finding and its limits.

Infrastructure and automation should follow the recurring questions and the evidence they require.

The depth of evaluation should also follow the decision. A limited, reversible step with visible failures can justify proceeding with more uncertainty than a broad release whose failures are difficult to detect or expensive to correct.

The objective is not to eliminate uncertainty before building. It is to have enough relevant evidence, appropriate limits, and a response suitable for the step being taken.

## Cost and proportionality


Evaluation has a cost. Cases need to be selected and maintained. Results need to be recorded. People need to review behavior. Infrastructure and automated evaluators require development and maintenance.

Its usefulness should therefore be judged through the decisions and engineering work it enables.

## Organizational conditions


When evaluation becomes a recurring dependency of product development, it needs explicit organizational support.

That includes planned time, access to relevant data and expertise, clear responsibility, and engineering capacity to respond to findings.

The evidence also needs a route into the decisions it was collected to inform.

# One continuing product system


The two views describe one system.

From the product-development perspective:

**discovery -> production commitment -> delivery -> production -> further discovery or delivery**

From the evaluation-system perspective:

**question -> observation -> judgment -> evidence -> finding -> revised understanding**

They connect continuously. A discovery question creates a need for evidence. Evaluation produces evidence about candidate behavior. That evidence contributes to a product commitment. Delivery changes the implementation and creates new evaluation questions. Production creates new observations. Those observations can change the implementation, the supported product scope, the team's understanding of quality, or the evaluation methods themselves.

> Evaluation is therefore foundational to AI product development because discovery and delivery depend on a continuing ability to examine assumptions, understand actual behavior, and revise commitments as the product changes.

Evaluation provides the behavioral evidence. And engineering and product responsibility use that evidence, together with other forms of product evidence, to build, operate, and improve the product.
