% First support for IARTI project 2025/2026
% Scheduling Vessels Unload/Load

:- dynamic vessel/5.
:- dynamic shortest_delay/2.

% Example vessels:
% vessel(zeus, 6, 63, 10, 16).
% vessel(poseidon, 23, 50, 9, 7).
% vessel(marenostrum, 8, 40, 5, 12).
% vessel(nautilus, 10, 30, 0, 8).
% vessel(floating, 36, 70, 12, 0).

% --- Sequence temporization with per-vessel timing ---
sequence_temporization(LV, SeqTriplets) :-
    sequence_temporization1(0, LV, SeqTriplets).

sequence_temporization1(EndPrevSeq, [V|LV], [(V, TInUnload, TEndLoad, Delay)|SeqTriplets]) :-
    vessel(V, TIn, TDep, TUnload, TLoad),
    (TIn > EndPrevSeq -> TInUnload is TIn ; TInUnload is EndPrevSeq + 1),
    TEndLoad is TInUnload + TUnload + TLoad - 1,
    TPossibleDep is TEndLoad + 1,
    (TPossibleDep > TDep -> Delay is TPossibleDep - TDep ; Delay is 0),
    sequence_temporization1(TEndLoad, LV, SeqTriplets).

sequence_temporization1(_, [], []).

% --- Sum of delays ---
sum_delays([], 0).
sum_delays([(_,_,_,Delay)|LV], S) :-
    sum_delays(LV, SLV),
    S is Delay + SLV.

% --- Shortest delay search ---
obtain_seq_shortest_delay(SeqBetterTriplets, SShortestDelay) :-
    get_time(Ti),
    (obtain_seq_shortest_delay1 ; true),
    retract(shortest_delay(SeqBetterTriplets, SShortestDelay)),
    get_time(Tf),
    T is Tf - Ti,
    format('Execution Time: ~2f seconds~n', [T]), !.

obtain_seq_shortest_delay1 :-
    asserta(shortest_delay(_, 100000)),
    findall(V, vessel(V,_,_,_,_), LV),
    permutation(LV, SeqV),
    sequence_temporization(SeqV, SeqTriplets),
    sum_delays(SeqTriplets, S),
    compare_shortest_delay(SeqTriplets, S),
    fail.

compare_shortest_delay(SeqTriplets, S) :-
    shortest_delay(_, SLower),
    (S < SLower -> 
        retract(shortest_delay(_, _)),
        asserta(shortest_delay(SeqTriplets, S))
    ; true).

% --- Run schedule and display sequence with delays ---
run_schedule :-
    obtain_seq_shortest_delay(Solution, TotalDelay),
    format('Best sequence with per-vessel delays:~n'),
    forall(member((V, TInUnload, TEndLoad, Delay), Solution),
        format('Vessel: ~w, Start Unload: ~w, End Load: ~w, Delay: ~w~n', 
            [V, TInUnload, TEndLoad, Delay])
    ),
    format('Total delay: ~w~n', [TotalDelay]),
    nl,
    halt.
