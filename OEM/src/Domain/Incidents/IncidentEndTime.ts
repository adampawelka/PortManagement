import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";

interface IncidentEndTimeProps {
  value: Date;
}

export class IncidentEndTime extends ValueObject<IncidentEndTimeProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: IncidentEndTimeProps) {
    super(props);
  }

  public static create(date: Date): Result<IncidentEndTime> {
    return Result.ok<IncidentEndTime>(
      new IncidentEndTime({ value: date })
    );
  }
}
