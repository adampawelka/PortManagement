export interface ExecutedOperationDTO {
  id: string;
  vveId: string;
  plannedOperationId: string;
  resourceId: string;
  staffId: string;
  actualStart: string;
  actualEnd?: string;
  status: string;
}

export interface CreateExecutedOperationDTO {
  vveId: string;
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
