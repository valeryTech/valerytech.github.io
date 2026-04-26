---
draft: false
toc: true
title: "Kubernetes"
linkTitle: "Kubernetes"
---
Architecture

Kubernetes architectures have many variations. For example, many

clusters run kube-apiserver, kube-scheduler, and kube-controller-

manager as containers. This means the control-plane may also run

a container-runtime, kubelet, and kube-proxy.

Rather than being concentrated in a single operations team that services other teams,

ops expertise will become distributed among many teams.

Each development team will need at least one ops specialist, responsible for the health

of the systems or services the team provides. They will be a developer as well, but they

will also be the domain expert on networking, Kubernetes, performance, resilience,

and the tools and systems that enable the other developers to deliver their code to the

cloud.

Developer Productivity Engineering

The point is that self-service has its limits, and the aim of DevOps is to speed up

development teams, not slow them down with unnecessary and redundant work.

Yes, a large part of traditional operations can and should be devolved to other teams,

primarily those that deploy code and respond to code-related incidents. But to enable

that to happen, there needs to be a strong central team building and supporting the

DevOps ecosystem in which all the other teams operate.

Instead of calling this team operations, we like the name developer productivity engi‐

neering. Some organizations call this role platform engineer or maybe even DevOps

engineer. The point is that these teams do whatever is necessary to help other software

engineering teams do their work better and faster: operating infrastructure, building

tools, busting problems.

And while developer productivity engineering remains a specialist skill set, the engi‐

neers themselves may move outward into the organization to bring that expertise

where it's needed.

port forwarding

container registry

The `kubectl` tool is the primary way of interacting with a Kubernetes cluster.

The cluster's brain is called the control plane, and it runs all the tasks required for

Kubernetes to do its job: scheduling containers, managing Services, serving API

requests, and so on

The control plane is actually made up of several components:

Node Components

Cluster members that run user workloads are called worker nodes.

Each worker node in a Kubernetes cluster runs these components: kubelet, kube-proxy, Container runtime

A rare, but entirely possible, kind of failure is losing a whole cloud availability zone.

Cloud vendors like AWS and Google Cloud provide multiple availability zones in

each region, each corresponding roughly to a single datacenter. For this reason, rather

than having all your worker nodes in the same zone, it's a good idea to distribute

them across two or even three zones.

Trust, but verify

Although high availability should enable your cluster to survive losing some nodes,

it's always wise to actually test this. During a scheduled maintenance window, or

outside of peak hours, try rebooting a worker and see what happens. (Hopefully,

nothing, or nothing that's visible to users of your applications.) Then, if you can,

try rebooting a control plane node. See if you are able to continue running kubectl

commands while the node is down.

run less software and Undifferentiated heavy lifting

It's probably fair to say that Fargate makes sense for simple, self-contained, long-

running compute tasks or batch jobs (such as data crunching) that don't require

much customization or integration with other services. It's also ideal for build con‐

tainers, which tend to be short-lived, and for any situation where the overhead of

managing worker nodes isn't justified.

Maintaining Desired State

Kubernetes controllers continually check the desired state specified by each resource

against the actual state of the cluster, and make any necessary adjustments to keep

them in sync. This process is called the reconciliation loop, because it loops forever,

trying to reconcile the actual state with the desired state.

scheduler

<https://jvns.ca/blog/2017/07/27/how-does-the-kubernetes-scheduler-work/>

principle - declarativity

Because Kubernetes is inherently a declarative system, continuously reconciling actual

state with desired state, all you need to do is change the desired state -- the Deploy‐

ment spec -- and Kubernetes will do the rest. How do you do that?

resources are data

helm and artifact hub

managing resources

That's where Kubernetes resource requests and limits come in. Kubernetes under‐

stands how to manage two kinds of resources: CPU and memory. There are other

important types of resources, too, such as network bandwidth, disk I/O operations

(IOPS), and disk space, and these may cause contention in the cluster, but Kubernetes

doesn't yet have a way to describe Pods' requirements for these.

overcommitting

Kubernetes allows resources to be overcommitted; that is, the sum of all the resource

limits of containers on a node can exceed the total resources of that node. This is a

kind of gamble: the scheduler is betting that, most of the time, most containers will

not need to hit their resource limits.

If this gamble fails, and total resource usage starts approaching the maximum

capacity of the node, Kubernetes will start being more aggressive in terminating

containers. Under conditions of resource pressure, containers that have exceeded

their requests, but not their limits, may still be terminated.

quality of service

Based on the requests and limits of a Pod, Kubernetes will classify it as one of the

following Quality of Service (QoS) classes: Guaranteed, Burstable, or BestEffort.

managing lifecycle

liveness probes

readiness probe

startup probe

practice?

This kind of readiness probe can be useful because if you want to take the container

temporarily out of service to debug a problem, you can attach to the container and

delete the /tmp/healthy file. The next readiness probe will fail, and Kubernetes will

remove the container from any matching Services. (A better way to do this, though,

is to adjust the container's labels so that it no longer matches the service: see "Service

Resources" on page 61.)

Using Namespaces

Another very useful way of managing resource usage across your cluster is to use

namespaces. A Kubernetes namespace is a way of partitioning your cluster into

separate subdivisions, for whatever purpose you like.

For example, you might have different namespaces for testing out different versions

of an application, or a separate namespace per team. As the term namespace suggests,

names in one namespace are not visible from a different namespace.

This means that you could have a service called demo in the prod namespace, and a

different service called demo in the test namespace, and there won't be any conflict.

# Pods


A Pod is a collection of application containers and volumes running in the same execution environment. Pods, not containers, are *the smallest deployable artifact* in a Kubernetes cluster. This means all of the containers in a Pod always land on the same machine.

Each container within a Pod runs in its own cgroup, but they share a number of Linux namespaces.

distribution of containers

At first, it might seem tempting to wrap both the web server and the Git synchronizer

into a single container. After closer inspection, however, the reasons for the separa‐

tion become clear. First, the two containers have significantly different requirements

in terms of resource usage. Take, for example, memory: because the web server is

serving user requests, we want to ensure that it is always available and responsive. On

the other hand, the Git synchronizer isn't really user-facing and has a "best effort"

quality of service.

wordpress and mysql example

scaling factor

different scaling strategies

resources
> In general, the right question to ask yourself when designing Pods is "Will these containers work correctly if they land on different machines?"
If the answer is no, a Pod is the correct grouping for the containers. If the answer is yes, using multiple Pods is probably the correct solution.
> Grouping multiple co-located and co-managed containers in a single Pod is a relatively advanced use case. You should use this pattern only in specific instances in which your containers are tightly coupled.
Generally speaking, copying files into a container is an antipattern. You

really should treat the contents of a container as immutable.

# Deployments

# ReplicaSet


When we define a ReplicaSet,

we define a specification for the Pods we want to create (the "cookie cutter") and a

desired number of replicas. Additionally, we need to define a way of finding Pods that the ReplicaSet should control. The actual act of managing the replicated Pods is an

example of a reconciliation loop. Such loops are fundamental to most of the design

and implementation of Kubernetes.

Reconciliation Loops

The central concept behind a reconciliation loop is the notion of desired state versus

observed or current state.

# Resource Management


Resources are requested per container, not per Pod. The total

resources requested by the Pod is the sum of all resources reques‐

ted by all containers in the Pod because the different containers

often have very different CPU requirements.

Requests are used when scheduling Pods to nodes. The Kubernetes scheduler will

ensure that the sum of all requests of all Pods on a node does not exceed the capacity

of the node. Therefore, a Pod is guaranteed to have at least the requested resources

when running on the node. Importantly, "request" specifies a minimum. It does not

specify a maximum cap on the resources a Pod may use. To explore what this means,

let's look at an example.

# Service Discovery


While the dynamic nature of Kubernetes makes it easy to run a lot of things, it creates

problems when it comes to finding those things. Most of the traditional network

infrastructure wasn't built for the level of dynamism that Kubernetes presents.

`selector app=alpaca` ? how to use selector in services?

If we look at the SELECTOR column, we see that the alpaca-prod service simply gives

a name to a selector and specifies which ports to talk to for that service. The kubectl

expose command will conveniently pull both the label selector and the relevant ports

(8080, in this case) from the deployment definition.

Furthermore, that service is assigned a new type of virtual IP called a cluster IP. This

is a special IP address the system will load balance across all of the Pods that are

identified by the selector.

Kubernetes provides a DNS service exposed to Pods running in the cluster. This

Kubernetes DNS service was installed as a system component when the cluster was

first created. The DNS service is, itself, managed by Kubernetes and is a great example

of Kubernetes building on Kubernetes. The Kubernetes DNS service provides DNS

names for cluster IPs.

load balancers

The examples that we have seen so far use external load balancers; that is, load

balancers that are connected to the public internet. While this is great for exposing

services to the world, you'll often want to expose your application within only your

private network. To achieve this, use an internal load balancer. Unfortunately, because

support for internal load balancers was added to Kubernetes more recently, it is

done in a somewhat ad hoc manner via object annotations.

# Other


kubectl

aliases <https://ahmet.im/blog/kubectl-aliases/index.html>

jq and playground with it

generating resource manifests

```bash
kubectl create deployment demo --image=cloudnatived/demo:hello --dry-run=client -o yaml >deployment.yaml
```

If you've been using imperative kubectl commands to manage your cluster up to

now, and you'd like to switch to the declarative style that we recommend in this book,

this is a great way to do it. Export all the resources in your cluster to manifest files

using kubectl with the -o flag, as shown in the example, and you'll be all set.

diffing resources

contexts and namespaces

So what happens when you have more than one cluster? For example, maybe you

have a Kubernetes cluster on your machine for local testing and a production cluster

in the cloud, and perhaps another remote cluster for staging and development. How

does kubectl know which one you mean?

To solve this problem, kubectl has contexts. A context is a combination of a cluster, a

user, and a namespace

kubectx, kubens, krew, kube-ps1, kube-shell, Click,

kube-sh, Stern

your tools

But this

isn't the best way to use containers, because then you don't get the benefits of resource

isolation.

If processes don't need to know about each other, then they don't need to run in the

same container. A good rule of thumb with a container is that it should do one thing.

versioning practice

You should avoid using the latest tag when deploying containers in production as it

is harder to track which version of the image is running, and more difficult to roll back

properly.

init containers

<https://www.baeldung.com/linux/kubernetes-init-containers>

Labels

You know that Pods (and other Kubernetes resources) can have labels attached to

them, and that these play an important role in connecting related resources (for

example, sending requests from a Service to the appropriate backends).

Labels aren't just used for connecting Services and Pods; you can use them directly

when querying the cluster with kubectl get, using the --selector flag:

DaemonSet

StatefulSet

Job

CronJob

HorizontalPodAutoscaler

The HPA uses another popular Kubernetes project called the Metrics Server for

getting the data it needs for making autoscaling decisions. You can install it following

the instructions in the metrics-server repo.

Although CPU utilization is the most common scaling metric, you can use any

metrics available to Kubernetes, including both the built-in system metrics like CPU

and memory usage, and app-specific service metrics, which you define and export

from your application (see Chapter 16). For example, you could scale based on the

application error rate or number of incoming requests per second.

Operators and Custom Resource Definitions (CRDs)

For example, if you wanted to create a controller object that sets up replicated,

high-availability MySQL database clusters in Kubernetes, how would you go about it?

The first step would be to create a CRD for your custom controller object. In order

to make it do anything, you then need to write a program that communicates with

the Kubernetes API. This is easy to do, as we saw in "Building Your Own Kubernetes

Tools" on page 132. Such a program is called an Operator (perhaps because it auto‐

mates the kinds of actions that a human operator might perform).

You can see lots of examples of Operators built and maintained by the community in

the OperatorHub.io site. This is a repository of hundreds of Operators that you can

install on your clusters, or just browse their code to get ideas for your building your

own Operators.

Ingress

While Services (see "Service Resources" on page 61) are for routing internal traffic

in your cluster (for example, from one microservice to another), Ingress is used for

routing external traffic into your cluster and to the appropriate microservice

Service Mesh

Kubernetes Ingress and Services may be all that you need for routing requests from

clients to your applications, depending on the complexity of your organization. But

there is also a growing interest in a newer concept commonly referred to as a service

mesh. A service mesh is responsible for managing more complex network operations

such as rate-limiting and encrypting network traffic between microservices. Service

mesh tools can also add metrics and logging for requests flowing through the net‐

work, keeping track of how long requests are taking, or tracing where a request

started and what path it took through the various microservices along the way. Some

service mesh tools can handle automatic retries of failed requests, and have the ability

to deny or block inbound or outbound requests as needed.

## Universalization


one of the options (ways to think about 'universalization')

When we say "foundations," what do we mean? The most important part to get

right is automation. Importantly, this includes both automation to deploy your

application(s), but also automation to create and manage the clusters themselves.

When you have a single cluster, it is consistent with itself by definition. However,

when you add clusters, you add the possibility of version skew between all of the

pieces of your cluster. You could have clusters with different Kubernetes versions,

different versions of your monitoring and logging agents, or even something as

basic as the container runtime. All of this variance should be viewed as something

that makes your life harder. Differences in your infrastructure make your system

"weirder." Knowledge gained in one cluster does not transfer over to other clusters, and problems sometimes occur seemingly at random in certain places because of this

variability. One of the most important parts of maintaining a stable foundation is

maintaining consistency across all of your clusters.

# Configuration


ConfigMaps

The ConfigMap is the primary object for storing configuration data in Kubernetes.

You can think of it as being a named set of key-value pairs that stores configuration

data. Once you have a ConfigMap, you can supply that data to an application either

by creating a file in the Pod, or by injecting it into the Pod's environment.

phrases to sort and analyze

a file named kuard-pod.yaml and then using kubectl commands to *load that manifest* to Kubernetes.

# extending


When you're ready to move beyond scripting calls to the kubectl executable, the

Kubernetes client libraries provide a way to dive deep into the API to build an

operator, a monitoring agent, a new user interface, or whatever your imagination can

dream up.

# resources


slack, forums, reddit?

# projects


and hands-on experience

## kube exercises


<https://github.com/eficode-academy/kubernetes-katas>

<https://github.com/eficode-academy/kubernetes-katas/blob/master/cheatsheet.md>

<https://github.com/eficode-academy/helm-katas>

kubekloud

<https://github.com/kubernetes/community>
