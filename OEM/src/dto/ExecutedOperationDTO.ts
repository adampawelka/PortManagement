export default interface IExecutedOperationDTO {
  id: string;
  vveId: string;
  plannedOperationId: string;
  resourceId: string;
  staffId: string;
  actualStart: string;
  actualEnd?: string;
  status: string;
}
