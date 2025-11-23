% ==============================================================================
% HEURISTIC: SHORTEST PROCESSING TIME (SPT)
% User Story 3.4.4 - Basic Heuristic 2
% 
% Static Sort.
% Description: Calculates the total active time required for each vessel 
% (Unload Duration + Load Duration) and schedules them from shortest to longest.
%
% Strengths: Maximizes vessel throughput (clears small jobs quickly).
% Weaknesses: Ignores deadlines. Can cause massive delays for large vessels.
% ==============================================================================

:- dynamic vessel/5.
:- use_module(library(lists)). % Often needed for standard list operations

% ------------------------------------------------------------------------------
% TEST DATA (Uncomment if running standalone, keep commented if loaded with main)
% ------------------------------------------------------------------------------
% vessel(va, 6, 63, 10, 16).
% vessel(vb, 23, 50, 9, 7).
% vessel(vc, 8, 40, 5, 12).
% vessel(vd, 27, 40, 0, 8).
% vessel(ve, 36, 70, 12, 0).
% vessel(vf, 40, 60, 8, 6).
% vessel(vg, 52, 80, 9, 10).
% vessel(vi, 61, 90, 13, 8).
% vessel(vj, 74, 100, 7, 7).
% vessel(vk, 81, 110, 6, 8).

% ------------------------------------------------------------------------------
% MAIN PREDICATE: solve_spt/2
% ------------------------------------------------------------------------------
solve_spt(SeqTriplets, TotalDelay):-
    get_time(Ti),

    % 1. Calculate Processing Time (Duration) for all vessels
    %    We create pairs of (Duration, VesselID) so 'sort' uses Duration as the key.
    findall((Duration, V), (
        vessel(V, _, _, Unload, Load),
        Duration is Unload + Load
    ), ListVessels),

    % 2. Sort by Duration (Ascending)
    %    Smallest jobs move to the front.
    sort(ListVessels, SortedList),

    % 3. Extract just the Vessel IDs from the sorted list
    extract_vessels(SortedList, SeqV),

    % 4. Calculate final Schedule and Total Delay
    sequence_temporization(SeqV, SeqTriplets),
    sum_delays(SeqTriplets, TotalDelay),

    get_time(Tf),
    T is Tf - Ti,
    write('SPT Execution Time: '), write(T), nl.

% ------------------------------------------------------------------------------
% HELPER PREDICATES
% ------------------------------------------------------------------------------

% Extracts vessel names from the (Duration, Vessel) pairs
extract_vessels([], []).
extract_vessels([(_, V)|T], [V|Rest]):-
    extract_vessels(T, Rest).

% ------------------------------------------------------------------------------
% STANDARD CALCULATIONS 
% ------------------------------------------------------------------------------

% Calculates the start, end, and arrival handling for a sequence of vessels
sequence_temporization(LV, SeqTriplets):-
    sequence_temporization1(0, LV, SeqTriplets).

sequence_temporization1(_, [], []).
sequence_temporization1(EndPrevSeq, [V|LV], [(V, TInUnload, TEndLoad)|SeqTriplets]):-
    vessel(V, TIn, _, TUnload, TLoad),
    % Start time is either arrival time OR end of previous job (plus 1 hour), whichever is later
    ((TIn > EndPrevSeq, !, TInUnload is TIn); TInUnload is EndPrevSeq + 1),
    % End time calculation
    TEndLoad is TInUnload + TUnload + TLoad - 1,
    sequence_temporization1(TEndLoad, LV, SeqTriplets).

% Calculates the Sum of Delays based on Desired Departure Time
sum_delays([], 0).
sum_delays([(V, _, TEndLoad)|LV], S):-
    vessel(V, _, TDep, _, _), 
    TPossibleDep is TEndLoad + 1,
    % Delay is max(0, ActualDeparture - DesiredDeparture)
    ((TPossibleDep > TDep, !, SV is TPossibleDep - TDep); SV is 0),
    sum_delays(LV, SLV),
    S is SV + SLV.