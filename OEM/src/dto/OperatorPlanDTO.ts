export interface OperatorPlanDTO {
  id: string;
  vesselVisitExecutionId: string;
  createdAt: string;
  createdBy: string;
  algorithmUsed: string;
}

export interface CreateOperatorPlanDTO {
  vesselVisitExecutionId: string;
  createdAt: string;
  createdBy: string;
  algorithmUsed: string;
}

export interface UpdateOperatorPlanDTO {
  createdAt?: string;
  createdBy?: string;
  algorithmUsed?: string;
}