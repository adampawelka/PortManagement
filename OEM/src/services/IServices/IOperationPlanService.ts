import {
  OperatorPlanDTO,
  CreateOperatorPlanDTO,
  UpdateOperatorPlanDTO
} from "../../dto/OperationPlanDTO";

export interface IOperationPlanService {
  create(
    dto: CreateOperatorPlanDTO
  ): Promise<OperatorPlanDTO>;

  getById(
    id: string
  ): Promise<OperatorPlanDTO | null>;

  getByvesselVisitExecutionId(
    vesselVisitExecutionId: string
  ): Promise<OperatorPlanDTO | null>;

  getAll(): Promise<OperatorPlanDTO[]>;

  update(
    id: string,
    dto: UpdateOperatorPlanDTO
  ): Promise<OperatorPlanDTO | null>;
}
