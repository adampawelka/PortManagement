"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationPlanRepo = void 0;
const OperationPlanSchema_1 = __importDefault(require("../persistence/schemas/OperationPlanSchema"));
const OperationPlanMap_1 = require("../mappers/OperationPlanMap");
class OperationPlanRepo {
    async save(operationPlan) {
        const persistence = OperationPlanMap_1.OperationPlanMap.toPersistence(operationPlan);
        await OperationPlanSchema_1.default.findOneAndUpdate({ domainId: persistence.domainId }, persistence, { upsert: true, new: true });
    }
    async findById(id) {
        const idString = id.id.toString();
        const doc = await OperationPlanSchema_1.default.findOne({ domainId: idString });
        if (!doc)
            return null;
        return OperationPlanMap_1.OperationPlanMap.toDomain(doc);
    }
    async findByVvnId(vvnId) {
        const doc = await OperationPlanSchema_1.default.findOne({ vvnId: vvnId.value });
        if (!doc)
            return null;
        return OperationPlanMap_1.OperationPlanMap.toDomain(doc);
    }
    async findAll() {
        const docs = await OperationPlanSchema_1.default.find({});
        return docs.map(OperationPlanMap_1.OperationPlanMap.toDomain);
    }
    async findAllByVvnId(vvnId) {
        const docs = await OperationPlanSchema_1.default.find({ vvnId: vvnId.value });
        return docs.map(OperationPlanMap_1.OperationPlanMap.toDomain);
    }
    //4.1.6
    async findByOperationDateRange(from, to) {
        const docs = await OperationPlanSchema_1.default.find({
            schedule: {
                $elemMatch: {
                    start: { $lt: to },
                    end: { $gt: from }
                }
            }
        });
        return docs.map(OperationPlanMap_1.OperationPlanMap.toDomain);
    }
    async search(criteria) {
        const query = {};
        if (criteria.dateStart || criteria.dateEnd) {
            query.createdAt = {};
            if (criteria.dateStart)
                query.createdAt.$gte = criteria.dateStart;
            if (criteria.dateEnd)
                query.createdAt.$lte = criteria.dateEnd;
        }
        if (criteria.vvnId)
            query.vvnId = criteria.vvnId;
        if (criteria.operationDateStart || criteria.operationDateEnd || criteria.vesselName) {
            query.schedule = { $elemMatch: {} };
            if (criteria.operationDateStart)
                query.schedule.$elemMatch.start = { $gte: criteria.operationDateStart };
            if (criteria.operationDateEnd) {
                query.schedule.$elemMatch.start = Object.assign(Object.assign({}, query.schedule.$elemMatch.start), { $lte: criteria.operationDateEnd });
            }
            if (criteria.vesselName) {
                query.schedule.$elemMatch.vesselName = { $regex: criteria.vesselName, $options: 'i' };
            }
        }
        const docs = await OperationPlanSchema_1.default.find(query);
        return docs.map(OperationPlanMap_1.OperationPlanMap.toDomain);
    }
    async exists(id) {
        const count = await OperationPlanSchema_1.default.countDocuments({ domainId: id.toString() });
        return count > 0;
    }
}
exports.OperationPlanRepo = OperationPlanRepo;
//# sourceMappingURL=OperationPlanRepo.js.map