---
draft: false
toc: true
title: "Prompt Driven"
linkTitle: "Prompt Driven"
---
# Prompt-Specified Systems and Prompt-Only Enforcement


A **prompt-specified system** is one in which prompts specify a substantial part of the system's functional behavior and an LLM interprets that specification at runtime. The prompts may describe analysis steps, transformations, decision criteria, domain rules, workflows, constraints, or output structure.

This is not inherently a problem. Many tasks are appropriately performed by an LLM. The architectural problem begins when the system trusts prompt compliance more than the model and its surrounding controls can justify.

This note calls that problem **prompt-only enforcement**:

> Prompt-only enforcement occurs when the architecture treats prompt compliance as sufficient assurance for a property whose required assurance exceeds the demonstrated reliability and failure containment of the model-based mechanism.

The deciding question is not whether the behavior is called "business logic" or whether it is written in a prompt. It is whether the implementation, evidence, and failure controls are strong enough for the assurance the requirement demands.

```text
required assurance > justified assurance
                     ↓
                assurance gap
                     ↓
strengthen controls or evidence, narrow scope,
weaken the claim, or reject the design
```


When that gap is material and remains unaddressed, the prompt-specified requirement has become an architectural problem.

## Specification, implementation, enforcement, and assurance


Three architectural responsibilities are easy to collapse in an LLM application:

| Responsibility | Question | Example |
|---|---|---|
| Specification | What should happen? | "Return an object with exactly these fields." |
| Implementation | What mechanism performs it? | The prompt/model combination constructs a candidate object. |
| Enforcement | What prevents an unacceptable result from being accepted? | Constrained generation or a schema validator rejects an invalid object. |
| Assurance | What justifies trusting the result? | Evidence from the mechanism, its controls, measured behavior, and failure handling. |

The prompt contains or serves as a runtime behavioral specification and also supplies instructions to the implementation. Neither role establishes that every result complies. Assurance is the justified confidence that the requirement will be met under stated conditions. Enforcement is one way to establish assurance; measured reliability, containment, detection, and recovery may also contribute.

Prompt-specified systems make it tempting to treat one natural-language artifact as all three things:

```text
prompt
  = specification
  + implementation instructions
  + assumed enforcement
```


The last line is the mistake. A statement of intent is not, by itself, evidence that the system provides the required assurance.

An output schema illustrates the distinction. A prompt that says "return JSON shaped like X" contains an output instruction. It does not by itself create an enforced output contract. Constrained decoding can prevent malformed candidates; parsing and schema validation can accept or reject candidates before downstream use.

## Classify the requirement first


The assurance requirement should drive the architecture. A useful starting point is to classify each property as hard, statistical, or best effort.

| Requirement class | Meaning | Example |
|---|---|---|
| Hard property or invariant | Must hold for every result accepted at a defined system boundary | A user may access only records they are authorized to access. |
| Statistical requirement | Must meet a measurable target over a defined population | At least 95% of supported requests are routed correctly. |
| Best-effort behavior | Desirable, but no contractual success threshold is claimed | Prefer concise explanations and useful grouping. |

An **invariant** should remain a strict term. If a property may fail in 5% of accepted results while the system still satisfies its specification, it is not an invariant. It is a statistical requirement or best-effort behavior.

The same operation can belong to different classes in different systems. JSON formatting may be best effort when a human reads the result, but a hard property when an automated service consumes it. A business decision may be intentionally statistical, while a simple formatting rule may be critical. The subject matter of the rule does not determine its assurance class.

The words used in a prompt do not determine the class either. *Must*, *never*, and *guarantee* may signal a hard property, but the actual system contract and its boundary determine the class. Failure consequences inform how much assurance the requirement should demand and whether the contract should be strengthened.

### Hard properties


A hard property applies at a stated boundary, usually to every result the system accepts or every action it commits. Examples include:

- a payment does not exceed its approved limit;
- a workflow transition is valid from the current state;
- an access decision follows the applicable authorization policy;
- every stored source identifier names a source that was actually retrieved; and
- every value accepted by a service conforms to its input schema.

"Hard" does not mean that ordinary application code is magically free of defects. It means that the architecture claims the property for every accepted result and therefore needs controls and evidence compatible with that claim. The model may still produce a bad candidate without violating the system-level invariant if the application reliably prevents that candidate from crossing the acceptance boundary.

### Statistical requirements


A statistical requirement permits individual failures while setting a performance target over a defined population. A useful requirement and assurance plan together include at least:

```text
population
+ success criterion
+ target rate
+ uncertainty
+ failure severity
+ evaluation period
```


For example:

> On supported English-language requests drawn from the production traffic distribution, at least 95% must be routed to the correct queue. The evaluation protocol must estimate that rate with stated uncertainty. Security-related misroutes are measured separately and are not covered by the general error budget.

For this kind of requirement, a prompt/model combination may be a suitable implementation. Evaluation is then the principal evidence for the assurance claim, while monitoring checks whether its assumptions continue to hold.

### Best-effort behavior


Best-effort requirements describe desired qualities without promising a particular success rate. Prompts are often sufficient when failures have limited consequences and the surrounding product can tolerate them. Tone, wording, optional observations, and exploratory categorization often fit here.

Calling a behavior best effort must not be used to hide a consequence that the product actually treats as mandatory.

## The prompt-only enforcement anti-pattern


The anti-pattern appears in a flow like this:

```text
requirement
    ↓
prompt instruction
    ↓
LLM output
    ↓
trusted result or committed action
```


The architecture assumes that because the requirement was clearly written, the output may be trusted as though the requirement had been enforced.

A design for a hard property makes the acceptance boundary visible:

```text
requirement
    ↓
prompt/model candidate
    ↓
enforcement, verification, or review
    ↓
accepted result or rejected candidate
```


Making the boundary visible is necessary but not sufficient. The control at that boundary must itself have failure properties and evidence compatible with the required assurance.

A statistical requirement has a different assurance path:

```text
requirement
    ↓
prompt/model behavior
    ↓
representative evaluation and production monitoring
    ↓
evidence that the population-level target is met
```


"Prompt-only" refers to the basis for trust, not merely the number of components in the diagram. Adding a second model call or a superficial format check does not close an assurance gap unless it materially addresses the relevant failure modes.

When the mismatched property is a hard invariant, **prompt-encoded invariant** is a useful name for the especially serious subtype.

## Why the assurance gap arises


LLMs interpret natural-language instructions rather than execute them under the fixed semantics of a conventional policy engine, state machine, or arithmetic expression. Their behavior can change with the model, context, retrieved material, user input, and competing instructions.

Relevant failure modes include:

- imperfect instruction following;
- ambiguity in natural-language rules;
- sensitivity to context and prompt wording;
- conflicts between trusted instructions and untrusted content;
- accidental or adversarial prompt injection;
- changes to models, prompts, tools, or retrieval; and
- plausible output that conceals a violated requirement.

Randomness is not the whole issue. Deterministic decoding can make a result repeatable without making the natural-language rule mechanically enforceable or the result correct.

These characteristics do not make an LLM unsuitable for required behavior. They limit what may be inferred from the presence of an instruction alone. A prompt/model combination can demonstrate strong measured performance on a defined task. That can support a statistical claim under the tested conditions. It does not establish that a property holds for every accepted result.

The safer principle is:

> A prompt instruction alone should not be treated as stronger evidence than the measured assurance of the model-based mechanism.

## Controls provide different kinds of assurance


Not every validator provides the same assurance. An architecture review should identify the type of control, the failure it addresses, the evidence that it works, and the limitations that remain.

| Control | Examples | What it checks or contributes | Important limitation |
|---|---|---|---|
| Structural enforcement | Constrained decoding, parser, schema validator, type check, database constraint | Whether an output has an allowed structure or satisfies a mechanically checkable relation | Does not establish that its content is true or semantically supported |
| Rule-based enforcement | Policy engine, calculation, state machine, referential check | Whether a precisely encoded relation holds for the supplied inputs | Depends on correct rules, trusted inputs, and implementation quality |
| Probabilistic verification | Classifier, entailment model, second LLM review | Additional measured evidence about a semantic property | Remains fallible and may share failures with the generator |
| Human verification | Editorial approval, domain review, two-person approval | Contextual judgment at a review boundary | Has capacity, consistency, fatigue, and training limits |

Moving a rule from a prompt into code is therefore not sufficient reasoning on its own. Application code may provide much stronger assurance for `amount <= approved_limit` when its inputs and arithmetic are trusted. A second LLM checking whether a claim is supported remains a probabilistic mechanism, even when it sits outside the generation prompt and is called a verifier.

Controls also play different roles in failure handling:

- **Prevention** restricts generation or blocks an invalid result before commitment.
- **Detection** makes a failure observable, possibly after it occurs.
- **Containment** limits what the model can access or the impact of a bad result.
- **Recovery** corrects, rolls back, or provides an appeal path after failure.

A complete design may need more than one. Detection does not prevent harm, containment does not correct the underlying error, and some disclosures or external actions cannot be recovered.

### Independence matters


A verifier's assurance contribution depends on its own accuracy and coverage and on how its errors correlate with the generator's. Running the same model with the same evidence, assumptions, and similar instructions twice may reproduce the same mistake. Agreement between the two calls can then create apparent confidence without adding much assurance.

Independence can be improved by using controls based on different mechanisms or information:

- compare the output with authoritative application state;
- use immutable source identifiers and anchored passages;
- enforce numeric, authorization, or policy rules outside the model;
- keep untrusted instructions out of the verification context;
- use a separately trained classifier where its measured behavior is suitable;
- route high-consequence cases to human review; and
- measure the end-to-end failure rate instead of assuming that a second pass helps.

Conditional error correlation is not binary. The verifier's contribution should be measured against the failures that matter.

## Worked example: provenance


Product statements such as "every externally checkable factual claim has verified provenance" often bundle several distinct properties:

1. The output contains a source identifier.
2. The identifier names a source that was actually retrieved.
3. The cited material exists at the referenced location in that source.
4. The cited material semantically supports the generated claim.

The first three concern lineage and referential integrity. The fourth is better described as groundedness, attribution correctness, or entailment. Products often group them under *provenance*, but an assurance claim should name them separately.

A prompt can instruct the model to satisfy all four:

> Cite every claim accurately and never make an unsupported statement.

That instruction is useful, but it establishes none of the properties by itself. The properties also require different controls.

| Provenance property | Suitable control or evidence | Residual limitation |
|---|---|---|
| Source identifier is present | Required structured field and schema validation | Presence does not establish validity |
| Identifier names a retrieved source | Check against an immutable retrieval manifest | Retrieval does not establish support |
| Referenced material exists | Validate a span, quotation, or content hash against the source | Existence does not establish relevance |
| Material supports the claim | Semantic evaluation, constrained claim formation, or human review | Semantic judgment may remain probabilistic and subject to correlated error |

A stronger provenance design could use this flow:

```text
retriever emits immutable source IDs and anchored passages
        ↓
model emits structured claim-to-source mappings
        ↓
application validates fields, IDs, and spans
        ↓
semantic support is evaluated at the required assurance level
        ↓
unsupported or uncertain claims are rejected, qualified, or reviewed
        ↓
accepted mappings are stored for audit
```


This design can provide strong assurance that references are well formed, name retrieved sources, and point to real material. It does not automatically guarantee semantic entailment.

If semantic support must hold for every published factual claim, the system needs an acceptance process compatible with that requirement. Depending on the use case, that may include tighter extractive generation, abstention, independent evidence checks, or expert review. None of these labels is automatically sufficient; its limitations still need to be measured or otherwise justified. If the product accepts a measured citation-error rate, the requirement should be statistical and backed by representative evaluation and monitoring. If citations are only helpful context, best-effort generation may be enough.

The honest alternative may also be to weaken the claim. The system should not say "verified provenance" when it has established only that a citation field is present.

## Evals as assurance evidence


For statistical requirements, evals are often the main evidence that a prompt/model implementation meets its target. A statement such as "the system is 95% accurate" is incomplete unless the evaluation defines what was measured and how confidently the result generalizes.

A credible evaluation should address:

- the target population and important subpopulations;
- inclusion and exclusion criteria;
- a clear success definition;
- sample size and confidence intervals;
- class-specific and severity-weighted errors;
- adversarial, rare, and boundary cases;
- fallbacks, abstentions, and human escalations;
- production distribution shift; and
- regression after changes to the prompt, model, data, retrieval, tools, or workflow.

Aggregate accuracy can hide unacceptable failures. A 5% rate of omitted secondary details is different from a 5% rate of unauthorized approvals. High-severity errors may need a separate threshold, an enforced boundary, or both even when average performance is acceptable.

Evaluation evidence also has a scope. It justifies claims about conditions sufficiently similar to those tested. A change to the system or its operating population may invalidate that evidence and should trigger proportionate reevaluation.

For hard properties, evals, regression tests, and adversarial tests remain valuable: they find defects and test the surrounding controls. A finite eval alone does not prove that a property holds for every accepted result.

## Examples across requirement classes


| Property | Likely class | Role of the prompt | Required control or evidence |
|---|---|---|---|
| Return parseable invoice JSON before automated processing | Hard | Guides generation | Constrained output or parse-and-validate acceptance gate |
| Route at least 95% of supported requests correctly | Statistical | May implement the behavior | Representative evals, uncertainty estimates, regression tests, and monitoring |
| Group semantically similar complaints | Statistical or best effort | Implements intentionally fuzzy behavior | Product-appropriate quality evaluation and correction path |
| Do not approve an amount above the account limit | Hard | May explain the rule or propose an action | Authoritative calculation or policy check before approval |
| Allow access only to the user's records | Hard | Should not be the authority | Access control outside the model and least-privilege tool access |
| Move a case only to a valid next state | Hard | May propose a transition | State machine or transactional constraint validates it |
| Prefer concise explanations | Best effort | Implements the behavior | Ordinary product-quality review |

This table does not imply that every exact operation belongs in conventional application code. It shows that the trusted boundary must be supported by a mechanism whose failure properties match the requirement.

The familiar distinction between semantic/model logic, business policy, and deterministic application logic is useful description, but it is not the decision rule. Semantic work may need a hard review boundary. Business policy may intentionally permit measured error. Seemingly trivial formatting may be critical. Required assurance decides.

## Architecture review method


Review each prompt-specified requirement through this sequence:

```text
Requirement
    ↓
Required assurance
    ↓
Implementation mechanism
    ↓
Evidence of assurance
    ↓
Failure handling
```

### 1. State the requirement precisely


Ask what must be true, at which boundary, for which inputs, and under which conditions. Avoid terms such as *reliable*, *safe*, *accurate*, and *grounded* unless they are given an operational meaning.

### 2. Classify the required assurance


Determine whether the property applies to every accepted result, to a measured share of a defined population, or only as a best-effort objective. Record the severity, detectability, and reversibility of failure as well as its frequency.

### 3. Identify the actual implementation


Do not stop at "the prompt handles it." Identify the model, context, tools, application code, data sources, human steps, and the boundary at which the output becomes trusted.

### 4. Identify the evidence and controls


Ask:

- What shows that this mechanism reaches the required assurance?
- Which failures are prevented, detected, contained, or addressed through recovery?
- Is verification sufficiently independent from generation?
- What assumptions must hold for the controls to work?
- Which system changes require reevaluation?

"The prompt explicitly says so" is a specification answer, not an assurance answer.

### 5. Close or acknowledge the gap


Possible responses include:

- introduce a stronger acceptance boundary;
- validate or constrain the output;
- reduce model permissions or action scope;
- add independent or human review for high-consequence cases;
- define and evaluate a statistical target;
- add monitoring and recovery;
- narrow the supported population; or
- weaken the requirement to match what the system can honestly assure.

If the gap cannot be closed, the system should not claim the stronger property.

## A compact review test


Start with:

> What level of assurance does this property require, and what evidence or mechanism establishes that the implementation reaches that level?

Then branch by requirement type:

```text
Every accepted result
    → What prevents an invalid result from crossing the trusted boundary?

X% over population P
    → What representative evaluation, uncertainty estimate,
      and monitoring show that the target is met?

Best effort
    → Are the consequences of occasional failure actually acceptable?
```


For every branch, ask whether verification and control failures are sufficiently independent of the generator's failures, and whether remaining failures are detectable, containable, and recoverable.

Warning signs of prompt-only enforcement include one or more of the following:

- The consequence of violation exceeds the stated tolerance.
- The primary assurance argument is that the prompt instructs the model correctly.
- Evaluation does not establish a claimed statistical reliability.
- Checks do not address the relevant semantic failure.
- A verifier is subject to substantially the same failures as the generator.
- No adequate enforcement, verification, containment, or recovery mechanism closes the gap.

## Terminology


**Prompt-specified system** is a neutral descriptive term in this note. It says where important behavior is specified without implying that the behavior is good, bad, deterministic, or assured.

**Prompt-only enforcement** is the proposed anti-pattern within that broader category. **Prompt-encoded invariant** names the hard-property subtype.

Related research uses [**promptware**](https://arxiv.org/abs/2503.02400) for systems that treat prompts as first-class software artifacts and use them as a primary interface for directing LLM behavior. [**Prompt programming**](https://doi.org/10.1145/3729342) describes the practice of developing prompts that function like programs. These are useful emerging terms, but neither makes prompt-heavy architecture an anti-pattern by itself. For an architecture review, the descriptive phrase *prompt-encoded logic* is often clearer than inventing a named architecture style.

## Rationale for this framing


This note makes several deliberate choices.

First, it uses **prompt-specified system** as a neutral umbrella rather than treating prompt-heavy design as an anti-pattern. Prompts are a natural place for semantic analysis, classification, synthesis, and other behavior whose intended semantics are judgmental. Calling the whole architecture defective would obscure the narrower problem and make the argument easy to dismiss.

Second, it defines **prompt-only enforcement** as an assurance mismatch rather than as "business logic in prompts." The category of the logic is only a rough clue. A business rule may legitimately be statistical, while a formatting rule may be a hard requirement when another service consumes the output. Required assurance is the more general decision variable.

Third, it keeps **invariant** strict. A property that may fail within an accepted error budget is not an invariant in the conventional software sense. Calling it a *probabilistic invariant* would blur the difference between a per-result contract and a population-level performance target. The hard, statistical, and best-effort classes make that distinction explicit.

Fourth, the note does not reduce the remedy to "put it in deterministic code." Code can contain defects, inputs can be untrusted, and some semantic properties cannot be decided mechanically. The relevant question is whether the chosen mechanism, evidence, and failure handling justify the assurance being claimed. Structural validation, rule-based enforcement, probabilistic verification, and human review answer different questions.

Fifth, verifier independence is explicit because adding another model call can look like defense in depth without providing it. A verifier contributes assurance through its accuracy, coverage, and error relationship with the generator. Repeating the same assumptions through the same model may preserve the original failure.

Finally, provenance is the main example because it exposes the boundary between mechanical and semantic checks. Source identifiers, retrieval membership, and anchored spans can often be checked directly. Whether a source actually supports a generated claim requires semantic judgment. Treating those as one guarantee would hide the exact assurance gap the note is intended to reveal.

Together, these choices keep the claim narrow: prompts are not the problem, and probabilistic implementation is not the problem. The problem is trusting a mechanism beyond what its evidence and failure controls justify.

## Conclusion


Prompt-specified systems are a legitimate way to build software. Prompts can specify behavior, and prompt/model mechanisms can implement analysis, classification, transformation, workflow, and decision behavior. For statistical and best-effort requirements, a prompt/model mechanism may be exactly the right design.

The anti-pattern is not "important logic in prompts." It is an unsupported assurance claim: the system treats the presence of an instruction as sufficient reason to trust that the resulting property holds.

The durable principle is:

> Prompts may specify behavior, and prompt/model mechanisms may implement it. Trust their results only to the level justified by measured performance and by any controls and failure handling required for the consequences involved.

Or, as the review framework:

```text
Requirement → required assurance → implementation mechanism
            → evidence of assurance → failure handling
```


Do not confuse a requested behavior with an assured property.

## Related sources


- Chen et al., [*Promptware Engineering: Software Engineering for Prompt-Enabled Systems*](https://arxiv.org/abs/2503.02400).
- Liang et al., [*Prompts Are Programs Too! Understanding How Developers Build Software Containing Prompts*](https://doi.org/10.1145/3729342).
- NIST, [*Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*](https://doi.org/10.6028/NIST.AI.600-1).
- OWASP GenAI Security Project, [*LLM01:2025 Prompt Injection*](https://genai.owasp.org/llmrisk/llm01-prompt-injection/).
