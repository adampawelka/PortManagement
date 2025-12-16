import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface PlannedResourceIdProps {
  value: string;
}

export class PlannedResourceId extends ValueObject<PlannedResourceIdProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PlannedResourceIdProps) {
    super(props);
  }

  public static create(id: string): Result<PlannedResourceId> {
    const guardResult = Guard.againstNullOrUndefined(id, "resourceId");

    if (!guardResult.succeeded) {
      return Result.fail<PlannedResourceId>(guardResult.message);
    }

    return Result.ok<PlannedResourceId>(
      new PlannedResourceId({ value: id })
    );
  }
}
