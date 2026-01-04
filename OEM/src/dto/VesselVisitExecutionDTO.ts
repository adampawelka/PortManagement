export interface VesselVisitExecutionDTO {
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
  status?: string;
  createdBy: string;
}

export interface UpdateVesselVisitExecutionDTO {
  actualArrivalTime?: string;
  actualBerthTime?: string;
  dockId?: string;
  status?: string;
}

// DTO para los filtros que vienen del Frontend/Controller
export interface VveSearchCriteriaDTO {
  dateStart?: string;
  dateEnd?: string;
  vesselName?: string; // O vvnId si filtramos por ID
  status?: string;
}

// DTO para la respuesta con Métricas (US 4.1.10)
export interface VveSearchDTO {
  id: string;
  vvnId: string;
  vesselName: string; 
  arrival: string;
  berth?: string;
  departure?: string; // Necesario para calcular Turnaround y Occupancy
  status: string;
  
  // Métricas Calculadas
  waitingTimeMinutes: number;      
  berthOccupancyMinutes: number;   
  totalTurnaroundMinutes: number;  
}
