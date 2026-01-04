"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentMap = void 0;
const Incident_1 = require("../Domain/Incidents/Incident");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class IncidentMap {
    static toPersistence(incident) {
        var _a, _b;
        return {
            domainId: incident.id.toString(),
            incidentTypeId: incident.incidentTypeId.id.toString(),
            startTime: incident.startTime.value,
            endTime: (_b = (_a = incident.endTime) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null,
            severity: incident.severity.value,
            description: incident.description.value,
            createdBy: incident.createdBy.value
        };
    }
    static toDomain(raw) {
        var _a;
        const data = raw.toObject ? raw.toObject() : raw;
        const incidentOrError = Incident_1.Incident.create({
            incidentTypeId: data.incidentTypeId,
            startTime: data.startTime,
            endTime: (_a = data.endTime) !== null && _a !== void 0 ? _a : undefined,
            severity: data.severity,
            description: data.description,
            createdBy: data.createdBy
        }, new UniqueEntityID_1.UniqueEntityID(data.domainId));
        if (incidentOrError.isFailure) {
            throw new Error(incidentOrError.errorValue().toString());
        }
        return incidentOrError.getValue();
    }
}
exports.IncidentMap = IncidentMap;
//# sourceMappingURL=IncidentMap.js.map