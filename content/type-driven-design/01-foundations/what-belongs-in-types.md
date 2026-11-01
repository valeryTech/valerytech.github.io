---
draft: false
toc: true
title: "What Belongs in the Type System"
description: "Choosing between types, contracts, runtime checks and tests: what makes a good type-system target, a decision procedure, where types stop matching reality, and the cost of stronger guarantees."
linkTitle: "What Belongs in Types"
---

Several sources study these ideas systematically, although there is no universally accepted "type-system design methodology." This note collects the parts that do exist: what each kind of check is good for, which properties make good types, a decision procedure, and what the approach costs.

## Types, contracts, runtime checks and tests


Types, runtime checks, and tests handle program assumptions in complementary ways:

```text
                     Program assumptions
                            │
          ┌─────────────────┼──────────────────┐
          ▼                 ▼                  ▼
       Types             Runtime             Tests
          │               checks               │
          │                 │                  │
     prove broadly      check current       sample actual
     and statically       reality            executions
```


They're complementary.

Each covers a gap the others leave:

- **Types** say something about *every* run, but only properties the type language can express, and only about code the checker sees.
- **Runtime checks** handle what the code can't know in advance: input from outside. They're exact, but only about the value in front of them, at that moment.
- **Tests** run real code on chosen inputs. They can check anything you can compute (that a list is sorted, that totals add up), but only for the cases someone thought of.

An analogy from building: the plan review (types) rules out whole classes of mistakes before anything is built; the inspector at the loading dock (runtime checks) examines each delivery as it arrives; the fire drill (tests) shows that particular scenarios work. [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) is how the second feeds the first: check once at the boundary, then let the type carry the result.

Bragilevsky ([PDF](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), section 13.2.1 "Safety in Haskell programs") gives the working Haskell version of the same split: check at compile time everything that can be checked there, write tests for the other properties of the program, and handle what arrives at run time with checks and error reporting. He adds that types are weak at describing run-time input: if a user supplies a list, nothing at compile time knows how long it is.

**Contracts** are the fourth tool, and they sit between types and runtime checks. In Design by Contract, as *The Pragmatic Programmer* ([PDF](/sources/software-engineering/craft/thomas-2020-pragmatic-programmer-2nd-edition.pdf.enc), Topic 23 "Design by Contract") describes it, a routine states preconditions (what the caller must guarantee), postconditions (what the routine guarantees in return) and invariants. Two of its points carry over directly to types:

- **A broken contract is a bug**, not a normal outcome. That's why, Thomas and Hunt say, preconditions shouldn't be used to validate user input. Input that may be wrong isn't a precondition; it's something to parse.
- **The caller is responsible for meeting the precondition.** A refined parameter type (`sqrt(x: NonNegative)`) is a precondition the compiler enforces at every call site, and the check moves to wherever the caller first got the value.

They also argue that contracts are less repetitive than defensive programming, where every routine re-checks its inputs because it can't trust its callers. A type that carries the checked property is the same idea taken one step further: the check happens once and the type remembers it.

Contracts can also be the run-time half of a type system. In Typed Racket, the standard example of macro gradual typing (see [Dimensions Of Type Systems]({{< ref "type-driven-design/01-foundations/dimensions-of-type-systems" >}}#static-dynamic-and-gradual-checking)), a type on an import from untyped code turns into a contract checked whenever a value crosses the boundary.

## A good type-system target


There is a fairly clean way to reason about when something belongs in the type system.

|Property|Good type-system target?|Typical mechanism|
|---|---|---|
|`UserId` vs `OrderId`|Yes|distinct/new types|
|value may be absent|Yes|`Option<T>`|
|value is A, B, or C|Yes|sum type / enum|
|every case handled|Yes|exhaustive matching|
|collection is non-empty|Often|`NonEmpty<T>`|
|meters vs seconds|Yes|units-of-measure types, phantom type parameters|
|resource may only be consumed once|Often|linear/affine types|
|object follows state transitions|Often|typestate, one type per state ([Workflows And States]({{< ref "type-driven-design/03-domain-modeling/workflows-and-states" >}}))|
|operation can perform IO|Often|effect system|
|network protocol ordering|Sometimes|session types|
|integer is `0 <= x < n`|Sometimes|refinement/dependent types|
|username is unique in today's database|No|runtime/database constraint|
|user currently has enough money|Usually runtime|domain validation/transaction|
|algorithm sorts correctly|Usually beyond normal types|tests/proofs|
|service eventually answers|Usually beyond normal types|model checking/testing/monitoring|

That gives a useful principle:

**Put a property in the type system when it is stable, mechanically checkable, and useful to know throughout the program.**

"Stable" has a sharper version in *The Pragmatic Programmer*'s idea of **semantic invariants** (Topic 23): requirements central to the meaning of a thing, as opposed to policies that a new management could change. Their example is a debit-card switch that must never apply the same transaction twice. A semantic invariant is a good candidate for a type. A policy (a free-shipping threshold, a discount rule) is better as data or as a function, because it will change, and a type change ripples through every signature that mentions it.

## A decision procedure


Proposed decision procedure:

1. Ask what invariant you're currently checking mentally, in comments, or repeatedly with `if`.
2. Ask whether violating it represents a programming error.
3. Ask whether the invariant remains true once established.
4. Ask whether many downstream functions benefit from knowing it.
5. See whether your language can represent it simply.
6. If the type representation becomes much harder to understand than the invariant itself, use runtime validation/tests.

Question 2 is the Design by Contract distinction above: a violation that's a bug belongs in a precondition or a type, while a violation that's a normal business outcome (the balance is too low) belongs in the result type. Question 6 is the one Maguire, an advocate of type-level programming, puts first ([PDF](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), Introduction): when in doubt, don't do it at the type level.

Applied to two invariants:

```text
                          cart is non-empty at checkout     balance covers a withdrawal
1. checked repeatedly?    yes: pricing, shipping, UI        yes
2. violation is a bug?    yes: checkout shouldn't be        no: it's a normal business
                          reachable with an empty cart      outcome
3. stays true?            yes, once the cart is frozen      no: another transaction
                          for checkout                      can change it
4. many users downstream? yes                               few: the withdrawal itself
5. simple to represent?   yes: NonEmptyList                 no: needs dependent types
→                         put it in the type                check at runtime, put the
                                                            failure in the result type
```


Question 3 decides the second case on its own. A fact that can stop being true is a poor type, however useful it would be downstream.

A particularly good signal is repeated defensive code:

```ts
if (user != null)
if (order.status === "paid")
if (items.length > 0)
if (currency === expectedCurrency)
if (resource.isOpen)
```


When the same check appears throughout a codebase, there's often missing information in the types.

In a gradually typed language the procedure also says *where* to start. Slatkin's advice for Python ([PDF](/sources/programming/language-practice/slatkin-2019-effective-python-2e.pdf.enc), Item 90) is to annotate the public APIs and the most error-prone code first, not to aim for full coverage (returns diminish), and to skip annotations for prototypes and small scripts.

## Where types stop matching reality


There is, however, a limit.

Suppose you want:

```text
withdraw(account, amount)
```


with the invariant:

```text
amount <= current account balance
```


You could imagine an extremely sophisticated dependent type:

```text
withdraw :
  Account<balance = b>
  -> Amount<a where a <= b>
  -> Account<balance = b-a>
```


But your balance lives in a database and another transaction may modify it.

At that point, encoding the property entirely into compile-time types stops matching reality. The database transaction is the authority.

That doesn't leave types with nothing to say. They can't prove that the balance is enough, but they can force every caller to deal with the case where it isn't:

```scala
def withdraw(account: AccountId, amount: PositiveAmount): IO[Either[InsufficientFunds, Balance]]
```


The amount being positive is a stable fact about the value, so it goes in the type. Whether the balance covers it is a fact about the world, checked inside the transaction. What reaches the type is the *possibility* of failure, as a value the caller can't ignore. That's the usual division of labour: types for what's true of the value, runtime checks for what's true of the world, and the result type for the outcome of the check.

"Facts about the value stay true" has a precondition of its own: the value must be immutable. Bloch ([PDF](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), Item 50 "Make defensive copies when needed") shows a `Period` class that checks `start <= end` in its constructor and is still broken, because the caller keeps a reference to the mutable `Date` objects and changes them afterwards. His fix is to copy the inputs *before* checking them, so another thread can't change them between the check and the copy (a time-of-check/time-of-use attack). In a language with mutable objects, a validated type is only as good as its defensive copies.

Persistent data has the same problem over a longer time span: a value checked when it was written may be read years later by code with different rules. See [Types At The Boundary]({{< ref "type-driven-design/02-parsing-and-evidence/types-at-the-boundary" >}}#evolving-types).

## The cost of stronger guarantees


So there's a tradeoff:

```text
                  stronger static guarantees
                           ▲
                           │
 dependent types           │
 refinement types          │
 session types             │
 linear types              │
                           │
 algebraic data types      │
 generics                  │
                           │
 primitive types           │
                           └──────────────────────►
                              proof/complexity cost
```


Refinement types sit below dependent types: Jhala et al. ([PDF](/sources/programming/language-theory/jhala-2020-programming-with-refinement-types.pdf.enc), chapter 1) describe them as a restricted class of dependent types whose logic is limited so that an SMT solver can do the proving automatically. That trade, less expressiveness for much less proof work, is why they're the practical step between ordinary types and full dependent types; see [Refinement Types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}}).

Pierce ([PDF](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), chapter 1) puts the whole ladder in a wider frame: type systems are lightweight formal methods, at the opposite end from Hoare logic and other heavyweight verification, and climbing the ladder moves you along that line.

### Costs and failure modes


The approach has costs, and it can go wrong:

- **Conversion code.** Every new type needs a constructor, serialization, and mapping at each boundary. A domain with twenty value types has twenty of each.
- **Types that lie.** A type is only as trustworthy as the code that constructs it. A `PaidOrder` produced by a deserializer that never checks payment is worse than a plain `Order`, because readers trust it. The usual culprits are hidden constructors: a JSON decoder or derived `Read` instance, a case class's `copy` method, Java deserialization (Bloch, Item 88, calls `readObject` "effectively another public constructor"). See [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}).
- **Facts that expire.** A balance, a session or a lock can stop being true after it's checked, so it makes a poor type. See *Where types stop matching reality* above.
- **Modeling too early.** When the domain is still unclear, precise types make every change touch many places. The compiler makes those changes *safe* but not *free*. Starting looser and tightening as invariants settle is often the cheaper path. Wlaschin ([PDF](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), chapter 5) offers a middle way: sketch the model with placeholder types (`type Undefined = exn`) for the parts you don't understand yet, so the shape compiles before the details exist.
- **Rejected correct programs.** The checker is conservative ([Type Systems]({{< ref "type-driven-design/01-foundations/type-systems" >}}#what-a-type-system-is)), and each workaround (a cast, `Any`, `unsafeCoerce`) is a small hole in the guarantee.
- **Error messages.** Advanced encodings produce errors about type families or failed implications rather than about the domain. Maguire (chapter 12, "Custom Type Errors") makes the point that a type-safe library is no use if nobody can work out how to use it, and spends a chapter on custom error messages for that reason.
- **Inconvenient interfaces.** Bragilevsky (section 13.2.1) notes that the safer an interface is, the less convenient it usually is to use: `head` on a `NonEmpty` list is safe, but the caller has to produce the `NonEmpty` first.
- **Readability.** Advanced encodings (type-level programming, heavy use of `F[_]`) can be harder to understand than the invariant they protect. The rule of thumb below is the guard against this.
- **Compile time and team cost.** Type-level machinery slows compilation, steepens the learning curve for the rest of the team, and adds friction whenever the model changes, since every invariant in the types has to be kept consistent.

## Rule of thumb


A suggested rule for ordinary application design is: **use types to capture stable facts that would otherwise have to be remembered by programmers.** That's where the compiler tends to give the highest return for the added type complexity.

Related: [Type Systems]({{< ref "type-driven-design/01-foundations/type-systems" >}}) for what a type system can prove, [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) for carrying a checked property through the program, [Refinement Types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}}) for the stronger end of the cost curve, and [Scala Type System]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#encoding-contracts-in-scala) for the Scala libraries that encode contracts in types.

## Library sources


- [Thomas et al. 2020](/sources/software-engineering/craft/thomas-2020-pragmatic-programmer-2nd-edition.pdf.enc), *The Pragmatic Programmer, 2nd Edition* -- Topic 23, "Design by Contract": preconditions as the caller's responsibility, not for input validation, and semantic invariants versus policy; on *Types, contracts, runtime checks and tests*, *A good type-system target* and *A decision procedure*
- [Bragilevsky 2021](/sources/programming/functional-programming/bragilevsky-2021-haskell-in-depth.pdf.enc), *Haskell in Depth* -- section 13.2.1, "Safety in Haskell programs": types, tests and runtime checks, and safety against convenience; on *Types, contracts, runtime checks and tests* and *Costs and failure modes*
- [Bloch 2018](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), *Effective Java, 3rd Edition* -- Item 50 on defensive copies and time-of-check/time-of-use, Item 88 on `readObject` as a hidden constructor; on *Where types stop matching reality* and *Costs and failure modes*
- [Jhala et al. 2020](/sources/programming/language-theory/jhala-2020-programming-with-refinement-types.pdf.enc), *Programming with Refinement Types* -- chapter 1: refinement types as a restricted class of dependent types; on *The cost of stronger guarantees*
- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types* -- the Introduction's warning against needless type-level code, and chapter 12, "Custom Type Errors"; on *A decision procedure* and *Costs and failure modes*
- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages* -- chapter 1 counts type systems among the lightweight formal methods, at the opposite end of the spectrum from Hoare logic and other heavyweight verification frameworks; on *The cost of stronger guarantees*
- [Slatkin 2019](/sources/programming/language-practice/slatkin-2019-effective-python-2e.pdf.enc), *Effective Python, 2nd Edition* -- Item 90, "Consider Static Analysis via typing to Obviate Bugs": where to add type hints first; on *A decision procedure*
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional* -- chapter 5, "Modeling Unknown Types": `type Undefined = exn` as a placeholder that compiles until a function needs the real type; on *Costs and failure modes*

Further reading:

- [Nielson et al. 1999](/sources/programming/language-theory/nielson-1999-type-and-effect-systems.pdf.enc), *Type and Effect Systems*
- [Ousterhout 2018](/sources/software-engineering/craft/ousterhout-2018-philosophy-of-software-design.pdf.enc), *A Philosophy of Software Design*
- [Rondon et al. 2008](/sources/programming/language-theory/rondon-2008-liquid-types.pdf.enc), *Liquid Types*
- [Siek et al. 2006](/sources/programming/language-theory/siek-2006-gradual-typing-for-functional-languages.pdf.enc), *Gradual Typing for Functional Languages*
