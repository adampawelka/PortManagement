import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";

interface ActualUnberthTimeProps {
  value: Date;
}

export class ActualUnberthTime extends ValueObject<ActualUnberthTimeProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: ActualUnberthTimeProps) {
    super(props);
  }

  public static create(date: Date): Result<ActualUnberthTime> {
    return Result.ok<ActualUnberthTime>(
      new ActualUnberthTime({ value: date })
    );
  }
}
