import {
  ExecutedOperationDTO,
  CreateExecutedOperationDTO,
  UpdateExecutedOperationDTO
} from "../../dto/ExecutedOperationDTO";

export interface IExecutedOperationService {
  create(dto: CreateExecutedOperationDTO): Promise<ExecutedOperationDTO>;
  
  createFromPlannedOperation(
    dto: CreateExecutedOperationDTO
  ): Promise<ExecutedOperationDTO>;

  batchCreateFromPlannedOperations(
    vveId: string,
    plannedOperationIds: string[]
  ): Promise<ExecutedOperationDTO[]>;

  getById(id: string): Promise<ExecutedOperationDTO | null>;

  getByVesselVisitExecutionId(
    vesselVisitExecutionId: string
  ): Promise<ExecutedOperationDTO[]>;

  getAvailablePlannedOperationsForVVE(
    vesselVisitExecutionId: string
  ): Promise<any[]>;
  getAll(): Promise<ExecutedOperationDTO[]>;
  update(
    id: string,
    dto: UpdateExecutedOperationDTO
  ): Promise<ExecutedOperationDTO | null>;
}
