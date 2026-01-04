import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { IncidentId } from "./IncidentId";
import { IncidentTypeId } from "../IncidentTypes/IncidentTypeId";
import { IncidentStartTime } from "./IncidentStartTime";
import { IncidentEndTime } from "./IncidentEndTime";
import { IncidentSeverity } from "./IncidentSeverity";
import { IncidentDescription } from "./IncidentDescription";
import { CreatedBy } from "./CreatedBy";

interface IncidentProps {
  incidentTypeId: IncidentTypeId;
  startTime: IncidentStartTime;
  endTime?: IncidentEndTime;
  severity: IncidentSeverity;
  description: IncidentDescription;
  createdBy: CreatedBy;
}

export class Incident extends AggregateRoot<IncidentProps> {

  get id(): UniqueEntityID {
    return this._id;
  }

  get incidentId(): IncidentId {
    return IncidentId.create(this.id);
  }

  get incidentTypeId(): IncidentTypeId {
    return this.props.incidentTypeId;
  }

  get startTime(): IncidentStartTime {
    return this.props.startTime;
  }

  get endTime(): IncidentEndTime | undefined {
    return this.props.endTime;
  }

  get severity(): IncidentSeverity {
    return this.props.severity;
  }

  get description(): IncidentDescription {
    return this.props.description;
  }

  get createdBy(): CreatedBy {
    return this.props.createdBy;
  }

  private constructor(props: IncidentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: IncidentProps,
    id?: UniqueEntityID
  ): Result<Incident> {

    const guardedProps = [
      { argument: props.incidentTypeId, argumentName: "incidentTypeId" },
      { argument: props.startTime, argumentName: "startTime" },
      { argument: props.severity, argumentName: "severity" },
      { argument: props.description, argumentName: "description" },
      { argument: props.createdBy, argumentName: "createdBy" }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Incident>(guardResult.message);
    }

    const incident = new Incident({ ...props }, id);
    return Result.ok<Incident>(incident);
  }
}
