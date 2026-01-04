"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledOperation = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
class ScheduledOperation extends ValueObject_1.ValueObject {
    get vesselName() {
        return this.props.vesselName;
    }
    get start() {
        return this.props.start;
    }
    get end() {
        return this.props.end;
    }
    get delay() {
        return this.props.delay;
    }
    get dock() {
        return this.props.dock;
    }
    get cranes() {
        return this.props.cranes;
    }
    get staff() {
        return this.props.staff;
    }
    constructor(props) {
        super(props);
    }
    static create(props) {
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk([
            { argument: props.vesselName, argumentName: "vesselName" },
            { argument: props.start, argumentName: "start" },
            { argument: props.end, argumentName: "end" },
            { argument: props.delay, argumentName: "delay" },
            { argument: props.dock, argumentName: "dock" },
        ]);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        if (!Array.isArray(props.cranes)) {
            return Result_1.Result.fail("Cranes must be an array");
        }
        if (!Array.isArray(props.staff)) {
            return Result_1.Result.fail("Staff must be an array");
        }
        if (props.start >= props.end) {
            return Result_1.Result.fail("Start time must be before end time");
        }
        if (props.delay < 0) {
            return Result_1.Result.fail("Delay cannot be negative");
        }
        return Result_1.Result.ok(new ScheduledOperation(Object.assign(Object.assign({}, props), { cranes: [...props.cranes], staff: [...props.staff] })));
    }
}
exports.ScheduledOperation = ScheduledOperation;
//# sourceMappingURL=ScheduledOperation.js.map