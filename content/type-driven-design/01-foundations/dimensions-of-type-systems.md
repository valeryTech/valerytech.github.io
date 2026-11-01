---
draft: false
toc: true
title: "Dimensions of Type Systems"
description: "The axes along which type systems differ: static, dynamic and gradual checking, safety and what \\\"strong\\\" means, and nominal versus structural equivalence."
linkTitle: "Dimensions"
---

The terminology varies, so it helps to separate a few dimensions:

- Static vs dynamic: when type errors are checked.
- Safe vs unsafe: whether the language protects its own abstractions. This is the useful core of "strong vs weak".
- Nominal vs structural: whether two types are the same because of their names or because of their shape.
- Inferred vs explicit: whether you have to write the types yourself.
- Expressive vs simple: how precisely the type system can describe valid programs.

And "strong typing" itself isn't necessarily the key property. Python, for example, is often described as strongly typed, but its checks happen mostly at runtime. Haskell, Rust, OCaml, Swift, Kotlin, and TypeScript occupy quite different points in this design space.

## Static, dynamic and gradual checking


Pierce suggests that "dynamically typed" should really be "dynamically checked": a dynamic language has run-time tags that distinguish a string from a number, but no types in his sense, since nothing is proved before the program runs. Harper ([PDF](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), section 21.4 "Untyped Means Uni-Typed" and chapter 22 "Dynamic Typing") goes further: a dynamic language is a static language with exactly one type, every value belongs to it, and the operations check the tags at run time. On that reading the usual opposition between static and dynamic typing is illusory; it's a question of how many types the checker distinguishes.

Kleppmann ([PDF](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), chapter 3, "Schema flexibility in the document model") makes the same comparison for databases. A "schemaless" document store still has a schema, but it's implicit in the code that reads the data (schema-on-read), as opposed to enforced when data is written (schema-on-write). Schema-on-read is like dynamic checking and schema-on-write like static checking, and he calls neither a clear winner. The cost of schema-on-read is that every reader has to handle every old format ever written.

**Gradual typing** mixes the two in one program. In Siek and Taha's original design ([PDF](/sources/programming/language-theory/siek-2006-gradual-typing-for-functional-languages.pdf.enc)), an unknown type `?` marks the dynamic parts. A fully annotated program catches all type errors at compile time, and where typed and untyped code meet, the compiler inserts casts, so a program fails with a cast error at the boundary rather than with a type error deep inside typed code. The dynamic parts cost only where they're used ("pay-as-you-go").

Krishnamurthi ("Gradual Typing") separates two schools:

- **Micro gradual typing** lets you annotate any subset of variables, as in Python and TypeScript. It's convenient, but it's unclear what soundness means once typed and untyped code mix within a single expression.
- **Macro gradual typing** has a typed and an untyped sibling language that share a runtime, as in Typed Racket. Values are checked when they cross between modules, which gives a clear guarantee and blame for whoever broke it.

In practice the familiar gradual languages are micro and *erased*. Python's type hints, Ramalho points out ([PDF](/sources/programming/language-theory/ramalho-2022-fluent-python-2e.pdf.enc), chapter 8, "About Gradual Typing"), don't catch type errors at runtime and don't make code faster: they're read by external checkers, linters and IDEs, and ignored by the interpreter. TypeScript erases its types the same way. So a value annotated `int` can still arrive as a string from an untyped caller or from JSON. That's one reason [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) matters more, not less, in these languages: the boundary check is the only check that actually runs.

## Safety, and what "strong" means


Pierce's definition of a safe language is one that protects its own abstractions: you can't read past the end of an array, forge a pointer, or treat a closure as an integer. Safety is a separate question from when checking happens:

```text
                 statically checked        dynamically checked
safe             ML, Haskell, Java         Lisp, Scheme, Python
unsafe           C, C++
```


(Pierce's table, with Python in place of Perl and PostScript.) The empty corner is empty because once a language checks some operations at run time, checking all of them costs little.

"Strong typing" is usually a loose name for the safe row. Sebesta ([PDF](/sources/programming/language-theory/sebesta-2019-concepts-of-programming-languages-12e.pdf.enc), section 6.14 "Strong Typing") gives a precise version: a language is strongly typed if type errors are always detected, at compile time or run time. By that test C and C++ aren't strongly typed, because their unions aren't checked, and implicit coercions (`"5" + 1` in JavaScript) weaken a language because they turn would-be type errors into silent conversions.

## Nominal and structural equivalence


When are two types the same? Sebesta (section 6.15 "Type Equivalence") gives the two standard answers:

- **Name equivalence**: two types are the same only if they have the same name. A `Celsius` and a `Fahrenheit` that both wrap a float are different types, and mixing them is an error.
- **Structure equivalence**: two types are the same if they have the same shape. `Celsius` and `Fahrenheit` would be interchangeable, which is exactly the bug you wanted to prevent.

Every newtype in this section relies on name equivalence. Sebesta's examples show how old the idea is: Ada's derived type `type Celsius is new Float` is a newtype, and Ada's `subtype Small is Integer range 0..99` is a range-constrained type checked at run time, an early relative of [refinement types]({{< ref "type-driven-design/05-stronger-type-systems/refinement-types" >}}). C's `typedef` is the counterexample: it creates only an alias, so it gives no protection.

Pierce (section 19.3 "Nominal and Structural Type Systems") adds a practical reason most mainstream languages are nominal: the type names double as run-time tags, which makes casts, `instanceof` and pattern matching cheap. Structural systems are more flexible and closer to the mathematics. Ramalho (chapter 13, "The Typing Map") lays out the whole space as a grid:

```text
                  structural                      nominal
runtime check     duck typing                     goose typing
                  (any object with .quack())      (isinstance against an ABC)
static check      static duck typing              static typing
                  (typing.Protocol, Go interfaces) (classes and declared interfaces)
```


Scala supports both, with nominal as the default; see [Scala Type System]({{< ref "type-driven-design/05-stronger-type-systems/scala-type-system" >}}#nominal-and-structural-subtyping).

## Library sources


- [Pierce 2002](/sources/programming/language-theory/pierce-2002-types-and-programming-languages.pdf.enc), *Types and Programming Languages* -- section 1.2 on language safety, with the table of safe and unsafe, statically and dynamically checked languages; section 19.3 on nominal and structural type systems; on *Safety, and what "strong" means* and *Nominal and structural equivalence*
- [Krishnamurthi 2025](/sources/programming/language-theory/krishnamurthi-2025-programming-languages-application-interpretation-v3.pdf.enc), *Programming Languages: Application and Interpretation*, version 3 -- "Gradual Typing": micro and macro gradual typing; on *Static, dynamic and gradual checking*
- [Sebesta 2019](/sources/programming/language-theory/sebesta-2019-concepts-of-programming-languages-12e.pdf.enc), *Concepts of Programming Languages, 12th Edition* -- section 6.14 "Strong Typing" and section 6.15 "Type Equivalence" (name and structure equivalence, Ada derived types and subtypes); on *Safety, and what "strong" means* and *Nominal and structural equivalence*
- [Harper 2016](/sources/programming/language-theory/harper-2016-practical-foundations-programming-languages-2e.pdf.enc), *Practical Foundations for Programming Languages, 2nd Edition* -- section 21.4 "Untyped Means Uni-Typed" and chapter 22 "Dynamic Typing"; on *Static, dynamic and gradual checking*
- [Siek et al. 2006](/sources/programming/language-theory/siek-2006-gradual-typing-for-functional-languages.pdf.enc), *Gradual Typing for Functional Languages* -- the unknown type, consistency instead of equality, casts at the typed-untyped boundary; on *Static, dynamic and gradual checking*
- [Ramalho 2022](/sources/programming/language-theory/ramalho-2022-fluent-python-2e.pdf.enc), *Fluent Python, 2nd Edition* -- chapter 8, "About Gradual Typing"; chapter 13, "The Typing Map"; on *Static, dynamic and gradual checking* and *Nominal and structural equivalence*
- [Kleppmann et al. 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, 2nd Edition* -- chapter 3, "Schema flexibility in the document model": schema-on-read and schema-on-write as dynamic and static checking; on *Static, dynamic and gradual checking*

Further reading:

- [Maguire 2018](/sources/programming/functional-programming/maguire-2018-thinking-with-types.pdf.enc), *Thinking with Types: Type-Level Programming in Haskell* -- section 7.1.1, "Dynamic Types": a `Dynamic` existential over `Typeable`, a Python-style `+` built on it, and the conclusion that a dynamic language has a single type; on *Static, dynamic and gradual checking*
