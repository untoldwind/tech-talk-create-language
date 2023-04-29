---
marp: true
---

<style>
    .colums2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: center
    }
</style>

# Abstract syntax tree

Start with a simple marker interface:
```ts
interface ASTNode {}
```
Note: The final version of this probably should have some position information of the source code for debugging and some helper functions to traverse the tree.

---

Literal values are the leaves of the tree:
```ts
// Represents an integer number in the source code.
class LiteralInt implements ASTNode {
  constructor(public readonly value: number) {}
}

// Represents a true or false in the source code.
class LiteralBoolean implements ASTNode {
  constructor(public readonly value: boolean) {}
}

// Represents a string in the source code.
class LiteralString implements ASTNode {
  constructor(public readonly value: string) {}
}
```

---

Combine these with binary operations.

```ts
class Binary implements ASTNode {
  constructor(
    public readonly left: ASTNode,  // Left side of the operation
    public readonly op: string,     // The operator: '-', '+', '*', '/'
    public readonly right: ASTNode  // Right side of the operation
  ) {}
}
```

---

Some simple examples

<div class="colums2">

```ts
12 * 34 + 56
```

<div class="mermaid">
flowchart LR;
    Root(Binary +);
    Mult(Binary *);
    Lit12(LiteralInt: 12);
    Lit34(LiteralInt: 34);
    Lit56(LiteralInt: 56);
    Root-- left --> Mult;
    Root-- right --> Lit56;
    Mult-- left --> Lit12;
    Mult-- right --> Lit34;
</div>
</div>

<div class="colums2">

```ts
12 * (34 + 56) * 78
```

<div class="mermaid">
flowchart LR;
    Root(Binary *);
    Mult1(Binary *);
    Add1(Binary +);
    Lit12(LiteralInt: 12);
    Lit34(LiteralInt: 34);
    Lit56(LiteralInt: 56);
    Lit78(LiteralInt: 78);
    Root-- left --> Lit12;
    Root-- right --> Mult1;
    Mult1-- left --> Add1;
    Add1-- left --> Lit34;
    Add1-- left --> Lit56;
    Mult1-- right --> Lit78;
</div>
</div>

---



---

# What ChatGPT has to say

```
Write a Haiku about abstract syntax trees
```

```
Leaves of code flutter,
Abstract syntax trees take root,
Logic blooms and grows.
```


<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10.0.0/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: true });

window.addEventListener('vscode.markdown.updateContent', function() { mermaid.init() });
</script>
