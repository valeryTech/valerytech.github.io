---
draft: false
toc: true
title: "URL Shortener Additional"
linkTitle: "URL Shortener Additional"
---
# Back-of-envelope (40-50s)


- **Keyspace:** need ≥1B codes -> base62^5 ≈ 916M (<1B), base62^6 ≈ 56.8B -> choose **6-char** minimum, expandable to 7-8.
- **Traffic:** say 100M DAU, ~5 resolves/day ⇒ 500M/day ≈ **5.8k QPS** avg; peak ×10 ≈ **58k QPS** read. Writes are much smaller (≪1k QPS).
- **Storage:** 1B rows × ~1 KB/row (URL, code, meta) ≈ **~1 TB** raw (before replication).

(These numbers justify caches, partitioning, and avoiding hot databases on read path.)

# "Definition of Done" checklist for each FR


- Actor, input, output, HTTP codes defined
- Validation rules explicit (allowed schemes, length bounds)
- Uniqueness & collision behavior explicit
- Expiration semantics & statuses explicit
- Case sensitivity and charset documented
- Idempotency/dedup policy defined (and parameterizable)
- Security/abuse basics noted (rate limit, reserved aliases)
- Acceptance tests enumerated (unit + e2e)

(?) how we can come up and reason this design? What problems does it solve?

# URL Shortener "design skeleton" to draw


1. **Clients -> CDN/Edge**
2. **Edge cache** (POP/regional Redis or provider KV)
3. **Service** (stateless)
4. **NoSQL KV** (hash-sharded by `code`)
5. **Async bus** (cache invalidation, replication, expiry jobs)
6. **Admin/ops** (blocklists, takedown, reserved aliases)

Label latencies: Edge hit ≈ few ms; regional cache ≈ 5-20 ms; DB ≈ 2-10 ms (in-region) + network.

## Prepare a Degradation Plan (for the CV path)


Demonstrates operational maturity anchored to value.

- **If DB hot:** serve **cached redirects** and **negative-cache** 404/410; trip circuit breakers to protect p95.
- **If cache cold:** return short TTL 503 with human-friendly fallback (minimize blast radius).
- **If expiration job lags:** tolerate brief stale resolves; correctness catches up (availability over strict freshness).

(?) deep dives # If they push on one dimension

- **Bigger scale:** increase TTLs on very hot codes, push mapping into provider edge KV (Cloudflare KV/Workers, Fastly KV), or preload hot sets.
- **Stronger consistency on create:** conditional writes/unique index + per-alias token; still async propagate to caches.

**Stateless Service**: The redirection service should be stateless so you can scale it horizontally behind a load balancer.

Edge Cases

- **Case sensitivity:** codes are case‑insensitive (normalize to lower)
- **Very long URLs:** set a server‑side max length (e.g., ≤ 2,048 chars) with clear error
- **Negative caching:** treat 404/410 as cacheable for a short TTL (ops consideration; influences availability but not contract)
