---
marp: true
---

# How to create your own programming language

---

!!!include(motivation.md)!!!

---

# How to tackle a "too big" of a problem?

Split it into smaller problems that are "solvable":

* Parsing
  * Convert source code text into an intermediate representation resp. abstract syntax tree
* Code generation
  * Convert intermediate representation into bytecode that can be executed

