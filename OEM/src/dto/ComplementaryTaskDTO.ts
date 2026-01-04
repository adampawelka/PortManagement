export interface ComplementaryTaskDTO {
  id: string;
  vesselVisitExecutionId: string;
  categoryId: string;
  responsibleTeam: string;
  startTime: string;
  endTime?: string;
  status: string;
  executionMode?: string;
}

export interface CreateComplementaryTaskDTO {
  vesselVisitExecutionId: string;
  categoryId: string;
  responsibleTeam: string;
  startTime: string;
  endTime?: string;
  status: string;
  executionMode?: 'PARALLEL' | 'SUSPEND';
}

export interface UpdateComplementaryTaskDTO {
  responsibleTeam?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}