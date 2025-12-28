import { VesselVisitExecution } from "../Domain/VesselVisitExecutions/VesselVisitExecution";
import { VesselVisitExecutionId } from "../Domain/VesselVisitExecutions/VesselVisitExecutionId";


import VesselVisitExecutionSchema from "../persistence/schemas/VesselVisitExecutionSchema";
import { VesselVisitExecutionMap } from "../mappers/VesselVisitExecutionMap";


export class VesselVisitExecutionRepo {

  async save(vve: VesselVisitExecution): Promise<void> {
    const persistence = VesselVisitExecutionMap.toPersistence(vve);

    await VesselVisitExecutionSchema.findOneAndUpdate(
      { domainId: persistence.domainId },
      persistence,
      { upsert: true, new: true }
    );
  }

  async findById(
    id: VesselVisitExecutionId
  ): Promise<VesselVisitExecution | null> {

    const doc = await VesselVisitExecutionSchema.findOne({
      domainId: id.toString()
    });

    if (!doc) return null;

    return VesselVisitExecutionMap.toDomain(doc);
  }

  async findall(): Promise<VesselVisitExecution[]> {
    const docs = await VesselVisitExecutionSchema.find({});

    return docs.map(doc => VesselVisitExecutionMap.toDomain(doc));
  }

  async findByVVN(vvnId: string): Promise<VesselVisitExecution[]> {
    const docs = await VesselVisitExecutionSchema.find({
      vvnId: vvnId
    });

    return docs.map(doc => VesselVisitExecutionMap.toDomain(doc));
  }

  async findInProgress(): Promise<VesselVisitExecution[]> {
    const docs = await VesselVisitExecutionSchema.find({
      status: 'in_progress'
    });

    return docs.map(doc => VesselVisitExecutionMap.toDomain(doc));
  }

  async exists(
    id: VesselVisitExecutionId
  ): Promise<boolean> {

    const count = await VesselVisitExecutionSchema.countDocuments({
      domainId: id.toString()
    });

    return count > 0;
  }
}
