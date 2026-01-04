import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";

interface ActualBerthTimeProps {
  value: Date;
}

export class ActualBerthTime extends ValueObject<ActualBerthTimeProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: ActualBerthTimeProps) {
    super(props);
  }

  public static create(date: Date): Result<ActualBerthTime> {
    return Result.ok<ActualBerthTime>(
      new ActualBerthTime({ value: date })
    );
  }
}
