import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface StaffIdProps {
  value: string;
}

export class StaffId extends ValueObject<StaffIdProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: StaffIdProps) {
    super(props);
  }

  public static create(id: string): Result<StaffId> {
    const guardResult = Guard.againstNullOrUndefined(id, "staffId");

    if (!guardResult.succeeded) {
      return Result.fail<StaffId>(guardResult.message);
    }

    return Result.ok<StaffId>(
      new StaffId({ value: id })
    );
  }
}
