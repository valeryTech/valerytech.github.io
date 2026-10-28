---
draft: false
toc: true
description: "A saved governance discussion mapping nearby patent claims and proposing auditable approvals, privacy-aware traces, and policy-version controls, while questioning who validates specifications that verifiers enforce."
title: "06 Governance Patents And Specification Trust"
linkTitle: "06 Governance Patents And Specification Trust"
---
## Patents, legal and ethical considerations


The patent landscape confirms that companies are already claiming parts of LLM-driven workflow generation, routing, orchestration and compliance. This should affect implementation and commercial diligence, although a patent search is not a freedom-to-operate opinion.

| Patent family / publication | Relevant subject | Relationship to this programme |
|---|---|---|
| [Citibank -- US20250348707A1 / US12536406B2](https://patents.google.com/patent/US20250348707A1/en) | Dynamic AI-agent orchestration using an LLM gateway/router; routing based on context, constraints and runtime factors | Adjacent to dynamic physical-plan/agent routing and orchestration; reported priority 11 Apr 2024 and grant in Jan 2026. [43](#ref-43) |
| [JPMorgan -- US12061970B1](https://patents.google.com/patent/US12061970B1/en) | LLM-driven orchestration of task-specific ML agents, including checking/verification arrangements | Adjacent to planner/orchestrator and specialist-agent execution. [44](#ref-44) |
| [JPMorgan -- US12399691B2](https://patents.google.com/patent/US12399691B2/en) | Automatic workflow generation by LLMs, executable workflow/API structure and modification based on feedback | Particularly relevant to LLM-generated and interactively modified agent programs. [45](#ref-45) |
| [US20240289545A1](https://patents.google.com/patent/US20240289545A1/en) | Hierarchical plan generation/execution, working memory and dynamic control flow for LLM systems | Adjacent to program synthesis and dynamic plans. [46](#ref-46) |
| [Citibank -- US12111754B1](https://patents.google.com/patent/US12111754B1/en) | Dynamic validation of AI applications against compliance requirements | Adjacent to compiled/runtime compliance checking. [47](#ref-47) |

The proper conclusion from these results is modest: **there are active claim areas near workflow synthesis, orchestration, routing and automated compliance validation**. A commercial product should have patent counsel compare the actual independent claims against the eventual architecture. A paper or open-source release does not retroactively neutralise earlier patent filings, although public disclosure can of course become prior art against later claims.

On regulation, the architecture is directionally aligned with several requirements regulators increasingly care about. The EU AI Act entered into force on 1 August 2024, with much of the Regulation becoming applicable on 2 August 2026; the Act and Commission material place substantial emphasis on risk management, technical documentation, logging, traceability, accuracy/robustness/cybersecurity and human oversight for regulated high-risk systems. [48](#ref-48), [49](#ref-49) NIST's Generative AI Profile similarly frames risk management as a lifecycle problem rather than a one-time model test. [50](#ref-50) Exact obligations depend on role, use case and jurisdiction, so the runtime should make regulatory policies configurable rather than hard-code one legal interpretation.

A typed/durable agent runtime could make compliance evidence easier to produce:

```text
who authorised action
what policy version applied
what model/version executed
what data entered the call
what capability was exercised
what output was returned
what verifier accepted it
what external side effect followed
whether a human intervened
```


But inspectability creates its own privacy and security problem. A complete event log can contain prompts, customer information, source documents, credentials, model outputs and inferred sensitive information. The design therefore needs retention limits, access control, secret redaction, separation of content from tamper-evident hashes/metadata and explicit data-class effects. The fact that a trace is valuable for audit does not mean every participant should be allowed to read the trace.

**Human-in-the-loop should have formal semantics.** "Human reviewed this" is weak if the human did not have the information, authority or time required to make a decision. Article 14 of the EU AI Act explicitly addresses effective human oversight and intervention mechanisms for relevant high-risk systems. [49](#ref-49) In the language, an approval could therefore be a capability-bearing value:

```text
Approval<
    principal = Alice,
    role = ReleaseManager,
    scope = deployment_481,
    policy_version = 7,
    expires = ...
>
```


rather than a Boolean `approved=true`.

There is also an ethical limit to verification:

> **A program can provably comply with a bad policy.**

A discriminatory rule, an incomplete safety specification or an incorrect authority hierarchy can be enforced perfectly. Formal verification establishes a relationship between implementation and specification; it does not establish that the specification is morally, legally or factually correct. This is especially important if LLMs are allowed to generate policies/specifications themselves. AutoSpec+ and SEVerA show useful neural-proposal/symbolic-check loops, but a symbolic verifier can only check the formal properties it has been given. [15](#ref-15), [5](#ref-5)

That creates a second-order research problem:

```text
Who verifies the verifier?
Who validates the specification?
Who authorised a policy change?
What happens to active executions when policy v7 becomes v8?
```


Those questions belong inside the broad programme, especially for self-modifying agents.

<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

## Citation links added during reassembly


The original numbered citations link to the entries below, which point to the [shared bibliography]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#references).

- <a id="ref-5"></a>[Reference 5]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-5)
- <a id="ref-15"></a>[Reference 15]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-15)
- <a id="ref-43"></a>[Reference 43]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-43)
- <a id="ref-44"></a>[Reference 44]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-44)
- <a id="ref-45"></a>[Reference 45]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-45)
- <a id="ref-46"></a>[Reference 46]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-46)
- <a id="ref-47"></a>[Reference 47]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-47)
- <a id="ref-48"></a>[Reference 48]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-48)
- <a id="ref-49"></a>[Reference 49]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-49)
- <a id="ref-50"></a>[Reference 50]({{< ref "ai/design-research/06-research-reports/01-programmable-probabilistic-agent-computation" >}}#ref-50)
