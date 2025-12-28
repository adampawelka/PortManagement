import { IExecutedOperationService } from "./IServices/IExecutedOperationService";
import { IPlannedOperationService } from "./IServices/IPlannedOperationService";
import { IExecutedOperationRepo } from "./IRepos/IExecutedOperationRepo";
import { IVesselVisitExecutionRepo } from "./IRepos/IVesselVisitExecutionRepo";

import {
  ExecutedOperationDTO,
  CreateExecutedOperationDTO,
  UpdateExecutedOperationDTO
} from "../dto/ExecutedOperationDTO";

import { ExecutedOperation } from "../Domain/ExecutedOperations/ExecutedOperation";
import { ExecutedOperationId } from "../Domain/ExecutedOperations/ExecutedOperationId";
import { VesselVisitExecutionId } from "../Domain/VesselVisitExecutions/VesselVisitExecutionId";
import { ResourceId } from "../Domain/ExecutedOperations/ResourceId";
import { StaffId } from "../Domain/ExecutedOperations/StaffId";
import { ActualStart } from "../Domain/ExecutedOperations/ActualStart";
import { ActualEnd } from "../Domain/ExecutedOperations/ActualEnd";
import {
  ExecutedOperationStatus,
  ExecutedOperationStatusEnum
} from "../Domain/ExecutedOperations/ExecutedOperationStatus";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";


export class ExecutedOperationService implements IExecutedOperationService {
  constructor(
    private readonly operationRepo: IExecutedOperationRepo,    
    private readonly plannedOpService: IPlannedOperationService,
    private readonly vveRepo: IVesselVisitExecutionRepo
  ) {}

  async create(dto: CreateExecutedOperationDTO): Promise<ExecutedOperationDTO> {
    const statusEnum = this.parseStatus(dto.status);

    const resourceId = ResourceId.create(dto.resourceId).getValue();
    const staffId = StaffId.create(dto.staffId).getValue();

    const vesselVisitExecutionId = dto.vesselVisitExecutionId; // string UUID
    const plannedOperationId = dto.plannedOperationId;         // string UUID

    const operationOrError = ExecutedOperation.create({
      vesselVisitExecutionId,
      plannedOperationId,
      resourceId,
      staffId,
      actualStart: ActualStart.create(new Date(dto.actualStart)).getValue(),
      actualEnd: dto.actualEnd ? ActualEnd.create(new Date(dto.actualEnd)).getValue() : undefined,
      status: ExecutedOperationStatus.create(statusEnum).getValue()
    });

    if (operationOrError.isFailure) {
      throw new Error(operationOrError.errorValue().toString());
    }

    const operation = operationOrError.getValue();
    await this.operationRepo.save(operation);
    return this.toDTO(operation);
  }

  async getById(id: string): Promise<ExecutedOperationDTO | null> {
    const operationId = ExecutedOperationId.create(new UniqueEntityID(id)); 
    const operation = await this.operationRepo.findById(operationId);
    return operation ? this.toDTO(operation) : null;
  }

  async getByVesselVisitExecutionId(vveId: string): Promise<ExecutedOperationDTO[]> {
    const operations = await this.operationRepo.findByVesselVisitExecutionId(vveId);
    return operations.map(op => this.toDTO(op));
  }

  async getAll(): Promise<ExecutedOperationDTO[]> {
    const operations = await this.operationRepo.findAll();
    return operations.map(op => this.toDTO(op));
  }

  async getAvailablePlannedOperationsForVVE(
    vesselVisitExecutionId: string
  ): Promise<any[]> {
    
    const vveId = VesselVisitExecutionId.caller(new UniqueEntityID(vesselVisitExecutionId));
    const vve = await this.vveRepo.findById(vveId);
    
    if (!vve) {
      throw new Error(`Vessel Visit Execution ${vesselVisitExecutionId} not found`);
    }

    if (vve.status.value !== 'IN_PROGRESS') {
      throw new Error(`Vessel Visit Execution is not in progress. Current status: ${vve.status.value}`);
    }
    return await this.plannedOpService.getPlannedOperationsForVVE(vesselVisitExecutionId);
  }

  async update(id: string, dto: UpdateExecutedOperationDTO): Promise<ExecutedOperationDTO | null> {
    const operationId = ExecutedOperationId.create(new UniqueEntityID(id)); 
    const operation = await this.operationRepo.findById(operationId);
    if (!operation) return null;

    if (dto.actualStart) {
      operation.updateActualStart(ActualStart.create(new Date(dto.actualStart)).getValue());
    }
    if (dto.actualEnd) {
      operation.updateActualEnd(ActualEnd.create(new Date(dto.actualEnd)).getValue());
    }
    if (dto.status) {
      const statusEnum = this.parseStatus(dto.status);
      operation.updateStatus(ExecutedOperationStatus.create(statusEnum).getValue());
    }

    await this.operationRepo.save(operation);
    return this.toDTO(operation);
  }

  private parseStatus(value: string): ExecutedOperationStatusEnum {
    if (!Object.values(ExecutedOperationStatusEnum).includes(value as ExecutedOperationStatusEnum)) {
      throw new Error(`Invalid ExecutedOperationStatus: ${value}`);
    }
    return value as ExecutedOperationStatusEnum;
  }

  private toDTO(operation: ExecutedOperation): ExecutedOperationDTO {
    return {
      id: operation.id.toString(),
      vesselVisitExecutionId: operation.vesselVisitExecutionId,
      plannedOperationId: operation.plannedOperationId,
      resourceId: operation.resourceId.value,
      staffId: operation.staffId.value,
      actualStart: operation.actualStart.value.toISOString(),
      actualEnd: operation.actualEnd ? operation.actualEnd.value.toISOString() : undefined,
      status: operation.status.value
    };
  }
}
