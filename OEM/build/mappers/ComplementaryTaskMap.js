"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskMap = void 0;
const ComplementaryTask_1 = require("../Domain/ComplementaryTasks/ComplementaryTask");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class ComplementaryTaskMap {
    static toPersistence(task) {
        var _a, _b;
        return {
            domainId: task.id.toString(),
            vesselVisitExecutionId: task.vesselVisitExecutionId.id.toString(),
            categoryId: task.categoryId.id.toString(),
            responsibleTeam: task.responsibleTeam.value,
            startTime: task.startTime.value,
            endTime: (_b = (_a = task.endTime) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null,
            status: task.status.value,
            executionMode: task.executionMode.value
        };
    }
    static toDomain(raw) {
        var _a;
        const data = raw.toObject ? raw.toObject() : raw;
        const taskOrError = ComplementaryTask_1.ComplementaryTask.create({
            vesselVisitExecutionId: data.vesselVisitExecutionId,
            categoryId: data.categoryId,
            responsibleTeam: data.responsibleTeam,
            startTime: data.startTime,
            endTime: (_a = data.endTime) !== null && _a !== void 0 ? _a : undefined,
            status: data.status,
            executionMode: data.executionMode
        }, new UniqueEntityID_1.UniqueEntityID(data.domainId));
        if (taskOrError.isFailure) {
            throw new Error(taskOrError.errorValue().toString());
        }
        return taskOrError.getValue();
    }
}
exports.ComplementaryTaskMap = ComplementaryTaskMap;
//# sourceMappingURL=ComplementaryTaskMap.js.map