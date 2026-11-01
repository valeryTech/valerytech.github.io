---
draft: false
toc: true
title: "Declarative AI System Configuration"
description: "Working requirements for versioned runnable AI configurations, separating system identity from environment bindings while supporting equivalent production and evaluation runs with reconstructible provenance."
linkTitle: "Declarative AI System Configuration"
---

These are working requirements for configuring an AI system. Open question: should the first component be a prompt registry and prompt-management system?

The system should use declarative configurations, possibly JSON, with a convenient way to find and select prompts by name and version. The configuration would be parsed and used by an interpreter to assemble the system. Open question: which principles from Helm or Terraform would be useful?

First, define the requirements:

- Convenient diffs.
- Possible composition from separate pieces.
- Visible history, specific versions, and how each version is assembled, possibly as a dependency tree.

----

Proposed primary requirement: **Reconstructible System Manifest**.

> Every deployable system revision shall have a versioned, declarative manifest that completely describes the system's intended configuration and fixed dependencies. Given this manifest, its immutable referenced artifacts, and only explicitly declared secret values, automation shall be able to provision or bind every dependency, start the system in a clean supported environment, and pass defined readiness and smoke tests without manual or undeclared configuration.

A few important refinements from the methodology:

- Keep `C` and `E_fixed` separate inside the manifest:
    - `C`: models, prompts, routing, tools, retrieval settings, policies, budgets.
    - `E_fixed`: runtimes, external service contracts, schemas, endpoints, infrastructure dependencies.
- Compute separate `C_fingerprint` and `E_fixed_fingerprint`; combine them into the `DeploymentKey`.
- Do not put observed conditions such as latency, service health, or rate limiting in the manifest. Those belong to `E_observed`.
- Store secrets only as references.

Component versions should be specified. For reproducibility, the resolved configuration must use immutable versions or content digests, never values such as `latest` or a provider's current default.

Proposed representations:

- `system.yaml`: readable declarative intent. It may contain acceptable version constraints.
- `system.lock.json`: fully resolved, defaults expanded, canonical, and immutable. This is what actually starts the system and produces the fingerprints.

Minimum acceptance criteria:

1. A clean-environment test can start the system using only the locked manifest and declared secret references.
2. Every executable component, prompt, model, policy, schema, dataset/index snapshot, and behaviorally relevant dependency has an immutable identifier.
3. Missing dependencies, floating versions, unresolved defaults, and undeclared runtime overrides fail validation.
4. Semantically equivalent manifests produce identical canonical forms and fingerprints.
5. Any behaviorally relevant configuration change changes `C_fingerprint`; any fixed dependency change changes `E_fixed_fingerprint`.
6. A semantic diff reports components and fields as added, removed, or changed, independently of formatting or field order.
7. Each external dependency is explicitly classified as either provisioned by the manifest or bound through a declared, versioned contract.

Concise requirement:

> **SC-1 -- Declarative reproducibility and identity:** The system shall be represented by a declarative, versioned, canonical manifest that is sufficient to reconstruct and start the declared system boundary, pins all resolved components and behaviorally relevant dependencies to immutable identities, and supports deterministic validation, fingerprinting, and semantic comparison.

This extends the methodology cleanly: the existing fingerprint specification answers "is this the same configuration?", while this requirement additionally answers "can this configuration produce a runnable system?"

Domain experts need to run the production system configuration with their own prompts, experiment with it, and reproduce production issues.

This extends the requirement to a **production-equivalent experimentation and replay environment**. The system configuration is one input to it.

### Proposed requirement


> **Production Sandbox and Replay:** A domain expert shall be able to select a production deployment or recorded production episode, start an isolated runnable instance with the corresponding system configuration, run their own prompts, modify approved configuration fields, inspect the resulting behavior and trace, compare it with production or another variant, and save the session as a reproducible experiment without writing code or causing production side effects.

The environment needs three related artifacts:

1. **Deployment Manifest**
    Describes what was running: models, system prompts, routing, tools, retrieval, policies, component versions, and fixed dependencies.
2. **Replay Case**
    Describes the production situation: user input, conversation context, relevant environment conditions, retrieval evidence, tool interactions, and the original trace and outcome.
3. **Experiment Record**
    Captures what the expert changed, every run performed, outputs, traces, fingerprints, and comparisons.

### Acceptance criteria


- A domain expert can launch the environment from a production deployment ID or incident/episode ID.
- No source-code changes are required to edit prompts, inputs, or other approved controls.
- The environment displays exactly which production configuration and component versions it represents.
- Each experimental change is shown as a semantic diff from the production baseline.
- Runs occur in an isolated environment; mutating tools are disabled, simulated, or require an explicit safe mode.
- The expert can choose between:
    - **Live mode:** invoke current non-production dependencies.
    - **Replay mode:** use captured retrieval results and tool responses from the production episode.
- Each run records the effective configuration, input, dependency fixtures, random seed where applicable, trace, output, and all relevant fingerprints.
- A saved experiment can be opened and rerun by another authorized person.
- Sensitive production data is redacted or access-controlled.
- If the original conditions cannot be reconstructed, the UI identifies what is missing instead of claiming successful reproduction.
- The expert can compare production and experimental runs at output, component, tool-call, retrieval, latency, cost, and evaluation-result levels.

One important distinction from the methodology: **the system manifest alone cannot reproduce a production issue**. Reproduction requires information from all relevant planes:

|Artifact content|Methodology plane|
|---|---|
|Model, prompts, router, tool policies|`C`|
|Original user input and context|`I`|
|Dependency identities and recorded behavior|`E_fixed` and `E_observed`|
|Evaluators and rubrics|`R`|
|Original output, trace, and metrics|`O`|

Proposed capability name: **Production Workbench**. Its concise requirement is:

> **PW-1 -- Production-equivalent experimentation and replay:** The system shall provide domain experts with a safe, no-code workspace in which they can run and modify a production configuration, replay recorded production episodes with their relevant conditions, compare variants, and preserve every session as an auditable and rerunnable experiment.

Exact output reproduction should not be promised because models and live dependencies can be nondeterministic. The defensible promise is to reconstruct the recorded controllable conditions, preserve the original execution evidence, and clearly report any conditions that could not be recreated.

## Simplest specification draft


The declarative configuration needs to define more than configuration values. It should define a **runnable system revision** that different consumers can instantiate consistently.

Proposed concepts:

```text
System source config
        ↓
      build / resolve
        ↓
Runnable system revision
        ↓
   bind environment
        ↓
   System instance
```


The important point is that production, evaluation, and the domain-expert workbench all consume the same runnable system revision.

## Declarative AI system configuration

### SC-1 -- Runnable system definition


A system shall have a versioned declarative configuration that defines all behaviorally relevant components required to construct the AI system, including prompts, models, routing, tools, policies, retrieval configuration, and other system components.

The configuration shall describe a runnable system boundary rather than an individual prompt or model call.

### SC-2 -- Buildable system revision


The system configuration shall be resolvable into an immutable runnable system revision.

Resolution shall:

- validate all component references;
- resolve every component to an immutable version;
- render composed prompts;
- expand behaviorally relevant defaults;
- validate required dependencies;
- produce a deterministic system identity or fingerprint.

A resolved system revision shall not depend on mutable identifiers such as `latest` or undeclared provider defaults.

### SC-3 -- Common runtime contract


A resolved system revision shall expose a standard way to instantiate and run the system.

At minimum, a consumer shall be able to:

1. create an isolated system instance from a resolved revision;
2. wait for the instance to become ready;
3. submit requests through a defined input interface;
4. receive system outputs;
5. collect execution traces and relevant runtime data;
6. terminate the instance.

This contract shall be shared by production, evaluation, replay, and interactive experimentation.

### SC-4 -- Configuration and environment separation


The behaviorally relevant system configuration shall be kept separate from environment-specific bindings.

For example, the system revision may declare that it requires:

- an LLM provider;
- a retrieval index;
- a tool endpoint;
- a secret;
- a persistence service.

The runtime environment supplies the corresponding bindings.

Changing an environment binding shall not silently change the declared system configuration.

### SC-5 -- Production-equivalent instantiation


Evaluation systems and authorized domain-expert tools shall be able to instantiate the same resolved system revision used in production.

A production deployment shall therefore record the exact runnable system revision it uses.

Given a production revision identifier, another subsystem shall be able to retrieve the corresponding configuration and instantiate it in a supported non-production environment.

### SC-6 -- Explicit execution modes


A runtime may provide different dependency bindings for different purposes, such as:

- production;
- evaluation;
- interactive experimentation;
- replay;
- test.

The selected execution mode and all bindings that can affect execution shall be recorded with each run.

The underlying resolved system revision shall remain identifiable independently of the execution mode.

### SC-7 -- Observable execution


Every request executed against a system instance shall produce enough structured execution information to support evaluation and debugging.

At minimum, the run record shall identify:

- resolved system revision;
- request/input;
- output;
- prompt versions and rendered prompts used;
- model invocations;
- tool calls;
- retrieval operations;
- relevant dependency identities;
- execution trace;
- errors.

### SC-8 -- Reconstructible run


Every production, evaluation, or experimental run shall reference the exact resolved system revision against which it was executed.

Where runtime conditions or external dependency behavior cannot be reconstructed exactly, those conditions shall be recorded separately from the system revision.

### SC-9 -- Traceable configuration history


Every published system revision shall have traceable history, including:

- source configuration;
- resolved configuration;
- referenced component versions;
- author and time of change;
- diff from previous revisions;
- immutable source-control or artifact identity.

A source-control repository such as Git may provide the underlying revision history.

The evaluation system does not need to understand how the AI application is assembled internally. It needs a runtime interface such as:

```text
revision = resolve("support-agent@42")

instance = runtime.start(
    revision,
    environment="evaluation"
)

result = instance.run(request)

trace = result.trace
```


The domain-expert workbench does essentially the same thing:

```text
revision = getProductionRevision("support-agent")

instance = runtime.start(
    revision,
    environment="sandbox"
)
```


And production:

```text
runtime.start(
    revision,
    environment="production"
)
```


The key new requirement is **a common runtime contract around an immutable system revision**.

Keep `environment=prod/eval/sandbox` outside the system configuration itself. Including it can create separate production, evaluation, and sandbox configurations that drift apart. The system revision should remain the same; environment bindings explain where and how that revision is running.

## Additional requirements and repeated specification draft


Open design question: what is needed to build or configure a runnable system? For example, the evaluation subsystem should be able to start the system, run a set of requests against it, and collect data. Domain experts should also be able to use the same system configuration as production.


The declarative configuration needs to define more than configuration values. It should define a **runnable system revision** that different consumers can instantiate consistently.

Proposed concepts:

```text
System source config
        ↓
      build / resolve
        ↓
Runnable system revision
        ↓
   bind environment
        ↓
   System instance
```


The important point is that production, evaluation, and the domain-expert workbench all consume the same runnable system revision.

## Declarative AI system configuration

### SC-1 -- Runnable system definition


A system shall have a versioned declarative configuration that defines all behaviorally relevant components required to construct the AI system, including prompts, models, routing, tools, policies, retrieval configuration, and other system components.

The configuration shall describe a runnable system boundary rather than an individual prompt or model call.

### SC-2 -- Buildable system revision


The system configuration shall be resolvable into an immutable runnable system revision.

Resolution shall:

- validate all component references;
- resolve every component to an immutable version;
- render composed prompts;
- expand behaviorally relevant defaults;
- validate required dependencies;
- produce a deterministic system identity or fingerprint.

A resolved system revision shall not depend on mutable identifiers such as `latest` or undeclared provider defaults.

### SC-3 -- Common runtime contract


A resolved system revision shall expose a standard way to instantiate and run the system.

At minimum, a consumer shall be able to:

1. create an isolated system instance from a resolved revision;
2. wait for the instance to become ready;
3. submit requests through a defined input interface;
4. receive system outputs;
5. collect execution traces and relevant runtime data;
6. terminate the instance.

This contract shall be shared by production, evaluation, replay, and interactive experimentation.

### SC-4 -- Configuration and environment separation


The behaviorally relevant system configuration shall be kept separate from environment-specific bindings.

For example, the system revision may declare that it requires:

- an LLM provider;
- a retrieval index;
- a tool endpoint;
- a secret;
- a persistence service.

The runtime environment supplies the corresponding bindings.

Changing an environment binding shall not silently change the declared system configuration.

### SC-5 -- Production-equivalent instantiation


Evaluation systems and authorized domain-expert tools shall be able to instantiate the same resolved system revision used in production.

A production deployment shall therefore record the exact runnable system revision it uses.

Given a production revision identifier, another subsystem shall be able to retrieve the corresponding configuration and instantiate it in a supported non-production environment.

### SC-6 -- Explicit execution modes


A runtime may provide different dependency bindings for different purposes, such as:

- production;
- evaluation;
- interactive experimentation;
- replay;
- test.

The selected execution mode and all bindings that can affect execution shall be recorded with each run.

The underlying resolved system revision shall remain identifiable independently of the execution mode.

### SC-7 -- Observable execution


Every request executed against a system instance shall produce enough structured execution information to support evaluation and debugging.

At minimum, the run record shall identify:

- resolved system revision;
- request/input;
- output;
- prompt versions and rendered prompts used;
- model invocations;
- tool calls;
- retrieval operations;
- relevant dependency identities;
- execution trace;
- errors.

### SC-8 -- Reconstructible run


Every production, evaluation, or experimental run shall reference the exact resolved system revision against which it was executed.

Where runtime conditions or external dependency behavior cannot be reconstructed exactly, those conditions shall be recorded separately from the system revision.

### SC-9 -- Traceable configuration history


Every published system revision shall have traceable history, including:

- source configuration;
- resolved configuration;
- referenced component versions;
- author and time of change;
- diff from previous revisions;
- immutable source-control or artifact identity.

A source-control repository such as Git may provide the underlying revision history.

The evaluation system does not need to understand how the AI application is assembled internally. It needs a runtime interface such as:

```text
revision = resolve("support-agent@42")

instance = runtime.start(
    revision,
    environment="evaluation"
)

result = instance.run(request)

trace = result.trace
```


The domain-expert workbench does essentially the same thing:

```text
revision = getProductionRevision("support-agent")

instance = runtime.start(
    revision,
    environment="sandbox"
)
```


And production:

```text
runtime.start(
    revision,
    environment="production"
)
```


The key new requirement is **a common runtime contract around an immutable system revision**.

Keep `environment=prod/eval/sandbox` outside the system configuration itself. Including it can create separate production, evaluation, and sandbox configurations that drift apart. The system revision should remain the same; environment bindings explain where and how that revision is running.

## gitops


Proposed approach: keep the declarative system configurations in Git and use a GitOps-like model.

The proposed division is:

- Git stores the authored desired state.
- Build/resolution produces an immutable resolved system revision.
- Deployment/eval/workbench consume that resolved revision.
- Runtime traces, outputs, metrics, and secrets live elsewhere.

Something like:

```text
repo/
  systems/
    support-agent/
      system.yaml

  prompts/
    company/
      base-policy/
        3.prompt
    support/
      refund-answer/
        17.prompt

  environments/
    prod/
      bindings.yaml
    eval/
      bindings.yaml
    sandbox/
      bindings.yaml
```


A commit provides a reproducible source snapshot:

```text
git commit abc123
    ↓
parse + validate
    ↓
resolve prompt references
resolve component versions
expand defaults
    ↓
resolved system revision
    ↓
fingerprint sha256:...
```


Treat the Git commit and the resolved revision as different identities.

For example:

```text
source_revision:
  git: abc123

system_revision:
  fingerprint: sha256:def456
```


That distinction is useful because two source configs could theoretically resolve to the same effective system, and a source commit can contain unrelated changes.

For production, record both:

```yaml
system: support-agent
source_revision: abc123
resolved_revision: sha256:def456
```


Then eval can say:

```text
run eval suite against sha256:def456
```


and the domain-expert workbench can say:

```text
open production revision sha256:def456
```


This is where the GitOps analogy fits well. Git holds the declared intent and history; automation reconciles or deploys from that intent.

Keep different kinds of records in the appropriate stores:

```text
Git:
  system definitions
  prompt source
  component references
  environment binding definitions
  policies
  schemas
  version constraints
  maybe lock files

Artifact store / registry:
  built/resolved manifests
  large immutable artifacts
  model adapters
  datasets/index snapshots

Secret store:
  credentials
  API keys

Observability / experiment store:
  traces
  outputs
  eval results
  latency
  costs
  production episodes
```


An early design decision is to deploy production from a resolved artifact, even if Git is the source of truth.

So:

```text
Git config
   ↓
CI build
   ↓
resolved manifest
   ↓
immutable artifact
   ↓
prod / eval / sandbox
```


instead of every runtime independently parsing Git and resolving dependencies.

This gives all consumers one shared build result.

Proposed requirement:

> System source configuration shall be stored in version control and treated as declarative desired state. Each published source revision shall be validated and resolved into an immutable runnable system revision. Production, evaluation, and experimentation environments shall instantiate that same resolved revision with environment-specific bindings.

That is essentially GitOps, but applied to an AI system definition rather than only infrastructure.

### single repo


Separate repos usually create more coordination work when prompts, system configs, and shared components must change together.

For this design, start with one dedicated configuration repository for the AI system definitions and prompts, even if application code lives elsewhere.

Something like:

```text
ai-config/
  prompts/
    shared/
    support/
    sales/

  systems/
    support-agent/
      system.yaml
    sales-agent/
      system.yaml

  environments/
    prod/
    eval/
    sandbox/
```


The main benefit is atomic change. One commit can say:

```text
- update support/refund-policy@8
- point support-agent to refund-policy@8
- update eval configuration
```


That commit is a coherent system revision.

With separate repos, the same change becomes:

```text
prompt repo      commit A
system repo      commit B
eval repo        commit C
```


Another mechanism is then needed to identify which combination of A, B, and C is the system revision. This is solvable, but adds coordination machinery early.

Separate repositories only when there is a strong ownership or access-control reason. For example, if several independent teams own components with separate release processes, then each component can have its own repo and publish immutable artifacts into a registry. The system config would reference those published versions:

```yaml
prompts:
  refund:
    ref: support/refund-policy@8
```


At that point Git repos become implementation details behind the registry.

A useful rule is:

```text
Things that commonly need to change atomically
→ keep together.

Things that have independent ownership and release cycles
→ can be separate.
```


Proposed first-version structure:

```text
application code repos
        │
        │ publish components
        ↓
AI configuration repo
  ├── system configs
  ├── prompts
  └── eval definitions
        ↓
     build
        ↓
resolved system artifact
```


Avoid Git submodules for this design. They tend to make the coordination problem visible to every contributor without actually removing it.

One dedicated `ai-config` monorepo is probably the simpler starting point. Split later when organizational boundaries make the split useful, while keeping the registry/version model stable.
