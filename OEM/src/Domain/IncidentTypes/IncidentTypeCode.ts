import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface IncidentTypeCodeProps {
  value: string;
}

export class IncidentTypeCode extends ValueObject<IncidentTypeCodeProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IncidentTypeCodeProps) {
    super(props);
  }

  public static create(code: string): Result<IncidentTypeCode> {
    const guardResult = Guard.againstNullOrUndefined(code, "code");

    if (!guardResult.succeeded) {
      return Result.fail<IncidentTypeCode>(guardResult.message);
    }

    return Result.ok<IncidentTypeCode>(
      new IncidentTypeCode({ value: code })
    );
  }
}
