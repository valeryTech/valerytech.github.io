---
draft: false
toc: true
title: "In"
linkTitle: "In"
---
I think the defensible position is narrower than "LLM code is crap," and it's stronger because it survives scrutiny:

> Current coding agents have clearly improved at producing locally correct code. There is still weak evidence that they can autonomously perform the full production software-engineering job.

That distinction is important.

A useful decomposition is:

1. **Code generation** -- produce a function, patch, test, migration, boilerplate.
2. **Repository task completion** -- understand enough of a codebase to fix a bounded issue and pass tests.
3. **Production software engineering** -- make the right change under incomplete requirements while preserving architecture, operability, security, maintainability, and future team velocity.
4. **System ownership** -- operate it for months, debug incidents, evolve requirements, migrate dependencies, pay down mistakes, and explain why the system is built that way.

We have increasingly strong evidence for 1 and 2.

I don't see strong evidence that 3 and 4 are solved.

And benchmarks systematically collapse those distinctions.

For example, a 2025 study modified SWE-bench tasks to make prompts resemble the much less complete requests developers actually give coding assistants. Performance for some models dropped by more than 50% relative to the formal benchmark prompts. ([arXiv](https://arxiv.org/abs/2510.08996?utm_source=chatgpt.com "Saving SWE-Bench: A Benchmark Mutation Approach for Realistic Agent Evaluation"))

Even the benchmark makers are struggling with validity. OpenAI stopped treating SWE-bench Verified as useful for frontier comparison because of contamination and flawed tests, and in July 2026 reported that roughly 30% of SWE-bench Pro tasks appeared broken. Those are vendor findings, so I wouldn't use them as capability evidence, but they're useful evidence that benchmark scores need substantial qualification. ([OpenAI](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/?utm_source=chatgpt.com "Why SWE-bench Verified no longer measures frontier coding capabilities | OpenAI"))

METR gives us another useful reality check. Their controlled 2025 experiment had experienced developers working on repositories they already knew; access to AI made them 19% slower, while the developers believed it had made them faster. Their 2026 follow-up suggests newer tools probably improved productivity, but METR explicitly says selection effects made the new estimate unreliable. ([Metr](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/?utm_source=chatgpt.com "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity - METR"))

That "felt faster / wasn't faster" discrepancy is exactly why anecdotes from enthusiastic engineers need discounting.

At the same time, I would also push back on the strongest anti-AI version of the argument. There isn't good evidence that AI-assisted code is universally unmaintainable garbage. A preregistered 2026 experiment with 151 participants, 95% professional developers, found no significant downstream maintainability or code-quality difference between code originally produced with and without AI assistance. AI-assisted participants also completed the initial task substantially faster. ([Springer](https://link.springer.com/article/10.1007/s10664-026-10889-1?utm_source=chatgpt.com "Echoes of AI: Investigating the downstream effects of AI assistants on software maintainability | Empirical Software Engineering | Springer Nature Link"))

So our methodology has to be adversarial in **both directions**.

The stronger test I'd use is something like a **production engineering test**:

|Question|Why it matters|
|---|---|
|Was the task underspecified?|Real requirements usually are.|
|Did the agent need architectural judgment?|Passing tests doesn't measure architecture.|
|Were important constraints hidden?|Production systems have many implicit constraints.|
|Was the change reviewed six months later?|Measures maintainability rather than immediate correctness.|
|Did somebody else inherit the code?|Tests transfer of understanding.|
|Were incidents and regressions tracked?|Measures operational consequences.|
|Was total review/rework time counted?|Generated-code volume can hide downstream cost.|
|Did it reduce total lead time?|"Typing faster" is irrelevant if delivery doesn't improve.|
|Did defects/security incidents change?|Measures actual production risk.|
|Could the team still explain the system?|Large volumes of generated code can create comprehension debt.|

That last one deserves much more attention.

Suppose an agent generates 15,000 lines in an afternoon, all tests pass, and the PR is merged.

A benchmark calls that success.

From the perspective of a production team, several unresolved questions remain:

```text
Who understands these 15,000 lines?

Did it introduce a second abstraction for something we already had?

Did it encode assumptions nobody noticed?

Will the next change work with this design?

Can someone diagnose it at 03:00 during an incident?

How much generated complexity will accumulate after 100 such changes?
```


Those are software-engineering questions. Most coding-agent evaluations barely touch them.

This also makes the **prototype versus production** distinction much sharper.

For prototypes, generating lots of code cheaply can be extremely valuable. The code may exist for three weeks. Architectural coherence has relatively low value. Rewrite cost is acceptable.

For production systems, every line becomes a liability somebody may need to understand, test, secure, migrate, monitor and eventually delete. The value function changes completely.

So I would add an explicit filter to our source methodology:

> **Does the speaker's evidence come from generating software, or from owning software after it was generated?**

That is probably one of the most useful anti-hype distinctions we can make.

Someone saying "we shipped an agent-built application in two days" is providing weak evidence.

Someone saying:

> "We let agents contribute to this service for 12 months. Here are defect rates, rollback rates, review time, change-failure rate, incident load, code churn and the results when another team inherited it."

would get my full attention.

And I currently see far less of the second category than the first.

## high signal(?)


Yes. After looking specifically for people who pass your filter, **Mitchell Hashimoto is probably the best current match**. **Daniel Stenberg is the best counterweight from long-lived production software.**

The important caveat: no individual engineer gives us "strong evidence" for an industry-wide claim. A practitioner gives a case study. What makes these two useful is that their case studies expose the artifacts and failure modes instead of asking us to trust their impressions.

### Mitchell Hashimoto


He currently builds and maintains Ghostty. This isn't a toy repo: Ghostty 1.3 represents six months of work, 180 contributors and 2,858 commits. ([Ghostty](https://ghostty.org/docs/install/release-notes/1-3-0?utm_source=chatgpt.com "1.3.0 - Release Notes"))

What makes him especially useful is that he published an unusually inspectable AI-coding case study: a non-trivial macOS update feature that was largely developed using an agent. He published the agent sessions, described his interventions, and the feature eventually shipped in Ghostty 1.3. ([Mitchell Hashimoto](https://mitchellh.com/writing/non-trivial-vibing?utm_source=chatgpt.com "Vibing a Non-Trivial Ghostty Feature - Mitchell Hashimoto"))

And the case doesn't look like an AI demo.

During development:

- the generated implementation reaches a critical bug;
- repeated agent attempts fail to fix it;
- Hashimoto recognizes that the session has entered what he calls the "slop zone";
- he stops delegating and studies the problem himself;
- when the agent produces code he doesn't understand, he backs it out;
- the final result gets a thorough manual review before merge. ([Mitchell Hashimoto](https://mitchellh.com/writing/non-trivial-vibing?utm_source=chatgpt.com "Vibing a Non-Trivial Ghostty Feature - Mitchell Hashimoto"))

That is almost exactly the distinction we've been discussing.

The interesting part isn't that "AI wrote a production feature." The process was approximately:

```text
human discovers/designs desired behavior
        ↓
agent prototypes possibilities
        ↓
human evaluates
        ↓
agent implements bounded pieces
        ↓
agent gets stuck / produces bad abstraction
        ↓
human regains control and develops understanding
        ↓
tests + iteration
        ↓
human reads/reviews result
        ↓
merge
        ↓
real users
```


That's **AI-assisted software engineering**, with a human still carrying the engineering responsibility.

His February 2026 "AI Adoption Journey" is even more useful for methodology. When he was trying to determine whether agents were useful, he literally performed tasks twice: once manually and then again with an agent, trying to get the agent to reach the same quality and behavior without seeing his implementation. Initially, he found that touching up agent output took more time than doing the work himself. ([Mitchell Hashimoto](https://mitchellh.com/writing/my-ai-adoption-journey?utm_source=chatgpt.com "My AI Adoption Journey - Mitchell Hashimoto"))

He then gradually identified task classes where agents were predictable enough to delegate. He explicitly says part of becoming effective was learning **when not to use an agent**, because sending an agent into a task it will probably fail at wastes time. ([Mitchell Hashimoto](https://mitchellh.com/writing/my-ai-adoption-journey?utm_source=chatgpt.com "My AI Adoption Journey - Mitchell Hashimoto"))

That's much closer to the methodology you're asking for.

His "harness engineering" idea is also grounded in this practice. It isn't "agents need an amazing orchestration platform." It's basically:

```text
agent fails in a concrete way
        ↓
understand why
        ↓
make that failure mechanically detectable
        ↓
give agent the feedback
        ↓
repeat
```


For example, tests, screenshot tooling, repository instructions, commands and other deterministic checks. ([Mitchell Hashimoto](https://mitchellh.com/writing/my-ai-adoption-journey?utm_source=chatgpt.com "My AI Adoption Journey - Mitchell Hashimoto"))

I would put him at:

|Criterion|Assessment|
|---|---|
|Current hands-on engineer|**Yes**|
|Owns a real product|**Yes**|
|Actually uses coding agents on it|**Yes**|
|Shows resulting code|**Yes**|
|Shows failures|**Yes**|
|Shows full sessions|**Yes, in the case study**|
|Ships to real users|**Yes**|
|Measures against manual work|**Somewhat**|
|Long-term maintenance evidence|**Some, but still early**|
|AI-vendor incentive|He stated in Feb. 2026 that he didn't work for, invest in, or advise AI companies. ([Mitchell Hashimoto](https://mitchellh.com/writing/my-ai-adoption-journey?utm_source=chatgpt.com "My AI Adoption Journey - Mitchell Hashimoto"))|
|Evidence quality|**Strong case study; weak population-level evidence**|

[Read: Vibing a Non-Trivial Ghostty Feature](https://mitchellh.com/writing/non-trivial-vibing?utm_source=chatgpt.com)

[Read: My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey?utm_source=chatgpt.com)

### Daniel Stenberg


For the other half of the question, I think **Daniel Stenberg may be even more valuable**.

He has maintained curl for decades. This gives him a perspective that almost every coding-agent discussion lacks: **the cost of code after it has been merged**.

His June 2026 post "A human in control" makes almost exactly the software-engineering argument we've been circling.

His reasoning is that writing the initial code isn't the main problem in curl. Maintaining and polishing that code over decades is. Human review does more than find syntax errors: it preserves architecture, established design choices and maintainer understanding of how the system behaves. ([daniel.haxx.se](https://daniel.haxx.se/blog/2026/06/10/a-human-in-control/?utm_source=chatgpt.com "A human in control | daniel.haxx.se"))

That isn't philosophical speculation. His production environment is substantial. Around May 2026, curl had roughly 176K lines of C, surviving code from 573 authors, 188 published CVEs and deployment estimates above twenty billion installations. ([daniel.haxx.se](https://daniel.haxx.se/blog/2026/05/11/?utm_source=chatgpt.com "11 | May | 2026 | daniel.haxx.se"))

And his AI position isn't anti-AI.

This is why he's particularly valuable.

During roughly 8-10 months, AI-powered analysis tools caused the curl team to merge **around 200-300 bug fixes**, including findings that became published CVEs. They also use AI review tools on pull requests, and Stenberg says those tools regularly find things humans then fix. ([daniel.haxx.se](https://daniel.haxx.se/blog/2026/05/11/?utm_source=chatgpt.com "11 | May | 2026 | daniel.haxx.se"))

At the same time, he says AI review hasn't replaced human review because it does not cover the same engineering concerns. ([daniel.haxx.se](https://daniel.haxx.se/blog/2026/06/10/a-human-in-control/?utm_source=chatgpt.com "A human in control | daniel.haxx.se"))

So his observed model looks approximately like:

```text
AI as analyzer
        → very useful

AI as additional reviewer
        → useful

AI as code-generation aid
        → potentially useful

AI as authority deciding what belongs in curl
        → no

AI replacing human ownership of the system
        → no
```


And he's had direct exposure to the opposite phenomenon too.

In 2025, about 20% of curl's incoming security submissions were identified as AI slop, while only around 5% of all submissions were turning out to be genuine vulnerabilities by early July. The review burden became bad enough that the project changed its security-reporting process. ([daniel.haxx.se](https://daniel.haxx.se/blog/2025/07/14/death-by-a-thousand-slops/?utm_source=chatgpt.com "Death by a thousand slops | daniel.haxx.se"))

Later, the situation improved substantially as better AI-assisted security research started producing high-quality findings. Stenberg reported that the "slop situation" was no longer the dominant problem by spring 2026. ([daniel.haxx.se](https://daniel.haxx.se/blog/tag/ai/?utm_source=chatgpt.com "AI | daniel.haxx.se"))

That evolution is useful. He's updating his view based on observed outputs.

[Read: A human in control](https://daniel.haxx.se/blog/2026/06/10/a-human-in-control/?utm_source=chatgpt.com)

### What I think these two actually establish


They make me modify the claims we discussed.

I would **not** now say:

> Coding-agent output is generally production-quality.

There isn't evidence for that.

I also wouldn't say:

> Coding-agent output is generally an over-engineered pile of crap.

We don't have good enough evidence for that generalization either.

The evidence supports something narrower:

> **Current agents are useful implementation tools when a capable engineer can constrain the task, provide executable feedback, recognize bad directions, and retain ownership of the resulting system.**

And:

> **The evidence for autonomous production software engineering is far weaker than the evidence for autonomous code production.**

Hashimoto demonstrates the first proposition from the inside: he successfully ships agent-assisted code, but his process contains substantial human judgment and intervention.

Stenberg demonstrates the second from the other end: decades of production ownership make initial code production only one small part of the engineering problem.

That pair is much stronger evidence for me than fifty AI Engineer conference talks.

And there's one thing I particularly like about putting **Hashimoto + Stenberg together**: they don't even need to agree about how heavily AI should be used. Their observations converge on the same constraint:

```text
Generating code
        ≠
knowing whether the code should exist
        ≠
knowing whether this is the right design
        ≠
understanding its consequences
        ≠
being able to maintain the system
        ≠
owning it in production
```


That's probably the intellectual thread I'd follow.

If we're building a **high-signal 2026/27 source network**, I would use these two as seed nodes and then look specifically for another 10-15 engineers with the same standard: _current code + production ownership + inspectable AI usage + public failures_. I suspect that will produce a very different reading list from the AI conference circuit.
