import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";

export enum IncidentSeverityEnum {
  MINOR = "MINOR",
  MAJOR = "MAJOR",
  CRITICAL = "CRITICAL"
}

interface IncidentSeverityProps {
  value: IncidentSeverityEnum;
}

export class IncidentSeverity extends ValueObject<IncidentSeverityProps> {

  get value(): IncidentSeverityEnum {
    return this.props.value;
  }

  private constructor(props: IncidentSeverityProps) {
    super(props);
  }

  public static create(
    severity: IncidentSeverityEnum
  ): Result<IncidentSeverity> {
    return Result.ok<IncidentSeverity>(
      new IncidentSeverity({ value: severity })
    );
  }
}
