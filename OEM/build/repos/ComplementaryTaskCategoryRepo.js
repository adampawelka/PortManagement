"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskCategoryRepo = void 0;
const ComplementaryTaskCategorySchema_1 = __importDefault(require("../persistence/schemas/ComplementaryTaskCategorySchema"));
const ComplementaryTaskCategoryMap_1 = require("../mappers/ComplementaryTaskCategoryMap");
class ComplementaryTaskCategoryRepo {
    async save(category) {
        const persistence = ComplementaryTaskCategoryMap_1.ComplementaryTaskCategoryMap.toPersistence(category);
        await ComplementaryTaskCategorySchema_1.default.findOneAndUpdate({ domainId: persistence.domainId }, persistence, { upsert: true, new: true });
    }
    async findById(id) {
        const doc = await ComplementaryTaskCategorySchema_1.default.findOne({
            domainId: id.toString()
        });
        if (!doc)
            return null;
        return ComplementaryTaskCategoryMap_1.ComplementaryTaskCategoryMap.toDomain(doc);
    }
    async findByCode(code) {
        const doc = await ComplementaryTaskCategorySchema_1.default.findOne({ code });
        if (!doc)
            return null;
        return ComplementaryTaskCategoryMap_1.ComplementaryTaskCategoryMap.toDomain(doc);
    }
    async findAll() {
        const docs = await ComplementaryTaskCategorySchema_1.default.find();
        return docs.map(doc => ComplementaryTaskCategoryMap_1.ComplementaryTaskCategoryMap.toDomain(doc));
    }
    async exists(id) {
        const count = await ComplementaryTaskCategorySchema_1.default.countDocuments({
            domainId: id.toString()
        });
        return count > 0;
    }
}
exports.ComplementaryTaskCategoryRepo = ComplementaryTaskCategoryRepo;
//# sourceMappingURL=ComplementaryTaskCategoryRepo.js.map