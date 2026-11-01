---
draft: false
toc: true
description: "A design dialogue narrows prompt management to named text versions, ordinary diffs, online editing, checked references, rendered output, and traceable history, initially excluding variables."
title: "08 Prompt Text Composition And Registry"
linkTitle: "08 Prompt Text Composition And Registry"
---
# Prompt text, composition, and registry


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The sequence of proposals and author corrections follows the prompt discussion from a broad registry proposal through the author's corrections to a smaller text format. The opening message includes system-manifest and production-workbench context. All questions, arguments, examples, and corrections remain represented; wording and dialogue role labels have been reformulated for standalone reading.

The final request starts with named prompt versions, online editing, rendered text, prompt references, traceable history, and no variables. Earlier proposals remain part of the discussion rather than an accepted feature list. Read the [sibling comments]({{< ref "ai/design-research/05-runtime-and-execution/08-prompt-text-composition-and-registry-comments" >}}) for the changes in scope and open rendering rules.

The dialogue continues in [declarative system configuration and instantiation]({{< ref "ai/design-research/05-runtime-and-execution/09-declarative-system-configuration-and-instantiation" >}}). Related [inspectable workbenches]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}) and [program and run history]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) retain their separate models.

The original source overview (archived source 015) links the complete split. The unchanged prompt-registry archive (archived source 014) contains the same opening discussion under a different title. The audit records both source identities and the shared text without a second import.

<!-- Prompt text, composition, and registry source begins below. -->

<a id="user"></a>

## Author requirement or open question


Initial author question: Should a prompt registry and prompt-management system be built first, based on the AI-system requirements below?

Initial requirements: Use declarative configurations, possibly JSON, with a convenient way to find and select prompts by name and version. The system would parse the configuration and use some kind of interpreter. Open question: Which principles from declarative solutions such as Helm or Terraform would apply?

Scope constraint: Define the desired requirements first.

- A convenient diff.
- Possible later assembly from several pieces.
- Author requirement: Inspect the history of a specific version, possibly as a tree, and see how it is assembled.

\----

The proposal is to define one primary requirement: **Reconstructible System Manifest**.

> Every deployable system revision shall have a versioned, declarative manifest that completely describes the system's intended configuration and fixed dependencies. Given this manifest, its immutable referenced artifacts, and only explicitly declared secret values, automation shall be able to provision or bind every dependency, start the system in a clean supported environment, and pass defined readiness and smoke tests without manual or undeclared configuration.

A few important refinements from the methodology:

- Keep `C` and `E_fixed` separate inside the manifest:
  - `C`: models, prompts, routing, tools, retrieval settings, policies, budgets.
  - `E_fixed`: runtimes, external service contracts, schemas, endpoints, infrastructure dependencies.
- Compute separate `C_fingerprint` and `E_fixed_fingerprint`; combine them into the `DeploymentKey`.
- Do not put observed conditions such as latency, service health, or rate limiting in the manifest. Those belong to `E_observed`.
- Store secrets only as references.

Component versions should be specified. For reproducibility, the resolved configuration must use immutable versions or content digests, never values such as `latest` or a provider's current default.

Two representations are suggested:

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

The proposed short form for a requirements document is:

> **SC-1 -- Declarative reproducibility and identity:** The system shall be represented by a declarative, versioned, canonical manifest that is sufficient to reconstruct and start the declared system boundary, pins all resolved components and behaviorally relevant dependencies to immutable identities, and supports deterministic validation, fingerprinting, and semantic comparison.

This extends the methodology cleanly: the existing fingerprint specification answers "is this the same configuration?", while this requirement additionally answers "can this configuration produce a runnable system?"

Author requirement: Domain experts should be able to run the production system with their prompts, experiment with it, and reproduce production issues.

That changes the requirement: the real product is a **production-equivalent experimentation and replay environment**. The system configuration is one input to it.

##### Proposed requirement


> **Production Sandbox and Replay:** A domain expert shall be able to select a production deployment or recorded production episode, start an isolated runnable instance with the corresponding system configuration, run their own prompts, modify approved configuration fields, inspect the resulting behavior and trace, compare it with production or another variant, and save the session as a reproducible experiment without writing code or causing production side effects.

You need three related artifacts:

1. **Deployment Manifest**
   Describes what was running: models, system prompts, routing, tools, retrieval, policies, component versions, and fixed dependencies.
2. **Replay Case**
   Describes the production situation: user input, conversation context, relevant environment conditions, retrieval evidence, tool interactions, and the original trace and outcome.
3. **Experiment Record**
   Captures what the expert changed, every run performed, outputs, traces, fingerprints, and comparisons.

##### Acceptance criteria


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

| Artifact contentMethodology plane           |                            |
| ------------------------------------------- | -------------------------- |
| Model, prompts, router, tool policies       | `C`                        |
| Original user input and context             | `I`                        |
| Dependency identities and recorded behavior | `E_fixed` and `E_observed` |
| Evaluators and rubrics                      | `R`                        |
| Original output, trace, and metrics         | `O`                        |

The resulting proposal is to name the capability **Production Workbench**, with this concise requirement:

> **PW-1 -- Production-equivalent experimentation and replay:** The system shall provide domain experts with a safe, no-code workspace in which they can run and modify a production configuration, replay recorded production episodes with their relevant conditions, compare variants, and preserve every session as an auditable and rerunnable experiment.

Exact output reproduction should not be promised because models and live dependencies can be nondeterministic. The defensible promise is to reconstruct the recorded controllable conditions, preserve the original execution evidence, and clearly report any conditions that could not be recreated.

<a id="assistant-reasoning"></a>

## LLM rationale for the proposal


The LLM rationale frames the proposal as a declarative, versioned prompt registry: immutable prompt modules, composable assemblies, dependency locking, semantic diffs, lineage trees, environment aliases, validation, and reproducible resolution--borrowing Terraform and Helm's strongest patterns.

<a id="assistant"></a>

## LLM proposal


The proposal is to make the prompt system a first-class subsystem before trying to generalize the whole system manifest.

The central requirement should be:

> **PR-1 -- Reconstructible Prompt Graph:** Every prompt used by a runnable system shall resolve from a named, versioned declarative specification into a complete immutable prompt artifact. The resolved artifact shall contain the exact prompt structure, all referenced prompt components, resolved versions, parameters, and dependency identities required to reconstruct it deterministically. The system shall expose its composition graph, provenance, semantic diff, and content fingerprint.

That gives you the equivalent of the Terraform idea of "configuration -> dependency resolution -> locked concrete result", while keeping prompts understandable to domain experts.

<a id="i-would-use-three-representations"></a>

##### Three proposed representations


| Artifact | Purpose | Mutable? |
|---|---|---:|
| `prompt.yaml` | Human-authored definition | Yes |
| `prompt.lock.json` | Fully resolved composition graph | No |
| Resolved prompt artifact | Exact messages/text sent to the model before runtime input interpolation | No |

The proposal is to prefer YAML for authoring and canonical JSON internally. JSON is good for machines, but nested prompt text and composition become unpleasant to edit directly.

For example, an authored prompt could eventually look roughly like:

```yaml
apiVersion: prompts/v1
kind: Prompt

metadata:
  name: customer-support/answer
  version: 2.4.0

inputs:
  customer_tier:
    type: string
  locale:
    type: string

messages:
  - role: system
    use: company/base-assistant@^3.0

  - role: system
    use: customer-support/policy@1.8.2

  - role: system
    content: |
      Customer tier: {{ customer_tier }}
      Respond using locale {{ locale }}.

  - role: developer
    use: customer-support/answering-rules@2.1.0
```


The lock would resolve this to something like:

```json
{
  "name": "customer-support/answer",
  "version": "2.4.0",
  "digest": "sha256:...",
  "dependencies": [
    {
      "name": "company/base-assistant",
      "version": "3.2.1",
      "digest": "sha256:..."
    },
    {
      "name": "customer-support/policy",
      "version": "1.8.2",
      "digest": "sha256:..."
    }
  ]
}
```


The lock should also preserve the complete assembled structure, so resolving it never requires asking the registry what "`^3.0` currently means."

<a id="requirements-i-would-put-around-pr-1"></a>

##### Proposed supporting requirements for PR-1


| ID | Requirement |
|---|---|
| PR-2 | **Stable identity.** Prompts and prompt components have stable names and immutable published versions. |
| PR-3 | **Immutable content identity.** Every published artifact has a content digest. An existing `name + version` cannot be republished with different content. |
| PR-4 | **Deterministic resolution.** The same source definition, lock file, and variables produce the same resolved prompt structure. |
| PR-5 | **Explicit composition.** A prompt may depend on other prompt components. Those dependencies form an explicit directed acyclic graph. |
| PR-6 | **Inspectable assembly.** A user can see the complete resolved prompt and where every section came from. |
| PR-7 | **Semantic diff.** Two prompt versions can be compared independently of YAML/JSON formatting, key ordering, or comments. |
| PR-8 | **Dependency diff.** A comparison identifies direct text changes separately from changes inherited through dependencies. |
| PR-9 | **Typed inputs.** Prompt variables have declared names, types, required/default status, and validation rules. |
| PR-10 | **No unresolved production dependencies.** A production prompt must resolve completely to immutable versions/digests before deployment. |
| PR-11 | **Search and discovery.** Users can find prompts by name, version, tags, owner, deployment, digest, and referenced component. |
| PR-12 | **Lineage.** Given any resolved prompt, the system can show its complete dependency tree and the version/digest of every node. |
| PR-13 | **Reverse lineage.** Given a prompt component, users can determine which prompts and deployments depend on it. |
| PR-14 | **Deployment traceability.** A production deployment records the exact resolved prompt digest, never only a mutable name such as `production`. |
| PR-15 | **Auditable promotion.** Moving a prompt version into staging or production records who promoted which immutable artifact and when. |
| PR-16 | **Validation before publication.** Cycles, missing references, invalid variables, incompatible schemas, and unresolved versions fail before publication. |

PR-8 is particularly important. Consider:

```text
customer-support/answer@2.4.0
 ├── company/base-assistant@3.2.1
 ├── customer-support/policy@1.8.2
 └── customer-support/answering-rules@2.1.0
```


Then you compare `2.4.0` against `2.5.0`:

```text
customer-support/answer
  direct content             unchanged

dependencies
  company/base-assistant     3.2.1 → 3.3.0
  customer-support/policy    unchanged
  answering-rules            2.1.0 → 2.1.1

effective prompt
  system[0]
    + Added instruction: ...

  developer[0]
    - ...
    + ...
```


This is much more useful than a textual YAML diff.

##### Names, versions, digests, and aliases should mean different things


The proposal is to keep these concepts separate:

```text
customer-support/answer       ← stable logical name

2.4.0                         ← human release version

sha256:91abc...               ← immutable actual identity

production                    ← mutable pointer
candidate                     ← mutable pointer
```


So these operations have clear semantics:

```text
get("customer-support/answer", "2.4.0")

resolve("customer-support/answer", "^2.0")

getByDigest("sha256:91abc...")

resolveAlias("customer-support/answer", "production")
```


A deployment should ultimately contain:

```text
sha256:91abc...
```


and perhaps the friendly metadata:

```text
customer-support/answer@2.4.0
```


The digest is authoritative.

<a id="composition-is-where-i-would-borrow-from-terraform-more-than-helm"></a>

##### Composition principles drawn from Terraform and Helm


Helm allows powerful templating, but that flexibility can make the final result hard to reason about.

For prompts, the initial proposal is to prohibit arbitrary code in templates.

Keep composition declarative:

```text
Prompt
 ├── message
 │    └── fragment
 ├── message
 │    ├── fragment
 │    └── fragment
 └── message
```


Allow explicit parameters and explicit references.

Avoid, initially, a template language where prompt authors can write loops, arbitrary functions, complicated conditionals, dynamic dependency names, or filesystem operations.

You want to be able to answer:

> Why does this sentence exist in the production prompt?

And get:

```text
customer-support/answer@2.4.0
  → customer-support/policy@1.8.2
    → refunds/common-rules@4.1.0
      → lines 31–38
```


That's essentially `terraform graph` + `terraform providers lock` + an `explain` command adapted to prompts.

##### The management interface then falls out naturally


The proposed conceptual UI around a prompt is:

```text
customer-support/answer
──────────────────────────────

Production     2.4.0
Candidate      2.5.0
Latest         2.5.1

Versions
  2.5.1
  2.5.0
  2.4.0
  ...

Composition
  answer
   ├─ base-assistant 3.2.1
   ├─ support-policy 1.8.2
   └─ answering-rules 2.1.0

[Resolved prompt]

[Compare with...]
[Run]
[Create variant]
[Promote]
```


For domain experts, "Create variant" should create another declarative revision. They don't need Git, JSON editing, or source-code changes.

And the Production Workbench can say:

```text
Production episode #784213

System
  support-agent@7.13

Prompts
  customer-support/answer@2.4.0
    sha256:91abc...

[Open prompt]
[View assembly]
[Compare]
[Create experiment from this version]
```


That connects the registry cleanly to the replay requirement.

##### One additional concept: source diff versus effective diff


The working interpretation is that you need both.

A **source diff** answers:

```text
What did I edit?
```


An **effective diff** answers:

```text
What will the model actually see differently?
```


Those are frequently different when composition exists.

For example:

```text
answer@2.4 → answer@2.5

Source changes:
  dependency base-assistant
    3.2 → 3.3

Effective changes:
  system message
    line 18 removed
    lines 22–25 added
```


For experimentation, the effective diff is the one domain experts will care about.

##### This also suggests the boundary with `system.yaml`


The recommendation is not to embed prompt bodies directly into the system manifest.

Instead:

```yaml
components:
  answer_prompt:
    kind: prompt
    ref: customer-support/answer@2.4.0
```


And `system.lock.json` resolves that:

```json
{
  "components": {
    "answer_prompt": {
      "kind": "prompt",
      "name": "customer-support/answer",
      "version": "2.4.0",
      "digest": "sha256:91abc..."
    }
  }
}
```


So the hierarchy becomes:

```text
System Manifest
      │
      ├── Model
      ├── Router
      ├── Tool configuration
      │
      └── Prompt reference
             │
             ▼
       Prompt Registry
             │
             ▼
       Prompt Graph
        ├── fragment
        ├── fragment
        └── fragment
```


That keeps the original `C_fingerprint` meaningful: the system fingerprint includes the immutable prompt digest, while the prompt registry independently explains how that digest was constructed.

The next proposed definition is the **prompt object model/schema** itself: `Prompt`, `PromptFragment`, references, inputs, composition rules, version resolution, and what exactly gets hashed. That's where several architectural mistakes can be prevented early.

<a id="user-1"></a>

## Author requirement or open question


Author correction: The prompt is text sent to the LLM, and domain experts work with that text.

<a id="assistant-1"></a>

## LLM proposal


Then the proposal is to change the model substantially.

The **prompt itself is text**. Domain experts should read and edit the exact text that goes to the LLM. The declarative system should manage identity, versions, assembly, and provenance around that text.

So the proposal is to start with these requirements:

1. **Text is the primary artifact.** A prompt version is a text document, probably Markdown or plain text. JSON/YAML should not be the authoring format for the prompt body.
2. **Stable name + immutable version.** A prompt can be addressed as, for example:

   `support/refund-answer@17`

   or by an immutable digest.
3. **Human-friendly history.** An expert can open a prompt and see:
   - current production version
   - previous versions
   - who changed it
   - when
   - change description
   - textual diff between any two versions
4. **Production always points to an exact version.** Something like `production` may be a convenient mutable label, but an actual deployment records `support/refund-answer@17` plus its digest.
5. **Composition remains text-oriented.** If prompts are assembled from pieces, experts must be able to see both:
   - the pieces
   - the exact final assembled text sent to the LLM
6. **Every part of assembled text has provenance.** Given some text in the final prompt, the system can tell the expert where it came from.
7. **Diff operates at two levels.**
   - **source diff**: what somebody edited
   - **assembled diff**: what changed in the final text the LLM receives
8. **Version lineage is visible.** Experts should be able to understand something like:

```text
refund-answer
  v15
   │
  v16
   ├── v17
   └── experiment/alice-1
```


Or, if you don't actually need branching, a simple linear version history is better.

9. **Experiments create prompt revisions without touching production.** An expert opens the production prompt, edits the text, runs it, compares results, and can save that text as an experiment/version.
10. **Reproduction records the exact prompt text.** A production episode should retain the exact effective text or its immutable content-addressed reference. Resolving some mutable name later isn't sufficient.

The resulting proposal is to make the mental model:

```text
Prompt Registry

support/refund-answer
    │
    ├── v15    "..."
    ├── v16    "..."
    └── v17    "..."   ← production
```


Then composition can be added without turning the authoring experience into programming:

```text
refund-answer v17

[company/base-instructions @ 12]

You are helping a customer with a refund request.

When answering:
- explain the current refund status
- ...

[support/refund-policy @ 7]
```


The UI could show either the editable source:

```text
@include company/base-instructions@12

You are helping a customer with a refund request.

...

@include support/refund-policy@7
```


or **Resolved prompt**:

```text
You are an assistant for Example Corp.
...

You are helping a customer with a refund request.
...

Refunds are available when...
```


And selecting a section in the resolved view can show:

```text
Source:
support/refund-policy@7
lines 18–31
```


This gets much closer to Helm's useful parts: references, resolution, versions, and rendered output. The proposal is to avoid importing Helm's general templating complexity.

The important architectural split is therefore:

```text
Prompt text
    ↓
Prompt registry
  name
  version
  digest
  history
  metadata

Prompt composition
  references to other text
  parameters, if needed

Resolver
    ↓
Exact effective prompt text
    ↓
LLM
```


And the system manifest just refers to it:

```yaml
prompts:
  main:
    ref: support/refund-answer@17
```


The lock could record:

```json
{
  "name": "support/refund-answer",
  "version": 17,
  "digest": "sha256:...",
  "resolved_digest": "sha256:..."
}
```


The working interpretation is that the next useful step is to define the **requirements for prompt management from the domain expert's point of view**, before deciding anything about JSON/YAML, APIs, or storage. That should tell us whether we actually need branching, composition, variables, aliases, approval flows, and so on.

<a id="user-2"></a>

## Author requirement or open question


Open question: How should the requirements change if prompts will later be assembled from modular parts?

<a id="assistant-2"></a>

## LLM proposal


If modular assembly is likely later, the proposal is to change the requirements now so the registry manages both a prompt's editable text and its eventual composition structure.

The main change is this: don't define a prompt version as "one text blob." Define it as "a versioned prompt artifact that resolves to one exact text."

That keeps today's simple case:

```text
support/refund-answer@17
    -> one text document
```


and later allows:

```text
support/refund-answer@23
    -> base-instructions@8
    -> refund-policy@4
    -> refund-answer-body@11
```


without changing the basic identity model.

The proposal is to add these requirements now:

- A prompt version may be either a complete text document or a composition of versioned prompt parts.
- Every referenced part must resolve to an immutable version.
- The system must always be able to produce the exact final text sent to the LLM.
- The resolved final text gets its own digest.
- The composition graph must be inspectable.
- Every span of resolved text should have provenance: which component/version produced it.
- Diff must work both on source structure and on final resolved text.
- Production stores the exact resolved identity, not only the top-level prompt name.

Then the prompt identity becomes roughly:

```text
PromptDefinition
    name
    version
    structure

ResolvedPrompt
    exact text
    dependency versions
    resolved digest
```


For a simple prompt:

```text
refund-answer@17
  source_digest:   abc123
  resolved_digest: abc123
```


For a composed one:

```text
refund-answer@23
  definition_digest: def456

  dependencies:
    base-instructions@8
    refund-policy@4
    answer-body@11

  resolved_digest: xyz999
```


The `resolved_digest` is the important runtime identity.

Another proposal is to make composition deliberately limited at first. Something like this is enough:

```text
@include base-instructions@8

@include refund-policy@4

@include answer-body@11
```


Maybe later:

```text
@include refund-policy@4
    with:
        region: EU
```


The proposal is to avoid arbitrary template logic initially. Once you allow loops, dynamic includes, filesystem access, or arbitrary expressions, understanding "what prompt did we actually run?" gets much harder.

The UI should also distinguish three views:

```text
Source
------
@include base-instructions@8
@include refund-policy@4
...

Structure
---------
refund-answer@23
 ├── base-instructions@8
 ├── refund-policy@4
 └── answer-body@11

Resolved
--------
You are ...
Refund rules are ...
When responding ...
```


That gives experts both the modular view and the actual LLM-facing text.

The largest proposed additional requirement is probably this one:

> **Prompt resolution transparency:** For every prompt version, the system shall expose both its authored structure and the exact resolved text sent to the model, including the version and provenance of every included component.

And for diffing:

> **Prompt diff:** The system shall support both structural diff of prompt composition and textual diff of the resolved prompt.

That avoids a future migration from a "text registry" into a completely different "prompt graph registry." You can start with single-file prompts now, while the model already supports modular prompts later.

<a id="user-3"></a>

## Author requirement or open question


Open question: Could TOML describe prompt assembly?

<a id="assistant-3"></a>

## LLM proposal


TOML is a good fit for the assembly layer, as long as the prompt text stays the primary artifact.

The proposal is to use TOML to describe how prompt parts are combined, and keep the actual prompt text in separate text/Markdown files.

For example:

```toml
[prompt]
name = "support/refund-answer"
version = 23

[[parts]]
ref = "company/base-instructions@8"

[[parts]]
ref = "support/refund-policy@4"

[[parts]]
file = "answer.md"
```


That gives you a clean separation:

```text
prompt.toml
answer.md
```


The expert mostly works with `answer.md`. The system uses `prompt.toml` to understand composition.

For parameters:

```toml
[prompt]
name = "support/refund-answer"
version = 23

[[parts]]
ref = "company/base-instructions@8"

[[parts]]
ref = "support/refund-policy@4"

[parts.params]
region = "EU"

[[parts]]
file = "answer.md"
```


Or, if ordering and roles matter:

```toml
[prompt]
name = "support/refund-answer"
version = 23

[[messages]]
role = "system"

  [[messages.parts]]
  ref = "company/base-instructions@8"

  [[messages.parts]]
  ref = "support/refund-policy@4"

[[messages]]
role = "developer"

  [[messages.parts]]
  file = "answer.md"
```


This starts to scale well because TOML handles nested configuration without making the prompt itself feel like configuration.

The proposed main design rule is:

> TOML defines composition; text files define prompt content.

The proposal is to avoid putting large prompt bodies directly into TOML:

```toml
text = """
You are...
...
"""
```


It works technically, but it makes editing, review, diffing, and reuse worse.

TOML also gives you a good future path for metadata:

```toml
[prompt]
name = "support/refund-answer"
version = 23
description = "Handles refund-related support requests"
owner = "customer-support"

[inputs]
region = { type = "string", required = true }
customer_tier = { type = "string", required = false }

[[parts]]
ref = "company/base-instructions@8"

[[parts]]
ref = "support/refund-policy@4"

[[parts]]
file = "answer.md"
```


Then the resolver can produce something like:

```text
prompt.toml
   ↓
resolve refs
   ↓
load text files
   ↓
validate inputs
   ↓
assemble ordered prompt
   ↓
resolved prompt
   ↓
digest
```


For provenance, the resolver should emit a source map alongside the resolved text:

```json
{
  "resolved_digest": "sha256:...",
  "segments": [
    {
      "start": 0,
      "end": 540,
      "source": "company/base-instructions@8"
    },
    {
      "start": 541,
      "end": 1204,
      "source": "support/refund-policy@4"
    },
    {
      "start": 1205,
      "end": 1820,
      "source": "./answer.md"
    }
  ]
}
```


That enables the tree view and the "where did this text come from?" view you mentioned earlier.

The proposal is to keep the TOML language deliberately small. Initially, the proposal is to support:

- ordered parts
- `ref`
- `file`
- role/message grouping
- typed parameters
- static conditions, only if needed
- metadata

The proposal is to avoid loops, arbitrary expressions, dynamic references, and general-purpose scripting.

One proposed change in the requirements is to stop saying that a prompt "is text." The proposal is to say:

> A prompt artifact resolves deterministically to the exact text or message sequence supplied to the LLM.

That covers both today's single text file and tomorrow's TOML composition.

The resulting model would be:

```text
Prompt
  ├── prompt.toml
  ├── local text files
  └── referenced prompt parts
          ↓
       Resolver
          ↓
   Resolved Prompt
      exact messages
      exact text
      dependency tree
      provenance map
      digest
```


The working interpretation is that TOML is cleaner than YAML here because this format should stay relatively constrained. YAML becomes more attractive if you expect the assembly language itself to become very complex, which the proposal seeks to avoid.

<a id="user-4"></a>

## Author requirement or open question


Author correction and question: `${variable}` may simply be text. Could Git or another text diff provide an adequate understanding of changes?

<a id="assistant-4"></a>

## LLM proposal


`${variable}` is just text unless the application gives it interpolation semantics. TOML itself does not define `${...}` expansion.

For example:

```toml
template = "Hello ${customer_name}"
```


TOML parses that as the literal string `Hello ${customer_name}`. The resolver could later decide that `${customer_name}` means "substitute this input."

That suggests a simpler design than we were drifting toward.

Keep prompts as text files:

```text
prompts/
  refund/
    system.md
    answer.md
```


A prompt might contain:

```text
You are assisting a ${customer_tier} customer.

The customer is located in ${region}.
```


Then Git already gives you several things for free: version history, author/time, branching, review, textual diff, tags/commits as immutable references, and easy rollback.

For domain experts, a normal diff is probably the right primary diff:

```diff
- Explain the refund policy clearly.
+ Explain the refund policy in no more than three paragraphs.

+ If eligibility is unclear, ask one clarifying question.
```


The resulting proposal is to avoid inventing a "semantic prompt diff" until you have evidence that Git/text diff is insufficient.

The one place Git diff is insufficient is assembly.

Suppose:

```text
refund.md
  ${base_prompt}

  ${refund_policy}

  Answer the customer's question.
```


and `refund.md` itself doesn't change, but `refund_policy` changes.

A Git diff of `refund.md` says:

```text
no changes
```


while the LLM actually sees different text.

So the proposal is to keep two concepts:

```text
Source diff
-----------
Git diff of what the expert actually edited.

Resolved diff
-------------
Diff of the final text after includes/variables/components
have been resolved.
```


You don't need a sophisticated semantic diff. The resolved diff can still be an ordinary line/word diff.

For example:

```text
Source:

${base}
${policy}
Answer concisely.
```


Version A resolves to:

```text
You are a customer support assistant.

Refunds are allowed within 30 days.

Answer concisely.
```


Version B resolves to:

```text
You are a customer support assistant.

Refunds are allowed within 14 days.

Answer concisely.
```


Then the effective diff is simply:

```diff
- Refunds are allowed within 30 days.
+ Refunds are allowed within 14 days.
```


That is likely exactly what a domain expert wants to see.

So the revised proposal is to simplify the requirements to something like:

> Prompt source shall be represented as human-editable text and versioned using normal source-control semantics. Prompt source may contain explicitly defined references or interpolation expressions. The system shall be able to deterministically resolve a prompt into the exact text supplied to the model and shall support ordinary textual diff of both authored source and resolved text.

And one related requirement:

> For every region of resolved text originating from another prompt component, the system shall preserve the originating component and version.

The architecture can therefore stay quite small:

```text
text files
    +
${variables / references}
    ↓
resolver
    ↓
final text
```


with Git underneath:

```text
Git
 ├── history
 ├── branches
 ├── tags
 ├── diff
 └── review
```


The working interpretation is that this is a better starting point than building a dedicated versioning model. The proposed registry may initially be little more than an index over Git: logical prompt name -> repository/path -> revision, plus production pointers and resolved fingerprints.

<a id="user-5"></a>

## Author requirement or open question


Research question: Which approaches exist for assembling prompts?

<a id="assistant-reasoning-1"></a>

## LLM rationale for the proposal


The LLM rationale compares six approaches: interpolation, text partials, full template languages, structured messages, manifests, and programmatic builders. It also notes staged formatting, since filling some values early and others at runtime can be useful.

<a id="assistant-5"></a>

## LLM proposal


The saved LLM review reports several distinct approaches across the systems it examined. The `${variable}` idea is only one of them.

For the stated requirements -- domain experts editing text, Git-friendly history, and reproducible production prompts -- the proposed comparison is:

| Approach | Example | Good for | Main problem |
|---|---|---|---|
| Variable interpolation | `Hello {{name}}` | Runtime values | Doesn't provide modular reuse |
| Text includes / partials | `{{> refund_policy }}` | Reusable prompt sections | Need dependency/version rules |
| Full template language | Jinja `{% if ... %}` | Conditional/looped prompts | Prompt becomes programming |
| Message composition | system/user/assistant arrays | Chat APIs, few-shot examples | Less natural as plain text |
| Manifest-driven composition | YAML/TOML lists of parts | Complex structures | Authors edit config as well as text |
| Programmatic construction | Python/TS/DSPy | Dynamic systems | Poor fit for domain experts |
| Multi-stage templates | fill some vars now, some later | Layered systems | Resolution semantics get more complex |

##### 1. Plain variable interpolation


This is probably what the `${variable}` person meant.

```text
You are helping a ${customer_type} customer.

Question:
${question}
```


Or the more common prompt syntax:

```text
You are helping a {{customer_type}} customer.
```


Langfuse and Humanloop use `{{variable}}`. LangChain supports f-string-style variables, Mustache, or Jinja. ([Langfuse](https://langfuse.com/docs/prompt-management/features/variables))

This is extremely Git-friendly because it remains ordinary text.

But this is substitution, not really composition:

```text
template + runtime values → prompt
```


You can't naturally say, "put our standard safety instructions here" unless the entire safety prompt is passed as a variable.

##### 2. Includes / partials


This approach appears most relevant to the stated requirements.

Handlebars has explicit partials:

```text
{{> base_instructions }}

You are processing a refund.

{{> refund_policy }}
```


Partials can also receive parameters. ([Handlebars](https://handlebarsjs.com/guide/partials.html))

Liquid has a similar `render` mechanism:

```text
{% render "base-instructions" %}

You are processing a refund.

{% render "refund-policy", region: region %}
```


Liquid deliberately gives rendered templates their own variable scope unless values are explicitly passed, which makes dependencies easier to understand. ([Shopify](https://shopify.github.io/liquid/tags/template/))

And notably, Langfuse now has prompt composition directly:

```text
@@@langfusePrompt:name=refund-policy|version=7@@@
```


It supports referencing an exact version or a mutable label such as `production`. ([Langfuse](https://langfuse.com/docs/prompt-management/features/composability))

Conceptually:

```text
refund-answer
├── base-instructions@12
├── refund-policy@7
└── local text
```


This fits the proposed registry very well.

##### 3. Full template languages: Jinja/Nunjucks/Liquid


You can go considerably further:

```text
You are a support assistant.

{% if premium %}
Give priority support.
{% endif %}

Relevant documents:

{% for document in documents %}
{{ document }}
{% endfor %}
```


Promptfoo uses Nunjucks and supports variables, conditionals, filters, and other template features. Haystack and Microsoft's Prompt Flow use Jinja for prompt construction. ([Promptfoo](https://www.promptfoo.dev/docs/configuration/prompts/))

This is powerful, but there is a tradeoff.

An expert reading:

```text
{% if region == "EU" and premium %}
  ...
{% elif ...
```


is increasingly reading a program rather than a prompt.

It also creates security concerns if arbitrary templates can be contributed. LangChain explicitly warns against accepting untrusted Jinja templates even when sandboxing is enabled. ([LangChain Reference Docs](https://reference.langchain.com/python/langchain-core/prompts/prompt/PromptTemplate))

For the proposed system, the recommendation is not to start here.

##### 4. Structured message composition


Another approach treats the prompt as a sequence of messages:

```json
[
  {
    "role": "system",
    "content": "You are..."
  },
  {
    "role": "user",
    "content": "{{question}}"
  }
]
```


Langfuse distinguishes text prompts from chat prompts and also supports placeholders that insert whole arrays of messages, such as conversation history. ([Langfuse](https://langfuse.com/docs/prompt-management/data-model))

This is valuable when the actual LLM input is:

```text
system
developer
user
assistant
user
```


because concatenating those into a single string would lose meaningful API structure.

The resulting proposal is to consider the resolved artifact to be:

```text
ResolvedPrompt =
    text
    OR
    ordered messages
```


even if domain experts mostly edit text.

##### 5. Metadata + text


Another pattern keeps configuration and prompt text together in one file.

Microsoft's experimental `.prompty` format uses YAML frontmatter followed by a Jinja prompt body. ([Microsoft GitHub](https://microsoft.github.io/promptflow/how-to-guides/develop-a-prompty/index.html))

Conceptually:

```text
---
name: refund-answer
model: ...
inputs:
  question: string
---

You are a support assistant.

Question: {{question}}
```


Humanloop has a similar Git-friendly `.prompt` serialization: configuration in YAML frontmatter, with prompt/message content below it. ([Humanloop](https://humanloop.com/docs/reference/serialized-files))

This could be useful later for the registry metadata, but the recommendation is not to require it for composition itself.

##### 6. Programmatic construction


At the opposite end, you can stop treating prompts as documents.

DSPy treats LM operations as modules that can be composed into programs. The prompting details can then be generated or optimized by the framework. ([GitHub](https://github.com/stanfordnlp/dspy/blob/main/docs/docs/learn/programming/modules.md))

Similarly you can just write:

```python
parts = [
    get_prompt("base"),
    get_prompt("refund-policy"),
    make_examples(data),
]

prompt = "\n\n".join(parts)
```


This is appropriate for engineering-driven systems.

It conflicts with the core requirement, though:

> Domain experts should be able to inspect and manipulate the actual prompt text.

So the recommendation is not to make code the primary assembly mechanism.

##### 7. Multi-stage interpolation


There's another useful idea between variables and modules.

LangChain supports partially filling a template:

```text
{company} {question}
```


could first become:

```text
ACME {question}
```


and then later:

```text
ACME Where is my refund?
```


LlamaIndex exposes similar partial formatting. ([GitHub](https://github.com/langchain-ai/langchain/blob/master/libs/core/langchain_core/prompts/prompt.py))

This matters because you may eventually have different classes of values:

```text
build-time:
    policy
    organization instructions

session-time:
    user profile
    locale

request-time:
    question
    retrieved context
```


The proposal is to model those stages explicitly if you need them, rather than recursively substituting arbitrary `${...}` until nothing remains.

For the proposed system, the proposal is to start with a deliberately small language.

For example:

```text
@include company/base@12

You are helping with refund requests.

@include support/refund-policy@7

Customer question:

${question}
```


There are only two concepts:

```text
@include ...     reusable prompt dependency
${...}           runtime input
```


Then:

```text
                 source
                   │
          ┌────────┴────────┐
          │                 │
       includes          variables
          │                 │
      resolve at         substitute at
      deployment          runtime
          │                 │
          └────────┬────────┘
                   ↓
             final prompt
```


The proposal favors **different syntax for prompt references and runtime variables**. It immediately tells a reader what they're looking at.

For production:

```text
@include support/refund-policy@7
```


must resolve to something immutable.

During editing you might permit:

```text
@include support/refund-policy@candidate
```


but the lock/resolved form turns it into:

```text
support/refund-policy@7
sha256:...
```


Git can then do almost all of the normal source diffing.

And the proposed system only needs one additional diff:

```text
git/source diff
        +
resolved-text diff
```


That looks like the smallest design that still gives you modularity, versioning, provenance, and production reproducibility. The proposal is to avoid Jinja-style control flow until you find a concrete prompt that can't be expressed cleanly with **text + includes + variables**.

<a id="user-6"></a>

## Author requirement or open question


Author-selected minimum for the next design step:

prompt names: 'namespace/prompt-name@version'

Requirement: Experts edit the prompt specification online and can view its rendered text. The specification could contain '@link-to-prompt'; the system would check whether the referenced prompt exists.

Initial constraint: No variables; render plain text.

Required feature: Traceable history.

Open question: How should the prompt specification be represented?

Open question: What should contain all prompts? Could the system parse a Git repository containing them?

<a id="assistant-reasoning-2"></a>

## LLM rationale for the proposal


The LLM rationale recommends a Git-native layout with immutable versioned prompt files, explicit metadata, and line-based links such as `@link-to-prompt support/refund-policy@7`. A parser can resolve links, render expanded text, and retain commit history for every revision.

<a id="assistant-6"></a>

## LLM proposal


The proposal is to make the prompt spec itself almost entirely text and let the repository structure carry identity.

For the minimum version, the proposal is to avoid JSON/YAML around every prompt.

A prompt spec could simply be:

```text id="e53cw8"
You are a customer support assistant.

@prompt company/base-policy@3

When answering refund questions, follow these rules:

@prompt support/refund-policy@7

Be concise.
```


Define one special construct:

```text id="3hyx3v"
@prompt namespace/prompt-name@version
```


The proposal is to require it to occupy a full line initially. That makes parsing, rendering, diffing, and error reporting simple.

The renderer does:

```text id="g6eh24"
source prompt
    ↓
find @prompt references
    ↓
validate referenced prompt exists
    ↓
detect cycles
    ↓
recursively resolve
    ↓
render exact final text
```


So the editor can have two panes:

```text id="t6cnpk"
SPEC                          RENDERED

You are...                    You are...
                              <base-policy text>
@prompt company/base...
                              When answering...
When answering...             <refund-policy text>

@prompt support/refund...
```


<a id="where-i-would-keep-the-prompts"></a>

##### Proposed prompt storage


Yes: a Git repository is a very reasonable source of truth.

The proposal is to structure it like this:

```text id="2qtv42"
prompts/
  company/
    base-policy/
      1.prompt
      2.prompt
      3.prompt

  support/
    refund-policy/
      6.prompt
      7.prompt

    refund-answer/
      15.prompt
      16.prompt
      17.prompt
```


Then:

```text id="haouo7"
company/base-policy@3
```


maps deterministically to:

```text id="ie1fvc"
prompts/company/base-policy/3.prompt
```


This gives you a very simple rule:

```text id="dh65co"
namespace/prompt-name@version
        ↓
repository path
```


The prompt file itself therefore doesn't even need to repeat:

```text id="l9cf3x"
name = ...
version = ...
```


The path is the identity.

That has a nice side effect: prompt files remain clean documents that experts can read directly.

<a id="git-then-gives-you-most-of-the-history-system"></a>

##### Git as the proposed history system


You immediately get:

- who changed a prompt
- when
- commit message
- review/approval via PRs if desired
- exact textual diff
- branches
- rollback
- blame
- immutable commit identifiers

The online editor can hide Git completely from domain experts.

They see:

```text id="qjuhrx"
support/refund-answer

Versions
  17   Production
  16
  15

History
  Sep 18  Valery   Clarified escalation rule
  Sep 12  Anna     Added refund policy
  ...
```


Internally that is backed by Git commits.

<a id="one-distinction-i-would-make-now"></a>

##### An initial proposed distinction


There are two kinds of versioning:

```text id="1ab78s"
Prompt version:
    support/refund-answer@17

Repository revision:
    git commit 84ba61...
```


They shouldn't be treated as the same thing.

`@17` is part of the domain model. Once published, it should be immutable.

The Git commit tells you which state of the entire registry you were using.

That means a production deployment could record both:

```json id="atbgjz"
{
  "prompt": "support/refund-answer@17",
  "registry_revision": "84ba61..."
}
```


Potentially also a digest later:

```json id="1ujp6c"
{
  "prompt": "support/refund-answer@17",
  "source_digest": "sha256:...",
  "rendered_digest": "sha256:...",
  "registry_revision": "84ba61..."
}
```


This becomes useful when reconstructing production.

##### Publishing versus editing


The recommendation is not to let experts edit `17.prompt` after version 17 has been published.

Instead the online workflow would be conceptually:

```text id="wheh27"
support/refund-answer@17
          │
       Edit
          ↓
       Draft
          │
       Publish
          ↓
support/refund-answer@18
```


The draft doesn't necessarily need a permanent prompt version yet.

Git can contain drafts on a branch, or the application database can hold the temporary edit until publication. The recommendation is not to force that decision into the prompt format.

Published registry state stays simple:

```text id="vra067"
17.prompt    immutable
18.prompt    immutable
19.prompt    immutable
```

##### Rendering should also produce a dependency tree


Given:

```text id="yfjw8s"
support/refund-answer@17
```


you should be able to show:

```text id="ocf61t"
support/refund-answer@17
├── company/base-policy@3
└── support/refund-policy@7
    └── company/legal-language@2
```


And validation should reject:

```text id="qi3cbn"
missing reference
invalid prompt name
invalid version
circular dependency
```


For example:

```text id="fb7yb6"
a@1 → b@2 → c@4 → a@1
```


fails publication.

<a id="id-keep-the-grammar-tiny"></a>

##### A deliberately small proposed grammar


Initially, literally:

```text id="8qho71"
prompt-spec := text | prompt-reference

prompt-reference :=
    "@prompt " namespace "/" prompt-name "@" version
```


No variables.

No conditions.

No loops.

No parameters.

No macros.

Just text and references.

That is enough to establish whether modular prompts are useful before creating a template language.

<a id="one-thing-i-would-change-in-the-directory-structure-later"></a>

##### A possible later directory change


If the registry grows large, you may eventually want metadata:

```text id="m558jp"
prompts/
  support/
    refund-answer/
      prompt.toml
      versions/
        17.prompt
        18.prompt
```


where `prompt.toml` contains properties of the logical prompt:

```toml id="1r5v57"
description = "Main prompt for refund requests"
owner = "support"
```


But the recommendation is not to start there unless you already need metadata.

So the proposed minimum system is:

```text id="uv7y34"
Git repository
     │
     ├── namespace/name/version.prompt
     │
     └── plain text + @prompt references
                    │
                    ↓
               Registry parser
                    │
          ┌─────────┴──────────┐
          ↓                    ↓
      validation          dependency graph
          │                    │
          └─────────┬──────────┘
                    ↓
                 renderer
                    ↓
           exact rendered text
```


That gives you a small, understandable foundation while preserving the things you care about: human editing, normal diffs, immutable versions, traceable history, modular composition, and deterministic rendering.
