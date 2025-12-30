import { IOperationPlanService } from "./IServices/IOperationPlanService";
import { IOperationPlanRepo } from "./IRepos/IOperationPlanRepo";
import {
  OperationPlanDTO,
  CreateOperationPlanDTO,
  UpdateOperationPlanDTO,
  ScheduledOperationDTO,
  SearchOperationPlanDTO
} from "../dto/OperationPlanDTO";

import { OperationPlan } from "../Domain/OperationPlans/OperationPlan";
import { OperationPlanId } from "../Domain/OperationPlans/OperationPlanId";
import { VvnId } from "../Domain/VesselVisitExecutions/VvnId";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { CreatedAt } from "../Domain/OperationPlans/CreatedAt";
import { CreatedBy } from "../Domain/OperationPlans/CreatedBy";
import { AlgorithmUsed } from "../Domain/OperationPlans/AlgorithmUsed";
import { ScheduledOperation } from "../Domain/OperationPlans/ScheduledOperation";

export class OperationPlanService implements IOperationPlanService {
  constructor(private readonly operationPlanRepo: IOperationPlanRepo) {}

  private mapScheduleDTOtoVO(scheduleDTO: ScheduledOperationDTO[]): ScheduledOperation[] {
    return scheduleDTO.map(dto => {
      const opOrError = ScheduledOperation.create({
        vesselName: dto.vesselName,
        start: new Date(dto.start),
        end: new Date(dto.end),
        delay: dto.delay,
        dock: dto.dock,
        cranes: dto.cranes || [],
        staff: dto.staff || []
      });
      if (opOrError.isFailure) throw new Error(`Invalid ScheduledOperation: ${opOrError.errorValue()}`);
      return opOrError.getValue();
    });
  }

  async create(dto: CreateOperationPlanDTO): Promise<OperationPlanDTO> {
    const planOrError = OperationPlan.create({
      vvnId: VvnId.create(dto.vvnId).getValue(),
      createdAt: CreatedAt.create(dto.createdAt).getValue(),
      createdBy: CreatedBy.create(dto.createdBy).getValue(),
      algorithmUsed: AlgorithmUsed.create(dto.algorithmUsed).getValue(),
      schedule: this.mapScheduleDTOtoVO(dto.schedule)
    }, new UniqueEntityID());

    if (planOrError.isFailure) throw new Error(planOrError.errorValue().toString());

    const plan = planOrError.getValue();
    await this.operationPlanRepo.save(plan);
    return this.toDTO(plan);
  }

  async getById(id: string): Promise<OperationPlanDTO | null> {
    const plan = await this.operationPlanRepo.findById(OperationPlanId.create(new UniqueEntityID(id)));
    return plan ? this.toDTO(plan) : null;
  }

  async getByVvnId(vvnId: string): Promise<OperationPlanDTO | null> {
    const plan = await this.operationPlanRepo.findByVvnId(VvnId.create(vvnId).getValue());
    return plan ? this.toDTO(plan) : null;
  }

  async getAll(): Promise<OperationPlanDTO[]> {
    const plans = await this.operationPlanRepo.findAll();
    return plans.map(this.toDTO);
  }

  async update(id: string, dto: UpdateOperationPlanDTO): Promise<OperationPlanDTO | null> {
    const plan = await this.operationPlanRepo.findById(OperationPlanId.create(new UniqueEntityID(id)));
    if (!plan) return null;

    if (dto.createdAt) plan.props.createdAt = CreatedAt.create(dto.createdAt).getValue();
    if (dto.createdBy) plan.props.createdBy = CreatedBy.create(dto.createdBy).getValue();
    if (dto.algorithmUsed) plan.props.algorithmUsed = AlgorithmUsed.create(dto.algorithmUsed).getValue();
    if (dto.schedule) plan.props.schedule = this.mapScheduleDTOtoVO(dto.schedule);

    await this.operationPlanRepo.save(plan);
    return this.toDTO(plan);
  }

  async search(dto: SearchOperationPlanDTO): Promise<OperationPlanDTO[]> {
    const criteria: any = { ...dto }; // daty są już typu Date w DTO
    const plans = await this.operationPlanRepo.search(criteria);
    let results = plans.map(this.toDTO);

    if (dto.sortBy) {
      const sortOrder = dto.sortOrder === 'desc' ? -1 : 1;
      results.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (dto.sortBy) {
          case 'startTime':
            aValue = a.schedule[0]?.start.getTime() ?? 0;
            bValue = b.schedule[0]?.start.getTime() ?? 0;
            break;
          case 'vesselName':
            aValue = a.schedule[0]?.vesselName.toLowerCase() ?? '';
            bValue = b.schedule[0]?.vesselName.toLowerCase() ?? '';
            break;
          case 'delay':
            aValue = Math.max(...a.schedule.map(s => s.delay), 0);
            bValue = Math.max(...b.schedule.map(s => s.delay), 0);
            break;
          case 'createdAt':
            aValue = a.createdAt.getTime();
            bValue = b.createdAt.getTime();
            break;
          default:
            return 0;
        }

        return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * sortOrder;
      });
    }

    return results;
  }

  private toDTO(plan: OperationPlan): OperationPlanDTO {
    return {
      id: plan.id.toString(),
      vvnId: plan.vvnId.value,
      createdAt: plan.createdAt.value,
      createdBy: plan.createdBy.value,
      algorithmUsed: plan.algorithmUsed.value,
      schedule: plan.schedule.map(op => ({
        vesselName: op.vesselName,
        start: op.start,
        end: op.end,
        delay: op.delay,
        dock: op.dock,
        cranes: op.cranes,
        staff: op.staff
      }))
    };
  }
}
