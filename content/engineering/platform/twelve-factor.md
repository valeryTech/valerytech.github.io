---
draft: false
toc: true
title: "Twelve-Factor and Its Descendants"
description: "The Twelve-Factor App as a contract between an application and its platform, and the frameworks that rewrote it for containers, Kubernetes, ML pipelines, and LLM agents: their decisions, justifications, and flaws."
linkTitle: "Twelve-Factor"
---

*Decisions, justifications and flaws of the Twelve-Factor App and the frameworks that followed it*

Nov 4, 2026 · @Valery

## Purpose and how to read


The Twelve-Factor App (2011) defined a contract between an application and the platform that runs it. Every framework below rewrites that contract for a new unit of deployment. This document covers named, specific frameworks that descend from it, not umbrella terms such as "cloud native" or "microservices".

Each framework is read through four questions:

- **Context:** what changed that prompted it
- **Decisions:** what it asks you to do
- **Justification:** the failure each decision prevents
- **Flaws:** where it is wrong, dated or silent

| Year | Framework | Author / org | Unit it targets | What it adds |
| --- | --- | --- | --- | --- |
| 2025 | [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) | Dex Horthy, HumanLayer | LLM agent loop | Ownership of prompts, context, control flow and state |
| 2024 onward | [Twelve-Factor community refresh](https://www.12factor.net/blog/open-source-announcement) | Open-source maintainers (Heroku and others) | App on any cloud-native platform | Workload identity, telemetry, a narrow app-platform interface (proposed) |
| 2020 | [12 Factors of Reproducible ML in Production](https://www.zenml.io/blog/12-factors-of-reproducible-machine-learning-in-production) | ZenML team | ML training and serving pipeline | Data and models as versioned artifacts |
| 2017 | [Principles of Container-Based Application Design](https://kubernetes.io/blog/2018/03/principles-of-container-app-design/) | Bilgin Ibryam, Red Hat | Container on Kubernetes | Platform-facing contracts: health, lifecycle, resource limits |
| 2016 | [Beyond the Twelve-Factor App](https://www.oreilly.com/library/view/beyond-the-twelve-factor/9781492042631/) | Kevin Hoffman, Pivotal | Microservice on Cloud Foundry | API first, telemetry, authentication and authorization |
| 2015 | [12 Fractured Apps](https://medium.com/@kelseyhightower/12-fractured-apps-1080c73d481c) | Kelsey Hightower | Docker container | App-side startup hygiene |
| 2011 | [The Twelve-Factor App](https://12factor.net) | Adam Wiggins, Heroku | Process on a PaaS | The original contract |

## The Twelve-Factor App (2011)


**Context.** Adam Wiggins and the Heroku team wrote it from building hundreds of apps and watching hundreds of thousands more run on Heroku. Its core decision: the app assumes nothing about the machine, and the platform assumes nothing about the app beyond a small contract. The site still says "last updated 2017" ([12factor.net](https://12factor.net)).

**Goals.** Declarative setup to cut onboarding cost, a clean contract with the operating system for portability, deployment to cloud platforms without sysadmins, minimal divergence between dev and prod, and scaling without redesign. The factors are means to these goals.

| Factor | Decision | Justification | Flaw or critique |
| --- | --- | --- | --- |
| I. Codebase | One repo per app, many deploys | Every deploy traces to one commit; shared code becomes a library | Monorepos are now common; the rule really means one deployable per build |
| II. Dependencies | Declare every dependency and isolate it; never rely on system tools | Deterministic setup for every new developer | Lockfiles and images solved this; the open problem moved to supply-chain integrity, which it never mentions |
| III. Config | Keep config that varies per deploy in environment variables | Strict split of config from code; test: could the repo go open source today? | Silent on secrets; env vars leak through process listings, crash dumps, child processes and logs ([Mónica, 2017](https://diogomonica.com/2017/03/27/why-you-shouldnt-use-env-variables-for-secret-data)) |
| IV. Backing services | Databases, queues and caches are attached resources found by URL | Swap a resource with a config change, not a code change | Assumes one app with a few services; silent on service discovery and service-to-service auth |
| V. Build, release, run | Build an artifact, add config to make an immutable numbered release, then run it | No patching at runtime; rollback means picking an older release | Design-time work (API contracts, schemas) sits outside the pipeline |
| VI. Processes | Stateless, share-nothing processes; state lives in backing services | Any process can die or move, so scaling out is safe | Excludes stateful workloads such as streams, websockets and databases |
| VII. Port binding | The app embeds its server and exports HTTP on a port | No injected web server; the app can become another app's backing service | HTTP-centric; functions, workers and event consumers bind no port |
| VIII. Concurrency | Scale out by process type (web, worker) under a process manager | Reuses the Unix process model for simple, reliable scaling | Silent on resource limits and scaling signals, which orchestrators need |
| IX. Disposability | Start fast, stop gracefully on SIGTERM, survive sudden death | Frequent deploys and elastic scaling stay safe | No health or readiness signal, so a platform can't tell started from ready |
| X. Dev/prod parity | Close the time, people and tools gaps | Enables continuous deployment; prevents prod-only bugs | Many managed cloud services have no faithful local equivalent |
| XI. Logs | Write an unbuffered event stream to stdout; the environment routes it | The app never manages log files | Logs alone don't cover metrics and traces |
| XII. Admin processes | One-off tasks run with the same release and config | No drift between scripts and the app | Silent on schema migrations while old and new versions run side by side |

Critiques without a link are this document's assessment.

**What it got right.** Docker later made the factors nearly free: container logs are factor XI, and per-container env vars are factor III ([Hightower, 2015](https://medium.com/@kelseyhightower/12-fractured-apps-1080c73d481c)). Much of the contract became conventional wisdom ([Update FAQ](https://github.com/twelve-factor/twelve-factor/blob/next/UPDATE_FAQ.md)).

**Cross-cutting flaws.**

- **Heroku-shaped.** Examples assume a PaaS with process types and buildpacks, so they aged faster than the principles.
- **Principles mixed with examples.** Separating the two is the refresh's first task.
- **Missing concerns.** Security and identity, observability beyond logs, API contracts and health signals are absent. Every successor adds at least one of these.

## 12 Fractured Apps (2015)


**Context.** Kelsey Hightower published [12 Fractured Apps](https://medium.com/@kelseyhightower/12-fractured-apps-1080c73d481c) on 13 December 2015. Docker had made twelve-factor practical, but teams ran containers like VMs, with 2 GB images on full Linux distributions. Apps were "fractured": they worked only on a happy path where the config file, data directory and database all existed at startup.

**Decisions.**

- **Config files are optional.** Load one if present, otherwise fall back to sane defaults, then let env vars override.
- **The app creates its own working directories** and logs any failure.
- **No required start order.** Retry dependencies such as the database with increasing waits, logging each attempt.
- **Bootstrapping stays in the app,** not in entrypoint shell scripts or config-management tools. Wrapper scripts are acceptable only for apps you don't control.
- **Ship artifacts, not build environments:** a static binary on a `scratch` image.

**Justification.**

- Puppet or Ansible ordering (start the database first) only covers up an app that can't tolerate a missing dependency.
- Wrapper scripts drift out of sync with the app. In his example the entrypoint script's Alpine base almost doubled the image, from about 6 MB to 11 MB.
- Baking config into per-environment images produces endless names such as `application-v2-prod-01022015`.

**Flaws.**

- **Narrow.** It is one essay with Go examples and covers startup only, not a methodology.
- **Two config sources.** Optional files plus env overrides is pragmatic, but it departs from factor III and needs a documented precedence order.
- **Hidden waiting.** Retrying silently at startup can mask an outage. Readiness probes later made "waiting for the database" visible to the platform.

**What carried forward.** Tolerance of dependency order became a platform expectation: the container principles of 2017 turn it into lifecycle conformance.

## Beyond the Twelve-Factor App (2016)


**Context.** Kevin Hoffman, an architect at Pivotal (Cloud Foundry), published [Beyond the Twelve-Factor App](https://www.oreilly.com/library/view/beyond-the-twelve-factor/9781492042631/) with O'Reilly in April 2016, a 70-page book. His audience was enterprises moving fleets of microservices onto a PaaS. He kept the original factors, revised several, added three, and reordered them deliberately to signal priority ([preface](https://content.pivotal.io/blog/beyond-the-twelve-factor-app)).

**Decisions: the fifteen factors, in his priority order.**

1. One codebase, one application
2. **API first** (new)
3. Dependency management
4. **Design**, build, release, run (design step added)
5. Configuration, **credentials** and code (credentials named)
6. Logs
7. Disposability
8. Backing services
9. Environment parity
10. Administrative processes
11. Port binding
12. Stateless processes
13. Concurrency
14. **Telemetry** (new)
15. **Authentication and authorization** (new)

**Justification for each change** ([Cloud Foundry summary](https://www.cloudfoundry.org/blog/how-many-factors-are-there-anyway/)).

- **API first.** Services are consumed by other services, so the contract is designed and agreed before code. This enables mock servers and lets teams work in parallel.
- **Design step.** Choosing dependencies for a story happens before the build, so it belongs in the pipeline.
- **Credentials.** Credentials never live in code. Mounted files and config servers such as Spring Cloud Config, Consul or CredHub are acceptable, not only env vars.
- **Telemetry.** With many instances you can no longer attach a debugger to one. Apps must expose performance metrics, health checks and business metrics.
- **Authentication and authorization.** Security is designed in from day one, with role- or attribute-based checks on every endpoint.
- **Reordering.** API first sits second because it shapes everything after it; port binding and concurrency move near the bottom, which reads as a judgment that platforms now handle them.

**Flaws.**

- **Vendor context.** Pivotal sponsored it, and the examples lean on Cloud Foundry: buildpacks, CredHub, the service broker.
- **Process, not contract.** API first and the design step are team practices. The 2024 refresh rules such principles out, keeping only the app-platform interface ([Update FAQ](https://github.com/twelve-factor/twelve-factor/blob/next/UPDATE_FAQ.md)).
- **Goals without interfaces.** Telemetry and security say what to achieve but name no mechanism, such as a metrics format or an identity standard, so compliance is hard to check.
- **Factor inflation.** Once the list opened, others kept adding: a 2018 Cloud Foundry post proposed a sixteenth factor for agile process.

## Principles of Container-Based Application Design (2017)


**Context.** Bilgin Ibryam of Red Hat published the [whitepaper](https://www.redhat.com/rhdc/managed-files/cl-cloud-native-container-design-whitepaper-f8808kc-201710-v2-en.pdf) in October 2017 and summarized it on the [Kubernetes blog](https://kubernetes.io/blog/2018/03/principles-of-container-app-design/) in March 2018. Almost any app could now run in a container, but Kubernetes imposes contracts on apps so it can automate their management. The paper limits its scope to containerized microservices, leaving source control and scaling models to twelve-factor.

**Decisions: seven principles in two groups.**

| Stage | Principle | What the container must do |
| --- | --- | --- |
| Build time | Single concern | Address one concern and do it well |
| Build time | Self-containment | Rely only on the Linux kernel; add libraries at build time |
| Build time | Image immutability | Build once; never change between environments |
| Runtime | High observability | Expose the APIs the platform needs to observe and manage it, such as health and readiness checks and logs |
| Runtime | Lifecycle conformance | Read platform events (SIGTERM, PostStart, PreStop) and react to them |
| Runtime | Process disposability | Stay ephemeral, ready to be replaced at any moment |
| Runtime | Runtime confinement | Declare resource needs and stay within them |

**Justification.** An orchestrator can only schedule, heal and scale what declares its needs and exposes its state. Build-time principles give containers the right granularity and consistency; runtime principles let the platform automate them.

**Flaws.**

- **Reverses the original stance.** Twelve-factor apps know nothing about their platform. Here the app implements probes and hooks shaped by Kubernetes semantics.
- **Narrower scope.** Codebase, config and dependency workflow sit outside it, so it complements twelve-factor rather than replacing it.
- **Linux-container assumption.** "Only the kernel" doesn't describe serverless functions or WebAssembly runtimes.
- **Platform drift.** The principles are generic, but the examples track Kubernetes APIs, which keep changing.

**What carried forward.** Health and readiness endpoints and declared resource limits became standard practice. The ideas grew into the book [Kubernetes Patterns](https://www.redhat.com/rhdc/managed-files/cl-oreilly-kubernetes-patterns-ebook-399085-202306-en.pdf) by Ibryam and Roland Huß, now in its second edition (2023).

## ML adaptations (2020 onward)


**Context.** The ZenML team published [12 Factors of Reproducible Machine Learning in Production](https://www.zenml.io/blog/12-factors-of-reproducible-machine-learning-in-production) on 28 September 2020, last updated February 2022. Their claim: ML has two moving parts, code and data, so software practice must be adapted rather than copied. A later series, [The 12+ Factor Model](https://divergingasymptotically.substack.com/p/the-12-factor-model-2-single-source), keeps the original five goals and adds "training" and "data" to them.

**Decisions: ZenML's twelve factors.**

| # | Factor | Justification |
| --- | --- | --- |
| 1 | Versioning | Data changes too, so version both code and data |
| 2 | Explicit feature dependencies | Upstream data changes should fail loudly, not silently degrade the model |
| 3 | Descriptive training and preprocessing | Readable code; config such as split ratios kept out of code |
| 4 | Reproducibility of trainings | Pipelines let anyone on the team rerun any training |
| 5 | Testing | Unit-test preprocessing, integration-test models |
| 6 | Drift and continuous training | Monitor incoming data and retrain when it shifts |
| 7 | Tracking of results | Record every run automatically in a central store |
| 8 | Experimentation vs production models | Notebooks produce understanding, not production artifacts |
| 9 | Training-serving skew | Embed preprocessing in serving and understand the data upstream |
| 10 | Comparability | Build comparison across trainings in from the start |
| 11 | Monitoring | Watch inputs, inference time, resource use and outputs |
| 12 | Deployability of models | Every pipeline yields a deployable artifact, not just a model file |

**Mapping to the original.** Factors 1, 3 and 12 mirror codebase, config and build-release-run. Factor 9 is dev/prod parity for data. The rest are new because the original has no notion of data as an input that changes.

**Flaws.**

- **Vendor content.** The factors are the stated design basis for ZenML's orchestrator, and the post ends in a sign-up pitch.
- **No narrow scope.** It mixes coding hygiene (PEP 8, SOLID, testing) with platform concerns, so it reads as a checklist rather than a contract.
- **Pre-LLM.** It predates foundation models and says nothing about prompts, fine-tuning or evaluating generated output. 12-Factor Agents later covers part of that gap.

## Twelve-Factor community refresh (2024 onward)


**Context.** Heroku [open-sourced](https://www.12factor.net/blog/open-source-announcement) Twelve-Factor on 12 November 2024 and announced it at KubeCon. The maintainers, including Yehuda Katz and Heroku chief architect Vish Abrams, see the concepts as timeless but the details as dated. The new text lives on the `next` branch of [twelve-factor/twelve-factor](https://github.com/twelve-factor/twelve-factor) and will replace 12factor.net once the maintainers agree it is done.

**Decisions so far** ([Update FAQ](https://github.com/twelve-factor/twelve-factor/blob/next/UPDATE_FAQ.md)).

- **Keep exactly twelve factors.** The number is kept as a constraint that keeps the manifesto focused.
- **Keep the scope.** Factors cover only the contract between application code and its platform, and stay language-agnostic. General principles such as DRY or KISS will never be factors.
- **Separate principles from examples,** then modernize the examples first.
- **Start narrow.** Begin with stateless request-based apps, then expand to other workload types.
- **Proposed changes:** a new factor for workload identity, and widening the logs factor into telemetry ([December update](https://www.12factor.net/blog/december-monthly-updates)).
- **Name the idea.** A clear contract lets each side shed cognitive load, which the maintainers call the narrow-conduit principle ([blog](https://12factor.net/blog/narrow-conduits)).

**Justification.** Much of the original contract is now conventional wisdom, while best practice drifted from its details. Apps today are systems of many services with diverse backing services, not one app and a database ([The New Stack](https://thenewstack.io/heroku-moved-twelve-factor-apps-to-open-source-whats-next/)). The FAQ names authentication and service-to-service communication as the thorny problems to solve next.

**Flaws and status.**

- **Slow to ship.** Two years on, 12factor.net still serves the 2017 text, and the maintainer blog's latest post is from April 2025.
- **The fixed count forces trade-offs.** Adding workload identity at twelve means merging or dropping an existing factor.
- **Consensus lags practice.** Inclusion is a maintainer judgment call between established and emerging practice, so the text will trail what platforms already do.
- **Strength worth keeping.** Its scope test, "is this about the app-platform interface?", is the sharpest filter any descendant offers.

## 12-Factor Agents (2025)


**Context.** Dex Horthy of HumanLayer published [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) in April 2025, after talking with over 100 SaaS builders. The pattern he saw: a team grabs an agent framework, reaches 70-80% quality, then must reverse-engineer the framework to go further and starts over. His thesis is that good agents are mostly deterministic software with LLM steps placed at the right points. It is a design guide, not a framework or library.

**Decisions: twelve factors plus one in the appendix.**

| # | Factor | Justification | Closest original factor |
| --- | --- | --- | --- |
| 1 | Natural language to tool calls | Turn intent into structured actions that deterministic code executes | None |
| 2 | Own your prompts | Prompts are code you version and test, not hidden framework internals | I. Codebase |
| 3 | Own your context window | What the model sees decides quality, so build it deliberately | None |
| 4 | Tools are just structured outputs | A tool call is JSON your code chooses how to handle | IV. Backing services (loosely) |
| 5 | Unify execution state and business state | One serializable thread makes runs inspectable and resumable | VI. Processes |
| 6 | Launch, pause and resume with simple APIs | Long runs must stop for approvals and restart cleanly | IX. Disposability |
| 7 | Contact humans with tool calls | Human approval becomes a normal step in the loop | None |
| 8 | Own your control flow | Your code, not the model, decides retries, branches and exits | None |
| 9 | Compact errors into the context window | Feed failures back briefly so the model can self-correct | XI. Logs (loosely) |
| 10 | Small, focused agents | Short loops stay inside the range where models are reliable | VIII. Concurrency |
| 11 | Trigger from anywhere, meet users where they are | Start agents from Slack, email, webhooks or cron | VII. Port binding |
| 12 | Make your agent a stateless reducer | Next step = f(state, event), which is easy to test and replay | VI. Processes |
| 13 | Pre-fetch all the context you might need (appendix) | Fetch known context upfront instead of spending tool calls on it | None |

**Justification overall.** Frameworks hide the prompt, the context and the state, which is exactly where production quality is won. The fastest path he saw was adding small, modular agent ideas to an existing product rather than a greenfield rewrite.

**Flaws.**

- **Borrows the brand more than the structure.** Five of the thirteen factors have no counterpart in the original, and none concerns the app-platform contract. It governs the inside of one component.
- **Tied to current models.** Context limits and error compaction are workarounds for today's model weaknesses. The guide itself asks what happens if models get smarter (factor 10).
- **Gaps.** It says little about evaluation, cost, deployment or tool security such as prompt injection.
- **Tension with its own advice.** The README notes the authors "ignored all our own advice" and built a framework for running agents on Kubernetes. A v1.1 draft exists on a branch, but v1.0 remains current.

**What carried forward.** Factor 3 popularized the term "context engineering", which Horthy is credited with coining ([AI Engineer](https://www.ai.engineer/speakers/dex-horthy)).

## Cross-framework matrix


Observability is the only concern every framework covers; the bottom three rows are concerns the original never had. Read across a row to see one concern evolve, or down a column to see what a framework covers. In the ML and agent columns the mappings are analogies, not inheritance. A dash means no counterpart.

| Concern | Twelve-Factor (2011) | 12 Fractured Apps (2015) | Beyond the Twelve-Factor App (2016) | Container principles (2017) | ZenML ML factors (2020) | Community refresh (2024-) | 12-Factor Agents (2025) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Versioned source | I. One repo, many deploys | -- | 1. One codebase, one application | Image immutability | 1. Version code and data | -- | 2. Own your prompts |
| Dependencies | II. Declare and isolate | Ship artifacts, not build environments | 3. Dependency management | Self-containment | 2. Explicit feature dependencies | -- | -- |
| Config | III. Env vars | Optional file, defaults, env overrides | 5. Configuration, credentials and code | -- | 3. Config out of training code | -- | -- |
| Backing services | IV. Attached resources | Retry with backoff; no start order | 8. Backing services | -- | 9. Understand the upstream data | Many services, not one app | 4. Tools are structured outputs |
| Build and release | V. Build, release, run | Bootstrapping in the app, not in scripts | 4. Design, build, release, run | Image immutability | 4. Reproducible pipelines; 12. Deployable artifact | -- | -- |
| State | VI. Stateless processes | App creates its own directories | 12. Stateless processes | -- | -- | Starts with stateless request-based apps | 5. Unified state; 12. Stateless reducer |
| Exposure | VII. Port binding | -- | 11. Port binding | -- | -- | -- | 11. Trigger from anywhere |
| Scaling | VIII. Process model | -- | 13. Concurrency | Runtime confinement | -- | -- | 10. Small, focused agents |
| Lifecycle | IX. Disposability | Clean startup with retries | 7. Disposability | Lifecycle conformance; process disposability | -- | -- | 6. Launch, pause, resume |
| Parity | X. Dev/prod parity | -- | 9. Environment parity | Image immutability | 8. Experiments vs production; 9. Training-serving skew | -- | -- |
| Observability | XI. Logs to stdout | Log each retry and a startup message | 6. Logs; 14. Telemetry | High observability | 7. Tracking; 11. Monitoring | Logs widened to telemetry (proposed) | 9. Compact errors into context |
| One-off tasks | XII. Admin processes | -- | 10. Administrative processes | -- | 6. Continuous training | -- | -- |
| Interfaces between components | -- | -- | 2. API first | -- | -- | Service-to-service communication flagged | 1. Natural language to tool calls |
| Security and identity | -- | -- | 15. Authentication and authorization | -- | -- | Workload identity factor (proposed) | 7. Contact humans for approval |
| Quality and control of core logic | -- | -- | -- | -- | 5. Testing; 10. Comparability | -- | 3. Own your context; 8. Own your control flow; 13. Pre-fetch context |

## Synthesis


Each framework appeared when the unit of deployment changed, and each re-solved the same short list: observability, identity, contracts between parts and lifecycle signals.

**What survives everywhere.**

- **Immutable, traceable artifacts:** one codebase, immutable images, versioned data, prompts kept in code.
- **State and config outside the unit,** which makes the unit disposable: stateless processes, stateless reducers.
- **Observability,** the one concern in every column, growing from stdout logs to telemetry, health APIs and model monitoring.

**What keeps being added.** These are four things the 2011 Heroku platform handled invisibly:

1. **Observability beyond logs:** Hoffman (2016), Red Hat (2017), ZenML (2020), the refresh proposal (2024).
2. **Identity and security:** Hoffman (2016), the workload identity proposal (2024).
3. **Contracts between components:** API first (2016), tool calls as structured output (2025).
4. **Lifecycle behavior the platform can rely on:** Hightower (2015), Red Hat (2017), pause and resume (2025).

**Recurring flaws.**

- **Vendor origin.** Most frameworks come from a company with a platform or product: Heroku, Pivotal, Red Hat, ZenML, HumanLayer. The examples drift toward that product.
- **Examples age faster than principles.** Only the refresh separates the two.
- **Scope creep.** The more a framework covers, such as team process or coding style, the less it works as a checkable contract.
- **Secrets.** The original's env-var advice is the most criticized single decision. Keep secrets apart from config and fetch them at runtime from a manager that authenticates the workload ([Arcjet](https://arcjet.com/learn/storing-secrets-env-vars)).

**How to apply today.**

| If you are building | Start from | Add |
| --- | --- | --- |
| A web service on a PaaS | Twelve-Factor | Telemetry and auth from Beyond the Twelve-Factor App; secrets outside env vars |
| Services on Kubernetes | Twelve-Factor plus the container principles | Health and readiness endpoints; declared resource requests |
| ML training and serving | ZenML's factors | Twelve-Factor for the serving service |
| LLM features or agents | 12-Factor Agents | Twelve-Factor for the service that hosts the agent |

For any new rule, apply the refresh's scope test: if it isn't about the app-platform interface, treat it as team practice, not a factor.

## Related notes


- [Platform and delivery]({{< ref "engineering/platform" >}}): the platform side of the contract.
- [Operating services]({{< ref "system-design/elements/operating-services" >}}#cross-cutting-concerns): externalized configuration, health checks, and telemetry as system design choices.
- [GitOps]({{< ref "engineering/platform/gitops" >}}#secrets): where secrets go when configuration lives in Git.
- [Developer experience]({{< ref "engineering/platform/developer-experience" >}}): the narrow-conduit idea applied to platform teams.

## Sources


- [The Twelve-Factor App](https://12factor.net)
- [Twelve-Factor maintainers' blog](https://12factor.net/blog): [open-source announcement](https://www.12factor.net/blog/open-source-announcement), [December 2024 update](https://www.12factor.net/blog/december-monthly-updates), [Narrow Conduits and the Application-Platform Interface](https://12factor.net/blog/narrow-conduits)
- [twelve-factor/twelve-factor repository](https://github.com/twelve-factor/twelve-factor) and its [Update FAQ](https://github.com/twelve-factor/twelve-factor/blob/next/UPDATE_FAQ.md)
- [Heroku: Heroku Open Sources the Twelve-Factor App Definition](https://www.heroku.com/blog/heroku-open-sources-twelve-factor-app-definition/)
- [The New Stack: Heroku Moved Twelve-Factor Apps to Open Source. What's Next?](https://thenewstack.io/heroku-moved-twelve-factor-apps-to-open-source-whats-next/)
- [Kelsey Hightower: 12 Fractured Apps](https://medium.com/@kelseyhightower/12-fractured-apps-1080c73d481c)
- [Kevin Hoffman: Beyond the Twelve-Factor App (O'Reilly)](https://www.oreilly.com/library/view/beyond-the-twelve-factor/9781492042631/) and [preface](https://content.pivotal.io/blog/beyond-the-twelve-factor-app)
- [Cloud Foundry: How Many Factors Are There Anyway?](https://www.cloudfoundry.org/blog/how-many-factors-are-there-anyway/)
- [Bilgin Ibryam: Principles of Container-Based Application Design (Red Hat whitepaper)](https://www.redhat.com/rhdc/managed-files/cl-cloud-native-container-design-whitepaper-f8808kc-201710-v2-en.pdf) and [Kubernetes blog summary](https://kubernetes.io/blog/2018/03/principles-of-container-app-design/)
- [Ibryam and Huß: Kubernetes Patterns, 2nd edition](https://www.redhat.com/rhdc/managed-files/cl-oreilly-kubernetes-patterns-ebook-399085-202306-en.pdf)
- [ZenML: 12 Factors of Reproducible Machine Learning in Production](https://www.zenml.io/blog/12-factors-of-reproducible-machine-learning-in-production)
- [The 12+ Factor Model](https://divergingasymptotically.substack.com/p/the-12-factor-model-2-single-source)
- [HumanLayer: 12-Factor Agents](https://github.com/humanlayer/12-factor-agents)
- [AI Engineer: Dex Horthy speaker page](https://www.ai.engineer/speakers/dex-horthy)
- [Diogo Mónica: Why you shouldn't use ENV variables for secret data](https://diogomonica.com/2017/03/27/why-you-shouldnt-use-env-variables-for-secret-data)
- [Arcjet: Should you store secrets in environment variables?](https://arcjet.com/learn/storing-secrets-env-vars)
