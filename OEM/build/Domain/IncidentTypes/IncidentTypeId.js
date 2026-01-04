"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentTypeId = void 0;
const Entity_1 = require("../../core/domain/Entity");
class IncidentTypeId extends Entity_1.Entity {
    get id() {
        return this._id;
    }
    constructor(id) {
        super(null, id);
    }
    static create(id) {
        return new IncidentTypeId(id);
    }
}
exports.IncidentTypeId = IncidentTypeId;
//# sourceMappingURL=IncidentTypeId.js.map