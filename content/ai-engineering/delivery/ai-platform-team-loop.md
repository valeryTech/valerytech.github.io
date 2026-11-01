---
draft: false
toc: true
title: "AI Platform from the Team's Delivery Loop"
description: "Derives AI platform capabilities from what a product team does as it discovers, prototypes, validates, ships, operates, and improves an AI feature, instead of starting from a list of components."
document_status: "draft"
linkTitle: "Team Delivery Loop"
---

**Question:** where should the capabilities of an AI platform come from?

Most AI platform maps start from components: a gateway, a vector database, an evaluation platform. This note starts from the loop a feature team goes through with an AI feature, and derives the capabilities each step needs. No standard AI platform taxonomy is organized this way; the examples below come closest.

## The loop


| Team activity | Questions the team is answering | Platform capabilities that follow |
| --- | --- | --- |
| Discover | Is AI appropriate? Which model? Can we get the data? What quality is possible? | Model playground, data discovery and access, experiment environment, baseline evaluations, cost estimates |
| Prototype | Can we make the behavior work? | Model APIs, prompt and configuration management, RAG, tool and agent runtime, tracing, quick evaluations |
| Validate | Is it good enough for users? What are the failure modes? | Datasets, evaluation harness, human review, safety testing, experiment comparison |
| Productionize | How do we ship this safely? | Templates, CI/CD, evaluation gates, model gateway, secrets, deployment, IAM |
| Operate | Is it working in production? | Traces, quality monitoring, latency and cost, alerts, audit, rate limits |
| Learn and iterate | What should we change next? | Production feedback turned into evaluation datasets, replay, experiment history, A/B testing |

The first three rows are the subject of the [AI discovery platform]({{< ref "ai-engineering/delivery/ai-platform-discovery" >}}). The last three match the [delivery capabilities]({{< ref "engineering/platform/delivery-capabilities" >}}).

## The definition that follows


> An AI platform is the set of shared capabilities that remove repeated work and cognitive load from a product team's discovery -> delivery -> operation loop.

**Consequence: the platform boundary becomes empirical.**

- If several teams keep struggling to build a representative evaluation set during discovery, that is evidence for an evaluation-data capability.
- If no team needs fine-tuning, a fine-tuning platform does not go on the map just because other platforms have one.

The approach combines platform as a product, Team Topologies, and AI product discovery. It is the AI case of [product-driven platform design]({{< ref "engineering/platform/product-framing" >}}#product-driven-platform-design).

## Platforms built this way


- **Spotify ML Platform:**
  - starts from the ML practitioner's end-to-end journey;
  - connected the workflow from experimentation to production as a walking skeleton: support the complete path first, then deepen individual capabilities based on observed needs;
  - used practitioner research to find gaps in the journey.
- **Shopify Merlin:** describes the platform as a developer journey: create project -> prototype -> productionize -> automate -> iterate. It introduces each infrastructure capability in terms of what the team needs at that step.
- **Doctolib Data & AI Platform:**
  - platform product managers continuously interview feature teams, co-build proofs of concept, and observe where teams get stuck;
  - those problems become an opportunity backlog, then platform capabilities and reusable accelerators;
  - the stated goal is to take a feature team from an AI use case to a running product through guided, reusable paths.
- **Thoughtworks, *Effective Machine Learning Teams*:** the broader method. It combines product discovery, experimental ML development, continuous delivery, and Team Topologies, and discusses dual-track discovery and delivery and the organizational structures around ML delivery.

Spotify and Doctolib appear closest to operating this way.

## Open work


- Build a reference AI team journey: discovery and delivery stages, activities, pain points, platform capabilities, and ownership boundaries. It should give a better AI platform map than ecosystem diagrams do.
- Compare it with the component-first [AI platform capability map]({{< ref "ai-engineering/delivery/ai-platform-capabilities" >}}): capabilities on the map that no step of the journey needs are candidates to defer.

## Related notes


- [AI discovery platform]({{< ref "ai-engineering/delivery/ai-platform-discovery" >}}): discover, prototype, and validate as a platform of their own.
- [Delivery capabilities]({{< ref "engineering/platform/delivery-capabilities" >}}): productionize, operate, and learn.
- [AI platform capability map]({{< ref "ai-engineering/delivery/ai-platform-capabilities" >}}): the component-first view.
- [Platform primitives]({{< ref "ai-engineering/delivery/reuse" >}}): reusable components and a build order.
- [Development approaches and modes]({{< ref "ai-engineering/delivery/df-development-approach" >}}): walking skeletons and prototypes as development modes.
- [Platform engineering and developer experience]({{< ref "engineering/platform/developer-experience" >}}): golden paths and cognitive load.

## Sources


- [Product Lessons from ML Home: Spotify's One-Stop Shop for Machine Learning](https://engineering.atspotify.com/2022/1/product-lessons-from-ml-home-spotifys-one-stop-shop-for-machine-learning) -- Spotify Engineering, 2022.
- [The Magic of Merlin: Shopify's New Machine Learning Platform](https://shopify.engineering/merlin-shopify-machine-learning-platform) -- Shopify Engineering.
- [From One AI Product to an AI Factory](https://medium.com/doctolib/from-one-ai-product-to-an-ai-factory-e6337ffa75d9) -- Doctolib, on Medium.
- [*Effective Machine Learning Teams*, chapter 1](https://www.thoughtworks.com/content/dam/thoughtworks/documents/e-book/EffectiveMLTeams_Ch1_Updated.pdf) -- Thoughtworks.

## Library sources


- [Tan, Leung, and Colls 2024](/sources/70b69df084508ef62121bd0664a1d392.bin), *Effective Machine Learning Teams* -- part I, dual-track delivery and continuous discovery
- AI agent platform book, *O'Reilly early release, chapter 3* -- minimum viable platform capabilities and the 30-minute productive benchmark
