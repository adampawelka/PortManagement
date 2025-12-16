import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

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

  get id(): UniqueEntityID {
    return this._id;
  }

  get operationPlanId(): OperationPlanId {
    return OperationPlanId.caller(this.id);
  }

  get vveId(): VesselVisitExecutionId {
    return this.props.vveId;
  }

  get createdAt(): CreatedAt {
    return this.props.createdAt;
  }

  get createdBy(): CreatedBy {
    return this.props.createdBy;
  }

  get algorithmUsed(): AlgorithmUsed {
    return this.props.algorithmUsed;
  }

  private constructor(props: OperationPlanProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: OperationPlanProps,
    id?: UniqueEntityID
  ): Result<OperationPlan> {

    const guardedProps = [
      { argument: props.vveId, argumentName: "vveId" },
      { argument: props.createdAt, argumentName: "createdAt" },
      { argument: props.createdBy, argumentName: "createdBy" },
      { argument: props.algorithmUsed, argumentName: "algorithmUsed" }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<OperationPlan>(guardResult.message);
    }

    const plan = new OperationPlan({ ...props }, id);
    return Result.ok<OperationPlan>(plan);
  }
}
