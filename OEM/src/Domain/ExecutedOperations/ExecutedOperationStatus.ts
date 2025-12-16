import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";

export enum ExecutedOperationStatusEnum {
  STARTED = "STARTED",
  COMPLETED = "COMPLETED",
  DELAYED = "DELAYED"
}

interface ExecutedOperationStatusProps {
  value: ExecutedOperationStatusEnum;
}

export class ExecutedOperationStatus extends ValueObject<ExecutedOperationStatusProps> {

  get value(): ExecutedOperationStatusEnum {
    return this.props.value;
  }

  private constructor(props: ExecutedOperationStatusProps) {
    super(props);
  }

  public static create(
    status: ExecutedOperationStatusEnum
  ): Result<ExecutedOperationStatus> {
    return Result.ok<ExecutedOperationStatus>(
      new ExecutedOperationStatus({ value: status })
    );
  }
}
