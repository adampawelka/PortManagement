export interface OperatorPlanDTO {
  id: string;
  vveId: string;
  createdAt: string;
  createdBy: string;
  algorithmUsed: string;
}

export interface CreateOperatorPlanDTO {
  vveId: string;
  createdAt: string;
  createdBy: string;
  algorithmUsed: string;
}

export interface UpdateOperatorPlanDTO {
  createdAt?: string;
  createdBy?: string;
  algorithmUsed?: string;
}