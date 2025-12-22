import { IPlannedOperationRepo } from "../services/IRepos/IPlannedOperationRepo";

import { PlannedOperation } from "../Domain/PlannedOperations/PlannedOperation";
import { PlannedOperationId } from "../Domain/PlannedOperations/PlannedOperationId";
import { OperationPlanId } from "../Domain/OperationPlans/OperationPlanId";

import PlannedOperationSchema from "../persistence/schemas/PlannedOperationSchema";
import { PlannedOperationMap } from "../mappers/PlannedOperationMap";

export class PlannedOperationRepo implements IPlannedOperationRepo {

    async save(operation: PlannedOperation): Promise<void> {
        const persistence = PlannedOperationMap.toPersistence(operation);

        await PlannedOperationSchema.findOneAndUpdate(
            { domainId: persistence.domainId },
            persistence,
            { upsert: true, new: true }
        );
    }

    async findById(
        id: PlannedOperationId
    ): Promise<PlannedOperation | null> {

        const doc = await PlannedOperationSchema.findOne({
            domainId: id.toString()
        });

        if (!doc) return null;

        return PlannedOperationMap.toDomain(doc);
    }

    async findByOperationPlanId(
        operationPlanId: OperationPlanId
    ): Promise<PlannedOperation[]> {

        const docs = await PlannedOperationSchema.find({
            operationPlanId: operationPlanId.toString()
        });

        return docs.map(doc => PlannedOperationMap.toDomain(doc));
    }

    async findAll(): Promise<PlannedOperation[]> {
        const docs = await PlannedOperationSchema.find({});
        return docs.map(doc => PlannedOperationMap.toDomain(doc));
    }

    async exists(
        id: PlannedOperationId
    ): Promise<boolean> {

        const count = await PlannedOperationSchema.countDocuments({
            domainId: id.toString()
        });

        return count > 0;
    }
}
