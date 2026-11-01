---
draft: false
toc: true
title: "Type-Driven Design: Parsing and Evidence"
description: "Turning untrusted input into types that carry what was checked: parse, don't validate, how strong a parsed type's evidence is, and the trust boundaries where data enters and leaves."
weight: "20"
linkTitle: "Parsing and Evidence"
---
# Parsing and evidence


How a value earns a stronger type: by being parsed once at a boundary, into a type whose construction is the evidence. Part of [Type-driven design]({{< ref "type-driven-design" >}}).

- [Parse, don't validate]({{< ref "type-driven-design/02-parsing-and-evidence/parse-dont-validate" >}}): what's wrong with validating, shotgun parsing, partial functions made total, where to parse, and where it gets harder.
- [How strong the evidence is]({{< ref "type-driven-design/02-parsing-and-evidence/strength-of-evidence" >}}): smart constructors and newtypes, constructive and encapsulated types, hidden constructors, and evidence without runtime cost.
- [Types at the boundary]({{< ref "type-driven-design/02-parsing-and-evidence/types-at-the-boundary" >}}): trust boundaries, DTOs and serialization, the database as a boundary, evolving types, and tolerant readers.
