---
draft: false
toc: true
title: "Code Assistant"
linkTitle: "Code Assistant"
---
# code assistants


**Systems Implications:**

- **Code-Aware Chunking:** Splitting code arbitrarily breaks functions and classes. The ingestion pipeline must use Abstract Syntax Tree (AST) parsers to chunk data logically by class, function, or module.
- **Temporal Decay:** In software, a solution from 2021 might be an anti-pattern in 2026. The retrieval algorithm must apply a time-weighted decay function to prioritize the most recent documentation.

add lsp and AST parsers

domain-driven modeling and refactoring assistant

assistant aware of different coupling between components

assistant not only with search on codebase, but actually understanding how the structures in the language are build and connected.

the agent could really understand underlying file structure and ...

perhaps one of the introduction points of HITL will be choosing and verification of possible candidates to search (services, etc). like here: for manuals, often **hybrid search + user choice** beats RAG

option, or step: you can prepare your codebase to the AI usage https://ianbull.com/posts/software-architecture; also https://www.youtube.com/watch?v=uC44zFz7JSM
