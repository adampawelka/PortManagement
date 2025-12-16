import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";

export enum ComplementaryTaskStatusEnum {
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED"
}

interface ComplementaryTaskStatusProps {
  value: ComplementaryTaskStatusEnum;
}

export class ComplementaryTaskStatus extends ValueObject<ComplementaryTaskStatusProps> {

  get value(): ComplementaryTaskStatusEnum {
    return this.props.value;
  }

  private constructor(props: ComplementaryTaskStatusProps) {
    super(props);
  }

  public static create(
    status: ComplementaryTaskStatusEnum
  ): Result<ComplementaryTaskStatus> {
    return Result.ok<ComplementaryTaskStatus>(
      new ComplementaryTaskStatus({ value: status })
    );
  }
}
