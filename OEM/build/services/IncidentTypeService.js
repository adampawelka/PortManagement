"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentTypeService = void 0;
const IncidentType_1 = require("../Domain/IncidentTypes/IncidentType");
const IncidentTypeId_1 = require("../Domain/IncidentTypes/IncidentTypeId");
const IncidentTypeCode_1 = require("../Domain/IncidentTypes/IncidentTypeCode");
const IncidentTypeName_1 = require("../Domain/IncidentTypes/IncidentTypeName");
const IncidentTypeDescription_1 = require("../Domain/IncidentTypes/IncidentTypeDescription");
const IncidentSeverity_1 = require("../Domain/Incidents/IncidentSeverity");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class IncidentTypeService {
    constructor(incidentTypeRepo) {
        this.incidentTypeRepo = incidentTypeRepo;
    }
    async create(dto) {
        const severityEnum = this.parseSeverity(dto.severity);
        const existing = await this.incidentTypeRepo.findByCode(dto.code);
        if (existing)
            throw new Error(`IncidentType code "${dto.code}" already exists.`);
        let parentId;
        let parentName;
        if (dto.parentId) {
            const parent = await this.incidentTypeRepo.findById(IncidentTypeId_1.IncidentTypeId.create(new UniqueEntityID_1.UniqueEntityID(dto.parentId)));
            if (!parent)
                throw new Error(`Parent IncidentType with id ${dto.parentId} not found`);
            parentId = IncidentTypeId_1.IncidentTypeId.create(parent.id);
            parentName = parent.name.value;
        }
        const typeOrError = IncidentType_1.IncidentType.create({
            code: IncidentTypeCode_1.IncidentTypeCode.create(dto.code).getValue(),
            name: IncidentTypeName_1.IncidentTypeName.create(dto.name).getValue(),
            description: IncidentTypeDescription_1.IncidentTypeDescription.create(dto.description).getValue(),
            severity: IncidentSeverity_1.IncidentSeverity.create(severityEnum).getValue(),
            parentId: parentId === null || parentId === void 0 ? void 0 : parentId.id
        });
        if (typeOrError.isFailure)
            throw new Error(typeOrError.errorValue().toString());
        const type = typeOrError.getValue();
        await this.incidentTypeRepo.save(type);
        return this.toDTO(type, parentName);
    }
    async getById(id) {
        const type = await this.incidentTypeRepo.findById(IncidentTypeId_1.IncidentTypeId.create(new UniqueEntityID_1.UniqueEntityID(id)));
        if (!type)
            return null;
        let parentName;
        if (type.parentId) {
            const parent = await this.incidentTypeRepo.findById(IncidentTypeId_1.IncidentTypeId.create(type.parentId));
            parentName = parent === null || parent === void 0 ? void 0 : parent.name.value;
        }
        return this.toDTO(type, parentName);
    }
    async getByCode(code) {
        const type = await this.incidentTypeRepo.findByCode(code);
        if (!type)
            return null;
        let parentName;
        if (type.parentId) {
            const parent = await this.incidentTypeRepo.findById(IncidentTypeId_1.IncidentTypeId.create(type.parentId));
            parentName = parent === null || parent === void 0 ? void 0 : parent.name.value;
        }
        return this.toDTO(type, parentName);
    }
    async getAll() {
        const types = await this.incidentTypeRepo.findAll();
        const result = [];
        for (const type of types) {
            let parentName;
            if (type.parentId) {
                const parent = await this.incidentTypeRepo.findById(IncidentTypeId_1.IncidentTypeId.create(type.parentId));
                parentName = parent === null || parent === void 0 ? void 0 : parent.name.value;
            }
            result.push(this.toDTO(type, parentName));
        }
        return result;
    }
    async getByParentId(parentId) {
        const types = await this.incidentTypeRepo.findByParentId(IncidentTypeId_1.IncidentTypeId.create(new UniqueEntityID_1.UniqueEntityID(parentId)));
        const result = [];
        for (const type of types) {
            let parentName;
            if (type.parentId) {
                const parent = await this.incidentTypeRepo.findById(IncidentTypeId_1.IncidentTypeId.create(type.parentId));
                parentName = parent === null || parent === void 0 ? void 0 : parent.name.value;
            }
            result.push(this.toDTO(type, parentName));
        }
        return result;
    }
    async update(id, dto) {
        const type = await this.incidentTypeRepo.findById(IncidentTypeId_1.IncidentTypeId.create(new UniqueEntityID_1.UniqueEntityID(id)));
        if (!type)
            return null;
        if (dto.code) {
            const existing = await this.incidentTypeRepo.findByCode(dto.code);
            if (existing && existing.id.toString() !== id)
                throw new Error(`IncidentType code "${dto.code}" already exists.`);
            type.props.code = IncidentTypeCode_1.IncidentTypeCode.create(dto.code).getValue();
        }
        if (dto.name)
            type.props.name = IncidentTypeName_1.IncidentTypeName.create(dto.name).getValue();
        if (dto.description)
            type.props.description = IncidentTypeDescription_1.IncidentTypeDescription.create(dto.description).getValue();
        if (dto.severity)
            type.props.severity = IncidentSeverity_1.IncidentSeverity.create(this.parseSeverity(dto.severity)).getValue();
        if (dto.parentId !== undefined) {
            if (dto.parentId === null) {
                type.setParent(undefined);
            }
            else {
                const parent = await this.incidentTypeRepo.findById(IncidentTypeId_1.IncidentTypeId.create(new UniqueEntityID_1.UniqueEntityID(dto.parentId)));
                if (!parent)
                    throw new Error(`Parent IncidentType with id ${dto.parentId} not found`);
                type.setParent(parent.id);
            }
        }
        await this.incidentTypeRepo.save(type);
        let parentName;
        if (type.parentId) {
            const parent = await this.incidentTypeRepo.findById(IncidentTypeId_1.IncidentTypeId.create(type.parentId));
            parentName = parent === null || parent === void 0 ? void 0 : parent.name.value;
        }
        return this.toDTO(type, parentName);
    }
    parseSeverity(value) {
        if (!Object.values(IncidentSeverity_1.IncidentSeverityEnum).includes(value))
            throw new Error(`Invalid IncidentSeverity: ${value}`);
        return value;
    }
    toDTO(type, parentName) {
        var _a, _b;
        return {
            id: type.id.toString(),
            code: type.code.value,
            name: type.name.value,
            description: type.description.value,
            severity: type.severity.value,
            parentId: (_b = (_a = type.parentId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null,
            parentName
        };
    }
}
exports.IncidentTypeService = IncidentTypeService;
//# sourceMappingURL=IncidentTypeService.js.map