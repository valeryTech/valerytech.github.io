---
draft: false
toc: true
title: "Claims Without Evidence"
description: "Essays and practitioner retrospectives question whether software development methodologies improve practice, and Bossavit traces how software engineering 'facts' spread by citation without evidence."
linkTitle: "Claims Without Evidence"
---

Software engineering has many confident claims and little tested evidence behind most of them. Methodologies are promoted and adopted on the strength of advocacy and experience reports. Widely quoted numbers often go back to one old study, or to none. This is the problem that [evidence-based software engineering]({{< ref "engineering/evidence/ebse" >}}) responds to, and the [principles]({{< ref "engineering/evidence" >}}#principles) in these notes are the response worked out in detail.

Part of [Evidence in software engineering]({{< ref "engineering/evidence" >}}).

## Methodologies


Essays and discussions arguing that prescribed development methodologies do not deliver what they promise:

- <https://www.reddit.com/r/programming/comments/xl4k9/why_software_development_methodologies_suck/>
- <https://www.thoughtworks.com/insights/blog/why-software-development-methodologies-suck>
- <https://continuousdelivery.com/2012/08/why-software-development-methodologies-suck/>
- <https://typicalprogrammer.com/why-dont-software-development-methodologies-work> -- funny, with interesting analogues
- <https://zwischenzugs.com/2017/10/15/my-20-year-experience-of-software-development-methodologies/>

The waterfall model is an example of a methodology argued over without going back to the source. Royce's 1970 paper describes the staged sequence and then says of it, "I believe in this concept, but the implementation described above is risky and invites failure". He goes on to add iteration and feedback. The software engineering notes link more agile and waterfall critiques.

## Folklore


Bossavit calls the claims that circulate without evidence "leprechauns". He follows each one back through its citations, among them the cone of uncertainty, the 10x programmer, the waterfall and the rising cost of defects.

- <https://www.reddit.com/r/programming/comments/2luryq/the_leprechauns_of_software_engineering/>

## Library sources


- [Bossavit 2015](/sources/b54da1313917791258847fb7c7102a38.bin), *The Leprechauns of Software Engineering* -- how claims spread by citation; on *The Cone of Uncertainty* (ch. 2), *The hunt for the 10x files* (ch. 5), *Who's afraid of the Big Bad Waterfall?* (ch. 7) and *The cost of defects: an illustrated history* (ch. 10)
- [Royce 1970](/sources/fc5d2cb35838539fa78fad5a122063ea.bin), *Managing the Development of Large Software Systems* -- the paper usually cited as the origin of the waterfall; the warning quoted above follows his Figure 2
- [Berard 2003](/sources/86f6aa09b838b735a4d5762b6ad06a2d.bin), *Misconceptions of the Agile Zealots* -- unsupported claims and logical fallacies in agile advocacy, from a practitioner who is not against agile

Further reading:

- [Abbas et al. 2008](/sources/031d7c34b1c9b63935b8417adab1c405.bin), *Historical Roots of Agile Methods*
