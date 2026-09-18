---
draft: false
toc: true
title: "Review"
linkTitle: "Review"
---
## The picture


What is currently called **AI engineering** is, in a large part of the market, not yet a mature engineering discipline.

> The field's language of maturity is ahead of its actual engineering maturity. That gap creates predictable technical and organizational failures. I care about working where that gap is acknowledged and addressed, not hidden.

It is a mix of model consumption, prompt wiring, tool orchestration, vendor dependency, prototype theater, benchmark theater, and confidence borrowed from titles, funding, and famous company names.

A lot of people speak as if the discipline already exists in a stable, professional form, but it mostly does not.

There are capable people, real researchers, strong engineers, and serious teams. But the broader market signal is badly corrupted. The phrase **"AI engineer"** is often being used before the underlying engineering standards exist in the work.

So the current situation is roughly this:

> **The vocabulary of maturity arrived faster than the discipline itself.**

People say they "build AI systems," "have an AI strategy," "have 5-10 years of AI experience," "do evals," and are "productionizing agents." They say "the model is grounded," "the system is safe," and "the assistant is reliable."

That is the real condition: when you inspect the actual reasoning, you often find that the claims are much stronger than the evidence, architecture, controls, or operating model behind them.

## What is actually missing


The problem is that many teams still do not have a shared way to reason about AI systems at all.

Very often, the missing pieces are basic:

- no shared conceptualization of intended behavior;
- no explicit language for failure modes;
- no serious distinction between model behavior and system guarantees;
- no clear mapping from requirement severity to enforcement mechanism;
- no decision logic for what evidence is needed for which commitment;
- no precise production commitment for what users may rely on;
- no operational understanding of uncertainty.

So instead of:

```text
claim
→ assumptions
→ evidence
→ uncertainty
→ consequence if wrong
→ commitment
```


the real process becomes:

```text
belief
→ implementation
→ post-hoc justification
```


Or worse:

```text
vendor capability
→ executive excitement
→ roadmap commitment
→ retroactive search for evals
```

## The lie at the center


The central lie is not always deliberate. Often it is social, not malicious.

The lie is this:

> **People speak as if using AI components is the same thing as knowing how to engineer AI systems.**

It is not.

Calling an API, building a chatbot, connecting tools, or shipping an internal assistant does not by itself show that someone knows:

- how to define the behavior being claimed,
- how to evaluate it,
- how to reason about uncertainty,
- how to separate soft statistical behavior from hard requirements,
- how to design controls around model failure,
- how to narrow product claims to match evidence,
- or how to run the system responsibly in production.

And this is why claimed years of experience mean much less to me than they seem to mean to the market.

If someone says they have ten years of AI experience, my question is not:

> "How many years?"

It is:

> **What kind of reasoning did those years produce?**

Because real experience leaves marks.

It should show up in:

- how someone frames a problem;
- what they worry about early;
- what distinctions they insist on;
- what evidence they demand;
- what they refuse to claim;
- what kinds of failures they can already see coming.

If that accumulated reasoning is absent, then the calendar number is weak evidence.

## Why this is happening


I do not think the current situation is mainly a competence problem. The field itself has been assembled faster than the disciplines needed to support it have been integrated.

### The field is young


Modern AI systems became useful enough to deploy before we developed stable, widely shared methods for designing, evaluating, operating, and governing them.

The tooling moved faster than the discipline.

### AI product work is inherently cross-disciplinary


One reason the field is difficult to professionalize is that it does not belong to software engineering alone.

A consequential AI system sits at the intersection of several kinds of reasoning:

- software and systems engineering;
- machine learning and model behavior;
- evaluation, measurement, and experimental reasoning;
- product discovery and product decision-making;
- human-computer interaction;
- domain expertise;
- security, privacy, safety, and harm analysis;
- production operations;
- economics, legal constraints, and organizational viability.

Engineering is essential, but engineering alone does not determine whether the system is useful, trustworthy, supportable, or appropriate to deploy.

A technically elegant system can solve the wrong problem.

A good model can fail inside a poor product interaction.

A strong offline eval can measure the wrong behavior.

A useful prototype can become an unsafe production commitment.

A system can work technically while being economically or operationally impossible to sustain.

A product can satisfy its immediate user while creating unacceptable effects elsewhere.

This means there is no single existing discipline from which the complete AI engineering method can simply be inherited.

### Existing disciplines see different parts of the system


Software engineers naturally focus on architecture, interfaces, correctness, reliability, and operation.

ML practitioners may focus on data, model behavior, statistical performance, and experimentation.

Product teams focus on users, problems, adoption, and outcomes.

Researchers focus on hypotheses and evidence.

Security and safety specialists focus on adversarial behavior and consequences.

Domain experts understand what correctness actually means in the environment where the system operates.

Each view is necessary.

None is sufficient.

The failure mode is that one of these views is treated as if it represents the whole system.

Then the organization optimizes locally:

```text
good model
→ therefore good AI product

good architecture
→ therefore correct behavior

good eval score
→ therefore production readiness

high adoption
→ therefore desired outcome

strong prompt
→ therefore enforced rule
```


Those implications do not follow automatically.

### Organizations often assign the whole problem to "engineering"


This makes the title **AI Engineer** deceptively simple.

An organization may believe it has assigned an AI problem to an engineering team when it has actually assigned that team a mixture of product discovery, behavioral specification, model evaluation, architecture, experimentation, production operation, and risk reasoning.

If those responsibilities are not made explicit, the team tends to fall back on what it already knows how to do:

build things.

Implementation begins before the important claims and unknowns have been made explicit.

Then evaluation is added later to validate what was built.

The result can look like engineering progress while the harder questions remain unanswered.

### The organizational boundaries are also wrong for the problem


Traditional organizations often separate:

```text
product
design
engineering
data / ML
security
operations
business
```


AI systems cut directly across those boundaries.

Questions such as:

> "Can users rely on this answer?"

cannot be answered by the model team alone.

They may require product scope, evaluation evidence, retrieval behavior, interface design, system controls, domain judgment, operational monitoring, and decisions about acceptable failure.

That makes AI work partly an organizational-design problem.

The company needs a way for these different forms of knowledge to participate in the same decision without turning the work into committee-driven paralysis.

### Capability arrived before the operating model


The industry learned very quickly how to call models, build agents, connect tools, and ship prototypes.

It has learned much more slowly how to decide:

- what should be built;
- which assumptions matter;
- what evidence is sufficient;
- what an eval result actually supports;
- what users may rely on;
- which failures need hard controls;
- what uncertainty can reasonably be accepted;
- and when new evidence should change the product or architecture.

That is why I think an operating model for AI work is as important as the technical architecture.

### The market rewards visible capability faster than disciplined uncertainty


It is easier to demonstrate:

> "Our agent can do this."

than:

> "Under these conditions, with this evidence, we currently believe the system can provide this behavior, while these important uncertainties remain."

The first produces a better demo.

The second produces a better engineering decision.

Organizations therefore face continuous pressure to turn possibility into certainty faster than the evidence warrants.

### Titles and experience expanded before the discipline stabilized


The same thing happened with people.

"AI Engineer," "AI Architect," "Agent Engineer," and "AI Lead" became common titles before there was broad agreement about what competent practice in those roles should contain.

So years of experience, titles, and organizational prestige are weak proxies.

What I want to see is the reasoning produced by that experience.

### This is why I consider AI engineering a systems discipline


The object being engineered is not the model.

It is the complete system through which probabilistic capability becomes useful behavior in the world.

That includes technology, people, product decisions, evidence, controls, operating responsibilities, and the organizational mechanisms by which all of those can change as we learn.

Software engineering is one of its foundations.

It is not the whole discipline.

## What this leads to


This is the critical part. This is where you show consequences.

### 1. Eval theater


Teams say they "have evals," but often the deeper conceptual work was never done.

So the eval becomes:

- a dataset without a real behavioral model,
- a score without a clear claim,
- a benchmark without a production interpretation,
- a measurement disconnected from the decision it is supposed to inform.

The appearance of rigor exists.

The reasoning does not.

### 2. Prompts are treated as controls


A system instruction says "must," and people begin talking as if the property is enforced.

So a prompt becomes a fake substitute for:

- policy,
- validation,
- trusted boundaries,
- typed interfaces,
- authorization,
- runtime checks,
- and system-level guarantees.

This is one of the clearest signs of immaturity.

### 3. Product claims outrun evidence


The product starts implying or directly claiming things like:

- grounded,
- verified,
- safe,
- reliable,
- production-ready,
- enterprise-grade.

But the actual evidence only supports something much weaker.

So the public language becomes inflated while the engineering reality remains loose.

### 4. Architecture hardens around unexamined assumptions


Once a team starts implementing, weak assumptions become buried inside:

- prompts,
- workflows,
- agent loops,
- retrieval steps,
- approval flows,
- UI expectations,
- and operational habits.

Then the team inherits invisible technical debt before it has even earned the right to call the system understood.

### 5. Production commitments are made without explicit obligations


A prototype quietly turns into a product.

But nobody has clearly said:

- what behavior is actually supported,
- what users may rely on,
- what is outside scope,
- what happens when the system is uncertain,
- what harm must be prevented,
- how failure is detected,
- how rollout is limited,
- how rollback works,
- who owns the consequences.

So the system is "in production" socially before it is in production intellectually.

### 6. Organizations become harder to correct


Once titles, vendor choices, roadmaps, and executive expectations become attached to a direction, it gets harder to admit that the original reasoning was weak.

At that point, evidence stops being a tool for correction and starts being used as a tool for defense.

That is a dangerous transition.

### 7. Good engineers get trapped in low-quality systems


People who can see the conceptual gaps are then forced into one of three bad roles:

- silent implementer,
- internal dissenter,
- or organizational irritant.

A serious engineer ends up spending energy fighting for the right to reason properly, instead of spending that energy improving the system itself.

### 8. The industry accumulates brittle systems at scale


This is the wider consequence.

If the field keeps normalizing weak reasoning, then we will get:

- a lot of deployed AI systems,
- a lot of business dependence on them,
- a lot of vague claims about their behavior,
- and a lot of surprises when those systems meet reality.

Not because the models are magical or evil.

Because the engineering discipline around them was overstated.

> It does not yet consistently have the shared concepts, methodological discipline, and intellectual honesty required for a mature engineering field.

## Shortly


One of the strongest conclusions I have drawn from recent work is that the market signal around "AI engineering" is badly inflated.

A large number of people and organizations now speak as if AI engineering were already a mature discipline with stable standards and widely shared methods. In practice, much of what is being called AI engineering still looks pre-disciplinary: model consumption, prompt wiring, workflow assembly, vendor dependence, and post-hoc evaluation, often presented with more confidence than the underlying reasoning justifies.

The core issue is not that models are imperfect. The core issue is that many teams still lack a shared way to reason about AI systems. They do not clearly distinguish intended behavior from demonstrated behavior, prompt instruction from enforcement, statistical performance from system guarantees, or evaluation artifacts from production evidence. Claims about reliability, grounding, safety, or readiness therefore often become stronger than the architecture, controls, and evidence behind them.

This has predictable consequences. Evals become shallow or theatrical. Prompts are treated as if they were control mechanisms. Architecture hardens around unexamined assumptions. Prototypes quietly turn into production systems without explicit production obligations. Vendor choice, internal hierarchy, and momentum begin to substitute for reasoning. Over time, these organizations become harder to correct precisely because their confidence exceeds their engineering discipline.
