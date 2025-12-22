import { IncidentType } from "../../Domain/IncidentTypes/IncidentType";
import { IncidentTypeId } from "../../Domain/IncidentTypes/IncidentTypeId";

export interface IIncidentTypeRepo {
  save(type: IncidentType): Promise<void>;
  findById(id: IncidentTypeId): Promise<IncidentType | null>;
  findByCode(code: string): Promise<IncidentType | null>;
  findAll(): Promise<IncidentType[]>;
  exists(id: IncidentTypeId): Promise<boolean>;
}
