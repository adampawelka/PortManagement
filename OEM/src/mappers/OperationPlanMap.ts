import { OperationPlan } from "../Domain/OperationPlans/OperationPlan";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { ScheduledOperation } from "../Domain/OperationPlans/ScheduledOperation";

import { VvnId } from "../Domain/VesselVisitExecutions/VvnId";
import { CreatedAt } from "../Domain/OperationPlans/CreatedAt";
import { CreatedBy } from "../Domain/OperationPlans/CreatedBy";
import { AlgorithmUsed } from "../Domain/OperationPlans/AlgorithmUsed";


export class OperationPlanMap {

  static toPersistence(operationPlan: OperationPlan): any {
    return {
      domainId: operationPlan.id.toString(),
      vvnId: operationPlan.props.vvnId.value,
      createdAt: operationPlan.props.createdAt.value,
      createdBy: operationPlan.props.createdBy.value,
      algorithmUsed: operationPlan.props.algorithmUsed.value,
      schedule: operationPlan.props.schedule.map(op => ({
        vesselName: op.vesselName,
        start: op.start,
        end: op.end,
        delay: op.delay,
        dock: op.dock,
        cranes: op.cranes,
        staff: op.staff
      }))
    };
  }

  static toDomain(raw: any): OperationPlan {

    const schedule: ScheduledOperation[] = (raw.schedule || []).map((op: any) => {
      const scheduledOpOrError = ScheduledOperation.create({
        vesselName: op.vesselName,
        start: new Date(op.start),
        end: new Date(op.end),
        delay: op.delay,
        dock: op.dock,
        cranes: Array.isArray(op.cranes) ? op.cranes : [],
        staff: Array.isArray(op.staff) ? op.staff : []
      });

      if (scheduledOpOrError.isFailure) {
        throw new Error("Invalid ScheduledOperation data");
      }

      return scheduledOpOrError.getValue();
    });

    const vvnIdOrError = VvnId.create(raw.vvnId);
    const createdAtOrError = CreatedAt.create(raw.createdAt);
    const createdByOrError = CreatedBy.create(raw.createdBy);
    const algorithmUsedOrError = AlgorithmUsed.create(raw.algorithmUsed);

    if (
      vvnIdOrError.isFailure ||
      createdAtOrError.isFailure ||
      createdByOrError.isFailure ||
      algorithmUsedOrError.isFailure
    ) {
      throw new Error("Invalid OperationPlan persistence data");
    }

    const operationPlanOrError = OperationPlan.create(
      {
        vvnId: vvnIdOrError.getValue(),
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
