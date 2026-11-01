---
draft: false
toc: true
title: "Customer Understanding: Torres and Cagan"
description: "A source-linked comparison contrasts Torres’s story-interview, snapshot, and opportunity pipeline with SVPG’s broader customer, behavioral, market, and solution evidence, emphasizing context and switching behavior."
linkTitle: "Customer Understanding"
---

Both collect customer pains, but neither treats a list of pains or feature requests as sufficient. Their shared goal is to understand actual customer behavior in context, uncover the underlying problem, and gather evidence that a solution will create enough value.

## Teresa Torres


Torres provides the more explicit information-collection pipeline:

`desired outcome -> experience map -> weekly story interviews -> interview snapshots -> needs/pains/desires -> opportunity space`

### How information is collected


- **Weekly interviews.** At least one customer every week, maintained as a continuous habit rather than a temporary research phase.
- **Story-based questions.** Ask about a specific recent event, such as the last time the customer encountered the situation, rather than asking what customers generally do or want.
- **Story excavation.** Reconstruct the timeline by asking what happened first, next, and before; where it occurred; who was involved; what obstacles appeared; and how the customer responded.
- **The product trio interviews together.** PM, designer, and engineer hear the customer directly rather than relying on one "voice of the customer."
- **Automated recruitment.** Recruit in-product, through customer-facing colleagues using behavioral triggers, or through a customer advisory board.
- **Immediate synthesis.** Each interview becomes a visual one-page interview snapshot.
- **Opportunity mapping.** Opportunities are grouped and structured within the OST.

These practices are described in Torres's chapters on continuous interviewing (line 71) and visualizing customer knowledge (line 21).

### What Torres collects


Her formal category is the **opportunity**: a customer need, pain point, or desire.

But the underlying record is richer:

- the customer's recent, actual behavior;
- the triggering situation;
- steps and events in the experience;
- decisions and alternatives considered;
- people involved;
- obstacles and breakdowns;
- workarounds and recovery behavior;
- what the customer was thinking, feeling, and doing;
- gaps between expectations and reality;
- memorable language and quotations;
- contextual or segment facts;
- unusual behaviors and other insights that might later become opportunities.

The interview snapshot contains a memorable quote, participant context, quick facts, insights, opportunities, and a visual representation of the story. It preserves each customer's story before patterns are synthesized.

Feature requests are not recorded as opportunities without further investigation. Torres recommends asking:

> If that feature existed, what effect would it have?

The answer is reframed as the underlying need, preferably in the customer's language. See Synthesize as You Go (line 117).

### Torres's principles


1. **Do not ask customers what to build.** Customers provide evidence about their lives, not product specifications.
2. **Past behavior is more reliable than stated preferences.** Specific recent stories reduce speculation and idealized answers.
3. **Separate research questions from interview questions.** Define the required learning, but ask simple questions that elicit stories.
4. **Let the participant's priorities guide the interview.** Explore what mattered to that customer before forcing discussion of the team's preferred opportunity.
5. **Collect customer context, not only product feedback.** Narrow questions support optimization; broader questions can reveal competitors, adjacent opportunities, or new markets.
6. **Treat maps as hypotheses, not truth.** Experience maps and opportunity spaces must change as evidence accumulates.
7. **Synthesize continuously.** Do not postpone analysis until a batch of interviews is complete.
8. **Preserve individual stories before aggregating patterns.**
9. **Create shared exposure.** The whole trio should hear customers and interpret the evidence together.
10. **Do not solve every pain.** Prioritize only opportunities that plausibly affect the desired outcome.

## Marty Cagan / SVPG


SVPG uses a broader customer-information system:

`customer interviews + observation + prototype tests + analytics + market evidence + reference customers`

It has no mandatory equivalent of the interview snapshot or OST.

### How information is collected


- **Regular interviews.** Cagan suggests a minimum of two to three hours each week.
- **Contextual observation.** Meet users in their working environment when possible and observe how they operate today.
- **Open-ended conversations.** Keep interviews natural and informal.
- **Prototype usability tests.** Observe whether customers understand and can use a proposed solution.
- **Qualitative value tests.** Explore why customers would or would not use, buy, or switch.
- **Behavioral commitments.** Look for willingness to spend money, sign a letter of intent, use reputation, invest time, provide access, or begin switching.
- **Quantitative evidence.** Use product analytics, A/B tests, invite-only tests, and live-data prototypes.
- **Customer-discovery programs.** For important B2B products, work closely with a small group of prospective reference customers in one target segment.
- **Market-research inputs.** Surveys, site visits, usability studies, competitive analysis, focus groups, and data mining can contribute evidence, subject to their limitations.
- **Unexpected use.** Investigate customers using the product in unplanned ways because this can reveal new problems and opportunities.

Cagan's core interview questions are:

- Are the customers who the team believes they are?
- Do they really have the problem attributed to them?
- How do they solve it today?
- What would be required for them to switch?

See Customer Interviews (line 2461).

### What SVPG collects


Cagan expects deep knowledge of:

- customer types and relevant segments;
- issues, pains, and desires;
- how customers think;
- how they work;
- how business customers decide to buy;
- the problem they face;
- how they solve it today;
- current products, workarounds, and competitors;
- switching costs and barriers;
- actual product usage;
- usability failures;
- reasons for refusing, abandoning, or cancelling;
- willingness to buy or make another meaningful commitment;
- user, customer, business, and financial outcomes.

SVPG explicitly joins qualitative and quantitative information:

- **Qualitative evidence explains why.**
- **Quantitative evidence shows what is happening and, under appropriate experimental conditions, whether an idea works.**

Its analytics scope includes usage paths, engagement, active users, onboarding, support activity, conversion, retention, churn, lifetime value, revenue, acquisition cost, performance, operating cost, and sentiment. See Deep Knowledge of the Customer and Data (line 593) and Flavors of Analytics (line 19).

### SVPG's principles


1. **Do not ask customers to design the product.** They do not know the available technology, other customers' needs, or necessarily what they will value before experiencing it.
2. **Understand the present before testing the future.** Learn how customers solve the problem today before showing a prototype.
3. **Actual behavior is stronger than stated preference.**
4. **Qualitative testing is for learning, not proof.**
5. **Quantitative testing supplies evidence, but rarely explains why.**
6. **Seek negative evidence.** Reasons not to buy, use, or switch are often more informative than praise.
7. **Test with the intended target market.**
8. **Observe customers in context where possible.**
9. **Ensure shared learning.** PM, designer, and engineers should experience customer evidence directly.
10. **Do not delegate customer understanding.** Researchers and analysts assist, but the product team must internalize the learning.
11. **Do not overfit to requested features.** Even reference customers are development partners, not clients commissioning custom solutions.
12. **Combine customer information with technology, business, industry, and strategy knowledge.** Customer evidence informs the solution but does not determine it.
13. **Learning is a means, not the product team's final outcome.** The purpose is to solve the problem in a way customers value and the business can sustain.

Cagan's limits on market research are especially explicit in Market Research Capabilities and Limitations (line 21).

## The main comparison


| Question                 | Torres                                                                  | Cagan / SVPG                                                                                                |
| ------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Primary object collected | Opportunities: needs, pains, and desires grounded in customer stories   | Customer problems, current behavior, switching conditions, solution response, and product/business evidence |
| Main qualitative method  | Recent, specific story interviews                                       | Interviews, contextual observation, usability tests, and qualitative value tests                            |
| Main artifacts           | Experience map, interview snapshot, OST                                 | No single canonical artifact; learning shapes product knowledge, prototypes, analytics, and strategy        |
| Cadence                  | At least one customer interview each week                               | Roughly two to three hours of interviews and qualitative testing each week                                  |
| Who participates         | The complete product trio                                               | PM, designer, and preferably engineers; researchers guide when available                                    |
| Role of analytics        | Complements interviews and measures outcomes                            | Central source of customer, product, and business knowledge                                                 |
| Feature requests         | Translate into the underlying need                                      | Treat as solution hypotheses or supposed "requirements," not instructions                                   |
| Strategic emphasis       | Customer information continually discovers and structures opportunities | Customer information primarily helps understand and solve a strategically selected problem                  |

The shortest synthesis is:

> Torres collects contextual stories and transforms them into a structured opportunity space. SVPG collects a wider mix of customer, behavioral, market, and solution evidence to build product judgment and reduce product risk. Both prioritize observed behavior and underlying needs over opinions and requested features.
