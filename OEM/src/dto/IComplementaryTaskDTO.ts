export default interface IComplementaryTaskDTO {
  id: string;
  vveId: string;
  categoryId: string;
  responsibleTeam: string;
  startTime: string;
  endTime?: string;
  status: string;
}
