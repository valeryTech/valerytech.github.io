---
draft: false
toc: true
title: "Control Plane and Data Plane"
description: "Pattern note on separating how a system is managed from how it serves traffic: the control plane and data plane split, ways to distribute configuration, desired state and reconciliation, static stability, and where the pattern appears."
linkTitle: "Control Plane"
---

**Question:** how do you change and manage a system -- its configuration, routing, policies, and capacity -- without putting that work on the path that serves requests?

Pattern note in the [pattern map]({{< ref "system-design/elements/elements" >}}). It touches several hubs: [the request path]({{< ref "system-design/elements/request-path" >}}), [containing failure]({{< ref "system-design/elements/containing-failure" >}}), and [operating services]({{< ref "system-design/elements/operating-services" >}}).

## The split


| | Data plane | Control plane |
| --- | --- | --- |
| Job | Serve each request or move each packet | Accept, validate, store, and distribute desired configuration |
| Path | Hot path, per request | Cold path, per change |
| Volume | Scales with traffic | Scales with the rate of change |
| Latency need | Low and predictable | Can be slower |
| Failure rule | Must keep serving with the last known good configuration | May be unavailable for a while without stopping the data plane |

The model-gateway designs give the reason in one line: request throughput should scale independently from governance workflows, while the hot path stays deterministic and low-latency.

## Forces


- **Availability of the serving path:** management operations, such as deploys, config changes, and scaling decisions, should not be able to take serving down.
- **Consistency of configuration:** many data plane instances should run the same configuration, or knowingly different versions during a rollout.
- **Change safety:** configuration changes cause many incidents, so they need validation, staged rollout, and rollback.
- **Scale:** the data plane may have thousands of instances; the control plane must not have to talk to each one synchronously on every change.

## Options


| Pattern | Mechanism | Fits when | Costs and what it leads to |
| --- | --- | --- | --- |
| Configuration shipped with the release | No separate control plane; configuration is part of each deploy. | Few changes, small systems. | Every change is a deploy. |
| Push distribution | The control plane sends new configuration to each data plane instance. | Few instances; changes must propagate quickly. | The control plane tracks every instance and must handle partial pushes. |
| Pull or watch | Data plane instances poll for or subscribe to configuration changes. | Many instances. | Propagation delay; instances may run different versions for a while. |
| Desired state and reconciliation | Declare the desired state; controllers repeatedly compare it with actual state and act to close the gap. | Long-lived resources such as workloads, infrastructure, and certificates. | State converges over time rather than immediately; reconcilers can fight manual changes. See [GitOps]({{< ref "engineering/platform/gitops" >}}). |

## Static stability


A statically stable data plane keeps working when the control plane is unavailable. It uses the configuration and capacity it already has rather than calling the control plane on the request path.

The AWS paper on cell-based architecture quotes the Well-Architected rule REL11-BP04: rely on the data plane, not the control plane, during recovery. It adds that control planes are statistically more likely to fail than data planes, so existing resources must stay available even when they cannot be created, changed, or deleted.

**Design rules that follow:**

- Cache configuration locally.
- Never make a request wait on the control plane.
- Provision enough capacity in advance that a failure doesn't require the control plane to add more.

The Kubernetes notes suggest testing it: reboot a control plane node and see whether `kubectl` still works and whether workloads keep serving. See the [control plane]({{< ref "engineering/platform/kubernetes" >}}#control-plane) section of the Kubernetes notes.

## Leads to


- Distributing configuration is replication, so it raises the same staleness questions as [data across services]({{< ref "system-design/elements/data-across-services" >}}) and [consistency]({{< ref "system-design/nfr/consistency" >}}).
- A control plane outage is a failure to [contain]({{< ref "system-design/elements/containing-failure" >}}).
- Configuration changes are releases: version them, roll them out gradually, and keep rollback simple. See [deployment]({{< ref "engineering/platform/deployment" >}}#progressive-delivery) and [GitOps]({{< ref "engineering/platform/gitops" >}}).
- A platform is managed through a control plane; see [developer experience]({{< ref "engineering/platform/developer-experience" >}}).

## Seen in


- **Kubernetes:**
  - control plane: the API server, the etcd store, the scheduler, and controllers;
  - data plane: the kubelet and workloads on each node.
  - See [Kubernetes]({{< ref "engineering/platform/kubernetes" >}}#control-plane).
- **Service mesh:** a control plane configures sidecar proxies that carry the traffic. See [the request path]({{< ref "system-design/elements/request-path" >}}#between-services-sidecar-and-service-mesh).
- **Feature flags:** flag rules are managed centrally and evaluated in each service's SDK; the managed services in the [deployment notes]({{< ref "engineering/platform/deployment" >}}#feature-flags) work this way.
- **Cell-based architecture:** the control plane provisions, migrates, deploys, and monitors cells, and tells the cell router where to send traffic. The router and the cells are the data plane. See [containing failure]({{< ref "system-design/elements/containing-failure" >}}).
- **Engineering platforms:** Chankramath et al. build a platform's control plane in two steps:
  - chapter 7 lays the base: a cloud account baseline, a transit network, customer identity, and a managed Kubernetes cluster;
  - chapter 8 adds services such as pipeline orchestration, extensions such as a service mesh and operators, and management APIs for teams and namespaces.
- **AI and RAG:**
  - [model gateway designs]({{< ref "ai-engineering/delivery/patterns/model-gateway" >}}): the data plane handles authentication, policy, routing, retries, and caching on each request; the control plane holds tenant configs, the model registry, routing rules, the prompt registry, and policy bundles.
  - [reusable AI infrastructure]({{< ref "ai-engineering/delivery/reuse" >}}): the gateway as the control plane for model access.

## Gaps


- No case in the [practice cases]({{< ref "system-design/projects" >}}) designs a control plane explicitly. The [code deployment]({{< ref "system-design/projects/code-deployment" >}}) and [rate limiter]({{< ref "system-design/projects/rate-limiter" >}}) cases are candidates.
- Configuration validation and staged rollout of configuration, as distinct from code.

## Sources


- AWS Builders' Library: [static stability using Availability Zones](https://aws.amazon.com/builders-library/static-stability-using-availability-zones/) and [avoiding overload by putting the smaller service in control](https://aws.amazon.com/builders-library/avoiding-overload-in-distributed-systems-by-putting-the-smaller-service-in-control/).
- Nygard 2018, part II: the control plane as one layer of a production system.

## Library sources


- [AWS 2024](/sources/software-engineering/systems-and-operations/aws-2024-reducing-scope-of-impact-cell-based-architecture.pdf.enc), *Reducing the Scope of Impact with Cell-Based Architecture* -- section "Control plane and data plane", on *Static stability* and *Seen in*
- [Nygard 2018](/sources/software-engineering/systems-and-operations/nygard-2018-release-it-2nd-edition.pdf.enc), *Release It! Design and Deploy Production-Ready Software, Second Edition* -- part II
- [Chankramath et al. 2026](/sources/software-engineering/systems-and-operations/chankramath-2026-effective-platform-engineering.pdf.enc), *Effective Platform Engineering* -- chapters 7 and 8, the platform control plane
  - Chapter notes: chapter 7, chapter 8
- [Salatino 2024](/sources/software-engineering/systems-and-operations/salatino-2024-platform-engineering-on-kubernetes.pdf.enc), *Platform Engineering on Kubernetes*
