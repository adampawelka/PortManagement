:- dynamic generations/1.
:- dynamic population/1.
:- dynamic prob_crossover/1.
:- dynamic prob_mutation/1.
:- dynamic vessel/6.
:- dynamic dock_capacity/2.

% -------------------------------
% GENETIC ALGORITHM FOR VESSEL SCHEDULING
% -------------------------------

% Parameters initialization for GA
initialize_ga_params(NG, PS, PC, PM) :-
    (retract(generations(_)); true), asserta(generations(NG)),
    (retract(population(_)); true), asserta(population(PS)),
    PCValue is PC/100,
    (retract(prob_crossover(_)); true), asserta(prob_crossover(PCValue)),
    PMValue is PM/100,
    (retract(prob_mutation(_)); true), asserta(prob_mutation(PMValue)).

% Main entry point for genetic algorithm scheduling
solve_genetic(Solution, TotalDelay, ExecutionTime) :-
    statistics(walltime, [Start|_]),
    initialize_default_params,
    generate_population(Pop),
    evaluate_population(Pop, PopValue),
    order_population(PopValue, PopOrd),
    generations(NG),
    generate_generation(0, NG, PopOrd, BestSolution, BestDelay),
    statistics(walltime, [End|_]),
    ExecutionTime is (End - Start) / 1000, % Convert to seconds
    Solution = BestSolution,
    TotalDelay = BestDelay.

% Default parameters if not specified
initialize_default_params :-
    (generations(_) -> true; asserta(generations(100))),
    (population(_) -> true; asserta(population(50))),
    (prob_crossover(_) -> true; asserta(prob_crossover(0.8))),
    (prob_mutation(_) -> true; asserta(prob_mutation(0.2))).

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
    not(member(Ind, Rest)).
generate_population(PopSize, VesselsList, NumT, L) :-
    generate_population(PopSize, VesselsList, NumT, L).

% Generate a single individual (chromosome)
generate_individual([G], 1, [G]) :- !.
generate_individual(VesselsList, NumT, [G|Rest]) :-
    NumTemp is NumT + 1,
    random(1, NumTemp, N),
    remove(N, VesselsList, G, NewList),
    NumT1 is NumT - 1,
    generate_individual(NewList, NumT1, Rest).

% Remove element from list
remove(1, [G|Rest], G, Rest).
remove(N, [G1|Rest], G, [G1|Rest1]) :-
    N1 is N - 1,
    remove(N1, Rest, G, Rest1).

% Evaluate population fitness
evaluate_population([], []).
evaluate_population([Ind|Rest], [Ind*V|Rest1]) :-
    evaluate_individual(Ind, V),
    evaluate_population(Rest, Rest1).

% Evaluate individual (chromosome) - calculates total delay
evaluate_individual(Seq, TotalDelay) :-
    evaluate_individual(Seq, 0, 0, TotalDelay).

evaluate_individual([], _, CurrentTime, 0).
evaluate_individual([Vessel|Rest], CraneIndex, CurrentTime, TotalDelay) :-
    vessel(Vessel, ETA, ETD, UnloadTime, LoadTime, MaxCranes),
    (dock_capacity(Vessel, DockCap) -> true; DockCap = 1),
    
    % Calculate actual processing time considering crane allocation
    AvailableCranes is min(MaxCranes, DockCap),
    EffectiveCranes is max(1, AvailableCranes),
    ProcessingTime is ceil((UnloadTime + LoadTime) / EffectiveCranes),
    
    % Start time is max of current time and vessel ETA
    StartTime is max(CurrentTime, ETA),
    EndTime is StartTime + ProcessingTime,
    
    % Calculate delay for this vessel
    (EndTime =< ETD -> Delay = 0; Delay is EndTime - ETD),
    
    % Recursively evaluate rest of sequence
    NextTime is EndTime + 1, % Add setup time between vessels
    evaluate_individual(Rest, CraneIndex, NextTime, RestDelay),
    
    TotalDelay is Delay + RestDelay.

% Order population by fitness (ascending - lower delay is better)
order_population(PopValue, PopValueOrd) :-
    bsort(PopValue, PopValueOrd).

bsort([X], [X]) :- !.
bsort([X|Xs], Ys) :-
    bsort(Xs, Zs),
    bchange([X|Zs], Ys).

bchange([X], [X]) :- !.
bchange([X*VX, Y*VY|L1], [Y*VY|L2]) :-
    VX > VY, !,
    bchange([X*VX|L1], L2).
bchange([X|L1], [X|L2]) :-
    bchange(L1, L2).

% Generate new generations
generate_generation(G, G, Pop, BestSolution, BestDelay) :- !,
    Pop = [BestSolution*BestDelay|_],
    write('Final Generation '), write(G), write(': '),
    write('Best Delay = '), write(BestDelay), nl.

generate_generation(N, G, Pop, BestSolution, BestDelay) :-
    write('Generation '), write(N), write(': '),
    Pop = [Best*Delay|_],
    write('Best Delay = '), write(Delay), nl,
    
    % Selection, crossover, mutation
    select_parents(Pop, Parents),
    crossover(Parents, NPop1),
    mutation(NPop1, NPop),
    
    % Evaluate new population
    evaluate_population(NPop, NPopValue),
    order_population(NPopValue, NPopOrd),
    
    % Combine old and new populations, keep best
    combine_populations(Pop, NPopOrd, Combined),
    order_population(Combined, NewPop),
    
    % Keep only population size
    population(PopSize),
    take(PopSize, NewPop, NextPop),
    
    N1 is N + 1,
    generate_generation(N1, G, NextPop, BestSolution, BestDelay).

% Tournament selection
select_parents(Pop, Parents) :-
    population(PopSize),
    TournamentSize is 3,
    select_parents_helper(Pop, PopSize, TournamentSize, Parents).

select_parents_helper(_, 0, _, []) :- !.
select_parents_helper(Pop, N, TournamentSize, [Parent|Rest]) :-
    select_tournament(Pop, TournamentSize, Parent),
    N1 is N - 1,
    select_parents_helper(Pop, N1, TournamentSize, Rest).

select_tournament(Pop, TournamentSize, Winner) :-
    length(Pop, PopLen),
    select_tournament_members(Pop, TournamentSize, PopLen, Members),
    sort_by_fitness(Members, SortedMembers),
    SortedMembers = [Winner|_].

select_tournament_members(_, 0, _, []) :- !.
select_tournament_members(Pop, N, PopLen, [Member|Rest]) :-
    random(0, PopLen, Index),
    nth0(Index, Pop, Member),
    N1 is N - 1,
    select_tournament_members(Pop, N1, PopLen, Rest).

sort_by_fitness(Members, Sorted) :-
    predsort(compare_fitness, Members, Sorted).

compare_fitness(>, _*V1, _*V2) :- V1 > V2, !.
compare_fitness(<, _, _).

% Order crossover for vessel sequencing
crossover([], []).
crossover([Ind*_], [Ind]).
crossover([Ind1*_, Ind2*_|Rest], [NInd1, NInd2|Rest1]) :-
    prob_crossover(Pcruz),
    random(0.0, 1.0, Pc),
    ((Pc =< Pcruz, !,
        generate_crossover_points(P1, P2),
        order_crossover(Ind1, Ind2, P1, P2, NInd1),
        order_crossover(Ind2, Ind1, P1, P2, NInd2))
    ;
    (NInd1 = Ind1, NInd2 = Ind2)),
    crossover(Rest, Rest1).

generate_crossover_points(P1, P2) :-
    findall(V, vessel(V, _, _, _, _, _), VesselsList),
    length(VesselsList, N),
    NTemp is N + 1,
    random(1, NTemp, P11),
    random(1, NTemp, P21),
    P11 \= P21, !,
    ((P11 < P21, !, P1 = P11, P2 = P21); (P1 = P21, P2 = P11)).
generate_crossover_points(P1, P2) :-
    generate_crossover_points(P1, P2).

% Order crossover implementation
order_crossover(Parent1, Parent2, P1, P2, Child) :-
    extract_segment(Parent1, P1, P2, Segment),
    fill_with_parent2(Parent2, Segment, Child).

extract_segment(List, P1, P2, Segment) :-
    P1 < P2, !,
    extract_segment_helper(List, P1, P2, Segment).
extract_segment(List, P1, P2, Segment) :-
    extract_segment_helper(List, P2, P1, Segment).

extract_segment_helper(List, 1, 1, [First|_]) :-
    List = [First|_].
extract_segment_helper([H|T], 1, N, [H|Segment]) :-
    N > 1,
    N1 is N - 1,
    extract_segment_helper(T, 1, N1, Segment).
extract_segment_helper([_|T], P1, P2, Segment) :-
    P1 > 1,
    P1New is P1 - 1,
    P2New is P2 - 1,
    extract_segment_helper(T, P1New, P2New, Segment).

fill_with_parent2(Parent2, Segment, Child) :-
    remove_elements(Parent2, Segment, Remaining),
    insert_segment(Remaining, Segment, Child).

remove_elements([], _, []).
remove_elements([H|T], Segment, Result) :-
    member(H, Segment), !,
    remove_elements(T, Segment, Result).
remove_elements([H|T], Segment, [H|Result]) :-
    remove_elements(T, Segment, Result).

insert_segment([], Segment, Segment).
insert_segment([H|T], Segment, [H|Result]) :-
    insert_segment(T, Segment, Result).

% Mutation - swap two positions
mutation([], []).
mutation([Ind|Rest], [NInd|Rest1]) :-
    prob_mutation(Pmut),
    random(0.0, 1.0, Pm),
    ((Pm < Pmut, !, mutate_individual(Ind, NInd)); NInd = Ind),
    mutation(Rest, Rest1).

mutate_individual(Ind, NInd) :-
    length(Ind, Len),
    random(1, Len, Pos1),
    random(1, Len, Pos2),
    Pos1 \= Pos2,
    swap_positions(Ind, Pos1, Pos2, NInd).

swap_positions(List, Pos1, Pos2, Result) :-
    nth1(Pos1, List, Elem1),
    nth1(Pos2, List, Elem2),
    replace(List, Pos1, Elem2, Temp),
    replace(Temp, Pos2, Elem1, Result).

replace([_|T], 1, X, [X|T]).
replace([H|T], Pos, X, [H|R]) :-
    Pos > 1,
    Pos1 is Pos - 1,
    replace(T, Pos1, X, R).

% Combine populations and keep best individuals
combine_populations(OldPop, NewPop, Combined) :-
    append(OldPop, NewPop, All),
    sort_by_fitness(All, Sorted),
    remove_duplicates(Sorted, Combined).

remove_duplicates([], []).
remove_duplicates([Ind*V|Rest], Result) :-
    member(Ind*V, Rest), !,
    remove_duplicates(Rest, Result).
remove_duplicates([Ind*V|Rest], [Ind*V|Result]) :-
    remove_duplicates(Rest, Result).

take(0, _, []) :- !.
take(_, [], []) :- !.
take(N, [H|T], [H|Rest]) :-
    N > 0,
    N1 is N - 1,
    take(N1, T, Rest).

% -------------------------------
% MULTI-CRANE GENETIC ALGORITHM
% -------------------------------

solve_genetic_multi_crane(Solution, TotalDelay, CraneHours, ExecutionTime) :-
    statistics(walltime, [Start|_]),
    initialize_default_params,
    generate_population(Pop),
    evaluate_population_multi(Pop, PopValue),
    order_population(PopValue, PopOrd),
    generations(NG),
    generate_generation_multi(0, NG, PopOrd, BestSolution, BestDelay, BestCraneHours),
    statistics(walltime, [End|_]),
    ExecutionTime is (End - Start) / 1000,
    Solution = BestSolution,
    TotalDelay = BestDelay,
    CraneHours = BestCraneHours.

% Evaluate individual for multi-crane scenario
evaluate_individual_multi(Seq, TotalDelay, CraneHours) :-
    evaluate_individual_multi(Seq, 0, 0, 0, TotalDelay, CraneHours).

evaluate_individual_multi([], _, CurrentTime, TotalCraneHours, 0, TotalCraneHours).
evaluate_individual_multi([Vessel|Rest], CraneIndex, CurrentTime, AccCraneHours, TotalDelay, TotalCraneHours) :-
    vessel(Vessel, ETA, ETD, UnloadTime, LoadTime, MaxCranes),
    (dock_capacity(Vessel, DockCap) -> true; DockCap = MaxCranes),
    
    % Dynamic crane allocation based on vessel needs
    NeededCranes = MaxCranes,
    AssignedCranes is min(NeededCranes, DockCap),
    
    % Calculate processing time with multiple cranes
    UnloadTimePerCrane is ceil(UnloadTime / AssignedCranes),
    LoadTimePerCrane is ceil(LoadTime / AssignedCranes),
    ProcessingTime is UnloadTimePerCrane + LoadTimePerCrane,
    
    % Calculate crane hours used
    CraneHoursUsed is AssignedCranes * ProcessingTime,
    
    % Start time calculation
    StartTime is max(CurrentTime, ETA),
    EndTime is StartTime + ProcessingTime,
    
    % Calculate delay
    (EndTime =< ETD -> Delay = 0; Delay is EndTime - ETD),
    
    % Recursive evaluation
    NextTime is EndTime + 1,
    NewAccCraneHours is AccCraneHours + CraneHoursUsed,
    evaluate_individual_multi(Rest, CraneIndex, NextTime, NewAccCraneHours, RestDelay, TotalCraneHours),
    
    TotalDelay is Delay + RestDelay.

% Population evaluation for multi-crane
evaluate_population_multi([], []).
evaluate_population_multi([Ind|Rest], [Ind*V*CH|Rest1]) :-
    evaluate_individual_multi(Ind, V, CH),
    evaluate_population_multi(Rest, Rest1).

% Order population for multi-crane (by delay, then crane hours)
order_population_multi(PopValue, PopValueOrd) :-
    predsort(compare_multi_fitness, PopValue, PopValueOrd).

compare_multi_fitness(>, _*V1*CH1, _*V2*CH2) :-
    (V1 > V2; (V1 =:= V2, CH1 > CH2)), !.
compare_multi_fitness(<, _, _).

% Generate generations for multi-crane
generate_generation_multi(G, G, Pop, BestSolution, BestDelay, BestCraneHours) :- !,
    Pop = [BestSolution*BestDelay*BestCraneHours|_],
    write('Final Generation '), write(G), write(': '),
    write('Best Delay = '), write(BestDelay),
    write(', Crane Hours = '), write(BestCraneHours), nl.

generate_generation_multi(N, G, Pop, BestSolution, BestDelay, BestCraneHours) :-
    Pop = [Best*Delay*CraneHours|_],
    write('Generation '), write(N), write(': '),
    write('Best Delay = '), write(Delay),
    write(', Crane Hours = '), write(CraneHours), nl,
    
    select_parents(Pop, Parents),
    crossover(Parents, NPop1),
    mutation(NPop1, NPop),
    
    evaluate_population_multi(NPop, NPopValue),
    order_population_multi(NPopValue, NPopOrd),
    
    combine_populations_multi(Pop, NPopOrd, Combined),
    order_population_multi(Combined, NewPop),
    
    population(PopSize),
    take(PopSize, NewPop, NextPop),
    
    N1 is N + 1,
    generate_generation_multi(N1, G, NextPop, BestSolution, BestDelay, BestCraneHours).

combine_populations_multi(OldPop, NewPop, Combined) :-
    append(OldPop, NewPop, All),
    order_population_multi(All, Sorted),
    remove_duplicates_multi(Sorted, Combined).

remove_duplicates_multi([], []).
remove_duplicates_multi([Ind*V*CH|Rest], Result) :-
    member(Ind*V*CH, Rest), !,
    remove_duplicates_multi(Rest, Result).
remove_duplicates_multi([Ind*V*CH|Rest], [Ind*V*CH|Result]) :-
    remove_duplicates_multi(Rest, Result).

% -------------------------------
% API ENDPOINTS FOR CONTROLLER
% -------------------------------

% Single crane genetic algorithm
api_solve_genetic(Solution, TotalDelay, ExecutionTime) :-
    solve_genetic(Solution, TotalDelay, ExecutionTime).

% Multi-crane genetic algorithm
api_solve_genetic_multi(Solution, TotalDelay, CraneHours, ExecutionTime) :-
    solve_genetic_multi_crane(Solution, TotalDelay, CraneHours, ExecutionTime).

% Configure GA parameters
api_configure_ga(NG, PS, PC, PM) :-
    initialize_ga_params(NG, PS, PC, PM),
    write('GA Parameters configured: '),
    write('Generations='), write(NG),
    write(', Population='), write(PS),
    write(', Crossover='), write(PC),
    write('%, Mutation='), write(PM), write('%'), nl.