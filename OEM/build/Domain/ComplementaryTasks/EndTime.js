"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndTime = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
class EndTime extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(date) {
        return Result_1.Result.ok(new EndTime({ value: date }));
    }
}
exports.EndTime = EndTime;
//# sourceMappingURL=EndTime.js.map