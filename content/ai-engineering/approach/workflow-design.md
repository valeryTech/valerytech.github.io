---
draft: false
toc: true
title: "Workflow Design"
linkTitle: "Workflow Design"
---

Designing workflows:

Interaction-point design approach for AI workflows. The idea was to expose uncertain pipeline decisions -- retrieval candidates, context assembly, validation, review judgments, and failure labels -- as inspectable artifacts before automating them. That gave us a way to compare variants, capture domain feedback as traces, and turn stable patterns into evaluation criteria, operational controls, or automated policies.

## Augmentation


**Augmentation** is about helping a human perform the work better or faster. The AI may draft, summarize, recommend, retrieve, classify, or prepare options, while the human remains the actor.

## Progressive autonomy


Use three release levels:

**Level 1 -- Read and recommend**

The agent retrieves information, prepares plans and drafts actions. Humans execute them.

**Level 2 -- Approved execution**

The agent prepares structured actions. Humans approve sensitive calls such as launching campaigns, contacting audiences or creating expensive commitments.

**Level 3 -- Bounded autonomy**

The agent executes low-risk actions inside explicit limits, such as booking appointments below a threshold, updating CRM fields or replying to standard questions.

Sensitive actions should retain an approval mechanism. Prompt injection and data leakage become material risks when agents can access confidential systems and invoke external tools. Official agent guidance recommends approval flows for sensitive operations and adversarial testing before deployment.
