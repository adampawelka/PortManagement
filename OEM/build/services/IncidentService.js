"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentService = void 0;
const Incident_1 = require("../Domain/Incidents/Incident");
const IncidentId_1 = require("../Domain/Incidents/IncidentId");
const IncidentTypeId_1 = require("../Domain/IncidentTypes/IncidentTypeId");
const IncidentStartTime_1 = require("../Domain/Incidents/IncidentStartTime");
const IncidentEndTime_1 = require("../Domain/Incidents/IncidentEndTime");
const IncidentSeverity_1 = require("../Domain/Incidents/IncidentSeverity");
const IncidentDescription_1 = require("../Domain/Incidents/IncidentDescription");
const CreatedBy_1 = require("../Domain/Incidents/CreatedBy");
const UniqueEntityID_1 = require("../core/domain/UniqueEntityID");
class IncidentService {
    constructor(incidentRepo) {
        this.incidentRepo = incidentRepo;
    }
    async create(dto) {
        const severityEnum = this.parseSeverity(dto.severity);
        const incidentOrError = Incident_1.Incident.create({
            incidentTypeId: IncidentTypeId_1.IncidentTypeId.create(new UniqueEntityID_1.UniqueEntityID(dto.incidentTypeId)),
            startTime: IncidentStartTime_1.IncidentStartTime.create(new Date(dto.startTime)).getValue(),
            endTime: dto.endTime
                ? IncidentEndTime_1.IncidentEndTime.create(new Date(dto.endTime)).getValue()
                : undefined,
            severity: IncidentSeverity_1.IncidentSeverity.create(severityEnum).getValue(),
            description: IncidentDescription_1.IncidentDescription.create(dto.description).getValue(),
            createdBy: CreatedBy_1.CreatedBy.create(dto.createdBy).getValue()
        });
        if (incidentOrError.isFailure) {
            throw new Error(incidentOrError.errorValue().toString());
        }
        const incident = incidentOrError.getValue();
        await this.incidentRepo.save(incident);
        return this.toDTO(incident);
    }
    async getById(id) {
        const incidentId = IncidentId_1.IncidentId.create(new UniqueEntityID_1.UniqueEntityID(id));
        const incident = await this.incidentRepo.findById(incidentId);
        if (!incident)
            return null;
        return this.toDTO(incident);
    }
    async getByIncidentType(incidentTypeId) {
        const typeId = IncidentTypeId_1.IncidentTypeId.create(new UniqueEntityID_1.UniqueEntityID(incidentTypeId));
        const incidents = await this.incidentRepo.findByIncidentType(typeId);
        return incidents.map(i => this.toDTO(i));
    }
    async getAll() {
        const incidents = await this.incidentRepo.findAll();
        return incidents.map(i => this.toDTO(i));
    }
    async update(id, dto) {
        const incidentId = IncidentId_1.IncidentId.create(new UniqueEntityID_1.UniqueEntityID(id));
        const incident = await this.incidentRepo.findById(incidentId);
        if (!incident)
            return null;
        if (dto.incidentTypeId) {
            incident.props.incidentTypeId =
                IncidentTypeId_1.IncidentTypeId.create(new UniqueEntityID_1.UniqueEntityID(dto.incidentTypeId));
        }
        if (dto.startTime) {
            incident.props.startTime =
                IncidentStartTime_1.IncidentStartTime.create(new Date(dto.startTime)).getValue();
        }
        if (dto.endTime) {
            incident.props.endTime =
                IncidentEndTime_1.IncidentEndTime.create(new Date(dto.endTime)).getValue();
        }
        if (dto.severity) {
            const severityEnum = this.parseSeverity(dto.severity);
            incident.props.severity =
                IncidentSeverity_1.IncidentSeverity.create(severityEnum).getValue();
        }
        if (dto.description) {
            incident.props.description =
                IncidentDescription_1.IncidentDescription.create(dto.description).getValue();
        }
        if (dto.createdBy) {
            incident.props.createdBy =
                CreatedBy_1.CreatedBy.create(dto.createdBy).getValue();
        }
        await this.incidentRepo.save(incident);
        return this.toDTO(incident);
    }
    parseSeverity(value) {
        if (!Object.values(IncidentSeverity_1.IncidentSeverityEnum).includes(value)) {
            throw new Error(`Invalid IncidentSeverity: ${value}`);
        }
        return value;
    }
    toDTO(incident) {
        return {
            id: incident.id.toString(),
            incidentTypeId: incident.incidentTypeId.toString(),
            startTime: incident.startTime.value.toISOString(),
            endTime: incident.endTime
                ? incident.endTime.value.toISOString()
                : undefined,
            severity: incident.severity.value,
            description: incident.description.value,
            createdBy: incident.createdBy.value
        };
    }
}
exports.IncidentService = IncidentService;
//# sourceMappingURL=IncidentService.js.map