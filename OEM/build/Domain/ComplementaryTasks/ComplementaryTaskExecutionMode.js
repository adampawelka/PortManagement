"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskExecutionMode = exports.ComplementaryTaskExecutionModeEnum = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
var ComplementaryTaskExecutionModeEnum;
(function (ComplementaryTaskExecutionModeEnum) {
    ComplementaryTaskExecutionModeEnum["PARALLEL"] = "PARALLEL";
    ComplementaryTaskExecutionModeEnum["SUSPEND"] = "SUSPEND";
})(ComplementaryTaskExecutionModeEnum || (exports.ComplementaryTaskExecutionModeEnum = ComplementaryTaskExecutionModeEnum = {}));
class ComplementaryTaskExecutionMode extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(mode) {
        return Result_1.Result.ok(new ComplementaryTaskExecutionMode({ value: mode }));
    }
    isSuspend() {
        return this.props.value === ComplementaryTaskExecutionModeEnum.SUSPEND;
    }
}
exports.ComplementaryTaskExecutionMode = ComplementaryTaskExecutionMode;
//# sourceMappingURL=ComplementaryTaskExecutionMode.js.map