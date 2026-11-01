---
draft: false
toc: true
description: "Working interpretation of Cagan’s delivery principles derives small changes, fast feedback, and safe recovery from customer protection, responsiveness, and trust, treating deployment frequency as supporting evidence."
title: "Cagan"
linkTitle: "Cagan"
---
# Delivery principles


The company and its customers need reliable, consistent, and frequent delivery.

## How Products Are Built and Deployed


Technology investment should create value for customers and the company. Several skills contribute to that value, but engineers provide the main product-building capability.

### Three Core Principles


Engineers can use many tools, methods, and processes to build, test, and deploy products. More important than any particular choice are **three core principles** that form the basis of how strong product companies build products:

- protect customers, revenue, brand, and colleagues;
- respond quickly to market needs and problems;
- earn customer trust.

These are **goals for the delivery system**, rather than principles telling engineers how to achieve them.

### Practices


- SMALL, FREQUENT, RELIABLE RELEASES
- take testing, or _quality assurance_, seriously.

## Review and Reflect


Rule: design the delivery model around guiding principles that help the team decide whether a practice or tool is useful.

**Use process to achieve outcomes.** Scrum, Kanban, trunk-based development, CI/CD tooling, release trains, etc. are choices. Keep them while they help the team achieve the principles. SVPG explicitly describes its model as principles and ways of thinking, with different processes possible underneath.

Remark: deployment frequency should not become the goal. A team can deploy 30 times per day and still produce little customer value. Frequency is evidence that the delivery system has low friction. The goal is a combination of speed and stability.

### Uncertainty


There is a deeper idea underneath: **the task is to manage uncertainty, not run a production line.** No one can know perfectly whether a change is correct, what customers or another system will do, or what the market will require next. The engineering system should therefore make uncertainty cheap to resolve.

One sentence summarizes this idea:

> **Design the software development system to support learning, change, and safe recovery as uncertainty is resolved.**

### Derived principles


The supporting principles are:

1. **Keep changes small and independently deployable.** Design work so it can be integrated, verified, and released in small increments.
2. **Seek feedback quickly.** Shorten the time between making a change and knowing whether it works.
3. **Make production changes safe to observe and recover from.** Changes should have enough testing, monitoring, and recovery mechanisms to detect and correct problems quickly.

Once adopted, these principles also influence architecture. For example, "small and independently deployable" affects coupling, APIs, database migrations, ownership boundaries, test design, and how teams structure work. This is more useful than simply saying, "deploy more often."
