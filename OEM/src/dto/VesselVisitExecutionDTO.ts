export default interface VesselVisitExecutionDTO {
  id: string;
  vvnId: string;
  actualArrivalTime: string;
  actualBerthTime?: string;
  dockId?: string;
  status: string;
  createdBy: string;
}

export interface CreateVesselVisitExecutionDTO {
  vvnId: string;
  actualArrivalTime: string;
  actualBerthTime?: string;
  dockId?: string;
  status: string;
  createdBy: string;
}

export interface UpdateVesselVisitExecutionDTO {
  actualArrivalTime?: string;
  actualBerthTime?: string;
  dockId?: string;
  status?: string;
}