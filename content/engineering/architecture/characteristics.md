---
draft: false
toc: true
title: "Characteristics"
linkTitle: "Characteristics"
---
# Architectural Characteristics (Partially) Listed


Architectural characteristics exist along a broad spectrum of complexity, ranging from low-level code characteristics (such as modularity) to sophisticated operational concerns (such as scalability and elasticity). There is no true universal standard, though people have attempted to codify one. Instead, each organization interprets these terms for itself. Additionally, because the software ecosystem changes so fast, new concepts, terms, measures, and verifications are constantly appearing, providing new opportunities to define architectural characteristics.

While the sheer volume and breadth of architecture characteristics make it hard to quantify them, architects do categorize them. The following sections describe a few such broad categories and provide some examples.

## Operational Architectural Characteristics


Operational architectural characteristics cover capabilities such as performance, scalability, elasticity, availability, and reliability. Table 4-1 lists some operational architectural characteristics.

Table 4-1. Common operational architectural characteristics

| Term | Definition |
| --- | --- |
| Availability | How much of the time the system will need to be available; if that's 24/7, steps need to be in place to allow the system to be up and running quickly in case of any failure. |
| Continuity | The system's disaster recovery capability. |
| Performance | How well the system performs; ways to measure this include stress testing, peak analysis, analysis of the frequency of functions used, and response times. |
| Recoverability | Business continuity requirements: in case of a disaster, how quickly the system must get back online. This includes backup strategies and requirements for duplicate hardware. |
| Reliability/safety | Whether the system needs to be fail-safe, or if it is mission critical in a way that affects lives. If it fails, will it cost the company large sums of money? This is often a spectrum rather than a binary. |
| Robustness | The system's ability to handle error and boundary conditions while running, for example, if the internet connection or power fails. |
| Scalability | The system's ability to perform and operate as the number of users or requests increases. |

Operational architectural characteristics overlap heavily with operations and DevOps concerns.

## Structural Architectural Characteristics


Architects are responsible for proper code structure. In many cases, the architect has sole or shared responsibility for the code's quality, including its modularity, its readability, how well coupling between components is controlled, readable code, and a host of other internal quality assessments. Table 4-2 lists a few structural architectural characteristics.

Table 4-2. Structural architectural characteristics

| Term                  | Definition                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------- |
| Configurability       | How easily end users can change aspects of the software's configuration through interfaces.   |
| Extensibility         | How well the architecture accommodates changes that extend its existing functionality.        |
| Installability        | How easy it is to install the system on all necessary platforms.                              |
| Leverageability/reuse | The extent to which the system's common components can be leveraged across multiple products. |
| Localization          | Support for multiple languages on entry/query screens in data fields.                         |
| Maintainability       | How easy it is to apply changes and enhance the system.                                       |
| Portability           | The system's ability to run on more than one platform (such as Oracle and SAP DB).            |
| Upgradeability        | How easy and quick it is to upgrade to a newer version on servers and clients.                |

## Cloud Characteristics


The software development ecosystem constantly changes and evolves; the most recent excellent example is the arrival of the cloud. When the first edition was published, cloud-based computing existed but wasn't pervasive. Now, most systems have some interaction with cloud-based systems in at least some capacity. A few of these considerations appear in Table 4-3.

Table. Cloud provider architectural characteristics

| Term                              | Definition                                                                                                                                                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| On-demand scalability             | The cloud provider's ability to scale up resources dynamically based on demand.                                                                                                                                             |
| On-demand elasticity              | The cloud provider's flexibility as resource demands spike; similar to scalability.                                                                                                                                         |
| Zone-based availability           | The cloud provider's ability to separate resources by computing zones to make for more resilient systems.                                                                                                                   |
| Region-based privacy and security | The cloud provider's legal ability to store data from various countries and regions. Many countries have laws governing where their citizens' data may reside (and often restricting it from storage outside their region). |

## Cross-Cutting Architectural Characteristics


While many architectural characteristics fall into easily recognizable categories, others fall outside them or defy categorization, yet form important design constraints and considerations. Table 4-4 describes a few of these.

Table 4-4. Cross-cutting architectural characteristics

| Term                    | Definition                                                                                                                                                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Accessibility           | How easily all users can access the system, including those with disabilities like colorblindness or hearing loss.                                                                                                                                                                                     |
| Archivability           | The system's constraints around archiving or deleting data after a specified period of time.                                                                                                                                                                                                           |
| Authentication          | Security requirements to ensure users are who they say they are.                                                                                                                                                                                                                                       |
| Authorization           | Security requirements to ensure users can access only certain functions within the application (by use case, subsystem, web page, business rule, field level, etc.).                                                                                                                                   |
| Legal                   | The legislative constraints in which the system operates, such as data protection laws like GDPR or financial-records laws like Sarbanes-Oxley in the US, or any regulations regarding the way the application is to be built or deployed. This includes what reservation rights the company requires. |
| Privacy                 | The system's ability to encrypt and hide transactions from internal company employees, even DBAs and network architects.                                                                                                                                                                               |
| Security                | Rules and constraints about encryption in the database or for network communication between internal systems; authentication for remote user access, and other security measures.                                                                                                                      |
| Supportability          | The level of technical support the application needs; to what extent logging and other facilities are required to debug errors in the system.                                                                                                                                                          |
| Usability/achievability | The level of training required for users to achieve their goals with the application/solution.                                                                                                                                                                                                         |

Any list of architectural characteristics will necessarily be incomplete; any software project may invent architectural characteristics based on unique factors. Many of the terms we've just listed are imprecise and ambiguous, sometimes because of subtle nuance or a lack of objective definitions. For example, *interoperability* and *compatibility* may appear to be equivalent, and that will be true for some systems. However, they differ because *interoperability* implies ease of integration with other systems, which in turn implies published, documented APIs. *Compatibility*, on the other hand, is more concerned with industry and domain standards. Another example is *learnability*: one definition is "how easy it is for users to learn to use the software," and another definition is "the level at which the system can automatically learn about its environment in order to become self-configuring or self-optimizing using machine learning algorithms."

Many definitions overlap: *availability* and *reliability*, for instance. Yet consider the internet protocol IP, which underlies TCP. IP is *available* but not *reliable*: packets may arrive out of order, and the receiver may have to ask for missing packets again.

There is no complete list of standards defining these categories. The International Organization for Standards (ISO) publishes a [list organized by capabilities](https://oreil.ly/SKc_Y) that overlaps with our list here, but mainly establishes an incomplete category list. Here are some of the ISO definitions, reworded to update terms and add categories to align with modern concerns:

**Performance efficiency:** Measure of the performance relative to the amount of resources used under known conditions. This includes *time behavior* (measure of response, processing times, and/or throughput rates), *resource utilization* (amounts and types of resources used), and *capacity* (degree to which the maximum established limits are exceeded).

**Compatibility:** Degree to which a product, system, or component can exchange information with other products, systems, or components and/or perform its required functions while sharing the same hardware or software environment. It includes *coexistence* (can perform its required functions efficiently while sharing a common environment and resources with other products) and *interoperability* (degree to which two or more systems can exchange and utilize information).

**Usability:** Users can use the system effectively, efficiently, and satisfactorily for its intended purpose. It includes *appropriateness recognizability* (users can recognize whether the software is appropriate for their needs), *learnability* (how easily users can learn how to use the software), *user error protection* (protection against users making errors), and *accessibility* (make the software available to people with the widest range of characteristics and capabilities).

**Reliability:** Degree to which a system functions under specified conditions for a specified period of time. This characteristic includes subcategories such as *maturity* (does the software meet the reliability needs under normal operation), *availability* (software is operational and accessible), *fault tolerance* (does the software operate as intended despite hardware or software faults), and *recoverability* (can the software recover from failure by recovering any affected data and reestablish the desired state of the system).

**Security:** Degree to which the software protects information and data so that people or other products or systems have the degree of data access appropriate to their types and levels of authorization. This family of characteristics includes *confidentiality* (data is accessible only to those authorized to have access), *integrity* (the software prevents unauthorized access to or modification of software or data), *nonrepudiation* (can actions or events be proven to have taken place), *accountability* (can user actions of a user be traced), and *authenticity* (proving the identity of a user).

**Maintainability:** Represents the degree of effectiveness and efficiency to which developers can modify the software to improve it, correct it, or adapt it to changes in environment and/or requirements. This characteristic includes *modularity* (degree to which the software is composed of discrete components), *reusability* (degree to which developers can use an asset in more than one system or in building other assets), *analyzability* (how easily developers can gather concrete metrics about the software), *modifiability* (degree to which developers can modify the software without introducing defects or degrading existing product quality), and *testability* (how easily developers and others can test the software).

**Portability:** Degree to which developers can transfer a system, product, or component from one hardware, software, or other operational or usage environment to another. This characteristic includes the subcharacteristics of *adaptability* (can developers effectively and efficiently adapt the software for different or evolving hardware, software, or other operational or usage environments), *installability* (can the software be installed and/or uninstalled in a specified environment), and *replaceability* (how easily developers can replace the functionality with other software).

The last item in the ISO list addresses the functional aspects of software:

**Functional suitability:** This characteristic represents the degree to which a product or system provides functions that meet stated and implied needs when used under specified conditions. This characteristic is composed of the following subcharacteristics:

- **Functional completeness:** Degree to which the set of functions covers all the specified tasks and user objectives.
- **Functional correctness:** Degree to which a product or system provides the correct results with the needed degree of precision.
- **Functional appropriateness:** Degree to which the functions facilitate the accomplishment of specified tasks and objectives.

However, we do not believe that functional suitability belongs in this list. It does not describe architectural characteristics but rather the motivational requirements to build the software. This illustrates how thinking about the relationship between architectural characteristics and the problem domain has evolved. We cover this evolution in Chapter 7.
