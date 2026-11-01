---
draft: false
toc: true
title: "Codex Model Prompts Split into Pieces"
linkTitle: "Overview"
---

Generated from `codex-rs/models-manager/models.json` by `build.py`.

## Source and license


The prompt text comes from OpenAI Codex, file `codex-rs/models-manager/models.json` in [openai/codex on GitHub](https://github.com/openai/codex), licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). A copy of the license is in [LICENSE](/ai-engineering/agents/system-prompts/codex/readme.assets/license), and the project's notice is in [NOTICE](/ai-engineering/agents/system-prompts/codex/readme.assets/notice).

OpenAI Codex. Copyright 2025 OpenAI.

Changes from the original: the prompts were taken out of the JSON file, the escaped `\n` sequences were turned into line breaks, and the text was split into pieces, grouped and indexed. In `models-assembled/`, headings inside the prompts were also moved down two levels. Placeholders such as `<X>` in the prose were wrapped in backticks so that Markdown shows them. The wording of the prompts was not changed.

This is not an official OpenAI project and is not endorsed by OpenAI.

## Layout


- `pieces/` holds each distinct text once. When models use different text for the same section, the most used version has the plain name and the others end in `.v2`, `.v3`, and so on.
- File names use `__` in place of folders, e.g. `multi_agent__role__root.md`. Pieces named `instructions_template__*` hold the main prompt cut at `#` and `##` headings.
- `models-assembled/<slug>.md` has the full prompt text for each model, with a link to the piece before each part. Headings inside the prompts are moved down two levels to sit under the `##` section headings.
- `models/<slug>.md` lists the pieces each model uses, in order. Joining a model's `instructions_template` pieces with a newline (after dropping each file's final newline) gives back the original text, except for the backticks around placeholders.

## Which models use each piece


| Piece | Models |
| --- | --- |
| [Approvals__on_request_auto_review]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/approvals-on-request-auto-review" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Auto_review__node_repl_policy]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/auto-review-node-repl-policy" >}}) | gpt-5.6-luna, codex-auto-review |
| [Auto_review__policy]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/auto-review-policy" >}}) | gpt-5.6-luna, codex-auto-review |
| [Auto_review__policy_template]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/auto-review-policy-template" >}}) | gpt-5.6-luna, codex-auto-review |
| [Auto_review__rejection_instructions]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/auto-review-rejection-instructions" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Collaboration_modes__default]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/collaboration-modes-default" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6-sol, gpt-6-luna |
| [Collaboration_modes__default]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/collaboration-modes-default-v2" >}}) | gpt-6.1-terra |
| [Confirmation_policies__browser_use]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/confirmation-policies-browser-use" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6-sol, gpt-6-luna |
| [Confirmation_policies__browser_use]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/confirmation-policies-browser-use-v2" >}}) | gpt-6.1-terra |
| [Confirmation_policies__computer_use]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/confirmation-policies-computer-use" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6-sol, gpt-6-luna |
| [Confirmation_policies__computer_use]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/confirmation-policies-computer-use-v2" >}}) | gpt-6.1-terra |
| [Guardian_v2__classifier_instructions]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/guardian-v2-classifier-instructions" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Instructions_template__apps Connectors]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-apps-connectors" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Instructions_template__autonomy And Persistence]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-autonomy-and-persistence" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, codex-auto-review |
| [Instructions_template__autonomy And Persistence]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-autonomy-and-persistence-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [Instructions_template__autonomy And Persistence]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-autonomy-and-persistence-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [Instructions_template__autonomy And Persistence]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-autonomy-and-persistence-v4" >}}) | gpt-daybreak-blue-latest, gpt-daybreak-red-latest |
| [Instructions_template__autonomy And Persistence]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-autonomy-and-persistence-v5" >}}) | gpt-5.5 |
| [Instructions_template__destructive Actions]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-destructive-actions" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [Instructions_template__editing Constraints]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-editing-constraints" >}}) | gpt-5.5 |
| [Instructions_template__engineering Judgment]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-engineering-judgment" >}}) | gpt-5.5 |
| [Instructions_template__file Editing Constraints]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-file-editing-constraints" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [Instructions_template__final Answer Instructions]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-final-answer-instructions" >}}) | gpt-5.5 |
| [Instructions_template__final Answer]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-final-answer" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [Instructions_template__final Answer]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-final-answer-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [Instructions_template__final Answer]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-final-answer-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [Instructions_template__formatting Rules]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-formatting-rules" >}}) | gpt-5.5 |
| [Instructions_template__frontend Guidance]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-frontend-guidance" >}}) | gpt-5.5 |
| [Instructions_template__general]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-general" >}}) | gpt-5.5 |
| [Instructions_template__how To Use Plugins]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-how-to-use-plugins" >}}) | gpt-6-astra, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Instructions_template__how To Use Plugins]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-how-to-use-plugins-v2" >}}) | gpt-6.1-sol |
| [Instructions_template__how To Use Skills]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-how-to-use-skills" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [Instructions_template__how To Use Skills]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-how-to-use-skills-v2" >}}) | gpt-6-sol, gpt-6-luna |
| [Instructions_template__intermediary Updates]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intermediary-updates" >}}) | gpt-5.5 |
| [Instructions_template__intermediate Commentary]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intermediate-commentary" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [Instructions_template__intermediate Commentary]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intermediate-commentary-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [Instructions_template__intermediate Commentary]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intermediate-commentary-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [Instructions_template__intro]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intro" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [Instructions_template__intro]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intro-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Instructions_template__intro]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intro-v3" >}}) | gpt-5.5 |
| [Instructions_template__personality]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-personality" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [Instructions_template__personality]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-personality-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [Instructions_template__personality]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-personality-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [Instructions_template__personality]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-personality-v4" >}}) | gpt-5.5 |
| [Instructions_template__plugins]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-plugins" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Instructions_template__rules For Getting Work Done]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-rules-for-getting-work-done" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [Instructions_template__rules For Getting Work Done]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-rules-for-getting-work-done-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [Instructions_template__rules For Getting Work Done]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-rules-for-getting-work-done-v3" >}}) | gpt-6-sol |
| [Instructions_template__rules For Getting Work Done]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-rules-for-getting-work-done-v4" >}}) | gpt-6-luna |
| [Instructions_template__special User Requests]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-special-user-requests" >}}) | gpt-5.5 |
| [Instructions_template__technical Communication]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-technical-communication" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, codex-auto-review |
| [Instructions_template__technical Communication]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-technical-communication-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [Instructions_template__technical Communication]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-technical-communication-v3" >}}) | gpt-daybreak-blue-latest, gpt-daybreak-red-latest |
| [Instructions_template__using Skills]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-using-skills" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, codex-auto-review |
| [Instructions_template__using Skills]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-using-skills-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [Instructions_template__using Skills]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-using-skills-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [Instructions_template__using Skills]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-using-skills-v4" >}}) | gpt-daybreak-red-latest |
| [Instructions_template__when To Ask The User For Permission]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-when-to-ask-the-user-for-permission" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [Instructions_template__when To Ask The User For Permission]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-when-to-ask-the-user-for-permission-v2" >}}) | gpt-6-sol |
| [Instructions_template__when To Ask The User For Permission]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-when-to-ask-the-user-for-permission-v3" >}}) | gpt-6-luna |
| [Instructions_template__when To Use A Skill]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-when-to-use-a-skill" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Instructions_template__working With The User]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-working-with-the-user" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [Instructions_template__working With The User]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-working-with-the-user-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [Instructions_template__working With The User]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-working-with-the-user-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [Instructions_template__working With The User]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-working-with-the-user-v4" >}}) | gpt-5.5 |
| [Instructions_template__writing Style]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-writing-style" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [Instructions_template__writing Style]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-writing-style-v2" >}}) | gpt-6-astra, gpt-6.1-terra |
| [Instructions_template__writing Style]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-writing-style-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [Instructions_template__writing Style]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-writing-style-v4" >}}) | gpt-6.1-sol |
| [Multi_agent__role__root]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/multi-agent-role-root" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Multi_agent__role__subagent]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/multi-agent-role-subagent" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Persistent_instructions]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/persistent-instructions" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [Token_budget__auto_compact_fallback_prompt]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/token-budget-auto-compact-fallback-prompt" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest |
| [Token_budget__guidance_message]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/token-budget-guidance-message" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest |
| [Token_budget__reminder_message_template]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/token-budget-reminder-message-template" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest |
| [Upgrade__migration_markdown]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/upgrade-migration-markdown" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.5 |
| [Upgrade__migration_markdown]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/upgrade-migration-markdown-v2" >}}) | gpt-5.6-luna |
