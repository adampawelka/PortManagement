export interface ScheduledOperationDTO {
  vesselName: string;
  start: Date;        
  end: Date;          
  delay: number;
  dock: string;
  cranes: string[];
  staff: string[];
}

export interface OperationPlanDTO {
  id: string;
  vvnId: string;
  createdAt: Date;    
  createdBy: string;
  algorithmUsed: string;
  schedule: ScheduledOperationDTO[];
}

export interface CreateOperationPlanDTO {
  vvnId: string;
  createdAt: Date;
  createdBy: string;
  algorithmUsed: string;
  schedule: ScheduledOperationDTO[];
}

export interface UpdateOperationPlanDTO {
  createdAt?: Date;
  createdBy?: string;
  algorithmUsed?: string;
  schedule?: ScheduledOperationDTO[];
}

export interface SearchOperationPlanDTO {
  dateStart?: Date;            
  dateEnd?: Date;              
  operationDateStart?: Date;   
  operationDateEnd?: Date;     
  vesselName?: string;
  vvnId?: string;
  sortBy?: 'startTime' | 'vesselName' | 'delay' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface MissingPlanDTO {
  vvnId: string;
  vesselName: string;
  eta: string;
  status: string;
}

export interface ResourceAllocationDTO { //4.1.6
  resourceType: 'CRANE' | 'STAFF' | 'DOCK';
  resourceId: string;

  from: Date;
  to: Date;

  totalAllocatedMinutes: number;
  numberOfOperations: number;
}
