---
draft: false
toc: true
title: "Designing Evaluation Coverage and Cases"
linkTitle: "Evaluation Coverage"
---
## 1. Purpose


Evaluation coverage design identifies which product behaviours and situations must be represented to answer a defined evaluation question.

It turns:

- a decision or knowledge need;
- relevant product expectations;
- known risks and uncertainty; and
- observed user behaviour

into a reviewed set of evaluation cases or a production-sample definition capable of producing the required evidence.

The central question is:

> **What behaviours and situations must we observe for this evaluation question to be answerable?**

Coverage design operates inside the Quality Understanding Loop of the [AI Product Improvement System]({{< ref "ai-engineering/evaluation/v2/product-improvement-system" >}}). It provides the cases and sample definitions used by the evaluation workflow described in [AI Evaluation as an Iterative Engineering Practice]({{< ref "ai-engineering/evaluation/v2/ai-evaluation" >}}).

Coverage design does not determine whether the system passes or fails. It determines what should be exercised and observed. Criteria, evaluators, judgements, measurements, and findings belong to later evaluation work.

The recurring relationship is:

```text
Decision or knowledge need
        ↓
Governing evaluation question
        ↓
Relevant product expectations
        ↓
Coverage requirements
        ↓
Evaluation cases or production-sample definition
        ↓
Execution and traces
        ↓
Failure understanding and evaluation findings
        ↓
Revised coverage
        ↺
```

## 2. Why coverage must be designed


A convenient input set is rarely sufficient evidence about an AI product.

A collection may over-represent one common workflow, contain many near-duplicates, omit consequential boundaries, or fail to exercise the conditions under which product behaviour changes. A large dataset can still provide weak coverage.

Coverage should therefore be designed from the evaluation question and product expectations.

For example, these two Wallet cases use the same user input:

```text
"Paid $24 with Visa yesterday"
```


In the first case, Wallet contains one active account named `Visa`. In the second, it contains two.

The language is identical, but the situation is different:

```text
Case 1:
    one matching account
    → the account reference is determinate

Case 2:
    two matching accounts
    → the account reference is ambiguous
```


The user input is therefore one part of the case. Coverage must also represent the minimal situation required to exercise the intended behaviour.

## 3. Core concepts

### 3.1 Coverage requirement


A **coverage requirement** states a behaviour or situation that the evaluation must represent for its governing question to be answerable.

Examples:

- common determinate expense requests;
- expense requests with a missing material field;
- ambiguous account references;
- unsupported transaction types;
- retries after a completed confirmation;
- a known regression involving relative dates.

A coverage requirement explains why one or more cases are needed. It does not prescribe a particular user message or exact system response.

### 3.2 Evaluation input


An **evaluation input** is the user message or interaction supplied to the product.

It may be:

- a single message;
- a sequence of messages;
- a real input;
- a manually written input;
- a generated input; or
- an input preserved from a known failure or regression.

An input is not a complete evaluation case when the behaviour depends on a particular situation or starting state.

### 3.3 Fixture


A **fixture** is the minimum prepared state needed to make the case exercise its intended situation.

Examples:

- one Wallet account named `Visa`;
- two active accounts named `Visa`;
- a current date used to resolve `yesterday`;
- an existing transaction used to test a duplicate confirmation.

A fixture should contain only what the case requires. Shared system configuration belongs to the evaluation plan or execution record rather than being repeated in every case.

### 3.4 Expected condition


An **expected condition** states the relevant situation that the case is intended to activate.

Examples:

```text
The account reference is determinate.
```

```text
The account reference is ambiguous.
```

```text
The transaction request is missing its source account.
```

```text
The confirmation is a duplicate of an already completed action.
```


The expected condition confirms what the case represents. It does not define a complete ideal response, evaluation criterion, or verdict.

### 3.5 Evaluation case


An **evaluation case** is the minimum executable unit used to exercise one or more coverage requirements.

Its logical content is:

```text
Evaluation case
    =
input
+ optional fixture
+ expected condition
```


Example:

```yaml
id: wallet-expense-ambiguous-account-001

input: "Paid $24 with Visa yesterday"

fixture:
  active_accounts:
    - id: visa-personal
      name: Visa
    - id: visa-shared
      name: Visa
  current_date: 2026-08-27

expected_condition:
  account_reference: ambiguous
```


The stable identifier is management metadata. Source, tags, coverage links, and provenance may also be stored as metadata, but they do not change the logical definition of the case.

Evaluation criteria remain separate. For example, a criterion may later state that a material ambiguous account reference must remain unresolved.

### 3.6 Evaluation set


An **evaluation set** is a reviewed collection of cases assembled for a declared purpose.

Examples include:

- a diagnostic set;
- a challenge set;
- a comparison set;
- a regression set; or
- a release-evaluation set.

The set's purpose determines what claims its results can support.

### 3.7 Production sample


A **production sample** defines which live executions will be selected for evaluation.

It should state:

- the population in scope;
- the selection method;
- the time window; and
- any relevant cohorts.

A curated case set and a production sample serve different purposes. A deliberately difficult challenge set does not estimate production quality. A production sample supports population claims only when its selection method justifies them.

## 4. Start from the evaluation question


Coverage design begins after the decision need and governing evaluation question have been stated.

Example:

> **Decision:** Is the current Wallet interpreter reliable enough to integrate into the one-shot capture prototype?

> **Governing question:** For common expense descriptions under the declared Wallet scope, does the interpreter create the intended draft when the request is determinate and expose material missing or ambiguous information?

This question tells us which behaviours must be represented.

A materially different question needs different coverage.

For example:

- Can users notice and correct an incorrect draft?
- Does one-shot capture reduce task effort?
- Does reduced effort improve capture consistency?
- Does the runtime meet the production latency target?

These are not interpreter-behaviour questions. They require usability, product-value, or technical evidence and should not be forced into the same evaluation set.

## 5. Derive coverage requirements


Use the governing question and relevant product expectations to identify what the evaluation must represent.

Useful sources include:

- the provisional solution definition during Discovery;
- the Production Slice Contract during Delivery;
- supported jobs and workflows;
- product guarantees and invariants;
- unsupported situations;
- critical failures;
- known regressions;
- observed user inputs;
- production incidents;
- earlier evaluation findings; and
- current uncertainty about product behaviour.

For an initial Wallet interpreter evaluation, coverage requirements might include:

```text
CR-1  Common determinate expenses
CR-2  Missing material information
CR-3  Ambiguous account references
CR-4  Relative date expressions
CR-5  Unsupported transaction requests
CR-6  Previously observed regressions
```


Coverage requirements should remain few enough to review and specific enough to guide case selection.

Do not include a condition merely because it can vary. Include it when it can materially affect the behaviour relevant to the governing question.

## 6. Use dimensions as planning aids


A **dimension** is a useful axis of variation in the behaviour or situation being evaluated.

For Wallet, possible dimensions include:

```text
Transaction type
    expense
    income
    transfer

Input completeness
    complete
    missing material information

Account reference
    determinate
    ambiguous
    unknown

Date expression
    explicit
    relative
    absent
```


Dimensions help the team inspect the coverage space. They are planning aids rather than required evaluation artefacts.

Choose dimensions that:

- relate directly to the governing question;
- represent a meaningful behavioural difference;
- expose a known or plausible failure boundary; or
- help distinguish baseline behaviour from difficult conditions.

Avoid dimensions that add description without changing the expected behaviour.

A dimension value may come from the user input or the fixture. For example, account-reference ambiguity is partly established by the Wallet state.

## 7. Select combinations deliberately


A selected combination of dimension values can be used to plan a case.

Example:

```text
Transaction type: expense
Input completeness: complete
Account reference: ambiguous
Date expression: relative
```


The combination is useful because it describes the intended situation before a concrete input and fixture are created.

Do not generate every possible combination. Most Cartesian combinations are irrelevant, unrealistic, or redundant.

Select combinations that cover:

- straightforward baseline behaviour;
- important product boundaries;
- known and plausible failure conditions;
- consequential cases;
- meaningful interactions between conditions; and
- gaps in the existing set.

A combination is an intermediate design aid. The durable executable object is the evaluation case.

## 8. Source and construct inputs


Evaluation cases may use real, manually written, or generated inputs.

### 8.1 Real inputs


Real inputs preserve naturally occurring:

- goals;
- phrasing;
- shorthand;
- omissions;
- mistakes;
- assumptions; and
- interaction patterns.

When suitable real inputs exist:

1. review them against the coverage requirements;
2. classify them using the selected dimensions when useful;
3. choose examples that add meaningful coverage;
4. remove duplicates and near-duplicates; and
5. preserve their source and any required privacy treatment.

Production frequency can inform case allocation, but it does not define the full evaluation scope. Rare and consequential situations may need deliberate coverage.

### 8.2 Manually written inputs


Manually written cases are useful when:

- the required situation is clear;
- no suitable real input exists;
- exact control over the scenario is useful; or
- the case protects a known product guarantee or regression.

The input should read like something a real user might submit. It should not reveal evaluation terminology or tell the system which behaviour is expected.

### 8.3 Generated inputs


Generated inputs can fill declared gaps.

Generation should start from an approved coverage requirement or selected combination. The generation prompt should describe:

- the product briefly;
- the intended user situation;
- the aspects that must remain clear, incomplete, ambiguous, or difficult; and
- any language constraints.

Generate user inputs only. Do not generate the expected system answer in the same step.

A simple prompt is:

```text
We are creating evaluation inputs for [product].

User situation:
[brief description]

Required characteristics:
- [coverage condition]
- [coverage condition]

Write [number] realistic user messages.

Requirements:
- Write only the user message.
- Do not mention testing or evaluation.
- Preserve the intended ambiguity, omission, or difficulty.
- Vary the language naturally.
- Do not describe the expected system response.
```


Generated inputs require human review. Remove examples that are unrealistic, repetitive, inconsistent with the intended condition, or too explicit about the hidden scenario.

## 9. Assemble minimal evaluation cases


Real and constructed inputs become cases when they are combined with any required fixture and expected condition.

```text
Real input
    + optional fixture
    + expected condition
        ↓
Evaluation case
```

```text
Coverage gap
    → selected combination
    → manual or generated input
    + optional fixture
    + expected condition
        ↓
Evaluation case
```

### 9.1 Example: determinate reference

```yaml
id: wallet-expense-determinate-account-001

input: "Paid $24 with Visa yesterday"

fixture:
  active_accounts:
    - id: visa-personal
      name: Visa
  current_date: 2026-08-27

expected_condition:
  account_reference: determinate
```

### 9.2 Example: ambiguous reference

```yaml
id: wallet-expense-ambiguous-account-001

input: "Paid $24 with Visa yesterday"

fixture:
  active_accounts:
    - id: visa-personal
      name: Visa
    - id: visa-shared
      name: Visa
  current_date: 2026-08-27

expected_condition:
  account_reference: ambiguous
```

### 9.3 Example: missing information

```yaml
id: wallet-expense-missing-account-001

input: "Paid $24 for lunch yesterday"

fixture:
  active_accounts:
    - id: cash
      name: Cash
    - id: visa-personal
      name: Visa
  current_date: 2026-08-27

expected_condition:
  source_account: missing
```


The case does not contain the complete judgement rule. Product criteria and evaluators determine later whether the observed behaviour is acceptable.

## 10. Review the starting evaluation set


Review the set as a whole before execution.

The governing question is:

> **Does this set provide the evidence needed to answer the evaluation question within its declared scope?**

Check that:

- every material coverage requirement is represented;
- the main workflow has straightforward baseline cases;
- important boundaries and known failures are represented;
- cases vary meaningfully rather than through superficial paraphrasing;
- real and constructed inputs are realistic;
- fixtures activate the intended condition;
- expected conditions are clear;
- duplicate and near-duplicate cases have been removed;
- no condition dominates without a reason;
- the purpose and claim limits of the set are explicit; and
- known exclusions and coverage gaps are recorded.

There is no universal target number of cases.

Begin with the smallest set that exercises every material coverage requirement and can be reviewed carefully. Expand it when execution, failure understanding, production evidence, or a new decision exposes a coverage gap.

## 11. Prepare the set for execution


Coverage design ends when the cases or sample definition are approved for execution.

Before execution, confirm that:

- every case has a stable identity;
- each case links to one or more coverage requirements;
- fixtures can be established reproducibly;
- expected conditions can be verified;
- the required trace and outcome evidence has been identified; and
- the evaluation plan identifies the SUT and shared configuration.

Detailed system configuration belongs to the evaluation plan and execution provenance. Repeat it inside a case only when that configuration is itself what makes the case distinct.

The next step is:

```text
Approved cases
        ↓
Execute the identified SUT
        ↓
Capture traces and outcomes
        ↓
Apply criteria and evaluators
        ↓
Produce findings
```

## 12. Revise coverage through evidence


The starting coverage model is provisional.

Executed traces may reveal:

- a failure condition that was not represented;
- two cases thought to be equivalent that produce different behaviour;
- an expected condition that is unclear;
- a fixture that does not activate the intended scenario;
- a new form of real user input;
- a product boundary that is missing or disputed;
- a known failure that deserves regression protection; or
- an evaluator disagreement that exposes a missing contrast case.

These findings should revise:

- coverage requirements;
- selected dimensions;
- case allocation;
- inputs;
- fixtures;
- expected conditions; or
- the declared limits of the set.

The feedback relationship is:

```text
Initial coverage design
        ↓
Cases and production samples
        ↓
Executions and traces
        ↓
Failure understanding and evaluation
        ↓
New conditions, boundaries, and gaps
        ↓
Revised coverage
        ↺
```


Failure understanding should not silently modify an already executed evaluation plan. New cases belong to a new version or a linked follow-up investigation.

## 13. Role across Discovery and Delivery


The same coverage method supports different product decisions.

| Context | Coverage basis | Main purpose |
| --- | --- | --- |
| **Discovery** | Provisional solution behaviour, feasibility hypotheses, and known risks | Examine whether the proposed behaviour is plausible and where it fails |
| **Productization commitment** | Proposed production scope and known behaviour boundaries | Make behavioural evidence and residual uncertainty visible |
| **Delivery development** | Production Slice Contract and change hypothesis | Compare a candidate with the baseline and detect regressions |
| **Release** | Committed behaviour, guarantees, and release decision needs | Produce scoped release evidence |
| **Production** | Active product scope and a defined live population | Observe real behaviour, outcomes, and new conditions |
| **Quality Understanding** | Known failures, ambiguous cases, and evaluator disagreements | Refine coverage, contrasts, and regression protection |

A Discovery set may be small and diagnostic. A Delivery regression set becomes more stable because it protects committed behaviour. A production sample is needed when the decision depends on live frequency or outcome.

## 14. Workflow summary

```text
Phase 1 — Frame coverage

Decision or knowledge need
        ↓
Governing evaluation question
        ↓
Relevant product expectations
        ↓
Coverage requirements
```

```text
Phase 2 — Plan variation

Coverage requirements
        ↓
Optional dimensions
        ↓
Selected meaningful combinations
```

```text
Phase 3 — Build cases

Real, manual, or generated input
        +
Optional fixture
        +
Expected condition
        ↓
Evaluation case
```

```text
Phase 4 — Review the set

Evaluation cases
        ↓
Coverage review
        ↓
Approved evaluation set
```

```text
Phase 5 — Learn and revise

Execution and traces
        ↓
Failure understanding and evaluation findings
        ↓
Coverage changes
        ↺
```

## 15. Design principles

### 15.1 Start from a question


Coverage exists to make a defined evaluation question answerable.

### 15.2 Derive coverage from product expectations


Use provisional solution behaviour in Discovery and committed product behaviour in Delivery.

### 15.3 Keep the evaluation case minimal


An evaluation case contains an input, an optional fixture, and an expected condition. Shared configuration and judgement logic belong elsewhere.

### 15.4 Distinguish coverage from representativeness


A balanced or difficult case set can provide useful coverage without representing production frequency.

### 15.5 Represent meaningful behavioural variation


Choose conditions that can change relevant product behaviour. Avoid superficial paraphrase and arbitrary dimensions.

### 15.6 Use real inputs where suitable


Real inputs preserve actual language and assumptions. Use manual and generated inputs to fill declared gaps.

### 15.7 Generate inputs, not answers


Expected behaviour and judgement should come from product intent and criteria, not from the model used to generate an input.

### 15.8 Use the smallest adequate set


Case count follows from the governing question and coverage requirements. More cases do not compensate for missing coverage.

### 15.9 Keep cases reviewable


A smaller set that can be inspected carefully is more useful than a large opaque dataset.

### 15.10 Record known exclusions


A coverage set supports only the behaviours and conditions it represents.

### 15.11 Revise through evidence


Failure understanding, production observations, product changes, and evaluator disagreements should update the coverage model.

### 15.12 Version material changes


Changes to coverage requirements, fixtures, expected conditions, or case allocation create a new set version or investigation plan.

## 16. Summary


Evaluation coverage design turns a decision, an evaluation question, and relevant product expectations into a reviewed set of cases or a production-sample definition.

The method keeps the evaluation case deliberately small:

```text
input
+ optional fixture
+ expected condition
```


Coverage requirements explain why cases are needed. Dimensions and selected combinations may help plan meaningful variation. Real inputs supply natural behaviour; manual and generated inputs fill declared gaps. The set is reviewed against the governing question, executed, and revised when traces, failure understanding, production evidence, or evaluator disagreements expose missing conditions.

The model can be summarised as:

> **State the evaluation question, identify the behaviours and situations that must be represented, build the smallest reviewed set capable of exercising them, and revise the coverage as evidence accumulates.**
