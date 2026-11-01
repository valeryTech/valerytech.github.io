---
draft: false
toc: true
title: "Codex Model Prompts Split into Pieces"
linkTitle: "Overview"
---

Generated from `codex-rs/models-manager/models.json` by `build.py`.

## Source and license


The prompt text comes from OpenAI Codex, file `codex-rs/models-manager/models.json` in <https://github.com/openai/codex>, licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). A copy of the license is in [LICENSE](/ai-engineering/agents/system-prompts/codex/readme.assets/license), and the project's notice is in [NOTICE](/ai-engineering/agents/system-prompts/codex/readme.assets/notice).

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
| [approvals__on_request_auto_review.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/approvals-on-request-auto-review" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [auto_review__node_repl_policy.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/auto-review-node-repl-policy" >}}) | gpt-5.6-luna, codex-auto-review |
| [auto_review__policy.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/auto-review-policy" >}}) | gpt-5.6-luna, codex-auto-review |
| [auto_review__policy_template.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/auto-review-policy-template" >}}) | gpt-5.6-luna, codex-auto-review |
| [auto_review__rejection_instructions.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/auto-review-rejection-instructions" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [collaboration_modes__default.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/collaboration-modes-default" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6-sol, gpt-6-luna |
| [collaboration_modes__default.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/collaboration-modes-default-v2" >}}) | gpt-6.1-terra |
| [confirmation_policies__browser_use.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/confirmation-policies-browser-use" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6-sol, gpt-6-luna |
| [confirmation_policies__browser_use.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/confirmation-policies-browser-use-v2" >}}) | gpt-6.1-terra |
| [confirmation_policies__computer_use.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/confirmation-policies-computer-use" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6-sol, gpt-6-luna |
| [confirmation_policies__computer_use.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/confirmation-policies-computer-use-v2" >}}) | gpt-6.1-terra |
| [guardian_v2__classifier_instructions.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/guardian-v2-classifier-instructions" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [instructions_template__apps-connectors.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-apps-connectors" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [instructions_template__autonomy-and-persistence.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-autonomy-and-persistence" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, codex-auto-review |
| [instructions_template__autonomy-and-persistence.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-autonomy-and-persistence-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [instructions_template__autonomy-and-persistence.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-autonomy-and-persistence-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [instructions_template__autonomy-and-persistence.v4.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-autonomy-and-persistence-v4" >}}) | gpt-daybreak-blue-latest, gpt-daybreak-red-latest |
| [instructions_template__autonomy-and-persistence.v5.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-autonomy-and-persistence-v5" >}}) | gpt-5.5 |
| [instructions_template__destructive-actions.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-destructive-actions" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [instructions_template__editing-constraints.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-editing-constraints" >}}) | gpt-5.5 |
| [instructions_template__engineering-judgment.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-engineering-judgment" >}}) | gpt-5.5 |
| [instructions_template__file-editing-constraints.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-file-editing-constraints" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [instructions_template__final-answer-instructions.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-final-answer-instructions" >}}) | gpt-5.5 |
| [instructions_template__final-answer.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-final-answer" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [instructions_template__final-answer.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-final-answer-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [instructions_template__final-answer.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-final-answer-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [instructions_template__formatting-rules.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-formatting-rules" >}}) | gpt-5.5 |
| [instructions_template__frontend-guidance.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-frontend-guidance" >}}) | gpt-5.5 |
| [instructions_template__general.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-general" >}}) | gpt-5.5 |
| [instructions_template__how-to-use-plugins.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-how-to-use-plugins" >}}) | gpt-6-astra, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [instructions_template__how-to-use-plugins.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-how-to-use-plugins-v2" >}}) | gpt-6.1-sol |
| [instructions_template__how-to-use-skills.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-how-to-use-skills" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [instructions_template__how-to-use-skills.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-how-to-use-skills-v2" >}}) | gpt-6-sol, gpt-6-luna |
| [instructions_template__intermediary-updates.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intermediary-updates" >}}) | gpt-5.5 |
| [instructions_template__intermediate-commentary.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intermediate-commentary" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [instructions_template__intermediate-commentary.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intermediate-commentary-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [instructions_template__intermediate-commentary.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intermediate-commentary-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [instructions_template__intro.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intro" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [instructions_template__intro.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intro-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [instructions_template__intro.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-intro-v3" >}}) | gpt-5.5 |
| [instructions_template__personality.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-personality" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [instructions_template__personality.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-personality-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [instructions_template__personality.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-personality-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [instructions_template__personality.v4.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-personality-v4" >}}) | gpt-5.5 |
| [instructions_template__plugins.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-plugins" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [instructions_template__rules-for-getting-work-done.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-rules-for-getting-work-done" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [instructions_template__rules-for-getting-work-done.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-rules-for-getting-work-done-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [instructions_template__rules-for-getting-work-done.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-rules-for-getting-work-done-v3" >}}) | gpt-6-sol |
| [instructions_template__rules-for-getting-work-done.v4.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-rules-for-getting-work-done-v4" >}}) | gpt-6-luna |
| [instructions_template__special-user-requests.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-special-user-requests" >}}) | gpt-5.5 |
| [instructions_template__technical-communication.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-technical-communication" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, codex-auto-review |
| [instructions_template__technical-communication.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-technical-communication-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [instructions_template__technical-communication.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-technical-communication-v3" >}}) | gpt-daybreak-blue-latest, gpt-daybreak-red-latest |
| [instructions_template__using-skills.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-using-skills" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, codex-auto-review |
| [instructions_template__using-skills.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-using-skills-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [instructions_template__using-skills.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-using-skills-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [instructions_template__using-skills.v4.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-using-skills-v4" >}}) | gpt-daybreak-red-latest |
| [instructions_template__when-to-ask-the-user-for-permission.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-when-to-ask-the-user-for-permission" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [instructions_template__when-to-ask-the-user-for-permission.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-when-to-ask-the-user-for-permission-v2" >}}) | gpt-6-sol |
| [instructions_template__when-to-ask-the-user-for-permission.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-when-to-ask-the-user-for-permission-v3" >}}) | gpt-6-luna |
| [instructions_template__when-to-use-a-skill.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-when-to-use-a-skill" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [instructions_template__working-with-the-user.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-working-with-the-user" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [instructions_template__working-with-the-user.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-working-with-the-user-v2" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra |
| [instructions_template__working-with-the-user.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-working-with-the-user-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [instructions_template__working-with-the-user.v4.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-working-with-the-user-v4" >}}) | gpt-5.5 |
| [instructions_template__writing-style.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-writing-style" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest, gpt-daybreak-red-latest, codex-auto-review |
| [instructions_template__writing-style.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-writing-style-v2" >}}) | gpt-6-astra, gpt-6.1-terra |
| [instructions_template__writing-style.v3.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-writing-style-v3" >}}) | gpt-6-sol, gpt-6-luna |
| [instructions_template__writing-style.v4.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/instructions-template-writing-style-v4" >}}) | gpt-6.1-sol |
| [multi_agent__role__root.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/multi-agent-role-root" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [multi_agent__role__subagent.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/multi-agent-role-subagent" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [persistent_instructions.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/persistent-instructions" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna |
| [token_budget__auto_compact_fallback_prompt.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/token-budget-auto-compact-fallback-prompt" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest |
| [token_budget__guidance_message.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/token-budget-guidance-message" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest |
| [token_budget__reminder_message_template.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/token-budget-reminder-message-template" >}}) | gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, gpt-daybreak-blue-latest |
| [upgrade__migration_markdown.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/upgrade-migration-markdown" >}}) | gpt-5.6-sol, gpt-5.6-terra, gpt-5.5 |
| [upgrade__migration_markdown.v2.md]({{< ref "ai-engineering/agents/system-prompts/codex/pieces/upgrade-migration-markdown-v2" >}}) | gpt-5.6-luna |
