---
draft: false
toc: true
title: "Types at the Boundary"
description: "Where the trust boundaries are, how domain types map to the shapes that cross them (DTOs, rows and messages), and what happens when those shapes change while old data stays where it was written."
linkTitle: "Types at the Boundary"
---

[Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}) says to parse at the boundary and carry the result inward as a type. This note is about the boundary itself: where the trust boundaries are, how domain types are mapped to the shapes that cross them (DTOs, rows, messages), and what happens when those shapes change over time while old data stays where it was written.

The main sources are Wlaschin's chapters on serialization, persistence and evolution ([PDF](/sources/3165b993e939de6a47737a073d7633a4.bin), chapters 11 to 13), Kleppmann's chapter on encoding and evolution ([PDF](/sources/f639f3efb30ff1f78d5f3bec89441c6e.bin), chapter 5), and Helland's paper on inside versus outside data ([PDF](/sources/3e30fe8b3ecfe42154d4ddb719eb9d52.bin)).

## Trust boundaries


Wlaschin (chapter 3, "Trust Boundaries and Validation") treats the edge of a bounded context as a trust boundary. Everything inside is trusted and valid; everything outside might not be. Each workflow gets two gates:

- **The input gate** always validates. An incoming `OrderDTO` can contain anything; after the gate, the `Order` domain object is known to be valid, and if validation fails the rest of the workflow doesn't run.
- **The output gate** has a different job: making sure private information doesn't leave the context. It may deliberately throw information away (a card number, an internal flag) when converting domain objects back to DTOs.

The output gate is the counterpart to [Parse Dont Validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}#dont-throw-information-away). Inside the context you keep every fact you've established; at the exit you choose which facts other contexts may see. Helland ([PDF](/sources/3e30fe8b3ecfe42154d4ddb719eb9d52.bin), sections 1.2 to 1.5 and 2) gives the systems reason underneath both gates: services that do not share ACID transactions bound trust by encapsulating both changes and reads behind application logic (an ATM exposes deposit and withdrawal, never raw queries on the bank's tables) and exporting only sanitized subsets of their private *inside data*. Once data crosses that boundary in a message, it becomes *outside data*: immutable, uniquely identified, unlocked, and living in "then" rather than the sender's transactional "now".

Related DDD context-mapping terms (Wlaschin, chapter 3, "Contracts Between Bounded Contexts"; Vernon, [PDF](/sources/b38f90837dd74283bea4b629417e8718.bin), chapter 4, "Strategic Design with Context Mapping"; Khononov, [PDF](/sources/deaedd205f4448340ac88de7be2f3116.bin), chapter 4, "Integrating Bounded Contexts", and chapter 9, "Communication Patterns"):

- **Contracts between contexts.** The events and DTOs a context publishes form a contract with the contexts that consume them. Who owns the contract depends on the relationship: a shared kernel is designed jointly, a consumer-driven contract is set by the consumer, a conformist downstream accepts whatever the upstream publishes.
- **Anti-corruption layer.** When a downstream context consumes a model it doesn't control, an anti-corruption layer translates the foreign concepts into its own. Wlaschin is explicit that it's a translator, not primarily a validator.
- **Open-host service and published language.** Khononov describes an open-host service as the upstream reversal of an anti-corruption layer: the supplier decouples its internal model from a public **published language** (JSON Schema, Avro, Protobuf) -- and can expose multiple versions at once -- so internal refactoring doesn't force downstream consumers into a conformist lockstep. On event streams, Khononov (chapter 15, "Use public and private events") and Stopford ([PDF](/sources/49392a19e62da54ab6b415fd70df1590.bin), chapter 13, "Segregating Public and Private Topics") apply the same rule by keeping internal event-sourcing events on private topics and publishing narrower public events for external consumers.

## DTOs and serialization


Wlaschin (chapter 11, "Serialization") keeps domain types and serialization types separate. Data on the wire is deserialized into a **DTO** (data transfer object), a plain record of primitives that mirrors the wire format, and only then converted into domain types:

```text
JSON ──deserialize──▶ DTO ──toDomain──▶ domain type
                               (can fail)
```


The rules that follow:

- **Deserializing into a DTO should always succeed** unless the data is corrupt. All domain checks (a quantity in range, a product code that exists) happen in `toDomain`, inside the context, where errors can be reported properly.
- **Don't serialize domain types directly.** A serializer that writes a domain type's fields by reflection ties the wire format to the internal model, so every refactoring becomes a breaking change for other contexts. Keeping a DTO also keeps serializer attributes out of the domain. Vernon (chapter 4, "RESTful HTTP" and "Are Domain Event Consumers Conformists?") applies the same separation to HTTP and messaging: design REST resources synthetically around client use cases rather than mirroring internal aggregates, and have event consumers parse the event's schema rather than importing the publisher's classes. Under Hyrum's law (Winters, Manshreck and Wright, [PDF](/sources/cdc8156a74161ef8b6f12b1e2896c4d7.bin), chapter 1, "Hyrum's Law"; Milanovic, [PDF](/sources/75138c5368f6c8cdd895918f3a141294.bin), chapter 5), with enough consumers every observable detail of a payload -- field names, key ordering, accidental flags -- becomes someone's dependency regardless of the written contract.
- **Map each kind of domain type to a DTO shape** ("How to Translate Domain Types to DTOs"):
  - a single-case wrapper becomes its primitive;
  - an option becomes a nullable field;
  - a choice type becomes a record with a *tag* naming the case plus one field per case, all null except the one in use;
  - an enumeration-style choice can become an integer or a string, and the conversion back must handle values that aren't in the set.
- **Converting to a DTO always succeeds; converting from one returns a `Result`.** The asymmetry is the trust boundary in miniature.

An alternative design decodes JSON straight into refined domain types. Volpe ([PDF](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), chapter 5, "HTTP layer") does this with the Refined library's codecs, and an empty name in a request is rejected with a 400 response at decoding time. It saves a layer of types and mapping code, at the price of coupling the wire format to the domain model. A rule of thumb: decode directly where you own both ends and they change together; keep DTOs where other teams consume the format.

## The database is a boundary too


Data read back from your own database is external data again. Wlaschin (chapter 12, "Persistence") gives two options for the `toDomain` function that reads a row:

- **Treat the database as an untrusted source**: validate every field and return a `Result<Customer, _>`, as for any other input.
- **Trust it and panic if it's wrong**: assume the data was validated when written, and throw (his `panicOnError`) if it isn't, since bad data there means a bug or a corrupted store.

Either is defensible, as long as the choice is made on purpose. There's also a third option that's easy to fall into by accident. Płachta (PDF, chapter 6, "...but let's not trust the compiler too much!") parses a list of raw records into `Option`s and flattens the result: the code type-checks, but every record that fails to parse disappears without a trace. He calls this the best-effort strategy and contrasts it with all-or-nothing, where one bad record fails the whole parse. Which one is right is a domain decision, and the compiler won't make it for you; for rows loaded from your own database, silently dropping one is rarely what you want.

Choice types need a mapping to tables (Wlaschin, chapter 12, "Mapping Choice Types to Tables"). The two common ones are all cases in one table, with a tag column and nullable columns for each case's data, or one table per case. These are the same options used for mapping class hierarchies to relational tables.

The same chapter keeps the domain logic pure by having it return decisions as data. Instead of a function that reads an invoice, applies a payment and writes it back, the pure core returns a choice (`FullyPaid | PartiallyPaid`) and the code at the edge does the I/O for whichever case came back. This is [Functional Domain Modeling]({{< ref "type-driven-design/04-architecture/functional-domain-modeling" >}}#keep-effects-out-of-the-domain) applied to persistence.

Parsons ([PDF](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), chapter 18, "Databases", sections 18.1, "Separate Database Types", and 18.3, "Access Patterns") shows what breaks when one `User` record tries to represent the domain concept, the JSON API shape and the SQL row together: database-assigned fields (`id`, `createdAt`) become `Maybe` so API `POST`s can omit them, DB readers reach for `fromJust` because rows always carry them, and an API value passed into the wrong helper crashes at runtime, while normalized child tables (`Dog`) pull against nested API fields (`dogs :: [Dog]`). Type parameters and Higher-Kinded Data (`UserF f`) wrap every field uniformly without adding or dropping per-boundary fields, so he argues for separate plain types (`User`, `ApiUser`, `DbUser`) plus dedicated write types (`CreateUser`, `UserUpdate`) -- noting that accepting a whole `User` record for updates also invites mass-assignment bugs such as a client setting `isAdmin = True`. Helland (sections 6.4 to 6.7, "The Ruling Triumvirate of Data Representations") explains why the three representations resist collapsing into one: objects and abstract domain types encapsulate data to enforce rules, SQL is anti-encapsulation within one bounded schema so anything can be joined with anything, and XML/messages are anti-encapsulation with open schemas for independent sharing -- each model's strength is simultaneously its weakness.

## Evolving types


A type checked at compile time describes the data the current code writes. Persistent data and messages outlive that code. Kleppmann (chapter 5, "Dataflow Through Databases") puts it as *data outlives code*: after a deployment the application is entirely new, but a database still holds values written five years ago in an older format.

Two kinds of compatibility follow (chapter 5, "Encoding and Evolution"):

- **Backward compatibility**: newer code can read data written by older code. Usually manageable, because the new code's authors know the old format.
- **Forward compatibility**: older code can read data written by newer code. Harder, because the old code has to ignore additions it doesn't understand.

His schema evolution rules for Avro ("Schema evolution rules") translate directly into rules for domain types that are persisted or sent:

- **Add or remove only fields that have a default.** A new required field breaks backward compatibility (old data lacks it); removing a required field breaks forward compatibility (old readers expect it).
- **Nullability is a union.** In Avro a field that may be null is declared as a union with `null`, which is the same idea as `Option`: absence is an explicit case, not a property of every field.
- **Adding a case to a union is backward compatible but not forward compatible.** New code can read old data, but old code receiving the new case doesn't know what to do with it. For sum types that cross a boundary, this argues for an explicit `Unknown` case in the DTO, or for handling unrecognized tags, which is Wlaschin's enum rule above.

Bellemare ([PDF](/sources/02ddb620881545eae08cdcbddbe35363.bin), chapter 3, "Communication and Data Contracts", "Use the Narrowest Data Types" and "Keep Events Single-Purpose") adds two companion rules for event schemas: use narrow schema types rather than stringly-typed numbers or pseudo-enums (relying on Avro and Protobuf's unknown-enum handling when cases grow), and avoid overloading one generic event (`ProductEngagement` with type tags and nullable fields such as `watchedPreview` and `pageId`) instead of separate single-purpose event schemas (`MovieClick`, `BookBookmark`). When a breaking schema change cannot be avoided, Stopford (chapter 13, "Handling Schema Change and Breaking Backward Compatibility") runs a *Dual Schema Upgrade Window* with `orders-v1` and `orders-v2` topics side by side -- via dual writes or a stream converter from offset 0 -- until every consumer migrates.

A strict decoder can also lose data. Kleppmann's figure 5-1 shows the case: new code adds a field and writes a record; old code reads the record into a model object that doesn't know the field, updates it, and writes it back, and the new field is gone. Parse, don't validate says to decode into precise types; forward compatibility says to keep what you didn't understand. For records that are read, modified and written back, the model needs a place for unknown fields, or the update has to be done without decoding the whole record. Helland (section 5.3, "Extensibility versus Shredding") describes the database counterpart as *partial shredding*: when extensible incoming messages are copied into SQL, shred the known, regular fields into relational columns for querying and retain the unparsed message alongside so unexpected extensions aren't lost.

Wlaschin's chapter 13 ("Evolving a Design and Keeping It Clean") adds the type-level view. When a requirement changes, the change starts in the domain types, and the compiler errors lead from there to every workflow step and DTO that has to change. Two of his modeling rules exist mainly for evolution: store the inputs to a business rule rather than its outputs, and keep independent statuses as separate types ([Illegal States Unrepresentable]({{< ref "type-driven-design/03-domain-modeling/illegal-states-unrepresentable" >}})). Bodner's warning about Go's `iota` enumerations ([PDF](/sources/9c094741f6655c74e9b828ed1b091426.bin), chapter 7) is the same problem at the smallest scale: inserting a constant renumbers the ones after it, which silently changes the meaning of every value already stored. Parsons (chapter 15, "Growing Pains", section 15.2, "Avoiding Breaking Changes") traces the parallel problem across Haskell module boundaries: exposing a record's constructor makes splitting `name` into `firstName` and `lastName` break every positional or wildcard match, whereas hiding the constructor behind smart constructors and accessors -- or bridging old shapes with `PatternSynonyms`, as GHC's `base` did when `ErrorCall` gained a call-stack string -- keeps callers compiling. Hiding sum-type constructors behind projections (`Animal -> Maybe Bird`) allows adding cases compatibly only by giving up exhaustiveness checking, the compile-time dual of the wire-format union rule above.

Schemas in the database itself raise the static-or-dynamic question one level up: schema-on-write is static checking and schema-on-read is dynamic checking ([Dimensions Of Type Systems]({{< ref "type-driven-design/01-foundations/dimensions-of-type-systems" >}}#static-dynamic-and-gradual-checking)).

## Tolerant readers


Percival and Gregory ([PDF](/sources/1b11fd9a1f1b2a8156524d833d153d29.bin), appendix E, "Validation") push back on strict parsing for messages from other systems. Their starting point is Postel's law, "be liberal in what you accept, and conservative in what you emit", and its application to messages, the **tolerant reader** pattern:

- **Don't validate formats you don't own.** An allocation service that receives product codes (SKUs) from a procurement system shouldn't reject codes that don't match today's pattern. As far as allocation is concerned, a SKU is an identifier, so a string is the right type; the procurement team can change the format without breaking it.
- **Ignore fields you don't use.** A message schema that rejects extra keys breaks every time the sender adds a field.

They also split validation into three kinds, which line up with where the checks belong:

- **Syntax**: is the message well formed (the right fields, the right primitive types)? Checked at the edge, when the message is decoded.
- **Semantics**: does the message make sense (is the quantity positive, does the SKU exist)? Checked as preconditions in the handler.
- **Pragmatics**: is the action allowed in the current state of the domain (is there enough stock to allocate)? Enforced by the domain model itself.

This doesn't contradict parse, don't validate as much as it seems. The tolerant reader parses strictly what its own logic depends on and leaves the rest as opaque data. The sender's own rules about the format are the sender's to enforce; copying them into every consumer couples the consumers to a format they don't control. Conversely, Milanovic (chapter 26, "Postel's Law (The Robustness Principle)") notes the modern pushback against unbounded tolerance: forgiving malformed syntax or producer bugs lets quirks harden into de facto standards and creates security ambiguities when two layers guess differently at bad input. On an immutable event log where a corrupt or semantically bad message has already been written, Stopford (chapter 13, "Handling Unreadable Messages") routes unreadable records to a separate error topic for inspection and replay rather than blocking the partition or dropping them silently. The question to ask of each check is whose invariant it protects.

## Library sources


- [Wlaschin 2018](/sources/3165b993e939de6a47737a073d7633a4.bin), *Domain Modeling Made Functional* -- chapter 3, "Trust Boundaries and Validation", "Contracts Between Bounded Contexts" and "Anti-Corruption Layers"; chapter 11, "Serialization" (DTOs and how to translate domain types to them); chapter 12, "Persistence" (the database as an untrusted source, mapping choice types to tables, decisions as data); chapter 13, "Evolving a Design and Keeping It Clean"; on every section except *Tolerant readers*
- [Kleppmann et al. 2026](/sources/f639f3efb30ff1f78d5f3bec89441c6e.bin), *Designing Data-Intensive Applications, 2nd Edition* -- chapter 5, "Encoding and Evolution": backward and forward compatibility, figure 5-1 on lost fields, "Schema evolution rules", "Dataflow Through Databases"; on *Evolving types*
- [Helland 2005](/sources/3e30fe8b3ecfe42154d4ddb719eb9d52.bin), *Data on the Outside Versus Data on the Inside* -- sections 1.2 to 1.5 on bounding trust by encapsulating both changes and reads and exporting sanitized subsets; section 2 on inside transactional "now" versus outside "then"; section 3 on immutable, versioned messages; section 5.3, "Extensibility versus Shredding" (partial shredding); sections 6.4 to 6.7, "The Ruling Triumvirate of Data Representations" (SQL, XML and Objects); on *Trust boundaries*, *The database is a boundary too* and *Evolving types*
- [Parsons 2023](/sources/a7e65830e1c1f72da8b7f5093393138c.bin), *Production Haskell* -- chapter 15, "Growing Pains", section 15.2, "Avoiding Breaking Changes" (hiding record constructors, the trade-off between sum-type extensibility and exhaustiveness, and `PatternSynonyms` for `ErrorCall`); chapter 18, "Databases", sections 18.1, "Separate Database Types" (`User`, `ApiUser`, `DbUser` versus `Maybe`/`fromJust`, type parameters and HKD), and 18.3, "Access Patterns" (`CreateUser`, mass-assignment `isAdmin` risks on whole-record updates, and `UserUpdate` actions); on *The database is a boundary too* and *Evolving types*
- [Vernon 2016](/sources/b38f90837dd74283bea4b629417e8718.bin), *Domain-Driven Design Distilled* -- chapter 4, "Strategic Design with Context Mapping": Conformist, Anticorruption Layer, Open Host Service and Published Language; synthetic client-driven REST resources rather than exposing aggregates, and event consumers parsing event schemas rather than importing publisher classes; on *Trust boundaries* and *DTOs and serialization*
- [Khononov 2021](/sources/deaedd205f4448340ac88de7be2f3116.bin), *Learning Domain-Driven Design* -- chapter 4, "Integrating Bounded Contexts" (Conformist, Anticorruption Layer, and Open-Host Service + Published Language as the upstream reversal of an ACL, exposing multiple versions); chapter 9, "Communication Patterns" (stateless and stateful model translation); chapter 15, "Event-Driven Architecture", "Use public and private events"; on *Trust boundaries*
- [Bellemare 2020](/sources/02ddb620881545eae08cdcbddbe35363.bin), *Building Event-Driven Microservices* -- chapter 3, "Communication and Data Contracts": explicit schemas and compatibility rules, "Use the Narrowest Data Types" (including unknown enum tokens in Avro and Protobuf), and "Keep Events Single-Purpose" (`ProductEngagement` overloaded with type tags and nullable fields split into `MovieClick`, `BookClick` and `BookBookmark`); on *Evolving types*
- [Stopford 2018](/sources/49392a19e62da54ab6b415fd70df1590.bin), *Designing Event-Driven Systems* -- chapter 13, "Evolving Schemas and Data over Time": schema-on-read, the Dual Schema Upgrade Window for breaking changes, "Handling Unreadable Messages" via an error topic, and "Segregating Public and Private Topics"; on *Trust boundaries*, *Evolving types* and *Tolerant readers*
- [Percival et al. 2020](/sources/1b11fd9a1f1b2a8156524d833d153d29.bin), *Architecture Patterns with Python* -- appendix E, "Validation": syntax, semantics and pragmatics, Postel's law and the tolerant reader; on *Tolerant readers*
- [Volpe 2021](/sources/8d99795fc4918b121b81f2e2c2630d26.bin), *Practical FP in Scala, 2nd Edition* -- chapter 5, "HTTP layer", decoding requests straight into refined types; on *DTOs and serialization*
- Płachta 2022, *Grokking Functional Programming* -- chapter 6, best-effort and all-or-nothing parsing of a list; on *The database is a boundary too*
- [Bodner 2024](/sources/9c094741f6655c74e9b828ed1b091426.bin), *Learning Go, 2nd Edition* -- chapter 7, "iota Is for Enumerations--Sometimes"; on *Evolving types*
- [Allen et al. 2016](/sources/ef73b442d98627834d86e8f39127b0d6.bin), *Haskell Programming from First Principles* -- section 24.10, "Marshalling from an AST to a datatype": parse to structure, then unmarshal to meaning, and the reverse for output, shown with aeson's untyped `Value` and `FromJSON` instances; the Haskell form of the DTO two-step; on *DTOs and serialization*
- [Winters et al. 2020](/sources/cdc8156a74161ef8b6f12b1e2896c4d7.bin), *Software Engineering at Google* -- chapter 1, "What Is Software Engineering?", section "Hyrum's Law" (every observable behavior of an API eventually acquires dependents regardless of the promised contract), and chapter 21, "Dependency Management", on how ostensibly safe changes such as output-order changes break consumers; on *DTOs and serialization*
- [Milanovic 2026](/sources/75138c5368f6c8cdd895918f3a141294.bin), *Laws of Software Engineering* -- chapter 5, "Hyrum's Law" (including JSON key-order dependencies), and chapter 26, "Postel's Law (The Robustness Principle)", including modern critiques that excessive tolerance hides producer bugs and creates security ambiguities; on *DTOs and serialization* and *Tolerant readers*

Further reading:

- King 2019, *Parse, don't validate* -- "The power of parsing": aeson, optparse-applicative, persistent/postgresql-simple and servant as parsers at the program's edge, including values read back from a data store, on *DTOs and serialization* and *The database is a boundary too*; footnote 3 on authorizing before parsing, on *Trust boundaries*
- [Serrano Mena 2022](/sources/5c1001bd2c4b75b2ff640e61358fc71a.bin), *Haskell: Almost Standard Libraries* -- chapter 8, "Serialization", section 8.1, "JSON": hand-written aeson instances, then generic `deriving (ToJSON, FromJSON)`, which ties JSON keys to field names; `deriveJSON` with `fieldLabelModifier` and `rejectUnknownFields = True` for a strict decoder, against the default that ignores extra keys; `deriving-aeson` with `DerivingVia`; on *DTOs and serialization* and *Tolerant readers*
- [Dean et al. 2019](/sources/fc5462126577e55d837e2d4d25b2843f.bin), *Event Streams in Action* -- chapter 6, "Schemas", section 6.3, "Associating events with their schemas": wrapping payloads in a self-describing envelope carrying a versioned schema URI resolved against a registry so heterogeneous streams can evolve safely; on *DTOs and serialization* and *Evolving types*
- Hagenlocher 2024, *Learn Haskell by Example* -- chapter 16, "JSON and SQL", section 16.2, "Deriving type classes with Generic": how aeson maps ADTs to JSON by default and why `Generic`-derived instances break backward compatibility for persisted JSON when data types change; on *DTOs and serialization* and *Evolving types*
- [Kurt 2018](/sources/3adb3487789446f9050e813826487b97.bin), *Get Programming with Haskell* -- lesson 40, "Working with JSON data by using Aeson", section 40.3.2: writing manual `FromJSON`/`ToJSON` instances when an external JSON payload uses field names (`"error"`) that collide with the language or diverge from your domain record (`errorCode`); on *DTOs and serialization*
