# User Story 4.1.2 - Operational Plans Generation Documentation

**As a Logistics Operator, I want to automatically generate and view Operational Plans for all Vessel Visit Notifications (VVNs) scheduled for a given day using one of the available scheduling algorithms, so that cargo operations are efficiently organized and can later be monitored or adjusted.**

## 1. Overview

This document describes the SPA interface and supporting services for generating, searching, and viewing Operational Plans.  
Operators can select a target day, choose an algorithm if needed, and generate plans. Generated plans are displayed in a table with operation times, expected delays, assigned docks, cranes, and staff.

## 2. Base SPA URL

All SPA routes related to Operational Plans are under: `/operational-plans`


- List/Search: `/operational-plans`
- Edit/Update: `/operational-plans/update/:id`

## 3. SPA Components

### 3.1 OperationalPlanSearch

- Displays search filters:
  - Operation start and end dates
  - Vessel filter dropdown
- Buttons:
  - **Search**: Fetches plans matching filters
  - **Clear**: Resets all filters
- Displays list of Operational Plans with:
  - Vessel name and VVN ID
  - Operations table (start, end, expected delay)
  - Edit button per plan
- Supports sorting by:
  - Vessel name
  - Start date
  - End date
- Shows loading indicator and error messages

### 3.2 RecommendedSchedulePage

- Allows operators to generate recommended schedules for a specific day
- Selectable override algorithm: Optimal, Heuristic, Genetic, or Auto
- Displays:
  - Execution time of scheduling
  - Selected algorithm and reason
  - Results table with:
    - Vessel, start/end, delay, dock, crane, staff
- Alerts for unassigned resources or empty results

## 4. View Models

### 4.1 useOperationalPlanSearchVM

- Manages search, filtering, and sorting of Operational Plans
- Fetches data from API services
- Converts API response into UI-friendly structure
- Computes sorted and filtered plans for display

### 4.2 useRecommendedScheduleVM

- Manages generation of recommended schedules
- Selects algorithm automatically based on number of vessels or allows override
- Computes delays for heuristic algorithm
- Returns execution time, algorithm, reason, and results

## 5. Services

- **searchOperationalPlans**: Search plans by operation date range, vessel, or VVN ID
- **getOperationalPlanById**: Fetch a single plan by ID
- **addOperationalPlan**: Add a new plan
- **updateOperationalPlan**: Update an existing plan
- **getMissingPlans**: Fetch missing plans for a specific date
- **generateMockOperationalPlans**: Generate mock data for testing SPA

## 6. Filtering and Sorting

- Filtering:
  - By vessel name (dropdown)
  - By operation start/end dates
- Sorting:
  - By vessel name, start date, or expected delay
  - Ascending/descending toggle

## 7. User Actions

1. Select date range for operations
2. Optionally select a vessel or algorithm
3. Click **Search** or **Generate**
4. View results in table
5. Click **Edit** to modify individual plans
6. Clear filters if needed

## 8. Notes

- Empty results show informative alerts
- Alerts also show unassigned cranes or staff
- Loading indicators are displayed during API calls
- SPA communicates with OEM backend via API

## 9. Dependencies

- **OEM backend module**: Provides operational plans API
- **VVN module**: Required to fetch scheduled vessel visits
- **Frontend SPA**: Provides search, generation, and table view functionality

## 10. Testing

### 10.1 Manual Testing

- Use the SPA interface to select operation date ranges and optionally filter by vessel.
- Click **Search** or **Generate** and verify:
  - The loading indicator appears while fetching data.
  - The results table displays correct vessel names, operation times, assigned docks, cranes, and staff.
  - Alerts are shown for unassigned resources or empty results.
- Test the **Edit** button for each plan and ensure navigation to the update page works.
- Clear filters and verify that all plans are displayed again.

### 10.2 API Testing

- Use tools like Postman or curl to call backend services:
  - `GET /api/operationPlans/search?operationDateStart=YYYY-MM-DD&operationDateEnd=YYYY-MM-DD`
  - `GET /api/operationPlans/:id`
  - `POST /api/operationPlans`
  - `PUT /api/operationPlans/:id`
- Check that responses match expected structure (vessel, operations, delays, assigned resources).
- Verify error handling:
  - Invalid dates or missing required parameters
  - Non-existent plan IDs (should return 404)
  - Conflicts or validation errors on update

### 10.3 Expected Behavior

- Empty result sets return an informative message in SPA (`No operational plans found`) instead of errors.
- Sorting and filtering work correctly on the table columns.
- SPA handles slow API responses gracefully (loading spinner displayed).
- Generated schedules reflect algorithm choice (auto or override) and show correct execution time.


