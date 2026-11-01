---
draft: false
toc: true
title: "Infrastructure as Code"
description: "Representing infrastructure as reviewed, versioned code: declarative and imperative tools, state and drift, consistency across environments, immutable infrastructure, modules, policy as code, and how to learn it."
linkTitle: "Infrastructure as Code"
---

Part of [platform and delivery]({{< ref "engineering/platform" >}}).

**Question:** how do you create and change environments so they can be re-created, reviewed, and kept consistent with each other?

The [deployment principles]({{< ref "engineering/platform/deployment" >}}#principles) state the core idea: represent infrastructure configuration as code and store it in source control, so environments can be re-created and the configuration is shared.

## Declarative and imperative tools


| Style | Examples | How it works | Costs |
| --- | --- | --- | --- |
| Declarative, with a state file | Terraform, OpenTofu | Declare resources; `plan` compares them with recorded state and the provider's reality; `apply` makes the changes. | The state file is shared and critical; changes made outside the tool show up as drift. |
| Declarative, provider-managed | AWS CloudFormation | Declare a stack; the provider tracks and applies it. | Tied to one cloud. |
| General-purpose language | Pulumi, AWS CDK | Write code in a programming language that produces a declarative plan. | Loops and abstractions make the result harder to read in review. |
| Reconciled in a cluster | Crossplane | Declare cloud resources as Kubernetes resources; controllers reconcile them continuously. | Requires Kubernetes as the control plane for infrastructure. |

Most of these are run as *push*: someone or a pipeline runs the apply step. [GitOps]({{< ref "engineering/platform/gitops" >}}) adds continuous reconciliation.

## State and drift


The declared state, the recorded state, and the real infrastructure can all differ. Drift appears when someone changes a resource by hand, when an apply fails partway, or when a provider changes defaults.

Run `plan` regularly, not only before changes, to detect drift. Decide whether to correct it in code or revert it.

## Consistency across environments


The Kubernetes notes put the argument for consistency plainly: every difference between clusters makes the system harder to understand. Knowledge from one cluster stops transferring, and problems appear in some places and not others. Automate the creation of the environments themselves, not only the deployment of applications into them. See [universalization]({{< ref "engineering/platform/kubernetes" >}}#universalization).

This is the infrastructure side of Twelve-Factor's dev/prod parity: environments close to the developer favor fast feedback, and environments close to production should match it. See [environments]({{< ref "engineering/platform/deployment" >}}#environments).

## Immutable infrastructure


Replace instead of patching: build a new image or instance and switch to it, rather than changing a running one. This extends Twelve-Factor's build, release, run separation and the container principle of image immutability to infrastructure. See [Twelve-Factor]({{< ref "engineering/platform/twelve-factor" >}}).

## Modules, policy, and review


- **Modules:** reusable units, such as a standard service network or database setup, are infrastructure's version of a [golden path]({{< ref "engineering/platform/developer-experience" >}}#golden-paths).
- **Policy as code:** rules such as "no public buckets" or "every resource has an owner tag" are checked automatically against the plan before apply. Chankramath et al. treat it as the basis for governance and compliance in a platform.
- **Review:** a plan output attached to a pull request shows reviewers what will change, not just what the code says.
- **Tests and pipelines:** Chankramath et al. (chapter 6) apply test-driven development and static code analysis to infrastructure code. They split infrastructure pipelines by level: account, control plane, and namespace.

## In ML and AI systems


The MLOps notes list infrastructure as code for provisioning ML workloads. The AI design notes extend the same idea to the system definition itself; see [GitOps applied to AI system configuration]({{< ref "engineering/platform/gitops" >}}#applied-to-ai-system-configuration).

## Learning it


See [Terraform]({{< ref "engineering/platform/terraform" >}}) for practical learning advice: pick one concrete goal, do it once by hand or with the CLI, then express it as code.

## Library sources


- [Salatino 2024](/sources/software-engineering/systems-and-operations/salatino-2024-platform-engineering-on-kubernetes.pdf.enc), *Platform Engineering on Kubernetes* -- Crossplane and environment pipelines
- [Chankramath et al. 2026](/sources/software-engineering/systems-and-operations/chankramath-2026-effective-platform-engineering.pdf.enc), *Effective Platform Engineering* -- policy as code, and infrastructure pipelines and tests
  - Chapter notes: chapter 4 (policy as code with Open Policy Agent), chapter 6 (pipeline levels, choosing an IaC framework, testing infrastructure code)

Further reading:

- [AWS 2024](/sources/software-engineering/systems-and-operations/aws-2024-well-architected-framework.pdf.enc), *AWS Well-Architected Framework*
