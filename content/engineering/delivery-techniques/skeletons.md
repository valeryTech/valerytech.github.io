---
draft: false
toc: true
description: "Collected notes on golden paths for RAG, agents, and evaluation harnesses, connecting platform templates and engineering checkpoints to observable outcomes."
title: "Skeletons"
linkTitle: "Golden Paths and Engineering Checkpoints"
---
## What reviewers assume by default in agentic LLM work (low-signal checkpoints)


These are often basic setup work, or "hygiene," unless they address a specific outcome or failure mode:

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

Writing the same setup code to connect OpenAI to a vector database for the fifth time uses time that could go toward engineering work on the product.

**Build production skeletons rather than tutorial-only templates.**

A "Tutorial" template just works. A "Production Skeleton" assumes failure. Templates must handle recurring non-functional requirements such as logging, configuration, and security. This lets work start with the complex logic: state, routing, and evaluations.

The following **three critical templates** provide reusable starting points for meeting those basic requirements.

### 1. The "Observable RAG" Template


_Purpose: To stop rewriting the `PDF -> Chunk -> Embed -> Store` pipeline._

This template is not about retrieval; it is about **instrumentation**.

- **The "Junior" Version (Avoid):** A script that loads a PDF and queries it.
- **The "System" Version (Build This):** A modular ingestion pipeline with observability built in.
	- **Modular Ingestion:** An abstract `IngestionInterface` that allows replacement of `PyPDF` with `Unstructured` without breaking the app.
	- **Pre-baked Tracing:** A tracing decorator automatically records every chunking and embedding step (e.g., simple OpenTelemetry wrapper or LangSmith callbacks).
	- **Vector DB Abstraction:** A wrapper that handles the connection retry logic (exponential backoff) automatically if the database is cold.

### 2. The "Deterministic Agent" Template


_Purpose: To stop treating agents as magical infinite loops._

This template enforces **Control Flow** over **Free Will**.

- **The "Junior" Version (Avoid):** A `While True` loop calling `llm.invoke()`.
- **The "System" Version (Build This):** A starting implementation of a state machine, using LangGraph or plain Python classes.
	- **Typed State:** A Pydantic model defining exactly which keys the agent's memory contains (e.g., `messages`, `current_step`, `errors`).
	- **The "Safety Valve":** A hard-coded recursion limit (e.g., "Max 5 steps") that raises a specific exception, not a generic crash.
	- **Structured Output Enforcer:** A helper function that wraps LLM calls and _guarantees_ JSON validity by retrying automatically on parsing errors.

### 3. The "Eval Harness" Template


_Purpose: To make "testing" the default, not an afterthought._

This is the most critical and least built template. Most people start testing manually. Start with a test harness.

- **The "Junior" Version (Avoid):** A script whose output is read manually and judged as "looks good."
- **The "System" Version (Build This):** A simplified dataset runner.
	- **Dataset Loader:** A standard loader for a `.jsonl` file containing `{input, expected_output}` records.
	- **Judge Logic:** A generic `LLM-as-a-Judge` prompt template that compares `actual` vs `expected` and outputs a score (1-5).
	- **Reporting:** A function that immediately writes run results to a CSV or Markdown table.

### The Strategic Advantage: "Time to F*** Up"


The goal of these templates is to reduce **Time to Failure**.

- **Without Templates:** A developer spends 4 hours setting up the environment, API keys, and basic RAG pipe. The first run hallucinates. After that setup work, the developer may be too tired to investigate the failure.
- **With Templates:** A developer clones the "Observable RAG" repository and runs it in 5 minutes. Hallucinations appear while there is still energy to investigate. The next 3 hours go to **tuning the chunking strategy** and **implementing re-ranking**.

**That 3 hours of tuning is what goes on the resume.** The 4 hours of setup is waste.

### Constraints & Assumptions


1. **Don't Over-Engineer:** Do not build a massive internal library (e.g., `my-company-ai-lib`). That makes dependencies hard to manage. Use "Scaffolding" or "Cookiecutters": folder structures that can be copied into a project.
2. **Opinionated Stack:** Pick **one** stack and stick to it. Do not make the template support Chroma AND Pinecone AND Weaviate. Pick one. Change the choice later if the need arises. Flexibility is the enemy of speed here.
3. **Environment Variables:** Templates must assume a `.env` file structure. Hardcoding keys creates technical debt from the start.

# Engineering checkpoints


The following assessments are collected from Gemini-generated notes.

The following are necessary dependencies, not engineering achievements.

- **"Prompt Engineering":** Unless programmatic optimization is used (like DSPy), manual prompt tweaking is viewed as trial-and-error, not engineering. It is the "magic number" tuning of the LLM world.
- **"Used LangChain / LlamaIndex":** These are standard abstraction layers. Using them shows familiarity with documentation. It does not show an understanding of how tensors or state move through the system.
- **"Connected to Vector DB":** This is now standard plumbing. It is the "SQL query" of the AI stack.
- **"Chat Interface":** Building a Streamlit wrapper around an API call is the modern "Hello World."
