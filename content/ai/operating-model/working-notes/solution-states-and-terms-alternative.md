---
draft: false
toc: true
title: "Solution States And Terms Alternative"
linkTitle: "Solution States And Terms Alternative"
---
> **Editorial note:** This proposal depends on [`solution-as-central-object.md`]({{< ref "ai/operating-model/working-notes/solution-as-central-object" >}}). Its state names are not part of the current model.

Discovery and Delivery can be presented as activities, while the transformations apply to the solution.

```
ACTIVITIES                         STATES OF THE SOLUTION

Discovery ───────────────┐         idea
                         │         prototype
Delivery ────────────────┘         discovered solution
                                   production solution
                                   live product
```


Discovery moves from an idea that could solve a problem to a prototype of an effective solution; once there is a solution worth building, the team proceeds to production-quality delivery.

| Concept                         | Meaning                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Problem**                     | Condition the team has been asked to change                                                                          |
| **Outcome**                     | A measurable change showing that the problem has been meaningfully improved                                          |
| **Solution idea**               | One possible approach to solving the problem                                                                        |
| **Prototype**                   | Cheap representation/implementation used to learn about that solution                                               |
| **Effective solution**          | A solution with enough evidence on value, usability, feasibility, and viability to justify building it              |
| **Production solution/product** | Commercial-quality implementation created through delivery                                                          |
| **Capability**                  | An ability the live product now provides to a user or system                                                        |
| **Feature**                     | A concrete piece of product output that implements some part of the solution/capability                             |

### But "effective solution" needs care


There's a subtle issue in SVPG's language.

At the end of discovery, they call it an **effective solution**: valuable, usable, feasible, and viable.

Discovery has not actually proved the business outcome.

Cagan explicitly says the ultimate test of whether the problem was solved and the necessary outcome achieved can only happen once the product is live.
