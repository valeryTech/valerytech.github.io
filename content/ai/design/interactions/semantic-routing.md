---
draft: false
toc: true
title: "Recipe Bot Patterns: Semantic Routing and Mixed Initiative"
description: "Uses a recipe workflow to connect semantic routing, mixed-initiative clarification, and candidate selection before expensive generation."
linkTitle: "Semantic Routing"
---

The recipe workflow combines the **Router Pattern** (architecture) with **Mixed-Initiative Interaction** (UX).

These patterns are highly common in industry application design and Human-Computer Interaction (HCI) research.

### 1. The Architectural Name: "The Semantic Router"


In modern AI Engineering (e.g., building with LangChain, Semantic Kernel, or custom agent stacks), this specific logic layer is called **Semantic Routing** or the **Routing Pattern**.

- **Definition:** An architecture where an initial "Gateway" step classifies the user's intent not just to answer, but to decide _which downstream process to trigger_ (e.g., Recipe Generator vs. Clarification Agent).
- **Industry Status:** **Standard.** This is the default architecture for production-grade AI applications moving beyond simple "Chat with PDF" prototypes.
	- _Example:_ Customer support bots use this to route "My internet is down" to a technical troubleshooting flow, but "How much is the bill?" to a database lookup flow.
- **Why it's used:** It prevents "square peg in a round hole" errors where the LLM tries to solve a complex problem with a generic answer.

### 2. The UX Paradigm: "Mixed-Initiative Interaction"


From a research/User Experience perspective, this is known as **Mixed-Initiative Interaction**.

- **Definition:** A conversation strategy where the initiative (control) shifts dynamically between the user and the agent.
	- _User Initiative:_ "I want a burger." (Agent obeys).
	- _System Initiative:_ User says "I'm hungry," Agent takes control to ask, "Do you want sweet or savory?"
- **Research Origins:** This concept dates back to HCI research in the late 90s/early 2000s (e.g., _Horvitz et al., Microsoft Research_) but has seen a massive resurgence with LLMs.
- **Key Paper Concept:** It solves the **"Gulf of Execution"** -- the gap between what a user wants and knowing how to ask the system for it.

### 3. The "Candidate List" Specifics: "Critique-Based Refinement"


Offering 2-3 options (a "Candidate List") before generating the full recipe is a simplified version of **Option-Based Generation** or **Critique-Based Refinement**.

- **Industry Status:** **Best Practice for Creative Tasks.**
	- _Midjourney/DALL-E:_ They generate 4 image variations and ask the user to "Upscale" one, rather than immediately producing one final high-resolution image. The recipe bot applies the same pattern to text.
	- _Coding Assistants:_ GitHub Copilot often suggests multiple autocompletions.

### Summary for PRD


Example PRD wording for stakeholders and engineers:

> _"We are moving from a flat 'Input-Response' model to a **Semantic Router Architecture**. We will utilize **Mixed-Initiative** logic to disambiguate user intent, ensuring we only trigger the expensive **Generation Step** once the user has selected a viable candidate."_
