---
draft: false
toc: true
title: "Operating Services"
description: "Design question hub on what each service needs in production: deployment options, cross-cutting concerns, observability, security with access tokens and password storage, testing with contracts, and UI composition."
linkTitle: "Operating Services"
---

**Question:** what does each service need in order to be deployed, configured, observed, secured, and tested, and which of these needs are solved once for all services?

Interviews usually touch this only briefly. It grows with the number of services: each new deployable unit repeats these needs. Most of the material lives in the engineering notes; this hub collects the options and points to them.

## Forces


- **Number of services:** each concern is paid once per service unless it is shared.
- **Speed and safety of change:** frequent independent deployments need automation and progressive delivery.
- **Diagnosability:** a request that crosses several services can fail in any of them.
- **Trust between services:** each service must know who the original caller is and what that caller may do.

## Deployment


| Pattern | Mechanism | Fits when | Costs |
| --- | --- | --- | --- |
| Multiple service instances per host | Several instances share a host. | Efficient use of a few machines. | Instances compete for resources; deployments interfere. |
| Service instance per host, per VM, or per container | Each instance gets its own host, virtual machine, or container. | Isolation between instances; containers make this cheap. | More units to manage; containers need an orchestrator. |
| Serverless deployment | The platform runs code per request or event. | Spiky or low traffic; no servers to manage. | Cold starts, execution limits, platform lock-in. |
| Service deployment platform | An automated platform provides a service abstraction: deploy, scale, discover, roll out. | Many services. | Platform to adopt and operate. |

Release techniques such as blue/green deployment, canary releases, feature flags, and parallel runs are in the [deployment notes]({{< ref "engineering/platform/deployment" >}}). Platform details are in [Kubernetes]({{< ref "engineering/platform/kubernetes" >}}), [infrastructure as code]({{< ref "engineering/platform/infrastructure-as-code" >}}), and [GitOps]({{< ref "engineering/platform/gitops" >}}); the [platform and delivery]({{< ref "engineering/platform" >}}) notes collect them. The [code deployment case]({{< ref "system-design/projects/code-deployment" >}}) designs such a system.

## Cross-cutting concerns


| Pattern | Mechanism | Fits when | Costs |
| --- | --- | --- | --- |
| Microservice chassis | A framework that handles configuration, logging, health checks, metrics, and tracing for each service. | Services share a language and stack. | One chassis per language; upgrades must reach every service. |
| Service template | A starter project with these concerns already implemented, copied to begin a new service. | Starting many similar services. | Copies drift apart after creation. |
| Externalized configuration | Configuration, such as database locations and credentials, comes from the environment or a configuration service rather than the code. | Every service that runs in more than one environment. | A configuration source to secure and keep available. |

A [service mesh]({{< ref "system-design/elements/request-path" >}}#between-services-sidecar-and-service-mesh) moves some of these concerns out of the chassis into infrastructure, independent of language.

Externalized configuration is factor III of the Twelve-Factor App. For its rationale and the frameworks that followed it, see [Twelve-Factor and its descendants]({{< ref "engineering/platform/twelve-factor" >}}).

## Observability


- **Log aggregation:** collect logs from every instance in one searchable place.
- **Application metrics:** instrument operations to gather statistics such as rate, errors, and latency.
- **Distributed tracing:** give each external request an identifier that travels between services, and record timed spans of the work done for it.
- **Exception tracking:** report exceptions to a central service that groups them and notifies developers.
- **Health check API:** an endpoint that reports whether the instance can serve requests. Load balancers and registries use it to route traffic (see [service discovery]({{< ref "system-design/elements/request-path" >}}#service-discovery)).
- **Audit logging:** record user actions for later review.
- **Log deployments and changes:** record deployments and configuration changes so incidents can be matched to them.

Study backlog: there are no observability notes yet. Start with [instrumenting distributed systems for operational visibility](https://aws.amazon.com/builders-library/instrumenting-distributed-systems-for-operational-visibility) (AWS Builders' Library) and Newman, chapter 10.

## Security


**Access token:** the API gateway authenticates the caller and passes a token, such as a JWT, that carries the caller's identity and roles. Each service uses the token to authorize the request without calling an identity service.

The original notes frame security as a trade-off between total safety and total convenience. They separate authentication (who is calling) from authorization (what the caller may do).

**Password storage:**

- **The problem:** a fast hash such as SHA-256 lets an attacker who steals the table try billions of guesses per second on GPUs. Without a salt, precomputed tables, including rainbow tables, crack common passwords in bulk, and identical hashes reveal users who share a password.
- **The approach:** give each password a unique random salt, stored next to the hash, and use a slow, memory-hard function. Argon2id is the first choice, then scrypt or bcrypt. Set the cost parameters from current OWASP guidance rather than fixed numbers in a note.
- **Additional measures:** a pepper, a secret key held outside the database in a secrets manager, means a stolen table alone is not enough. Rehash at the next login when the parameters change.
- **Better still:** avoid storing passwords. Delegate authentication to an identity provider over OpenID Connect, or use passkeys.

Study backlog: usability trade-offs; service-to-service authentication; secrets management (see the [secrets section of the GitOps notes]({{< ref "engineering/platform/gitops" >}}#secrets) and the Twelve-Factor critique of environment variables). The [security note]({{< ref "engineering/topics/security" >}}) in the engineering topics is still an empty placeholder. Sources named in the original notes: Newman's book (chapter 11 in the second edition) and the interviewing.io system design guide.

## Testing


- **Consumer-driven contract test:** the team that consumes a service writes tests that the provider runs, so the provider learns when a change would break a consumer.
- **Consumer-side contract test:** tests that check a client can communicate with the service it depends on.
- **Service component test:** tests a service in isolation, with test doubles for the services it calls.

See the [test strategy notes]({{< ref "engineering/topics/tests/tests" >}}) for the broader approach.

## UI composition


Two patterns build one screen from parts owned by different teams:

- **Server-side page fragment composition:** the server assembles HTML fragments produced by several capability-specific web applications.
- **Client-side UI composition:** the client assembles UI components, each owned by a team.

No notes yet; see Newman, chapter 14.

## Leads to


- Health checks feed [the request path]({{< ref "system-design/elements/request-path" >}}#service-discovery).
- Tracing is what makes [asynchronous communication]({{< ref "system-design/elements/communication" >}}) diagnosable.
- Access tokens are issued at the [API gateway]({{< ref "system-design/elements/api-gateway" >}}).
- Contract tests protect the [contracts]({{< ref "system-design/elements/communication" >}}#contracts-and-api-design) between services.
- A deployment platform, a mesh, and feature flags are each managed through a [control plane]({{< ref "system-design/elements/control-plane" >}}).
- Solving these needs once for every team is [platform engineering]({{< ref "engineering/platform/developer-experience" >}}).

## Seen in cases


- [Code deployment]({{< ref "system-design/projects/code-deployment" >}}): a case about building the deployment system itself.
- **AI and RAG:** the [golden-path templates]({{< ref "engineering/delivery-techniques/llm-golden-paths" >}}) (observable RAG, deterministic agent, eval harness) are service templates. They choose copied scaffolding over a shared library and read configuration from the environment. [Design pressure]({{< ref "engineering/eng-exp/design-pressure" >}}) asks for observability by design, replayable runs, and gradual release of versioned prompts, models, indexes, and tool schemas.

## Sources


- microservices.io pattern groups:
  - deployment: [multiple services per host](https://microservices.io/patterns/deployment/multiple-services-per-host.html), [service per host](https://microservices.io/patterns/deployment/single-service-per-host.html), [service per VM](https://microservices.io/patterns/deployment/service-per-vm.html), [service per container](https://microservices.io/patterns/deployment/service-per-container.html), [serverless](https://microservices.io/patterns/deployment/serverless-deployment.html), [deployment platform](https://microservices.io/patterns/deployment/service-deployment-platform.html);
  - cross-cutting concerns: [microservice chassis](https://microservices.io/patterns/microservice-chassis.html), [externalized configuration](https://microservices.io/patterns/externalized-configuration.html), [service template](https://microservices.io/patterns/service-template.html);
  - observability: [log aggregation](https://microservices.io/patterns/observability/application-logging.html), [application metrics](https://microservices.io/patterns/observability/application-metrics.html), [audit logging](https://microservices.io/patterns/observability/audit-logging.html), [distributed tracing](https://microservices.io/patterns/observability/distributed-tracing.html), [exception tracking](https://microservices.io/patterns/observability/exception-tracking.html), [health check API](https://microservices.io/patterns/observability/health-check-api.html), [log deployments and changes](https://microservices.io/patterns/observability/log-deployments-and-changes.html);
  - security: [access token](https://microservices.io/patterns/security/access-token.html);
  - testing: [contract tests](https://microservices.io/patterns/testing/service-integration-contract-test.html), [component test](https://microservices.io/patterns/testing/service-component-test.html);
  - UI: [server-side page fragment composition](https://microservices.io/patterns/ui/server-side-page-fragment-composition.html), [client-side UI composition](https://microservices.io/patterns/ui/client-side-ui-composition.html).
- Richardson 2019: chapters 9-10 (testing), 11 (production-ready services), 12 (deployment).
- Newman 2021: chapters 8 (deployment), 9 (testing), 10 (observability), 11 (security), 14 (user interfaces).
- [Password Storage Cheat Sheet -- OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html): algorithms and current cost parameters.

## Library sources


- [Richardson 2019](/sources/cdfacd78fbf9383e0e2361fff5f38b30.bin), *Microservices Patterns: With Examples in Java* -- chapters 9-12
- [Newman 2021](/sources/af58a5432d5991ea30cd296ba11a12dc.bin), *Building Microservices: Designing Fine-Grained Systems, Second Edition* -- chapters 8-11 and 14
- Xu 2023, *Password, Session, Cookie, Token, JWT, SSO, OAuth -- Authentication Explained*, parts 1 and 2 -- on *Password storage* and access tokens

Further reading:

- [Nygard 2018](/sources/f9167fa26feb869b87a7f0bc4edbc9b3.bin), *Release It! Design and Deploy Production-Ready Software, Second Edition* -- parts II-III
- [Beyer et al. 2016](/sources/66e3d117bdfddedf20fc8fa46d6753b0.bin), *Site Reliability Engineering: How Google Runs Production Systems*
