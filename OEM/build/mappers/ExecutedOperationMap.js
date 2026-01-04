"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutedOperationMap = void 0;
const ExecutedOperation_1 = require("../Domain/ExecutedOperations/ExecutedOperation");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class ExecutedOperationMap {
    static toPersistence(operation) {
        var _a, _b;
        return {
            domainId: operation.id.toString(),
            vesselVisitExecutionId: operation.vesselVisitExecutionId.valueOf.toString(),
            plannedOperationId: operation.plannedOperationId.valueOf.toString(),
            resourceId: operation.resourceId.value,
            staffId: operation.staffId.value,
            actualStart: operation.actualStart.value,
            actualEnd: (_b = (_a = operation.actualEnd) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null,
            status: operation.status.value
        };
    }
    static toDomain(raw) {
        var _a;
        const data = raw.toObject ? raw.toObject() : raw;
        const executedOperationOrError = ExecutedOperation_1.ExecutedOperation.create({
            vesselVisitExecutionId: data.vesselVisitExecutionId,
            plannedOperationId: data.plannedOperationId,
            resourceId: data.resourceId,
            staffId: data.staffId,
            actualStart: data.actualStart,
            actualEnd: (_a = data.actualEnd) !== null && _a !== void 0 ? _a : undefined,
            status: data.status
        }, new UniqueEntityID_1.UniqueEntityID(data.domainId));
        if (executedOperationOrError.isFailure) {
            throw new Error(executedOperationOrError.errorValue().toString());
        }
        return executedOperationOrError.getValue();
    }
}
exports.ExecutedOperationMap = ExecutedOperationMap;
//# sourceMappingURL=ExecutedOperationMap.js.map