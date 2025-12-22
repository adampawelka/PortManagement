export default interface IIncidentDTO {
  id: string;
  incidentTypeId: string;
  startTime: string;
  endTime?: string;
  severity: string;
  description: string;
  createdBy: string;
}
