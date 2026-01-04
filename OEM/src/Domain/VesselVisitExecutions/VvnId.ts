import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface VvnIdProps {
  value: string;
}

export class VvnId extends ValueObject<VvnIdProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: VvnIdProps) {
    super(props);
  }

  public static create(id: string): Result<VvnId> {
    const guardResult = Guard.againstNullOrUndefined(id, "vvnId");

    if (!guardResult.succeeded) {
      return Result.fail<VvnId>(guardResult.message);
    }

    return Result.ok<VvnId>(
      new VvnId({ value: id })
    );
  }
}
