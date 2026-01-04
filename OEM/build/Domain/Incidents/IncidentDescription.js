"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentDescription = void 0;
const ValueObject_1 = require("../../core/domain/ValueObject");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
class IncidentDescription extends ValueObject_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(description) {
        const guardResult = Guard_1.Guard.againstNullOrUndefined(description, "description");
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        return Result_1.Result.ok(new IncidentDescription({ value: description }));
    }
}
exports.IncidentDescription = IncidentDescription;
//# sourceMappingURL=IncidentDescription.js.map