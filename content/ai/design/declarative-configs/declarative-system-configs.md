---
draft: false
toc: true
title: "Versioning and Composing Declarative Configurations"
description: "Develops configuration identity and composition through logical versions, Git revisions, immutable resolved artifacts, dependency locks, deployment pointers, and separate evaluation plans."
linkTitle: "Versions and Composition"
---
## Tags and runtime identity


A Git tag is useful as a publishing mechanism. It should not be the primary runtime identity.

Separate three identities:

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


An evaluation API could look like:

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


Treat the tag as the publishing mechanism, separate from the conceptual identity. A later registry can publish versions without Git tags while preserving how evaluation and the workbench refer to systems.

The proposed minimum model is:

```text
namespace/system-name@version
```


parallel to prompt identities:

```text
systems/support-agent@42
prompts/support/refund-policy@8
```


and each published system version resolves to one immutable built artifact.

## Versioning several components in one repository


Design question: how can several components have separate configuration versions within one repository?

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


Git records where that definition came from:

```text
support-agent@42
source commit: 8f31c2a
```


A separate Git tag is not needed for every prompt version.

That would become cumbersome in one repo:

```text
prompt-support-refund-v8
prompt-company-base-v4
system-support-agent-v42
...
```


Use logical versions in the registry structure and Git commits for repository history.

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


The resulting versions are:

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


version 8 stays unchanged; an edit creates version 9.

Git history still records how version 8 was created, reviewed, and published.

This produces three identities:

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


Use Git for atomic history and review, and use the registry model for component versions. Git itself does not need to be the component-versioning mechanism.

One repo works well precisely because a single commit can atomically introduce:

```text
refund-policy@9
support-agent@43
new eval config
```


while each still keeps its own logical version.

## Meta-configurations


Design question: how should a meta-configuration combine a test suite and a system under test (SUT), including its prompt-set version? Which other properties belong in it?

Proposed design: introduce a small set of top-level versioned artifacts and a meta-configuration that connects them for an evaluation or experiment.

The important rule: the meta-config should reference the SUT, not duplicate its internal configuration.

For example:

```text
SUT
 ├── prompt set
 ├── model config
 ├── routing
 ├── tools
 ├── retrieval
 └── policies

Test suite
 ├── test cases / dataset
 ├── evaluators
 └── pass criteria

Evaluation config
 ├── SUT
 ├── test suite
 ├── runtime profile
 └── execution settings
```


A SUT definition might be:

```yaml
name: support-agent
version: 42

prompts:
  ref: support/prompt-set@9

model:
  ref: models/support-default@5

routing:
  ref: support/router@3

tools:
  ref: support/tools@7

retrieval:
  ref: support/retrieval@11

policies:
  ref: support/policies@4

interface:
  input_schema: support/request@2
  output_schema: support/response@3
```


A `prompt-set` can be a separate artifact:

```yaml
name: support/prompt-set
version: 9

prompts:
  system: company/base@12
  answer: support/answer@21
  refund_policy: support/refund-policy@8
```


Then `support-agent@42` means one exact combination of components.

Other SUT properties that may eventually be needed are:

- prompt set
- model configuration
- routing/orchestration
- tool set
- retrieval configuration
- policies/guardrails
- input/output contract
- fixed external dependency contracts
- runtime implementation/version, if application code affects behavior

The last one is important. If Python/application code determines how prompts are assembled or tools are called, then:

```yaml
runtime:
  artifact: support-agent-runtime@1.18.3
```


is part of SUT identity too.

Then the test suite:

```yaml
name: support/refund-regression
version: 12

cases:
  ref: datasets/refund-cases@17

evaluators:
  - evals/correctness@4
  - evals/policy-compliance@6
  - evals/tone@2

criteria:
  policy_compliance:
    min: 0.99
```


And finally the meta-config:

```yaml
name: refund-evaluation
version: 31

sut:
  ref: systems/support-agent@42

suite:
  ref: support/refund-regression@12

runtime:
  ref: environments/eval@5

execution:
  repetitions: 1
  concurrency: 10
  timeout: 30s

capture:
  traces: true
  rendered_prompts: true
  tool_calls: true
  retrieval: true
```


Possible names for this artifact are `EvaluationPlan` and `RunConfig`.

It can also support comparison:

```yaml
candidate:
  ref: systems/support-agent@43

baseline:
  ref: systems/support-agent@42

suite:
  ref: support/refund-regression@12
```


Then the repo could become:

```text
ai-config/
  prompts/
  prompt-sets/
  models/
  tools/
  retrieval/
  policies/

  systems/
    support-agent/

  datasets/
  evaluators/
  test-suites/

  runtime-profiles/
  evaluation-plans/
```


The dependency graph then becomes explicit:

```text
refund-evaluation@31
 ├── support-agent@42
 │    ├── prompt-set@9
 │    │    ├── base@12
 │    │    ├── answer@21
 │    │    └── refund-policy@8
 │    ├── model@5
 │    ├── tools@7
 │    └── retrieval@11
 │
 ├── refund-regression@12
 │    ├── dataset@17
 │    └── evaluators...
 │
 └── eval-runtime@5
```


That graph is probably the core object the configuration system should resolve and fingerprint.

Keep `execution` properties such as concurrency and timeout outside the SUT identity unless they can change model behavior. The SUT should answer "what system are we testing?" The evaluation plan should answer "how are we testing it?"
