"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentTypeMap = void 0;
const IncidentType_1 = require("../Domain/IncidentTypes/IncidentType");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class IncidentTypeMap {
    static toPersistence(type) {
        return {
            domainId: type.id.toString(),
            code: type.code.value,
            name: type.name.value,
            description: type.description.value,
            severity: type.severity.value,
            parentId: type.parentId ? type.parentId.toString() : null,
        };
    }
    static toDomain(raw) {
        const data = raw.toObject ? raw.toObject() : raw;
        const typeOrError = IncidentType_1.IncidentType.create({
            code: data.code,
            name: data.name,
            description: data.description,
            severity: data.severity,
            parentId: data.parentId ? new UniqueEntityID_1.UniqueEntityID(data.parentId) : undefined,
        }, new UniqueEntityID_1.UniqueEntityID(data.domainId));
        if (typeOrError.isFailure) {
            throw new Error(typeOrError.errorValue().toString());
        }
        return typeOrError.getValue();
    }
}
exports.IncidentTypeMap = IncidentTypeMap;
//# sourceMappingURL=IncidentTypeMap.js.map