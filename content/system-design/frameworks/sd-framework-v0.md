---
draft: false
toc: true
title: "Sd Framework V0"
linkTitle: "Sd Framework V0"
---
---

title: "SD Framework v0"

linkTitle: "SD Framework v0"

# Functional Requirements


???

## 8. One-minute script you can say verbatim


> "I'll structure FRs by **value**. The **Core Value** is redirecting a short code to its long URL; the **Enabler** is _creating that mapping_; alias/expiration are **Enhancements**.
> Functional contract:
> **Resolve (CV):** GET /{code} -> 302 if active, 410 if expired, 404 if unknown.
> **Create (EN):** POST /links {long_url, custom_alias?, expires_at?} -> {code, short_url}; alias unique; http/https only.
> I'll attach strict SLOs to the **Resolve** path -- p95 <100 ms, 99.99% availability, availability over consistency -- while allowing **eventual consistency** on **Create**. I'll design the **read path first** (CDN/edge cache -> sharded KV), then the write path (validate, unique insert, async cache warm). If time remains, I'll add alias/expiration details and management. This keeps the interview focused on user value."

## **Why this works**


- **Signals product thinking:** You're anchoring FRs to outcomes, not features.
- **Guides design trade-offs:** Read path gets the budget and the SLOs.
- **Keeps you on time:** You won't drown in enhancements before shipping value.

Use this structure on any system: name the **Moment of Value**, tag FRs as **CV/EN/EH**, attach SLOs only to CV, and sequence your design accordingly.

Great pushback. In a **5-minute** requirements pass, you only mention numbers if they (a) change the design you'll draw and (b) you can justify them in one line. A senior/staff engineer keeps it **directional** by default and only quantifies the **value path** if asked.

Here's how a staff-level person would handle it, verbatim.

# Number Pitfall

## **What to say (10-15 seconds total)**


**Default (directional, no numbers):**

> "Value path is **Resolve**. I'll prioritize **availability over consistency** on resolves and keep **redirect latency 'instant'**. Create can be eventually consistent."

**If interviewer asks for a number:**

> "For v1 I'll target **99.9% availability on Resolve** -- achievable with **multi-AZ + CDN/edge cache** -- and keep an **upgrade path** to 99.99% if we have campaign/partner SLAs. Redirect p95 **<100 ms**."

**If they insist on higher nines:**

> "At **99.99%** we're committing to **multi-region active/active + edge KV**. Happy to design that if it's a requirement; otherwise I'll keep v1 at 99.9% to avoid unnecessary complexity."

## **Why mention anything at all?**


- To **anchor priorities**: Resolve is the only path that must be ultra-available/low-latency.
- To **bound complexity**: 99.9% ⇒ multi-AZ + edge cache; 99.99% ⇒ multi-region. That's a real design fork.

## **Micro-workflow for the NFR slice (under 20s)**


1. Name the **value path**: "Resolve."
2. State the **trade-off**: "Availability > consistency."
3. Give a **single latency target** (optional): "p95 <100 ms."
4. Only give an **availability number if asked**; otherwise keep it directional.
5. **Offer an upgrade path** in one clause.

## **Anti-impostor heuristics**


- Don't drop "four nines" unless you also say "multi-region active/active + edge KV."
- If you can't justify, stay directional: "high availability on Resolve; eventually consistent Create."
- Use numbers **only** for the value path; keep the rest qualitative.

## **Example mini-dialog**


**Interviewer:** NFRs?

**You:** "Resolve is the value path -- **availability over consistency** and 'instant' redirects. Create can be eventually consistent."

**Interviewer:** Any targets?

**You:** "v1: **99.9%** Resolve with **multi-AZ + CDN**, p95 **<100 ms**. If we need **99.99%**, I'll go **multi-region active/active**; otherwise I'll keep it lean."

That's it -- clear, honest, and it buys you time to move to architecture without over-promising.

# SD Ideas

#idea: We can set scale (V) and throughput requirements such that a system fails to meet Non-Functional Requirements (NFRs) until the interviewee or designer implements necessary design adjustments or refactors.
#idea For each system design example, we can implement one of the following approaches:

- Introduce increased numerical requirements in a follow-up, preventing the interviewee from anticipating these conditions and thereby simulating a real-world scenario.
- Encrypt these numerical parameters within the initial conditions.

### Analysis of Your Ideas


Your two concepts are sound and are frequently used in interviews to differentiate between junior and senior candidates.

1. **Progressive Scaling:** Your first idea, where the scale/throughput requirements (`V`) are increased mid-interview, is an excellent method to test **iterative design and bottleneck analysis**. A candidate is forced to re-evaluate their initial design and identify which components will fail under the new load. This simulates the real-world evolution of a service and assesses whether the candidate can proactively refactor for scale.
2. **Implicit Requirements:** Your second idea, to obscure or omit key numerical requirements initially, effectively tests the candidate's **requirements-gathering discipline**. A strong candidate will not proceed with a design without first probing for critical NFRs like QPS (Queries Per Second), read/write ratios, latency targets, and availability goals. This technique filters for engineers who seek to understand the problem domain before proposing a solution.

# Other Important Interview Techniques


- **Cost Constraint:** "You have a very limited budget. Redesign this to minimize operational costs." This forces a discussion on serverless vs. containers, choice of database (managed vs. self-hosted), and efficient resource utilization.
- **Latency Constraint:** "This service must now serve a global audience with <100ms read latency. How do you achieve this?" This prompts a discussion on Content Delivery Networks (CDNs), multi-region replication, and read-replica database patterns.

## 2. Component Deep-Dive


After the high-level architecture is complete, select one component and require the candidate to explain its internal workings in detail. This prevents a candidate from simply listing buzzwords without understanding the underlying technology.

- **Database Schema:** "You chose a NoSQL database. Let's design the exact schema. How will you structure the partition key to avoid hot spots? What consistency level will you use for read and write operations, and why?"
- **Caching Strategy:** "You added a cache. Is this a read-through, write-through, or cache-aside pattern? What is your eviction policy (e.g., LRU, LFU)? How will you solve the thundering herd problem?"

## 3. Operational Scenarios (Day 2 Problems)


Ask the candidate to troubleshoot or manage their own design. This assesses practical experience and operational maturity.

- **Failure Analysis:** "It's 3 AM. You receive an alert for '5xx error rate spike.' Walk me through your debugging process. What metrics and logs do you look at first?"
- **Deployment Strategy:** "How would you roll out a backward-incompatible change to your API with zero downtime?" This should lead to a discussion of blue-green deployments, canary releases, and versioning.
