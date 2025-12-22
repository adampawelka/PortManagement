import { OperationPlan } from "../../Domain/OperationPlans/OperationPlan";
import { OperationPlanId } from "../../Domain/OperationPlans/OperationPlanId";
import { VesselVisitExecutionId } from "../../Domain/VesselVisitExecutions/VesselVisitExecutionId";

export interface IOperationPlanRepo {
  save(OperationPlan: OperationPlan): Promise<void>;

  findById(id: OperationPlanId): Promise<OperationPlan | null>;

  findByVveId(
    vveId: VesselVisitExecutionId
  ): Promise<OperationPlan | null>;

  exists(OperationPlan: OperationPlan): Promise<boolean>;
}
