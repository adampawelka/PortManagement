% ==============================================================================
% ALTERNATIVE ALGORITHM: HILL CLIMBING LOCAL SEARCH
% User Story 3.4.4
%
% Strategy: Iterative Improvement.
% 1. Generates an initial solution using EDT (Early Departure Time).
% 2. Tries to improve it by swapping adjacent vessels.
% 3. Repeats until no single swap yields a better result (Local Optima).
% ==============================================================================

:- dynamic vessel/5.

% ------------------------------------------------------------------------------
% MAIN PREDICATE: solve_hill_climbing/2
% ------------------------------------------------------------------------------
solve_hill_climbing(FinalTriplets, FinalDelay):-
    get_time(Ti),

    % 1. Generate Initial Solution (Seed) using EDT
    %    (We reuse the logic from EDT here for the start point)
    findall((ETD, V), vessel(V, _, ETD, _, _), ListVessels),
    sort(ListVessels, SortedList),
    extract_vessels(SortedList, InitialSeq),
    
    % 2. Calculate Initial Cost
    evaluate_sequence(InitialSeq, InitialDelay),
    write('Initial EDT Delay: '), write(InitialDelay), nl,

    % 3. Start Optimization Loop
    improve_sequence(InitialSeq, InitialDelay, FinalSeq, FinalDelay),
    
    % 4. Convert final sequence to triplets format (like other algorithms)
    sequence_temporization(FinalSeq, FinalTriplets),

    get_time(Tf),
    T is Tf - Ti,
    write('Hill Climbing Execution Time: '), write(T), nl.

% ------------------------------------------------------------------------------
% OPTIMIZATION LOOP
% ------------------------------------------------------------------------------

% Base Case: No neighbor is better. We are at a local optimum.
improve_sequence(CurrentSeq, CurrentDelay, CurrentSeq, CurrentDelay):-
    % Try to find a better neighbor - if none exists, we're done
    \+ find_better_neighbor(CurrentSeq, CurrentDelay, _, _).
    
% Recursive Step: Found a better neighbor, use it and continue improving
improve_sequence(CurrentSeq, CurrentDelay, FinalSeq, FinalDelay):-
    find_better_neighbor(CurrentSeq, CurrentDelay, BetterSeq, BetterDelay),
    write('Improved Found! New Delay: '), write(BetterDelay), nl,
    improve_sequence(BetterSeq, BetterDelay, FinalSeq, FinalDelay). 

% ------------------------------------------------------------------------------
% NEIGHBOR GENERATION
% ------------------------------------------------------------------------------

% Tries swapping adjacent elements to find a lower delay
find_better_neighbor(Seq, CurrentDelay, BetterSeq, BetterDelay):-
    % Generator: Pick two adjacent items A, B and swap them to B, A
    append(Prefix, [A, B | Suffix], Seq),
    append(Prefix, [B, A | Suffix], CandidateSeq),
    
    % Evaluator: Calculate cost of new sequence
    evaluate_sequence(CandidateSeq, CandidateDelay),
    
    % Validator: Is it strictly better?
    CandidateDelay < CurrentDelay,
    
    % Return the first one found (Greedy ascent)
    BetterSeq = CandidateSeq,
    BetterDelay = CandidateDelay.

% ------------------------------------------------------------------------------
% HELPERS (Reused)
% ------------------------------------------------------------------------------

evaluate_sequence(Seq, Delay):-
    sequence_temporization(Seq, Triplets),
    sum_delays(Triplets, Delay).

extract_vessels([], []).
extract_vessels([(_, V)|T], [V|Rest]):-
    extract_vessels(T, Rest).

sequence_temporization(LV, SeqTriplets):-
    sequence_temporization1(0, LV, SeqTriplets).

sequence_temporization1(_, [], []).
sequence_temporization1(EndPrevSeq, [V|LV], [(V, TInUnload, TEndLoad)|SeqTriplets]):-
    vessel(V, TIn, _, TUnload, TLoad),
    ((TIn > EndPrevSeq, !, TInUnload is TIn); TInUnload is EndPrevSeq + 1),
    TEndLoad is TInUnload + TUnload + TLoad - 1,
    sequence_temporization1(TEndLoad, LV, SeqTriplets).

sum_delays([], 0).
sum_delays([(V, _, TEndLoad)|LV], S):-
    vessel(V, _, TDep, _, _), 
    TPossibleDep is TEndLoad + 1,
    ((TPossibleDep > TDep, !, SV is TPossibleDep - TDep); SV is 0),
    sum_delays(LV, SLV),
    S is SV + SLV.