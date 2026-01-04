"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutedOperationRepo = void 0;
const ExecutedOperationSchema_1 = __importDefault(require("../persistence/schemas/ExecutedOperationSchema"));
const ExecutedOperationMap_1 = require("../mappers/ExecutedOperationMap");
class ExecutedOperationRepo {
    async save(operation) {
        const persistence = ExecutedOperationMap_1.ExecutedOperationMap.toPersistence(operation);
        await ExecutedOperationSchema_1.default.findOneAndUpdate({ domainId: persistence.domainId }, persistence, { upsert: true, new: true });
    }
    async findById(id) {
        const doc = await ExecutedOperationSchema_1.default.findOne({
            domainId: id.toString()
        });
        if (!doc)
            return null;
        return ExecutedOperationMap_1.ExecutedOperationMap.toDomain(doc);
    }
    async findByVesselVisitExecutionId(vesselVisitExecutionId) {
        const docs = await ExecutedOperationSchema_1.default.find({
            vesselVisitExecutionId: vesselVisitExecutionId
        });
        return docs.map(doc => ExecutedOperationMap_1.ExecutedOperationMap.toDomain(doc));
    }
    async findAll() {
        const docs = await ExecutedOperationSchema_1.default.find({});
        return docs.map(doc => ExecutedOperationMap_1.ExecutedOperationMap.toDomain(doc));
    }
    async exists(id) {
        const count = await ExecutedOperationSchema_1.default.countDocuments({
            domainId: id.toString()
        });
        return count > 0;
    }
}
exports.ExecutedOperationRepo = ExecutedOperationRepo;
//# sourceMappingURL=ExecutedOperationRepo.js.map