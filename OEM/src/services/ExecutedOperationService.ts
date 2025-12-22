import { IExecutedOperationService } from "./IServices/IExecutedOperationService";
import { IExecutedOperationRepo } from "./IRepos/IExecutedOperationRepo";

import {
  ExecutedOperationDTO,
  CreateExecutedOperationDTO,
  UpdateExecutedOperationDTO
} from "../dto/ExecutedOperationDTO";

import { ExecutedOperation } from "../Domain/ExecutedOperations/ExecutedOperation";
import { ExecutedOperationId } from "../Domain/ExecutedOperations/ExecutedOperationId";
import { VesselVisitExecutionId } from "../Domain/VesselVisitExecutions/VesselVisitExecutionId";
import { PlannedOperationId } from "../Domain/PlannedOperations/PlannedOperationId";
import { PlannedResourceId } from "../Domain/PlannedOperations/PlannedResourceId";
import { PlannedStaffId } from "../Domain/PlannedOperations/PlannedStaffId";
import { ActualStart } from "../Domain/ExecutedOperations/ActualStart";
import { ActualEnd } from "../Domain/ExecutedOperations/ActualEnd";
import {
  ExecutedOperationStatus,
  ExecutedOperationStatusEnum
} from "../Domain/ExecutedOperations/ExecutedOperationStatus";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class ExecutedOperationService
  implements IExecutedOperationService {

  constructor(
    private readonly operationRepo: IExecutedOperationRepo
  ) {}

  // ----------------------------------------------------
  // CREATE
  // ----------------------------------------------------
  async create(
    dto: CreateExecutedOperationDTO
  ): Promise<ExecutedOperationDTO> {

    const statusEnum = this.parseStatus(dto.status);

    const operationOrError = ExecutedOperation.create({
      vesselVisitExecutionId: VesselVisitExecutionId.caller(
        new UniqueEntityID(dto.vesselVisitExecutionId)
      ),
      plannedOperationId: PlannedOperationId.caller(
        new UniqueEntityID(dto.plannedOperationId)
      ),
      resourceId: PlannedResourceId.caller(
        new UniqueEntityID(dto.resourceId)
      ),
      staffId: PlannedStaffId.caller(
        new UniqueEntityID(dto.staffId)
      ),
      actualStart: ActualStart.create(
        new Date(dto.actualStart)
      ).getValue(),
      actualEnd: dto.actualEnd
        ? ActualEnd.create(new Date(dto.actualEnd)).getValue()
        : undefined,
      status: ExecutedOperationStatus.create(statusEnum).getValue()
    });

    if (operationOrError.isFailure) {
      throw new Error(operationOrError.errorValue().toString());
    }

    const operation = operationOrError.getValue();
    await this.operationRepo.save(operation);

    return this.toDTO(operation);
  }

  // ----------------------------------------------------
  // GET BY ID
  // ----------------------------------------------------
  async getById(
    id: string
  ): Promise<ExecutedOperationDTO | null> {

    const operationId = ExecutedOperationId.caller(
      new UniqueEntityID(id)
    );

    const operation = await this.operationRepo.findById(operationId);
    if (!operation) return null;

    return this.toDTO(operation);
  }

  // ----------------------------------------------------
  // GET BY VVE
  // ----------------------------------------------------
  async getByVesselVisitExecutionId(
    vesselVisitExecutionId: string
  ): Promise<ExecutedOperationDTO[]> {

    const vve = VesselVisitExecutionId.caller(
      new UniqueEntityID(vesselVisitExecutionId)
    );

    const operations =
      await this.operationRepo.findByVesselVisitExecutionId(vve);

    return operations.map(op => this.toDTO(op));
  }

  // ----------------------------------------------------
  // GET ALL
  // ----------------------------------------------------
  async getAll(): Promise<ExecutedOperationDTO[]> {
    const operations = await this.operationRepo.findAll();
    return operations.map(op => this.toDTO(op));
  }

  // ----------------------------------------------------
  // UPDATE
  // ----------------------------------------------------
  async update(
    id: string,
    dto: UpdateExecutedOperationDTO
  ): Promise<ExecutedOperationDTO | null> {

    const operationId = ExecutedOperationId.caller(
      new UniqueEntityID(id)
    );

    const operation = await this.operationRepo.findById(operationId);
    if (!operation) return null;

    if (dto.actualStart) {
      operation.props.actualStart =
        ActualStart.create(new Date(dto.actualStart)).getValue();
    }

    if (dto.actualEnd) {
      operation.props.actualEnd =
        ActualEnd.create(new Date(dto.actualEnd)).getValue();
    }

    if (dto.status) {
      const statusEnum = this.parseStatus(dto.status);
      operation.props.status =
        ExecutedOperationStatus.create(statusEnum).getValue();
    }

    await this.operationRepo.save(operation);
    return this.toDTO(operation);
  }

  // ----------------------------------------------------
  // PRIVATE HELPERS
  // ----------------------------------------------------
  private parseStatus(
    value: string
  ): ExecutedOperationStatusEnum {

    if (
      !Object.values(ExecutedOperationStatusEnum).includes(
        value as ExecutedOperationStatusEnum
      )
    ) {
      throw new Error(`Invalid ExecutedOperationStatus: ${value}`);
    }

    return value as ExecutedOperationStatusEnum;
  }

  private toDTO(
    operation: ExecutedOperation
  ): ExecutedOperationDTO {
    return {
      id: operation.id.toString(),
      vesselVisitExecutionId: operation.vesselVisitExecutionId.toString(),
      plannedOperationId: operation.plannedOperationId.toString(),
      resourceId: operation.resourceId.toString(),
      staffId: operation.staffId.toString(),
      actualStart: operation.actualStart.value.toISOString(),
      actualEnd: operation.actualEnd
        ? operation.actualEnd.value.toISOString()
        : undefined,
      status: operation.status.value
    };
  }
}
