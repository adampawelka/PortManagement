import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { OperatorPlanId } from "./OperatorPlanId";
import { VesselVisitExecutionId } from "../VesselVisitExecutions/VesselVisitExecutionId";
import { CreatedAt } from "./CreatedAt";
import { CreatedBy } from "./CreatedBy";
import { AlgorithmUsed } from "./AlgorithmUsed";

interface OperatorPlanProps {
  vveId: VesselVisitExecutionId;
  createdAt: CreatedAt;
  createdBy: CreatedBy;
  algorithmUsed: AlgorithmUsed;
}

export class OperatorPlan extends AggregateRoot<OperatorPlanProps> {

  get operatorPlanId(): OperatorPlanId {
    return OperatorPlanId.caller(this.id);
  }

  private constructor(props: OperatorPlanProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: OperatorPlanProps,
    id?: UniqueEntityID
  ): Result<OperatorPlan> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.vveId, argumentName: "vveId" },
      { argument: props.createdAt, argumentName: "createdAt" },
      { argument: props.createdBy, argumentName: "createdBy" },
      { argument: props.algorithmUsed, argumentName: "algorithmUsed" }
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<OperatorPlan>(guardResult.message);
    }

    return Result.ok<OperatorPlan>(
      new OperatorPlan({ ...props }, id)
    );
  }
}
