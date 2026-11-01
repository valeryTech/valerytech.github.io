---
draft: false
toc: true
title: "Production Readiness Model"
description: "Defines readiness as evidenced sufficiency for a specified production use across the system, technical environment, and responsible organization, within explicit uncertainty and residual risk."
linkTitle: "Model"
---
## Definition


**Production readiness is the state in which a defined system or change, its production environment, and the organization responsible for it are together sufficient for a specified production use (and based on the available evidence and within the defined limits of uncertainty and residual risk).**

The definition currently lists these elements:

1. **A defined subject** -- the system or change, its production environment, and the responsible organization.
2. **Contextual sufficiency** -- the required level of capability depends on the consequences and conditions of that use.
3. **Evidence** -- readiness must be supported by relevant and credible information.

Here, the phrase **"sufficient for a specific production use"** avoids embedding a universal checklist in the definition. The word **sufficient** compresses the context-specific requirements without defining them. Their meaning still needs to be made explicit in the model.

The definition therefore provides **the stable scope** of production readiness. The remaining sections of the model define how sufficiency is interpreted without prescribing the same requirements for every system.

## Subject of the Readiness


The definition includes **the production environment** to prevent readiness from being assessed only as a property of the software artifact and the responsible team. **"Its production environment"** means the external technical environment in which the system or change runs and interacts during live use.

Production readiness does not apply to the software artifact in isolation. The subject of a readiness claim is the combined operating setup required to provide and sustain the specified production use.

The unit of readiness consists of:

- **Defined system or change**. The technical artifact or change being considered for production use. Depending on scope, this may include: an application or service; a feature or release; a machine-learning model; an infrastructure component.
- **Technical production environment**. The technical environment in which the system is deployed, executed, observed, controlled, and recovered.
-  **Responsible organization**. The teams and organizational arrangements required to own, operate, support, and make decisions about the system. Depending on context, this may include: technical and operational ownership; operational knowledge; staffing and support coverage; incident responsibilities; escalation paths;
