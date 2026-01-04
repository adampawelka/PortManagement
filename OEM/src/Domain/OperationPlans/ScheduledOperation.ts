import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ScheduledOperationProps {
  vesselName: string;
  start: Date;
  end: Date;
  delay: number;
  dock: string;
  cranes: string[]; // ⬅️ TABLICA
  staff: string[];  // ⬅️ TABLICA
}

export class ScheduledOperation extends ValueObject<ScheduledOperationProps> {

  get vesselName(): string {
    return this.props.vesselName;
  }

  get start(): Date {
    return this.props.start;
  }

  get end(): Date {
    return this.props.end;
  }

  get delay(): number {
    return this.props.delay;
  }

  get dock(): string {
    return this.props.dock;
  }

  get cranes(): string[] {
    return this.props.cranes;
  }

  get staff(): string[] {
    return this.props.staff;
  }

  private constructor(props: ScheduledOperationProps) {
    super(props);
  }

  public static create(props: ScheduledOperationProps): Result<ScheduledOperation> {
  const guardResult = Guard.againstNullOrUndefinedBulk([
    { argument: props.vesselName, argumentName: "vesselName" },
    { argument: props.start, argumentName: "start" },
    { argument: props.end, argumentName: "end" },
    { argument: props.delay, argumentName: "delay" },
    { argument: props.dock, argumentName: "dock" },
  ]);

  if (!guardResult.succeeded) {
    return Result.fail(guardResult.message);
  }

  if (!Array.isArray(props.cranes)) {
    return Result.fail<ScheduledOperation>("Cranes must be an array");
  }

  if (!Array.isArray(props.staff)) {
    return Result.fail<ScheduledOperation>("Staff must be an array");
  }

  if (props.start >= props.end) {
    return Result.fail<ScheduledOperation>("Start time must be before end time");
  }

  if (props.delay < 0) {
    return Result.fail<ScheduledOperation>("Delay cannot be negative");
  }

  return Result.ok(
    new ScheduledOperation({
      ...props,
      cranes: [...props.cranes],
      staff: [...props.staff],
    })
  );
}

}
