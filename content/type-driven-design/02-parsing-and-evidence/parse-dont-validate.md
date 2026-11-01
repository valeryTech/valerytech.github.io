---
draft: false
toc: true
title: "Parse, Don't Validate"
description: "Alexis King's principle: parse input at the boundary into types that keep what was checked, instead of validating and passing on weak types. Shotgun parsing, partial functions made total, and where parsing gets harder."
linkTitle: "Parse, Don't Validate"
---

Alexis King's short article **"Parse, don't validate"** (HTML) captures one of the central practical ideas of type-driven design. ([Lexi Lambda](https://lexi-lambda.github.io/ "Alexis King's Blog"))

The note follows the argument in three steps: what's wrong with validating, the partial functions underneath it, and where to parse. How much a parsed type actually guarantees is in [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}), and what the boundary looks like in a larger system (DTOs, databases, schema changes) is in [Types At The Boundary]({{< ref "type-driven-design/02-parsing-and-evidence/types-at-the-boundary" >}}). Part of [Parsing and evidence]({{< ref "type-driven-design/02-parsing-and-evidence" >}}).

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

The article explicitly distinguishes checking a property from producing a more precise type that preserves what you learned from the check. Its own example is `[a] -> NonEmpty a`. The email example has the same shape (the check happens when converting the value, and the resulting type carries the result through the program), but it gives a weaker guarantee, as King's follow-up article argues: a `NonEmpty` has no empty value at all, while an `Email` is a `string` that some function vouched for. See [Strength Of Evidence]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}).

King names the alternative: **shotgun parsing**, a term from language-theoretic security for parsing and validation code mixed into processing code, a cloud of checks fired at the input in the hope that one of them catches each bad case. The danger is that an error discovered late arrives after part of the invalid input has already been acted on, so the program's state is hard to predict. Even when all the validation happens up front, a validating design makes it hard to know whether it did: every function downstream has to allow for the "impossible" case anyway. Parsing splits the program into two phases instead, a parse phase that can fail and an execute phase that works only on parsed data.

## Partial functions made total


Underneath the slogan is a question about partial functions. Haskell's `head :: [a] -> a` has no answer for the empty list, so it crashes. King's section "Turning partial functions total" gives the two ways to fix it:

- **Weaken the result**: `head :: [a] -> Maybe a`. The function is now total, but every caller has to handle `Nothing`, including callers who already know the list isn't empty.
- **Strengthen the argument**: `head :: NonEmpty a -> a`. The function is total and returns a plain `a`, and the obligation moves to whoever builds the `NonEmpty`.

King calls the second better on all counts, since you can always recover the first from it but not the other way round. Wlaschin ([PDF](/sources/3165b993e939de6a47737a073d7633a4.bin), chapter 8, "Total Functions") makes the same split with division: either restrict the input (`NonZeroInteger`) or extend the output (an `option`).

Noonan ([PDF](/sources/82bc6785596e6b9c5b3e2d9a2b2e9c58.bin), sections 1.2, "Leading the User into Temptation", and 1.3, "Who Is to Blame?") explains why weakening the result goes wrong in practice: a user who has already checked that a key exists is forced to handle a missing-key case that can't happen, so they reach for `fromJust`. He found over 2,000 uses of `fromJust` applied to `Data.Map.lookup` in a snapshot of Hackage. His fix is the same: restrict the domain instead of extending the codomain. He's careful not to call one signature better in general, though (section 4.1, "Designing for the User's State of Knowledge"). If the caller genuinely doesn't know whether the key is there, the `Maybe` result says exactly that. If they already know, the type should let them say so.

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
- **Follow the type errors.** Her example is `checkNoDuplicateKeys :: [(k, v)] -> m ()`. Change the function that needs the pairs to accept a `Map` instead, and its callers stop compiling; fix them by passing the `Map` up the call chain until you reach the place where the list was created. That's where the check belongs, now returning `m (Map k v)`.
- **Treat functions that return `m ()` with suspicion.** A function whose main effect is to throw an error is a validator that throws away what it learned.
- **Parsing in several passes is fine.** Avoiding shotgun parsing means not acting on input before it's fully parsed, not that one part can't decide how to parse another.
- **Avoid denormalized data.** The same fact stored in two places creates an easy illegal state: the copies disagreeing.

The system's edge isn't the only boundary. Płachta (PDF, chapter 6) defines parsing as turning raw data into the domain model and includes data from your own database, and Wlaschin (chapter 12) treats a database read as an untrusted source too. Wlaschin's chapter 3 adds the other direction: the output side of a bounded context deliberately drops information, such as card numbers, that must not leave it. Both are covered in [Types At The Boundary]({{< ref "type-driven-design/02-parsing-and-evidence/types-at-the-boundary" >}}).

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

Harper ([PDF](/sources/844b46f25205adfc27e60dec253a34fc.bin), section 25.2) calls this **boolean blindness**: a boolean is a single bit, and the knowledge of *which* proposition it answers lives only in the programmer's head. `isNonEmpty(xs)` returning `true` tells the compiler nothing about `xs`.

TypeScript has a middle ground: a type predicate is a boolean that does carry type information.

```ts
function isNonEmpty<T>(xs: T[]): xs is [T, ...T[]] {
    return xs.length > 0
}

if (isNonEmpty(xs)) {
    xs[0]   // xs: [T, ...T[]] here
}
```


The catch is scope. The knowledge lives only inside the `if` block; it isn't stored in a value you can return, put in a record or pass to another module. A parsed `NonEmpty<T>` carries the fact wherever the value goes. Narrowing is enough for a local check and parsing is better for a fact the rest of the program relies on. Note too that TypeScript trusts the predicate's body: a buggy `isNonEmpty` that always returns `true` still narrows. Refinement type checkers solve the same problem by giving the boolean a refined type that states which proposition it answers ([Refinement Types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}}#how-the-checking-works)).

## Where it gets harder


Parse, don't validate is close to universally good advice, but it has rough edges:

- **Reporting errors.** A parser that stops at the first error suits a pipeline, not a form. To report every bad field at once you need error accumulation (applicative validation, such as cats' `Validated`); Wlaschin (chapter 10, "Composing in Parallel with Applicatives") names applicatives as the way to collect every error but leaves the implementation out, and his own `Result.sequence` stops at the first.
- **Facts that expire.** Parsing proves something about the value at that moment. That holds for facts about an immutable value itself ("this string is an email"), but not for facts about the world ("this file exists", "this token hasn't expired", "this account has enough money"), which can stop being true after the parse, nor for a mutable object that someone changes later. See [What Belongs In Types]({{< ref "type-driven-design/01-foundations/what-belongs-in-types" >}}#where-types-stop-matching-reality).
- **Every boundary is a boundary.** A value written to a database or a queue and read back is external data again. Either parse it again or decide explicitly to trust the store. See [Types At The Boundary]({{< ref "type-driven-design/02-parsing-and-evidence/types-at-the-boundary" >}}#the-database-is-a-boundary-too).
- **Strictness versus tolerance.** For a format you consume but don't own, strict parsing can be the wrong default. Percival and Gregory ([PDF](/sources/1b11fd9a1f1b2a8156524d833d153d29.bin), appendix E, "Postel's Law and the Tolerant Reader Pattern") argue that a service receiving product codes from another system should treat them as opaque strings rather than reject codes that don't match today's format, and should ignore fields it doesn't use. The two ideas fit together if you parse only what you use: be strict about the fields your logic depends on, and tolerant about the rest. See [Types At The Boundary]({{< ref "type-driven-design/02-parsing-and-evidence/types-at-the-boundary" >}}#tolerant-readers).
- **Type proliferation.** One type per established fact (`UnvalidatedOrder`, `ValidatedOrder`, `PricedOrder`) is the point of the approach, and *Domain Modeling Made Functional* ([PDF](/sources/3165b993e939de6a47737a073d7633a4.bin)) does it deliberately. The price is conversion code between them.

## Library sources


- King 2019, *Parse, don't validate* -- the article this note is built on: turning partial functions total, the danger of validation (shotgun parsing), and the practical advice on where to parse; on *The problem with validating*, *Partial functions made total*, *Parse at the boundary* and *Don't throw information away*
- [Noonan 2018](/sources/82bc6785596e6b9c5b3e2d9a2b2e9c58.bin), *Ghosts of Departed Proofs (Functional Pearl)* ([doi:10.1145/3242744.3242755](https://doi.org/10.1145/3242744.3242755)): sections 1.2, "Leading the User into Temptation", and 1.3, "Who Is to Blame?", on `Maybe` results, and 4.1 on the user's state of knowledge, on *Partial functions made total*; section 1.1, "Common Idioms for Handling Pre-conditions", on the costs of restricting input types: a `NonEmpty` duplicates list functions such as `length` and can't easily express preconditions that relate several inputs (two lists of the same length); on *Where it gets harder*
- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional* -- chapter 8, "Total Functions"; chapter 10, applicatives named for error-collecting validation; workflow types that separate unvalidated from validated data; on *Partial functions made total* and *Where it gets harder*
- [Harper 2016](/sources/844b46f25205adfc27e60dec253a34fc.bin), *Practical Foundations for Programming Languages, 2nd Edition* -- section 25.2, "Boolean Blindness"; on *Don't throw information away*
- [Percival et al. 2020](/sources/1b11fd9a1f1b2a8156524d833d153d29.bin), *Architecture Patterns with Python* -- appendix E, validation split into syntax, semantics and pragmatics, and the tolerant reader; on *Where it gets harder*
- Płachta 2022, *Grokking Functional Programming* -- chapter 6, parsing raw data, including your own database's, into the domain model; on *Parse at the boundary*
- [Pilquist et al. 2023](/sources/075d81d6390bbb592aa1a8ba0a5f967d.bin), *Functional Programming in Scala, 2nd Edition* -- chapter 4, errors as values with `Option` and `Either`, ending with accumulating errors and a `Validated` type; on *Where it gets harder*
- [Welsh et al. 2020](/sources/08cab18bbc8a17a6885874831fe8c431.bin), *Scala with Cats* -- chapter 10, a data-validation case study that combines checks and accumulates their errors; on *Where it gets harder*
- [Allen et al. 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles* -- section 24.10, "Marshalling from an AST to a datatype": parsing narrows the cardinality of the input; leaving data as text is a common mistake; the two pipelines Text -> Structure -> Meaning and back; on *Parse at the boundary*
- [Serrano Mena 2022](/sources/5c1001bd2c4b75b2ff640e61358fc71a.bin), *Haskell: Almost Standard Libraries* -- chapter 9, section 9.1, "Applicative and Alternative": a predicate `validPerson :: Person -> Bool` replaced by `String -> String -> Int -> Maybe Person`, which takes raw input and returns the constructed value, composed applicatively; on *The problem with validating*

Further reading:

- [Skinner 2023](/sources/47da28f54846d377221bfd47a62316ff.bin), *Effective Haskell* -- chapter 5, section "Choosing What to Export", subsection "Smart Constructors": `minimum :: SortedList -> Int` uses `head` safely because the only way to build a `SortedList` is `makeSortedList :: [Int] -> Maybe SortedList`; on *Partial functions made total*
