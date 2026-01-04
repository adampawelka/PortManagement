"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannedOperationMap = void 0;
const PlannedOperation_1 = require("../Domain/PlannedOperations/PlannedOperation");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class PlannedOperationMap {
    static toPersistence(operation) {
        return {
            domainId: operation.id.toString(),
            operationPlanId: operation.operationPlanId.id.toString(),
            resourceId: operation.resourceId.value,
            staffId: operation.staffId.value,
            plannedStart: operation.plannedStart.value,
            plannedEnd: operation.plannedEnd.value,
            operationType: operation.operationType.value,
            status: operation.status.value
        };
    }
    static toDomain(raw) {
        const data = raw.toObject ? raw.toObject() : raw;
        const operationOrError = PlannedOperation_1.PlannedOperation.create({
            operationPlanId: data.operationPlanId,
            resourceId: data.resourceId,
            staffId: data.staffId,
            plannedStart: data.plannedStart,
            plannedEnd: data.plannedEnd,
            operationType: data.operationType,
            status: data.status
        }, new UniqueEntityID_1.UniqueEntityID(data.domainId));
        if (operationOrError.isFailure) {
            throw new Error(operationOrError.errorValue().toString());
        }
        return operationOrError.getValue();
    }
}
exports.PlannedOperationMap = PlannedOperationMap;
//# sourceMappingURL=PlannedOperationMap.js.map