"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationPlanMap = void 0;
const OperationPlan_1 = require("../Domain/OperationPlans/OperationPlan");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const ScheduledOperation_1 = require("../Domain/OperationPlans/ScheduledOperation");
const VvnId_1 = require("../Domain/VesselVisitExecutions/VvnId");
const CreatedAt_1 = require("../Domain/OperationPlans/CreatedAt");
const CreatedBy_1 = require("../Domain/OperationPlans/CreatedBy");
const AlgorithmUsed_1 = require("../Domain/OperationPlans/AlgorithmUsed");
class OperationPlanMap {
    static toPersistence(operationPlan) {
        return {
            domainId: operationPlan.id.toString(),
            vvnId: operationPlan.props.vvnId.value,
            createdAt: operationPlan.props.createdAt.value,
            createdBy: operationPlan.props.createdBy.value,
            algorithmUsed: operationPlan.props.algorithmUsed.value,
            schedule: operationPlan.props.schedule.map(op => ({
                vesselName: op.vesselName,
                start: op.start,
                end: op.end,
                delay: op.delay,
                dock: op.dock,
                cranes: op.cranes,
                staff: op.staff
            }))
        };
    }
    static toDomain(raw) {
        const schedule = (raw.schedule || []).map((op) => {
            const scheduledOpOrError = ScheduledOperation_1.ScheduledOperation.create({
                vesselName: op.vesselName,
                start: new Date(op.start),
                end: new Date(op.end),
                delay: op.delay,
                dock: op.dock,
                cranes: Array.isArray(op.cranes) ? op.cranes : [],
                staff: Array.isArray(op.staff) ? op.staff : []
            });
            if (scheduledOpOrError.isFailure) {
                throw new Error("Invalid ScheduledOperation data");
            }
            return scheduledOpOrError.getValue();
        });
        const vvnIdOrError = VvnId_1.VvnId.create(raw.vvnId);
        const createdAtOrError = CreatedAt_1.CreatedAt.create(raw.createdAt);
        const createdByOrError = CreatedBy_1.CreatedBy.create(raw.createdBy);
        const algorithmUsedOrError = AlgorithmUsed_1.AlgorithmUsed.create(raw.algorithmUsed);
        if (vvnIdOrError.isFailure ||
            createdAtOrError.isFailure ||
            createdByOrError.isFailure ||
            algorithmUsedOrError.isFailure) {
            throw new Error("Invalid OperationPlan persistence data");
        }
        const operationPlanOrError = OperationPlan_1.OperationPlan.create({
            vvnId: vvnIdOrError.getValue(),
            createdAt: createdAtOrError.getValue(),
            createdBy: createdByOrError.getValue(),
            algorithmUsed: algorithmUsedOrError.getValue(),
            schedule
        }, new UniqueEntityID_1.UniqueEntityID(raw.domainId));
        if (operationPlanOrError.isFailure) {
            throw new Error("Invalid OperationPlan data");
        }
        return operationPlanOrError.getValue();
    }
}
exports.OperationPlanMap = OperationPlanMap;
//# sourceMappingURL=OperationPlanMap.js.map