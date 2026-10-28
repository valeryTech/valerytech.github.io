---
draft: false
toc: true
description: "Proposes typed intermediate programs with explicit effects, extensible operator contracts, compositional guarantees, and structured compiler feedback, separating static admissibility from empirical task correctness."
title: "02 Typed Dsl And Compiler"
linkTitle: "02 Typed Dsl And Compiler"
---

Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## much sharper architecture


Initial proposal: Design a DSL in a language such as Scala or Haskell. An agent would generate a plan or program in this DSL, allowing the compiler to check and verify it and provide fast feedback.

TODO: Clarify the original `XX` marker; no further text is recorded here.

That is a much sharper architecture than a generic "agent with guardrails." The key idea is to make the LLM generate a typed intermediate program, then let the compiler and verifier reject invalid states before anything executes. The following analysis connects the idea to existing work and illustrates a possible DSL.

TODO: Clarify the original `XX` marker; no further text is recorded here.

This is one of the possible architectures for LLM agents to estimate.

The proposal is to make one adjustment: use Scala/Haskell to implement the DSL and verifier, while having the model generate only the restricted DSL or its AST. Giving the model arbitrary Scala/Haskell source weakens the boundary.

Conceptually:

```text
User intent
    ↓
   LLM
    ↓
Plan DSL
    ↓
parser
    ↓
typed AST
    ↓
type checker
+ effect checker
+ permission checker
+ invariant checker
+ SMT/model checker
    ↓
verified executable plan
    ↓
small trusted interpreter
    ↓
external world
```


If verification fails:

```text
LLM
 ↓
candidate plan
 ↓
compiler
 ↓
error:
  step 4: SendEmail requires Public[Text]
          but argument has type Confidential[Text]
 ↓
LLM repairs candidate
```


That feedback loop can be fast and deterministic. The model doesn't have to "understand" whether its plan is safe. It just has to search for a program accepted by the verifier.

This is close to several existing research directions. LLM+P, for example, translates natural language into PDDL and then delegates planning to a classical planner; the planner provides feasibility/correctness properties that the LLM itself cannot reliably provide. ([arxiv.org](https://arxiv.org/abs/2304.11477?utm_source=chatgpt.com "LLM+P: Empowering Large Language Models with Optimal Planning Proficiency")) Tom Silver, Leslie Kaelbling, Joshua Tenenbaum and collaborators have also used program generation plus automated validation/debugging, where validation errors are fed back to the LLM. ([ojs.aaai.org](https://ojs.aaai.org/index.php/AAAI/article/view/30006?utm_source=chatgpt.com "Generalized Planning in PDDL Domains with Pretrained Large Language Models | Proceedings of the AAAI Conference on Artificial Intelligence")) A 2026 ICSE paper from Eunsuk Kang, Christian Kästner and collaborators goes further toward your safety use case: tool capabilities, information flows and allowed sequences are represented formally and checked independently of the LLM. ([DOI](https://doi.org/10.1145/3786582.3786839?utm_source=chatgpt.com "Towards Verifiably Safe Tool Use for LLM Agents | Proceedings of the IEEE/ACM 48th International Conference on Software Engineering"))

There is even a July 2026 article by Unmesh Joshi making almost exactly the DSL argument: DSL grammar, types, invariants and compiler diagnostics can form the harness around an LLM, with the model iteratively repairing rejected programs. ([martinfowler.com](https://www.martinfowler.com/articles/llm-and-dsls.html?utm_source=chatgpt.com "DSLs Enable Reliable Use of LLMs"))

Where Scala/Haskell becomes particularly useful is that the DSL can encode much more than syntax.

For example, imagine:

```scala
val plan =
  readDocument[Internal]("salary.csv")
    .flatMap(analyse)
    .flatMap(sendEmail("external@example.com"))
```


The AST could carry information-flow types:

```text
readDocument("salary.csv")
    : Action[Internal[Document]]

analyse(...)
    : Internal[Document] -> Internal[Summary]

sendEmail(...)
    : Public[Text] -> Action[Sent]
```


The program doesn't type-check because:

```text
Internal[Summary] ≠ Public[Text]
```


The LLM gets:

```text
Type error at step 3:
Cannot pass Internal[Summary] to sendEmail.
Required: Public[Text]
Found:    Internal[Summary]

Possible operations:
  redact : Internal[Text] -> Public[Text]
  requestApproval : Internal[Text] -> Approved[Text]
```


Now the LLM might produce:

```text
read salary.csv
analyse
redact
sendEmail
```


This is qualitatively different from asking another LLM, "Is this plan safe?"

You can encode several classes of restrictions this way:

- **Capabilities:** an agent can only invoke operations represented in the DSL.
- **State transitions:** `Unauthenticated -> Authenticated -> Authorized`.
- **Effects:** `Read`, `Write`, `Network`, `Money`, `HumanApproval`.
- **Information flow:** `Secret[T]`, `Internal[T]`, `Public[T]`.
- **Resources:** prevent using deleted/closed resources.
- **Pre/postconditions:** account balance, ownership, quotas, limits.
- **Temporal rules:** approval must happen before transfer.
- **Irreversibility:** distinguish `Preview` from `Commit`.
- **Authority:** some actions require a capability token supplied by the runtime rather than synthesizable by the LLM.

Haskell is particularly attractive because GADTs, DataKinds, indexed monads and refinement systems such as Liquid Haskell let you push substantial state-machine semantics into types. Liquid/refinement types can discharge predicates through SMT solvers, giving you a middle ground between an ordinary compiler and a theorem prover. ([ntaylor.ca](https://ntaylor.ca/posts/liquid-types/?utm_source=chatgpt.com "An Invitation to Liquid Types: Unifying Type Theory and Model Checking -- Nathan Taylor"))

For example, conceptually:

```haskell
transfer
  :: Amount n
  -> Account balance
  -> Requires (n <= balance)
  => Action MoneyWrite
```


Or state-indexed operations:

```haskell
login
  :: Credentials
  -> Action LoggedOut LoggedIn

transfer
  :: Amount
  -> Action LoggedIn TransactionPending

approve
  :: Approval
  -> Action TransactionPending TransactionApproved

commit
  :: Action TransactionApproved TransactionComplete
```


Then this is literally impossible to construct as a well-typed plan:

```text
login
commit
```


because `commit` needs `TransactionApproved`, while `login` produces `LoggedIn`.

Scala 3 can implement a substantial subset of this with enums, opaque types, phantom types, match types and type classes. Haskell gives you a cleaner research playground for more advanced type-level encodings.

One tentative proposal is to go one level further, though. The proposal is to separate the system into **three languages**:

```text
Intent language
    natural language
         ↓
Planning DSL
    expressive, pure, no actual IO
         ↓
Verified execution IR
    extremely small
         ↓
Capability-controlled interpreter
```


The planning DSL can contain things like conditionals, queries and abstract goals:

```text
customer <- FindCustomer("Alice")

if customer.balance >= invoice.total:
    Pay(invoice, customer.account)
else:
    AskUser(...)
```


After verification, it lowers into a much smaller executable representation:

```text
QueryCustomer(id=...)
Check(...)
RequestCapability(Payment, ...)
ExecutePayment(...)
```


The final interpreter might only be 2-5k lines and therefore becomes part of the **trusted computing base**. Everything above it--including the LLM--can be treated as potentially wrong.

This leads to a useful way of thinking about the LLM:

```text
LLM = nondeterministic program synthesizer

Compiler/verifier = definition of acceptable behavior
```


The LLM is allowed to hallucinate endlessly during synthesis. Hallucinated programs simply don't compile.

And compiler diagnostics become a search signal:

```text
generate
 → typecheck
 → reject
 → diagnostic
 → regenerate
 → typecheck
 → reject
 → diagnostic
 → ...
 → accepted program
```


That's essentially **counterexample-guided synthesis**, except an LLM is doing the candidate generation.

This may be a more productive framing for reliable agents than trying to make the LLM itself increasingly obedient. The research question becomes: **what DSL and type/effect system lets us express enough useful agent behavior while keeping verification cheap and decidable?**

That brings programming-language research--types, effects, refinement types, model checking, abstract interpretation, capability systems and program synthesis--directly into LLM agent design.

## concentration


Scope constraint: First examine the desired properties of the DSL and its underlying machinery, including fast feedback. A declarative approach could be introduced later.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The proposal is to separate the design into three layers: the DSL itself, the compiler/verifier underneath it, and the execution model. That prevents us from putting too much policy into syntax.

For the DSL itself, the proposal is to aim for these properties:

1. Small and closed. The model can only construct a known set of operations. No arbitrary code escape hatch, reflection, dynamic imports, raw shell, etc.
2. Strongly typed. Types should describe domain facts, not only primitive values.

```text
CustomerId
VerifiedCustomer
Money<USD>
Public<Text>
Private<Text>
Approved<Payment>
```


3. Explicit effects. Every operation declares what it can do.

```text
lookupCustomer : CustomerId -> Effect<ReadCRM, Customer>

sendEmail :
  Public<Text> -> Effect<SendEmail, Sent>

charge :
  Approved<Payment> -> Effect<MoneyWrite, Receipt>
```


This lets us reject a plan before execution based on effects alone.

4. Explicit state transitions. Important operations should consume one state and produce another.

```text
PaymentDraft
  -> PaymentValidated
  -> PaymentApproved
  -> PaymentExecuted
```


The LLM cannot skip `PaymentApproved` because there is no valid transition.

5. No hidden side effects. Reading, network access, money movement, filesystem changes, external communication--all visible in the program.
6. Bounded control flow. Initially, the proposal is to avoid unrestricted recursion and arbitrary loops. Give the language things such as:

```text
sequence
if
match
forEach(max = 100)
retry(max = 3)
```


That makes analysis and execution predictable.

7. First-class failure. Operations should expose expected failure cases.

```text
lookupCustomer
  : CustomerId
  -> Result<Customer, CustomerNotFound | CRMUnavailable>
```


Then the plan must explicitly handle them.

8. Deterministic semantics. Given the same DSL program and the same external observations, the meaning of the program should be clear. The LLM shouldn't affect semantics after compilation.
9. Canonical representation. There should ideally be one normal AST representation of a plan. The human syntax can vary later. This helps caching, diffs, verification, signatures, replay and debugging.

Another proposal is to make partial programs first-class. This is important for the LLM loop.

For example:

```text
customer = lookupCustomer(id)

payment = ???
charge(payment)
```


The compiler can return:

```text
Hole #1 requires:
    Approved<Payment>

Available values:
    customer : Customer
    invoice  : Invoice

Available constructors:
    createPayment(...)
    validatePayment(...)
    requestApproval(...)
```


That gives the model a constrained synthesis problem instead of asking it to regenerate the entire plan.

For the underlying compiler, the working interpretation is that fast feedback should be a core design requirement. The proposal is to structure checking in increasingly expensive stages:

```text
parse
  ↓
name resolution
  ↓
type checking
  ↓
effect checking
  ↓
state/capability checking
  ↓
local invariants
  ↓
symbolic verification
  ↓
external validation
```


Most bad plans should fail in the first few stages.

A reasonable design goal would be:

```text
syntax/type/effect errors       ~ milliseconds
local invariant checking        ~ tens of milliseconds
SMT/simple symbolic checks       ~ < 1 second normally
deep verification               optional / explicit
```


The exact numbers are secondary. The important property is that the LLM gets feedback quickly enough to use compilation as part of generation:

```text
generate AST
   ↓
check
   ↓
structured diagnostic
   ↓
repair only affected nodes
   ↓
check again
```


Diagnostics therefore need to be machine-readable. For example:

```json
{
  "code": "EFFECT_NOT_ALLOWED",
  "node": "step-17",
  "effect": "SendExternalEmail",
  "allowed": ["ReadCRM", "WriteCRM"],
  "possible_fixes": [
    "requestCapability",
    "replaceOperation"
  ]
}
```


Human-readable compiler errors can be generated from the same structure.

This also suggests incremental compilation. If the model changes step 17, we should not reverify an entire 200-step plan. Cache type/effect/invariant results for unchanged AST nodes.

Another important property is separation between planning and execution:

```text
DSL source
   ↓
verified AST
   ↓
lowering
   ↓
small execution IR
   ↓
runtime
```


The runtime should execute only compiled IR. It should never accept raw LLM output.

Then the declarative proposal fits naturally later.

Instead of requiring the model to say exactly how to achieve something:

```text
customer = findCustomer(...)
invoice = getInvoice(...)
payment = createPayment(...)
approval = requestApproval(payment)
execute(approval)
```


we could eventually allow:

```text
goal {
    invoice.status == Paid
}

constraints {
    payment.amount <= invoice.amount
    payment.requiresApproval
    customer.identity == Verified
    noExternalDisclosure(customer.privateData)
}
```


Then a planner/synthesizer produces the imperative DSL program satisfying those constraints.

So eventually there could be two languages:

```text
Declarative goal language
        ↓
 planner / synthesizer
        ↓
Operational DSL
        ↓
 compiler / verifier
        ↓
Execution IR
```


The proposal is to build the operational DSL first. It gives us concrete semantics, a verifier and an execution model. Once that substrate exists, the declarative layer becomes a synthesis problem over a well-defined target language.

The most important proposed design principle to retain throughout is this:

> The DSL should make invalid plans cheap to reject and valid plans cheap to execute.

That is probably a better optimization target than making the DSL pleasant for humans. The primary author will often be a machine.

### Effects need their own vocabulary


Koka is almost a laboratory for one piece of the proposed theory. Its function type includes the effects a function can cause; it also uses handlers to separate requesting an effect from interpreting it. ([Koka](https://koka-lang.github.io/koka/doc/index.html?utm_source=chatgpt.com "The Koka Programming Language"))

Unison does something similar with abilities:

```text
Input ->{Network, Storage, Exception} Output
```


and an empty ability set means those abilities aren't available. ([Unison](https://www.unison-lang.org/docs/language-reference/abilities-and-ability-handlers/?utm_source=chatgpt.com "Abilities and ability handlers · Unison programming language"))

For the proposed system the proposal is to go one step further.

The proposal is to distinguish:

```text
effect
    "this computation may request SendEmail"

capability
    "this participant is authorized to SendEmail"

handler
    "this environment knows how to perform SendEmail"

policy
    "under these circumstances SendEmail is allowed"
```


These are four different things.

Most languages collapse at least some of them.

That distinction could become a major part of the proposed language design.

### 5. Make effects explicit


The program should expose interactions with the outside world:

```text
Read
NetworkRead
DatabaseWrite
ExternalCommunication
MoneyMovement
ModelInference
HumanApproval
```


This allows checks such as:

```text
this workflow performs writes
this loop contains an external call
this branch can send communication
this plan requires approval
```


Effects describe what the program may do. Authorization determines whether this particular run is allowed to do it.

### 6. Make guarantees compositional


An operator needs a contract:

```text
Operator {
    input types
    output type
    effects
    failure cases
    state requirements
    state changes
    idempotency
    resource estimates
}
```


Then the compiler can derive properties of a larger program from its parts.

For example:

```text
search       : Query -> List[Result]
rerank       : List[Result] -> Evidence
synthesize   : Evidence -> DraftAnswer
verify       : DraftAnswer -> Result[VerifiedAnswer, VerificationFailure]
```


If operators have no formal contracts, the DSL is mainly orchestration syntax. Whole-program guarantees remain weak.

### 7. Keep the operator set extensible and its contracts controlled


The DSL does not need a permanently closed set of capabilities.

The core language can remain stable:

```text
let
if
match
repeat
parallel
return
assert
```


New operators can be registered:

```text
searchWeb
queryRepository
retrieveDocuments
runSql
evaluateCoverage
callModel
```


Each operator must provide a manifest and a trusted adapter. The extension boundary is controlled even though the catalog remains open.

```scala
OperatorDefinition(
  name = "retrieveDocuments",
  input = Query,
  output = List[Document],
  effects = Set(NetworkRead),
  failures = Set(Timeout, BackendUnavailable),
  execute = retrieveDocuments
)
```


An arbitrary function without declared semantics would be an escape hatch from the DSL.

### 8. Design feedback for LLM repair


Feedback speed is only one property. Feedback should also be:

- deterministic;
- local to a specific node;
- structured;
- actionable;
- stable across runs;
- small enough to return without the whole program.

For example:

```json
{
  "code": "UNBOUNDED_LOOP",
  "node": "research-loop-2",
  "message": "The loop has no static maximum.",
  "expected": {
    "maxIterations": "positive integer"
  },
  "possibleRepairs": [
    "Add maxIterations",
    "Replace repeat with map"
  ]
}
```


This is more useful than:

```text
The plan may be unsafe. Try again.
```


The repair loop should operate on the affected part:

```text
generate node
→ check node and dependants
→ return diagnostic
→ replace node
→ incrementally recheck
```


Useful supporting features include typed holes, incremental compilation, cached checks, stable node identifiers, and canonical ASTs.

### 9. Use the LLM where ambiguity exists


The model is useful for:

```text
interpreting user intent
choosing search terms
decomposing a problem
proposing control flow
classifying evidence
suggesting repairs
```


Deterministic components are better suited to:

```text
name resolution
type compatibility
schema validation
dependency tracking
budget accounting
permission checks
state transitions
execution
```


This division uses the model for semantic search and the compiler for exact bookkeeping.

### 2. Language and type/effect system


Then define a programming model over that machine.

A program might contain ordinary types:

```text
Source
Evidence
Claim
Task
Approval
Result
```


and effects such as:

```text
llm
external_read
external_write
probabilistic
financial
irreversible
incomplete_coverage
```


The research question is:

**Which properties should be statically expressible, and which must remain runtime properties?**

The investigation work gives a concrete starting point: coverage, authority, provenance, unresolved conflicts, and uncertainty can already be modeled as properties flowing through the program.

For the generalized system, this becomes a much broader effect system for agent computation.

### 3. Compilation and verification


The compiler is one of the core research objects.

Its role is not merely translating syntax. It should derive obligations and reject invalid programs:

```text
LLM/user program
      ↓
type checking
effect checking
policy checking
resource checking
temporal obligations
      ↓
valid logical program
```


The investigation example already shows the basic idea: a final result requiring complete coverage cannot be produced by a path that never establishes coverage.

Generalized examples become:

```text
deploy(change)
requires TestsPassed
requires Approval
requires RollbackAvailable
```


or:

```text
refund(amount)
requires IdentityVerified
requires PolicyChecked
requires amount <= limit
```


The deeper question becomes:

**How much agent correctness can be converted into program validity?**

## for the future


Where would you count for effect properties or other like time execution which also could vary, or quality of answer and model parameters number. Perhaps we should not introduce this now

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The recommendation is not to put all of those into the core effect system yet. They are different kinds of properties, and combining them early will make the DSL harder to reason about.

The proposal is to separate them into four categories.

1. Effects: "what can this operation change or access?"

```text
ReadCRM
WriteCRM
Network
SendEmail
MoneyTransfer
HumanApproval
```


These belong in the core DSL because they affect correctness, permissions, and safety.

2. Resource properties: "how much can execution consume?"

```text
time
tokens
money
memory
API calls
retries
```


These are quantitative. Eventually we could express budgets:

```text
plan {
    maxTime = 5s
    maxCost = $0.10
    maxTokens = 20_000
}
```


This is related to effects, but one tentative proposal is to model it separately as a resource or cost system.

There is also an important distinction with time:

```text
deadline <= 5 seconds
```


is a constraint, while

```text
estimatedLatency = 1.8 seconds
```


is only an estimate.

The compiler can prove some resource bounds. Actual latency usually depends on the environment.

3. Quality properties: "how good does the result need to be?"

This is much harder:

```text
accuracy >= 0.95
confidence >= 0.9
answerQuality >= ???
```


Some properties can be checked:

```text
JSON conforms to schema
all citations resolve
answer contains requested fields
solution passes tests
```


Others, such as "this is a good answer," need an evaluator, another model, tests, or human judgment.

So the proposal is to call these something like `requirements` or `acceptance criteria`, separate from types and effects.

4. Model/runtime configuration:

```text
model = ...
parameterCount = ...
temperature = ...
contextLength = ...
reasoningBudget = ...
```


The proposal is to keep this almost completely outside the semantic DSL.

A plan should ideally say:

```text
summarize(document)
```


rather than:

```text
summarizeWithModel(
    model = "X",
    parameters = 70B,
    temperature = 0.2
)
```


Model selection is an execution-policy decision. The runtime can choose a model satisfying requirements such as:

```text
requires {
    capability = Summarization
    maxLatency = 2s
    maxCost = $0.02
    minQuality = 0.85
}
```


Then later a scheduler could decide whether to use a small local model, a large model, or even a non-LLM implementation.

That separation becomes useful for the declarative direction you mentioned.

Eventually:

```text
goal {
    produce Summary(document)
}

constraints {
    noPrivateDataLeak
    latency <= 3s
    cost <= $0.05
}

quality {
    preserveKeyFacts
    citationsRequired
}
```


And the compiler/planner chooses an implementation.

For the first version, though, the proposal is to keep the core approximately:

```text
Types
Effects
State transitions
Capabilities
Failures
Control flow
```


But design the AST so nodes can carry extensible properties:

```text
Node {
    operation
    inputs
    type
    effects

    attributes {...}
}
```


Then later `attributes` can acquire cost estimates, deadlines, quality requirements, provenance, model requirements, etc., without redesigning the language.

So the LLM response supports the scope constraint: **don't introduce time, quality, model size, cost, and similar concerns into the type/effect system now.** We should first get clear on what the semantic contract of the DSL is. The next useful question is probably whether effects, capabilities, state transitions, and failures should actually be four distinct concepts in the DSL, or whether some of them can share one underlying mechanism.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## General verification and acceptance


The complete [compilation-versus-correctness discussion]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}#4-compilation-and-correctness-are-different-loops) is now in the shared verification note. Language constraints and static validation remain below.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Language constraints from the behavioral dialogue


The following material comes from the abstraction analysis in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#abstraction-analysis). The original source context remains in that note. The original arguments are retained with editorial wording.

### DSL bias


The DSL is the hypothesis space.

A narrow DSL gives:

- easier synthesis;
- stronger static checks;
- more predictable behavior;
- fewer possible programs.

A broad language gives:

- greater expressivity;
- easier generation by coding agents;
- weaker verification;
- a larger and less identifiable search space.

The key research problem is not merely language design. It is finding the smallest language in which the desired semantic procedures have short representations.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Static validation from the reanalysis


The following material comes from the reanalysis in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#reanalysed). The original source context remains in that note. The original arguments are retained with editorial wording.

### 5. Compile and statically validate


The compiler should establish that the procedure is well formed.

It can check:

- syntax and types;
- declared input/output compatibility;
- availability of tools and capabilities;
- effect permissions;
- complete handling of closed result variants;
- valid source and artifact references;
- compatible revisions;
- dependency graph validity;
- bounded iteration and retry declarations;
- required provenance fields;
- lifecycle transition legality;
- absence of unauthorized external effects.

It cannot, by itself, establish:

- that a claim is supported by the source;
- that a summary preserves meaning;
- that all material information is included;
- that an interpretation is useful;
- that a generated conclusion is domain-correct.

This distinction should be visible in the result types:

```
CompilationResult =
    CompiledProgram
  | CompileRejected

VerificationResult =
    AcceptedForPurpose
  | NeedsProcedureRevision
  | NeedsCandidateRevision
  | ContractIncomplete
  | SourceAmbiguous
  | HumanReviewRequired
  | Rejected
```


A failed comparison should not automatically trigger a procedure repair. The reference candidate might be wrong. The problem contract might be incomplete. The source might genuinely be ambiguous. The failure classifier must identify what kind of revision is warranted.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Tickloom case study


The complete [semantic-model and scenario-DSL example]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) is now in one case-study note. Its sibling [comments note]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl-comments" >}}) explains the distinction between compilation and a correct test.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Related database interview


The [NoSQL, optimizer, and transaction exchange]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}#nosql-sql-optimizers-and-transactions-from-the-interview) is now beside the other database interview passages. The speaker labels and source attribution remain unchanged.
