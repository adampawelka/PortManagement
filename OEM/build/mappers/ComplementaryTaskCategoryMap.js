"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskCategoryMap = void 0;
const ComplementaryTaskCategory_1 = require("../Domain/ComplementaryTaskCategories/ComplementaryTaskCategory");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const ComplementaryTaskCategoryCode_1 = require("../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryCode");
const ComplementaryTaskCategoryName_1 = require("../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryName");
const ComplementaryTaskCategoryDescription_1 = require("../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryDescription");
class ComplementaryTaskCategoryMap {
    static toPersistence(category) {
        return {
            domainId: category.id.toString(),
            code: category.code.value,
            name: category.name.value,
            description: category.description.value
        };
    }
    static toDomain(raw) {
        const data = raw.toObject ? raw.toObject() : raw;
        const code = ComplementaryTaskCategoryCode_1.ComplementaryTaskCategoryCode.create(data.code).getValue();
        const name = ComplementaryTaskCategoryName_1.ComplementaryTaskCategoryName.create(data.name).getValue();
        const description = ComplementaryTaskCategoryDescription_1.ComplementaryTaskCategoryDescription.create(data.description).getValue();
        const categoryOrError = ComplementaryTaskCategory_1.ComplementaryTaskCategory.create({
            code,
            name,
            description
        }, new UniqueEntityID_1.UniqueEntityID(data.domainId));
        if (categoryOrError.isFailure) {
            throw new Error(categoryOrError.errorValue().toString());
        }
        return categoryOrError.getValue();
    }
}
exports.ComplementaryTaskCategoryMap = ComplementaryTaskCategoryMap;
//# sourceMappingURL=ComplementaryTaskCategoryMap.js.map