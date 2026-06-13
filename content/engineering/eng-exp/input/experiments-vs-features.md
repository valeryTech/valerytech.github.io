---
draft: false
toc: true
title: "Experiments Vs Features"
linkTitle: "Experiments Vs Features"
---
# Resources

# Input


downloaded video "Stop Managing AI Projects Like Traditional Software" and https://www.youtube.com/watch?v=R_HnI9oTv3c

https://www.youtube.com/watch?v=k98gDjYbSaU Failure is a funnel, also downloaded

## 6. Your AI Roadmap Should Count Experiments, Not Features


If you've worked in software development, you're familiar with traditional roadmaps: a list of features with target delivery dates. Teams commit to shipping specific functionality by specific deadlines, and success is measured by how closely they hit those targets.

This approach fails spectacularly with AI.

I've watched teams commit to roadmaps like "Launch sentiment analysis by Q2" or "Deploy agent-based customer support by end of year," only to discover that the technology simply isn't ready to meet their quality bar. They either ship something subpar to hit the deadline or miss the deadline entirely. Either way, trust erodes.

The fundamental problem is that traditional roadmaps assume we know what's possible. With conventional software, that's often true - given enough time and resources, you can build most features reliably. With AI, especially at the cutting edge, you're constantly testing the boundaries of what's feasible.

### Experiments vs. Features


[Bryan Bischof](https://www.linkedin.com/in/bryan-bischof/), Former Head of AI at Hex, introduced me to what he calls a "capability funnel" approach to AI roadmaps. This strategy reframes how we think about AI development progress.

Instead of defining success as shipping a feature, the capability funnel breaks down AI performance into progressive levels of utility. At the top of the funnel is the most basic functionality - can the system respond at all? At the bottom is fully solving the user's job to be done. Between these points are various stages of increasing usefulness.

For example, in a query assistant, the capability funnel might look like: 1. Can generate syntactically valid queries (basic functionality) 2. Can generate queries that execute without errors 3. Can generate queries that return relevant results 4. Can generate queries that match user intent 5. Can generate optimal queries that solve the user's problem (complete solution)

This approach acknowledges that AI progress isn't binary - it's about gradually improving capabilities across multiple dimensions. It also provides a framework for measuring progress even when you haven't reached the final goal.

The most successful teams I've worked with structure their roadmaps around experiments rather than features. Instead of committing to specific outcomes, they commit to a cadence of experimentation, learning, and iteration.

[Eugene Yan](https://eugeneyan.com/), an applied scientist at Amazon, shared how he approaches ML project planning with leadership - a process that, while originally developed for traditional machine learning, applies equally well to modern LLM development:
> "Here's a common timeline. First, I take two weeks to do a data feasibility analysis, i.e"do I have the right data?" \[...\] Then I take an additional month to do a technical feasibility analysis, i.e "can AI solve this?" After that, if it still works I'll spend six weeks building a prototype we can A/B test."
While LLMs might not require the same kind of feature engineering or model training as traditional ML, the underlying principle remains the same: time-box your exploration, establish clear decision points, and focus on proving feasibility before committing to full implementation. This approach gives leadership confidence that resources won't be wasted on open-ended exploration, while giving the team the freedom to learn and adapt as they go.

### The Foundation: Evaluation Infrastructure


The key to making an experiment-based roadmap work is having robust evaluation infrastructure. Without it, you're just guessing whether your experiments are working. With it, you can rapidly iterate, test hypotheses, and build on successes.

I saw this firsthand during the early development of GitHub Copilot. What most people don't realize is that the team invested heavily in building sophisticated offline evaluation infrastructure. They created systems that could test code completions against a very large corpus of repositories on GitHub, leveraging unit tests that already existed in high-quality codebases as an automated way to verify completion correctness. This was a massive engineering undertaking - they had to build systems that could clone repositories at scale, set up their environments, run their test suites, and analyze the results, all while handling the incredible diversity of programming languages, frameworks, and testing approaches.

This wasn't wasted time -- it was the foundation that accelerated everything. With solid evaluation in place, the team ran thousands of experiments, quickly identified what worked, and could say with confidence "this change improved quality by X%" instead of relying on gut feelings. While the upfront investment in evaluation feels slow, it prevents endless debates about whether changes help or hurt, and dramatically speeds up innovation later.

### Communicating This to Stakeholders


The challenge, of course, is that executives often want certainty. They want to know when features will ship and what they'll do. How do you bridge this gap?

The key is to shift the conversation from outputs to outcomes. Instead of promising specific features by specific dates, commit to a process that will maximize the chances of achieving the desired business outcomes.

Eugene shared how he handles these conversations:
> "I try to reassure leadership with timeboxes. At the end of three months, if it works out, then we move it to production. At any step of the way, if it doesn't work out, we pivot."
This approach gives stakeholders clear decision points while acknowledging the inherent uncertainty in AI development. It also helps manage expectations about timelines - instead of promising a feature in six months, you're promising a clear understanding of whether that feature is feasible in three months.

Bryan's capability funnel approach provides another powerful communication tool. It allows teams to show concrete progress through the funnel stages, even when the final solution isn't ready. It also helps executives understand where problems are occurring and make informed decisions about where to invest resources.

### Build a Culture of Experimentation Through Failure Sharing


Perhaps the most counterintuitive aspect of this approach is the emphasis on learning from failures. In traditional software development, failures are often hidden or downplayed. In AI development, they're the primary source of learning.

Eugene operationalizes this at his organization through what he calls a "fifteen-five" - a weekly update that takes fifteen minutes to write and five minutes to read:
> "In my fifteen-fives, I document my failures and my successes. Within our team, we also have weekly"no-prep sharing sessions" where we discuss what we've been working on and what we've learned. When I do this, I go out of my way to share failures."
This practice normalizes failure as part of the learning process. It shows that even experienced practitioners encounter dead ends, and it accelerates team learning by sharing those experiences openly. And by celebrating the process of experimentation rather than just the outcomes, teams create an environment where people feel safe taking risks and learning from failures.

### A Better Way Forward


So what does an experiment-based roadmap look like in practice? Here's a simplified example from a content moderation project Eugene worked on:
> "I was asked to do content moderation. I said, 'It's uncertain whether we'll meet that goal. It's uncertain even if that goal is feasible with our data, or what machine learning techniques would work. But here's my experimentation roadmap. Here are the techniques I'm gonna try, and I'm gonna update you at a two-week cadence.'"
The roadmap didn't promise specific features or capabilities. Instead, it committed to a systematic exploration of possible approaches, with regular check-ins to assess progress and pivot if necessary.

The results were telling:
> "For the first two to three months, nothing worked. \[...\] And then \[a breakthrough\] came out. \[...\] Within a month, that problem was solved. So you can see that in the first quarter or even four months, it was going nowhere. \[...\] But then you can also see that all of a sudden, some new technology comes along, some new paradigm, some new reframing comes along that just \[solves\] 80% of \[the problem\]."
This pattern - long periods of apparent failure followed by breakthroughs - is common in AI development. Traditional feature-based roadmaps would have killed the project after months of "failure," missing the eventual breakthrough.

By focusing on experiments rather than features, teams create space for these breakthroughs to emerge. They also build the infrastructure and processes that make breakthroughs more likely - data pipelines, evaluation frameworks, and rapid iteration cycles.

The most successful teams I've worked with start by building evaluation infrastructure before committing to specific features. They create tools that make iteration faster and focus on processes that support rapid experimentation. This approach might seem slower at first, but it dramatically accelerates development in the long run by enabling teams to learn and adapt quickly.

The key metric for AI roadmaps isn't features shipped - it's experiments run. The teams that win are those that can run more experiments, learn faster, and iterate more quickly than their competitors. And the foundation for this rapid experimentation is always the same: robust, trusted evaluation infrastructure that gives everyone confidence in the results.

By reframing your roadmap around experiments rather than features, you create the conditions for similar breakthroughs in your own organization.

# another


I'll take the approach a step further and suggest we need governance and reliability funnels too. I've heard the "hundreds of AI pilots in production story dozens of times. The "we have a highly-reliable, well-governed, and strongly adopted AI feature" story not so much. That is a story worth a keynote.

My team and I have formally interviewed more than three dozen data + AI leaders, and informally spoken with hundreds on their AI initiatives. In all of these conversations, **only** **ONE** was able to articulate any quantifiable measurement of the effectiveness or reliability of their AI application.

In case you're curious (and I hope you are), it was a project that required an agent to reference and apply responses from a source of truth, and he cited specific improvements in precision and recall.
