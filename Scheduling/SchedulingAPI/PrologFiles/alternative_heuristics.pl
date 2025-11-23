% ==============================================================================
% ALTERNATIVE SCHEDULING: HEURISTIC APPROACH (User Story 3.4.4)
% Early Departure Time (EDT)
% Prioritizes vessels that need to leave sooner to minimize delays.
% ==============================================================================

:- dynamic vessel/5.

% ------------------------------------------------------------------------------
% TEST DATA 
% ------------------------------------------------------------------------------
%vessel(va, 6, 63, 10, 16).
%vessel(vb, 23, 50, 9, 7).
%vessel(vc, 8, 40, 5, 12).
%vessel(vd, 27, 40, 0, 8).
%vessel(ve, 36, 70, 12, 0).
%vessel(vf, 40, 60, 8, 6).
%vessel(vg, 52, 80, 9, 10).
%vessel(vi, 61, 90, 13, 8).
%vessel(vj, 74, 100, 7, 7).
%vessel(vk, 81, 110, 6, 8).

% ------------------------------------------------------------------------------
% MAIN PREDICATE: solve_heuristic/2
% ------------------------------------------------------------------------------
solve_heuristic(SeqTriplets, TotalDelay):-
    get_time(Ti),
    
    % 1. Get all vessels paired with their Departure Time (ETD)
    %    Format: (ETD, VesselID) ensures sorting happens on ETD first.
    findall((ETD, V), vessel(V, _, ETD, _, _), ListVessels),
    
    % 2. Sort by Departure Time (Ascending)
    
    sort(ListVessels, SortedList),
    
    % 3. Extract just the Vessel Names from the sorted list
    extract_vessels(SortedList, SeqV),
    
    % 4. Calculate Schedule and Delay for this single sequence
    sequence_temporization(SeqV, SeqTriplets),
    sum_delays(SeqTriplets, TotalDelay),
    
    get_time(Tf),
    T is Tf - Ti,
    write('Heuristic Execution Time: '), write(T), nl.

% ------------------------------------------------------------------------------
% HELPER PREDICATES 
% ------------------------------------------------------------------------------

% Extracts vessel names from the (ETD, Vessel) pairs
extract_vessels([], []).
extract_vessels([(_, V)|T], [V|Rest]):-
    extract_vessels(T, Rest).

% Calculates start and end times for the sequence
sequence_temporization(LV, SeqTriplets):-
    sequence_temporization1(0, LV, SeqTriplets).

sequence_temporization1(_, [], []).
sequence_temporization1(EndPrevSeq, [V|LV], [(V, TInUnload, TEndLoad)|SeqTriplets]):-
    vessel(V, TIn, _, TUnload, TLoad),
    ((TIn > EndPrevSeq, !, TInUnload is TIn); TInUnload is EndPrevSeq + 1),
    TEndLoad is TInUnload + TUnload + TLoad - 1,
    sequence_temporization1(TEndLoad, LV, SeqTriplets).

% Calculates the total delay penalty
sum_delays([], 0).
sum_delays([(V, _, TEndLoad)|LV], S):-
    vessel(V, _, TDep, _, _), 
    TPossibleDep is TEndLoad + 1,
    ((TPossibleDep > TDep, !, SV is TPossibleDep - TDep); SV is 0),
    sum_delays(LV, SLV),
    S is SV + SLV.