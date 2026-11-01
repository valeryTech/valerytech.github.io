---
draft: false
toc: true
description: "Trace review, targeted evaluators, and workbench design for finding workflow failures missed by response-level metrics."
title: "03 Eval Failure Mode"
linkTitle: "Evaluation Failure Modes"
---
# Evaluation failure modes and workbench design

## Failures missed by standard metrics


Accuracy, BLEU, and generic LLM judges can miss workflow failures when they assess only the final response. An agent can produce a fluent, relevant, polite answer while abandoning a recoverable conversation or omitting a required human handoff. Detecting these failures requires the trace, product goal, workflow state, and applicable business rules.

A response can be **locally correct, operationally wrong**: it passes a response-level check but violates a product goal, workflow rule, channel constraint, or required action.

## Evaluation system


Evaluation should describe system state and behavior, test design hypotheses, and compare configurations. These results guide product and system design, experiments, and delivery. The scope described here remains incomplete as evaluation practices develop.

### Product framing and test coverage


Define the problem, product goals, jobs to be done (JTBDs), and required guarantees. Use them to guide design decisions. Aim to cover important invariants, jobs, and known failures in the test set.

Critical features can be specified upfront. "Grounding theory" is proposed as the most complete approach; the method and its relation to the specification need clarification.

### Versioned system under test


The evaluation system runs the AI product as a versioned **system under test (SUT)**. Use a declarative manifest to start the configuration required for each experiment. Version prompts, model settings, workflows, tools, retrieval, routing, and other relevant components.

### Interactive AI workbench


An **AI workbench** combines the SUT runner, evaluation engine, collections, logging, and an interface for domain experts to inspect runs and compare configurations. Experience across several projects suggests that this shortens feedback loops for delivery and quality improvements.

1. Change a configuration, such as a prompt.
2. Start the configured SUT and run a predefined test set.
3. Collect traces, including component and tool activity, for inspection.
4. Run configured judges on each sample, using the whole trace or a specific step, such as RAG.
5. Run the evaluation calculation graph to aggregate judgments into run-level statistics, such as the mean pass rate for one failure mode.

Fast, reliable comparison of two experiment results is a core requirement. Results must be easy to inspect and compare.

### Shared evaluation terminology


Define run, span, trace, SUT, evaluation run, SUT run, SUT-run results, and judge results consistently.

Judges and evaluation calculations need further specification. The term "rulers" remains undefined.

## Reported findings


- NurtureBoss found a 66% failure rate for relative-date requests through manual trace review. Targeted date-handling tests helped raise success from 33% to 95%.
- Automated reviewers missed polite, coherent conversations where agents abandoned sales objections, used Markdown in SMS, interrupted callers, or omitted required human handoffs.
- Honeycomb found executable queries with incorrect analytical meaning: a slowest-trace query calculated maximum duration without grouping by trace ID. A specialized judge using expert-critique examples exceeded 90% agreement after three iterations.
- At a 5% failure rate, an always-`Pass` judge has 95% agreement and zero failure recall.

## From trace review to a focused evaluator


1. Review complete traces in the workbench against product goals and workflow rules.
2. Write open-ended critiques without forcing them into a predefined taxonomy. Group recurring behaviors into failure modes and collect positive and negative examples around each decision boundary.
3. Build a binary evaluator for one failure mode. Supply the relevant conversation, workflow state, tool results, and escalation policy. For a handoff failure, ask: when the trigger occurred, did the agent resolve the situation appropriately or hand it off?
4. Calibrate against expert labels. Separate development and test examples; report failure recall and false-alarm rate rather than aggregate agreement alone.
5. Add confirmed cases to regression tests. Continue sampling production traces for new variants.

Domain review identifies product obligations missing from generic rubrics. Convert these obligations into explicit evaluation criteria.

## Evidence for a concrete case study


- Use a specific incident, including for unpublished case studies.
- Candidate incidents: relative-date errors, channel-inappropriate formatting, executable but semantically wrong queries, unsupported promises, or actions without required confirmation.
- Verify claims about expert labels, development/test splits, failure recall, and false-alarm measurement against the practices actually used.

## Failure examples from error analysis, open coding, and clustering


Review full traces, record open-ended observations, and group related observations. The examples cover product behavior, evaluators, and evaluation design.

### Domain-specific failures found in production traces


1. **Relative-date handling.** NurtureBoss's leasing assistant failed 66% of requests such as "two weeks from now." Manual trace review identified variants; targeted tests helped raise success from 33% to 95%.
2. **Conversation flow losing context.** Fluent responses lost prior context or replied awkwardly. This was one of the three largest groups after reviewers coded and counted their trace notes.
3. **Rescheduling problems.** The assistant misinterpreted dates when prospects changed tour times. Grouping traces identified a recurring scheduling failure, another of the three largest groups.
4. **Prematurely abandoning a recoverable conversation.** A leasing agent accepted the first sales objection and ended the exchange instead of addressing it. The polite response looked reasonable unless judged against the conversion goal.
5. **Required human handoff omitted.** The agent continued conversations that property policy required it to hand off. Generic automated analysis did not reliably detect the violation because the policy was absent from the transcript.
6. **Channel-inappropriate formatting.** Markdown looked valid in transcripts but appeared as stray characters in SMS. Missing channel context hid the failure.
7. **Voice interruption.** A voice agent talked over callers. Text-only transcript inspection did not expose the timing and turn-taking failure.
8. **Unsupported scheduling or follow-up claims.** Agents promised appointments or callbacks without a supporting tool result or recorded action.
9. **Repeated request for confirmation.** The agent requested confirmation after the user had already confirmed. This did not prevent task completion but degraded the interaction.
10. **Answer contradicting tool output.** The response contradicted a retrieved value or tool result. Detection is easier when the evaluator receives both the response and execution evidence.
11. **Unsupported property descriptions.** Agents called an ordinary one-bedroom unit a loft, described a market-rate unit as affordable housing, and answered a floor-level question without floor data.
12. **Wrong interaction mode.** An in-person tour link was presented as confirmation of a virtual tour. The link was plausible but the mode was wrong.

### Outputs that were valid but semantically wrong


13. **Slowest-trace query without trace grouping.** Honeycomb's assistant used `MAX(duration_ms)` and descending order without grouping by trace ID. The query measured maximum duration rather than identifying the slowest trace.
14. **"Per hour" query with an insufficient observation window.** The query counted values correctly but selected too little history to reveal an hourly pattern. Valid syntax hid the wrong analytical interpretation.
15. **Retrieved the right guidance but omitted it from the answer.** The system detected an invalid order number and retrieved the valid format and new-user advice. The answer only reported that the order was not found. Error analysis identified missing user education, rather than a retrieval failure.

### Failures in the evaluator or measurement system


16. **High agreement with zero failure recall.** At a 5% failure rate, an always-`Pass` judge has 95% agreement and zero failure recall. Measure true-positive and true-negative rates on held-out human labels.
17. **One broad judge trying to catch unrelated failures.** A general "conversation quality" judge is hard to align and produces findings that are hard to act on. A narrow question such as "Did the assistant escalate when policy required it?" defines a clearer decision boundary.
18. **Judge missing necessary context.** A response-only judge cannot assess claims that require user metadata, tool output, system state, channel, or business policy. Full traces can also distract the judge. Select relevant context and test it through ablation against human labels.
19. **Convincing false positives from automated analysis.** Automated tools sometimes flagged internal metadata as missing user-visible information or applied overly strict completeness criteria. Rereading full traces exposed these false positives.
20. **Inflated severity.** An analyzer could flag a plausible issue but overstate its severity, distorting priorities.

### Failures in evaluation design and operation


21. **Rubric written before observing failures.** In Nova Escola's lesson planner, most predefined criteria had no observed failures. Labeling them consumed effort without helping improve the product.
22. **Automating an evaluator for a problem that needed a direct fix.** The lesson planner sometimes produced two learning goals instead of one. A prompt change fixed this, so a dedicated automated evaluator was unnecessary at that stage.
23. **Annotators agreeing less often than chance.** Two reviewers lacked a clear shared definition of quality. The team rewrote the rubric with pedagogical experts and relabeled the data before trusting automated evaluation.
24. **A stale label space.** A classifier can score well on a fixed test set while new production intents have no valid label. Cluster production traces, triage them manually, update the taxonomy, and test emerging intents to check whether the labels still cover user demand.

### Adversarial and diagnostic failures


25. **Irreversible action without confirmation.** An assistant correctly cancels a flight without requesting confirmation first. Outcome success hides the missing safety step.
26. **Sensitive information requested before authentication.** A billing assistant asks for an account number and full name without first directing the user through a secure identity check.
27. **Multiple matches treated as one.** Several active orders match "Where is my order?" The system selects one without asking the user to disambiguate.
28. **System error treated as a normal result.** A dependency is unavailable, but the agent responds as if it received authoritative data. It should report the failure or offer a safe alternative.
29. **Unsupported feature accepted.** The agent claims or implies support for an unavailable action, such as changing a payment method after shipment.
30. **Multi-turn symptom hiding a simple single-turn failure.** A shopping assistant gives the wrong return policy on turn four. Testing "What is the return window for product X1000?" in isolation helps distinguish retrieval or knowledge failures from conversation-memory failures.
31. **Tool-call success without outcome success.** A successful contact-creation tool call may create no record, the wrong record, or a duplicate. Query authoritative state and verify that exactly one matching contact exists.

## Standard judges


Here, "standard LLM-as-judge" is an informal term for a generic judge that reads the input and final response and returns a score or pass/fail under a broad rubric, such as correctness/helpfulness. It often lacks domain calibration.

Use narrow evaluators with relevant evidence. A more capable judge alone may not improve evaluation.

|Standard judge|More rigorous alternative|
|---|---|
|One overall quality prompt|One evaluator per failure mode|
|Final response only|Relevant trace, tools, state, sources, and outcome|
|Generic rubric|Clinician-defined criteria and examples|
|Scalar or overall pass/fail|Actionable reason codes and component attribution|
|Raw agreement/accuracy|TPR and TNR on held-out clinician labels|
|Forced judgment|`Unknown` or abstention when evidence is insufficient|
|Independent cases|Paired counterfactual and invariance tests|
|Semantic judgment for everything|Deterministic checks where correctness is mechanical|
|Measures known criteria|Human trace review to discover criteria the rubric lacks|

### Clinical evaluator set


1. Deterministic checks: schema, medical identifiers, negation, temporal consistency, required fields, tool outcomes, and state changes.
2. Narrow clinical judges for failures requiring expert judgment: unsupported assertions, omitted material findings, incorrect subject attribution, and inappropriate escalation.
3. Evidence for each judge: only relevant clinical evidence, ontology relationships, and execution results.
4. Counterfactual tests: change one clinically meaningful fact and expect the decision to change. Invariance tests: change irrelevant facts and expect the decision to stay the same.
5. Calibrate against clinician labels; report failure recall and false-alarm rate separately.
6. Continue human review of production traces to find failures outside the rubric.
