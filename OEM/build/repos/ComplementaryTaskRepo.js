"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryTaskRepo = void 0;
const ComplementaryTaskSchema_1 = __importDefault(require("../persistence/schemas/ComplementaryTaskSchema"));
const ComplementaryTaskMap_1 = require("../mappers/ComplementaryTaskMap");
class ComplementaryTaskRepo {
    async save(task) {
        const persistence = ComplementaryTaskMap_1.ComplementaryTaskMap.toPersistence(task);
        await ComplementaryTaskSchema_1.default.findOneAndUpdate({ domainId: persistence.domainId }, persistence, { upsert: true, new: true });
    }
    async findById(id) {
        const doc = await ComplementaryTaskSchema_1.default.findOne({
            domainId: id.toString()
        });
        if (!doc)
            return null;
        return ComplementaryTaskMap_1.ComplementaryTaskMap.toDomain(doc);
    }
    async findByVesselVisitExecutionId(vesselVisitExecutionId) {
        const docs = await ComplementaryTaskSchema_1.default.find({
            vesselVisitExecutionId: vesselVisitExecutionId.toString()
        });
        return docs.map(doc => ComplementaryTaskMap_1.ComplementaryTaskMap.toDomain(doc));
    }
    async findall() {
        const docs = await ComplementaryTaskSchema_1.default.find();
        return docs.map(doc => ComplementaryTaskMap_1.ComplementaryTaskMap.toDomain(doc));
    }
    async exists(id) {
        const count = await ComplementaryTaskSchema_1.default.countDocuments({
            domainId: id.toString()
        });
        return count > 0;
    }
}
exports.ComplementaryTaskRepo = ComplementaryTaskRepo;
//# sourceMappingURL=ComplementaryTaskRepo.js.map