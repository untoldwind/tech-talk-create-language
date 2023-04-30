

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

<div class="colums12">

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

<div class="colums12">

```ts
12 * (34 + 56) * 78
```

<div class="mermaid">
flowchart LR;
    Root(Binary *);
    Mult1(Binary *);
    Lit12(LiteralInt: 12);
    Add1(Binary +);
    Lit34(LiteralInt: 34);
    Lit56(LiteralInt: 56);
    Lit78(LiteralInt: 78);
    Root-- left --> Mult1;
    Root-- right --> Lit78;
    Mult1-- left --> Lit12;
    Mult1-- right --> Add1;
    Add1-- left --> Lit34;
    Add1-- right --> Lit56;
</div>
</div>

---

Variable lookup is also a leaf in the syntax tree:
```ts
class VariableGet {
  constructor(private readonly identifier: string) {}
}
```

<div class="colums12">

```ts
12 * a + b
```

<div class="mermaid">
flowchart LR;
    Root(Binary +);
    Mult(Binary *);
    Lit12(LiteralInt: 12);
    VarA(VariableGet a);
    VarB(VariableGet b);
    Root-- left --> Mult;
    Root-- right --> VarB;
    Mult-- left --> Lit12;
    Mult-- right --> VarA;
</div>
</div>

---

More complex examples:

<div class="colums12">

```ts
if ( condition ) 
  thenExpression
else
  elseExpression
```

<div class="mermaid">
flowchart TB;
    Root(If);
    Root -- condition --> Condition(ExprNode);
    Root -- then --> Then(ExprNode);
    Root -- else --> Else(ExprNode);
</div>
</div>

<div class="colums12">

```ts
[1, 2, 3, a]
```

<div class="mermaid">
flowchart TB;
    Root(ArrayCreate);
    Root -- 1 --> L1(LiteralInt 1);
    Root -- 2 --> L2(LiteralInt 2);
    Root -- 3 --> L3(LiteralInt 3);
    Root -- 4 --> Va(VariableGet a);
</div>
</div>

---

Adapt the parser to have ASTNode as output:

```ts
function map<T, U>(parser: Parser<T>, convert: (value: T) => U): Parser<U> {
  return (input: string) {
    const result = parser(input);
    if(result.error) return result;
    return { success: true, remaining: result.remainging, value: convert(result.value) };
  }
}

const literalInt = map(digits, (digits) => new LiteralInt(parseInt(digits)) )

...
```

---

## Interesting things to do with an abstract syntax tree

- Optimization (Rearrange or combine nodes according to rules)
  - "BinaryOp" where left and right are "Literal" can be replaced by a Literal (by just doing the calculation).
  - `if(true)` can be directly replaced with the `then` node. Similarly, `if(false)` with `else`.
  - ...
- Semantic checks beyond pure syntax
  - Identify undeclared variables
  - Type-checking
---

## A brief look at type-checking

```ts
interface ASTNode {
  LangunageType resultType(context: TypecheckContext);
}
```

- For "Literal" nodes this is straight forward to implement.
- "VariableGet" has to do a lookup for a declared variable in the `context` (thereby implicitly checking if variable is declared in the first place)
- "Binary" has to use `left.resultType(context)` and `right.resultType(context)` and then check if the operator between these to types is defined.

---

Example of allowed operators:
```ts
1 + 2 + 3 / 4
!true
true && false
```

Example of operators that do not make much sense:
```ts
"abcd" / 5
true + true
```

Soso operators:
```ts
"abcd" + 5
true && 5
```

---

Additional type-checks

- `condition` of an `if` or `while` has be boolean (or convertible to a boolean).
- Type of a `return` matches the declared return-type of the function.
- A function call has the correct number of arguments and the types match the declared parameter types
- ...

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
