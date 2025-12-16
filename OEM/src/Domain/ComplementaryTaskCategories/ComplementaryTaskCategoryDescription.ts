import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface ComplementaryTaskCategoryDescriptionProps {
  value: string;
}

export class ComplementaryTaskCategoryDescription extends ValueObject<ComplementaryTaskCategoryDescriptionProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ComplementaryTaskCategoryDescriptionProps) {
    super(props);
  }

  public static create(description: string): Result<ComplementaryTaskCategoryDescription> {
    const guardResult = Guard.againstNullOrUndefined(description, "description");

    if (!guardResult.succeeded) {
      return Result.fail<ComplementaryTaskCategoryDescription>(guardResult.message);
    }

    return Result.ok<ComplementaryTaskCategoryDescription>(
      new ComplementaryTaskCategoryDescription({ value: description })
    );
  }
}
