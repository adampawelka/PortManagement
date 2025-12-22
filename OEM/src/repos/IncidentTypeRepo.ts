import { IIncidentTypeRepo } from "../services/IRepos/IIncidentTypeRepo";

import { IncidentType } from "../domain/IncidentTypes/IncidentType";
import { IncidentTypeId } from "../domain/IncidentTypes/IncidentTypeId";

import IncidentTypeSchema from "../persistence/schemas/IncidentTypeSchema";
import { IncidentTypeMap } from "../mappers/IncidentTypeMap";

export class IncidentTypeRepo implements IIncidentTypeRepo {

  async save(type: IncidentType): Promise<void> {
    const persistence = IncidentTypeMap.toPersistence(type);

    await IncidentTypeSchema.findOneAndUpdate(
      { domainId: persistence.domainId },
      persistence,
      { upsert: true, new: true }
    );
  }

  async findById(
    id: IncidentTypeId
  ): Promise<IncidentType | null> {

    const doc = await IncidentTypeSchema.findOne({
      domainId: id.toString()
    });

    if (!doc) return null;

    return IncidentTypeMap.toDomain(doc);
  }

  async findByCode(
    code: string
  ): Promise<IncidentType | null> {

    const doc = await IncidentTypeSchema.findOne({ code });

    if (!doc) return null;

    return IncidentTypeMap.toDomain(doc);
  }

  async findAll(): Promise<IncidentType[]> {
    const docs = await IncidentTypeSchema.find({});

    return docs.map(doc => IncidentTypeMap.toDomain(doc));
  }

  async exists(
    id: IncidentTypeId
  ): Promise<boolean> {

    const count = await IncidentTypeSchema.countDocuments({
      domainId: id.toString()
    });

    return count > 0;
  }
}
