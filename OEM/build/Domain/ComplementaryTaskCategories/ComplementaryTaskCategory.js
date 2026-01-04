"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskCategory = void 0;
const AggregateRoot_1 = require("../../core/domain/AggregateRoot");
const Result_1 = require("../../core/logic/Result");
const Guard_1 = require("../../core/logic/Guard");
const ComplementaryTaskCategoryId_1 = require("./ComplementaryTaskCategoryId");
class ComplementaryTaskCategory extends AggregateRoot_1.AggregateRoot {
    get id() {
        return this._id;
    }
    get categoryId() {
        return ComplementaryTaskCategoryId_1.ComplementaryTaskCategoryId.create(this.id);
    }
    get code() {
        return this.props.code;
    }
    get name() {
        return this.props.name;
    }
    get description() {
        return this.props.description;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardedProps = [
            { argument: props.code, argumentName: "code" },
            { argument: props.name, argumentName: "name" },
            { argument: props.description, argumentName: "description" }
        ];
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk(guardedProps);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        const category = new ComplementaryTaskCategory(Object.assign({}, props), id);
        return Result_1.Result.ok(category);
    }
}
exports.ComplementaryTaskCategory = ComplementaryTaskCategory;
//# sourceMappingURL=ComplementaryTaskCategory.js.map