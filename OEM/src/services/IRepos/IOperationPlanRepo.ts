import { OperationPlan } from "../../Domain/OperationPlans/OperationPlan";
import { OperationPlanId } from "../../Domain/OperationPlans/OperationPlanId";
import { VvnId } from "../../Domain/VesselVisitExecutions/VvnId";

export interface IOperationPlanRepo {
  save(OperationPlan: OperationPlan): Promise<void>;

  findById(id: OperationPlanId): Promise<OperationPlan | null>;

  findByVvnId(
    vvnId: VvnId
  ): Promise<OperationPlan | null>;

  findAll(): Promise<OperationPlan[]>;

  findAllByVvnId(
    vvnId: VvnId
  ): Promise<OperationPlan[]>;

  search(
    criteria: {
      dateStart?: Date;
      dateEnd?: Date;
      operationDateStart?: Date;
      operationDateEnd?: Date;
      vesselName?: string;
      vvnId?: string;
    }
  ): Promise<OperationPlan[]>;

  exists(OperationPlan: OperationPlan): Promise<boolean>;

  //4.1.6
  findByOperationDateRange(from: Date, to: Date): Promise<OperationPlan[]>;

}
