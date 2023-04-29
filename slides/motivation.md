How to convert this

```rust
use { Vessel } from ksp::vessel
use { CONSOLE } from ksp::console
use { bi_impulsive_transfer } from std::maneuvers
use { sleep, current_time } from ksp::game
use { estimate_burn_time } from std::vac
use { remove_all_nodes } from std::utils

pub fn main_flight(vessel: Vessel, max_rotations : float = 2.0) -> Result<Unit, string> = {
    CONSOLE.clear()

    let ut = current_time()

    let (delta_v, UT) = bi_impulsive_transfer(vessel.orbit, 
        vessel.target.ok_or("No Target")?.orbit, ut, ut + vessel.orbit.period * max_rotations)?

    CONSOLE.print_line("Intercept: " + delta_v.to_string() + " " + UT.to_string())

    let (burn_time, half_burn_time) = estimate_burn_time(vessel, delta_v.magnitude, 0.5, 1.0)

    CONSOLE.print_line("Burntime: " + burn_time.to_string() + " " + half_burn_time.to_string())

    remove_all_nodes(vessel)
    
    vessel.maneuver.add_burn_vector(UT - half_burn_time, delta_v)?
}
```
... into something that can actually be executed.