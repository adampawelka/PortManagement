"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartTime = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
class StartTime extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(date) {
        const guardResult = Guard_1.Guard.againstNullOrUndefined(date, "startTime");
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        return Result_1.Result.ok(new StartTime({ value: date }));
    }
}
exports.StartTime = StartTime;
//# sourceMappingURL=StartTime.js.map