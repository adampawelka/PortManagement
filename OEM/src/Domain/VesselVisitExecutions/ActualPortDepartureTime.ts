import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";

interface ActualPortDepartureTimeProps {
  value: Date;
}

export class ActualPortDepartureTime extends ValueObject<ActualPortDepartureTimeProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: ActualPortDepartureTimeProps) {
    super(props);
  }

  public static create(date: Date): Result<ActualPortDepartureTime> {
    return Result.ok<ActualPortDepartureTime>(
      new ActualPortDepartureTime({ value: date })
    );
  }
}
