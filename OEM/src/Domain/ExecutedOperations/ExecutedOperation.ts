import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { ExecutedOperationId } from "./ExecutedOperationId";
import { VesselVisitExecutionId } from "../VesselVisitExecutions/VesselVisitExecutionId";
import { PlannedOperationId } from "../PlannedOperations/PlannedOperationId";
import { OperationPlanId } from "../OperationPlans/OperationPlanId";
import { ResourceId } from "./ResourceId";
import { StaffId } from "./StaffId";
import { ActualStart } from "./ActualStart";
import { ActualEnd } from "./ActualEnd";
import { ExecutedOperationStatus } from "./ExecutedOperationStatus";


interface ExecutedOperationProps {
  vesselVisitExecutionId: string; // string, because it's an existing entity
  plannedOperationId: string;     // string, because it's an existing entity
  operationPlanId?: OperationPlanId;
  resourceId: ResourceId;
  staffId: StaffId;
  actualStart: ActualStart;
  actualEnd?: ActualEnd;
  status: ExecutedOperationStatus;
  syncStatus?: string;
}

export class ExecutedOperation extends AggregateRoot<ExecutedOperationProps> {

  get id(): UniqueEntityID {
    return this._id;
  }

  get executedOperationId(): ExecutedOperationId {
    return ExecutedOperationId.create(this.id);
  }

  get vesselVisitExecutionId(): string {  
    return this.props.vesselVisitExecutionId;
  }

  get plannedOperationId(): string {  
    return this.props.plannedOperationId;
  }

  get resourceId(): ResourceId {
    return this.props.resourceId;
  }

  get staffId(): StaffId {
    return this.props.staffId;
  }

  get actualStart(): ActualStart {
    return this.props.actualStart;
  }

  get actualEnd(): ActualEnd | undefined {
    return this.props.actualEnd;
  }

  get status(): ExecutedOperationStatus {
    return this.props.status;
  }

  get operationPlanId(): OperationPlanId | undefined {
    return this.props.operationPlanId;
  }

  get syncStatus(): string | undefined {
    return this.props.syncStatus;
  }

  private constructor(props: ExecutedOperationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: ExecutedOperationProps,
    id?: UniqueEntityID
  ): Result<ExecutedOperation> {

    const guardedProps = [
      { argument: props.vesselVisitExecutionId, argumentName: "vesselVisitExecutionId" },
      { argument: props.plannedOperationId, argumentName: "plannedOperationId" },
      { argument: props.resourceId, argumentName: "resourceId" },
      { argument: props.staffId, argumentName: "staffId" },
      { argument: props.actualStart, argumentName: "actualStart" },
      { argument: props.status, argumentName: "status" }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<ExecutedOperation>(guardResult.message);
    }

    const executedOperation = new ExecutedOperation({ ...props }, id);
    return Result.ok<ExecutedOperation>(executedOperation);
  }

  public updateActualStart(actualStart: ActualStart): void {
    this.props.actualStart = actualStart;
  }

  public updateActualEnd(actualEnd: ActualEnd): void {
    this.props.actualEnd = actualEnd;
  }

  public updateStatus(status: ExecutedOperationStatus): void {
    this.props.status = status;
  }

  public markAsSynced(): void {
    this.props.syncStatus = "synced";
  }

  public markAsPendingSync(): void {
    this.props.syncStatus = "pending";
  }
}

