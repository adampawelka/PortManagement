import { IPlannedOperationService } from "./IServices/IPlannedOperationService";
import { IPlannedOperationRepo } from "./IRepos/IPlannedOperationRepo";

import {
  PlannedOperationDTO,
  CreatePlannedOperationDTO,
  UpdatePlannedOperationDTO
} from "../dto/PlannedOperationDTO";

import { PlannedOperation } from "../Domain/PlannedOperations/PlannedOperation";
import { PlannedOperationId } from "../Domain/PlannedOperations/PlannedOperationId";
import { OperationPlan } from "../Domain/OperationPlans/OperationPlan";
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

import { VesselVisitExecutionId } from "../Domain/VesselVisitExecutions/VesselVisitExecutionId";
import { IVesselVisitExecutionRepo } from "./IRepos/IVesselVisitExecutionRepo";
import { IOperationPlanRepo } from "./IRepos/IOperationPlanRepo";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class PlannedOperationService
  implements IPlannedOperationService {

  constructor(
    private readonly plannedOperationRepo: IPlannedOperationRepo,
    private readonly operationPlanRepo: IOperationPlanRepo,
    private readonly vveRepo: IVesselVisitExecutionRepo
  ) { }

  async create(
    dto: CreatePlannedOperationDTO
  ): Promise<PlannedOperationDTO> {

    const operationOrError = PlannedOperation.create({
      operationPlanId: OperationPlanId.create(new UniqueEntityID(dto.operationPlanId)),
      resourceId: PlannedResourceId.create(dto.resourceId).getValue(), // <-- add .getValue()
      staffId: PlannedStaffId.create(dto.staffId).getValue(),          // <-- add .getValue()
      plannedStart: PlannedStart.create(new Date(dto.plannedStart)).getValue(),
      plannedEnd: PlannedEnd.create(new Date(dto.plannedEnd)).getValue(),
      operationType: OperationType.create(dto.operationType as OperationTypeEnum).getValue(),
      status: PlannedOperationStatus.create(PlannedOperationStatusEnum.PLANNED).getValue()
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

  async getPlannedOperationsForVVE(
    vesselVisitExecutionId: string
  ): Promise<PlannedOperationDTO[]> {

    const vveId = VesselVisitExecutionId.create(new UniqueEntityID(vesselVisitExecutionId));
    const vve = await this.vveRepo.findById(vveId);
    
    if (!vve) {
      throw new Error(`Vessel Visit Execution ${vesselVisitExecutionId} not found`);
    }

    const operationPlans = await this.operationPlanRepo.findAllByVesselVisitExecutionId(vveId);
    
    if (operationPlans.length === 0) {
      return []; 
    }

    const allPlannedOps: PlannedOperation[] = [];
    
    for (const plan of operationPlans) {
      const planId = OperationPlanId.create(new UniqueEntityID(plan.id.toString()));
      const plannedOps = await this.plannedOperationRepo.findByOperationPlanId(planId);
      allPlannedOps.push(...plannedOps);
    }

    return allPlannedOps.map(op => this.toDTO(op));
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

  async getPlannedOperationsByVVN(
    vvnId: string
  ): Promise<PlannedOperationDTO[]> {
    
    const vves = await this.vveRepo.findByVVN(vvnId);
    
    if (vves.length === 0) {
      return [];
    }

    const vveIds = vves.map(vve => vve.id.toString());
    const allOperationPlans: OperationPlan[] = [];
    
    for (const vveId of vveIds) {
      const vveEntityId = VesselVisitExecutionId.create(new UniqueEntityID(vveId));
      const operationPlans = await this.operationPlanRepo.findAllByVesselVisitExecutionId(vveEntityId);
      allOperationPlans.push(...operationPlans);
    }

    if (allOperationPlans.length === 0) {
      return [];
    }

    const allPlannedOps: PlannedOperation[] = [];
    
    for (const plan of allOperationPlans) {
      const planId = OperationPlanId.create(new UniqueEntityID(plan.id.toString()));
      const plannedOps = await this.plannedOperationRepo.findByOperationPlanId(planId);
      allPlannedOps.push(...plannedOps);
    }

    return allPlannedOps.map(op => this.toDTO(op));
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
