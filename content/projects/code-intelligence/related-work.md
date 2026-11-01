---
draft: false
toc: true
title: "Related Work on Code Graphs and Coding Agents"
description: "Research and systems close to the code intelligence design, from code property graphs and graph-guided coding agents to studies of history, runtime evidence and structural tools as LLM context, and the narrower claims that remain after them."
linkTitle: "Related Work"
---

Most parts of this design already exist, and several systems already combine two or three of them. This note maps the closest work to the parts of the design it covers, so that whatever this project still claims can be stated narrowly and checked. An earlier version of this note, drafted with an AI research assistant, called the combination new; the positioning section below replaces that claim.

The systems and studies below were checked against their abstracts, papers or official documentation on 2026-04-05. Numbers are as the sources report them; items that could not be confirmed are marked.

## Code as graphs


- **Code property graphs** (Joern and the CPG literature) combine AST, control-flow and program-dependence graphs into one graph used for security analysis and code queries. This is the substrate described in [code representation § The code property graph]({{< ref "projects/code-intelligence/code-representation" >}}#the-code-property-graph).
- **Code graph RAG prototypes.** Open-source projects parse multi-language code with tree-sitter, build a code graph (dependencies, calls) and use traversal for LLM retrieval. CodeGraphContext, for example, is an MCP server with tree-sitter parsing for about two dozen languages, optional SCIP indexers and a choice of graph databases, answering caller, callee, call-chain and class-hierarchy queries.

## Program slicing and LLM-assisted static analysis


- **NS-Slicer** (OOPSLA 2024) learns static slices for variables in complete and incomplete code with a pre-trained code model, for debugging.
- **SliceMate** (2025) uses LLM agents to orchestrate static slicing for accuracy and scale.
- **EM-Assist**, an IntelliJ plugin, combines LLM suggestions with live-variable analysis, def-use chains and slicing-style expansion to produce valid extract-method refactorings.
- **LLMxCPG** (USENIX Security 2025) fine-tunes one model to write Joern CPG queries, expands their results with backward slicing, and has a second model classify the slice for vulnerabilities. The slices are 68-91% smaller than the original code, and F1 improves by 15-40%. The slicing is LLM-driven: the model chooses the queries.
- **GitHub Copilot Autofix** builds its prompt from a CodeQL alert (the source, sink and flow-path locations, surrounding snippets and the query's help text) and asks an LLM for a fix. A newer agentic mode re-runs CodeQL to validate its draft pull requests.

These validate slicing as a way to shrink context, data flow as a structure LLM tooling should expose, and analysis-plus-LLM hybrids as a practical pattern ([hybrid architecture]({{< ref "projects/code-intelligence/hybrid-architecture" >}})).

## Graph RAG and property-graph RAG


- Frameworks such as LangChain and LlamaIndex ship Graph RAG and property-graph modules that extract triplets from documents, store them in a labeled property graph and retrieve subgraphs as context; LLMs often generate the Cypher queries.
- Industry material combines knowledge graphs with RAG for multi-hop questions: retrieve the relevant subgraph first, then run dense retrieval within it.

The pattern (property graph plus vector search plus graph-guided retrieval) is shared. The edges differ in degree rather than kind: calls and references here come from analysis tools, not from an LLM reading text, but commit-to-ticket links, stack-trace mappings and chat mentions are parsed or inferred and can be wrong ([software knowledge graph § Edge provenance]({{< ref "projects/code-intelligence/software-knowledge-graph" >}}#edge-provenance)).

## Systems that combine code structure with LLMs


| System | Structure used | Task and result |
| --- | --- | --- |
| Aider repository map | Tree-sitter definitions and references; a file graph weighted by reference counts; PageRank biased towards files and identifiers in the chat; rank spread onto individual definitions, fitted into a token budget | Context selection in a working assistant |
| AutoCodeRover (ISSTA 2024) | Search APIs over the AST (classes, methods in a class or file, code in a file); spectrum-based fault localization from tests when a test suite exists | Issue resolution; 19% of SWE-bench Lite |
| Agentless (FSE 2025) | Hierarchical localization: files from a tree of the repository (combined with embedding retrieval in v2), then classes and functions from skeletons of the top files, then edit locations; no agent loop | 32.0% of SWE-bench Lite; classifies issues by the location hints they contain |
| RepoGraph (ICLR 2025) | Line-level nodes tagged as definition or reference, `contain` and `invoke` edges, library calls filtered; one- and two-hop ego-graphs around a search term | Plugged into RAG, Agentless, SWE-agent and AutoCodeRover: +2.0 to +2.7 points on SWE-bench Lite (Agentless 27.3 -> 29.7) |
| CodexGraph (NAACL 2025) | Neo4j graph of modules, classes, methods, functions, fields and globals with CONTAINS, INHERITS, HAS_METHOD, HAS_FIELD and USES edges; one agent asks in natural language, a second translates to Cypher | SWE-bench Lite 22.96, the same as AutoCodeRover, using about 102k tokens against 76k |
| LocAgent (ACL 2025) | Directory, file, class and function nodes with contain, import, invoke and inherit edges; tools to search entities, traverse the graph by edge type and retrieve entities | 92.7% file-level localization; introduced Loc-Bench (560 issues: bugs, features, security, performance) |
| OrcaLoca (ICML 2025) | Code graph with containment and reference edges; context pruned by shortest-path distance; actions scheduled by priority | 65.3% function match on SWE-bench Lite |
| Code Graph Model (2025) | An adapter feeds the code graph into the LLM's attention, with a graph-RAG pipeline without an agent | 43.0% on SWE-bench Lite with Qwen2.5-72B (venue unconfirmed) |
| CodeRAG / GraphCodeAgent | A requirement graph mapped onto a code graph. Version 1 (April 2025) was titled *CodeRAG: Supportive Code Retrieval on Bigraph*; version 2 (November 2025) is *GraphCodeAgent: Dual Graph-Guided LLM Agent* | Repository-level generation on DevEval (and CoderEval in v2) |
| Code Researcher (2025) | Definition search with ctags, code search with `git grep`, commit search with `git log` over diffs and messages | Linux kernel crash repair: 48% against 31.5% for SWE-agent (GPT-4o). The closest match to "structure plus history" |

**Language-server tools for agents.**

- **Serena** is an MCP server whose default back end is language servers (with an optional JetBrains back end). Besides symbol search, references, declarations and implementations, it offers symbol-level editing.
- **Claude Code** has a read-only LSP tool (definitions, references, types, symbols, implementations, call hierarchy, plus diagnostics after edits). It is inactive until a code-intelligence plugin and the language server are installed.
- **Monitor-guided decoding** (Agrawal et al., NeurIPS 2023, published as *Monitor-Guided Decoding of Code LMs with Static Analysis of Repository Context*) uses a static-analysis monitor, through a language server, to reshape token probabilities. It improves compilation rates and identifier matches.

**Code navigation infrastructure.** SCIP (Sourcegraph, 2022) replaced LSIF's numeric IDs with readable symbol strings; local symbols are scoped to a document. Glean (Meta, open-sourced 2021) stores code facts queried in the Angle language. Kythe provides cross-reference graphs (its Google origin is reported but not stated on its site). GitHub's stack graphs, file-incremental name resolution based on scope graphs, were archived in September 2025 and are no longer supported.

## History, runtime and configuration as LLM context


**Version history.**

| Work | Evidence | Finding |
| --- | --- | --- |
| HAFix (FSE 2026, journal-first) | Blame-derived commits as prompt context, seven heuristics | About +45% (BugsInPy) and +50% (Defects4J) fixes on single-line bugs against no history |
| HAFixAgent (2025) | The same history inside an agentic repair loop | +4.4% and +1.1% with the strongest model, up to +64.3% with weaker ones |
| Repository Memory (ICLR 2026) | Past commits, linked issues and summaries of frequently changed code added to LocAgent | SWE-bench Verified Acc@5 71.6 -> 76.5 with both; repositories with fewer than 10k commits got worse |
| Hierarchical knowledge injection (ASE 2025) | Repository layer: dependencies, related files, commit history | Improves every bug type on BugsInPy |
| Ripple (ICSE 2026) | Widens a change's impact set with co-change and dependence coupling, then narrows it with an LLM-written change plan | 39.7-380.8% better F1 than earlier impact analysis on Apache projects |
| GPT-5 impact study (2025) | Parent commit and seed change only, no history | GPT-5 and GPT-5-mini both perform poorly at impact analysis |
| CoRanker (2024) | Change history in a random forest | Beats a StarCoder 2 baseline at predicting methods that change together |

**Runtime evidence.**

- Fault localization and repair already use it routinely: AutoCodeRover (spectrum-based localization from tests), AutoFL (FSE 2024; starts from the failing test and stack trace and navigates code and coverage), LDB (checks intermediate values block by block; up to +9.8% on HumanEval, MBPP and TransCoder).
- The gains are not automatic. Haque et al. (KnowledgeNLP at ACL 2025) found that adding execution traces naively helped in only two of six configurations, and less as traces grew more complex; optimized prompts helped more consistently.
- Root-cause analysis over real telemetry is still hard. OpenRCA (ICLR 2025) gives agents 68 GB of logs, metrics and traces; the best solves 11.3%. COCA (ICSE 2025) reconstructs execution paths from code to fill gaps in runtime data (+28.3% exact match). PRAXIS (DSN 2026) walks service and program-dependence graphs for incidents caused by code or configuration (up to 6.3× over ReAct baselines on 30 incidents). In industry, MagmaScope (ICSE 2026 SEIP) reports 74.7% top-5 culprit changes on 55 ByteDance incidents, and a 2024 Meta engineering post 42% top-5 (blog, not peer-reviewed).

**Configuration.** Evidence is thin. Ciri (2023) validates configuration files with LLMs without source code as context. Simon et al. (ASE 2025) retrieve docs, forums and repositories to check dependencies between settings across technologies and find that "merely adding contextual information does not guarantee better" results. PerfSense (2024) has agents read code to find performance-sensitive settings (64.8% against 61.8%). The search found no work that gives an LLM configuration or infrastructure values together with code for impact or "why" questions; that is "not found", not proven absent.

**Graphs spanning code and the lifecycle.**

- **KGCompass** (2025) links issues and pull requests to files, classes and functions in a knowledge graph for repair: 58.3% on SWE-bench Lite. 89.7% of correctly localized bugs had no location hint in the issue and were reached by multi-hop traversal.
- **Abedu et al.** (TOSEM) answer repository questions from a graph of commits, issues, files and users with an LLM: 84% on 150 questions.
- **AgenticSZZ** (2026) searches a temporal commit graph for bug-introducing commits: up to +34% F1. 28% of those commits are out of reach of plain `git blame`.
- **Lingxi** (ISSTA 2026) turns past issue-patch pairs into reusable fixing knowledge: 74.6% on SWE-bench Verified.
- **Argus** (2026) finds the rationale for changes scattered across commits, pull requests and issues (51.4% precision, 93.2% recall). It addresses "why is it built this way?" directly.

**Classic anchors without LLMs.** Mining-software-repositories research recovered links between bugs and fixing commits (ReLink, Wu et al., FSE 2011), and introduced logical coupling (Gall et al., ICSM 1998) and history-guided change prediction (Zimmermann et al., ICSE 2004, extended in TSE 2005). It also combined static and evolutionary dependencies for impact analysis: Kagdi and Maletic (MSR 2007), Gethers et al. (ICSE 2012, adding text retrieval and dynamic analysis), and Kagdi, Gethers and Poshyvanyk (EMSE 2013), who found the combination significantly more accurate than either part.

## Comparisons of structure, text and grep


**Retrieval methods on the same tasks.**

- **LocAgent** compares BM25, embedding models, Agentless, MoatlessTools, SWE-agent, OpenHands and its graph agent. File Acc@5 on SWE-bench Lite: BM25 61.7, the best embedding model 84.7, OpenHands with Claude 3.5 90.2, LocAgent 94.2. In its ablation (fine-tuned 7B model, function Acc@10), removing text entity search costs more (71.5 -> 53.3) than removing graph traversal ( -> 66.1). Results are split by hop distance between functions named in the issue and the patched ones; every method degrades with distance.
- **RepoGraph**: flattening two-hop context into the prompt fell below the baseline (26.0); no edge-type ablation.
- **SpIDER** (2025) adds graph expansion to dense retrieval: containment edges +0.05 to +0.12 Recall@20, containment plus call edges +0.11 to +0.19, on SWE-PolyBench, SWE-bench Verified and Multi-SWE-bench. A small per-edge ladder, but against dense retrieval only.
- **AST chunking** has mixed evidence: cAST (EMNLP Findings 2025) reports +4.3 Recall@5 on RepoEval and +2.7 Pass@1 on SWE-bench, while *Practical Code RAG at Scale* finds line chunks about as good for completion.
- **CoRet** (ACL 2025) adds call-graph context to a dense code retriever: at least +15 points recall (ablation details unconfirmed).
- **Repository-level generation:** Gu et al. (ICSE 2026) find that retrieving similar code can hurt by up to 15% while context and API information help; Hydra (FSE 2026) reports more than 5% Pass@1 from dependency-aware plus similarity retrieval.

**Structural tools against shell tools.**

- **Code Isn't Memory** (2026) is the closest overlap with this project's plan. Three arms on 91 tasks from SWE-PolyBench Verified and SWE-bench Pro, three seeds, one model: with a structural index (embeddings, definition and call graph, BM25), without it, and an agentic-grep tool (OpenCode). Resolve rate 50.4 / 41.9 / 45.3; Acc@5 84.5 / 44.3 / 75.3; cost per solved task \(2.30 / \)2.84 / $2.92. The difference against grep is not significant (p ≈ 0.08). Results are split by gold-file count (1, 2, 3+; n = 46, 18, 27), with the largest localization gap at three or more files. The index's components are not ablated separately.
- **Does a Language Server Save Tokens for Coding Agents?** (2026) compares grep, LSP and both on five or six tasks per class. For localization the LSP costs about 6% more tokens, and agents rarely use it when it is optional. For finding references it wins (F1 0.78 against 0.71), most where grep has many false positives. For multi-file renames grep did better.
- **SWE-Master** (2026): adding an LSP tool raises SWE-bench Verified from 68.4 to 70.4 and from 66.2 to 67.6, with three to five fewer turns.
- **Codebase-Memory** (2026): a tree-sitter knowledge-graph tool against a grep-and-read explorer on 31 repositories gives lower answer quality (83% against 92%) at about a tenth of the tokens.
- **SWE-agent** (NeurIPS 2024): summarized search 18.0 on SWE-bench Lite, iterative search 12.0, no search 15.7, shell only 11.0. Interface design matters as much as the underlying index.
- **Deterministic anchoring** (ISSTA 2026): inline call and inheritance hints give +2.2 Func@5 and 1.6 fewer rounds, split by repository scale.

**Semantic search against grep.** Cursor (November 2025) reports +12.5% on an internal QA benchmark and, in an A/B test, 2.6% more retained code on codebases over 1,000 files, with grep plus semantic search working best. *Deep Agentic Search for Repository-Level Code QA* (2026) reports 65.2% against 46.2% for grep on SWE-QA at under half the cost per correct answer. ContextBench (2026, 1,136 tasks in eight languages with gold contexts) finds that elaborate scaffolds add little over a bash-only agent (exact figures to check in the paper). Practitioners from Augment reported grep and find were sufficient on SWE-bench Verified, and Sourcegraph replaced embeddings with search in Cody; neither gives numbers.

**Splits by evidence spread or overlap.** SWE-PolyBench reports pass rates falling with the number of modified files (17.7% at one file, about 8% at three or more for one agent). SWE-bench Pro patches average 4.1 files. Agentless classifies issues by the location hints they contain; issues with no hint are the hardest. SWE-Bench+ found the solution leaked in the issue for 32.7% of successful patches, and *SWE-Bench Illusion* that models name the right file from the issue text alone up to 76% of the time. RepoMirage (2026) shows scores dropping from 66.8% to 25.3% under perturbations that require broader context.

## Positioning


**What is not new.** Code graphs, symbol-level retrieval, AST chunking, program slicing with LLMs, graph-guided localization agents, language-server tools for agents, property-graph RAG, links between code and its history, and history and runtime evidence as LLM context. Single-level comparisons of structure against text or grep, and splits by number of files, also exist.

**What remains, after the 2026-04-05 search.** Both research claims are *partly covered*. Their remaining parts are narrower than first stated.

1. **History, configuration and runtime evidence for the same question.** Commit history, co-change and runtime traces are already used as LLM context, with gains that are real but uneven: they shrink with stronger models (HAFixAgent), naive traces help only sometimes (Haque et al.), and root-cause analysis over real telemetry stays poor (OpenRCA). Earlier versions of this note also wrongly said the systems above work only on the code at one commit; AutoCodeRover already uses test coverage. What still looks open:
   - configuration and infrastructure values linked to code as context for impact and "why" questions;
   - combining history, configuration and runtime evidence in one assistant for open developer questions rather than benchmark repair;
   - controlled comparisons of which kind of evidence helps which kind of question.
2. **A per-level ladder against strong baselines.** Individual levels and file-count splits have been studied separately, and *Code Isn't Memory* already compares a structural index with an agentic-grep baseline split by gold-file count. What still looks open:
   - a cumulative ladder (syntax, then symbols, then call and data flow, then history) under one model and task set; no study found ablates data flow for agents or localization;
   - each level measured against both a tuned lexical baseline and a grep agent;
   - splits by lexical overlap between the question and the gold code, where only proxies exist (location hints, leakage, grep precision);
   - samples large enough per stratum: existing splits rest on a few dozen items or vendor benchmarks.
3. **A read-only, citation-first assistant** with explicit grounding and abstention rules ([repository expert requirements]({{< ref "projects/code-intelligence/repository-expert/requirements" >}})). This is product discipline rather than research novelty, kept because it makes answers checkable.

**What this project does not claim.** A new analysis technique, a new graph model, or that structure helps on every task. Local completion is a known case where it adds little, and *Code Isn't Memory* suggests that against a good grep agent the gain is mostly in cost and in multi-file tasks.

## References


Code structure and agents:

- Aider repository map: <https://aider.chat/docs/repomap.html>
- AutoCodeRover: [arXiv:2404.05427](https://arxiv.org/abs/2404.05427)
- Agentless: [arXiv:2407.01489](https://arxiv.org/abs/2407.01489)
- RepoGraph: [arXiv:2410.14684](https://arxiv.org/abs/2410.14684)
- CodexGraph: [arXiv:2408.03910](https://arxiv.org/abs/2408.03910), [doi:10.18653/v1/2025.naacl-long.7](https://doi.org/10.18653/v1/2025.naacl-long.7)
- LocAgent: [arXiv:2503.09089](https://arxiv.org/abs/2503.09089), [doi:10.18653/v1/2025.acl-long.426](https://doi.org/10.18653/v1/2025.acl-long.426)
- OrcaLoca: [arXiv:2502.00350](https://arxiv.org/abs/2502.00350)
- Code Graph Model: [arXiv:2505.16901](https://arxiv.org/abs/2505.16901)
- CodeRAG / GraphCodeAgent: [arXiv:2504.10046](https://arxiv.org/abs/2504.10046)
- Code Researcher: [arXiv:2506.11060](https://arxiv.org/abs/2506.11060)
- LLMxCPG: [arXiv:2507.16585](https://arxiv.org/abs/2507.16585)
- Monitor-guided decoding: [arXiv:2306.10763](https://arxiv.org/abs/2306.10763)
- Serena: <https://github.com/oraios/serena>; Claude Code LSP tool: <https://code.claude.com/docs/en/tools-reference.md>
- CodeGraphContext: <https://github.com/CodeGraphContext/CodeGraphContext>
- Copilot Autofix: <https://docs.github.com/en/code-security/responsible-use/responsible-use-autofix-code-scanning>
- NS-Slicer: <https://aashishyadavally.github.io/assets/pdf/pub-oopsla2024.pdf>; SliceMate: [arXiv:2507.18957](https://arxiv.org/abs/2507.18957)
- LlamaIndex property graph index: <https://developers.llamaindex.ai/python/framework/module_guides/indexing/lpg_index_guide/>; LangChain Graph RAG: <https://docs.langchain.com/oss/python/integrations/retrievers/graph_rag>

History, runtime and configuration:

- HAFix: [arXiv:2501.09135](https://arxiv.org/abs/2501.09135); HAFixAgent: [arXiv:2511.01047](https://arxiv.org/abs/2511.01047)
- Repository Memory: [arXiv:2510.01003](https://arxiv.org/abs/2510.01003)
- Hierarchical knowledge injection: [arXiv:2506.24015](https://arxiv.org/abs/2506.24015)
- Ripple: [doi:10.1145/3744916.3773265](https://doi.org/10.1145/3744916.3773265)
- GPT-5 impact study: [arXiv:2512.19481](https://arxiv.org/abs/2512.19481); CoRanker: [arXiv:2411.19099](https://arxiv.org/abs/2411.19099)
- AutoFL: [arXiv:2308.05487](https://arxiv.org/abs/2308.05487); LDB: [arXiv:2402.16906](https://arxiv.org/abs/2402.16906); Haque et al.: [arXiv:2505.04441](https://arxiv.org/abs/2505.04441)
- COCA: [arXiv:2503.23051](https://arxiv.org/abs/2503.23051); PRAXIS: [arXiv:2512.22113](https://arxiv.org/abs/2512.22113)
- Ciri: [arXiv:2310.09690](https://arxiv.org/abs/2310.09690); Simon et al.: [arXiv:2410.08801](https://arxiv.org/abs/2410.08801); PerfSense: [arXiv:2406.12806](https://arxiv.org/abs/2406.12806)
- KGCompass: [arXiv:2503.21710](https://arxiv.org/abs/2503.21710); Abedu et al.: [arXiv:2412.03815](https://arxiv.org/abs/2412.03815); AgenticSZZ: [arXiv:2602.02934](https://arxiv.org/abs/2602.02934); Lingxi: [arXiv:2510.11838](https://arxiv.org/abs/2510.11838); Argus: [arXiv:2604.10345](https://arxiv.org/abs/2604.10345)
- ReLink: [doi:10.1145/2025113.2025120](https://doi.org/10.1145/2025113.2025120); Gall et al.: [doi:10.1109/ICSM.1998.738508](https://doi.org/10.1109/ICSM.1998.738508); Zimmermann et al.: [doi:10.1109/ICSE.2004.1317478](https://doi.org/10.1109/ICSE.2004.1317478), TSE version [doi:10.1109/TSE.2005.72](https://doi.org/10.1109/TSE.2005.72)
- Gethers et al.: [doi:10.1109/ICSE.2012.6227172](https://doi.org/10.1109/ICSE.2012.6227172); Kagdi, Gethers and Poshyvanyk: [doi:10.1007/s10664-012-9233-9](https://doi.org/10.1007/s10664-012-9233-9)

Comparisons and benchmarks:

- SpIDER: [arXiv:2512.16956](https://arxiv.org/abs/2512.16956); cAST: [arXiv:2506.15655](https://arxiv.org/abs/2506.15655); CoRet: [arXiv:2505.24715](https://arxiv.org/abs/2505.24715)
- Gu et al.: [arXiv:2503.20589](https://arxiv.org/abs/2503.20589); Hydra: [arXiv:2602.11671](https://arxiv.org/abs/2602.11671)
- Code Isn't Memory: [arXiv:2606.22417](https://arxiv.org/abs/2606.22417)
- Does a Language Server Save Tokens for Coding Agents?: [arXiv:2608.13568](https://arxiv.org/abs/2608.13568)
- SWE-Master: [arXiv:2602.03411](https://arxiv.org/abs/2602.03411); Codebase-Memory: [arXiv:2603.27277](https://arxiv.org/abs/2603.27277); deterministic anchoring: [arXiv:2606.26979](https://arxiv.org/abs/2606.26979)
- SWE-agent: [arXiv:2405.15793](https://arxiv.org/abs/2405.15793)
- Cursor, *Improving agent with semantic search*: <https://cursor.com/blog/semsearch>
- Deep Agentic Search for Repository-Level Code QA: [arXiv:2608.01507](https://arxiv.org/abs/2608.01507); ContextBench: [arXiv:2602.05892](https://arxiv.org/abs/2602.05892)
- SWE-PolyBench: [arXiv:2504.08703](https://arxiv.org/abs/2504.08703); SWE-bench Pro: [arXiv:2509.16941](https://arxiv.org/abs/2509.16941); SWE-Bench+: [arXiv:2410.06992](https://arxiv.org/abs/2410.06992); SWE-Bench Illusion: [arXiv:2506.12286](https://arxiv.org/abs/2506.12286); RepoMirage: [arXiv:2605.26177](https://arxiv.org/abs/2605.26177)

## Library sources


- [Peng et al. 2025](/sources/537425a77dd3f372821ce85a2526e10e.bin), *Graph Retrieval-Augmented Generation: A Survey* ([doi:10.1145/3777378](https://doi.org/10.1145/3777378))
- [Anonymous 2025](/sources/30cb49de449fbee8fd7c2c4e3a1311da.bin), *Practical Code RAG at Scale* -- on *Comparisons of structure, text and grep*

Further reading:

- [Bratanic and Hane 2025](/sources/9c476df46acc9991d16226fcd86857e2.bin), *Essential GraphRAG: Knowledge Graph-Enhanced RAG*
- [Hu et al. 2025](/sources/f8cd141d3908871de16bdaa38e2ad3a7.bin), *GRAG: Graph Retrieval-Augmented Generation*
- [Zhang et al. 2025](/sources/ea32e0e3c0e5eb9ab159774adfa30e0a.bin), *A Survey of Graph Retrieval-Augmented Generation for Customized Large Language Models* ([arXiv:2501.13958](https://arxiv.org/abs/2501.13958))
