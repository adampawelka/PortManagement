% ==============================================================================
% ALTERNATIVE SCHEDULING: IMPROVED HEURISTIC (User Story 3.4.4)
% Dynamic Minimum Slack Time (Dynamic MST)
% Strategy: "Ready-First, Most Urgent Next"
% 1. Simulation: Moves a virtual clock (CurrentTime).
% 2. Readiness: Only considers vessels that have actually arrived.
% 3. Urgency: Calculates 'Slack' (Deadline - FinishTime) dynamically.
% ==============================================================================

:- dynamic vessel/5.

% ------------------------------------------------------------------------------
% TEST DATA
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
% MAIN PREDICATE: solve_dynamic_mst/2
% ------------------------------------------------------------------------------
solve_dynamic_mst(SeqTriplets, TotalDelay):-
    get_time(Ti),

    % 1. Get all vessels (IDs only)
    findall(V, vessel(V, _, _, _, _), AllVessels),

    % 2. Run the simulation to determine the order
    %    Start simulation at Time 0.
    schedule_simulation(0, AllVessels, SeqV),

    % 3. Calculate final Schedule and Delay for this sequence
    sequence_temporization(SeqV, SeqTriplets),
    sum_delays(SeqTriplets, TotalDelay),

    get_time(Tf),
    T is Tf - Ti,
    write('Dynamic MST Execution Time: '), write(T), nl.

% ------------------------------------------------------------------------------
% SCHEDULING SIMULATION (The Core Logic)
% ------------------------------------------------------------------------------

% Base Case: No vessels left to schedule.
schedule_simulation(_, [], []).

% Recursive Step:
schedule_simulation(CurrentTime, RemainingVessels, [BestVessel|RestSeq]):-
    % Step A: Find all vessels that have arrived by CurrentTime (The "Ready Set")
    findall(V, (member(V, RemainingVessels), is_ready(V, CurrentTime)), ReadyVessels),

    (   ReadyVessels \= []
    ->  
        % CASE 1: Vessels are waiting. 
        % Logic: Pick the one with the Minimum Slack Time.
        find_min_slack_vessel(ReadyVessels, CurrentTime, BestVessel),
        
        % Calculate when this vessel finishes to update the clock
        vessel(BestVessel, _, _, Unload, Load),
        ProcessingTime is Unload + Load,
        
        % Note: StartTime is CurrentTime because the vessel is already ready.
        NewTime is CurrentTime + ProcessingTime,
        
        % Remove scheduled vessel and recurse
        select(BestVessel, RemainingVessels, NewRemaining),
        schedule_simulation(NewTime, NewRemaining, RestSeq)
    ;   
        % CASE 2: No vessels are ready (Dock is idle).
        % Logic: Fast-forward time to the earliest arrival of the remaining vessels.
        find_earliest_arrival(RemainingVessels, NextArrival),
        
        % Recurse with the new time (BestVessel will be selected in the next step)
        schedule_simulation(NextArrival, RemainingVessels, [BestVessel|RestSeq])
    ).

% ------------------------------------------------------------------------------
% HELPER PREDICATES
% ------------------------------------------------------------------------------

% Checks if a vessel has arrived
is_ready(V, CurrentTime):-
    vessel(V, Arrival, _, _, _),
    Arrival =< CurrentTime.

% Finds the vessel with the Minimum Slack among a list
% Slack = DesiredDeparture - (CurrentTime + ProcessingDuration)
find_min_slack_vessel([V], _, V).
find_min_slack_vessel([H|T], CurrentTime, Best):-
    find_min_slack_vessel(T, CurrentTime, TempBest),
    calculate_slack(H, CurrentTime, SlackH),
    calculate_slack(TempBest, CurrentTime, SlackTemp),
    (SlackH < SlackTemp -> Best = H ; Best = TempBest).

% Calculation for Slack
calculate_slack(V, CurrentTime, Slack):-
    vessel(V, _, Departure, Unload, Load),
    FinishTime is CurrentTime + Unload + Load,
    Slack is Departure - FinishTime.

% Finds the earliest arrival time (used when jumping over idle time)
find_earliest_arrival([V], Arrival):- 
    vessel(V, Arrival, _, _, _).
find_earliest_arrival([H|T], BestArrival):-
    find_earliest_arrival(T, TempArrival),
    vessel(H, ArrivalH, _, _, _),
    (ArrivalH < TempArrival -> BestArrival = ArrivalH ; BestArrival = TempArrival).

% ------------------------------------------------------------------------------
% STANDARD CALCULATIONS (Required for Output)
% ------------------------------------------------------------------------------

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