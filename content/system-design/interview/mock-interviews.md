---
draft: false
toc: true
title: "Reviewing Mock System Design Interviews"
description: "A method for reviewing mock interviews, with observations and questions about framing, design completeness, concurrency, trade-offs, quantification, and collaboration."
document_status: "canonical"
linkTitle: "Mock Interview Review"
---

Review an attempt to identify what to practice next. Separate what the candidate did, what the interviewer asked, and your interpretation of the effect.

## Review method


1. Attempt the problem before watching the reference solution.
2. Note the scope, assumptions, main flows, and decisions made during the interview.
3. Identify where the candidate completed the design, changed direction, became stuck, or left a critical issue unresolved.
4. Review the technical reasoning and the collaboration separately.
5. Choose one or two issues to practice, then repeat the relevant part of the design.

## Questions to ask


| Area | What to examine |
| --- | --- |
| Problem framing | Was the core user need identified? Were assumptions and scope checked? |
| Design | Was there a complete flow? Did the API, data, and components fit together? |
| Trade-offs | Were alternatives compared against actual requirements? Was a decision made? |
| Technical depth | Was the central concurrency, consistency, or scaling problem resolved? |
| Quantification | Did the numbers affect a decision? Were units and implications clear? |
| Collaboration | Did the candidate invite feedback and respond to prompts? |
| Pacing | Were low-level details deferred until the core design was complete? |

Use the [practice rubric]({{< ref "system-design/sd-signals-openai" >}}) for a more detailed review. Treat the interpretation of a single interview as an observation rather than proof of a level or universal hiring criterion.

## Observations from earlier mocks


The original notes discuss a global-counter exercise and a promotional-code exercise.

- Clarifying how work is assigned, and comparing one-region with cross-region behavior, can expose important design choices.
- Introducing a Bloom filter early can distract from the core problem when its purpose has not been established.
- Identifying a race condition is only a starting point; the design still needs to explain how concurrent operations behave.
- For the promotional-code design, identifying the campaign as the key feature helped focus the discussion.
- Assumptions such as "one account per user" should be stated explicitly.
- A synchronous versus asynchronous API decision should explain both technical consequences and the user experience, with room for interviewer feedback.
- Anti-abuse controls, such as rate limiting, should be connected to the relevant flow.
- Writing down the discussion and checking agreement at milestones helps keep the shared design clear.
- Explaining the API and schema alongside an end-to-end flow can keep the discussion connected.

## Recurring technical questions


Each problem has a central puzzle. The earlier examples include push versus pull for live comments, photo storage and processing for Instagram, matching riders and drivers, and handling spikes.

Topics to revisit across cases:

- Push/pull, acceptable delay, update frequency, and workload.
- Fan-out on read versus fan-out on write, including celebrity traffic spikes.
- Coordination, communication, cache invalidation, and consistency models.
- Bloom versus cuckoo filters when a probabilistic filter solves a stated problem.
- SQL/NoSQL, caching, and synchronous/asynchronous choices in the specific context.

## Source material


- [Global-counter mock](https://www.youtube.com/watch?v=V1HlNh4IhUo).
- [Distributed-counter design discussion](https://systemdesign.one/distributed-counter-system-design/).
- [Fan-out under celebrity traffic spikes](https://codemia.io/blog/path/Re-evaluating-Fan-Out-on-Write-vs-Fan-Out-on-Read-Under-Celebrity-Traffic-Spikes-2025).
- [Consistency-model overview](https://www.scylladb.com/glossary/consistency-models/).
- [Original dated observations]({{< ref "system-design/archive/mock-interview-observations-v0" >}}).

Additional mock videos collected in the preparation notes:

- [interviewing.io](https://www.youtube.com/watch?v=mQgKAK7y11s).
- [TryExponent](https://www.youtube.com/watch?v=iyLqwyFL0Zc).
- [Hello Interview](https://www.youtube.com/watch?v=tgSe27eoBG0).
- [Additional mock](http://youtube.com/watch?v=PI0yGBT9LHo).
- [Vsevolodovich](https://www.youtube.com/watch?v=JWc8L2cCnJI).
