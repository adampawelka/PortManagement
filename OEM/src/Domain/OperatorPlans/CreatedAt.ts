import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface CreatedAtProps {
  value: Date;
}

export class CreatedAt extends ValueObject<CreatedAtProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: CreatedAtProps) {
    super(props);
  }

  public static create(date: Date): Result<CreatedAt> {
    const guardResult = Guard.againstNullOrUndefined(date, "createdAt");

    if (!guardResult.succeeded) {
      return Result.fail<CreatedAt>(guardResult.message);
    }

    return Result.ok<CreatedAt>(
      new CreatedAt({ value: date })
    );
  }
}
