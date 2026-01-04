"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VvnId = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
class VvnId extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(id) {
        const guardResult = Guard_1.Guard.againstNullOrUndefined(id, "vvnId");
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        return Result_1.Result.ok(new VvnId({ value: id }));
    }
}
exports.VvnId = VvnId;
//# sourceMappingURL=VvnId.js.map