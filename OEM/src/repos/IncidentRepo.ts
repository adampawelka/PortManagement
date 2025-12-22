import { IIncidentRepo } from "../services/IRepos/IIncidentRepo";

import { Incident } from "../domain/Incidents/Incident";
import { IncidentId } from "../domain/Incidents/IncidentId";
import { IncidentTypeId } from "../domain/IncidentTypes/IncidentTypeId";

import IncidentSchema from "../persistence/schemas/IncidentSchema";
import { IncidentMap } from "../mappers/IncidentMap";

export class IncidentRepo implements IIncidentRepo {

  async save(incident: Incident): Promise<void> {
    const persistence = IncidentMap.toPersistence(incident);

    await IncidentSchema.findOneAndUpdate(
      { domainId: persistence.domainId },
      persistence,
      { upsert: true, new: true }
    );
  }

  async findById(
    id: IncidentId
  ): Promise<Incident | null> {

    const doc = await IncidentSchema.findOne({
      domainId: id.toString()
    });

    if (!doc) return null;

    return IncidentMap.toDomain(doc);
  }

  async findByIncidentType(
    incidentTypeId: IncidentTypeId
  ): Promise<Incident[]> {

    const docs = await IncidentSchema.find({
      incidentTypeId: incidentTypeId.toString()
    });

    return docs.map(doc => IncidentMap.toDomain(doc));
  }

  async findAll(): Promise<Incident[]> {

    const docs = await IncidentSchema.find({});

    return docs.map(doc => IncidentMap.toDomain(doc));
  }

  async exists(
    id: IncidentId
  ): Promise<boolean> {

    const count = await IncidentSchema.countDocuments({
      domainId: id.toString()
    });

    return count > 0;
  }
}
