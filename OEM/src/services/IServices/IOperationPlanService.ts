import { CreateOperationPlanDTO, OperationPlanDTO, SearchOperationPlanDTO, MissingPlanDTO } from "../../dto/OperationPlanDTO";
import { ResourceAllocationDTO } from "../../dto/OperationPlanDTO";

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

  getMissingPlans(date: string): Promise<MissingPlanDTO[]>;

  getResourceAllocation(
    resourceType: 'CRANE' | 'STAFF' | 'DOCK',
    resourceId: string,
    from: Date,
    to: Date
  ): Promise<ResourceAllocationDTO>; //4.1.6

}

