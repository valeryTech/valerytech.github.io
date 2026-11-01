---
draft: false
toc: true
title: "Experiments vs Features"
description: "Collected practitioner arguments for AI roadmaps organized around capability funnels and timeboxed experiments, emphasizing evaluation infrastructure, stakeholder decision points, failure sharing, and reliability evidence."
linkTitle: "Experiments vs Features"
---
# Resources

# Input


downloaded video "Stop Managing AI Projects Like Traditional Software" and https://www.youtube.com/watch?v=R_HnI9oTv3c

https://www.youtube.com/watch?v=k98gDjYbSaU Failure is a funnel, also downloaded

## 6. AI Roadmaps Should Count Experiments, Not Features


Traditional software development commonly uses roadmaps that list features with target delivery dates. Teams commit to shipping specific functionality by specific deadlines, and success is measured by how closely they hit those targets.

This approach fails spectacularly with AI.

Teams commit to roadmaps like "Launch sentiment analysis by Q2" or "Deploy agent-based customer support by end of year," only to discover that the technology is not ready to meet the required quality bar. They either ship something subpar to hit the deadline or miss the deadline entirely. Either way, trust erodes.

The fundamental problem is that traditional roadmaps assume the feasible outcome is known. With conventional software, that is often true: given enough time and resources, most features can be built reliably. With AI, especially at the cutting edge, development constantly tests the boundaries of what is feasible.

### Experiments vs. Features


[Bryan Bischof](https://www.linkedin.com/in/bryan-bischof/), former Head of AI at Hex, describes a "capability funnel" approach to AI roadmaps. This strategy reframes the interpretation of AI development progress.

Instead of defining success as shipping a feature, the capability funnel breaks down AI performance into progressive levels of utility. At the top of the funnel is the most basic functionality: can the system respond at all? At the bottom is complete support for the target job. Between these points are various stages of increasing usefulness.

For example, a query-assistant capability funnel might progress from generating syntactically valid queries, to generating queries that execute without errors, return relevant results, match user intent, and finally solve the target problem optimally.

This approach acknowledges that AI progress is not binary. It involves gradually improving capabilities across multiple dimensions. It also provides a framework for measuring progress before the final goal has been reached.

Successful teams structure their roadmaps around experiments rather than features. Instead of committing to specific outcomes, they commit to a cadence of experimentation, learning, and iteration.

[Eugene Yan](https://eugeneyan.com/), an applied scientist at Amazon, describes an approach to ML project planning with leadership. Although originally developed for traditional machine learning, the process applies equally well to modern LLM development:

> "Here's a common timeline. First, I take two weeks to do a data feasibility analysis, i.e., 'Do I have the right data?' \[...\] Then I take an additional month to do a technical feasibility analysis, i.e., 'Can AI solve this?' After that, if it still works I'll spend six weeks building a prototype we can A/B test."

While LLMs might not require the same kind of feature engineering or model training as traditional ML, the underlying principle remains the same: time-box exploration, establish clear decision points, and prove feasibility before committing to full implementation. This approach gives leadership confidence that resources will not be wasted on open-ended exploration, while giving the team freedom to learn and adapt.

### The Foundation: Evaluation Infrastructure


The key to making an experiment-based roadmap work is robust evaluation infrastructure. Without it, experiment results are guesses. With it, teams can rapidly iterate, test hypotheses, and build on successes.

During the early development of GitHub Copilot, the team invested heavily in sophisticated offline evaluation infrastructure. They created systems that could test code completions against a very large corpus of GitHub repositories, using existing unit tests in high-quality codebases to verify completion correctness automatically. This was a massive engineering undertaking. The systems had to clone repositories at scale, set up their environments, run their test suites, and analyze the results while handling a wide variety of programming languages, frameworks, and testing approaches.

This was not wasted time. It was the foundation that accelerated everything. With solid evaluation in place, the team ran thousands of experiments, quickly identified what worked, and could state with confidence that a change improved quality by a measured amount instead of relying on intuition. Although the upfront investment in evaluation can feel slow, it prevents endless debates about whether changes help or hurt and dramatically speeds up later innovation.

### Communicating This to Stakeholders


The challenge is that executives often want certainty. They want to know when features will ship and what the features will do. The gap must be bridged without manufacturing certainty.

The key is to shift the conversation from outputs to outcomes. Instead of promising specific features by specific dates, commit to a process that will maximize the chances of achieving the desired business outcomes.

Eugene shared how he handles these conversations:

> "I try to reassure leadership with timeboxes. At the end of three months, if it works out, then we move it to production. At any step of the way, if it doesn't work out, we pivot."

This approach gives stakeholders clear decision points while acknowledging the inherent uncertainty in AI development. It also helps manage timeline expectations. Instead of promising a feature in six months, the team promises a clear understanding of whether that feature is feasible in three months.

Bryan's capability funnel approach provides another powerful communication tool. It allows teams to show concrete progress through the funnel stages, even when the final solution is not ready. It also helps executives understand where problems are occurring and make informed decisions about where to invest resources.

### Build a Culture of Experimentation Through Failure Sharing


Perhaps the most counterintuitive aspect of this approach is the emphasis on learning from failures. In traditional software development, failures are often hidden or downplayed. In AI development, they are the primary source of learning.

Eugene operationalizes this at his organization through what he calls a "fifteen-five," a weekly update that takes fifteen minutes to write and five minutes to read:

> "In my fifteen-fives, I document my failures and my successes. Within our team, we also have weekly 'no-prep sharing sessions' where we discuss what we've been working on and what we've learned. When I do this, I go out of my way to share failures."

This practice normalizes failure as part of the learning process. It shows that even experienced practitioners encounter dead ends, and it accelerates team learning by sharing those experiences openly. And by celebrating the process of experimentation rather than just the outcomes, teams create an environment where people feel safe taking risks and learning from failures.

### A Better Way Forward


A content moderation project provides a simplified example of an experiment-based roadmap in practice:

> "I was asked to do content moderation. I said, 'It's uncertain whether we'll meet that goal. It's uncertain even if that goal is feasible with our data, or what machine learning techniques would work. But here's my experimentation roadmap. Here are the techniques I'm gonna try, and I'm gonna update you at a two-week cadence.'"

The roadmap did not promise specific features or capabilities. Instead, it committed to a systematic exploration of possible approaches, with regular check-ins to assess progress and pivot if necessary.

The results were telling:
> "For the first two to three months, nothing worked. \[...\] And then \[a breakthrough\] came out. \[...\] Within a month, that problem was solved. So you can see that in the first quarter or even four months, it was going nowhere. \[...\] But then you can also see that all of a sudden, some new technology comes along, some new paradigm, some new reframing comes along that just \[solves\] 80% of \[the problem\]."

This pattern of long periods of apparent failure followed by breakthroughs is common in AI development. Traditional feature-based roadmaps would have killed the project after months of "failure," missing the eventual breakthrough.

By focusing on experiments rather than features, teams create space for these breakthroughs to emerge. They also build the infrastructure and processes that make breakthroughs more likely, including data pipelines, evaluation frameworks, and rapid iteration cycles.

The most successful teams start by building evaluation infrastructure before committing to specific features. They create tools that make iteration faster and focus on processes that support rapid experimentation. This approach might seem slower at first, but it dramatically accelerates development in the long run by enabling teams to learn and adapt quickly.

The key metric for AI roadmaps is not features shipped, but experiments run. The teams that succeed are those that can run more experiments, learn faster, and iterate more quickly than their competitors. The foundation for this rapid experimentation is robust, trusted evaluation infrastructure that gives stakeholders confidence in the results.

Reframing a roadmap around experiments rather than features creates the conditions for similar breakthroughs within an organization.

# another


The approach can be extended with governance and reliability funnels. Claims about hundreds of AI pilots in production are common. Claims about highly reliable, well-governed, and strongly adopted AI features are much less common. The latter would be a story worth a keynote.

More than three dozen data and AI leaders were interviewed formally, with hundreds more consulted informally about their AI initiatives. In all of these conversations, **only one** participant could articulate a quantifiable measure of the effectiveness or reliability of an AI application.

The project required an agent to reference and apply responses from a source of truth, and the participant cited specific improvements in precision and recall.
