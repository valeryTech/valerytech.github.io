---
draft: false
toc: true
title: "Finding and Testing Startup Ideas (Saved Dialogue)"
description: "Two answers kept as they were written, on which startup methods to combine when starting from an idea, and on how to generate ideas from problems you know and from what has recently become possible."
linkTitle: "Finding and Testing Ideas (Dialogue)"
---

Two answers kept as they were written. The distilled guide version is in [Finding and testing product ideas]({{< ref "ai/heuristics/finding-and-testing-ideas" >}}), and the short rules drawn from both are in [Heuristics for finding LLM product ideas]({{< ref "ai/heuristics" >}}).

## Startup Approaches


I searched the original/author sources. For a startup starting at "we have an idea," I would not use Marty Cagan as the whole methodology. I'd use his work as one layer inside a broader startup discovery process.

### How the approaches fit


|Approach|Fit from raw idea|Best use|
|---|--:|---|
|**Steve Blank -- Customer Development / Lean LaunchPad**|5/5|Overall startup process: customer, problem, channel, pricing, business model|
|**Strategyzer -- Testing Business Ideas / BMC / VPC**|5/5|Turn assumptions into explicit tests and evidence|
|**MIT Disciplined Entrepreneurship**|5/5|Very structured end-to-end checklist|
|**Marty Cagan / SVPG**|4/5|Discover whether a particular product solution works|
|**Teresa Torres -- Continuous Discovery**|4/5|Understand problems/opportunities and explore solutions|
|**Lean Startup -- Eric Ries**|4/5|Build-Measure-Learn experimentation loop|
|**YC startup advice**|4/5|MVP discipline, launching, getting initial users|
|**The Mom Test**|3/5|Customer interview technique|
|**Shape Up**|2/5 initially|Organizing product delivery once you have something to build|

The important boundary around Cagan is that SVPG's discovery model focuses on four product risks: **value, usability, feasibility, and viability**. Cagan currently describes discovery as "build to learn": cheap prototypes and tests before investing in commercial-quality delivery. He also explicitly says this is a conceptual model rather than a complete process. ([Silicon Valley Product Group](https://www.svpg.com/build-to-learn-vs-build-to-earn/ "Build to Learn vs Build to Earn - Silicon Valley Product Group : Silicon Valley Product Group"))

That is extremely useful for a startup. But at idea stage you still have questions such as: _Who exactly is the customer? Is this problem important? Can we find these people? Who pays? How much? How do we acquire customers? Is there a viable business here?_ Customer Development and Lean LaunchPad explicitly cover those broader business-model hypotheses. ([Silicon Valley Product Group](https://www.svpg.com/discovery-coaches/ "Discovery Coaches - Silicon Valley Product Group : Silicon Valley Product Group"))

Cagan has also advocated prototyping with target users before hiring a large engineering team since his early writing on startup product management. ([Silicon Valley Product Group](https://www.svpg.com/startup-product-management/ "Startup Product Management - Silicon Valley Product Group : Silicon Valley Product Group"))

### The approach I'd use


I would make **Customer Development / Lean LaunchPad the spine**, then insert Cagan, Torres and Strategyzer techniques into it.

1. **Turn the idea into hypotheses.** Write down the proposed customer segment, problem, current alternative, value proposition, acquisition channel, revenue model and major costs. A Business Model Canvas is useful here because each box is treated as a hypothesis, not as a plan. Strategyzer then recommends identifying the assumptions that could kill the business and testing those first. ([Strategyzer](https://www.strategyzer.com/library/how-to-test-your-idea-start-with-the-most-critical-hypotheses "How To Test Your Idea: Start With The Most Critical Hypotheses"))
2. **Validate the problem and customer.** Talk to people in the proposed segment. Ask about specific past experiences, workflows, existing workarounds, money spent and consequences of the problem. _The Mom Test_ is useful specifically for avoiding leading questions and polite hypothetical answers. ([The Mom Test](https://www.momtestbook.com/ "The Mom Test by Rob Fitzpatrick")) Current Stanford Lean LaunchPad still sets an explicit pace of roughly **10-15 customer interviews per week** while teams continually update their hypotheses. ([Steve Blank](https://steveblank.com/2026/06/16/lean-launch-pad-2026-stanford-lessons-learned-presentations/ "Steve Blank Lean Launch Pad 2026 @ Stanford - Lessons Learned Presentations"))
3. **Map the problem space.** Once a target customer and direction begin to emerge, Teresa Torres becomes particularly useful. Her startup guidance explicitly applies even when you have **no product and no customers**: interview target users, collect stories about their behavior, and build an Opportunity Solution Tree showing needs/problems and possible solutions. ([Product Talk](https://www.producttalk.org/discovery-in-startups/ "How Continuous Discovery Works (and Doesn't) in Early-Stage Startups"))
4. **Test demand without building the full product.** Rank the riskiest assumptions and choose the cheapest experiment capable of producing useful evidence: prototype, concierge service, fake-door test, landing page, pre-order, pilot agreement, manual workflow, etc. Strategyzer's _Testing Business Ideas_ is particularly good here because it provides an experiment library and explicitly ranks evidence-producing techniques. ([Strategyzer](https://www.strategyzer.com/library/testing-business-ideas-book "Testing Business Ideas - Innovation Process to Reduce Risks"))
5. **Use Cagan for solution discovery.** Once you have credible evidence that a worthwhile customer problem exists, explore several solution approaches. Test value, usability, feasibility and viability with prototypes before producing commercial-quality software. This is almost exactly Cagan's current "build to learn" formulation. ([Silicon Valley Product Group](https://www.svpg.com/build-to-learn-vs-build-to-earn/ "Build to Learn vs Build to Earn - Silicon Valley Product Group : Silicon Valley Product Group"))
6. **Build the smallest useful MVP.** Now the Lean Startup and YC advice becomes useful: put a small product into real users' hands and use behavior to learn. Lean Startup frames the MVP as the start of the Build-Measure-Learn loop, while YC explicitly recommends MVPs for getting initial customers and iterating toward product-market fit. ([The Lean Startup](https://theleanstartup.com/principles "The Lean Startup | Methodology"))
7. **Repeat until you have pull.** Continue customer discovery, opportunity discovery and product experiments while testing the rest of the business model: acquisition, pricing, retention and economics. Scaling comes after you've accumulated evidence that customers consistently want the product. YC's startup guidance makes the same point about postponing growth until product-market fit. ([Y Combinator](https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice "YC's essential startup advice"))

So conceptually:

**Idea -> business hypotheses -> customer/problem evidence -> opportunity map -> demand tests -> solution discovery -> MVP -> usage/retention -> product-market fit**

with these tools underneath:

**Blank -> Strategyzer -> Mom Test -> Torres -> Cagan -> Lean Startup / YC**

### One interesting alternative: MIT's 24-step method


If what you want is a **single structured textbook methodology**, Bill Aulet's **Disciplined Entrepreneurship: 24 Steps to a Successful Startup** may actually be closer to what you're looking for than Cagan. MIT uses it as an integrated startup framework covering things such as market segmentation, beachhead market selection, customer research, value proposition, economics and product development. ([Martin Trust Center](https://entrepreneurship.mit.edu/15-368-disciplined-entrepreneurship-lab-de-lab/ "15.368 Disciplined Entrepreneurship Lab (DE Lab)"))

It's more prescriptive than Lean Startup or Cagan. That can be useful when you're sitting with a blank page asking, "What exactly do we do next?"

My preference for a small technical founding team would be:

**Lean LaunchPad structure + Strategyzer experiments + Torres/Cagan product discovery.**

That gives enough structure without turning the startup into a product-management bureaucracy.

If you want, I can next turn this into a concrete **"Idea -> first paying customers" playbook**, with stages, artifacts, questions, exit criteria and experiments for each stage. That would probably be the most useful version for actually running a startup.

## Ideas Generation


Yes. The strongest guides I found point in a similar direction: don't start by brainstorming "startup ideas." Train yourself to notice valuable problems in areas where you have unusually good information.

For a software developer moving into AI engineering, that's a good position to be in. Paul Graham explicitly recommends searching in areas where you have expertise because you can judge whether a problem is real and whether proposed solutions are good. His broader idea is "live in the future, then build what's missing": get close to a rapidly changing technology, use it seriously, and notice gaps that become obvious to you before they become obvious to everyone else. ([Paul Graham](https://www.paulgraham.com/startupideas.html "How to Get Startup Ideas"))

There is also a more formal entrepreneurship framework that maps almost perfectly to your question: Saras Sarasvathy's **Effectuation**. It starts with your existing means: who you are, what you know, and whom you know. Then you make small bets whose downside you can afford, involve customers and partners, and let what you learn shape the opportunity. This framework was developed specifically for decision-making under startup uncertainty. ([Effectuation](https://effectuation.org/ "Effectuation Home Page"))

I'd combine those ideas into the following process.

1. **Build a problem inventory from your own experience.** Go through previous jobs, projects, teams and technologies. Write down things that were slow, expensive, repetitive, unreliable, frustrating, dependent on one expert, or held together with scripts and manual work. Include things people regularly complained about. Graham specifically suggests remembering moments like "why doesn't somebody make X?" and asking what you personally wish somebody else would build. He also warns technical founders about ignoring messy or boring problems; Stripe is his standard example of a problem programmers could see but tended to avoid because payments involved banks, regulation and fraud. ([Paul Graham](https://www.paulgraham.com/startupideas.html "How to Get Startup Ideas"))
2. **Build a second inventory of what has recently become possible.** For AI engineering, think in capabilities rather than products: reliable extraction from messy data, semantic search, code generation and analysis, voice interfaces, vision, tool use, workflows that combine models with deterministic software, evaluation, and human review. Then ask: "Which old problems change significantly because this capability now exists?" This is essentially Graham's "live in the future" method: expertise at a moving technological edge gives you a better chance of noticing missing pieces. ([Paul Graham](https://www.paulgraham.com/startupideas.html "How to Get Startup Ideas")) YC also published a dedicated **How To Get AI Startup Ideas** discussion in 2025, which is a useful AI-specific companion to Graham's older essay. ([Y Combinator](https://www.ycombinator.com/library/M8-how-to-get-ai-startup-ideas "How To Get AI Startup Ideas"))
3. **Look at intersections, not technologies.** For example, "AI observability" is a technology category. A stronger observation would be: "Platform engineers investigating production incidents spend substantial effort reconstructing what changed across deployments, logs, traces and tickets." Then investigate whether that is frequent, painful, expensive and poorly solved. Your technical knowledge helps you see possible solutions; the customer problem determines whether there is a company there. Steve Blank's Customer Discovery method treats these statements as hypotheses that founders must test directly with customers. ([Steve Blank](https://steveblank.com/2009/09/17/the-path-of-warriors-and-winners/ "Steve Blank Customer Development Manifesto: The Path of Warriors and Winners (part 5)"))
4. **Frame each candidate as a problem hypothesis.** I'd use this template:

    **Customer:** Who exactly has the problem?
    **Situation:** When does it happen?
    **Problem:** What are they trying to accomplish, and what gets in the way?
    **Current solution:** How do they handle it today?
    **Cost:** Time, money, risk, lost revenue, headcount, frustration.
    **Why now:** What changed technologically or in the market?
    **Your advantage:** What do you understand or have access to that others may lack?
    **Initial wedge:** What very narrow version could be valuable immediately?

    The narrow customer definition matters. Graham asks essentially: _who wants this right now badly enough to use a rough version from an unknown startup?_ MIT's Disciplined Entrepreneurship reaches the same point more formally through market segmentation, a beachhead market and a concrete end-user profile. ([Paul Graham](https://www.paulgraham.com/startupideas.html "How to Get Startup Ideas"))
5. **Select problems before selecting products.** I would score candidates from 0-3 on seven things: severity of pain, frequency, existing spend or economic consequence, access to users, dissatisfaction with current solutions, a credible "why now," and your founder advantage. Then investigate the highest-scoring few through conversations. The score is only a hypothesis. Blank's model explicitly treats early startup assumptions this way: Customer Discovery exists to test them outside the company, with iteration expected when the assumptions are wrong. ([Steve Blank](https://steveblank.com/2009/09/17/the-path-of-warriors-and-winners/ "Steve Blank Customer Development Manifesto: The Path of Warriors and Winners (part 5)"))
6. **Only then generate solution ideas.** One problem might have ten plausible solutions. Prototype several cheaply. This connects naturally with the Cagan/Torres product discovery methods we discussed earlier. At this point you have moved from "what startup should I create?" to "I understand this customer and problem unusually well; what is the best intervention?"

The mindset change is mostly a change in what you pay attention to.

As an engineer, you're trained to receive a reasonably defined problem and reduce it to a working system. Entrepreneurship moves part of your work upstream: **discovering which problem deserves to be solved in the first place**. Your weekly progress can therefore include evidence such as "I learned why five companies handle this manually," "I found who owns the budget," "three people asked to try a prototype," or "this problem turned out to be a nuisance, so I killed the idea." Blank explicitly describes a startup as a learning and discovery process until the customer and market are understood. ([Steve Blank](https://steveblank.com/2009/09/17/the-path-of-warriors-and-winners/ "Steve Blank Customer Development Manifesto: The Path of Warriors and Winners (part 5)"))

Effectuation adds another useful change: you don't need to predict the perfect market in advance. Start from your actual assets -- your software knowledge, emerging AI knowledge, professional contacts, ability to build prototypes -- and make small experiments whose cost you can tolerate. Expert-entrepreneur research behind Effectuation emphasizes starting with these available means and limiting early bets by what you can afford to lose. ([Effectuation](https://effectuation.org/the-five-principles-of-effectuation-detail "The Five Principles of Effectuation Detail"))

For you specifically, I would spend much less time asking **"What AI product could I build?"** and repeatedly investigate questions such as:

> What have I seen engineers, managers or companies spend absurd amounts of time on?
> What internal tool did somebody build because commercial products were inadequate?
> What requires an expensive specialist mainly to read, search, classify, compare or coordinate information?
> What workflow has five systems and a human moving information between them?
> What problem became solvable only recently because AI capabilities improved?
> What can I see because I understand software systems that a generic entrepreneur would miss?

That is a trainable habit. Graham describes startup ideas as things founders often **notice** because their experience prepared them to recognize the opportunity. ([Paul Graham](https://www.paulgraham.com/startupideas.html "How to Get Startup Ideas"))

For reading, I'd prioritize them in this order:

**Paul Graham, "How to Get Startup Ideas"** -> idea-generation mindset. ([Paul Graham](https://www.paulgraham.com/startupideas.html "How to Get Startup Ideas"))

**Sarasvathy, Effectuation** -> how entrepreneurs reason under uncertainty. ([UVA Darden School of Business](https://www.darden.virginia.edu/effectuation "Effectuation - Overview"))

**Paul Graham, "Schlep Blindness"** -> particularly useful for engineers. ([Paul Graham](https://paulgraham.com/schlep.html?source=techstories.org "Schlep Blindness"))

**Steve Blank, Customer Development** -> turning an interesting observation into evidence. ([Steve Blank](https://steveblank.com/2009/09/17/the-path-of-warriors-and-winners/ "Steve Blank Customer Development Manifesto: The Path of Warriors and Winners (part 5)"))

**MIT Disciplined Entrepreneurship** -> systematic customer/market selection once you have candidate problems.

**YC, "How To Get AI Startup Ideas"** -> current AI-specific discussion. ([Y Combinator](https://www.ycombinator.com/library/M8-how-to-get-ai-startup-ideas "How To Get AI Startup Ideas"))

A useful next step would be to build a **repeatable startup idea generation system specifically for your software + AI background**: an inventory of domains you know, a problem-observation template, an AI capability matrix, an idea scorecard, and a process for going from ~50 observations -> 10 problem hypotheses -> 3 customer investigations -> 1-2 experiments. That would make this operational rather than leaving it as reading material.

## Library sources


- [Productboard 2020](/sources/f6d728dc4e39cd0ac6e470c72f2a0292.bin), *The Product Discovery Playbook*
