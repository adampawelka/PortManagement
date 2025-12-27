import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { PlannedOperationId } from "./PlannedOperationId";
import { PlannedResourceId } from "./PlannedResourceId";
import { PlannedStaffId } from "./PlannedStaffId";
import { PlannedStart } from "./PlannedStart";
import { PlannedEnd } from "./PlannedEnd";
import { OperationType } from "./OperationType";
import { PlannedOperationStatus } from "./PlannedOperationStatus";
import { OperationPlanId } from "../OperationPlans/OperationPlanId";

interface PlannedOperationProps {
  operationPlanId: OperationPlanId;
  resourceId: PlannedResourceId;
  staffId: PlannedStaffId;
  plannedStart: PlannedStart;
  plannedEnd: PlannedEnd;
  operationType: OperationType;
  status: PlannedOperationStatus;
}

export class PlannedOperation extends AggregateRoot<PlannedOperationProps> {

  get plannedOperationId(): PlannedOperationId {
    return PlannedOperationId.create(this.id);
  }

  get operationPlanId(): OperationPlanId {
    return this.props.operationPlanId;
  }

  get resourceId(): PlannedResourceId {
    return this.props.resourceId;
  }

  get staffId(): PlannedStaffId {
    return this.props.staffId;
  }

  get plannedStart(): PlannedStart {
    return this.props.plannedStart;
  }

  get plannedEnd(): PlannedEnd {
    return this.props.plannedEnd;
  }

  get operationType(): OperationType {
    return this.props.operationType;
  }

  get status(): PlannedOperationStatus {
    return this.props.status;
  }

  private constructor(props: PlannedOperationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: PlannedOperationProps,
    id?: UniqueEntityID
  ): Result<PlannedOperation> {

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.operationPlanId, argumentName: "operationPlanId" },
      { argument: props.resourceId, argumentName: "resourceId" },
      { argument: props.staffId, argumentName: "staffId" },
      { argument: props.plannedStart, argumentName: "plannedStart" },
      { argument: props.plannedEnd, argumentName: "plannedEnd" },
      { argument: props.operationType, argumentName: "operationType" },
      { argument: props.status, argumentName: "status" }
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<PlannedOperation>(guardResult.message);
    }

    return Result.ok(new PlannedOperation(props, id));
  }
}

