export interface OperationPlanDTO {
  id: string;
  vesselVisitExecutionId: string;
  createdAt: string;
  createdBy: string;
  algorithmUsed: string;
}

export interface CreateOperationPlanDTO {
  vesselVisitExecutionId: string;
  createdAt: string;
  createdBy: string;
  algorithmUsed: string;
}

export interface UpdateOperationPlanDTO {
  createdAt?: string;
  createdBy?: string;
  algorithmUsed?: string;
}

export interface MissingPlanVvnDTO {
  vvnId: string;
  vesselName: string;
  imo: string;
  eta: string;
  status: string;
}

