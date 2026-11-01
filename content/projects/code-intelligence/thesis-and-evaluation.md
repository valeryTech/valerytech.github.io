---
draft: false
toc: true
title: "Code Intelligence Thesis and Evaluation Plan"
description: "The claim this project has to prove, the hypotheses that would confirm or refute it, and an experiment plan with baselines, ground truth, metrics and decision rules."
linkTitle: "Thesis and Evaluation"
---

The other notes describe an architecture. This note states what that architecture is supposed to prove, and how to find out whether it does. It is a research plan, not product acceptance: shipping gates for the read-only product are in [repository expert evaluation]({{< ref "projects/code-intelligence/repository-expert/evaluation" >}}).

## Thesis


> For engineering questions whose evidence is spread across files, modules or services, adding structural signals (symbols and references, call and data flow, co-change and configuration links) to text search finds the needed evidence more completely and with less context than text search alone, and that better evidence produces more correct, better-grounded answers.

The claim is a chain with two links, and each link is tested separately:

1. **Structure -> better evidence.** A retrieval claim, measured against gold evidence.
2. **Better evidence -> better answers.** A generation claim. It can fail even when the first link holds: the model may ignore extra evidence, or the added context may act as noise.

### What the thesis does not claim


- **Local code completion.** Evidence is mostly local there, and the measured results already point the other way: BM25 with line chunks matches syntax-aware chunking and dense retrieval for completion ([retrieval § Task-aware retrieval]({{< ref "projects/code-intelligence/retrieval" >}}#task-aware-retrieval)). Completion is a control condition, not a target.
- **Single-file questions.** If the answer is in one file that text search finds, structure has little to add.
- **Behavior that only shows at run time.** Static structure cannot show configuration values in production, load or reflection-driven calls. Those belong to the runtime and history levels, tested separately.

### The baseline has moved


The realistic competitor is not a naive vector search but an **agent with grep, find and file reads** that keeps searching until it finds what it needs. A builder of a coding agent that reached the top of SWE-bench Verified reported that embedding-based retrieval tools were not the bottleneck there: grep and find were enough, because the agent's persistence made up for weaker tools. Better retrieval components also did not necessarily improve end-to-end results, for the same reason.

That changes what "structure helps" has to mean. Against a persistent agent, structure may not raise the success rate but may still reduce the cost of getting there: fewer steps, fewer tokens, less wall-clock time. It may also help where grep is weak: very large repositories, low lexical overlap between the question and the code, and links that no string search can follow (dynamic dispatch, configuration, co-change). The plan measures both success and cost.

Published evidence points the same way. *Code Isn't Memory* (2026) compared an agent with a structural index (embeddings, definition and call graph, BM25), the same agent without it, and an agentic-grep tool on 91 tasks. The index raised Acc@5 from 75.3 (grep) to 84.5 and lowered the cost per solved task, but the resolve-rate difference against grep (50.4 against 45.3) was not significant, and the largest localization gap was on tasks with three or more gold files. A small study of language-server tools found that agents rarely call them when they are optional and gain mainly where grep returns many false positives. Details are in [related work § Comparisons of structure, text and grep]({{< ref "projects/code-intelligence/related-work" >}}#comparisons-of-structure-text-and-grep).

## Hypotheses


Each hypothesis has a prediction and a result that would refute it.

| ID | Hypothesis | Prediction | Refuted if |
| --- | --- | --- | --- |
| H1 | Cross-file evidence | At a fixed token budget, structure-augmented retrieval has higher recall of gold files and functions on items whose gold evidence spans two or more files | No significant gain on the cross-file strata against a tuned text baseline |
| H2 | Locality boundary | On single-file and completion items the gain is close to zero | Structure helps there too (the thesis is broader than stated) or hurts (noise cost) |
| H3 | Spread and overlap | The gain grows with evidence spread (files, modules, call hops) and with falling lexical overlap between query and gold | The gain is flat across strata |
| H4 | Context efficiency | At equal recall, structural context uses fewer tokens (slices and signatures instead of whole files) | Token use is equal or higher at equal recall |
| H5 | Evidence to answers | With the model held fixed, better evidence raises answer correctness and lowers the unsupported-claim rate | Retrieval gains do not carry over to answers |
| H6 | Agent tools | An agent given structural tools (definition, references, call hierarchy, co-change) localizes with fewer steps and tokens than one with grep and reads only, at equal or better success | No reduction in cost and no gain in success |
| H7 | Fidelity ladder | Each structural level adds a measurable gain on some task type; most of the gain is reached before the most expensive level | Gains are concentrated in one level, or the expensive levels add nothing |
| H8 | Name indirection | Configuration links help most when a key's name changes between layers (environment variable, YAML path, template, code accessor) | The gain is the same across indirection strata, or zero |

H7 decides how much to build. If language-server references give most of the gain, a code property graph is not worth its cost for the first product.

### What is already known


The search of 2026-11-05 ([related work § Comparisons of structure, text and grep]({{< ref "projects/code-intelligence/related-work" >}}#comparisons-of-structure-text-and-grep)) found evidence bearing on most hypotheses:

| Hypothesis | Existing evidence | Reading |
| --- | --- | --- |
| H1, H3 | LocAgent: every method degrades with hop distance from the functions named in the issue. SWE-PolyBench: pass rates fall with the number of modified files. *Code Isn't Memory*: the largest localization gap is at three or more gold files | Supports the direction, but not level by level |
| H2 | *Practical Code RAG at Scale*: line chunks about as good as AST chunks for completion. cAST: +4.3 Recall@5 on RepoEval from AST chunking | Mixed |
| H4 | CodexGraph matched AutoCodeRover on SWE-bench Lite with more tokens; Codebase-Memory used about a tenth of the tokens at lower answer quality | Efficiency depends on the interface, not only on structure |
| H5 | Haque et al.: naive execution traces helped in two of six configurations. HAFixAgent: history gains shrink with stronger models | Evidence gains may not carry to answers |
| H6 | *Code Isn't Memory* (above); SWE-Master: an LSP tool adds 1.4 to 2.0 points on SWE-bench Verified with fewer turns; the LSP token study (above) | Small gains, mostly in cost and on multi-file tasks |
| H7 | SpIDER: containment, then call edges, add recall over dense retrieval. LocAgent ablation: text search matters more than graph traversal. Repository Memory: commit history +2.7 Acc@5, worse on repositories with little history | Single levels studied; no data-flow ablation found |
| H8 | Simon et al. (ASE 2025): extra context does not reliably help validate configuration dependencies. No study found that gives an LLM configuration values linked to code | Open; the [configuration-links study]({{< ref "projects/code-intelligence/backlog" >}}#configuration-links-study) in the backlog |

So the plan's value lies less in testing whether structure helps at all and more in the cumulative ladder, the data-flow and configuration levels, the lexical-overlap split, and sample sizes large enough per stratum.

## Conditions to compare


An ablation ladder, one level of structure at a time, with everything else fixed:

| Condition | What retrieval can use |
| --- | --- |
| B0 Text | Tuned hybrid BM25 and dense retrieval over line chunks; the strongest text baseline, not a strawman |
| B1 + Syntax | AST chunks with envelopes, repository map, signatures (tree-sitter) |
| B2 + Symbols | Definition and reference expansion from a language server or a precomputed index (SCIP-style) |
| B3 + Flow | Call graph and data-flow slices, where the language supports it |
| B4 + History | Co-change partners ([implicit knowledge]({{< ref "projects/code-intelligence/implicit-knowledge" >}})) |
| B5 + Config | Code read sites linked to configuration keys and their definitions per environment ([implicit knowledge]({{< ref "projects/code-intelligence/implicit-knowledge" >}})) |
| A0 Agent, plain tools | Agent loop with grep, find, list and read |
| A1 Agent, structural tools | A0 plus definition, references, call hierarchy, co-change and config lookup as tools |

Where each level's data comes from, and what it costs to set up at a pinned commit, is in [language servers and code indexes]({{< ref "projects/code-intelligence/language-servers-and-code-indexes" >}}).

Bounds: **no retrieval** (the model alone) as the lower bound, **oracle context** (the gold files) as the upper bound. The gap between B0 and the oracle is the room structure can win.

Held fixed across conditions: the model, the prompt and context format, temperature 0, and the token budget. Run each comparison at several budgets (for example 4k, 16k and 64k tokens), because structural gains may shrink as windows grow and long-context models can simply read whole files. A result that holds only at small budgets is still useful, but it is a cost result, not a capability result.

## Tasks


| Task | Input | Gold evidence | Main hypotheses |
| --- | --- | --- | --- |
| T1 Localization | Issue text | Files and functions changed by the fix commit | H1, H3, H6 |
| T2 Change impact | A diff or a changed symbol | Other files changed in the same commit or PR; tests touched | H1, H7 (co-change, references) |
| T3 Flow explanation | "How does X reach Y?" | Call chain recorded from test execution, or written by hand | H1, H5, H7 (flow) |
| T4 Configuration | "Where is the value of X set, and what is it?" | Hand-labeled per environment, checked against rendered configuration | H7, H8 |
| T7 Config impact | A config key change, or a code change | Code that reads the key; configuration changed in the same commit | H8 |
| T5 Lookup (sanity) | "Where is X defined?" | Definition location | None; checks the harness |
| T6 Completion (control) | Code prefix | Next lines | H2 |

### Ground truth must be independent of the system


If the gold evidence comes from the same static analysis the system uses, the system passes by construction. Sources, in order of preference:

1. **Real history.** Fix commits linked to issues, PRs touching several modules. The developers' own changes are the gold.
2. **Runtime traces.** Call chains recorded while running the test suite are independent of the static call graph, and they include dynamic dispatch the static graph misses.
3. **Human annotation.** Needed for flow and configuration questions; budget for it.
4. **Static analysis.** Only for the sanity stratum (T5), and labeled as such.

### Strata


Every item is tagged so results can be reported per stratum instead of as one average:

- number of gold files and of distinct directories or modules;
- whether the gold evidence crosses a service boundary;
- call-graph hops from the first symbol named in the query to the gold;
- lexical overlap between the query and the gold code: the share of gold identifiers that appear in the query, whether the query names a gold file, and the rank of the gold under text search;
- for configuration items, name indirection between code and configuration: the same literal, a transformed name, or a templated chain.

H3 predicts that gains concentrate in the high-spread, low-overlap strata. CodeRAG-Bench found that current retrievers fail most often when lexical overlap is low, which is where structure should matter most. Observational strata mix overlap with difficulty, so the pilot also changes overlap directly by rewriting the same issue without identifiers ([Pilot](#pilot)).

### Data sources


- **SWE-bench Verified** for T1: human-validated issues with gold patches, Python only. The gold patch gives files and functions changed.
- **Long Code Arena** bug localization for T1, as a second source with its own setup.
- **CrossCodeEval** and **RepoBench** for T6, the completion control. Both are built so that completion needs cross-file context, which also makes them a fair test of whether structure helps completion at all.
- **CodeRAG-Bench** for retrieval-for-generation comparisons.
- **Loc-Bench** (from LocAgent; 560 issues across bugs, features, security and performance) and **SWE-PolyBench** (several languages, results by number of modified files) as further T1 sources.
- **ContextBench** (1,136 tasks in eight languages with gold contexts) for measuring retrieval recall directly.
- **SWE-bench Pro** for multi-file items (reference patches average 4.1 files).
- **Own repositories** (one to three that you know well enough to judge answers): issue-to-fix pairs, multi-module PRs and test traces mined from history. This is the only source for T2 to T4 in the needed form, and the least likely to be memorized by the model.

**Contamination.** Popular public repositories may be in the model's training data, so a model can "localize" from memory. Prefer commits after the model's training cutoff, or own repositories, and report public and private results separately.

## Metrics


**Retrieval**

- Recall of gold files and functions at a fixed token budget, and recall@k.
- Chain completeness: all gold files present, not just one.
- Tokens needed to reach a given recall (H4).
- MRR, and the share of retrieved tokens that are not gold (noise).

**Answers**

- Localization: top-1 and top-5 file and function accuracy.
- Correctness against gold answer points, for explanation tasks.
- Citation validity and the unsupported-claim rate.

**Agent runs**

- Success rate, number of tool calls, tokens, wall-clock time and cost per item.
- Several runs per item, because agent runs vary.

**Cost of structure**

- Index build time and incremental update time.
- Coverage: the share of files where the language server or indexer resolved symbols. Structure that only works on half the repository has to be reported that way.

## Protocol


- **Pin the repository at the parent of the fix commit**, so the answer is not in the code being searched.
- **Cut history at the task's commit.** Condition B4, and any agent with shell access, can read later commits; benchmark write-ups have caught agents reading the future fix from Git history. Give the system a clone truncated at the parent commit, or block access to later refs.
- **Use the issue text as written**, and measure how often it names files or symbols; those items are easy for text search and belong to the high-overlap stratum.
- **Pair everything.** Each condition runs on the same items, compared item by item. Report bootstrap confidence intervals, not single numbers.
- **Sample size.** For a paired comparison of a yes/no outcome, detecting a 10-point difference with conventional power needs on the order of 200 to 250 items when about a third of items disagree between conditions; larger effects need fewer. This applies per stratum that you want to conclude about, so decide in advance which strata matter.
- **Tune the baseline as carefully as the system.** Most "structure wins" results against an untuned baseline do not survive a tuned one.
- **Look before counting.** Start with five to ten items run end to end and read the outputs; quantitative runs come after the obvious failures are fixed.

### Error analysis


Label every failure with the stage that caused it:

| Failure | Meaning |
| --- | --- |
| Seed miss | The question was never linked to the right symbol or file (entity linking) |
| Expansion miss | The seed was right, but traversal did not reach the gold |
| Budget cut | The gold was found but dropped when packing the context |
| Ignored evidence | The gold was in context, but the answer did not use it |
| Gold problem | The gold is incomplete, or another answer is also correct |

The first two point at retrieval, the third at packing and serialization, the fourth at prompting and the model. Seed misses are expected to dominate: linking a natural-language question to graph nodes is the least developed step in the design.

## Threats to validity


- **Memorization** of public repositories (see contamination above).
- **Leakage through the issue text.** Issues that name the file make text search look strong. Stratify by overlap. On SWE-bench, SWE-Bench+ found the solution leaked in the issue for about a third of successful patches, and *SWE-Bench Illusion* found that models name the right file from the issue text alone up to 76% of the time.
- **Noisy gold.** Fix commits include unrelated edits (formatting, tests, docs). Score functions as well as files, and score tests and docs separately.
- **Incomplete gold.** Another correct location may not be in the commit. Sample failures and check them by hand.
- **Benchmark flaws.** Agentic benchmarks can have weak test cases or reward rules; SWE-bench Verified has been criticized for insufficient tests. Check the benchmark against a checklist before relying on it.
- **One language.** Python is a weak case for static resolution and a strong case for dynamic gaps; Java or TypeScript is the opposite. Results from one do not transfer to the other automatically.
- **Moving models.** Larger windows and better agents shift the baseline. Re-run the core comparison for each new model generation.

## Decision rules


Decide in advance what each outcome means:

| Outcome | Decision |
| --- | --- |
| H1 and H6 hold | Build structural queries as tools for agents; this becomes the product core |
| H1 holds, H5 fails | Retrieval wins do not reach answers; work on context serialization and prompting before more structure |
| Gains only at small budgets | Position the value as cost and latency, not capability |
| H7: most gain from symbols and references | Stop before the code property graph for the first product |
| Gains only from history and config (B4, B5) | The value is in implicit knowledge, not code structure; shift the focus there |
| De-identified issues hurt all conditions equally | Structure does not rescue low-overlap questions; invest in linking questions to symbols rather than in more structure |
| Config links help only on transformed or templated names | The value of a config index lies in modeling name transformations; build that, not a generic key index |
| A grep agent matches config links | Configuration helps as part of the answer (values per environment), not as retrieval |
| Nothing holds against tuned text and agent baselines | The thesis is wrong for current models; record it and stop or pivot |

## Pilot


The search recorded in [related work]({{< ref "projects/code-intelligence/related-work" >}}) showed that the obvious first comparison, symbols against text on SWE-bench localization, is largely done (LocAgent, *Code Isn't Memory*). The pilot therefore targets one of the parts that still look open: how much each condition loses when the question shares no words with the code. A small B2 arm stays in as an anchor, so that results can be compared with published numbers.

The other open part, whether linking code to configuration values helps (H8), is planned as a separate study in the [backlog]({{< ref "projects/code-intelligence/backlog" >}}#configuration-links-study). It was the pilot's Part B; it needs its own repositories and its own condition, B5.

### Lexical overlap by controlled rewriting


Existing work only has proxies for overlap: location hints in the issue, leakage, grep precision. Observational strata also mix overlap with difficulty, because issues that name the file may be simpler bugs. The pilot therefore changes overlap directly:

1. Take about 60 localization items from SWE-bench Verified and Loc-Bench, after the model's training cutoff where possible.
2. Write a **de-identified** version of each issue: file paths, function, class and variable names, and quoted error strings are replaced by descriptions of what they do ("the function that validates session tokens"). An LLM drafts the rewrite; a person checks that the meaning is kept and that no name leaks through.
3. Run each condition on both versions. Each item is its own control, so the difference between versions measures, per condition, the cost of losing overlap.

Overlap is also measured on the original issues, for the observational strata:

- **identifier overlap**: the share of identifiers at the gold locations (file basename, class, function, key names, split on camelCase and snake_case) that appear in the issue;
- **path mention**: whether the issue names a gold file;
- **text findability**: the rank of the first gold file under B0.

Conditions: B0, B2, A0 and A1, at one budget (16k tokens) to keep the pilot small.

Prediction (H3): every condition loses accuracy on de-identified issues, but B0 and A0 lose more than B2 and A1. If all lose about the same, structure does not rescue low-overlap questions, and the bottleneck is linking the question to seed symbols, which structure alone does not solve.

### Outputs and go/no-go


The pilot estimates effects and tests the harness; it is too small for conclusions. It should produce:

- a working harness, with history cut at the task commit and coverage recorded;
- results per condition with confidence intervals, for each stratum;
- the disagreement rate between conditions, to size the full study;
- a checked set of de-identified issues, reusable for the repository expert's golden dataset.

Continue to the full study if, on the de-identified issues, a structural condition beats its text or grep counterpart by roughly ten points or more, in the same direction across repositories. Otherwise record the result: a clear null on overlap is itself evidence against the remaining claims.

## Phases


1. **Pilot.** About 60 items on lexical overlap by controlled rewriting ([Pilot](#pilot)). This replaces the earlier pilot of B0 against B2 on SWE-bench, which published work largely covers. It also serves as the first evaluation of the prototype in the [project index]({{< ref "projects/code-intelligence" >}}).
2. **Ablation.** The full ladder B0 to B5 on T1, T2 and T7, including the data-flow level B3, which no study found in the search has ablated, stratified by spread, overlap and indirection, on public and own repositories, with sample sizes taken from the pilot. B5 and the T7 items come from the [configuration-links study]({{< ref "projects/code-intelligence/backlog" >}}#configuration-links-study), which can run before or alongside this phase.
3. **Agents.** A0 against A1 on T1, with several runs per item, measuring cost as well as success.
4. **Answers.** H5 on a human-checked subset of T1 and T3. The items and labels then feed the repository expert's golden dataset.

## References


- SWE-bench: [arXiv:2310.06770](https://arxiv.org/abs/2310.06770); SWE-bench Verified is the human-validated subset.
- Agentless, hierarchical localization for SWE-bench: [arXiv:2407.01489](https://arxiv.org/abs/2407.01489)
- CrossCodeEval: [arXiv:2310.11248](https://arxiv.org/abs/2310.11248)
- RepoBench: [arXiv:2306.03091](https://arxiv.org/abs/2306.03091)
- CodeRAG-Bench: [arXiv:2406.14497](https://arxiv.org/abs/2406.14497)
- Long Code Arena: <https://openreview.net/forum?id=twV78Ytnve>
- Colin Flaherty, *RAG in the age of agents: SWE-Bench as a case study*, a course talk on agentic retrieval and SWE-bench.

## Library sources


- [Anonymous 2025](/sources/retrieval-and-knowledge/rag/anonymous-2025-practical-code-rag-at-scale.pdf.enc), *Practical Code RAG at Scale* -- on *What the thesis does not claim*
- [Zhu et al. 2025](/sources/ai-engineering/evaluation/zhu-2025-best-practices-for-rigorous-agentic-benchmarks.pdf.enc), *Establishing Best Practices for Building Rigorous Agentic Benchmarks* ([arXiv:2507.02825](https://arxiv.org/abs/2507.02825)) -- on *Threats to validity*

Further reading:

- [Wu et al. 2026](/sources/ai-engineering/evaluation/wu-2026-swe-together-coding-agents-interactive-sessions.pdf.enc), *SWE-Together: Evaluating Coding Agents in Interactive User Sessions*
