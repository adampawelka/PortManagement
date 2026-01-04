"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskCategoryId = void 0;
const Entity_1 = require("../../core/domain/Entity");
class ComplementaryTaskCategoryId extends Entity_1.Entity {
    get id() {
        return this._id;
    }
    constructor(id) {
        super(null, id);
    }
    static create(id) {
        return new ComplementaryTaskCategoryId(id);
    }
}
exports.ComplementaryTaskCategoryId = ComplementaryTaskCategoryId;
//# sourceMappingURL=ComplementaryTaskCategoryId.js.map