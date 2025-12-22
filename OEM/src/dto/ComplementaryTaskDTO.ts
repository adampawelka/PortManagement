export interface ComplementaryTaskDTO {
  id: string;
  vesselVisitExecutionId: string;
  categoryId: string;
  responsibleTeam: string;
  startTime: string;
  endTime?: string;
  status: string;
}

export interface CreateComplementaryTaskDTO {
  vesselVisitExecutionId: string;
  categoryId: string;
  responsibleTeam: string;
  startTime: string;
  endTime?: string;
  status: string;
}

export interface UpdateComplementaryTaskDTO {
  responsibleTeam?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}