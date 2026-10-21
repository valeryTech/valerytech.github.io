---
draft: false
toc: true
description: "Explain CPython free threading, the GIL, synchronization of shared data, and the differences between threads, processes, isolated interpreters, and asynchronous tasks."
title: "Cpython Free Threading And Concurrency"
linkTitle: "Cpython Free Threading And Concurrency"
---

Original conversation: [Shared ChatGPT thread](https://chatgpt.com/share/6ad808db-6ebc-83e9-879c-e45756ee7384)

Free threading changes where Python code can execute in parallel. Locks, executors, asynchronous tasks, and experimental concurrency models address different concerns above that runtime capability.

Related: [CPython, the JVM, and polymorphism]({{< ref "engineering/langs/python/cpython-jvm-comparison-and-polymorphism" >}}) · [Python data model and native extensions]({{< ref "engineering/langs/python/python-concepts-comparison" >}}).

## Free-threaded execution


**Free-threaded CPython allows Python threads to execute on multiple CPU cores within one interpreter.** It became an experimental build option in Python 3.13 and an officially supported, still optional build in Python 3.14. [1](https://peps.python.org/pep-0779/)

A free-threaded build and a disabled GIL are separate conditions: these builds can run with the GIL enabled, and an incompatible C extension can re-enable it. The normal GIL-enabled build remains a distinct configuration.

**Execution models**

A GIL-enabled interpreter can have multiple operating-system threads, but generally permits only one of them at a time to execute Python bytecode.

For a single interpreter:

| Property | GIL-enabled CPython | Free-threaded CPython with the GIL disabled |
|---|---|---|
| OS threads | Multiple | Multiple |
| Python code runs simultaneously on multiple cores | No, generally | Yes |
| Global interpreter lock | Enabled | Disabled |
| Shared mutable data needs synchronization | Yes | Yes |
| CPU-bound multithreading | Limited by GIL | Can scale across cores |

One nuance: even traditional CPython could achieve parallel execution when native extensions released the GIL, as NumPy often does.

**Interpreter changes**

The GIL historically protected internal interpreter state, including object reference counts and operations involving Python objects.

Removing it required changes throughout CPython, including:

- **Biased and deferred reference counting:** reduce contention when multiple threads access objects.
- **Fine-grained locking:** containers such as lists and dictionaries have internal synchronization.
- **Thread-safe memory management:** changes to memory allocation and object lifetime handling.
- **Updated C extension interfaces:** native modules must explicitly support free threading.

With the GIL disabled, more specific synchronization mechanisms protect interpreter internals. [2](https://docs.python.org/3/howto/free-threading-python.html), [3](https://docs.python.org/3/c-api/threads.html)

**CPU-bound work with a thread pool**

Consider a CPU-intensive workload using `ThreadPoolExecutor`:

```python
from concurrent.futures import ThreadPoolExecutor

def compute(n):
    return sum(i * i for i in range(n))

with ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(compute, [10_000_000] * 4))
```


With the GIL enabled, these pure-Python tasks compete for execution time. With the GIL disabled in a free-threaded build, they can run on separate cores when the machine has sufficient CPU capacity.

That doesn't guarantee a 4× speedup. Thread scheduling, memory contention, and synchronization introduce overhead.

**Choosing an execution mechanism**

- `asyncio` remains useful for managing concurrent I/O.
- `multiprocessing` remains useful for process isolation and parallelism with traditional CPython.
- `threading` can provide CPU parallelism with a free-threaded interpreter.
- Shared mutable state still requires application-level synchronization. Internal container locks do not make a multi-step read-modify-write operation atomic; the GIL did not provide that general guarantee either.

**Checking the running interpreter**

On CPython 3.13 or newer, check both build support and runtime state after importing the extensions the application uses:

```python
import sys
import sysconfig

print("Free-threaded build:",
      sysconfig.get_config_var("Py_GIL_DISABLED") == 1)

print("GIL enabled:", sys._is_gil_enabled())
```


Required state for parallel execution of Python bytecode within one interpreter:

```text
Free-threaded build: True
GIL enabled: False
```


Some third-party C extensions can automatically re-enable the GIL when imported. Free-threaded builds can also use more memory and have some single-thread performance overhead. [4](https://docs.python.org/3.15/howto/free-threading-python.html), [5](https://docs.python.org/3.15/whatsnew/3.15.html)

The relevant specifications are [PEP 703](https://peps.python.org/pep-0703/) (the implementation design) and [PEP 779](https://peps.python.org/pep-0779/) (the move to official support).

## Concurrency abstraction layers


Python already had locks, threads, futures, executors, and asynchronous tasks before free threading. Removing the GIL changes the execution capabilities underneath those APIs; it does not introduce the abstraction layers themselves.

**Comparing the abstraction layers**

| Layer | Java / JVM | Python |
|---|---|---|
| Low-level synchronization | `synchronized`, `Lock`, `volatile` | `threading.Lock`, `RLock`, `Condition`, `Event` |
| Thread management | `Thread`, `ExecutorService` | `threading.Thread`, `ThreadPoolExecutor` |
| Futures and results | `Future`, `CompletableFuture` | `concurrent.futures.Future` |
| Task-based concurrency | Virtual threads, structured concurrency APIs | `asyncio`, `TaskGroup` |
| Parallel data processing | Parallel streams, ForkJoinPool | Process pools, thread pools, NumPy, joblib |
| Distributed computation | Spark, Akka and others | Ray, Dask, Celery |

The libraries have different designs and guarantees, so these are conceptual comparisons rather than direct equivalents.

**Executors: one interface, different isolation models**

Python's `concurrent.futures` already offers an abstraction similar to Java's `ExecutorService`. Python 3.14 added `InterpreterPoolExecutor`, bringing the standard library to three main executors:

| Executor | Execution boundary | CPU parallelism | Data model |
|---|---|---|---|
| `ThreadPoolExecutor` | Threads in one interpreter | Pure Python can run in parallel when the GIL is disabled | Shared Python objects |
| `ProcessPoolExecutor` | Separate processes | Available with ordinary CPython builds | Data usually transferred through serialization |
| `InterpreterPoolExecutor` | Threads running separate interpreters in one process | Available even in a normal GIL-enabled build; each interpreter has its own GIL | Isolated runtime state; ordinary mutable Python objects cannot be shared directly |

All three expose the `Executor` interface, but task submission, data transfer, and shared-state assumptions differ. [6](https://docs.python.org/3/library/concurrent.futures.html), [7](https://docs.python.org/3/library/concurrent.html)

**Structured concurrency and asyncio**

Python introduced `asyncio.TaskGroup` in 3.11. It manages groups of asynchronous tasks, including completion, failures, and cancellation.

There's an important distinction from Java's virtual threads: `asyncio` uses cooperative scheduling, and one event loop normally runs Python tasks on one thread. It doesn't automatically distribute CPU calculations across cores. [8](https://docs.python.org/3/library/asyncio-task.html?highlight=gather), [9](https://docs.python.org/3.15/library/asyncio-dev.html)

## Experimental directions


The [September 2026 Python Language Summit report](https://blog.python.org/2026/09/language-summit-2026-free-threading-post-era/) discusses higher-level primitives for coordinating parallel work. One model presented there was **Behavior-Oriented Concurrency (BOC)**.

Its goal is to let developers express tasks and their data dependencies while a scheduler manages parallel execution and synchronization. The model uses ownership-aware containers called `Cown` to control access to shared state.

[bocpy](https://microsoft.github.io/bocpy/) is the prototype associated with this work. Treat the summit discussion as an exploration of programming models, rather than an announcement that BOC is a standard-library API.

The distinction is between **execution capabilities**--threads, processes, and isolated interpreters--and **programming models** that coordinate task lifetimes and access to data. Free threading changes the former; it does not determine which higher-level model an application should use.

**Sources**

1. [PEP 779 - Criteria for supported status for free-threaded Python | peps.python.org](https://peps.python.org/pep-0779/)
2. [Python support for free threading -- Python 3.14.7 documentation](https://docs.python.org/3/howto/free-threading-python.html)
3. [Thread states and the global interpreter lock -- Python 3.14.7 documentation](https://docs.python.org/3/c-api/threads.html)
4. [Python support for free threading -- Python 3.15.0 documentation](https://docs.python.org/3.15/howto/free-threading-python.html)
5. [What's new in Python 3.15 -- Python 3.15.0 documentation](https://docs.python.org/3.15/whatsnew/3.15.html)
6. [concurrent.futures -- Launching parallel tasks -- Python 3.15.0 documentation](https://docs.python.org/3/library/concurrent.futures.html)
7. [The concurrent package -- Python 3.15.0 documentation](https://docs.python.org/3/library/concurrent.html)
8. [Coroutines and tasks -- Python 3.15.0 documentation](https://docs.python.org/3/library/asyncio-task.html?highlight=gather)
9. [Developing with asyncio -- Python 3.15.0rc3 documentation](https://docs.python.org/3.15/library/asyncio-dev.html)
