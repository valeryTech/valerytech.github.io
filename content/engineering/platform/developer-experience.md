---
draft: false
toc: true
title: "Platform Engineering and Developer Experience"
description: "Platform engineering as a product for developers: the narrow-conduit idea, golden paths, self-service and its limits, platform teams, standards and enforcement, measuring delivery and developer experience, and the same ideas in AI work."
linkTitle: "Developer Experience"
---

Part of [platform and delivery]({{< ref "engineering/platform" >}}).

**Question:** how do you make the right way to build, ship, and run software also the easiest way, without making every team an expert in infrastructure?

## The narrow conduit


The Twelve-Factor maintainers call it the *narrow-conduit principle*: a clear, small contract between application and platform lets each side shed cognitive load. Application teams stop reasoning about machines; platform teams stop reasoning about each application. See the [community refresh]({{< ref "engineering/platform/twelve-factor" >}}#twelve-factor-community-refresh-2024-onward).

Developer experience is how that contract feels from the application side:

- how quickly a developer gets feedback;
- how much they must know to ship;
- how often they are interrupted by work that is not theirs.

## Platform as a product


Treat the internal platform as a product whose users are developers:

- **Research the users.** Understand what slows teams down before building capabilities.
- **Make adoption optional where possible.** A platform people choose is evidence it helps; a mandated one hides that signal.
- **Manage it like a product.** Give it a roadmap, a way to deprecate and sunset capabilities, and support.

[Platform product framing]({{< ref "engineering/platform/product-framing" >}}) covers the step before: agreeing on what the platform is for, whom it serves, and where its boundaries are.

Fournier and Nowland focus on this product and leadership side. Chankramath et al. cover building the platform itself: software-defined capabilities, a control plane, policy as code, observability, and a developer portal.

**Internal developer platform versus developer portal:**

- The **platform** is the set of capabilities: provisioning, pipelines, runtime, observability.
- The **portal**, such as Backstage, is one interface to them, typically a service catalog with templates and documentation.

A portal without the capabilities behind it is a directory.

## Golden paths


A golden path, or paved road, is a supported way to do a common task that already includes the non-functional requirements: logging, configuration, security, tracing.

The [golden-path notes]({{< ref "engineering/delivery-techniques/llm-golden-paths" >}}) give three AI templates: observable RAG, deterministic agent, and eval harness. Their constraints make two choices explicit:

- **Copy, don't share:** prefer scaffolding copied into a project over a large internal library. In microservice terms, a [service template rather than a chassis]({{< ref "system-design/elements/operating-services" >}}#cross-cutting-concerns).
- **One opinionated stack:** pick one stack per template; flexibility slows teams down here.

Golden paths are the platform's version of [defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}): a default that covers most cases, with a known way off the path.

The AI agent platform book (chapter 2) describes templates as walking skeletons for common application patterns. They cover the lifecycle from development through evaluation, deployment, and monitoring, and the platform encourages them rather than forcing them. The book calls the opposite the *golden cage*: a golden path that allows no deviation, so teams cannot solve problems the platform did not anticipate.

## Self-service and its limits


Self-service moves operational work to the teams that deploy and run code. The excerpts below make the counterpoint: self-service has limits, and it needs a strong central team building the ecosystem that other teams operate in. Without that team, every team rebuilds the same infrastructure badly.

Google's release engineering is an early example: release engineers build the tools and practices, and product teams decide how often and when to release (Beyer et al. 2016, chapter 8, "Self-Service Model").

The AI agent platform book (chapter 2) lists ways self-service fails:

- **Self-service with approval:** every approval step slows the teams that deliver value.
- **Obscure self-service:** the capability exists, but it is too complex, poorly documented, or slow and flaky to use, so teams treat the platform as a black box.
- **Backlog coupling:** teams wait on the platform team's backlog before they can deliver.
- **Enforcing mandates instead of winning adoption:** a mandate often hides user needs the platform does not meet.

[GitOps]({{< ref "engineering/platform/gitops" >}}) gives self-service a reviewable interface: a team changes a declaration through a pull request, and the platform applies it.

## Standards and enforcement


The [engineering operating model]({{< ref "engineering/platform/standards-layers" >}}) sketches four layers:

1. What engineers must do.
2. How repositories and pipelines enforce it.
3. What a service must satisfy before production.
4. How effectiveness is measured.

**How the platform carries it:**

- **Layer 2:** templates, CI checks, and [policy as code]({{< ref "engineering/platform/infrastructure-as-code" >}}#modules-policy-and-review).
- **Layer 3:** the app-platform contract in [Twelve-Factor]({{< ref "engineering/platform/twelve-factor" >}}): configuration, health and readiness, telemetry, and identity.

## Measuring it


- **Delivery performance (DORA):** deployment frequency, lead time for changes, change failure rate, and time to restore service. The [deployment notes]({{< ref "engineering/platform/deployment" >}}#definition-and-measures) record deployment frequency as one of them.
- **Developer experience:** Noda, Storey, Forsgren, and Greiler (2023) describe three dimensions: feedback loops, cognitive load, and flow state. Measure them with developer surveys alongside system data.
- **Platform adoption:** how many teams use each capability, and how long a new service takes to reach production.

Chankramath et al. (chapter 3) group a platform's shared measures in three:

- **Adoption:** onboarding time, time to first production deployment, and adoption rate.
- **Developer sentiment:** regular surveys whose results visibly feed the platform roadmap.
- **Effectiveness:** DORA measures adapted to the platform. Examples are lead time including the wait for dependencies from other teams, deployment time through the starter-kit pipelines, mean time to detect and to recover, and change failure rate between environments.

The AI agent platform book (chapter 3) sets a concrete target for time to first deployment: a new developer goes from nothing to a customized agent running in production within 30 minutes.

## In AI work


The same ideas appear in the AI engineering notes:

- [Reusable AI infrastructure]({{< ref "ai-engineering/delivery/reuse" >}}) lists developer-experience capabilities: internal AI SDKs, application blueprints, and a playground and debugger.
- It places a model gateway in front of every application as the control plane for model access; see the [model gateway designs]({{< ref "ai-engineering/delivery/patterns/model-gateway" >}}).
- The [AI project foundation]({{< ref "projects/ai-dev-foundation/starter-kit-and-foundation" >}}) starts a shared starter kit from evaluation, system execution, and configuration.
- The [AI platform capability map]({{< ref "ai-engineering/delivery/ai-platform-capabilities" >}}) gives a scorecard and a maturity model. The [team delivery loop]({{< ref "ai-engineering/delivery/ai-platform-team-loop" >}}) derives the platform's capabilities from what feature teams struggle with.
- The AI agent platform book (chapter 3) names a minimum viable platform: access to foundation models, an application runtime, an agent framework, prototyping UIs, data persistence, enterprise authentication, and project templates. Self-service portals, CI/CD, evaluation management, tracing, guardrails, and A/B tests and canaries come when applications scale to production.

## Leads to


- [Control plane]({{< ref "system-design/elements/control-plane" >}}): a platform is managed through one.
- [Operating services]({{< ref "system-design/elements/operating-services" >}}): the per-service needs a platform solves once.
- [GitOps]({{< ref "engineering/platform/gitops" >}}) and [infrastructure as code]({{< ref "engineering/platform/infrastructure-as-code" >}}): the mechanisms behind self-service.

## Collected excerpts


These passages were collected in the Kubernetes and deployment notes and moved here because they are about platform teams rather than the tools.

### From the Kubernetes notes


The original note does not record the source.

Rather than being concentrated in a single operations team that services other teams,

ops expertise will become distributed among many teams.

Each development team will need at least one ops specialist, responsible for the health

of the systems or services the team provides. They will be a developer as well, but they

will also be the domain expert on networking, Kubernetes, performance, resilience,

and the tools and systems that enable the other developers to deliver their code to the

cloud.

Developer Productivity Engineering

The point is that self-service has its limits, and the aim of DevOps is to speed up

development teams, not slow them down with unnecessary and redundant work.

Yes, a large part of traditional operations can and should be devolved to other teams,

primarily those that deploy code and respond to code-related incidents. But to enable

that to happen, there needs to be a strong central team building and supporting the

DevOps ecosystem in which all the other teams operate.

Instead of calling this team operations, we like the name developer productivity engi‐

neering. Some organizations call this role platform engineer or maybe even DevOps

engineer. The point is that these teams do whatever is necessary to help other software

engineering teams do their work better and faster: operating infrastructure, building

tools, busting problems.

And while developer productivity engineering remains a specialist skill set, the engi‐

neers themselves may move outward into the organization to bring that expertise

where it's needed.

### From the deployment notes


From the deployment chapter of Newman's *Building Microservices*.

As containers started gaining traction, many people started looking at solutions for how to manage containers across multiple machines.

Out of the box, all it

really gives you is the ability to run container workloads. Most folks using Kubernetes

end up assembling their own platform by installing supporting software such as ser‐

vice meshes, message brokers, log aggregation tools, and more. In larger organiza‐

tions, this ends up being the responsibility of a platform engineering team, who put

this platform together and manage it, and help developers use the platform

effectively.

## Sources


- [Narrow Conduits and the Application-Platform Interface](https://12factor.net/blog/narrow-conduits) -- Twelve-Factor maintainers.
- Noda, Storey, Forsgren, and Greiler, *DevEx: What Actually Drives Productivity*, ACM Queue, 2023 ([doi:10.1145/3595878](https://doi.org/10.1145/3595878)).
- [DORA research](https://dora.dev/).

## Library sources


- [Chankramath et al. 2026](/sources/software-engineering/systems-and-operations/chankramath-2026-effective-platform-engineering.pdf.enc), *Effective Platform Engineering* -- on *Platform as a product*, *Standards and enforcement*, and *Measuring it*
  - Chapter notes: chapter 1 (platform engineering versus DevOps, SRE, and developer experience), chapter 3 (measures and cognitive load), chapter 4 (developer autonomy and policy as code)
- AI agent platform book, *O'Reilly early release, chapters 1-7* -- chapter 2 on *Golden paths* and *Self-service and its limits*; chapter 3 on *Measuring it* and *In AI work*
- [Fournier and Nowland 2025](/sources/software-engineering/systems-and-operations/fournier-2025-platform-engineering.pdf.enc), *Platform Engineering: A Guide for Technical, Product, and People Leaders* -- on *Platform as a product*
- [Salatino 2024](/sources/software-engineering/systems-and-operations/salatino-2024-platform-engineering-on-kubernetes.pdf.enc), *Platform Engineering on Kubernetes*

Further reading:

- [Beyer et al. 2016](/sources/software-engineering/systems-and-operations/beyer-2016-site-reliability-engineering.pdf.enc), *Site Reliability Engineering: How Google Runs Production Systems* -- chapter 8, on *Self-service and its limits*
- [Newman 2021](/sources/system-design/microservices/newman-2021-building-microservices-2nd-edition.pdf.enc), *Building Microservices: Designing Fine-Grained Systems, Second Edition* -- chapters 8 and 15
