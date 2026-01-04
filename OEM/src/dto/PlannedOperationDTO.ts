export interface PlannedOperationDTO {
  id: string;
  operationPlanId: string;
  resourceId: string;
  staffId: string;
  plannedStart: string; // ISO string
  plannedEnd: string;   // ISO string
  operationType: string;
  status: string;
}

export interface CreatePlannedOperationDTO {
  operationPlanId: string;
  resourceId: string;
  staffId: string;
  plannedStart: string;
  plannedEnd: string;
  operationType: string;
}

export interface UpdatePlannedOperationDTO {
  plannedStart?: string;
  plannedEnd?: string;
  status?: string;
}
