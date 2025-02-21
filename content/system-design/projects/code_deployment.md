---
contributors: []
date: 2025-02-21T15:53:28.159572
description: Default Description
draft: false
lastmod: 2025-02-21T15:53:28.159572
summary: ''
title: Code Deployment
toc: true
weight: 810
---

Example: Design a code deployment system aimed for developers at a company. They should be able to tag a release, and our system will package it and deploy it to some servers.

**Artifact:** (product name, version, commit hash)  
**Trigger a release:** publishes a code artifact and deploys it to all servers.

**Performance:** 1 hour from release triggered to servers.  
**Availability:** Can tolerate some downtime: 99.9% availability.

##### Data Types:

Ask your interviewer about the type of these artifacts that we are building.

* Code Artifacts. Type: blobs (ZIP, TAR, bz2, etc.)

##### API

````
1
2  putRelease:
3    POST release/{productId}/{commitId}
4    returns: deploymentId # Id to check the status of the deployment
5
6  getDeploymentStatus:
7    GET deployment/{deploymentId}
8    returns: status # PENDING, DEPLOYED
9
````

##### Scale

Ask your interviewer about the scale of these deployments. Here are examples of some good questions to ask (and an interviewer’s possible replies):

**Candidate:** What’s the average size of the artifacts that we need to package?

**Interviewer:** We’ll say 1 to 10GB.

**Candidate:** How many artifacts do we expect to deploy daily?

**Interviewer:** In the order of thousands.

**Candidate:** How many machines do we need to deploy to?

**Interviewer:** Around hundreds.
