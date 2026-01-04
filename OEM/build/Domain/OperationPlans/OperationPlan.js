"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationPlan = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const OperationPlanId_1 = require("./OperationPlanId");
class OperationPlan extends AggregateRoot_1.AggregateRoot {
    get operationPlanId() {
        return OperationPlanId_1.OperationPlanId.create(this.id);
    }
    get vvnId() {
        return this.props.vvnId;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get createdBy() {
        return this.props.createdBy;
    }
    get algorithmUsed() {
        return this.props.algorithmUsed;
    }
    get schedule() {
        return this.props.schedule;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk([
            { argument: props.vvnId, argumentName: "vvnId" },
            { argument: props.createdAt, argumentName: "createdAt" },
            { argument: props.createdBy, argumentName: "createdBy" },
            { argument: props.algorithmUsed, argumentName: "algorithmUsed" },
            { argument: props.schedule, argumentName: "schedule" },
        ]);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        if (!Array.isArray(props.schedule) || props.schedule.length === 0) {
            return Result_1.Result.fail("Schedule must be a non-empty array of ScheduledOperation");
        }
        return Result_1.Result.ok(new OperationPlan(props, id));
    }
}
exports.OperationPlan = OperationPlan;
//# sourceMappingURL=OperationPlan.js.map