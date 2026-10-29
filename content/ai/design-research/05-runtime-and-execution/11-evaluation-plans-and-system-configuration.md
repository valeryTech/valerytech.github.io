---
draft: false
toc: true
description: "Proposes an EvaluationPlan referencing a versioned system, prompt set, test suite, evaluators, runtime profile, execution settings, and captured artifacts for repeatable candidate-baseline comparisons."
title: "11 Evaluation Plans And System Configuration"
linkTitle: "11 Evaluation Plans And System Configuration"
---
# Evaluation plans and system configuration


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The final proposal describes a configuration that references a system under test, a test suite, a runtime profile, execution settings, and data to capture. The complete prompt-set, system, suite, comparison, repository, and dependency examples remain unchanged.

Read the [sibling comments]({{< ref "ai/design-research/05-runtime-and-execution/11-evaluation-plans-and-system-configuration-comments" >}}) for the distinction between system identity, evaluation conditions, run records, and evidence supporting a comparison. The example does not report an executed evaluation or establish a reliability threshold.

The preceding [publishing and version discussion]({{< ref "ai/design-research/05-runtime-and-execution/10-configuration-publishing-and-version-identity" >}}) explains how the referenced artifacts could be selected. Related [runtime evaluation]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) and [investigation evaluation]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) address separate research questions.

The original source overview (archived source 015) links the complete split. The audit records the original range and checksum.

<!-- Evaluation plans and system configuration source begins below. -->

<a id="user"></a>

## Author requirement or open question


Author requirement and question: Add a meta-configuration that includes a test suite and a SUT with the prompt-set version and other properties. Which additional properties belong here?

<a id="assistant-reasoning"></a>

## LLM rationale for the proposal


The proposal is to separate immutable SUT metadata from per-run settings. Besides suite and prompt versions, the proposal is to include model/runtime config, tool and retrieval snapshots, evaluator versions, dataset revision, seeds, limits, environment, overrides, artifacts, and pass criteria.

<a id="assistant"></a>

## LLM proposal


The proposal is to introduce a small set of top-level versioned artifacts, and then a meta-config that ties them together for an evaluation or experiment.

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


The proposal favors a `prompt-set` as its own artifact:

```yaml
name: support/prompt-set
version: 9

prompts:
  system: company/base@12
  answer: support/answer@21
  refund_policy: support/refund-policy@8
```


Then `support-agent@42` means one exact combination of components.

The other SUT properties anticipated eventually are:

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


One tentative proposal is to call this artifact an `EvaluationPlan` or `RunConfig`.

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


That graph is probably the core thing the configuration system should resolve and fingerprint.

The proposal is to keep `execution` properties such as concurrency and timeout outside the SUT identity unless they can change model behavior. The SUT should answer "what system are we testing?" The evaluation plan should answer "how are we testing it?"
