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

  constructor(
    private readonly operationPlanRepo: IOperationPlanRepo
  ) { }

  private mapScheduleDTOtoVO(scheduleDTO: ScheduledOperationDTO[]): ScheduledOperation[] {
    return scheduleDTO.map(dto => ScheduledOperation.create({
      vesselName: dto.vesselName,
      start: new Date(dto.start),
      end: new Date(dto.end),
      delay: dto.delay,
      dock: dto.dock,
      crane: dto.crane,
      staff: dto.staff
    }).getValue());
  }

  async create(
    dto: CreateOperationPlanDTO
  ): Promise<OperationPlanDTO> {

    const vvnId = VvnId.create(dto.vvnId).getValue();

    const createdAt = CreatedAt.create(new Date(dto.createdAt)).getValue();
    const createdBy = CreatedBy.create(dto.createdBy).getValue();
    const algorithmUsed = AlgorithmUsed.create(dto.algorithmUsed).getValue();
    const scheduleVO = this.mapScheduleDTOtoVO(dto.schedule);

    const planOrError = OperationPlan.create(
      {
        vvnId,
        createdAt,
        createdBy,
        algorithmUsed,
        schedule: scheduleVO
      },
      new UniqueEntityID() // nowy ID planu
    );

    if (planOrError.isFailure) {
      throw new Error(planOrError.errorValue().toString());
    }

    const plan = planOrError.getValue();
    await this.operationPlanRepo.save(plan);

    return this.toDTO(plan);
  }

  async getById(id: string): Promise<OperationPlanDTO | null> {
    const planId = OperationPlanId.create(new UniqueEntityID(id));
    const plan = await this.operationPlanRepo.findById(planId);
    if (!plan) return null;
    return this.toDTO(plan);
  }

  async getByVvnId(vvnId: string): Promise<OperationPlanDTO | null> {
    const vvnIdVO = VvnId.create(vvnId).getValue();
    const plan = await this.operationPlanRepo.findByVvnId(vvnIdVO);
    if (!plan) return null;
    return this.toDTO(plan);
  }

  async getAll(): Promise<OperationPlanDTO[]> {
    const plans = await this.operationPlanRepo.findAll();
    return plans.map(p => this.toDTO(p));
  }

  async update(id: string, dto: UpdateOperationPlanDTO): Promise<OperationPlanDTO | null> {
    const planId = OperationPlanId.create(new UniqueEntityID(id));
    const plan = await this.operationPlanRepo.findById(planId);
    if (!plan) return null;

    if (dto.createdAt) plan.props.createdAt = CreatedAt.create(new Date(dto.createdAt)).getValue();
    if (dto.createdBy) plan.props.createdBy = CreatedBy.create(dto.createdBy).getValue();
    if (dto.algorithmUsed) plan.props.algorithmUsed = AlgorithmUsed.create(dto.algorithmUsed).getValue();
    if (dto.schedule) plan.props.schedule = this.mapScheduleDTOtoVO(dto.schedule);

    await this.operationPlanRepo.save(plan);
    return this.toDTO(plan);
  }

  async search(dto: SearchOperationPlanDTO): Promise<OperationPlanDTO[]> {
    // Build search criteria
    const criteria: {
      dateStart?: Date;
      dateEnd?: Date;
      operationDateStart?: Date;
      operationDateEnd?: Date;
      vesselName?: string;
      vvnId?: string;
    } = {};

    if (dto.dateStart) {
      criteria.dateStart = new Date(dto.dateStart);
    }
    if (dto.dateEnd) {
      criteria.dateEnd = new Date(dto.dateEnd);
    }
    if (dto.operationDateStart) {
      criteria.operationDateStart = new Date(dto.operationDateStart);
    }
    if (dto.operationDateEnd) {
      criteria.operationDateEnd = new Date(dto.operationDateEnd);
    }
    if (dto.vesselName) {
      criteria.vesselName = dto.vesselName;
    }
    if (dto.vvnId) {
      criteria.vvnId = dto.vvnId;
    }

    // Execute search
    const plans = await this.operationPlanRepo.search(criteria);

    // Convert to DTOs
    let results = plans.map(plan => this.toDTO(plan));

    // Apply sorting
    if (dto.sortBy) {
      const sortOrder = dto.sortOrder === 'desc' ? -1 : 1;

      results.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (dto.sortBy) {
          case 'startTime':
            // Sort by earliest start time in schedule
            aValue = a.schedule.length > 0 ? new Date(a.schedule[0].start).getTime() : 0;
            bValue = b.schedule.length > 0 ? new Date(b.schedule[0].start).getTime() : 0;
            break;

          case 'vesselName':
            // Sort by first vessel name in schedule
            aValue = a.schedule.length > 0 ? a.schedule[0].vesselName.toLowerCase() : '';
            bValue = b.schedule.length > 0 ? b.schedule[0].vesselName.toLowerCase() : '';
            break;

          case 'delay':
            // Sort by maximum delay in schedule
            aValue = a.schedule.length > 0 ? Math.max(...a.schedule.map(s => s.delay)) : 0;
            bValue = b.schedule.length > 0 ? Math.max(...b.schedule.map(s => s.delay)) : 0;
            break;

          case 'createdAt':
            // Sort by plan creation date
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;

          default:
            return 0;
        }

        if (aValue < bValue) return -1 * sortOrder;
        if (aValue > bValue) return 1 * sortOrder;
        return 0;
      });
    }

    return results;
  }

  private toDTO(plan: OperationPlan): OperationPlanDTO {
    return {
      id: plan.id.toString(),
      vvnId: plan.vvnId.value,
      createdAt: plan.createdAt.value.toISOString(),
      createdBy: plan.createdBy.value,
      algorithmUsed: plan.algorithmUsed.value,
      schedule: plan.schedule.map(op => ({
        vesselName: op.vesselName,
        start: op.start.toISOString(),
        end: op.end.toISOString(),
        delay: op.delay,
        dock: op.dock,
        crane: op.crane,
        staff: op.staff
      }))
    };
  }
}
