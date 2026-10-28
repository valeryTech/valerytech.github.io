---
draft: false
toc: true
title: "Object-Oriented Harness: Evolving Agent Harnesses through Object-Oriented Design"
description: "A formatted paper on evolving agent harness hierarchies through inheritance and routing, including the training method, evaluation, ablations, and limitations."
linkTitle: "Object-Oriented Harness: Evolving Agent Harnesses through Object-Oriented Design"
---

Formatted copy of the [original paper](https://arxiv.org/html/2610.28380), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

**Authors**

- Gaotang Li -- University of Illinois Urbana-Champaign
- Bhavana Dalvi Mishra -- Google Cloud AI Research
- Yifei Ming -- Google Cloud AI Research
- Yanfei Chen -- Google Cloud AI Research
- Zhongying CuiZhu -- Google Cloud AI Research
- Lesly Miculicich -- Google Cloud AI Research
- Long T. Le -- Google Cloud AI Research
- Rui Meng -- Google Cloud AI Research
- Chun-Liang Li -- Google Cloud AI Research
- Hanghang Tong -- University of Illinois Urbana-Champaign
- Chen-Yu Lee -- Google Cloud AI Research
- Tomas Pfister -- Google Cloud AI Research

## Abstract


Agent harnesses are executable code that specifies the prompts, tools, and control flow around a language model. A single global harness can struggle with heterogeneous tasks that require different execution strategies. In this work, we introduce Object-Oriented Harness (OO-Harness), a harness optimization framework that evolves a hierarchy of executable harness classes using object-oriented design. During training, an evolution agent uses execution records to create a family of specialized harnesses, each implemented as a subclass of the base or an existing specialized harness via inheritance. At test time, a harness router uses routing lessons accumulated during training to select a specific harness for each task. Across three long-horizon benchmarks spanning business workflows, workspace tasks, and tool use, OO-Harness achieves the best performance among the compared methods, with an absolute improvement of up to \(15.79\%\) over the base harness. Extensive ablation studies examine the contributions of its core components.

Figure 1: Three ways to organize harness adaptation

Figure 1: Three ways to organize harness adaptation. (a) A single global harness serves all tasks. (b) A router selects among independent harness implementations. (c) OO-Harness selects among specialized harnesses that share code through inheritance.

## 1 Introduction


Generalizing to tasks beyond the training distribution is a central goal of language-agent research [^27] [^25]. Recent benchmarks illustrate the breadth of tasks agents must handle: FutureX evaluates agents on forecasting real-world events using external information [^28], while APEX-Agents evaluates cross-application workflows in investment banking, management consulting, and corporate law [^22]. These workloads differ in the tool use, context management, and completion checks they require. An agent's *harness* implements these choices as executable code around a language model [^26].

Recent approaches automate agent design and harness optimization by refining executable code and other harness components using execution feedback [^5] [^29] [^15] [^9] [^11] [^7] [^17] [^6]. Meta-Harness, for example, evolves candidate programs using discovery-set feedback and selects a global harness based on performance on that set [^9]. Such selection does not guarantee that the same changes remain beneficial under distribution shift. Even within a benchmark, Agentic Harness Engineering's component ablations show that adding evolved memory improves performance on hard tasks but reduces it on easy ones [^11]. EvoHarnessBench further shows that adding tools, skills, and specialist agents can degrade previously effective behavior [^8]. These findings motivate specialized harnesses that share common code while preserving different execution strategies, with a router selecting a harness for each task.

Because harnesses are executable code [^18], object-oriented design offers a natural way to express shared and specialized behavior. We introduce Object-Oriented Harness (OO-Harness), a harness optimization framework that evolves a hierarchy of executable classes (Figure 1). Each specialized harness inherits from the base or an existing specialized harness, overriding inherited methods or adding new ones.

During training, we first cluster discovery tasks by shared execution needs identified in base-harness execution records. An *evolution agent* iteratively selects a cluster and parent harness, creates a subclass, and evaluates it across the cluster's tasks. This feedback guides subsequent revisions and accumulates as design and routing lessons. This offers two advantages. *Efficiency:* evaluating candidates on their target clusters avoids rerunning the entire discovery set. *Generalization:* specialized changes leave the base and other learned harnesses intact, so new tasks can use an appropriate harness without inheriting unrelated changes. At test time, *polymorphism* allows the executor to run a selected harness through a common execution interface. A *harness router* uses the task, an observable base trajectory, and routing lessons to select a specialized harness or retain the base result. The hierarchy and lessons are frozen before deployment; executor weights remain fixed in both phases.

Concurrent work also explores task-specific harness selection. Adaptive Auto-Harness routes tasks among specialized Git branches [^14]. In OO-Harness, inheritance shares code across harnesses, and routing lessons learned during training guide selection alongside class descriptions and observable base trajectories.

We evaluate OO-Harness on AutomationBench, Workspace-Bench, and Toolathlon-GYM, where it achieves the highest primary score among the compared methods.

Our contributions are:

- A harness representation combining shared code and specialized behavior through inheritance, method overrides, and new methods.
- An evolution framework that learns specialized harnesses and routing lessons from execution records to support task-specific selection.
- Strong empirical results across three long-horizon benchmarks, with extensive ablations validating individual components.

## 2 Related Work

### Self-evolving agents


Self-evolving agents use execution experience to improve prompts, memories, skills, and other persistent components. GEPA reflects on trajectories to optimize prompts [^1], while ReasoningBank distills successful and failed experiences into reusable memories [^19]. A-Evolve considers deliberate updates to persistent agent state [^12], and HASP represents skills as executable functions that modify actions or supply corrective context [^13]. These forms of adaptation provide building blocks for harness evolution. OO-Harness evolves specialized harnesses through inheritance and uses a harness router to select one for each task.

### Automatic harness evolution


Recent work automates harness construction and revision through code search and execution feedback, including Meta-Harness [^9], Agentic Harness Engineering [^11], and HarnessEvolve [^6]. These approaches primarily optimize a global harness across tasks, although changes that benefit one task group may not benefit another. HarnessDev benchmarks harness creation and evolution [^24], while EvoHarnessBench shows that expanding tools, skills, and specialist agents can degrade previously effective behavior [^8]. Concurrent work explores adaptation across tasks and deployments: Adaptive Auto-Harness shares and specializes workspace contents through Git branching and rebasing [^14], while EvolveNet integrates adaptations from distributed deployments into a global harness [^17]. At the representation level, NOOA provides a programming model that expresses agents as native Python objects [^3]. OO-Harness evolves a hierarchy of executable harness classes through inheritance, method overrides, and new methods. Its harness router selects a harness using routing lessons accumulated during training, class descriptions, the task, and an observable base trajectory.

## 3 Method

### 3.1 Problem setting and overview


A harness implements the prompts, tools, and execution rules around an *executor*, the language model \(M\) that carries out tasks [^18]. OO-Harness evolves this code on discovery tasks while keeping \(M\) fixed, then evaluates the frozen harnesses on disjoint held-out tasks (Figure 2). This differs from Meta-Harness's TerminalBench-2 discovery experiment, which uses the same tasks for search and final evaluation [^9]. Separating discovery from evaluation is essential for assessing generalization beyond the search set [^23].

Figure 2: Problem setting

Figure 2: Problem setting. We use a train/test split: harnesses evolve on discovery tasks and are evaluated on disjoint held-out tasks.

A *harness hierarchy* \(\mathcal{T}_{H}\) stores complete harness classes, starting from the base \(H_{0}\). Each child inherits its parent's methods and can override existing methods or add new ones. *Task clusters* \(\mathcal{C}\) group discovery tasks with related execution needs. For cluster \(c\), let \(\mathcal{D}_{c}\) denote its discovery tasks and \(H_{c}\) the harness currently chosen for that cluster. Clusters organize task evidence; the hierarchy organizes reusable harness code. The *evolution agent* \(\pi\) constructs candidate subclasses from discovery-task evidence, while the *harness router* \(\rho\) selects the base or a specialized harness (Figure 3). Appendices A.1 and A.4 describe model-prompts/implementation details; Table 2 compares routing inputs.

Execution records \(\mathcal{E}\) store candidate code, discovery-task trajectories, outcomes, and reflections from successful and unsuccessful proposals. Where lesson stores are enabled, we summarize these records into *design lessons* \(\mathcal{L}_{\pi}\) for code revision and *routing lessons* \(\mathcal{L}_{\rho}\) for harness selection. Design lessons describe useful changes and failed approaches; routing lessons describe when a harness applies. Both accumulate during discovery and remain frozen at deployment. The router's model weights stay fixed; training changes the evidence that guides its decisions.

Figure 3: OO-Harness training and test-time execution

Figure 3: OO-Harness training and test-time execution. (1) Base execution records initialize task clusters. (2) The evolution agent builds and evaluates subclasses, updating lessons from execution feedback. (3) The resulting harness hierarchy, harness descriptions, and routing lessons are frozen for testing. (4) The harness router uses the task, observable base trajectory, and frozen routing lessons to select a specialized harness or reuse the base result.

### 3.2 Representing the harness hierarchy

#### Interfaces and inheritance


Harness evolution operates on executable class definitions and supporting source files. The agent can change prompts, tools, context management, and execution control, and introduce additional methods. Where supported by the scaffold, it can also configure middleware, file backends, and subagents. The resulting class must remain compatible with the scaffold's execution interface.

A subclass reuses inherited methods and overrides or adds methods for a targeted change. Overrides can call parent methods through `super()`. Figure 1 illustrates the hierarchy; Listing 1 shows inheritance in a saved harness lineage.

#### Execution within one instance


The harness router selects a complete class whose methods execute within one instance; ancestors are not separate agent runs. Methods can condition their behavior on runtime evidence, such as repeated tool errors or unfinished output artifacts.

### 3.3 Training initialization


We first run \(H_{0}\) on discovery tasks \(\mathcal{D}_{\mathrm{tr}}\) and retain trajectories and evaluation feedback. We group tasks whose base executions suggest that they may benefit from a shared harness change, yielding clusters \(\mathcal{C}\) and task sets \(\mathcal{D}_{c}\). Each cluster records its shared execution needs and starts with \(H_{c}=H_{0}\); the initial hierarchy is \(\mathcal{T}_{H}=\{H_{0}\}\).

### 3.4 Training iteration


At each iteration, the evolution agent works in a code workspace with filesystem access to harness source, task clusters, and execution records. It can inspect files, delegate analysis to subagents, and write or edit candidate code. It selects a target cluster and parent class, states the intended change, and implements an executable subclass. Successful and unsuccessful proposals remain available for later inspection.

We execute the candidate \(H^{\prime}\) on \(\mathcal{D}_{c}\) with the fixed model \(M\). Let \(S_{c}(H^{\prime})\) denote its cluster score and \(S_{c}^{\mathrm{current}}\) the stored score under current harness assignments. The candidate's source parent need not be \(H_{c}\). Evaluation runs directly on the target cluster without routing, avoiding rerunning the full discovery set for every candidate.

We accept \(H^{\prime}\) when \(S_{c}(H^{\prime})>S_{c}^{\mathrm{current}}\) and benchmark-specific acceptance checks pass; otherwise, we reject it. These checks consider task-level outcomes and execution feedback, with a judging agent for ambiguous cases where configured. Accepted classes enter \(\mathcal{T}_{H}\) and can become the cluster's selected harness \(H_{c}\). All outcomes guide later revisions and lesson updates. Improvement is required on the target cluster, not all tasks. A parent remains reusable through inheritance and, if active, can still be selected separately from its specialized children.

Repeated rejections lower a cluster's search priority, allowing evolution to explore other task groups. Cluster assignments are also re-examined at each iteration: execution feedback can motivate reassigning tasks or splitting or merging clusters, including when repeated harness revisions fail to improve a group. Algorithm 1 summarizes evolution; Appendix A.4 gives implementation details.

**Algorithm 1: Harness evolution on discovery tasks**

**Input:** \(H_{0}\), fixed \(M\), tasks \(\mathcal{D}_{\mathrm{tr}}\), budget \(T\).

1. Run \(H_{0}\) on \(\mathcal{D}_{\mathrm{tr}}\); store execution records.
2. Cluster tasks from these records into \(\{\mathcal{D}_{c}\}\).
3. Initialize \(\mathcal{T}_{H}\) and \(H_{c}\leftarrow H_{0}\).
4. For \(i=1,\ldots,T\):
   - Review clusters; adjust task assignments if needed.
   - \(\pi\) chooses a cluster \(c\) and parent in \(\mathcal{T}_{H}\).
   - Build subclass \(H^{\prime}\); override or add methods.
   - Run \(H^{\prime}\) on \(\mathcal{D}_{c}\); collect scores and feedback.
   - Compare task outcomes; apply acceptance checks.
   - Retain accepted \(H^{\prime}\); update \(H_{c}\) if preferred.
   - Update cluster priority from acceptance history.
   - Store outcomes; distill enabled lessons.

**Output:** Freeze \(\mathcal{T}_{H}\), \(\{H_{c}\}\), records, and lessons.

### 3.5 Test-time selection and execution


For a new task \(t\), the harness router observes the base trajectory \(\omega(t)\) and selects

\[H^{\star}=\rho\bigl(t,\omega(t),\{H_{0}\}\cup\{H_{c}\}_{c\in\mathcal{C}},\mathcal{L}_{\rho}\bigr).\]

It uses class descriptions, applicability conditions, and frozen routing lessons. If \(H^{\star}=H_{0}\), we reuse the base result. Otherwise, we execute one instance of \(H^{\star}\) with its inherited and specialized behavior. The hierarchy and stored evidence remain fixed across all held-out tasks. Grader feedback supports evolution on training tasks only. At test time, grader scores, verdicts, and hidden reference answers are unavailable to the router or executor.

## 4 Experiments

### 4.1 Evaluation setup

#### Benchmarks and metrics


We evaluate on AutomationBench [^20] for business workflows (300 discovery and 300 held-out tasks), Workspace-Bench [^21] for work across files and applications (288 discovery and 100 held-out tasks, Lite-100), and Toolathlon-GYM [^30] for multi-tool task completion (251 discovery and 252 held-out tasks). AutomationBench and Toolathlon-GYM use deterministic graders to assess task completion; Workspace-Bench evaluates outputs against task-specific rubrics.

We report Mean and strict task success (PASS) for all three benchmarks. Mean denotes mean partial credit on AutomationBench, micro-averaged rubric pass rate on Workspace-Bench, and mean reward on Toolathlon-GYM. PASS requires reward at least \(0.999\) on AutomationBench and Toolathlon-GYM, or all rubrics satisfied on Workspace-Bench. The primary metric is Mean for AutomationBench and Workspace-Bench, and PASS for Toolathlon-GYM. All scores are reported as percentages.

#### Comparators


We compare with the unevolved base harness; global harness optimization using Meta-Harness [^9] and Agentic Harness Engineering (AHE; [^11]); and specialized harnesses using Adaptive Auto-Harness (AAH; [^14]). Our AHE adaptation iteratively edits a global harness from a framework-only bundle. Since OO-Harness uses a base trajectory for routing, we also compare with test-time scaling of the base harness to assess gains from additional inference. Inspired by [^23], we evaluate parallel best-of-\(K\) selection (\(K\in\{2,5\}\)) and sequential self-refinement (\(K=2\); [^16]). Both methods use observable trajectories without grader feedback.

#### Evaluation and reporting


All methods use the same gemini-3.5-flash executor and follow each benchmark's native execution protocol. We fix the evolution agent to Claude Opus 4.8 across harness optimization methods for up to 40 iterations and use the same model for test-time trajectory selection or guidance where required. The OO-Harness harness router uses Claude Sonnet 5 (Appendix A.4.2). Harnesses and lessons remain frozen during held-out evaluation, and grader outputs are used only for final scoring (§3.5). For the main comparison, we perform three independent executor runs per method and benchmark and report mean \(\pm\) standard deviation. *Steps* is the mean number of steps in the finally selected trajectory, excluding other rollouts and auxiliary selection calls.

### 4.2 Main results


Table 1: Held-out results with a frozen executor. *Mean*: mean partial credit on AutomationBench, micro-averaged rubric pass rate on Workspace-Bench, and mean reward on Toolathlon-GYM. *PASS*: strict task success (reward \(\geq 0.999\) on AutomationBench and Toolathlon-GYM; all rubrics satisfied on Workspace-Bench). The primary metric is Mean for AutomationBench and Workspace-Bench, and PASS for Toolathlon-GYM. *Steps* counts only the finally selected trajectory, excluding other rollouts and auxiliary selection calls. Values are mean \(\pm\) standard deviation over three runs; scores are percentages. Bold marks each column's maximum score (\(\uparrow\)) or minimum steps (\(\downarrow\)). †: supervised harness evolution with discovery-task feedback. ‡: unsupervised test-time scaling of the base harness. Held-out grader feedback is unavailable to all methods.

#### AutomationBench results


| Method | Mean ↑ | PASS ↑ | Steps ↓ |
| --- | --- | --- | --- |
| base | 61.62 ± 0.15 | 25.44 ± 0.51 | 31.27 ± 0.13 |
| **Test-time scaling** |  |  |  |
| Parallel (\(K{=}2\)) ‡ | 61.46 ± 2.38 | 24.67 ± 2.83 | 31.64 ± 0.23 |
| Parallel (\(K{=}5\)) ‡ | 60.24 ± 1.07 | 24.00 ± 0.47 | 31.29 ± 0.05 |
| Sequential (\(K{=}2\)) ‡ | 59.29 ± 0.25 | 25.00 ± 1.41 | 31.86 ± 0.12 |
| **Global harness optimization** |  |  |  |
| Meta-Harness † | 63.92 ± 0.89 | 26.33 ± 1.33 | 30.05 ± 0.03 |
| AHE † | 64.18 ± 0.91 | 28.11 ± 1.84 | 30.61 ± 0.18 |
| **Specialized harness families** |  |  |  |
| AAH † | 75.40 ± 1.26 | 34.31 ± 1.19 | 28.89 ± 0.03 |
| OO-Harness † | **77.41** ± 1.37 | **37.22** ± 2.14 | **27.99** ± 0.02 |

#### Workspace-Bench results


| Method | Mean ↑ | PASS ↑ | Steps ↓ |
| --- | --- | --- | --- |
| base | 25.45 ± 2.98 | 3.67 ± 0.58 | 34.41 ± 1.34 |
| **Test-time scaling** |  |  |  |
| Parallel (\(K{=}2\)) ‡ | 32.54 ± 4.30 | 5.67 ± 1.15 | 41.62 ± 2.56 |
| Parallel (\(K{=}5\)) ‡ | 37.71 ± 0.45 | 7.67 ± 0.58 | 48.63 ± 1.92 |
| Sequential (\(K{=}2\)) ‡ | 27.93 ± 2.13 | 3.33 ± 2.52 | 32.91 ± 2.07 |
| **Global harness optimization** |  |  |  |
| Meta-Harness † | 29.56 ± 1.23 | 5.54 ± 1.23 | 35.23 ± 1.44 |
| AHE † | 38.43 ± 4.32 | 7.78 ± 0.87 | 34.59 ± 1.21 |
| **Specialized harness families** |  |  |  |
| AAH † | 38.62 ± 2.98 | 8.00 ± 0.82 | 33.58 ± 2.48 |
| OO-Harness † | **39.48** ± 3.21 | **8.33** ± 2.52 | **32.78** ± 1.97 |

#### Toolathlon-GYM results


| Method | Mean ↑ | PASS ↑ | Steps ↓ |
| --- | --- | --- | --- |
| base | 71.87 ± 0.65 | 31.15 ± 0.28 | 40.50 ± 0.99 |
| **Test-time scaling** |  |  |  |
| Parallel (\(K{=}2\)) ‡ | 74.85 ± 1.45 | 31.55 ± 1.96 | 39.94 ± 0.32 |
| Parallel (\(K{=}5\)) ‡ | 75.69 ± 0.79 | 32.14 ± 0.56 | 38.90 ± 0.00 |
| Sequential (\(K{=}2\)) ‡ | 73.53 ± 1.67 | 33.33 ± 2.81 | 40.97 ± 1.32 |
| **Global harness optimization** |  |  |  |
| Meta-Harness † | 75.84 ± 0.76 | 33.45 ± 1.23 | 39.85 ± 1.03 |
| AHE † | 74.48 ± 1.23 | 36.23 ± 1.19 | 41.02 ± 0.89 |
| **Specialized harness families** |  |  |  |
| AAH † | 74.99 ± 1.63 | 34.32 ± 1.47 | 41.23 ± 0.88 |
| OO-Harness † | **77.18** ± 1.15 | **37.45** ± 0.98 | **37.25** ± 0.38 |

#### Strong empirical results


OO-Harness achieves the highest primary score on all three benchmarks (Table 1), outperforming prior global harness optimization approaches and AAH's specialized harnesses. These results support the expressiveness of object-oriented programming as a natural fit for code-based harness evolution: inheritance shares useful behavior, while method overrides and additions specialize it for different tasks. On AutomationBench, OO-Harness also has the lowest mean trajectory step count among all compared methods. Table 1 also shows that test-time scaling with parallel best-of-\(K\) selection (\(K\in\{2,5\}\)) and sequential self-refinement (\(K=2\)) does not consistently improve performance. Additional inference alone therefore does not guarantee gains, highlighting the value of learning task-appropriate harnesses through our training pipeline.

#### Global versus hierarchical approaches


We compare more closely with Meta-Harness, a prominent prior approach to global harness optimization. During training, Meta-Harness evolves one global harness, whereas OO-Harness builds a hierarchy of specialized harnesses through cluster-specific evolution. Both freeze code before testing; Meta-Harness applies one harness to every task, while OO-Harness selects from its learned hierarchy. Figure 4 highlights three advantages of OO-Harness: training progress, with larger early gains in the averaged discovery curve (a); training efficiency, with shorter recorded search duration (b); and generalization performance, with higher held-out scores (c). Evaluating revisions on target clusters instead of rerunning the full discovery set can reduce API calls and associated cost per candidate. These results motivate hierarchical, adaptive harness optimization for heterogeneous tasks.

Figure 4: Global versus hierarchical harness optimization

Figure 4: Global versus hierarchical harness optimization. Compared with Meta-Harness, OO-Harness shows (a) larger early training gains, (b) shorter recorded search time, and (c) higher held-out scores. Curves align runs by their fraction of recorded updates.

## 5 Analysis


In this section, we aim to understand the effectiveness of OO-Harness through ablations of (1) task- and execution-informed harness routing (§5.1.1) and (2) hierarchical harness optimization through inheritance (§5.1.2). These comparisons assess the roles of execution evidence and hierarchical code reuse. We then conduct detailed case studies of base-harness reuse, learned task clusters, and concrete harness changes to relate execution needs to code and routing decisions (§5.2). Finally, we construct an out-of-distribution (OOD) setting with disjoint training and test application families, and examine Base reuse on the selected test tasks (§5.3).

### 5.1 Ablation studies

#### 5.1.1 Harness routing


We compare two routers with the same frozen harness catalogue, executor, grader, and held-out split. The *task-only* router uses task descriptions and metadata, requiring self-reported applicability confidence of at least \(0.7\) to select a specialist. The trajectory-based router also observes the base execution. Neither receives held-out grader feedback. Appendix A.6.1 details the task-only prompt setup.

| Benchmark / metric | Base | OO-Harness: task only | OO-Harness: task + trajectory |
| --- | --- | --- | --- |
| Automation / Mean | 61.30 | 64.88 | **77.52** |
| Workspace / Mean | 24.57 | 40.03 | **40.56** |
| Toolathlon / PASS | 31.35 | 33.33 | **37.70** |

Table 2: Routing ablation on a frozen OO-Harness catalogue. *Task only* uses the task description and available task metadata; *Task + trajectory* also observes the base execution. *Base* executes without routing. Entries report primary scores (%) from single ablation runs, distinct from the repeated runs in Table 1.

Table 2 shows that the value of execution evidence depends on the workload. Compared with task-only routing, trajectory-based routing improves AutomationBench mean partial credit by \(12.64\) points and Toolathlon-GYM PASS by \(4.37\) points. The gap on Workspace-Bench is only \(0.53\) points. To understand why these gains differ, we further inspect the learned task clusters and the harness changes developed for them. This inspection suggests that the information needed for routing depends on how the evolution agent groups tasks and specializes harnesses to address their shared execution needs. On Workspace-Bench, the learned cluster labels align with task types such as document writing and spreadsheet editing (Figure 6b), making the requested output a useful cue for harness selection. On AutomationBench and Toolathlon-GYM, some harnesses address execution issues shared across domains or apps, such as leaving required writes incomplete or failing to finalize within the tool-call budget. The base trajectory helps reveal whether these issues occurred, allowing the router to select a harness designed to address them. Appendix Figures 8 and 9 illustrate document-writing and completion-check changes.

#### 5.1.2 Hierarchical evolution structure


One central design choice of OO-Harness is evolution via inheritance. We examine its contribution on Workspace-Bench with three ways of learning harnesses. The routing procedure, executor, task splits, and nominal search budget are the same across variants; only how harness code is learned changes. OO extends earlier harnesses through subclasses. Flat copies previously evolved code into a class derived directly from the base, without inheriting from a specialized harness. Base-reset starts from the base and adds new changes without carrying forward previously evolved code. Each variant conducts a separate search and is evaluated once on Lite-100.

Figure 5: Inheritance ablation on Workspace-Bench

Figure 5: Inheritance ablation on Workspace-Bench. We find that learning through inheritance outperforms Flat and Base-reset.

OO achieves the highest micro rubric pass of \(40.56\%\), exceeding Flat by \(4.96\) points (Figure 5). Flat also improves over Base-reset, supporting the value of reusing useful code across revisions. Since Flat also carries forward evolved code, its gap to OO suggests a benefit from organizing revisions through inheritance. Each variant evolves separately, so these results compare the harnesses learned by each search strategy.

### 5.2 Case studies

#### Reusing the base harness


In OO-Harness, a task is rerun with an evolved specialized harness only when the router selects one; otherwise, the Base result is reused. In this case study, we examine one AutomationBench run with 300 tasks, of which 134 (\(44.7\%\)) reuse Base and 166 select specialized harnesses. Table 3 compares the original Base performance of these two groups, before any specialized execution. Tasks sent to specialists have lower Base mean reward (\(44.40\%\)) than those selected for Base reuse (\(77.15\%\)); strict PASS follows the same pattern. These results suggest that routing directs specialization toward tasks with weaker Base executions, while preserving stronger Base results through reuse. Routing lessons guide this choice by linking observed execution problems to suitable harnesses (Figure 6c).

| Routing destination | Tasks | Base mean reward (%) | Base strict PASS (%) |
| --- | --- | --- | --- |
| Reuse Base | 134 | 77.15 | 36.57 |
| Specialized harness | 166 | 44.40 | 14.25 |

Table 3: Base performance by routing destination on AutomationBench. We find that tasks routed to specialized harnesses have substantially weaker Base performance on average, while OO-Harness preserves stronger Base executions through reuse.

Figure 6: Learned clusters and an example router lesson

Figure 6: Learned clusters and an example router lesson. Panels (a,b) compare learned clusters (rows) with domains or task types (columns); cells count shared discovery tasks. AutomationBench clusters largely reflect execution needs, while Workspace-Bench clusters largely follow task types. Panel (c) schematically shows how repeated query-parsing errors in a Base trajectory match a saved routing lesson, leading to selection of an API error-normalizer harness. Blank cells are zero; Workspace-Bench column IDs match the numbered rows.

#### How task clusters reflect execution needs


The evolution agent can create and revise task clusters from discovery executions, without a fixed domain or task-type taxonomy. Figure 6 contrasts two learned organizations. On AutomationBench, clusters capture failures and corrective needs visible in trajectories: commit-gate targets missing writes, while compute-verify groups tasks requiring arithmetic or time-based derivations across five business domains. On Workspace-Bench, all six learned cluster labels align with the evaluated AAH task-type groups, including document writing and spreadsheet editing. Tasks requesting the same output format often share backend requirements, so task-type clusters can emerge naturally from execution evidence. The evolution agent can thus group tasks by a shared failure or by a shared capability, depending on the workload.

Routing lessons connect execution problems to harness capabilities. In Figure 6c, the router matches repeated query-parsing errors to a saved lesson and selects an API error-normalizer that provides query-repair instructions. Appendix Table 4 shows lessons that select a resource-manifest harness or preserve a clean Base execution.

#### Concrete harness changes


Inheritance supports both shared behavior and targeted specialization. On AutomationBench, the discovery-setup lineage extends a missing-write completion check with a near-budget reminder and tool-error guidance (Appendix Figure 9). Each node is a complete executable harness. A parent supplies shared behavior and, if active, can serve tasks that do not need a descendant's additional changes. A document-backend specialization on Workspace-Bench appears in Appendix Figure 8.

### 5.3 Base harness reuse in OOD settings


To examine behavior in extreme OOD scenarios, we construct a setting with 254 Toolathlon-GYM training tasks and 49 Toolathlon test tasks [^10]. Their named application families are disjoint, making the test set largely out of distribution relative to the training set (Appendix A.7). We evolve harnesses on this training split and compare OO-Harness against Meta-Harness. At test time, Meta-Harness applies its learned global harness, whereas the OO-Harness router selects the general Base harness for every test task. As Figure 7 shows, reusing Base preserves its performance, while applying the Meta-Harness harness yields a lower PASS rate. Keeping Base as a routing option allows OO-Harness to handle unfamiliar tasks without requiring them to use a specialization learned on different application families.

Figure 7: Base reuse on the selected OOD test tasks

Figure 7: Base reuse on the selected OOD test tasks. After evolution on the disjoint training split, OO-Harness reuses Base on every test task, preserving its performance, while applying the learned Meta-Harness harness reduces PASS.

## 6 Conclusion


OO-Harness evolves specialized harnesses through inheritance and routes tasks using execution evidence. Task clusters capture shared execution needs, and inheritance allows specialized harnesses to share useful code. OO-Harness achieves the best performance among baselines. Ablations support inheritance and trajectory-informed routing, while case studies illustrate the effectiveness of specialization and Base reuse.

## Limitations


OO-Harness relies on the APIs and execution environment provided by its host. Service outages and rate limits can affect reliability, while interface changes may require updates to evolved harnesses. Integrating private or authenticated services also requires secure credential handling and permission configuration. These dependencies motivate further work on robust API integration and deployment across environments.

## Appendix A Implementation and evaluation details


The implementations share the problem setting described in §3, with benchmark-specific settings described below.

### A.1 Model configuration


For the main comparison across all three benchmarks, we use Anthropic's Claude Opus 4.8 for evolution across harness-optimization methods [^2]. We use Google's gemini-3.5-flash as the fixed executor [^4] for all methods. Execution follows each benchmark's native protocol, including its agent scaffold, tool environment, execution limits, and evaluation procedure. Harness evolution changes the code around the executor while keeping its model weights fixed.

### A.2 Common training configuration


We configure a budget of up to 40 evolution iterations for each harness-optimization method on each benchmark, which we found sufficient for harness search across the evaluated methods. Candidate evaluation and selection use only discovery tasks. The resulting harnesses are frozen before held-out evaluation.

### A.3 Benchmark implementations


We retain each benchmark's native task environment and evaluation procedure. Task counts, discovery/held-out splits, and primary metrics are given in §4.1.

#### AutomationBench implementation


Tasks execute business workflows in a simulated application environment. The agent uses API search and request tools to inspect and modify an initialized world state. We retain the native execution loop and tools. Deterministic assertions evaluate the final state, yielding partial-credit scores and strict task-completion verdicts.

#### Workspace-Bench implementation


Tasks operate on files in a task workspace and require outputs such as documents, spreadsheets, presentations, and code artifacts. We use the DeepAgents scaffold with a local shell and filesystem backend. The benchmark's agent-as-a-judge pipeline evaluates task-specific rubrics over the resulting outputs. We report micro-averaged rubric pass and full-task pass, which requires satisfying every rubric for a task.

#### Toolathlon-GYM implementation


Tasks combine tools and application services exposed through configured MCP servers. The native runner initializes each task's workspace and service connections, then executes the agent through the benchmark's containerized evaluation pipeline. Task-specific graders assess completion and produce the evaluation records used to compute mean reward and strict PASS.

### A.4 OO-Harness implementation


This section describes the code workspace, prompts, and harness interface used to implement OO-Harness (§3).

#### A.4.1 Evolution workspace and code authoring


We run the evolution agent as a coding agent with filesystem access to harness interfaces, existing source code, task clusters, discovery trajectories, evaluation feedback, and prior reflections. It can search and read these files, delegate evidence inspection to subagents, and write executable candidate subclasses at designated paths. AutomationBench and Workspace-Bench also support shared helper modules. The resulting code is loaded, validated, and evaluated by the evolution procedure.

The Workspace-Bench authoring interface exposes file-reading, search, writing, editing, and subagent tools. Its harness interface separately supports tools, middleware, file backends, and subagent configurations. For example, the `subagents()` method supplies subagents used during benchmark task execution, while the evolution agent's subagents inspect training evidence. The available modifications are determined by each benchmark's harness interface.

#### A.4.2 Evolution and routing prompts

##### Evolution prompt


The evolution agent receives the harness interface, current hierarchy, target cluster or available clusters, and paths to discovery-task trajectories, evaluation feedback, and prior reflections. A condensed prompt is:

```text
Read the training trajectories and prior changes.
Use subagents to inspect the execution evidence.
Identify one shared, harness-fixable mechanism.
Write one subclass of the selected parent; call
super() to preserve the inherited behavior.
Do not hardcode task IDs, answers, or filenames.
Return a JSON manifest describing the change.
```


AutomationBench and Workspace-Bench bind the parent as `_Parent`; Toolathlon uses `_Base`. AutomationBench allows add, merge, and split proposals and lets the teacher choose a cluster; Workspace-Bench supplies a target cluster and parent. Toolathlon also provides its design principles and requires an observable applicability gate. Supplied lesson text is capped at 6,000 characters in all three implementations. The default proposal timeout is 2,400 seconds, separate from the executor rollout budget. A representative manifest is:

```json
{"op": "add", "cluster": "<training cluster>",
 "parent": "<existing node or base>",
 "name": "<candidate name>",
 "seam": "<modified interface>",
 "hypothesis": "<shared failure and mechanism>"}
```


Toolathlon adds gate; Workspace-Bench adds changes and names the seam as `system_prompt`, tools, middleware, subagents, or backend. Merge and split proposals identify the affected clusters or an observable split criterion. The template files give the exact benchmark-specific schemas; the evolution procedure validates candidates and determines acceptance from training evaluations.

##### Routing prompt


The router receives the task, an observable Base-execution summary, and a frozen harness catalogue, together with routing lessons where supplied. We use Claude Sonnet 5 for routing in the main comparison. The condensed AutomationBench prompt below illustrates the selection instruction:

```text
Choose one available harness or base using
only the Base query, observable trajectory,
and retrieved training context.
Choose base when no mechanism clearly fits
or a learned anti-pattern applies.
AVAILABLE HARNESSES: <frozen catalogue>
RETRIEVED CONTEXT: <retrieval response>
BASE QUERY + DIGEST: <observable evidence>
Return only JSON with choice, rule, and why.
```


Held-out grades and reference answers are excluded from the routing input.

##### Inputs supplied to the router


We summarize each benchmark's task metadata and observable Base execution as a compact prompt record. These records provide cues for matching a task to a learned cluster, such as the tools involved, encountered errors, and required output format.

AutomationBench supplies the task query and a bounded digest of Base tool calls and results, including write counts and execution-error patterns. A first prompt retrieves relevant frozen routing rules; a second prompt selects one available harness. The final response has the following schema:

```json
{"choice": "<harness-id|base>",
 "rule": "<rule-id or empty>",
 "why": "<one sentence>"}
```


For Toolathlon, each record contains the task identifier, tool families, number of recorded history events, frequent tool or event types, and execution-error categories. These fields summarize the tool environment, interaction history, and errors observed during Base execution.

For Workspace-Bench, each record contains benchmark-provided task metadata: persona and difficulty labels, requested output-file extensions, and the number of links in the file-dependency graph. It also includes Base assistant-turn and tool-call counts. Output types and file dependencies describe the requested artifact and workspace, while the execution counts summarize Base's activity. The router can therefore match both task requirements and execution patterns to the learned cluster descriptions.

Both routers receive the frozen cluster menu alongside these records; Toolathlon also receives frozen routing lessons. They return one assignment per task:

```json
{"task_to_cluster": {
  "<task-id>": "<cluster-id|leave-on-base>"
}}
```

##### Router invocation


The router is called with agent tools disabled and receives only the prepared task records and frozen routing context.

##### Router settings


The following code defaults specify limits on prompt length, batch sizes, model choices, and call timeouts. In the AutomationBench reference router, the query is limited to 600 characters and the digest processes at most 60 observable message entries; the final digest is capped at 5,000 characters. Each compact routing lesson contributes at most 180 characters of lesson text and each available-harness description at most 120 characters. Retrieval requests a synthesis of at most ten lines. Defaults are Sonnet 5 for retrieval and Opus 4.8 for selection, with 400- and 1,200-second timeouts respectively. Toolathlon defaults to batches of 25 tasks, up to twelve frozen routing rules capped at 4,000 characters in total, and a 1,800-second call timeout. Workspace-Bench supplies the requested cohort's feature table in one call, with a 1,200-second timeout. Its metadata fallback uses dependency counts and output extensions; Toolathlon's invalid-menu fallback selects leave-on-base. Both allow router-model overrides, otherwise using the proposer model (default Opus 4.8). The case study in Table 3 uses Opus 4.8 for both retrieval and selection.

#### A.4.3 Inheritance example


Listing 1 illustrates how a specialized harness retains an earlier capability while adding a new one. In this saved Toolathlon lineage, parent s7 detects formula-like writes to `.xlsx` workbooks and adds a reminder to save computed values rather than unevaluated formula strings. Child s30 inherits this guidance and adds a check of percentage-labelled cells in saved workbooks before finishing. The check can request one correction pass on the identified cells; Appendix B.3 details its trigger and unit convention.

The child does not redefine `manage_context`, so the parent's context rule remains active. Its `verify_before_finish` method calls `super()` to preserve inherited completion checks before applying its own. The selected child combines these capabilities in one execution. This illustrates incremental specialization: evolution can add a targeted behavior while reusing an earlier mechanism without copying its code.

Listing 1: Inherited context guidance with an added completion check (Toolathlon s7 \(\rightarrow\) s30). Display names and helper calls are shortened; the method names match the implementation.

```python
class FormulaLiteralHarness(BaseHarness):
  def manage_context(self, messages, state):
    messages = super().manage_context(messages, state)
    return pin_literals_if_needed(messages, state)

class PercentCheckHarness(FormulaLiteralHarness):
  # Inherits manage_context from its parent.
  def verify_before_finish(self, messages, state):
    parent = super().verify_before_finish(messages, state)
    if parent:
      return parent
    return check_saved_percent_values(messages, state)
```

### A.5 Baseline method implementations


All baselines use the task splits and fixed executor in §4.1. Harness optimization uses discovery-task feedback; test-time trajectory selection and refinement use observable execution records without grader feedback.

#### Base


Base uses the unevolved benchmark-specific harness, including its prompts, tools, and execution loop. It performs no harness optimization or selection among specialized harnesses.

#### Meta-Harness


Meta-Harness [^9] ([repository](https://github.com/stanford-iris-lab/meta-harness)) searches for one global harness using discovery-task evaluations. The evolution agent inspects earlier candidates and execution feedback, proposes revised harness code, and evaluates the resulting program. We freeze the selected global harness and apply it to every held-out task.

#### AHE


AHE [^11] ([repository](https://github.com/china-qijizhifeng/agentic-harness-engineering)) begins with framework-source exploration and maintains an editable workspace of framework components. A debugger analyzes discovery trajectories; the evolution agent uses these reports and the change history to revise components, retain useful changes, or roll back unsuccessful edits. The selected global snapshot is frozen for held-out evaluation.

#### AAH


AAH [^14] ([repository](https://github.com/A-EVO-Lab/a-evolve/tree/release/adaptive-auto-harness)) organizes tasks into groups using task descriptions and metadata, and improves a separate harness for each group. In our benchmark setup, AutomationBench groups correspond to business domains; Workspace-Bench groups use output type and workspace requirements; and Toolathlon-GYM groups follow application families. Each specialist is revised as a separate harness implementation. At deployment, task descriptions or metadata determine which frozen specialist to use, with Base used when no specialist is available.

#### Parallel sampling


For \(K=2\) and \(K=5\), we obtain independent Base executions of the same task. A Claude Opus 4.8 selector compares their observable trajectories and chooses one result. Neither reference answers nor grader feedback is available to the selector.

#### Sequential refinement


For \(K=2\), Claude Opus 4.8 summarizes process errors visible in the first Base execution. These task-local notes guide a second Base execution, without access to held-out grader feedback or reference answers.

### A.6 Ablation settings


These experiments isolate the roles of routing evidence and inheritance in OO-Harness (§5.1).

#### A.6.1 Harness routing


The routing ablation keeps the harness catalogue, executor, grader, and held-out split fixed, varying only the routing input (Table 2). Task-only routing uses task descriptions and metadata; trajectory-based routing also observes the Base execution. The task-only prompt setups are given below.

##### Confidence gate


The router is asked for a specialist identifier and applicability confidence \(c\in[0,1]\). For a valid identifier and numeric confidence, the routing procedure selects the specialist when \(c\geq 0.7\), otherwise Base. Confidence is self-reported, not a calibrated success probability or a grader score.

##### AutomationBench task-only routing


The prompt includes specialist identifiers with mechanisms truncated to 130 characters, and task identifiers, domains, and user triggers (up to 300 characters each), in batches of 25 tasks:

```text
Route each task to ONE specialist (or base)
using ONLY the task description/trigger.
You have no execution trace, tool output,
or score. Each specialist fixes a specific
failure mode of the base agent.

SPECIALISTS (id | mechanism): <catalogue>
TASKS (id | domain | trigger): <task batch>

Pick a specialist only when the description
clearly fits it; otherwise choose base.
Return a confidence in [0,1]. Output only JSON:
{"<task-id>": {"cluster": "<id-or-base>",
               "confidence": <0..1>}, ...}
```


Missing entries or unknown identifiers select Base; missing confidence defaults to zero.

##### Workspace-Bench task-only routing


Catalogue entries contain cluster identifiers, routing signatures, and addressed failures. Each task supplies its identifier, persona, difficulty, output-file extensions, dependency-edge count, tested capabilities (up to 80 characters), and task text (up to 500 characters). Batches default to 25 tasks:

```text
Assign each new task to ONE cluster in the
fixed catalogue whose description best
matches it, using only the task description
and metadata. No execution trace, score,
or grader feedback is provided.

CLUSTERS (id | routing signature | failure):
<frozen catalogue>
TASKS (description + metadata): <task batch>

If no cluster matches well, or confidence
is below 0.7, choose leave-on-base.
Output only JSON: {"routes": {"<task-id>": {"cluster": "<cluster-id|leave-on-base>", "confidence": <0..1>}, ...}}
```


Missing or invalid identifiers invoke a task-metadata fallback based on output-file type and dependency count; missing confidence defaults to one.

##### Toolathlon-GYM task-only routing


The following reconstructed template uses task descriptions and declared app/tool metadata with the frozen harness catalogue and the same confidence gate. Catalogue entries describe each specialist's mechanism and applicability conditions:

```text
Route each Toolathlon-GYM task to ONE
specialist in the fixed catalogue or
leave-on-base, using only its description
and declared app/tool metadata. No Base
trajectory, tool output, or grader feedback
is provided.

SPECIALISTS (id | mechanism | applicability):
<frozen catalogue>
TASKS (id | description | apps/tools):
<task batch>

Choose a specialist only when the task
requirements clearly match its capability.
Do not assume that an execution error has
occurred. If no specialist clearly fits or
confidence is below 0.7, choose leave-on-base.
Return each task exactly once. Output only JSON:
{"routes": {"<task-id>": {
  "cluster": "<cluster-id|leave-on-base>",
  "confidence": <0..1>}, ...}}
```

#### A.6.2 Hierarchical structure


This ablation examines how an evolution step builds on previously learned harness code. We compare three separate searches on Workspace-Bench, each learning specialized harnesses for task clusters:

- Base-reset (no code carry-over). Each candidate derives directly from Base. The evolution agent is asked to implement one new mechanism without incorporating mechanisms from earlier evolved nodes. Previous execution evidence and reflections remain available to guide the proposal. Thus, each proposal starts afresh in its code implementation while retaining the search's diagnostic history.
- Flat (copy-based reuse). Each candidate also derives directly from Base. When the target cluster already has a deployed harness, the evolution agent is instructed to read its source, copy all its accepted mechanisms into a new file, and then add one new mechanism. The candidate cannot import, delegate to, or inherit from other evolved nodes. Reuse therefore occurs through code copied into the candidate, whose retained behavior is implemented within the module.
- OO (inheritance). The target cluster's currently deployed harness becomes the candidate's parent; Base is used when the cluster has no specialist. The loader binds this parent class to `_Parent`. Methods that the candidate does not override remain inherited, while an override can call `super()` to compose the parent's behavior with a new change. The evolution agent can inspect prior source, execution evidence, and reflections, then add a specialized behavior without needing to copy the parent's implementation.

##### Shared setup and evaluation


The variants use the same discovery split, initial task clusters, and initial Base execution records. They share the procedures for choosing a target cluster, scoring candidates, accepting revisions, and routing held-out tasks, with the executor and grader fixed. Flat and Base-reset keep the shared helper library read-only during their searches, so candidate changes are written into the new node module.

Each search learns from the 288-task discovery split and freezes its resulting catalogue for one held-out evaluation on Lite-100. The routing procedure is shared, while the learned harnesses and resulting task assignments can differ across searches. Figure 5 reports micro rubric pass for the three resulting systems. Base-reset versus Flat examines carrying forward evolved code; Flat versus OO examines organizing that reuse through inheritance.

### A.7 OOD evaluation configuration


We use application metadata to construct the OOD split in §5.3, retaining 254 Toolathlon-GYM tasks and 49 Toolathlon tasks. We note that the emphasis of Toolathon(-GYM) is on using applications and that different applications could require substantially different skills, tools, or workflows. The curated application distribution is as follows:

- Training applications: Google Workspace (Forms, Calendar, and Sheets), HowToCook, Notion, Snowflake, and WooCommerce.
- Test applications: Amazon, Canvas, Git/GitHub, Kubernetes, literature research (arXiv and Scholarly/Google Scholar), MySQL, 12306, Redis, Yahoo Finance, and YouTube.

As a result, these application families do not overlap and offer a good controlled experiment setting.

### A.8 Artifact sources and resource reporting

#### Sources and terms


The AutomationBench repository distributes Zapier's original contributions under the MIT license, with a separate scope notice for third-party API structures ([AutomationBench license](https://github.com/zapier/AutomationBench/blob/main/LICENSE)). Workspace-Bench's code is MIT-licensed ([Workspace-Bench license](https://github.com/OpenDataBox/Workspace-Bench/blob/main/LICENSE)). Its full-dataset card lists Apache-2.0; the inspected Lite card does not separately specify a license ([full-dataset card](https://huggingface.co/datasets/Workspace-Bench/Workspace-Bench); [Lite dataset card](https://huggingface.co/datasets/Workspace-Bench/Workspace-Bench-Lite)). Toolathlon-GYM's root code license is Apache-2.0 ([Toolathlon-GYM license](https://github.com/eigent-ai/toolathlon_gym/blob/main/LICENSE)). The original Toolathlon repository and task-data card do not specify a standard license ([Toolathlon repository](https://github.com/hkust-nlp/Toolathlon); [Toolathlon dataset card](https://huggingface.co/datasets/hkust-nlp/Toolathlon)). Task files, bundled components, and external services may carry separate terms that also govern redistribution.

#### API access and AI assistance


We access the language models through hosted APIs, using Google Cloud Vertex AI as the backend. AI tools assisted manuscript revision and polishing, code inspection, and figure preparation.

#### Resources


Across all benchmarks and methods, the main computational expense is hosted-model API usage for task execution and, where applicable, harness evolution, routing, and model-based evaluation.

## Appendix B Case studies of specialized harnesses


These cases show how OO-Harness turns execution needs into concrete code changes and routing choices. We examine document generation on Workspace-Bench, shared completion checks and routing lessons on AutomationBench, and targeted runtime checks on Toolathlon-GYM.

### B.1 Workspace-Bench: generating Word documents


Document-writing tasks require both suitable content and a valid output file. Writing plain text to a `.docx` path does not produce a Word document. The office-doc-write harness addresses this problem by wrapping the file backend and rendering supported text into a binary Word document (Figure 8).

The specialized backend handles direct document writes and can also create a missing requested document from a text draft. In the latter case, it preserves the original text write and leaves any existing target document untouched. If rendering fails, execution falls back to the parent backend. This capability handles the file format; the benchmark separately evaluates whether the content satisfies the task.

The requested output format is often visible in the task description, giving the router a useful cue for selecting this capability. This is consistent with the small difference between task-only and trajectory-based routing on Workspace-Bench.

Figure 8: Generating a Word document through the file backend

Figure 8: Generating a Word document through the file backend. For the same illustrative `write_file` call, the base backend saves text under a `.docx` filename; the specialized backend renders the text into a binary document.

### B.2 AutomationBench: inherited checks and routing lessons

#### Adding execution checks through inheritance


Business workflows often require changes to application state, but an execution may finish after searching or reading without making an update. An ancestor (s9) addresses this problem with a completion check: when the task requires a write but no mutating API call has occurred, it can request another turn.

Figure 9 shows successive extensions within the discovery-setup lineage. Building on s9's missing-write completion check, s12 adds a reminder near the turn limit when no write has succeeded. Its child s29 retains both mechanisms and adds guidance for unrecoverable errors and repeated unproductive tool results.

Figure 9: Adding execution checks through inheritance

Figure 9: Adding execution checks through inheritance. Successive nodes add a missing-write completion check, a near-budget reminder, and tool-error guidance. Arrows show inheritance. The filled node s29 is active; s9 and s12 are inactive ancestors that supply inherited behavior.

| Base execution | Routing lesson | Router choice |
| --- | --- | --- |
| A lead-scoring execution makes no writes. HubSpot and Intercom return 401 errors indicating no connected account; a Lead lookup returns 404. The final response is empty. | Repeated connection errors and failed resource lookups suggest that information about connected services and available resources may help. | Resource-manifest harness. |
| Another execution completes three writes, has no errors, and finishes cleanly. | Successful writes and a clean finish support keeping the Base result. | Reuse Base. |

Table 4: Execution evidence behind two routing choices. Examples from an earlier AutomationBench workflow pair observed Base behavior with the applicable routing lesson and the recorded choice.

Figure 10: Learned task clusters on Toolathlon-GYM

Figure 10: Learned task clusters on Toolathlon-GYM. Rows are learned clusters and columns are evaluated AAH app groups. Cells count shared discovery tasks, showing how a cluster can span several applications. Blank cells are zero; Base and unclustered tasks are omitted.

#### Using execution evidence to choose a harness


Routing lessons connect observed execution problems to harness capabilities. For example, a lesson recommends an API error-normalizer when an execution repeatedly encounters query-parsing errors. This harness turns error feedback into instructions for repairing the query (Figure 6c).

Table 4 gives two recorded routing choices. An execution with no writes and repeated service errors is routed to a resource-manifest harness, which supplies connected-service and resource information to guide API exploration. A clean execution with successful writes reuses Base. These examples show how lessons can select a relevant intervention or preserve a clean Base execution.

### B.3 Toolathlon-GYM: refining when and what to check


The learned clusters can span multiple applications (Figure 10). For example, completeness-finalize includes tasks using Canvas, Notion, Snowflake, and WooCommerce. The following examples show how evolution refines a shared behavior and adds a check for a particular output.

#### Refining when to compress tool output


An ancestor of the completeness-finalize harness shortens unusually long tool responses to limit the amount of text in the execution history. Its child retains this behavior but adds an early-finish condition: after an early completion attempt, any subsequent tool outputs bypass compression. This allows the child to narrow when an inherited intervention applies, using progress observed during execution.

#### Checking the saved workbook


The excel-formula-literal harness adds a file check to inherited guidance about writing computed values to spreadsheets (Listing 1). Before finishing, it reads the saved workbook and looks for cells with percentage labels and values strictly between zero and one. It can then request one correction pass, listing the identified cells and proposed values multiplied by 100.

This rule assumes that the task expects percentage points: for example, 20 rather than 0.2 for twenty percent. The instruction asks the executor to change only the listed cells and preserve the rest of the workbook. The harness therefore uses the contents of the produced file to decide whether to request a targeted correction before finishing.

## References


[^1]: L. A. Agrawal, S. Tan, D. Soylu, N. Ziems, R. Khare, K. Opsahl-Ong, A. Singhvi, H. Shandilya, M. J. Ryan, M. Jiang, C. Potts, K. Sen, A. G. Dimakis, I. Stoica, D. Klein, M. Zaharia, and O. Khattab GEPA: reflective prompt evolution can outperform reinforcement learning. arXiv preprint arXiv:2507.19457. Note: Accepted to ICLR 2026 External Links: 2507.19457 Cited by: §2.

[^2]: Anthropic Claude models overview. Note: Provider documentation; accessed October 10, 2026 External Links: [Claude model documentation](https://platform.claude.com/docs/en/models/overview) Cited by: §A.1.

[^3]: P. Furgale, S. Klingler, J. Nolan, M. Staats, G. Di Lorenzo, E. Martinez Abad, C. Schüller, R. Dinu, A. Devoto, P. Berard, G. Kaplun, E. Sarafian, R. Roveri, L. Derczynski, and R. S. Cabral NVIDIA-labs OO Agents: native Python object-oriented agents. arXiv preprint arXiv:2607.20709. External Links: 2607.20709, [arXiv:2607.20709](https://arxiv.org/abs/2607.20709) Cited by: §2.

[^4]: Google Gemini API models. Note: Provider documentation; accessed October 10, 2026 External Links: [Gemini model documentation](https://ai.google.dev/gemini-api/docs/models) Cited by: §A.1.

[^5]: S. Hu, C. Lu, and J. Clune Automated design of agentic systems. arXiv preprint arXiv:2408.08435. External Links: 2408.08435 Cited by: §1.

[^6]: W. Jiang, M. Chu, Y. Tian, Q. Zhang, H. Yang, R. Yang, Y. Liu, T. Lv, and F. Li HarnessEvolve: learning from reference trajectories for reliable agent self-evolution. arXiv preprint arXiv:2609.00829. External Links: 2609.00829 Cited by: §1, §2.

[^7]: S. Karten, J. Zhang, T. Upaa Jr, R. Feng, W. Li, C. Shi, C. Jin, and K. Vodrahalli Continual Harness: online adaptation for self-improving foundation agents. arXiv preprint arXiv:2605.09998. External Links: 2605.09998, [arXiv:2605.09998](https://arxiv.org/abs/2605.09998) Cited by: §1.

[^8]: Z. Ke, V. Patil, H. Shi, Y. Li, Y. Liu, S. Shekkizhar, A. Koul, J. Wang, X. P. Nguyen, S. Yavuz, M. Bansal, and S. Joty EvoHarnessBench: can your agents keep pace with an evolving harness?. arXiv preprint arXiv:2609.04280. External Links: 2609.04280, [arXiv:2609.04280](https://arxiv.org/abs/2609.04280) Cited by: §1, §2.

[^9]: Y. Lee, R. Nair, Q. Zhang, K. Lee, O. Khattab, and C. Finn Meta-Harness: end-to-end optimization of model harnesses. arXiv preprint arXiv:2603.28052. External Links: 2603.28052 Cited by: §A.5, §1, §2, §3.1, §4.1.

[^10]: J. Li, W. Zhao, J. Zhao, W. Zeng, H. Wu, X. Wang, R. Ge, Y. Cao, Y. Huang, W. Liu, J. Liu, Z. Su, Y. Guo, F. Zhou, L. Zhang, J. Michelini, X. Wang, X. Yue, S. Zhou, G. Neubig, and J. He The tool decathlon: benchmarking language agents for diverse, realistic, and long-horizon task execution. External Links: 2510.25726, [arXiv:2510.25726](https://arxiv.org/abs/2510.25726) Cited by: §5.3.

[^11]: J. Lin, S. Liu, C. Pan, L. Lin, S. Dou, Z. Xi, X. Huang, H. Yan, Z. Han, T. Gui, and Y. Jiang Agentic harness engineering: observability-driven automatic evolution of coding-agent harnesses. arXiv preprint arXiv:2604.25850. Cited by: §A.5, §1, §2, §4.1.

[^12]: M. Lin, H. Lu, Z. Shi, B. He, R. Mao, Z. Zhang, Z. Wu, X. Tang, H. Liu, Z. Dai, X. Zhang, S. Wang, B. Dumoulin, and J. Pei Position: agentic evolution is the path to evolving LLMs. arXiv preprint arXiv:2602.00359. External Links: 2602.00359 Cited by: §2.

[^13]: H. Liu, Y. Ming, S. Joty, and C. Zhao Harnessing LLM agents with skill programs. arXiv preprint arXiv:2605.17734. External Links: 2605.17734, [arXiv:2605.17734](https://arxiv.org/abs/2605.17734) Cited by: §2.

[^14]: Z. Liu, Z. Shi, Y. Sang, B. He, M. Lin, T. Wei, D. Wang, B. Dumoulin, W. Jin, and H. Lu Adaptive auto-harness: sustained self-improvement for agentic system deployment on open-ended task streams. arXiv preprint arXiv:2606.01770. External Links: 2606.01770 Cited by: §A.5, §1, §2, §4.1.

[^15]: X. Lou, M. Lázaro-Gredilla, A. Dedieu, C. Wendelken, W. Lehrach, and K. P. Murphy AutoHarness: improving LLM agents by automatically synthesizing a code harness. arXiv preprint arXiv:2603.03329. External Links: 2603.03329, [arXiv:2603.03329](https://arxiv.org/abs/2603.03329) Cited by: §1.

[^16]: A. Madaan, N. Tandon, P. Gupta, S. Hallinan, L. Gao, S. Wiegreffe, U. Alon, N. Dziri, S. Prabhumoye, Y. Yang, S. Gupta, B. P. Majumder, K. Hermann, S. Welleck, A. Yazdanbakhsh, and P. Clark Self-refine: iterative refinement with self-feedback. Advances in Neural Information Processing Systems (NeurIPS). External Links: 2303.17651 Cited by: §4.1.

[^17]: J. Nie, Y. Zhang, Q. Cai, Y. Cheung, X. Tian, and B. Han EvolveNet: collaborative harness evolution for agent self-improvement. arXiv preprint arXiv:2608.04968. External Links: 2608.04968 Cited by: §1, §2.

[^18]: X. Ning, K. Tieu, D. Fu, T. Wei, Z. Li, Y. Bei, J. Zou, M. Ai, Z. Liu, T. Li, L. Chen, Y. Zhao, K. Yang, B. Li, C. Qian, G. Li, X. Lin, Z. Zeng, R. Qiu, S. Chen, Y. Sun, X. Yang, R. Wang, R. Pan, C. Yang, D. Zhang, L. Fang, Z. Cui, Y. Cao, P. Chen, D. Sun, R. Chen, M. Srinivasan, N. Mathur, Y. Xia, H. Li, H. Yan, P. Lu, L. Zhang, T. Zhang, H. Tong, and J. He Code as agent harness. arXiv preprint arXiv:2605.18747. External Links: 2605.18747 Cited by: §1, §3.1.

[^19]: S. Ouyang, J. Yan, I. Hsu, Y. Chen, K. Jiang, Z. Wang, R. Han, L. T. Le, S. Daruki, X. Tang, V. Tirumalashetty, G. Lee, M. Rofouei, H. Lin, J. Han, C. Lee, and T. Pfister ReasoningBank: scaling agent self-evolving with reasoning memory. In The Fourteenth International Conference on Learning Representations, External Links: [OpenReview paper](https://openreview.net/forum?id=jL7fwchScm), 2509.25140 Cited by: §2.

[^20]: D. Shepard and R. Salimans AutomationBench. External Links: 2604.18934, [arXiv:2604.18934](https://arxiv.org/abs/2604.18934) Cited by: §4.1.

[^21]: Z. Tang, X. Zhou, Y. Liu, L. Li, Y. Wu, W. Wang, H. Huang, W. Zhou, J. Zhou, J. Song, S. Yu, J. Wang, Z. Zhou, H. Zhou, Y. Lv, J. Li, J. Liu, R. Chen, C. Liu, G. Li, J. Kang, and F. Wu Workspace-Bench 1.0: benchmarking AI agents on workspace tasks with large-scale file dependencies. External Links: 2605.03596, [arXiv:2605.03596](https://arxiv.org/abs/2605.03596) Cited by: §4.1.

[^22]: B. Vidgen, A. Mann, A. Fennelly, J. W. Stanly, L. Rothman, M. Burstein, J. Benchek, D. Ostrofsky, A. Ravichandran, D. Sur, N. Venugopal, A. Hsia, I. Robinson, C. Huang, O. Varones, D. Khan, M. Haines, A. Bridges, J. Boyle, K. Twist, Z. Richards, C. Mahapatra, B. Foody, and O. Nitski APEX-Agents. arXiv preprint arXiv:2601.14242. External Links: 2601.14242 Cited by: §1.

[^23]: Y. Wang, H. Zhu, Z. Hu, Y. Yuan, Z. Chen, S. Senthil, H. Hajishirzi, Y. Tsvetkov, N. A. Smith, P. Dasigi, and T. Xiao Rethinking the evaluation of harness evolution for agents. arXiv preprint arXiv:2607.12227. Cited by: §3.1, §4.1.

[^24]: Y. Wu, J. Zhang, J. Shi, X. Lei, Q. Gu, Y. Zhang, Z. Wang, C. He, C. Huang, M. Song, Z. Zeng, S. Wang, J. Liu, Y. Shi, J. Liu, S. Yan, W. Huang, G. Zhang, and W. Zhang HarnessDev: can LLMs create and evolve their own agent harness?. arXiv preprint arXiv:2609.01437. External Links: 2609.01437 Cited by: §2.

[^25]: Z. Xi, Y. Ding, W. Chen, B. Hong, H. Guo, J. Wang, D. Yang, C. Liao, X. Guo, W. He, S. Gao, L. Chen, R. Zheng, Y. Zou, T. Gui, Q. Zhang, X. Qiu, X. Huang, Z. Wu, and Y. Jiang AgentGym: evolving large language model-based agents across diverse environments. arXiv preprint arXiv:2406.04151. External Links: 2406.04151 Cited by: §1.

[^26]: J. Yang, C. E. Jimenez, A. Wettig, K. Lieret, S. Yao, K. Narasimhan, and O. Press SWE-agent: agent-computer interfaces enable automated software engineering. Advances in Neural Information Processing Systems (NeurIPS). External Links: 2405.15793 Cited by: §1.

[^27]: A. Zeng, M. Liu, R. Lu, B. Wang, X. Liu, Y. Dong, and J. Tang AgentTuning: enabling generalized agent abilities for LLMs. arXiv preprint arXiv:2310.12823. External Links: 2310.12823 Cited by: §1.

[^28]: Z. Zeng, J. Liu, S. Chen, T. He, Y. Liao, Y. Tian, J. Wang, Z. Wang, Y. Yang, L. Yin, M. Yin, Z. Zhu, T. Cai, Z. Chen, J. Chen, Y. Du, X. Gao, J. Guo, L. Hu, J. Jiao, X. Li, J. Liu, S. Ni, Z. Wen, G. Zhang, K. Zhang, X. Zhou, J. Blanchet, X. Qiu, M. Wang, and W. Huang FutureX: An Advanced Live Benchmark for LLM Agents in Future Prediction. arXiv preprint arXiv:2508.11987. External Links: 2508.11987 Cited by: §1.

[^29]: J. Zhang, S. Hu, C. Lu, R. Lange, and J. Clune Darwin gödel machine: open-ended evolution of self-improving agents. arXiv preprint arXiv:2505.22954. External Links: 2505.22954 Cited by: §1.

[^30]: P. Zhang, W. Bai, W. Fan, and G. Li Toolathlon-GYM: Large-Scale Long-Horizon Environments for Tool-Use Agents. External Links: [Toolathlon-GYM repository](https://github.com/eigent-ai/toolathlon_gym) Cited by: §4.1.
