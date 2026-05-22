---
draft: false
toc: true
title: "Skeletons"
linkTitle: "Skeletons"
---
## What reviewers assume by default in agentic LLM work (low-signal checkpoints)


These are often "hygiene" unless tied to an outcome/failure-mode:

- "Designed prompts / system prompt"
- "Built an agent using LangChain/LangGraph/etc."
- "Integrated tools / function calling"
- "Added memory / conversation history"
- "Implemented RAG / vector database"
- "Did prompt tuning / few-shot examples"
- "Added guardrails / moderation"
- "Added logging / tracing"
- "Evaluated responses manually"

# Golden Path


In platform engineering, this concept is called the **"Golden Path"** or **"Paved Road."**

If you find yourself manually writing the boilerplate to connect OpenAI to a Vector DB for the fifth time, you are wasting valuable engineering cycles on low-value labor.

However, be careful. **Do not build "Tutorials." Build "Production Skeletons."**

A "Tutorial" template just works. A "Production Skeleton" assumes failure. Your templates must pre-solve the boring, non-functional requirements (logging, config, security) so you can immediately focus on the complex logic (state, routing, evals).

Here is the breakdown of the **Three Critical Templates** (Building Blocks) you need to treat "Table Stakes" as a solved problem.

### 1. The "Observable RAG" Template


_Purpose: To stop rewriting the `PDF -> Chunk -> Embed -> Store` pipeline._

This template is not about retrieval; it is about **instrumentation**.

- **The "Junior" Version (Avoid):** A script that loads a PDF and queries it.
- **The "System" Version (Build This):** A modular ingestion pipeline with pre-baked observability.
	- **Modular Ingestion:** An abstract `IngestionInterface` that allows you to swap `PyPDF` for `Unstructured` without breaking the app.
	- **Pre-baked Tracing:** Every chunking and embedding step is automatically wrapped in a tracing decorator (e.g., simple OpenTelemetry wrapper or LangSmith callbacks).
	- **Vector DB Abstraction:** A wrapper that handles the connection retry logic (exponential backoff) automatically if the DB is cold.

### 2. The "Deterministic Agent" Template


_Purpose: To stop treating agents as magical infinite loops._

This template enforces **Control Flow** over **Free Will**.

- **The "Junior" Version (Avoid):** A `While True` loop calling `llm.invoke()`.
- **The "System" Version (Build This):** A state-machine scaffolding (using LangGraph or raw Python classes).
	- **Typed State:** A Pydantic model defining exactly what keys exist in the agent's memory (e.g., `messages`, `current_step`, `errors`).
	- **The "Safety Valve":** A hard-coded recursion limit (e.g., "Max 5 steps") that raises a specific exception, not a generic crash.
	- **Structured Output Enforcer:** A helper function that wraps LLM calls and _guarantees_ JSON validity by retrying automatically on parsing errors.

### 3. The "Eval Harness" Template


_Purpose: To make "testing" the default, not an afterthought._

This is the most critical and least built template. Most people start testing manually. You should start with a test harness.

- **The "Junior" Version (Avoid):** A script where you manually read the output and say "looks good."
- **The "System" Version (Build This):** A simplified dataset runner.
	- **Dataset Loader:** A standard way to load a `.jsonl` file of `{input, expected_output}`.
	- **Judge Logic:** A generic `LLM-as-a-Judge` prompt template that compares `actual` vs `expected` and outputs a score (1-5).
	- **Reporting:** A function that dumps the run results into a CSV/Markdown table immediately.

### The Strategic Advantage: "Time to F*** Up"


The goal of these templates is to reduce your **Time to Failure**.

- **Without Templates:** You spend 4 hours setting up the environment, API keys, and basic RAG pipe. You run it, and it hallucinates. You are tired. You quit.
- **With Templates:** You clone the "Observable RAG" repo. You are running in 5 minutes. You see it hallucinates. You still have energy. You spend the next 3 hours **tuning the chunking strategy** and **implementing re-ranking**.

**That 3 hours of tuning is what goes on the resume.** The 4 hours of setup is waste.

### Constraints & Assumptions


1. **Don't Over-Engineer:** Do not build a massive internal library (e.g., `my-company-ai-lib`). That creates dependency hell. Just use "Scaffolding" or "Cookiecutters" (copy-pasteable folder structures).
2. **Opinionated Stack:** Pick **one** stack and stick to it. Do not make the template support Chroma AND Pinecone AND Weaviate. Pick one. If you need to change later, change it then. Flexibility is the enemy of speed here.
3. **Environment Variables:** Your templates must assume a `.env` file structure. Hardcoding keys is immediate technical debt.

# checkpoints from gemini


The following are necessary dependencies, not engineering achievements.

- **"Prompt Engineering":** Unless you are using programmatic optimization (like DSPy), manual prompt tweaking is viewed as trial-and-error, not engineering. It is the "magic number" tuning of the LLM world.
- **"Used LangChain / LlamaIndex":** These are standard abstraction layers. Using them proves you can read documentation. It does not prove you understand the underlying flow of tensors or state.
- **"Connected to Vector DB":** This is now standard plumbing. It is the "SQL query" of the AI stack.
- **"Chat Interface":** Building a Streamlit wrapper around an API call is the modern "Hello World."
