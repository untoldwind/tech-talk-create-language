# Asynchronous programming (async/await)

Concept of zero-cost futures (Rust):
```ts
interface Future<T> {
  poll() : PollResult<T>
}

type PollResult<T> = { ready: false } | { ready: true, value: T };
```

In concept this is very similar to an iterator/enumerator where only the last value counts.

---

TO2 is async by default:

```rust
use { CONSOLE } from ksp::console
use { sleep } from ksp::game

pub fn main_flight() -> Unit = {
    for(i in 0..100) {
        CONSOLE.print_line(i.to_string())
        sleep(0.5)
    }
}
```

in typescript this would be:
```ts
async function main_flight() : Promise<void> {
    for(int i = 0; i < 100; i++) {
        console.log(i);
        await sleep(0.5);
    }
}
```

---

Insight 1: When converted to ILCode loops are converted to conditional jumps. I.e. non-async would look like this
<div class="colums2">

```ts
for(int i = 0; i < 100; i++) {
    console.log(i);
    sleep(0.5);
}
```

```
// IL-Peusocode
    declare var i : int
    i = 0
:loop_begin
    call console.log i
    call sleep 0.5
    compare i < 100
    if_false_jump :loop_end
    i += 1
    jump :loop_begin
:loop_end
```
</div>

Insight 2: As long as all variables are restored it is possible to jump back into the loop at any time.

---

## Convert the function to a state machine

<pre class="mermaid">stateDiagram-v2
    direction LR
    [*] --> Initial
    Initial --> Sleeping  : first call to\nsleep()
    Sleeping --> Sleeping : next call to\nsleep()
    Sleeping --> Done : for loop\ncomplete
    Done --> [*]
</pre>

<div class="colums2">
<div>

- Initial
  - set `i = 0`
  - proceed to loop until `sleep()`
  - store returned future of `sleep()`
  - return not-ready

</div>
<div>

- Sleep
  - Check if stored future of `sleep` is ready
  - If not: Just return not-ready
  - If so: resume for loop
- Done
  - Just return ready

</div>
</div>

---

```ts
function main_flight() : Future<void> {
  return new MainFlight();
}
```

<div class="colums2">


```
// IL-Peusocode
class MainFlight implements Future<void>
  field i : int 
  field state : "initial" | "sleep" | "done"
  field sleepFuture : Future<void> | undefined

  method poll() : PollResult<T>
    declare var result : PollResult<void>

    switch(this.state) {
      case "initial": jump :initial
      case "sleep":   jump :sleep
      case "done":    jump :done
    }
  :sleep
    call this.sleepFuture.poll() -> result
    if !result.ready return { ready: false }
    jump :sleep_pickup
```

```
  :initial
    i = 0
  :loop_begin
    call console.log i
    call sleep 0.5 -> this.sleepFuture
    this.state = "sleep"
    return { ready: false }
  :sleep_pickup
    compare i < 100
    if_false_jump :loop_end
    i += 1
    jump :loop_begin
  :loop_end
    this.state = "done"
  :done
    return { ready: true }
```

</div>
