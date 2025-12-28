import { OperationPlan } from "../Domain/OperationPlans/OperationPlan";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class OperationPlanMap {

  static toPersistence(operationPlan: OperationPlan): any {
    return {
      domainId: operationPlan.id.toString(),
      vveId: operationPlan.props.vesselVisitExecutionId.id.toString(),
      createdAt: operationPlan.props.createdAt.value,
      createdBy: operationPlan.props.createdBy.value,
      algorithmUsed: operationPlan.props.algorithmUsed.value
    };
  }

  static toDomain(raw: any): OperationPlan {
    const operationPlanOrError = OperationPlan.create(
      {
        vesselVisitExecutionId: raw.vveId,
        createdAt: raw.createdAt,
        createdBy: raw.createdBy,
        algorithmUsed: raw.algorithmUsed
      },
      new UniqueEntityID(raw.domainId)
    );

    if (operationPlanOrError.isFailure) {
      throw new Error("Failed to map OperationPlan");
    }

    return operationPlanOrError.getValue();
  }
}

