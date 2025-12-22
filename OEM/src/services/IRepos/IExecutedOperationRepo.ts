import { ExecutedOperation } from "../../Domain/ExecutedOperations/ExecutedOperation";
import { ExecutedOperationId } from "../../Domain/ExecutedOperations/ExecutedOperationId";
import { VesselVisitExecutionId } from "../../Domain/VesselVisitExecutions/VesselVisitExecutionId";

export interface IExecutedOperationRepo {
  save(operation: ExecutedOperation): Promise<void>;
  findById(id: ExecutedOperationId): Promise<ExecutedOperation | null>;
  findByVesselVisitExecutionId(
    vesselVisitExecutionId: VesselVisitExecutionId
  ): Promise<ExecutedOperation[]>;
  findAll(): Promise<ExecutedOperation[]>;
  exists(id: ExecutedOperationId): Promise<boolean>;
}
