---
draft: false
toc: true
title: "API Gateway"
description: "API gateway responsibilities, request routing, shared policies, adoption trade-offs, implementation examples, and how to introduce the component during an interview."
linkTitle: "API Gateway"
---

An API gateway provides an entry point that routes client requests to backend services. Introduce it by explaining the routing problem it solves in this design.

Detail note for one option in [the request path]({{< ref "system-design/elements/request-path" >}}#external-api).

## Responsibilities


Start with request routing. Then identify any shared request handling assigned to the gateway, such as authentication, TLS termination, rate limiting, IP allowlisting, serving static content, or logging. Be clear about which responsibilities remain with the backend services.

The original Microsoft example asks how clients find the right endpoints as services are introduced or refactored. A gateway can provide a stable external API boundary while routing internally.

## When to introduce it


Consider the number of backend services, the client-facing interface, and the shared policies needed on the request path. Explain the benefit of a separate gateway relative to the complexity it adds.

In an interview, describe its role and move to the core design problem. Reserve implementation details for a deep dive when routing or policy enforcement is central to the exercise.

## Backends for frontends


A variant gives each kind of client its own gateway: one for mobile, one for web, one for third-party integrations. Each is usually owned by the team building that client, so it can shape responses and release on that client's schedule. The cost is duplication across gateways. See the [external API options]({{< ref "system-design/elements/request-path" >}}#external-api) for the comparison with a single gateway and with direct calls.

## Implementation examples from the notes


AWS API Gateway, Kong, NGINX, Apigee, and Traefik. Compare their relevant behavior when selecting an implementation rather than treating the names as interchangeable.

## Sources


- [API gateway deep dive -- Hello Interview](https://www.hellointerview.com/learn/system-design/deep-dives/api-gateway).
- [API gateways in microservices -- Microsoft](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway).
- [API gateway pattern -- microservices.io](https://microservices.io/patterns/apigateway.html).
- [AWS API Gateway resources](https://aws.amazon.com/api-gateway/resources/).
- [Video to review](https://www.youtube.com/watch?v=1vjOv_f9L8I).

## Library sources


- [Schmidt and Volpicella 2024](/sources/37a99125d274cdb06441dbca8cc2201e.bin), *AWS Fundamentals: AWS For The Real World*
