---
draft: false
toc: true
title: "Features Behind the Problems in Work with Agents"
aliases:
  - "/ai-engineering/agents/problem-features/"
description: "Sixteen features of the work, of people, and of agents that the 94 problems in engineering work with coding agents trace back to, where they meet, and how they compare with the working model."
linkTitle: "Features Behind Problems"
---

This note asks what is underneath the problems in [Problems in Engineering Work with Agents]({{< ref "ai-engineering/agents/problems/problems" >}}). It uses the numbers of that list, and the layers and links of [Sequences of Problems in Engineering Work with Agents]({{< ref "ai-engineering/agents/problems/problem-sequences" >}}).

A feature is a fact about the work, about people, or about agents that the team doesn't control. A problem is what happens when the team's way of working doesn't allow for a feature. So a team can reduce a problem, and it has to work with a feature. The word comes from the working model, which derives its processes from the features of the participants and of the work.

I gave each problem one or two features. The features and the assignment are my reading of how the problems are worded. No case from our work is behind them.

## Sixteen Features


91 of the 94 problems trace back to at least one of these features.

### About the Work


| # | Feature | Problems |
| --- | --- | --- |
| W1 | What's wanted is mostly in people's heads, and only part of it is written down. | 1, 3, 5, 6, 8, 9, 10, 35, 39, 87 |
| W2 | Every task is different. | 48, 49, 50, 53, 55, 63, 64, 81 |
| W3 | Some results show only weeks later. | 43 |
| W4 | A check shows only what it was written to check, and an author's own check shares the author's mistake. | 20, 28, 36, 40, 41, 85 |
| W5 | The value of engineering work is hard to count. | 2, 3, 56, 57, 58, 59, 60, 61, 62, 63 |
| W6 | What's written grows with each change unless someone works against it: code, docs, and the agent setup. | 67, 68, 74, 82, 83, 84, 86 |
| W7 | The result of a task depends on many things at once. Some of them can't be seen, and the effect of changing one depends on the others. | 44, 52, 54, 92, 93, 94 |

### About People


| # | Feature | Problems |
| --- | --- | --- |
| P1 | People's attention is limited, and careful reading is slow. | 22, 23, 25, 26, 41, 58, 65, 73, 75 |
| P2 | People understand a system by working on it. | 38, 76, 77, 78, 80 |
| P3 | An author goes with the first idea and sees only the part of the system in front of them. This holds for a developer and for an agent. | 6, 7, 11, 14, 15, 16, 17, 21, 24, 38, 83, 91 |

### About Agents


| # | Feature | Problems |
| --- | --- | --- |
| A1 | An agent writes quickly and at almost no cost. | 4, 23, 25, 26, 27, 32, 74, 78, 85 |
| A2 | An agent knows only what's written down or what it read in this session, and it keeps nothing afterwards. | 8, 14, 18, 29, 44, 45, 46, 47, 67, 70 |
| A3 | An agent's output looks the same whether it's right or wrong: tidy, fluent, and sure. | 12, 27, 30, 31, 32, 35, 37, 40, 65 |
| A4 | An agent's behavior isn't fixed. It differs by run, by the person steering it, and by version, and it follows an instruction only some of the time. | 19, 42, 47, 48, 49, 51, 52, 54, 64, 69, 71, 81 |
| A5 | An agent acts with a person's access and can't answer for the result. | 33, 66, 79, 88, 89, 90 |
| A6 | An agent can take any text it reads as an instruction. | 90 |

The first ten features hold in a team without agents. The last six are features of agents. W7 was added later than the others, with problems 92 to 94.

## How the Features Fit the Layers


The table counts the problems in each layer that have a feature of each kind. A problem with two features can count twice.

| Layer | Problems | About the work | About people | About agents | No feature |
| --- | --- | --- | --- | --- | --- |
| 1. Without agents | 29 | 16 | 16 | 0 | 0 |
| 2. With agents | 40 | 9 | 8 | 34 | 3 |
| 3. Telling whether a change helps | 25 | 21 | 1 | 9 | 0 |

- **Layer 1 needs no feature of agents.** All 29 problems trace back to features of the work and of people. I wrote the layer 1 rows without the agent, so this mostly confirms that split.
- **Layer 2 is where a feature of agents comes in.** 34 of its 40 problems have one. Three of the other six are old problems of anything a team maintains, now showing up in the agent setup: its lines contradict each other (68), a slow check gets turned off (73), and one person understands it (80). The last three have no feature (13, 34, 72).
- **Layer 3 rests mostly on four features:** the value of the work is hard to count (W5, 10 problems), an agent's behavior isn't fixed (A4, 6), every task is different (W2, 6), and the result depends on many things (W7, 6).

## Where a Feature of Agents Meets an Older One


The links from layer 2 into layer 1 show where a feature of agents meets a feature that was already there. Four meetings account for 12 of those 17 links.

| Feature of agents | Older feature | Links | What happens |
| --- | --- | --- | --- |
| A1: writes quickly at almost no cost | P1: attention is limited | 25 -> 22, 23 -> 41, 26 -> 75, 32 -> 75 | There's more to read than anyone has attention for. |
| A2: knows only what's written down | W1: what's wanted is mostly in people's heads | 8 -> 9, 8 -> 10, 8 -> 87 | What isn't written down doesn't reach the agent. |
| A3: output looks the same right or wrong | W4: a check shows only what it was written to check | 12 -> 28, 37 -> 41, 31 -> 41 | A result looks checked when it wasn't. |
| A1: writes quickly at almost no cost | P2: people understand a system by working on it | 78 -> 77, 85 -> 77 | People get results without working on the system. |

Layer 3 has one meeting of its own. Every task is different (W2), and an agent's behavior isn't fixed (A4). Four problems have both features (48, 49, 64, 81): two results can't be compared directly, because the task changed and the agent may have changed too. W7 is the general form of this meeting: the task and the agent are two of the many things a result depends on.

## What the Starts Are


The sequences have 29 starts: problems with links going out and none coming in. They're of four kinds.

| Kind of start | Problems | Can the team change it? |
| --- | --- | --- |
| A feature stated as a problem | 20, 37, 43, 50, 51, 57, 63, 94 | No |
| Something not written, kept, decided, or checked | 1, 3, 29, 34, 54, 61, 72 | Yes, except what wasn't recorded in the past (61) |
| What an author or an agent does by default | 7, 8, 12, 13, 14, 16, 17, 27 | Partly |
| How the team works with the agent | 4, 25, 42, 73, 78, 85 | Yes |

So eight rows of the list are features, such as "tasks don't repeat" (50) and "the code looks tidy whether it's right or wrong" (37). Nothing a team does removes them.

## Comparison with the Working Model


The working model already has a list close to this one: the features in [Processes Derived from the Goals and the Participants]({{< ref "ai-engineering/agents/sdlc/processes" >}}#features-of-the-participants-and-the-work-that-bear-on-the-goals). The processes are derived from it. The table shows what that list had before this note.

| Feature | Was it in the model's list of features? |
| --- | --- |
| W1: what's wanted is in people's heads | Yes: people hold the intent and the unwritten context |
| W2: every task is different | No |
| W3: some results show only weeks later | No |
| W4: a check shows only what it was written to check | Yes: a check covers only the properties it was written for, and an author's own checks can share the author's mistakes |
| W5: the value of the work is hard to count | No |
| W6: what's written grows unless someone works against it | No. The [environment note]({{< ref "ai-engineering/agents/environment/ade" >}}#problems) lists a drifting codebase as a problem. |
| W7: the result depends on many things, some of them hidden | No |
| P1: attention is limited | Yes |
| P2: people understand a system by working on it | Yes |
| P3: an author goes with the first idea | Partly: the model gives it as a feature of agents only |
| A1: writes quickly at almost no cost | Yes |
| A2: knows only what's written down, keeps nothing | Yes |
| A3: output looks the same right or wrong | Partly: the model says agents treat assumptions as facts |
| A4: behavior isn't fixed | No |
| A5: acts with a person's access, can't answer | Yes |
| A6: can take any text as an instruction | No. The environment note lists it under access. |

Six features were missing from the model: W2, W3, W5, W6, A4, and A6. They've been added to its list of features. Three of them, W2, W5, and A4, are among the four that layer 3 rests on. The model had no process for telling whether a change helps, and it also lacked the features that such a process would be derived from. A tenth process, checking whether a change helped, was then added for W2, W5, and A4.

W7 came later, with problems 92 to 94. It was missing from the model too, and it's the fourth feature that layer 3 rests on. It has been added to the model's list, and the tenth process now names it.

One feature in the model has no problem in the list: the capability of agents keeps growing.

## What Doesn't Fit


- **Three problems have no feature:** the agent explains its work in words the developer can't follow (13), nothing marks the agent's changes (34), and several harnesses are kept in sync by hand (72).
- **Four assignments are weak:** doing more than asked (11) and a change applied with no rollback plan (91) under P3, the developer judging their own work (42) under A4, and dependencies nobody decided on (86) under W6.
- **W7 fits half of its problems by construction.** Problems 92 to 94 state the feature as problems, so their fit says little. The other three are older rows of the list: the cause of a bad result can't be told (44), several things change at once (52), and a new version is found out by accident (54). Problem 44 moved to W7 from A4.
- **Two features have one problem each:** W3 and A6.

## Open Questions


- Is each feature one thing? A4 puts together differences between runs, between the people steering, and between versions.
- Do the features of agents stay? The model says the capability of agents keeps growing, so some of the six may weaken.
- Do W3, W6, and A6 need a process of their own, or do the existing ones cover them?
- Is W7 one feature or three? It puts together many things, hidden things, and effects that depend on each other.
