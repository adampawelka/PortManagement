import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface IncidentStartTimeProps {
  value: Date;
}

export class IncidentStartTime extends ValueObject<IncidentStartTimeProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: IncidentStartTimeProps) {
    super(props);
  }

  public static create(date: Date): Result<IncidentStartTime> {
    const guardResult = Guard.againstNullOrUndefined(date, "startTime");

    if (!guardResult.succeeded) {
      return Result.fail<IncidentStartTime>(guardResult.message);
    }

    return Result.ok<IncidentStartTime>(
      new IncidentStartTime({ value: date })
    );
  }
}
