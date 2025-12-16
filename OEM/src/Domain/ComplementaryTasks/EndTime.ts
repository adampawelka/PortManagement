import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";

interface EndTimeProps {
  value: Date;
}

export class EndTime extends ValueObject<EndTimeProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: EndTimeProps) {
    super(props);
  }

  public static create(date: Date): Result<EndTime> {
    return Result.ok<EndTime>(
      new EndTime({ value: date })
    );
  }
}
