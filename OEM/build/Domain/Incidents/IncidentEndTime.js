"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentEndTime = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
class IncidentEndTime extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(date) {
        return Result_1.Result.ok(new IncidentEndTime({ value: date }));
    }
}
exports.IncidentEndTime = IncidentEndTime;
//# sourceMappingURL=IncidentEndTime.js.map