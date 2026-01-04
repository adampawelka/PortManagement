"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentRepo = void 0;
const IncidentSchema_1 = __importDefault(require("../persistence/schemas/IncidentSchema"));
const IncidentMap_1 = require("../mappers/IncidentMap");
class IncidentRepo {
    async save(incident) {
        const persistence = IncidentMap_1.IncidentMap.toPersistence(incident);
        await IncidentSchema_1.default.findOneAndUpdate({ domainId: persistence.domainId }, persistence, { upsert: true, new: true });
    }
    async findById(id) {
        const doc = await IncidentSchema_1.default.findOne({
            domainId: id.toString()
        });
        if (!doc)
            return null;
        return IncidentMap_1.IncidentMap.toDomain(doc);
    }
    async findByIncidentType(incidentTypeId) {
        const docs = await IncidentSchema_1.default.find({
            incidentTypeId: incidentTypeId.toString()
        });
        return docs.map(doc => IncidentMap_1.IncidentMap.toDomain(doc));
    }
    async findAll() {
        const docs = await IncidentSchema_1.default.find({});
        return docs.map(doc => IncidentMap_1.IncidentMap.toDomain(doc));
    }
    async exists(id) {
        const count = await IncidentSchema_1.default.countDocuments({
            domainId: id.toString()
        });
        return count > 0;
    }
}
exports.IncidentRepo = IncidentRepo;
//# sourceMappingURL=IncidentRepo.js.map