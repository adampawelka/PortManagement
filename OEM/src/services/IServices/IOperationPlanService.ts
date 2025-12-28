import { CreateOperationPlanDTO, OperationPlanDTO } from "../../dto/OperationPlanDTO";

export interface IOperationPlanService {
  create(
    dto: CreateOperationPlanDTO
  ): Promise<OperationPlanDTO>;

  getById(
    id: string
  ): Promise<OperationPlanDTO | null>;

  getByVesselVisitExecutionId(
    vesselVisitExecutionId: string
  ): Promise<OperationPlanDTO | null>;

  getAll(): Promise<OperationPlanDTO[]>;

  update(
    id: string,
    dto: Partial<CreateOperationPlanDTO>
  ): Promise<OperationPlanDTO | null>;
}
