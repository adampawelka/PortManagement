"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannedOperationId = void 0;
const Entity_1 = require("../../core/domain/Entity");
class PlannedOperationId extends Entity_1.Entity {
    get id() {
        return this._id;
    }
    constructor(id) {
        super(null, id);
    }
    static create(id) {
        return new PlannedOperationId(id);
    }
}
exports.PlannedOperationId = PlannedOperationId;
//# sourceMappingURL=PlannedOperationId.js.map