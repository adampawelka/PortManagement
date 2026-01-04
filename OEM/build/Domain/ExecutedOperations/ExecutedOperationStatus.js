"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutedOperationStatus = exports.ExecutedOperationStatusEnum = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
var ExecutedOperationStatusEnum;
(function (ExecutedOperationStatusEnum) {
    ExecutedOperationStatusEnum["STARTED"] = "STARTED";
    ExecutedOperationStatusEnum["COMPLETED"] = "COMPLETED";
    ExecutedOperationStatusEnum["DELAYED"] = "DELAYED";
})(ExecutedOperationStatusEnum || (exports.ExecutedOperationStatusEnum = ExecutedOperationStatusEnum = {}));
class ExecutedOperationStatus extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(status) {
        return Result_1.Result.ok(new ExecutedOperationStatus({ value: status }));
    }
}
exports.ExecutedOperationStatus = ExecutedOperationStatus;
//# sourceMappingURL=ExecutedOperationStatus.js.map