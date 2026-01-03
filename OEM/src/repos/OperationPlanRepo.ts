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

  async findById(id: OperationPlanId): Promise<OperationPlan | null> {
    const idString = id.id.toString();
    const doc = await OperationPlanSchema.findOne({ domainId: idString });
    if (!doc) return null;
    return OperationPlanMap.toDomain(doc);
  }

  async findByVvnId(vvnId: VvnId): Promise<OperationPlan | null> {
    const doc = await OperationPlanSchema.findOne({ vvnId: vvnId.value });
    if (!doc) return null;
    return OperationPlanMap.toDomain(doc);
  }

  async findAll(): Promise<OperationPlan[]> {
    const docs = await OperationPlanSchema.find({});
    return docs.map(OperationPlanMap.toDomain);
  }

  async findAllByVvnId(vvnId: VvnId): Promise<OperationPlan[]> {
    const docs = await OperationPlanSchema.find({ vvnId: vvnId.value });
    return docs.map(OperationPlanMap.toDomain);
  }

  async search(criteria: {
    dateStart?: Date;
    dateEnd?: Date;
    operationDateStart?: Date;
    operationDateEnd?: Date;
    vesselName?: string;
    vvnId?: string;
  }): Promise<OperationPlan[]> {
    const query: any = {};

    if (criteria.dateStart || criteria.dateEnd) {
      query.createdAt = {};
      if (criteria.dateStart) query.createdAt.$gte = criteria.dateStart;
      if (criteria.dateEnd) query.createdAt.$lte = criteria.dateEnd;
    }

    if (criteria.vvnId) query.vvnId = criteria.vvnId;

    if (criteria.operationDateStart || criteria.operationDateEnd || criteria.vesselName) {
      query.schedule = { $elemMatch: {} };
      if (criteria.operationDateStart) query.schedule.$elemMatch.start = { $gte: criteria.operationDateStart };
      if (criteria.operationDateEnd) {
        query.schedule.$elemMatch.start = { 
          ...query.schedule.$elemMatch.start, 
          $lte: criteria.operationDateEnd 
        };
      }
      if (criteria.vesselName) {
        query.schedule.$elemMatch.vesselName = { $regex: criteria.vesselName, $options: 'i' };
      }
    }

    const docs = await OperationPlanSchema.find(query);
    return docs.map(OperationPlanMap.toDomain);
  }

  async exists(id: OperationPlanId): Promise<boolean> {
    const count = await OperationPlanSchema.countDocuments({ domainId: id.toString() });
    return count > 0;
  }
}
