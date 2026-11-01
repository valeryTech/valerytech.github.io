---
draft: false
toc: true
title: "Guarantee-Driven Partitioning and Relational Pushdown"
description: "Moving deterministic sub-algorithms and relational key joins out of an LLM component into code, driven by system guarantees and justified by targeted evaluations, with the phased audit-planning join case study."
linkTitle: "Guarantee-Driven Partitioning"
---

Written 2026-11-24 from the audit-planning prototype in [Phased]({{< ref "projects/phased" >}}) ([`explanation.md`](https://github.com/valery-judah/phased/blob/main/docs/var/explanation.md); [`moving-joins.md`](https://github.com/valery-judah/phased/blob/main/docs/backlog/moving-joins.md)). Connects [the semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}), [participant profiles and work allocation]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}), and [evaluation plans and system configuration]({{< ref "ai/design-research/05-runtime-and-execution/11-evaluation-plans-and-system-configuration" >}}) to a concrete boundary-refactoring experiment.

## 1. The design pattern: moving algorithms across the LLM -- code boundary


When an LLM is one component inside a larger software system rather than the whole system ([Zaharia et al. 2024](#zaharia-2024)), the builder can prototype an end-to-end domain specification in the LLM first, discover which sub-operations require zero-variance guarantees or degrade with table size, and progressively lower those deterministic sub-operations into code while preserving the external input/output contract.

Three names capture the pattern at three scopes:

| Scope | Term | What it names |
| --- | --- | --- |
| System design method | **Guarantee-driven partitioning** (or **LLM -- code co-design**) | Allocating sub-tasks across probabilistic LLM phases and deterministic code (`derive`, templates, `evals`) from required invariants and participant failure modes rather than intuition alone ([Seshia et al. 2020](#seshia-2020); [Kambhampati et al. 2024](#kambhampati-2024)). |
| Architectural refactoring | **Deterministic lowering** (or **boundary migration**) | Keeping the system's external schema contract fixed while moving an internal sub-algorithm from prompt interpretation into deterministic code once domain semantics stabilize and an evaluation subset justifies the move ([Dong and Wang 2026](#dong-2026)). |
| Hybrid table-and-prose join optimization | **Relational pushdown** | Pushing exact foreign-key and equality joins, projections, and numeric threshold predicates below the LLM into deterministic code so the LLM executes only semantic prose-to-table and prose-to-prose joins ([Glenn et al. 2024](#glenn-2024); [Patel et al. 2024](#patel-2024)). |

In embedded hardware/software co-design, engineers run a full behavioral specification on a general-purpose processor first, measure where determinism or latency fails, and partition exact kernels onto dedicated hardware against the same testbench. Here the LLM serves as the universal approximate interpreter during domain discovery, and deterministic Python serves as the exact execution substrate into which sub-algorithms are lowered.

## 2. Concrete case study in `phased`: three kinds of joins in `je-understanding@3.3`


In [Phased]({{< ref "projects/phased" >}}), [`bundle.json`](https://github.com/valery-judah/phased/blob/main/data/cases/ap-fictitious-vendor-fy25/10/bundle.json) separates upstream testbench/extract construction (`data/`) from the audit-planning system under test ([`je-understanding/3.3.yaml`](https://github.com/valery-judah/phased/blob/main/artifacts/registry/systems/je-understanding/3.3.yaml), prompt [`understanding/3.2.md`](https://github.com/valery-judah/phased/blob/main/artifacts/registry/prompts/understanding/3.2.md), output schema [`understanding-update/4.yaml`](https://github.com/valery-judah/phased/blob/main/artifacts/registry/schemas/understanding-update/4.yaml); see [Sources of variability]({{< ref "ai/system-types/project-examples/sources-of-variability" >}})). Inside the audit procedure, reconciling an account's journal-entry summary tables (`population.views`) against prior-year workpaper narratives and client statements (`context`) requires three orthogonal kinds of joins ([`explanation.md`](https://github.com/valery-judah/phased/blob/main/docs/var/explanation.md)):

1. **Kind A -- Table-to-table key joins (`population.views` to `population.views`):** Exact key lookups with zero linguistic ambiguity:
   - *`source_patterns` to `posting_patterns` (on `posting_pattern`):* Dereferencing `SP4`'s `"P4"` to `"Dr Repairs and maintenance / Cr Accounts payable"` to obtain contra-accounts and debit/credit direction on `Accounts payable`.
   - *`source_patterns` to `source_users` (on `source`):* Joining a stream's `source` (`"ACQ-MATCH"`) to its active current-period user rows (`U1`, `U2`, `U3`) in `source_users`.
2. **Kind B -- Text-to-table joins (`context` prose to `population.views`):** Semantic entity and scope linking from natural-language workpapers to structured GL rows:
   - Linking `prior_streams` (`PS1`..`PS4`) prose narratives to expected `source` codes, contra-accounts (`SP*`), and `posting_user` IDs (`U*`).
   - Linking management's `known_events` (`K1` stating `~200,000 GBP` charged to `Repairs and maintenance`, `K2` granting `K.NOVAK` backup vendor-master rights) and `analytical_expectations` (`AE1`) to the specific `SP*` and `U*` rows they cover or affect.
3. **Kind C -- Text-to-text joins across workpaper sections (`context` to `context`):** Domain reasoning across separate prose artifacts:
   - Linking `K2` (backup vendor-master creation access for an AP clerk) to `CTL2` (segregation-of-duties control over vendor creation).
   - Linking `PS3` (expected `SYS_MATCH` posting on `ACQ-MATCH`) to `USR1` (identifying `SYS_MATCH` as an automated three-way match interface, triggering an IT change/incident inquiry to the system owner when human clerks post on `ACQ-MATCH`).

Earlier iterations in `phased` already lowered two deterministic sub-problems out of the model: pre-computing two-attribute `source_patterns` and `source_users` views instead of inferring 2D links from 1D marginals (`je-streams`), and pre-computing `amount_change` so the LLM performs no subtraction.

In the deliberate baseline `je-understanding@3.3`, [`phased.py`](https://github.com/valery-judah/phased/blob/main/execution/engine/phased.py) leaves Phase 0 (`derive`) unexecuted, so the LLM still performs **Kind A** alongside **Kinds B and C** ([`moving-joins.md`](https://github.com/valery-judah/phased/blob/main/docs/backlog/moving-joins.md)). On Case v10, `SP1..SP7` happen to align 1-to-1 with `P1..P7` (`SP4 -> P4`), masking pointer-dereferencing mistakes. The experimental loop to justify lowering Kind A into `derive` has three steps:

- **Hold Kinds B and C fixed while stressing Kind A:** Build an evaluation subset where multiple sources share `posting_patterns` so `SPk != Pk` (such as `SP14 -> P3`) and row counts grow to 30--50 `SP*` and 20--30 `U*` rows.
- **Check prose-to-row binding deterministically:** Extend [`understanding.py`](https://github.com/valery-judah/phased/blob/main/evaluation/evals/understanding.py) so cell numbers and contra-account names cited on a `changes[]` entry or single-row question must belong to *that* `SP*` row rather than merely existing somewhere in `population.views`.
- **Compare versioned systems under the same output contract:** Run `je-understanding@3.3` (LLM executes Kind A + B + C) against a `derive`-enabled system version (Python pre-joins Kind A; LLM executes Kind B + C) on identical cases and models, measuring check pass rate, row-binding errors, tokens, and latency.

## 3. Related research lineages (2020--2026)


Existing work covers adjacent parts of this space, usually optimizing bulk query cost rather than audit-grade structural guarantees:

- **Hybrid relational -- semantic query optimization:** LOTUS formalizes natural-language semantic joins and filters alongside relational operators and optimizes physical plans against a reference algorithm with accuracy bounds ([Patel et al. 2024](#patel-2024)). Palimpzest compiles declarative queries mixing relational operators, synthesized code, and foundation-model calls across quality -- cost -- latency trade-offs ([Liu et al. 2024](#liu-2024)). BlendSQL unifies SQLite relational algebra with LLM functions and pushes exact relational joins and filters ahead of model calls ([Glenn et al. 2024](#glenn-2024)). DocETL rewrites document pipelines and synthesizes validation checks driven by evaluation ([Shankar et al. 2024](#shankar-2024)). SemBaker frames row-wise LLM execution as interpretation and lowers selected operators into deterministic Python functions via compilation ([Dong and Wang 2026](#dong-2026)).
- **Neurosymbolic verification and selective code execution:** Verified AI treats learned models as untrusted components wrapped in formal specifications and runtime monitors so system-level invariants hold ([Seshia et al. 2020](#seshia-2020)). LLM-Modulo frameworks reject LLM self-verification and pair LLMs (handling informal-to-formal translation and candidate generation) with sound external verifiers ([Kambhampati et al. 2024](#kambhampati-2024)). Chain of Code splits mixed reasoning algorithms at the statement level between a deterministic Python interpreter and an "LMulator" for semantic steps that resist hand-coded rules ([Li et al. 2024](#li-2024)).
- **What `phased` adds in practice:** Instead of optimizing throughput on approximate bulk analytics, `phased` uses explicit epistemic and numerical invariants (`evals/understanding.py`) plus controlled, immutable system versions (`je-understanding@3.3` vs. `derive`) to make every boundary migration between prompt and Python empirically falsifiable.

## Related notes


- Assurance automation terminology defines audit domain terms for a system of this kind, including population, supporting document, audit evidence and verification check.

## References


- Dong, W. and Wang, Y. (2026). [From Interpretation to Compilation: A Compilation-Based Execution Engine for Semantic Operator Systems](https://arxiv.org/abs/2608.06677). arXiv:2608.06677. ^dong-2026
- Glenn, P., Dakle, P. P., Wang, L. and Raghavan, P. (2024). [BlendSQL: A Scalable Dialect for Unifying Hybrid Question Answering in Relational Algebra](https://arxiv.org/abs/2402.17882). arXiv:2402.17882. ^glenn-2024
- Kambhampati, S., Valmeekam, K., Guan, L., Verma, M., Stechly, K., Bhambri, S., Saldyt, L. and Murthy, A. (2024). [LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks](https://arxiv.org/abs/2402.01817). arXiv:2402.01817. ^kambhampati-2024
- Li, C., Liang, J., Zeng, A., Chen, X., Hausman, K., Sadigh, D., Levine, S., Fei-Fei, L., Xia, F. and Ichter, B. (2024). [Chain of Code: Reasoning with a Language Model-Augmented Code Emulator](https://arxiv.org/abs/2312.04474). arXiv:2312.04474. ^li-2024
- Liu, C., Russo, M., Cafarella, M., Cao, L., Chen, P. B., Chen, Z., Franklin, M., Kraska, T., Madden, S. and Vitagliano, G. (2024). [A Declarative System for Optimizing AI Workloads](https://arxiv.org/abs/2405.14696). arXiv:2405.14696. ^liu-2024
- Patel, L., Jha, S., Pan, M., Gupta, H., Asawa, P., Guestrin, C. and Zaharia, M. (2024). [Semantic Operators: A Declarative Model for Rich, AI-based Data Processing](https://arxiv.org/abs/2407.11418). arXiv:2407.11418. ^patel-2024
- Seshia, S. A., Sadigh, D. and Sastry, S. S. (2020). [Towards Verified Artificial Intelligence](https://arxiv.org/abs/1606.08514). arXiv:1606.08514. ^seshia-2020
- Shankar, S., Chambers, T., Shah, T., Parameswaran, A. G. and Wu, E. (2024). [DocETL: Agentic Query Rewriting and Evaluation for Complex Document Processing](https://arxiv.org/abs/2410.12189). arXiv:2410.12189. ^shankar-2024
- Zaharia, M., Khattab, O., Chen, L., Davis, J. Q., Miller, H., Potts, C., Zou, J., Carbin, M., Frankle, J., Rao, N. and Ghodsi, A. (2024). [The Shift from Models to Compound AI Systems](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/). BAIR Blog, 18 February 2024. ^zaharia-2024
