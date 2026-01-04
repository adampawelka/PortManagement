"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorithmUsed = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
class AlgorithmUsed extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(algorithm) {
        const guardResult = Guard_1.Guard.againstNullOrUndefined(algorithm, "algorithmUsed");
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        return Result_1.Result.ok(new AlgorithmUsed({ value: algorithm }));
    }
}
exports.AlgorithmUsed = AlgorithmUsed;
//# sourceMappingURL=AlgorithmUsed.js.map