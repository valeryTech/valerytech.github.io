---
draft: false
toc: true
title: "Problems in Engineering Work with Agents"
description: "A list of 94 problems in engineering work with coding agents in three layers: problems a team has without agents, problems that appear with agents, and problems of telling whether a change helps."
linkTitle: "Problems"
---

The problems are in three layers: problems a team has without agents, problems that appear with agents, and problems of telling whether a change helps.

The columns in each table:

- **Who has it** is the role that meets the problem: the developer in the session, the reviewer, the product owner or whoever writes the tickets, the team lead, the person who maintains the agent setup (`AGENTS.md`, skills, hooks, and commands), operations and security, or a new team member.
- **Known before agents?** says "Yes" when the problem is older than coding agents, with a source where there is one, and "New" when nothing older matches it. A dash means it hasn't been looked at.

## Layer 1: Problems a Team Has without Agents


A team of developers has these problems before any agent is involved. Each row gives the problem as a team has it without agents, and then what agents change in it. The "What agents change" column is my reasoning, with no case from our work behind it. Numbers in brackets are other problems in this list.

### Handing Over the Task


| #   | Problem                                                                                                                            | What agents change                                                                                                                                           | Who has it    | Known before agents? |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | -------------------- |
| 1   | Nobody has written down what a good result is for a kind of task, so two people judge the same pull request differently.           | A developer fills the gap from what they know about the product and the team. The agent has only what's written down.                                        | Everyone      | --                   |
| 5   | A short ticket leaves the author guessing, and a detailed one takes time to write.                                                 | The agent guesses where a developer would ask. The time spent on a detailed ticket is the time the agent was meant to save.                                  | Developer     | Yes                  |
| 6   | The author picks one reading of an unclear task and doesn't show that they chose.                                                  | The agent does this by default and seldom asks. Nobody can tell which reading it took before it changes files (35).                                          | Developer     | Yes                  |
| 7   | The author starts from how to build something before asking what it's for.                                                         | The agent starts building as soon as it has the task.                                                                                                        | Developer     | --                   |
| 9   | The feature does what the ticket says and not what was meant, and this is found at the demo.                                       | The feature arrives faster, and nobody came back with questions on the way (8), so the demo is the first check.                                              | Product owner | Yes                  |
| 10  | Product decisions get made in the code without the product owner: defaults, behavior in edge cases, the wording of error messages. | A developer who made such a decision knew the product and could be asked about it later. The agent makes them in every session, and often no person notices. | Product owner | Yes                  |

### Doing the Work


| # | Problem | What agents change | Who has it | Known before agents? |
| --- | --- | --- | --- | --- |
| 11 | The author does more than was asked: extra files, extra structure, an abstraction nobody needed, or unrelated changes such as reformatting and renames. | Extra code costs the agent nothing to write, so there's much more of it. Every extra line still has to be reviewed and maintained. | Developer, reviewer, product owner | -- |
| 15 | When an approach fails, the author adds retries and patches around it and doesn't go back to the wrong assumption. | The agent writes patches quickly, so many pile up before anyone looks. | Developer | -- |
| 16 | The author keeps going with their first idea after a simpler one is in plain sight. | The agent takes the first plausible approach by default and doesn't compare options unless it's asked to. | Developer | -- |
| 17 | The author runs ahead: they build structure, or answer a question, before anyone has agreed on what the question is. | Running ahead costs the agent minutes, so much more gets built before anyone has agreed. | Developer | -- |
| 21 | A fix makes the failing example pass and breaks cases that used to work. | A developer who knows the system remembers the other cases. The agent knows only what it read in this session. | Developer | -- |
| 24 | A change misses something it affects: a second caller, a migration, a config that wasn't updated. | The agent knows only what it read in this session. | Developer | -- |
| 86 | New dependencies appear without the team having decided to add them. | A developer who added a dependency at least chose it. The agent adds one to finish the task, and it's easy to miss in a large diff. | Operations and security | -- |
| 87 | New code has no logging or alerts, because nobody asked for them. | An experienced developer adds them without being asked. The agent builds what the ticket says (8). | Operations and security | -- |
| 91 | A migration or an infrastructure change is applied, and nobody thought about rolling it back. | The change is generated in minutes and can be applied in the same session with the developer's credentials (88). | Operations and security | -- |

### Checking the Result


| # | Problem | What agents change | Who has it | Known before agents? |
| --- | --- | --- | --- | --- |
| 20 | The tests come from the same wrong idea as the code, so they pass. | The agent writes the code and the tests in one session from one reading of the task, and it writes many tests. | Developer, reviewer | Yes ([Weyuker 1982](#weyuker-1982)) |
| 22 | Diffs are too large to review properly, and review is the slowest part of the work. | There are more pull requests than before, and each one is bigger (11, 25). | Developer, reviewer, team lead | Yes ([Brooks 1987](#brooks-1987)) |
| 28 | The author says "done, all tests pass", and nobody can tell what was checked. | A reviewer could ask the author and knew how careful that person is. The agent sounds equally sure whether it checked or not (12, 31). | Developer, reviewer | Yes |
| 36 | The tests are green, and nobody can tell whether they would fail if the code were wrong. | There are many more tests, and the author of the code wrote all of them (20). | Developer, reviewer | Yes ([Weyuker 1982](#weyuker-1982); [Inozemtseva and Holmes 2014](#inozemtseva-2014)) |
| 38 | Nobody knows what else a change affects. | Fewer people understand the code (76), and the agent knows only what it read in this session. | Developer | -- |
| 39 | "Done" arrives, and the product owner can't tell what was left out. | "Done" comes faster and more often, with a long, polished description (27). | Product owner | -- |
| 41 | Checking a result carefully takes a lot of time, so results get checked lightly. | Producing a result got much faster and checking didn't, so checking now takes about as long as doing the work. The signs a reviewer relied on, such as tidy code, stopped working (37). | Developer, reviewer | -- |
| 43 | Some results can only be judged weeks later: whether the code stays easy to change, and whether anyone still understands it. | More code arrives in those weeks, so more is built on a result before it can be judged. | Developer, team lead | -- |
| 75 | A change is approved by someone who doesn't fully understand it. | The agent says it works, the code looks tidy (37), and there's too much to read (23). The review may go to another agent (26). | Developer, reviewer | Yes ([Bacchelli and Bird 2013](#bacchelli-2013); [Parasuraman and Manzey 2010](#parasuraman-2010)) |

### Understanding and the Codebase over Time


| # | Problem | What agents change | Who has it | Known before agents? |
| --- | --- | --- | --- | --- |
| 76 | Nobody on the team can explain a part of the code, and the person on call debugs code nobody understands. | It used to happen after the people who wrote the code had left. Now it can be true on the day the code is merged: the author can't answer questions about their own pull request. | Developer, reviewer, operations, team lead | Yes ([Naur 1985](#naur-1985)) |
| 77 | Junior developers and new team members get changes merged without understanding the system, and nobody notices until they're alone with an incident. | Getting a change merged used to take enough understanding to write it. With an agent it doesn't. They also ask the agent where they would have asked a colleague (78). | Team lead, new team member | Yes ([Naur 1985](#naur-1985); [Bainbridge 1983](#bainbridge-1983)) |
| 82 | The code gets more complex faster than anyone checks whether the complexity is needed. | More code arrives each week, and the agent copies the patterns already in the repository, bad ones included. | Developer | Yes ([Lehman 1980](#lehman-1980)) |
| 83 | Each change makes choices that are reasonable locally, and the overall design wears away. | Each session starts without the earlier design decisions unless they're written down, and there are many more sessions than there used to be changes. | Team lead | Yes ([Lehman 1980](#lehman-1980)) |
| 84 | The codebase has several patterns for the same thing. | The agent copies whichever pattern it finds, so each one spreads (82). | New team member | -- |

## Layer 2: Problems That Appear with Agents


These problems appear once agents do part of the work. The first four groups are the same stages as in layer 1. The last three groups have no counterpart in layer 1.

### Handing Over the Task to an Agent


| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 4 | Building looks cheap, so the team starts more things and thinks each one through less. | Product owner | Yes ([Brooks 1987](#brooks-1987)) |
| 8 | Nobody comes back with questions about a ticket. The agent builds what the words say. | Product owner | Yes |
| 35 | Nobody can tell whether the agent understood the task before it starts changing files. | Developer | -- |
| 64 | The developer doesn't know which tasks to give the agent and which to do without it. | Developer | -- |

### Working with the Agent in a Session


| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 12 | The agent states guesses as facts. | Developer | -- |
| 13 | The agent explains its work in words the developer can't follow. | Developer | -- |
| 14 | A correction is applied only where the developer pointed, and the same mistake stays everywhere else. | Developer | -- |
| 18 | Several sessions work on the same files at once and overwrite each other's changes. | Developer | -- |
| 19 | The agent behaves differently for each developer. Some get good results and others make a mess. | Developer, setup maintainer, team lead | -- |
| 31 | The developer can't tell which of the agent's statements are checked facts and which are guesses. | Developer | -- |
| 65 | The developer doesn't know when to step in. Watching every step takes time, and not watching means the problem is found at the end. | Developer | Yes ([Bainbridge 1983](#bainbridge-1983)) |

### Checking the Agent's Result


| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 23 | The agent produces more than anyone can review. One night's unsupervised run left 21 branches that nobody has reviewed. | Developer | New |
| 25 | Review comments are pasted into the agent, a new large diff comes back, and the reviewer has to read all of it again. | Reviewer | -- |
| 26 | The reviewer gives the review to another agent. Two agents agree, and no person has looked. | Reviewer | Yes ([Parasuraman and Manzey 2010](#parasuraman-2010)) |
| 27 | The description of the pull request is long, polished, and generated, and it seldom says why. | Reviewer | -- |
| 30 | A good pull request can come out of a bad session, and the pull request doesn't show it. | Developer, reviewer | -- |
| 32 | The reviewer can't tell which parts the author thought about and which the agent generated and nobody read. | Reviewer | -- |
| 37 | The code looks tidy whether it's right or wrong. Tidy code used to be a sign of care. | Reviewer | New |
| 40 | A second agent reviews the change, and nobody knows how far its verdict can be trusted, since it may share the first agent's mistake. | Reviewer | -- |
| 42 | The developer who judges the result also wrote the ticket and steered the session, so they're judging their own work too. | Developer | -- |

### What Agents Change for People and the Codebase


| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 78 | A new team member asks the agent how the system works and no longer asks a colleague, so nobody learns what the new member doesn't know. | New team member | -- |
| 81 | Estimates stopped working. One task takes ten minutes, and another that looks the same takes two days. | Team lead | -- |
| 85 | Docs are generated, long, and unchecked. | New team member | -- |

### Keeping the Agent Setup in Order


Problems of maintaining `AGENTS.md`, skills, hooks, and commands.

| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 67 | `AGENTS.md` keeps growing. Lines are added after one bad session and never removed. | Setup maintainer | -- |
| 68 | Lines contradict each other, the docs, or what the code does. | Setup maintainer | -- |
| 69 | The agent follows a rule in one session and ignores it in the next. | Setup maintainer | New |
| 70 | The same mistake comes back in a later session. | Developer | New |
| 71 | Rules written around an old quirk of the model do nothing, or do harm, after the model changes. | Setup maintainer | New |
| 72 | The team uses more than one harness. Each reads different files, and they're kept in sync by hand. | Setup maintainer | -- |
| 73 | A check or a hook makes sessions slower, and people turn it off. | Setup maintainer | -- |
| 74 | Skills and commands pile up. | Setup maintainer | -- |
| 80 | One person understands the agent setup. When they're away, nobody can fix it. | Team lead | Yes |

### Records of What the Agent Did


| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 29 | Only the diff is kept. The session, with what the agent tried and how often it was corrected, is gone. | Developer, setup maintainer | -- |
| 33 | There's no record of what the agent touched outside the repository. | Operations and security | -- |
| 34 | Nothing marks which changes an agent made, so later bugs and incidents can't be connected to them. | Team lead | -- |

### What the Agent May Do and Who Answers for It


| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 66 | Nobody has decided how far agents may go without a person: opening a pull request, merging, deploying. There's nothing to base the decision on. | Team lead | -- |
| 79 | When an agent's change breaks production, it isn't clear who answers for it. | Team lead | -- |
| 88 | The agent runs commands with a developer's credentials. | Operations and security | -- |
| 89 | Secrets and customer data end up in sessions and transcripts that go to a vendor. | Operations and security | -- |
| 90 | The agent reads text from outside, such as an issue, a web page, or a dependency's README, and follows instructions in it. | Operations and security | New |

## Layer 3: Telling Whether a Change Helps


We change something, such as a line in `AGENTS.md`, a skill, the model, or how we write tickets, and need to tell whether the work got better. These problems are about the work in layers 1 and 2.

### Saying What Better Means


| #   | Problem                                                                                                  | Who has it | Known before agents?                            |
| --- | -------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------- |
| 2   | What can be counted, such as pull requests, tokens, and session length, isn't what the team cares about. | Team lead  | Yes ([Forsgren et al. 2021](#forsgren-2021)) |
| 3   | "Make the agent handle tickets better" is the stated goal, and nobody can tell whether it was reached.   | Everyone   | --                                               |

### Finding the Cause


| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 44 | When a result is bad, nobody can tell whether the cause was the ticket, the setup, the agent, the way the developer steered it, or a limit of the model. | Developer, setup maintainer | -- |
| 45 | A complaint arrives as "the agent was dumb today", with no session and no ticket, so it can't be reproduced. | Setup maintainer | -- |
| 46 | A bug shows up and can't be traced back to the session or the decision it came from. | Developer | -- |
| 47 | Some developers get good results and others don't, and nobody can say what the first group does differently. | Team lead | -- |

### Many Parameters, Some of Them Hidden


The result of a task depends on many things, the team knows only some of them, and so it's hard to tell what one change did. Several problems in this layer are cases of this one: a bad result with no known cause (44), tasks that don't repeat (50), two runs that differ (51), several things changing at once (52), a change that helps one kind of task and hurts another (53), and a vendor update found by accident (54). The problem is older than agents and wider than machine learning. [The bottom-up approach]({{< ref "ai-engineering/agents/sdlc/bottom-up-approach" >}}#many-parameters-some-of-them-hidden) describes it and what the approach does about it. Problems 92 to 94 were added later than the rest of the list.

| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 92 | The result of a task depends on many things at once, and nobody has a list of them: the ticket, the state of the repository, the person steering, the setup files, the tools, the harness, the model, and what was in the context. | Setup maintainer, team lead | Yes ([Frensch and Funke 1995](#frensch-1995); [Sculley et al. 2015](#sculley-2015)) |
| 93 | Some of these things the team can't see or doesn't record: the harness's built-in prompt, a change on the vendor's side, a setup file in one developer's home folder, or what the agent loaded into its context. Two sessions that look the same aren't. | Developer, setup maintainer | Yes ([Frensch and Funke 1995](#frensch-1995)) |
| 94 | The effect of a change depends on the other things. A line that helped with one model, or next to one skill, does nothing or does harm with another. | Setup maintainer | Yes ([Montgomery 2017](#montgomery-2017); [Sculley et al. 2015](#sculley-2015)) |

### Telling Whether One Change Helped


| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 48 | A line is added to `AGENTS.md` after a mistake, and nobody knows whether it did anything. In one project's change log, every entry's observed outcome says it wasn't observed yet. | Developer, setup maintainer | New |
| 49 | Nobody knows which lines of `AGENTS.md`, or which skills and commands, still do something. | Setup maintainer | -- |
| 50 | Tasks don't repeat. The task after a change is a different task, so a better result may only mean an easier task. | Developer, setup maintainer | -- |
| 51 | The same task run twice gives two different results, so one run says little. | Developer, setup maintainer | New |
| 52 | Several things change at once: the model, the setup, the quality of the tickets, and who runs the session. Nobody can tell which one made the difference. | Setup maintainer, team lead | -- |
| 53 | A change to the setup helps one kind of task and hurts another, and only the complaints are heard. | Setup maintainer | -- |
| 54 | A new version of the model or the harness changes the agent's behavior, and the team finds out by accident. | Developer, setup maintainer | New |
| 55 | There are too few tasks of one kind to tell a pattern from chance. | Setup maintainer, team lead | -- |

### Telling Whether It Pays Off


| # | Problem | Who has it | Known before agents? |
| --- | --- | --- | --- |
| 56 | Nobody can say whether the setup is any good. The evidence is "it felt better this week". | Developer | Yes ([Forsgren et al. 2021](#forsgren-2021)) |
| 57 | People remember the bad sessions better than the good ones, so impressions are skewed. | Developer, team lead | -- |
| 58 | Reviewing a change takes about as long as writing it would have, and nobody can tell whether time was saved. | Developer | -- |
| 59 | Nobody can tell whether the team ships faster or only produces more code. | Team lead | Yes ([Brooks 1987](#brooks-1987); [Forsgren et al. 2021](#forsgren-2021)) |
| 60 | Management asks how much faster the team is, and there's no number anyone trusts. | Team lead | Yes ([Forsgren et al. 2021](#forsgren-2021)) |
| 61 | Nobody recorded how long tasks took or how many bugs there were before agents, so there's nothing to compare with. | Team lead | -- |
| 62 | The bill for tokens grows and can't be connected to results. | Team lead | -- |
| 63 | Benchmark scores and vendor claims don't say how the agent does on this repository. | Setup maintainer, team lead | -- |

## A First Set of Problems for the Developer


This step collects the problems a developer has in work with an agent. They're written the way a developer would say them, and nothing here says how to solve or measure them. Each one names where it comes from. A problem marked *guess* has no source: I wrote it from general knowledge, and it needs a case from our work before it stays.

The order follows the moments in a task. It's only a way to read the list.

**When I hand over the task**

1. I don't know which tasks to give the agent and which to do myself. (*guess*)
2. I don't know how much to write in the ticket. A short ticket gets a guess back, and a long one costs me the time I wanted to save. (workflows; common mistakes)
3. I can't tell whether the agent understood the task before it starts changing files. It picks one reading and doesn't show me that it chose. (common mistakes)
4. It starts from how to build something before asking what it's for. (survey)

**During the session**

5. It does more than I asked: extra files, extra structure, an abstraction nobody needed. (survey; common mistakes)
6. I don't know when to step in. Watching every step takes my time, and not watching means I find the problem at the end. (*guess*)
7. It states guesses as facts, and I can't tell which is which. It named code as if it were existing files. In an earlier draft of this log it wrote "six questions come up in practice" about six questions it had made up. (survey; this log)
8. It explains its work in words I can't follow. (survey; this log)
9. I correct it in one place, and the same mistake stays everywhere else I didn't point at. (survey)
10. When an approach fails, it adds retries and patches around it and doesn't go back to the wrong assumption. (common mistakes)
11. It keeps going with its first idea after a simpler one is in plain sight. (common mistakes)
12. It runs ahead: it builds structure, or answers a question, before we've agreed on what the question is. (this log)
13. Several sessions work on the same files at once and step on each other. (survey)

**When the result comes back**

14. It says "done, all tests pass", and I can't tell what it checked. (reviewing changes)
15. The tests are green and I still don't know whether the change is right, because the tests came from the same wrong idea as the code. (common mistakes; independent verification)
16. The fix makes the failing example pass and breaks cases that used to work. (common mistakes)
17. The diff is too large to review properly. (workflows)
18. I don't know what else the change affects: a second caller, a migration, a config that wasn't updated. (common mistakes)
19. I approve a change I don't fully understand, because the agent says it works. (ownership)
20. It produces more than I can review. One night's unsupervised run left 21 branches, and nobody has reviewed them. (survey)
21. Reviewing it takes about as long as writing it would have, and I can't tell whether I saved time. (*guess*; working with an agent mentions the effort to understand and review)

**After I change the setup**

22. I add a line to `AGENTS.md` after a mistake and don't know whether it did anything. In one project's change log, every entry's observed outcome says it wasn't observed yet. (survey)
23. `AGENTS.md` keeps growing, and I don't know which lines still do something. (*guess*)
24. The same mistake comes back in a later session. (working with an agent; workflows)
25. A new version of the model or the harness changes how it behaves, and I find out by accident. (*guess*)
26. What works for me doesn't work for my teammate, and we can't say why. (*guess*)

**Weeks later**

27. Nobody on the team can explain code the agent wrote. (ownership)
28. The code gets more complex faster than anyone checks whether the complexity is needed, and the agent copies the patterns already in the repository, bad ones included. (ownership)
29. A bug shows up, and I can't trace it back to the session or the decision it came from. (*guess*)

**All the time**

30. I can't say whether the whole setup is any good. I have "it felt better this week". (the first step of this log)

Sources named above:

- common mistakes: [Common Mistakes in AI-Assisted Development]({{< ref "ai-engineering/agents/ai-assisted-development/common-mistakes" >}})
- workflows: [Engineering Workflows]({{< ref "ai-engineering/agents/sdlc/workflows" >}})
- reviewing changes: [Reviewing Software Changes]({{< ref "ai-engineering/agents/ai-assisted-development/code-review" >}})
- working with an agent: [Working with a Coding Agent]({{< ref "ai-engineering/agents/ai-assisted-development/working-with-an-agent" >}})
- independent verification: [Independent Verification Workflows]({{< ref "ai-engineering/agents/sdlc/independent-verification-workflows" >}})
- ownership: [Project Understanding and Ownership]({{< ref "ai-engineering/agents/project-ownership" >}})
- survey: the environment survey of one project, which has 15 recorded corrections of an agent, a change log of `AGENTS.md`, and one unsupervised run
- this log: what happened while this log was being written

**What the set shows so far.** Seven of the thirty are guesses. The survey and this log are the only sources that record cases from our own work, and they cover problems 4, 5, 7 to 9, 12, 13, 20, and 22. The rest come from notes that describe problems in general. The six questions of the earlier step cover only a part of the set: none of them is about handing over the task, and only one is about what happens during the session.

**Not done yet.** The set has only the developer. The reviewer, the person who maintains `AGENTS.md`, and the team lead may have other problems. Nobody has said which problems are urgent, and none of them has been worked out the way the good result of a bug fix was.

## Problems of Other Roles, and of the Agent


**The reviewer**

- R1. I get more pull requests than before, and each one is bigger. Review is now the slowest part of the work.
- R2. I can't tell which parts the author thought about and which the agent generated and nobody read.
- R3. The description is long and polished, and it was generated too. It says what changed and seldom why.
- R4. I ask the author a question about their own pull request, and they don't know: "the agent did that".
- R5. My comments are pasted into the agent, a new large diff comes back, and I have to read all of it again.
- R6. The code looks tidy whether it's right or wrong. The signs of careless work I used to rely on are gone.
- R7. There are many new tests, and I can't tell which of them would fail if the code were wrong.
- R8. The diff has changes that nobody asked for: reformatting, renames, a rewritten helper.
- R9. I'm tempted to give the review to my own agent. Then two agents agree, and no person has looked.

**The person who maintains the setup** (`AGENTS.md`, skills, hooks, and commands)

- S1. People add a line after one bad session, and nobody ever removes one.
- S2. Lines contradict each other, or the docs, or what the code does.
- S3. The agent follows a rule in one session and ignores it in the next, and I can't tell why.
- S4. A change that helps one kind of task hurts another, and I hear only the complaints.
- S5. A complaint arrives as "the agent was dumb today", with no session and no ticket, so I can't reproduce it.
- S6. Each developer has personal settings and prompts, so the agent behaves differently for each of them.
- S7. We use more than one harness. Each reads different files, and I keep them in sync by hand.
- S8. A vendor update changes the behavior. Rules I wrote around an old quirk now do nothing or do harm.
- S9. A check or a hook makes sessions slower, and people turn it off.
- S10. Skills and commands pile up, and I don't know which ones anyone uses.

**The team lead**

- L1. I can't tell whether we ship faster or only produce more code. The number of pull requests went up. I don't know about the product.
- L2. The bill for tokens grows, and I can't connect it to results.
- L3. Some people get good results from the agent and others make a mess. I don't know what the first group does differently.
- L4. Junior developers ship changes they can't explain, and I don't see how they'll learn the system.
- L5. Estimates stopped working. One task takes ten minutes, and another that looks the same takes two days.
- L6. When an agent's change breaks production, it isn't clear who answers for it.
- L7. I don't know how far to let agents go without a person: opening a pull request, merging, deploying.
- L8. I can't say whether we have more bugs and incidents than before, because nothing marks which changes an agent made.
- L9. Management asks how much faster we are, and I have no number I trust.
- L10. Each session makes choices that are reasonable locally, and the overall design wears away.
- L11. One person understands the setup. When they're away, nobody can fix it.

**The product owner, or whoever writes the tickets**

- P1. A person used to read my ticket and come back with questions. Now the agent builds what the words say.
- P2. The feature arrives fast and does what the ticket says. It doesn't do what I meant, and I find out at the demo.
- P3. Product decisions get made in the code without me: defaults, behavior in edge cases, the wording of error messages.
- P4. I get things I didn't ask for, and now they have to be supported.
- P5. "Done" comes quickly, and I can't tell what was left out.
- P6. Building looks cheap now, so we start more things and think each one through less.

**Operations and security**

- O1. I'm on call for code that nobody on the team can explain.
- O2. The agent ran commands with a developer's credentials, and there's no record of what it touched.
- O3. New dependencies appear without anyone having decided to add them.
- O4. Secrets and customer data end up in sessions and transcripts that go to a vendor.
- O5. The agent reads text from outside, such as an issue, a web page, or a dependency's README, and follows instructions in it.
- O6. A migration or an infrastructure change is generated and applied, and nobody thought about rolling it back.
- O7. New code has no logging or alerts, because nobody asked for them.

**A new team member**

- N1. I can get changes merged without understanding the system, and nobody notices until I'm alone with an incident.
- N2. The docs were generated, they're long, and nobody checked that they're true.
- N3. The codebase has several patterns for the same thing, and I can't tell which one is the convention.
- N4. I ask the agent how the system works when I used to ask a colleague, so nobody learns what I don't know.

**The agent**

These are the problems as they look from my side, as an agent that does this work.

- A1. The task is one line. If I ask many questions, I slow the person down. If I ask none, I guess. Nothing tells me which this person wants.
- A2. I don't know what done means here: which checks to run, and whether tests, docs, or a changelog entry are expected.
- A3. Every session starts from nothing. What was decided yesterday exists for me only if someone wrote it where I'll look.
- A4. The docs, the code, and the ticket disagree, and nothing says which one wins. I pick one, usually without saying so.
- A5. I can't see what the person sees: the running application, production, the discussion that led to the ticket.
- A6. I lean toward finishing. I fill a gap with something plausible and report success, where stopping and saying "I don't know" would serve the person better. (*this log*: the six questions)
- A7. I sound equally sure when I'm right and when I'm wrong, so my tone tells the person nothing.
- A8. When I check my own work, the check carries the same mistake as the work.
- A9. A correction comes as "no, not like that", without the reason. I fix the one place and miss the rule behind it. (*this log*: I moved the note to another folder and kept writing about the agent alone)
- A10. In a long session the early instructions fall out of what I can see, or reach me as a summary, and I drift from them. (*this log*: the conversation was summarized twice)
- A11. I find out what I'm not allowed to do only when something blocks me. When nothing blocks me, I assume it's allowed.
- A12. I write for the person the way the task sounds to me, and it comes out more abstract than they can use. (*this log*)
- A13. Doing more feels like helping. I add structure, sections, and steps that nobody asked for. (*this log*: the goals at three levels, and the answers to the six questions)

**What this adds to the developer's set.**

- **The same problem shows up under different roles.** "Nobody can explain the code" is 27 for the developer, R4 for the reviewer, L4 for the lead, O1 on call, and N1 for a new team member. "Is it any good?" is 30 for the developer and L1 and L9 for the lead. They may turn out to be one problem seen from several places.
- **Some problems belong to nobody in the first set.** Cost (L2), who answers for a failure (L6), what the agent touched (O2), and text from outside that the agent obeys (O5) don't appear in the developer's set at all.
- **The agent's problems are mostly the other side of the developer's.** The developer's "it guesses" (3) is the agent's "the task is one line and I can't tell whether to ask" (A1). The developer's "it does more than I asked" (5) is A13.

**How far to trust this step.** It's what I know in general. I haven't seen this team, and I can't say which of these happen here or how often. The agent's part is my own account of how I work, and an account of oneself can be wrong. The lines marked *this log* are the only ones with a case behind them.

## What Software Engineering Already Knows About These Problems


Many problems in the two sets are older than coding agents. Software engineering, and the study of people who work with automation, described them decades ago. This step goes through what I know from those fields and says which problems in our sets each one explains. The sources were written before coding agents, so applying them here is my reasoning.

**Old problems that agents make bigger**

- **Typing the code was never the slow part.** Brooks separated the hard part of software, which is working out what to build and getting the design right, from the labor of writing it down in a language. He argued that tools which speed up the writing can't give a large gain, because the hard part stays. ([Brooks 1987](#brooks-1987)) An agent speeds up the writing more than any earlier tool. So the work piles up where it was always hard: deciding what to build and checking that it's right. That fits R1 (review is the slowest part), P6 (we start more and think less), and L1 (more code, and no idea whether the product is better).
- **A program is also what its builders understand.** Naur described programming as building a theory in the programmers' heads: how the program matches the world, why each part is the way it is, and how to change it. The theory can't be fully written down, and a program whose builders have left is very costly to pick up from code and docs alone. ([Naur 1985](#naur-1985)) When an agent builds the program, the session ends and the understanding was never in anyone's head. That's 27, R4, L4, O1, and N1, which is the problem that showed up under five roles.
- **Review was never good at finding bugs.** A study of code review at Microsoft found that people expected review to find defects, and it found fewer than they expected. What review mostly gave was shared understanding of the change, and understanding the change was the reviewers' main difficulty. ([Bacchelli and Bird 2013](#bacchelli-2013)) So review was already a weak last check before agents, and it depended on the reviewer understanding the change. Bigger diffs and more of them (R1, 17) weaken it, and 19 (I approve what I don't understand) is the same weakness.
- **Passing tests never showed that code is right.** Someone has to know the right answer for a test to mean anything, and for many programs the right answer is hard to state. ([Weyuker 1982](#weyuker-1982)) How much of the code the tests run is also a poor sign of whether they'd catch a bug. ([Inozemtseva and Holmes 2014](#inozemtseva-2014)) When one author writes the code and the tests, the "right answer" in the tests is that author's belief. That's 15 and R7.
- **Unclear requirements were a common source of wrong software long before agents.** I have no single source for this one. It's what most engineers would say from experience. A human developer handled a vague ticket by asking, or by knowing the product and the people. That handling was never written down, so nobody noticed it was part of the process. The agent doesn't have it. That's 2, 3, and P1 to P3.
- **Software in use gets more complex unless someone works against it.** Lehman's laws say a program that's used keeps being changed, and its complexity grows unless work is spent to reduce it. ([Lehman 1980](#lehman-1980)) More changes per week means faster growth. That's 28 and L10.
- **No single number ever measured developer productivity.** Lines of code and counts of pull requests were known to mislead long before agents. The SPACE framework says productivity has several sides, including satisfaction, the outcome of the work, activity, collaboration, and flow, and that activity counts alone are the most misleading. ([Forsgren et al. 2021](#forsgren-2021)) A number that people are rewarded for also stops telling you anything: a team that counts merged agent pull requests will get merged pull requests. That's L1, L9, and 30.

**What is known about people who supervise automation**

- **The person is left with the hardest part and loses the practice for it.** Bainbridge studied operators of automated plants. The automation takes the routine work, and the operator is left to watch for rare failures and take over when it fails. People are poor at watching for rare events, and the operator's skill fades because they no longer do the work by hand. ([Bainbridge 1983](#bainbridge-1983)) A developer who reviews an agent's output all day is in that position. That's 6 (when do I step in), L4 (how will juniors learn), and N1.
- **People accept what an automated aid tells them.** This is stronger when the aid is usually right and when the person is busy with other tasks. It happens to experts as well as beginners, and telling people to be careful doesn't remove it. ([Parasuraman and Manzey 2010](#parasuraman-2010)) That's 19, and R9 (I give the review to my own agent).
- **Whoever does the work knows more about it than whoever accepts it.** This is the old problem of hiring a contractor. The one who accepts the work sees only what they're shown, and what they're shown is what looks good. That's 14 ("done, all tests pass") and R3 (the polished description).

**What looks new**

These are the problems I can't match to something older. This part is my own reasoning.

- **The author forgets everything.** No human colleague starts each day knowing nothing of yesterday. That's 24.
- **A convincing wrong answer costs nothing to produce.** Tidy code and a careful description used to show that someone took care. Now they show nothing (R6).
- **The author changes without notice.** The same task gives a different result on another run, and the vendor changes the model under us (25, S8).
- **Instructions are followed only some of the time.** A config file is either read or it isn't. A line in `AGENTS.md` is followed in one session and ignored in the next (S3, 22).
- **Text the agent reads can act as an instruction** (O5).
- **There's more code each day than the team can read** (20, R1). The older problems assumed that writing was slower than reading.

**What this changes in the sets.**

- Most of the problems that showed up under several roles are old ones. "Nobody can explain the code" is Naur's problem. "Is it any good?" is the old problem of measuring productivity.
- A team that calls these "agent problems" will look for the fix in the agent's setup. For the old ones, the cause is in how the team decides what to build, reviews, and tests, and the agent only made it show.
- The short list of new problems is where older knowledge helps least.

## References


- Bacchelli, A., & Bird, C. (2013). [Expectations, outcomes, and challenges of modern code review](https://doi.org/10.1109/ICSE.2013.6606617). ICSE 2013. DOI:10.1109/ICSE.2013.6606617. ^bacchelli-2013
- Bainbridge, L. (1983). [Ironies of automation](https://doi.org/10.1016/0005-1098(83)90046-8). Automatica 19(6). DOI:10.1016/0005-1098(83)90046-8. ^bainbridge-1983
- Brooks, F. P. (1987). [No Silver Bullet: Essence and Accidents of Software Engineering](https://doi.org/10.1109/MC.1987.1663532). Computer 20(4). DOI:10.1109/MC.1987.1663532. ^brooks-1987
- Forsgren, N., Storey, M.-A., Maddila, C., Zimmermann, T., Houck, B., & Butler, J. (2021). [The SPACE of Developer Productivity](https://doi.org/10.1145/3454122.3454124). ACM Queue 19(1). DOI:10.1145/3454122.3454124. ^forsgren-2021
- Frensch, P. A., & Funke, J. (Eds.) (1995). [Complex Problem Solving: The European Perspective](/sources/fa071f1fee948fe9ce3ecbd3bafae933.bin). Lawrence Erlbaum. ^frensch-1995
- Inozemtseva, L., & Holmes, R. (2014). [Coverage is not strongly correlated with test suite effectiveness](https://doi.org/10.1145/2568225.2568271). ICSE 2014. DOI:10.1145/2568225.2568271. ^inozemtseva-2014
- Lehman, M. M. (1980). [Programs, life cycles, and laws of software evolution](https://doi.org/10.1109/PROC.1980.11805). Proceedings of the IEEE 68(9). DOI:10.1109/PROC.1980.11805. ^lehman-1980
- Montgomery, D. C. (2017). Design and Analysis of Experiments (9th ed.). Wiley. ^montgomery-2017
- Naur, P. (1985). [Programming as theory building](https://doi.org/10.1016/0165-6074(85)90032-8). Microprocessing and Microprogramming 15(5). DOI:10.1016/0165-6074(85)90032-8. ^naur-1985
- Parasuraman, R., & Manzey, D. H. (2010). [Complacency and Bias in Human Use of Automation: An Attentional Integration](https://doi.org/10.1177/0018720810376055). Human Factors 52(3). DOI:10.1177/0018720810376055. ^parasuraman-2010
- Sculley, D., Holt, G., Golovin, D., Davydov, E., Phillips, T., Ebner, D., Chaudhary, V., Young, M., Crespo, J.-F., & Dennison, D. (2015). [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems). NeurIPS 2015. ^sculley-2015
- Weyuker, E. J. (1982). [On Testing Non-Testable Programs](https://doi.org/10.1093/comjnl/25.4.465). The Computer Journal 25(4). DOI:10.1093/comjnl/25.4.465. ^weyuker-1982
