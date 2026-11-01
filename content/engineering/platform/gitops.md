---
draft: false
toc: true
title: "GitOps and Declarative Configuration"
description: "Declarative desired state, reconciliation, and GitOps: the four OpenGitOps principles, push versus pull delivery, drift, environment promotion, secrets, limits, and the same model applied to AI system configuration."
linkTitle: "GitOps"
---

Part of [platform and delivery]({{< ref "engineering/platform" >}}).

**Question:** how do you change a running system so that every change is reviewed, recorded, reversible, and applied the same way every time?

GitOps answers this with three moves:

1. Describe the desired state of the system declaratively.
2. Keep that description in version control.
3. Let an automated agent make the running system match it.

The term was coined at Weaveworks in 2017. The principles now live in the vendor-neutral [OpenGitOps](https://opengitops.dev/) project.

## Declarative desired state


A declarative system has two parts:

- a **specification** that states what should be true;
- an **engine** that works out how to make it true and keeps it true.

The [declarative design notes]({{< ref "type-driven-design/declarative-design" >}}) describe the same split, with desired-state systems as one family alongside query languages and functional programs.

Kubernetes is the common example. Controllers compare the desired state of each resource with the actual state of the cluster and adjust the cluster to close the gap, in a loop that never ends. See [maintaining desired state]({{< ref "engineering/platform/kubernetes" >}}#maintaining-desired-state) and [declarativity]({{< ref "engineering/platform/kubernetes" >}}#declarativity) in the Kubernetes notes. The general pattern is the [control plane]({{< ref "system-design/elements/control-plane" >}}).

**Imperative versus declarative changes:**

- **Imperative:** run these commands in this order. The result depends on the starting state, and the history lives in someone's shell.
- **Declarative:** this is the state I want. The same declaration applied twice gives the same result, and the declaration itself is the record.

The Kubernetes notes describe switching from imperative `kubectl` commands to manifest files by exporting existing resources.

## The four OpenGitOps principles


| Principle | What it requires | What it prevents |
| --- | --- | --- |
| Declarative | The desired state of the system is expressed declaratively. | Changes that exist only as a sequence of commands. |
| Versioned and immutable | Desired state is stored with immutability, versioning, and a complete history. | Untraceable changes; rollback by memory. |
| Pulled automatically | Software agents pull the desired state from the source. | Pipelines holding credentials to every environment. |
| Continuously reconciled | Agents observe the actual state and keep applying the desired state. | Drift that goes unnoticed until the next deploy. |

The principles do not require Git specifically; Git is the usual store because review, history, and revert come with it.

## Push versus pull


| Delivery | How it works | Costs |
| --- | --- | --- |
| Push | A CI pipeline applies changes to the environment after a merge, for example by running `kubectl apply` or `terraform apply`. | The pipeline needs credentials for every environment; nothing notices drift between deploys. |
| Pull | An agent inside the environment, such as Argo CD or Flux, watches the repository and applies changes itself. | Another component to run; status reporting back to developers needs extra work. |

Pull-based reconciliation is what GitOps usually means. Push-based pipelines that read declarations from Git share the review and history benefits but not continuous reconciliation.

## Drift


Drift is any difference between the declared and the actual state, such as a manual hotfix, a change made through a console, or a controller that failed partway.

A reconciling agent either reverts drift or reports it. Reverting a hotfix someone made during an incident can reopen the incident. Decide which resources are reconciled strictly and how emergency changes get back into Git.

## Environments and promotion


Each environment gets its own declaration, usually as a shared base plus per-environment overlays: Kustomize overlays, or Helm values per environment.

Promotion is a change to the next environment's declaration, made through a pull request. Rollback is a revert.

This follows the [Twelve-Factor]({{< ref "engineering/platform/twelve-factor" >}}) split:

- what is the same everywhere belongs in the build artifact;
- what varies per deploy belongs in configuration.

Salatino's book builds this as *environment pipelines*: separate pipelines that manage the declaration of each environment, distinct from the service pipelines that build artifacts.

## Secrets


Secrets cannot sit in a Git repository in plain text, so GitOps makes the [Twelve-Factor]({{< ref "engineering/platform/twelve-factor" >}}) secrets problem sharper. The common options:

- **Encrypted in Git:** Sealed Secrets or SOPS store ciphertext that only the cluster can decrypt.
- **Referenced from Git:** an operator, such as External Secrets, reads a declared reference and fetches the value from a secret manager at runtime.

The second matches the Twelve-Factor note's advice: keep secrets apart from configuration and fetch them at runtime from a manager that authenticates the workload.

## Infrastructure in the same model


[Infrastructure as code]({{< ref "engineering/platform/infrastructure-as-code" >}}) tools such as Terraform are declarative but usually run as push: someone runs `plan` and `apply`, and a state file records what exists.

Crossplane brings cloud infrastructure into the Kubernetes reconciliation model, so infrastructure resources can be declared and reconciled like workloads. Salatino uses it for multi-cloud infrastructure.

## Limits


- **Imperative steps:** database migrations and one-off jobs don't converge; they run once, in order. Model them as jobs triggered by a declared version rather than as state.
- **Ordering:** resources that depend on each other need explicit ordering or must tolerate starting in any order. The [12 Fractured Apps]({{< ref "engineering/platform/twelve-factor" >}}#12-fractured-apps-2015) advice on startup retries applies.
- **Change rate:** Git suits changes made by people at review speed. It does not suit values that change every few seconds, such as autoscaling targets or traffic weights, which belong to a controller.
- **Visibility:** a merged change is not a deployed change. Developers need to see reconciliation status, not just the commit.

## Applied to AI system configuration


The AI design notes propose the same model for AI systems: [declarative system configuration]({{< ref "ai/design/declarative-configs/declarative-system-config" >}}) and [configuration publishing and version identity]({{< ref "ai/design-research/05-runtime-and-execution/10-configuration-publishing-and-version-identity" >}}). The proposal has four parts:

- Git stores the authored desired state of a system: its prompts, components, and versions.
- A build step resolves references and defaults into an immutable resolved revision with its own fingerprint.
- Deployment, evaluation, and workbench runs consume that resolved revision; environment bindings are kept separate from the system's identity.
- Runtime traces, outputs, metrics, and secrets live elsewhere.

That is Twelve-Factor's build-release-run separation and GitOps applied to a system definition rather than to infrastructure. The distinction between the source commit and the resolved revision is the same as between a Git commit and an image digest.

## Leads to


- [Control plane]({{< ref "system-design/elements/control-plane" >}}): the reconciler is a control plane, and its outage must not stop the running system.
- [Developer experience]({{< ref "engineering/platform/developer-experience" >}}): pull requests as the interface to the platform.
- [Deployment]({{< ref "engineering/platform/deployment" >}}): progressive delivery on top of declared state, for example traffic weights managed by a controller.

## Sources


- [OpenGitOps principles](https://opengitops.dev/).
- [Argo CD](https://argo-cd.readthedocs.io/) and [Flux](https://fluxcd.io/) documentation.
- Salatino 2024: environment pipelines and Crossplane.

## Library sources


- [Salatino 2024](/sources/software-engineering/systems-and-operations/salatino-2024-platform-engineering-on-kubernetes.pdf.enc), *Platform Engineering on Kubernetes* -- on *Environments and promotion* and *Infrastructure in the same model*
- [Chankramath et al. 2026](/sources/software-engineering/systems-and-operations/chankramath-2026-effective-platform-engineering.pdf.enc), *Effective Platform Engineering* -- policy as code and the platform control plane

Further reading:

- [Beyer et al. 2016](/sources/software-engineering/systems-and-operations/beyer-2016-site-reliability-engineering.pdf.enc), *Site Reliability Engineering: How Google Runs Production Systems* -- chapter 8, "Configuration Management": ways to ship configuration, and the skew between checked-in and running configuration
