import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ResourceIdProps {
  value: string;
}

export class ResourceId extends ValueObject<ResourceIdProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ResourceIdProps) {
    super(props);
  }

  public static create(id: string): Result<ResourceId> {
    const guardResult = Guard.againstNullOrUndefined(id, "resourceId");

    if (!guardResult.succeeded) {
      return Result.fail<ResourceId>(guardResult.message);
    }

    return Result.ok<ResourceId>(
      new ResourceId({ value: id })
    );
  }
}
