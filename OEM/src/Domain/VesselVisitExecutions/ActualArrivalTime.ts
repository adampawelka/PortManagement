import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface ActualArrivalTimeProps {
  value: Date;
}

export class ActualArrivalTime extends ValueObject<ActualArrivalTimeProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: ActualArrivalTimeProps) {
    super(props);
  }

  public static create(date: Date): Result<ActualArrivalTime> {
    const guardResult = Guard.againstNullOrUndefined(date, "actualArrivalTime");

    if (!guardResult.succeeded) {
      return Result.fail<ActualArrivalTime>(guardResult.message);
    }

    return Result.ok<ActualArrivalTime>(
      new ActualArrivalTime({ value: date })
    );
  }
}
