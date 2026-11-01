---
draft: false
toc: true
title: "Computationalism and a Computational Cognition Curriculum"
description: "A conceptual analysis distinguishing computational models, computationalism, functionalism, and computational ontology, followed by a proposed curriculum for testing accounts of cognition through implemented behavioral models."
linkTitle: "Computationalism"
---

The question is whether intelligence, cognition, and related properties can be understood as manifestations of computation, or as computations themselves.

<a id="xx"></a>

## Computationalism and related positions


The closest general term is **computationalism**, especially the **computational theory of mind/cognition**.

In its stronger form, the claim is literal: cognitive processes such as perception, memory, reasoning, decision-making, and language are computations performed by a physical system such as the brain. The brain changes internal states according to certain rules, and those state transformations constitute cognition. ([Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/archives/sum2026/entries/computational-mind/ "The Computational Theory of Mind (Stanford Encyclopedia of Philosophy/Summer 2026 Edition)"))

Here "computation" is broader than arithmetic calculation. A computation can be thought of abstractly as

\[(s_t,\; \text{input}_t) \rightarrow s_{t+1} \rightarrow \text{output}_t\]

where some system repeatedly transforms its state. A cognitive property can then arise from the organization of those transformations. For example, memory could correspond to information being retained in state \(s_t\); perception to transformations from sensory inputs into internal representations; planning to evaluating possible future state sequences; and intelligence to the overall ability of the system to perform useful transformations, inference, search, learning, and control.

There are several levels of this idea:

- **Computational modeling:** cognition can be _described_ using computations. This is a relatively weak claim; almost nobody needs to claim the mind literally is a computer.
- **Computational theory of cognition / mind:** cognition _is_ computation in a substantive sense. Classical versions treat thought somewhat like symbolic computation: representations are stored and manipulated according to rules. Hilary Putnam and Jerry Fodor are major figures associated with this tradition. ([Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/archives/sum2026/entries/computational-mind/ "The Computational Theory of Mind (Stanford Encyclopedia of Philosophy/Summer 2026 Edition)"))
- **Computational functionalism:** what makes something a belief, memory, decision, etc. is largely the causal/computational role it plays. In principle the same mental organization could therefore be implemented in neurons, silicon, or another suitable physical medium.
- **Neural/connectionist computationalism:** cognition is computation, but the computation consists of distributed numerical state changes in networks rather than explicit symbolic rules. Modern neural-network models naturally fit this family.
- **Pancomputationalism:** goes much further and says that physical processes in general are computations. Under some versions, hurricanes, nervous systems, stars, and computers are all computational systems; cognition is then a particular highly organized type of computation. ([Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/archives/spr2026/entries/computation-physicalsystems/ "Computation in Physical Systems (Stanford Encyclopedia of Philosophy/Spring 2026 Edition)"))
- **Digital physics / computational universe ideas:** the strongest ontological version says that the universe itself is fundamentally computational or informational. Konrad Zuse, Edward Fredkin, Stephen Wolfram, John Wheeler's "it from bit," and some interpretations of quantum information belong near this territory. ([Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/archives/spr2026/entries/computation-physicalsystems/ "Computation in Physical Systems (Stanford Encyclopedia of Philosophy/Spring 2026 Edition)"))

The distinction between **"manifestations through calculations"** and **"calculations themselves"** is important.

One position would say:

\[\text{physical substrate} \rightarrow \text{computation} \rightarrow \text{cognition}\]

Here computation is the mechanism and cognition is a higher-level phenomenon produced by it.

A stronger identity claim says:

\[\text{cognitive process} = \text{particular computational process}\]

So reasoning isn't something _caused by_ a computation in the way heat is caused by combustion; the organized computation itself constitutes the reasoning.

And the strongest metaphysical version says roughly:

\[\text{physical reality} = \text{computation/information}\]

so minds, organisms, and perhaps all other phenomena are patterns within computation.

There is a major unresolved problem here: **what makes a physical process genuinely a computation?** If arbitrary state changes can always be mapped onto some mathematical computation, saying "the brain computes" risks becoming empty because virtually everything would compute something. Modern philosophical work on computationalism spends considerable effort defining physical computation so that the claim has explanatory content. ([Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/archives/spr2026/entries/computation-physicalsystems/ "Computation in Physical Systems (Stanford Encyclopedia of Philosophy/Spring 2026 Edition)"))

If the proposed idea is roughly **"intelligence, cognition, personality, perception, perhaps consciousness are higher-level manifestations of an underlying process of state transformation/calculation"**, the recommended starting points are **computationalism**, **computational functionalism**, and **pancomputationalism**. For the still stronger idea that _everything ultimately consists of computation_, **digital physics / computational ontology** is the closer term.

Consciousness is the difficult boundary case: there are computational theories of consciousness, but the claim that computation by itself is sufficient for subjective experience is much more disputed than the claim that perception, reasoning, learning, or memory are computational.

<a id="curriculum"></a>

## Proposed curriculum


For studying whether cognition and intelligence can be explained as computation, the proposed core curriculum is **computational neuroscience + computational cognitive science**. A solid part-time path is about **9-12 months at 8-10 hours/week**.

### 1. Mathematical foundations -- 4-6 weeks


The mathematical prerequisites support reading and implementing models:

- Linear algebra: vectors, matrices, eigenvalues, PCA/SVD
- Probability: conditional probability, Bayes' rule, distributions
- Statistics: estimation, regression, likelihood, hypothesis testing
- Calculus: derivatives, gradients
- Differential equations
- Basic information theory: entropy, mutual information

Neuromatch uses essentially this prerequisite set: linear algebra, probability, statistics, calculus/differential equations, plus Python. ([CompNeuro](https://compneuro.neuromatch.io/prereqs/ComputationalNeuroscience.html "Prerequisites and preparatory materials for NMA Computational Neuroscience -- Neuromatch Academy: Computational Neuroscience"))

Good books:

- Strang -- _Introduction to Linear Algebra_
- Blitzstein & Hwang -- _Introduction to Probability_
- MacKay -- _Information Theory, Inference, and Learning Algorithms_

Introductory Python can be brief for a learner already comfortable implementing numerical algorithms.

### 2. Basic neuroscience -- 3-4 weeks


The proposed neuroscience foundation covers:

- neurons and action potentials
- synapses
- excitation/inhibition
- neural coding
- sensory systems
- motor systems
- cortical organization
- plasticity
- population activity

Good starting text:

**Bear, Connors & Paradiso -- _Neuroscience: Exploring the Brain_**

Translate biological descriptions into:

\[\text{input} \rightarrow \text{state transformation} \rightarrow \text{output}\]

For example:

\[\text{photons} \rightarrow \text{retinal activity} \rightarrow \text{visual cortex} \rightarrow \text{object representation}\]

### 3. Computational neuroscience -- 8-10 weeks


This should be the first serious core.

The proposed core course is the **Neuromatch Computational Neuroscience curriculum**. In the saved description, it covers:

1. model types
2. model fitting
3. generalized linear models
4. dimensionality reduction
5. deep learning
6. signal processing/time series
7. linear systems
8. biological neuron models
9. dynamical systems
10. Bayesian decisions
11. hidden-state models
12. reinforcement learning
13. network causality

That's a well-developed, code-based curriculum and is freely available. ([Neuromatch Instructor](https://instructor.compneuro.neuromatch.io/tutorials/intro.html "Introduction -- Neuromatch Academy: Computational Neuroscience (instructor's version)"))

[Neuromatch Computational Neuroscience course](https://compneuro.neuromatch.io/)

Alongside it, use:

**Dayan & Abbott -- _Theoretical Neuroscience_**

Concrete computational interpretations include

\[r = f(w^\top x)\]

for neural responses,

\[\dot{x} = F(x,u)\]

for neural dynamics, and

\[P(s\mid x) \propto P(x\mid s)P(s)\]

for perceptual inference.

### 4. Computational cognitive science -- 8 weeks


Now move from neurons to things such as concepts, reasoning, learning and language.

MIT's **Computational Cognitive Science 9.66** is a good established model for this part. Its current curriculum includes Bayesian and hierarchical Bayesian models, graphical models, structured representations, concept learning, categorization, causal reasoning, language acquisition and social inference. ([MIT Course Catalog](https://catalog.mit.edu/schools/science/brain-cognitive-sciences/ "Department of Brain and Cognitive Sciences | MIT Course Catalog"))

[MIT Computational Cognitive Science materials](https://ocw.mit.edu/courses/9-66j-computational-cognitive-science-fall-2004/)

Study:

- Bayesian cognition
- concepts and categories
- causal inference
- probabilistic reasoning
- language acquisition
- representation
- decision-making
- bounded rationality

A central question becomes:

What computation explains the behavioral data?

For example, given observations \(D\), does a person's inference behave approximately like the following?

\[P(H\mid D) = \frac{P(D\mid H)P(H)}{P(D)}\]

### 5. Learning and agency -- 6 weeks


Study reinforcement learning in detail.

Use:

**Sutton & Barto -- _Reinforcement Learning: An Introduction_**

Core ideas:

\[s_t \rightarrow a_t \rightarrow r_t \rightarrow s_{t+1}\]

and prediction error:

\[\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)\]

This area is particularly useful because versions of these quantities can be compared with animal behavior and neural signals.

Study:

- Markov decision processes
- value functions
- temporal-difference learning
- policy learning
- exploration
- model-based vs model-free learning
- reward prediction errors

### 6. Neural networks and representation -- 6 weeks


The proposal studies neural networks specifically as **models of representation and cognition**.

Focus on:

- distributed representations
- representation learning
- recurrent neural networks
- transformers
- attractor networks
- associative memory
- encoding models
- decoding models
- representational similarity analysis

Neuromatch explicitly teaches using neural networks to decode stimuli from recorded neural activity and compare artificial representations with brain representations. ([CompNeuro](https://compneuro.neuromatch.io/tutorials/W1D5_DeepLearning/student/W1D5_Intro.html "Intro -- Neuromatch Academy: Computational Neuroscience"))

The important question here isn't merely whether the network performs the task. Ask:

Does its internal computation resemble the biological system?

### 7. Dynamical-systems view of cognition -- 4-6 weeks


This provides an alternative to thinking of cognition as conventional symbolic algorithms.

A brain can be modeled as

\[\frac{d\mathbf{x}}{dt} = F(\mathbf{x},\mathbf{u},\theta)\]

and cognition becomes trajectories through a high-dimensional state space.

Study:

- fixed points
- attractors
- oscillations
- stability
- bifurcations
- recurrent networks
- population dynamics

Stanford's current _Computational Neuroscience of Cognition_ course explicitly uses this framework for working memory, decision-making, behavioral flexibility and neural population activity. ([Stanford University Bulletin](https://bulletin.stanford.edu/courses/2279421 "NBIO225 Course | Stanford University Bulletin"))

This part matters for the research question because it stretches the meaning of "calculation." Cognition needn't resemble executing Python instructions. The continuous evolution of a dynamical system can itself perform a computation.

### 8. Cognitive architectures -- 3-4 weeks


Study attempts to construct complete computational models of cognition.

Start with:

- ACT-R
- Soar
- Global Workspace architectures
- predictive-processing architectures

With ACT-R, for example, researchers build executable models containing memory, perception, goals and action selection and compare their response times and errors with humans.

The resulting model is:

\[\text{architecture} + \text{memory} + \text{learning rules} + \text{environment} \rightarrow \text{behavior}\]

### 9. Philosophy of computation and mind -- 4-6 weeks


The proposed sequence places a detailed philosophical investigation after the computational work.

Read roughly in this order:

- Alan Turing -- _Computing Machinery and Intelligence_ ([PDF](/sources/e9e815a2347232297524af2b765de4e4.bin))
- David Marr -- introduction to _Vision_
- Hilary Putnam -- functionalism
- Jerry Fodor -- computational theory of mind
- John Searle -- Chinese Room argument
- David Chalmers -- computational implementation / consciousness
- critiques of computationalism and pancomputationalism

Marr's three levels are particularly useful:

\[
\begin{array}{ll}

\text{Computational level:} & \text{What problem is being solved?} \\

\text{Algorithmic level:} & \text{What representation/algorithm solves it?} \\

\text{Implementation level:} & \text{How does the physical system realize it?}

\end{array}
\]

That framework makes the original question more precise.

### 10. Capstone -- about 2 months


Don't finish with reading. Build one computational cognitive model.

For example:

\[\text{sensory observations} \rightarrow \text{belief state} \rightarrow \text{decision} \rightarrow \text{learning}\]

A strong project would be to reproduce a published behavioral experiment.

Take human trial data:

\[D = \{\text{stimulus},\ \text{choice},\ \text{reaction time},\ \text{reward}\}\]

fit several models:

\[
\begin{aligned}

M_1 &= \text{Bayesian learner} \\

M_2 &= \text{reinforcement learner} \\

M_3 &= \text{neural network}

\end{aligned}
\]

and ask which computation best predicts human behavior.

That is where the philosophical idea becomes experimentally meaningful.

The proposed sequence is:

\[
\boxed{

\begin{gathered}

\text{Math} \rightarrow \text{Neuroscience} \rightarrow \text{Computational Neuroscience} \\

\rightarrow \text{Computational Cognition} \rightarrow \text{RL} \rightarrow \text{Neural Representation} \\

\rightarrow \text{Dynamics} \rightarrow \text{Cognitive Architectures} \rightarrow \text{Philosophy}

\end{gathered}

}
\]

The proposed **three-resource core** is **Neuromatch Computational Neuroscience -> MIT Computational Cognitive Science -> Dayan & Abbott**, implementing models throughout. That covers neurons through an operational notion of "cognition as computation" without spending months in abstract philosophy first.

## Library sources


- [Butlin et al. 2023](/sources/77152ec24a9faa18a9649747b7c776f1.bin), *Consciousness in Artificial Intelligence* ([arXiv:2308.08708](https://arxiv.org/abs/2308.08708))
- [Seth and Bayne 2022](/sources/17cf0953e9fb30efde3ac01ec820c105.bin), *Theories of consciousness* ([doi:10.1038/s41583-022-00587-4](https://doi.org/10.1038/s41583-022-00587-4))
- [Thagard 2012](/sources/d692f57ff2ea34885a414e01ad02558f.bin), *Cognitive Architectures*
- [Floridi 2004](/sources/db7064319e5c69bbe78085d8205a5080.bin), *The Blackwell Guide to the Philosophy of Computing and Information* -- on *Computationalism and related positions*

Further reading:

- [Coeckelbergh and Gunkel 2025](/sources/0d153a4277516c4bd067c638f1c75fb2.bin), *Communicative AI: A Critical Introduction to Large Language Models*
- [Binz et al. 2025](/sources/0207741285ce650aba6d4b4eff6e8350.bin), *A foundation model to predict and capture human cognition* ([doi:10.1038/s41586-025-09215-4](https://doi.org/10.1038/s41586-025-09215-4))
- [Christensen et al. 2022](/sources/727cfa273054997f906dba1e9e3f382b.bin), *2022 roadmap on neuromorphic computing and engineering* ([doi:10.1088/2634-4386/ac4a83](https://doi.org/10.1088/2634-4386/ac4a83))
- [Fleming 2020](/sources/8d2c25f86959a22ceddaacca6e9c0c91.bin), *Awareness as inference in a higher-order state space* ([doi:10.1093/nc/niz020](https://doi.org/10.1093/nc/niz020))
- [Kotseruba and Tsotsos 2020](/sources/dbc8fc8d10a0d4d51a43964e61c1482f.bin), *40 years of cognitive architectures* ([doi:10.1007/s10462-018-9646-y](https://doi.org/10.1007/s10462-018-9646-y))
- [Rosenbloom 2026](/sources/5e6885b52d78bbf3ebdd3ffab9476a98.bin), *On Minds: Reflections of a Cognitive Architect*
- [Sandved-Smith et al. 2021](/sources/d6797164b8651f2bb59d8b26e9c8931a.bin), *Towards a computational phenomenology of mental action* ([doi:10.1093/nc/niab018](https://doi.org/10.1093/nc/niab018))
- [Vernon 2014](/sources/cc297b7304fb3c2f85f53200ae4a7a15.bin), *Cognitive System*
- [Vernon 2022](/sources/05cca9881c47a3d320c525ad096490c1.bin), *Cognitive Architectures*
- [Ziemke 2022](/sources/bf0e49a2d28a89a0aa37ddf742e607eb.bin), *Embodiment in Cognitive Science and Robotics*
- [French 2000](/sources/1f9ea75aebfedddb37b732f0366781a9.bin), *The Turing Test: the first 50 years*
- [Silver and Sutton 2025](/sources/bc2821a0d16b5495cadca969371d49a9.bin), *Welcome to the Era of Experience*
