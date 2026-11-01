---
draft: false
toc: true
title: "Platform and Delivery"
description: "Notes on the platform side of the application–platform contract: Twelve-Factor, deployment, infrastructure as code, Kubernetes, GitOps and declarative configuration, control planes, and platform engineering and developer experience."
linkTitle: "Platform and Delivery"
---

These notes cover the platform side of a contract. The [Twelve-Factor App]({{< ref "engineering/platform/twelve-factor" >}}) defined it in 2011, and each of its successors rewrote it for a new unit of deployment.

- **The application provides:** configuration from outside, disposable processes, health and readiness signals, telemetry, and an identity.
- **The platform provides:** building, deploying, configuring, running, observing, and securing what the application hands over.

```mermaid
flowchart LR
  G[Desired state in Git] --> R[Control plane: reconcilers, pipelines, policy]
  R --> D[Data plane: running workloads and infrastructure]
  A[Application] -- contract: config, health, telemetry, identity --> D
  Dev[Developers] -- golden paths, pull requests --> G
```

## Notes


| Note | Question it answers |
| --- | --- |
| [Twelve-Factor and its descendants]({{< ref "engineering/platform/twelve-factor" >}}) | What must an application provide so a platform can run it, and how has that contract changed? |
| [Deployment]({{< ref "engineering/platform/deployment" >}}) | How does software reach an environment and then its users? |
| [Delivery capabilities]({{< ref "engineering/platform/delivery-capabilities" >}}) | What must a delivery system be able to do to change production safely and learn from the result? |
| [Infrastructure as code]({{< ref "engineering/platform/infrastructure-as-code" >}}) | How are environments created and kept consistent? |
| [Terraform]({{< ref "engineering/platform/terraform" >}}) | How do you learn one infrastructure-as-code tool in practice? |
| [Kubernetes]({{< ref "engineering/platform/kubernetes" >}}) | How does the most common desired-state platform work? |
| [GitOps and declarative configuration]({{< ref "engineering/platform/gitops" >}}) | How are changes to a running system reviewed, recorded, reversed, and applied automatically? |
| [Platform engineering and developer experience]({{< ref "engineering/platform/developer-experience" >}}) | How do you make the right way to ship also the easiest way? |
| [Platform product framing]({{< ref "engineering/platform/product-framing" >}}) | What is the platform for, and how do the people who depend on it agree on that? |
| [Engineering operating model]({{< ref "engineering/platform/operating-model" >}}) | Which standards apply, and how are they enforced and measured? |

The [control plane and data plane]({{< ref "system-design/elements/control-plane" >}}) pattern sits in the system design notes, because it is a structural choice with options rather than a mechanism. The diagram above uses it.

## How it connects


- **System design:** the [operating services]({{< ref "system-design/elements/operating-services" >}}) hub lists deployment, cross-cutting concerns, observability, security, and testing as design choices. These notes hold the mechanisms behind them. The [defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}) note gives the default for a prototype.
- **Delivery techniques:** feature flags, canaries, pilots, and hardening are in the [lifecycle techniques]({{< ref "engineering/architecture/techniques" >}}). Golden-path templates for RAG, agents, and evaluation are in the [golden-path notes]({{< ref "engineering/delivery-techniques/skeletons" >}}).
- **Declarative design:** [declarative design]({{< ref "type-driven-design/declarative-design" >}}) describes the specification-plus-engine idea that GitOps and Kubernetes rely on.
- **AI systems:**
  - [declarative system configuration]({{< ref "ai/design/declarative-configs/declarative-system-config" >}}) applies the same model to AI system definitions;
  - [model gateway designs]({{< ref "ai-engineering/delivery/patterns/model-gateway" >}}) apply the control plane split to model access;
  - the AI platform notes cover the [capability map]({{< ref "ai-engineering/delivery/ai-platform-capabilities" >}}), capabilities derived from the [team delivery loop]({{< ref "ai-engineering/delivery/ai-platform-team-loop" >}}), and a separate [discovery platform]({{< ref "ai-engineering/delivery/ai-platform-discovery" >}}).
- **ML platforms:** the MLOps guide covers the ML lifecycle. Berberi et al. 2025 and Faubel and Schmid 2024 (in the library sources below) compare MLOps platforms by feature, which helps when the choice is buying a platform rather than building one.

## Library sources


- [Chankramath et al. 2026](/sources/software-engineering/systems-and-operations/chankramath-2026-effective-platform-engineering.pdf.enc), *Effective Platform Engineering*
- [Fournier and Nowland 2025](/sources/software-engineering/systems-and-operations/fournier-2025-platform-engineering.pdf.enc), *Platform Engineering: A Guide for Technical, Product, and People Leaders*
- [Salatino 2024](/sources/software-engineering/systems-and-operations/salatino-2024-platform-engineering-on-kubernetes.pdf.enc), *Platform Engineering on Kubernetes*
- AI agent platform book, *O'Reilly early release, chapters 1-7* -- an internal platform for AI applications and agents; chapter 2 defines a platform and lists its anti-patterns and success factors

Further reading:

- [Beyer et al. 2016](/sources/software-engineering/systems-and-operations/beyer-2016-site-reliability-engineering.pdf.enc), *Site Reliability Engineering: How Google Runs Production Systems* -- chapter 8, release engineering
- [AWS 2024](/sources/software-engineering/systems-and-operations/aws-2024-reducing-scope-of-impact-cell-based-architecture.pdf.enc), *Reducing the Scope of Impact with Cell-Based Architecture* -- control plane and data plane, and static stability
- [AWS 2024](/sources/software-engineering/systems-and-operations/aws-2024-well-architected-container-build-lens.pdf.enc), *Container Build Lens (AWS Well-Architected Framework)* -- container build and CI/CD pipelines
- [Berberi et al. 2025](/sources/ml-engineering/mlops/berberi-2025-mlops-landscape-platforms-tools.pdf.enc), *Machine learning operations landscape: platforms and tools* ([doi:10.1007/s10462-025-11164-3](https://doi.org/10.1007/s10462-025-11164-3)) -- 16 MLOps platforms assessed by feature and adoption, with a decision flowchart
- [Faubel and Schmid 2024](/sources/ml-engineering/mlops/faubel-2024-systematic-analysis-mlops-features-platforms.pdf.enc), *A Systematic Analysis of MLOps Features and Platforms* ([doi:10.64552/wipiec.v10i2.73](https://doi.org/10.64552/wipiec.v10i2.73)) -- MLOps platforms as an architectural design space; work in progress
