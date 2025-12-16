import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

import { VesselVisitExecutionId } from "./VesselVisitExecutionId";
import { VvnId } from "./VvnId";
import { ActualArrivalTime } from "./ActualArrivalTime";
import { ActualBerthTime } from "./ActualBerthTime";
import { DockId } from "./DockId";
import { VesselVisitExecutionStatus } from "./VesselVisitExecutionStatus";
import { CreatedBy } from "./CreatedBy";

interface VesselVisitExecutionProps {
  vvnId: VvnId;
  actualArrivalTime: ActualArrivalTime;
  actualBerthTime?: ActualBerthTime;
  dockId?: DockId;
  status: VesselVisitExecutionStatus;
  createdBy: CreatedBy;
}

export class VesselVisitExecution extends AggregateRoot<VesselVisitExecutionProps> {

  get id(): UniqueEntityID {
    return this._id;
  }

  get vesselVisitExecutionId(): VesselVisitExecutionId {
    return VesselVisitExecutionId.caller(this.id);
  }

  get vvnId(): VvnId {
    return this.props.vvnId;
  }

  get actualArrivalTime(): ActualArrivalTime {
    return this.props.actualArrivalTime;
  }

  get actualBerthTime(): ActualBerthTime | undefined {
    return this.props.actualBerthTime;
  }

  get dockId(): DockId | undefined {
    return this.props.dockId;
  }

  get status(): VesselVisitExecutionStatus {
    return this.props.status;
  }

  get createdBy(): CreatedBy {
    return this.props.createdBy;
  }

  private constructor(props: VesselVisitExecutionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: VesselVisitExecutionProps,
    id?: UniqueEntityID
  ): Result<VesselVisitExecution> {

    const guardedProps = [
      { argument: props.vvnId, argumentName: "vvnId" },
      { argument: props.actualArrivalTime, argumentName: "actualArrivalTime" },
      { argument: props.status, argumentName: "status" },
      { argument: props.createdBy, argumentName: "createdBy" }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<VesselVisitExecution>(guardResult.message);
    }

    const vve = new VesselVisitExecution({ ...props }, id);
    return Result.ok<VesselVisitExecution>(vve);
  }
}
