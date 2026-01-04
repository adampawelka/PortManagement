"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VesselVisitExecutionId = void 0;
const Entity_1 = require("../../core/domain/Entity");
class VesselVisitExecutionId extends Entity_1.Entity {
    get id() {
        return this._id;
    }
    constructor(id) {
        super(null, id);
    }
    static create(id) {
        return new VesselVisitExecutionId(id);
    }
}
exports.VesselVisitExecutionId = VesselVisitExecutionId;
//# sourceMappingURL=VesselVisitExecutionId.js.map