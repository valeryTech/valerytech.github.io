---
draft: false
toc: true
title: "Task Types in Engineering Work"
description: "The recurring kinds of tasks in engineering work, grouped by what each starts from and produces, sorted from the product, behavior, architecture and output points of view, with a delegation profile for each and how to measure work by type."
linkTitle: "Task Types"
---

A task type is a recurring kind of task in engineering work, such as fixing a bug or refactoring a module, whoever does it: a person, an agent, a person and an agent together, or an automated tool such as a bot that opens pull requests for dependency upgrades. It combines several [activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) and has its own starting point, output, and definition of done. None of these depend on who does the task. Who does it is a separate question: [Participants and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}) describes the participants and the four responsibilities each task assigns among them (supplying information, doing the work, judging the result, and committing it). Because the type doesn't depend on the participant, the same type can be done by different participants, and their results can be compared. The [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) uses task types as the unit for collecting and comparing cases.

This note collects task types from two places: the agents notes, and common software engineering practice. The column "In the notes" links to the note where a type already appears; a dash means the type was added from practice. All types here are candidates. Real cases will merge, split, or drop them.

The note has five parts after the list of types:

- **Programs and Tasks of Reviewable Size** marks the types that take weeks and many pull requests, and shows the smaller types they break into.
- **Views of Task Types** sorts the same types from the product, behavior, architecture, and output points of view.
- **Delegation Profiles** gives each type a default level of freedom for a participant without a track record on it, whether an agent or a new team member, and the evidence any participant has to give, and says how one task's risk changes the default.
- **Recording and Measuring by Task Type** describes how to label work with its type and what to measure per type.
- **Problems Task Types Help With** connects these parts to the [problems]({{< ref "ai-engineering/agents/problems/problems" >}}) that team leads, architects, and engineering managers raise about work with agents.

The activities column uses the short names of the six activities: framing, investigation, design, implementation, verification (verification and review), and release (release, operation and learning).

## Understanding the Code and the System


These tasks produce knowledge. The output is a finding, a description, or an answer, and the code doesn't change.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Understand a codebase or a part of it** | Build a description of how a repository or module is organized: what owns which behavior, how it's built, tested, and run. Done when someone can find where a behavior lives, and the description has been checked against the code. | Investigation | -- |
| **Answer a question about the code** | Questions such as "where is X handled", "what calls this function", or "why does this return null here". Done when the answer points to the code that supports it. | Investigation | [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) |
| **Investigate a problem** | Look into a reported problem whose cause and size are unknown. The output is a finding with evidence and a statement of what remains unknown. | Investigation | [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) |
| **Find a root cause** | Compare hypotheses and run checks that rule them in or out. Done when one explanation is supported and the others are ruled out. The result often feeds a design decision. | Investigation, verification | [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) |
| **Analyze the impact of a change** | Find what a planned change affects: callers, migrations, configuration, other services, and data. Done when the list of affected places is complete enough to plan the change. | Investigation | [Problems]({{< ref "ai-engineering/agents/problems/problems" >}}) (problem 24) |
| **Investigate run records or logs** | Explain why a run, job, or request produced what it did, from its logs and traces. | Investigation | -- |
| **Compare options** | Compare libraries, services, or approaches against the project's constraints. The output is a recommendation with the reasons and the costs of each option. | Investigation, design | -- |
| **Spike or prototype** | Write code that will be thrown away, to answer a question such as "can this library do X" or "how fast is this". Done when the question has an answer; the code doesn't need to meet production standards. | Investigation, implementation | -- |

## Framing and Planning


These tasks prepare later work. The output is a document that someone else, or a later task, works from.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Frame a problem** | Turn a rough request, idea, or reported issue into a brief: who is affected, what problem needs to be solved, what should change, what the change should not do, and open questions for the owner. | Framing, investigation | [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) |
| **Write or revise a design document** | Write a design document or a decision record from raw material such as notes, a discussion, or a ticket. Done when the decisions, the options considered, and the open questions are written down and the owner agrees. | Framing, design | -- |
| **Plan a change** | Break a large change into steps that can each be reviewed and merged, with the order and the checks for each step. | Design | -- |
| **Estimate a change** | Give the size and risk of a change, with the assumptions behind the estimate. | Investigation | -- |

## Changing Behavior


These tasks change what the software does. They end in a code change that has passed verification.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Implement a feature** | Add new behavior. Done when the behavior works as the brief describes, has tests, and is released or ready to release. | All six | [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) |
| **Fix a bug** | Reproduce the bug, find the cause, choose a fix (guard the symptom, fix the caller, or change the contract), and implement it. Done when a regression test fails before the fix and passes after it, and nearby variations are checked. | Investigation, design, implementation, verification | [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) |
| **Make a small specified change** | Change a text, a default value, a feature flag, or a configuration value, where the request says exactly what to change. Done when the change is made and nothing else changed. | Implementation, verification | -- |
| **Ship a hotfix** | Fix a problem in production under time pressure, with the smallest change that stops the harm. A full fix often follows as a separate task. | Investigation, implementation, release | -- |
| **Revert a change** | Undo a merged change that caused a problem, including any data or configuration it changed. | Implementation, release | -- |
| **Implement a property and check it with a run** | A project variant of a feature: add a behavior to an engine and confirm it with a real run. | Implementation, verification | -- |

## Changing Structure Without Changing Behavior


These tasks change how the code is organized while behavior stays the same. The definition of done always includes evidence that behavior didn't change.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Refactor** | Map callers and current behavior, choose the target structure and what must stay the same, and change the code in small steps. Done when tests show behavior didn't change. | Investigation, design, implementation, verification | [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) |
| **Remove dead code** | Delete code, flags, or configuration that nothing uses. Done when the removal is shown to be safe: no callers, no references in configuration, no traffic. | Investigation, implementation, verification | -- |
| **Make a change across many call sites** | Rename an API, replace a deprecated function, or change a pattern everywhere it's used, often with a script that rewrites the code. Done when every call site is changed and the old form can't come back, for example because a lint rule rejects it. | Investigation, implementation, verification | -- |
| **Migrate to another framework or language** | Move a part of the system to a new framework, library, or language while keeping its behavior. Usually done in stages, with the old and new versions running side by side. | All six | -- |

## Improving Properties of the System


These tasks change how well the software works: speed, cost, safety, and how it fails. The goal has to be stated as a number or a check, or there is no way to tell when the task is done.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Improve performance** | Make something faster or use fewer resources. Done when a measurement before and after shows the gain and behavior didn't change. | Investigation, design, implementation, verification | -- |
| **Fix a security vulnerability** | Fix a reported weakness in the code or a dependency. Done when the weakness can't be used anymore and a test or check covers it. | Investigation, implementation, verification, release | -- |
| **Harden failure handling** | Add timeouts, retries, limits, or fallbacks so a failure in one part doesn't spread. | Design, implementation, verification | -- |
| **Add monitoring** | Add logs, metrics, alerts, or traces so problems can be seen and diagnosed in production. | Design, implementation, release | -- |
| **Improve accessibility** | Change the interface so people using screen readers, keyboards, or other aids can use it. | Implementation, verification | -- |

## Keeping the System Current


These tasks respond to changes outside the code: new versions of dependencies, deprecated services, and changes to data.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Upgrade a dependency** | Move to a new version of a library, framework, language runtime, or tool, and fix what the upgrade breaks. Done when tests and the build pass on the new version and the release notes have been checked for changes in behavior. | Investigation, implementation, verification | -- |
| **Respond to a deprecation** | Change the code before an external API, service, or platform version stops working. | Investigation, design, implementation | -- |
| **Migrate a database schema or data** | Change the shape of stored data, or move data to a new store. Done when the migration has run, the data is checked, and there is a way to roll back or a decision that there isn't one. | Design, implementation, verification, release | [Problems]({{< ref "ai-engineering/agents/problems/problems" >}}) (problem 91) |
| **Change infrastructure** | Change deployment configuration, cloud resources, or infrastructure code. | Design, implementation, release | [Problems]({{< ref "ai-engineering/agents/problems/problems" >}}) (problem 91) |

## Tests, Builds, and Checks


These tasks work on the checks that other tasks depend on.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Add tests to existing code** | Write tests for code that has few or none, often to record current behavior before a refactor. Done when the tests would fail on the bugs they are meant to catch. | Investigation, implementation, verification | -- |
| **Fix a flaky test** | Find why a test sometimes fails, and fix the test or the code. Done when the cause is known; retrying the test until it passes doesn't count. | Investigation, implementation, verification | -- |
| **Fix a broken build or CI run** | Find why the build or pipeline fails and fix it. | Investigation, implementation | -- |
| **Add a check** | Add a lint rule, type check, test, or CI job that catches a kind of mistake automatically. | Design, implementation | Maintainability sensors |

## Review and Verification


These tasks judge work that someone else did. The output is a decision or a list of findings.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Review a pull request** | Check a change for defects, missed callers and edge cases, and fit with the design. Done when the reviewer has accepted the change, asked for changes, or rejected it, with reasons. | Verification | [Independent verification]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}}) |
| **Review work done without supervision** | Check work that a participant did while nobody was watching, such as a branch an agent produced overnight or a change from an outside contributor, including whether it did what was asked. | Verification | -- |
| **Audit code for one concern** | Check a part of the system for security, licensing, privacy, or another single concern. | Investigation, verification | [Project ownership]({{< ref "ai-engineering/agents/project-ownership" >}}) |

## Release and Operation


These tasks deal with software that runs in production.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Prepare a release** | Write release notes, update the version, and check that the release is ready. | Verification, release | -- |
| **Deploy or roll out a change** | Release a change in stages, watch the signals, and roll back if they go wrong. | Release | [Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}}) |
| **Respond to an incident** | Stop the harm first, then find the cause. Done when the system is stable and the follow-up tasks are recorded. | Investigation, implementation, release | [Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) |
| **Write a postmortem** | Describe what happened in an incident, why, and what will change so it doesn't happen again. | Investigation, release | -- |

## Documentation and Project Knowledge


These tasks change what people and agents read about the project.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Write or update documentation** | Write or update a README, API reference, guide, or runbook so it matches the code. | Investigation, implementation | -- |
| **Update project instructions** | Add, change, or remove what tells participants how to work in the project: `AGENTS.md`, skills, and commands for agents, and onboarding guides and contribution rules for people. Base each change on what cases showed. Done when a later task goes better with the change. | Design, implementation, verification | [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}) |
| **Set up the development environment** | Make the project build, test, and run on a new machine or in a container, and write down the steps. | Investigation, implementation | -- |

## Decisions and Changes Across Teams


These tasks affect more than one team or the whole system, and a staff engineer, an architect, or an engineering manager usually owns them. Most of them end in a decision or a program of smaller tasks.

| Task type | What it is and when it's done | Activities | In the notes |
| :--- | :--- | :--- | :--- |
| **Change an API that other teams use** | Change a contract that other services or teams call, usually by adding a new version, moving the callers, and removing the old version. Done when every caller has moved and the old version is removed or has a removal date. | Framing, design, implementation, release | [Participants and processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}) |
| **Remove a feature or service** | Stop offering a feature or service and remove its code and data. Done when usage data shows nobody depends on it, callers are gone, and the code and data are removed. | Investigation, design, implementation, release | -- |
| **Reduce running cost** | Find where money goes, such as cloud resources, model tokens, or licenses, and spend less. Done when a measurement shows the saving and service levels held. | Investigation, design, implementation, verification | [Problems]({{< ref "ai-engineering/agents/problems/problems" >}}) (problem 62) |
| **Decide whether to build or buy** | Compare building a component with buying or adopting one. The output is a recommendation with the total cost, the risks, the dependency on the vendor, and the way out if the choice turns out wrong. | Framing, investigation, design | -- |
| **Set a standard for the team** | Choose one way to do a recurring thing, such as error handling, logging, or the layout of a new service, write it down, and add checks for the parts that can be checked. Done when the standard is written, the checks run, and existing exceptions are listed. | Design, implementation | [Problems]({{< ref "ai-engineering/agents/problems/problems" >}}) (problem 84) |
| **Take stock of technical debt** | List the parts of the system that slow work down or carry risk, with the cost of keeping each one and the cost of fixing it. The output is a ranked list the team can plan from. | Investigation | -- |
| **Review a design** | Check a design document before building starts: the options considered, the failure modes, and fit with the rest of the system. Done when the reviewer accepts it, asks for changes, or rejects it, with reasons. | Verification | -- |
| **Plan capacity** | Estimate how load will grow and when the system will run out of capacity, and what to change before then. | Investigation, design | -- |
| **Decide who may do which task types** | Decide which participants may take which task types, at which level of freedom, and with which checks. This covers agent roles, new team members, and outside contributors. Change the decisions as evidence comes in. | Framing, design | [Participants and processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}) |

## Programs and Tasks of Reviewable Size


Some task types take weeks and many pull requests. This note calls such a task a program. A task of reviewable size ends in one result that one reviewer can check in one go, usually one pull request. A program has to be broken into tasks of reviewable size, whoever does them. The plan and the state of the program live outside any single task, for example in a ticket or a plan document that each participant reads and updates ([Coordination mechanisms]({{< ref "ai-engineering/agents/environment/coordination-mechanisms" >}})). Agents depend on this record the most, because a new agent session starts without memory of earlier ones.

A simple test for size: if the result can't be reviewed as one pull request, the task is a program, and its first task is Plan a change.

| Program | Tasks of reviewable size it usually breaks into |
| :--- | :--- |
| **Implement a large feature** | Frame a problem, write a design document, plan a change, several Implement a feature tasks behind a feature flag, add monitoring, deploy or roll out a change |
| **Migrate to another framework or language** | Plan a change, add tests to existing code, refactor to separate the part being moved, make a change across many call sites, deploy in stages, remove dead code |
| **Migrate a database schema or data** | Write a design document, then separate deploys: add the new schema next to the old one, write to both, copy the old data, switch reads to the new schema, and remove the old schema |
| **Change an API that other teams use** | Write a design document, add the new version, move each caller (one task per caller), remove the old version |
| **Remove a feature or service** | Analyze the impact of a change, notify the users, remove the callers, remove dead code, migrate or delete the data |
| **Upgrade a major version of a framework** | Upgrade a dependency, make a change across many call sites, fix flaky tests that the upgrade exposed, deploy or roll out a change |
| **Set a standard for the team** | Write a design document, add a check, make a change across many call sites to bring existing code in line |

## Views of Task Types


The groups above sort task types by what each task starts from and what it produces. The same task types can be sorted from other points of view. Each view answers a different question, and people in different roles usually think in one of them: a product manager asks what users get, an engineer asks whether behavior changes, and an architect asks which property of the system changes. One task can fall into different categories in different views. Speeding up a slow page is a feature in the product view if users asked for it, keeps the functions the same in the behavior view, and changes performance efficiency in the architecture view.

### Product View: What Users and the Business Get


Kersten's Flow Framework sorts all work on a software product into four kinds: features, defects, risks, and debts. ([Kersten 2018](#kersten-2018)) Cagan separates product discovery, which decides what to build, from delivery, which builds it. ([Cagan 2018](#cagan-2018)) This view adds discovery as a fifth category, because several task types produce knowledge for a decision and change nothing users see. [Engineering Activities]({{< ref "ai-engineering/agents/sdlc/activities" >}}) uses the same split between discovery and delivery.

The last column gives the closest category from software maintenance. Swanson sorted maintenance work into corrective (fixing defects), adaptive (responding to changes in the environment), and perfective (improving performance or maintainability). ([Swanson 1976](#swanson-1976)) The ISO/IEC/IEEE 14764 standard adds preventive maintenance: fixing problems before they cause failures. ([ISO/IEC/IEEE 2006](#iso-2006-14764)) The two classifications mostly agree, so this note keeps them in one table.

| Category | What it gives | Task types | Closest maintenance category |
| :--- | :--- | :--- | :--- |
| **Feature** | New value for users: something they can do that they couldn't do before | Implement a feature, make a small specified change, implement a property and check it with a run, improve accessibility, change an API that other teams use (when the new version adds something callers need) | New development; perfective when it extends a system already in use |
| **Defect** | A repair of something users were promised and didn't get | Fix a bug, ship a hotfix, revert a change, respond to an incident, write a postmortem | Corrective |
| **Risk** | A lower chance of a security, legal, or availability problem | Fix a security vulnerability, audit code for one concern, respond to a deprecation, upgrade a dependency, harden failure handling, add monitoring, plan capacity | Adaptive or preventive |
| **Debt** | Faster, safer, or cheaper later work; users see no change | Refactor, remove dead code, make a change across many call sites, migrate to another framework or language, add tests to existing code, fix a flaky test, fix a broken build, add a check, write or update documentation, update project instructions, set up the development environment, remove a feature or service, reduce running cost, set a standard for the team, decide who may do which task types | Perfective or preventive |
| **Discovery** | Knowledge for a decision about what to build | Investigate a problem, compare options, spike or prototype, frame a problem, estimate a change, write or revise a design document, decide whether to build or buy, take stock of technical debt | None |

Some task types land in different categories depending on why they are done. Improving performance is a feature when users asked for it and debt when it only lowers cost. A database migration is a feature when it supports new behavior and debt when it cleans up old data. Other task types have no category of their own in this view, because they serve another task: understanding a codebase, answering a question, finding a root cause, analyzing the impact of a change, planning, reviewing, preparing a release, and deploying. They count toward the feature, defect, risk, or debt they serve.

### Behavior View: What Happens to the Software's Behavior


This view asks what a user or a calling program would observe after the change. Functional behavior is what the software does. Non-functional behavior is how well it does it: how fast, how safely, at what cost, and how it fails.

| Category | Task types |
| :--- | :--- |
| **Adds behavior** | Implement a feature, implement a property and check it with a run, make a small specified change, add monitoring (behavior for operators), change an API that other teams use (a new version of the contract) |
| **Corrects behavior to match what was intended** | Fix a bug, ship a hotfix, fix a security vulnerability, revert a change, fix a flaky test, respond to an incident |
| **Removes behavior** | Remove a feature or service, and the last step of changing an API that other teams use, when the old version is removed |
| **Changes how well the software works, with the same functions** | Improve performance, harden failure handling, improve accessibility, reduce running cost |
| **Keeps behavior the same** | Refactor, remove dead code, make a change across many call sites, migrate to another framework or language, upgrade a dependency, respond to a deprecation, migrate a database schema or data, change infrastructure, add tests to existing code, add a check |
| **Changes no shipped code** | All the tasks in Understanding the Code and the System and in Framing and Planning (a spike writes code and then throws it away), all the review tasks, write a postmortem, write or update documentation, decide whether to build or buy, take stock of technical debt, review a design, plan capacity |
| **Changes the setup around the code** | Fix a broken build or CI run, update project instructions, set up the development environment, prepare a release, deploy or roll out a change, set a standard for the team, decide who may do which task types |

The category decides what verification has to show. A task that adds or corrects behavior needs a test that fails before the change and passes after it. A task that removes behavior needs evidence that nobody depends on it anymore. A task that keeps behavior the same needs evidence that nothing changed: the existing tests pass, outputs before and after match, or production traffic shows no difference. A task that changes how well the software works needs a measurement before and after. The border between adding and correcting depends on what was intended, which is a product question: a user may report a missing behavior as a bug, and the product owner may decide it's a feature.

### Architecture View: What Part of the System the Task Changes


An architect looks at a task by asking what it changes in the system: its functions, its quality attributes, its structure, or the shared understanding of it. A quality attribute is a measurable property of the whole system, such as speed or security. Requirements for quality attributes are often called non-functional requirements. The 2011 version of ISO/IEC 25010 lists eight quality characteristics: functional suitability, performance efficiency, compatibility, usability, reliability, security, maintainability, and portability. ([ISO/IEC 2011](#iso-2011-25010)) The first seven rows of the table use these characteristics.

| What the task changes | Task types |
| :--- | :--- |
| **Functions** (functional suitability) | Implement a feature, fix a bug, ship a hotfix, make a small specified change, implement a property and check it with a run, remove a feature or service |
| **Performance efficiency** (including use of resources) | Improve performance, reduce running cost, plan capacity |
| **Reliability** | Harden failure handling, add monitoring, respond to an incident, fix a flaky test |
| **Security** | Fix a security vulnerability, audit code for one concern |
| **Usability** | Improve accessibility |
| **Compatibility and portability** | Upgrade a dependency, respond to a deprecation, migrate to another framework or language |
| **Maintainability** | Remove dead code, add tests to existing code, add a check, write or update documentation, set a standard for the team, take stock of technical debt |
| **Structure: modules, boundaries, and dependencies** | Refactor, make a change across many call sites, migrate to another framework or language, change an API that other teams use, plan a change |
| **Data and deployment** | Migrate a database schema or data, change infrastructure, deploy or roll out a change, set up the development environment |
| **Knowledge of the architecture** | Understand a codebase or a part of it, answer a question about the code, analyze the impact of a change, compare options, spike or prototype, write or revise a design document, review a design, decide whether to build or buy |

A task that changes a quality attribute needs a stated target, such as a latency limit or a list of failures the system must survive, and a way to measure it. Without the target there is no way to tell when the task is done. A task that changes structure usually serves maintainability, and it often comes with a decision record, so later readers know why the structure is the way it is.

#### Quality Attributes a Task Can Damage Without Naming Them


The table above shows the attribute a task sets out to change. Much of the risk sits in the attributes a task doesn't name. A feature task can add a dependency nobody chose, skip logging, or add a third way of doing something the code already does twice. Each task makes choices that look reasonable on their own, and the design wears away over many tasks. Agents make this faster, because they produce more changes and copy the patterns they find in the repository ([Problems]({{< ref "ai-engineering/agents/problems/problems" >}}), problems 82 and 83). A refactor can do the same harm as a feature, so these checks apply to every task type that ends in a code change, whoever made it.

| Attribute | How a change damages it when nobody decided to | Standing check |
| :--- | :--- | :--- |
| **Maintainability** | A new pattern for something the code already does, an abstraction nobody needed, or a bad pattern copied from nearby code (problems 11, 82, 84) | Review against the team's standards; lint rules for known patterns; a limit on the size of a diff |
| **Structure** | One module calls into another module's internals, or a boundary is crossed because it was convenient (problem 83) | Rules for which modules may import which, checked in CI |
| **Dependencies** | A new library appears without a decision (problem 86) | CI fails when the list of dependencies changes, unless the pull request says why; license and vulnerability scans |
| **Observability** (part of reliability) | New code paths have no logs, metrics, or alerts (problem 87) | A review item for new endpoints and jobs; a test that the key log line or metric is emitted |
| **Reliability** | Calls without timeouts, retries without limits, or errors that are caught and ignored | Lint rules for empty error handlers; review of every new call to another service |
| **Security** | Secrets in code or logs, missing checks on input, or wider permissions (problems 88 and 89) | Secret scanning; static analysis; a person reviews every change to authentication, permissions, and money |
| **Performance** | Database queries inside loops, whole tables loaded into memory, or work repeated on every request | Benchmarks or query counts on the paths that must stay fast |
| **Product decisions** | Defaults, behavior in edge cases, and error messages decided in the code without the product owner (problem 10) | The pull request description lists the decisions the change made, so the product owner can see them |
| **Documentation** | Docs no longer match the code, or generated docs nobody checked (problem 85) | Docs change in the same pull request as the behavior; a check that runs the examples in the docs |

### Output View: What a Task Produces and How It's Checked


The kind of output decides how someone can tell whether the result is good. The check is the same whoever did the work. A team may check more of the results of a participant without a track record on the type, such as a new agent role or a new team member, but it checks them the same way. [Reasoning Log: Evaluating Engineering Work with Agents]({{< ref "ai-engineering/agents/evaluation/logs-evaluation" >}}) asks what a good result is for one kind of task; this view gives the first part of the answer.

| Output | How it's checked | Task types |
| :--- | :--- | :--- |
| **An answer or a finding** | Each claim points to code, logs, or a check that supports it, and a person can follow the evidence | All the tasks in Understanding the Code and the System, take stock of technical debt |
| **A document** | The owner reads it and accepts it or asks for changes | Frame a problem, write or revise a design document, plan a change, estimate a change, write a postmortem, write or update documentation, decide whether to build or buy, plan capacity, set a standard for the team |
| **A code change** | Tests, checks, and review | The tasks in Changing Behavior, Changing Structure Without Changing Behavior, Improving Properties of the System, and Tests, Builds, and Checks, most tasks in Keeping the System Current, reduce running cost |
| **A judgment of other work** | A person decides whether to accept the judgment, and each finding can be checked against the code | All the review tasks, review a design |
| **An action on a running system** | Someone with authority approves it first, and signals after the action show whether it worked | Deploy or roll out a change, respond to an incident, migrate a database schema or data, change infrastructure, revert a change, the last steps of removing a feature or service and of changing an API that other teams use |
| **A change to the setup** | A later task goes better with the change | Update project instructions, set up the development environment, add a check, decide who may do which task types |

An action on a running system is a [commitment point]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}): it has an effect outside the workspace, and it may not be possible to undo.

### Comparing the Views for Common Task Types


| Task type | Product | Behavior | Architecture | Output |
| :--- | :--- | :--- | :--- | :--- |
| **Implement a feature** | Feature | Adds | Functions | Code change |
| **Fix a bug** | Defect | Corrects | Functions | Code change |
| **Respond to an incident** | Defect | Corrects | Reliability | Action on a running system |
| **Fix a security vulnerability** | Risk | Corrects | Security | Code change |
| **Improve performance** | Feature or debt | Changes how well it works | Performance efficiency | Code change |
| **Refactor** | Debt | Keeps | Structure | Code change |
| **Upgrade a dependency** | Risk or debt | Keeps | Compatibility | Code change |
| **Migrate a database schema or data** | Feature or debt | Keeps | Data and deployment | Action on a running system |
| **Add tests to existing code** | Debt | Keeps | Maintainability | Code change |
| **Remove a feature or service** | Debt | Removes | Functions | Code change, then action on a running system |
| **Change an API that other teams use** | Feature or debt | Adds, then removes | Structure | Code change, then action on a running system |
| **Understand a codebase** | Serves other work | No shipped code | Knowledge | Answer |
| **Find a root cause** | Serves a defect | No shipped code | Knowledge | Finding |
| **Spike or prototype** | Discovery | No shipped code | Knowledge | Answer |
| **Review a pull request** | Serves other work | No shipped code | The part the change touches | Judgment |

## Delegation Profiles


A delegation profile says how far a participant who takes a task of this type may go without someone else's approval, and what evidence they give. The default in the table is for a participant without a track record on the type in this project: an agent role the team has just started to use, a new team member, or an outside contributor. The levels come from [Participants and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}): the participant can observe, suggest, prepare a result for someone else to apply, act after someone approves, or act and report. That note defines the levels for agent roles, and they fit people as well: a new team member prepares changes for review before they get the right to merge.

The level in the table applies at the step where the work becomes shared or has an effect. For a code change, that step is the merge: at the level "prepare", the participant opens a pull request and someone with merge authority merges it. For an action on a running system, the step is the action itself. For an answer or a finding, the step is when someone uses it for a decision: at the level "act and report", the participant gives the answer and the person who asked reads it.

The evidence doesn't depend on who did the work. A person who fixes a bug owes the same failing test as an agent does. What differs between participants is their track record on the type, which sets the level, and accountability, which always stays with a person: when an agent commits a result, the person who granted the permission or started the session answers for it.

Two properties of a task type set its default level:

- **How checkable the result is.** High: tests, a measurement, or a script can show that the result is right. Medium: checks cover part of it, and a person judges the rest. Low: only a person with context, or the passage of time, can judge it.
- **Whether it can be undone.** Yes: reverting a commit or discarding the output undoes it. Partly: undoing takes extra work, or other people have already acted on the result. No: the effect stays, for example changed data or a removed service that users relied on.

| Task type | How checkable | Can be undone | Default level | Evidence the participant gives |
| :--- | :--- | :--- | :--- | :--- |
| **Understand a codebase or a part of it** | Medium | Yes | Act and report | A file reference for each claim, and a list of the parts not read |
| **Answer a question about the code** | High | Yes | Act and report | File and line references |
| **Investigate a problem** | Medium | Yes | Act and report | The finding, the evidence, and what remains unknown |
| **Find a root cause** | Medium | Yes | Act and report | The hypotheses, the check that ruled each one in or out, and a reproduction |
| **Analyze the impact of a change** | Medium | Yes | Act and report | The affected places, how each was found, and what wasn't searched |
| **Investigate run records or logs** | High | Yes | Act and report | Quotes from the records that support the explanation |
| **Compare options** | Low | Yes | Suggest | The criteria, a source for each claim, and a recommendation |
| **Spike or prototype** | High | Yes | Act and report | The answer, the code, and how it was run, with the code kept off the main branch |
| **Frame a problem** | Low | Yes | Prepare | The brief, open questions, and current behavior checked in the code |
| **Write or revise a design document** | Low | Partly | Prepare | The options, the decisions, the open questions, and which claims were checked against the code |
| **Plan a change** | Medium | Yes | Prepare | Steps that can each be reviewed as one pull request, with a check for each |
| **Estimate a change** | Low | Yes | Suggest | The size, the assumptions, and the unknowns with the most risk |
| **Implement a feature** | Medium | Partly | Prepare | Tests for the new behavior, the decisions made in the code, and what was left out |
| **Fix a bug** | High with a reproduction | Yes | Prepare | A test that fails before the fix and passes after it, the cause, and nearby cases checked |
| **Make a small specified change** | High | Yes | Prepare | A diff limited to what was asked |
| **Ship a hotfix** | Medium | Partly | Prepare; the deploy is act after approval | A signal that shows the harm stopped, and a recorded task for the full fix |
| **Revert a change** | High | Partly | Act after approval | What the revert undoes, including data and configuration |
| **Implement a property and check it with a run** | High | Yes | Prepare | The run and its output |
| **Refactor** | High when tests cover the code | Yes | Prepare | Tests pass before and after, and the steps are small |
| **Remove dead code** | Medium | Yes | Prepare | The search for callers, references in configuration, and traffic data |
| **Make a change across many call sites** | High | Yes | Prepare | The script, the number of sites changed, and a lint rule against the old form |
| **Migrate to another framework or language** | Medium | Partly | Prepare, for each step of the program | The evidence for each step's own task type |
| **Improve performance** | High | Yes | Prepare | A measurement before and after under the same load |
| **Fix a security vulnerability** | Medium | Yes | Prepare, with a person's detailed review | A test or check that shows the weakness is closed |
| **Harden failure handling** | Medium | Yes | Prepare | Tests that cause the failure and show how the system handles it |
| **Add monitoring** | Medium | Yes | Prepare | The signal seen in a test or staging environment, and the alert thresholds |
| **Improve accessibility** | Medium | Yes | Prepare | Results of automated accessibility checks and of a manual check with a keyboard or screen reader |
| **Upgrade a dependency** | High for small versions, medium for major versions | Yes | Prepare; act and report for patch versions when all checks pass | The release notes read, the changes in behavior that affect the project, and passing tests |
| **Respond to a deprecation** | Medium | Yes | Prepare | The uses found and what replaces each one |
| **Migrate a database schema or data** | Medium | No | Prepare; someone with authority runs the migration | A rollback plan or a decision that there isn't one, a trial run on a copy of the data, and row counts before and after |
| **Change infrastructure** | Medium | Partly | Prepare; someone with authority applies the change | The planned changes to resources, and the steps to roll back |
| **Add tests to existing code** | Medium | Yes | Prepare | Tests that fail when the code is broken on purpose |
| **Fix a flaky test** | Medium | Yes | Prepare | The cause, and many runs in a row that pass |
| **Fix a broken build or CI run** | High | Yes | Prepare | The cause and a passing run |
| **Add a check** | Medium | Yes | Prepare | Examples the check catches, and its false alarms on existing code |
| **Review a pull request** | Medium | Yes | Suggest | Findings with file and line, each with an input that shows the problem |
| **Review work done without supervision** | Medium | Yes | Suggest | Whether the task was done as asked, and the findings |
| **Audit code for one concern** | Medium | Yes | Act and report | Findings with evidence, and the parts checked and not checked |
| **Prepare a release** | High | Yes | Prepare | Release notes linked to the changes, and passing checks |
| **Deploy or roll out a change** | High | Partly | Act after approval | The signals watched and the conditions for rolling back |
| **Respond to an incident** | Medium | Partly | Suggest; the person on call acts | A timeline, what was seen, and possible fixes with the risk of each |
| **Write a postmortem** | Low | Yes | Prepare | A timeline with sources, the causes, and follow-up tasks |
| **Write or update documentation** | Medium | Yes | Prepare | Each statement checked against the code, and examples that run |
| **Update project instructions** | Low | Yes | Prepare | The case that led to the change, and how to tell whether it helps |
| **Set up the development environment** | High | Yes | Prepare | A clean machine or container where the steps worked |
| **Change an API that other teams use** | Medium | Partly | Prepare for each step; removing the old version is act after approval | The list of callers and the plan for versions |
| **Remove a feature or service** | Medium | No, once data is deleted | Prepare; deleting data is act after approval | Usage data that shows nobody depends on it |
| **Reduce running cost** | High | Yes | Prepare | Cost before and after, and service levels that held |
| **Decide whether to build or buy** | Low | Partly | Suggest | The total cost, the risks, and the way out |
| **Set a standard for the team** | Low | Partly | Suggest | The standard, the existing exceptions, and the checks |
| **Take stock of technical debt** | Medium | Yes | Act and report | Each item with its cost of keeping and cost of fixing, and how each cost was estimated |
| **Review a design** | Low | Yes | Suggest | Findings, and failure modes the design doesn't cover |
| **Plan capacity** | Medium | Yes | Suggest | Current load, the growth assumed, and the date capacity runs out |
| **Decide who may do which task types** | Low | Yes | Suggest; only a person decides | Cases and measurements for each task type |

### Adjusting the Level for One Task


Task type is only one input. Two bug fixes can differ more than a bug fix and a refactor: a typo in a message and a race condition in payments share a task type and need different levels. The properties of one task move the default up or down:

- **Lower the level, or require a person's detailed review, when the task touches** authentication, permissions, money, security, personal data, or deletes data. [Project Ownership]({{< ref "ai-engineering/agents/project-ownership" >}}) lists the same areas.
- **Lower the level when the goal is unclear.** Start with Frame a problem, and assign the framed task.
- **Lower the level when the task touches many modules,** another team's code, or a contract other systems rely on.
- **Lower the level when the context the task needs isn't written down.**
- **Raise the level only with evidence:** the same participant or agent role did earlier tasks of the same type in the same project well, as measured in the next section, and checks would catch the usual mistakes. A participant's own confidence doesn't raise the level, for an agent or for a person.

These rules follow the factors in [Participants and Processes]({{< ref "ai-engineering/agents/sdlc/participants-and-substrates" >}}) and the rule for scaling depth in [Features of a Good Approach]({{< ref "ai-engineering/agents/sdlc/approach" >}}): consequence, uncertainty, and reversibility.

## Recording and Measuring by Task Type


Task types become useful for decisions once each piece of work is labeled with its type. The label goes where the work is already recorded:

- **The ticket,** when the task is framed.
- **The case record,** as its first field, when the task is studied as a case in the [Bottom-Up Approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}).
- **The pull request,** as a label or a line in the description, together with who did the work: a person, an agent role, a person with an agent, or an automated tool.

The team should use one set of labels, taken from the task type names in this note, and change the set when cases show a type should be merged or split. Commit types such as `feat` and `fix` are too coarse to replace these labels.

With the labels in place, these measures can be counted per task type:

- The number of tasks of each type.
- Time from the start of the task to the merge.
- Time a person spent on the task, in steering and in review.
- Rework: later changes to the same code to fix what the task got wrong.
- Defects and incidents traced back to tasks of the type.
- Review comments per change.
- Cost in model tokens, for tasks that agents took part in.
- The share of tasks finished without someone else taking over.
- The share of all work in each product category: feature, defect, risk, debt, and discovery. The Flow Framework calls this flow distribution. ([Kersten 2018](#kersten-2018))

Each measure can be counted separately for work by people, by agents, and by people with agents, on the same task type. That comparison is the most direct way to tell whether agents help with a type. Labeling the work people do today, before agents take a type over, gives the baseline that is usually missing.

Some limits apply. Few teams have many tasks of one type, so a pattern in a handful of cases may be chance (problem 55). The same task run twice can give different results (problem 51). Start with two or three task types that come up often, and compare only within a type.

## Problems Task Types Help With


The numbers refer to [Problems]({{< ref "ai-engineering/agents/problems/problems" >}}).

| Problem | How task types help |
| :--- | :--- |
| Nobody has written down what a good result is for a kind of task, and goals such as "handle tickets better" can't be checked (1, 3) | A definition of done for each type, and the verification rule from the behavior view |
| The developer doesn't know which tasks to give the agent (64), and nobody has decided how far agents may go without a person (66) | A delegation profile for each type, adjusted by the risk of one task |
| Diffs are too large to review, and checking takes as long as doing the work (22, 23, 41) | Programs broken into tasks that each fit one pull request, and review effort set by type: a change that keeps behavior and shows it gets a lighter review than new behavior in a risky area |
| A change to the setup helps one kind of task and hurts another, and tasks don't repeat (50, 53) | Task type as the unit for comparing cases and for evaluating changes to the setup |
| Nobody can say whether the team ships faster, management wants a number, and token costs can't be connected to results (59, 60, 62) | The measures in Recording and Measuring by Task Type, counted per type, and the share of work in each product category |
| Estimates stopped working (81) | How much the time varies within each type shows which types are predictable |
| The design wears away over many sessions, and dependencies and missing logs appear without a decision (82, 83, 86, 87) | Standing checks for the quality attributes a task doesn't name |
| Nothing marks which changes an agent made, so later bugs can't be connected to them (34) | The label on the pull request, with who did the work |
| Nobody recorded how long tasks took or how many bugs there were before agents, so there's nothing to compare with (61) | Labels on work done by people give a baseline, and the same measures compare people and agents on the same type |

## References


- Cagan, M. (2018). Inspired: How to Create Tech Products Customers Love. Second edition. Wiley. ^cagan-2018
- Conventional Commits. [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). ^conventional-commits
- ISO/IEC (2011). ISO/IEC 25010:2011 Systems and Software Engineering -- Systems and Software Quality Requirements and Evaluation (SQuaRE) -- System and Software Quality Models. ^iso-2011-25010
- ISO/IEC/IEEE (2006). ISO/IEC 14764:2006 Software Engineering -- Software Life Cycle Processes -- Maintenance. ^iso-2006-14764
- Kersten, M. (2018). Project to Product: How to Survive and Thrive in the Age of Digital Disruption with the Flow Framework. IT Revolution. ^kersten-2018
- Swanson, E. B. (1976). The Dimensions of Maintenance. Proceedings of the 2nd International Conference on Software Engineering, 492-497. ^swanson-1976
