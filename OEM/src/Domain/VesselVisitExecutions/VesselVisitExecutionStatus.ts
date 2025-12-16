import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";

export enum VesselVisitExecutionStatusEnum {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

interface VesselVisitExecutionStatusProps {
  value: VesselVisitExecutionStatusEnum;
}

export class VesselVisitExecutionStatus
  extends ValueObject<VesselVisitExecutionStatusProps> {

  get value(): VesselVisitExecutionStatusEnum {
    return this.props.value;
  }

  private constructor(props: VesselVisitExecutionStatusProps) {
    super(props);
  }

  public static create(
    status: VesselVisitExecutionStatusEnum
  ): Result<VesselVisitExecutionStatus> {
    return Result.ok<VesselVisitExecutionStatus>(
      new VesselVisitExecutionStatus({ value: status })
    );
  }
}
