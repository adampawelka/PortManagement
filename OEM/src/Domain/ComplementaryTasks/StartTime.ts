import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface StartTimeProps {
  value: Date;
}

export class StartTime extends ValueObject<StartTimeProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: StartTimeProps) {
    super(props);
  }

  public static create(date: Date): Result<StartTime> {
    const guardResult = Guard.againstNullOrUndefined(date, "startTime");

    if (!guardResult.succeeded) {
      return Result.fail<StartTime>(guardResult.message);
    }

    return Result.ok<StartTime>(
      new StartTime({ value: date })
    );
  }
}
