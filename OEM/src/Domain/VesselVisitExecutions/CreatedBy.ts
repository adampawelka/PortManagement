import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface CreatedByProps {
  value: string;
}

export class CreatedBy extends ValueObject<CreatedByProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: CreatedByProps) {
    super(props);
  }

  public static create(userId: string): Result<CreatedBy> {
    const guardResult = Guard.againstNullOrUndefined(userId, "createdBy");

    if (!guardResult.succeeded) {
      return Result.fail<CreatedBy>(guardResult.message);
    }

    return Result.ok<CreatedBy>(
      new CreatedBy({ value: userId })
    );
  }
}
