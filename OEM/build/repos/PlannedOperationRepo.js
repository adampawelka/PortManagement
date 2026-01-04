"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannedOperationRepo = void 0;
const PlannedOperationSchema_1 = __importDefault(require("../persistence/schemas/PlannedOperationSchema"));
const PlannedOperationMap_1 = require("../mappers/PlannedOperationMap");
class PlannedOperationRepo {
    async save(operation) {
        const persistence = PlannedOperationMap_1.PlannedOperationMap.toPersistence(operation);
        await PlannedOperationSchema_1.default.findOneAndUpdate({ domainId: persistence.domainId }, persistence, { upsert: true, new: true });
    }
    async findById(id) {
        const doc = await PlannedOperationSchema_1.default.findOne({
            domainId: id.toString()
        });
        if (!doc)
            return null;
        return PlannedOperationMap_1.PlannedOperationMap.toDomain(doc);
    }
    async findByOperationPlanId(operationPlanId) {
        const docs = await PlannedOperationSchema_1.default.find({
            operationPlanId: operationPlanId.toString()
        });
        return docs.map(doc => PlannedOperationMap_1.PlannedOperationMap.toDomain(doc));
    }
    async findAll() {
        const docs = await PlannedOperationSchema_1.default.find({});
        return docs.map(doc => PlannedOperationMap_1.PlannedOperationMap.toDomain(doc));
    }
    async exists(id) {
        const count = await PlannedOperationSchema_1.default.countDocuments({
            domainId: id.toString()
        });
        return count > 0;
    }
}
exports.PlannedOperationRepo = PlannedOperationRepo;
//# sourceMappingURL=PlannedOperationRepo.js.map