---
marp: true
---

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