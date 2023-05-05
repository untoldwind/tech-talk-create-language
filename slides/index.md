---
marp: true
---

<style>
    .colums12 {
        display: grid;
        grid-template-columns: 1fr 2fr;
        align-items: center;
        gap: 10px;
    }
</style>

<style>
    .colums2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        gap: 10px;
    }
</style>


# How to create your own programming language

---

# How to tackle a "too big" of a problem?

Split it into smaller problems that are "solvable".

## In programmers terms

How to write a complex function:
```
function compile(sourceCode: string) : ExecutableCode
```

Split it into lots of smaller function.

---

# Overall strategy

- Parsing
  - Convert source code text into an intermediate representation resp. abstract syntax tree
- Code generation
  - Convert intermediate representation into bytecode that can be executed

---

!!!include(parsing.md)!!!

---

!!!include(syntax-tree.md)!!!

---

!!!include(code-generation.md)!!!

---

!!!include(async-await.md)!!!

<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10.1.0/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: true });

window.addEventListener('vscode.markdown.updateContent', function() { mermaid.init() });
</script>
