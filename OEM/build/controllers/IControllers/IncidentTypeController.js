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
let IncidentTypeController = class IncidentTypeController {
    constructor(incidentTypeServiceInstance) {
        this.incidentTypeServiceInstance = incidentTypeServiceInstance;
    }
    // POST: /incidentTypes
    async createIncidentType(req, res, next) {
        try {
            const typeDTO = await this.incidentTypeServiceInstance.create(req.body);
            return res.status(201).json(typeDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    // GET: /incidentTypes/:id
    async getById(req, res, next) {
        try {
            const typeDTO = await this.incidentTypeServiceInstance.getById(req.params.id);
            if (!typeDTO)
                return res.status(404).json({ message: "Incident type not found" });
            return res.status(200).json(typeDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    // GET: /incidentTypes
    // Optional: ?parentId=xxx to filter by parent
    async getAll(req, res, next) {
        try {
            const parentId = req.query.parentId;
            let typesDTO;
            if (parentId) {
                typesDTO = await this.incidentTypeServiceInstance.getByParentId(parentId);
            }
            else {
                typesDTO = await this.incidentTypeServiceInstance.getAll();
            }
            return res.status(200).json(typesDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    // PUT: /incidentTypes/:id
    async updateIncidentType(req, res, next) {
        try {
            const typeDTO = await this.incidentTypeServiceInstance.update(req.params.id, req.body);
            if (!typeDTO)
                return res.status(404).json({ message: "Incident type not found" });
            return res.status(200).json(typeDTO);
        }
        catch (e) {
            return next(e);
        }
    }
};
IncidentTypeController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.incidentType.name)),
    __metadata("design:paramtypes", [Object])
], IncidentTypeController);
exports.default = IncidentTypeController;
//# sourceMappingURL=IncidentTypeController.js.map