"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentId = void 0;
const Entity_1 = require("../../core/domain/Entity");
class IncidentId extends Entity_1.Entity {
    get id() {
        return this._id;
    }
    constructor(id) {
        super(null, id);
    }
    static create(id) {
        return new IncidentId(id);
    }
}
exports.IncidentId = IncidentId;
//# sourceMappingURL=IncidentId.js.map