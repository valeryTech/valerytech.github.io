---
draft: false
toc: true
title: "Intent Usage in the LLM-Based Workflow Era"
description: "A practical intent-detection guide for LLM workflows, covering routing, ambiguity, taxonomy design, classification methods, speech inputs, and evaluation without reducing intent to the whole task."
linkTitle: "Intent Usage in the LLM-Based Workflow Era"
---
## Executive Summary


Intent detection remains useful in LLM-based products, but its role has changed.

In earlier chatbot and NLU systems, intent classification often acted as the core control mechanism. The system identified a user intent such as `book_flight`, `track_order`, or `reset_password`, then executed a predefined flow. In LLM-based products, the model can interpret a much wider range of requests, handle ambiguity, and generate flexible responses. Because of that, intent detection should usually not be treated as the center of the whole product.

A better framing is to use intent as a lightweight routing and control layer.

Intent detection is useful when a product needs to activate the right feature, choose the right tool, route the request to the right workflow, reduce cost and latency, enforce policies, or generate analytics about user needs. It is less useful when the product is open-ended, exploratory, creative, or conversational enough that rigid categories would reduce the quality of the interaction.

The practical recommendation is:

> Use intent detection as a soft signal for routing, monitoring, and control. Do not force every user request into a rigid taxonomy unless the product domain truly requires deterministic branching.

## 1. What "Intent" Means in LLM Products


In LLM-based workflows, an **intent** is a structured description of what the user is trying to accomplish.

It is not necessarily the same as the literal words in the query. A user may say:

> "My laptop order still hasn't arrived."

The underlying intent could be:

```text
track_order
```


The same user might also imply multiple sub-intents:

```text
track_order
complaint
request_human_support
```


Intent is therefore best understood as a compressed semantic label that helps the system decide what to do next.

Common examples include:

| User Query | Possible Intent |
|---|---|
| "Where is my package?" | `order_tracking` |
| "Summarize this contract." | `document_summary` |
| "Can you query sales by region?" | `sql_generation` |
| "I need help with a refund." | `support_refund` |
| "Book me a flight to Tokyo." | `booking` |
| "Search my files for the latest roadmap." | `document_search` |
| "This answer is wrong." | `feedback_or_correction` |
| "I want to talk to a person." | `agent_handoff` |

In modern LLM systems, intent can be represented in several ways:

```json
{
  "intent": "order_tracking",
  "confidence": 0.91,
  "entities": {
    "order_id": "A12345"
  },
  "needs_clarification": false
}
```


Or, in a softer multi-label format:

```json
{
  "intents": [
    {
      "name": "order_tracking",
      "confidence": 0.82
    },
    {
      "name": "complaint",
      "confidence": 0.64
    }
  ],
  "routing_recommendation": "order_status_workflow"
}
```


The second pattern is often better for LLM products because real user requests are frequently ambiguous, mixed, or multi-step.

## 2. Why Intent Detection Still Matters


LLMs can understand natural language without traditional intent classifiers, but intent detection still helps when a product has operational constraints.

The main value is not "understanding" in the abstract. The value is control.

Intent detection helps answer questions such as:

- Which workflow should handle this request?
- Which tool should be called?
- Should this go to search, document QA, SQL generation, booking, or support?
- Is this request safe to process automatically?
- Should the system ask a clarifying question?
- Should the request be escalated to a human?
- Can a cheaper or faster model handle this?
- How should this interaction be logged for analytics?

In other words, intent detection helps translate a free-form user query into an actionable product decision.

## 3. When Intent Detection Helps


Intent detection is most useful when the product has clear branches.

### 3.1 Routing to the Right Workflow


If the product supports multiple workflows, intent detection can route the user request before generation starts.

Example workflows:

```text
search
document_qa
sql_generation
support_ticket
booking
billing
agent_handoff
general_chat
```


A routing layer can classify the request and send it to the right subsystem.

Example:

```json
{
  "user_query": "Show me revenue by region for Q4",
  "intent": "analytics_sql_query",
  "route": "sql_generation_workflow"
}
```


This avoids sending every query through a single general-purpose prompt or agent.

### 3.2 Activating the Right Tool


LLM products often have many tools:

- Web search
- File search
- Database query
- Calendar access
- Email access
- CRM lookup
- Payment system lookup
- Code execution
- Human handoff

Intent detection can help decide which tool should be available or called.

Example:

```json
{
  "intent": "calendar_scheduling",
  "enabled_tools": ["calendar_search", "calendar_create_event"]
}
```


This can reduce tool misuse and improve system predictability.

### 3.3 Reducing Latency and Cost


Intent detection can also support model routing.

A simple request may not need the largest model. A complex reasoning task may need a stronger model. Some requests may only need retrieval or a deterministic function call.

Example:

```json
{
  "intent": "faq_lookup",
  "model": "small_fast_model",
  "retrieval": true
}
```


Another example:

```json
{
  "intent": "complex_policy_analysis",
  "model": "strong_reasoning_model",
  "retrieval": true
}
```


This pattern is especially useful at scale, where cost and latency matter.

### 3.4 Improving Analytics


Free-form LLM outputs are hard to monitor. Intent labels are easier to aggregate.

Product teams can use intent data to understand:

- What users ask most often
- Which workflows fail
- Which intents lead to escalation
- Which requests are out of scope
- Which features users are trying to access
- Which categories produce poor satisfaction

Example analytics table:

| Intent | Volume | Escalation Rate | Failure Rate |
|---|---:|---:|---:|
| `order_tracking` | 42,100 | 3.2% | 1.1% |
| `refund_request` | 18,450 | 11.8% | 4.7% |
| `technical_support` | 31,900 | 22.4% | 8.3% |
| `general_question` | 76,300 | 1.5% | 2.0% |

This gives teams a more stable view than raw conversations alone.

### 3.5 Supporting Policy Enforcement


Intent detection can help apply different policies to different request types.

Example:

```json
{
  "intent": "financial_advice",
  "policy": "require_disclaimer_and_no_personalized_investment_instruction"
}
```


Or:

```json
{
  "intent": "account_deletion",
  "policy": "require_identity_verification"
}
```


This does not replace safety systems, but it can help route sensitive requests into stricter handling paths.

### 3.6 Human Handoff


Intent detection is useful when a request should be escalated.

Common handoff triggers:

- User explicitly asks for a human
- The issue is high value or high risk
- The user is angry or dissatisfied
- The system lacks required permissions
- The request has failed repeatedly
- The request involves billing, legal, safety, or account access

Example:

```json
{
  "intent": "agent_handoff",
  "reason": "user_requested_human",
  "priority": "normal"
}
```

## 4. When Not to Force Intent Detection


Intent detection becomes harmful when the taxonomy is too rigid for the product.

### 4.1 Open-Ended Conversational Products


For general assistants, users may ask:

> "Help me think through whether I should leave my job."

This does not fit neatly into a single operational intent. It could involve:

- Advice
- Career planning
- Emotional support
- Decision-making
- Writing assistance
- Follow-up exploration

Forcing it into one label may reduce the quality of the response.

### 4.2 Creative or Exploratory Work


Creative tasks are often iterative.

Example:

> "Make this more direct, but not too cold. Maybe a little warmer, but still professional."

A rigid intent such as `rewrite_text` is technically correct but incomplete. The important details are style, audience, tone, constraints, and iteration history.

In these cases, a full task representation is more useful than a simple intent label.

### 4.3 Multi-Step Requests


Users often combine several actions:

> "Find the latest customer feedback, summarize the common complaints, and draft a response plan."

Possible intents:

```text
search
summarization
analysis
planning
writing
```


A single hard label would be misleading. Better options include:

- Multi-label intent detection
- Task decomposition
- Workflow planning
- Tool routing per step

### 4.4 Ambiguous Requests


Example:

> "Can you check my account?"

This could mean:

- Billing status
- Security status
- Subscription status
- Order status
- Account settings
- Login issue

A good system should not blindly classify this into one intent. It should either ask a clarifying question or inspect available context before routing.

## 5. Common Goals of Intent Detection


Intent detection in LLM products usually serves one or more of the following goals.

| Goal | Description |
|---|---|
| Routing | Send the request to the right workflow, tool, or model. |
| Control | Make system behavior more deterministic. |
| Cost optimization | Use cheaper models or simpler workflows when possible. |
| Latency reduction | Avoid unnecessary reasoning, tool calls, or retrieval. |
| Analytics | Track what users are trying to do. |
| Safety and policy | Apply different handling rules by request type. |
| Escalation | Detect when a human should take over. |
| Clarification | Identify when the user's request is underspecified. |
| Personalization | Adapt behavior based on task type and user context. |
| Evaluation | Measure performance by category. |

Intent detection is therefore most valuable as infrastructure around the LLM, not as a replacement for the LLM.

## 6. How to Implement Intent Detection


There are several implementation patterns.

### 6.1 Rule-Based Intent Detection


This is the simplest approach.

Example:

```python
if "refund" in user_query.lower():
    intent = "refund_request"
elif "where is my order" in user_query.lower():
    intent = "order_tracking"
else:
    intent = "unknown"
```


Use this when:

- The domain is narrow
- Keywords are reliable
- The cost of mistakes is low
- You need very fast routing
- You need deterministic behavior

Limitations:

- Brittle
- Poor with paraphrases
- Hard to scale
- Poor with ambiguity
- Weak with multilingual input

### 6.2 Classical Classifier


A trained classifier can map user text to intent labels.

Example labels:

```text
refund_request
order_tracking
billing_issue
technical_support
agent_handoff
out_of_scope
```


Use this when:

- You have labeled training data
- The taxonomy is stable
- The domain is well-defined
- You need low-latency classification

Limitations:

- Requires training data
- Can degrade when user behavior changes
- Does not naturally handle novel intents
- May struggle with multi-intent requests

### 6.3 LLM-Based Intent Classification


An LLM can classify the query into a structured schema.

Example prompt pattern:

```text
Classify the user's request into one or more intents.

Allowed intents:
- search
- document_qa
- sql_generation
- booking
- support
- agent_handoff
- general_chat
- out_of_scope

Return JSON only.

User query:
{user_query}
```


Expected output:

```json
{
  "primary_intent": "document_qa",
  "secondary_intents": ["summarization"],
  "confidence": 0.86,
  "needs_clarification": false
}
```


Use this when:

- Requests are varied
- You need semantic understanding
- You have limited labeled data
- You want explainable routing metadata
- You need multi-label classification

Limitations:

- Higher cost than rules
- Higher latency
- Can be inconsistent without strict schemas
- Needs evaluation and monitoring
- Can over-classify ambiguous inputs

### 6.4 Embedding-Based Routing


In this pattern, each intent has example utterances. The user query is embedded and matched to the closest examples.

Example:

```text
Intent: order_tracking
Examples:
- Where is my order?
- Track my package.
- Has my shipment arrived?

Intent: refund_request
Examples:
- I want a refund.
- Can I return this item?
- I was charged incorrectly.
```


Use this when:

- You need fast approximate semantic matching
- You have representative examples
- You want flexible matching without full model calls
- You want a middle ground between rules and LLM classification

Limitations:

- Sensitive to example quality
- Can confuse similar intents
- Requires threshold tuning
- Does not always handle complex multi-step requests

### 6.5 Hybrid Intent Detection


The strongest systems often combine methods.

Example pipeline:

```text
1. Rule-based checks for high-confidence deterministic cases.
2. Embedding-based matching for common semantic categories.
3. LLM classifier for ambiguous or complex cases.
4. Fallback to clarification or general assistant mode.
```


Example output:

```json
{
  "primary_intent": "refund_request",
  "confidence": 0.78,
  "source": "hybrid_classifier",
  "needs_clarification": true,
  "clarifying_question": "Are you asking to return an item or dispute a charge?"
}
```


Hybrid systems are useful because they balance cost, latency, and accuracy.

## 7. Recommended Architecture


A practical LLM workflow can treat intent detection as an early routing layer.

```text
User Query
   ↓
Preprocessing
   ↓
Intent / Task Detection
   ↓
Policy Check
   ↓
Route Selection
   ↓
Tool or Workflow Execution
   ↓
LLM Response Generation
   ↓
Post-Processing and Evaluation
```


A more detailed architecture:

```text
User Query
   ↓
Input normalization
   ↓
Intent detection
   ├── primary intent
   ├── secondary intents
   ├── confidence score
   ├── required entities
   ├── ambiguity flag
   └── risk category
   ↓
Routing decision
   ├── answer directly
   ├── ask clarification
   ├── retrieve documents
   ├── call tool
   ├── generate SQL
   ├── escalate to human
   └── refuse or redirect
   ↓
Workflow execution
   ↓
Response
```


The key design principle:

> Intent detection should help decide what should happen next. It should not be treated as the only representation of the user's need.

## 8. Designing an Intent Taxonomy


An intent taxonomy should be small enough to maintain but expressive enough to route real requests.

### 8.1 Start With Product Actions


Do not start with abstract user psychology. Start with what the product can actually do.

Poor taxonomy:

```text
curious
confused
angry
informational
transactional
navigational
```


Better taxonomy:

```text
search_knowledge_base
track_order
request_refund
generate_sql
summarize_document
create_ticket
handoff_to_agent
```


The better taxonomy maps directly to product behavior.

### 8.2 Use an `unknown` or `out_of_scope` Intent


Every production taxonomy should include a fallback.

Examples:

```text
unknown
out_of_scope
needs_clarification
general_chat
```


Without this, the classifier will force unsupported requests into incorrect categories.

### 8.3 Support Multi-Intent Inputs


Many user queries contain more than one intent.

Example:

> "Find my latest invoice and email it to my accountant."

This includes:

```text
document_search
email_sending
possibly_contact_lookup
```


A better output:

```json
{
  "primary_intent": "document_search",
  "secondary_intents": ["email_sending"],
  "required_entities": ["invoice", "recipient"],
  "needs_clarification": false
}
```

### 8.4 Separate Intent From Entities


Intent describes what the user wants to do. Entities describe the variables needed to do it.

Example:

```json
{
  "intent": "book_flight",
  "entities": {
    "destination": "Tokyo",
    "departure_date": "2026-02-10",
    "return_date": "2026-02-20"
  }
}
```


Do not create separate intents for every entity variation.

Poor taxonomy:

```text
book_flight_to_tokyo
book_flight_to_london
book_flight_to_paris
```


Better taxonomy:

```text
book_flight
```


With entities:

```json
{
  "destination": "Tokyo"
}
```

### 8.5 Avoid Overlapping Labels


Overlapping labels create unstable routing.

Problematic labels:

```text
support
technical_support
help
issue
problem
troubleshooting
```


These may all describe similar requests.

Better labels:

```text
account_access_issue
billing_issue
product_bug_report
usage_question
refund_request
```


Each label should imply a distinct product action.

## 9. Soft Routing vs Hard Gating


Intent detection can be used in two ways.

### 9.1 Hard Gating


The detected intent strictly determines the workflow.

Example:

```text
If intent = refund_request → always open refund workflow.
```


This is useful for:

- Regulated processes
- Security-sensitive actions
- Deterministic enterprise workflows
- Simple transactional systems

But it is risky when:

- User requests are ambiguous
- The classifier is uncertain
- Multiple intents are present
- The taxonomy is incomplete

### 9.2 Soft Routing


The detected intent is treated as one signal among several.

Example:

```json
{
  "intent": "refund_request",
  "confidence": 0.61,
  "action": "ask_clarification"
}
```


Soft routing is usually better for LLM products.

The system can consider:

- Intent
- Confidence
- User context
- Conversation history
- Available tools
- Risk level
- Missing entities
- Policy constraints

Recommended pattern:

```text
High confidence + low risk → route automatically
Medium confidence → ask clarification or use broader workflow
Low confidence → general assistant or fallback
High risk → stricter policy or human review
```

## 10. Pitfalls

### 10.1 Over-Rigid Taxonomies


A taxonomy that is too narrow will misrepresent user needs.

Symptoms:

- Many requests classified as the wrong intent
- Users frequently correct the assistant
- The assistant gives irrelevant workflow responses
- Product teams keep adding labels to patch failures

Fix:

- Use broader intents
- Add `unknown` and `needs_clarification`
- Support multi-label classification
- Revisit taxonomy using real conversation logs

### 10.2 Intent Explosion


Teams often keep adding new labels.

Example:

```text
refund_request
refund_status
refund_policy
refund_delay
refund_denied
refund_for_damaged_item
refund_for_late_delivery
refund_for_duplicate_charge
```


This can become hard to maintain.

Better approach:

```text
refund
```


With attributes:

```json
{
  "refund_subtype": "duplicate_charge",
  "status": "requested"
}
```


Use entities and metadata instead of creating too many labels.

### 10.3 Ignoring Ambiguity


A classifier may confidently choose one intent even when the user is unclear.

Example:

> "I need help with my payment."

Possible meanings:

- Failed payment
- Duplicate charge
- Refund
- Update payment method
- Invoice request

Bad behavior:

```json
{
  "intent": "refund_request",
  "confidence": 0.94
}
```


Better behavior:

```json
{
  "intent": "billing_issue",
  "confidence": 0.67,
  "needs_clarification": true,
  "clarifying_question": "Are you trying to update your payment method, dispute a charge, or request a refund?"
}
```

### 10.4 Treating Intent as the Whole Task


Intent is only one part of understanding the user.

A full task representation may need:

- Intent
- Entities
- Constraints
- User preferences
- Conversation history
- Required tools
- Risk level
- Output format
- Success criteria

Example:

```json
{
  "intent": "summarize_document",
  "document": "contract.pdf",
  "constraints": {
    "audience": "non-lawyer",
    "length": "short",
    "focus": "termination clauses"
  },
  "output_format": "bullets"
}
```


The intent alone is insufficient.

### 10.5 Poor Out-of-Scope Handling


If a system lacks an out-of-scope path, it may hallucinate capabilities.

Example:

> "Cancel my bank transfer."

If the assistant cannot actually do that, it should not pretend it can.

Better response path:

```json
{
  "intent": "unsupported_transaction_action",
  "route": "explain_limitation",
  "handoff_available": true
}
```

### 10.6 Using Intent Detection Without Evaluation


Intent classifiers need evaluation.

Track:

- Accuracy
- Precision and recall by intent
- Confusion matrix
- False positive rate
- Out-of-scope detection
- Clarification rate
- Escalation rate
- Cost per routed request
- Latency impact
- Downstream task success

Do not only measure classifier accuracy. Measure whether routing improves the product outcome.

### 10.7 Making the User Adapt to the Taxonomy


Users should not need to know the system's intent labels.

Bad UX:

> "Please select whether this is a billing_support_refund_status_query or billing_support_refund_request."

Better UX:

> "Are you asking about the status of an existing refund, or do you want to request a new refund?"

Intent systems should simplify the user experience, not expose internal complexity.

## 11. Evaluation Strategy


A useful evaluation set should include:

1. Clear single-intent examples
2. Multi-intent examples
3. Ambiguous examples
4. Out-of-scope examples
5. Adversarial or misleading examples
6. Short utterances
7. Long conversational requests
8. Noisy speech or ASR-style transcripts
9. Domain-specific terminology
10. Real historical user queries

Example test cases:

| Query | Expected Behavior |
|---|---|
| "Where is my package?" | Route to order tracking. |
| "I want a refund." | Route to refund workflow. |
| "This charge looks wrong." | Route to billing issue, possibly clarify. |
| "Can you summarize this PDF?" | Route to document QA or summarization. |
| "Find the report and email it to Sarah." | Multi-step workflow. |
| "Help." | Ask clarification. |
| "Cancel my mortgage payment." | Policy or unsupported action handling. |
| "What is the best way to learn Python?" | General assistant or learning workflow. |

Good metrics include:

```text
intent_accuracy
route_accuracy
clarification_precision
out_of_scope_recall
tool_selection_accuracy
workflow_success_rate
latency_reduction
cost_reduction
user_satisfaction
```


The most important metric is not whether the label is theoretically correct. The most important metric is whether the system took the right next action.

## 12. Practical Design Patterns

### 12.1 Intent + Confidence + Action


Do not return only an intent label.

Better schema:

```json
{
  "primary_intent": "refund_request",
  "secondary_intents": [],
  "confidence": 0.88,
  "needs_clarification": false,
  "recommended_action": "start_refund_workflow"
}
```

### 12.2 Intent + Missing Information


For transactional workflows, detect missing fields.

Example:

```json
{
  "intent": "book_meeting",
  "entities": {
    "attendees": ["alex@example.com"],
    "date": null,
    "duration": "30 minutes"
  },
  "missing_required_fields": ["date"],
  "recommended_action": "ask_clarification"
}
```

### 12.3 Intent + Risk Level


Add a risk field when actions have different safety requirements.

```json
{
  "intent": "delete_account",
  "risk_level": "high",
  "recommended_action": "require_confirmation_and_identity_check"
}
```

### 12.4 Intent + Model Route


Use intent to choose the model or workflow.

```json
{
  "intent": "simple_faq",
  "model_route": "small_fast_model",
  "retrieval_required": true
}
```

```json
{
  "intent": "complex_reasoning",
  "model_route": "reasoning_model",
  "retrieval_required": false
}
```

### 12.5 Intent + Human Escalation

```json
{
  "intent": "technical_support",
  "sentiment": "frustrated",
  "previous_failures": 2,
  "recommended_action": "human_handoff"
}
```

## 13. Example Prompt for LLM-Based Intent Detection

```text
You are an intent detection module for an LLM product.

Classify the user request into one or more intents. Use only the allowed intents.

Allowed intents:
- general_chat
- search
- document_qa
- summarize_document
- sql_generation
- booking
- order_tracking
- refund_request
- billing_issue
- technical_support
- agent_handoff
- feedback
- out_of_scope
- needs_clarification

Return valid JSON only.

Rules:
- If the request contains multiple tasks, include secondary_intents.
- If the request is ambiguous, set needs_clarification to true.
- If the request is unsupported, use out_of_scope.
- Do not invent entities.
- Prefer broader labels over overly specific labels.

User request:
{user_query}
```


Expected output:

```json
{
  "primary_intent": "order_tracking",
  "secondary_intents": [],
  "confidence": 0.9,
  "entities": {
    "order_id": null
  },
  "missing_required_fields": ["order_id"],
  "needs_clarification": true,
  "clarifying_question": "What is your order number?",
  "recommended_action": "ask_clarification"
}
```

## 14. Example Production Schema

```json
{
  "type": "object",
  "properties": {
    "primary_intent": {
      "type": "string"
    },
    "secondary_intents": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1
    },
    "entities": {
      "type": "object"
    },
    "missing_required_fields": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "needs_clarification": {
      "type": "boolean"
    },
    "clarifying_question": {
      "type": "string"
    },
    "risk_level": {
      "type": "string",
      "enum": ["low", "medium", "high"]
    },
    "recommended_action": {
      "type": "string"
    }
  },
  "required": [
    "primary_intent",
    "secondary_intents",
    "confidence",
    "needs_clarification",
    "risk_level",
    "recommended_action"
  ]
}
```

## 15. Intent Usage in Speech-Based Workflows


Intent detection is also useful for speech interfaces, but speech adds noise.

Speech input may include:

- ASR transcription errors
- Incomplete sentences
- Fillers
- Corrections
- Background noise
- Turn-taking issues

Example speech transcript:

> "uh yeah I need to, like, change the thing for tomorrow, the appointment I mean"

Possible structured output:

```json
{
  "intent": "modify_booking",
  "confidence": 0.71,
  "entities": {
    "date": "tomorrow",
    "object": "appointment"
  },
  "needs_clarification": true,
  "clarifying_question": "Which appointment would you like to change?"
}
```


For speech, the intent layer should be tolerant of uncertainty and should frequently use clarification rather than hard routing.

## 16. Recommended Operating Principles


1. Use intent detection when the product has meaningful branches.
2. Keep the taxonomy tied to product actions.
3. Treat intent as a routing signal, not the whole intelligence layer.
4. Support `unknown`, `out_of_scope`, and `needs_clarification`.
5. Prefer multi-label outputs for complex requests.
6. Separate intents from entities and metadata.
7. Use confidence thresholds.
8. Evaluate route success, not only classification accuracy.
9. Monitor real conversation logs and update the taxonomy.
10. Avoid exposing internal labels to users.

## 17. Recommended Minimal Intent Set


For many LLM products, a small starter taxonomy is enough.

```text
general_chat
search
document_qa
summarization
data_analysis
sql_generation
content_generation
workflow_action
support
billing
account_management
booking_or_scheduling
feedback_or_correction
agent_handoff
needs_clarification
out_of_scope
```


This can then be specialized by domain.

Example for ecommerce:

```text
product_search
order_tracking
refund_or_return
payment_issue
shipping_issue
account_issue
agent_handoff
out_of_scope
```


Example for enterprise knowledge tools:

```text
document_search
document_summary
policy_question
data_query
report_generation
task_creation
permission_issue
agent_handoff
out_of_scope
```


Example for developer tools:

```text
code_generation
debugging
documentation_search
architecture_question
test_generation
deployment_issue
security_review
out_of_scope
```

## 18. Conclusion


Intent detection is still useful in the LLM era, but it should be used differently than in traditional chatbot systems.

The strongest use case is not replacing the LLM's understanding. The strongest use case is operational control.

Intent detection helps LLM products route requests, activate tools, enforce policies, reduce latency, control costs, support analytics, and decide when to ask clarifying questions or escalate to a human.

The main risk is overusing it. A rigid intent taxonomy can oversimplify user needs, especially in open-ended, exploratory, multi-step, or creative conversations.

The best production pattern is to use intent as a lightweight, inspectable signal in a broader orchestration layer.

A good intent system does not ask, "What bucket can we force this user into?"

It asks:

> "What should the system do next, given what the user seems to want?"

## References


1. Anthropic. *Building Effective Agents*.
   <https://www.anthropic.com/research/building-effective-agents>
2. OpenAI. *Latency Optimization*.
   <https://developers.openai.com/api/docs/guides/latency-optimization>
3. Microsoft Azure. *Conversational Language Understanding Overview*.
   <https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/overview>
4. Microsoft Azure. *Conversational Language Understanding Best Practices*.
   <https://docs.azure.cn/en-us/ai-services/language-service/conversational-language-understanding/concepts/best-practices>
5. Microsoft Azure. *None Intent in Conversational Language Understanding*.
   <https://learn.microsoft.com/en-us/azure/ai-services/language-service/conversational-language-understanding/concepts/none-intent>
6. Google Cloud. *Dialogflow CX: Intents*.
   <https://docs.cloud.google.com/dialogflow/cx/docs/concept/intent>
7. *A Taxonomy of Human-LLM Interaction*. arXiv.
   <https://arxiv.org/abs/2309.13063>
8. *A Taxonomy of Human-LLM Interaction -- HTML Version*. arXiv.
   <https://arxiv.org/html/2309.13063v2>
9. *Understanding User Interactions with LLM-Based Chatbots*. arXiv.
   <https://arxiv.org/abs/2401.08329>
10. Mackenzie, J. M. *SIGIR Study on Bard Interaction Logs*.
    <https://jmmackenzie.io/pdf/tamg24-sigir.pdf>
11. *User Intent Recognition in LLM Interactions*. arXiv.
    <https://arxiv.org/abs/2402.02136>
12. *Survey on Spoken Language Understanding*. IJCAI.
    <https://www.ijcai.org/proceedings/2021/0622.pdf>
13. *LLM-Based Spoken Language Understanding*. arXiv.
    <https://arxiv.org/abs/2401.02921>
14. *ASR-Robust Spoken Language Understanding with Word Confusion Networks*. arXiv.
    <https://arxiv.org/html/2411.00023v2>
15. *Multi-Intent Spoken Language Understanding*. arXiv.
    <https://arxiv.org/abs/2512.11258>
16. *FrugalGPT*. arXiv.
    <https://arxiv.org/abs/2305.05176>
17. *RouteLLM*. arXiv.
    <https://arxiv.org/abs/2406.18665>
18. *Survey on LLM Routing and Cascades*. arXiv.
    <https://arxiv.org/html/2502.00409v3>
19. *Survey on Model Routing for LLMs*. arXiv.
    <https://arxiv.org/html/2603.04445v2>
20. *Intent Detection in the Age of LLMs*. arXiv.
    <https://arxiv.org/abs/2410.01627>
21. *Production-Oriented Multi-Turn Intent Classification*. arXiv.
    <https://arxiv.org/abs/2411.12307>
22. *Hybrid Intent Recognition and Out-of-Scope Detection*. arXiv.
    <https://arxiv.org/abs/2507.22289>
23. *Dynamic Label Refinement for Few-Shot Intent Classification*. arXiv.
    <https://arxiv.org/abs/2412.15603>
24. *Conversational User-AI Intervention: Prompt Rewriting for Improved LLM Response Generation*. arXiv.
    <https://arxiv.org/pdf/2503.16789>
25. *Privacy Risks in LLM Routing*. arXiv.
    <https://arxiv.org/html/2604.15728v1>
26. *Policy-Governed LLM Routing with Intent Matching*. arXiv.
    <https://arxiv.org/html/2604.26955v1>

## Library sources


- [Freed et al. 2025](/sources/ai-engineering/practice/freed-2025-effective-conversational-ai.pdf.enc), *Effective Conversational AI*
