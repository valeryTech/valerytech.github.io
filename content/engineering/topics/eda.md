---
draft: false
toc: true
title: "Eda"
linkTitle: "Eda"
---
## EDA


Event Pub/Sub support [trueaccord.atlassian.net/wiki/x/WwDSZQ](https://trueaccord.atlassian.net/wiki/x/WwDSZQ)

<https://en.wikipedia.org/wiki/Event-driven_architecture>

<https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven>

resources collection fyi

<https://github.com/lutzh/awesome-event-driven-architecture> (also some papers links)

<https://github.com/mehdihadeli/awesome-software-architecture/blob/main/docs/event-driven-architecture.md>

courses

<https://developer.confluent.io/courses/>

<https://developer.confluent.io/courses/event-design/intro/>

blogs

<https://event-driven.io/en/category/>

<https://eda-visuals.boyney.io/>

books:

"Designing Event-Driven Systems" by Confluent

eda-visuals.boyney.io

patterns

- fowler book
- <https://developer.confluent.io/patterns/>
- <https://microservices.io/patterns/data/transactional-outbox.html>
- <https://www.enterpriseintegrationpatterns.com/patterns/messaging/>

conferences:

<https://current.confluent.io/2024-sessions>

papers and articles

<https://www.enterpriseintegrationpatterns.com/articles.html>

## Patterns


<https://microservices.io/patterns/data/transactional-outbox.html>

<https://www.enterpriseintegrationpatterns.com/>

Event-Catalogue

<https://github.com/event-catalog/eventcatalog?tab=readme-ov-file>

Event Bus Architecture

# clippings


TrueML is evolving its products to embrace [Domain-driven Design](https://en.wikipedia.org/wiki/Domain-driven_design "https://en.wikipedia.org/wiki/Domain-driven_design") (DDD), specifically around dividing large, monolithic software systems into bounded contexts called domains. Another fundamental tenet of platform evolution is [Event-driven Architecture](https://en.wikipedia.org/wiki/Event-driven_architecture "https://en.wikipedia.org/wiki/Event-driven_architecture") (EDA), which allows communication of state or other changes asynchronously across domains. Finally, DDD and EDA are components of the [Data Mesh](https://en.wikipedia.org/wiki/Data_mesh "https://en.wikipedia.org/wiki/Data_mesh"), a more generalized approach to organizing data, domains, teams, and the consumers of that data.

Outside the transactional domains, TrueML is evolving to a [Data Lakehouse](https://en.wikipedia.org/wiki/Data_lake#Data_lakehouse "https://en.wikipedia.org/wiki/Data_lake#Data_lakehouse") paradigm, which combines the scalability of a traditional data lake architecture with ACID transactions and the ability to enforce data quality like a traditional data warehouse.

As mentioned in [Architectural Patterns Useful For Data](https://trueaccord.atlassian.net/wiki/spaces/ENG/pages/1709080645), domains will primarily interact with via Event-driven Architecture (EDA). This has specific implications around the events which are published by a domain.

[Domain Event Taxonomy](https://trueaccord.atlassian.net/wiki/spaces/ENG/pages/1595081157) describes the set of events which are emitted by domains. The schemas that are defined in the associated repo provide the a full attribute-level definition and structure of the events that are emitted. This imposes certain standards on handling of data for transactional domains:

- The domain is the system of record for all data maintained by the domain
- Domains may also publish data state changes or other events to consuming domains through a topic on an event bus
- Domain events will be defined through [JSON Schema](https://json-schema.org/ "https://json-schema.org/")
- Event state published is always complete. Partial events are never published.
- Consuming domains **must not** maintain a copy of another domain's state. That would violate the notion of maintenance of state. Domains that need another domain's state **must** request it from the domain itself, i.e. the system of record for that data.
