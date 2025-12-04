% ==============================================================================
% MULTI-CRANE SCHEDULING (User Story 3.4.5)
% Two-Phase Approach: Single-Crane First, Multi-Crane if Delays Exist
% ==============================================================================

:- dynamic vessel_multi/6.
:- dynamic crane_assignment/2.
:- dynamic best_schedule/2.

% vessel_multi(VesselRef, ArrivalTime, DepartureTime, BaseUnloadTime, BaseLoadTime, MaxCranes)

% ------------------------------------------------------------------------------
% MAIN PREDICATE
% ------------------------------------------------------------------------------
solve_multi_crane(SingleSeq, SingleDelay, SingleCraneHours, 
                  MultiSeq, MultiDelay, MultiCraneHours):-
    get_time(Ti),
    write('=== MULTI-CRANE SCHEDULING ==='), nl,
    
    % Phase 1: Single-Crane Schedule
    write('Phase 1: Computing optimal single-crane schedule...'), nl,
    phase1_single_crane(SingleSeq, SingleDelay),
    calculate_total_crane_hours(SingleSeq, SingleCraneHours),
    
    write('Phase 1 Results:'), nl,
    write('  Total Delay: '), write(SingleDelay), write(' hours'), nl,
    write('  Crane-Hours: '), write(SingleCraneHours), nl,
    nl,
    
    % Phase 2: Multi-Crane if delays exist
    (   SingleDelay > 0
    ->  write('Phase 2: Delays detected, applying multi-crane optimization...'), nl,
        phase2_multi_crane(SingleSeq, SingleDelay, MultiSeq, MultiDelay),
        calculate_total_crane_hours(MultiSeq, MultiCraneHours),
        write('Phase 2 Results:'), nl,
        write('  Total Delay: '), write(MultiDelay), write(' hours'), nl,
        write('  Crane-Hours: '), write(MultiCraneHours), nl,
        DelayReduction is SingleDelay - MultiDelay,
        write('  Delay Reduction: '), write(DelayReduction), write(' hours'), nl
    ;   write('Phase 2: No delays - multi-crane not needed'), nl,
        MultiSeq = SingleSeq,
        MultiDelay = SingleDelay,
        MultiCraneHours = SingleCraneHours
    ),
    
    get_time(Tf),
    T is Tf - Ti,
    write('Total Execution Time: '), write(T), write(' seconds'), nl.

% ------------------------------------------------------------------------------
% PHASE 1: Single-Crane Optimal Schedule
% ------------------------------------------------------------------------------
phase1_single_crane(BestSeq, BestDelay):-
    % Initialize: All vessels use 1 crane
    retractall(crane_assignment(_, _)),
    findall(V, vessel_multi(V, _, _, _, _, _), AllVessels),
    length(AllVessels, NumVessels),
    write('  Found '), write(NumVessels), write(' vessels to schedule'), nl,
    
    forall(member(V, AllVessels), assertz(crane_assignment(V, 1))),
    
    % Find optimal sequence using brute force
    retractall(best_schedule(_, _)),
    assertz(best_schedule([], 999999)),
    
    write('  Evaluating all permutations...'), nl,
    (   permutation(AllVessels, Seq),
        evaluate_sequence(Seq, Delay),
        update_best_if_better(Seq, Delay),
        fail
    ;   true
    ),
    
    retract(best_schedule(BestSeq, BestDelay)),
    write('  Best single-crane sequence found!'), nl,
    !.

evaluate_sequence(Seq, TotalDelay):-
    sequence_to_triplets(Seq, 0, Triplets),
    sum_delays(Triplets, TotalDelay).

update_best_if_better(Seq, Delay):-
    best_schedule(_, CurrentBest),
    (   Delay < CurrentBest
    ->  retract(best_schedule(_, _)),
        assertz(best_schedule(Seq, Delay))
    ;   true
    ).

% ------------------------------------------------------------------------------
% PHASE 2: Multi-Crane Optimization
% ------------------------------------------------------------------------------
phase2_multi_crane(InitialSeq, InitialDelay, FinalSeq, FinalDelay):-
    optimize_with_cranes(InitialSeq, InitialDelay, 1, FinalSeq, FinalDelay).

optimize_with_cranes(CurrentSeq, CurrentDelay, Iteration, FinalSeq, FinalDelay):-
    % Find vessel with biggest delay
    sequence_to_triplets(CurrentSeq, 0, Triplets),
    find_most_delayed_vessel(Triplets, MostDelayedVessel, MaxDelay),
    
    (   MaxDelay > 0,
        crane_assignment(MostDelayedVessel, CurrentCranes),
        vessel_multi(MostDelayedVessel, _, _, _, _, MaxAllowed),
        CurrentCranes < MaxAllowed
    ->  % Add one more crane to most delayed vessel
        NewCranes is CurrentCranes + 1,
        retract(crane_assignment(MostDelayedVessel, CurrentCranes)),
        assertz(crane_assignment(MostDelayedVessel, NewCranes)),
        
        % Recalculate delay
        evaluate_sequence(CurrentSeq, NewDelay),
        
        write('  Iteration '), write(Iteration), write(': Added crane to '), 
        write(MostDelayedVessel), write(' (now '), write(NewCranes), 
        write(' cranes) - Delay: '), write(NewDelay), write(' hours'), nl,
        
        % Continue optimizing
        NextIteration is Iteration + 1,
        optimize_with_cranes(CurrentSeq, NewDelay, NextIteration, FinalSeq, FinalDelay)
    ;   % No more improvements possible
        write('  Optimization complete (no further improvements possible)'), nl,
        FinalSeq = CurrentSeq,
        FinalDelay = CurrentDelay
    ).

find_most_delayed_vessel(Triplets, VesselWithMaxDelay, MaxDelay):-
    find_max_delay_helper(Triplets, none, 0, VesselWithMaxDelay, MaxDelay).

find_max_delay_helper([], BestVessel, BestDelay, BestVessel, BestDelay).
find_max_delay_helper([(Vessel, _, EndTime, _)|Rest], CurrentBest, CurrentMax, FinalBest, FinalMax):-
    vessel_multi(Vessel, _, DesiredDep, _, _, _),
    ActualDep is EndTime + 1,
    ThisDelay is max(0, ActualDep - DesiredDep),
    (   ThisDelay > CurrentMax
    ->  find_max_delay_helper(Rest, Vessel, ThisDelay, FinalBest, FinalMax)
    ;   find_max_delay_helper(Rest, CurrentBest, CurrentMax, FinalBest, FinalMax)
    ).

% ------------------------------------------------------------------------------
% SEQUENCE TO TRIPLETS (with multi-crane support)
% ------------------------------------------------------------------------------
sequence_to_triplets([], _, []).
sequence_to_triplets([Vessel|RestSeq], PrevEndTime, [(Vessel, Start, End, Cranes)|RestTriplets]):-
    vessel_multi(Vessel, Arrival, _, BaseUnload, BaseLoad, _),
    crane_assignment(Vessel, Cranes),
    
    % Calculate actual processing time with multiple cranes
    ActualUnload is ceiling(BaseUnload / Cranes),
    ActualLoad is ceiling(BaseLoad / Cranes),
    TotalProcessing is ActualUnload + ActualLoad,
    
    % Start time: max of arrival time or previous vessel end + 1
    (   Arrival > PrevEndTime
    ->  Start is Arrival
    ;   Start is PrevEndTime + 1
    ),
    
    % End time
    End is Start + TotalProcessing - 1,
    
    sequence_to_triplets(RestSeq, End, RestTriplets).

% ------------------------------------------------------------------------------
% DELAY CALCULATION
% ------------------------------------------------------------------------------
sum_delays([], 0).
sum_delays([(Vessel, _, EndTime, _)|Rest], TotalDelay):-
    vessel_multi(Vessel, _, DesiredDep, _, _, _),
    ActualDep is EndTime + 1,
    ThisDelay is max(0, ActualDep - DesiredDep),
    sum_delays(Rest, RestDelay),
    TotalDelay is ThisDelay + RestDelay.

% ------------------------------------------------------------------------------
% CRANE-HOUR CALCULATION
% ------------------------------------------------------------------------------
calculate_total_crane_hours(Seq, TotalCraneHours):-
    sequence_to_triplets(Seq, 0, Triplets),
    sum_crane_hours(Triplets, TotalCraneHours).

sum_crane_hours([], 0).
sum_crane_hours([(_Vessel, Start, End, Cranes)|Rest], Total):-
    Duration is End - Start + 1,
    ThisCraneHours is Duration * Cranes,
    sum_crane_hours(Rest, RestCraneHours),
    Total is ThisCraneHours + RestCraneHours.