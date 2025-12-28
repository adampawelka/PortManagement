import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { IncidentTypeId } from "./IncidentTypeId";
import { IncidentTypeCode } from "./IncidentTypeCode";
import { IncidentTypeName } from "./IncidentTypeName";
import { IncidentTypeDescription } from "./IncidentTypeDescription";
import { IncidentSeverity } from "../Incidents/IncidentSeverity";

interface IncidentTypeProps {
  code: IncidentTypeCode;
  name: IncidentTypeName;
  description: IncidentTypeDescription;
  severity: IncidentSeverity;
}

export class IncidentType extends AggregateRoot<IncidentTypeProps> {

  get id(): UniqueEntityID {
    return this._id;
  }

  get incidentTypeId(): IncidentTypeId {
    return IncidentTypeId.create(this.id);
  }

  get code(): IncidentTypeCode {
    return this.props.code;
  }

  get name(): IncidentTypeName {
    return this.props.name;
  }

  get description(): IncidentTypeDescription {
    return this.props.description;
  }

  get severity(): IncidentSeverity {
    return this.props.severity;
  }

  private constructor(props: IncidentTypeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: IncidentTypeProps,
    id?: UniqueEntityID
  ): Result<IncidentType> {

    const guardedProps = [
      { argument: props.code, argumentName: "code" },
      { argument: props.name, argumentName: "name" },
      { argument: props.description, argumentName: "description" },
      { argument: props.severity, argumentName: "severity" }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<IncidentType>(guardResult.message);
    }

    const incidentType = new IncidentType({ ...props }, id);
    return Result.ok<IncidentType>(incidentType);
  }
}
