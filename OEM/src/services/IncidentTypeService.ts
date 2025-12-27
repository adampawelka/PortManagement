import { IIncidentTypeService } from "./IServices/IIncidentTypeService";
import { IIncidentTypeRepo } from "./IRepos/IIncidentTypeRepo";

import {
  IncidentTypeDTO,
  CreateIncidentTypeDTO,
  UpdateIncidentTypeDTO
} from "../dto/IncidentTypeDTO";

import { IncidentType } from "../Domain/IncidentTypes/IncidentType";
import { IncidentTypeId } from "../Domain/IncidentTypes/IncidentTypeId";

import { IncidentTypeCode } from "../Domain/IncidentTypes/IncidentTypeCode";
import { IncidentTypeName } from "../Domain/IncidentTypes/IncidentTypeName";
import { IncidentTypeDescription } from "../Domain/IncidentTypes/IncidentTypeDescription";
import {
  IncidentSeverity,
  IncidentSeverityEnum
} from "../Domain/Incidents/IncidentSeverity";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class IncidentTypeService implements IIncidentTypeService {

  constructor(
    private readonly incidentTypeRepo: IIncidentTypeRepo
  ) {}


  async create(
    dto: CreateIncidentTypeDTO
  ): Promise<IncidentTypeDTO> {

    const severityEnum = this.parseSeverity(dto.severity);

    const typeOrError = IncidentType.create({
      code: IncidentTypeCode.create(dto.code).getValue(),
      name: IncidentTypeName.create(dto.name).getValue(),
      description: IncidentTypeDescription.create(dto.description).getValue(),
      severity: IncidentSeverity.create(severityEnum).getValue()
    });

    if (typeOrError.isFailure) {
      throw new Error(typeOrError.errorValue().toString());
    }

    const type = typeOrError.getValue();
    await this.incidentTypeRepo.save(type);

    return this.toDTO(type);
  }

  async getById(
    id: string
  ): Promise<IncidentTypeDTO | null> {

    const typeId = IncidentTypeId.create(
      new UniqueEntityID(id)
    );

    const type = await this.incidentTypeRepo.findById(typeId);
    if (!type) return null;

    return this.toDTO(type);
  }

  async getByCode(
    code: string
  ): Promise<IncidentTypeDTO | null> {

    const type = await this.incidentTypeRepo.findByCode(code);
    if (!type) return null;

    return this.toDTO(type);
  }

 
  async getAll(): Promise<IncidentTypeDTO[]> {
    const types = await this.incidentTypeRepo.findAll();
    return types.map(t => this.toDTO(t));
  }

  async update(
    id: string,
    dto: UpdateIncidentTypeDTO
  ): Promise<IncidentTypeDTO | null> {

    const typeId = IncidentTypeId.create(
      new UniqueEntityID(id)
    );

    const type = await this.incidentTypeRepo.findById(typeId);
    if (!type) return null;

    if (dto.code) {
      type.props.code =
        IncidentTypeCode.create(dto.code).getValue();
    }

    if (dto.name) {
      type.props.name =
        IncidentTypeName.create(dto.name).getValue();
    }

    if (dto.description) {
      type.props.description =
        IncidentTypeDescription.create(dto.description).getValue();
    }

    if (dto.severity) {
      const severityEnum = this.parseSeverity(dto.severity);
      type.props.severity =
        IncidentSeverity.create(severityEnum).getValue();
    }

    await this.incidentTypeRepo.save(type);
    return this.toDTO(type);
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
    type: IncidentType
  ): IncidentTypeDTO {
    return {
      id: type.id.toString(),
      code: type.code.value,
      name: type.name.value,
      description: type.description.value,
      severity: type.severity.value
    };
  }
}
