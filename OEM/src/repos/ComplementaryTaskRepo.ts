import { IComplementaryTaskRepo } from "../services/IRepos/IComplementaryTaskRepo";

import { ComplementaryTask } from "../domain/ComplementaryTasks/ComplementaryTask";
import { ComplementaryTaskId } from "../domain/ComplementaryTasks/ComplementaryTaskId";
import { VesselVisitExecutionId } from "../domain/VesselVisitExecutions/VesselVisitExecutionId";

import ComplementaryTaskSchema from "../persistence/schemas/ComplementaryTaskSchema";
import { ComplementaryTaskMap } from "../mappers/ComplementaryTaskMap";

export class ComplementaryTaskRepo implements IComplementaryTaskRepo {

  async save(task: ComplementaryTask): Promise<void> {
    const persistence = ComplementaryTaskMap.toPersistence(task);

    await ComplementaryTaskSchema.findOneAndUpdate(
      { domainId: persistence.domainId },
      persistence,
      { upsert: true, new: true }
    );
  }

  async findById(
    id: ComplementaryTaskId
  ): Promise<ComplementaryTask | null> {

    const doc = await ComplementaryTaskSchema.findOne({
      domainId: id.toString()
    });

    if (!doc) return null;

    return ComplementaryTaskMap.toDomain(doc);
  }

  async findByVesselVisitExecutionId(
    vesselVisitExecutionId: VesselVisitExecutionId
  ): Promise<ComplementaryTask[]> {

    const docs = await ComplementaryTaskSchema.find({
      vesselVisitExecutionId: vesselVisitExecutionId.toString()
    });

    return docs.map(doc => ComplementaryTaskMap.toDomain(doc));
  }

  async findall(): Promise<ComplementaryTask[]> {
    const docs = await ComplementaryTaskSchema.find();

    return docs.map(doc => ComplementaryTaskMap.toDomain(doc));
  }

  async exists(
    id: ComplementaryTaskId
  ): Promise<boolean> {

    const count = await ComplementaryTaskSchema.countDocuments({
      domainId: id.toString()
    });

    return count > 0;
  }
}
