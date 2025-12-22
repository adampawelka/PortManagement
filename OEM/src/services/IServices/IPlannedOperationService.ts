import {
  PlannedOperationDTO,
  CreatePlannedOperationDTO,
  UpdatePlannedOperationDTO
} from "../../dto/PlannedOperationDTO";

export interface IPlannedOperationService {
  create(dto: CreatePlannedOperationDTO): Promise<PlannedOperationDTO>;
  getById(id: string): Promise<PlannedOperationDTO | null>;
  getByOperationPlanId(operationPlanId: string): Promise<PlannedOperationDTO[]>;
  getAll(): Promise<PlannedOperationDTO[]>;
  update(
    id: string,
    dto: UpdatePlannedOperationDTO
  ): Promise<PlannedOperationDTO | null>;
}
