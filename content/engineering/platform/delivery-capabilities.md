---
draft: false
toc: true
title: "Delivery Capabilities"
description: "Delivery defined as an operating model above platform tooling: the production change as its central object, the change lifecycle and its two feedback loops, seven delivery capabilities, ownership and architecture, and how AI systems extend them."
document_status: "draft"
linkTitle: "Delivery Capabilities"
---

Part of [platform and delivery]({{< ref "engineering/platform" >}}).

**Question:** what must a delivery system be able to do so that a team can change production safely and learn from the result, whatever tools it uses?

The answer starts one level above platform capabilities: define the operating model and its goal first, then derive the capabilities from it.

## Delivery as an operating model


The delivery system exists to put changes in customers' hands in reliable, consistent, and frequent ways. Its goals are to protect customers and the business, to respond quickly, and to earn customer trust, by supporting small, frequent, reliable releases.

> **Delivery:** turn a candidate solution into a production system that can be changed, observed, and recovered safely.

This is stronger than "build and deploy software" because the deeper principle is uncertainty. Nobody can know perfectly whether a change is correct or how production will behave, so the delivery system should make learning, change, and recovery cheap.

Scrum, Kanban, CI/CD tooling, release trains, and similar practices are choices underneath these goals, not goals themselves. The same goes for deployment frequency. High frequency is evidence of low-friction delivery; the real target is speed combined with stability.

### Principles


The principles act as constraints on every change:

1. **Keep changes small and independently deployable.**
2. **Get feedback quickly.**
3. **Make production changes observable and recoverable.**
4. **Build safety into the delivery path.**
5. **Assume failures and optimize recovery:** rollback, graceful degradation, incident response, and low recovery time.
6. **Teams own production behavior:** finished coding is only an intermediate state.

The seven capabilities in this note are an inference from these principles, which draw on Marty Cagan; Cagan does not list them as a platform taxonomy.

## From Discovery to Delivery


Delivery begins with a **delivery commitment**. [Discovery]({{< ref "ai-engineering/delivery/ai-platform-discovery" >}}) hands over:

- a candidate solution;
- the evidence behind it;
- the remaining risks;
- the known constraints.

At that point the nature of the artifact changes:

| Phase | Artifact chain |
| --- | --- |
| Discovery | solution hypothesis -> prototype -> evidence |
| Delivery | candidate solution -> production change -> system in operation -> production evidence |

The central object of Delivery is the **production change**, not a feature or a project. As a sequence of work, the path after the commitment runs through production design, implementation, verification, release, and production operation, then observation and learning. The model below tracks the states of the change instead.

## Lifecycle of a production change

```text
            DISCOVERY
                │  candidate solution
                │  evidence
                │  remaining risks
                │  known constraints
                ▼
────── DELIVERY COMMITMENT ──────
                │
                ▼
        ┌───────────────┐
        │ CHANGE INTENT │
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │  IMPLEMENTED  │◄────────┐
        └───────┬───────┘         │
                ▼                 │
        enough evidence? ── no ───┘ revise
                │ yes
                ▼
        ┌───────────────┐
        │   VERIFIED    │
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │    EXPOSED    │
        │ to production │
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │   OBSERVED    │
        └───────┬───────┘
    ┌───────────┼─────────────┐
    ▼           ▼             ▼
 healthy    degraded    wrong outcome
    │           │             │
    │           ▼             │
    │     ┌───────────┐       │
    │     │  RECOVER  │       │
    │     │ rollback  │       │
    │     │ disable   │       │
    │     │ fallback  │       │
    │     └─────┬─────┘       │
    └───────────┼─────────────┘
                ▼
              LEARN
                │
        ┌───────┴───────┐
        ▼               ▼
   next change      Discovery
                  (solution or
                 outcome wrong)
```


These are states of the change, not prescribed stages or ceremonies. The platform capabilities are derived from the transitions between them, in the same way the Discovery capabilities are derived from the experiment lifecycle.

Observation has three exits:

- **Healthy:** continue and improve.
- **Degraded:** recover, then fix in a later change.
- **Wrong outcome:** the change runs, but the solution does not produce the intended result; the question goes back to Discovery.

### State semantics


| State | Question it answers |
| --- | --- |
| **Change intent** | What production behavior is the change meant to alter, and why? |
| **Implemented** | Is there an executable, production-quality representation of the change? |
| **Verified** | Is there enough evidence to expose it to production? |
| **Exposed** | Which users, traffic, or systems does it currently affect? |
| **Observed** | What is actually happening under production conditions? |
| **Healthy** | Is the change behaving within acceptable operational bounds? |
| **Recovered** | If it failed, has its impact been safely reduced or removed? |

There is deliberately no state called "done". Finished coding is only an intermediate state, and teams own what happens in production.

### Two feedback loops


Delivery creates two related loops:

| Loop | Path | Question | If the answer is no |
| --- | --- | --- | --- |
| **Engineering loop** | implement -> verify -> release -> observe -> learn | Can customers safely depend on this change? | Recover, then learn. |
| **Product loop** | production change -> real usage -> measured outcome | Did the solution produce the intended result? | Go back to Discovery. |

A change can be operationally successful while the solution is wrong:

```text
service healthy      ✓
latency acceptable   ✓
errors low           ✓
customers use it     ✗

→ delivery worked
→ the solution hypothesis didn't
```

### What a production change contains


| Part | Question | Contents |
| --- | --- | --- |
| **Intent** | What behavior or outcome is the change meant to create? | Expected behavior, affected capability, reason and outcome context |
| **Implementation** | Is there an executable representation of the change? | Artifacts and configuration: code, config, models, prompts, data |
| **Verification evidence** | What evidence says the change is safe enough? | Tests, evaluations, security checks |
| **Exposure** | How does it reach users? | Where, who, and how much |
| **Observability** | How is it observed and controlled? | Expected signals, failure signals |
| **Recovery** | What happens when assumptions are wrong? | Rollback, disable, fallback |
| **Production evidence** | What did reality teach? | Behavior, incidents, outcome signals |

## The seven delivery capabilities


> **Delivery capability:** an organizational or technical ability that lets a team change production safely and get feedback about the result.

The capabilities describe what the delivery system must be able to do, independent of particular tools. They follow the lifecycle in order, from change intent to learning.

| Capability | Core question | What it needs to enable |
| --- | --- | --- |
| **Change management** | What is changing, and can the change be reasoned about independently? | Small changes, clear intent, ownership, dependencies, version history |
| **Build and integration** | Can changes become a reproducible, integrated artifact quickly? | Automated builds, integration, environments, dependency resolution |
| **Verification** | What evidence shows the change is safe enough to expose? | Automated tests, integration tests, security checks, quality checks |
| **Release and exposure control** | How much production risk is taken at once? | Deployment, gradual rollout, feature flags, targeting, release controls |
| **Observability** | Once exposed, what is the change actually doing? | Metrics, logs, traces, health signals, customer-impact signals |
| **Recovery** | If the assumptions are wrong, how quickly can the damage be limited? | Rollback, disable, fallback, isolation, incident response |
| **Production learning** | What did reality teach? | Failure analysis, outcome data, feedback into the next change or Discovery |

### Change management


Change management starts before CI.

Keeping changes small and independently deployable means the system has to preserve the identity of a change: its intent, owner, implementation, dependencies, verification evidence, and production state.

The useful property is **independent reasoning**. If changing one behavior requires coordinating fifteen repositories, three teams, a database migration, and a release train, the delivery system has high friction, however sophisticated its CI tool is. This is where the capability reaches into [architecture](#architecture).

**Mechanisms:** intent records, version history, dependency tracking.

### Build and integration


Build and integration turns source changes into something that can be verified and released:

source change -> integrate -> build -> deployable artifact

The important properties are **reproducibility** and **short feedback time**. A healthy system lets an engineer answer one question quickly: does this change integrate with the current system? If the answer arrives tomorrow, uncertainty accumulates.

**Mechanisms:** CI, trunk-based development, dependency management, artifact repositories, environment provisioning, configuration management. These implement the capability; they are not the capability.

### Verification


Verification is the evidence-generating part of Delivery. Automated testing and related automation are what make frequent delivery economically possible.

A change collects evidence about:

- unit behavior;
- integration behavior;
- contracts;
- security;
- performance, where relevant;
- product-specific checks.

The question the evidence answers is whether the change is safe enough for the next exposure.

"Verified" does not mean "proved correct". In a model built on uncertainty, verification reduces uncertainty enough to justify taking the next amount of production risk. Probabilistic AI evaluations fit the same abstraction; see [probabilistic verification](#probabilistic-verification).

**Mechanisms:** CI, automated tests, AI evals, security checks.

### Release and exposure control


Deployment and exposure are separate concepts:

- **Deployment:** the software exists in production.
- **Exposure:** customers or traffic actually use it.

Separating them gives a much richer risk control than a binary deployed or not deployed:

```text
0% → internal → 1% → 10% → 50% → 100%
```


> **Release and exposure control:** control the amount of real-world risk taken while evidence accumulates.

This follows directly from the principles of small changes, rapid feedback, and safe production changes.

**Mechanisms:** deployment, feature flags, canaries, staged rollout, dark launches, traffic routing, targeted cohorts. See [progressive delivery]({{< ref "engineering/platform/deployment" >}}#progressive-delivery).

### Observability


Verification shows what happened under controlled conditions. Observability shows what is happening under actual conditions, where assumed behavior meets production reality after release.

At minimum, teams need to detect whether the system is healthy. A stronger delivery system connects technical signals to the particular change and, where possible, to customer impact. Observability therefore spans four layers:

1. System health.
2. Request and workflow behavior.
3. Change-specific behavior.
4. Customer experience.

**Mechanisms:** logs, metrics, traces, dashboards, alerting, SLOs, change correlation, quality monitoring.

### Recovery


Recovery exists because the model assumes failure. Recovery has levels, from the lightest intervention to the heaviest:

1. Disable the problematic behavior.
2. Reduce exposure.
3. Fall back to safe behavior.
4. Roll back the change.
5. Repair the system or its data.

A mature system does not depend on engineers predicting every possible failure. It makes failures **bounded and reversible**. For that reason, rollback and kill switches are more fundamental than sophisticated deployment-frequency metrics.

**Mechanisms:** rollback, kill switches, fallbacks, graceful degradation, isolation, incident response.

### Production learning


Production learning closes the loop. Delivery does not end when the release succeeds, because teams are responsible for what happens in production.

Production produces two kinds of evidence, with different destinations:

| Evidence | Question | Goes to |
| --- | --- | --- |
| **Operational** | Is the system working correctly? | The next Delivery change |
| **Product** | Is the solution producing the intended outcome? | Discovery |

This is the link from Delivery back to Discovery.

**Mechanisms:** incident and failure analysis, production evals, outcome data and feedback.

## Cross-cutting concerns


Two things are not separate capabilities, because they shape all seven.

### Ownership


"Teams own what happens in production" affects every capability, from change intent through incident recovery.

### Architecture


Architecture determines whether the capabilities are cheap or expensive. Independently deployable changes require systems designed to permit independent change, so the principles put pressure on coupling, APIs, database migrations, ownership and component boundaries, and test design.

A highly coupled system can technically have CI/CD, observability, and rollback while still making every change difficult.

### The resulting model

```text
════════════════════ TEAM OWNERSHIP ════════════════════

CHANGE → BUILD → VERIFY → EXPOSE → OBSERVE ──► RECOVER
  ▲                                   │           │
  │                                   ▼           │
  └──────────────────────────────── LEARN ◄───────┘

═══════════════ ARCHITECTURE UNDERNEATH ════════════════
```

## Extending to AI systems


> **Principle:** the delivery platform should improve the generic capabilities first. AI-specific capabilities extend verification, exposure, observation, and recovery where probabilistic behavior creates new uncertainty.

This prevents an isolated AI delivery stack, disconnected from how good software delivery already works.

The starting point is the production change lifecycle, not components such as an agent runtime, an LLM gateway, or a prompt registry. The seven generic capabilities are the base. Take them one at a time and ask what changes when the production system contains models, RAG, agents, tools, prompts, and probabilistic behavior. The answers are the AI delivery platform, built on the same base.

### What an AI change contains


In an AI system, the implementation of a change can contain much more than application code:

- application code;
- model choice;
- prompts;
- agent instructions and behavior;
- tool definitions;
- retrieval configuration;
- evaluation data;
- policy;
- data transformations and other configuration.

These are all still production changes, governed as changes to production behavior. The delivery system treats them the same way: change, verify, release safely, observe, recover.

### Probabilistic verification


The AI-specific complication is that verification becomes probabilistic.

Traditional software verification asks:

- Does it compile?
- Do the tests pass?
- Does integration work?

AI delivery adds:

- Does behavior remain within acceptable bounds?
- Did quality regress?
- Do important failure cases still pass?
- Did cost or latency change?
- Does the agent still use tools correctly?

## Related notes


- [Platform and delivery]({{< ref "engineering/platform" >}}): the index for this folder.
- [AI platform discovery]({{< ref "ai-engineering/delivery/ai-platform-discovery" >}}): the upstream Discovery side, which hands Delivery a candidate solution, evidence, risks, and constraints.
- [Deployment]({{< ref "engineering/platform/deployment" >}}#progressive-delivery): progressive delivery, the mechanisms behind release and exposure control.
- [GitOps]({{< ref "engineering/platform/gitops" >}}): versioned, reviewable changes to declared state, with rollback as a revert.
- [Developer experience]({{< ref "engineering/platform/developer-experience" >}}): the platform as a product, and measuring delivery with DORA.
- [Engineering lifecycle techniques]({{< ref "engineering/architecture/techniques" >}}): spikes, prototypes, walking skeletons, and rollout techniques, chosen by the uncertainty they resolve.
- [AI product design and delivery framework]({{< ref "ai-engineering/delivery/design-and-delivery" >}}): an AI project lifecycle from build through release and operation.

## Sources


- Marty Cagan (Silicon Valley Product Group): the delivery principles draw on his product-delivery writing. No specific work is recorded for them. For his view of discovery, see the [AI discovery platform]({{< ref "ai-engineering/delivery/ai-platform-discovery" >}}#sources).

## Library sources


- [Kim et al. 2021](/sources/5b8562bf89faccfe430b6176be9350e6.bin), *The DevOps Handbook, Second Edition* -- the Three Ways (chapters 1-4) behind the small-batch, fast-feedback and learning principles in *Principles*; chapter 11 on continuous integration and trunk-based development, for *Build and integration*; chapter 12 on feature toggles, canary releases and dark launches, for *Release and exposure control*; chapters 14-15 on telemetry, for *Observability*

Further reading:

- Observability Engineering, 2nd edition, *O'Reilly early release, chapters 1-4* -- what observability is and why it differs from monitoring (chapter 1), and validating developer intent in production (chapter 2), on *Observability*
