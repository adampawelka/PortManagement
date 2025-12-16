export default interface IVesselVisitExecutionDTO {
  id: string;
  vvnId: string;
  actualArrivalTime: string;
  actualBerthTime?: string;
  dockId?: string;
  status: string;
  createdBy: string;
}
