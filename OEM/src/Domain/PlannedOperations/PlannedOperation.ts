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
  resourceId: PlannedResourceId;
  staffId: PlannedStaffId;
  plannedStart: PlannedStart;
  plannedEnd: PlannedEnd;
  operationType: OperationType;
  status: PlannedOperationStatus;
  OperationPlanId: OperationPlanId;
}

export class PlannedOperation extends AggregateRoot<PlannedOperationProps> {

  get id(): UniqueEntityID {
    return this._id;
  }

  get plannedOperationId(): PlannedOperationId {
    return PlannedOperationId.caller(this.id);
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

  get OperationPlanId(): OperationPlanId {
    return this.props.OperationPlanId;
  }

  private constructor(props: PlannedOperationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: PlannedOperationProps,
    id?: UniqueEntityID
  ): Result<PlannedOperation> {

    const guardedProps = [
      { argument: props.resourceId, argumentName: "resourceId" },
      { argument: props.staffId, argumentName: "staffId" },
      { argument: props.plannedStart, argumentName: "plannedStart" },
      { argument: props.plannedEnd, argumentName: "plannedEnd" },
      { argument: props.operationType, argumentName: "operationType" },
      { argument: props.status, argumentName: "status" },
      { argument: props.OperationPlanId, argumentName: "operationPlanId" }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<PlannedOperation>(guardResult.message);
    }

    const operation = new PlannedOperation({ ...props }, id);
    return Result.ok<PlannedOperation>(operation);
  }
}
