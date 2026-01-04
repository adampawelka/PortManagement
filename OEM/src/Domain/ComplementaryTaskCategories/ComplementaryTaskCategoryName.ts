import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ComplementaryTaskCategoryNameProps {
  value: string;
}

export class ComplementaryTaskCategoryName extends ValueObject<ComplementaryTaskCategoryNameProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ComplementaryTaskCategoryNameProps) {
    super(props);
  }

  public static create(name: string): Result<ComplementaryTaskCategoryName> {
    const guardResult = Guard.againstNullOrUndefined(name, "name");

    if (!guardResult.succeeded) {
      return Result.fail<ComplementaryTaskCategoryName>(guardResult.message);
    }

    return Result.ok<ComplementaryTaskCategoryName>(
      new ComplementaryTaskCategoryName({ value: name })
    );
  }
}
