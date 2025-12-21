:- dynamic generations/1.
:- dynamic population/1.
:- dynamic prob_crossover/1.
:- dynamic prob_mutation/1.
:- dynamic max_time/1.
:- dynamic desired_delay/1.
:- dynamic vessel/5.
:- dynamic vessel_multi/6.

% Genetic Algorithm for Vessel Scheduling
% ----------------------------------------
% Parameters initialization for GA
initialize_ga_params :-
    write('Number of generations: '), read(NG),
    (retract(generations(_)); true), asserta(generations(NG)),
    write('Population size: '), read(PS),
    (retract(population(_)); true), asserta(population(PS)),
    write('Crossover probability (%): '), read(P1),
    PC is P1/100,
    (retract(prob_crossover(_)); true), asserta(prob_crossover(PC)),
    write('Mutation probability (%): '), read(P2),
    PM is P2/100,
    (retract(prob_mutation(_)); true), asserta(prob_mutation(PM)),
    write('Max computation time (seconds): '), read(MT),
    (retract(max_time(_)); true), asserta(max_time(MT)),
    write('Desired maximum total delay: '), read(D),
    (retract(desired_delay(_)); true), asserta(desired_delay(D)).

% Main genetic algorithm entry point
% Mode: single (1 crane) or multi (multiple cranes)
solve_genetic(Mode, Solution, TotalDelay, ComputationTime) :-
    statistics(runtime, [Start|_]),
    (Mode == single -> 
        findall(vessel(Name, ETA, ETD, Unload, Load), 
                vessel(Name, ETA, ETD, Unload, Load), Vessels),
        solve_genetic_single(Vessels, Solution, TotalDelay)
    ; 
        findall(vessel_multi(Name, ETA, ETD, Unload, Load, MaxCranes), 
                vessel_multi(Name, ETA, ETD, Unload, Load, MaxCranes), Vessels),
        solve_genetic_multi(Vessels, Solution, TotalDelay)
    ),
    statistics(runtime, [End|_]),
    ComputationTime is (End - Start) / 1000.

% Genetic Algorithm for Single Crane
solve_genetic_single(Vessels, Solution, TotalDelay) :-
    initialize_ga_params,
    % Convert vessels list to individual representation
    findall(Name, member(vessel(Name,_,_,_,_), Vessels), VesselNames),
    length(VesselNames, NumVessels),
    
    % Generate initial population
    population(PopSize),
    generate_population(PopSize, VesselNames, NumVessels, InitialPop),
    
    % Evaluate initial population
    evaluate_population_single(InitialPop, Vessels, PopWithFitness),
    order_population(PopWithFitness, OrderedPop),
    
    % Run evolution
    generations(MaxGens),
    max_time(TimeLimit),
    desired_delay(DesiredDelay),
    evolve(OrderedPop, MaxGens, TimeLimit, DesiredDelay, FinalPop, Vessels, single),
    
    % Get best solution
    get_best_solution(FinalPop, BestSequence),
    Solution = BestSequence,
    
    % Calculate delay for the best solution
    evaluate_sequence_single(BestSequence, Vessels, TotalDelay).

% Genetic Algorithm for Multiple Cranes
solve_genetic_multi(Vessels, Solution, TotalDelay) :-
    initialize_ga_params,
    % Convert vessels list to individual representation
    findall(Name, member(vessel_multi(Name,_,_,_,_,_), Vessels), VesselNames),
    length(VesselNames, NumVessels),
    
    % Generate initial population
    population(PopSize),
    generate_population(PopSize, VesselNames, NumVessels, InitialPop),
    
    % Evaluate initial population
    evaluate_population_multi(InitialPop, Vessels, PopWithFitness),
    order_population(PopWithFitness, OrderedPop),
    
    % Run evolution
    generations(MaxGens),
    max_time(TimeLimit),
    desired_delay(DesiredDelay),
    evolve(OrderedPop, MaxGens, TimeLimit, DesiredDelay, FinalPop, Vessels, multi),
    
    % Get best solution
    get_best_solution(FinalPop, BestSequence),
    Solution = BestSequence,
    
    % Calculate delay for the best solution
    evaluate_sequence_multi(BestSequence, Vessels, TotalDelay).

% Generate population of individuals
generate_population(0, _, _, []) :- !.
generate_population(PopSize, VesselNames, NumVessels, [Ind|Rest]) :-
    PopSize1 is PopSize - 1,
    generate_population(PopSize1, VesselNames, NumVessels, Rest),
    generate_individual(VesselNames, NumVessels, Ind),
    not(member(Ind, Rest)).
generate_population(PopSize, VesselNames, NumVessels, L) :-
    generate_population(PopSize, VesselNames, NumVessels, L).

% Generate a random individual (permutation of vessel names)
generate_individual([G], 1, [G]) :- !.
generate_individual(VesselNames, NumVessels, [G|Rest]) :-
    NumTemp is NumVessels + 1,
    random(1, NumTemp, N),
    remove(N, VesselNames, G, NewList),
    NumVessels1 is NumVessels - 1,
    generate_individual(NewList, NumVessels1, Rest).

% Remove element from list
remove(1, [G|Rest], G, Rest).
remove(N, [G1|Rest], G, [G1|Rest1]) :-
    N1 is N - 1,
    remove(N1, Rest, G, Rest1).

% Evaluate population for single crane
evaluate_population_single([], _, []).
evaluate_population_single([Ind|Rest], Vessels, [Ind*V|Rest1]) :-
    evaluate_sequence_single(Ind, Vessels, V),
    evaluate_population_single(Rest, Vessels, Rest1).

% Evaluate population for multiple cranes
evaluate_population_multi([], _, []).
evaluate_population_multi([Ind|Rest], Vessels, [Ind*V|Rest1]) :-
    evaluate_sequence_multi(Ind, Vessels, V),
    evaluate_population_multi(Rest, Vessels, Rest1).

% Evaluate a sequence for single crane
evaluate_sequence_single(Sequence, Vessels, TotalDelay) :-
    evaluate_sequence_single(Sequence, Vessels, 0, 0, TotalDelay).

evaluate_sequence_single([], _, _, Delay, Delay).
evaluate_sequence_single([VesselName|Rest], Vessels, CurrentTime, AccDelay, TotalDelay) :-
    member(vessel(VesselName, ETA, ETD, Unload, Load), Vessels),
    StartTime is max(CurrentTime, ETA),
    FinishTime is StartTime + Unload + Load,
    VesselDelay is max(0, FinishTime - ETD),
    NewAccDelay is AccDelay + VesselDelay,
    evaluate_sequence_single(Rest, Vessels, FinishTime, NewAccDelay, TotalDelay).

% Evaluate a sequence for multiple cranes
evaluate_sequence_multi(Sequence, Vessels, TotalDelay) :-
    evaluate_sequence_multi(Sequence, Vessels, 0, 0, TotalDelay).

evaluate_sequence_multi([], _, _, Delay, Delay).
evaluate_sequence_multi([VesselName|Rest], Vessels, CurrentTime, AccDelay, TotalDelay) :-
    member(vessel_multi(VesselName, ETA, ETD, Unload, Load, MaxCranes), Vessels),
    % Use optimal crane allocation (max cranes up to MaxCranes)
    CranesUsed is min(3, MaxCranes), % Use up to 3 cranes or MaxCranes, whichever is smaller
    UnloadTime is ceil(Unload / CranesUsed),
    LoadTime is ceil(Load / CranesUsed),
    StartTime is max(CurrentTime, ETA),
    FinishTime is StartTime + UnloadTime + LoadTime,
    VesselDelay is max(0, FinishTime - ETD),
    NewAccDelay is AccDelay + VesselDelay,
    evaluate_sequence_multi(Rest, Vessels, FinishTime, NewAccDelay, TotalDelay).

% Order population by fitness (ascending - lower delay is better)
order_population(Population, Ordered) :-
    sort_population(Population, Ordered).

sort_population([], []).
sort_population([X|Xs], Ys) :-
    sort_population(Xs, Zs),
    insert_sorted(X, Zs, Ys).

insert_sorted(Ind*Val, [], [Ind*Val]).
insert_sorted(Ind1*Val1, [Ind2*Val2|Rest], [Ind1*Val1, Ind2*Val2|Rest]) :-
    Val1 =< Val2, !.
insert_sorted(Ind1*Val1, [Ind2*Val2|Rest], [Ind2*Val2|Rest1]) :-
    insert_sorted(Ind1*Val1, Rest, Rest1).

% Evolution process with multiple stopping conditions
evolve(Population, 0, _, _, Population, _, _) :- !.
evolve(Population, GensLeft, TimeLimit, DesiredDelay, FinalPopulation, Vessels, Mode) :-
    statistics(runtime, [CurrentTime|_]),
    (CurrentTime > TimeLimit * 1000 ->
        FinalPopulation = Population
    ;
        % Selection
        select_parents(Population, Parents),
        
        % Crossover
        prob_crossover(PC),
        crossover(Parents, PC, Offspring),
        
        % Mutation
        prob_mutation(PM),
        mutate(Offspring, PM, MutatedOffspring),
        
        % Evaluate offspring
        (Mode == single ->
            evaluate_population_single(MutatedOffspring, Vessels, EvaluatedOffspring)
        ;
            evaluate_population_multi(MutatedOffspring, Vessels, EvaluatedOffspring)
        ),
        
        % Combine and select survivors
        combine_populations(Population, EvaluatedOffspring, Combined),
        order_population(Combined, OrderedCombined),
        population(PopSize),
        take_first(PopSize, OrderedCombined, NewPopulation),
        
        % Check if weve reached desired delay
        get_best_fitness(NewPopulation, BestDelay),
        (BestDelay =< DesiredDelay ->
            FinalPopulation = NewPopulation
        ;
            GensLeft1 is GensLeft - 1,
            evolve(NewPopulation, GensLeft1, TimeLimit, DesiredDelay, FinalPopulation, Vessels, Mode)
        )
    ).
    
% Tournament selection
select_parents(Population, Parents) :-
    length(Population, Size),
    TournamentSize is min(3, Size), % Tournament size of 3
    select_parents_tournament(Population, TournamentSize, Parents).

select_parents_tournament(Population, _, []) :- length(Population, L), L < 2, !.
select_parents_tournament(Population, TSize, [Parent1, Parent2|Rest]) :-
    random_select_tournament(Population, TSize, Parent1),
    random_select_tournament(Population, TSize, Parent2),
    select_parents_tournament(Population, TSize, Rest).

random_select_tournament(Population, TSize, Winner) :-
    random_select_n(TSize, Population, Tournament),
    get_best_solution(Tournament, Winner).

random_select_n(0, _, []) :- !.
random_select_n(N, List, [X|Rest]) :-
    length(List, Len),
    random(1, Len+1, Index),
    nth1(Index, List, X),
    delete(List, X, NewList),
    N1 is N - 1,
    random_select_n(N1, NewList, Rest).

% Order crossover (OX1)
crossover([], _, []).
crossover([Ind1, Ind2|Rest], PC, [Child1, Child2|RestChildren]) :-
    random(0.0, 1.0, Rand),
    (Rand < PC ->
        length(Ind1, Len),
        random(1, Len, P1),
        random(P1, Len, P2),
        ox_crossover(Ind1, Ind2, P1, P2, Child1),
        ox_crossover(Ind2, Ind1, P1, P2, Child2)
    ;
        Child1 = Ind1,
        Child2 = Ind2
    ),
    crossover(Rest, PC, RestChildren).

ox_crossover(Parent1, Parent2, P1, P2, Child) :-
    extract_segment(Parent1, P1, P2, Segment),
    length(Parent1, Len),
    rotate_right(Parent2, Len-P2, Rotated),
    remove_elements(Rotated, Segment, Remaining),
    insert_segment(Remaining, Segment, P1, Child).

extract_segment(List, Start, End, Segment) :-
    findall(X, (between(Start, End, I), nth1(I, List, X)), Segment).

rotate_right(List, K, Rotated) :-
    length(List, Len),
    K1 is K mod Len,
    split_list(List, Len-K1, First, Second),
    append(Second, First, Rotated).

split_list(List, N, First, Second) :-
    length(First, N),
    append(First, Second, List).

remove_elements([], _, []).
remove_elements([X|Rest], Segment, Result) :-
    (member(X, Segment) ->
        remove_elements(Rest, Segment, Result)
    ;
        Result = [X|ResultRest],
        remove_elements(Rest, Segment, ResultRest)
    ).

insert_segment(List, Segment, Position, Result) :-
    split_at_position(List, Position-1, First, Second),
    append([First, Segment, Second], Result).

split_at_position(List, 0, [], List) :- !.
split_at_position([X|Rest], N, [X|First], Second) :-
    N > 0,
    N1 is N - 1,
    split_at_position(Rest, N1, First, Second).

% Mutation: swap two positions
mutate([], _, []).
mutate([Ind|Rest], PM, [Mutated|RestMutated]) :-
    random(0.0, 1.0, Rand),
    (Rand < PM ->
        length(Ind, Len),
        random(1, Len+1, Pos1),
        random(1, Len+1, Pos2),
        swap_positions(Ind, Pos1, Pos2, Mutated)
    ;
        Mutated = Ind
    ),
    mutate(Rest, PM, RestMutated).

swap_positions(List, Pos1, Pos2, Result) :-
    nth1(Pos1, List, Elem1),
    nth1(Pos2, List, Elem2),
    replace_pos(List, Pos1, Elem2, Temp),
    replace_pos(Temp, Pos2, Elem1, Result).

replace_pos(List, Pos, Elem, Result) :-
    findall(X, (between(1, Pos-1, I), nth1(I, List, X)), Before),
    findall(X, (between(Pos+1, 100, I), nth1(I, List, X)), After),
    append([Before, [Elem], After], Result).

% Combine populations
combine_populations(Pop1, Pop2, Combined) :-
    append(Pop1, Pop2, Combined).

% Get best solution from population
get_best_solution([Ind*_|_], Ind).

% Get best fitness from population
get_best_fitness([_*Delay|_], Delay).

% Take first N elements
take_first(0, _, []) :- !.
take_first(N, [X|Rest], [X|Taken]) :-
    N > 0,
    N1 is N - 1,
    take_first(N1, Rest, Taken).

% Utility predicates
ceil(X, Y) :- Y is integer(X + 0.9999999999).

% API endpoint for external calls
solve_genetic_api(Mode, Solution, TotalDelay, ComputationTime) :-
    % Default parameters if not initialized
    (generations(_) -> true ; asserta(generations(100))),
    (population(_) -> true ; asserta(population(50))),
    (prob_crossover(_) -> true ; asserta(prob_crossover(0.8))),
    (prob_mutation(_) -> true ; asserta(prob_mutation(0.1))),
    (max_time(_) -> true ; asserta(max_time(10))),
    (desired_delay(_) -> true ; asserta(desired_delay(0))),
    
    solve_genetic(Mode, Solution, TotalDelay, ComputationTime).