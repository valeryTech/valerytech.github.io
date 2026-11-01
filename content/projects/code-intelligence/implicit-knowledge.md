---
draft: false
toc: true
title: "Implicit Knowledge in Software Repositories"
description: "The four kinds of context that static analysis misses, repository-mining signals, and cheap precomputed indices that bring them into retrieval."
linkTitle: "Implicit Knowledge"
---

A static analyzer sees the code as written. A complete mental model of a system also needs what is not written in it: how it runs, where it runs, how it evolved, and what the team knows. This note classifies that knowledge by the function it serves rather than by its source (chat, tickets, Git), and describes a cheap way to bring it into retrieval without building a perfect graph of everything.

## Four categories


**Operational context (runtime reality).** The gap between written code and actual execution.

- Traffic and load: which paths are hot (executed constantly) and which are cold or dead. A bug in a hot path is P0; in a cold path, P3.
- Data shapes and cardinality: is `user_list` usually five items or five million? That decides whether a linear search is a bug.
- Failure modes: which exceptions are normal noise and which are critical signals.
- State: what is actually in the database or cache, as opposed to what the code assumes.

**Environmental context (platform reality).** Constraints imposed by the infrastructure.

- Resource limits: CPU and memory quotas, timeouts (Nginx, load balancers), payload size limits.
- Network topology: firewall rules, service-mesh policies (who may call whom), latency between zones.
- Configuration and flags: environment variables, feature flags and secrets at execution time.
- Resolved dependency versions, which can differ from the manifest because of transitive resolution.

**Evolutionary context (temporal reality).** The trajectory of the codebase.

- Churn and stability: volatile files (changed weekly) versus ossified ones. Regressions hide in volatile code.
- Temporal coupling: files that change together without importing each other.
- Authorship and history: a drive-by fix or a core architectural piece; why it changed last time.
- Incident history: "this module caused the last three outages."

**Social and tribal context (human reality).** Rules and assumptions that live only in the team's memory.

- Business invariants enforced by convention, not the compiler ("we never delete users, only soft-delete").
- Design rationale and discarded alternatives ("why no queue here?").
- Real ownership and expertise: who actually answers questions about a module, not just `git blame`.
- Risk tolerance: "this batch job can fail, it retries" versus "payments must never fail".

Each category maps to an ingestion source:

| Category | Ingest |
| --- | --- |
| Operational | Observability signals (traces, metrics) |
| Environmental | IaC and configuration files (Terraform, YAML) |
| Evolutionary | Version-control metadata (history, blame) |
| Social | Communication archives (docs, tickets, PRs, chat) |

## Repository-mining signals


Mining Git history gives the model a sense of risk and importance:

- **Churn ("heat").** Changes per file over the last six months. For bug questions, boost hot files: bugs usually hide in recently touched code, not in stable libraries.
- **Logical coupling (co-change).** If file B changes in 80% of the commits that change A, retrieve B whenever A is retrieved, even without a static link.
- **Cyclomatic complexity.** For a high-complexity function, attach a summary or pseudocode, because the raw code may confuse the model or cost too many tokens.
- **Authorship.** Optionally prefer code by domain experts when looking for reference implementations.

## Lazy-greedy association indices


Building a complete real-time graph of all of this fails on latency and fragility. Instead, precompute small association indices offline and apply them greedily at run time when a signal matches. They run as an augmentation phase right after initial retrieval (see [retrieval § Context expansion]({{< ref "projects/code-intelligence/retrieval" >}}#context-expansion)).

**Temporal coupling: "if I touch A, I must check B."**

- Offline: mine `git log` into a co-change matrix of conditional probabilities \(P(\text{change}_B \mid \text{change}_A)\), stored as an adjacency list (`FileA -> [FileB 0.85, FileC 0.4]`).
- Run time: when a focus file is identified (from a stack trace or the query), fetch its top three co-change partners with a score above 0.7. Historical coupling is taken as evidence of relevance without further checks. The justification is research on logical coupling (Gall et al.; Zimmermann et al.), which found that past co-changes predict future ones. The thresholds are placeholders, and the matrix is noisy unless large commits, mass renames and formatting-only commits are filtered out first.

**Infrastructure and configuration: "resolve the variable, don't just read its name."**

- Offline: parse `.yaml`, `.tf` and `.json` files as key-value graphs and build a configuration map from keys to definitions (`MAX_RETRIES -> deploy/values.yaml (3)`, `PaymentQueue -> terraform/sqs.tf`). Attach virtual edges from code nodes that read a key to its definition.
- Run time: whenever retrieved code reads configuration (`process.env.X`, `feature_flag.is_on(...)`), inject the key's definition. The rule is deliberately greedy: a config value costs few tokens and can change what the code that reads it means. Whether it improves answers is tested by condition B5 in the [thesis and evaluation plan]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}).

**Tribal knowledge: "if the code is confusing, finding the explanation comes first."**

- Offline: ingest chat, docs and PRs; extract mentions of file names, class names and error codes; score artifacts by discussion volume ("heat"); index `Symbol -> [doc, thread, PR]` by recency.
- Run time: if retrieved code has high complexity or high heat, fetch the two most recent decision records (PR descriptions or resolved threads) linked to it. Explanations take priority over more code.

| Source | Offline preparation | Run-time heuristic |
| --- | --- | --- |
| Temporal | Co-change matrix from Git | Fetch the top three historically coupled files |
| Infrastructure | Configuration key index from IaC | Inject the value of every configuration key the code reads |
| Tribal | Discussion-to-symbol index | Fetch docs and PRs when complexity or heat exceeds a threshold |

The approach accepts that a perfect model of the world is out of reach and builds shortcuts to the information most likely to matter. The full graph version of these links is in [software knowledge graph]({{< ref "projects/code-intelligence/software-knowledge-graph" >}}).
