import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface PlannedStaffIdProps {
  value: string;
}

export class PlannedStaffId extends ValueObject<PlannedStaffIdProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PlannedStaffIdProps) {
    super(props);
  }

  public static create(id: string): Result<PlannedStaffId> {
    const guardResult = Guard.againstNullOrUndefined(id, "staffId");

    if (!guardResult.succeeded) {
      return Result.fail<PlannedStaffId>(guardResult.message);
    }

    return Result.ok<PlannedStaffId>(
      new PlannedStaffId({ value: id })
    );
  }
}
