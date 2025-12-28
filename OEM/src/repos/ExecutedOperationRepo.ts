import { IExecutedOperationRepo } from "../services/IRepos/IExecutedOperationRepo";
import { ExecutedOperation } from "../Domain/ExecutedOperations/ExecutedOperation";
import { ExecutedOperationId } from "../Domain/ExecutedOperations/ExecutedOperationId";

import ExecutedOperationSchema from "../persistence/schemas/ExecutedOperationSchema";
import { ExecutedOperationMap } from "../mappers/ExecutedOperationMap";

export class ExecutedOperationRepo implements IExecutedOperationRepo {

  async save(operation: ExecutedOperation): Promise<void> {
    const persistence = ExecutedOperationMap.toPersistence(operation);

    await ExecutedOperationSchema.findOneAndUpdate(
      { domainId: persistence.domainId },
      persistence,
      { upsert: true, new: true }
    );
  }

  async findById(id: ExecutedOperationId): Promise<ExecutedOperation | null> {
    const doc = await ExecutedOperationSchema.findOne({
      domainId: id.toString()
    });

    if (!doc) return null;

    return ExecutedOperationMap.toDomain(doc);
  }

  async findByVesselVisitExecutionId(vesselVisitExecutionId: string): Promise<ExecutedOperation[]> {
    const docs = await ExecutedOperationSchema.find({
      vesselVisitExecutionId: vesselVisitExecutionId
    });

    return docs.map(doc => ExecutedOperationMap.toDomain(doc));
  }

  async findAll(): Promise<ExecutedOperation[]> {
    const docs = await ExecutedOperationSchema.find({});
    return docs.map(doc => ExecutedOperationMap.toDomain(doc));
  }

  async exists(id: ExecutedOperationId): Promise<boolean> {
    const count = await ExecutedOperationSchema.countDocuments({
      domainId: id.toString()
    });

    return count > 0;
  }
}
