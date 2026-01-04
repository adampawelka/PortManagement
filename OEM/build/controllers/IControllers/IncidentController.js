"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../../config"));
let IncidentController = class IncidentController {
    constructor(incidentServiceInstance) {
        this.incidentServiceInstance = incidentServiceInstance;
    }
    // POST: /incidents (US 4.1.13)
    async createIncident(req, res, next) {
        try {
            const incidentDTO = await this.incidentServiceInstance.create(req.body);
            return res.status(201).json(incidentDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // GET: /incidents/:id
    async getIncident(req, res, next) {
        try {
            const incidentDTO = await this.incidentServiceInstance.getById(req.params.id);
            if (!incidentDTO)
                return res.status(404).send("Incident not found");
            return res.status(200).json(incidentDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // GET: /incidents (Para filtros por buque, fecha o severidad en SPA)
    async getAll(req, res, next) {
        try {
            const incidentsDTO = await this.incidentServiceInstance.getAll();
            return res.status(200).json(incidentsDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // GET: /incidents/type/:typeId
    async getByIncidentType(req, res, next) {
        try {
            const incidentsDTO = await this.incidentServiceInstance.getByIncidentType(req.params.typeId);
            return res.status(200).json(incidentsDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // PUT: /incidents/:id (Para marcar resolución o actualizar impacto)
    async updateIncident(req, res, next) {
        try {
            const incidentDTO = await this.incidentServiceInstance.update(req.params.id, req.body);
            if (!incidentDTO)
                return res.status(404).send("Incident not found");
            return res.status(200).json(incidentDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
};
IncidentController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.incident.name)),
    __metadata("design:paramtypes", [Object])
], IncidentController);
exports.default = IncidentController;
//# sourceMappingURL=IncidentController.js.map