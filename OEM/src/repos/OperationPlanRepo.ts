import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { IOperationPlanRepo } from "../services/IRepos/IOperationPlanRepo";
import { OperationPlanId } from "../Domain/OperationPlans/OperationPlanId";
import { OperationPlan } from "../Domain/OperationPlans/OperationPlan";
import { CreatedAt } from "../Domain/OperationPlans/CreatedAt";
import { CreatedBy } from "../Domain/OperationPlans/CreatedBy";
import { AlgorithmUsed } from "../Domain/OperationPlans/AlgorithmUsed";

import { VesselVisitExecutionId } from "../Domain/VesselVisitExecutions/VesselVisitExecutionId";

import OperationPlanSchema from "../persistence/schemas/OperationPlanSchema";

export class OperationPlanRepo implements IOperationPlanRepo {

  async save(operationPlan: OperationPlan): Promise<void> {
    const persistence = {
      domainId: operationPlan.operationPlanId.toString(),
      vveId: operationPlan.props.vveId.toString(),
      createdAt: operationPlan.props.createdAt.value,
      createdBy: operationPlan.props.createdBy.value,
      algorithmUsed: operationPlan.props.algorithmUsed.value
    };

    await OperationPlanSchema.findOneAndUpdate(
      { domainId: persistence.domainId },
      persistence,
      { upsert: true, new: true }
    );
  }

  async findById(id: OperationPlanId): Promise<OperationPlan | null> {
    const doc = await OperationPlanSchema.findOne({
      domainId: id.toString()
    });

    if (!doc) return null;

    return this.toDomain(doc);
  }

  async findByVveId(
    vveId: VesselVisitExecutionId
  ): Promise<OperationPlan | null> {
    const doc = await OperationPlanSchema.findOne({
      vveId: vveId.toString()
    });

    if (!doc) return null;

    return this.toDomain(doc);
  }

  async exists(operationPlan: OperationPlan): Promise<boolean> {
    const count = await OperationPlanSchema.countDocuments({
      domainId: operationPlan.operationPlanId.toString()
    });

    return count > 0;
  }

  // Mapping Mongo → Domain
private toDomain(raw: any): OperationPlan {
  const operationPlanOrError = OperationPlan.create(
    {
      vveId: VesselVisitExecutionId.create(
        new UniqueEntityID(raw.vveId)
      ),
      createdAt: CreatedAt.create(raw.createdAt).getValue(),
      createdBy: CreatedBy.create(raw.createdBy).getValue(),
      algorithmUsed: AlgorithmUsed.create(raw.algorithmUsed).getValue()
    },
    new UniqueEntityID(raw.domainId)
  );

//   if (operationPlanOrError.isFailure) {
//     throw new Error(operationPlanOrError.error);
//   }

  return operationPlanOrError.getValue();
}

}
