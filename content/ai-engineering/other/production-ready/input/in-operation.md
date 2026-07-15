---
draft: false
toc: true
title: "In Operation"
linkTitle: "In Operation"
---
I would operationalize production readiness as an **evidence-based risk-control system** attached to the service lifecycle. Each requirement should have an owner, measurable acceptance criteria, machine-verifiable evidence where possible, and an explicit exception process.

Google's PRR model evaluates architecture and dependencies, instrumentation, emergency response, capacity, change management, and service performance. It also recommends engaging during design rather than waiting until launch, when structural corrections become expensive. ([Google SRE](https://sre.google/sre-book/evolving-sre-engagement-model/ "Google SRE - Production Readiness Review: Engagement Insight"))

## 1. Classify the system before assessing it


Apply different requirements based on operational risk. A three- or four-tier model is usually sufficient.

|Attribute|Lower tier|Higher tier|
|---|---|---|
|User impact|Internal/non-critical|Customer-facing/critical|
|Data sensitivity|Public or disposable|PII, financial, regulated|
|Availability requirement|Best effort|Explicit SLO/SLA|
|Dependency criticality|Leaf service|Shared platform or dependency hub|
|Recovery tolerance|Hours or days|Minutes|
|Change blast radius|Small/reversible|Large or difficult to reverse|

The classification determines:

- Required controls
- Required reviewers
- Test depth
- Approval authority
- Review frequency
- Maximum waiver duration

This prevents a low-risk internal tool from undergoing the same process as a payment system.

## 2. Define readiness as controls plus evidence


Do not ask, "Is monitoring configured?" Define the control and the required proof.

|Domain|Example control|Required evidence|
|---|---|---|
|Ownership|A team owns build and runtime behavior|Service catalog entry, repository, escalation path|
|Service objectives|User-facing reliability is measurable|SLIs, SLOs, error-budget dashboard|
|Architecture|Failure modes and critical dependencies are understood|Architecture diagram, dependency map, FMEA|
|Deployment|Releases are controlled and reversible|Automated pipeline, canary strategy, tested rollback|
|Observability|Operators can detect and diagnose user impact|Dashboards, logs, traces, alert tests|
|Incident response|A responder can mitigate common failures|Runbooks, on-call rotation, escalation exercise|
|Capacity|The system supports expected and peak demand|Load-test report, capacity model, saturation alerts|
|Resilience|Dependency and infrastructure failures are tolerated|Failure-injection or game-day results|
|Data protection|Data can be restored within required objectives|RPO/RTO, restore-test evidence, retention policy|
|Security|Software and runtime risks are controlled|Threat model, scan results, IAM review, SBOM|
|Change safety|High-risk changes receive progressive exposure|Feature flags, staged rollout, kill switch|
|Operations|Routine work does not depend on undocumented knowledge|Automated procedures, maintenance documentation|
|Cost|Resource consumption is understood and bounded|Forecast, budgets, anomaly alerts|
|Compliance|Applicable obligations are mapped to controls|Control mapping and approval evidence|

SLOs, observability, performance testing, and capacity planning should be explicit parts of operational readiness rather than implicit architectural expectations. ([Google Cloud Documentation](https://docs.cloud.google.com/architecture/framework/operational-excellence/operational-readiness-and-performance-using-cloudops "Ensure operational readiness and performance using CloudOps  |  Cloud Architecture Center  |  Google Cloud Documentation")) Security controls should also be integrated into the development lifecycle instead of operating as a separate pre-release inspection; this is the model used by NIST's Secure Software Development Framework. ([NIST Computer Security Resource Center](https://csrc.nist.gov/pubs/sp/800/218/final "SP 800-218, Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities | CSRC"))

## 3. Separate hard gates from maturity scoring


A total score alone is unsafe because a system could compensate for missing backups with excellent documentation.

Use two mechanisms:

### Blocking controls


A failed blocker prevents launch for the applicable tier.

Typical blockers include:

- No accountable owner
- No rollback or forward-recovery mechanism
- No monitoring of user-visible failures
- Untested backup restoration for durable critical data
- Known critical security vulnerability
- No incident escalation path
- Capacity below projected launch demand
- Unbounded blast radius for a high-risk release

### Maturity score


Score non-blocking capabilities on a small scale:

- **0 -- absent**
- **1 -- documented or manually implemented**
- **2 -- implemented and tested**
- **3 -- automated and continuously verified**

Use the score to prioritize improvements, not to declare a system safe by arithmetic.

## 4. Put the review into the delivery lifecycle


A workable flow is:

### Design checkpoint


Triggered when the service or major change is proposed.

Outputs:

- Risk tier
- Initial SLOs
- Critical dependencies
- Data classification
- Threat model
- Availability and recovery architecture
- Named operational owner

### Implementation checkpoint


Continuously evaluated through CI/CD and the service catalog.

Examples:

- Infrastructure policies
- Dependency and vulnerability scans
- Test coverage for critical paths
- Deployment-policy validation
- Runbook and dashboard link validation
- Resource-limit checks
- Backup configuration checks

### Pre-production review


A human reviews only the items requiring judgment:

- Are the SLOs meaningful?
- Are alerts actionable?
- Are the identified failure modes credible?
- Can the on-call engineer operate the service?
- Is the launch plan appropriately staged?
- Is residual risk acceptable?

### Launch authorization


The outcome should be one of:

- **Approved**
- **Approved with time-bound conditions**
- **Rejected with blocking findings**
- **Approved for limited exposure only**

### Post-launch validation


Review actual production evidence after a defined traffic or time threshold:

- SLO behavior
- Alert quality
- Capacity assumptions
- Deployment failures
- Operational load
- Unexpected dependencies
- Cost profile

Google's PRR process similarly moves from analysis to prioritized improvements, training, responsibility transfer, and continued learning from operation and incidents. ([Google SRE](https://sre.google/sre-book/evolving-sre-engagement-model/ "Google SRE - Production Readiness Review: Engagement Insight"))

## 7. Automate evidence collection


The readiness system should pull evidence rather than asking teams to paste screenshots.

Potential integrations:

- Deployment platform: rollback and rollout configuration
- Observability platform: SLOs, alerts and dashboard ownership
- Incident system: recent incidents and outstanding actions
- Cloud/IaC platform: redundancy, backups and resource limits
- Security tooling: vulnerabilities, secrets and dependency status
- Service catalog: ownership, tier and dependencies
- Load-testing platform: latest validated capacity
- Source control: change approval and branch protection

Human review should focus on semantics and risk judgment. Machines should verify existence, freshness, configuration, and test results.

## 8. Define triggers for re-review


Production readiness decays. Re-run either the full review or affected domains when:

- The service changes risk tier
- Traffic increases materially
- A critical dependency is added
- Sensitive data is introduced
- The deployment architecture changes
- Ownership or on-call responsibility changes
- Recovery objectives change
- A severe incident exposes a control gap
- A waiver expires
- The system has not been reviewed within the tier's review period

A major change should invalidate specific controls rather than resetting the entire review.

## 9. Measure whether the process works


Track process health:

- Percentage of services with current readiness status
- Percentage of controls evaluated automatically
- Median remediation time for blockers
- Number and age of waivers
- Percentage of restores, rollbacks and failovers tested recently
- Alert-actionability rate
- Readiness-review lead time

Track production outcomes:

- SLO attainment and error-budget consumption
- Incident frequency and severity
- Time to detect and mitigate
- Escaped security vulnerabilities
- Capacity-related incidents
- Deployment failures and rework
- Operational toil

For delivery outcomes, DORA's current model uses change lead time, deployment frequency, failed-deployment recovery time, change fail rate, and deployment rework rate. These should be evaluated per application or service, since aggregating dissimilar systems obscures context. ([dora.dev](https://dora.dev/guides/dora-metrics/ "DORA | DORA's software delivery performance metrics"))

## Recommended operating principle


The central decision should be:

> **Does the organization have sufficient evidence that this system can be safely changed, observed, operated, degraded, and recovered within its stated business objectives?**

That produces a stronger process than a static launch checklist. It connects architecture, delivery, operations, security, and organizational ownership to explicit production risk.
