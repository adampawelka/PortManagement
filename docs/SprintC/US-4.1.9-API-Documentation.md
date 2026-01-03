# User Story 4.1.9 - Vessel Visit Execution Progress Update

**As a Logistics Operator, I want to update an in progress VVE with executed operations, so that the system reflects real execution progress and performance.**

## 1. Overview

This document describes the REST API endpoints for updating in-progress Vessel Visit Executions (VVEs) with executed operations. The system allows Logistics Operators to record actual operation execution times, update operation statuses, and synchronize these changes with corresponding planned operations. This enables real-time tracking of operational progress and performance comparison against planned schedules.

## 2. Base URL

All endpoints are prefixed with `/api`:
```
http://localhost:4000/api
```

## 3. Endpoints

### 3.1 Create Executed Operation

**Endpoint:** `POST /api/executedOperations`

**Description:** Create a new Executed Operation record for an in-progress VVE. The system validates that the referenced VVE exists and is in progress, validates the planned operation exists, and automatically synchronizes status with the corresponding planned operation.

**Request Body:**

```json
{
  "vesselVisitExecutionId": "660e8400-e29b-41d4-a716-446655440001",
  "plannedOperationId": "planned-op-123",
  "resourceId": "crane-1",
  "staffId": "operator-456",
  "actualStart": "2025-01-15T09:15:00.000Z",
  "actualEnd": "2025-01-15T10:30:00.000Z",
  "status": "completed"
}
```

**Request Body Fields:**

| Field                    | Type              | Required | Description                                                                 |
|--------------------------|-------------------|----------|-----------------------------------------------------------------------------|
| `vesselVisitExecutionId` | string (UUID)     | Yes      | Vessel Visit Execution ID - must reference an existing in-progress VVE      |
| `plannedOperationId`     | string            | Yes      | Planned Operation ID - must reference an existing planned operation         |
| `resourceId`             | string            | Yes      | Actual resource used for the operation                                      |
| `staffId`                | string            | Yes      | Actual staff member who performed the operation                             |
| `actualStart`            | string (ISO 8601) | Yes      | Actual start time of the operation                                          |
| `actualEnd`              | string (ISO 8601) | No       | Actual end time of the operation (required for "completed" status)          |
| `status`                 | string            | Yes      | Current status: "scheduled", "started", "completed", "delayed", "cancelled" |

**Response:**

**Status Code:** `201 Created`

**Response Body:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "vesselVisitExecutionId": "660e8400-e29b-41d4-a716-446655440001",
  "plannedOperationId": "planned-op-123",
  "resourceId": "crane-1",
  "staffId": "operator-456",
  "actualStart": "2025-01-15T09:15:00.000Z",
  "actualEnd": "2025-01-15T10:30:00.000Z",
  "status": "completed",
  "syncStatus": "synced"
}
```

### 3.2 Update Executed Operation

**Endpoint:** `PUT /api/executedOperations/:id`

**Description:** Update an existing Executed Operation record. The system automatically synchronizes status changes with the corresponding planned operation and validates that updates maintain data consistency.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Executed Operation ID to update |

**Request Body:**

```json
{
  "actualStart": "2025-01-15T09:20:00.000Z",
  "actualEnd": "2025-01-15T10:45:00.000Z",
  "status": "delayed"
}
```

**Request Body Fields:**

| Field         | Type              | Required | Description                                                                 |
|---------------|-------------------|----------|-----------------------------------------------------------------------------|
| `actualStart` | string (ISO 8601) | No       | Updated actual start time                                                   |
| `actualEnd`   | string (ISO 8601) | No       | Updated actual end time                                                     |
| `status`      | string            | No       | Updated status: "scheduled", "started", "completed", "delayed", "cancelled" |

**Response:**

**Status Code:** `200 OK`

**Response Body:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "vesselVisitExecutionId": "660e8400-e29b-41d4-a716-446655440001",
  "plannedOperationId": "planned-op-123",
  "resourceId": "crane-1",
  "staffId": "operator-456",
  "actualStart": "2025-01-15T09:20:00.000Z",
  "actualEnd": "2025-01-15T10:45:00.000Z",
  "status": "delayed",
  "syncStatus": "synced"
}
```

### 3.3 Get Executed Operations by VVE

**Endpoint:** `GET /api/executedOperations/vve/:vveId`

**Description:** Retrieve all executed operations for a specific Vessel Visit Execution. Used by the frontend to display current execution progress.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vveId` | string (UUID) | Yes | Vessel Visit Execution ID |

**Response:**

**Status Code:** `200 OK`

**Response Body:**
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "vesselVisitExecutionId": "660e8400-e29b-41d4-a716-446655440001",
    "plannedOperationId": "planned-op-123",
    "resourceId": "crane-1",
    "staffId": "operator-456",
    "actualStart": "2025-01-15T09:15:00.000Z",
    "actualEnd": "2025-01-15T10:30:00.000Z",
    "status": "completed",
    "syncStatus": "synced"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "vesselVisitExecutionId": "660e8400-e29b-41d4-a716-446655440001",
    "plannedOperationId": "planned-op-124",
    "resourceId": "crane-2",
    "staffId": "operator-789",
    "actualStart": "2025-01-15T10:45:00.000Z",
    "actualEnd": null,
    "status": "started",
    "syncStatus": "pending"
  }
]
```

### 3.4 Get Available Planned Operations for VVE

**Endpoint:** `GET /api/executedOperations/vve/:vveId/available-planned-ops`

**Description:** Retrieve planned operations that can be converted to executed operations for a specific VVE. Used by the frontend to populate dropdowns when creating new executed operations.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vveId` | string (UUID) | Yes | Vessel Visit Execution ID |

**Response:**

**Status Code:** `200 OK`

**Response Body:**
```json
[
  {
    "id": "planned-op-123",
    "operationPlanId": "op-plan-456",
    "resourceId": "crane-1",
    "staffId": "operator-456",
    "plannedStart": "2025-01-15T09:00:00.000Z",
    "plannedEnd": "2025-01-15T10:00:00.000Z",
    "operationType": "unloading",
    "status": "scheduled"
  },
  {
    "id": "planned-op-124",
    "operationPlanId": "op-plan-456",
    "resourceId": "crane-2",
    "staffId": "operator-789",
    "plannedStart": "2025-01-15T10:30:00.000Z",
    "plannedEnd": "2025-01-15T12:00:00.000Z",
    "operationType": "loading",
    "status": "scheduled"
  }
]
```

## 4. Automatic Behaviors

### 4.1 VVE In-Progress Validation

- **Behavior**: System validates that the VVE is in "IN_PROGRESS" status before allowing executed operation updates
- **Error**: Returns error if VVE is not in progress: `"Vessel Visit Execution is not in progress. Current status: {status}"`
- **Rationale**: Executed operations can only be recorded for VVEs that are actively being executed

### 4.2 Planned Operation Synchronization

- **Behavior**: Status changes in executed operations automatically sync with corresponding planned operations
- **Mapping**:
  - `scheduled` → `PLANNED`
  - `started` → `IN_PROGRESS`
  - `completed` → `COMPLETED`
  - `delayed` → `DELAYED`
  - `cancelled` → `CANCELLED`
- **Sync Status**: Each executed operation tracks sync status ("synced", "pending", "failed")

### 4.3 Timestamp Validation

- **Behavior**: System validates that `actualEnd` is after `actualStart` when both are provided
- **Error**: Returns error if `actualEnd` is before `actualStart`
- **Status Rules**:
  - "completed" status requires `actualEnd`
  - "started" status requires `actualStart` but not `actualEnd`
  - "scheduled" status requires neither timestamp

## 5. Workflow

### 5.1 Creating New Executed Operation

1. **Frontend displays** available planned operations for the VVE
2. **Operator selects** a planned operation to execute
3. **System validates** VVE is in progress and planned operation exists
4. **Operator provides** actual start time, resource, and staff
5. **System creates** executed operation with initial status "started"
6. **System syncs** with planned operation (status → "IN_PROGRESS")
7. **Frontend updates** progress display

### 5.2 Updating Existing Executed Operation

1. **Operator updates** actual end time when operation completes
2. **Operator changes** status to "completed"
3. **System validates** timestamps and status consistency
4. **System syncs** with planned operation (status → "COMPLETED")
5. **Frontend reflects** updated progress

### 5.3 Marking Operation as Delayed

1. **Operator identifies** operation taking longer than planned
2. **Operator changes** status to "delayed"
3. **System syncs** with planned operation (status → "DELAYED")
4. **System may trigger** alerts or notifications

## 6. Data Models

### 6.1 CreateExecutedOperationDTO

```typescript
{
  vesselVisitExecutionId: string;   // Required: UUID of in-progress VVE
  plannedOperationId: string;       // Required: ID of existing planned operation
  resourceId: string;               // Required: Actual resource used
  staffId: string;                  // Required: Actual staff member
  actualStart: string;              // Required: ISO 8601 timestamp
  actualEnd?: string;               // Optional: ISO 8601 timestamp
  status: string;                   // Required: "scheduled" | "started" | "completed" | "delayed" | "cancelled"
}
```

### 6.2 UpdateExecutedOperationDTO

```typescript
{
  actualStart?: string;             // Optional: Updated start time
  actualEnd?: string;               // Optional: Updated end time
  status?: string;                  // Optional: Updated status
}
```

### 6.3 ExecutedOperationDTO

```typescript
{
  id: string;                       // Auto-generated UUID
  vesselVisitExecutionId: string;   // Reference to VVE
  plannedOperationId: string;       // Reference to planned operation
  resourceId: string;               // Actual resource used
  staffId: string;                  // Actual staff member
  actualStart: string;              // Actual start time
  actualEnd?: string;               // Actual end time (optional)
  status: string;                   // Current status
  syncStatus?: string;              // Sync status with planned operation
}
```

## 7. Status Flow

```
    ┌─────────────┐
    │  scheduled  │
    └──────┬──────┘
           │ (actualStart recorded)
           ▼
    ┌─────────────┐
    │   started   │
    └──────┬──────┘
           │ (actualEnd recorded)
           ▼
    ┌─────────────┐
    │  completed  │
    └─────────────┘
           │
           ▼
    ┌─────────────┐
    │   delayed   │◄──┐
    └─────────────┘   │ (if timeline exceeds)
           │          │
           ▼          │
    ┌─────────────┐   │
    │  cancelled  │───┘
    └─────────────┘
```

## 8. Error Handling

### 8.1 VVE Not In Progress

**Error Message:**
```
Vessel Visit Execution is not in progress. Current status: {status}
```

**HTTP Status:** 400 Bad Request

**Cause:** Attempting to record executed operations for a VVE that is not currently in progress.

**Resolution:** Verify VVE status or use appropriate endpoint for the current VVE state.

### 8.2 Planned Operation Not Found

**Error Message:**
```
Planned Operation {plannedOperationId} not found
```

**HTTP Status:** 400 Bad Request

**Cause:** Referenced planned operation does not exist in the system.

**Resolution:** Verify planned operation ID or check if operation plan needs to be generated.

### 8.3 Invalid Status Transition

**Error Message:**
```
Invalid status transition: cannot change from {currentStatus} to {newStatus}
```

**HTTP Status:** 400 Bad Request

**Cause:** Attempting an invalid status transition (e.g., from "completed" back to "started").

**Resolution:** Follow valid status flow: scheduled → started → completed/delayed/cancelled.

### 8.4 Timestamp Validation Error

**Error Message:**
```
actualEnd must be after actualStart
```

**HTTP Status:** 400 Bad Request

**Cause:** `actualEnd` timestamp is earlier than `actualStart` timestamp.

**Resolution:** Verify timestamps are correct and in chronological order.

## 9. Frontend Integration

### 9.1 Progress Update Page

**URL:** `/vesselVisitExecutions/:id/update-progress`

**Features:**
- Real-time display of executed operations
- Form for creating new executed operations
- Edit functionality for existing operations
- Status indicators and sync status
- Batch operations (mark all as completed)

### 9.2 Data Flow

1. **Load VVE Details**: GET `/api/vesselVisitExecutions/:id`
2. **Load Executed Operations**: GET `/api/executedOperations/vve/:vveId`
3. **Load Planned Operations**: GET `/api/executedOperations/vve/:vveId/available-planned-ops`
4. **Create Executed Operation**: POST `/api/executedOperations`
5. **Update Executed Operation**: PUT `/api/executedOperations/:opId`
6. **Batch Update**: Multiple PUT requests

## 10. Related Endpoints

- **Get VVE Details**: `GET /api/vesselVisitExecutions/:id`
- **Update VVE**: `PUT /api/vesselVisitExecutions/:id` (for dock/berth time updates)
- **Complete VVE**: `PUT /api/vesselVisitExecutions/:id/complete`
- **Get Planned Operations**: `GET /api/plannedOperations/plan/:planId`

## 11. Dependencies

- **4.1.7**: VVE Creation (required - must have in-progress VVE)
- **4.1.2**: Operation Plan Generation (required - must have planned operations)
- **Planned Operation Service**: For status synchronization
- **Operation Plan Repository**: For fetching planned operation details

## 12. Implementation Status

**REST API Endpoints**: Implemented  
**VVE In-Progress Validation**: Implemented  
**Planned Operation Synchronization**: Implemented  
**Status Mapping Logic**: Implemented  
**Error Handling**: Implemented  
**Timestamp Validation**: Implemented  
**Frontend SPA**: Implemented (see UpdateVVEProgressPage.jsx)  
**ViewModel**: Implemented (useUpdateVVEProgressVM.js)  
**Documentation**: This document

## 13. Related Files

### Backend (OEM Module - TypeScript)
- **Controller**: `OEM/src/controllers/IControllers/ExecutedOperationController.ts`
- **Service**: `OEM/src/services/ExecutedOperationService.ts`
- **Planned Operation Service**: `OEM/src/services/PlannedOperationService.ts`
- **Repository**: `OEM/src/repos/ExecutedOperationRepo.ts`
- **DTOs**: `OEM/src/dto/ExecutedOperationDTO.ts`
- **Schema**: `OEM/src/persistence/schemas/ExecutedOperationSchema.ts`

### Frontend (React/JavaScript)
- **Progress Update Page**: `Frontend/src/pages/VesselVisitExecutions/UpdateVVEProgressPage.jsx`
- **ViewModel**: `Frontend/src/viewmodels/VesselVisitExecutions/useUpdateVVEProgressVM.js`
- **API Service**: `Frontend/src/services/api.js`
- **Routing Configuration**: Updates to include `/vesselVisitExecutions/:id/update-progress`

### Domain Models
- **ExecutedOperation**: `OEM/src/Domain/ExecutedOperations/ExecutedOperation.ts`
- **PlannedOperation**: `OEM/src/Domain/PlannedOperations/PlannedOperation.ts`
- **Status Enums**: Defined in respective domain files

## 14. Database Schema

### ExecutedOperation Schema
```javascript
{
  domainId: String,                 // Primary key (UUID)
  vesselVisitExecutionId: String,   // Foreign key to VVE
  plannedOperationId: String,       // Foreign key to PlannedOperation
  resourceId: String,               // Actual resource used
  staffId: String,                  // Actual staff member
  actualStart: Date,                // Actual start time
  actualEnd: Date,                  // Actual end time (optional)
  status: String,                   // Current status
  syncStatus: String,               // Sync status with planned operation
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-generated
}
```

### Indexes
- `vesselVisitExecutionId`: For fast queries by VVE
- `plannedOperationId`: For status synchronization
- `status`: For filtering and reporting

## 15. Performance Considerations

1. **Batch Operations**: Use batch endpoints when updating multiple operations
2. **Index Optimization**: All foreign keys are indexed for join performance
3. **Sync Optimization**: Async status synchronization doesn't block response
4. **Caching**: Consider caching planned operations for VVE to reduce database queries

## 16. Security Considerations

1. **Role-Based Access**: Only Logistics Operators can update VVE progress
2. **VVE Status Validation**: Prevents updates to completed or cancelled VVEs
3. **Timestamp Validation**: Prevents invalid time entries
4. **Audit Logging**: All changes logged with user ID and timestamp

## 17. Testing Scenarios

### Positive Tests
1. Create executed operation for in-progress VVE
2. Update status from "started" to "completed"
3. Batch mark all operations as completed
4. Retrieve executed operations for VVE

### Negative Tests
1. Attempt to create executed operation for completed VVE
2. Attempt invalid status transition
3. Provide end time before start time
4. Reference non-existent planned operation

## 18. Notes

- Executed operations are read-only once VVE is marked as completed
- Status synchronization happens asynchronously to improve response times
- The system maintains referential integrity between executed and planned operations
- All timestamp comparisons use UTC to avoid timezone issues
- The frontend automatically refreshes data after updates to maintain consistency
