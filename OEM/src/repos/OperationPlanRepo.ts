import { IOperationPlanRepo } from "../services/IRepos/IOperationPlanRepo";

import { OperationPlan } from "../Domain/OperationPlans/OperationPlan";
import { OperationPlanId } from "../Domain/OperationPlans/OperationPlanId";
import { VvnId } from "../Domain/VesselVisitExecutions/VvnId";

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

  async findByVvnId(
    vvnId: VvnId
  ): Promise<OperationPlan | null> {

    const doc = await OperationPlanSchema.findOne({
      vvnId: vvnId.value
    });

    if (!doc) return null;

    return OperationPlanMap.toDomain(doc);
  }

  async findAll(): Promise<OperationPlan[]> {
    const docs = await OperationPlanSchema.find({});

    return docs.map(doc => OperationPlanMap.toDomain(doc));
  }

  async findAllByVvnId(
    vvnId: VvnId
  ): Promise<OperationPlan[]> {

    const docs = await OperationPlanSchema.find({
      vvnId: vvnId.value
    });

    return docs.map(doc => OperationPlanMap.toDomain(doc));
  }

  async search(
    criteria: {
      dateStart?: Date;
      dateEnd?: Date;
      operationDateStart?: Date;
      operationDateEnd?: Date;
      vesselName?: string;
      vvnId?: string;
    }
  ): Promise<OperationPlan[]> {
    const query: any = {};

    // Filter by plan creation date range
    if (criteria.dateStart || criteria.dateEnd) {
      query.createdAt = {};
      if (criteria.dateStart) {
        query.createdAt.$gte = criteria.dateStart;
      }
      if (criteria.dateEnd) {
        query.createdAt.$lte = criteria.dateEnd;
      }
    }

    // Filter by VVN ID
    if (criteria.vvnId) {
      query.vvnId = criteria.vvnId;
    }

    // Filter by schedule operation date range
    if (criteria.operationDateStart || criteria.operationDateEnd) {
      query['schedule.start'] = {};
      if (criteria.operationDateStart) {
        query['schedule.start'].$gte = criteria.operationDateStart;
      }
      if (criteria.operationDateEnd) {
        query['schedule.start'].$lte = criteria.operationDateEnd;
      }
    }

    // Filter by vessel name in schedule
    if (criteria.vesselName) {
      query['schedule.vesselName'] = { $regex: criteria.vesselName, $options: 'i' }; // Case-insensitive search
    }

    const docs = await OperationPlanSchema.find(query);

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
