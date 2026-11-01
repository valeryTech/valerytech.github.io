---
draft: false
toc: true
title: "Types at the Boundary"
description: "Where the trust boundaries are, how domain types map to the shapes that cross them (DTOs, rows and messages), and what happens when those shapes change while old data stays where it was written."
linkTitle: "Types at the Boundary"
---

[Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) says to parse at the boundary and carry the result inward as a type. This note is about the boundary itself: where the trust boundaries are, how domain types are mapped to the shapes that cross them (DTOs, rows, messages), and what happens when those shapes change over time while old data stays where it was written.

The main sources are Wlaschin's chapters on serialization, persistence and evolution ([PDF](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), chapters 11 to 13) and Kleppmann's chapter on encoding and evolution ([PDF](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), chapter 5).

## Trust boundaries


Wlaschin (chapter 3, "Trust Boundaries and Validation") treats the edge of a bounded context as a trust boundary. Everything inside is trusted and valid; everything outside might not be. Each workflow gets two gates:

- **The input gate** always validates. An incoming `OrderDTO` can contain anything; after the gate, the `Order` domain object is known to be valid, and if validation fails the rest of the workflow doesn't run.
- **The output gate** has a different job: making sure private information doesn't leave the context. It may deliberately throw information away (a card number, an internal flag) when converting domain objects back to DTOs.

The output gate is the counterpart to [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}#dont-throw-information-away). Inside the context you keep every fact you've established; at the exit you choose which facts other contexts may see.

Two related DDD terms:

- **Contracts between contexts.** The events and DTOs a context publishes form a contract with the contexts that consume them (Wlaschin, chapter 3, "Contracts Between Bounded Contexts"). Who owns the contract depends on the relationship: a shared kernel is designed jointly, a consumer-driven contract is set by the consumer, a conformist downstream accepts whatever the upstream publishes.
- **Anti-corruption layer.** When a context consumes a model it doesn't control, an anti-corruption layer translates the foreign concepts into its own. Wlaschin is explicit that it's a translator, not primarily a validator.

## DTOs and serialization


Wlaschin (chapter 11, "Serialization") keeps domain types and serialization types separate. Data on the wire is deserialized into a **DTO** (data transfer object), a plain record of primitives that mirrors the wire format, and only then converted into domain types:

```text
JSON ──deserialize──▶ DTO ──toDomain──▶ domain type
                               (can fail)
```


The rules that follow:

- **Deserializing into a DTO should always succeed** unless the data is corrupt. All domain checks (a quantity in range, a product code that exists) happen in `toDomain`, inside the context, where errors can be reported properly.
- **Don't serialize domain types directly.** A serializer that writes a domain type's fields by reflection ties the wire format to the internal model, so every refactoring becomes a breaking change for other contexts. Keeping a DTO also keeps serializer attributes out of the domain.
- **Map each kind of domain type to a DTO shape** ("How to Translate Domain Types to DTOs"):
  - a single-case wrapper becomes its primitive;
  - an option becomes a nullable field;
  - a choice type becomes a record with a *tag* naming the case plus one field per case, all null except the one in use;
  - an enumeration-style choice can become an integer or a string, and the conversion back must handle values that aren't in the set.
- **Converting to a DTO always succeeds; converting from one returns a `Result`.** The asymmetry is the trust boundary in miniature.

An alternative design decodes JSON straight into refined domain types. Volpe ([PDF](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), chapter 5, "HTTP layer") does this with the Refined library's codecs, and an empty name in a request is rejected with a 400 response at decoding time. It saves a layer of types and mapping code, at the price of coupling the wire format to the domain model. A rule of thumb: decode directly where you own both ends and they change together; keep DTOs where other teams consume the format.

## The database is a boundary too


Data read back from your own database is external data again. Wlaschin (chapter 12, "Persistence") gives two options for the `toDomain` function that reads a row:

- **Treat the database as an untrusted source**: validate every field and return a `Result<Customer, _>`, as for any other input.
- **Trust it and panic if it's wrong**: assume the data was validated when written, and throw (his `panicOnError`) if it isn't, since bad data there means a bug or a corrupted store.

Either is defensible, as long as the choice is made on purpose. There's also a third option that's easy to fall into by accident. Płachta (PDF, chapter 6, "...but let's not trust the compiler too much!") parses a list of raw records into `Option`s and flattens the result: the code type-checks, but every record that fails to parse disappears without a trace. He calls this the best-effort strategy and contrasts it with all-or-nothing, where one bad record fails the whole parse. Which one is right is a domain decision, and the compiler won't make it for you; for rows loaded from your own database, silently dropping one is rarely what you want.

Choice types need a mapping to tables (Wlaschin, chapter 12, "Mapping Choice Types to Tables"). The two common ones are all cases in one table, with a tag column and nullable columns for each case's data, or one table per case. These are the same options used for mapping class hierarchies to relational tables.

The same chapter keeps the domain logic pure by having it return decisions as data. Instead of a function that reads an invoice, applies a payment and writes it back, the pure core returns a choice (`FullyPaid | PartiallyPaid`) and the code at the edge does the I/O for whichever case came back. This is [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#keep-effects-out-of-the-domain) applied to persistence.

## Evolving types


A type checked at compile time describes the data the current code writes. Persistent data and messages outlive that code. Kleppmann (chapter 5, "Dataflow Through Databases") puts it as *data outlives code*: after a deployment the application is entirely new, but a database still holds values written five years ago in an older format.

Two kinds of compatibility follow (chapter 5, "Encoding and Evolution"):

- **Backward compatibility**: newer code can read data written by older code. Usually manageable, because the new code's authors know the old format.
- **Forward compatibility**: older code can read data written by newer code. Harder, because the old code has to ignore additions it doesn't understand.

His schema evolution rules for Avro ("Schema evolution rules") translate directly into rules for domain types that are persisted or sent:

- **Add or remove only fields that have a default.** A new required field breaks backward compatibility (old data lacks it); removing a required field breaks forward compatibility (old readers expect it).
- **Nullability is a union.** In Avro a field that may be null is declared as a union with `null`, which is the same idea as `Option`: absence is an explicit case, not a property of every field.
- **Adding a case to a union is backward compatible but not forward compatible.** New code can read old data, but old code receiving the new case doesn't know what to do with it. For sum types that cross a boundary, this argues for an explicit `Unknown` case in the DTO, or for handling unrecognized tags, which is Wlaschin's enum rule above.

A strict decoder can also lose data. Kleppmann's figure 5-1 shows the case: new code adds a field and writes a record; old code reads the record into a model object that doesn't know the field, updates it, and writes it back, and the new field is gone. Parse, don't validate says to decode into precise types; forward compatibility says to keep what you didn't understand. For records that are read, modified and written back, the model needs a place for unknown fields, or the update has to be done without decoding the whole record.

Wlaschin's chapter 13 ("Evolving a Design and Keeping It Clean") adds the type-level view. When a requirement changes, the change starts in the domain types, and the compiler errors lead from there to every workflow step and DTO that has to change. Two of his modeling rules exist mainly for evolution: store the inputs to a business rule rather than its outputs, and keep independent statuses as separate types ([Illegal States Unrepresentable]({{< ref "type-driven-design/03-domain-modeling/illegal-states-unrepresentable" >}})). Bodner's warning about Go's `iota` enumerations ([PDF](/sources/programming/language-practice/bodner-2024-learning-go-2e.pdf.enc), chapter 7) is the same problem at the smallest scale: inserting a constant renumbers the ones after it, which silently changes the meaning of every value already stored.

Schemas in the database itself raise the static-or-dynamic question one level up: schema-on-write is static checking and schema-on-read is dynamic checking ([Dimensions Of Type Systems]({{< ref "type-driven-design/01-foundations/dimensions-of-type-systems" >}}#static-dynamic-and-gradual-checking)).

## Tolerant readers


Percival and Gregory ([PDF](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), appendix E, "Validation") push back on strict parsing for messages from other systems. Their starting point is Postel's law, "be liberal in what you accept, and conservative in what you emit", and its application to messages, the **tolerant reader** pattern:

- **Don't validate formats you don't own.** An allocation service that receives product codes (SKUs) from a procurement system shouldn't reject codes that don't match today's pattern. As far as allocation is concerned, a SKU is an identifier, so a string is the right type; the procurement team can change the format without breaking it.
- **Ignore fields you don't use.** A message schema that rejects extra keys breaks every time the sender adds a field.

They also split validation into three kinds, which line up with where the checks belong:

- **Syntax**: is the message well formed (the right fields, the right primitive types)? Checked at the edge, when the message is decoded.
- **Semantics**: does the message make sense (is the quantity positive, does the SKU exist)? Checked as preconditions in the handler.
- **Pragmatics**: is the action allowed in the current state of the domain (is there enough stock to allocate)? Enforced by the domain model itself.

This doesn't contradict parse, don't validate as much as it seems. The tolerant reader parses strictly what its own logic depends on and leaves the rest as opaque data. The sender's own rules about the format are the sender's to enforce; copying them into every consumer couples the consumers to a format they don't control. The question to ask of each check is whose invariant it protects.

## Library sources


- [Wlaschin 2018](/sources/programming/functional-programming/wlaschin-2018-domain-modeling-made-functional.pdf.enc), *Domain Modeling Made Functional* -- chapter 3, "Trust Boundaries and Validation", "Contracts Between Bounded Contexts" and "Anti-Corruption Layers"; chapter 11, "Serialization" (DTOs and how to translate domain types to them); chapter 12, "Persistence" (the database as an untrusted source, mapping choice types to tables, decisions as data); chapter 13, "Evolving a Design and Keeping It Clean"; on every section except *Tolerant readers*
- [Kleppmann et al. 2026](/sources/system-design/data-systems/kleppmann-2026-designing-data-intensive-applications-2nd-edition.pdf.enc), *Designing Data-Intensive Applications, 2nd Edition* -- chapter 5, "Encoding and Evolution": backward and forward compatibility, figure 5-1 on lost fields, "Schema evolution rules", "Dataflow Through Databases"; on *Evolving types*
- [Percival et al. 2020](/sources/software-engineering/architecture/percival-2020-architecture-patterns-with-python.pdf.enc), *Architecture Patterns with Python* -- appendix E, "Validation": syntax, semantics and pragmatics, Postel's law and the tolerant reader; on *Tolerant readers*
- [Volpe 2021](/sources/programming/scala/volpe-2021-practical-fp-in-scala-2e.pdf.enc), *Practical FP in Scala, 2nd Edition* -- chapter 5, "HTTP layer", decoding requests straight into refined types; on *DTOs and serialization*
- Płachta 2022, *Grokking Functional Programming* -- chapter 6, best-effort and all-or-nothing parsing of a list; on *The database is a boundary too*
- [Bodner 2024](/sources/programming/language-practice/bodner-2024-learning-go-2e.pdf.enc), *Learning Go, 2nd Edition* -- chapter 7, "iota Is for Enumerations--Sometimes"; on *Evolving types*
- [Allen et al. 2016](/sources/programming/functional-programming/allen-2016-haskell-programming-from-first-principles.pdf.enc), *Haskell Programming from First Principles* -- section 24.10, "Marshalling from an AST to a datatype": parse to structure, then unmarshal to meaning, and the reverse for output, shown with aeson's untyped `Value` and `FromJSON` instances; the Haskell form of the DTO two-step; on *DTOs and serialization*

Further reading:

- King 2019, *Parse, don't validate* -- "The power of parsing": aeson, optparse-applicative, persistent/postgresql-simple and servant as parsers at the program's edge, including values read back from a data store, on *DTOs and serialization* and *The database is a boundary too*; footnote 3 on authorizing before parsing, on *Trust boundaries*
- [Serrano Mena 2022](/sources/programming/functional-programming/serrano-mena-2022-haskell-almost-standard-libraries.pdf.enc), *Haskell: Almost Standard Libraries* -- chapter 8, "Serialization", section 8.1, "JSON": hand-written aeson instances, then generic `deriving (ToJSON, FromJSON)`, which ties JSON keys to field names; `deriveJSON` with `fieldLabelModifier` and `rejectUnknownFields = True` for a strict decoder, against the default that ignores extra keys; `deriving-aeson` with `DerivingVia`; on *DTOs and serialization* and *Tolerant readers*
