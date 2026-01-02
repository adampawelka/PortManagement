import {
  OperationPlanDTO,
  CreateOperationPlanDTO,
  UpdateOperationPlanDTO,
  MissingPlanVvnDTO
} from "../../dto/OperationPlanDTO";

export interface IOperationPlanService {
  create(
    dto: CreateOperationPlanDTO
  ): Promise<OperationPlanDTO>;

  getById(
    id: string
  ): Promise<OperationPlanDTO | null>;

  getByvesselVisitExecutionId(
    vesselVisitExecutionId: string
  ): Promise<OperationPlanDTO | null>;

  getAll(): Promise<OperationPlanDTO[]>;

  update(
    id: string,
    dto: UpdateOperationPlanDTO
  ): Promise<OperationPlanDTO | null>;

  getMissingPlans(): Promise<MissingPlanVvnDTO[]>;
}