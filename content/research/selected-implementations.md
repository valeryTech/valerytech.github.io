---
draft: false
toc: true
title: "Selected implementations"
description: "Code examples from Wallet, Wallet Evals, and sem-rag: transaction checks, evaluation traces, and retrieval. Links point to the revisions inspected."
showTitle: true
linkTitle: "Selected implementations"
---

Three public repositories, with links to specific source files and tests.

## Wallet: transaction checks


In [Wallet](https://github.com/valery-judah/wallet), a model proposes updates to a transaction candidate. The system keeps that candidate separate from the recorded transaction.

The contribution processor checks references against the available catalog and clears ambiguous, unavailable, or currency-conflicting fields while retaining diagnostic evidence. A complete candidate moves to a confirmation state. The confirmation handler assesses it again before executing the transaction. The control layer also rejects requests whose target task or conversation version no longer matches.

Inspect the mechanisms:

- [Contribution processing](https://github.com/valery-judah/wallet/blob/22400e0338bafec5241d489a47d1f08c33b6f305/backend/src/wallet/ai/transaction_capture/processing.py): model interpretation, deterministic reference checks, and the resulting candidate and trace.
- [Confirmation handling](https://github.com/valery-judah/wallet/blob/22400e0338bafec5241d489a47d1f08c33b6f305/backend/src/wallet/ai/transaction_capture/capability.py) and [conversation guards](https://github.com/valery-judah/wallet/blob/22400e0338bafec5241d489a47d1f08c33b6f305/backend/src/wallet/ai/control/engine.py): the conditions for performing the action.
- [Processing tests](https://github.com/valery-judah/wallet/blob/22400e0338bafec5241d489a47d1f08c33b6f305/backend/tests/ai/transaction_capture/test_processing.py) and [guard tests](https://github.com/valery-judah/wallet/blob/22400e0338bafec5241d489a47d1f08c33b6f305/backend/tests/ai/control/test_engine.py): ambiguity, conflicting currency, unavailable references, and stale requests.

## Wallet Evals: execution traces


[Wallet Evals](https://github.com/valery-judah/wallet-evals) runs evaluation cases and records their results.

The runner establishes run and case-execution identities before capture. Its models require contiguous event order, matching run membership, a consistent execution context, and distinct case-execution identities. Persistence must return the identity of the run that was saved.

Adaptive cases add another boundary. The selector receives declared role context, action bounds, action history, and explicitly participant-visible response facts. Each subsequent action names the visible facts it used. The runner rejects an action outside the declared action set or a declared evidence basis containing unavailable facts, and records the accepted basis in the trace.

Inspect the mechanisms:

- [Runner models](https://github.com/valery-judah/wallet-evals/blob/bf4d014baa87be6b7a35dc953e3db8985154d3b3/src/wallet_evals/runner/models.py): execution, observation, participant-visible fact, and trace identities.
- [Runner coordination](https://github.com/valery-judah/wallet-evals/blob/bf4d014baa87be6b7a35dc953e3db8985154d3b3/src/wallet_evals/runner/service.py): identity establishment, adaptive-choice checks, capture, and persistence.
- [Runner tests](https://github.com/valery-judah/wallet-evals/blob/bf4d014baa87be6b7a35dc953e3db8985154d3b3/tests/test_runner.py): attributable results, adaptive evidence bounds, failure handling, and private role context omitted from the serialized trace.

Related note: [Evidence model]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}).

## sem-rag: answers and citations


[sem-rag](https://github.com/valery-judah/sem-rag), whose internal package is named `doc_forge`, separates support assessment, answer policy, and citation rendering.

Support assessment records supported claims, gaps, conflicts, and provenance limitations. An answer-mode policy uses that assessment to choose among answering, narrowing, qualifying, or abstaining. Citation rendering then uses stored source references from selected evidence, with checks for usable locations and the documents contributing to a synthesis.

Inspect the mechanisms:

- [Support assessment](https://github.com/valery-judah/sem-rag/blob/faa5cd06ef30e4f6ef156092153a94743faf5681/src/doc_forge/query/support_assessment.py) and [answer-mode policy](https://github.com/valery-judah/sem-rag/blob/faa5cd06ef30e4f6ef156092153a94743faf5681/src/doc_forge/query/answer_mode_policy.py): the distinct assessment and policy decisions.
- [Citation rendering](https://github.com/valery-judah/sem-rag/blob/faa5cd06ef30e4f6ef156092153a94743faf5681/src/doc_forge/query/citation_rendering.py): provenance-derived references and checks on contributing documents.
- [Support-policy tests](https://github.com/valery-judah/sem-rag/blob/faa5cd06ef30e4f6ef156092153a94743faf5681/tests/query/test_query_stage6.py) and [generation/citation tests](https://github.com/valery-judah/sem-rag/blob/faa5cd06ef30e4f6ef156092153a94743faf5681/tests/query/test_query_stage7.py): partial coverage, conflict, abstention, and citation contracts.

The default support judge uses structural heuristics; it does not establish that a passage supports a claim. Related notes: [Context-to-task alignment]({{< ref "ai-engineering/retrieval/reframing" >}}) and [Evidence model]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}).

*Source review: 29 October 2026. Links pin the inspected revisions. Code and test sources were read; the test suites were not run. No product outcomes were measured in this review.*
