:- dynamic generations/1.
:- dynamic population/1.
:- dynamic prob_crossover/1.
:- dynamic prob_mutation/1.
:- dynamic vessel/6.
:- dynamic dock_capacity/2.

% -------------------------------
% GENETIC ALGORITHM FOR VESSEL SCHEDULING
% -------------------------------

% API Endpoint: Configure GA parameters
api_configure_ga(NG, PS, PC, PM) :-
    retractall(generations(_)),
    retractall(population(_)),
    retractall(prob_crossover(_)),
    retractall(prob_mutation(_)),
    asserta(generations(NG)),
    asserta(population(PS)),
    PCValue is PC / 100,
    asserta(prob_crossover(PCValue)),
    PMValue is PM / 100,
    asserta(prob_mutation(PMValue)),
    format('GA Parameters configured: Generations=~w, Population=~w, Crossover=~w%, Mutation=~w%~n', [NG, PS, PC, PM]).

% API Endpoint: Solve with genetic algorithm (single crane)
api_solve_genetic(Solution, TotalDelay, ExecutionTime) :-
    statistics(walltime, [Start|_]),
    (generations(_) -> true; asserta(generations(100))),
    (population(_) -> true; asserta(population(50))),
    (prob_crossover(_) -> true; asserta(prob_crossover(0.8))),
    (prob_mutation(_) -> true; asserta(prob_mutation(0.2))),
    
    generate_population(Pop),
    evaluate_population(Pop, PopValue),
    order_population(PopValue, PopOrd),
    generations(NG),
    generate_generation(0, NG, PopOrd, BestSolution, BestDelay),
    
    statistics(walltime, [End|_]),
    ExecutionTime is (End - Start) / 1000,
    Solution = BestSolution,
    TotalDelay = BestDelay,
    format('Genetic Algorithm completed: Delay=~w, Time=~w seconds~n', [BestDelay, ExecutionTime]).

% Generate initial population
generate_population(Pop) :-
    population(PopSize),
    findall(V, vessel(V, _, _, _, _, _), VesselsList),
    length(VesselsList, NumT),
    generate_population(PopSize, VesselsList, NumT, Pop).

generate_population(0, _, _, []) :- !.
generate_population(PopSize, VesselsList, NumT, [Ind|Rest]) :-
    PopSize1 is PopSize - 1,
    generate_population(PopSize1, VesselsList, NumT, Rest),
    generate_individual(VesselsList, NumT, Ind),
    \+ member(Ind, Rest).
generate_population(PopSize, VesselsList, NumT, L) :-
    generate_population(PopSize, VesselsList, NumT, L).

% Generate a single individual
generate_individual([G], 1, [G]) :- !.
generate_individual(VesselsList, NumT, [G|Rest]) :-
    random(1, NumT, N),
    remove_nth(N, VesselsList, G, NewList),
    NumT1 is NumT - 1,
    generate_individual(NewList, NumT1, Rest).

remove_nth(1, [G|Rest], G, Rest).
remove_nth(N, [G1|Rest], G, [G1|Rest1]) :-
    N > 1,
    N1 is N - 1,
    remove_nth(N1, Rest, G, Rest1).

% Evaluate population
evaluate_population([], []).
evaluate_population([Ind|Rest], [Ind*V|Rest1]) :-
    evaluate_individual(Ind, V),
    evaluate_population(Rest, Rest1).

% Evaluate individual fitness (total delay)
evaluate_individual(Seq, TotalDelay) :-
    evaluate_individual(Seq, 0, TotalDelay).

evaluate_individual([], _, 0).
evaluate_individual([Vessel|Rest], CurrentTime, TotalDelay) :-
    vessel(Vessel, ETA, ETD, UnloadTime, LoadTime, MaxCranes),
    
    % Get available cranes (use min of MaxCranes and dock capacity)
    (dock_capacity(Vessel, DockCap) -> AvailableCranes = DockCap; AvailableCranes = 1),
    Cranes = min(MaxCranes, AvailableCranes),
    CranesUsed = max(1, Cranes),
    
    % Calculate processing time with available cranes
    UnloadTimePerCrane is ceiling(UnloadTime / CranesUsed),
    LoadTimePerCrane is ceiling(LoadTime / CranesUsed),
    ProcessingTime is UnloadTimePerCrane + LoadTimePerCrane,
    
    % Start time is max of current time and vessel ETA
    StartTime is max(CurrentTime, ETA),
    EndTime is StartTime + ProcessingTime,
    
    % Calculate delay
    (EndTime =< ETD -> Delay = 0; Delay is EndTime - ETD),
    
    % Recursive call
    NextTime is EndTime + 1, % Add buffer time
    evaluate_individual(Rest, NextTime, RestDelay),
    TotalDelay is Delay + RestDelay.

% Sort population by fitness (ascending delay)
order_population(PopValue, PopValueOrd) :-
    sort_population(PopValue, PopValueOrd).

sort_population([], []).
sort_population([Ind*Delay|Rest], Sorted) :-
    sort_population(Rest, SortedRest),
    insert_sorted(Ind*Delay, SortedRest, Sorted).

insert_sorted(Item, [], [Item]).
insert_sorted(Ind1*D1, [Ind2*D2|Rest], [Ind1*D1, Ind2*D2|Rest]) :-
    D1 =< D2, !.
insert_sorted(Item, [H|T], [H|Rest]) :-
    insert_sorted(Item, T, Rest).

% Generate generations
generate_generation(G, G, Pop, BestSolution, BestDelay) :- !,
    Pop = [BestSolution*BestDelay|_],
    format('Final Generation ~w: Best Delay = ~w~n', [G, BestDelay]).

generate_generation(N, G, Pop, BestSolution, BestDelay) :-
    Pop = [Best*Delay|_],
    format('Generation ~w: Best Delay = ~w~n', [N, Delay]),
    
    % Tournament selection
    select_parents(Pop, Parents),
    
    % Crossover
    crossover(Parents, NPop1),
    
    % Mutation
    mutate_population(NPop1, NPop),
    
    % Evaluate new population
    evaluate_population(NPop, NPopValue),
    order_population(NPopValue, NPopOrd),
    
    % Combine and keep best
    combine_populations(Pop, NPopOrd, Combined),
    order_population(Combined, NewPop),
    
    % Keep population size
    population(PopSize),
    take_first(PopSize, NewPop, NextPop),
    
    N1 is N + 1,
    generate_generation(N1, G, NextPop, BestSolution, BestDelay).

% Tournament selection (size 3)
select_parents(Pop, Parents) :-
    population(PopSize),
    select_parents(Pop, PopSize, [], Parents).

select_parents(_, 0, Acc, Acc) :- !.
select_parents(Pop, N, Acc, Parents) :-
    tournament_selection(Pop, Parent),
    N1 is N - 1,
    select_parents(Pop, N1, [Parent|Acc], Parents).

tournament_selection(Pop, Winner) :-
    length(Pop, Len),
    select_tournament(Pop, Len, 3, Candidates),
    sort_population(Candidates, [Winner|_]).

select_tournament(_, _, 0, []) :- !.
select_tournament(Pop, Len, N, [Candidate|Rest]) :-
    random(0, Len, Index),
    nth0(Index, Pop, Candidate),
    N1 is N - 1,
    select_tournament(Pop, Len, N1, Rest).

% Order crossover
crossover([], []).
crossover([Ind], [Ind]).
crossover([Ind1*_, Ind2*_|Rest], [Child1, Child2|Rest1]) :-
    prob_crossover(PC),
    random_float(PCrand),
    (PCrand < PC ->
        order_crossover(Ind1, Ind2, Child1),
        order_crossover(Ind2, Ind1, Child2)
    ;
        Child1 = Ind1,
        Child2 = Ind2
    ),
    crossover(Rest, Rest1).

order_crossover(Parent1, Parent2, Child) :-
    length(Parent1, Len),
    random(1, Len, P1),
    random(1, Len, P2),
    (P1 < P2 -> Start = P1, End = P2; Start = P2, End = P1),
    extract_segment(Parent1, Start, End, Segment),
    fill_with_parent2(Parent2, Segment, Child).

extract_segment(List, Start, End, Segment) :-
    extract_segment(List, 1, Start, End, [], Segment).

extract_segment([], _, _, _, Acc, Acc).
extract_segment([H|T], Pos, Start, End, Acc, Segment) :-
    (Pos >= Start, Pos =< End ->
        append(Acc, [H], NewAcc)
    ;
        NewAcc = Acc
    ),
    NextPos is Pos + 1,
    extract_segment(T, NextPos, Start, End, NewAcc, Segment).

fill_with_parent2(Parent2, Segment, Child) :-
    fill_with_parent2(Parent2, Segment, [], Child).

fill_with_parent2([], _, Child, Child).
fill_with_parent2([H|T], Segment, Acc, Child) :-
    (member(H, Segment) ->
        NewAcc = Acc
    ;
        append(Acc, [H], NewAcc)
    ),
    fill_with_parent2(T, Segment, NewAcc, Child).

% Mutation
mutate_population([], []).
mutate_population([Ind|Rest], [Mutated|Rest1]) :-
    prob_mutation(PM),
    random_float(PMrand),
    (PMrand < PM ->
        mutate_individual(Ind, Mutated)
    ;
        Mutated = Ind
    ),
    mutate_population(Rest, Rest1).

mutate_individual(Ind, Mutated) :-
    length(Ind, Len),
    random(1, Len, Pos1),
    random(1, Len, Pos2),
    Pos1 \= Pos2,
    swap_positions(Ind, Pos1, Pos2, Mutated).

swap_positions(List, Pos1, Pos2, Result) :-
    nth1(Pos1, List, Elem1),
    nth1(Pos2, List, Elem2),
    replace_pos(List, Pos1, Elem2, Temp),
    replace_pos(Temp, Pos2, Elem1, Result).

replace_pos([_|T], 1, X, [X|T]).
replace_pos([H|T], Pos, X, [H|R]) :-
    Pos > 1,
    Pos1 is Pos - 1,
    replace_pos(T, Pos1, X, R).

% Combine populations
combine_populations(OldPop, NewPop, Combined) :-
    append(OldPop, NewPop, All),
    sort_population(All, Sorted),
    remove_duplicates(Sorted, Combined).

remove_duplicates([], []).
remove_duplicates([Ind*Delay|Rest], Result) :-
    member(Ind*_, Rest), !,
    remove_duplicates(Rest, Result).
remove_duplicates([H|T], [H|Rest]) :-
    remove_duplicates(T, Rest).

take_first(0, _, []) :- !.
take_first(_, [], []) :- !.
take_first(N, [H|T], [H|Rest]) :-
    N > 0,
    N1 is N - 1,
    take_first(N1, T, Rest).

% Helper: Generate random float between 0 and 1
random_float(X) :- random(X).

% -------------------------------
% MULTI-CRANE GENETIC ALGORITHM
% -------------------------------

% API Endpoint: Solve with multi-crane genetic algorithm
api_solve_genetic_multi(Solution, TotalDelay, CraneHours, ExecutionTime) :-
    statistics(walltime, [Start|_]),
    (generations(_) -> true; asserta(generations(100))),
    (population(_) -> true; asserta(population(50))),
    (prob_crossover(_) -> true; asserta(prob_crossover(0.8))),
    (prob_mutation(_) -> true; asserta(prob_mutation(0.2))),
    
    generate_population(Pop),
    evaluate_population_multi(Pop, PopValue),
    order_population_multi(PopValue, PopOrd),
    generations(NG),
    generate_generation_multi(0, NG, PopOrd, BestSolution, BestDelay, BestCraneHours),
    
    statistics(walltime, [End|_]),
    ExecutionTime is (End - Start) / 1000,
    Solution = BestSolution,
    TotalDelay = BestDelay,
    CraneHours = BestCraneHours,
    format('Multi-Crane Genetic Algorithm completed: Delay=~w, CraneHours=~w, Time=~w seconds~n', [BestDelay, BestCraneHours, ExecutionTime]).

% Evaluate individual for multi-crane (considers crane hours)
evaluate_individual_multi(Seq, TotalDelay, CraneHours) :-
    evaluate_individual_multi(Seq, 0, 0, TotalDelay, CraneHours).

evaluate_individual_multi([], _, AccCH, 0, AccCH).
evaluate_individual_multi([Vessel|Rest], CurrentTime, AccCH, TotalDelay, CraneHours) :-
    vessel(Vessel, ETA, ETD, UnloadTime, LoadTime, MaxCranes),
    
    % Get available cranes
    (dock_capacity(Vessel, DockCap) -> AvailableCranes = DockCap; AvailableCranes = MaxCranes),
    Cranes = min(MaxCranes, AvailableCranes),
    
    % Calculate processing time with multiple cranes
    UnloadTimePerCrane is ceiling(UnloadTime / Cranes),
    LoadTimePerCrane is ceiling(LoadTime / Cranes),
    ProcessingTime is UnloadTimePerCrane + LoadTimePerCrane,
    
    % Calculate crane hours used
    CraneHoursUsed is Cranes * ProcessingTime,
    
    % Start time calculation
    StartTime is max(CurrentTime, ETA),
    EndTime is StartTime + ProcessingTime,
    
    % Calculate delay
    (EndTime =< ETD -> Delay = 0; Delay is EndTime - ETD),
    
    % Recursive call
    NextTime is EndTime + 1,
    NewAccCH is AccCH + CraneHoursUsed,
    evaluate_individual_multi(Rest, NextTime, NewAccCH, RestDelay, CraneHours),
    TotalDelay is Delay + RestDelay.

% Evaluate population for multi-crane
evaluate_population_multi([], []).
evaluate_population_multi([Ind|Rest], [Ind*Delay*CH|Rest1]) :-
    evaluate_individual_multi(Ind, Delay, CH),
    evaluate_population_multi(Rest, Rest1).

% Sort by delay, then crane hours
order_population_multi(PopValue, PopValueOrd) :-
    sort_population_multi(PopValue, PopValueOrd).

sort_population_multi([], []).
sort_population_multi([Ind*Delay*CH|Rest], Sorted) :-
    sort_population_multi(Rest, SortedRest),
    insert_sorted_multi(Ind*Delay*CH, SortedRest, Sorted).

insert_sorted_multi(Item, [], [Item]).
insert_sorted_multi(Ind1*D1*CH1, [Ind2*D2*CH2|Rest], [Ind1*D1*CH1, Ind2*D2*CH2|Rest]) :-
    (D1 < D2; (D1 =:= D2, CH1 =< CH2)), !.
insert_sorted_multi(Item, [H|T], [H|Rest]) :-
    insert_sorted_multi(Item, T, Rest).

% Generate generations for multi-crane
generate_generation_multi(G, G, Pop, BestSolution, BestDelay, BestCraneHours) :- !,
    Pop = [BestSolution*BestDelay*BestCraneHours|_].

generate_generation_multi(N, G, Pop, BestSolution, BestDelay, BestCraneHours) :-
    Pop = [Best*Delay*CraneHours|_],
    select_parents(Pop, Parents),
    crossover(Parents, NPop1),
    mutate_population(NPop1, NPop),
    evaluate_population_multi(NPop, NPopValue),
    order_population_multi(NPopValue, NPopOrd),
    combine_populations_multi(Pop, NPopOrd, Combined),
    order_population_multi(Combined, NewPop),
    population(PopSize),
    take_first(PopSize, NewPop, NextPop),
    N1 is N + 1,
    generate_generation_multi(N1, G, NextPop, BestSolution, BestDelay, BestCraneHours).

combine_populations_multi(OldPop, NewPop, Combined) :-
    append(OldPop, NewPop, All),
    sort_population_multi(All, Sorted),
    remove_duplicates_multi(Sorted, Combined).

remove_duplicates_multi([], []).
remove_duplicates_multi([Ind*Delay*CH|Rest], Result) :-
    member(Ind*_*_, Rest), !,
    remove_duplicates_multi(Rest, Result).
remove_duplicates_multi([H|T], [H|Rest]) :-
    remove_duplicates_multi(T, Rest).

% -------------------------------
% SIMPLE TEST DATA
% -------------------------------

% Test with sample data
test_genetic :-
    retractall(vessel(_,_,_,_,_,_)),
    retractall(dock_capacity(_,_)),
    
    % Test vessels
    asserta(vessel(v1, 6, 20, 10, 10, 2)),
    asserta(vessel(v2, 8, 25, 8, 8, 3)),
    asserta(vessel(v3, 10, 30, 12, 10, 2)),
    asserta(vessel(v4, 12, 35, 6, 8, 1)),
    
    % Dock capacities
    asserta(dock_capacity(v1, 3)),
    asserta(dock_capacity(v2, 3)),
    asserta(dock_capacity(v3, 3)),
    asserta(dock_capacity(v4, 3)),
    
    api_configure_ga(50, 30, 80, 20),
    api_solve_genetic(Solution, Delay, Time),
    format('Test Solution: ~w~n', [Solution]),
    format('Total Delay: ~w hours~n', [Delay]),
    format('Execution Time: ~w seconds~n', [Time]).

test_genetic_multi :-
    retractall(vessel(_,_,_,_,_,_)),
    retractall(dock_capacity(_,_)),
    
    % Test vessels
    asserta(vessel(v1, 6, 20, 10, 10, 2)),
    asserta(vessel(v2, 8, 25, 8, 8, 3)),
    asserta(vessel(v3, 10, 30, 12, 10, 2)),
    asserta(vessel(v4, 12, 35, 6, 8, 1)),
    
    % Dock capacities
    asserta(dock_capacity(v1, 3)),
    asserta(dock_capacity(v2, 3)),
    asserta(dock_capacity(v3, 3)),
    asserta(dock_capacity(v4, 3)),
    
    api_configure_ga(50, 30, 80, 20),
    api_solve_genetic_multi(Solution, Delay, CraneHours, Time),
    format('Test Solution: ~w~n', [Solution]),
    format('Total Delay: ~w hours~n', [Delay]),
    format('Crane Hours: ~w~n', [CraneHours]),
    format('Execution Time: ~w seconds~n', [Time]).