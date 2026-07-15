---
draft: false
toc: true
title: "Domain Model"
linkTitle: "Domain Model"
---


The model preserves distinctions among related concepts. These concepts and relationships belong to the model; the roles, workflows, gates, templates, and tools used to manage them belong to the [framework]({{< ref "ai-engineering/other/production-ready/production-readiness-framework" >}}).

| Category                 | Role                                             | Example                                            |
| ------------------------ | ------------------------------------------------ | -------------------------------------------------- |
| Production promise       | Outcome expected by users or the organization    | Submitted orders are not lost                      |
| Requirement              | Condition that must be satisfied                 | Orders survive loss of the primary processing node |
| System property          | Characteristic needed to satisfy the requirement | Recoverability and data integrity                  |
| Risk or failure scenario | Condition that could violate the requirement     | Primary data-store loss                            |
| Control or mechanism     | Means used to create or preserve the property    | Replication and backups                            |
| Validation activity      | Action used to evaluate the control or property  | Restoration exercise                               |
| Evidence                 | Result supporting or weakening the claim         | Measured recovery time and verified integrity      |
| Operational capability   | Action the organization can perform              | Operators can initiate and verify restoration      |
| Responsibility           | Accountable owner of the capability              | Service-owning team                                |
| Decision                 | Judgment about sufficiency and residual risk     | Recovery risk accepted for the defined release     |
