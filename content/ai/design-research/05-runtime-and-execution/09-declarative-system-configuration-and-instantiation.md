---
draft: false
toc: true
description: "Proposes resolving versioned AI components into immutable runnable system revisions, with one lifecycle interface and separate environment bindings for production, evaluation, replay, and expert experimentation."
title: "09 Declarative System Configuration And Instantiation"
linkTitle: "09 Declarative System Configuration And Instantiation"
---
# Declarative system configuration and instantiation


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The sequence of proposals and author corrections first proposes minimal declarative configuration requirements, then expands the proposal after the author asks how evaluation and expert tools could start the same system configuration used in production. Both formulations are retained with editorial wording, including their different requirement identifiers.

Read the [sibling comments]({{< ref "ai/design-research/05-runtime-and-execution/09-declarative-system-configuration-and-instantiation-comments" >}}) for the distinction between source configuration, a resolved revision, environment bindings, an instance, and a run. The proposed runtime interface is not an implemented contract or a guarantee of identical outcomes.

The preceding [prompt discussion]({{< ref "ai/design-research/05-runtime-and-execution/08-prompt-text-composition-and-registry" >}}) explains the text and reference model. The dialogue continues in [configuration publishing and version identity]({{< ref "ai/design-research/05-runtime-and-execution/10-configuration-publishing-and-version-identity" >}}). Related [program and run history]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) remains separate.

The original source overview (archived source 015) links the complete split. The audit records the original range and checksum.

<!-- Declarative system configuration and instantiation source begins below. -->

<a id="user"></a>

## Author requirement or open question


Author request: Define a minimal set of requirements for declarative AI-system configuration.

<a id="assistant"></a>

## LLM proposal


The proposal is to keep the first version small and make it cover only reproducibility, identity, references, and inspection.

#### Declarative AI system configuration

##### DC-1 -- Declarative system definition


A deployable AI system shall be described by a versioned declarative configuration that defines the behaviorally relevant components and their relationships.

The configuration shall be readable without executing application code.

##### DC-2 -- Explicit component identity


Every referenced component shall have a stable logical name and an explicit version or immutable identifier.

This includes at minimum:

- prompts
- models
- tools
- routing or orchestration configuration
- policies or other behaviorally relevant configuration

Floating identifiers such as `latest` or implicit provider defaults shall not be allowed in a resolved production configuration.

##### DC-3 -- Prompt references


Prompts shall be referenced by a stable identifier of the form:

`namespace/prompt-name@version`

The referenced prompt must exist and be resolvable before the system configuration is considered valid.

Prompt content may itself reference other versioned prompts. The system shall validate and resolve those references recursively.

##### DC-4 -- Deterministic resolution


The declarative configuration shall resolve into a complete effective configuration.

Given the same configuration and the same immutable referenced artifacts, resolution shall produce the same:

- component identities
- prompt dependency graph
- rendered prompt text
- effective system configuration

Unresolved references, missing components, circular dependencies, or unsupported configuration shall fail validation.

##### DC-5 -- Inspectability


For any resolved system configuration, a user shall be able to inspect:

- the original declarative configuration
- the resolved configuration
- the versions of all referenced components
- the prompt dependency tree
- the exact rendered prompt text supplied to the model

The system shall make clear where resolved prompt content originated.

##### DC-6 -- Traceable history


Every production system revision shall be associated with an immutable configuration revision.

It shall be possible to determine:

- what configuration was deployed
- which prompt versions and component versions it used
- who changed the configuration
- when it changed
- the textual diff between revisions

A source-control repository such as Git may provide this history.

##### DC-7 -- Reproducible deployment identity


Each resolved configuration shall have a deterministic fingerprint derived from its behaviorally relevant resolved content and immutable component identities.

A production run shall record the resolved configuration fingerprint or an equivalent immutable deployment identifier.

This identifier shall be sufficient to locate the exact configuration and prompt versions used by that run.

##### DC-8 -- Semantic scope


The declarative configuration shall contain intended system configuration and fixed dependencies.

Runtime observations such as current latency, service health, rate limits, transient errors, and other execution conditions shall be recorded separately and shall not form part of the declarative system definition.

The proposal is to stop there for the first iteration. In particular, the proposal is to leave variables, conditional configuration, templating, environment inheritance, overlays, secrets, approval workflows, and a lock-file format out until there is a concrete need for them.

The core model is then simply:

```text
system config
    ↓
versioned component references
    ↓
validation + resolution
    ↓
resolved system
    ↓
deterministic identity
```


And prompts fit into it as one component type, with their own text-first versioning and recursive `@prompt` references.

<a id="user-1"></a>

## Author requirement or open question


Additional author requirement: Identify what is needed to build or configure a system. For evaluation, the evaluation subsystem should be able to start the system, run a set of requests, and collect data. Domain experts should also be able to use the same system configuration as production.

<a id="assistant-1"></a>

## LLM proposal


This suggests the declarative configuration needs to define something stronger than "configuration values." It should define a **runnable system revision** that different consumers can instantiate consistently.

The proposal is to introduce three concepts:

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

#### Declarative AI system configuration

##### SC-1 -- Runnable system definition


A system shall have a versioned declarative configuration that defines all behaviorally relevant components required to construct the AI system, including prompts, models, routing, tools, policies, retrieval configuration, and other system components.

The configuration shall describe a runnable system boundary rather than an individual prompt or model call.

##### SC-2 -- Buildable system revision


The system configuration shall be resolvable into an immutable runnable system revision.

Resolution shall:

- validate all component references;
- resolve every component to an immutable version;
- render composed prompts;
- expand behaviorally relevant defaults;
- validate required dependencies;
- produce a deterministic system identity or fingerprint.

A resolved system revision shall not depend on mutable identifiers such as `latest` or undeclared provider defaults.

##### SC-3 -- Common runtime contract


A resolved system revision shall expose a standard way to instantiate and run the system.

At minimum, a consumer shall be able to:

1. create an isolated system instance from a resolved revision;
2. wait for the instance to become ready;
3. submit requests through a defined input interface;
4. receive system outputs;
5. collect execution traces and relevant runtime data;
6. terminate the instance.

This contract shall be shared by production, evaluation, replay, and interactive experimentation.

##### SC-4 -- Configuration and environment separation


The behaviorally relevant system configuration shall be kept separate from environment-specific bindings.

For example, the system revision may declare that it requires:

- an LLM provider;
- a retrieval index;
- a tool endpoint;
- a secret;
- a persistence service.

The runtime environment supplies the corresponding bindings.

Changing an environment binding shall not silently change the declared system configuration.

##### SC-5 -- Production-equivalent instantiation


Evaluation systems and authorized domain-expert tools shall be able to instantiate the same resolved system revision used in production.

A production deployment shall therefore record the exact runnable system revision it uses.

Given a production revision identifier, another subsystem shall be able to retrieve the corresponding configuration and instantiate it in a supported non-production environment.

##### SC-6 -- Explicit execution modes


A runtime may provide different dependency bindings for different purposes, such as:

- production;
- evaluation;
- interactive experimentation;
- replay;
- test.

The selected execution mode and all bindings that can affect execution shall be recorded with each run.

The underlying resolved system revision shall remain identifiable independently of the execution mode.

##### SC-7 -- Observable execution


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

##### SC-8 -- Reconstructible run


Every production, evaluation, or experimental run shall reference the exact resolved system revision against which it was executed.

Where runtime conditions or external dependency behavior cannot be reconstructed exactly, those conditions shall be recorded separately from the system revision.

##### SC-9 -- Traceable configuration history


Every published system revision shall have traceable history, including:

- source configuration;
- resolved configuration;
- referenced component versions;
- author and time of change;
- diff from previous revisions;
- immutable source-control or artifact identity.

A source-control repository such as Git may provide the underlying revision history.

The architectural consequence is useful. The evaluation system doesn't need to understand how the AI application is assembled internally. It needs something like:

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


So the working interpretation is that the key new requirement is **a common runtime contract around an immutable system revision**.

Another proposal is to resist making `environment=prod/eval/sandbox` part of the system configuration itself. Otherwise you quickly get separate "production config," "evaluation config," and "sandbox config," and they drift. The system revision should remain the same; environment bindings explain where and how that revision is running.
