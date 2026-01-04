import { IncidentType } from "../Domain/IncidentTypes/IncidentType";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class IncidentTypeMap {

  static toPersistence(type: IncidentType): any {
    return {
      domainId: type.id.toString(),
      code: type.code.value,
      name: type.name.value,
      description: type.description.value,
      severity: type.severity.value,
      parentId: type.parentId ? type.parentId.toString() : null,
    };
  }

  static toDomain(raw: any): IncidentType {
    const data = raw.toObject ? raw.toObject() : raw;

    const typeOrError = IncidentType.create(
      {
        code: data.code,
        name: data.name,
        description: data.description,
        severity: data.severity,
        parentId: data.parentId ? new UniqueEntityID(data.parentId) : undefined,
      },
      new UniqueEntityID(data.domainId)
    );

    if (typeOrError.isFailure) {
      throw new Error(typeOrError.errorValue().toString());
    }

    return typeOrError.getValue();
  }
}
