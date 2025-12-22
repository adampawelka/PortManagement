import {
  IncidentTypeDTO,
  CreateIncidentTypeDTO,
  UpdateIncidentTypeDTO
} from "../../dto/IncidentTypeDTO";

export interface IIncidentTypeService {
  create(dto: CreateIncidentTypeDTO): Promise<IncidentTypeDTO>;
  getById(id: string): Promise<IncidentTypeDTO | null>;
  getByCode(code: string): Promise<IncidentTypeDTO | null>;
  getAll(): Promise<IncidentTypeDTO[]>;
  update(id: string, dto: UpdateIncidentTypeDTO): Promise<IncidentTypeDTO | null>;
}
