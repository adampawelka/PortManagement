import { PlannedOperation } from "../Domain/PlannedOperations/PlannedOperation";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class PlannedOperationMap {

  static toPersistence(operation: PlannedOperation): any {
    return {
      domainId: operation.plannedOperationId.toString(),
      operationPlanId: operation.operationPlanId.toString(),
      resourceId: operation.resourceId.value,
      staffId: operation.staffId.value,
      plannedStart: operation.plannedStart.value,
      plannedEnd: operation.plannedEnd.value,
      operationType: operation.operationType.value,
      status: operation.status.value
    };
  }

  static toDomain(raw: any): PlannedOperation {
    const data = raw.toObject ? raw.toObject() : raw;

    const operationOrError = PlannedOperation.create(
      {
        operationPlanId: data.operationPlanId,
        resourceId: data.resourceId,
        staffId: data.staffId,
        plannedStart: data.plannedStart,
        plannedEnd: data.plannedEnd,
        operationType: data.operationType,
        status: data.status
      },
      new UniqueEntityID(data.domainId)
    );

    if (operationOrError.isFailure) {
      throw new Error(operationOrError.errorValue().toString());
    }

    return operationOrError.getValue();
  }
}
