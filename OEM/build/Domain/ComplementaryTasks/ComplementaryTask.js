"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTask = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const ComplementaryTaskId_1 = require("./ComplementaryTaskId");
const ComplementaryTaskExecutionMode_1 = require("./ComplementaryTaskExecutionMode");
class ComplementaryTask extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get taskId() {
        return ComplementaryTaskId_1.ComplementaryTaskId.create(this.id);
    }
    get vesselVisitExecutionId() {
        return this.props.vesselVisitExecutionId;
    }
    get categoryId() {
        return this.props.categoryId;
    }
    get responsibleTeam() {
        return this.props.responsibleTeam;
    }
    get startTime() {
        return this.props.startTime;
    }
    get endTime() {
        return this.props.endTime;
    }
    get status() {
        return this.props.status;
    }
    get executionMode() {
        return this.props.executionMode;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        var _a;
        const guardedProps = [
            { argument: props.vesselVisitExecutionId, argumentName: "vesselVisitExecutionId" },
            { argument: props.categoryId, argumentName: "categoryId" },
            { argument: props.responsibleTeam, argumentName: "responsibleTeam" },
            { argument: props.startTime, argumentName: "startTime" },
            { argument: props.status, argumentName: "status" }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        const task = new ComplementaryTask(Object.assign(Object.assign({}, props), { executionMode: (_a = props.executionMode) !== null && _a !== void 0 ? _a : ComplementaryTaskExecutionMode_1.ComplementaryTaskExecutionMode.create(ComplementaryTaskExecutionMode_1.ComplementaryTaskExecutionModeEnum.PARALLEL).getValue() }), id);
        return Result_1.Result.ok(task);
    }
}
exports.ComplementaryTask = ComplementaryTask;
//# sourceMappingURL=ComplementaryTask.js.map