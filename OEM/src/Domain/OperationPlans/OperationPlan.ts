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
  vesselVisitExecutionId: VesselVisitExecutionId;
  createdAt: CreatedAt;
  createdBy: CreatedBy;
  algorithmUsed: AlgorithmUsed;
}

export class OperationPlan extends AggregateRoot<OperationPlanProps> {

  get operationPlanId(): OperationPlanId {
    return OperationPlanId.create(this.id);
  }

  get vesselVisitExecutionId(): VesselVisitExecutionId {
    return this.props.vesselVisitExecutionId;
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

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.vesselVisitExecutionId, argumentName: "vesselVisitExecutionId" },
      { argument: props.createdAt, argumentName: "createdAt" },
      { argument: props.createdBy, argumentName: "createdBy" },
      { argument: props.algorithmUsed, argumentName: "algorithmUsed" }
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<OperationPlan>(guardResult.message);
    }

    return Result.ok(new OperationPlan(props, id));
  }
}

