"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceId = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
class ResourceId extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(id) {
        const guardResult = Guard_1.Guard.againstNullOrUndefined(id, "resourceId");
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        return Result_1.Result.ok(new ResourceId({ value: id }));
    }
}
exports.ResourceId = ResourceId;
//# sourceMappingURL=ResourceId.js.map