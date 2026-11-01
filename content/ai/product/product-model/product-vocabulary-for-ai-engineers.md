---
draft: false
toc: true
title: "Product Vocabulary For AI Engineers"
description: "A working glossary adapts three Product Talk articles into product definitions, conversational phrases, and engineering-to-product translations, distinguishing outcomes, opportunities, roadmap uncertainty, discovery evidence, and AI behavior quality."
linkTitle: "Product Vocabulary For AI Engineers"
---
# Product Vocabulary for an AI Engineer


A working glossary derived from three Teresa Torres / Product Talk articles:

- [The Call to Adventure](https://www.producttalk.org/the-call-to-adventure/), abbreviated **CTA**
- [Product Roadmaps: How the Best Product Teams Plan for Uncertainty](https://www.producttalk.org/product-roadmaps/), abbreviated **RM**
- [Behind the Scenes: Building AI-Generated Opportunity Solution Trees](https://www.producttalk.org/behind-the-scenes-ai-osts/), abbreviated **OST**

The focus is vocabulary that helps an engineer discuss **user problems, product decisions, uncertainty, discovery, and product quality** with product managers and designers. Engineering terms that already have their usual technical meaning are mostly omitted.

## 1. Core product reasoning

### Product discovery


**Meaning:** The work of figuring out what is worth building: which user problems matter, what outcomes to pursue, and which solutions are likely to work.

**Useful when:** The team is still learning about the problem or solution.

**Say it like:**

- "This still feels like a discovery question."
- "What discovery has been completed around this?"
- "Implementation confidence is high, but product-discovery confidence is lower."

**Source:** CTA, RM

### Opportunity


**Meaning:** A user need, pain point, desire, or problem that the product could address.

An opportunity describes **what needs to improve for the user**. It does not prescribe the feature.

**Example:**

- Opportunity: "The cause of a failed deployment is unclear."
- Solution: "Add an AI deployment debugger."

**Say it like:**

- "What opportunity does this feature address?"
- "The discussion is jumping from a signal directly to a solution."
- "Could this be phrased as a user opportunity first?"

**Source:** CTA, RM

### Solution


**Meaning:** A specific way of addressing an opportunity.

A solution can be a feature, workflow, AI behavior, service, or other intervention.

**Say it like:**

- "That is one possible solution to the opportunity."
- "Keep the opportunity stable while exploring different solutions."
- "How much evidence supports this solution?"

**Source:** RM

### Outcome


**Meaning:** A measurable result the team wants to cause.

Outcomes give a team direction without deciding the implementation in advance.

**Say it like:**

- "What outcome is the work intended to drive?"
- "What evidence would show that this changed the outcome?"
- "The feature shipped; did the outcome move?"

**Source:** CTA, RM

### Output


**Meaning:** Something the team produces or ships: a feature, service, report, agent, integration, etc.

A useful distinction:

`output = what the team builds`

`outcome = what changes because of it`

**Say it like:**

- "The assistant is the output. What is the desired outcome?"
- "The measurement covers delivery of the output, not its effect."

**Source:** CTA

### Business outcome


**Meaning:** A result that matters to the business, such as revenue, retention, market share, or cost.

**Say it like:**

- "Which business outcome does this support?"
- "This product behavior needs to be connected to a business outcome."

**Source:** CTA, RM

### Product outcome


**Meaning:** A measurable change in user behavior that the product team can influence and that should contribute to a business outcome.

Examples in the roadmap article include reducing time to find something, reducing time to first value, or increasing developer adoption.

**Say it like:**

- "Can this be expressed as a product outcome the team can directly influence?"
- "What user behavior should move if this works?"

**Source:** RM

### Leading indicator


**Meaning:** A metric or behavior that tends to change before a later business result and can provide early evidence of movement in the right direction.

**Say it like:**

- "Is activation a useful leading indicator of retention here?"
- "What leading indicator can be observed before revenue changes?"

**Source:** RM

### Opportunity solution tree (OST)


**Meaning:** A structure that connects an outcome to user opportunities and then to candidate solutions.

A compact mental model:

`outcome -> opportunities -> solutions`

**Say it like:**

- "Where does this sit on the opportunity solution tree?"
- "Several solutions are clustered under the same opportunity."
- "The OST makes the connection between this work and the outcome explicit."

**Source:** CTA, RM, OST

### Strategic context


**Meaning:** The business and product conditions that constrain or guide what the team should pursue: company goals, market position, business model, strategic priorities, etc.

**Say it like:**

- "What strategic context should shape this decision?"
- "The idea is plausible, but does it fit the strategic context?"

**Source:** CTA, RM

### Strategic direction


**Meaning:** The direction the team intends to move without committing to a specific future solution.

**Say it like:**

- "This outcome communicates strategic direction without locking the team into a feature."
- "The direction is agreed; the solution is still open."

**Source:** RM

### Strategic objective / strategic initiative


**Meaning:** A company-level area of focus that product work is expected to support.

**Say it like:**

- "Which strategic objective does this map to?"
- "This is relevant to the current initiative, but the user opportunity still needs to be identified."

**Source:** RM

## 2. Product planning and roadmaps

### Product roadmap


**Meaning:** A representation of what a product team is working toward and, depending on the format, what it expects to build.

The roadmap article emphasizes that the roadmap should communicate the team's actual degree of certainty.

**Say it like:**

- "What level of certainty is the roadmap communicating?"
- "Is this roadmap item being treated as direction or commitment?"

**Source:** RM

### Feature roadmap


**Meaning:** A roadmap that lists specific features and expected delivery dates.

It provides organizational visibility but can create false confidence when used too far into the future.

**Say it like:**

- "This is effectively a feature roadmap."
- "Are these future items actual commitments or placeholders?"

**Source:** RM

### Theme


**Meaning:** A broad strategic area of focus, such as search relevance or developer experience.

A theme gives a team room to explore several possible solutions.

**Say it like:**

- "Is this a useful theme, or is it just a bucket of unrelated features?"
- "The theme provides direction without choosing the implementation."

**Source:** RM

### Theme roadmap


**Meaning:** A roadmap organized around strategic focus areas rather than specific future features.

**Say it like:**

- "A theme roadmap may give the team more room to explore."
- "The theme is clear, but stakeholders still need visibility into near-term releases."

**Source:** RM

### Outcome-based roadmap


**Meaning:** A roadmap organized around measurable outcomes the team commits to improve.

**Say it like:**

- "Could this roadmap move from feature commitments toward outcomes?"
- "The outcome creates accountability while leaving the solution open."

**Source:** RM

### Now / Next / Later


**Meaning:** A roadmap structure that communicates decreasing certainty over time.

- **Now:** active, concrete work.
- **Next:** work expected to come after Now, with less detail.
- **Later:** direction under consideration, with little or no commitment.

Torres extends this into:

`Now = solutions`

`Next = opportunities`

`Later = outcomes`

**Say it like:**

- "This belongs in Next because the opportunity is known, but the solution is not."
- "Later should communicate direction, not a promise."

**Source:** RM

### In flight


**Meaning:** Work that is actively being built or executed now.

**Say it like:**

- "Two solutions are in flight."
- "The roadmap entry for work already in flight should not change without discussing the delivery impact."

**Source:** RM

### On deck


**Meaning:** Work expected to start after the current work finishes.

It signals intent while allowing more uncertainty than work already in flight.

**Say it like:**

- "What is on deck after this release?"
- "The opportunity is on deck, but no solution has been selected yet."

**Source:** RM

### On the radar


**Meaning:** Something the team is aware of and may explore later, without commitment.

**Say it like:**

- "It is on the radar, but a delivery date should not be communicated."
- "Its importance is known, but the work is not yet committed."

**Source:** RM

### Feature commitment


**Meaning:** A promise, explicit or implicit, that the team will deliver a particular feature.

**Say it like:**

- "Does putting this on the roadmap create a feature commitment?"
- "The opportunity can be communicated without making a feature commitment."

**Source:** RM

### False certainty / false precision


**Meaning:** Communicating more confidence or specificity than the available evidence supports.

Examples include giving dates for distant work or naming a future feature before discovery has established that the feature is the right solution.

**Say it like:**

- "That date implies false precision at this stage."
- "Communicating the opportunity is preferable to creating false certainty about the solution."

**Source:** RM

### Time-based uncertainty


**Meaning:** Uncertainty about when work will happen or finish.

**Say it like:**

- "Now / Next / Later handles time-based uncertainty better than quarter-by-quarter promises."

**Source:** RM

### Solution-based uncertainty


**Meaning:** Uncertainty about what solution will actually solve the problem.

This is separate from uncertainty about timing.

**Say it like:**

- "Timing uncertainty has been acknowledged, but solution uncertainty remains."
- "The problem is known; what to build is not."

**Source:** RM

### Latitude to explore


**Meaning:** Freedom for a product team to investigate different solutions instead of being locked into a predefined feature.

**Say it like:**

- "Can the team receive enough latitude to explore the opportunity?"
- "The outcome creates accountability while preserving latitude to explore."

**Source:** RM

### Visibility


**Meaning:** How much useful information other parts of the organization have about product direction and upcoming work.

Sales, marketing, customer support, leadership, and customers may need different kinds of visibility.

**Say it like:**

- "How can Sales receive enough visibility without creating an overcommitment?"
- "The roadmap is useful partly because it gives the rest of the organization visibility."

**Source:** RM

### Fully spec'd


**Meaning:** Detailed enough that the team has defined what it intends to build and can execute against the specification.

**Say it like:**

- "This is still in discovery; it is not fully specified."
- "Now should mostly contain work that is already defined enough to execute."

**Source:** RM

### Target release date


**Meaning:** A planned release date used when enough is known to make timing useful, while still recognizing that it may move.

**Say it like:**

- "Is enough known to assign a target release date?"
- "Add a target release date only once the work is sufficiently defined."

**Source:** RM

### Contractual obligation


**Meaning:** Work the company has formally committed to deliver, often through a customer agreement, regulation, or other binding requirement.

**Say it like:**

- "This one has different planning rules because it is a contractual obligation."
- "There is little solution freedom here; the capability is contractually required."

**Source:** RM

### Backlog


**Meaning:** A collection of possible or planned work that has not yet been completed.

The roadmap article warns against letting Later become an unlimited backlog.

**Say it like:**

- "Later should not become another backlog."
- "Does this still support the current strategy, or is it just old backlog residue?"

**Source:** RM

### Pivot


**Meaning:** Change the solution or direction after learning that the current approach is not working or is no longer the best choice.

**Say it like:**

- "If this solution fails, can the team pivot while preserving the same opportunity?"
- "The evidence suggests a pivot before further investment."

**Source:** RM

## 3. Customer research and discovery

### Customer interview


**Meaning:** A conversation used to learn about customers' actual experiences, behavior, needs, and problems.

**Say it like:**

- "Are there customer interviews that support this opportunity?"
- "The underlying customer story should be understood before designing the solution."

**Source:** CTA, OST

### Story-based interviewing


**Meaning:** Interviewing that focuses on reconstructing a specific past experience rather than asking for general opinions or predictions.

**Say it like:**

- "Could a concrete story replace questions about usual behavior?"
- "Story-based interviewing may provide better evidence about the actual workflow."

**Source:** CTA

### Set the scene


**Meaning:** Help the participant return mentally to the specific situation being discussed: where they were, what triggered the event, what they were trying to do, etc.

**Say it like:**

- "Can the scene be established before asking why the customer made that decision?"

**Source:** CTA

### Build a timeline


**Meaning:** Reconstruct the sequence of events in a customer story so the team understands what happened before, during, and after a key moment.

**Say it like:**

- "Build the timeline around the failure instead of jumping to the requested feature."

**Source:** CTA

### Redirect generalizations


**Meaning:** Move an interviewee from broad claims about usual behavior back to a specific event that can provide stronger evidence.

**Say it like:**

- "That answer is broad. Could the discussion return to the specific incident?"

**Source:** CTA

### Leading question


**Meaning:** A question phrased in a way that nudges the person toward a particular answer.

**Say it like:**

- "That might be a leading question."
- "Rephrase the question to avoid feeding the participant the hypothesis."

**Source:** CTA

### Selection bias


**Meaning:** Distortion caused by learning from a group that is systematically different from the broader population the research is intended to understand.

**Say it like:**

- "There may be selection bias in who chose to respond."
- "Do these participants represent the users affected by the decision?"

**Source:** CTA

### Synthesis


**Meaning:** Turning raw research evidence into useful patterns, insights, opportunities, or decisions.

**Say it like:**

- "The bottleneck is not collection; it is synthesis."
- "Who should stay involved in the synthesis?"
- "Can AI scaffold synthesis without removing user judgment?"

**Source:** CTA, OST

### Interview snapshot


**Meaning:** Torres's structured representation of what was learned from one customer interview before synthesizing across several interviews.

**Say it like:**

- "Preserve the individual interview snapshots before clustering across customers."

**Source:** CTA, OST

### Signal


**Meaning:** Evidence that something may be happening or may matter, without necessarily explaining the underlying cause.

**Say it like:**

- "That metric drop is a signal; its cause still needs to be understood."
- "There is a signal of dissatisfaction, but not enough context yet."

**Source:** CTA

### Shallow signal


**Meaning:** A signal with little explanatory context, such as a thumbs-down or a vague comment.

**Say it like:**

- "This feedback is a shallow signal. Could more context be elicited?"
- "AI may be useful for turning shallow signals into richer evidence."

**Source:** CTA

## 4. Early product development

### Prototype


**Meaning:** An implementation built mainly to learn whether an idea, interaction, or capability can work.

A prototype can answer questions without meeting production requirements.

**Say it like:**

- "This prototype proves the interaction is plausible."
- "The prototype does not yet show whether the system is reliable enough for production."

**Source:** CTA, OST

### MVP


**Meaning:** Minimum viable product: an early product version that is usable enough to test value with real users.

**Say it like:**

- "What is the smallest MVP that can test the product behavior?"
- "The MVP should show whether users benefit from this workflow."

**Source:** CTA

### Alpha


**Meaning:** A very early product stage used with a limited set of users or partners while the team is still learning and fixing major issues.

**Say it like:**

- "The first version worked in alpha, but broader usage exposed new cases."
- "What learning is expected during alpha?"

**Source:** OST

### Alpha partner


**Meaning:** A user or organization that agrees to try a very early version and provide feedback.

**Say it like:**

- "Recruit a few alpha partners who experience this problem frequently."

**Source:** OST

### Design partner


**Meaning:** A customer or user who works closely with the product team while a new product is being shaped.

A design partner is useful for repeated feedback and observing real use before broad release.

**Say it like:**

- "Could this be validated with two or three design partners?"
- "The design partners are asking for support for larger datasets."

**Source:** OST

### Initial feedback


**Meaning:** The first reactions and usage evidence gathered from early users.

It is directional evidence, not proof that the product will work at scale.

**Say it like:**

- "Initial feedback is positive, but it covers only a narrow usage range."

**Source:** OST

### Beta limits


**Meaning:** Restrictions placed on an early product during beta, such as usage, volume, features, or access.

**Say it like:**

- "They hit the beta limits much sooner than expected."
- "The beta limit is useful for controlling cost during learning."

**Source:** OST

### Willingness to pay


**Meaning:** Evidence that a customer considers the product valuable enough to spend money on it.

This is stronger evidence than saying they like the idea.

**Say it like:**

- "Is any willingness-to-pay evidence available yet?"
- "Usage is promising; willingness to pay would provide more information about perceived value."

**Source:** OST

### Roll out


**Meaning:** Make a product or feature available to users, often incrementally.

**Say it like:**

- "This can be rolled out to a small cohort first."
- "What needs to be true before a broader rollout?"

**Source:** CTA

### Integrate into the product


**Meaning:** Move a standalone experiment or capability into the actual product workflow and experience.

**Say it like:**

- "The prompt works. The next question is how to integrate the behavior into the product."
- "Where in the user journey should this capability be integrated?"

**Source:** CTA, OST

### Production product / production-quality product


**Meaning:** A product that must work reliably under real usage, including edge cases, scale, failure handling, monitoring, and operational constraints.

**Say it like:**

- "This is good enough for a prototype, not yet for a production product."
- "What closes the gap from demo quality to production quality?"

**Source:** CTA, OST

### Show cracks


**Meaning:** Informal phrase for weaknesses that only become visible under broader or heavier real-world use.

**Say it like:**

- "The architecture started to show cracks once customers uploaded more data."
- "The first production traces should be expected to expose weaknesses in the assumptions."

**Source:** OST

### Full scope of the problem


**Meaning:** The complete set of constraints, edge cases, dependencies, and behaviors that must be handled once a seemingly simple problem is examined in real use.

**Say it like:**

- "The prototype helped uncover the full scope of the problem."
- "The full scope does not appear to be understood yet."

**Source:** OST

### Failure mode


**Meaning:** A recurring way in which a product or system can fail.

Engineers already use this term technically; in product work, it is also useful for describing user-visible behavior and quality boundaries.

**Say it like:**

- "What are the important user-facing failure modes?"
- "This failure mode only appears on longer-running tasks."

**Source:** OST

### Error analysis


**Meaning:** Systematically inspecting failures, grouping them into categories, and using those categories to guide improvements.

**Say it like:**

- "Before changing the prompt again, perform error analysis on the traces."
- "The error analysis suggests two distinct failure categories."

**Source:** OST

### Quality check


**Meaning:** A test or validation intended to catch unacceptable behavior before a result is accepted or shown.

**Say it like:**

- "Which quality checks can be deterministic?"
- "A quality check is needed before this action is committed."

**Source:** OST

### Feasible solution


**Meaning:** A solution that appears practical to build and operate within the relevant technical, product, time, and cost constraints.

**Say it like:**

- "The prototype provides evidence that this is a feasible solution."
- "It solves the problem, but feasibility at production cost still needs to be checked."

**Source:** OST

## 5. AI product language

### Eval


**Meaning:** A systematic way to assess whether an AI system behaves according to the product's definition of good behavior.

Torres frames evals as a product discovery feedback loop: inspect what goes wrong, measure the problem, improve the system, and repeat.

**Say it like:**

- "What does the eval show about actual product quality?"
- "Do the evals represent the failures users care about?"
- "This failure pattern needs to become an eval."

**Source:** CTA

### Trace


**Meaning:** A recorded example of what an AI system did during an interaction or execution.

Traces are evidence for understanding behavior, failures, and user experience.

**Say it like:**

- "Inspect traces where users rejected the recommendation."
- "Are there enough traces to determine whether this is systematic?"

**Source:** CTA

### Feedback loop


**Meaning:** A repeated process in which observed behavior is evaluated and used to improve the next version.

**Say it like:**

- "How quickly can the feedback loop be closed?"
- "Evals provide a feedback loop from production behavior back into product development."

**Source:** CTA

### Scaffold


**Meaning:** Provide structure, guidance, or assistance that helps the user perform a difficult task while keeping them involved in the meaningful parts.

This is especially useful vocabulary for AI products where full automation would remove valuable user judgment or learning.

**Say it like:**

- "Could AI scaffold the analysis without doing the judgment for the user?"
- "The interaction is designed to scaffold synthesis."

**Source:** OST

### Engage with the result


**Meaning:** Have the user inspect, interpret, challenge, modify, or build on what the AI produced.

**Say it like:**

- "Users should engage with the recommendation before it changes shared state."
- "What in the UI encourages the user to engage with the reasoning?"

**Source:** OST

### Weigh in


**Meaning:** Contribute judgment or an opinion to a decision or piece of work.

This is conversational product language.

**Say it like:**

- "The user needs enough context to weigh in."
- "At which points should an expert weigh in?"

**Source:** OST

### Change set


**Meaning:** A structured description of proposed changes that can be inspected and applied.

In the OST product, the change set lets users understand and evaluate how the AI proposes to modify the tree.

**Say it like:**

- "Could the agent return a change set instead of silently applying the changes?"
- "The change set creates a review point before commitment."

**Source:** CTA, OST

### Additive


**Meaning:** Adding useful capability while preserving an existing valuable activity.

For example, an AI follow-up can enrich customer feedback while human interviews continue to serve their original purpose.

**Say it like:**

- "AI should be framed as additive here."
- "Can this be additive to the existing workflow before replacement is considered?"

**Source:** CTA

### Raise the floor


**Meaning:** Improve the minimum or typical quality that less-skilled users can achieve.

A related phrase, common in product and technology discussions, is **raise the ceiling**: enable advanced users to achieve more than was previously possible.

**Say it like:**

- "Could AI raise the floor on first-pass analysis?"
- "This tool may raise the floor for new users while also speeding up experts."

**Source:** CTA for "raise the floor"; "raise the ceiling" is a common related phrase added for context.

### Just now possible


**Meaning:** A product or workflow that has become feasible because of a recent change in technology or capability.

This phrase is useful when discussing capability-led product discovery.

**Say it like:**

- "What is now possible that was not practical a year ago?"
- "This capability changes the design space."

**Source:** CTA, OST

### "Can AI help with this?"


**Meaning:** A capability-exploration question used to probe ordinary work for newly possible AI roles.

Exploration can begin before it is clear whether the result will become a product.

**Say it like:**

- "As an exploration exercise, ask whether AI can help with this part of the workflow."

**Source:** CTA

### "The prompt is not the product"


**Meaning:** Demonstrating good model behavior with a prompt does not answer the product questions around users, workflow, reliability, evaluation, deployment, failure handling, and value.

**Say it like:**

- "The prompt works, but the prompt is not the product."
- "The model capability has been validated; the product now needs to be designed around it."

**Source:** CTA

### Get more value out of


**Meaning:** Increase the useful benefit users receive from something they already do or already possess.

**Say it like:**

- "How can teams derive more value from the interviews they already conduct?"
- "The data already exists; the opportunity may be helping users get more value out of it."

**Source:** CTA

## 6. High-value phrases for product conversations


These are useful sentence patterns to practice. They are phrased here as original examples rather than quotations from the articles.

### Clarifying the problem


- "What user problem is being solved?"
- "What opportunity does this solution address?"
- "Is there evidence that this is a recurring user problem?"
- "Is the focus on the underlying need or on one requested feature?"
- "What does the user still need to do after this surface has done its job?"

### Connecting work to outcomes


- "What outcome is the work intended to drive?"
- "Which user behavior should change if this works?"
- "How does that product outcome connect to the business outcome?"
- "Is the measurement focused on the output or its effect?"
- "What leading indicator would show movement in the intended direction?"

### Discussing uncertainty


- "How much certainty actually exists here?"
- "The opportunity is known; the solution is still uncertain."
- "There is not yet enough evidence to make a feature commitment."
- "Could direction be communicated without implying a delivery promise?"
- "That level of specificity may create false precision."
- "Is there timing uncertainty, solution uncertainty, or both?"

### Discussing discovery


- "What still needs to be learned?"
- "What would reduce uncertainty the fastest?"
- "Can this be tested with a prototype before building the production path?"
- "What was learned from the initial feedback?"
- "Do the traces support the hypothesis?"
- "What failure pattern should become an eval?"

### Discussing AI collaboration


- "Where should the user stay involved?"
- "Is user judgment part of the value here?"
- "Could this task be scaffolded without automating the meaningful judgment?"
- "Should the AI propose a change set and let the user weigh in?"
- "How can the user inspect, challenge, or modify the result?"
- "What should happen when the AI is uncertain?"

### Discussing roadmap position


- "This solution is already in flight."
- "The opportunity is on deck, but no solution has been chosen."
- "It is on the radar; there is no commitment yet."
- "Place the solution in Now, the opportunity in Next, and the outcome in Later."
- "Does this roadmap reflect what is actually known today?"

### Discussing early product quality


- "The prototype validates the concept; production quality is a separate question."
- "What started to show cracks under real usage?"
- "Is the full scope of the problem understood?"
- "What are the dominant failure modes?"
- "What did the error analysis reveal?"
- "Which quality checks can be automated?"
- "Is there willingness-to-pay evidence, or only positive feedback?"

## 7. Terms to internalize first


Start with these twenty terms:

1. **Opportunity**
2. **Solution**
3. **Outcome**
4. **Output**
5. **Business outcome**
6. **Product outcome**
7. **Leading indicator**
8. **Product discovery**
9. **Strategic context**
10. **In flight**
11. **On deck**
12. **On the radar**
13. **Feature commitment**
14. **Solution uncertainty**
15. **Latitude to explore**
16. **Design partner**
17. **Willingness to pay**
18. **Scaffold**
19. **Failure mode**
20. **Eval**

A useful product-thinking chain is:

`strategic context -> outcome -> opportunity -> discovery -> solution -> prototype -> evidence -> ship -> evaluate outcome`

For AI products, extend it with:

`AI behavior -> traces -> error analysis -> evals -> improvement`

And when the AI works with the user:

`AI contribution -> user engages / weighs in -> accept, modify, reject -> shared result`

## 8. Engineering-to-product translation


A few translations that can help when moving between engineering and product discussions:

| Engineering-first framing | Product framing to add |
|---|---|
| "The model can do X." | "Which user opportunity does X address?" |
| "This can be built." | "What evidence says this solution creates value?" |
| "The API is done." | "What user or business outcome should change?" |
| "The error rate is 2%." | "Which failure modes make up that 2%, and which matter to users?" |
| "The prompt works." | "Does the full workflow work as a product?" |
| "Better accuracy is needed." | "What behavior counts as good enough for this user task?" |
| "This step can be automated." | "Should the user stay involved in the judgment?" |
| "More context is needed." | "What shared context is necessary for the collaboration?" |
| "This is technically feasible." | "Is it desirable, useful, and worth prioritizing?" |
| "Add it to the roadmap." | "Does this commit to a solution, identify an opportunity, or signal an outcome?" |
| "Users asked for feature X." | "What underlying problem are they trying to solve?" |
| "The beta users liked it." | "What behavioral or willingness-to-pay evidence is available?" |

## 9. Source notes


This glossary is intentionally selective. It is based on terminology and framing used in the three Product Talk articles above. Definitions and example sentences are paraphrased and adapted for practical use by an AI Engineer.

A few related terms are included where they make a source term easier to use correctly; these are explicitly identified when they are not directly taken from the articles.

## Library sources


- Heath 2020, *Upstream: The Quest to Solve Problems Before They Happen*
- [Serrat 2009](/sources/thinking-and-learning/problem-solving/serrat-2009-asking-effective-questions.pdf.enc), *Asking Effective Questions*
