import { OperationPlan } from "../../Domain/OperationPlans/OperationPlan";
import { OperationPlanId } from "../../Domain/OperationPlans/OperationPlanId";
import { VesselVisitExecutionId } from "../../Domain/VesselVisitExecutions/VesselVisitExecutionId";

export interface IOperationPlanRepo {
  save(OperationPlan: OperationPlan): Promise<void>;

  findById(id: OperationPlanId): Promise<OperationPlan | null>;

  findByVesselVisitExecutionId(
    vesselVisitExecutionId: VesselVisitExecutionId
  ): Promise<OperationPlan | null>;

  findAll(): Promise<OperationPlan[]>;

  findAllByVesselVisitExecutionId(
    vesselVisitExecutionId: VesselVisitExecutionId
  ): Promise<OperationPlan[]>;


  exists(OperationPlan: OperationPlan): Promise<boolean>;
}
