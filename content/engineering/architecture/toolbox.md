---
draft: false
toc: true
title: "Architecture Toolbox"
description: "Hub for the heuristics used to reason about architecture and design: the three laws of software architecture, balanced coupling, ETC, YAGNI, simple design, and named design principles, with how they relate and when each applies."
linkTitle: "Architecture Toolbox"
---

This is the practical toolbox from [Software Architecture]({{< ref "engineering/architecture/architecture" >}}#practicality-lens): ideas of several kinds (laws, values, models, principles, heuristics) collected so they can be used together. Principles sometimes conflict, so the real question is how to balance them for the problem at hand, not which one to follow.

## Map of the toolbox


| Tool | Kind | Question it answers | Where |
| --- | --- | --- | --- |
| Laws of software architecture | Laws: claimed to hold for every decision | How should I reason about any architecture decision? | [Laws of Software Architecture]({{< ref "engineering/architecture/laws" >}}) |
| Balanced coupling | Model | Is this dependency in the right place, and is it strong enough or too strong? | [Coupling and Modularity]({{< ref "engineering/architecture/coupling" >}}) |
| ETC (easier to change) | Value | Which option leaves the system easier to change? | [below](#the-essence-of-good-design-etc) |
| YAGNI | Heuristic | Should I build this now? | [YAGNI]({{< ref "engineering/architecture/yagni" >}}) |
| Simple design | Practice (XP) | What is the least design that works today? | [below](#simple-design) |
| Named design principles | Principles | SOLID, DRY, KISS, Law of Demeter, and others | [below](#design-principles) |
| Lifecycle techniques | Techniques | How do I test whether a choice is right? | [Engineering Lifecycle Techniques]({{< ref "engineering/architecture/techniques" >}}) |

**How they relate:**

- The **laws** say every choice is a trade-off. They describe how to reason, not what to choose.
- **ETC** says what to optimize for when you can't tell: ease of future change.
- **Balanced coupling** says where change becomes expensive (strong coupling across distance, in parts that change often) and how to keep it cheap.
- **YAGNI and simple design** limit what you build for changes that may never come. They pull against the modularity view that design should anticipate future change. One way to reconcile the two is to use volatility: invest in flexibility where the domain changes often (core subdomains), and keep the design simple where it rarely changes.
- **Named principles** are special cases. Thomas and Hunt argue that every design principle is a case of ETC, and Khononov reads several of them (SRP, ISP, bounded contexts) as balanced coupling.

## Laws


Richards and Ford collected three statements they found true of every architecture decision:

1. **Everything in software architecture is a trade-off.** Corollaries: if you have not found the trade-off, you have not looked hard enough; and the analysis has to be redone as the situation changes.
2. **Why is more important than how.** The structure shows how a system works; only recorded decisions (ADRs) keep why.
3. **Most architecture decisions aren't binary but rather exist on a spectrum between extremes.** "It depends" is the honest answer, as long as you say what it depends on.

Full treatment, worked examples, and a trade-off procedure: [Laws of Software Architecture]({{< ref "engineering/architecture/laws" >}}).

## Coupling and modularity


Khononov's *Balancing Coupling in Software Design* turns the first law into a working rule for boundaries. A dependency has three dimensions: **integration strength** (how much knowledge is shared: intrusive, functional, model, or contract), **distance** (how far that knowledge travels: same object up to different vendors), and **volatility** (how often the upstream changes: core subdomains most, legacy systems least).

```text
BALANCE = (STRENGTH XOR DISTANCE) OR NOT VOLATILITY
```


Strong coupling belongs close together (high cohesion), and coupling across distance should be weak (loose coupling). Either can be broken if the upstream part rarely changes. Full model, vocabulary (module coupling, connascence), and rebalancing: [Coupling and Modularity]({{< ref "engineering/architecture/coupling" >}}).

## The Essence of Good Design (ETC)


From *The Pragmatic Programmer* (Thomas and Hunt, Topic 8): **good design is easier to change than bad design.** A design is good if it adapts to the people who use it, and for code, adapting means changing.

- **Every principle is a special case of ETC.** Decoupling isolates concerns, so each is easier to change. The single responsibility principle makes a change in requirements touch one module. Good names make code easier to read, and you have to read code to change it.
- **ETC is a value, not a rule:** a guide for choosing between paths, not a check to pass. To build the habit, spend a week asking after every save, test, or bug fix: did this make the system easier or harder to change?
- **When you cannot tell which path is easier to change:** make the code replaceable (decoupled and cohesive), and note the choice and your guess about future change. Later, when the code has to change, compare what happened with the guess.

**Relationship with changeability:** ETC is the design-level version of [changeability]({{< ref "engineering/architecture/changeability" >}}). Balanced coupling makes it measurable: change is hard where strong coupling crosses a long distance in a volatile part of the system.

### One rule to rule them all


A passage collected earlier (source not recorded) that makes the same argument as ETC:

> As developers, we live under a constant barrage of helpful advice, often in the form of rules with cute names. We're told how to design, how to code, how to deploy, how to monitor: there are systems and rules for everything. How can we keep up? How can we know what's good advice, and what's bad?
>
> Over time I've come to realize that just about every good piece of advice is actually a special case of something both more general and simpler. So, let me introduce you to the "one rule to rule them all."

## YAGNI


"You aren't gonna need it": don't build a capability until it is actually needed. It is the counterweight to designing for anticipated change: flexibility that is never used is cost without benefit, the "too much of a good thing" that Khononov warns about. Reading list and open questions: [YAGNI]({{< ref "engineering/architecture/yagni" >}}).

## Simple Design


An Extreme Programming practice: the design should be the simplest one that works for what the system needs now, and it changes as needs change.

- Read the "Simple Design" part of *The Art of Agile Development* (Shore et al.).
- <http://www.extremeprogramming.org/rules/simple.html>

### Do the simplest thing that could possibly work


<https://wiki.c2.com/?DoTheSimplestThingThatCouldPossiblyWork>

## Design principles


| Principle | Short meaning | In terms of ETC and coupling |
| --- | --- | --- |
| SOLID | Five object-oriented principles: single responsibility, open-closed, Liskov substitution, interface segregation, dependency inversion | Khononov reads SRP and ISP as balanced coupling; DIP inverts which side owns the contract |
| DRY | Every piece of knowledge has one authoritative representation | Duplicated business logic is symmetric functional coupling: strong, and enforced by nothing |
| KISS | Prefer the simplest design that works | Limits local complexity |
| YAGNI | Don't build it until it is needed | See [YAGNI]({{< ref "engineering/architecture/yagni" >}}) |
| Law of Demeter | A unit talks only to its immediate collaborators | Limits how much knowledge travels over distance |
| Avoid premature optimization | Don't trade clarity for speed before measuring | A trade-off made without evidence (first law) |
| Principle of least astonishment | A component should behave the way its users expect | Surprising behavior is hidden knowledge every caller has to learn |

## Judgment over dogma


Keep the expected lifespan of the solution in mind, and use good judgment.

Clean code critique: that's why coding is an art in its own right. There are good practices and bad ones, but if you do not understand the craft, blindly following good practices leads to dogmatic code. That is the biggest sin of clean code: it presents absolute dogma, not advice.

This is the first law applied to principles: a rule presented without its trade-offs is one whose trade-off has not been found yet. Expected lifespan works like volatility: a short-lived solution doesn't need to be protected against change.

## Various (to sort)


- Proof of concept and MVP: see [Engineering Lifecycle Techniques]({{< ref "engineering/architecture/techniques" >}}).
- Design decision: see [decisions]({{< ref "engineering/architecture/architecture" >}}#decisions) and the [second law]({{< ref "engineering/architecture/laws" >}}#second-law-why-is-more-important-than-how).
- TTM (time to market).

## How to use it


For a design or architecture decision:

1. **Name the decision and the options.** If only one option comes to mind, look for at least one more.
2. **First law:** find the cost of every option, including the one that looks free. List the factors that matter in this context and weight them.
3. **For boundaries and dependencies:** score strength, distance, and volatility, and check the balance rule.
4. **When unsure:** choose the option that is easier to change (ETC), or the one that is easier to replace.
5. **Check YAGNI against volatility:** build flexibility only where change is likely.
6. **Second law:** record the why, the rejected options, and what would make you revisit the decision.

## Reflection and Improvements

## Library sources


- [Richards and Ford 2025](/sources/software-engineering/architecture/richards-2025-fundamentals-of-software-architecture.pdf.enc), *Fundamentals of Software Architecture, 2nd Edition* -- on *Laws*
- [Khononov 2025](/sources/software-engineering/craft/khononov-2025-balancing-coupling-in-software-design.pdf.enc), *Balancing Coupling in Software Design* -- on *Coupling and modularity*
- [Thomas and Hunt 2020](/sources/software-engineering/craft/thomas-2020-pragmatic-programmer-2nd-edition.pdf.enc), *The Pragmatic Programmer, 2nd Edition* -- on *The Essence of Good Design (ETC)* and DRY
- [Shore et al. 2021](/sources/software-engineering/process-and-agile/shore-2021-art-of-agile-development-2nd-edition.pdf.enc), *The Art of Agile Development, 2nd Edition* -- on *Simple Design*
- [Mak 2026](/sources/software-engineering/craft/mak-2026-software-design-for-python-programmers.pdf.enc), *Software Design for Python Programmers: Principles and patterns* -- the named principles with their sections (Single Responsibility 2.3.1, Open-Closed and DRY 2.3.3, Law of Demeter 5.6, Liskov Substitution 7.2, composition over inheritance 7.3.3), on *Design principles*

Further reading:

- [Ford et al. 2022](/sources/software-engineering/architecture/ford-2022-software-architecture-the-hard-parts.pdf.enc), *Software Architecture: The Hard Parts*
- Gandhi et al. 2024, *Head First Software Architecture*
- [Malan 2025](/sources/software-engineering/architecture/malan-2025-architecture-principles.pdf.enc), *Architecture Principles*
- [Ousterhout 2018](/sources/software-engineering/craft/ousterhout-2018-philosophy-of-software-design.pdf.enc), *A Philosophy of Software Design*
