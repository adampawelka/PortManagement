import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface PlannedEndProps {
  value: Date;
}

export class PlannedEnd extends ValueObject<PlannedEndProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: PlannedEndProps) {
    super(props);
  }

  public static create(date: Date): Result<PlannedEnd> {
    const guardResult = Guard.againstNullOrUndefined(date, "plannedEnd");

    if (!guardResult.succeeded) {
      return Result.fail<PlannedEnd>(guardResult.message);
    }

    return Result.ok<PlannedEnd>(
      new PlannedEnd({ value: date })
    );
  }
}
