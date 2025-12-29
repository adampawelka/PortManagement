# User Story 4.1.3 - Operation Plans Search API Documentation

**As a Logistics Operator, I want to search and list Operation Plans for a given day or period, so that I can quickly review all scheduled activities within that timeframe.**

## 1. Overview

This document describes the REST API endpoints for searching and listing Operation Plans. The API supports querying by date ranges, vessel identifiers, and provides sorting capabilities to help Logistics Operators efficiently review scheduled activities.

## 2. Base URL

All endpoints are prefixed with `/api`:
```
http://localhost:4000/api
```

## 3. Endpoints

### 3.1 Search Operation Plans

**Endpoint:** `GET /api/operationPlans/search`

**Description:** Search and filter Operation Plans by various criteria including date ranges, vessel name, and VVN ID. Results can be sorted by multiple fields.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dateStart` | string (ISO 8601) | No | Start date for filtering by plan creation date (e.g., `2025-01-01T00:00:00Z`) |
| `dateEnd` | string (ISO 8601) | No | End date for filtering by plan creation date (e.g., `2025-01-31T23:59:59Z`) |
| `operationDateStart` | string (ISO 8601) | No | Start date for filtering by schedule operation start date |
| `operationDateEnd` | string (ISO 8601) | No | End date for filtering by schedule operation start date |
| `vesselName` | string | No | Filter by vessel name (case-insensitive partial match) |
| `vvnId` | string | No | Filter by Vessel Visit Notification ID |
| `sortBy` | enum | No | Sort field: `startTime`, `vesselName`, `delay`, or `createdAt` |
| `sortOrder` | enum | No | Sort direction: `asc` (default) or `desc` |

**Response:**

**Status Code:** `200 OK`

**Response Body:**
```json
[
  {
    "id": "string",
    "vvnId": "string",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "createdBy": "string",
    "algorithmUsed": "string",
    "schedule": [
      {
        "vesselName": "string",
        "start": "2025-01-15T08:00:00.000Z",
        "end": "2025-01-15T16:00:00.000Z",
        "delay": 0,
        "dock": "string",
        "crane": "string",
        "staff": ["string"]
      }
    ]
  }
]
```

**Error Responses:**

- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server error during search

**Example Requests:**

1. **Search by date range:**
```bash
GET /api/operationPlans/search?dateStart=2025-01-01T00:00:00Z&dateEnd=2025-01-31T23:59:59Z
```

2. **Search by vessel name:**
```bash
GET /api/operationPlans/search?vesselName=CargoShip-1
```

3. **Search by operation date range with sorting:**
```bash
GET /api/operationPlans/search?operationDateStart=2025-01-15T00:00:00Z&operationDateEnd=2025-01-20T23:59:59Z&sortBy=startTime&sortOrder=asc
```

4. **Combined search:**
```bash
GET /api/operationPlans/search?vvnId=VVN-123&vesselName=CargoShip&sortBy=vesselName&sortOrder=desc
```

### 3.2 List All Operation Plans

**Endpoint:** `GET /api/operationPlans`

**Description:** Retrieve all Operation Plans without filtering.

**Response:** Same as search endpoint (array of OperationPlanDTO)

### 3.3 Get Operation Plan by ID

**Endpoint:** `GET /api/operationPlans/:id`

**Description:** Retrieve a specific Operation Plan by its ID.

**Path Parameters:**
- `id` (string, required): Operation Plan ID

**Response:** Single OperationPlanDTO object

**Error Responses:**
- `404 Not Found`: Operation Plan not found

### 3.4 Get Operation Plan by VVN ID

**Endpoint:** `GET /api/operationPlans/vvn/:vvnId`

**Description:** Retrieve Operation Plan associated with a specific Vessel Visit Notification.

**Path Parameters:**
- `vvnId` (string, required): Vessel Visit Notification ID

**Response:** Single OperationPlanDTO object

**Error Responses:**
- `404 Not Found`: No Operation Plan found for the specified VVN

## 4. Data Models

### 4.1 OperationPlanDTO

```typescript
{
  id: string;                    // Unique identifier
  vvnId: string;                 // Vessel Visit Notification ID
  createdAt: string;            // ISO 8601 timestamp
  createdBy: string;            // User who created the plan
  algorithmUsed: string;        // Algorithm used for generation
  schedule: ScheduledOperationDTO[];  // Array of scheduled operations
}
```

### 4.2 ScheduledOperationDTO

```typescript
{
  vesselName: string;           // Name of the vessel
  start: string;               // ISO 8601 start time
  end: string;                 // ISO 8601 end time
  delay: number;               // Expected delay in minutes
  dock: string;                // Assigned dock identifier
  crane: string;                // Assigned crane identifier
  staff: string[];             // Array of staff member identifiers
}
```

## 5. Sorting Behavior

### Sort Fields

- **`startTime`**: Sorts by the earliest start time in the schedule array
- **`vesselName`**: Sorts alphabetically by the first vessel name in the schedule
- **`delay`**: Sorts by the maximum delay value in the schedule
- **`createdAt`**: Sorts by the plan creation timestamp

### Sort Order

- **`asc`** (default): Ascending order (A→Z, 1→9, oldest→newest)
- **`desc`**: Descending order (Z→A, 9→1, newest→oldest)

## 6. Filtering Logic

### Date Range Filters

- **`dateStart` / `dateEnd`**: Filters by the Operation Plan creation date (`createdAt` field)
- **`operationDateStart` / `operationDateEnd`**: Filters by the scheduled operation start dates in the `schedule` array

### Vessel Name Filter

- Case-insensitive partial match using MongoDB regex
- Matches any vessel name in the schedule array

### VVN ID Filter

- Exact match on the `vvnId` field

## 7. Performance Considerations

- Database indexes are configured on:
  - `createdAt` (for date range queries)
  - `vvnId` (for VVN filtering)
  - `schedule.start` (for operation date queries)
  - Compound indexes for combined queries

- Sorting is performed in-memory after fetching results to support complex sorting on schedule array fields

## 8. Testing

### 8.1 Manual Testing

Use tools like Postman, curl, or browser to test endpoints:

```bash
# Test search endpoint
curl "http://localhost:4000/api/operationPlans/search?dateStart=2025-01-01&sortBy=createdAt&sortOrder=desc"

# Test with multiple filters
curl "http://localhost:4000/api/operationPlans/search?vesselName=CargoShip&operationDateStart=2025-01-15&sortBy=startTime"
```

### 8.2 Expected Behavior

- Empty result set returns `[]` (empty array), not `null`
- Invalid date formats should be handled gracefully
- Missing optional parameters should not cause errors
- Sorting should work correctly with empty schedules

## 9. Dependencies

- **4.1.1**: OEM module and database setup (required)
- **4.1.2**: Generated Operation Plans (for testing with real data)
- **Sprint B**: SPA infrastructure (for frontend integration)

## 10. Implementation Status

✅ **REST API Endpoints**: Implemented  
✅ **Search Functionality**: Implemented  
✅ **Filtering**: Implemented (date ranges, vessel name, VVN)  
✅ **Sorting**: Implemented (startTime, vesselName, delay, createdAt)  
✅ **Database Indexes**: Configured for performance  
⏳ **Frontend SPA**: Pending (Sub-issue #3)  
⏳ **Documentation**: This document (Sub-issue #1)

## 11. Related Files

- **Controller**: `OEM/src/controllers/IControllers/OperationPlanController.ts`
- **Service**: `OEM/src/services/OperationPlanService.ts`
- **Repository**: `OEM/src/repos/OperationPlanRepo.ts`
- **DTOs**: `OEM/src/dto/OperationPlanDTO.ts`
- **Schema**: `OEM/src/persistence/schemas/OperationPlanSchema.ts`

