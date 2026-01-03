# IARTI Report - 5th Semester Integrative Project - LEI

## Group 3DL-E-04

- 1231246 – Tiago Soares - US 4.3.1
- 1250264 – Julia Kardasz - US 4.3.2
- 1250247 – Guillermo Navarro - US 4.3.5
- 1250184 – Adam Pawełka - US 4.3.3
- 1250311 – Patricia Galán - US 4.3.4

**Date: 3/1/2026**

## User Story 4.3.1

> As a Logistics Operator, I want the scheduling module to include a **genetic algorithm–based approach** to generate optimized daily operation plans, so that the system can explore broader solution spaces and achieve improved or near-optimal schedules under complex conditions.

---

## Implementation Overview

To implement this User Story, a new Prolog file `genetic_scheduling.pl` has been created in the `Scheduling/PrologFiles` directory. This file implements a **Genetic Algorithm (GA)** for vessel scheduling that explores solution spaces more efficiently than brute-force approaches while handling **multi-crane operations**.

---

## Program Architecture

### Core Data Representation

The system uses **dynamic predicates** to represent vessels and algorithm parameters:

```
% Vessel facts (dynamically asserted)
vessel(Name, ETA, UnloadTime, LoadTime, ETD, DockID).

% Algorithm parameters
:- dynamic multiple_cranes/1.
```

*(Note: Actual Prolog code for vessel representation and parameter definition is loaded dynamically at runtime from the backend.)*

---

### Genetic Algorithm Components

#### 1. **Individual Representation**

Each individual (a potential solution) is represented as a **permutation of vessel names**.
- Ensures each vessel appears **exactly once** in the schedule.
- Naturally encodes a **valid sequence** of vessel processing.

#### 2. **Fitness Function**

The fitness of an individual (sequence) is calculated using the `fitness/2` predicate:

```
fitness(Sequence, TotalDelay) :-
    calculate_delay(Sequence, 0, TotalDelay).
```

**Key Features:**
- Adjusts processing times based on number of cranes using **integer ceiling division**
- Respects vessel **arrival times (ETA)**
- Calculates **delays** relative to desired **departure times (ETD)**
- Supports both **single-crane** and **multi-crane** operations

#### 3. **Population Initialization**

The `generate_population/1` predicate creates the initial population using `random_permutation/2` to ensure **diverse starting solutions**.

#### 4. **Selection Mechanism**

**Tournament selection** is implemented in `tournament_selection/2`:
- Randomly selects individuals for a tournament
- Chooses the **fittest** (lowest delay) from each tournament
- Maintains **genetic diversity** while promoting good solutions

#### 5. **Crossover Operation**

A **simplified crossover operator** `simple_crossover/3`:
- Takes **first half** of genes from parent 1
- Fills remaining positions with **unused genes** from parent 2
- **Preserves all vessels exactly once** in offspring → valid permutation

#### 6. **Mutation Operation**

The `simple_mutation/2` predicate implements **swap mutation**:
- Randomly selects two positions in the sequence
- Swaps the vessels at those positions
- **Maintains valid permutations** while introducing diversity

#### 7. **Evolutionary Loop**

The main GA loop in `run_generations/5` implements:

| Step            | Description                                |
|-----------------|--------------------------------------------|
| **Evaluation**  | Calculate fitness for all individuals      |
| **Selection**   | Tournament selection to choose parents     |
| **Crossover**   | Create new offspring with probability `CP` |
| **Mutation**    | Apply mutations with probability `MP`      |
| **Elitism**     | Keep best individuals for next generation  |
| **Termination** | Stop after specified number of generations |

---

### Multi-Crane Support

The algorithm supports both **single-crane** and **multi-crane** operations through a parameterized crane capacity:

```
multiple_cranes(NumCranes)
```

**Processing time adjustment:**
- For `N` cranes:  
  `AdjustedTime = (UnloadTime + LoadTime + N - 1) // N`
- Uses **integer ceiling division** to distribute work among cranes
- Enables **parallel processing** of unloading and loading operations

---

### Algorithm Parameters

The genetic algorithm provides **tunable parameters** through the controller:

| Parameter           | Description                              | Default Value | Range   |
|---------------------|------------------------------------------|---------------|---------|
| **Population Size** | Number of solutions per generation       | 30            | 10–500  |
| **Generations**     | Number of evolutionary cycles            | 50            | 10–500  |
| **Crossover Rate**  | Probability of crossover between parents | 0.8           | 0.0–1.0 |
| **Mutation Rate**   | Probability of mutation in offspring     | 0.2           | 0.0–1.0 |
| **Cranes**          | Number of cranes for parallel processing | 1             | 1–8     |

---

## Integration with System Architecture

### Backend Integration

The genetic algorithm is integrated through `SchedulingController.cs` with a new endpoint:

```
[HttpGet("calculate-schedule-genetic")]
public async Task<IActionResult> CalculateScheduleGenetic(
    [FromQuery] string date,
    [FromQuery] int populationSize = 30,
    [FromQuery] int generations = 50,
    [FromQuery] double crossoverRate = 0.8,
    [FromQuery] double mutationRate = 0.2,
    [FromQuery] int cranes = 1)
```

- Fetches vessel data from **BackendAPI**
- Builds **Prolog facts dynamically** based on date and dock
- Executes genetic algorithm with **specified parameters**
- Parses and returns results in **JSON format**
- Handles both **single-dock** and **multi-dock** scenarios

### Frontend Integration

A dedicated user interface has been created with:

- **Parameter Controls**: Sliders for adjusting GA parameters (population, generations, rates, cranes)
- **Results Display**: Table showing vessel schedules with computed delays
- **Performance Metrics**: Execution time and total delay display
- **Dock-wise Summary**: Overview of vessel assignments per dock

---

## Computational Complexity

`O(g × p × n)` where:<br>• `g` = generations<br>• `p` = population size<br>• `n` = number of vessels

---

## Conclusion

The implementation of the **genetic algorithm** for **User Story 4.3.1** successfully extends the scheduling module with a flexible optimization approach. By leveraging **evolutionary mechanisms**, the system can now handle complex scheduling scenarios with multiple cranes and provide configurable trade-offs between solution quality and computation time

This enhancement empowers Logistics Operators to generate high-quality daily plans even under dynamic and resource-constrained environments.

## User Story 4.3.2

> As a Logistics Operator, I want the system to automatically select the most suitable scheduling algorithm (optimal, heuristic, or genetic) based on the problem size and available computation time, so that planning remains efficient and responsive in different operational contexts.

## User Story 4.3.3

> As a Port Authority Officer, I want the system to rebalance the distribution of approved Vessel Visit Notifications across available docks for a given day, so that dock assignments are optimized to minimize expected vessel departure delays while considering dock capacity and crane availability. 

## User Story 4.3.4

> As a Project Manager, I want the team to study the state of the art and potential applications of Robotics and Computer Vision in port logistics and administration, so that emerging technologies can be evaluated for future integration into the system.