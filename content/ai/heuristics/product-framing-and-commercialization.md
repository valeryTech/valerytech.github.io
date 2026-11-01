---
draft: false
toc: true
title: "Framing and Commercializing Product Ideas"
description: "How to turn a capability or workflow observation into a product: choosing a delivery vehicle, separating invention from commercialization, studying how ordinary products were framed and bought, and storyboarding use."
linkTitle: "Framing and Commercializing"
---

Noticing a recurring workflow problem or a useful model capability does not yet define a product. Four choices sit between a promising observation and something people adopt and pay for: which delivery form to build, whether a technical advance belongs in a startup or another vehicle, how to frame the outcome so buyers recognize the problem, and how the product fits the concrete moments of the user's work.

The saved notes behind this guide are in [the case-studies and commercialization dialogue]({{< ref "ai/heuristics/input/product-case-studies-dialogue" >}}) and [the Airbnb storyboarding article]({{< ref "ai/heuristics/input/product-storytelling" >}}).

## Choosing a delivery form


Many ideas start as "an existing product could do X with AI." Because that product belongs to someone else, a builder has to choose a shippable form and weigh who must cooperate before the first user gets value.

| Delivery form | What you ship | Cooperation and cold-start cost | Main defensibility question | Example |
| --- | --- | --- | --- | --- |
| **New product** | A standalone application that replaces or competes with an existing tool | None to launch, high effort to win switching | Why users leave their current system of record | A conversational expense or nutrition tracker; an evidence workspace for auditors |
| **Add-on** | A browser extension, IDE plugin, spreadsheet add-on, or chat bot alongside an existing product | Low if the host exposes an extension surface or clipboard; fragile if platform APIs tighten | Platform risk and native feature absorption by the host vendor | A browser context firewall; a dictation and symbol-grounding helper that pastes into any input field |
| **For the operator** | Software, an SDK, or a workflow engine sold to the company running the product or service | One customer organization and its internal systems (CRM, ERP, GIS) | Procurement cycle, data-integration effort, and whether internal IT builds it | Field-report reconciliation for a utility contractor; guest or resident servicing software |
| **Cross-product layer** | A single layer that spans several applications for one user or across companies | Highest when independent apps must adopt a shared protocol; moderate when read via user-authorized connectors | Solving the multi-party incentive problem so participants gain immediate value | A single reader across several news and community feeds; permissioned cross-app working context |

Two practical rules govern this choice:

- **Count who must cooperate (`M1` in [LLM primitives]({{< ref "ai/heuristics/llm-primitives" >}}#system-parts-around-the-primitives)).** A tool that works over a clipboard or standard file export needs zero outside permission; an operator workflow needs one buyer's messy data; a two-sided interoperability network needs competing vendors to integrate before it helps anyone.
- **Ask why the system-of-record vendor will not ship it next quarter.** Single-app add-ons are easy for an incumbent CRM, ticketing tool, or IDE to bundle natively. Independent products last longer when they sit *across* competing vendors, hold user-owned or cross-organization context that no single vendor is trusted to own, or serve a participant whose incentives differ from the incumbent's buyer.

## Separating invention from commercialization


Technical research in areas such as grounding, evaluation harnesses, context stores, or constrained program synthesis often yields a reusable capability before a specific customer segment is chosen. Innovation research distinguishes **invention** (creating a working technical capability) from **innovation** (combining an invention with adoption and commercialization) ([MIT Orbit](#mit-orbit-innovation); [Chan 2025](#chan-2025)). Successful innovation typically matches technological opportunity with market demand rather than relying on technology push or demand pull alone ([Di Stefano et al. 2012](#di-stefano-2012)).

Treating every useful invention as "therefore build a standalone startup" confuses two separate decisions:

1. **The invention question:** Did this work establish a genuinely new or more reliable capability?
2. **The commercialization question:** Which vehicle captures or spreads its value best—a new venture, a feature inside an existing product, an SDK or license, an IP transfer, open-source infrastructure, or further research until a sharp use case appears?

Empirical work on technology commercialization highlights three cautions for technical founders:

- **Invention and entrepreneurship are complementary skills.** Commercialization performs better when entrepreneurial capability is paired with continued involvement from the inventor than when the inventor commercializes alone without business partnership ([Braunerhjelm and Svensson 2010](#braunerhjelm-2010); [Åstebro and Serrano 2011](#astebro-2011)).
- **Startups are one vehicle among several.** Whether a technology entrepreneur should compete directly in the product market or license and cooperate with incumbents depends on intellectual-property protection and who controls complementary distribution and data assets ([Gans and Stern 2003](#gans-2003)). Startups can excel at commercializing novel university and deep-tech research ([Kolev et al. 2022](#kolev-2022)), yet building a company around an invention without real user pull risks engineering sophisticated solutions to non-existent problems ([Graham 2012](#graham-2012)).
- **Keep reusable layers distinct from point applications.** When one technical layer (such as entity grounding with explicit abstention and provenance) underpins several vertical workflows, prove it inside one narrow, high-pain workflow first rather than selling an abstract horizontal platform on day one.

## Studying how ordinary products were found, framed, and bought


Polished startup summaries compress a messy discovery path into "founder spotted a market, pitched investors, and built the product." Reconstructing how ordinary B2B and consumer software actually took shape—products such as Slack, Calendly, Figma, Notion, or Linear—shows how an internal workaround becomes a market category.

Six questions make product case studies operational:

1. **Genesis:** Why did the builders start making this, and what concrete friction were they solving first?
2. **Problem discovery:** What did they realize the underlying customer problem was once outsiders tried it?
3. **Product thesis:** Why does this specific workflow or interaction design solve it better than existing habits?
4. **Positioning and vision:** What language helped customers recognize a problem they previously tolerated as normal?
5. **Distribution and buying:** How does one user or team adopt it easily, and what controls later persuade an organization to pay?
6. **Defensibility:** What keeps the company valuable once competitors copy the surface interface?

Slack illustrates why these six layers differ from a pitch-deck narrative. Tiny Speck originally built an internal IRC-based communication system with persistent history, search, and integrations for its distributed game studio; only after the game shut down did the team test whether external companies valued that internal tool ([High 2016](#high-2016); [First Round Review](#first-round-slack)). Roughly 70–80% of early prospects reported using "nothing" for team messaging—meaning fragmented email lists, SMS, and ad-hoc chat—so Slack had to teach buyers to recognize fragmented team communication as a solvable cost ([First Round Review](#first-round-slack)). Stewart Butterfield's internal memo *We Don't Sell Saddles Here* framed the product around organizational outcomes—searchable knowledge, lower communication overhead, and faster decisions—rather than group-chat features ([Butterfield 2013](#butterfield-2013)). Bottom-up team adoption avoided upfront enterprise procurement, while security, administration, and compliance controls later enabled company-wide enterprise deals ([Thompson 2019](#thompson-2019)).

| Source | Best use when studying existing products |
| --- | --- |
| **First Round Review** | Early-customer discovery, positioning shifts, launch mechanics, and retention signals ([First Round Review](#first-round-slack)) |
| **Acquired** | Full company history: founding context, pivots, financing, unit economics, and competitive arcs ([Gilbert and Rosenthal](#gilbert-slack)) |
| **Stratechery** | Market structure, bottom-up SaaS distribution, platform bundling, and incumbent threats ([Thompson 2019](#thompson-2019)) |
| **Lenny's Newsletter** | Comparative B2B product-market-fit patterns across dozens of founders and product leads ([Rachitsky](#rachitsky-pmf)) |
| **Contrary Research** | Structured breakdowns of mid-stage B2B companies: product, business model, competition, and risks ([Contrary Research](#contrary-research)) |
| **Not Boring** | Investor-side narratives on how a focused wedge could expand into a larger category ([McCormick](#mccormick-slack)) |

## Storyboarding the user's experience


Once a candidate problem and workflow step are chosen, writing feature lists in a spreadsheet often hides what happens around the software. Storyboarding maps the end-to-end human episode—who the people are, where they are standing, what information is missing or noisy, how they feel at the moment of truth, and what happens before and after they touch the screen.

Airbnb used Disney-style storyboarding ("Project Snow White") across its guest, host, and hiring journeys to force concrete design choices—such as how tired guests feel arriving at a listing with luggage—which revealed that most of the customer experience happened offline and made mobile messaging and on-trip tools the company's central priority ([Kessler 2012](#kessler-2012)).

For AI products, storyboarding is particularly effective at exposing **handoff and failure moments**:

- **Where the input is captured:** Is the user at a desk with clean text, or on a noisy street dictating with gloves on?
- **What happens when the model is uncertain or wrong:** Does a supervisor see the conflicting records side by side, or does a plausible-sounding draft hide a missing fact?
- **Who bears the review burden:** Does the person asked to check or confirm the output gain immediate value in that same moment, or are they doing clerical cleanup for someone else's report?

## References


- Åstebro, T. and Serrano, C. J. (2011). [Business Partners, Financing, and the Commercialization of Inventions](https://www.nber.org/papers/w17181). NBER Working Paper 17181. ^astebro-2011
- Braunerhjelm, P. and Svensson, R. (2010). [The inventor's role: was Schumpeter right?](https://ideas.repec.org/a/spr/joevec/v20y2010i3p413-444.html). Journal of Evolutionary Economics, 20(3), 413-444. ^braunerhjelm-2010
- Butterfield, S. (2013). [We Don't Sell Saddles Here](https://www.nfx.com/post/slack-memo). Internal memo, reproduced via NFX. ^butterfield-2013
- Chan, V. (2025). [The spark of innovation and the commercialization journey](https://news.mit.edu/2025/spark-of-innovation-commercialization-journey-vanessa-chan-0408). MIT News. ^chan-2025
- Contrary Research. [Company Research Breakdowns](https://research.contrary.com/). ^contrary-research
- Di Stefano, G., Gambardella, A., and Verona, G. (2012). [Technology push and demand pull perspectives in innovation studies: Current findings and future research directions](https://www.sciencedirect.com/science/article/pii/S0048733312000820). Research Policy, 41(8), 1283-1295. ^di-stefano-2012
- First Round Review. [How Did Slack Grow So Fast? Inside the Epic Launch Strategy](https://review.firstround.com/from-0-to-1b-slacks-founder-shares-their-epic-launch-strategy/). ^first-round-slack
- Gans, J. S. and Stern, S. (2003). [The product market and the market for "ideas": commercialization strategies for technology entrepreneurs](https://www.sciencedirect.com/science/article/pii/S0048733302001038). Research Policy, 32(2), 333-350. ^gans-2003
- Gilbert, B. and Rosenthal, D. [The Slack DPO](https://www.acquired.fm/episodes/the-slack-dpo). Acquired Podcast. ^gilbert-slack
- Graham, P. (2012). [How to Get Startup Ideas](https://www.paulgraham.com/startupideas.html). ^graham-2012
- High, P. (2016). [Slack's CEO On The Future Of The Fastest Growing Workplace Software Ever](https://www.forbes.com/sites/peterhigh/2016/11/07/slacks-ceo-on-the-future-of-the-fastest-growing-workplace-software-ever/). Forbes. ^high-2016
- Kessler, S. (2012). [How Snow White Helped Airbnb's Mobile Mission](https://www.fastcompany.com/3002813/how-snow-white-helped-airbnbs-mobile-mission). Fast Company. ^kessler-2012
- Kolev, J., Kreamer, A., and Nanda, R. (2022). [Of Academics and Creative Destruction: Startup Advantage in the Process of Innovation](https://www.nber.org/papers/w30362). NBER Working Paper 30362. ^kolev-2022
- McCormick, P. [Slack: The Bulls are typing...](https://www.notboring.co/p/slack-the-bulls-are-typing-audio). Not Boring. ^mccormick-slack
- MIT Orbit. [What is innovation?](https://orbit-kb.mit.edu/hc/en-us/articles/360040104151-What-is-innovation/). MIT Martin Trust Center. ^mit-orbit-innovation
- Rachitsky, L. [A guide for finding product-market fit in B2B](https://www.lennysnewsletter.com/p/finding-product-market-fit). Lenny's Newsletter. ^rachitsky-pmf
- Thompson, B. (2019). [Microsoft, Slack, Zoom, and the SaaS Opportunity](https://stratechery.com/2019/microsoft-slack-zoom-and-the-saas-opportunity/). Stratechery. ^thompson-2019
