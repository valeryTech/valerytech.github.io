---
draft: false
toc: true
title: "Working with a Coding Agent"
description: "A practical coding-agent workflow separating building, explaining, and checking a change, with focused investigations, lightweight records, and explicit decision ownership."
lastmod: "2026-10-19"
linkTitle: "Working with a Coding Agent"
---

A coding agent can help investigate a problem, suggest designs, write code, run tests, and prepare a change for review. The workflow should help engineers understand what was done and decide whether to accept it.

Start with the work the team already does. Add instructions, tools, or automation where they help with a recurring problem. A particular plugin or framework is not required.

## Keep the work understandable


There are three jobs:

- **Build the change:** understand the problem, choose an approach, implement it, and check the result.
- **Explain what matters:** connect the requirements, important decisions, code, and test results so someone else can review them.
- **Review the result:** check the assumptions and behavior rather than simply accepting the author's explanation.

The same people and tools may help with all three. Keep enough separation that review can find mistakes made during development.

## Follow a simple loop

```text
Define the change
    -> resolve important open questions
    -> choose a design
    -> implement
    -> test and review
    -> decide whether to merge
    -> deploy, observe, and adjust
```


These steps can overlap. Writing code may reveal a design problem. Review may uncover an unclear requirement. Return to the affected decision and update the work that depends on it.

For a small fix, most of this may fit in an issue and PR. A larger change may need design notes, measurements, or a rollout plan.

## Keep a few useful records


Record what helps the next person understand the change:

- the problem, expected behavior, and scope;
- important design choices and why they were made;
- code, configuration, and migration changes;
- what was tested, what happened, and what was not checked;
- review findings and the next decision.

Reuse existing issues, PRs, tests, and design documents. Avoid creating a long document for every small change.

## Give investigations a clear question


Instead of asking an agent to "explore the architecture," ask a question such as:

> Can the current worker recover a submitted job after restarting?

Include the relevant context, what would change based on the answer, where the agent may run checks, and how much time to spend. Ask it to return the observations, useful files or logs, and anything the check could not establish.

A small prototype may help test the idea. The libraries and settings used to make that prototype run do not automatically become production choices.

## Be clear about decisions and permissions


An agent can maintain the plan, suggest an approach, or run an approved check. Give it enough direction to proceed without repeatedly asking about routine details.

Important product choices, changes to the agreed design, and permission to merge or release still need a clear owner. When the agent reaches a decision outside its assignment, it should explain the options and ask for that decision.

## Check whether the workflow helps


Look at the resulting changes and the effort needed to understand and review them. Watch for missed bugs, incorrect findings, repeated mistakes, unnecessary code, and expensive checks that do not help a decision.

Adjust the workflow around those problems. More generated code or longer documents do not by themselves mean better engineering.

Continue with [product framing]({{< ref "ai/system-evaluation/skill-product-framing-build" >}}), [system design]({{< ref "ai/system-evaluation/skills-hld-build" >}}), [the review process]({{< ref "ai/system-evaluation/review-flow-specification" >}}), and [testing during review]({{< ref "ai/system-evaluation/review-flow" >}}).
