export interface IncidentTypeDTO {
  id: string;
  code: string;
  name: string;
  description: string;
  severity: string;
  parentId?: string | null; 
  parentName?: string;      
}

export interface CreateIncidentTypeDTO {
  code: string;
  name: string;
  description: string;
  severity: string;
  parentId?: string | null; 
}

export interface UpdateIncidentTypeDTO {
  code?: string;
  name?: string;
  description?: string;
  severity?: string;
  parentId?: string | null; 
}
