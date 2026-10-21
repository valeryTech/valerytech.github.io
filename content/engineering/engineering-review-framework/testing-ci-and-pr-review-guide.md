---
draft: false
toc: true
description: "Combine tests, CI, author preparation, and human review to assess software changes, with clear expectations and evidence from executed checks."
title: "Testing Ci And Pr Review Guide"
linkTitle: "Testing Ci And Pr Review Guide"
---
# Testing, CI, and PR Review Guide

## Purpose


Describe how testing, continuous integration (CI), and pull request (PR) review support the Engineering Review Framework. This note provides broad guidance; repository commands, required jobs, and approval rules remain in project documentation.

## Why these activities belong together


Tests exercise selected behavior. CI runs configured checks in a shared workflow. PR review brings the problem, implementation, results, and remaining uncertainty into one discussion.

Use these activities together when deciding whether a change is ready. A successful CI run shows that the checks it actually ran passed. The review still needs to consider missing requirements, gaps in coverage, and design decisions outside those checks.

## Testing


Choose tests according to the behavior and risk involved. The supporting reference list includes unit, integration, contract, and end-to-end tests, along with performance, security, and recovery checks where relevant.

Base expected results on the requirements and supported behavior. Include useful regression coverage for a bug fix and relevant boundary or failure cases for new behavior. Review test expectations, setup, and assertions as part of the change. Google's guidance treats test validity and maintainability as review concerns in their own right.[1]

A test suite does not need every test type for every change. Use a combination that can establish the important behavior without unnecessary duplication or fragile setup. Numerical quality targets belong to the [Requirements and Quality Targets]({{< ref "engineering/engineering-review-framework/requirements-and-quality-targets" >}}) note and the project's requirements.

[Independent verification]({{< ref "engineering/engineering-review-framework/backward-design-and-independent-verification" >}}#2-design-verification-independently) derives expected behavior, reliability properties, and consequential failure scenarios separately from the proposed implementation. It distinguishes deciding what to verify from making those checks executable with real system knowledge.

### Can the tests detect a defect?


Ask what plausible implementation mistake an important test would catch. Inspect whether its setup reaches that behavior and its assertions distinguish the correct result from the mistake. For a bug fix, demonstrate that the regression test fails before the fix and passes afterward where practical. A targeted faulty variant can also expose weak checks; use this when it helps resolve uncertainty about test strength.

### Comparing existing and proposed behavior


For refactoring and compatibility changes, run the same relevant scenarios against both versions. Compare outputs and consequential effects such as stored state, emitted events, external calls, and errors. Keep inputs, initial state, and operating conditions comparable, and identify which differences the change permits.

Existing behavior provides a baseline for what should remain compatible. Judge differences against the intended contract: a known bug should not become a requirement merely because it exists in the older version.

## Continuous integration


Keep routine checks automated where practical: building, formatting, linting, type checking, tests, and relevant security or dependency checks. Add specialized checks where the project needs them, such as migration validation or performance regression testing.

Make results clear. Distinguish passed checks, failed checks, skipped work, and work that could not run because its environment was unavailable. Results used for approval should match the revision being reviewed. A change to tests or CI configuration deserves review alongside the application code it affects.

Detailed job configuration and merge rules remain project-specific. This framework does not prescribe universal coverage percentages, timing limits, or a fixed CI pipeline.

## Author preparation


Review the complete change before requesting review. Keep the PR focused, explain its purpose and scope, and link to relevant context and requirements. Summarize the checks actually performed and any remaining limitations.

Record important decisions and risks when they help explain the implementation. Google's guidance on change descriptions emphasizes explaining both the change and its rationale.[2] Existing tickets or design notes can supply the detail without being copied into the PR.

Keep changes small enough to understand while preserving a coherent, working change. Google's guidance on small changes includes self-contained changes with related tests.[3]

## Reviewer guidance


Begin with the problem, requirements, and intended scope. Use the main checklist and relevant reference lists to orient the review, then examine the implementation and its supporting results. Follow important behavior into related code when needed.

Use the engineering principles to discuss design choices. Use technical guides and specialist reviewers for areas requiring additional expertise. Treat automated comments as findings to assess; the presence or absence of comments is not a complete review result.

## Discussion and completion


Explain the consequence of a requested change. Distinguish correctness, security, compatibility, and agreed requirements from optional improvements. Google's review standard prioritizes technical reasoning and code health while allowing reasonable design choices.[4]

Resolve issues that block acceptance, make unresolved requirements and verification gaps visible, and use the project's existing process for accepted follow-up work. Revisit affected results after substantive revisions. The project determines who can approve the change and accept remaining risk.

## References


External references checked on 2026-10-20. The workflow guidance above is a recommendation for this framework.

[1] Google Engineering Practices, [What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html).

[2] Google Engineering Practices, [Writing good CL descriptions](https://google.github.io/eng-practices/review/developer/cl-descriptions.html).

[3] Google Engineering Practices, [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html).

[4] Google Engineering Practices, [The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html).

## Related notes


- [Test Strategy Foundations and the Practical Test Pyramid]({{< ref "engineering/topics/tests/test-strategy-foundations" >}}) -- choosing test scope, separating acceptance criteria from test levels, and balancing speed, realism, and diagnosability.
- Verification-engineering investigation -- plausible defects that could escape the current tests.
- Review-flow experiments -- comparing observable behavior across system versions.

## Related documents


[Engineering Review Framework]({{< ref "engineering/engineering-review-framework/engineering-review-framework" >}}) · [Review Reference Lists]({{< ref "engineering/engineering-review-framework/review-reference-lists" >}}) · [Technical Review Guide]({{< ref "engineering/engineering-review-framework/technical-review-guide" >}}) · [LLM-Specific Review Guide]({{< ref "engineering/engineering-review-framework/llm-specific-review-guide" >}}) · [Review Agents, Skills, and Tools]({{< ref "engineering/engineering-review-framework/review-agents-skills-and-tools" >}})
