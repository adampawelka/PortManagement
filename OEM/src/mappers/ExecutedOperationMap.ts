import { ExecutedOperation } from "../Domain/ExecutedOperations/ExecutedOperation";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class ExecutedOperationMap {

  static toPersistence(operation: ExecutedOperation): any {
    return {
      domainId: operation.id.toString(),
      vesselVisitExecutionId: operation.vesselVisitExecutionId.valueOf.toString(),
      plannedOperationId: operation.plannedOperationId.valueOf.toString(),
      resourceId: operation.resourceId.value,
      staffId: operation.staffId.value,
      actualStart: operation.actualStart.value,
      actualEnd: operation.actualEnd?.value ?? null,
      status: operation.status.value
    };
  }

  static toDomain(raw: any): ExecutedOperation {
    const data = raw.toObject ? raw.toObject() : raw;

    const executedOperationOrError = ExecutedOperation.create(
      {
        vesselVisitExecutionId: data.vesselVisitExecutionId,
        plannedOperationId: data.plannedOperationId,
        resourceId: data.resourceId,
        staffId: data.staffId,
        actualStart: data.actualStart,
        actualEnd: data.actualEnd ?? undefined,
        status: data.status
      },
      new UniqueEntityID(data.domainId)
    );

    if (executedOperationOrError.isFailure) {
      throw new Error(executedOperationOrError.errorValue().toString());
    }

    return executedOperationOrError.getValue();
  }
}
