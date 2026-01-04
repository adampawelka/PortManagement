"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationPlanId = void 0;
const Entity_1 = require("../../core/domain/Entity");
class OperationPlanId extends Entity_1.Entity {
    get id() {
        return this._id;
    }
    constructor(id) {
        super(null, id);
    }
    static create(id) {
        return new OperationPlanId(id);
    }
}
exports.OperationPlanId = OperationPlanId;
//# sourceMappingURL=OperationPlanId.js.map