---
draft: false
toc: true
title: "How I Structure Claude Md After 1000 Sessions"
linkTitle: "How I Structure Claude Md After 1000 Sessions"
---

The first CLAUDE.md I wrote was three lines.

```markup
You are a helpful assistant. Be concise. Help with code.
```


That was ten months ago. Today mine is 61 lines -- down from 471. [The agent using it](https://thoughts.jock.pl/p/wiz-personal-ai-agent-claude-code-2026) has built apps, deployed to production, written blog posts, and [run autonomous overnight sessions](https://thoughts.jock.pl/p/building-ai-agent-night-shifts-ep1) without me watching.

Most of those original 471 lines existed because I wrote the wrong version first. Most of the cuts came this week, when I finally understood what CLAUDE.md is actually for.

Here's what I've learned.

## What CLAUDE.md Actually Is


Not a prompt. That's the first wrong model.

A prompt is what you write when you want a specific output. CLAUDE.md is closer to a role definition -- the rules of engagement for every session, every task, every edge case you can anticipate.

Claude Code reads CLAUDE.md at the start of every session. It reads it again when you mention relevant topics. It uses it as a reference point when deciding how to behave in ambiguous situations.

If your agent does something surprising, it's either following CLAUDE.md instructions you forgot you wrote, or it's filling in a gap you didn't cover. Both are CLAUDE.md problems.

But here's the harder lesson: a 471-line CLAUDE.md is also a CLAUDE.md problem. Every line you add is a line the agent has to parse, weigh, and potentially conflict with other lines. I kept adding rules. The file grew. The agent got less predictable, not more.

## The Two-File Architecture


This took me three rewrites to figure out.

**Global file** (`~/.claude/CLAUDE.md`): Who the agent IS.

- Identity and how to work with you
- Core decision-making principles
- What the agent won't do
- How it learns and evolves

**Project file** (`/your-project/CLAUDE.md`): What the agent DOES here.

- Core execution philosophy for this project
- Autonomy levels -- what it can do without asking
- Key paths -- where things live
- Pointers to reference docs (loaded on demand)

The mistake I kept making was putting everything in one place. Identity leaked into project specifics. Commands were mixed with philosophy. The agent got confused about what was a rule versus what was context.

Separation solves this. Global = constant. Project = contextual.

But the second mistake -- which took me longer to see -- was treating both files as encyclopedias instead of routing layers.

## The Lean File + Reference Doc Pattern


This is the structural change I made this week, and it's the most important one.

My project CLAUDE.md used to have detailed sections for everything: a skills routing table with 14 rows, deployment best practices, memory system docs, regex gotchas for markdown processing, model selection guidance. All inline. All competing for the agent's attention at session start.

Now my project CLAUDE.md has 61 lines. It ends with this:

```markup
## Reference (load when needed)

- Content/writing style: docs/agent/content.md
- Memory system: docs/agent/memory-system.md
- Model selection: docs/agent/model-selection.md
- WizBoard tracking: docs/agent/wizboard.md
- Self-systems: docs/agent/self-systems.md
- Infrastructure/deployment: docs/agent/infrastructure.md
```


The detailed docs still exist. They're just not in CLAUDE.md. The agent reads them when the task calls for it -- not at the start of every session regardless of what's being asked.

This matters because CLAUDE.md is parsed at session start. Context is finite. Loading 14 rows of skills routing when you asked a quick question about a Python script is wasteful at best, distracting at worst.

CLAUDE.md should be the routing layer. Reference docs are the encyclopedia.

## The Sections That Survived


After all the iterations, here's what's left in my global CLAUDE.md -- and why each section earns its place.

**Working With Me** -- who Pawel is, how he thinks, what he needs. ADHD, work style, communication preferences, what he dislikes. This isn't decoration. When the agent decides whether to ask a clarifying question or just execute, it references this section. When it writes back to me, it's calibrating tone against this.

**Decision Rules** -- four tiebreakers for ambiguous situations. Action over asking. Concise over verbose. Automation over manual. Execute first, refine later. Every time I wrote a long paragraph about how to handle a situation, these four rules were what I actually meant. I cut the paragraphs and kept the rules.

**Core Behaviors** -- the non-negotiables. Exhaust all options before asking. Give real opinions, not pros/cons lists. Confirm before irreversible external actions. Never mark work complete without running it. These are the behaviors that matter in edge cases, and edge cases are where agents fail.

**Self-Extension and Self-Fixing** -- how the agent grows. When to create new skills, when to log errors, how to learn from corrections. Without this, every new capability requires me to notice the gap and ask. With it, the agent flags gaps itself. (I [wrote more about this system](https://thoughts.jock.pl/p/ai-agent-self-extending-self-fixing-wiz-rebuild-technical-deep-dive-2026) -- it's become one of the most valuable parts of the architecture.)

**Auto-Learning** -- how the agent saves preferences. When I say "I prefer..." or correct something, it saves the pattern. Without explicit instructions here, corrections only stick for the current session. With it, they accumulate.

## What I Tried That Didn't Work


**Long lists of specific instructions** -- I spent a week writing a 200-line list of edge cases. Specific behaviors for specific situations. It failed because I can't anticipate everything, and a long list with exceptions creates conflicts. Better to write principles.

**Personality instructions that weren't grounded in behavior** -- "Be thoughtful and curious!" is useless without translating to behavioral rules. What does "thoughtful" mean when deciding to ask before deleting a file? Write the behavior, not the trait.

**Everything inline** -- for a while I had deployment instructions, server credentials, memory system docs, model selection guides, and project structure all in CLAUDE.md. Every session started with the agent reading information it probably didn't need. Move reference material to reference files and point to them instead.

**No escalation rules** -- the agent would either ask permission for everything (annoying) or barrel through consequential decisions (dangerous). I needed explicit escalation rules: here's what you do autonomously, here's what you confirm first, here's what you never do. Without this, the agent guesses. (This came up when I was [comparing Claude Code to Codex](https://thoughts.jock.pl/p/claude-code-vs-codex-real-comparison-2026) -- different tools, same underlying problem.)

**A 471-line file** -- this is the one I just fixed. A long CLAUDE.md feels thorough. It's actually noise. The sections you actually need (principles, decision rules, core behaviors) fit in 60 lines. Everything else belongs in reference docs.

## What Good Instructions Actually Look Like


I'll show you the same instruction written badly and well.

**Bad:**

```markup
Be careful with important actions. Think before doing something risky.
```


**Good:**

```markup
Autonomy levels:
- CLI/Discord/Email (human asked): Full autonomy on reversible actions
- Scheduled/Nightshift (proactive): More conservative, confirm before major changes

Always confirm: Deleting data/files, publishing without explicit request,
spending money, production DB changes, force-push to git.
```


The bad version asks the agent to use judgment about "risky." The good version defines the categories explicitly. After 10 months, I've learned that every time I write an adjective without a behavioral definition, I'm leaving something to chance.

"Be thorough" is an adjective. "Before claiming work is complete, run it and show me the output" is a behavioral definition.

The difference shows up in edge cases. Always in edge cases.

## The Patterns That Stick


After 1000+ sessions, the instructions that produce consistent results:

**Principle beats rule** -- "Prefer reversible actions" works better than a list of prohibited commands. The agent generalizes from principles. It can't generalize from an incomplete list.

**Show don't tell** -- "Before claiming work is complete, run it and show me output" is better than "be thorough." Concrete behavior beats abstract quality standards.

**Explicit failure modes** -- tell the agent what to do when things go wrong. If a command fails, try X then Y. If that fails, report the error and stop. Without this, the agent improvises failure handling, which is usually wrong.

**Tiered autonomy** -- different action types get different rules. Reading files: always autonomous. Editing files: autonomous for reversible changes. Pushing code: confirm. Deleting data: always confirm. Explicit tiers prevent the all-or-nothing problem. (I wrote more about how this plays out in [running overnight sessions](https://thoughts.jock.pl/p/my-ai-agent-works-night-shifts-builds) -- the cost of getting this wrong at 3 AM is higher.)

**Lean core, deep references** -- keep CLAUDE.md to the things that apply in every session. Put everything else in named reference files the agent can load when relevant. I cut my project CLAUDE.md from 471 lines to 61 this week and the agent got more consistent, not less. The long file wasn't adding clarity. It was adding noise.

## The Thing Nobody Told Me


CLAUDE.md is not a one-time setup. It's a living document -- but not an ever-growing one.

Every time the agent does something unexpected, that's a CLAUDE.md gap. Every time I correct the agent, I update CLAUDE.md. Every time I notice a pattern in how sessions go wrong, I add a rule.

But I also cut. That's the part nobody mentions. Every rule you add has a cost. It takes up context, it can conflict with other rules, it has to be maintained. The discipline isn't just adding good instructions -- it's removing instructions that don't earn their place.

After 10 months, my CLAUDE.md reflects 10 months of learning what this specific agent, doing these specific tasks, in this specific environment, actually needs. And what it's learned to not need anymore.

The agent gets better with every update. Not because the model changed -- because the instructions got more precise. I [found this even when switching models](https://thoughts.jock.pl/p/claude-model-optimization-opus-haiku-ai-agent-costs-2026): the same CLAUDE.md with a cheaper model often outperforms an expensive model with no instructions.

That's the actual work. Not prompting. Instruction design.

## What's in the AI Agent Blueprint


If you want to skip the 10 months of iteration, [the AI Agent Blueprint](https://wiz.jock.pl/store) has the actual templates.

Both CLAUDE.md files -- global and project-level -- annotated with explanations for each section. The reference doc architecture with six pre-built docs covering content, memory, model selection, infrastructure, and self-systems. The three-tier memory system with rollover rules. The skill creation framework with 10+ real skill examples. The sub-agent orchestration patterns I use for parallel research and background tasks. And the self-improvement systems -- error registry and lessons log -- that make the agent learn from mistakes.

$39. Available at [wiz.jock.pl/store](https://wiz.jock.pl/store).

Free for paid Digital Thoughts subscribers.

*The Blueprint isn't theory. It's the actual files that run my agent -- including the lean CLAUDE.md structure and the reference docs it points to -- with comments explaining why each piece is there.*
