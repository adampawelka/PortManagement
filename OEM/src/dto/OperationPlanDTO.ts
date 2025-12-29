export interface ScheduledOperationDTO {
  vesselName: string;
  start: string;
  end: string;
  delay: number;
  dock: string;
  crane: string;
  staff: string; 
}

export interface OperationPlanDTO {
  id: string;
  vvnId: string;
  createdAt: string;
  createdBy: string;
  algorithmUsed: string;
  schedule: ScheduledOperationDTO[];
}


export interface CreateOperationPlanDTO {
  vvnId: string;
  createdAt: string;
  createdBy: string;
  algorithmUsed: string;
  schedule: ScheduledOperationDTO[];
}

export interface UpdateOperationPlanDTO {
  createdAt?: string;
  createdBy?: string;
  algorithmUsed?: string;
  schedule?: ScheduledOperationDTO[];
}

export interface SearchOperationPlanDTO {
  dateStart?: string;      // ISO date string for plan creation date range start
  dateEnd?: string;        // ISO date string for plan creation date range end
  operationDateStart?: string;  // ISO date string for schedule operation start date
  operationDateEnd?: string;    // ISO date string for schedule operation end date
  vesselName?: string;     // Filter by vessel name in schedule
  vvnId?: string;          // Filter by VVN ID
  sortBy?: 'startTime' | 'vesselName' | 'delay' | 'createdAt';  // Sort field
  sortOrder?: 'asc' | 'desc';  // Sort direction
}
