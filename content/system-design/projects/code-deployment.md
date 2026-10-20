---
draft: false
toc: true
title: "Code Deployment System: Requirements Sketch"
description: "A partial code-deployment design sketch covering release artifacts, deployment operations, status APIs, completion targets, and example workload assumptions."
linkTitle: "Code Deployment"
---
# Code Deployment System


Partial example from the [interviewing.io framework]({{< ref "system-design/frameworks/framework-iv" >}}). Developers tag a release; the system packages the code and deploys it to servers.

## Requirements and example constraints


- Identify an artifact by product, version, and commit hash.
- Trigger a release that publishes an artifact and deploys it to the target servers.
- Make deployment status available to the developer.
- Example completion target: within one hour of triggering a release.
- Example availability target: 99.9%; the exercise allows some downtime.

## Data


Code artifacts are blobs, such as ZIP, TAR, or compressed archives. Clarify the artifact format and build inputs before choosing storage and packaging behavior.

## API sketch

```text
POST /release/{productId}/{commitId}
  -> deploymentId

GET /deployment/{deploymentId}
  -> status: PENDING | DEPLOYED
```


The original sketch includes only these states; failure and recovery behavior remain to be designed.

## Scale assumptions to confirm


- Artifact size: 1–10 GB.
- Deployment volume: thousands of artifacts daily.
- Targets: hundreds of machines.

These are example interviewer answers, not measurements. Continue with the [case template]({{< ref "system-design/projects/case-template" >}}) to explain the design and its trade-offs.
