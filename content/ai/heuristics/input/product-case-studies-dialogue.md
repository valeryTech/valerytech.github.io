---
draft: false
toc: true
title: "Product Case Studies and Commercialization (Saved Dialogue)"
description: "Saved dialogue on who publishes detailed analyses of how ordinary products such as Slack were found, framed, and sold, and how technical inventions relate to startup commercialization."
linkTitle: "Product Case Studies (Dialogue)"
---
# Product case studies (saved dialogue)


A question and answer, kept as they were written, on where to read how ordinary products were found, framed, sold to investors, and bought, followed by a synthesis on commercializing technical inventions. The distilled guide version is in [Framing and commercializing product ideas]({{< ref "ai/heuristics/product-framing-and-commercialization" >}}).

## Question


who is making detailed analysis and review of products? Not revolutionary, but usual ones -- like, I don't understand how the people came to the Slack idea, how they frame it, sell it to investors, make a vision and why people (or corporations) go for it?

## Answer


Yes. What you're looking for exists, but it is split across several kinds of analysis. For your purpose, I'd use these sources:

- **First Round Review** -- probably the closest match. Detailed founder/operator case studies about how the idea developed, first customers, product-market fit, positioning, launch, metrics, and distribution. Their Slack piece is especially good: Slack tested with progressively larger companies, discovered how team adoption differed from individual adoption, educated customers about a category they didn't even realize they needed, and identified the behaviors correlated with retention. ([First Round](https://review.firstround.com/from-0-to-1b-slacks-founder-shares-their-epic-launch-strategy/ "How Did Slack Grow So Fast? Inside the Epic Launch Strategy")) [Slack: From 0 to $1B -- First Round Review](https://review.firstround.com/from-0-to-1b-slacks-founder-shares-their-epic-launch-strategy/)
- **Acquired -- Ben Gilbert and David Rosenthal** -- best for the entire company story: founders, financing, pivots, market, business model, competition, strategic mistakes and eventual outcome. Their Slack episode gives the full company treatment, and the later Salesforce episode looks at Slack through the enterprise SaaS and investor lens. ([Acquired](https://www.acquired.fm/episodes/the-slack-dpo "The Slack DPO | Acquired")) [Acquired: The Slack DPO](https://www.acquired.fm/episodes/the-slack-dpo)
- **Stratechery -- Ben Thompson** -- best for your question "why would companies actually buy this?" He analyzes market structure, distribution, enterprise buying, platforms and competition. His Slack analysis explains why free SaaS and bottom-up adoption changed enterprise software distribution, and why Microsoft Teams remained such a serious threat despite Slack having a strong product. ([Stratechery by Ben Thompson](https://stratechery.com/2019/microsoft-slack-zoom-and-the-saas-opportunity/ "Microsoft, Slack, Zoom, and the SaaS Opportunity - Stratechery by Ben Thompson")) [Microsoft, Slack, Zoom, and the SaaS Opportunity](https://stratechery.com/2019/microsoft-slack-zoom-and-the-saas-opportunity/)
- **Lenny Rachitsky / Lenny's Newsletter & Podcast** -- best for reconstructing the founder/product process across many companies: "What did you initially believe?", "How did you find the first customer?", "When did you know there was product-market fit?", "What changed?" His B2B PMF study includes Slack alongside Figma, Airtable and others. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/finding-product-market-fit "A guide for finding product-market fit in B2B")) [Finding product-market fit in B2B](https://www.lennysnewsletter.com/p/finding-product-market-fit)
- **Contrary Research** -- closer to an investment-research report: founding story, product, market, competition, business model, funding, risks. It's useful when you want to study many "normal" B2B companies systematically, including things like Common Room and Coda. ([Contrary Research](https://research.contrary.com/company/common-room "Report: Common Room Business Breakdown & Founding Story | Contrary Research")) [Contrary Research](https://research.contrary.com/)
- **Not Boring -- Packy McCormick** -- useful for understanding the investor narrative: "Why might this become much bigger than it currently appears?" His long Slack investment thesis is explicitly that kind of exercise. ([Not Boring](https://www.notboring.co/p/slack-the-bulls-are-typing-audio "Slack: The Bulls are typing... (Audio)")) [Not Boring](https://www.notboring.co/)

For Slack specifically, there's an even better primary source for the part you're most puzzled about: Stewart Butterfield's internal memo **"We Don't Sell Saddles Here."**

That document is almost exactly about:

> We built this thing. But what exactly are we selling? What should customers believe they're buying? What market are we creating?

Butterfield sent it internally in July 2013, shortly before Slack's preview release. The core idea was that they shouldn't think of themselves as selling a group-chat application. They needed to sell the outcome: lower communication cost, searchable organizational knowledge, faster decisions, less email, and eventually a different way of working. Slack's former CMO later described the memo as setting the strategic plan around defining and owning a new market. ([Building Slack](https://buildingslack.com/you-asked/ "You asked: We don't sell saddles here"))

[Read "We Don't Sell Saddles Here" via NFX](https://www.nfx.com/post/slack-memo)

And Slack's actual story is useful because it's much messier than the polished startup narrative.

They didn't sit down and say:

```text
Problem: workplace communication
Market: $X billion
Solution: Slack
→ pitch investors
→ build product
```


Tiny Speck was building a game called Glitch. Because the team was distributed across Vancouver, San Francisco, New York and elsewhere, they relied heavily on IRC and gradually built their own communication system around it: persistent message history, search, integrations and other features. When Glitch failed, the founders realized that none of them wanted to work without this internal system. That became the starting point for Slack. ([Forbes](https://www.forbes.com/sites/peterhigh/2016/11/07/slacks-ceo-on-the-future-of-the-fastest-growing-workplace-software-ever/ "Slack's CEO On The Future Of The Fastest Growing Workplace Software Ever"))

So:

```text
experienced problem themselves
        ↓
built internal solution
        ↓
used it for years
        ↓
original company failed
        ↓
noticed internal tool was unusually valuable
        ↓
hypothesis:
"maybe other teams would want this"
        ↓
tested with ~6–10 friendly companies
        ↓
observed usage
        ↓
changed product
        ↓
tested with larger teams
        ↓
developed positioning
        ↓
created market narrative
        ↓
public launch
```


That's much more useful to study than the simplified "founder had a Slack idea" story. ([First Round](https://review.firstround.com/from-0-to-1b-slacks-founder-shares-their-epic-launch-strategy/ "How Did Slack Grow So Fast? Inside the Epic Launch Strategy"))

The investor part is also atypical. Slack wasn't an unknown founder pitching a PowerPoint about workplace chat. Tiny Speck had already raised substantial funding for Glitch from investors including Accel and Andreessen Horowitz. When Glitch shut down, Butterfield offered to return remaining capital; some investors backed the team through the pivot. Accel's Andrew Braccia later described the investment as fundamentally being in the team. ([TechCrunch](https://techcrunch.com/2019/05/30/the-slack-origin-story/ "The Slack origin story | TechCrunch"))

Then comes perhaps the part most relevant to your own research.

Slack discovered that most potential customers weren't saying:

> "We desperately need a better group-chat product."

First Round reports that only around 20-30% of early users came from things like IRC, Campfire or HipChat. Many of the others said they were using "nothing." In practice, "nothing" meant email lists + Hangouts + SMS + Skype + assorted other tools. Slack therefore had to help customers **recognize the problem as a problem**. ([First Round](https://review.firstround.com/from-0-to-1b-slacks-founder-shares-their-epic-launch-strategy/ "How Did Slack Grow So Fast? Inside the Epic Launch Strategy"))

That produces a much more sophisticated product process:

```text
technical capability
      ↓
observe a useful behavior
      ↓
identify the underlying problem
      ↓
find people with that problem
      ↓
learn how they currently solve it
      ↓
build a better solution
      ↓
find language that lets them
recognize why they need it
      ↓
make adoption easy
      ↓
measure whether behavior changes
      ↓
expand the vision
```


And then why corporations adopt it is another layer again.

Early Slack could spread bottom-up: one team could start using it without a company-wide software procurement exercise. Later, Slack built the security, administration, integrations and enterprise controls necessary for central IT to approve it. Target is a good example: engineers were already independently using Slack, and employee demand contributed to leadership adopting Enterprise Grid. Security capabilities were part of the enterprise case. ([Slack](https://slack.com/customer-stories/target-unlocks-innovation-collaboration "Target integrates Slack to unlock grassroots innovation, collaboration | Slack"))

So there are actually **six questions** I'd use when studying products:

```text
1. Genesis
Why did someone start building this?

2. Problem discovery
What did they eventually realize the actual problem was?

3. Product thesis
Why should this particular solution work?

4. Positioning / vision
How did they explain what world becomes possible
if the product succeeds?

5. Distribution / buying
Who starts using it, who pays, and why?

6. Business / investor thesis
Why could this become a large and defensible company?
```


This is also a good framework for studying something like **Helper**. Instead of only researching "personalized AI assistants," you can take 20-30 successful, fairly ordinary SaaS/B2C products -- Slack, Dropbox, Notion, Linear, Calendly, Superhuman, Figma, Intercom, HubSpot, Rippling, Grammarly, etc. -- and reconstruct those six questions for each.

For that project, I'd start with **First Round Review + Acquired + original founder memos/interviews + Stratechery**. Together they give you much more of the actual reasoning process than standard "startup success story" articles.

## inventions roles


Whether invention should be viewed as an entrepreneurial output, and where that framing becomes dangerous.

The most useful ones are:

|Article|Position|Why it's relevant|
|---|---|---|
|**Braunerhjelm & Svensson -- "The Inventor's Role: Was Schumpeter Right?"**[Read](https://ideas.repec.org/a/spr/joevec/v20y2010i3p413-444.html)|Strongly balanced|Probably the best one for you. It explicitly separates **invention -> innovation/commercialization**. Their empirical result is striking: commercialization performs better when an entrepreneur commercializes the invention than when the inventor does it alone, while continued involvement by the inventor also improves performance. In other words: _inventor knowledge + entrepreneurial capability_ appears better than either alone. ([IDEAS/RePEc](https://ideas.repec.org/a/spr/joevec/v20y2010i3p413-444.html "The inventor's role: was Schumpeter right?"))|
|**Gans & Stern -- "The Product Market and the Market for Ideas"** [Read](https://www.sciencedirect.com/science/article/pii/S0048733302001038)|Balanced / strategic|An invention doesn't imply "I need to build a startup around it." A technology entrepreneur can build a company that sells the product, license/sell the technology, or cooperate with incumbents. The right path depends partly on IP protection and the complementary assets needed to commercialize it. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0048733302001038 "The product market and the market for "ideas": commercialization strategies for technology entrepreneurs - ScienceDirect"))|
|**MIT -- "What is innovation?"** [Read](https://orbit-kb.mit.edu/hc/en-us/articles/360040104151-What-is-innovation/)|Useful conceptual distinction|MIT Trust Center uses a very clean definition: innovation is essentially **invention × commercialization/adoption**. Their point is that an invention sitting in a lab hasn't yet produced an innovation in the economic sense. ([Orbit KnowledgeBase](https://orbit-kb.mit.edu/hc/en-us/articles/360040104151-What-is-innovation/ "What is innovation?"))|
|**MIT -- "The spark of innovation and the commercialization journey"** [Read](https://news.mit.edu/2025/spark-of-innovation-commercialization-journey-vanessa-chan-0408)|Cautionary|Very relevant to research-driven entrepreneurship. Vanessa Chan's argument is that technical invention is the beginning; deployment, manufacturing, market entry and adoption are separate problems. ([MIT News](https://news.mit.edu/2025/spark-of-innovation-commercialization-journey-vanessa-chan-0408 "The spark of innovation and the commercialization journey \| MIT News \| Massachusetts Institute of Technology"))|
|**Kolev et al. -- "Of Academics and Creative Destruction: Startup Advantage in the Process of Innovation"** [Read](https://www.nber.org/papers/w30362)|Positive|Evidence that startups can be particularly effective vehicles for commercializing research. In their university-research sample, startup-associated patents had stronger forward-citation and outlier-patent outcomes. ([National Bureau of Economic Research](https://www.nber.org/papers/w30362 "Of Academics and Creative Destruction: Startup Advantage in the Process of Innovation \| NBER"))|
|**Åstebro & Serrano -- "Business Partners, Financing, and the Commercialization of Inventions"** [Read](https://www.nber.org/papers/w17181)|Cautionary / positive|Very relevant to the "inventor becomes founder" question. In invention-based ventures, projects with business partners had much better commercialization results; even after statistical controls, partners materially increased commercialization probability and expected revenue. Technical invention alone wasn't enough. ([National Bureau of Economic Research](https://www.nber.org/papers/w17181 "Business Partners, Financing, and the Commercialization of Inventions \| NBER"))|
|**Paul Graham -- "How to Get Startup Ideas"** [Read](https://paulgraham.com/startupideas.html)|Negative counterweight|The classic argument against making invention the objective of a startup: founders easily build sophisticated solutions to problems that don't exist. Graham argues that paying attention to actual users is the safeguard. ([paulgraham.com](https://paulgraham.com/startupideas.html "How to Get Startup Ideas"))|
|**Di Stefano et al. -- "Technology push and demand pull perspectives in innovation studies"**[Read](https://www.sciencedirect.com/science/article/pii/S0048733312000820)|Balanced|A research review of exactly the tension we're discussing: **technology push**starts from new technical capabilities; **demand pull** starts from market needs. Their conclusion is broadly that successful innovation involves matching technological opportunities with demand, rather than treating either source as sufficient. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0048733312000820 "Technology push and demand pull perspectives in innovation studies: Current findings and future research directions - ScienceDirect"))|
|**"Solutions in Search of a Problem: A Defense"** [Read](https://laprade.blog/solutions-in-search-of-a-problem)|Pro-invention counterargument|This is an essay rather than academic evidence, but it's a useful antidote to simplistic "always start with the problem" advice. It points out that some foundational technologies began as discoveries or inventions without an obvious commercial application. ([laprade.blog](https://laprade.blog/solutions-in-search-of-a-problem "Solutions in Search of a Problem: A Defense"))|

There is also a recent 2024 paper that fits your question well: **"Inventions, commercialization strategies, and knowledge spillovers in SMEs."** It explicitly compares creating a new firm, commercializing inside an existing firm, and licensing/selling the invention. It finds licensing/selling particularly effective for knowledge diffusion and also finds some support for new ventures as a vehicle for spillovers. ([IDEAS/RePEc](https://ideas.repec.org/a/kap/sbusec/v63y2024i1d10.1007_s11187-023-00812-z.html "Inventions, commercialization strategies, and knowledge spillovers in SMEs")) [Read the paper record](https://www.ifn.se/en/publications/scientific-articles-in-english/2024/2024-12/)

The synthesis I get from these is slightly different from the model I gave you before.

An invention isn't merely another intermediate step toward a startup. It is an **asset with several possible commercialization paths**:

```text
research
   ↓
new knowledge
   ↓
invention / new capability
   ↓
   ├── build startup around it
   ├── incorporate into another product
   ├── license it
   ├── sell/IP transfer
   ├── open source it → reputation/ecosystem
   └── continue research until an application emerges
```


And that gives you two independent questions:

```text
1. INVENTION QUESTION
Did I create a new and useful capability?

2. ENTREPRENEURSHIP QUESTION
Is there a valuable opportunity to commercialize it,
and what is the best mechanism for doing so?
```


I think that distinction is particularly useful for your research program. It means you shouldn't force every research direction into a preselected customer problem. Some of your work on agent architectures, memory/context, evaluation, long-running execution, etc. could generate a capability first and reveal applications afterward.

But you also shouldn't conclude:

> valuable invention -> valuable startup.

The research above strongly suggests a chain closer to:

```text
             invention quality
                    +
         commercially relevant use
                    +
        appropriate commercialization
                    +
    entrepreneurial/product capability
                    ↓
               economic value
```


The Braunerhjelm-Svensson paper is especially important here. It effectively says that **inventing and entrepreneurial commercialization are complementary capabilities**, and there can be an advantage in keeping the inventor involved without expecting the inventor alone to perform every entrepreneurial function. ([IDEAS/RePEc](https://ideas.repec.org/a/spr/joevec/v20y2010i3p413-444.html "The inventor's role: was Schumpeter right?"))

So I would slightly revise your Level-1 thinking from our previous discussion. You may actually have **two legitimate high-level outputs** from your AI work:

```text
AI research / engineering
        │
        ├──→ valuable inventions
        │
        └──→ successful companies/products
```


with the strongest path sometimes being:

```text
research → invention → startup
```


but sometimes:

```text
research → invention → licensing / adoption / platform / open source
```


That gives invention independent value without confusing technical novelty with entrepreneurial success.

If you only read three, I'd read **Braunerhjelm & Svensson -> Gans & Stern -> Paul Graham**. Together they give you the inventor, commercialization-strategy, and market-demand sides of the argument.
