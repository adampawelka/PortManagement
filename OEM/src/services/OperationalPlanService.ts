import { IOperationPlanService } from "./IServices/IOperationPlanService";
import { IOperationPlanRepo } from "./IRepos/IOperationPlanRepo";

import {
  OperationPlanDTO,
  CreateOperationPlanDTO,
  UpdateOperationPlanDTO
} from "../dto/OperationPlanDTO";

import { OperationPlan } from "../Domain/OperationPlans/OperationPlan";
import { OperationPlanId } from "../Domain/OperationPlans/OperationPlanId";
import { VesselVisitExecutionId } from "../Domain/VesselVisitExecutions/VesselVisitExecutionId";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { CreatedAt } from "../Domain/OperationPlans/CreatedAt";
import { CreatedBy } from "../Domain/OperationPlans/CreatedBy";
import { AlgorithmUsed } from "../Domain/OperationPlans/AlgorithmUsed";

export class OperationPlanService
  implements IOperationPlanService {

  constructor(
    private readonly operationPlanRepo: IOperationPlanRepo
  ) {}

  async create(
    dto: CreateOperationPlanDTO
  ): Promise<OperationPlanDTO> {

    const planOrError = OperationPlan.create({
      vesselVisitExecutionId: VesselVisitExecutionId.create(
        new UniqueEntityID(dto.vesselVisitExecutionId)
      ),
      createdAt: CreatedAt.create(
        new Date(dto.createdAt)
      ).getValue(),
      createdBy: CreatedBy.create(dto.createdBy).getValue(),
      algorithmUsed: AlgorithmUsed.create(dto.algorithmUsed).getValue()
    });

    if (planOrError.isFailure) {
      throw new Error(planOrError.errorValue().toString());
    }

    const plan = planOrError.getValue();
    await this.operationPlanRepo.save(plan);

    return this.toDTO(plan);
  }

  async getById(
    id: string
  ): Promise<OperationPlanDTO | null> {

    const planId = OperationPlanId.create(
      new UniqueEntityID(id)
    );

    const plan = await this.operationPlanRepo.findById(planId);
    if (!plan) return null;

    return this.toDTO(plan);
  }

 
  async getByvesselVisitExecutionId(
    vesselVisitExecutionId: string
  ): Promise<OperationPlanDTO | null> {

    const vve = VesselVisitExecutionId.create(
      new UniqueEntityID(vesselVisitExecutionId)
    );

    const plan = await this.operationPlanRepo.findByvesselVisitExecutionId(vve);
    if (!plan) return null;

    return this.toDTO(plan);
  }

  async getAll(): Promise<OperationPlanDTO[]> {
    const plans = await this.operationPlanRepo.findAll();
    return plans.map(p => this.toDTO(p));
  }

  async update(
    id: string,
    dto: UpdateOperationPlanDTO
  ): Promise<OperationPlanDTO | null> {

    const planId = OperationPlanId.create(
      new UniqueEntityID(id)
    );

    const plan = await this.operationPlanRepo.findById(planId);
    if (!plan) return null;

    if (dto.createdAt) {
      plan.props.createdAt =
        CreatedAt.create(new Date(dto.createdAt)).getValue();
    }

    if (dto.createdBy) {
      plan.props.createdBy =
        CreatedBy.create(dto.createdBy).getValue();
    }

    if (dto.algorithmUsed) {
      plan.props.algorithmUsed =
        AlgorithmUsed.create(dto.algorithmUsed).getValue();
    }

    await this.operationPlanRepo.save(plan);
    return this.toDTO(plan);
  }

  private toDTO(
    plan: OperationPlan
  ): OperationPlanDTO {
    return {
      id: plan.id.toString(),
      vesselVisitExecutionId: plan.vesselVisitExecutionId.toString(),
      createdAt: plan.createdAt.value.toISOString(),
      createdBy: plan.createdBy.value,
      algorithmUsed: plan.algorithmUsed.value
    };
  }
}
