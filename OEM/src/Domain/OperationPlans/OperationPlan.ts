import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { OperationPlanId } from "./OperationPlanId";
import { VesselVisitExecutionId } from "../VesselVisitExecutions/VesselVisitExecutionId";
import { CreatedAt } from "./CreatedAt";
import { CreatedBy } from "./CreatedBy";
import { AlgorithmUsed } from "./AlgorithmUsed";
import { ScheduledOperation } from "./ScheduleOperation";

interface OperationPlanProps {
  vesselVisitExecutionId: VesselVisitExecutionId;
  createdAt: CreatedAt;
  createdBy: CreatedBy;
  algorithmUsed: AlgorithmUsed;
  schedule: ScheduledOperation[];
}

export class OperationPlan extends AggregateRoot<OperationPlanProps> {

  get operationPlanId(): OperationPlanId {
    return OperationPlanId.caller(this.id);
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

  get schedule(): ScheduledOperation[] {
    return this.props.schedule;
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
      { argument: props.algorithmUsed, argumentName: "algorithmUsed" },
      { argument: props.schedule, argumentName: "schedule" },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<OperationPlan>(guardResult.message);
    }

    if (!Array.isArray(props.schedule) || props.schedule.length === 0) {
      return Result.fail<OperationPlan>("Schedule must be a non-empty array of ScheduledOperation");
    }

    return Result.ok(new OperationPlan(props, id));
  }

}

