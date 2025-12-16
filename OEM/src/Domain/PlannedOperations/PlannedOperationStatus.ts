import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";

export enum PlannedOperationStatusEnum {
  PLANNED = "PLANNED",
  CANCELLED = "CANCELLED"
}

interface PlannedOperationStatusProps {
  value: PlannedOperationStatusEnum;
}

export class PlannedOperationStatus extends ValueObject<PlannedOperationStatusProps> {

  get value(): PlannedOperationStatusEnum {
    return this.props.value;
  }

  private constructor(props: PlannedOperationStatusProps) {
    super(props);
  }

  public static create(
    status: PlannedOperationStatusEnum
  ): Result<PlannedOperationStatus> {
    return Result.ok<PlannedOperationStatus>(
      new PlannedOperationStatus({ value: status })
    );
  }
}
