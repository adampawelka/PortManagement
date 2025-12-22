export default interface IncidentTypeDTO {
  id: string;
  code: string;
  name: string;
  description: string;
  severity: string;
}

export interface CreateIncidentTypeDTO {
  code: string;
  name: string;
  description: string;
  severity: string;
}

export interface UpdateIncidentTypeDTO {
  code?: string;
  name?: string;
  description?: string;
  severity?: string;
}