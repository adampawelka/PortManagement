export interface ScheduledOperationDTO {
  vesselName: string;
  start: string;
  end: string;
  delay: number;
  dock: string;
  crane: string;
  staff: string; 
}

export interface OperationPlanDTO {
  id: string;
  vesselVisitExecutionId: string;
  createdAt: string;
  createdBy: string;
  algorithmUsed: string;
  schedule: ScheduledOperationDTO[];
}


export interface CreateOperationPlanDTO {
  vesselVisitExecutionId: string;
  createdAt: string;
  createdBy: string;
  algorithmUsed: string;
  schedule: ScheduledOperationDTO[];
}

export interface UpdateOperationPlanDTO {
  createdAt?: string;
  createdBy?: string;
  algorithmUsed?: string;
  schedule?: ScheduledOperationDTO[];
}
