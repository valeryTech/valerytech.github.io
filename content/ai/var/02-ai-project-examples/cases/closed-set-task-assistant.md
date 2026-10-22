---
draft: false
toc: true
title: "Closed Set Task Assistant"
linkTitle: "Closed Set Task Assistant"
---
# Closed-set task assistant


A closed-set task assistant helps users complete a predefined set of tasks. Its design is motivated by the need to **make LLM-based systems more reliable and limit the consequences of unpredictable model behavior**.

A closed-set task assistant supports a predefined range of tasks. The main design motivation is to improve reliability and limit the potential damage caused by unpredictable LLM behavior through architectural constraints and guardrails.


The system restricts the operations available to the LLM and defines how those operations can be executed. The LLM may interpret requests, collect missing information, and select among permitted tasks, while application logic enforces valid inputs, permissions, execution conditions, and other constraints.

For example, a booking assistant may understand a user's request and help complete a reservation, but it cannot arbitrarily modify bookings or invoke operations outside the defined task set.

The key characteristic is **constrained behavior enforced by the system architecture**. The LLM retains some flexibility in interpreting requests, while the application controls what actions can actually occur.

**Examples:** Booking assistants, account recovery flows, form completion, and predefined customer-service tasks.


---
One possible architecture uses a **state machine or a graph of constraints and dependencies** as the workflow's underlying structure. This structure defines permitted states, transitions, required inputs, validation rules, calculations, and available operations.

The LLM can guide progression through this structure, selecting appropriate next steps based on the user's input and current state. This allows flexible interaction and navigation without requiring a completely scripted conversation. The application enforces the constraints, validates transitions, and controls the execution of operations.

For example, a booking assistant can determine which information is missing, present appropriate interface controls, respond to changes in the user's choices, and guide them toward completing a reservation. The actual booking operation is executed only when the system's defined conditions are satisfied.

The defining principle is **flexibility within enforced boundaries**. The LLM can influence how a task progresses, while the surrounding architecture restricts what it can execute and ensures that required conditions are met.

**Examples:** Booking assistants, account recovery workflows, form completion, and other systems supporting a bounded set of operations.
