import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { ComplementaryTaskId } from "./ComplementaryTaskId";
import { VesselVisitExecutionId } from "../VesselVisitExecutions/VesselVisitExecutionId";
import { ResponsibleTeam } from "./ResponsibleTeam";
import { StartTime } from "./StartTime";
import { EndTime } from "./EndTime";
import { ComplementaryTaskStatus } from "./ComplementaryTaskStatus";
import { ComplementaryTaskCategoryId } from "../ComplementaryTaskCategories/ComplementaryTaskCategoryId";

interface ComplementaryTaskProps {
  vesselVisitExecutionId: VesselVisitExecutionId;
  categoryId: ComplementaryTaskCategoryId;
  responsibleTeam: ResponsibleTeam;
  startTime: StartTime;
  endTime?: EndTime;
  status: ComplementaryTaskStatus;
}

export class ComplementaryTask extends AggregateRoot<ComplementaryTaskProps> {

  get id(): UniqueEntityID {
    return this._id;
  }

  get taskId(): ComplementaryTaskId {
    return ComplementaryTaskId.create(this.id);
  }

  get vesselVisitExecutionId(): VesselVisitExecutionId {
    return this.props.vesselVisitExecutionId;
  }

  get categoryId(): ComplementaryTaskCategoryId {
    return this.props.categoryId;
  }

  get responsibleTeam(): ResponsibleTeam {
    return this.props.responsibleTeam;
  }

  get startTime(): StartTime {
    return this.props.startTime;
  }

  get endTime(): EndTime | undefined {
    return this.props.endTime;
  }

  get status(): ComplementaryTaskStatus {
    return this.props.status;
  }

  private constructor(props: ComplementaryTaskProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: ComplementaryTaskProps,
    id?: UniqueEntityID
  ): Result<ComplementaryTask> {

    const guardedProps = [
      { argument: props.vesselVisitExecutionId, argumentName: "vesselVisitExecutionId" },
      { argument: props.categoryId, argumentName: "categoryId" },
      { argument: props.responsibleTeam, argumentName: "responsibleTeam" },
      { argument: props.startTime, argumentName: "startTime" },
      { argument: props.status, argumentName: "status" }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<ComplementaryTask>(guardResult.message);
    }

    const task = new ComplementaryTask({ ...props }, id);
    return Result.ok<ComplementaryTask>(task);
  }
}
