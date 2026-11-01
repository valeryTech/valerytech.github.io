---
draft: false
toc: true
title: "Code Representation for Retrieval and Reasoning"
description: "How to model code for retrieval and reasoning, from AST units and repository graphs to compiler-grade analysis and the code property graph."
linkTitle: "Code Representation"
---

Code is not a collection of text documents. It is a highly coupled, directed graph of operations with strict semantic rules and non-local dependencies. A pipeline that splits code into character or paragraph chunks creates "orphaned code": a method cut off from its class, or a variable separated from its initialization. This note covers what has to be modeled so that retrieval works over symbols and relationships rather than strings.

See [retrieval]({{< ref "projects/code-intelligence/retrieval" >}}) for how these representations are searched, and [software knowledge graph]({{< ref "projects/code-intelligence/software-knowledge-graph" >}}) for the wider graph that links code to history, intent and runtime. The tools that actually produce this structure, and what each costs, are in [language servers and code indexes]({{< ref "projects/code-intelligence/language-servers-and-code-indexes" >}}).

## Node level: features of a unit of code


- **AST boundaries.** Logic lives in blocks: functions, classes, methods. Chunking should follow the AST (for example with Tree-sitter) rather than a sliding window, so that a signature is never separated from its body. The atomic retrieval unit is a symbol, not a page. When a method is retrieved, its "envelope" (the enclosing class signature) should come with it. Long files can be chunked hierarchically (file -> class -> method) with parent and child links for multi-hop reasoning.
- **Signatures and implementation.** The interface (arguments, types, return values) says *what* code does; the body says *how*. For high-level questions ("How do I authenticate?"), embedding only signatures often retrieves better than embedding full bodies, because it reduces noise and fits more candidates into the window.
- **Identifier semantics.** Names such as `user_id` or `process_payment` carry most of the meaning, unlike natural language, where meaning is spread across sentences. Indexing should weight identifiers heavily. Generic or obfuscated names (`var1`, `func2`) degrade vector search badly.
- **Comments and docstrings.** These are the only natural-language bridge inside code. They can be embedded separately or with higher weight. A summary index built from docstrings matches intent faster and more accurately than search over raw code.
- **Metadata.** Every chunk carries language, file path, line range and parent scope, so it can be filtered, cited and placed.

AST chunking is not a free win in every task. Controlled benchmarks found that line-based chunks of 32 to 64 lines match or beat syntax-aware splitters for code completion (see [retrieval § Task-aware retrieval]({{< ref "projects/code-intelligence/retrieval" >}}#task-aware-retrieval)). The structural argument is strongest for question answering, tracing and impact analysis, where the unit has to make sense on its own. The evidence is mixed rather than one-sided: cAST (EMNLP Findings 2025) reports +4.3 Recall@5 on RepoEval and +2.7 Pass@1 on SWE-bench from AST chunking.

## Repository level: relationships between units


The meaning of a file is defined by its relationships with other files.

- **Dependency graph (imports and exports).** To understand file A that imports B, you need B's context. Retrieval should be recursive: when search finds `main.py`, the system checks its imports and injects the signatures of the imported dependencies.
- **Call graph.** Which functions invoke which represents execution flow. A question such as "trace the error handling" needs traversal up to callers and down to callees, not a keyword search for `try/catch`.
- **Directory structure.** A path (`/src/auth/login.py` vs `/tests/auth/test_login.py`) encodes architectural intent. Storing it as metadata lets the system tell implementation from test code.
- **Tests.** Tests contain guaranteed usage examples. When the task is "write code that uses X", the test for X is often more useful than X's source.
- **Build and link graph.** In compiled languages, the `Makefile` or `CMake` graph shows which libraries are actually linked, which prevents the model from relying on a library that is imported but never used.

A minimal graph-aided retrieval flow for "How is the user session validated?":

1. Vector search finds `validate_session()` in `auth.py`.
2. Graph expansion finds that it calls `check_db_hash` (in `db.py`) and inherits from `BaseValidator` (in `common.py`).
3. The prompt receives the body of `validate_session` plus the signatures of `check_db_hash` and `BaseValidator`.

## Compiler-grade analysis: a read-only language server for the model


Moving from lexical analysis (strings) to semantic analysis (symbols and flows) amounts to building a read-only Language Server Protocol service for the LLM.

- **Global symbol table.** Text search sees `process_request` in fifty files and returns the five most similar, ignoring scope. Indexing fully qualified names (`src.database.postgres.ConnectionPool.connect`) and resolving calls such as `self.connect()` through the class hierarchy and imports removes most of the ambiguity: the system retrieves the resolved definition, not a name match. Calls through dynamic dispatch, reflection or dependency injection can still resolve to several candidates or none.
- **Program slicing.** A 2,000-line file may hold one relevant function. A backward slice from a use of variable `x` keeps only the statements that affect `x` (assignments, conditions) by walking the control-flow graph backwards. Slicing lets logic from many files fit into one context window.
- **Def-use chains and taint tracking.** Names change as data moves (`input_str` -> `query` -> `sql`), so text search stops at the first rename. Precomputed definition-use chains give the full data-flow subgraph across files and calls, which answers "where does this data go?" and "is this secure?".
- **Canonicalization.** Formatting differences (`if (x) { return y; }` vs `if (x) return y`) shift embeddings. Parsing to an AST, stripping comments and regenerating code with one formatter (`black`, `clang-format`) before embedding should make search less sensitive to style. The original code, with comments, is what the model reads. This is untested here: current code embedding models may already be fairly robust to formatting, so measure the effect before building it.
- **Type inference injection.** In Python and JavaScript the model has to guess types and then invents methods. Running a type checker (Pyright, TypeScript) offline and annotating the prompt (`def process(data /* : UserObject */)`) should reduce those inventions. Related evidence: monitor-guided decoding, which consults a language server during generation, reports better compilation rates. Whether annotations in the prompt have a similar effect is a hypothesis.

| | Standard RAG | Compiler-engineered RAG |
| --- | --- | --- |
| Unit of retrieval | Text chunk (lines) | Symbol or AST node |
| Search mechanism | Vector similarity | Symbol resolution plus graph traversal |
| Context strategy | Nearby text | Program slicing (data and control dependency) |
| Cross-file logic | Often missed | Follows imports and inheritance |

## Static and dynamic languages


Static languages put the truth in the text. Dynamic languages only reveal it at run time, so static parsing has to be supplemented with runtime evidence.

| Feature | Why it matters | How to use it |
| --- | --- | --- |
| Type hierarchies and interfaces (static) | `Shape.draw()` is useless without `Circle.draw()` vs `Square.draw()` | When an interface method is queried, retrieve the most-used implementations |
| Generics, templates, macros (static) | Generated code does not exist in the source text | Index instantiated forms (a synthetic view of `Vec<User>`), not only the template |
| Compiler warnings and suppressions (static) | Mark fragile zones | Score files by warning density; make the model more conservative there |
| Linker symbols (static) | The build resolves real dependencies | Use the build graph to see what is actually linked |
| Reflection and metaprogramming (dynamic) | `getattr(obj, name)` or `method_missing` hide the call graph | Capture calls with runtime tracing during tests and index those links |
| Duck typing (dynamic) | The model does not know the shape of `data` | Record argument types while running tests (MonkeyType, PyType) and inject them as hints |
| Decorators and middleware (dynamic) | Auth or logging wrappers are invisible in the body | When retrieving `view_profile`, also fetch `@login_required` |
| REPL and notebook state (dynamic) | State persists between cells | Treat current variable state (for example a DataFrame schema) as context |

## The code property graph


A **code property graph** (CPG), popularized by tools such as Joern, combines three classic structures into one queryable graph:

- the abstract syntax tree (syntax),
- the control-flow graph (execution order),
- the program dependence graph (data flow).

Enriched with a symbol table, types, file paths, ownership, complexity and churn, the CPG is the most reliable layer in this project: its edges come from analysis tools, not from an LLM's guesses, although static analysis still misses dynamic behavior. The CPG itself is established technology; what this project adds is only the question of how much of it an assistant needs. [hybrid architecture]({{< ref "projects/code-intelligence/hybrid-architecture" >}}) treats it as the ground-truth layer, and [software knowledge graph]({{< ref "projects/code-intelligence/software-knowledge-graph" >}}) extends it with history, intent and runtime evidence.

## References


- Tree-sitter-based code graph RAG prototype: <https://github.com/vitali87/code-graph-rag>
- CodeRAG (bigraph retrieval for repository-level code generation): [arXiv:2504.10046](https://arxiv.org/abs/2504.10046)
