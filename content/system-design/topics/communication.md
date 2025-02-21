---
contributors: []
date: 2025-02-21T17:37:47.886192
description: Default Description
draft: false
lastmod: 2025-02-21T17:37:47.886192
summary: ''
title: Communication
toc: true
weight: 810
---

Getting communication between microservices right is problematic for many due in great part, I feel, to the fact that people gravitate toward a chosen technological approach without first considering the different types of communication they might want. In this chapter, I’ll try and tease apart the different styles of communication to help you understand the pros and cons of each, as well as which approach will best fit your problem space.

Thus when it comes to the bewildering array of technology available to us for communication between microservices, I think it’s important to talk first about the style of communication you want, and only then look for the right technology to imple‐ ment that style. With that in mind, let’s take a look at a model I’ve been using for several years to help distinguish between the different approaches for microservice- to-microservice communication, which in turn can help you filter the technology options you’ll want to look at.

# Communication

## Polling vs Streaming

* sometimes we want to switch between these styles
* when we want to reduce latency (in what?) we can use streaming (proactively pushing a data using some long-lived open connection throught a socket for example)

# Collaboration

Now we can distinguish at least 2 types of collaboration: request-response collaboration with event-driven collaboration.

## API

API Gateway

An API gateway is an API management tool that sits between a client and a collection of backend services. API gateway is a fully managed service that supports rate limiting, SSL termination, authentication, IP whitelisting, servicing static content, etc.

[api_gateway](../elements/api_gateway.md)
