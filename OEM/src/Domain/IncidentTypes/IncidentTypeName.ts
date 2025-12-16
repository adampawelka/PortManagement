import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface IncidentTypeNameProps {
  value: string;
}

export class IncidentTypeName extends ValueObject<IncidentTypeNameProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IncidentTypeNameProps) {
    super(props);
  }

  public static create(name: string): Result<IncidentTypeName> {
    const guardResult = Guard.againstNullOrUndefined(name, "name");

    if (!guardResult.succeeded) {
      return Result.fail<IncidentTypeName>(guardResult.message);
    }

    return Result.ok<IncidentTypeName>(
      new IncidentTypeName({ value: name })
    );
  }
}
