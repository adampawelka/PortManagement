"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutedOperationId = void 0;
const Entity_1 = require("../../core/domain/Entity");
class ExecutedOperationId extends Entity_1.Entity {
    get id() {
        return this._id;
    }
    constructor(id) {
        super(null, id);
    }
    static create(id) {
        return new ExecutedOperationId(id);
    }
}
exports.ExecutedOperationId = ExecutedOperationId;
//# sourceMappingURL=ExecutedOperationId.js.map