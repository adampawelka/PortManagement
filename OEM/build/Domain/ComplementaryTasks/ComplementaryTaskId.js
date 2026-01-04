"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskId = void 0;
const Entity_1 = require("../../core/domain/Entity");
class ComplementaryTaskId extends Entity_1.Entity {
    get id() {
        return this._id;
    }
    constructor(id) {
        super(null, id);
    }
    static create(id) {
        return new ComplementaryTaskId(id);
    }
}
exports.ComplementaryTaskId = ComplementaryTaskId;
//# sourceMappingURL=ComplementaryTaskId.js.map