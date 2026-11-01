---
draft: false
toc: true
title: "Text-Based Prompt Registry: Initial Specification"
description: "Proposes a minimal text-based prompt registry with versioned references, dependency resolution, immutable publication, and locks, deferring richer syntax until user needs justify it."
linkTitle: "Prompt Registry"
---

Proposed design: keep the prompt specification almost entirely as text, with identity carried by the repository structure.

For the minimum version, avoid wrapping every prompt in JSON or YAML.

A prompt spec could simply be:

```text
You are a customer support assistant.

@prompt company/base-policy@3

When answering refund questions, follow these rules:

@prompt support/refund-policy@7

Be concise.
```


Define one special construct:

```text
@prompt namespace/prompt-name@version
```


Initially, require the reference to occupy a full line. That makes parsing, rendering, diffing, and error reporting simple.

The renderer does:

```text
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

```text
SPEC                          RENDERED

You are...                    You are...
                              <base-policy text>
@prompt company/base...       
                              When answering...
When answering...             <refund-policy text>

@prompt support/refund...
```

### Where to keep the prompts


A Git repository can serve as the source of truth.

Proposed structure:

```text
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

```text
company/base-policy@3
```


maps deterministically to:

```text
prompts/company/base-policy/3.prompt
```


This gives a simple mapping rule:

```text
namespace/prompt-name@version
        ↓
repository path
```


The prompt file itself therefore doesn't even need to repeat:

```text
name = ...
version = ...
```


The path is the identity.

That has a nice side effect: prompt files remain clean documents that experts can read directly.

### Git provides most of the history system


Git provides:

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

```text
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

### Prompt versions and repository revisions


There are two kinds of versioning:

```text
Prompt version:
    support/refund-answer@17

Repository revision:
    git commit 84ba61...
```


They shouldn't be treated as the same thing.

`@17` is part of the domain model. Once published, it should be immutable.

The Git commit identifies the state of the entire registry used by the deployment.

That means a production deployment could record both:

```json
{
  "prompt": "support/refund-answer@17",
  "registry_revision": "84ba61..."
}
```


Potentially also a digest later:

```json
{
  "prompt": "support/refund-answer@17",
  "source_digest": "sha256:...",
  "rendered_digest": "sha256:...",
  "registry_revision": "84ba61..."
}
```


This becomes useful when reconstructing production.

### Publishing versus editing


Experts should not edit `17.prompt` after version 17 has been published.

Instead the online workflow would be conceptually:

```text
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

Git can contain drafts on a branch, or the application database can hold temporary edits until publication. The prompt format does not need to determine where drafts are stored.

Published registry state stays simple:

```text
17.prompt    immutable
18.prompt    immutable
19.prompt    immutable
```

### Rendering should also produce a dependency tree


Given:

```text
support/refund-answer@17
```


the registry should be able to show:

```text
support/refund-answer@17
├── company/base-policy@3
└── support/refund-policy@7
    └── company/legal-language@2
```


And validation should reject:

```text
missing reference
invalid prompt name
invalid version
circular dependency
```


For example:

```text
a@1 → b@2 → c@4 → a@1
```


fails publication.

### Keep the initial grammar small


Initially, literally:

```text
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

### Possible later directory structure


If the registry grows large, metadata may be useful:

```text
prompts/
  support/
    refund-answer/
      prompt.toml
      versions/
        17.prompt
        18.prompt
```


where `prompt.toml` contains properties of the logical prompt:

```toml
description = "Main prompt for refund requests"
owner = "support"
```


Start with this structure only if metadata is already needed.

The proposed minimum system is:

```text
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


This provides a small, understandable foundation that supports: human editing, normal diffs, immutable versions, traceable history, modular composition, and deterministic rendering.

## Prompt-management requirements: draft 1


The **prompt itself is text**. Domain experts should read and edit the exact text that goes to the LLM. The declarative system should manage identity, versions, assembly, and provenance around that text.

Proposed starting requirements:

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


If branching is not needed, a simple linear version history is better.

9. **Experiments create prompt revisions without touching production.** An expert opens the production prompt, edits the text, runs it, compares results, and can save that text as an experiment/version.
10. **Reproduction records the exact prompt text.** A production episode should retain the exact effective text or its immutable content-addressed reference. Resolving some mutable name later isn't sufficient.

The resulting model is:

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


This gets much closer to Helm's useful parts: references, resolution, versions, and rendered output. Avoid importing Helm's general templating complexity.

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


Open design work: define the **requirements for prompt management from the domain expert's point of view** before choosing JSON/YAML, APIs, or storage. Those requirements should establish whether branching, composition, variables, aliases, approval flows, and related features are needed.
