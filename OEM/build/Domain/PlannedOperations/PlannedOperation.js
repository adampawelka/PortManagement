"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannedOperation = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const PlannedOperationId_1 = require("./PlannedOperationId");
class PlannedOperation extends AggregateRoot_1.AggregateRoot {
    get plannedOperationId() {
        return PlannedOperationId_1.PlannedOperationId.create(this.id);
    }
    get operationPlanId() {
        return this.props.operationPlanId;
    }
    get resourceId() {
        return this.props.resourceId;
    }
    get staffId() {
        return this.props.staffId;
    }
    get plannedStart() {
        return this.props.plannedStart;
    }
    get plannedEnd() {
        return this.props.plannedEnd;
    }
    get operationType() {
        return this.props.operationType;
    }
    get status() {
        return this.props.status;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk([
            { argument: props.operationPlanId, argumentName: "operationPlanId" },
            { argument: props.resourceId, argumentName: "resourceId" },
            { argument: props.staffId, argumentName: "staffId" },
            { argument: props.plannedStart, argumentName: "plannedStart" },
            { argument: props.plannedEnd, argumentName: "plannedEnd" },
            { argument: props.operationType, argumentName: "operationType" },
            { argument: props.status, argumentName: "status" }
        ]);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        return Result_1.Result.ok(new PlannedOperation(props, id));
    }
}
exports.PlannedOperation = PlannedOperation;
//# sourceMappingURL=PlannedOperation.js.map