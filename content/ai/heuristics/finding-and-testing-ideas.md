---
draft: false
toc: true
title: "Finding and Testing Product Ideas"
description: "How to generate product ideas by crossing observed workflow problems with newly practical AI abilities, frame candidates as testable problem hypotheses, and combine customer development, opportunity mapping, and cheap demand experiments before building."
linkTitle: "Finding and Testing Ideas"
---

Engineers are trained to take a stated problem and build a working system. Product discovery moves part of that work upstream: working out which problem is worth solving, who pays for it, and which assumptions could kill the idea before commercial software is written. This note covers two linked steps: how to generate candidate problems from work you know and capabilities that recently became practical, and how to test an idea by combining startup and product discovery methods.

The short rules drawn from this note are in [Heuristics for finding LLM product ideas]({{< ref "ai/heuristics" >}}), and the original two-part Q&A is preserved in [the saved dialogue]({{< ref "ai/heuristics/input/finding-and-testing-ideas-dialogue" >}}).

## Ideas generation: crossing observed problems with new abilities


Brainstorming "AI startup ideas" in the abstract usually produces generic wrappers around technology categories. Stronger ideas come from noticing concrete friction in domains where you have first-hand context and crossing those problems with capabilities that only recently crossed a usability threshold ([Graham 2012b](#graham-2012b); [Y Combinator 2025](#yc-2025)). Sarasvathy's **effectuation** research frames early entrepreneurship the same way: start from existing means—what you know, what you can prototype, and whom you can reach—and place small bets whose downside is affordable rather than trying to forecast a whole market upfront ([Sarasvathy 2001](#sarasvathy-2001)).

1. **Build an inventory of observed problems.** Walk through jobs, teams, and projects you have seen directly. List work that was slow, expensive, repetitive, brittle, dependent on one specialist, or held together with spreadsheets, scripts, and manual copy-pasting. Pay extra attention to messy operational work that technical builders tend to avoid because it involves compliance, legacy formats, or multi-party coordination—"schlep blindness" often hides real demand ([Graham 2012a](#graham-2012a); [Graham 2012b](#graham-2012b)).
2. **Build an inventory of newly practical abilities.** List concrete operations—such as structured extraction from messy text, grounding against private registers, multi-document comparison, code explanation, tool orchestration, and speech or image capture (see [What LLMs are good at]({{< ref "ai/heuristics/what-llms-are-good-at" >}})). Ask which old workflows change materially because these operations now work reliably enough inside deterministic checks ([Graham 2012b](#graham-2012b); [Y Combinator 2025](#yc-2025)).
3. **State intersections as people doing a job, not technology labels.** "AI observability" names a category that nobody can falsify in an interview; "platform engineers spend hours reconstructing what changed across deployments, logs, traces, and tickets during an incident" names a testable observation ([Blank 2009](#blank-2009)).
4. **Interrogate work you know with six diagnostic questions:**
   - Where do organizations pay specialists primarily to read, search, classify, reconcile, or route messy information?
   - Which workflow spans four or five systems with a person manually copying and translating context between them?
   - What internal tool or spreadsheet did a team build because off-the-shelf software missed their workflow?
   - Which bottleneck became solvable only recently as model accuracy, multimodal input, or tool use improved?
   - Where do mistakes or delays carry an immediate economic, compliance, or operational cost?
   - What workflow friction can a software engineer see that a non-technical founder would overlook?

## Framing and scoring problem hypotheses


Before designing features, write each promising observation as a **problem hypothesis** so every assumption is explicit and falsifiable ([Blank 2009](#blank-2009); [Graham 2012b](#graham-2012b); [Aulet 2013](#aulet-2013)):

| Field | Question to answer |
| --- | --- |
| **Customer** | Who specifically has the problem, and who controls the budget? |
| **Situation** | When and in what workflow does the problem occur? |
| **Problem** | What are they trying to accomplish, and what blocks or slows them? |
| **Current alternative** | How do they handle it today (manual steps, spreadsheets, agencies, existing tools)? |
| **Cost** | Time, money, error risk, delayed revenue, headcount, or compliance exposure. |
| **Why now** | What changed technologically, regulatorily, or in market workflow? |
| **Founder advantage** | What domain insight, technical edge, or user access do you already have? |
| **Initial wedge** | What narrowest version delivers immediate value without boiling the ocean? |

To choose which hypotheses to investigate first, score candidates from `0` to `3` across seven dimensions: **pain severity, frequency, existing spend or economic consequence, access to target users, dissatisfaction with current workarounds, a credible "why now," and founder advantage**. Treat the score only as a triage filter to pick the top two or three problems for customer conversations, not as evidence that a market exists ([Blank 2009](#blank-2009)).

## Combining startup and product discovery methods


Product discovery frameworks such as Marty Cagan's focus on four solution risks—**value, usability, feasibility, and viability**—through cheap "build to learn" prototypes before commercial delivery ([Cagan, Build to Learn](#cagan-build-to-learn); [Cagan, Startup PM](#cagan-startup-pm)). At raw-idea stage, however, a team still lacks answers to broader business-model questions: who the customer is, whether the problem matters enough to pay for, how customers are reached, and whether the economics work. Customer Development and Lean LaunchPad supply that outer spine, while Strategyzer, Teresa Torres, Cagan, and Lean Startup cover specific steps inside it ([Blank 2009](#blank-2009); [Bland and Osterwalder 2019](#bland-2019); [Torres](#torres-startups)).

| Approach | Fit from raw idea | Primary job in the process |
| --- | --: | --- |
| **Customer Development / Lean LaunchPad** ([Blank 2009](#blank-2009); [Blank 2026](#blank-2026)) | 5/5 | Outer spine: customer segment, problem, channel, pricing, and business-model hypotheses |
| **Testing Business Ideas / Canvases** ([Strategyzer](#strategyzer-hypotheses); [Bland and Osterwalder 2019](#bland-2019)) | 5/5 | Ranking fatal assumptions and matching each to a concrete, low-cost experiment |
| **MIT Disciplined Entrepreneurship** ([Aulet 2013](#aulet-2013)) | 5/5 | Prescriptive 24-step sequence for market segmentation, beachhead selection, and unit economics |
| **Teresa Torres — Continuous Discovery** ([Torres](#torres-startups)) | 4/5 | Mapping user stories into an Opportunity Solution Tree even before a product exists |
| **Marty Cagan / SVPG Discovery** ([Cagan, Build to Learn](#cagan-build-to-learn)) | 4/5 | Testing whether a specific product solution resolves value, usability, feasibility, and viability risks |
| **Lean Startup and YC MVP Advice** ([Ries 2011](#ries-2011); [Y Combinator](#yc-essential)) | 4/5 | Putting the smallest working version into real users' hands and delaying scale until pull appears |
| **The Mom Test** ([Fitzpatrick 2013](#fitzpatrick-2013)) | 3/5 | Interviewing users about concrete past behavior and spend rather than polite hypothetical opinions |

Combined in order, the discovery pipeline runs:

1. **State business and problem hypotheses** across customer, problem, current workaround, channel, revenue, and cost, then isolate the assumptions that could kill the idea first ([Strategyzer](#strategyzer-hypotheses)).
2. **Validate the customer and problem through past-case interviews.** Ask how people handled recent real episodes, what broke, and what they spent—avoiding pitches and hypothetical questions ([Fitzpatrick 2013](#fitzpatrick-2013)). Lean LaunchPad cohorts sustain roughly 10–15 interviews per week while revising their hypotheses ([Blank 2026](#blank-2026)).
3. **Map the opportunity space.** Organize recurring needs and workflow bottlenecks into an Opportunity Solution Tree before locking onto a single feature set ([Torres](#torres-startups)). When the opportunity sits inside an existing multi-step process, score individual steps using [Assessing workflow steps for AI]({{< ref "ai/heuristics/workflow-assessment" >}}).
4. **Test demand before building full software** using the experiment ladder below ([Bland and Osterwalder 2019](#bland-2019)).
5. **Explore multiple solution prototypes** to test value, usability, technical feasibility (including model error rates and review overhead), and viability ([Cagan, Build to Learn](#cagan-build-to-learn)).
6. **Ship a narrow MVP and iterate on observed usage** until retention and willingness to pay show genuine pull before investing in growth ([Ries 2011](#ries-2011); [Y Combinator](#yc-essential)).

## Cheap experiments before commercial software


Different assumptions fail in different ways, so the first test should target the **riskiest assumption** with the smallest artifact that produces behavioral evidence ([Strategyzer](#strategyzer-hypotheses); [Bland and Osterwalder 2019](#bland-2019)):

| Riskiest assumption | Cheapest falsifying test | Evidence to look for |
| --- | --- | --- |
| **Is the problem frequent and painful?** | Past-case interviews on recent episodes ([Fitzpatrick 2013](#fitzpatrick-2013)) | Concrete stories of time lost, money spent, or homegrown scripts and spreadsheets |
| **Will anyone switch or pay for the outcome?** | Concierge / manual service for 3–5 customers, pilot letter, or scoped landing page ([Bland and Osterwalder 2019](#bland-2019)) | Customers hand over real inputs, review real outputs, or commit time and budget |
| **Can an LLM handle the messy inputs well enough?** | Offline evaluation on 15–30 representative real cases against a deterministic or retrieval baseline | Error rate, abstention accuracy, and human correction time stay well below manual cost |
| **Will users tolerate imperfect AI outputs in their workflow?** | Wizard of Oz or thin prototype that includes realistic model mistakes | Users spot mistakes quickly, trust the provenance shown, and still finish faster than by hand |

## Library sources


- [Productboard 2020](/sources/f6d728dc4e39cd0ac6e470c72f2a0292.bin), *The Product Discovery Playbook*

## References


- Aulet, B. (2013). [15.368 Disciplined Entrepreneurship Lab (DE Lab)](https://entrepreneurship.mit.edu/15-368-disciplined-entrepreneurship-lab-de-lab/). MIT Martin Trust Center. ^aulet-2013
- Bland, D. J. and Osterwalder, A. (2019). [Testing Business Ideas](https://www.strategyzer.com/library/testing-business-ideas-book). Strategyzer / Wiley. ^bland-2019
- Blank, S. (2009). [Customer Development Manifesto: The Path of Warriors and Winners (part 5)](https://steveblank.com/2009/09/17/the-path-of-warriors-and-winners/). ^blank-2009
- Blank, S. (2026). [Steve Blank Lean Launch Pad 2026 @ Stanford - Lessons Learned Presentations](https://steveblank.com/2026/06/16/lean-launch-pad-2026-stanford-lessons-learned-presentations/). ^blank-2026
- Cagan, M. [Build to Learn vs Build to Earn](https://www.svpg.com/build-to-learn-vs-build-to-earn/). Silicon Valley Product Group. ^cagan-build-to-learn
- Cagan, M. [Startup Product Management](https://www.svpg.com/startup-product-management/). Silicon Valley Product Group. ^cagan-startup-pm
- Fitzpatrick, R. (2013). [The Mom Test](https://www.momtestbook.com/). ^fitzpatrick-2013
- Graham, P. (2012a). [Schlep Blindness](https://paulgraham.com/schlep.html). ^graham-2012a
- Graham, P. (2012b). [How to Get Startup Ideas](https://www.paulgraham.com/startupideas.html). ^graham-2012b
- Ries, E. (2011). [The Lean Startup | Methodology](https://theleanstartup.com/principles). ^ries-2011
- Sarasvathy, S. D. (2001). [The Five Principles of Effectuation](https://effectuation.org/the-five-principles-of-effectuation-detail). Effectuation.org. ^sarasvathy-2001
- Strategyzer. [How To Test Your Idea: Start With The Most Critical Hypotheses](https://www.strategyzer.com/library/how-to-test-your-idea-start-with-the-most-critical-hypotheses). ^strategyzer-hypotheses
- Torres, T. [How Continuous Discovery Works (and Doesn't) in Early-Stage Startups](https://www.producttalk.org/discovery-in-startups/). Product Talk. ^torres-startups
- Y Combinator (2025). [How To Get AI Startup Ideas](https://www.ycombinator.com/library/M8-how-to-get-ai-startup-ideas). ^yc-2025
- Y Combinator. [YC's essential startup advice](https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice). ^yc-essential
