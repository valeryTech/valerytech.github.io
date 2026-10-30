---
draft: false
toc: true
description: "Proposes Git-managed desired configuration with independent component versions and immutable resolved artifacts, recording both friendly selectors and exact runtime identity across production and evaluation."
title: "10 Configuration Publishing And Version Identity"
linkTitle: "10 Configuration Publishing And Version Identity"
---
# Configuration publishing and version identity


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The sequence of proposals and author corrections discusses Git storage, one repository versus separate repositories, selection of a system version, and independently versioned components within one repository. The complete examples and recommendations are retained with editorial wording.

Read the [sibling comments]({{< ref "ai/design-research/05-runtime-and-execution/10-configuration-publishing-and-version-identity-comments" >}}) for the distinction between logical names, published versions, source commits, resolved artifacts, and mutable aliases. The repository recommendations and publication workflow remain proposals.

The preceding [configuration and instantiation discussion]({{< ref "ai/design-research/05-runtime-and-execution/09-declarative-system-configuration-and-instantiation" >}}) defines the proposed resolved revision. The dialogue continues in [evaluation plans and system configuration]({{< ref "ai/design-research/05-runtime-and-execution/11-evaluation-plans-and-system-configuration" >}}). The earlier [prompt discussion]({{< ref "ai/design-research/05-runtime-and-execution/08-prompt-text-composition-and-registry" >}}) retains its own publication examples.

The original source overview (archived source 015) links the complete split. The audit records the original range and checksum.

<!-- Configuration publishing and version identity source begins below. -->

<a id="user"></a>

## Author requirement or open question


Open question: Should configurations also be stored in Git, using a GitOps-like approach?

<a id="assistant"></a>

## LLM proposal


The proposal is to keep the declarative system configs in Git and use a GitOps-like model.

The proposed split is:

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


Then a commit gives you a reproducible source snapshot:

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


The proposal is to treat the Git commit and the resolved revision as different identities.

For example:

```text
source_revision:
  git: abc123

system_revision:
  fingerprint: sha256:def456
```


That distinction is useful because two source configs could theoretically resolve to the same effective system, and a source commit can contain unrelated changes.

For production, the proposal is to record both:

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

The recommendation is not to put everything in Git, though. Specifically:

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


One proposed early design decision is that production should deploy from a resolved artifact, even if Git is the source of truth.

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

That gives you one build result that all consumers share.

So the proposal is to describe the requirement as:

> System source configuration shall be stored in version control and treated as declarative desired state. Each published source revision shall be validated and resolved into an immutable runnable system revision. Production, evaluation, and experimentation environments shall instantiate that same resolved revision with environment-specific bindings.

That is essentially GitOps, but applied to an AI system definition rather than only infrastructure.

<a id="user-1"></a>

## Author requirement or open question


Author context and question: A previous single-repository setup caused problems. Would separate repositories create more coordination work?

<a id="assistant-1"></a>

## LLM proposal


Separate repos usually create more coordination work when prompts, system configs, and shared components must change together.

For the stated requirements, the proposal is to start with one dedicated configuration repo for the AI system definitions and prompts, even if application code lives elsewhere.

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


Then you need another mechanism to answer: "which combination of A, B, and C is the system revision?" That is solvable, but you are creating coordination machinery early.

The proposal is to separate repositories only when there is a strong ownership or access-control reason. For example, if several independent teams own components with separate release processes, then each component can have its own repo and publish immutable artifacts into a registry. The system config would reference those published versions:

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


For the first version, the proposal is to use:

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


Another proposal is to avoid Git submodules for this. They tend to make the coordination problem visible to every contributor without actually removing it.

So: one dedicated `ai-config` monorepo is probably the simpler starting point. Split later when organizational boundaries make the split useful, while keeping the registry/version model stable.

<a id="user-2"></a>

## Author requirement or open question


Open question: How should a SUT version be selected for startup? Would a tag serve this purpose?

<a id="assistant-2"></a>

## LLM proposal


A tag is useful, but the recommendation is not to make the Git tag the primary runtime identity.

The proposal is to separate three things:

```text
Human version        support-agent@42
Git source revision  8f31c2a
Resolved artifact    sha256:ab73...
```


Recommended flow:

```text
support-agent@42
    ↓
Git tag / release metadata
    ↓
commit 8f31c2a
    ↓
build + resolve
    ↓
immutable SUT artifact sha256:ab73...
```


Then when something actually starts, use the resolved artifact identity:

```text
start system sha256:ab73...
```


The UI can still expose friendly selectors:

```text
Production
Staging
support-agent@42
support-agent@41
Git commit 8f31c2a
```


with mutable aliases resolving to immutable revisions:

```text
production → support-agent@42 → sha256:ab73...
staging    → support-agent@43 → sha256:c914...
```


For evaluation, the proposal is to expect APIs roughly like:

```text
run-eval --system support-agent@42
```


or:

```text
run-eval --system production
```


The eval record should then store what `production` resolved to at that moment:

```json
{
  "requested_system": "production",
  "system_version": "support-agent@42",
  "source_commit": "8f31c2a",
  "resolved_revision": "sha256:ab73..."
}
```


That makes historical runs reproducible even after `production` moves.

Git tags can implement `support-agent@42` initially:

```text
system/support-agent/v42
```


But the proposal is to treat the tag as the publishing mechanism, not the conceptual identity. Later, you may stop using Git tags and publish versions into a registry without changing how eval or the workbench refer to systems.

So the proposed minimum model is:

```text
namespace/system-name@version
```


exactly parallel to the prompts:

```text
systems/support-agent@42
prompts/support/refund-policy@8
```


and each published system version resolves to one immutable built artifact.

<a id="user-3"></a>

## Author requirement or open question


Open question: How should configuration versions for several components be managed within one repository?

<a id="assistant-3"></a>

## LLM proposal


The cleanest model is: the repo commit versions the whole repository state, while each component has its own logical version inside that state.

For example:

```text
ai-config/
  prompts/
    support/refund-policy/
      7.prompt
      8.prompt

    company/base/
      3.prompt
      4.prompt

  systems/
    support-agent/
      41.yaml
      42.yaml
```


Then:

```text
support/refund-policy@8
company/base@4
support-agent@42
```


are component versions.

A Git commit such as:

```text
8f31c2a
```


means:

> this exact snapshot of all component versions and files in the repo.

Those are different levels of identity.

Suppose `support-agent@42` contains:

```yaml
name: support-agent
version: 42

prompts:
  base: company/base@4
  refund: support/refund-policy@8
```


Then the dependency graph is explicit:

```text
support-agent@42
├── company/base@4
└── support/refund-policy@8
```


And Git tells you where that definition came from:

```text
support-agent@42
source commit: 8f31c2a
```


You do not need a separate Git tag for every prompt version.

That would become cumbersome in one repo:

```text
prompt-support-refund-v8
prompt-company-base-v4
system-support-agent-v42
...
```


The proposal is to use logical versions in the registry structure, and Git commits for repository history.

A publish operation could work like this:

```text
edit draft
   ↓
publish support/refund-policy
   ↓
create 9.prompt
   ↓
Git commit
   ↓
support/refund-policy@9 becomes immutable
```


Later, update the system:

```diff
 prompts:
   base: company/base@4
-  refund: support/refund-policy@8
+  refund: support/refund-policy@9
```


Publish that as:

```text
support-agent@43
```


Now you have:

```text
support-agent@42
    refund-policy@8

support-agent@43
    refund-policy@9
```


This is very similar to package management. One repository may contain many packages, and each package can have its own version.

The important rule is:

> Published component versions are immutable.

So if this exists:

```text
support/refund-policy@8
```


you never edit version 8. You create version 9.

Git history still records how version 8 was created, reviewed, and published.

You then have three identities:

```text
Logical component
support/refund-policy

Published version
support/refund-policy@8

Repository snapshot
git commit 8f31c2a
```


And for a runnable SUT:

```text
support-agent@42
    ↓
system definition
    ↓
exact component versions
    ↓
resolved artifact sha256:...
```


The resulting proposal is to avoid trying to make Git itself the component-versioning mechanism. Use Git for atomic history and review; use the registry model for component versions.

One repo works well precisely because a single commit can atomically introduce:

```text
refund-policy@9
support-agent@43
new eval config
```


while each still keeps its own logical version.
