---
contributors: []
date: 2025-02-21T16:55:53.183560
description: Default Description
draft: false
lastmod: 2025-02-21T16:55:53.183560
summary: ''
title: Api Gateway
toc: true
weight: 810
---

important things: define core responsiblities and how to introduce it to design
maybe add problem based lens

microsoft:
In a microservices architecture, a client might interact with more than one front-end service. Given this fact, how does a client know what endpoints to call? What happens when new services are introduced, or existing services are refactored? How do services handle SSL termination, authentication, and other concerns? An *API gateway* can help to address these challenges.

# Core Responsibilities

 > 
 > Funny enough, I'll often have candidates introduce a gateway in a system design interview and emphasize that it will do all this middleware stuff but never mention the core reason they need it -- **request routing**.

# Usage

 > 
 > The TLDR is: use it when you have a microservices architecture and don't use it when you have a simple client-server architecture.

With a microservices architecture, an API Gateway becomes almost essential. Without one, clients would need to know about and communicate with multiple services directly, leading to tighter coupling and more complex client code. The gateway provides a clean separation between your internal service architecture and your external API surface.

However, it's equally important to recognize when an API Gateway might be overkill. For simple monolithic applications or systems with a single client type, introducing an API Gateway adds unnecessary complexity.

 > 
 > I've mentioned this throughout, but I want it to be super clear. While it's important to understand every component you introduce into your design, the API Gateway is not the most interesting. There is a far greater chance that you are making a mistake by spending too much time on it than not enough.

 > 
 > Get it down, say it will handle routing and middleware, and move on.

# Sources

(good one)
https://www.hellointerview.com/learn/system-design/deep-dives/api-gateway

other to sort:

https://www.youtube.com/watch?v=1vjOv_f9L8I
https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway
https://microservices.io/patterns/apigateway.html
https://aws.amazon.com/api-gateway/resources/

# Common API Gateway Solutions:

* **AWS API Gateway**: A fully managed service from Amazon Web Services for creating, deploying, and managing APIs at any scale.
* **Kong**: An open-source, scalable API Gateway that is often used in microservices environments.
* **NGINX**: Frequently used as a reverse proxy and API Gateway, providing features like load balancing, request routing, and rate limiting.
* **Apigee**: A Google Cloud API management platform that offers full lifecycle API management with security, monitoring, and versioning.
* **Traefik**: A modern HTTP reverse proxy and load balancer for microservices, which acts as an API Gateway with built-in service discovery, SSL, and other functionalities.
