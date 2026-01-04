"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualUnberthTime = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
class ActualUnberthTime extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(date) {
        return Result_1.Result.ok(new ActualUnberthTime({ value: date }));
    }
}
exports.ActualUnberthTime = ActualUnberthTime;
//# sourceMappingURL=ActualUnberthTime.js.map