import { IPlannedOperationService } from "./IServices/IPlannedOperationService";
import { IPlannedOperationRepo } from "./IRepos/IPlannedOperationRepo";

import {
  PlannedOperationDTO,
  CreatePlannedOperationDTO,
  UpdatePlannedOperationDTO
} from "../dto/PlannedOperationDTO";

import { PlannedOperation } from "../Domain/PlannedOperations/PlannedOperation";
import { PlannedOperationId } from "../Domain/PlannedOperations/PlannedOperationId";
import { OperationPlanId } from "../Domain/OperationPlans/OperationPlanId";
import { PlannedResourceId } from "../Domain/PlannedOperations/PlannedResourceId";
import { PlannedStaffId } from "../Domain/PlannedOperations/PlannedStaffId";

import { PlannedStart } from "../Domain/PlannedOperations/PlannedStart";
import { PlannedEnd } from "../Domain/PlannedOperations/PlannedEnd";
import {
  OperationType,
  OperationTypeEnum
} from "../Domain/PlannedOperations/OperationType";
import {
  PlannedOperationStatus,
  PlannedOperationStatusEnum
} from "../Domain/PlannedOperations/PlannedOperationStatus";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class PlannedOperationService
  implements IPlannedOperationService {

  constructor(
    private readonly plannedOperationRepo: IPlannedOperationRepo
  ) {}

  async create(
    dto: CreatePlannedOperationDTO
  ): Promise<PlannedOperationDTO> {

    const operationOrError = PlannedOperation.create({
      operationPlanId: OperationPlanId.create(
        new UniqueEntityID(dto.operationPlanId)
      ),
      resourceId: PlannedResourceId.create(
        new UniqueEntityID(dto.resourceId)
      ),
      staffId: PlannedStaffId.create(
        new UniqueEntityID(dto.staffId)
      ),
      plannedStart: PlannedStart.create(
        new Date(dto.plannedStart)
      ).getValue(),
      plannedEnd: PlannedEnd.create(
        new Date(dto.plannedEnd)
      ).getValue(),
      operationType: OperationType.create(
        dto.operationType as OperationTypeEnum
      ).getValue(),
      status: PlannedOperationStatus.create(
        PlannedOperationStatusEnum.PLANNED
      ).getValue()
    });

    if (operationOrError.isFailure) {
      throw new Error(operationOrError.errorValue().toString());
    }

    const operation = operationOrError.getValue();
    await this.plannedOperationRepo.save(operation);

    return this.toDTO(operation);
  }

  async getById(
    id: string
  ): Promise<PlannedOperationDTO | null> {

    const operationId = PlannedOperationId.create(
      new UniqueEntityID(id)
    );

    const operation = await this.plannedOperationRepo.findById(operationId);
    if (!operation) return null;

    return this.toDTO(operation);
  }

  async getByOperationPlanId(
    operationPlanId: string
  ): Promise<PlannedOperationDTO[]> {

    const planId = OperationPlanId.create(
      new UniqueEntityID(operationPlanId)
    );

    const operations =
      await this.plannedOperationRepo.findByOperationPlanId(planId);

    return operations.map(op => this.toDTO(op));
  }


  async getAll(): Promise<PlannedOperationDTO[]> {
    const operations = await this.plannedOperationRepo.findAll();
    return operations.map(op => this.toDTO(op));
  }


  async update(
    id: string,
    dto: UpdatePlannedOperationDTO
  ): Promise<PlannedOperationDTO | null> {

    const operationId = PlannedOperationId.create(
      new UniqueEntityID(id)
    );

    const operation = await this.plannedOperationRepo.findById(operationId);
    if (!operation) return null;

    if (dto.plannedStart) {
      operation.props.plannedStart =
        PlannedStart.create(new Date(dto.plannedStart)).getValue();
    }

    if (dto.plannedEnd) {
      operation.props.plannedEnd =
        PlannedEnd.create(new Date(dto.plannedEnd)).getValue();
    }

    if (dto.status) {
      operation.props.status =
        PlannedOperationStatus.create(
          dto.status as PlannedOperationStatusEnum
        ).getValue();
    }

    await this.plannedOperationRepo.save(operation);
    return this.toDTO(operation);
  }

  
  private toDTO(
    operation: PlannedOperation
  ): PlannedOperationDTO {
    return {
      id: operation.id.toString(),
      operationPlanId: operation.operationPlanId.toString(),
      resourceId: operation.resourceId.toString(),
      staffId: operation.staffId.toString(),
      plannedStart: operation.plannedStart.value.toISOString(),
      plannedEnd: operation.plannedEnd.value.toISOString(),
      operationType: operation.operationType.value,
      status: operation.status.value
    };
  }
}
