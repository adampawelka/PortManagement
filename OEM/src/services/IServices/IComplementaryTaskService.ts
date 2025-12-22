import {
  ComplementaryTaskDTO,
  CreateComplementaryTaskDTO,
  UpdateComplementaryTaskDTO
} from "../../dto/ComplementaryTaskDTO";

export interface IComplementaryTaskService {
  create(dto: CreateComplementaryTaskDTO): Promise<ComplementaryTaskDTO>;
  getById(id: string): Promise<ComplementaryTaskDTO | null>;
  getByVesselVisitExecutionId(vesselVisitExecutionId: string): Promise<ComplementaryTaskDTO[]>;
  getAll(): Promise<ComplementaryTaskDTO[]>;
  update(
    id: string,
    dto: UpdateComplementaryTaskDTO
  ): Promise<ComplementaryTaskDTO | null>;
}
