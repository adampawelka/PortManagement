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
import { IncidentSeverity, IncidentSeverityEnum } from "../Domain/Incidents/IncidentSeverity";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class IncidentTypeService implements IIncidentTypeService {

  constructor(private readonly incidentTypeRepo: IIncidentTypeRepo) {}

  async create(dto: CreateIncidentTypeDTO): Promise<IncidentTypeDTO> {
    const severityEnum = this.parseSeverity(dto.severity);

    const existing = await this.incidentTypeRepo.findByCode(dto.code);
    if (existing) throw new Error(`IncidentType code "${dto.code}" already exists.`);

    let parentId: IncidentTypeId | undefined;
    let parentName: string | undefined;

    if (dto.parentId) {
      const parent = await this.incidentTypeRepo.findById(
        IncidentTypeId.create(new UniqueEntityID(dto.parentId))
      );
      if (!parent) throw new Error(`Parent IncidentType with id ${dto.parentId} not found`);
      parentId = IncidentTypeId.create(parent.id);
      parentName = parent.name.value;
    }

    const typeOrError = IncidentType.create({
      code: IncidentTypeCode.create(dto.code).getValue(),
      name: IncidentTypeName.create(dto.name).getValue(),
      description: IncidentTypeDescription.create(dto.description).getValue(),
      severity: IncidentSeverity.create(severityEnum).getValue(),
      parentId: parentId?.id
    });

    if (typeOrError.isFailure) throw new Error(typeOrError.errorValue().toString());

    const type = typeOrError.getValue();
    await this.incidentTypeRepo.save(type);

    return this.toDTO(type, parentName);
  }

  async getById(id: string): Promise<IncidentTypeDTO | null> {
    const type = await this.incidentTypeRepo.findById(
      IncidentTypeId.create(new UniqueEntityID(id))
    );
    if (!type) return null;

    let parentName: string | undefined;
    if (type.parentId) {
      const parent = await this.incidentTypeRepo.findById(
        IncidentTypeId.create(type.parentId)
      );
      parentName = parent?.name.value;
    }

    return this.toDTO(type, parentName);
  }

  async getByCode(code: string): Promise<IncidentTypeDTO | null> {
    const type = await this.incidentTypeRepo.findByCode(code);
    if (!type) return null;

    let parentName: string | undefined;
    if (type.parentId) {
      const parent = await this.incidentTypeRepo.findById(
        IncidentTypeId.create(type.parentId)
      );
      parentName = parent?.name.value;
    }

    return this.toDTO(type, parentName);
  }

  async getAll(): Promise<IncidentTypeDTO[]> {
    const types = await this.incidentTypeRepo.findAll();
    const result: IncidentTypeDTO[] = [];

    for (const type of types) {
      let parentName: string | undefined;
      if (type.parentId) {
        const parent = await this.incidentTypeRepo.findById(
          IncidentTypeId.create(type.parentId)
        );
        parentName = parent?.name.value;
      }
      result.push(this.toDTO(type, parentName));
    }

    return result;
  }

  async getByParentId(parentId: string): Promise<IncidentTypeDTO[]> {
    const types = await this.incidentTypeRepo.findByParentId(
      IncidentTypeId.create(new UniqueEntityID(parentId))
    );

    const result: IncidentTypeDTO[] = [];
    for (const type of types) {
      let parentName: string | undefined;
      if (type.parentId) {
        const parent = await this.incidentTypeRepo.findById(
          IncidentTypeId.create(type.parentId)
        );
        parentName = parent?.name.value;
      }
      result.push(this.toDTO(type, parentName));
    }

    return result;
  }

  async update(id: string, dto: UpdateIncidentTypeDTO): Promise<IncidentTypeDTO | null> {
    const type = await this.incidentTypeRepo.findById(
      IncidentTypeId.create(new UniqueEntityID(id))
    );
    if (!type) return null;

    if (dto.code) {
      const existing = await this.incidentTypeRepo.findByCode(dto.code);
      if (existing && existing.id.toString() !== id)
        throw new Error(`IncidentType code "${dto.code}" already exists.`);
      type.props.code = IncidentTypeCode.create(dto.code).getValue();
    }

    if (dto.name) type.props.name = IncidentTypeName.create(dto.name).getValue();
    if (dto.description) type.props.description = IncidentTypeDescription.create(dto.description).getValue();
    if (dto.severity) type.props.severity = IncidentSeverity.create(this.parseSeverity(dto.severity)).getValue();

    if (dto.parentId !== undefined) {
      if (dto.parentId === null) {
        type.setParent(undefined);
      } else {
        const parent = await this.incidentTypeRepo.findById(
          IncidentTypeId.create(new UniqueEntityID(dto.parentId))
        );
        if (!parent) throw new Error(`Parent IncidentType with id ${dto.parentId} not found`);
        type.setParent(parent.id);
      }
    }

    await this.incidentTypeRepo.save(type);

    let parentName: string | undefined;
    if (type.parentId) {
      const parent = await this.incidentTypeRepo.findById(
        IncidentTypeId.create(type.parentId)
      );
      parentName = parent?.name.value;
    }

    return this.toDTO(type, parentName);
  }

  private parseSeverity(value: string): IncidentSeverityEnum {
    if (!Object.values(IncidentSeverityEnum).includes(value as IncidentSeverityEnum))
      throw new Error(`Invalid IncidentSeverity: ${value}`);
    return value as IncidentSeverityEnum;
  }

  private toDTO(type: IncidentType, parentName?: string): IncidentTypeDTO {
    return {
      id: type.id.toString(),
      code: type.code.value,
      name: type.name.value,
      description: type.description.value,
      severity: type.severity.value,
      parentId: type.parentId?.toString() ?? null,
      parentName
    };
  }
}
