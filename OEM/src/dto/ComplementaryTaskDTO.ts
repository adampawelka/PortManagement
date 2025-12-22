export default interface ComplementaryTaskDTO {
  id: string;
  vveId: string;
  categoryId: string;
  responsibleTeam: string;
  startTime: string;
  endTime?: string;
  status: string;
}

export interface CreateComplementaryTaskDTO {
  vveId: string;
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