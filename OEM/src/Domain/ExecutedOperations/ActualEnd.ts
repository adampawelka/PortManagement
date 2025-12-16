import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";

interface ActualEndProps {
  value: Date;
}

export class ActualEnd extends ValueObject<ActualEndProps> {

  get value(): Date {
    return this.props.value;
  }

  private constructor(props: ActualEndProps) {
    super(props);
  }

  public static create(date: Date): Result<ActualEnd> {
    return Result.ok<ActualEnd>(
      new ActualEnd({ value: date })
    );
  }
}
