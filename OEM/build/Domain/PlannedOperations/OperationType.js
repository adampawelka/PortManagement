"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationType = exports.OperationTypeEnum = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
var OperationTypeEnum;
(function (OperationTypeEnum) {
    OperationTypeEnum["LOADING"] = "LOADING";
    OperationTypeEnum["UNLOADING"] = "UNLOADING";
})(OperationTypeEnum || (exports.OperationTypeEnum = OperationTypeEnum = {}));
class OperationType extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(type) {
        return Result_1.Result.ok(new OperationType({ value: type }));
    }
}
exports.OperationType = OperationType;
//# sourceMappingURL=OperationType.js.map