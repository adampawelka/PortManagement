import {
  ExecutedOperationDTO,
  CreateExecutedOperationDTO,
  UpdateExecutedOperationDTO
} from "../../dto/ExecutedOperationDTO";

export interface IExecutedOperationService {
  create(dto: CreateExecutedOperationDTO): Promise<ExecutedOperationDTO>;
  getById(id: string): Promise<ExecutedOperationDTO | null>;
  getByVesselVisitExecutionId(
    vesselVisitExecutionId: string
  ): Promise<ExecutedOperationDTO[]>;
  getAll(): Promise<ExecutedOperationDTO[]>;
  update(
    id: string,
    dto: UpdateExecutedOperationDTO
  ): Promise<ExecutedOperationDTO | null>;
}
