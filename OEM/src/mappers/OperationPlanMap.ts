import { OperationPlan } from "../Domain/OperationPlans/OperationPlan";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { ScheduledOperation } from "../Domain/OperationPlans/ScheduleOperation";

import { VesselVisitExecutionId } from "../Domain/VesselVisitExecutions/VesselVisitExecutionId";
import { CreatedAt } from "../Domain/OperationPlans/CreatedAt";
import { CreatedBy } from "../Domain/OperationPlans/CreatedBy";
import { AlgorithmUsed } from "../Domain/OperationPlans/AlgorithmUsed";


export class OperationPlanMap {

  static toPersistence(operationPlan: OperationPlan): any {
    return {
      domainId: operationPlan.operationPlanId.toString(),
      vveId: operationPlan.props.vesselVisitExecutionId.toString(),
      createdAt: operationPlan.props.createdAt.value,
      createdBy: operationPlan.props.createdBy.value,
      algorithmUsed: operationPlan.props.algorithmUsed.value,
      schedule: operationPlan.props.schedule.map(op => ({
        vesselName: op.vesselName,
        start: op.start,
        end: op.end,
        delay: op.delay,
        dock: op.dock,
        crane: op.crane,
        staff: op.staff
      }))
    };
  }

  static toDomain(raw: any): OperationPlan {

    const schedule: ScheduledOperation[] = (raw.schedule || []).map((op: any) => {
      const scheduledOpOrError = ScheduledOperation.create({
        vesselName: op.vesselName,
        start: op.start,
        end: op.end,
        delay: op.delay,
        dock: op.dock,
        crane: op.crane,
        staff: op.staff
      });

      if (scheduledOpOrError.isFailure) {
        throw new Error("Invalid ScheduledOperation data");
      }


      return scheduledOpOrError.getValue();
    });

    const vesselVisitExecutionId =
      VesselVisitExecutionId.create(raw.vveId);

    const createdAtOrError =
      CreatedAt.create(raw.createdAt);

    const createdByOrError =
      CreatedBy.create(raw.createdBy);

    const algorithmUsedOrError =
      AlgorithmUsed.create(raw.algorithmUsed);

    if (
      createdAtOrError.isFailure ||
      createdByOrError.isFailure ||
      algorithmUsedOrError.isFailure
    ) {
      throw new Error("Invalid OperationPlan persistence data");
    }

    const operationPlanOrError = OperationPlan.create(
      {
        vesselVisitExecutionId,
        createdAt: createdAtOrError.getValue(),
        createdBy: createdByOrError.getValue(),
        algorithmUsed: algorithmUsedOrError.getValue(),
        schedule
      },
      new UniqueEntityID(raw.domainId)
    );

    if (operationPlanOrError.isFailure) {
      throw new Error("Invalid OperationPlan data");
    }


    return operationPlanOrError.getValue();
  }
}
