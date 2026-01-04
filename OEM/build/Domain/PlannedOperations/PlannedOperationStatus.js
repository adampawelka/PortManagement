"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannedOperationStatus = exports.PlannedOperationStatusEnum = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
var PlannedOperationStatusEnum;
(function (PlannedOperationStatusEnum) {
    PlannedOperationStatusEnum["PLANNED"] = "PLANNED";
    PlannedOperationStatusEnum["CANCELLED"] = "CANCELLED";
})(PlannedOperationStatusEnum || (exports.PlannedOperationStatusEnum = PlannedOperationStatusEnum = {}));
class PlannedOperationStatus extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(status) {
        return Result_1.Result.ok(new PlannedOperationStatus({ value: status }));
    }
}
exports.PlannedOperationStatus = PlannedOperationStatus;
//# sourceMappingURL=PlannedOperationStatus.js.map