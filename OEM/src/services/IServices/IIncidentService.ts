import {
  IncidentDTO,
  CreateIncidentDTO,
  UpdateIncidentDTO,
  IncidentSearchCriteriaDTO
} from "../../dto/IncidentDTO";

export interface IIncidentService {
  create(dto: CreateIncidentDTO): Promise<IncidentDTO>;
  getById(id: string): Promise<IncidentDTO | null>;
  getByIncidentType(incidentTypeId: string): Promise<IncidentDTO[]>;
  getAll(): Promise<IncidentDTO[]>;
  search(criteria: IncidentSearchCriteriaDTO): Promise<IncidentDTO[]>;
  update(id: string, dto: UpdateIncidentDTO): Promise<IncidentDTO | null>;
}
