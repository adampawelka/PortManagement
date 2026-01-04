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
let VesselVisitExecutionController = class VesselVisitExecutionController {
    constructor(vveServiceInstance) {
        this.vveServiceInstance = vveServiceInstance;
    }
    // POST: /vesselVisitExecutions (US 4.1.7)
    async createVVE(req, res, next) {
        try {
            // El sistema debe asignar automáticamente un identificador de VVE (US 4.1.7)
            // Status is automatically set to IN_PROGRESS on creation 
            const vveDTO = await this.vveServiceInstance.create(req.body);
            if (vveDTO === null) {
                return res.status(400).send("Failed to register vessel arrival");
            }
            return res.status(201).json(vveDTO);
        }
        catch (e) {
            console.error(`[VesselVisitExecutionController] Error creating VVE:`, e.message);
            // Return error message to client for better UX
            const statusCode = e.message && e.message.includes('already exists') ? 409 : 500;
            return res.status(statusCode).json({
                message: e.message || "Failed to create vessel visit execution"
            });
        }
    }
    ;
    // GET: /vesselVisitExecutions/:id
    async getVVE(req, res, next) {
        try {
            console.log(`[VesselVisitExecutionController] getVVE called with ID: ${req.params.id}`);
            const vveDTO = await this.vveServiceInstance.getById(req.params.id);
            if (vveDTO === null) {
                console.log(`[VesselVisitExecutionController] VVE not found for ID: ${req.params.id}`);
                return res.status(404).send("Execution register not found");
            }
            console.log(`[VesselVisitExecutionController] Returning VVE DTO`);
            return res.status(200).json(vveDTO);
        }
        catch (e) {
            console.error(`[VesselVisitExecutionController] Error in getVVE:`, e);
            return next(e);
        }
    }
    ;
    // MODIFICADO: GET /vesselVisitExecutions (Soporta US 4.1.10 y getAll simple)
    async getAll(req, res, next) {
        try {
            // Verificamos si hay query params para búsqueda
            const { dateStart, dateEnd, vesselName, status } = req.query;
            if (dateStart || dateEnd || vesselName || status) {
                // US 4.1.10: Búsqueda avanzada
                const criteria = {
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    vesselName: vesselName,
                    status: status
                };
                const results = await this.vveServiceInstance.search(criteria);
                return res.status(200).json(results);
            }
            else {
                // getAll original (sin filtros)
                const vvesDTO = await this.vveServiceInstance.getAll();
                return res.status(200).json(vvesDTO);
            }
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // PUT/PATCH: /vesselVisitExecutions/:id (US 4.1.8 y 4.1.11)
    async updateVVE(req, res, next) {
        try {
            const vveDTO = await this.vveServiceInstance.update(req.params.id, req.body);
            if (vveDTO === null) {
                return res.status(404).send("Execution register not found");
            }
            return res.status(200).json(vveDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    //4.1.11
    async completeVVE(req, res, next) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub;
            if (!userId) {
                return res.status(401).json({ message: "User not authenticated" });
            }
            const result = await this.vveServiceInstance.completeVVE(req.params.id, {
                actualUnberthTime: req.body.actualUnberthTime,
                actualPortDepartureTime: req.body.actualPortDepartureTime,
                user: userId
            });
            return res.status(200).json(result);
        }
        catch (e) {
            return res.status(400).json({
                message: e.message || "Failed to complete VVE"
            });
        }
    }
};
VesselVisitExecutionController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.vesselVisitExecution.name)),
    __metadata("design:paramtypes", [Object])
], VesselVisitExecutionController);
exports.default = VesselVisitExecutionController;
//# sourceMappingURL=VesselVisitExecutionController.js.map