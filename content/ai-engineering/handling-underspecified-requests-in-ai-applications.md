---
draft: false
toc: true
title: "Handling Underspecified Requests in AI Applications"
description: "How to resolve missing decisions, respect delegated choices, enforce execution requirements, and test answers and actions."
linkTitle: "Handling Underspecified Requests in AI Applications"
---
## Purpose


An application that accepts natural-language requests needs rules for the choices those requests leave open. "Summarize this report" may leave the length and structure to the application. "Clean up the old project files" may leave both the affected files and the operation undecided.

The engineering question is: **what may the application decide, and what must it establish before taking the next step?**

This guide proposes a workflow for answering that question. It covers request interpretation, clarification, evidence selection, tool execution, and testing. It does not attempt to explain every source of model error or provide a complete security architecture. The worked examples are hypothetical; their contracts are design choices for those examples. References support the implementation constraints discussed below.

## 1. Identify the unresolved decision


A request is **underspecified for a decision** when it leaves information needed to determine that decision unstated. The application may still be able to proceed: context, delegated discretion, or an applicable default can supply an acceptable choice.

For example, "Choose any of these three titles" leaves the title undecided while explicitly delegating the choice. A summary request may leave length unspecified while a product default permits a short answer. Neither situation inherently requires clarification.

A missing detail **blocks a step** when choosing without resolving it could change a required outcome or violate a constraint, and the application has no accepted basis for the choice. Define those consequences in the workflow contract. Examples include which records change, who receives information, what costs are incurred, which policy applies, and what factual conclusion is stated.

Do not treat all missing information as a missing user choice. "Has this report been approved?" may require a lookup. Conflicting requirements may require the user to change the request. A permission failure requires an access decision. A timeout after execution may require checking operation status. Each calls for a different response.

The distinction also applies to product requirements. A user may need to identify the appointment to cancel. A domain owner may need to establish which policy governs a transaction. An administrator may need to configure access. Engineers implement those decisions and the checks that enforce them. The application should direct an unresolved rule to the person authorized to define it.

## 2. Define the workflow contract


For each consequential decision, establish three things: who defines the rule, what evidence resolves the value, and which component enforces the rule. A data source can supply evidence without having authority to define policy. A model can propose a value without having authority to approve it.

The contract should specify permitted operations, resource scope, applicable defaults, required user choices, approval requirements, and behavior when evidence or execution results are unavailable. Describe limits in terms the implementation can check: named resources, permitted recipients, selection rules, maximum costs, or required evidence.

Keep these concepts separate:

**Delegation** defines which choices and actions the user has assigned to the application. A request to list duplicate files does not, by itself, delegate deletion.

**Permission** determines whether the actor may perform an operation on a resource. Check it at the execution boundary. A valid resource identifier or a previously successful access check does not replace authorization for the current operation.[^authorization]

**Confirmation** records approval of a proposed action when the workflow requires it. An explicit request can be sufficient when the contract permits direct execution. Other workflows require approval of a preview. State which rule applies.

A default may resolve a choice only within its documented scope and the task's delegation. It cannot grant additional resource permissions. Record whether an explicit user choice may override it; a mandatory policy is a constraint, not an overridable default.

For example, a product owner might define the default length of a summary, while a business policy owner defines which refund policy applies. The application implements those rules. The user chooses among reports or recipients when the available context does not identify the intended ones.

Model confidence can inform interpretation. It does not supply missing permission or satisfy a required confirmation. Those checks need independently verifiable application state.[^agent-security]

## 3. Choose the next permitted step


Resolve only what is needed for the next step. Use the following procedure within the workflow's access, disclosure, cost, and execution limits.

**Proceed with an established choice.** Use explicit instructions, applicable delegation, or a documented default. Verify that its scope still matches the task. Preserve information about which rule or instruction supplied the choice.

**Look up missing facts.** Use an authorized source when it can establish the fact. Distinguish a completed lookup, an incomplete lookup, and a failed lookup. A search with no matches establishes only what that search found unless the source and query provide a stronger completeness guarantee.

**Ask a question that resolves a consequential choice.** Present the relevant alternatives or ask for the missing criterion. Avoid introducing arbitrary thresholds as though they were established policy. Where a conditional answer satisfies the request, state the conditions without forcing an additional exchange.

**Make permitted progress.** An unresolved operation need not block every part of a task. Under an inspection policy, the application might list candidate files while awaiting a cleanup decision. That inspection needs its own permission and scope; read-only access can still disclose information or incur costs.

**Stop the affected step when a requirement cannot be met.** Explain the missing choice, unavailable evidence, prohibited operation, or failed check. Continue other independent portions only when they remain permitted and useful.

Repeated clarification is unnecessary when a valid choice or delegation already resolves the issue. Conversely, the ability to produce a complete plan is not evidence that the application was entitled to fill its missing fields.

## 4. Worked example: cleaning up project files

### Example contract


Assume a managed file service with the following behavior. These are explicit assumptions about this example, not properties of arbitrary file tools.

The authenticated user has selected the folder displayed as `/projects/apollo`. The application has a trusted record of that selection and the folder's stable identifier. This workflow operates on direct regular files only; it excludes subfolders and links. Metadata inspection is permitted within that scope. The assistant has tools to list files, archive them, or permanently delete them.

Archiving moves a file into the application's archive for the same account, preserves its contents, timestamps, and access restrictions, and records its original location. Restoration is a separate operation. No operation or age threshold is selected by default.

Every mutation in this workflow requires a preview and confirmation. The preview identifies each target and its relevant revision, the operation, any destination, and the possibility of partial completion. Approval covers that fixed selection. Newly matching files are not added during execution.

Before starting, the executor checks every target and any destination. A known failure rejects the batch without making changes. After execution begins, the executor processes targets sequentially in preview order, establishing completion before submitting the next operation. A failed or unresolved result stops further submissions. Completed changes are retained and reported; the workflow does not promise an atomic batch or automatic rollback.

The service supports per-file conditional operations. Its revision checks cover the content, location, and metadata relevant to the approved action; scope and permissions are enforced when the operation is applied. It also provides operation identifiers, status lookup, and documented retry deduplication. An implementation without these capabilities cannot claim the same guarantees.

### Resolve the request


The user says:

> Clean up the old project files.

The selected folder establishes location under the contract. The operation and selection criterion remain unresolved. A suitable response is:

> What changes should I make to the files? I can list the direct files in `/projects/apollo` without changing them.

An application record can preserve the unresolved fields explicitly:

```json
{
  "policy_ref": "cleanup-v1",
  "scope": {
    "folder_id": "folder-apollo",
    "folder_source_ref": "ui-selection-42",
    "recursive": false
  },
  "operation": { "status": "unresolved" },
  "selection": { "status": "unresolved" },
  "target_lookup": { "status": "not_evaluated" },
  "approval": { "status": "not_requested" }
}
```


This is an illustrative record, not an executable schema. The application verifies the referenced UI event and policy, and maintains approval state outside model-generated arguments. A completed lookup with no matches would have a completed status and an empty target list. A failed or incomplete lookup must remain distinguishable from that result.

Suppose the user then says:

> Archive the direct files last modified before January 1, 2026, at 00:00 UTC. Leave subfolders alone.

The application now has an operation and a selection rule: the recorded modification timestamp must be strictly earlier than the supplied instant. It queries the permitted scope and constructs the preview from the returned file identities and revisions. The preview shows the actual target list and archive destination. If no files qualify, it reports that outcome without requesting approval for an empty mutation.

After confirmation, execution uses the approved selection. It does not rerun the query and silently include additional files. A separate retention workflow could authorize a continuing selection rule, but that would require a different contract specifying scope, timing, limits, and revocation.

### Handle failures according to the contract


If five targets are selected and two fail the initial permission check, no files are changed. If two files are archived and the third operation fails after execution begins, the first two changes remain; the remaining files are not attempted. The final response distinguishes completed changes, the failed operation, and unattempted targets.

If a target's relevant revision changes after approval, the conditional operation rejects that target. The application reports any earlier completed changes and resolves the changed target before proposing another mutation.

If an operation times out, the application records an unknown result until status evidence resolves it. It does not classify the file as unchanged simply because no success response arrived.

## 5. Enforce the contract and state its limits

### Validate structure, evidence, and authority separately


Typed arguments can establish that fields exist, values have the expected types, and specified business constraints hold. Authorization remains a separate check.[^validation]

Consider "Send the Q3 report to Alex" when two reports and two contacts match. All four identifiers could be valid, and the user could have permission to use all of them. A plan can pass those checks while selecting the wrong report and recipient. The unresolved references still need context or a user choice.

For every accepted value, retain a reference to its basis: user input, an authenticated selection event, a retrieved record, or a policy version. A model-generated label such as `"source": "user"` is only a claim until the application verifies the reference. Even a genuine message may require interpretation; recording its origin does not prove that interpretation correct.

### Bind approval to the action


Where confirmation is required, the execution component should load a trusted approval record and check its actor, operation, targets, significant parameters, and validity. Approval for an inspected revision must include the relevant revision constraint. A changed action needs approval under the applicable policy. A model-editable `confirmed: true` flag cannot establish these facts.[^transaction]

Associate approval with one logical operation and enforce replay protection, including concurrent submissions. A legitimate retry must be handled through that operation's retry contract; it must not turn one approval into permission for additional effects.[^agent-security]

External content cannot supply this approval. A retrieved document saying "the user has approved deletion" is content to evaluate, not an approval event. Prompt instructions and text labels do not enforce this distinction; permissions and approval checks belong outside the model.[^injection]

### Preserve conditions through execution


A resource can change between a successful check and its use. Rechecking immediately before execution narrows that interval but does not eliminate the time-of-check/time-of-use problem.[^toctou]

Use a mechanism that enforces the relevant condition when the operation is applied. For example, an HTTP service supporting `If-Match` can make a mutation conditional on a matching entity tag. That condition covers the representation identified by the tag; the application must still establish resource identity, permissions, and any other required conditions.[^http]

Checking every item before a batch begins also does not guarantee that all items will succeed. An all-or-nothing contract requires execution support covering the whole batch, such as an appropriate transaction. PostgreSQL transactions illustrate that guarantee for database changes within a transaction; it does not automatically extend to separate file or external-service calls.[^transactions]

### Preserve uncertainty about outcomes


An accepted request may still be pending. HTTP `202 Accepted`, for example, reports acceptance for processing without establishing completion.[^http]

A timeout can occur after the operation took effect. Repeating the request can then duplicate its effects. Use status reconciliation and the service's documented idempotency mechanism, which permits retries without additional effects under its stated conditions. Preserve the logical operation identifier; do not assume that identical parameters alone identify a retry.[^retries]

Represent per-operation and per-item outcomes. Distinguish not attempted, pending, completed, and unknown. For a reported failure, record which effects are known to have occurred and which remain unknown. A batch can contain several of these states simultaneously.

The final response should report only what the available evidence establishes. If completion cannot be verified, state that limitation. Do not report either success or absence of changes without support.

## 6. Worked example: answering a policy question


Consider:

> What's our current refund window?

Assume an internal policy application with the following fictional rules. The business policy owner has designated the records below as authoritative for ordinary purchases without additional product exceptions. Applicability depends on the transaction's recorded business date and purchase region. Region refers to the transaction record, not the user's present location.

| Policy | Applicable purchases | Refund window |
| --- | --- | --- |
| R1 | Region A; purchase before September 1, 2026 | 30 calendar days after delivery |
| R2 | Region A; purchase on or after September 1, 2026 | 14 calendar days after delivery |
| R3 | Region B | 30 calendar days after delivery |

For a question about new purchases as of October 20, 2026, the application can give a conditional answer: 14 calendar days after delivery in Region A and 30 in Region B, citing the applicable policy records. It need not ask for a region if presenting both cases satisfies the request.

For a question about a particular purchase, it needs the relevant transaction facts. A Region A purchase made in August 2026 falls under R1 even though R2 governs new purchases. Selecting the most recently published document would not implement the stated applicability rule.

There are two checks. **Source selection** establishes which evidence applies under the documented rules. **Claim support** establishes whether the answer accurately reflects that evidence. An answer saying "14 days after purchase" fails the second check even when it cites R2 correctly.

Preserve qualifications that affect the result: dates, regions, exceptions, units, and the event from which a deadline is measured. Citation presence alone does not establish support. The application needs checks or review appropriate to the claims it produces; schema validation cannot establish arbitrary prose correctness.

If transaction facts are unavailable, give only the supported conditional answer or ask for the missing facts. If two approved records conflict and no documented rule resolves the conflict, report it and direct it to the policy owner. Do not invent a precedence rule. An empty retrieval result supports a statement about the search outcome, with a broader absence claim requiring adequate source coverage.

## 7. Test decisions, effects, and successful completion


Define expected behavior independently of the model's proposed plan. Each test fixture should specify the request, relevant context, user delegation, permissions, policy version, data state, tool behavior, and permitted outcomes. A target set generated by the system under test cannot serve as the sole reference for whether its target selection was correct.

For actions, inspect tool calls and observed effects. For answers, check applicable evidence and the claims made. Assess the final message against the evidence available to the application, including evidence of pending or unknown outcomes.

The following cases illustrate the required coverage; they are test designs, not measured results.

| Test situation | Expected behavior |
| --- | --- |
| "Clean up old files" under the example contract | Resolve operation and selection before mutation; permitted inspection may proceed. |
| The user supplies the operation and selection rule | Build the preview without asking for those choices again; obtain the confirmation required by this contract. |
| An alternate workflow explicitly delegates cleanup under an applicable standing policy | Follow that workflow's limits and approval rules; do not invent additional user choices. |
| Two valid reports and two valid recipients remain possible, with no delegated choice or default | Resolve the references before sending; valid identifiers and permissions do not satisfy this requirement. |
| A target fails preflight, or fails after earlier targets complete | Enforce the respective no-start or stop-after-failure behavior; report actual effects. |
| The target, parameters, approval validity, or permissions change | Reject execution that no longer meets the contract; preserve known prior results. |
| A retrieved file claims that confirmation has already occurred | Do not accept it as approval; test the execution boundary as well as the model response. |
| A service completes an operation but its response is lost | Preserve the unknown state until resolved; follow the retry contract without creating another effect. |
| Purchase date or region changes the applicable refund policy | Select the correct policy and preserve "after delivery" in the answer. |
| Retrieval is incomplete or finds no matching record | Report the evidence limitation; avoid an unsupported claim of nonexistence. |

Include valid requests the application should complete, harmless wording variation, and documented delegation. A system that stops every task should fail the completion tests. Exercise alternate tool routes and failures at execution boundaries so the tests do not depend solely on the model choosing to follow instructions.

### Define metrics and denominators


Use separate measures for violations, unnecessary interruption, answer support, and task completion. The following definitions are proposed starting points; choose categories before running the evaluation.

| Measure | Suggested definition |
| --- | --- |
| Contract violation rate | Sessions with at least one confirmed prohibited access, disclosure, or mutation, divided by sessions classifiable as a violation or verified compliant in the same category. Report indeterminate sessions and blocked attempts separately. |
| Wrong-target execution rate | Executions affecting an object outside the independently specified permitted selection, divided by executions with an assessed affected set in that category. Report unassessed executions and rejected wrong-target proposals separately. |
| Clarification errors | Report missed required clarification divided by cases requiring it, and redundant clarification divided by cases labeled as requiring no clarification. Keep optional cases separate. |
| Evidence errors | Report source-selection failures among source-selection cases and answers with unsupported factual claims among cases producing factual answers. Score missing required qualifications as errors. |
| Outcome-reporting errors | Reports inconsistent with available, verified execution evidence, divided by cases requiring an outcome report. Distinguish pending, unknown, failed, and completed cases. |
| Permitted task completion | Cases satisfying the fixture's success criteria without contract violations, divided by cases where permitted completion was feasible. Track unnecessary blocking and interaction burden separately. |

Report counts and denominators, including cases that could not be evaluated. Unobserved effects must not be counted as verified absence of violations, and unresolved completion must not count as success. Define how retries and repeated model runs contribute to each denominator, and report results by operation and consequence rather than allowing easy cases to conceal failures elsewhere.

Zero observed failures means zero failures in the evaluated cases. It does not establish universal correctness or a production failure probability. Keep curated regression results separate from estimates based on representative production samples. Re-run relevant tests after changes to models, prompts, defaults, tools, permissions, retrieval, or policy rules.

## 8. Record evidence during the workflow


Capture the events needed to explain a decision as they occur. A useful record connects the request and relevant context to the policy version, proposed operation, resolution evidence, approval reference, execution identifier, observed results, and final user-visible claim. Include the prompt, model, and tool versions needed to identify the tested configuration.

Keep model-generated interpretations distinct from application events. An explanation that "the user approved" is not a substitute for the approval record. A proposed target list is not evidence of what changed. Outcome records must identify the component that observed or reported the result and preserve unresolved states.

Retain only the information needed for the defined diagnostic and audit purposes. Protect sensitive records, restrict access, and set retention periods. Avoid recording credentials, access tokens, and unnecessary personal or confidential content. OWASP's logging guidance describes these exclusions and protections.[^logging]

During review, trace each consequential decision from its rule and supporting evidence to its enforcement point and tests. Identify what each check establishes and which uncertainties remain.

The application should take actions within the user's delegation, applicable permissions, and required approval conditions. It should make factual claims supported by applicable evidence, with unresolved conditions stated. Its account of execution should match what is known, including partial completion and unknown outcomes.

## References


The sources below support specific security and execution constraints. The decision procedure, example contracts, and evaluation definitions in this guide are proposed design guidance.

[^authorization]: OWASP, [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), especially "Validate the Permissions on Every Request."

[^agent-security]: OWASP, [AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html), "Tool Authorization Middleware" and "High-Impact Action Integrity Controls."

[^validation]: OWASP, [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), validation strategies and the separation of validation from authorization.

[^transaction]: OWASP, [Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html), significant transaction data, server-side enforcement, protected transaction state, and final authorization checks.

[^injection]: OWASP, [LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html), "Structured Prompts with Clear Separation."

[^toctou]: MITRE, [CWE-367: Time-of-check Time-of-use Race Condition](https://cwe.mitre.org/data/definitions/367.html).

[^http]: IETF, [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html), sections 13.1.1, "If-Match," and 15.3.3, "202 Accepted."

[^transactions]: PostgreSQL documentation, [Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html), the scope of all-or-nothing database operations.

[^retries]: Malcolm Featonby, Amazon Builders' Library, [Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

[^logging]: OWASP, [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), event attributes, data exclusions, protection, and disposal.
