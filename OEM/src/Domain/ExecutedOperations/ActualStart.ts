import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ActualStartProps {
  value: Date;
}

export class ActualStart extends ValueObject<ActualStartProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: ActualStartProps) {
    super(props);
  }

  public static create(date: Date): Result<ActualStart> {
    const guardResult = Guard.againstNullOrUndefined(date, "actualStart");

    if (!guardResult.succeeded) {
      return Result.fail<ActualStart>(guardResult.message);
    }

    return Result.ok<ActualStart>(
      new ActualStart({ value: date })
    );
  }
}
