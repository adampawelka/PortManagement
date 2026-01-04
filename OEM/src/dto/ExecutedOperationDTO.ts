export interface ExecutedOperationDTO {
  id: string;
  vesselVisitExecutionId: string;
  plannedOperationId: string;
  operationPlanId?: string;
  resourceId: string;
  staffId: string;
  actualStart: string;
  actualEnd?: string;
  status: string;
  syncStatus?: string;
}

export interface CreateExecutedOperationDTO {
  vesselVisitExecutionId: string;
  plannedOperationId: string;
  operationPlanId?: string;
  resourceId: string;
  staffId: string;
  actualStart: string;
  actualEnd?: string;
  status: string;
  syncStatus?: string;
}

export interface UpdateExecutedOperationDTO {
  actualStart?: string;
  actualEnd?: string;
  status?: string;
  syncStatus?: string;
}
