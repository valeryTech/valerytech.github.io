---
draft: false
toc: true
title: "Idiosyncrasy"
linkTitle: "Idiosyncrasy"
---
# Guide: Working with Idiosyncrasy in Agent-Ready Target Systems


A target system intended for coding agents should be evaluated not only by its runtime behavior, but also by its **architectural legibility**. In this context, architectural legibility means that a competent newcomer -- human or agent -- can form reasonable expectations about where functionality is located, how changes should be made, and how those changes can be validated.

A project becomes **idiosyncratic** when its structure, naming, dependencies, testing strategy, or development workflow cannot be inferred from common software engineering conventions and instead depends on undocumented local knowledge. Such idiosyncrasy is not always wrong, but it should be treated as an architectural cost: it increases the effort required for both human developers and coding agents to understand, modify, and validate the system.

A useful guiding principle is:

> **Idiosyncrasy is not necessarily a defect, but it is a cost.**

## 1. Evaluate the project from the perspective of a competent newcomer


The simplest diagnostic question is:

> Would a competent engineer, unfamiliar with this project, correctly guess where to make a typical change?

For a backend service, typical changes may include:

|Task|What the newcomer should be able to infer|
|---|---|
|Add a new endpoint|Where routes/controllers are defined|
|Add a field to an API response|Where schemas or serializers live|
|Modify validation logic|Where input and domain validation are handled|
|Add a database query|Where persistence logic belongs|
|Add a test for a bug fix|Which test directory and test style to use|
|Change configuration|Where runtime settings are defined|
|Run the service locally|Which command starts the system|
|Run relevant tests|Which command validates the change|

If these routine actions require insider explanation, the project likely contains hidden conventions or idiosyncratic structure.

## 2. Look for signs of idiosyncrasy


A project may be idiosyncratic when ordinary development actions depend on local knowledge rather than visible structure.

|Area|Diagnostic sign|
|---|---|
|Structure|Files are organized by local history rather than recognizable responsibility|
|Naming|Names are meaningful only to insiders|
|Tooling|Common tasks require undocumented commands|
|Testing|It is unclear which tests validate which behavior|
|Dependencies|Modules depend on each other in surprising directions|
|Configuration|Important behavior is controlled by hidden environment variables or implicit defaults|
|Architecture|Similar features are implemented in different ways|
|Documentation|The docs explain obvious things but omit project-specific rules|
|Change workflow|Developers must ask someone before making routine changes|
|Agent behavior|The coding agent repeatedly edits the wrong files, misses required tests, or misunderstands boundaries|

Coding agents can be useful as a kind of **legibility probe**. If an agent repeatedly makes plausible but wrong assumptions, that may reveal architectural surprise in the project.

## 3. Use routine change tasks as an evaluation method


To evaluate whether a project is agent-ready, select several common development tasks and examine how easily they can be located, implemented, and validated.

Example tasks:

|Change task|Evaluation question|
|---|---|
|Add an endpoint|Is there an obvious place for new API behavior?|
|Change a domain rule|Is business logic separated from transport and persistence code?|
|Add a test|Is the relevant test location and style predictable?|
|Modify persistence logic|Are data access boundaries clear?|
|Update configuration|Are settings visible and documented?|

For each task, ask:

> Where would a competent newcomer expect this change to be made?

Then compare that expectation with the actual project structure. A mismatch is not automatically a problem, but it should be explainable.

## 4. Check whether conventions are consistent


Idiosyncrasy often appears when similar problems are solved in different ways.

Ask:

|Question|What it reveals|
|---|---|
|Are similar features implemented similarly?|Architectural regularity|
|Are API routes defined consistently?|Structural predictability|
|Are database operations handled through the same layer?|Dependency discipline|
|Are tests named and located predictably?|Validation clarity|
|Are schemas, models, and domain objects clearly separated?|Boundary legibility|

A project can tolerate local conventions if they are consistent. Inconsistent conventions are more costly because they force the developer or agent to rediscover the rules for each part of the system.

## 5. Identify hidden knowledge


A strong indicator of idiosyncrasy is hidden knowledge.

Ask:

> What would someone need to know that is not visible in the code, tests, documentation, or tooling?

Examples include:

|Hidden knowledge|Why it matters|
|---|---|
|"This command must be run before tests, but it is not documented."|Validation becomes unreliable|
|"Do not use this module directly, although nothing prevents it."|Architectural boundaries are implicit|
|"This feature looks unused but is required by a background job."|Agents may delete or modify it incorrectly|
|"Tests pass locally only with a specific environment variable."|Feedback loops become fragile|
|"New endpoints should copy this older pattern, not the newer one."|The system sends conflicting signals|

Hidden knowledge should either be removed, encoded into the system, or documented near the place where it matters.

## 6. Classify deviations from convention


Not every deviation from common practice should be eliminated. Some are intentional and valuable. The goal is not to make every system generic, but to understand the cost of each deviation.

|Type of deviation|Interpretation|Recommended action|
|---|---|---|
|Intentional and documented|Usually acceptable|Keep and maintain documentation|
|Intentional but undocumented|Risky|Document the reason and expected usage|
|Accidental but harmless|Low priority|Leave or clean up opportunistically|
|Accidental and confusing|Problematic|Simplify, rename, or restructure|
|Required by domain constraints|Acceptable if explained|Make the domain reason explicit|
|Required by legacy constraints|Often unavoidable|Isolate and document the constraint|

This classification prevents the advice from becoming too simplistic. The point is not "never be unusual." The point is:

> Be conventional where possible, and explicit where necessary.

## 7. Evaluate idiosyncrasy across key dimensions


A practical rubric can evaluate project idiosyncrasy along five dimensions.

|Dimension|Low idiosyncrasy|High idiosyncrasy|
|---|---|---|
|Structural predictability|Files are where a newcomer expects|File locations are surprising|
|Naming consistency|Names reflect common concepts|Names require insider knowledge|
|Workflow explicitness|Setup, test, lint, and run commands are documented|Workflow depends on memory or tribal knowledge|
|Architectural regularity|Similar problems are solved similarly|Similar problems are solved differently|
|Validation clarity|Relevant tests and checks are easy to identify|It is unclear how to verify a change|

Then you could say:

> A target system is agent-ready to the extent that it scores well on structural predictability, naming consistency, workflow explicitness, architectural regularity, and validation clarity.
