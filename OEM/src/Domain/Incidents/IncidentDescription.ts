import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface IncidentDescriptionProps {
  value: string;
}

export class IncidentDescription extends ValueObject<IncidentDescriptionProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IncidentDescriptionProps) {
    super(props);
  }

  public static create(description: string): Result<IncidentDescription> {
    const guardResult = Guard.againstNullOrUndefined(description, "description");

    if (!guardResult.succeeded) {
      return Result.fail<IncidentDescription>(guardResult.message);
    }

    return Result.ok<IncidentDescription>(
      new IncidentDescription({ value: description })
    );
  }
}
