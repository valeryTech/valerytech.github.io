---
draft: false
toc: true
title: "Terraform"
linkTitle: "Terraform"
---
# Advices how to learn Terraform practically


If you are new to aws, i suggest start learning aws and each topic you learn code it in terraform too, so you will learn cloud and IaC at the same time, i do that right now and it's very efficient.

(how to learn)

First, decide something specific you want to do with TF. Narrow your scope. Nobody sits down and just learns everything about TF. There is to much to learn. So, do you want to deploy a VM on a certain cloud provider? That is often a good learning focus.

If that is your focus, then you should first learn how to do it without TF. That could be done via a web console or CLI. Once you know all the steps required and the sub components required, you are ready to dig into doing it with TF. In the case of major public cloud providers, if you use their CLI first, then you will be already set up with credentials for using TF too.

Personally I started learning Terraform by setup my entire homelab as code I created a custom module to provision a Proxmox VM with Cloud-init and SSH keys.

Then I bought a MikroTik that has a Terraform provider and again I configured all my router settings with terraform?

But really depends on you.. I believe best way to learn is with things useful for yourself

I would not recommend Up and Running. But, Hashicorp tutorials are pretty good: [https://learn.hashicorp.com/terraform](https://learn.hashicorp.com/terraform) . And, when learning providers, such as AWS, there is a lot of helpful information in the source repository for them. For example: [https://github.com/hashicorp/terraform-provider-aws](https://github.com/hashicorp/terraform-provider-aws) . There are full examples in those repos and useful information that supplements the documentation. But, routinely, I hit up the documentation, such as:

- [https://www.terraform.io/docs/language/expressions/strings.html](https://www.terraform.io/docs/language/expressions/strings.html)
- [https://www.terraform.io/docs/language/expressions/types.html](https://www.terraform.io/docs/language/expressions/types.html)
- [https://registry.terraform.io/providers/hashicorp/aws/latest/docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
