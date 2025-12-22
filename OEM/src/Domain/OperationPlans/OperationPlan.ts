import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { OperationPlanId } from "./OperationPlanId";
import { VesselVisitExecutionId } from "../VesselVisitExecutions/VesselVisitExecutionId";
import { CreatedAt } from "./CreatedAt";
import { CreatedBy } from "./CreatedBy";
import { AlgorithmUsed } from "./AlgorithmUsed";

interface OperationPlanProps {
  vveId: VesselVisitExecutionId;
  createdAt: CreatedAt;
  createdBy: CreatedBy;
  algorithmUsed: AlgorithmUsed;
}

export class OperationPlan extends AggregateRoot<OperationPlanProps> {

  get operationPlanId(): OperationPlanId {
    return OperationPlanId.caller(this.id);
  }

  private constructor(props: OperationPlanProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: OperationPlanProps,
    id?: UniqueEntityID
  ): Result<OperationPlan> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.vveId, argumentName: "vveId" },
      { argument: props.createdAt, argumentName: "createdAt" },
      { argument: props.createdBy, argumentName: "createdBy" },
      { argument: props.algorithmUsed, argumentName: "algorithmUsed" }
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<OperationPlan>(guardResult.message);
    }

    return Result.ok<OperationPlan>(
      new OperationPlan({ ...props }, id)
    );
  }
}
