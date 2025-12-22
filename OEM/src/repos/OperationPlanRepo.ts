import { IOperationPlanRepo } from "../services/IRepos/IOperationPlanRepo";

import { OperationPlan } from "../domain/OperationPlans/OperationPlan";
import { OperationPlanId } from "../domain/OperationPlans/OperationPlanId";
import { VesselVisitExecutionId } from "../domain/VesselVisitExecutions/VesselVisitExecutionId";

import OperationPlanSchema from "../persistence/schemas/OperationPlanSchema";
import { OperationPlanMap } from "../mappers/OperationPlanMap";

export class OperationPlanRepo implements IOperationPlanRepo {

  async save(operationPlan: OperationPlan): Promise<void> {
    const persistence = OperationPlanMap.toPersistence(operationPlan);

    await OperationPlanSchema.findOneAndUpdate(
      { domainId: persistence.domainId },
      persistence,
      { upsert: true, new: true }
    );
  }

  async findById(
    id: OperationPlanId
  ): Promise<OperationPlan | null> {

    const doc = await OperationPlanSchema.findOne({
      domainId: id.toString()
    });

    if (!doc) return null;

    return OperationPlanMap.toDomain(doc);
  }

  async findByvesselVisitExecutionId(
    vesselVisitExecutionId: VesselVisitExecutionId
  ): Promise<OperationPlan | null> {

    const doc = await OperationPlanSchema.findOne({
      vesselVisitExecutionId: vesselVisitExecutionId.toString()
    });

    if (!doc) return null;

    return OperationPlanMap.toDomain(doc);
  }

  async findAll(): Promise<OperationPlan[]> {
    const docs = await OperationPlanSchema.find({});

    return docs.map(doc => OperationPlanMap.toDomain(doc));
  }

  async exists(
    id: OperationPlanId
  ): Promise<boolean> {

    const count = await OperationPlanSchema.countDocuments({
      domainId: id.toString()
    });

    return count > 0;
  }
}
