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

// DTO for filtering incidents (US 4.1.13)
export interface IncidentSearchCriteriaDTO {
  vesselName?: string;
  dateStart?: string;
  dateEnd?: string;
  severity?: string;
  status?: 'active' | 'resolved'; // active = no endTime, resolved = has endTime
}