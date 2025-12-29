import { CreateOperationPlanDTO, OperationPlanDTO, SearchOperationPlanDTO } from "../../dto/OperationPlanDTO";

export interface IOperationPlanService {
  create(
    dto: CreateOperationPlanDTO
  ): Promise<OperationPlanDTO>;

  getById(
    id: string
  ): Promise<OperationPlanDTO | null>;

  getByVvnId(
    vvnId: string
  ): Promise<OperationPlanDTO | null>;

  getAll(): Promise<OperationPlanDTO[]>;

  update(
    id: string,
    dto: Partial<CreateOperationPlanDTO>
  ): Promise<OperationPlanDTO | null>;

  search(
    dto: SearchOperationPlanDTO
  ): Promise<OperationPlanDTO[]>;
}
