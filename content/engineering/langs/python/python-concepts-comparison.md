---
draft: false
toc: true
title: "Python Concepts Comparison"
linkTitle: "Python Concepts Comparison"
---
# Python data model, annotations, and Pydantic


Original conversation: [Shared ChatGPT thread](https://chatgpt.com/share/6ad8073c-4f48-83ea-9bd2-b4b1d81fe800)

These notes connect runtime class creation, annotation metadata, and Pydantic's use of a Rust extension. The central distinction is between describing a type and executing code that interprets or enforces that description.

Related: [CPython, the JVM, and polymorphism]({{< ref "engineering/langs/python/cpython-jvm-comparison-and-polymorphism" >}}) · [Free threading and concurrency]({{< ref "engineering/langs/python/cpython-free-threading-and-concurrency" >}}).

## Runtime class creation and annotations


**Defining a Python class is a runtime operation.** Python executes the class body and creates a class object. Metaclasses participate in class creation; class decorators receive the resulting class object and can modify or replace it.

Java and Scala also have runtime class loading, initialization, and reflection. The useful distinction here is that Python's `class` statement executes as part of ordinary program execution.

**Annotations, dataclasses, and validation**

```python
from dataclasses import dataclass
from typing import Annotated

@dataclass
class Record:
    amount: Annotated[int, "must be positive"]

record = Record("10")
print(type(record.amount))  # str!
```


Three independent mechanisms are involved here:

1. `class Record` creates a runtime class object.
2. `amount: Annotated[...]` provides metadata, but does not enforce its meaning.
3. `@dataclass` processes the class and generates methods, without validating the values.

Pydantic adds validation by explicitly interpreting field annotations and metadata. [1](https://docs.python.org/3.14/library/dataclasses.html), [2](https://docs.python.org/3.14/library/typing.html), [3](https://docs.pydantic.dev/latest/internals/architecture/)

**Annotation evaluation depends on the Python version and imports.** Python 3.14 introduced lazy evaluation by default; `from __future__ import annotations` uses stringified annotations. Annotation metadata is available for introspection, but its presence does not enforce a type or constraint. See [annotationlib](https://docs.python.org/3.14/library/annotationlib.html).

For the Java and Scala comparison, see [Java -- Reading Annotations](https://dev.java/learn/reflection/annotations/) and [Scala 3 -- Metaprogramming](https://docs.scala-lang.org/scala3/reference/metaprogramming/index.html). They help distinguish Java's metadata and reflection model, Scala's compile-time mechanisms, and Python's runtime class creation.

**References for the object model**

**[Python Data Model -- Customizing Class Creation](https://docs.python.org/3.14/reference/datamodel.html#customizing-class-creation)**

Explains metaclasses, `__init_subclass__`, class creation hooks, and the runtime lifecycle of a class. [4](https://docs.python.org/3.14/reference/datamodel.html)

**[Python Language Reference -- Class Definitions](https://docs.python.org/3.14/reference/compound_stmts.html#class-definitions)**

Describes why `class` is an executable statement and how a class body runs, creates a namespace, and produces a class object. It also explains when class decorators execute. [5](https://docs.python.org/3.14/reference/compound_stmts.html)

**[Python Typing -- Annotated](https://docs.python.org/3.14/library/typing.html#typing.Annotated)**

Explains the distinction between type information and extra metadata supplied for libraries to interpret. This is particularly relevant when comparing Python annotations with Java's `@NotNull`, `@Min`, and similar annotations. [2](https://docs.python.org/3.14/library/typing.html)

**More accessible explanations**

For tutorials with examples, see [Real Python -- Python Metaprogramming](https://realpython.com/learning-paths/metaprogramming-in-python/). The learning path covers descriptors, metaclasses, introspection, and the object model.

Two further references are particularly relevant to class annotations and validation:

- [Python dataclasses documentation](https://docs.python.org/3.14/library/dataclasses.html) -- how annotations are used to generate constructors, equality, hashing, and other methods.
- [Pydantic Internals -- Architecture](https://pydantic.dev/docs/validation/latest/internals/architecture/) -- how Pydantic's metaclass examines fields, builds a validation schema, and uses that schema during instance creation.

For the precise behavior of `__init_subclass__`, [PEP 487 -- Simpler Customisation of Class Creation](https://peps.python.org/pep-0487/) is especially useful.

## CPython startup, Pydantic, and Rust extensions


**Pydantic V2 combines Python model definitions with a compiled Rust validation engine in the same CPython process.**

CPython controls program execution. When Python calls certain Pydantic methods, execution enters native Rust functions. When those functions finish, control returns to Python.

**The Pydantic metaclass is implemented in Python.** It builds a core schema and passes it to the Rust-backed validator. The Rust extension is loaded into the process as a native library.

**The overall architecture**

```text
Your application
  python app.py
  ↓ CPython executes Python bytecode
Pydantic — Python implementation
  BaseModel, ModelMetaclass, type annotations, schema generation
  ↕ Python C API / PyO3
pydantic-core — compiled Rust
  SchemaValidator, SchemaSerializer, validation and conversion logic
  ↕
CPython objects and runtime
  Python dictionaries, strings, integers, classes, instances
```


Pydantic's official architecture documentation confirms this division: Python handles model definition and schema generation; Rust handles most validation and serialization. [3](https://docs.pydantic.dev/latest/internals/architecture/)

The technology connecting Python and Rust is PyO3. It exposes compiled Rust functions and classes through CPython's C API, so Python can invoke them as ordinary callable objects. [6](https://pyo3.rs/v0.29.3/)

**Startup and import order**

Example application:

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    age: int = Field(ge=18)

def main():
    user = User(age="25")
    print(user)

if __name__ == "__main__":
    main()
```


Execution sequence:

1. **The operating system starts CPython.**

   The `python` executable is a compiled native program, normally written in C. Its startup code initializes the interpreter, memory management, built-in modules, and import system.

   CPython then compiles `app.py` into Python bytecode and begins executing the top-level statements.

   The application's `main()` function has not run yet.
2. **CPython encounters `from pydantic import BaseModel, Field`.**

   The Python import system locates the installed `pydantic` package and executes the necessary Python modules to provide those names.

   Those modules have their own imports. Some import `pydantic_core`, which ultimately loads the Rust extension.

   Python modules are generally initialized once per import cache entry and reused through `sys.modules`. [7](https://docs.python.org/3.14/reference/import.html)
3. **CPython encounters `class User(BaseModel)`.**

   Python executes the class body, collecting definitions such as `age` and its annotation.

   Because `BaseModel` uses `ModelMetaclass`, Python automatically invokes Pydantic's metaclass during class creation.

   The metaclass collects fields and constructs a validation schema. It then invokes the Rust-backed `SchemaValidator` constructor to prepare a validator for this model. [8](https://github.com/pydantic/pydantic/blob/main/pydantic/_internal/_model_construction.py)
4. **CPython reaches `def main()`.**

   Python creates a function object and binds it to `main`. The function's body does not execute yet.
5. **CPython evaluates `if __name__ == "__main__"`.**

   When `app.py` is started directly, the condition is true and `main()` runs.

   Python does not require a `main()` function. It's a convention that provides an explicit application entry point. [9](https://docs.python.org/3.14/library/__main__.html)
6. **`User(age="25")` invokes the validator.**

   Python calls the inherited `BaseModel.__init__`. That calls a native method exposed by Rust.

   Rust validates the value, converts `"25"` into integer `25`, and populates the Python model instance.

   Execution returns to Python, which prints `age=25`. [10](https://github.com/pydantic/pydantic/blob/main/pydantic/main.py)

The important timing distinction is that **the class and its validator are normally built before `main()` executes**, because the class definition is at module level. Pydantic can defer building some schemas, and classes defined inside functions are created when those functions execute.

**Loading the Rust extension**

Installing Pydantic with `pip` normally uses a wheel containing the compiled Rust extension from `pydantic-core`. Building from source requires a Rust toolchain.

On Linux, it looks like this:

```text
site-packages/
├── pydantic/
│   ├── main.py
│   └── _internal/
│       └── _model_construction.py
│
└── pydantic_core/
    ├── __init__.py
    └── _pydantic_core.cpython-313-x86_64-linux-gnu.so
```


The `.so` file is native machine code. Windows uses `.pyd` files; macOS also commonly uses `.so` extension modules.

When Python imports `pydantic_core._pydantic_core`, the following happens:

```text
Python import machinery
  Find native extension file
  ↓
Operating system dynamic loader
  Load compiled shared library into process memory
  ↓
Native entry point
  PyInit__pydantic_core
  ↓
PyO3 initializes the module
  Expose Rust classes and methods to Python
  ↓
Python can now call SchemaValidator(...)
  A Python-visible class implemented in Rust
```


The native entry point is `PyInit__pydantic_core`. PyO3 generates this function from Pydantic's Rust module declaration, and CPython invokes it through its extension loading mechanism.

This is the closest equivalent to Java loading a JNI native library, although Python uses its own C API and extension module conventions. [11](https://docs.python.org/3.14/c-api/extension-modules.html), [12](https://pyo3.rs/v0.29.3/module), [13](https://github.com/pydantic/pydantic/blob/main/pydantic-core/src/lib.rs)

**There is no Rust `main()` here.** The application entry point belongs to CPython. The Rust extension has a module initialization entry point, followed by native methods that Python calls as needed.

**Class construction and validation are separate phases**

Simplified call sequence in Pydantic's source; exact internal helpers can vary between releases:

```text
app.py
  |
  | class User(BaseModel):
  v
ModelMetaclass.__new__()             [Python]
  |
  v
complete_model_class()               [Python]
  |
  | Generate core schema
  | e.g. {'type': 'int', 'ge': 18}
  |
  v
SchemaValidator(schema)              [Rust]
  |
  | Build and store validation logic
  v
User.__pydantic_validator__          [Rust object]

             Later...

User(age="25")                      [Python]
  |
  v
BaseModel.__init__()                 [Python]
  |
  v
validator.validate_python(...)       [Rust]
  |
  | Convert and validate
  v
User(age=25)                        [Python object]
```


The Python class definition is in [pydantic/main.py](https://github.com/pydantic/pydantic/blob/main/pydantic/main.py):

```python
class BaseModel(metaclass=_model_construction.ModelMetaclass):
    ...
```


The metaclass lives in [_model_construction.py](https://github.com/pydantic/pydantic/blob/main/pydantic/_internal/_model_construction.py). During model construction, it eventually executes:

```python
cls.__pydantic_validator__ = create_schema_validator(...)
```


The actual Rust implementation is in [pydantic-core/src/validators/mod.rs](https://github.com/pydantic/pydantic/blob/main/pydantic-core/src/validators/mod.rs). Look for `pub struct SchemaValidator` and `pub fn validate_python`. PyO3 makes that Rust class callable from Python. [8](https://github.com/pydantic/pydantic/blob/main/pydantic/_internal/_model_construction.py)

The validation call inside `BaseModel.__init__` is:

```python
validated_self = self.__pydantic_validator__.validate_python(
    data, self_instance=self
)
```


That is where ordinary Python execution enters the native validator during instance creation. [10](https://github.com/pydantic/pydantic/blob/main/pydantic/main.py)

**Using the core validator directly**

`SchemaValidator` can also consume an explicit schema:

```python
from pydantic_core import SchemaValidator, core_schema

validator = SchemaValidator(
    core_schema.int_schema(ge=18)
)

print(validator.validate_python("25"))  # 25
validator.validate_python("17")         # Raises ValidationError
```


The caller supplies the schema directly; the Rust validator executes it.

Pydantic's Python layer automates that schema creation using class annotations, `Field(...)`, and metaclasses.

To inspect the loaded extension and the `User` model defined above:

```python
import pydantic_core._pydantic_core as native

print(native.__file__)
print(type(User))
print(type(User.__pydantic_validator__))
```


The last two lines will identify `ModelMetaclass` as the metaclass and `pydantic_core._pydantic_core.SchemaValidator` as the Rust-backed validator.

**Native extension references**

**[CPython -- Defining Extension Modules](https://docs.python.org/3.14/c-api/extension-modules.html)** explains how Python loads a compiled shared library and invokes the `PyInit_*` entry point.

**[PyO3 -- Python Modules](https://pyo3.rs/v0.29.3/module)** explains how a Rust module exposes classes and methods that can be called directly from Python.

CPython hosts execution, the Python layer constructs the model and schema, and the native Rust layer implements validation and serialization. Calls can cross that boundary in either direction through the Python C API.

**Sources**

1. [dataclasses -- Data Classes -- Python 3.14.8 documentation](https://docs.python.org/3.14/library/dataclasses.html)
2. [typing -- Support for type hints -- Python 3.14.8 documentation](https://docs.python.org/3.14/library/typing.html)
3. [Architecture | Pydantic Docs](https://docs.pydantic.dev/latest/internals/architecture/)
4. [3. Data model -- Python 3.14.8 documentation](https://docs.python.org/3.14/reference/datamodel.html)
5. [8. Compound statements -- Python 3.14.8 documentation](https://docs.python.org/3.14/reference/compound_stmts.html)
6. [Introduction - PyO3 user guide](https://pyo3.rs/v0.29.3/)
7. [5. The import system -- Python 3.14.8 documentation](https://docs.python.org/3.14/reference/import.html)
8. [pydantic/pydantic/_internal/_model_construction.py at main · pydantic/pydantic · GitHub](https://github.com/pydantic/pydantic/blob/main/pydantic/_internal/_model_construction.py)
9. [__main__ -- Top-level code environment -- Python 3.14.8 documentation](https://docs.python.org/3.14/library/__main__.html)
10. [pydantic/pydantic/main.py at main · pydantic/pydantic · GitHub](https://github.com/pydantic/pydantic/blob/main/pydantic/main.py)
11. [Defining extension modules -- Python 3.14.8 documentation](https://docs.python.org/3.14/c-api/extension-modules.html)
12. [Python modules - PyO3 user guide](https://pyo3.rs/v0.29.3/module)
13. [pydantic/pydantic-core/src/lib.rs at main · pydantic/pydantic · GitHub](https://github.com/pydantic/pydantic/blob/main/pydantic-core/src/lib.rs)
