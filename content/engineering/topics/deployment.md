---
draft: false
toc: true
title: "Deployment"
linkTitle: "Deployment"
---
Definition:

Software deployment is the process of making software available for use on a system by users and other programs.

<https://codefresh.io/learn/software-deployment/>

metrics

feedback loop shortening

best practices

aims/tasks

deployment process reference architecture

process steps

we'll be using AWS CloudFormation to deploy some infrastructure

stacks and resources are provisioned as a running environment

a fleet of service

Deployment frequency is one of the four DORA metrics measuring *software delivery performance*.

# common-tosort


the four deployment philosophies from manual to programmable deployment

# phrases


to describe *the infrastructure components* we need

Since then, Kubernetes has come to the fore, and Function as a Service (FaaS) platforms have given us even more ways to think about how to actually *ship our software*.

... and more general purpose platforms like Mesos were used to run containers alongside other sorts of workloads.

... we move from a logical view of our systems architecture toward a *real* physical *deployment topology*.

We could talk about how our Invoice microservice communicates with the Order microservice without actually looking at *the physical topology* of *how these services are deployed*.

A logical view of an architecture *typically abstracts away* underlying physical deployment concerns -- that notion needs to change for the scope of this chapter.

deployment options

deployed artifact

refactor:

**Create a rollback plan** -- use this plan if critical problems arise during the deployment. Progressive delivery strategies make it possible to roll back deployments seamlessly and automatically

It was simply a matter of writing a script to disable the autoscaling group as part of the cluster shutdown to fix the problem in the future.

<https://codefresh.io/learn/software-deployment/>

<https://codefresh.io/learn/software-deployment/the-software-deployment-process-steps-importance-and-best-practices/>

<https://codefresh.io/learn/software-deployment/aws-blue`-green-deployment-with-fargate-eks-and-beanstalk/>

aws deployment

<https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/welcome.html>

<https://docs.aws.amazon.com/whitepapers/latest/practicing-continuous-integration-continuous-delivery/welcome.html>

# Principles


Isolated execution

Run microservice instances in an isolated fashion such that they have their own computing resources, and their execution cannot impact other microservice instances running nearby.

Focus on automation

As the number of microservices increases, automation becomes increasingly important. Focus on choosing technology that allows for a high degree of automation, and adopt automation as a core part of your culture.

Infrastructure as code

Represent the configuration for your infrastructure to ease automation and promote information sharing. Store this code in source control to allow for environments to be re-created.

Zero-downtime deployment

Take independent deployability further and ensure that deploying a new version of a microservice can be done without any downtime to users of your service (be they humans or other microservices).

Desired state management

Use a platform that maintains your microservice in a defined state, launching new instances if required in the event of outages or traffic increases.

# Progressive Delivery


? what is progressive delivery

techniques

These organizations make use of techniques like feature toggles, canary releases, par‐

allel runs, and more, which we'll detail in this section. This shift in how we

think about releasing functionality falls under the banner of what is called progressive

delivery. Functionality is released to users in a controlled manner; instead of a big-

bang deployment, we can be smart about who sees what functionality -- for example,

by rolling out a new version of our software to a subset of our users.

Fundamentally, what all these techniques have at their heart is a simple shift in how

we think about *shipping software*. Namely, that we can separate the concept of

deployment from that of release.

These ideas can work well together (we've already

touched on how you could use feature toggles to implement a can‐

ary rollout for example), but you probably want to ease yourself in.

To start off, just remember to separate the two concepts of deploy‐

ment and release. Next, start looking for ways to help you deploy

your software more frequently, but in a safe manner. Work with

your product owner or other business stakeholders to understand

how some of these techniques can help you go faster, but also help

reduce failures too.

{{< callout context="tip" title="Separating Deployment from Release" icon="outline/rocket" >}}
Deployment is what happens when you install some version of your software into a particular environment (the production environment is often implied). Release is when you make a system or some part of it (for example, a feature) available to users.
{{< /callout >}}

On to Progressive Delivery

## Blue/Green Deployment

## Feature Flags


feature gates

With feature toggles (otherwise known as feature flags), we hide deployed functionality behind a toggle that can be used to switch functionality off or on.
> Interesting information is in [Pete's article](https://martinfowler.com/articles/feature-toggles.html)
Also, Fully managed solutions exist for managing feature toggles, including LaunchDarkly and Split. LaunchDarkly defines four classes of feature flags: *rollout flags*, flags in experiments, entitlement flags, and operational flags.

## Canary Release

{{< callout context="tip" title="se" icon="outline/rocket" >}}

{{< /callout >}}

When I first did a canary release we controlled the rollout manually. We could con‐

figure the percentage of our traffic seeing the new functionality, and over a period of

a week we gradually increased this until everyone saw the new functionality. Over the

week, we kept an eye on our error rates, bug reports, and the like. Nowadays, it's

more common to see this process handled in an automated fashion. Tools like Spin‐

naker for example have the ability to automatically ramp up calls based on metrics,

such as increasing the percentage of calls to a new microservice version if the error

rates are at an acceptable level.

## Parallel Run

# Environments


This means that environments closer to the developer will be tuned to provide fast feedback, which may compromise how "production-like" they are. But as environments get closer to production, we will want them to be more and more like the end production environment to ensure that we catch problems.

# Kubernetes


As containers started gaining traction, many people started looking at solutions for how to manage containers across multiple machines.

Out of the box, all it

really gives you is the ability to run container workloads. Most folks using Kubernetes

end up assembling their own platform by installing supporting software such as ser‐

vice meshes, message brokers, log aggregation tools, and more. In larger organiza‐

tions, this ends up being the responsibility of a platform engineering team, who put

this platform together and manage it, and help developers use the platform

effectively.

# OpenShift

# Sam's Principles


In addition, I shared my own guidelines for selecting the right deployment platform:

1. If it ain't broke, don't fix it.
2. Give up as much control as you feel happy with, then give away just a little bit

more. If you can offload all your work to a good PaaS like Heroku (or FaaS plat‐

form), then do it and be happy. Do you really need to tinker with every last

setting?

1. Containerizing your microservices is not pain-free, but is a really good compro‐

mise around cost of isolation and has some fantastic benefits for local develop‐

ment, while still giving you a degree of control over what happens. Expect

Kubernetes in your future.

# Optimization Principle


It's also important to understand your requirements. Kubernetes could be a great fit

for you, but perhaps something simpler would work just as well. Don't feel ashamed

for picking a simpler solution, and also don't worry too much about offloading work

to someone else -- if I can push work to the public cloud, then I'll do it, as it lets me

focus on my own work.

# AWS Deployment


<https://pipelines.devops.aws.dev/>

<https://pipelines.devops.aws.dev/application-pipeline/>

<https://pipelines.devops.aws.dev/dynamic-configuration-pipeline/>
