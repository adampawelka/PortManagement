"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentTypeRepo = void 0;
const IncidentTypeSchema_1 = __importDefault(require("../persistence/schemas/IncidentTypeSchema"));
const IncidentTypeMap_1 = require("../mappers/IncidentTypeMap");
class IncidentTypeRepo {
    async save(type) {
        const persistence = IncidentTypeMap_1.IncidentTypeMap.toPersistence(type);
        await IncidentTypeSchema_1.default.findOneAndUpdate({ domainId: persistence.domainId }, persistence, { upsert: true, new: true });
    }
    async findById(id) {
        const doc = await IncidentTypeSchema_1.default.findOne({ domainId: id.toString() });
        if (!doc)
            return null;
        return IncidentTypeMap_1.IncidentTypeMap.toDomain(doc);
    }
    async findByCode(code) {
        const doc = await IncidentTypeSchema_1.default.findOne({ code });
        if (!doc)
            return null;
        return IncidentTypeMap_1.IncidentTypeMap.toDomain(doc);
    }
    async findAll() {
        const docs = await IncidentTypeSchema_1.default.find({}).sort({ name: 1 }); // opcjonalnie sortowanie
        return docs.map(doc => IncidentTypeMap_1.IncidentTypeMap.toDomain(doc));
    }
    async findByParentId(parentId) {
        const query = parentId
            ? { parentId: parentId.toString() }
            : { parentId: null };
        const docs = await IncidentTypeSchema_1.default.find(query).sort({ name: 1 });
        return docs.map(doc => IncidentTypeMap_1.IncidentTypeMap.toDomain(doc));
    }
    async exists(id) {
        const count = await IncidentTypeSchema_1.default.countDocuments({ domainId: id.toString() });
        return count > 0;
    }
}
exports.IncidentTypeRepo = IncidentTypeRepo;
//# sourceMappingURL=IncidentTypeRepo.js.map