import {
  OperationPlanDTO,
  CreateOperationPlanDTO,
  UpdateOperationPlanDTO
} from "../../dto/OperationPlanDTO";

import { ScheduledOperation } from "../../Domain/OperationPlans/ScheduleOperation";

export interface IOperationPlanService {

  create(
    dto: CreateOperationPlanDTO,
    schedule: ScheduledOperation[]
  ): Promise<OperationPlanDTO>;

  getById(id: string): Promise<OperationPlanDTO | null>;

  getByvesselVisitExecutionId(
    vesselVisitExecutionId: string
  ): Promise<OperationPlanDTO | null>;

  getAll(): Promise<OperationPlanDTO[]>;

  update(
    id: string,
    dto: UpdateOperationPlanDTO
  ): Promise<OperationPlanDTO | null>;
}
