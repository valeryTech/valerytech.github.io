---
draft: false
toc: true
description: "Compare CPython and JVM execution, bytecode, memory management, and polymorphism, including Python's method lookup, descriptors, and operator dispatch."
title: "Cpython Jvm Comparison And Polymorphism"
linkTitle: "Cpython Jvm Comparison And Polymorphism"
---
# CPython, the JVM, and polymorphism


Original conversation: [Shared ChatGPT thread](https://chatgpt.com/share/6ad807c9-e3fc-83e9-baa5-63e44b7c1be7)

This note compares runtime architecture, separates annotations from validation and dispatch, and traces method lookup into CPython's C implementation.

For runtime class creation, import order, and the Python-to-Rust boundary in Pydantic, see [Python data model, annotations, and Pydantic]({{< ref "engineering/langs/python/python-concepts-comparison" >}}). For the GIL and parallel execution, see [Free threading and concurrency]({{< ref "engineering/langs/python/cpython-free-threading-and-concurrency" >}}).

## CPython and JVM architecture


CPython and HotSpot share a source-to-bytecode-to-native-execution structure, but differ in bytecode semantics, object representation, memory management, and optimization:

- **JVM / HotSpot:** designed to execute a standardized bytecode format, with extensive runtime optimization through JIT compilation.
- **CPython:** implements Python's dynamic language semantics, compiling source to its own internal bytecode and executing it primarily through an interpreter.

Both are native programs that manage objects, execute virtual-machine instructions, load modules, and interact with native libraries.

| Component | JVM / HotSpot | CPython |
|---|---|---|
| Runtime executable | `java` | `python` |
| Source compiler | `javac`, Scala compiler | Built into CPython |
| Bytecode | `.class` files | Code objects, optionally cached as `.pyc` |
| Virtual machine | Java Virtual Machine | CPython bytecode interpreter |
| Bytecode stability | Standardized, versioned format | Internal implementation detail |
| JIT compiler | Mature tiered JIT (C1/C2) | Primarily interpreting; experimental JIT in recent versions |
| Type system at runtime | Typed bytecode, verified before execution | Dynamic operations on Python objects |
| Memory management | Tracing garbage collector | Reference counting plus cyclic garbage collection |
| Multithreading | Parallel Java execution | Default GIL build; optional free-threaded builds |
| Native extensions | JNI, FFM API | CPython C API, PyO3, Cython |

Sources: [1](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-1.html), [2](https://docs.python.org/3.14/library/dis.html), [3](https://docs.oracle.com/en/java/javase/26/vm/java-virtual-machine-technology-overview.html), [4](https://docs.python.org/3/howto/free-threading-python.html)

**Execution pipelines**

```text
Java / Scala
  Source code
  .java / .scala
↓ Compiler
  javac / scalac
↓ JVM bytecode
  .class
↓ HotSpot JVM
  Interpreter + JIT
↓ CPU instructions
```

```text
Python
  Source code
  .py
↓ CPython compiler
  Parser, AST, bytecode
↓ Python bytecode
  Code object; imported modules may use a .pyc cache
↓ CPython runtime
  Adaptive interpreter
↓ CPU instructions
```


**Portability:** JVM bytecode is designed as a portable distribution format. CPython bytecode is independent of the CPU architecture, but its format can change between Python versions. Python distributions can contain source code, pure-Python wheels, or platform-specific wheels containing native extensions. A `.pyc` file caches compiled code; it is not a required execution stage. [5](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-4.html), [2](https://docs.python.org/3.14/library/dis.html)

**Bytecode semantics**

Consider the following Python function:

```python
def add(a, b):
    return a + b
```


CPython produces instructions that conceptually include:

```text
LOAD_FAST    a
LOAD_FAST    b
BINARY_OP    +
RETURN_VALUE
```


At the language level, the addition operation supports different operand types:

```python
add(2, 3)        # 5
add("a", "b")     # "ab"
add([1], [2])    # [1, 2]
```


The runtime determines the operation using the objects' actual types. CPython represents Python objects using structures based on `PyObject`, with type information that connects operations to their implementations in C. [6](https://docs.python.org/3/c-api/intro.html)

Now compare Java:

```java
static int add(int a, int b) {
    return a + b;
}
```


The JVM bytecode can use the specific instruction `iadd`, because the operands are known to be integers.

This is a fundamental difference:

**The JVM instruction set has explicit operations for primitive types. Python bytecode generally operates on dynamically typed Python objects.**

Modern CPython can specialize frequently executed instructions for particular types. For example, an integer addition can use a faster specialized path. This is described in the actual CPython source, [Python/bytecodes.c](https://github.com/python/cpython/blob/main/Python/bytecodes.c).

**Startup, imports, and classes**

For `python app.py`, the native CPython executable initializes the runtime, compiles and executes the script, and processes imports as they are encountered. Each imported Python module also executes its top-level code on its first normal import.

A class definition is an executable statement:

```python
print("Before class")

class User:
    print("Creating User")

print("After class")
```


The class body executes as the interpreter encounters the class definition.

Java and Scala have class initialization mechanisms too, including static initialization. However, their compilers produce class definitions ahead of execution. Python's class statement performs class construction at runtime, which allows metaclasses and decorators to participate directly in the process.

This is the mechanism that Pydantic uses.

**Memory management and execution speed**

**Memory:** HotSpot primarily uses tracing garbage collection. CPython primarily uses reference counting, supplemented with cycle detection. `PyArena` serves temporary compiler allocations, rather than ordinary object allocation. Object allocators depend on the build: conventional builds use `pymalloc` for small objects; free-threaded builds use `mimalloc`. [7](https://github.com/python/cpython/blob/main/InternalDocs/compiler.md), [Memory allocator domains and builds](https://docs.python.org/3.14/c-api/memory.html#the-mimalloc-allocator)

**Performance:** HotSpot has an established adaptive JIT compiler. CPython uses adaptive bytecode specialization, with an experimental JIT available in Python 3.14. The standard CPython build traditionally uses the GIL; free-threaded builds have been supported since Python 3.14 as an optional configuration. [8](https://docs.oracle.com/en/java/javase/22/vm/java-hotspot-virtual-machine-performance-enhancements.html), [9](https://docs.python.org/de/3.14/whatsnew/3.14.html)

**A practical way to learn CPython**

A reading order from compiler pipeline to runtime behavior:

| Stage | Learn | Where to look |
|---|---|---|
| 1 | Bytecode and compiler pipeline | `dis`, `ast`, `compile()` |
| 2 | Interpreter execution | [`Python/ceval.c`](https://github.com/python/cpython/blob/main/Python/ceval.c), [`Python/bytecodes.c`](https://github.com/python/cpython/blob/main/Python/bytecodes.c) |
| 3 | Python objects vs JVM objects | [`Include/object.h`](https://github.com/python/cpython/blob/main/Include/object.h), [`Objects/`](https://github.com/python/cpython/tree/main/Objects) |
| 4 | Class creation, metaclasses, imports | [`Objects/typeobject.c`](https://github.com/python/cpython/blob/main/Objects/typeobject.c), [`Lib/importlib/`](https://github.com/python/cpython/tree/main/Lib/importlib) |
| 5 | Memory and native libraries | [`Objects/obmalloc.c`](https://github.com/python/cpython/blob/main/Objects/obmalloc.c), CPython C API |
| 6 | Performance | Bytecode specialization, JIT, GIL |

Two references are particularly useful:

- [CPython -- Compiler Internals](https://github.com/python/cpython/blob/main/InternalDocs/compiler.md) -- the actual pipeline from parsing and AST creation to bytecode.
- [Python Developer's Guide](https://devguide.python.org/getting-started/) -- building CPython, navigating the source, and running tests.

[7](https://github.com/python/cpython/blob/main/InternalDocs/compiler.md), [10](https://devguide.python.org/getting-started/)

**First hands-on exercise**

Compile the same addition operation in both runtimes:

**Python -- inspect CPython bytecode**

```python
import dis

def add(a, b):
    return a + b

dis.dis(add)
print(add.__code__.co_consts)
```


**Java -- inspect JVM bytecode**

```java
public class Example {
    static int add(int a, int b) {
        return a + b;
    }
}
```

```bash
javac Example.java
javap -c Example
```


Compare the emitted bytecode, particularly Python's `BINARY_OP` with Java's `iadd`. Then examine how CPython implements the addition operation in C.

That will connect three things: source code, bytecode, and the native implementation executing it.

## Type annotations and runtime types


**Type annotations do not enforce types in CPython, but they can remain available as runtime metadata.** CPython executes operations according to the actual objects it receives; a separate static type checker can analyze annotations before execution.

```python
def add(a: int, b: int) -> int:
    return a + b

print(add("hello", " world"))  # hello world
```


CPython accepts this. It doesn't enforce `int` for the arguments or return value.

However, the annotations remain accessible:

```python
print(add.__annotations__)

# {'a': int, 'b': int, 'return': int}
```


So there are three separate mechanisms:

| Mechanism | What happens |
|---|---|
| CPython compiler | Compiles the function without enforcing its type annotations |
| CPython runtime | Executes operations using the actual types of objects |
| Static type checker (`mypy`, `pyright`) | Analyzes annotations and reports type errors before execution |

This is also how **Pydantic** can use annotations: it reads the metadata and constructs runtime validators.

Python 3.14 evaluates annotations lazily by default. With `from __future__ import annotations`, they are stringified instead. Local variable annotations inside functions are not retained as a local annotation mapping. [11](https://docs.python.org/3/library/annotationlib.html)

**Compared with Java:** Python's type annotations are closer to metadata consumed by external tools, while Java's declared types also affect compile-time type checking and JVM bytecode generation.

**Runtime types come from the objects actually supplied, rather than the annotations attached to names or parameters.**

## Runtime validation and annotation-based dispatch


**Runtime validation and runtime dispatch are separate mechanisms.** Pydantic reads annotation metadata to validate data at selected boundaries. A dispatcher can use annotations to register implementations, then select among them using actual runtime types.

**Static type checking versus runtime validation**

Pydantic implements runtime validation based on type annotations. Its checks occur when validation runs; they do not establish a static guarantee for every use of a value.

Consider Java:

```java
record User(int age) {}

User user = new User("25"); // Compilation error
```


Now Python:

```python
class User:
    age: int

user = User()
user.age = "25"  # CPython allows this
```


With Pydantic:

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    age: int = Field(ge=18)

user = User(age="25")
print(user.age)        # 25
print(type(user.age))  # int

User(age=15)           # ValidationError
```


Pydantic interprets the annotation, creates a validation schema, and enforces it during model creation. It can also convert values to the specified type. [12](https://pydantic.dev/docs/validation/2.12/concepts/models/)

There is a distinction between what the systems guarantee:

| | Java compiler | Pydantic |
|---|---|---|
| Check declared types | Compile time | Runtime validation |
| Reject a string passed as an integer | Yes, statically | Usually converts it by default |
| Enforce `age >= 18` | Requires additional logic | `Field(ge=18)` |
| Check all ordinary assignments | Static type rules | Optional `validate_assignment=True` |
| Validate incoming JSON | Requires runtime logic | Built-in |

Python already has a dynamic type system. Pydantic adds enforcement of *declared* types and constraints at selected boundaries. Its guarantees have limits: for example, `model_construct()` bypasses validation. [13](https://github.com/pydantic/pydantic/blob/main/docs/concepts/models.md)

Pyright and mypy provide separate static checks; running them is distinct from executing CPython or Pydantic validation.

**Configuring dispatch with annotations**

Python's ordinary method dispatch uses runtime types and the class hierarchy. `functools.singledispatch` adds a library-level dispatcher: annotations can configure its registry, while the actual type of the first argument selects an implementation.

```python
from functools import singledispatch

@singledispatch
def process(value):
    return "Default implementation"

@process.register
def _(value: int):
    return "Integer implementation"

@process.register
def _(value: str):
    return "String implementation"

print(process(42))      # Integer implementation
print(process("42"))    # String implementation
```


Registration and dispatch happen at different times:

1. When Python executes `@process.register`, the decorator reads the argument's type annotation.
2. It registers the function as an implementation for that type.
3. When `process(value)` executes, the dispatcher examines the **actual runtime type** of `value`.
4. It selects the matching registered implementation. [14](https://docs.python.org/3/library/functools.html?highlight=total_ordering)

The annotations help configure the dispatcher. CPython itself still executes ordinary function calls.

**Combining Pydantic with polymorphism**

Using the `process` dispatcher defined above:

```python
from pydantic import BaseModel

class Input(BaseModel):
    value: int

data = Input(value="42")

print(process(data.value))
# Integer implementation
```


Here is the execution flow:

```text
Incoming value: "42"
  Runtime type: str
↓
Pydantic validation
  Uses annotation value: int to convert data
↓
Validated value: 42
  Runtime type: int
↓
process(data.value)
  Dispatcher selects the registered int implementation
```


This combines type-driven validation with type-driven dispatch.

**Customizing operators**

Python's data model exposes methods such as `__add__`, `__eq__`, `__getattribute__`, and `__call__`.

For example:

```python
class Number:
    def __init__(self, value):
        self.value = value

    def __add__(self, other):
        return Number(self.value + other.value)
```


For `a + b`, CPython dispatches using the operands' actual types. Special methods can be implemented directly or generated by decorators and metaclasses that interpret annotations. [15](https://docs.python.org/3/reference/datamodel.html?highlight=attribute+lookup)

However, attaching `x: int` to a variable does not automatically change CPython's instruction selection, method resolution, or operator semantics.

---

The broader architectural connection is:

- **Static typing:** a compiler or type checker analyzes code before execution.
- **Runtime validation:** Pydantic interprets annotations and checks or converts values.
- **Runtime polymorphism:** CPython uses actual object types and method resolution rules.
- **Metadata-driven programming:** decorators, metaclasses, and frameworks use annotations to create validation rules, register implementations, or generate methods.

This fourth mechanism is especially important in Python. It allows application code to define much of the behavior that Java or Scala developers often associate with compiler plugins, annotation processors, reflection, or dependency injection frameworks.

## Method lookup, MRO, and special methods


CPython connects an operation to its implementation through three mechanisms:

1. **`PyTypeObject`** -- how CPython represents a class and connects objects to their types.
2. **Method Resolution Order (MRO) and descriptors** -- how Python finds a method and binds it to an object.
3. **Special method slots** -- how operations such as `+`, `len()`, and comparisons reach C or Python implementations.

Ordinary attribute lookup and implicit special-method dispatch follow different paths.

**Every Python object knows its runtime type**

Java example:

```java
Animal animal = new Dog();
animal.speak();
```


The JVM uses the object's runtime class to select the overridden method.

Python does something conceptually similar:

```python
class Animal:
    def speak(self):
        return "Animal"

class Dog(Animal):
    def speak(self):
        return "Dog"

animal = Dog()

print(animal.speak())  # Dog
print(type(animal))    # <class '__main__.Dog'>
```


At the C level, CPython represents objects using structures beginning with a `PyObject` header. A simplified representation is:

```c
typedef struct {
    Py_ssize_t ob_refcnt;
    PyTypeObject *ob_type;
} PyObject;
```


The details depend on the CPython build, but the conceptual structure is important: **every Python object has a reference to its runtime type object.** [16](https://docs.python.org/3.13/c-api/structures.html)

```text
animal — Python instance
  ob_type → pointer to Dog
↓
Dog — Python class object
  C representation: PyTypeObject
  Method namespace: __dict__
  Inheritance order: __mro__
  Operation handlers: tp_* slots
```


`PyTypeObject` is a C structure used to represent Python types. The Python `type` object itself is an instance of a type, which is why this works:

```python
print(type(animal).__name__)  # Dog
print(type(Dog).__name__)     # type
print(type(type).__name__)    # type
```


The important relationship is:

- `animal` is an instance of `Dog`.
- `Dog` is a class object, represented by CPython as a type object.
- `type` is the metaclass that creates ordinary Python classes.

This is also the foundation that allows a library like Pydantic to substitute its own metaclass for class construction.

**How CPython resolves `animal.speak()`**

Python maintains a **Method Resolution Order**, which tells it where to look for class attributes when inheritance is involved.

```python
print([cls.__name__ for cls in Dog.__mro__])
```


Output:

```text
['Dog', 'Animal', 'object']
```


For `animal.speak()`, the default attribute lookup uses the class MRO together with descriptor and instance-dictionary rules. In this example, it finds `Dog.speak`.

The usual precedence for `obj.name` is a data descriptor on the class, the instance dictionary, then a non-data descriptor or other class attribute. If ordinary lookup fails, a defined `__getattr__` can supply a fallback. An overridden `__getattribute__` can customize this process. See the [descriptor lookup rules](https://docs.python.org/3.14/howto/descriptor.html#invocation-from-an-instance).

Functions defined on classes implement the *descriptor protocol*. Accessing one through an instance can produce a **bound method**, carrying both the function and the instance.

```python
method = animal.speak

print(method.__self__ is animal)      # True
print(method.__func__ is Dog.speak)   # True
```


Conceptually:

```python
animal.speak()
```


has the same effect as:

```python
Dog.speak(animal)
```


CPython can optimize the call to avoid allocating a separate bound-method object when it isn't needed. The language-level binding behavior remains the same. [17](https://docs.python.org/3.14/howto/descriptor.html)

Python exposes lookup and binding through the object model, including descriptors and `__getattribute__`.

**Special methods: Python has another dispatch path**

An instance attribute named `__add__` does not determine how `+` behaves:

```python
class Box:
    def __getattribute__(self, name):
        print("Looking up:", name)
        return super().__getattribute__(name)

    def __add__(self, other):
        return "Class implementation"

box = Box()

box.__add__ = lambda other: "Instance implementation"

print(box.__add__(10))
print(box + 10)
```


The output is:

```text
Looking up: __add__
Instance implementation
Class implementation
```


Notice that `box + 10` didn't print `Looking up: __add__`.

**The `+` operator dispatches through the runtime type, bypassing ordinary instance attribute lookup.**

CPython's data model explicitly specifies this distinction. [18](https://docs.python.org/3.15/reference/datamodel.html)

**What happens inside C?**

The conceptual execution path for `a + b` is:

```text
Python expression: a + b
↓
CPython bytecode
  BINARY_OP (+)
↓
C-level numeric dispatch
  PyNumber_Add(a, b)
↓
Type's operation slot
  Py_TYPE(a)->tp_as_number->nb_add
↓
Implementation
  Built-in C function or dispatch to Python's __add__ / __radd__
```


This is a simplified path; CPython also has optimized paths and rules for trying the right operand's implementation.

You can see the actual structures in the [PyTypeObject C API documentation](https://docs.python.org/3.15/c-api/typeobj.html) and the dispatch code in [Objects/abstract.c](https://github.com/python/cpython/blob/main/Objects/abstract.c).

Here's something else to try:

```python
Box.__add__ = lambda self, other: "Updated class"

print(box + 10)  # Updated class
```


Changing a special method on a normal Python class updates the relevant type-slot behavior.

Operator behavior can change dynamically **at the class level**, even after instances exist.

**Multiple inheritance: MRO**

Python uses the C3 method resolution algorithm to build a consistent linear order of base classes.

```python
class A:
    def source(self):
        return "A"

class B(A):
    pass

class C(A):
    def source(self):
        return "C"

class D(B, C):
    pass

print([cls.__name__ for cls in D.__mro__])
print(D().source())
```


Output:

```text
['D', 'B', 'C', 'A', 'object']
C
```


Although `B` inherits from `A`, method lookup reaches `C` before `A` because of the computed MRO.

This also affects `super()`: with multiple inheritance, `super()` proceeds to the next implementation in the MRO. It doesn't necessarily call a fixed parent class.

The official explanation is [Python -- Method Resolution Order](https://docs.python.org/3.15/howto/mro.html).

**Comparison with JVM dispatch**

| Operation | HotSpot JVM | CPython |
|---|---|---|
| Normal virtual call | `invokevirtual` | Attribute lookup + method call |
| Receiver type | Determines selected override | Determines class and MRO |
| Method lookup | Uses symbolic method reference and signature | Uses attribute name, descriptors, and namespaces |
| Operator `+` | Primitive opcode such as `iadd`, or an ordinary method call | Operator dispatch through type slots |
| Runtime modification | Classes generally retain loaded method definitions | User-defined classes can have methods replaced at runtime |
| Role of declared types | Affects compilation and bytecode verification | Annotations do not automatically alter dispatch |

The JVM's `invokevirtual` instruction performs runtime method selection using the receiver class and a previously resolved method reference. [19](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-6.html)

**Connecting this back to annotations and Pydantic**

An annotation alone does not install operator behavior:

```python
class Price:
    amount: int
```


CPython doesn't automatically install a numeric addition handler because of `amount: int`.

But a decorator or metaclass could read the annotation, generate `__add__`, and attach it to the class. Then CPython's existing operation dispatch machinery would use the newly installed implementation.

That's essentially the pattern used by Python frameworks:

```text
Annotations and field metadata
↓
Decorator / metaclass / framework
↓
Generated methods, validators, or descriptors
↓
Standard CPython runtime dispatch
```


Pydantic specifically uses its metaclass to build validation infrastructure and connects instance creation to a validator implemented in Rust. It relies on the ordinary Python runtime mechanisms we've just examined.

**Further reading: descriptors**

Descriptors and `__getattribute__` explain ordinary attribute and method lookup in more detail.

The [official Python Descriptor Guide](https://docs.python.org/3.15/howto/descriptor.html#invocation-from-an-instance) includes an actual Python implementation approximating CPython's attribute lookup algorithm.

Compare that algorithm with `PyObject_GenericGetAttr()` in [`Objects/object.c`](https://github.com/python/cpython/blob/main/Objects/object.c) to connect the Python-level rules to their C implementation.

**Sources**

1. [Chapter 1. Introduction](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-1.html)
2. [dis -- Disassembler for Python bytecode -- Python 3.14.7 documentation](https://docs.python.org/3.14/library/dis.html)
3. [Java Virtual Machine Technology Overview](https://docs.oracle.com/en/java/javase/26/vm/java-virtual-machine-technology-overview.html)
4. [Python support for free threading -- Python 3.14.7 documentation](https://docs.python.org/3/howto/free-threading-python.html)
5. [Chapter 4. The class File Format](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-4.html)
6. [Introduction -- Python 3.14.7 documentation](https://docs.python.org/3/c-api/intro.html)
7. [cpython/InternalDocs/compiler.md at main · python/cpython · GitHub](https://github.com/python/cpython/blob/main/InternalDocs/compiler.md)
8. [Java HotSpot Virtual Machine Performance Enhancements](https://docs.oracle.com/en/java/javase/22/vm/java-hotspot-virtual-machine-performance-enhancements.html)
9. [What's new in Python 3.14 -- Python 3.14.8 Dokumentation](https://docs.python.org/de/3.14/whatsnew/3.14.html)
10. [Getting started](https://devguide.python.org/getting-started/)
11. [annotationlib -- Functionality for introspecting annotations -- Python 3.15.0 documentation](https://docs.python.org/3/library/annotationlib.html)
12. [Models | Pydantic Docs](https://pydantic.dev/docs/validation/2.12/concepts/models/)
13. [pydantic/docs/concepts/models.md at main · pydantic/pydantic · GitHub](https://github.com/pydantic/pydantic/blob/main/docs/concepts/models.md)
14. [functools -- Higher-order functions and operations on callable objects -- Python 3.14.7 documentation](https://docs.python.org/3/library/functools.html?highlight=total_ordering)
15. [3. Data model -- Python 3.15.0 documentation](https://docs.python.org/3/reference/datamodel.html?highlight=attribute+lookup)
16. [Common Object Structures -- Python 3.13.15 documentation](https://docs.python.org/3.13/c-api/structures.html)
17. [Descriptor Guide -- Python 3.14.8 documentation](https://docs.python.org/3.14/howto/descriptor.html)
18. [3. Data model -- Python 3.15.0 documentation](https://docs.python.org/3.15/reference/datamodel.html)
19. [Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-6.html)
