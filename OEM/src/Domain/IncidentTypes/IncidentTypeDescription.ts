import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface IncidentTypeDescriptionProps {
  value: string;
}

export class IncidentTypeDescription extends ValueObject<IncidentTypeDescriptionProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IncidentTypeDescriptionProps) {
    super(props);
  }

  public static create(description: string): Result<IncidentTypeDescription> {
    const guardResult = Guard.againstNullOrUndefined(description, "description");

    if (!guardResult.succeeded) {
      return Result.fail<IncidentTypeDescription>(guardResult.message);
    }

    return Result.ok<IncidentTypeDescription>(
      new IncidentTypeDescription({ value: description })
    );
  }
}
