import { Incident } from "../../Domain/Incidents/Incident";
import { IncidentId } from "../../Domain/Incidents/IncidentId";
import { IncidentTypeId } from "../../Domain/IncidentTypes/IncidentTypeId";

export interface IIncidentRepo {
  save(incident: Incident): Promise<void>;
  findById(id: IncidentId): Promise<Incident | null>;
  findByIncidentType(
    incidentTypeId: IncidentTypeId
  ): Promise<Incident[]>;
  findAll(): Promise<Incident[]>;
  exists(id: IncidentId): Promise<boolean>;
}
