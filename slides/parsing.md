# Parsing

Parsing is still a big problem, so break it down to something very basic:

Typescript variant:

```ts
type ParseSuccess<T> = { success: true, remaining: string, value: T };
type ParseFailure    = { success: false, error: string };

type Parser<T> = (input: string) => ParseSuccess<T> | ParseFailure;
```

C# variant:
```csharp
public delegate IResult<T> Parser<out T>(IInput input);
```
Note: Wrapping the input string into an `IInput` is just to keep track of position and avoiding unnecessary `memcpy` operations.

---

## Basic building blocks

Just consume a bunch of characters based on a condition/predicate:

```ts
function chars(predicate: (ch: string) => boolean): Parser<string> = {
  return (input: string) => {
    const consume = input.split("").findIndex(ch => !predicate(ch));
    if (consume <= 0) 
      return { success: false, error: "Expected some chars" };
    return { 
      success: true,
      remaining: input.substring(consume), 
      value: input.substring(0, consume),
    };
  }
}
```


---

## Use this to create some basics

```ts
const digits = chars((ch: string) => ch >= "0" && ch <= "9");

const lowercase = chars((ch: string) => ch >= "a" && ch <= "z");

const uppercase = chars((ch: string) => ch >= "A" && ch <= "Z");

const spaces = chars((ch: string) => ch === " " || ch === "\t");

const whitespaces = chars((ch: string) => ch === " " || ch === "\n" || ch === "\r" || ch === "\t");

```

---

It is also useful to have a parser for literal matches (keywords/tags):

```ts
function tag(keyword: string) : Parser<string> {
  return (input: string) => {
    if(input.startsWith(keyword))
      return { 
        success: true, 
        remaining: input.substring(keyword.length),
        value: keyword,
      };
    return { success: false, `Expected keyword ${keyword}` };
  }
}
```

---

## Combine basics parsers into more complex parsers

Sequence of parsers:
```ts
function seq<T>(...sequence: Parser<T>[]) : Parser<T[]> {
  return (input: string) => {
    let remaining = input;
    const values : T[] = [];
    for(const parser of sequence) {
      const result = parser(remaining);
      if(!result.success)
        return { success: false, error: result.error };
      values.push(result.value);
      remaining = result.remaining;
    }
    return { success: true, remaining, value: values };
  }
}
```

---
Repeat a parser zero or more times:
```ts
function many0<T>(parser: Parser<T>) : Parser<T[]> {
  return (input: string) => {
    let remaining = input;
    const values : T[] = [];
    while(true) {
      const result = parser(remaining);
      if(!result.success) break;
      values.push(result.value);
      remaining = result.remaining;
    }
    return { success: true, remaining, value: values }
  }
}
```
Correspondingly there should be a `many1` to parser one or more items.

---

Alternative of parsers (find first that is successful):
```ts
function alt<T>(...alternatives: Parser<T>[]) : Parser<T> {
  return (input: string) => {
    for(const parser of alternatives) {
      const result = parser(input);
      if(result.success)
        return result;
    }
    return { success: false, error: "No alternative found" }
  }
}
```

---

## Some useful applications

```ts
const letters = many1(alt(uppercase, lowercase));

const letterOrDigits = many1(alt(letters, digits));

const identifier = seq(letter, letterOrDigits);
```

---

## Simple expressions

```ts
const term = alt(
    digits,         // literal numbers (integer)
    identifier,     // variables or constants
);

// '*' '/' take a higher precendence than
const mulDivOp = alt(tag("*"), tag("/"));

const mulDiv = seq(term, whitespaces, mulDivOp, whitespaces, term);

const addSubOp = alt(tag("+"), tag("-"));

const addSub = seq(mulDiv, whitespaces, addSubOp, whitespace, mulDiv);
```

---

## Cyclic references

```ts
const bracketTerm = seq(tag("("), whitespaces, expression, whitespaces, tag(")"));

const term = alt(digits, identifier, bracketTerm);

... mulDiv, addSub as before ...

// Write a parser directly as function so it can be used anywhere.
function expression(input: string): ParserResult<string> {
  return addSub(input);
}
```

---

# And here is what ChatGPT has to say

```
Write a limerick about parser combinators
```

```
Parsing syntax can be quite tough,
But with combinators, it's not rough,
They can parse with ease,
And handle any degrees,
Of complexity, making parsing less gruff!
```