---
draft: false
toc: true
title: "Parse, Don't Validate"
description: "Alexis King's principle: parse input at the boundary into types that keep what was checked, instead of validating and passing on weak types. Partial functions made total, evidence strength and limits."
linkTitle: "Parse, Don't Validate"
---

Alexis King's short article **"Parse, don't validate"** (HTML) captures one of the central practical ideas of type-driven design. ([Lexi Lambda](https://lexi-lambda.github.io/ "Alexis King's Blog"))

The note follows the argument in four steps: what's wrong with validating, the partial functions underneath it, where to parse, and how much a parsed type actually guarantees. What the boundary looks like in a larger system (DTOs, databases, schema changes) is in [Types At The Boundary]({{< ref "type-driven-design/types-at-the-boundary" >}}).

## The problem with validating


Example: an API receives:

```ts
type User = {
  email: string
}
```


and later checks the email:

```ts
if (!isValidEmail(user.email))
  throw ...
```


After that check, `user.email` is still a `string`. The information established by the check has disappeared.

Type-driven design suggests:

```ts
type Email = string & { readonly __brand: "Email" }

function parseEmail(s: string): Email | Error
```


and then:

```ts
type User = {
  email: Email
}
```


Now code that receives a `User` doesn't need to ask again whether the email is valid.

The check occurs once, and the fact learned by the check is preserved in the program.

That is the core idea: transform weakly structured external data into a stronger internal representation and let the type system carry what you've learned.

An analogy is the wristband at a festival. Your ticket is checked once at the gate and you get a wristband; inside, nobody asks for the ticket again, they look at the wristband. Validating without parsing is checking the ticket at the gate and then letting you in with nothing to show for it, so every bar and stage has to check the ticket again, and sooner or later one of them forgets.

The article explicitly distinguishes checking a property from producing a more precise type that preserves what you learned from the check. Its own example is `[a] -> NonEmpty a`. The email example has the same shape (the check happens when converting the value, and the resulting type carries the result through the program), but it gives a weaker guarantee, as King's follow-up article argues: a `NonEmpty` has no empty value at all, while an `Email` is a `string` that some function vouched for. See *How strong the evidence is* below.

King names the alternative: **shotgun parsing**, a term from language-theoretic security for parsing and validation code mixed into processing code, a cloud of checks fired at the input in the hope that one of them catches each bad case. The danger is that an error discovered late arrives after part of the invalid input has already been acted on, so the program's state is hard to predict. Even when all the validation happens up front, a validating design makes it hard to know whether it did: every function downstream has to allow for the "impossible" case anyway. Parsing splits the program into two phases instead, a parse phase that can fail and an execute phase that works only on parsed data.

## Partial functions made total


Underneath the slogan is a question about partial functions. Haskell's `head :: [a] -> a` has no answer for the empty list, so it crashes. King's section "Turning partial functions total" gives the two ways to fix it:

- **Weaken the result**: `head :: [a] -> Maybe a`. The function is now total, but every caller has to handle `Nothing`, including callers who already know the list isn't empty.
- **Strengthen the argument**: `head :: NonEmpty a -> a`. The function is total and returns a plain `a`, and the obligation moves to whoever builds the `NonEmpty`.

King calls the second better on all counts, since you can always recover the first from it but not the other way round. Wlaschin ([PDF](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), chapter 8, "Total Functions") makes the same split with division: either restrict the input (`NonZeroInteger`) or extend the output (an `option`).

Noonan ([PDF](/sources/programming/functional-programming/noonan-2018-ghosts-of-departed-proofs.pdf.enc), sections 1.2 and 1.3, "Leading the User into Temptation") explains why weakening the result goes wrong in practice: a user who has already checked that a key exists is forced to handle a missing-key case that can't happen, so they reach for `fromJust`. He found over 2,000 uses of `fromJust` applied to `Data.Map.lookup` in a snapshot of Hackage. His fix is the same: restrict the domain instead of extending the codomain. He's careful not to call one signature better in general, though (section 4.1, "Designing for the User's State of Knowledge"). If the caller genuinely doesn't know whether the key is there, the `Maybe` result says exactly that. If they already know, the type should let them say so.

A parser is the one place where the result is deliberately weakened (`String -> Either Error Email`), so that everything after it can take the strengthened argument.

## Parse at the boundary


This suggests the following architecture:

```text
                 untrusted world
                       │
                       ▼
             ┌──────────────────┐
             │ parse / validate │
             └──────────────────┘
                       │
                       ▼
              strongly typed
               domain model
                       │
              ┌────────┴────────┐
              ▼                 ▼
          business logic      algorithms
              │
              ▼
             effects
              │
                       ▼
                 external world
```


At the boundaries you inevitably need runtime checks:

```text
JSON
HTTP
database rows
user input
files
network responses
```


The compiler cannot prove that tomorrow's HTTP response will contain a valid email address.

But once you've checked it:

```text
JSON string
    ↓ parse
EmailAddress
    ↓
typed application
```


you often don't need to check the same invariant again.

King's practical advice ("Parsing, not validating, in practice") refines where "the boundary" is:

- **Push the burden of proof upward as far as possible, but no further.** Get data into the most precise representation as early as you can, ideally before any of it is acted on. "No further" matters: if one branch of the program needs a stronger type than the rest, parse into it when that branch is selected, not at the system's front door.
- **Follow the type errors.** Her example is `checkNoDuplicateKeys :: [(k, v)] -> m ()`. Change its result to `m (Map k v)`, and the callers stop compiling; fix them by passing the `Map` up the call chain until you reach the place where the list was created. That's where the check belongs.
- **Treat functions that return `m ()` with suspicion.** A function whose main effect is to throw an error is a validator that throws away what it learned.
- **Parsing in several passes is fine.** Avoiding shotgun parsing means not acting on input before it's fully parsed, not that one part can't decide how to parse another.
- **Avoid denormalized data.** The same fact stored in two places creates an easy illegal state: the copies disagreeing.

The system's edge isn't the only boundary. Płachta (PDF, chapter 6) defines parsing as turning raw data into the domain model and includes data from your own database, and Wlaschin (chapter 12) treats a database read as an untrusted source too. Wlaschin's chapter 3 adds the other direction: the output side of a bounded context deliberately drops information, such as card numbers, that must not leave it. Both are covered in [Types At The Boundary]({{< ref "type-driven-design/types-at-the-boundary" >}}).

## Don't throw information away


This gives another way of looking at type-driven design:

> A type should preserve information that you've already established.

A `bool` often throws information away:

```ts
if (isNonEmpty(xs)) {
    // compiler may still think xs: T[]
}
```


while:

```text
parseNonEmpty : List<T> -> Result<NonEmpty<T>, Empty>
```


makes the information available to every subsequent function.

Harper ([PDF](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), section 25.2) calls this **boolean blindness**: a boolean is a single bit, and the knowledge of *which* proposition it answers lives only in the programmer's head. `isNonEmpty(xs)` returning `true` tells the compiler nothing about `xs`.

TypeScript has a middle ground: a type predicate is a boolean that does carry type information.

```ts
function isNonEmpty<T>(xs: T[]): xs is [T, ...T[]] {
    return xs.length > 0
}

if (isNonEmpty(xs)) {
    xs[0]   // xs: [T, ...T[]] here
}
```


The catch is scope. The knowledge lives only inside the `if` block; it isn't stored in a value you can return, put in a record or pass to another module. A parsed `NonEmpty<T>` carries the fact wherever the value goes. Narrowing is enough for a local check and parsing is better for a fact the rest of the program relies on. Note too that TypeScript trusts the predicate's body: a buggy `isNonEmpty` that always returns `true` still narrows. Refinement type checkers solve the same problem by giving the boolean a refined type that states which proposition it answers ([Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}}#how-the-checking-works)).

## How strong the evidence is


A parsed type is evidence that a check happened. How much that evidence is worth depends on how the type is built.

### Smart constructors and newtypes


Most languages can't prove a predicate such as `x > 0` (see [Refinement And Dependent Types]({{< ref "type-driven-design/refinement-and-dependent-types" >}})). The usual substitute is a constructor that validates once and a type that records that it happened.

In TypeScript, a brand plus validation emulates a refinement type:

```ts
declare const positive: unique symbol

type Positive = number & {
    readonly [positive]: true
}

function makePositive(x: number): Positive | undefined {
    return x > 0 ? x as Positive : undefined
}
```


After construction, `Positive` carries evidence that validation happened, but TypeScript itself hasn't mathematically proved the predicate.

The evidence is also only a convention. `-5 as Positive` compiles anywhere the type is in scope, so the brand guarantees as much as the team's discipline about casts: keep the one `as Positive` inside `makePositive`'s module and forbid casts elsewhere with a lint rule. Rust's private field, below, is enforced by the compiler instead.

In Rust, the normal approach is a newtype with a smart constructor:

```rust
struct Positive(u32);

impl Positive {
    fn new(x: u32) -> Option<Self> {
        if x > 0 {
            Some(Self(x))
        } else {
            None
        }
    }
}
```


With a private field, outside code can't construct an invalid `Positive`. This is an invariant enforced through encapsulation and the type system.

Which wrappers to introduce in the first place, and how each language spells them, is in [Domain Modeling With Types]({{< ref "type-driven-design/domain-modeling-with-types" >}}#primitive-obsession-and-the-newtype-pattern).

### Names are not type safety


Alexis King's **"Names are not type safety"** (HTML) addresses an important subtlety with `newtype`/opaque wrappers: merely giving a `String` another type name prevents mixing values, but doesn't establish an invariant such as "this is a valid email." This is the distinction between type identity and value validity. ([Lexi Lambda](https://lexi-lambda.github.io/blog/2020/11/01/names-are-not-type-safety/ "Names are not type safety"))

The article contrasts two ways of getting safety from a type, which King calls intrinsic and extrinsic:

- **Constructive (intrinsic).** The type's shape makes invalid values impossible to build. A non-empty list defined as a head plus a tail (`data NonEmpty a = a :| [a]`) has no empty value, so nothing needs checking anywhere.
- **By encapsulation (extrinsic).** A newtype with a hidden constructor and a smart constructor that checks. The guarantee is only as good as that one module: the compiler checks that every value went through the module, not that the module's check is right.

Two consequences of the difference are easy to miss:

- **Consumers lose exhaustiveness checking.** King's example is a number from one to five. As a sum type with five constructors, a function over it is checked for missing cases. As a newtype over `Int`, every consumer needs an `error "impossible"` branch, and if a sixth value is added later, the constructive version stops compiling while the newtype version compiles and fails at run time.
- **Encapsulated values are tokens.** The module issues them and is the only place they can be redeemed. That restricts where the invariant can be broken to one module, which King says you can then test thoroughly (property-based tests or fuzzing), but it's still weaker than a proof.

Prefer constructive types when they're cheap, and fall back on encapsulation when the invariant can't be expressed by shape (a valid email address). An analogy: a constructive type is a plug whose shape won't fit the wrong socket, while encapsulation is an inspector's sign-off, as trustworthy as the inspector.

### Hidden constructors


An encapsulated type is only as safe as its *only* constructor, and most languages generate extra constructors without asking:

- **Derived instances.** King shows that deriving `Generic` or `Read` for a `NonEmpty` newtype lets anyone build `NonEmpty []` (`read "NonEmpty []"` works).
- **`copy` on case classes.** In Scala, `Username.from(s)` can validate, but `username.copy(value = "")` bypasses it. Volpe ([PDF](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), chapter 1) closes the hole with a `sealed abstract case class`, which has no `copy` and no public `apply`.
- **Deserialization.** Bloch ([PDF](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), Item 88) points out that Java's `readObject` is effectively another public constructor: a crafted byte stream can create an object that no normal constructor would allow, so `readObject` must check everything the constructor checks. JSON decoders that write fields directly have the same problem.
- **Mutable inputs.** A constructor that checks a mutable argument and keeps a reference to it can be invalidated afterwards; see [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}#where-types-stop-matching-reality).

### Evidence without runtime cost


Matt Noonan's **"Ghosts of Departed Proofs"** ([PDF](/sources/programming/functional-programming/noonan-2018-ghosts-of-departed-proofs.pdf.enc)) examines the relationship between compile-time guarantees and runtime checks. Its premise is that a precondition can be verified and evidence of that verification encoded in types, so later operations don't have to check it again. It describes encoding sophisticated preconditions in types while retaining no runtime overhead for the proof representation. ([Input | Output](https://www.iog.io/papers/ghosts-of-departed-proofs-functional-pearls "Ghosts of Departed Proofs (Functional Pearls)"))

The motivating example is merging sorted lists, which is only correct if both lists were sorted with the *same* comparator. Roughly:

```haskell
newtype SortedBy comp a = SortedBy a

sortBy  :: ((a -> a -> Ordering) ~~ comp) -> [a] -> SortedBy comp [a]
mergeBy :: ((a -> a -> Ordering) ~~ comp)
        -> SortedBy comp [a] -> SortedBy comp [a] -> SortedBy comp [a]
```


`f ~~ comp` attaches a type-level name, `comp`, to the comparator, and `SortedBy comp [a]` is a list tagged with the fact that it was sorted by the comparator of that name. `mergeBy` therefore accepts only lists sorted by the comparator it's given. Names and facts are phantom types, erased at compile time, which is where "no runtime overhead" comes from. The ghosts in the title are these proofs: present while type checking, gone at runtime.

The scheme depends on who gets to choose a name (section 2.4, "On the Danger of Naming a Ghost"). Names come from a function with a rank-2 type, so the library invents a fresh name for every comparator and the caller can't pick it. If callers could name values themselves (`any_name :: a -> (a ~~ name)`), they could give two different comparators the same name, and `mergeBy` would accept lists sorted in opposite orders. It's the hidden-constructor problem again, at the type level.

## Where it gets harder


Parse, don't validate is close to universally good advice, but it has rough edges:

- **Reporting errors.** A parser that stops at the first error suits a pipeline, not a form. To report every bad field at once you need error accumulation (applicative validation, such as cats' `Validated`); Wlaschin (chapter 10, "Composing in Parallel with Applicatives") does the same in F# with a `ValidationError list`.
- **Facts that expire.** Parsing proves something about the value at that moment. That holds for facts about an immutable value itself ("this string is an email"), but not for facts about the world ("this file exists", "this token hasn't expired", "this account has enough money"), which can stop being true after the parse, nor for a mutable object that someone changes later. See [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}#where-types-stop-matching-reality).
- **Every boundary is a boundary.** A value written to a database or a queue and read back is external data again. Either parse it again or decide explicitly to trust the store. See [Types At The Boundary]({{< ref "type-driven-design/types-at-the-boundary" >}}#the-database-is-a-boundary-too).
- **Strictness versus tolerance.** For a format you consume but don't own, strict parsing can be the wrong default. Percival and Gregory ([PDF](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), appendix E, "Postel's Law and the Tolerant Reader Pattern") argue that a service receiving product codes from another system should treat them as opaque strings rather than reject codes that don't match today's format, and should ignore fields it doesn't use. The two ideas fit together if you parse only what you use: be strict about the fields your logic depends on, and tolerant about the rest. See [Types At The Boundary]({{< ref "type-driven-design/types-at-the-boundary" >}}#tolerant-readers).
- **Type proliferation.** One type per established fact (`UnvalidatedOrder`, `ValidatedOrder`, `PricedOrder`) is the point of the approach, and *Domain Modeling Made Functional* ([PDF](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc)) does it deliberately. The price is conversion code between them.

## Library sources


- King 2019, *Parse, don't validate* -- the article this note is built on: turning partial functions total, the danger of validation (shotgun parsing), and the practical advice on where to parse; on *The problem with validating*, *Partial functions made total*, *Parse at the boundary* and *Don't throw information away*
- King 2020, *Names are not type safety* -- intrinsic (constructive) versus extrinsic (encapsulation-based) safety, newtypes as tokens, and derived instances that break the abstraction; on *Names are not type safety* and *Hidden constructors*
- [Noonan 2018](/sources/programming/functional-programming/noonan-2018-ghosts-of-departed-proofs.pdf.enc), *Ghosts of Departed Proofs (Functional Pearl)* ([doi:10.1145/3242744.3242755](https://doi.org/10.1145/3242744.3242755)) -- preconditions as phantom types on newtype wrappers, with the `sortBy` and `mergeBy` example; sections 1.2-1.3 on `Maybe` results, 2.4 on naming, 4.1 on the user's state of knowledge; on *Partial functions made total* and *Evidence without runtime cost*
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional* -- chapter 8, "Total Functions"; chapter 10, applicative validation; workflow types that separate unvalidated from validated data; on *Partial functions made total* and *Where it gets harder*
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition* -- chapter 1 on value classes, smart constructors, newtypes ("newtypes do not solve validation"), `sealed abstract case class` against `copy`, refinement types and runtime validation; on *Smart constructors and newtypes*, *Names are not type safety* and *Hidden constructors*
- [Bloch 2018](/sources/programming/language-practice/bloch-2018-effective-java-3e.pdf.enc), *Effective Java, 3rd Edition* -- Item 88, "Write readObject methods defensively"; on *Hidden constructors*
- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages, 2nd Edition* -- section 25.2, "Boolean Blindness"; on *Don't throw information away*
- [Percival et al. 2020](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), *Architecture Patterns with Python* -- appendix E, validation split into syntax, semantics and pragmatics, and the tolerant reader; on *Where it gets harder*
- Płachta 2022, *Grokking Functional Programming* -- chapter 6, parsing raw data, including your own database's, into the domain model; on *Parse at the boundary*
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles* -- chapter 12, "Signaling adversity": smart constructors that return `Maybe` or `Either`; on *Smart constructors and newtypes*
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell* -- chapter 5 hides a type's constructor behind a module's exports to make a smart constructor; on *Smart constructors and newtypes*
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala, 2nd Edition* -- chapter 4, errors as values with `Option` and `Either`, ending with accumulating errors and a `Validated` type; on *Where it gets harder*
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats* -- chapter 10, a data-validation case study that combines checks and accumulates their errors; on *Where it gets harder*
