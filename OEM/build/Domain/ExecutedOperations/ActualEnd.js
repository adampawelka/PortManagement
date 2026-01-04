"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualEnd = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
class ActualEnd extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(date) {
        return Result_1.Result.ok(new ActualEnd({ value: date }));
    }
}
exports.ActualEnd = ActualEnd;
//# sourceMappingURL=ActualEnd.js.map