---
draft: false
toc: true
title: "Stack 21 Fault Inventory"
linkTitle: "Stack 21 Fault Inventory"
---
# Layer 2 Fault Inventory


This file defines the canonical atomic fault modes for Layer 2.

Layer 2 fault modes are recurring behavioral failure patterns that arise from Layer 1A mechanisms and Layer 1B learned behavioral features. They are not yet system faults, missing controls, evaluation methods, or user impacts.

Use this inventory as the base catalog. Broader groups such as "Behavioral Instability," "Hallucination and Unsupported Claims," or "Agentic Process Failure" should be treated as family views over these atomic faults, not as replacements for them.

## Record schema


Each fault record uses the following fields:

- **Definition:** what failed behaviorally.
- **Canonical statement:** reusable one-sentence formulation.
- **Typical expressions:** common observable forms.
- **Derived from:** primary Layer 1A mechanisms and Layer 1B features.
- **Common neighbors:** nearby faults that often co-occur.
- **Not this:** boundary guidance to prevent overuse.

# F01. Context Omission

## Definition


Required information is absent from the runtime context, so the model cannot directly use it.

## Canonical statement


> The model cannot use information that was not supplied or reintroduced into the current context.

## Typical expressions


- Missing facts.
- Forgotten requirements.
- Generic answers where task-specific evidence was required.
- Contradiction of earlier instructions that were not carried forward.
- Use of parametric defaults instead of supplied facts.
- Failure to consider a document, policy, record, or tool result that was not included.

## Derived from


- A3 Finite Ordered Context Interface.
- A6 Stateless Invocation.
- A2 Static Parametric Learned Prior, when absent context causes fallback to learned defaults.

## Common neighbors


- F02 Context Underutilization.
- F04 Continuity Loss.
- F05 Stale-State Reliance.
- F48 Context Truncation Loss.

## Not this


Do not use F01 when the information was present but ignored, buried, or outweighed. Use F02 or F03 instead.

# F02. Context Underutilization

## Definition


Relevant information is present in context but receives insufficient influence on the model's output.

## Canonical statement


> The model may fail to use relevant context even when that context is technically present.

## Typical expressions


- Lost-in-the-middle behavior.
- Ignoring buried constraints.
- Overusing nearby but weaker evidence.
- Citing a document while missing its key span.
- Failing to apply a relevant exception present in the prompt.
- Answering from general knowledge despite supplied task-specific evidence.

## Derived from


- A4 Attention/Position-Mediated Context Integration.
- A3 Finite Ordered Context Interface, when large or dense context increases utilization pressure.
- B7 Distribution-Conditional Competence, when context format or domain reduces effective use.

## Common neighbors


- F01 Context Omission.
- F03 Context Priority Misweighting.
- F06 Distractor Assimilation.
- F34 Evidence-Claim Mismatch.

## Not this


Do not use F02 when the relevant information was absent. Use F01. Do not use it when the model used context but assigned the wrong authority or priority. Use F03 or F07.

# F03. Context Priority Misweighting

## Definition


The model fails to correctly prioritize among competing, conflicting, or heterogeneous context elements.

## Canonical statement


> When multiple context elements compete, the model may overweight the wrong one.

## Typical expressions


- Treating a low-authority source as authoritative.
- Following a recent instruction despite an earlier stronger constraint.
- Overweighting an example over the actual task.
- Resolving conflict by salience rather than authority.
- Using retrieved evidence that is less current than another provided source.
- Giving equal weight to policy, commentary, user speculation, and source text.

## Derived from


- A4 Attention/Position-Mediated Context Integration.
- A5 In-Band Control/Data Representation.
- B1 Learned Natural-Language Task Induction.
- B3 Natural-Language Interface Sensitivity.

## Common neighbors


- F02 Context Underutilization.
- F07 Source Authority Misclassification.
- F12 Constraint Misclassification.
- F35 Parametric-Prior Override.

## Not this


Do not use F03 for ordinary absence of context. Use F01. Use F07 when the main issue is authority/source status rather than general prioritization.

# F04. Continuity Loss

## Definition


Information needed for continuity across turns, calls, sessions, or workflow steps is unavailable or inconsistently represented.

## Canonical statement


> The model has no native durable state, so continuity can fail unless relevant state is supplied in the current context.

## Typical expressions


- Re-asking for known information.
- Losing user preferences.
- Forgetting project decisions.
- Inconsistent follow-through across tool calls.
- Treating a multi-step workflow as a new independent task.
- Failing to preserve approvals, denials, constraints, or prior commitments.

## Derived from


- A6 Stateless Invocation.
- A3 Finite Ordered Context Interface.
- A10 Transformer Compute Scaling, when state summarization or truncation is used.

## Common neighbors


- F01 Context Omission.
- F05 Stale-State Reliance.
- F25 Invariant Loss.
- F49 Compression-Induced Distortion.

## Not this


Use F04 for cross-turn, cross-call, or cross-session continuity failures. For constraint loss inside a single reasoning chain, use F25.

# F05. Stale-State Reliance

## Definition


The model relies on outdated context, memory, retrieved content, or workflow state as if it were current.

## Canonical statement


> State that was once valid can become wrong when the model or system treats it as current.

## Typical expressions


- Using an old user preference after it was changed.
- Applying an outdated policy.
- Referring to a previous task status as if still active.
- Using stale retrieved documents when newer evidence exists.
- Treating old tool outputs as current system state.
- Continuing from an obsolete plan after conditions changed.

## Derived from


- A6 Stateless Invocation.
- A3 Finite Ordered Context Interface.
- A2 Static Parametric Learned Prior, when learned or remembered defaults dominate updates.
- B7 Distribution-Conditional Competence, when freshness-sensitive domains are involved.

## Common neighbors


- F01 Context Omission.
- F03 Context Priority Misweighting.
- F04 Continuity Loss.
- F35 Parametric-Prior Override.

## Not this


Do not use F05 merely because a source is absent. Use F01. Use F05 when outdated state is present, retrieved, remembered, or inferred and then treated as valid.

# F06. Distractor Assimilation

## Definition


Irrelevant, misleading, or weakly related context contaminates the model's output.

## Canonical statement


> Context can harm behavior when irrelevant or misleading material is integrated as if it were relevant.

## Typical expressions


- Using semantically similar but wrong retrieved chunks.
- Mixing facts from neighboring entities.
- Incorporating irrelevant examples into the answer.
- Letting decoy details alter a classification, summary, or tool choice.
- Answering from a distractor document instead of the governing document.
- Combining incompatible facts from multiple records.

## Derived from


- A4 Attention/Position-Mediated Context Integration.
- A5 In-Band Control/Data Representation.
- B3 Natural-Language Interface Sensitivity.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F02 Context Underutilization.
- F03 Context Priority Misweighting.
- F07 Source Authority Misclassification.
- F34 Evidence-Claim Mismatch.

## Not this


Do not use F06 for false claims that arise without misleading context. Use F30 or F31. Use F06 when the wrong context materially shaped the behavior.

# F07. Source Authority Misclassification

## Definition


The model misclassifies the authority, trust level, provenance, or evidential role of a context item.

## Canonical statement


> The model may treat a source as more or less authoritative than it should be.

## Typical expressions


- Treating user speculation as verified fact.
- Treating retrieved text as higher priority than system instruction.
- Treating unofficial documentation as authoritative policy.
- Treating generated summaries as source evidence.
- Treating stale or draft material as final.
- Treating quoted text as endorsed by the current user.

## Derived from


- A5 In-Band Control/Data Representation.
- A4 Attention/Position-Mediated Context Integration.
- B1 Learned Natural-Language Task Induction.
- B3 Natural-Language Interface Sensitivity.

## Common neighbors


- F03 Context Priority Misweighting.
- F15 Control/Data Confusion.
- F16 Prompt-Injection Compliance.
- F34 Evidence-Claim Mismatch.

## Not this


Use F07 when the failure concerns source status, authority, provenance, or trust. Use F03 for broader prioritization problems not specifically about authority.

# F08. Prompt-Surface Fragility

## Definition


Semantically similar or operationally equivalent prompts produce materially different behavior because the model is sensitive to wording, ordering, formatting, examples, or framing.

## Canonical statement


> The model responds to a tokenized conditioning surface, not directly to abstract user intent.

## Typical expressions


- Different answers to paraphrases.
- Different refusal or escalation behavior from minor wording changes.
- Different tool use triggered by superficial cues.
- Different output structure after harmless formatting edits.
- Policy behavior changes across equivalent descriptions.
- A prompt works with one phrase but fails with a synonym.

## Derived from


- B3 Natural-Language Interface Sensitivity.
- B1 Learned Natural-Language Task Induction.
- A4 Attention/Position-Mediated Context Integration.
- A3 Finite Ordered Context Interface.
- A7 Autoregressive Factorization.

## Common neighbors


- F09 Task Misinduction.
- F10 Task Blending.
- F12 Constraint Misclassification.
- F46 Behavioral Outcome Variance.

## Not this


Do not use F08 for harmless variation in wording when the intended outcome is preserved. Use F08 only when the behavioral outcome materially changes.

# F09. Task Misinduction

## Definition


The model infers the wrong task, objective, or success criterion from the prompt or conversation context.

## Canonical statement


> The model may infer a different task than the user or system intended.

## Typical expressions


- Summarizes instead of extracts.
- Explains instead of decides.
- Drafts instead of executes.
- Answers a nearby question rather than the actual one.
- Optimizes for helpfulness when exact compliance was required.
- Produces the apparent genre of the answer while missing the operation.

## Derived from


- B1 Learned Natural-Language Task Induction.
- A5 In-Band Control/Data Representation.
- A4 Attention/Position-Mediated Context Integration.
- B3 Natural-Language Interface Sensitivity.

## Common neighbors


- F08 Prompt-Surface Fragility.
- F10 Task Blending.
- F11 Scope Misinterpretation.
- F12 Constraint Misclassification.

## Not this


Do not use F09 for correct task induction followed by poor execution. Use reasoning, grounding, structure, or action faults depending on the failure.

# F10. Task Blending

## Definition


The model incorrectly merges multiple tasks, roles, instructions, examples, or objectives into a hybrid behavior that satisfies none of them cleanly.

## Canonical statement


> When several task frames coexist, the model may blend them instead of selecting or sequencing them correctly.

## Typical expressions


- Mixing summarization with classification.
- Combining critique and rewrite into an unintended hybrid.
- Performing extraction while adding unsupported interpretation.
- Answering both old and new user requests at once.
- Mixing examples from one task with instructions for another.
- Producing an output that partially satisfies multiple incompatible requirements.

## Derived from


- B1 Learned Natural-Language Task Induction.
- B2 In-Context Demonstration Conditioning.
- A5 In-Band Control/Data Representation.
- A4 Attention/Position-Mediated Context Integration.

## Common neighbors


- F09 Task Misinduction.
- F11 Scope Misinterpretation.
- F12 Constraint Misclassification.
- F17 Output Contract Drift.

## Not this


Do not use F10 when the model simply chooses the wrong task. Use F09. Use F10 when multiple task frames are incorrectly combined.

# F11. Scope Misinterpretation

## Definition


The model applies the task to the wrong scope: too broad, too narrow, wrong object, wrong time span, wrong audience, or wrong level of abstraction.

## Canonical statement


> The model may perform the right general task over the wrong scope.

## Typical expressions


- Summarizing the whole document when only one section was requested.
- Answering generally when asked about a specific jurisdiction, account, user, or time period.
- Applying a policy to the wrong case type.
- Extracting from examples instead of the target input.
- Treating background context as part of the task payload.
- Producing strategic advice when the task asked for operational next steps.

## Derived from


- B1 Learned Natural-Language Task Induction.
- A3 Finite Ordered Context Interface.
- A4 Attention/Position-Mediated Context Integration.
- A5 In-Band Control/Data Representation.

## Common neighbors


- F09 Task Misinduction.
- F10 Task Blending.
- F12 Constraint Misclassification.
- F15 Control/Data Confusion.

## Not this


Use F11 when the task type is broadly correct but the target range or object is wrong. Use F09 when the task type itself is wrong.

# F12. Constraint Misclassification

## Definition


The model misclassifies the force or role of a requirement: hard constraint, soft preference, example, exception, background note, default, or optional guidance.

## Canonical statement


> The model may infer the wrong normative weight for a contextual requirement.

## Typical expressions


- Treating a preference as mandatory.
- Treating a mandatory rule as optional.
- Dropping exceptions or "unless" clauses.
- Applying an example too broadly.
- Preserving surface style while violating a core requirement.
- Treating formatting guidance as more important than factual fidelity.

## Derived from


- B1 Learned Natural-Language Task Induction.
- A4 Attention/Position-Mediated Context Integration.
- A5 In-Band Control/Data Representation.
- A7 Autoregressive Factorization.

## Common neighbors


- F03 Context Priority Misweighting.
- F09 Task Misinduction.
- F13 Example Overgeneralization.
- F25 Invariant Loss.

## Not this


Do not use F12 for ordinary omission of a constraint from context. Use F01. Use F12 when the constraint is present but assigned the wrong status.

# F13. Example Overgeneralization

## Definition


The model treats in-context examples as exhaustive rules, copies them too literally, or extends their pattern beyond the intended domain.

## Canonical statement


> Examples can become accidental rules when the model overgeneralizes from them.

## Typical expressions


- Copying example phrasing into unrelated cases.
- Assuming the label space contains only labels shown in examples.
- Applying an edge-case example as the default rule.
- Repeating example-specific values, entities, or structure.
- Treating demonstrations as stronger than written instructions.
- Overfitting to narrow few-shot prompt cases.

## Derived from


- B2 In-Context Demonstration Conditioning.
- B1 Learned Natural-Language Task Induction.
- A4 Attention/Position-Mediated Context Integration.
- A5 In-Band Control/Data Representation.

## Common neighbors


- F10 Task Blending.
- F12 Constraint Misclassification.
- F45 Distributional Overgeneralization.
- F17 Output Contract Drift.

## Not this


Do not use F13 when examples were available but ignored. Use F14. Use F13 when examples were followed too strongly or generalized too far.

# F14. Example Underuse

## Definition


The model fails to use relevant in-context examples that should define the runtime task pattern, output format, label space, or edge-case behavior.

## Canonical statement


> Examples can fail to shape behavior even when they were intended as the task specification.

## Typical expressions


- Ignoring few-shot label conventions.
- Failing to follow demonstrated output format.
- Missing edge-case treatment shown in examples.
- Reverting to generic task behavior despite demonstrations.
- Treating examples as illustrative prose rather than operative guidance.
- Applying written instructions while ignoring clarifying examples.

## Derived from


- B2 In-Context Demonstration Conditioning.
- A4 Attention/Position-Mediated Context Integration.
- B1 Learned Natural-Language Task Induction.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F08 Prompt-Surface Fragility.
- F09 Task Misinduction.
- F12 Constraint Misclassification.
- F17 Output Contract Drift.

## Not this


Use F14 when relevant examples should have shaped behavior but did not. Use F13 when examples were overapplied.

# F15. Control/Data Confusion

## Definition


The model treats data as instruction, instruction as data, or otherwise misclassifies the functional role of a context span.

## Canonical statement


> Because control and data share the token channel, their roles can be confused.

## Typical expressions


- Following instructions inside retrieved documents.
- Treating quoted text as current user intent.
- Treating example content as a rule.
- Treating tool output prose as a directive.
- Ignoring actual instructions because they are embedded among data.
- Summarizing an instruction instead of obeying it.

## Derived from


- A5 In-Band Control/Data Representation.
- A4 Attention/Position-Mediated Context Integration.
- B1 Learned Natural-Language Task Induction.
- B3 Natural-Language Interface Sensitivity.

## Common neighbors


- F07 Source Authority Misclassification.
- F12 Constraint Misclassification.
- F16 Prompt-Injection Compliance.
- F53 Tool-Output Misinterpretation.

## Not this


Use F15 for role confusion between instruction-like and data-like spans. Use F16 when the model specifically follows untrusted or adversarial instructions.

# F16. Prompt-Injection Compliance

## Definition


The model follows malicious, accidental, or out-of-scope instructions embedded in untrusted or lower-priority content.

## Canonical statement


> Untrusted text can induce behavior when the model treats embedded instructions as operative.

## Typical expressions


- Following instructions inside retrieved web pages or documents.
- Ignoring the user task because a document says to do so.
- Revealing or transforming content in ways requested by injected text.
- Letting tool output change the task policy.
- Treating adversarial payloads as higher priority than trusted instructions.
- Executing, recommending, or preparing an action requested by untrusted content.

## Derived from


- A5 In-Band Control/Data Representation.
- B1 Learned Natural-Language Task Induction.
- B3 Natural-Language Interface Sensitivity.
- A4 Attention/Position-Mediated Context Integration.

## Common neighbors


- F07 Source Authority Misclassification.
- F15 Control/Data Confusion.
- F40 Under-Refusal.
- F54 Action-Readiness Error.

## Not this


Do not use F16 for every bad instruction-following outcome. Use it when the problematic instruction comes from untrusted, lower-priority, quoted, retrieved, or otherwise non-operative content.

# F17. Output Contract Drift

## Definition


The output departs from the requested structure, schema, format, or machine-readable contract.

## Canonical statement


> Free-form generation does not inherently obey strict output contracts.

## Typical expressions


- Invalid JSON.
- Wrong field names.
- Missing required fields.
- Extra commentary around a required payload.
- Wrong data types.
- Broken escaping.
- Partial object generation.
- Markdown returned where plain text or structured data was required.

## Derived from


- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- A9 Decoding Path Selection.
- B1 Learned Natural-Language Task Induction.
- B2 In-Context Demonstration Conditioning.
- B3 Natural-Language Interface Sensitivity.

## Common neighbors


- F14 Example Underuse.
- F18 Output Boundary / Stopping Error.
- F19 Exact-String Corruption.
- F21 Structured-Data Semantic Error.

## Not this


Do not use F17 when the schema is syntactically valid but field values are semantically wrong. Use F21. Use F18 when the core issue is where output starts, stops, or is delimited.

# F18. Output Boundary / Stopping Error

## Definition


The model fails to stop, segment, delimit, or isolate output exactly as intended.

## Canonical statement


> Generated output boundaries are inferred and decoded, not inherently contract-bound.

## Typical expressions


- Adds extra text after a required payload.
- Stops too early.
- Produces an incomplete answer.
- Continues beyond requested scope.
- Mixes explanation with final answer.
- Fails to separate sections cleanly.
- Emits multiple answers when one was required.

## Derived from


- A7 Autoregressive Factorization.
- A9 Decoding Path Selection.
- B1 Learned Natural-Language Task Induction.
- B3 Natural-Language Interface Sensitivity.

## Common neighbors


- F17 Output Contract Drift.
- F22 Local Plausibility Drift.
- F28 Premature Finalization.
- F50 Budget-Induced Degradation.

## Not this


Use F18 for output-boundary failures. Use F17 for schema/format failures, and F28 when the model stops because it prematurely decides the task is complete.

# F19. Exact-String Corruption

## Definition


The model alters strings that should be copied, preserved, compared, or emitted exactly.

## Canonical statement


> The model is not a deterministic string-copying machine.

## Typical expressions


- Corrupted IDs.
- Changed account numbers.
- Altered legal clauses.
- Modified URLs.
- Digit transposition.
- Missing punctuation.
- Wrong casing, escaping, or whitespace.
- Near-match copy of a required exact value.

## Derived from


- A1 Tokenized Representation.
- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B7 Distribution-Conditional Competence, especially for rare strings and unfamiliar formats.

## Common neighbors


- F17 Output Contract Drift.
- F20 Numeric/Symbolic Fragility.
- F21 Structured-Data Semantic Error.
- F52 Tool-Argument Error.

## Not this


Do not use F19 for semantic paraphrase differences where exact preservation was not required. Use F19 when exact identity matters.

# F20. Numeric/Symbolic Fragility

## Definition


The model mishandles numbers, counts, comparisons, symbolic transformations, or formal operations.

## Canonical statement


> Token-based sequence generation is not inherently reliable symbolic computation.

## Typical expressions


- Wrong arithmetic.
- Incorrect counting.
- Broken algebraic manipulation.
- Character-count errors.
- Incorrect sorting.
- Weak exact comparison.
- Numeric inconsistency across answer sections.
- Mishandling dates, units, tables, or identifiers as symbols.

## Derived from


- A1 Tokenized Representation.
- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F19 Exact-String Corruption.
- F21 Structured-Data Semantic Error.
- F24 Error Accumulation.
- F44 Competence Cliff.

## Not this


Use F20 when the failure is primarily exact-symbolic. Use reasoning faults such as F24 or F27 when the main issue is multi-step logic or planning rather than symbolic manipulation.

# F21. Structured-Data Semantic Error

## Definition


The model produces syntactically valid structured output whose field values, relations, labels, or semantics are wrong.

## Canonical statement


> A valid structure can still encode the wrong meaning.

## Typical expressions


- Valid JSON with the wrong classification label.
- Correct field names but values assigned to the wrong fields.
- Tool arguments that parse but refer to the wrong object.
- A schema-valid extraction that omits a required semantic condition.
- Correct enum syntax but wrong enum choice.
- Valid dates, numbers, or identifiers placed in the wrong slots.

## Derived from


- B1 Learned Natural-Language Task Induction.
- A8 Distributional Token Scoring.
- A9 Decoding Path Selection.
- A4 Attention/Position-Mediated Context Integration.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F17 Output Contract Drift.
- F19 Exact-String Corruption.
- F20 Numeric/Symbolic Fragility.
- F52 Tool-Argument Error.

## Not this


Do not use F21 for invalid syntax or schema failure. Use F17. Use F21 when the structure is acceptable but the meaning is wrong.

# F22. Local Plausibility Drift

## Definition


The model produces locally coherent text that gradually drifts away from the global task objective, factual constraints, or intended answer.

## Canonical statement


> A sequence can remain locally coherent while becoming globally wrong.

## Typical expressions


- Answer starts correctly but drifts.
- Explanation becomes overextended.
- Later claims exceed earlier evidence.
- Fluent continuation substitutes for task completion.
- The model continues the pattern rather than satisfying the objective.
- The answer becomes increasingly specific without added support.

## Derived from


- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B1 Learned Natural-Language Task Induction.
- B4 Plural Valid-Output Space, when broad acceptable-output space weakens convergence on the intended outcome.

## Common neighbors


- F23 Generated Path Lock-In.
- F24 Error Accumulation.
- F26 Plan Drift.
- F30 Unsupported Assertion.

## Not this


Use F22 for broad generation drift. Use F26 when the drift is specifically in a plan or workflow trajectory.

# F23. Generated Path Lock-In

## Definition


Early generated tokens, assumptions, framing, or commitments shape later generation in ways that make correction less likely.

## Canonical statement


> Once generation begins down a path, later output is conditioned by that path.

## Typical expressions


- Early false assumption contaminates the answer.
- Initial framing locks in a wrong interpretation.
- The model continues a mistaken plan.
- Early wording makes later correction less likely.
- A mistaken premise becomes self-reinforcing.
- The answer rationalizes earlier generated content instead of revising it.

## Derived from


- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- A9 Decoding Path Selection.
- B6 Generated Self-Assessment and Confidence Language, when self-justification reinforces earlier content.

## Common neighbors


- F22 Local Plausibility Drift.
- F24 Error Accumulation.
- F31 Plausibility-Truth Gap.
- F37 Self-Verification Misuse.

## Not this


Do not use F23 for input-side prompt sensitivity. Use F08. Use F23 for dependence created by the generated trajectory itself.

# F24. Error Accumulation

## Definition


Small local errors compound across a multi-step answer, reasoning chain, or process, producing a globally wrong result.

## Canonical statement


> Multi-step generation can compound local mistakes into globally wrong outputs.

## Typical expressions


- Early arithmetic error corrupts the final answer.
- Small assumption becomes a major conclusion.
- One invalid step propagates.
- A multi-step explanation appears coherent but is wrong.
- A long reasoning trace contains hidden contradiction.
- Intermediate extraction error corrupts later classification or action.

## Derived from


- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- A10 Transformer Compute Scaling, when long chains exceed practical verification capacity.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F20 Numeric/Symbolic Fragility.
- F23 Generated Path Lock-In.
- F25 Invariant Loss.
- F37 Self-Verification Misuse.

## Not this


Use F24 when several steps compound. Use F20 for isolated symbolic failure, and F31 for isolated false claims.

# F25. Invariant Loss

## Definition


The model fails to preserve required constraints, assumptions, definitions, or safety conditions across a reasoning chain, plan, or extended answer.

## Canonical statement


> The model may fail to maintain global constraints across a multi-step derivation or plan.

## Typical expressions


- Violates a stated budget.
- Ignores "do not contact X."
- Drops a safety condition.
- Forgets an exception.
- Uses inconsistent definitions.
- Solves a simplified version of the task.
- Changes the meaning of a variable, label, or policy term mid-answer.

## Derived from


- A3 Finite Ordered Context Interface.
- A4 Attention/Position-Mediated Context Integration.
- A7 Autoregressive Factorization.
- B1 Learned Natural-Language Task Induction.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F04 Continuity Loss.
- F12 Constraint Misclassification.
- F24 Error Accumulation.
- F26 Plan Drift.

## Not this


Use F25 for failure to preserve invariants during reasoning or planning. Use F04 for continuity failures across turns or sessions.

# F26. Plan Drift

## Definition


The model's generated plan or execution path gradually departs from the original goal, constraints, evidence, or state.

## Canonical statement


> A generated plan can remain locally reasonable while drifting from the intended objective.

## Typical expressions


- Skips prerequisites.
- Violates earlier constraints.
- Repeats steps.
- Changes objective midstream.
- Takes an action sequence inconsistent with current state.
- Optimizes for completion rather than correctness.
- Continues a plan after the environment has changed.

## Derived from


- A7 Autoregressive Factorization.
- B1 Learned Natural-Language Task Induction.
- A10 Transformer Compute Scaling.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F22 Local Plausibility Drift.
- F24 Error Accumulation.
- F25 Invariant Loss.
- F55 Recovery Failure.

## Not this


Use F26 for drift in plans, processes, or workflows. Use F22 for general textual drift.

# F27. Spurious Decomposition

## Definition


The model decomposes a task into steps that are plausible as a procedure but invalid for the actual problem.

## Canonical statement


> The model may generate a plausible procedure that does not preserve the semantics of the original task.

## Typical expressions


- Breaks a problem into irrelevant subtasks.
- Uses a familiar template incorrectly.
- Applies a standard algorithm where assumptions do not hold.
- Produces a plan that cannot achieve the goal.
- Confuses explanation structure with solution structure.
- Introduces intermediate objectives that are not required or are actively harmful.

## Derived from


- B1 Learned Natural-Language Task Induction.
- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F09 Task Misinduction.
- F24 Error Accumulation.
- F26 Plan Drift.
- F51 Tool-Selection Error.

## Not this


Use F27 when the decomposition is wrong from the start. Use F26 when the plan starts plausibly but drifts during execution.

# F28. Premature Finalization

## Definition


The model finalizes an answer, decision, plan, or action before gathering, using, or checking enough information.

## Canonical statement


> The model may treat a task as complete before the evidence, reasoning, or process is actually sufficient.

## Typical expressions


- Gives a final answer despite missing necessary evidence.
- Stops investigation after the first plausible result.
- Makes a recommendation before checking constraints.
- Declares success before verifying tool results.
- Chooses an escalation, refusal, or action too early.
- Ends a multi-step task without completing required steps.

## Derived from


- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B1 Learned Natural-Language Task Induction.
- B5 Learned Interaction-Style and Persona Priors.
- A10 Transformer Compute Scaling, when budget pressure favors early completion.

## Common neighbors


- F18 Output Boundary / Stopping Error.
- F24 Error Accumulation.
- F26 Plan Drift.
- F54 Action-Readiness Error.

## Not this


Use F28 when the model incorrectly decides that the task is complete. Use F18 when the issue is only output boundary or stopping format.

# F29. Looping/Repetition

## Definition


The model repeats text, reasoning steps, tool calls, or workflow actions without making meaningful progress.

## Canonical statement


> Autoregressive generation and agentic execution can enter repetitive trajectories instead of converging on completion.

## Typical expressions


- Repeats the same sentence or section.
- Re-runs the same tool call without new reason.
- Cycles through equivalent plans.
- Keeps asking for information already provided.
- Repeats a failed recovery attempt.
- Produces redundant analysis instead of resolving the task.

## Derived from


- A7 Autoregressive Factorization.
- A9 Decoding Path Selection.
- B1 Learned Natural-Language Task Induction.
- A6 Stateless Invocation, when repeated calls fail to preserve progress state.

## Common neighbors


- F04 Continuity Loss.
- F23 Generated Path Lock-In.
- F26 Plan Drift.
- F55 Recovery Failure.

## Not this


Do not use F29 for necessary iteration or deliberate retries. Use it when repetition is unproductive, uncontrolled, or not justified by new information.

# F30. Unsupported Assertion

## Definition


The model produces a factual, normative, causal, or evidential claim without sufficient grounding in supplied context, verified tools, or approved sources.

## Canonical statement


> A generated claim may lack evidential support even when it sounds specific, fluent, or confident.

## Typical expressions


- Hallucinated facts.
- Unverified claims.
- Unsupported policy interpretation.
- Unsupported legal, medical, or financial assertion.
- Specific names, dates, figures, or causal explanations invented from pattern.
- Claiming that a source says something without evidence.

## Derived from


- A2 Static Parametric Learned Prior.
- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B6 Generated Self-Assessment and Confidence Language.

## Common neighbors


- F31 Plausibility-Truth Gap.
- F32 Non-Grounded Justification.
- F33 Fabricated Citation/Source.
- F35 Parametric-Prior Override.

## Not this


Use F30 for lack of support. A claim can be true but still unsupported in the current task context. Use F31 when the central issue is falsity.

# F31. Plausibility-Truth Gap

## Definition


The model generates text that is plausible in context but false, inaccurate, or materially misleading.

## Canonical statement


> Plausible generated text is not inherently true.

## Typical expressions


- Fluent false answer.
- Common misconception repeated.
- False premise continued.
- Generic but incorrect explanation.
- Likely-sounding detail invented.
- Incorrect statement that fits the genre of the answer.

## Derived from


- A2 Static Parametric Learned Prior.
- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F23 Generated Path Lock-In.
- F30 Unsupported Assertion.
- F32 Non-Grounded Justification.
- F35 Parametric-Prior Override.

## Not this


Use F31 for false or materially misleading claims. Use F30 when support is missing even if the claim may be true.

# F32. Non-Grounded Justification

## Definition


The model generates an explanation, rationale, proof, or citation-like justification that does not actually support the claim, decision, or action.

## Canonical statement


> Justification text is not the same as justification.

## Typical expressions


- Explanation does not entail the conclusion.
- Post-hoc rationalization.
- Confident "because" statement without actual support.
- Real evidence cited for the wrong proposition.
- Generated proof contains an invalid step.
- Safety, policy, or legal rationale does not match the decision.

## Derived from


- A5 In-Band Control/Data Representation.
- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B6 Generated Self-Assessment and Confidence Language.

## Common neighbors


- F30 Unsupported Assertion.
- F33 Fabricated Citation/Source.
- F34 Evidence-Claim Mismatch.
- F37 Self-Verification Misuse.

## Not this


Use F32 when a justification is present but does not support the output. Use F30 when there is no adequate support at all.

# F33. Fabricated Citation/Source

## Definition


The model invents, corrupts, or misrepresents a citation, source, quote, document, URL, authority, or reference.

## Canonical statement


> Citation-like text can be generated without a real corresponding source.

## Typical expressions


- Nonexistent paper, case, statute, policy, or document.
- Fabricated URL.
- Invented quote.
- Real source title with wrong author, date, or claim.
- Citation to a source that was not retrieved or checked.
- Source identifier, page, section, or line number altered.

## Derived from


- A1 Tokenized Representation, when exact citation strings are corrupted.
- A2 Static Parametric Learned Prior.
- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B6 Generated Self-Assessment and Confidence Language.

## Common neighbors


- F19 Exact-String Corruption.
- F30 Unsupported Assertion.
- F32 Non-Grounded Justification.
- F34 Evidence-Claim Mismatch.

## Not this


Use F33 for fabricated or corrupted source artifacts. Use F34 when the source is real but does not support the claim.

# F34. Evidence-Claim Mismatch

## Definition


The model cites, summarizes, or relies on evidence that is real but does not support the claim, decision, or conclusion being made.

## Canonical statement


> A real source can be used unfaithfully.

## Typical expressions


- Cited document does not contain the claimed fact.
- Evidence supports a weaker claim than the answer states.
- Source applies to a different jurisdiction, product, user, or time period.
- Quote is accurate but interpreted incorrectly.
- Retrieved context is relevant to the topic but not to the conclusion.
- Citation points to a document but not the governing section.

## Derived from


- A4 Attention/Position-Mediated Context Integration.
- A5 In-Band Control/Data Representation.
- A8 Distributional Token Scoring.
- B1 Learned Natural-Language Task Induction.

## Common neighbors


- F02 Context Underutilization.
- F06 Distractor Assimilation.
- F30 Unsupported Assertion.
- F32 Non-Grounded Justification.

## Not this


Do not use F34 when the source itself is fabricated. Use F33. Use F34 when real evidence is misused, overstated, or mismatched.

# F35. Parametric-Prior Override

## Definition


The model's learned background assumptions, common patterns, or stale latent knowledge override supplied evidence or task-specific context.

## Canonical statement


> Familiar learned patterns can dominate over provided evidence when context integration is weak or ambiguous.

## Typical expressions


- Ignores retrieved evidence in favor of common knowledge.
- Applies a common misconception despite correction.
- Assumes a familiar entity, policy, or workflow from partial cues.
- Reverts to generic answer templates when specific facts are supplied.
- Uses stale learned knowledge over current context.
- Blends similar entities because one is more familiar.

## Derived from


- A2 Static Parametric Learned Prior.
- A4 Attention/Position-Mediated Context Integration.
- A8 Distributional Token Scoring.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F03 Context Priority Misweighting.
- F05 Stale-State Reliance.
- F30 Unsupported Assertion.
- F31 Plausibility-Truth Gap.

## Not this


Use F35 when learned prior dominates supplied or task-specific information. Use F01 when the specific information was not supplied at all.

# F36. Misleading Confidence Communication

## Definition


The model's expressed confidence, certainty, hedging, or probability language does not reliably correspond to correctness or evidence quality.

## Canonical statement


> Confidence language is generated behavior, not a calibrated reliability measure.

## Typical expressions


- High-confidence wrong answer.
- Over-hedged correct answer.
- Inconsistent confidence across runs.
- Numeric confidence score not predictive of accuracy.
- Fluent style mistaken for reliability.
- Strong certainty despite weak or absent evidence.

## Derived from


- A8 Distributional Token Scoring.
- A9 Decoding Path Selection.
- B6 Generated Self-Assessment and Confidence Language.
- B5 Learned Interaction-Style and Persona Priors.

## Common neighbors


- F30 Unsupported Assertion.
- F31 Plausibility-Truth Gap.
- F37 Self-Verification Misuse.
- F38 Sycophantic Agreement.

## Not this


Do not use F36 merely because the answer is wrong. Use it when the model's confidence or uncertainty expression is itself misleading.

# F37. Self-Verification Misuse

## Definition


The model's self-checking, self-critique, confidence assessment, or claimed verification is treated as if it were independent evidence or reliable verification.

## Canonical statement


> Self-checking is not verification.

## Typical expressions


- The model fails to catch its own error.
- The model rationalizes an earlier wrong answer.
- "I checked" without actual independent checking.
- Self-critique improves style but not correctness.
- A second answer changes without principled reason.
- The model validates a tool call or citation without external confirmation.

## Derived from


- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B6 Generated Self-Assessment and Confidence Language.
- B5 Learned Interaction-Style and Persona Priors.

## Common neighbors


- F23 Generated Path Lock-In.
- F32 Non-Grounded Justification.
- F36 Misleading Confidence Communication.
- F55 Recovery Failure.

## Not this


Use F37 when generated self-assessment is mistaken for verification. Do not use it for verified external checks, tool-backed validation, or independent evaluators.

# F38. Sycophantic Agreement

## Definition


The model agrees with, validates, or accommodates the user's premise, preference, or belief when correction, resistance, uncertainty, or neutral handling is warranted.

## Canonical statement


> Assistant-like agreement can override truth, safety, or task fidelity.

## Typical expressions


- Accepting a false user premise.
- Changing an answer to match user pressure without evidence.
- Over-validating a user's interpretation.
- Producing flattering or agreeable responses instead of accurate ones.
- Avoiding necessary correction.
- Matching the user's desired conclusion despite contrary context.

## Derived from


- B5 Learned Interaction-Style and Persona Priors.
- B6 Generated Self-Assessment and Confidence Language.
- A2 Static Parametric Learned Prior.
- A8 Distributional Token Scoring.

## Common neighbors


- F31 Plausibility-Truth Gap.
- F36 Misleading Confidence Communication.
- F40 Under-Refusal.
- F41 Clarification Failure.

## Not this


Do not use F38 for appropriate politeness or cooperative tone. Use it when agreement materially degrades correctness, safety, or task performance.

# F39. Over-Refusal

## Definition


The model refuses, deflects, escalates, or withholds assistance when the task is allowed, answerable, or safely addressable.

## Canonical statement


> The model may apply refusal behavior too broadly.

## Typical expressions


- Refuses benign information.
- Declines safe transformation or analysis.
- Escalates unnecessarily.
- Treats low-risk content as prohibited.
- Gives generic safety disclaimers instead of completing the task.
- Asks the user to consult a professional when a scoped answer would be appropriate.

## Derived from


- B5 Learned Interaction-Style and Persona Priors.
- B1 Learned Natural-Language Task Induction.
- B3 Natural-Language Interface Sensitivity.
- A8 Distributional Token Scoring.

## Common neighbors


- F08 Prompt-Surface Fragility.
- F12 Constraint Misclassification.
- F41 Clarification Failure.
- F42 Tone/Persona Inconsistency.

## Not this


Do not use F39 for justified refusal. Use it when the refusal or escalation is materially broader than the intended policy or task boundary.

# F40. Under-Refusal

## Definition


The model complies, advises, assists, or takes steps when it should refuse, warn, limit scope, escalate, or require authorization.

## Canonical statement


> The model may comply when the correct behavior is refusal, limitation, or escalation.

## Typical expressions


- Gives unsafe instructions.
- Provides out-of-scope legal, medical, or financial advice.
- Assists with prohibited or unauthorized action.
- Fails to flag sensitive, risky, or policy-bound content.
- Continues after evidence indicates escalation is required.
- Treats a request as benign because it is phrased indirectly.

## Derived from


- B5 Learned Interaction-Style and Persona Priors.
- B1 Learned Natural-Language Task Induction.
- B3 Natural-Language Interface Sensitivity.
- A5 In-Band Control/Data Representation.
- A8 Distributional Token Scoring.

## Common neighbors


- F16 Prompt-Injection Compliance.
- F38 Sycophantic Agreement.
- F41 Clarification Failure.
- F54 Action-Readiness Error.

## Not this


Do not use F40 for harmless compliance. Use it when the model should have refused, limited, warned, escalated, or sought authorization.

# F41. Clarification Failure

## Definition


The model asks for clarification when it should proceed, or proceeds when it should ask for clarification.

## Canonical statement


> The model may misjudge whether ambiguity requires clarification or can be safely resolved.

## Typical expressions


- Asks unnecessary questions despite enough information.
- Fails to ask when required inputs are missing.
- Makes risky assumptions instead of clarifying.
- Blocks progress with excessive clarification.
- Chooses one interpretation of an ambiguous request without noting uncertainty.
- Requests information already provided in the context.

## Derived from


- B1 Learned Natural-Language Task Induction.
- B5 Learned Interaction-Style and Persona Priors.
- B3 Natural-Language Interface Sensitivity.
- A3 Finite Ordered Context Interface.

## Common neighbors


- F01 Context Omission.
- F04 Continuity Loss.
- F09 Task Misinduction.
- F28 Premature Finalization.

## Not this


Do not use F41 simply because a question was asked. Use it when the clarification behavior is inappropriate for the task state and risk level.

# F42. Tone/Persona Inconsistency

## Definition


The model's style, role behavior, formality, empathy, assertiveness, or persona varies in a way that is inappropriate for the task, user, product, or context.

## Canonical statement


> The model's interaction style can vary independently of task correctness.

## Typical expressions


- Tone shifts unpredictably across similar cases.
- Persona conflicts with product expectations.
- Excessive apology, cheerfulness, detachment, or authority.
- Overly casual style in serious contexts.
- Overly formal style in lightweight contexts.
- Inconsistent refusal or escalation phrasing.

## Derived from


- B5 Learned Interaction-Style and Persona Priors.
- B3 Natural-Language Interface Sensitivity.
- A8 Distributional Token Scoring.
- A9 Decoding Path Selection.

## Common neighbors


- F36 Misleading Confidence Communication.
- F39 Over-Refusal.
- F41 Clarification Failure.
- F43 Verbosity Mismatch.

## Not this


Do not use F42 for harmless stylistic variation. Use it when interaction style materially affects product fit, trust, safety, or task completion.

# F43. Verbosity Mismatch

## Definition


The model provides materially too much or too little detail for the task, user need, risk level, or output contract.

## Canonical statement


> The model may misjudge the appropriate level of detail.

## Typical expressions


- Over-explains a simple answer.
- Gives a terse answer where reasoning, caveats, or evidence are required.
- Adds unnecessary background.
- Omits actionable detail.
- Produces long generic disclaimers.
- Compresses a complex task into an unsafe shortcut.

## Derived from


- B5 Learned Interaction-Style and Persona Priors.
- B1 Learned Natural-Language Task Induction.
- B4 Plural Valid-Output Space.
- A10 Transformer Compute Scaling.

## Common neighbors


- F22 Local Plausibility Drift.
- F28 Premature Finalization.
- F42 Tone/Persona Inconsistency.
- F50 Budget-Induced Degradation.

## Not this


Do not use F43 for any length variation. Use it when the amount of detail harms correctness, usability, safety, or compliance with the task contract.

# F44. Competence Cliff

## Definition


The model's performance drops sharply for a domain, language, format, rare pattern, edge case, or task framing that is outside its stronger learned distribution.

## Canonical statement


> Capability can be uneven across domains, formats, languages, and task framings.

## Typical expressions


- Strong general answers but poor domain-specific performance.
- Failure on rare languages or scripts.
- Weakness on tables, code, forms, or dense legal/technical text.
- Brittle behavior on edge cases.
- High performance on benchmark-like prompts but poor production cases.
- Degradation on rare names, identifiers, or nonstandard formats.

## Derived from


- B7 Distribution-Conditional Competence.
- A2 Static Parametric Learned Prior.
- A1 Tokenized Representation.
- A4 Attention/Position-Mediated Context Integration.

## Common neighbors


- F19 Exact-String Corruption.
- F20 Numeric/Symbolic Fragility.
- F31 Plausibility-Truth Gap.
- F45 Distributional Overgeneralization.

## Not this


Use F44 when the failure is tied to a capability boundary or distributional slice. Do not use it for isolated mistakes in otherwise familiar conditions.

# F45. Distributional Overgeneralization

## Definition


The model applies a familiar pattern, template, assumption, or learned association outside the domain where it is valid.

## Canonical statement


> Familiar patterns can be applied beyond their valid scope.

## Typical expressions


- Uses a common workflow for an uncommon case.
- Applies a standard policy template despite an exception.
- Treats similar entities as interchangeable.
- Assumes a familiar legal, medical, technical, or business pattern in a different setting.
- Classifies a rare case as the nearest common category.
- Converts an edge case into a typical case.

## Derived from


- A2 Static Parametric Learned Prior.
- B7 Distribution-Conditional Competence.
- B1 Learned Natural-Language Task Induction.
- A8 Distributional Token Scoring.

## Common neighbors


- F13 Example Overgeneralization.
- F31 Plausibility-Truth Gap.
- F35 Parametric-Prior Override.
- F44 Competence Cliff.

## Not this


Use F45 for overextension of familiar patterns. Use F35 when the issue is specifically learned prior overriding supplied evidence.

# F46. Behavioral Outcome Variance

## Definition


The same or operationally equivalent scenario produces materially different outputs across repeated runs, prompt variants, model paths, or decoding outcomes.

## Canonical statement


> A realized answer is one path through a distribution, not a unique necessary output.

## Typical expressions


- Different answers across repeated runs.
- Different classifications for equivalent cases.
- Different levels of caution across runs.
- Different tool arguments for the same scenario.
- Different refusal, escalation, or citation behavior.
- One run succeeds while another materially fails.

## Derived from


- A8 Distributional Token Scoring.
- A9 Decoding Path Selection.
- A7 Autoregressive Factorization.
- B4 Plural Valid-Output Space.
- B3 Natural-Language Interface Sensitivity, when variants are involved.

## Common neighbors


- F08 Prompt-Surface Fragility.
- F23 Generated Path Lock-In.
- F36 Misleading Confidence Communication.
- F47 Tail-Risk Generation.

## Not this


Do not use F46 for harmless paraphrase or acceptable variation. Use it when the intended outcome, decision, action, evidence use, or risk behavior changes materially.

# F47. Tail-Risk Generation

## Definition


Rare but severe outputs occur despite ordinary runs appearing acceptable.

## Canonical statement


> Distributional generation can produce rare outputs that are absent from small test samples but still possible in deployment.

## Typical expressions


- Rare unsafe completion.
- Rare invalid tool parameter.
- Rare fabricated citation.
- Rare policy-violating phrasing.
- Rare catastrophic answer despite mostly good behavior.
- Low-frequency but high-impact refusal, escalation, or action error.

## Derived from


- A8 Distributional Token Scoring.
- A9 Decoding Path Selection.
- A7 Autoregressive Factorization.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F16 Prompt-Injection Compliance.
- F33 Fabricated Citation/Source.
- F40 Under-Refusal.
- F46 Behavioral Outcome Variance.

## Not this


Use F47 when the problem is low-frequency but high-severity output. Use F46 for broader material variance across runs.

# F48. Context Truncation Loss

## Definition


Relevant input, state, evidence, instructions, or generated output is lost because of token limits, truncation, or context-window management.

## Canonical statement


> Token limits can remove information needed for correct behavior.

## Typical expressions


- Missing earlier instructions.
- Incomplete document processing.
- Output cut off.
- Lost final steps.
- Summary omits a critical exception because the source was truncated.
- System silently drops context to fit a budget.

## Derived from


- A3 Finite Ordered Context Interface.
- A10 Transformer Compute Scaling.
- A6 Stateless Invocation, when previous state is not reintroduced.

## Common neighbors


- F01 Context Omission.
- F04 Continuity Loss.
- F49 Compression-Induced Distortion.
- F50 Budget-Induced Degradation.

## Not this


Use F48 when information is lost because it was cut, excluded, or could not fit. Use F02 when it was present but underused.

# F49. Compression-Induced Distortion

## Definition


A summary, memory, extracted representation, or compressed context preserves the gist while changing, weakening, omitting, or flattening operationally critical meaning.

## Canonical statement


> Compression can preserve gist while losing details that matter for correct behavior.

## Typical expressions


- Exceptions dropped.
- Qualifications removed.
- Hard constraints softened.
- Source distinctions collapsed.
- Uncertainty erased.
- Summary memory becomes less accurate than original context.
- Multiple user preferences compressed into a misleading single preference.

## Derived from


- A10 Transformer Compute Scaling.
- A3 Finite Ordered Context Interface.
- B1 Learned Natural-Language Task Induction.
- B4 Plural Valid-Output Space.

## Common neighbors


- F04 Continuity Loss.
- F12 Constraint Misclassification.
- F25 Invariant Loss.
- F48 Context Truncation Loss.

## Not this


Use F49 when compressed representation itself distorts meaning. Use F48 when information was simply omitted or cut because of truncation.

# F50. Budget-Induced Degradation

## Definition


The model produces incomplete, shallow, or under-verified behavior because the task exceeds practical context, generation, latency, cost, or compute budget.

## Canonical statement


> Resource limits constrain how much context can be used, how long generation can continue, and how much checking can be done.

## Typical expressions


- Incomplete analysis.
- Missed edge cases.
- Shortcuts in long tasks.
- Partial plan.
- Premature answer.
- Underexplored alternatives.
- Shallow verification language.
- Avoiding useful retrieval, tool calls, or cross-checks because of cost or latency pressure.

## Derived from


- A10 Transformer Compute Scaling.
- A7 Autoregressive Factorization.
- A9 Decoding Path Selection.
- B5 Learned Interaction-Style and Persona Priors, when the model prioritizes completion over explicit budget limits.

## Common neighbors


- F28 Premature Finalization.
- F43 Verbosity Mismatch.
- F48 Context Truncation Loss.
- F55 Recovery Failure.

## Not this


Use F50 when budget pressure causes incomplete behavior. Use F28 when the issue is mainly premature decision that no further work is needed.

# F51. Tool-Selection Error

## Definition


The model chooses the wrong tool, fails to choose a needed tool, or uses a tool when no tool should be used.

## Canonical statement


> Tool use depends on induced task interpretation and generated action selection, not native certainty about the correct procedure.

## Typical expressions


- Searches when calculation was needed.
- Calculates when source retrieval was needed.
- Uses a write/action tool instead of a read-only tool.
- Fails to call a tool required for current information.
- Calls a tool for a task that should be answered directly.
- Chooses a broad tool when a specific tool is available.

## Derived from


- B1 Learned Natural-Language Task Induction.
- A8 Distributional Token Scoring.
- A9 Decoding Path Selection.
- A5 In-Band Control/Data Representation.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F09 Task Misinduction.
- F27 Spurious Decomposition.
- F52 Tool-Argument Error.
- F54 Action-Readiness Error.

## Not this


Use F51 for tool choice. Use F52 when the tool choice was correct but the arguments were wrong.

# F52. Tool-Argument Error

## Definition


The model calls the right tool with wrong, incomplete, malformed, unsafe, or semantically invalid arguments.

## Canonical statement


> A correct tool choice can still fail because generated arguments do not match the task state or tool contract.

## Typical expressions


- Wrong recipient, ID, date, location, query, or filter.
- Missing required argument.
- Argument parses but refers to the wrong object.
- Overbroad search query.
- Unsafe action parameter.
- Schema-valid but semantically incorrect tool call.
- Tool call uses stale or hallucinated state.

## Derived from


- A1 Tokenized Representation, especially for exact IDs and strings.
- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- A9 Decoding Path Selection.
- B1 Learned Natural-Language Task Induction.

## Common neighbors


- F19 Exact-String Corruption.
- F21 Structured-Data Semantic Error.
- F51 Tool-Selection Error.
- F54 Action-Readiness Error.

## Not this


Use F52 when the tool was appropriate but the arguments were faulty. Use F51 when the wrong tool was chosen.

# F53. Tool-Output Misinterpretation

## Definition


The model misreads, overgeneralizes from, ignores, or incorrectly integrates a tool result.

## Canonical statement


> Tool output still enters model behavior through interpretation and context integration.

## Typical expressions


- Misreads a search result, database row, API response, or error message.
- Treats partial tool output as complete.
- Ignores a tool warning or failure.
- Assumes a successful action when the tool returned an error.
- Overstates what retrieved results prove.
- Treats tool output prose as instruction.

## Derived from


- A4 Attention/Position-Mediated Context Integration.
- A5 In-Band Control/Data Representation.
- B1 Learned Natural-Language Task Induction.
- B7 Distribution-Conditional Competence.

## Common neighbors


- F02 Context Underutilization.
- F15 Control/Data Confusion.
- F34 Evidence-Claim Mismatch.
- F55 Recovery Failure.

## Not this


Use F53 when the tool result exists but is misinterpreted. Use F51 or F52 for incorrect tool call generation before the result exists.

# F54. Action-Readiness Error

## Definition


The model takes, recommends, prepares, or authorizes an action without sufficient evidence, consent, state validation, safety check, or task completion basis.

## Canonical statement


> A generated action can appear procedurally valid while being unjustified, unsafe, premature, or unauthorized.

## Typical expressions


- Sends or prepares communication before confirmation.
- Updates records based on weak evidence.
- Recommends irreversible action without checking prerequisites.
- Executes a workflow despite missing authorization.
- Makes a decision before tool results are verified.
- Treats a plausible plan as ready for execution.

## Derived from


- B1 Learned Natural-Language Task Induction.
- B5 Learned Interaction-Style and Persona Priors.
- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- A9 Decoding Path Selection.

## Common neighbors


- F16 Prompt-Injection Compliance.
- F28 Premature Finalization.
- F40 Under-Refusal.
- F51 Tool-Selection Error.
- F52 Tool-Argument Error.

## Not this


Use F54 when action readiness or authorization is wrong. Use F30 or F31 for answer-only epistemic failures without action implications.

# F55. Recovery Failure

## Definition


The model fails to recover appropriately after an error, missing input, failed tool call, contradiction, unsafe state, or detected uncertainty.

## Canonical statement


> Error detection does not guarantee graceful recovery.

## Typical expressions


- Continues after a tool error as if successful.
- Repeats the same failed action.
- Gives up when a fallback exists.
- Fails to ask for missing information after detecting absence.
- Does not revise after contradiction appears.
- Escalates incorrectly or not at all.
- Produces apology text without corrective action.

## Derived from


- A7 Autoregressive Factorization.
- A8 Distributional Token Scoring.
- B1 Learned Natural-Language Task Induction.
- B5 Learned Interaction-Style and Persona Priors.
- A6 Stateless Invocation, when recovery state is not preserved.

## Common neighbors


- F29 Looping/Repetition.
- F37 Self-Verification Misuse.
- F50 Budget-Induced Degradation.
- F53 Tool-Output Misinterpretation.

## Not this


Use F55 when the failure concerns response after a problem is encountered or detectable. Use the underlying fault mode when the initial problem itself is the main issue.
