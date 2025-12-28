import { ExecutedOperation } from "../../Domain/ExecutedOperations/ExecutedOperation";
import { ExecutedOperationId } from "../../Domain/ExecutedOperations/ExecutedOperationId";

export interface IExecutedOperationRepo {
  save(operation: ExecutedOperation): Promise<void>;
  findById(id: ExecutedOperationId): Promise<ExecutedOperation | null>;
  findByVesselVisitExecutionId(
    vesselVisitExecutionId: string 
  ): Promise<ExecutedOperation[]>;
  findAll(): Promise<ExecutedOperation[]>;
  exists(id: ExecutedOperationId): Promise<boolean>;
}
