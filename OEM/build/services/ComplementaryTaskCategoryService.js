"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskCategoryService = void 0;
const ComplementaryTaskCategory_1 = require("../Domain/ComplementaryTaskCategories/ComplementaryTaskCategory");
const ComplementaryTaskCategoryCode_1 = require("../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryCode");
const ComplementaryTaskCategoryName_1 = require("../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryName");
const ComplementaryTaskCategoryDescription_1 = require("../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryDescription");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
const ComplementaryTaskCategoryId_1 = require("../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryId");
class ComplementaryTaskCategoryService {
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async create(dto) {
        const existing = await this.categoryRepo.findByCode(dto.code);
        if (existing) {
            throw new Error("ComplementaryTaskCategory with this code already exists");
        }
        const code = ComplementaryTaskCategoryCode_1.ComplementaryTaskCategoryCode.create(dto.code).getValue();
        const name = ComplementaryTaskCategoryName_1.ComplementaryTaskCategoryName.create(dto.name).getValue();
        const description = ComplementaryTaskCategoryDescription_1.ComplementaryTaskCategoryDescription.create(dto.description).getValue();
        const categoryOrError = ComplementaryTaskCategory_1.ComplementaryTaskCategory.create({
            code,
            name,
            description
        });
        if (categoryOrError.isFailure) {
            throw new Error(categoryOrError.errorValue().toString());
        }
        const category = categoryOrError.getValue();
        await this.categoryRepo.save(category);
        return this.toDTO(category);
    }
    async getById(id) {
        const categoryId = ComplementaryTaskCategoryId_1.ComplementaryTaskCategoryId.create(new UniqueEntityID_1.UniqueEntityID(id));
        const category = await this.categoryRepo.findById(categoryId);
        if (!category)
            return null;
        return this.toDTO(category);
    }
    async getByCode(code) {
        const category = await this.categoryRepo.findByCode(code);
        if (!category)
            return null;
        return this.toDTO(category);
    }
    async getAll() {
        const categories = await this.categoryRepo.findAll();
        return categories.map(category => this.toDTO(category));
    }
    toDTO(category) {
        return {
            id: category.id.toString(),
            code: category.code.value,
            name: category.name.value,
            description: category.description.value
        };
    }
}
exports.ComplementaryTaskCategoryService = ComplementaryTaskCategoryService;
//# sourceMappingURL=ComplementaryTaskCategoryService.js.map