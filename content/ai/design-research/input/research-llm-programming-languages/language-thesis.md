---
draft: false
toc: true
title: "Language thesis"
description: "Papers and essays on why AI may increase the value of typed languages and formal verification, distinguishing research results from predictions about adoption."
linkTitle: "Language thesis"
---

Final response from the **Language thesis** sub-agent in [Research LLM Programming Languages]({{< ref "ai/design-research/input/research-llm-programming-languages/conversation" >}}). Captured on 2026-04-29 from the signed-in sub-agent viewer. Wording, URLs, headings, lists, and tables are preserved; rich-text formatting is converted to Markdown. Retrieved-reference IDs are retained as written in the report.

---

## Closest matches to the user’s thesis


All six below are primary sources. The first three explicitly argue that AI increases the value of types or formal verification; the other three provide concrete research results. Their main subject is AI-generated software, so distinguish them from work that enforces permissions on a running LLM agent.

### 1. Yaron Minsky — “Formal methods and the future of programming”


Jane Street blog, June 7, 2026.
 [https://blog.janestreet.com/formal-methods-at-jane-street-index/](https://blog.janestreet.com/formal-methods-at-jane-street-index/)

Closest match for richer languages becoming more useful. Minsky says agentic coding changed Jane Street’s view of formal methods sufficiently that it is building a team in the area. His argument has three parts: models reduce proof-writing costs; generated code increases the burden of verification; and precise feedback from types and proofs improves agent performance. He specifically discusses integrating modular specifications, ownership and mutability constraints, and proof techniques into its language. This supports the language-design part of the thesis, with a concrete organizational response.

Limit: An engineering position and reported experience, not evidence of an industry-wide causal trend. It does not prove that a well-typed deployed agent cannot delete resources.

### 2. Martin Kleppmann — “Prediction: AI will make formal verification go mainstream”


Author’s blog, December 8, 2025.
 [https://martin.kleppmann.com/2025/12/08/ai-formal-verification.html](https://martin.kleppmann.com/2025/12/08/ai-formal-verification.html)

Closest match for the adoption prediction. He argues that AI simultaneously lowers the cost of formal verification and increases demand for it, because generated implementations can be paired with machine-checked proofs. He names Rocq, Isabelle, Lean, F*, and Agda and imagines humans specifying desired properties declaratively while agents produce implementations and proofs.

Limit: Explicitly a prediction. He also identifies the remaining problem: establishing that the formal specification expresses what people actually intended. This is a useful qualification for the final answer.

### 3. Cassidy Williams — “Why AI is pushing developers toward typed languages”


GitHub blog, January 8, 2026.
 [https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/)

Most direct popular article about language adoption. It argues that types provide shared contracts among developers, frameworks, and AI code generators, making code people did not personally write easier to integrate and check. It connects this argument to GitHub’s reported TypeScript growth.

Limit: Treat the adoption explanation as an interpretation of correlated trends, not causal proof. Also avoid repeating its expansive rhetoric around “94%”: that figure concerns type errors among compilation errors in a particular study’s TypeScript evaluation, not 94% of all LLM errors or all software bugs.

## Research supporting the mechanisms

### 4. Niels Mündler et al. — “Type-Constrained Code Generation with Language Models”


Peer-reviewed, PLDI 2025 / PACMPL; published June 13, 2025.
 [https://pldi25.sigplan.org/details/pldi-2025-papers/25/Type-Constrained-Code-Generation-with-Language-Models](https://pldi25.sigplan.org/details/pldi-2025-papers/25/Type-Constrained-Code-Generation-with-Language-Models)
 [https://arxiv.org/abs/2504.09246](https://arxiv.org/abs/2504.09246)
 DOI: [https://doi.org/10.1145/3729274](https://doi.org/10.1145/3729274)

Authors: Niels Mündler, Jingxuan He, Hao Wang, Koushik Sen, Dawn Song, Martin Vechev.

It uses a programming language’s type rules to constrain token generation. A sound approach is formalized for a foundational typed language and extended to TypeScript. In HumanEval and MBPP evaluations, it reduces compilation errors by more than half.

Why relevant: Types can actively constrain what the model produces, as well as check outputs afterwards.

Limit: Well-typedness is a specified structural property. It does not by itself establish functional correctness, user intent, or safe authority.

### 5. Andrew Blinn et al. — “Statically Contextualizing Large Language Models with Typed Holes”


Peer-reviewed, OOPSLA 2024 / PACMPL; published October 8, 2024.
 [https://arxiv.org/abs/2409.00921](https://arxiv.org/abs/2409.00921)
 [https://doi.org/10.1145/3689728](https://doi.org/10.1145/3689728)

Authors: Andrew Blinn, Xiang Li, June Hyung Kim, Cyrus Omar.

The language server supplies type and binding information relevant to the part of a program being generated, then supplies error feedback for refinement. The work tests this in Hazel and TypeScript and finds type-definition context particularly helpful.

Why relevant: Rich types are useful information shared between humans, tools, and LLMs. They make implicit assumptions explicit and improve the model’s access to meaningful project context.

Limit: Evidence about better code completion, not a universal verification or security guarantee.

### 6. Sergiu Bursuc et al. — “A benchmark for vericoding: formally verified program synthesis”


arXiv preprint, submitted September 26, 2025.
 [https://arxiv.org/abs/2509.22908](https://arxiv.org/abs/2509.22908)

Authors include Sergiu Bursuc, Theodore Ehrenborg, Shaowei Lin, Lacramioara Astefanoaei, Ionel Emilian Chiosa, Jure Kukovec, Alok Singh, Oliver Butterley, Adem Bizid, Quinn Dougherty, Miranda Zhao, Max Tan, Max Tegmark.

It evaluates LLM generation of formally verified code from formal specifications across Dafny, Verus/Rust, and Lean, using 12,504 specifications.

Why relevant: Concrete research on making an opaque generator produce an artifact that an independent checker can validate.

Limit: Benchmark success is not evidence that arbitrary real systems can be fully verified. The specification is supplied; alignment between the specification and human intention remains outside the demonstrated guarantee. I found the arXiv version, so label it a preprint unless another source establishes a venue.

## Optional additional sources


- Mike Dodds, Galois — “[Claude Can (Sometimes) Prove It](https://www.galois.com/articles/claude-can-sometimes-prove-it),” September 16, 2025. First-person experience using an agent for Lean formalization. Useful qualification: the agent can complete many steps, but the author still guides the larger formalization.
- Zoe Paraskevopoulou — “[Machine-Generated Code Deserves Machine-Checked Proofs](https://zoep.github.io/blog/2026/04/17/machine-generated-code-machine-checked-proofs/),” April 17, 2026. First-person research experience mechanizing proofs with agents; useful for explaining the small trusted proof checker and untrusted proof producer distinction.
- Alexander Sternfeld, Ljiljana Dolamic, Andrei Kucharavy — “[Leveraging the Scala type system for secure LLM-generated code](https://aclanthology.org/2025.ommm-1.11/),” OMMM workshop proceedings, September 2025. Uses Scala, Stainless, and a type-focused agent workflow for safer generated code. Smaller workshop study; keep claims tied to its experiments. PDF includes “TypePilot” in the title while anthology metadata omits it.

Suggested synthesis for parent: The user’s prediction already has explicit advocates, including Kleppmann, Minsky, and GitHub. The strongest defensible claim is that LLMs increase the value of explicit, machine-checkable contracts. Which languages gain adoption remains a separate empirical question. For the user’s “agent must not delete” example, runtime capability/security papers will be a better direct match than these coding articles.
