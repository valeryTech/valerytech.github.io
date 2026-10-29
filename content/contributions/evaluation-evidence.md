---
draft: false
toc: true
title: "Evaluation evidence and trace integrity"
description: "The evaluation model separates execution, capture, judgeability, and behavioral judgment. A corresponding runner implements attributable traces and identity checks, connecting conceptual precision to concrete evidence mechanisms."
showTitle: true
contribution_id: "evaluation-evidence"
contribution_order: "2"
linkTitle: "Evaluation evidence and trace integrity"
---
## The problem


A completed run can look like a successful result even when the evidence is incomplete or the behavior cannot be judged. A stored trace can also be misleading if its events, execution identity, or governing configuration are ambiguous.

These problems affect both interpretation and implementation. A team needs to know which claim a result supports and whether the evidence belongs to the execution being assessed.

## The contribution


The notebook's [evidence model]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}#keep-execution-capture-and-judgment-separate) distinguishes four questions:

| Question | Meaning |
| --- | --- |
| Did the execution complete? | What happened mechanically during the run. |
| Was the required evidence captured? | Whether the stated capture contract was met. |
| Can the criterion be judged from that evidence? | Whether the available record supports this particular assessment. |
| Was the behavior acceptable? | The judgment under the applicable evaluation basis, when judgeable. |

The distinction has a concrete consequence: a run can complete and satisfy its capture contract while remaining unjudgeable for a criterion the contract did not cover. Treating these conditions separately changes what the team records, what it reports, and which missing evidence it investigates.

## What changes in the engineering


The [trace]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}#trace) is captured evidence, not the entire trajectory of reality. The [capture contract]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}#capture-contract) makes recording obligations explicit. A [finding]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}#finding-and-decision) then states what the evidence supports, its scope, and its limits before informing a decision.

There is a concrete implementation connection. The public `wallet-evals` runner at revision `bf4d014baa87be6b7a35dc953e3db8985154d3b3` implements attributable case traces with ordered events, a governing execution context, and persistence identity checks:

- [CaseTrace and RunResult models](https://github.com/valery-judah/wallet-evals/blob/bf4d014baa87be6b7a35dc953e3db8985154d3b3/src/wallet_evals/runner/models.py#L202) enforce contiguous event order, run membership, a consistent execution context, and distinct case-execution identities.
- [Runner identity and persistence handling](https://github.com/valery-judah/wallet-evals/blob/bf4d014baa87be6b7a35dc953e3db8985154d3b3/src/wallet_evals/runner/service.py#L71) establishes identities before case execution and rejects a persistence result referring to a different run.
- [Runner tests](https://github.com/valery-judah/wallet-evals/blob/bf4d014baa87be6b7a35dc953e3db8985154d3b3/tests/test_runner.py#L141) specify corresponding expected behavior. The code and tests were inspected on 29 October 2026; these tests were not executed during this review.

This is a connection to trace integrity. It does not establish implementation of every conceptual distinction in the evidence model or demonstrate product-level outcomes.

## Why the distinctions matter beyond evaluation


The [failure-feedback example]({{< ref "ai-engineering/evaluation/v2/failures-putting-into-use" >}}#three-outputs-from-one-failure-finding) shows one finding changing product choices, implementation, and evaluation capability. An ambiguous account reference may require a different interaction, a stricter resolver, new contrast cases, and additional captured evidence.

That is the link to [uncertainty, usefulness, and commitments]({{< ref "contributions/uncertainty-utility-commitments" >}}): a result should change the appropriate decision, rather than being reduced to an undifferentiated success score. The same concern applies to [composable investigations]({{< ref "contributions/investigation-composition" >}}), whose combined outputs need interpretable and attributable evidence.

Return to [Contributions and connections]({{< ref "contributions" >}}).
