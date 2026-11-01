---
draft: false
toc: true
title: "Tests and the Domain Model"
description: "How the DDD and domain-modeling books describe the role of tests: checking business rules, documenting the model in the domain language, dividing the work with types, shaping a model that can be unit tested, and choosing what and where to test."
linkTitle: "Tests and the Domain Model"
---

A domain model encodes the business rules of one bounded context in types, functions and objects. Tests do two jobs for the model: they check that the rules still hold after each change, and they record the rules in the domain language so that developers and domain experts can read them. This note collects what the DDD, domain-modeling and unit testing books in the library say about that relationship. For the general test strategy, see [Test Strategy Foundations]({{< ref "engineering/topics/tests/test-strategy-foundations" >}}).

## What tests add to a domain model


Ghosh describes a domain model as three parts: the types that model entities and value objects, the functions that operate on those types, and the laws, which are the business rules. ([Ghosh 2017](#ghosh-2017), ch. 9) The first two parts are the code, and tests check the third. For example, a funds transfer must debit one account by the same amount it credits the other, whatever accounts and amounts are involved. He writes such rules as properties and calls the resulting set of properties a repository of the domain rules.

Percival and Gregory say that tests written against the domain model read in the domain language, so they serve as documentation that a new team member can read to learn how the core concepts relate. ([Percival & Gregory 2020](#percival-2020), ch. 5) They treat TDD as a design practice first and a testing practice second: the tests record design choices and explain the system when you come back to the code later. ([Percival & Gregory 2020](#percival-2020), ch. 3)

Vernon connects tests to the ubiquitous language. ([Vernon 2016](#vernon-2016), ch. 2) The team writes domain scenarios in plain language, refines the model by questioning each scenario, and then turns the scenarios into acceptance tests that validate the domain model. The tests can be executable specifications in the given/when/then form (Specification by Example, also called BDD) or tests in a unit testing framework that keep the scenario text in comments. The specification fails first, and the team refines the model until it passes. The tests live in the bounded context's repository, and domain experts review them to check that the model is correct and uses the ubiquitous language. ([Vernon 2016](#vernon-2016), ch. 2 and 7)

Vernon also notes a side effect of bounded contexts: because each context has one model, its tests cover one model, so there are fewer of them and they run faster. ([Vernon 2016](#vernon-2016), ch. 2)

Khorikov states the goal of unit testing as sustainable growth of the project: a good suite lets the team keep changing the code at the same pace without regressions. ([Khorikov 2020](#khorikov-2020), ch. 1) He counts both production code and test code as liabilities, so a suite should keep only tests whose value is higher than their cost. He also asks that each test be named as if describing its scenario to a non-programmer who knows the problem domain, which keeps tests readable as documentation of the model. ([Khorikov 2020](#khorikov-2020), ch. 3)

## Types and tests divide the work


Wlaschin moves as many rules as possible into the type system. ([Wlaschin 2018](#wlaschin-2018), ch. 6) If an order must have at least one order line, a non-empty list type enforces the rule, and no unit test is needed for it. When illegal states can't be represented, the compiler does the checks that unit tests would otherwise do. Smart constructors for simple types and choice types for complex states remove many integrity checks from the test suite.

Ghosh agrees that types should carry as much of the domain logic as possible, but adds that types can't express every rule. ([Ghosh 2017](#ghosh-2017), ch. 9) Rules such as the funds transfer above need explicit tests, and he concludes that a model needs both. Property-based tests suit these rules because they check a rule over many generated inputs instead of a few examples chosen by hand.

So the types state what values can exist, and the tests state how operations on those values must behave. More on each side: [Domain Modeling with Types]({{< ref "type-driven-design/03-domain-modeling/domain-modeling-with-types" >}}) and [Property-Based Testing]({{< ref "functional-programming/03-building-programs/property-based-testing" >}}).

## A model that can be unit tested


Feathers defines a unit test by two qualities: it runs fast, and it helps locate a problem. ([Feathers 2005](#feathers-2005), ch. 2) A test that talks to a database, uses the network, touches the file system or needs changes to the environment isn't a unit test. Such tests are still useful, but they should be kept separate so that the fast set can run after every change.

Khorikov gives a stricter definition: a unit test checks one unit of behavior, does it quickly, and runs in isolation from other tests. ([Khorikov 2020](#khorikov-2020), ch. 2) In the classical school, which he follows, the isolation is between tests, so only shared dependencies such as a database are replaced, and one unit of behavior can run through several domain classes. The London school isolates each class and replaces its collaborators with test doubles, which he finds couples the tests to the implementation. Any test that fails one of the three criteria is an integration test.

The domain-modeling books describe how to design a model that meets this definition:

- **Keep side effects out of the model.** Ghosh defines an abstraction as testable if it can be tested in isolation from the abstractions it works with. ([Ghosh 2017](#ghosh-2017), ch. 9) His example moves an external ID check out of the function that opens an account. He prefers passing functions over mocking libraries, because mocks add setup code and are often tightly coupled to the domain objects.
- **Pass dependencies in.** Wlaschin passes dependencies such as "check that the product code exists" as function parameters, so a test can supply a simple fake that works, without a mocking library. ([Wlaschin 2018](#wlaschin-2018), ch. 9)
- **Keep the domain layer free of infrastructure.** Millett and Tune separate the domain layer from presentation and persistence code so that domain logic can be unit tested on its own, and they use mocks and stubs to test how the application layer coordinates the domain layer. ([Millett & Tune 2015](#millett-2015), ch. 8)
- **Use value objects.** Value objects are immutable, cohesive and combinable, so they can be tested in domain terms without mocks or checks on side effects. ([Millett & Tune 2015](#millett-2015), ch. 15)
- **Test domain events as outcomes.** A unit test can check that an entity or domain service raised the expected event after a change. ([Millett & Tune 2015](#millett-2015), ch. 18)
- **Prefer fakes to mocks.** Percival and Gregory keep the domain model free of dependencies and side effects, so it forms a functional core. ([Percival & Gregory 2020](#percival-2020), ch. 3) They test the service layer around it with fakes, such as an in-memory repository, and check the end state of the system. They call this the classic style of TDD and contrast it with the London school, which uses mocks to check how collaborators are called. Tests with many mocks fill up with setup code that hides what the test is about.

### Which code to unit test


Khorikov sorts production code by two measures: how complex or significant for the domain it is, and how many collaborators it has. ([Khorikov 2020](#khorikov-2020), ch. 7) The result is four types of code:

| Type of code | Complexity or domain significance | Collaborators | What to do |
| --- | --- | --- | --- |
| Domain model and algorithms | High | Few | Unit test it; this gives the best return |
| Trivial code | Low | Few | Don't test it |
| Controllers | Low | Many | Cover it briefly with integration tests |
| Overcomplicated code | High | Many | Split it into domain logic and a controller |

The rule behind the table is that code can be deep (complex or important) or wide (working with many collaborators), but should never be both. ([Khorikov 2020](#khorikov-2020), ch. 7) The Humble Object pattern splits overcomplicated code: the business logic moves into domain classes, and what remains is a thin controller around it. Hexagonal and functional architectures both apply this pattern. Domain events keep the controllers simple: the domain model records important changes as events, the controller turns the events into calls to external systems, and unit tests check the events. He also recommends testing preconditions only when they have domain significance.

### What a domain test should check


Khorikov traces fragile tests to what the tests check. ([Khorikov 2020](#khorikov-2020), ch. 4 and 5) A test should check the observable behavior of the code, which is the operations and state that help a client reach one of its goals, and should leave out implementation details. Each layer has its own observable behavior, and for the domain layer it is what the application services need from it. Calls between domain classes are implementation details, so tests that assert them with mocks fail after refactorings that don't change behavior. Mocks belong at the application boundary, for unmanaged dependencies such as an SMTP server or a message bus, so he uses them only in integration tests of controllers and never in unit tests. ([Khorikov 2020](#khorikov-2020), ch. 5 and 9)

Khorikov describes three styles of unit test: output-based tests check the returned value, state-based tests check the state after an operation, and communication-based tests check calls with mocks. ([Khorikov 2020](#khorikov-2020), ch. 6) He ranks output-based tests highest, because they rarely couple to implementation details and stay small. A functional core that makes the decisions, with a mutable shell that supplies the inputs and carries out the decisions as side effects, lets most domain tests be output-based.

Khorikov's anti-patterns apply directly to domain classes. ([Khorikov 2020](#khorikov-2020), ch. 11) Don't test private methods directly, and don't expose private state only for tests. Don't rebuild the domain algorithm inside a test to compute the expected result; hard-code the expected results instead. A private method that is too complex to test through the public API points to a missing abstraction, which should become its own class.

## The level to test at

### The business logic pattern sets the shape of the test suite


Khononov chooses a testing strategy from the pattern used for the business logic ([Khononov 2021](#khononov-2021), ch. 10):

| Business logic pattern | Testing strategy | Reason |
| --- | --- | --- |
| Domain model, or event-sourced domain model | Test pyramid: mostly unit tests | Aggregates and value objects make good units for testing the business logic |
| Active record | Testing diamond: mostly integration tests | The business logic is spread across the service layer and the business logic layer, so the tests focus on how the two work together |
| Transaction script | Reversed pyramid: mostly end-to-end tests | The logic is simple and there are few layers, so testing the whole flow is the most effective |

So in this view, the test pyramid is a consequence of having a domain model: a model of aggregates and value objects gives the suite many small units to test.

### Unit tests for the model, integration tests for controllers


Khorikov reaches the same pyramid from his four types of code. ([Khorikov 2020](#khorikov-2020), ch. 8) Unit tests cover the domain model and algorithms, and integration tests cover controllers. Check as many edge cases of a business scenario as possible with unit tests, and use integration tests for one happy path plus the edge cases that unit tests can't reach. The shape depends on the project: a simple project has little domain model, so it can have as many integration tests as unit tests, and a trivial project might have no unit tests at all. In integration tests he uses real instances of managed dependencies, such as the application's own database, and mocks only the unmanaged ones. He advises against replacing the database with an in-memory one and against testing repositories directly. ([Khorikov 2020](#khorikov-2020), ch. 8 and 10)

Khorikov explains the pyramid with four attributes of a test: protection against regressions, resistance to refactoring, fast feedback and maintainability. ([Khorikov 2020](#khorikov-2020), ch. 4) No test can maximize the first three at once. Every test must resist refactoring, so the choice is between protection against regressions, which end-to-end tests favor, and fast feedback, which unit tests favor.

### High gear and low gear


Percival and Gregory add a trade-off between coupling and design feedback. ([Percival & Gregory 2020](#percival-2020), ch. 5) Tests written directly against the domain model give the most feedback on the design and document the model, but they are tied to its current implementation. Each such test holds the code in its current shape, so a large number of them makes the model hard to refactor. Tests against the service layer (the use-case API) are less coupled and cover more code, and the model can be refactored freely under them.

Their rules of thumb are ([Percival & Gregory 2020](#percival-2020), ch. 5):

- Aim for one end-to-end test per feature, to show that the parts are connected.
- Write most tests against the service layer, with fakes for I/O, and cover the edge cases of the business logic there.
- Keep a small core of tests against the domain model, and delete them once tests at the service layer cover the same behavior.
- Treat error handling as a feature: handle all errors the same way at the entry points, so one end-to-end test covers the unhappy paths.

They describe this as changing gears. When starting a project or working on a hard problem, write tests against the domain model ("low gear") to get feedback and executable documentation. When adding features or fixing bugs that don't change the model much, write tests against the service layer ("high gear"). Testing only at the service layer can lead to a combinatorial explosion of cases for complex use cases, and then tests on the collaborating domain objects help. ([Percival & Gregory 2020](#percival-2020), ch. 5)

## Where the sources differ


**How much to test the domain objects directly.** Khononov names aggregates and value objects as the units of the pyramid ([Khononov 2021](#khononov-2021), ch. 10), while Percival and Gregory keep only a small core of tests against them ([Percival & Gregory 2020](#percival-2020), ch. 5). The two fit together if service-layer tests with fakes count as unit tests, which is how Percival and Gregory count them: their service tests sit in the unit test folder, and their pyramid has 15 unit tests, 8 integration tests and 2 end-to-end tests ([Percival & Gregory 2020](#percival-2020), ch. 5). Both views give a pyramid. They differ on whether the base of the pyramid tests aggregates one at a time or tests use cases that run through them. Khorikov sides with Khononov on where unit tests pay off most, which is the domain model ([Khorikov 2020](#khorikov-2020), ch. 7).

**Fakes for the database.** Percival and Gregory test the service layer against an in-memory fake repository and count these tests as unit tests ([Percival & Gregory 2020](#percival-2020), ch. 3 and 5). Khorikov would cover the same application services briefly with integration tests against the real database, because the application's own database is a managed dependency, and he advises against in-memory substitutes ([Khorikov 2020](#khorikov-2020), ch. 8 and 10). So Percival and Gregory put most tests at the service layer, while Khorikov puts most tests in the domain model and keeps few tests at the service layer ([Percival & Gregory 2020](#percival-2020), ch. 5; [Khorikov 2020](#khorikov-2020), ch. 8).

**Mocks.** Millett and Tune use mocks and stubs to test the application layer in isolation ([Millett & Tune 2015](#millett-2015), ch. 8), but in a later chapter they recommend testing as much as possible against real implementations to gain confidence that the parts work together ([Millett & Tune 2015](#millett-2015), ch. 25). Percival and Gregory, Ghosh and Wlaschin prefer fakes or passed-in functions to mocking libraries ([Percival & Gregory 2020](#percival-2020), ch. 3; [Ghosh 2017](#ghosh-2017), ch. 9; [Wlaschin 2018](#wlaschin-2018), ch. 9). Khorikov allows mocks only for unmanaged dependencies at the application boundary ([Khorikov 2020](#khorikov-2020), ch. 9). Under his rule, mocking the domain layer in application-layer tests couples the tests to implementation details, while mocking an external system that other applications observe is allowed ([Khorikov 2020](#khorikov-2020), ch. 5).

**Example tests or properties.** Ghosh finds example-based xUnit tests easier to follow, because they show concrete data, but says that hand-picked data misses edge cases, and prefers properties for complex domain models ([Ghosh 2017](#ghosh-2017), ch. 9). Vernon's acceptance tests are examples on purpose, because domain experts need to read them ([Vernon 2016](#vernon-2016), ch. 2). The two serve different readers: properties check rules over many inputs, and examples let domain experts confirm the model.

## References


- Feathers, M. (2005). [Working Effectively with Legacy Code](/sources/241d9c43d55ce32020da4c5ffc75bc2e.bin). Prentice Hall. ^feathers-2005
- Ghosh, D. (2017). [Functional and Reactive Domain Modeling](/sources/50beef97eed4ab65bbee6a1c7ea06890.bin). Manning. ^ghosh-2017
- Khononov, V. (2021). [Learning Domain-Driven Design](/sources/deaedd205f4448340ac88de7be2f3116.bin). O'Reilly. ^khononov-2021
- Khorikov, V. (2020). Unit Testing Principles, Practices, and Patterns. Manning. ^khorikov-2020
- Millett, S., & Tune, N. (2015). [Patterns, Principles, and Practices of Domain-Driven Design](/sources/9d5539a5016c513dd6cba96230483320.bin). Wrox. ^millett-2015
- Percival, H., & Gregory, B. (2020). [Architecture Patterns with Python](/sources/1b11fd9a1f1b2a8156524d833d153d29.bin). O'Reilly. ^percival-2020
- Vernon, V. (2016). [Domain-Driven Design Distilled](/sources/b38f90837dd74283bea4b629417e8718.bin). Addison-Wesley. ^vernon-2016
- Wlaschin, S. (2018). [Domain Modeling Made Functional](/sources/3165b993e939de6a47737a073d7633a4.bin). Pragmatic Bookshelf. ^wlaschin-2018
