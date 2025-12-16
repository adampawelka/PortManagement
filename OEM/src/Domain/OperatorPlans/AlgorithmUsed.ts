import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface AlgorithmUsedProps {
  value: string;
}

export class AlgorithmUsed extends ValueObject<AlgorithmUsedProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: AlgorithmUsedProps) {
    super(props);
  }

  public static create(algorithm: string): Result<AlgorithmUsed> {
    const guardResult = Guard.againstNullOrUndefined(algorithm, "algorithmUsed");

    if (!guardResult.succeeded) {
      return Result.fail<AlgorithmUsed>(guardResult.message);
    }

    return Result.ok<AlgorithmUsed>(
      new AlgorithmUsed({ value: algorithm })
    );
  }
}
