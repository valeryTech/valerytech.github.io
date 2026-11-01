---
draft: false
toc: true
title: "Backlog"
description: "Planned work for the code-intelligence project that is not scheduled yet, each item written as a plan with its question, prerequisites, steps and a done condition."
linkTitle: "Backlog"
---

Work that is planned but not scheduled. Each item is written as a plan: the question, why it is still open, what has to be decided before it can start, the steps, and when it is done.

## Configuration-links study


Status: not started. It was Part B of the [pilot]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}#pilot), which now covers only lexical overlap. It is blocked on choosing repositories ([Decision before starting](#decision-before-starting)).

### Question


Does linking code to configuration values help an assistant answer configuration questions, and is the help concentrated where a key's name changes between layers? A typical chain: the Helm value `database.url` is rendered through a template into the environment variable `DATABASE_URL`, which code reads through a settings object as `settings.database_url`.

This is hypothesis H8 in the [thesis and evaluation plan]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}), tested with condition B5 and task types T4 (configuration) and T7 (config impact).

### Why it is open


- The literature search found no study that gives an LLM configuration values linked to the code that reads them ([related work § History, runtime and configuration]({{< ref "projects/code-intelligence/related-work" >}}#history-runtime-and-configuration-as-llm-context)). The nearest result, Simon et al. (ASE 2025), found that extra context does not reliably help an LLM validate dependencies between configuration settings.
- Configuration keys are often literal strings, so grep may already find them. The study is set up so that this outcome shows clearly: if links help only where names change, the value lies in modeling name transformations, not in a key index.

### Decision before starting


Which repositories to use. One or two repositories that:

- keep application code and deployment configuration together (Helm or Kustomize charts, Terraform, docker-compose, `.env` and settings files);
- read configuration through environment variables or settings objects;
- have more than one environment (for example dev, staging and prod), so that value questions have answers per environment;
- have commits that change code and configuration together;
- contain name indirection, not only the same literal in every layer.

Own repositories are best: models are less likely to have memorized them, and their owner can judge the answers. Public repositories make the results reproducible. Either way, check that a repository has enough transformed and templated keys before writing items (step 3). A repository where every key is the same literal in every layer cannot test H8.

### Plan


1. **Choose and pin the repositories.** Pick a commit per repository, list its environments, and write down the command that renders each environment's configuration (`helm template`, `kustomize build`, `docker compose config`, Terraform variable files per workspace).
   - Output: a short card per repository with the commit, the environments, the render commands and the configuration formats present.
2. **Build the gold configuration.** Render each environment and extract the effective key-value pairs. The gold comes from rendering, not from B5's parser, so that the ground truth does not share B5's mistakes.
   - Output: one table per environment, with key, value and defining file.
3. **Survey the keys.** List the keys that code reads and tag each by name indirection: the same literal in every layer, a transformed name (case, prefix, nesting, framework binding rules), or a templated chain.
   - Output: a key inventory with indirection tags and counts per tag. If transformed and templated keys are too few, stop and choose another repository.
4. **Write the items**, about 50, balanced across the indirection tags as far as the repositories allow:
   - *Value questions*: "What is the value of X in environment E, and where is it set?" The gold is from step 2.
   - *Reader questions*: "Which code is affected if configuration key K changes?" Gold read sites are labeled by hand and, where possible, checked by changing the value and running the tests.
   - *History items*: commits that change both code and configuration. Given the code part of the change, which configuration files had to change, and the reverse. The commit is the gold. Filter out large commits, mass renames and formatting-only commits, as for the co-change matrix in [implicit knowledge]({{< ref "projects/code-intelligence/implicit-knowledge" >}}).
   - Output: an item file with the question, type, environment, indirection tag, gold, and the commit at which history is cut.
5. **Build condition B5.**
   - Parse YAML, JSON, TOML, `.env`, Helm values and Terraform variables into a map from keys to definitions, per environment.
   - Find configuration reads in code with tree-sitter queries (`os.getenv`, `process.env`, settings accessors).
   - Link read sites to keys and keys to definitions, including known transformations (environment-variable naming, nested paths, template references).
   - In retrieval, add the definitions of every key that retrieved code reads. For agents, add the tools `config_lookup(key)` and `config_readers(key)`.
   - Check B5's links against the key inventory from step 3 before running any model, so that a linking bug is not read as a null result.
   - Output: the B5 index, its link precision and recall per indirection tag, and the two tools.
6. **Run the conditions.** B0, B0 + B5, A0, and A0 + config tools, with the same model and token budget as the pilot (16k), and history cut at each item's commit. B1 to B3 are left out on purpose, to isolate the configuration effect.
7. **Analyze.**
   - Accuracy per condition and indirection tag, with confidence intervals.
   - Error analysis that separates linking failures (B5 missed the key) from use failures (the value was in context and the model ignored or misread it).
   - For the agent conditions, steps and tokens as well as success.

### Prediction and refutation


H8 predicts that B5 beats B0, and the config tools beat plain A0, on transformed and templated items, with little difference on same-literal items. It is refuted if the gain is the same across indirection tags, or zero.

Two outcomes already have rules in the [thesis plan's decision rules]({{< ref "projects/code-intelligence/thesis-and-evaluation" >}}#decision-rules):

- links help only on transformed or templated names: build name-transformation modeling, not a generic key index;
- a grep agent matches config links: configuration helps as part of the answer (values per environment), not as retrieval.

One more is specific to this study: if there is no gain on any tag, drop configuration links from the first prototype in the [project's next steps]({{< ref "projects/code-intelligence" >}}#next-steps).

### Done when


- The items, gold tables and B5 build are checked and saved, so that phase 2 of the plan (the full ablation) can reuse them for B5 and T7.
- Results per condition and indirection tag are recorded with confidence intervals, whichever way they point.

Include B5 in the full ablation if config links beat their text or grep counterpart by roughly ten points on transformed or templated items, in the same direction across repositories. This is the same threshold as the pilot's go/no-go.

### Risks


- **Small cells.** About 50 items split by three indirection tags and three item types leaves few items per cell. Treat the results as effect estimates, as in the pilot, and size the full study from them.
- **Secrets.** Own repositories may keep secrets in `.env` files or Terraform variables. Keep secret values out of items, gold tables and model context; ask where a secret is set, not what it is.
- **Values resolved at deploy time.** Some values exist only at deploy time (secret managers, Terraform remote state, cluster defaults). Mark those keys as unresolvable and use them only in "where is it set" questions.
- **Memorization.** Public repositories may be in training data. Prefer commits after the model's training cutoff, and record the cutoff.
