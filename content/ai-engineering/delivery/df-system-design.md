---
draft: false
toc: true
title: "System Design in the Delivery Framework"
description: "A system-design activity and artifact checklist connecting objectives, requirements, domain models, contracts, architecture, risk, migration, validation, and operational ownership."
linkTitle: "System Design"
---

| Step                                                | Main activities                                                                                                                                                                                                                                                                              | Resulting artifacts                                                                                                                       |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **0. Verify objectives and scope**                  | Check business objective, intended users, expected outcomes, system boundaries, dependencies, assumptions, and exclusions.Identify the decisions the design must enable.                                                                                                                     | Problem statement, objectives, scope definition, stakeholder map, assumptions, constraints, out-of-scope list, success criteria verified. |
| **1. Capture functional and quality requirements**  | Define the capabilities the system must provide. Identify critical workflows, edge cases, and operational scenarios. Specify measurable expectations for architectural characteristics.                                                                                                      | Functional requirements, quality attributes, service-level objectives, acceptance criteria.                                               |
| **2. Model the domain and data**                    | Identify core domain concepts, entities, relationships. Ownership boundaries, lifecycle rules, mutability, retention. Separate transactional data, analytical data, documents, media, and event streams.                                                                                     | Domain model, entity-relationship model, lifecycle and retention rules.                                                                   |
| **3. Define interfaces and interaction patterns**   | Describe how users, systems, and components interact.                                                                                                                                                                                                                                        | **API contract**, endpoint list, request/response shapes, pagination rules, authentication context and key **access patterns**.           |
| **4. Estimate and characterize scale and workload** | Estimate traffic, concurrency, read/write ratios, object sizes, storage growth, bandwidth, peak conditions, geographic distribution, and expected usage changes. Identify hot paths and workload asymmetries that affect architecture.                                                       | **Traffic / workload model**, approximate QPS, read/write ratios, object sizes, storage growth, bandwidth and peak-load assumptions.      |
| **5. Design the high-level architecture**           | Define system boundaries, major components, service responsibilities, storage systems, communication mechanisms, trust boundaries, deployment topology, and external dependencies. Map each requirement and workflow to architectural components.                                            | **Architecture diagram**, service boundaries, storage choices, request paths, write paths and ownership of data.                          |
| **6. Develop critical components and harden them**  | Refine the architecture for critical components and workflows. Test the design against NFR (AC) requirements.                                                                                                                                                                                | **Detailed component designs**, trade-off logs for components.                                                                            |
| **7. Evaluate trade-offs and risks. Harden design** | Test and verify the whole design against requirements and realistic failure scenarios. Identify bottlenecks, single points of failure, scaling limits, operational complexity, security exposure, vendor dependencies, and cost drivers. Compare viable alternatives and document rationale. | Trade-off analysis, architecture decision records, risk register, threat model, failure scenarios, cost model, unresolved questions.      |

## Artifact set


For a typical system, the useful design and delivery package should contain:

- Objectives, scope, assumptions, and constraints
- Functional requirements and measurable quality attributes
- Domain and data model
- API, event, and integration contracts
- Workload and capacity model
- High-level architecture diagram
- Critical workflow sequence diagrams
- Detailed design for high-risk components
- Architecture decision records
- Risk and threat assessments
- Delivery and migration plan
- Test and production-readiness criteria
- Operational dashboards, alerts, and runbooks
- Ownership and maintenance model

## Library sources


- [Nazir et al. 2023](/sources/dd36a91b8097a8fc978547db2c95650b.bin), *Architecting ML-enabled systems*
- [Serban and Visser 2022](/sources/00cecd99502bdf624a95fd7f4d034481.bin), *Adapting Software Architectures to Machine Learning Challenges* ([arXiv:2105.12422](https://arxiv.org/abs/2105.12422))
- [Knodel and Naab 2016](/sources/d16dc82ef26ea988f0fc0c6669b4735a.bin), *Pragmatic Evaluation of Software Architectures*
- [Falessi et al. 2011](/sources/ddf58eacb5f53833fa4bf6a8793168b6.bin), *Decision-making techniques for software architecture design* ([doi:10.1145/1978802.1978812](https://doi.org/10.1145/1978802.1978812))
