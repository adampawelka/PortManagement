import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";

export enum ComplementaryTaskExecutionModeEnum {
  PARALLEL = "PARALLEL",
  SUSPEND = "SUSPEND"
}

interface ComplementaryTaskExecutionModeProps {
  value: ComplementaryTaskExecutionModeEnum;
}

export class ComplementaryTaskExecutionMode
  extends ValueObject<ComplementaryTaskExecutionModeProps> {

  get value(): ComplementaryTaskExecutionModeEnum {
    return this.props.value;
  }

  private constructor(props: ComplementaryTaskExecutionModeProps) {
    super(props);
  }

  public static create(
    mode: ComplementaryTaskExecutionModeEnum
  ): Result<ComplementaryTaskExecutionMode> {
    return Result.ok(
      new ComplementaryTaskExecutionMode({ value: mode })
    );
  }

  public isSuspend(): boolean {
    return this.props.value === ComplementaryTaskExecutionModeEnum.SUSPEND;
  }
}
