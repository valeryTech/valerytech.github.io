---
draft: false
toc: true
title: "Evaluation Failure Modes"
description: "Workflow failures that response-level metrics miss, examples found by error analysis, and how to build a focused evaluator for each."
linkTitle: "Evaluation Failure Modes"
---
## Failures missed by standard metrics


Accuracy, BLEU, and generic LLM judges can miss workflow failures when they assess only the final response. An agent can produce a fluent, relevant, polite answer while abandoning a recoverable conversation or omitting a required human handoff. Detecting these failures requires the trace, product goal, workflow state, and applicable business rules.

A response can be **locally correct, operationally wrong**: it passes a response-level check but violates a product goal, workflow rule, channel constraint, or required action.

The evaluator terms used here, such as failure mode, deterministic evaluator, LLM judge, and reference-free and reference-based evaluation, are defined in [Evaluators]({{< ref "ai-engineering/concepts/evaluation/evaluators" >}}). Alignment, TPR and TNR, false Pass and false Fail, and the examples, tuning set, and validation set are defined in [Evaluator alignment]({{< ref "ai-engineering/concepts/evaluation/evaluator-alignment" >}}). The workbench where traces are reviewed is described in [Evaluation subsystem]({{< ref "ai-engineering/evaluation/framework-v2/subsystem-and-production" >}}#workbench-for-domain-experts).

## Reported findings


- NurtureBoss found a 66% failure rate for relative-date requests through manual trace review. Targeted date-handling tests helped raise success from 33% to 95%. ([Husain 2025a](#husain-2025a))
- Automated reviewers missed polite, coherent conversations where agents abandoned sales objections, used Markdown in SMS, interrupted callers, or omitted required human handoffs. ([Saha and Husain 2025](#saha-2025))
- Honeycomb found executable queries with incorrect analytical meaning: a slowest-trace query calculated maximum duration without grouping by trace ID. ([Husain 2024](#husain-2024)) An LLM judge whose few-shot examples came from expert critiques exceeded 90% agreement with the expert after three rounds of prompt changes. ([Husain 2025a](#husain-2025a))
- At a 5% failure rate, an evaluator that always returns Pass agrees with the expert on 95% of traces, with a TPR of 100% and a TNR of 0%: it catches no failure. ([Husain 2024](#husain-2024))

## From trace review to a focused evaluator


Steps 1 and 2 are error analysis, described in [Error analysis]({{< ref "ai-engineering/concepts/evaluation/error-analysis" >}}).

1. Review complete traces in the workbench against product goals and workflow rules (error analysis).
2. Write open-ended notes on each trace without forcing them into a predefined taxonomy. Group recurring behaviors into failure modes, and collect clear Pass and clear Fail traces around each decision boundary.
3. Sort each failure mode. Fix a specification failure in the prompt, with no evaluator. Build an evaluator for a generalization failure, which remains after the prompt is clear. ([Shankar and Husain 2026](#shankar-2026))
4. Build one binary evaluator for each failure mode: a deterministic evaluator where the rule is mechanical, an LLM judge where it needs interpretation. Supply the relevant conversation, workflow state, tool results, and escalation policy. For a handoff failure, ask: when the trigger occurred, did the agent resolve the situation appropriately or hand it off?
5. Write the LLM judge's prompt in the four parts described in [Evaluators]({{< ref "ai-engineering/concepts/evaluation/evaluators" >}}#the-parts-of-an-llm-judge-prompt), with a clear Pass and a clear Fail as examples.
6. Measure the evaluator's alignment with expert labels: tune the prompt on the tuning set, then report TPR and TNR on the validation set, as described in [Evaluator alignment]({{< ref "ai-engineering/concepts/evaluation/evaluator-alignment" >}}).
7. Ask the LLM judge about each trace three to five times. A result that changes between repeats shows that the criterion needs more detail or more examples. ([Shankar and Husain 2026](#shankar-2026))
8. To estimate the pass rate on unlabeled production traces, correct the evaluator's observed pass rate with its TPR and TNR, and give a confidence interval around the corrected rate, as described in [Evaluator alignment]({{< ref "ai-engineering/concepts/evaluation/evaluator-alignment" >}}#estimating-the-pass-rate-with-an-imperfect-evaluator).
9. Add confirmed cases to regression tests. Continue sampling production traces for new variants, add new failure modes to all three sets, and measure alignment again after a model or prompt change.

Domain review identifies product obligations missing from generic rubrics. Convert these obligations into explicit Pass and Fail definitions.

{{< callout context="note" title="Case study to write" icon="outline/info-circle" >}}
- Use a specific incident, including for unpublished case studies.
- Candidate incidents: relative-date errors, channel-inappropriate formatting, executable but semantically wrong queries, unsupported promises, or actions without required confirmation.
- Verify claims about expert labels, the three sets of labeled traces, TPR, and TNR against the practices actually used.
{{< /callout >}}

## Failure examples from error analysis, open coding, and clustering


Review full traces, record open-ended observations, and group related observations. The examples cover product behavior, evaluators, and evaluation design.

### Domain-specific failures found in production traces


1. **Relative-date handling.** NurtureBoss's leasing assistant failed 66% of requests such as "two weeks from now." Manual trace review identified variants; targeted tests helped raise success from 33% to 95%. ([Husain 2025a](#husain-2025a))
2. **Conversation flow losing context.** Fluent responses lost prior context or replied awkwardly. This was one of the three largest groups after reviewers coded and counted their trace notes. ([Husain 2025a](#husain-2025a))
3. **Rescheduling problems.** The assistant misinterpreted dates when prospects changed tour times. Grouping traces identified a recurring scheduling failure, another of the three largest groups. ([Husain 2025a](#husain-2025a))
4. **Prematurely abandoning a recoverable conversation.** A leasing agent accepted the first sales objection and ended the exchange instead of addressing it. The polite response looked reasonable unless judged against the conversion goal. ([Saha and Husain 2025](#saha-2025))
5. **Required human handoff omitted.** The agent continued conversations that property policy required it to hand off. Generic automated analysis did not reliably detect the violation because the policy was absent from the transcript. ([Husain 2025a](#husain-2025a); [Saha and Husain 2025](#saha-2025))
6. **Channel-inappropriate formatting.** Markdown looked valid in transcripts but appeared as stray characters in SMS. Missing channel context hid the failure. ([Saha and Husain 2025](#saha-2025))
7. **Voice interruption.** A voice agent talked over callers. Text-only transcript inspection did not expose the timing and turn-taking failure. ([Saha and Husain 2025](#saha-2025))
8. **Unsupported scheduling or follow-up claims.** Agents promised appointments or callbacks without a supporting tool result or recorded action. ([Saha and Husain 2025](#saha-2025))
9. **Repeated request for confirmation.** The agent requested confirmation after the user had already confirmed. This did not prevent task completion but degraded the interaction. ([Saha and Husain 2025](#saha-2025))
10. **Answer contradicting tool output.** The response contradicted a retrieved value or tool result. ([Saha and Husain 2025](#saha-2025)) Detection is easier when the evaluator receives both the response and execution evidence.
11. **Unsupported property descriptions.** Agents called an ordinary one-bedroom unit a loft, described a market-rate unit as affordable housing, and answered a floor-level question without floor data. ([Saha and Husain 2025](#saha-2025))
12. **Wrong interaction mode.** An in-person tour link was presented as confirmation of a virtual tour. The link was plausible but the mode was wrong. ([Saha and Husain 2025](#saha-2025))

### Outputs that were valid but semantically wrong


13. **Slowest-trace query without trace grouping.** Honeycomb's assistant used `MAX(duration_ms)` and descending order without grouping by trace ID. The query measured maximum duration rather than identifying the slowest trace. ([Husain 2024](#husain-2024))
14. **"Per hour" query with an insufficient observation window.** The query counted values correctly but selected too little history to reveal an hourly pattern. Valid syntax hid the wrong analytical interpretation. ([Husain 2024](#husain-2024))
15. **Retrieved the right guidance but omitted it from the answer.** The system detected an invalid order number and retrieved the valid format and new-user advice. The answer only reported that the order was not found. Error analysis identified missing user education, rather than a retrieval failure. ([Husain 2024](#husain-2024))

### Failures of the evaluators


16. **High agreement with no failure caught.** At a 5% failure rate, an evaluator that always returns Pass agrees with the expert on 95% of traces and has a TNR of 0%. Measure TPR and TNR separately on a validation set of expert labels. ([Husain 2024](#husain-2024); [Shankar and Husain 2026](#shankar-2026))
17. **One LLM judge for several failure modes.** A general "conversation quality" judge is hard to align, and its Fails are hard to act on, since a Fail doesn't say which failure occurred. A judge for one failure mode, such as "Did the assistant escalate when policy required it?", has a clearer decision boundary. ([Husain and Shankar 2026c](#husain-shankar-2026c); [Shankar and Husain 2026](#shankar-2026))
18. **Evaluator missing necessary context.** A response-only evaluator cannot assess claims that require user metadata, tool output, system state, channel, or business policy. Full traces can also distract an LLM judge. Select the relevant context and test the selection against expert labels through ablation. ([Husain and Shankar 2026a](#husain-shankar-2026a))
19. **Convincing false Fails from automated analysis.** Automated tools sometimes flagged internal metadata as missing user-visible information or applied overly strict completeness criteria. Rereading full traces exposed these false Fails. ([Saha and Husain 2025](#saha-2025))
20. **Inflated severity.** An analyzer could flag a plausible issue but overstate its severity, distorting priorities. ([Saha and Husain 2025](#saha-2025))
21. **An LLM judge prompt with no examples.** Without a clear Pass and a clear Fail in the prompt, the judge has nothing that shows where the decision boundary lies. The chapter names this the most common mistake in an LLM judge's prompt. ([Shankar and Husain 2026](#shankar-2026))
22. **Data leakage between the prompt and the alignment sets.** A trace shown as a few-shot example and also used to measure alignment inflates TPR and TNR, because the judge has seen it. ([Shankar and Husain 2026](#shankar-2026))
23. **Known LLM judge biases.** LLM judges favor the response shown first, the longer response, and the output of their own model. ([Shankar and Husain 2026](#shankar-2026))

### Failures in evaluation design and operation


24. **Rubric written before observing failures.** In Nova Escola's lesson planner, most predefined criteria had no observed failures. Labeling them consumed effort without helping improve the product. ([Husain 2025b](#husain-2025b))
25. **An evaluator built for a specification failure.** The lesson planner sometimes produced two learning goals instead of one. A prompt change fixed this, so a dedicated evaluator was unnecessary at that stage. ([Husain 2025b](#husain-2025b))
26. **Annotators agreeing less often than chance.** Two reviewers lacked a clear shared definition of quality. The team rewrote the rubric with pedagogical experts and relabeled the data before trusting automated evaluation. ([Husain 2025b](#husain-2025b))
27. **A stale label space.** A classifier can score well on a fixed test set while new production intents have no valid label. Cluster production traces, triage them manually, update the taxonomy, and test emerging intents to check whether the labels still cover user demand.
28. **Alignment measured once.** Production data drifts, new failure modes appear, and model updates change an LLM judge's behavior. Label a few fresh traces regularly and recompute TPR and TNR. ([Shankar and Husain 2026](#shankar-2026))

### Adversarial and diagnostic failures


29. **Irreversible action without confirmation.** An assistant correctly cancels a flight without requesting confirmation first. Outcome success hides the missing safety step. ([Husain 2024](#husain-2024))
30. **Sensitive information requested before authentication.** A billing assistant asks for an account number and full name without first directing the user through a secure identity check. ([Husain 2024](#husain-2024))
31. **Multiple matches treated as one.** Several active orders match "Where is my order?" The system selects one without asking the user to disambiguate. ([Husain 2024](#husain-2024))
32. **System error treated as a normal result.** A dependency is unavailable, but the agent responds as if it received authoritative data. It should report the failure or offer a safe alternative. ([Husain 2024](#husain-2024))
33. **Unsupported feature accepted.** The agent claims or implies support for an unavailable action, such as changing a payment method after shipment. ([Husain 2024](#husain-2024))
34. **Multi-turn symptom hiding a simple single-turn failure.** A shopping assistant gives the wrong return policy on turn four. Testing "What is the return window for product X1000?" in isolation helps distinguish retrieval or knowledge failures from conversation-memory failures. ([Husain and Shankar 2025](#husain-shankar-2025))
35. **Tool-call success without outcome success.** A successful contact-creation tool call may create no record, the wrong record, or a duplicate. Query authoritative state and verify that exactly one matching contact exists. ([Husain and Shankar 2026b](#husain-shankar-2026b))

## Generic LLM judges and narrow evaluators


Here, "standard LLM-as-judge" is an informal term for a generic LLM judge that reads the input and final response and returns a score or a Pass or Fail under a broad rubric, such as correctness or helpfulness. Its alignment with domain experts is usually not measured.

Use one narrow evaluator for each failure mode, with the relevant evidence. A more capable model as the LLM judge may not improve evaluation by itself.

The table and the evaluator set below use a clinical AI assistant as the example. Clinicians define what counts as Pass and Fail for each failure mode, and they label the traces used to align each LLM judge.

|Generic LLM judge|Narrow evaluators|
|---|---|
|One prompt for overall quality|One evaluator per failure mode|
|Final response only|Relevant trace, tools, state, sources, and outcome|
|Generic rubric|Clinician-defined Pass and Fail definitions|
|No examples in the prompt|Clear Pass and clear Fail examples from clinician labels|
|Scalar score or overall Pass or Fail|Pass or Fail for one failure mode, with a short reasoning, reason codes, and the component at fault|
|Raw agreement or accuracy|TPR and TNR on a validation set of clinician labels|
|Prompt checked on the traces it was written from|Examples, tuning set, and validation set with no trace in common|
|One call for each trace|Three to five repeats; a verdict that changes between repeats shows an unclear criterion|
|Forced judgment|`Unknown` or abstention when evidence is insufficient|
|Independent cases|Paired counterfactual and invariance tests|
|Semantic judgment for everything|Deterministic evaluators where correctness is mechanical|
|Raw pass rate|Pass rate corrected with the evaluator's TPR and TNR, with a confidence interval|
|Measures known criteria|Error analysis of traces to find failure modes that no evaluator covers|

### Clinical evaluator set


1. Deterministic evaluators: schema, medical identifiers, negation, temporal consistency, required fields, tool outcomes, and state changes. Record for each whether it is reference-free, checking the output against the input, or reference-based, comparing the output with a clinician's reference answer.
2. One LLM judge for each failure mode that needs clinical judgment: unsupported assertions, omitted material findings, incorrect subject attribution, and inappropriate escalation. Each prompt has Pass and Fail definitions and clinician examples.
3. Evidence for each evaluator: only relevant clinical evidence, ontology relationships, and execution results.
4. Counterfactual tests: change one clinically meaningful fact and expect the decision to change. Invariance tests: change irrelevant facts and expect the decision to stay the same.
5. Alignment of each LLM judge with clinician labels: TPR and TNR on the validation set, reported separately. TNR is the share of clinician-labeled failures the judge catches. A low TPR means false Fails, which send clinicians to review correct outputs.
6. Fix specification failures in the SUT's prompt before building an evaluator for them.
7. Continue error analysis of production traces to find failure modes outside the evaluator set.

## References


- Husain, H. (2024). [Using LLM-as-a-Judge For Evaluation: A Complete Guide](https://hamel.dev/blog/posts/llm-judge/index.html). Local copy. ^husain-2024
- Husain, H. (2025a). [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/index.html). Local copy. ^husain-2025a
- Husain, H. (2025b). [Case Study: Putting Evals Into Production](https://hamel.dev/notes/llm/ai-product-engineering/evals-production.html). Local copy. ^husain-2025b
- Husain, H. and Shankar, S. (2025). [Q: How do I debug multi-turn conversation traces?](https://hamel.dev/blog/posts/evals-faq/how-do-i-debug-multi-turn-conversation-traces.html). Local copy. ^husain-shankar-2025
- Husain, H. and Shankar, S. (2026a). [Q: How much context should I give a LLM judge?](https://hamel.dev/blog/posts/evals-faq/how-much-of-a-trace-should-i-give-an-llm-judge.html). Local copy. ^husain-shankar-2026a
- Husain, H. and Shankar, S. (2026b). [Q: What model or LLM should I use to build automated evals?](https://hamel.dev/blog/posts/evals-faq/what-model-or-llm-should-i-use-to-build-automated-evals.html). Local copy. ^husain-shankar-2026b
- Husain, H. and Shankar, S. (2026c). [Q: What should I do when I can't get my LLM judge to agree with human reviewers?](https://hamel.dev/blog/posts/evals-faq/what-should-i-do-when-i-cant-get-my-llm-judge-to-agree-with-human-reviewers.html). Local copy. ^husain-shankar-2026c
- Saha, A. and Husain, H. (2025). [Do Automated Evals Work?](https://parlance-labs.com/blog/posts/auto-evals/index.html). Local copy. ^saha-2025
- Shankar, S. and Husain, H. (2026). Evals for AI Engineers, chapter 5, "Implementing Automated Evaluators". O'Reilly. ^shankar-2026
