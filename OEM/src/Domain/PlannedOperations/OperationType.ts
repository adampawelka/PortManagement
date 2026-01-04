import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

export enum OperationTypeEnum {
  LOADING = "LOADING",
  UNLOADING = "UNLOADING"
}

interface OperationTypeProps {
  value: OperationTypeEnum;
}

export class OperationType extends ValueObject<OperationTypeProps> {

  get value(): OperationTypeEnum {
    return this.props.value;
  }

  private constructor(props: OperationTypeProps) {
    super(props);
  }

  public static create(type: OperationTypeEnum): Result<OperationType> {
    return Result.ok<OperationType>(
      new OperationType({ value: type })
    );
  }
}
