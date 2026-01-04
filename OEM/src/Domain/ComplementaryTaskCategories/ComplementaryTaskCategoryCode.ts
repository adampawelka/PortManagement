import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ComplementaryTaskCategoryCodeProps {
  value: string;
}

export class ComplementaryTaskCategoryCode extends ValueObject<ComplementaryTaskCategoryCodeProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ComplementaryTaskCategoryCodeProps) {
    super(props);
  }

  public static create(code: string): Result<ComplementaryTaskCategoryCode> {
    const guardResult = Guard.againstNullOrUndefined(code, "code");

    if (!guardResult.succeeded) {
      return Result.fail<ComplementaryTaskCategoryCode>(guardResult.message);
    }

    return Result.ok<ComplementaryTaskCategoryCode>(
      new ComplementaryTaskCategoryCode({ value: code })
    );
  }
}
