---
draft: false
toc: true
title: "URL Shortener NFRs"
linkTitle: "URL Shortener NFRs"
---
# hellointerview variant


**Core Requirements**

1. The system should ensure uniqueness for the short codes (no two long URLs can map to the same short URL)
2. The redirection should occur with minimal delay (< 100ms)
3. The system should be reliable and available 99.99% of the time (availability > consistency)
4. The system should scale to support 1B shortened URLs and 100M DAU

**Below the line (out of scope):**

- Data consistency in real-time analytics.
- Advanced security features like spam detection and malicious URL filtering.

# My Reasoning


- **Availability (Resolve -- CV):** v1 **99.9%** measured at the edge (successful redirects / total resolves). Error budget ≈ 0.1%.
- **Latency (Resolve -- CV):** p95 **< 100 ms** end‑to‑end for cached redirects.
- **Consistency:** **Availability > Consistency** for resolve; creation can be eventually consistent globally. (numbers?)
- **Scalability:** Keyspace sufficient for ≥ **1B** links (e.g., random base62 length≥6). Read‑heavy ratio; design read path for high QPS (addition) handle **tens of thousands QPS** read peaks.
- **Security/Abuse:** Basic anti‑abuse: rate limits per IP/key, blocklist of malicious domains, reserved aliases.
- **Observability (min):** Metrics for resolve success rate, latency; structured errors for create.
> **Upgrade path (only if needed):** 99.99% Resolve ⇒ multi‑region active/active + edge KV + dependency SLOs.
Traceability to Non-Functional Requirements (why FR choices matter)

- **<100ms redirect** -> favors 302 over 301 initially (less permanent caching risk), CDN/edge routing, hot path must avoid DB joins.
- **99.99% availability** -> resolution path must be **read-optimized**, possibly **eventually consistent** with write path; acceptability of slight propagation delay (e.g., alias visible globally within seconds).
- **Scale (1B links, 100M DAU)** -> alias length/charset, partitioning strategy, and **read-only hot path** design are influenced by FR-2 semantics.

Say:
> "I'll put the tight latency/availability SLOs on Resolve, and allow eventual consistency on Create. That's how we maximize user-perceived value."

# Structuring our work with NFRs


According to the Hello Interview framework, we address non-functional requirements (NFRs) in two main phases (The Hello Interview methodology integrates non-functional requirements into the system design process at two key stages:):

- **Initial Definition:** Immediately after establishing the functional requirements, we identify and document the most critical NFRs.
- **Design Refinement:** During the "Deep Dive" phase, we refine the High-Level Design. This design, which was initially created to meet functional requirements, is now adjusted to ensure it also satisfies the NFRs.

Therefore, by the time we reach the deep dive section, we have two key artifacts ready:

- The specified Functional Requirements.
- Initial version of NFRs
- A blueprint of the High-Level Design (HLD exists as a baseline for refinement).

# Availability

## Specific numbers Justification


Great call-out. Quoting **"99.99%"** without a reason _does_ sound like posturing. The fix is to **justify the SLO from user value and cost/complexity**, or start lower and show a path up. **Don't claim four nines unless you can justify the business need and the engineering spend**. Start with **99.9%** for v1, show the **upgrade path** to 99.99%, and you'll read as credible and value-driven.

# 1. Start with value -> pick a baseline SLO


- **Moment of value = Resolve (redirect).** It deserves the _tightest_ SLO.
- **Default, unless business says otherwise:** **99.9%** for v1.
	- That's ≈ **43.2 minutes/month** of downtime (30-day month).
	- It's achievable with **multi-AZ**, edge caching, and solid ops **without** multi-region active/active.

Only push to **99.99%** if you can **name the reason** (paid campaigns, partner SLAs, contractual penalties, or huge brand risk), because it drives a step-function in complexity/cost.

# 2. Translate nines -> architecture & cost (so it's not hand-wavy)


| SLO (Resolve) | Downtime/mo | Typical architecture commitment                                                                   |
| ------------- | ----------: | ------------------------------------------------------------------------------------------------- |
| **99.5%**     |    ~216 min | single region, multi-AZ; acceptable for MVP/internal                                              |
| **99.9%**     |   ~43.2 min | multi-AZ + CDN/edge cache; circuit breakers; DB not on hot path                                   |
| **99.95%**    |   ~21.6 min | add regional cache redundancy, automated failover drills                                          |
| **99.99%**    |   ~4.32 min | **multi-region active/active**, anycast DNS, edge KV, chaos/testing, rigorous dependency SLOs (?) |
> If you say "four nines," you're implicitly committing to **multi-region** and **edge-served** resolves, plus dependency budgets (DNS/CDN/KV).

# 3. Use an error-budget frame (sounds senior, keeps you honest)


- **SLI:** successful redirects / total resolve requests, measured at the edge (4xx due to user input excluded; 5xx and timeouts included).
- **99.9% SLO ⇒ error budget** ≈ 0.1% of requests. Spend it on deploys, chaos tests, and known risks.
- If business needs "near-zero downtime" during a launch week, temporarily raise the SLO or freeze risky changes.

# 4. Decision tree you can say in 20 seconds


- **Is downtime revenue/contract critical (ads, partners, campaigns)?**
	- **Yes** -> target **99.99%**, design multi-region active/active.
	- **No / MVP** -> **99.9%**; design for upgradeability later.
- **Will we serve from edge caches if origin is unhealthy?** If yes, effective availability rises without full multi-region DB.

# 5. Interview-safe phrasing (avoid impostor vibes)

> "Because resolve is the core value path, I'll set a **v1 SLO of 99.9%** (≈43 min/month). That's achievable with multi-AZ, CDN/edge cache, and cache-aside so the DB isn't on the hot path. **If we have revenue-critical campaigns or partner SLAs**, we can raise to **99.99%** by going multi-region active/active and pushing more logic into the edge KV. I'll design the read path to **upgrade** cleanly if we need that."

# Why mention anything at all?


- To **anchor priorities**: Resolve is the only path that must be ultra-available/low-latency.
- To **bound complexity**: 99.9% ⇒ multi-AZ + edge cache; 99.99% ⇒ multi-region. That's a real design fork.

# Micro-workflow for the NFR slice (under 20s)


1. Name the **value path**: "Resolve."
2. State the **trade-off**: "Availability > consistency."
3. Give a **single latency target** (optional): "p95 <100 ms."
4. Only give an **availability number if asked**; otherwise keep it directional.
5. **Offer an upgrade path** in one clause.

# Anti-impostor heuristics


- Don't drop "four nines" unless you also say "multi-region active/active + edge KV."
- If you can't justify, stay directional: "high availability on Resolve; eventually consistent Create."
- Use numbers **only** for the value path; keep the rest qualitative.
