
First question to answer where to generate to:

- Bare metal
  - Generate machine code for x86, x86_64/amd64, arm (armv8, aarch64), mips/mips64, riscV (32/64)
  - Probably best to use another intermediate language: llvm
- Use a VM that has been ported to most platforms
  - JVM
  - .NET / Mono
  - WASM

We will use Mono as it is the underlying framework used in the Unity engine.

---

# Some internals about Mono

- Mono is a stack-machine (like the JVM and WASM)
- Mono has a garbage collector (like the JVM)
  - classes and objects are built-in constructs
- Mono has Just-In-Time compilation (like the JVM)
- Mono supports dynamically generated code
  - In Mono/.Net there is: `System.Reflection.Emit`
  - JVM only supports this with some external libraries: javassist, asm, bcel

---

## What does "stack-machine" mean?

Essentially the VM is "just" an inflated RPN calculator.

<div class="colums12">

```ts
12 + 34
```

```
ldc.i4    12  // loads 32-bit integer 12 to stack
ldc.i4    34  // loads 32-bit integer 34 to stack
add           // adds two values from the stack
              // and return result to the stack
```

</div>

<div class="colums12">

```ts
calc(12, 34, 56)
```

```
ldc.i4   12
ldc.i4   34
ldc.i4   56
call     calc(int32, int32, int32)
// return value of calc will be on the stack
```

</div>

In Mono this is called `IL`, `ILCode` or `MSIL` (Microsoft Intermediate Language)

---

This fits very nicely to an abstract syntax tree:
```ts
interface ASTNode {
  generateCode(emitter: ILCodeEmitter);
}
```

Implementation for "Literal" nodes is straight forward.

```ts
class LiteralInt implements ASTNode {
  constructor(public readonly value: number) {}

  public generateCode(emitter: ILCodeEmitter) {
    emitter.emit(`ldc.i4 ${value}`);
  }
}

...
```

---

Binary nodes have to do it in the right order
```ts
class Binary implements ASTNode {
  constructor(
    public readonly left: ASTNode,
    public readonly op: string,
    public readonly right: ASTNode
  ) {}

  public generateCode(emitter: ILCodeEmitter) {
    this.left.generateCode(emitter);
    this.right.generateCode(emitter);
    switch (this.op) {
        case '+': emitter.emit("add"); break;
        case '-': emitter.emit("sub"); break;
        case '*': emitter.emit("mul"); break;
        case '/': emitter.emit("div"); break;
    }
  }
}
```

---

Is it really that simple?

<div class="colums12">

```ts
12 * (34 + 56) * 78
```

<div class="mermaid">
flowchart LR;
    Root(a Binary *);
    Mult1(b Binary *);
    Lit12(c LiteralInt: 12);
    Add1(d Binary +);
    Lit34(e LiteralInt: 34);
    Lit56(f LiteralInt: 56);
    Lit78(g LiteralInt: 78);
    Root-- left --> Mult1;
    Root-- right --> Lit78;
    Mult1-- left --> Lit12;
    Mult1-- right --> Add1;
    Add1-- left --> Lit34;
    Add1-- right --> Lit56;
</div>
</div>


```
ldc.i4   12    // a.left ->b.left->c            Stack: 12
lcd.i4   34    //          b.right->d.left ->e  Stack: 12, 34
lcd.i4   56    //                   d.right->f  Stack: 12, 34, 56
add            //                   d.op        Stack: 12, 90
mul            //          b.op                 Stack: 1080
lcd.i4   78    // a.right->g                    Stack: 1080, 78
mul            // a.op                          Stack: 84240
```

---

# What has ChatGPT to say

```
Write a nursery rhyme about generating code from an abstract syntax tree.
```

```
In a land of programming fun,
Where the trees all code have spun,
An abstract syntax grew with glee,
To generate some code, you see!
```


<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10.0.0/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: true });

window.addEventListener('vscode.markdown.updateContent', function() { mermaid.init() });
</script>
