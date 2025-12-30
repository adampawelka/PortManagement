
% Genetic Algorithm for Vessel Scheduling

:- dynamic vessel/5.
:- dynamic crane_capacity/1.
:- dynamic multiple_cranes/1.

% GA parameters
:- dynamic population_size/1.
:- dynamic generations/1.
:- dynamic crossover_prob/1.
:- dynamic mutation_prob/1.

% Initialize default parameters
default_parameters :-
    retractall(population_size(_)), asserta(population_size(30)),
    retractall(generations(_)), asserta(generations(50)),
    retractall(crossover_prob(_)), asserta(crossover_prob(0.8)),
    retractall(mutation_prob(_)), asserta(mutation_prob(0.2)),
    retractall(multiple_cranes(_)), asserta(multiple_cranes(1)).

% Fitness function - simpler version
fitness(Sequence, TotalDelay) :-
    calculate_delay(Sequence, 0, TotalDelay).

calculate_delay([], _, 0).
calculate_delay([Vessel|Rest], CurrentTime, TotalDelay) :-
    vessel(Vessel, ETA, ETD, UnloadTime, LoadTime),
    multiple_cranes(NumCranes),
    
    % Adjust processing time for multiple cranes
    AdjustedTime is ((UnloadTime + LoadTime) + NumCranes - 1) // NumCranes,
    
    StartTime is max(ETA, CurrentTime),
    EndTime is StartTime + AdjustedTime,
    Delay is max(0, EndTime - ETD),
    calculate_delay(Rest, EndTime + 1, RestDelay),
    TotalDelay is Delay + RestDelay.

% Generate initial population - simpler
generate_population(Population) :-
    population_size(Size),
    findall(V, vessel(V, _, _, _, _), Vessels),
    length(Vessels, NumVessels),
    (NumVessels > 0 ->
        generate_population(Size, Vessels, Population, [])
    ;
        Population = []
    ).

generate_population(0, _, Population, Population) :- !.
generate_population(Size, Vessels, FinalPopulation, Acc) :-
    random_permutation(Vessels, Shuffled),
    (member(Shuffled, Acc) ->
        generate_population(Size, Vessels, FinalPopulation, Acc)
    ;
        Size1 is Size - 1,
        generate_population(Size1, Vessels, FinalPopulation, [Shuffled|Acc])
    ).

% Evaluate population
evaluate_population([], []).
evaluate_population([Ind|Rest], [Ind*Fitness|RestEval]) :-
    fitness(Ind, Fitness),
    evaluate_population(Rest, RestEval).

% Sort population
sort_population(PopEval, Sorted) :-
    sort_pop(PopEval, Sorted).

sort_pop([], []).
sort_pop([X*VX|Xs], Sorted) :-
    sort_pop(Xs, Temp),
    insert_sorted(X*VX, Temp, Sorted).

insert_sorted(Item*Val, [], [Item*Val]).
insert_sorted(Item*Val, [X*VX|Rest], [Item*Val, X*VX|Rest]) :-
    Val =< VX, !.
insert_sorted(Item*Val, [X|Rest], [X|RestSorted]) :-
    insert_sorted(Item*Val, Rest, RestSorted).

% Tournament selection - simpler
tournament_selection(PopEval, Selected) :-
    population_size(Size),
    tournament_selection(PopEval, Size, Selected).

tournament_selection(_, 0, []) :- !.
tournament_selection(PopEval, N, [Winner|Rest]) :-
    select_random(PopEval, Winner),
    N1 is N - 1,
    tournament_selection(PopEval, N1, Rest).

select_random(PopEval, Winner) :-
    length(PopEval, Len),
    random(0, Len, Index),
    nth0(Index, PopEval, Winner).

% Simple crossover: take first half from parent1, rest from parent2
simple_crossover(Parent1, Parent2, Child) :-
    length(Parent1, Len),
    Half is Len // 2,
    take_first(Parent1, Half, FirstHalf),
    take_remaining(Parent2, FirstHalf, Child).

take_first(List, N, FirstN) :-
    take_first(List, N, [], FirstNRev),
    reverse(FirstNRev, FirstN).

take_first(_, 0, Acc, Acc) :- !.
take_first([H|T], N, Acc, Result) :-
    N > 0,
    N1 is N - 1,
    take_first(T, N1, [H|Acc], Result).

take_remaining(Parent, Used, Child) :-
    take_remaining(Parent, Used, [], ChildRev),
    reverse(ChildRev, Child).

take_remaining([], _, Acc, Acc).
take_remaining([H|T], Used, Acc, Child) :-
    (member(H, Used) ->
        take_remaining(T, Used, Acc, Child)
    ;
        take_remaining(T, Used, [H|Acc], Child)
    ).

% Simple mutation: swap two random positions
simple_mutation(Individual, Mutated) :-
    length(Individual, Len),
    Len > 1,
    random(0, Len, Pos1),
    random(0, Len, Pos2),
    Pos1 \= Pos2,
    swap_at_positions(Individual, Pos1, Pos2, Mutated).

swap_at_positions(List, Pos1, Pos2, Result) :-
    swap_at_positions(List, Pos1, Pos2, 0, [], Result).

swap_at_positions([], _, _, _, Acc, Acc).
swap_at_positions([H|T], Pos1, Pos2, Index, Acc, Result) :-
    (Index =:= Pos1 ->
        nth0(Pos2, [H|T], Elem2),
        swap_at_positions(T, Pos1, Pos2, Index+1, [Elem2|Acc], Result)
    ; Index =:= Pos2 ->
        nth0(Pos1, [H|T], Elem1),
        swap_at_positions(T, Pos1, Pos2, Index+1, [Elem1|Acc], Result)
    ;
        swap_at_positions(T, Pos1, Pos2, Index+1, [H|Acc], Result)
    ).

% Main GA function
solve_genetic(Solution, TotalDelay) :-
    default_parameters,
    
    % Generate initial population
    generate_population(Population),
    
    % Evaluate
    evaluate_population(Population, PopEval),
    
    % Sort
    sort_population(PopEval, Sorted),
    
    % Run generations
    generations(MaxGen),
    run_generations(Sorted, MaxGen, 0, FinalPop),
    
    % Get best solution
    FinalPop = [Best*BestDelay|_],
    Solution = Best,
    TotalDelay = BestDelay.

run_generations(Population, MaxGen, CurrentGen, FinalPop) :-
    CurrentGen >= MaxGen, !,
    FinalPop = Population.
run_generations(Population, MaxGen, CurrentGen, FinalPop) :-
    % Selection
    tournament_selection(Population, Selected),
    
    % Crossover
    crossover_prob(CP),
    apply_crossover(Selected, CP, Crossed),
    
    % Mutation
    mutation_prob(MP),
    apply_mutation(Crossed, MP, Mutated),
    
    % Evaluate
    evaluate_population(Mutated, MutatedEval),
    
    % Combine and sort
    append(Population, MutatedEval, Combined),
    sort_population(Combined, Sorted),
    
    % Keep best
    population_size(Size),
    (length(Sorted, Len), Len > Size ->
        length(Kept, Size),
        append(Kept, _, Sorted),
        NewPopulation = Kept
    ;
        NewPopulation = Sorted
    ),
    
    % Next generation
    NextGen is CurrentGen + 1,
    run_generations(NewPopulation, MaxGen, NextGen, FinalPop).

apply_crossover([], _, []).
apply_crossover([Ind], _, [Ind]).
apply_crossover([P1*_, P2*_|Rest], CP, [C1, C2|RestCrossed]) :-
    random(0.0, 1.0, Rand),
    (Rand < CP ->
        simple_crossover(P1, P2, C1),
        simple_crossover(P2, P1, C2)
    ;
        C1 = P1, C2 = P2
    ),
    apply_crossover(Rest, CP, RestCrossed).

apply_mutation([], _, []).
apply_mutation([Ind|Rest], MP, [Mutated|RestMutated]) :-
    random(0.0, 1.0, Rand),
    (Rand < MP ->
        simple_mutation(Ind, Mutated)
    ;
        Mutated = Ind
    ),
    apply_mutation(Rest, MP, RestMutated).

% Main entry points
solve_genetic_schedule(Solution, TotalDelay, CranesUsed) :-
    multiple_cranes(CranesUsed),
    solve_genetic(Solution, TotalDelay).

solve_genetic_with_params(PopSize, NumGenerations, CrossoverRate, MutationRate, Cranes, Solution, TotalDelay) :-
    retractall(population_size(_)), asserta(population_size(PopSize)),
    retractall(generations(_)), asserta(generations(NumGenerations)),
    retractall(crossover_prob(_)), asserta(crossover_prob(CrossoverRate)),
    retractall(mutation_prob(_)), asserta(mutation_prob(MutationRate)),
    retractall(multiple_cranes(_)), asserta(multiple_cranes(Cranes)),
    solve_genetic(Solution, TotalDelay).