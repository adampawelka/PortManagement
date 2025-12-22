import { Incident } from "../Domain/Incidents/Incident";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class IncidentMap {

  static toPersistence(incident: Incident): any {
    return {
      domainId: incident.incidentId.toString(),
      incidentTypeId: incident.incidentTypeId.toString(),
      startTime: incident.startTime.value,
      endTime: incident.endTime?.value ?? null,
      severity: incident.severity.value,
      description: incident.description.value,
      createdBy: incident.createdBy.value
    };
  }

  static toDomain(raw: any): Incident {
    const data = raw.toObject ? raw.toObject() : raw;

    const incidentOrError = Incident.create(
      {
        incidentTypeId: data.incidentTypeId,
        startTime: data.startTime,
        endTime: data.endTime ?? undefined,
        severity: data.severity,
        description: data.description,
        createdBy: data.createdBy
      },
      new UniqueEntityID(data.domainId)
    );

    if (incidentOrError.isFailure) {
      throw new Error(incidentOrError.errorValue().toString());
    }

    return incidentOrError.getValue();
  }
}
