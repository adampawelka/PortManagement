export interface ExecutedOperationDTO {
  id: string;
  vesselVisitExecutionId: string;
  plannedOperationId: string;
  resourceId: string;
  staffId: string;
  actualStart: string;
  actualEnd?: string;
  status: string;
}

export interface CreateExecutedOperationDTO {
  vesselVisitExecutionId: string;
  plannedOperationId: string;
  resourceId: string;
  staffId: string;
  actualStart: string;
  actualEnd?: string;
  status: string;
}

export interface UpdateExecutedOperationDTO {
  actualStart?: string;
  actualEnd?: string;
  status?: string;
}
