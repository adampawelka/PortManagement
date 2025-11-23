# User Story 3.1.2
As a Logistics Operator, I want to generate a daily schedule for the loading and unloading operations of vessels arriving at the port on a given day, so that delays relative to desired departure times are minimized.

## 1. Overview
This feature enables the Logistics Operator to compute a daily operational schedule for the port’s vessels. The computation includes vessel arrival and departure information, crane and staff availability, and resource constraints.
The goal is to generate a feasible schedule—if possible—that minimizes the total delay between actual completion times and desired departure times, while respecting all operational restrictions.

## 2. Tools

- **Framework**: React
- **Routing**: React Router
- **Styling**: CSS
- **Backend module**: .NET
- **Scheduling**: Prolog


## 4. Acceptance Criteria

### Triggering Scheduling
- AC1: A date picker is available for selecting the day to schedule.
- AC2: A “Generate Schedule” button triggers the computation.

### Data Consumption
- AC3: The back-end fetches vessel, crane, staff, and storage data from external APIs.

### Scheduling Logic
- AC4: Only one vessel can occupy a dock at a time.
- AC5: Only one crane may be assigned per loading/unloading operation. (Disclaimer: for now it is assumed that the loading/unloading time is random)
- AC6: Staff assignments must respect qualification and operational windows.
- AC7: The generated plan minimizes the total delay after desired departure time.

### UI Output
- AC8: The schedule is displayed as a table containing: vessel ID, start time, end time, dock, crane, staff.
- AC9: If included in scope, a timeline visualization is generated.
- AC10: Progress/Loading indication is displayed during schedule computation.

### Error Handling
- AC11: If no feasible schedule exists, a warning is displayed to the user.
- AC12: If any required data is missing, the system shows an appropriate error message.

### No Persistence
- AC13: Results are not saved; schedule can be recomputed at any time.

## 5. Demonstration
To verify the functionality:
1. Start the Port Management Application.
2. Navigate to: `http://localhost:5173/scheduling`
3. Select a date and click Generate Schedule.
4. Observe the scheduling results (table, timeline).
5. Verify handling of conflicting or insufficient resources.

## 6. Observations
Future iterations of the scheduling feature could introduce more advanced capabilities, such as:
- Support for multiple cranes per operation, enabling parallel loading/unloading activities and improved operational efficiency.
- Persistent storage of generated schedules, allowing operators to retrieve, review, and modify plans rather than recomputing them each time.
- Unload and load time based on the actual number of containers of the vessel.