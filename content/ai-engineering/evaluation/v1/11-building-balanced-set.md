---
draft: false
toc: true
title: "11 Building Balanced Set"
linkTitle: "11 Building Balanced Set"
---
## Building a balanced starting evaluation set


A balanced evaluation set represents the parts of the product that matter, in proportions appropriate to their importance and risk. Here we're building [10 User Inputs]({{< ref "ai-engineering/evaluation/v1/10-user-inputs" >}}) user inputs for evaluation set, but also the methods and principles could be applied to other or more broad concepts.

Balance does not mean assigning the same number of cases to every intent, dimension value, or tuple. Some workflows are more central to the product, some guarantees require broader validation, and some failures justify additional coverage because their consequences are severe. The composition of the starting set should therefore be derived from the product rather than from a generic sampling rule.

The relationship is:

```text
Product guarantees
    + Main jobs to be done
    + Critical failures
    + Product routes, tools, permissions, and constraints
            ↓
Coverage requirements
            ↓
Dimensions and important interactions
            ↓
Candidate evaluation cases
            ↓
Grouping, deduplication, and sampling
            ↓
Balanced starting evaluation set
```

### Product guarantees


Product guarantees are behaviours or properties that the application is expected to preserve across relevant interactions.

Examples include:

- respecting user and data permissions;
- preserving explicit user constraints;
- grounding claims in available data;
- requiring confirmation before high-impact actions;
- accurately representing tool results and failures;
- avoiding duplicate or unintended actions;
- refusing unsupported or prohibited requests.

Guarantees may apply across several jobs to be done, tools, and system states. They should therefore be translated into explicit coverage requirements rather than represented by a single example.

For example, a guarantee that the system respects permissions may require cases covering:

- users with read and write access;
- users with read-only access;
- users with no access;
- requests involving one record or several records;
- direct requests and multi-step workflows;
- situations in which permission information is missing, stale, or conflicting.

### Main jobs to be done


The main jobs to be done identify the outcomes users principally rely on the product to achieve.

They provide the foundation for baseline coverage. Each main job should be represented under straightforward and feasible conditions before more difficult variants are added.

For example:

```text
Job to be done:
Find and book a suitable appointment
```


Baseline cases might include:

- a clear request for an available time;
- one matching result;
- valid permissions and working tools;
- all required information present.

Additional cases may then vary relevant conditions:

- no suitable time is available;
- several valid times exist;
- the date is ambiguous;
- the user changes constraints;
- the calendar tool is unavailable;
- the requested action requires confirmation.

Jobs to be done should be separated when they require materially different product behaviour, tools, permissions, or completion criteria.

### Critical failures


Critical failures are outcomes that could cause substantial harm to the user, the business, or the integrity of the system.

Examples include:

- modifying the wrong record;
- exposing restricted information;
- performing a destructive action without confirmation;
- claiming that an action succeeded when it failed;
- ignoring an important user constraint;
- duplicating a payment, booking, or update;
- selecting the wrong account, customer, document, or date.

Critical failures should receive additional coverage even when the corresponding situations are uncommon in production data.

The relative priority of a coverage area may be considered as a function of:

```text
Product importance
    × Failure likelihood
    × Failure severity
    × Uncertainty about current performance
```


This does not need to be implemented as a precise numerical formula. Its purpose is to make case allocation deliberate and to prevent frequent but low-risk workflows from displacing rare, high-impact conditions.

### Coverage requirements


Coverage requirements describe which product behaviours, conditions, and interactions must be represented in the starting set.

They should be derived from:

- product guarantees;
- main jobs to be done;
- supported features and workflows;
- tool and routing paths;
- permission boundaries;
- system and data states;
- initial failure hypotheses;
- known difficult and regression cases.

Coverage requirements may specify:

- a dimension value that must appear;
- an interaction between several dimension values;
- a product route or tool path that must be exercised;
- a guarantee that must be tested across several contexts;
- a critical failure condition that requires deliberate over-sampling;
- a minimum number of independent examples for a high-priority behaviour.

For example:

```text
Coverage requirement:
The system must not perform a write action without the required permission.

Relevant interactions:
- Update request × read-only user
- Update request × missing permission data
- Multi-step workflow × permission changes during execution
- Ambiguous target record × destructive action
```


Coverage of each individual dimension value is not sufficient when the important behaviour arises from an interaction between values.

### Baseline, variation, and critical coverage


A useful starting set usually contains three broad forms of coverage.

#### Baseline coverage


Baseline cases establish whether the product can perform its main jobs under normal conditions.

These cases should generally have:

- clear requests;
- valid permissions;
- available data and tools;
- feasible user goals;
- straightforward execution paths.

Baseline cases make it possible to distinguish basic capability failures from failures introduced by ambiguity, constraints, or adverse system conditions.

#### Variation coverage


Variation cases test whether the product continues to behave correctly when realistic aspects of the interaction change.

Relevant variation may include:

- ambiguous, incomplete, or contradictory inputs;
- multiple user intents;
- conversational context;
- several valid results;
- no valid result;
- unavailable data or tools;
- different user roles or permission levels;
- single-step and multi-step workflows;
- specialised terminology or uncommon phrasing.

Variation should be included when it may cause materially different system behaviour. Superficial paraphrases do not add meaningful coverage.

#### Critical and regression coverage


Critical cases target high-impact failures, safety boundaries, irreversible actions, and known weaknesses.

Regression cases preserve previously observed failures after they have been corrected. They should remain in the set even when they are uncommon or semantically similar to another case, provided they protect against a distinct failure mode.

### Selecting and balancing cases


Once coverage requirements are defined, review the available evaluation cases against them.

The balancing process may involve:

- adding cases for uncovered jobs, guarantees, or critical failures;
- increasing coverage for high-risk or uncertain behaviours;
- reducing over-represented low-risk workflows;
- removing duplicates and near-duplicates;
- retaining cases that look similar but exercise different tools, permissions, fixtures, or system states;
- replacing unrealistic synthetic cases with more plausible alternatives;
- preserving authentic variation found in real user inputs.

The resulting distribution does not need to mirror production traffic exactly.

A production-weighted sample is useful for understanding typical system performance, but a compact evaluation set should also contain deliberate coverage of rare, difficult, and high-impact situations. Teams may therefore maintain both:

- a production-distribution sample, used to estimate performance on typical traffic;
- a coverage-oriented set, used to exercise guarantees, edge conditions, and critical failures.

These sets may overlap, but they serve different analytical purposes.

### Role of grouping and sampling techniques


Grouping and sampling techniques support the balancing process. They do not define the product's coverage requirements.

#### JTBD- or intent-based stratification


Use stratification to ensure that primary jobs and materially different workflows are represented. Prefer categories associated with distinct product behaviour, routes, tools, permissions, or completion criteria.

#### Keyword grouping


Use keyword grouping to identify:

- recurring domain terminology;
- entities, product names, or error codes;
- templated inputs;
- exact or lexical near-duplicates.

Keyword grouping is useful for inspection and deduplication, but should not be treated as evidence that inputs exercise the same system behaviour.

#### Embedding-based clustering


Use embedding-based clustering to identify semantic patterns, dense groups, outliers, and potential near-duplicates in larger input pools.

Clusters should be reviewed before they are used for sampling. Semantic similarity does not necessarily imply equivalent execution behaviour, particularly when cases differ in permissions, system state, tool path, or action risk.

#### Dimension- and interaction-based selection


Use the defined dimensions to inspect whether important values and combinations are represented.

Relevant interactions may include:

- job to be done × system state;
- action type × permission level;
- input quality × tool availability;
- user type × product route;
- complexity × action risk.

Avoid generating the full Cartesian product of all dimension values. Select combinations that are valid, plausible, and capable of producing materially different behaviour.

#### Random sampling


Use random sampling to:

- select among otherwise equivalent candidates;
- construct a production-distribution control sample;
- reduce reviewer preference within a defined stratum;
- inspect a large and relatively homogeneous pool.

Record the random seed when reproducibility matters.

When the available pool is small enough to review in full, review the complete pool rather than relying on random sampling alone.

### Approval criteria


Before execution, confirm that:

- every main job to be done has baseline coverage;
- each critical product guarantee is represented across the contexts in which it may fail;
- high-severity failures receive appropriate coverage;
- relevant tools, routes, permission states, and system conditions are exercised;
- important interactions between dimensions are represented;
- straightforward and difficult cases are both included;
- no low-risk workflow dominates without a product reason;
- duplicate and near-duplicate cases have been removed;
- similar cases are retained only when they exercise materially different conditions;
- synthetic cases fill identifiable gaps rather than paraphrasing existing real inputs;
- known difficult and regression cases are preserved;
- every case has source and provenance metadata;
- fixtures and expected conditions are aligned with the intended coverage point.

Approximately 100 executed cases may provide a useful starting set, but the number of cases should follow from the required product coverage. Increase, reduce, or rebalance the set when the current composition does not adequately represent the product's guarantees, main jobs, critical failures, and important operating conditions.

**Phase output:**

- Product-derived coverage requirements
- Coverage map across jobs, guarantees, failures, and system conditions
- Deduplicated and balanced starting evaluation set
- Documented rationale for case allocation
