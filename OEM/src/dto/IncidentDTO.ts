export interface IncidentDTO {
  id: string;
  incidentTypeId: string;
  startTime: string;
  endTime?: string;
  severity: string;
  description: string;
  createdBy: string;
}

export interface CreateIncidentDTO {
  incidentTypeId: string;
  startTime: string;
  endTime?: string;
  severity: string;
  description: string;
  createdBy: string;
}

export interface UpdateIncidentDTO {
  incidentTypeId?: string;
  startTime?: string;
  endTime?: string;
  severity?: string;
  description?: string;
  createdBy?: string;
}