---
draft: false
toc: true
description: "Describes open-ended AI assistance and its coexistence with bounded workflows, preserving context and work in progress while enforcing permissions for external operations."
title: "General Purpose Ai Assistant"
linkTitle: "General Purpose Ai Assistant"
---
# General-purpose AI assistant


A general-purpose AI assistant supports a broad, open-ended range of user requests, including questions, explanations, reasoning, exploration, content creation, and problem-solving. Users can define, refine, and change their goals during interaction.

The interface can combine conversation with documents, visualizations, interactive controls, and other forms of interaction.

**One possible architecture combines open-ended interaction with bounded workflows.**

In an **open-ended mode**, the assistant can help users explore problems, reason through alternatives, obtain explanations, and determine what they want to accomplish. The interaction is flexible, but the system can restrict access to tools and external operations, for example by permitting read-only access without allowing changes to business systems.

When a user decides to perform a supported operation, the application can transition into a **bounded workflow**, such as booking, account recovery, or another predefined task. The workflow defines the available operations, valid transitions, required information, and execution constraints. The LLM may guide users through it, while the application enforces those boundaries.

Users may also return to open-ended interaction, preserving relevant context without granting the assistant the permissions of the bounded workflow.

This arrangement allows a single product to support both open-ended exploration and controlled execution, with explicit transitions between them.

**Examples:** General-purpose AI assistants such as ChatGPT, Claude, or Gemini, potentially combined with application-specific workflows.
