import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface DockIdProps {
  value: string;
}

export class DockId extends ValueObject<DockIdProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: DockIdProps) {
    super(props);
  }

  public static create(id: string): Result<DockId> {
    const guardResult = Guard.againstNullOrUndefined(id, "dockId");

    if (!guardResult.succeeded) {
      return Result.fail<DockId>(guardResult.message);
    }

    return Result.ok<DockId>(
      new DockId({ value: id })
    );
  }
}
