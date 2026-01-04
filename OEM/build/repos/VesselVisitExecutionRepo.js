"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VesselVisitExecutionRepo = void 0;
const VesselVisitExecutionSchema_1 = __importDefault(require("../persistence/schemas/VesselVisitExecutionSchema"));
const VesselVisitExecutionMap_1 = require("../mappers/VesselVisitExecutionMap");
class VesselVisitExecutionRepo {
    async save(vve) {
        const persistence = VesselVisitExecutionMap_1.VesselVisitExecutionMap.toPersistence(vve);
        await VesselVisitExecutionSchema_1.default.findOneAndUpdate({ domainId: persistence.domainId }, persistence, { upsert: true, new: true });
    }
    async findById(id) {
        const idString = id.id.toString();
        console.log(`[VesselVisitExecutionRepo] findById called with:`, idString);
        const doc = await VesselVisitExecutionSchema_1.default.findOne({
            domainId: idString
        });
        console.log(`[VesselVisitExecutionRepo] Found document:`, doc ? "Yes" : "No");
        if (doc) {
            console.log(`[VesselVisitExecutionRepo] Document domainId:`, doc.domainId);
        }
        if (!doc)
            return null;
        return VesselVisitExecutionMap_1.VesselVisitExecutionMap.toDomain(doc);
    }
    async findAll() {
        const docs = await VesselVisitExecutionSchema_1.default.find({});
        return docs.map(doc => VesselVisitExecutionMap_1.VesselVisitExecutionMap.toDomain(doc));
    }
    async findByVVN(vvnId) {
        const docs = await VesselVisitExecutionSchema_1.default.find({
            vvnId: vvnId
        });
        return docs.map(doc => VesselVisitExecutionMap_1.VesselVisitExecutionMap.toDomain(doc));
    }
    async findInProgress() {
        const docs = await VesselVisitExecutionSchema_1.default.find({
            status: 'in_progress'
        });
        return docs.map(doc => VesselVisitExecutionMap_1.VesselVisitExecutionMap.toDomain(doc));
    }
    async exists(id) {
        const count = await VesselVisitExecutionSchema_1.default.countDocuments({
            domainId: id.toString()
        });
        return count > 0;
    }
}
exports.VesselVisitExecutionRepo = VesselVisitExecutionRepo;
//# sourceMappingURL=VesselVisitExecutionRepo.js.map