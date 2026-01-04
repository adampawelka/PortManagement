import { PlannedOperation } from "../../Domain/PlannedOperations/PlannedOperation";
import { PlannedOperationId } from "../../Domain/PlannedOperations/PlannedOperationId";
import { OperationPlanId } from "../../Domain/OperationPlans/OperationPlanId";

export interface IPlannedOperationRepo {
  save(operation: PlannedOperation): Promise<void>;
  findById(id: PlannedOperationId): Promise<PlannedOperation | null>;
  findByOperationPlanId(
    operationPlanId: OperationPlanId
  ): Promise<PlannedOperation[]>;
  findAll(): Promise<PlannedOperation[]>;
  exists(id: PlannedOperationId): Promise<boolean>;
}
