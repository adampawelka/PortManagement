"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutedOperation = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const ExecutedOperationId_1 = require("./ExecutedOperationId");
class ExecutedOperation extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get executedOperationId() {
        return ExecutedOperationId_1.ExecutedOperationId.create(this.id);
    }
    get vesselVisitExecutionId() {
        return this.props.vesselVisitExecutionId;
    }
    get plannedOperationId() {
        return this.props.plannedOperationId;
    }
    get resourceId() {
        return this.props.resourceId;
    }
    get staffId() {
        return this.props.staffId;
    }
    get actualStart() {
        return this.props.actualStart;
    }
    get actualEnd() {
        return this.props.actualEnd;
    }
    get status() {
        return this.props.status;
    }
    get operationPlanId() {
        return this.props.operationPlanId;
    }
    get syncStatus() {
        return this.props.syncStatus;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.vesselVisitExecutionId, argumentName: "vesselVisitExecutionId" },
            { argument: props.plannedOperationId, argumentName: "plannedOperationId" },
            { argument: props.resourceId, argumentName: "resourceId" },
            { argument: props.staffId, argumentName: "staffId" },
            { argument: props.actualStart, argumentName: "actualStart" },
            { argument: props.status, argumentName: "status" }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        const executedOperation = new ExecutedOperation(Object.assign({}, props), id);
        return Result_1.Result.ok(executedOperation);
    }
    updateActualStart(actualStart) {
        this.props.actualStart = actualStart;
    }
    updateActualEnd(actualEnd) {
        this.props.actualEnd = actualEnd;
    }
    updateStatus(status) {
        this.props.status = status;
    }
    markAsSynced() {
        this.props.syncStatus = "synced";
    }
    markAsPendingSync() {
        this.props.syncStatus = "pending";
    }
}
exports.ExecutedOperation = ExecutedOperation;
//# sourceMappingURL=ExecutedOperation.js.map