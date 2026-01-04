"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskStatus = exports.ComplementaryTaskStatusEnum = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
var ComplementaryTaskStatusEnum;
(function (ComplementaryTaskStatusEnum) {
    ComplementaryTaskStatusEnum["ONGOING"] = "ONGOING";
    ComplementaryTaskStatusEnum["COMPLETED"] = "COMPLETED";
})(ComplementaryTaskStatusEnum || (exports.ComplementaryTaskStatusEnum = ComplementaryTaskStatusEnum = {}));
class ComplementaryTaskStatus extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(status) {
        return Result_1.Result.ok(new ComplementaryTaskStatus({ value: status }));
    }
}
exports.ComplementaryTaskStatus = ComplementaryTaskStatus;
//# sourceMappingURL=ComplementaryTaskStatus.js.map