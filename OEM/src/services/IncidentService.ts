import { IIncidentService } from "./IServices/IIncidentService";
import { IIncidentRepo } from "./IRepos/IIncidentRepo";

import {
  IncidentDTO,
  CreateIncidentDTO,
  UpdateIncidentDTO,
  IncidentSearchCriteriaDTO
} from "../dto/IncidentDTO";

import { Incident } from "../Domain/Incidents/Incident";
import { IncidentId } from "../Domain/Incidents/IncidentId";
import { IncidentTypeId } from "../Domain/IncidentTypes/IncidentTypeId";

import { IncidentStartTime } from "../Domain/Incidents/IncidentStartTime";
import { IncidentEndTime } from "../Domain/Incidents/IncidentEndTime";
import {
  IncidentSeverity,
  IncidentSeverityEnum
} from "../Domain/Incidents/IncidentSeverity";
import { IncidentDescription } from "../Domain/Incidents/IncidentDescription";
import { CreatedBy } from "../Domain/Incidents/CreatedBy";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class IncidentService implements IIncidentService {

  constructor(
    private readonly incidentRepo: IIncidentRepo
  ) {}

  async create(
    dto: CreateIncidentDTO
  ): Promise<IncidentDTO> {

    const severityEnum = this.parseSeverity(dto.severity);

    const incidentOrError = Incident.create({
      incidentTypeId: IncidentTypeId.create(
        new UniqueEntityID(dto.incidentTypeId)
      ),
      startTime: IncidentStartTime.create(
        new Date(dto.startTime)
      ).getValue(),
      endTime: dto.endTime
        ? IncidentEndTime.create(new Date(dto.endTime)).getValue()
        : undefined,
      severity: IncidentSeverity.create(severityEnum).getValue(),
      description: IncidentDescription.create(dto.description).getValue(),
      createdBy: CreatedBy.create(dto.createdBy).getValue()
    });

    if (incidentOrError.isFailure) {
      throw new Error(incidentOrError.errorValue().toString());
    }

    const incident = incidentOrError.getValue();
    await this.incidentRepo.save(incident);

    return this.toDTO(incident);
  }

  async getById(
    id: string
  ): Promise<IncidentDTO | null> {

    const incidentId = IncidentId.create(
      new UniqueEntityID(id)
    );

    const incident = await this.incidentRepo.findById(incidentId);
    if (!incident) return null;

    return this.toDTO(incident);
  }

  async getByIncidentType(
    incidentTypeId: string
  ): Promise<IncidentDTO[]> {

    const typeId = IncidentTypeId.create(
      new UniqueEntityID(incidentTypeId)
    );

    const incidents =
      await this.incidentRepo.findByIncidentType(typeId);

    return incidents.map(i => this.toDTO(i));
  }

  async getAll(): Promise<IncidentDTO[]> {
    const incidents = await this.incidentRepo.findAll();
    return incidents.map(i => this.toDTO(i));
  }

  async search(criteria: IncidentSearchCriteriaDTO): Promise<IncidentDTO[]> {
    const allIncidents = await this.incidentRepo.findAll();
    let filtered = allIncidents.map(i => this.toDTO(i));

    // Filter by date range (startTime)
    if (criteria.dateStart) {
      const start = new Date(criteria.dateStart);
      filtered = filtered.filter(inc => new Date(inc.startTime) >= start);
    }

    if (criteria.dateEnd) {
      const end = new Date(criteria.dateEnd);
      // Include incidents that started before or during the end date
      filtered = filtered.filter(inc => new Date(inc.startTime) <= end);
    }

    // Filter by severity
    if (criteria.severity) {
      filtered = filtered.filter(inc => 
        inc.severity.toLowerCase() === criteria.severity?.toLowerCase()
      );
    }

    // Filter by status (active = no endTime, resolved = has endTime)
    if (criteria.status) {
      if (criteria.status === 'active') {
        filtered = filtered.filter(inc => !inc.endTime);
      } else if (criteria.status === 'resolved') {
        filtered = filtered.filter(inc => !!inc.endTime);
      }
    }

    // Filter by vessel name
    // Note: Vessel filtering requires VVE association (to be implemented in sub-issue #4)
    // For now, this is a placeholder - vessel filtering will be added when VVE association is implemented
    if (criteria.vesselName) {
      // TODO: Implement vessel filtering when VVE association is added
      console.log(`[IncidentService] Vessel filtering requested for "${criteria.vesselName}" - requires VVE association (sub-issue #4)`);
    }

    return filtered;
  }

  async update(
    id: string,
    dto: UpdateIncidentDTO
  ): Promise<IncidentDTO | null> {

    const incidentId = IncidentId.create(
      new UniqueEntityID(id)
    );

    const incident = await this.incidentRepo.findById(incidentId);
    if (!incident) return null;

    if (dto.incidentTypeId) {
      incident.props.incidentTypeId =
        IncidentTypeId.create(new UniqueEntityID(dto.incidentTypeId));
    }

    if (dto.startTime) {
      incident.props.startTime =
        IncidentStartTime.create(new Date(dto.startTime)).getValue();
    }

    if (dto.endTime) {
      incident.props.endTime =
        IncidentEndTime.create(new Date(dto.endTime)).getValue();
    }

    if (dto.severity) {
      const severityEnum = this.parseSeverity(dto.severity);
      incident.props.severity =
        IncidentSeverity.create(severityEnum).getValue();
    }

    if (dto.description) {
      incident.props.description =
        IncidentDescription.create(dto.description).getValue();
    }

    if (dto.createdBy) {
      incident.props.createdBy =
        CreatedBy.create(dto.createdBy).getValue();
    }

    await this.incidentRepo.save(incident);
    return this.toDTO(incident);
  }

  private parseSeverity(
    value: string
  ): IncidentSeverityEnum {

    if (
      !Object.values(IncidentSeverityEnum).includes(
        value as IncidentSeverityEnum
      )
    ) {
      throw new Error(`Invalid IncidentSeverity: ${value}`);
    }

    return value as IncidentSeverityEnum;
  }

  private toDTO(
    incident: Incident
  ): IncidentDTO {
    return {
      id: incident.id.toString(),
      incidentTypeId: incident.incidentTypeId.toString(),
      startTime: incident.startTime.value.toISOString(),
      endTime: incident.endTime
        ? incident.endTime.value.toISOString()
        : undefined,
      severity: incident.severity.value,
      description: incident.description.value,
      createdBy: incident.createdBy.value
    };
  }
}
