import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface PlannedStartProps {
  value: Date;
}

export class PlannedStart extends ValueObject<PlannedStartProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: PlannedStartProps) {
    super(props);
  }

  public static create(date: Date): Result<PlannedStart> {
    const guardResult = Guard.againstNullOrUndefined(date, "plannedStart");

    if (!guardResult.succeeded) {
      return Result.fail<PlannedStart>(guardResult.message);
    }

    return Result.ok<PlannedStart>(
      new PlannedStart({ value: date })
    );
  }
}
