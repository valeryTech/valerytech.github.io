---
draft: false
toc: true
title: "Parse Dont Validate"
linkTitle: "Parse Dont Validate"
---
# Parse, don't validate


Alexis King's short article **"Parse, don't validate"** (HTML) captures one of the central practical ideas of type-driven design. ([Lexi Lambda](https://lexi-lambda.github.io/ "Alexis King's Blog"))

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

The article explicitly distinguishes checking a property from producing a more precise type that preserves what you learned from the check. The `List[A] -> NonEmptyList[A]` example closely matches the `String -> EmailAddress` example: the check happens when converting the value, and the resulting type carries that information through the rest of the program.

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

TypeScript has a middle ground: a type predicate is a boolean that does carry type information.

```ts
function isNonEmpty<T>(xs: T[]): xs is [T, ...T[]] {
    return xs.length > 0
}

if (isNonEmpty(xs)) {
    xs[0]   // xs: [T, ...T[]] here
}
```


The catch is scope. The knowledge lives only inside the `if` block; it isn't stored in a value you can return, put in a record or pass to another module. A parsed `NonEmpty<T>` carries the fact wherever the value goes. Narrowing is enough for a local check and parsing is better for a fact the rest of the program relies on. Note too that TypeScript trusts the predicate's body: a buggy `isNonEmpty` that always returns `true` still narrows.

## Smart constructors and newtypes


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

## Names are not type safety


Alexis King's **"Names are not type safety"** (HTML) addresses an important subtlety with `newtype`/opaque wrappers: merely giving a `String` another type name prevents mixing values, but doesn't establish an invariant such as "this is a valid email." This is the distinction between type identity and value validity. ([Lexi Lambda](https://lexi-lambda.github.io/blog/2020/11/01/names-are-not-type-safety/ "Names are not type safety"))

The article contrasts two ways of getting safety from a type:

- **Constructive.** The type's shape makes invalid values impossible to build. A non-empty list defined as a head plus a tail (`data NonEmpty a = a :| [a]`) has no empty value, so nothing needs checking anywhere.
- **By encapsulation.** A newtype with a hidden constructor and a smart constructor that checks. The guarantee is only as good as that one module: the compiler checks that every value went through the module, not that the module's check is right.

Prefer constructive types when they're cheap, and fall back on encapsulation when the invariant can't be expressed by shape (a valid email address). An analogy: a constructive type is a plug whose shape won't fit the wrong socket, while encapsulation is an inspector's sign-off, as trustworthy as the inspector.

## Evidence without runtime cost


Matt Noonan's **"Ghosts of Departed Proofs"** ([PDF](/sources/programming/functional-programming/noonan-2018-ghosts-of-departed-proofs.pdf.enc)) examines the relationship between compile-time guarantees and runtime checks. Its premise is that a precondition can be verified and evidence of that verification encoded in types, so later operations don't have to check it again. It describes encoding sophisticated preconditions in types while retaining no runtime overhead for the proof representation. ([Input | Output](https://www.iog.io/papers/ghosts-of-departed-proofs-functional-pearls "Ghosts of Departed Proofs (Functional Pearls)"))

The motivating example is merging sorted lists, which is only correct if both lists were sorted with the *same* comparator. Roughly:

```haskell
newtype SortedBy comp a = SortedBy a

sortBy  :: ((a -> a -> Ordering) ~~ comp) -> [a] -> SortedBy comp [a]
mergeBy :: ((a -> a -> Ordering) ~~ comp)
        -> SortedBy comp [a] -> SortedBy comp [a] -> SortedBy comp [a]
```


`f ~~ comp` attaches a type-level name, `comp`, to the comparator, and `SortedBy comp [a]` is a list tagged with the fact that it was sorted by the comparator of that name. `mergeBy` therefore accepts only lists sorted by the comparator it's given. Names and facts are phantom types, erased at compile time, which is where "no runtime overhead" comes from. The ghosts in the title are these proofs: present while type checking, gone at runtime.

## Where it gets harder


Parse, don't validate is close to universally good advice, but it has rough edges:

- **Reporting errors.** A parser that stops at the first error suits a pipeline, not a form. To report every bad field at once you need error accumulation (applicative validation, such as cats' `Validated`).
- **Facts that expire.** Parsing proves something about the value at that moment. That holds for facts about the value itself ("this string is an email"), but not for facts about the world ("this file exists", "this token hasn't expired", "this account has enough money"), which can stop being true after the parse. See [What Belongs In Types]({{< ref "type-driven-design/what-belongs-in-types" >}}#where-types-stop-matching-reality).
- **Every boundary is a boundary.** A value written to a database or a queue and read back is external data again. Either parse it again or decide explicitly to trust the store.
- **Type proliferation.** One type per established fact (`UnvalidatedOrder`, `ValidatedOrder`, `PricedOrder`) is the point of the approach, and *Domain Modeling Made Functional* ([PDF](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc)) does it deliberately. The price is conversion code between them.

## Library sources


- King 2019, *Parse, don't validate* -- the article this note is built on: parsing into `NonEmpty` instead of validating, parsing at the boundary, and shotgun parsing; on *The problem with validating*, *Parse at the boundary* and *Don't throw information away*
- King 2020, *Names are not type safety* -- intrinsic (constructive) versus extrinsic (encapsulation-based) safety from newtypes; on *Names are not type safety*
- [Noonan 2018](/sources/programming/functional-programming/noonan-2018-ghosts-of-departed-proofs.pdf.enc), *Ghosts of Departed Proofs (Functional Pearl)* ([doi:10.1145/3242744.3242755](https://doi.org/10.1145/3242744.3242755)) -- preconditions as phantom types on newtype wrappers, with the `sortBy` and `mergeBy` example; on *Evidence without runtime cost*
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition* -- chapter 1 on value classes, smart constructors, newtypes ("newtypes do not solve validation"), refinement types and runtime validation; on *Smart constructors and newtypes* and *Names are not type safety*
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles* -- chapter 12, "Signaling adversity": smart constructors that return `Maybe` or `Either`; on *Smart constructors and newtypes*
- [Pilquist et al. 2023](/sources/programming/scala/pilquist-2023-functional-programming-in-scala-2e.pdf.enc), *Functional Programming in Scala, 2nd Edition* -- chapter 4, errors as values with `Option` and `Either`, ending with accumulating errors and a `Validated` type; on *Where it gets harder*
- [Welsh et al. 2020](/sources/programming/scala/welsh-2020-scala-with-cats.pdf.enc), *Scala with Cats* -- chapter 10, a data-validation case study that combines checks and accumulates their errors; on *Where it gets harder*
- [Skinner 2023](/sources/programming/functional-programming/skinner-2023-effective-haskell.pdf.enc), *Effective Haskell* -- chapter 5 hides a type's constructor behind a module's exports to make a smart constructor; on *Smart constructors and newtypes*
- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional* -- workflow types that separate unvalidated from validated data; on *Where it gets harder*
