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
let PlannedOperationController = class PlannedOperationController {
    constructor(plannedOpServiceInstance) {
        this.plannedOpServiceInstance = plannedOpServiceInstance;
    }
    // POST: /plannedOperations
    async createPlannedOperation(req, res, next) {
        try {
            const operationDTO = await this.plannedOpServiceInstance.create(req.body);
            return res.status(201).json(operationDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // GET: /plannedOperations/plan/:planId
    async getByOperationPlan(req, res, next) {
        try {
            const operationsDTO = await this.plannedOpServiceInstance.getByOperationPlanId(req.params.planId);
            return res.status(200).json(operationsDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // GET: /plannedOperations/:id
    async getById(req, res, next) {
        try {
            const operationDTO = await this.plannedOpServiceInstance.getById(req.params.id);
            if (!operationDTO)
                return res.status(404).send("Planned operation not found");
            return res.status(200).json(operationDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // PUT: /plannedOperations/:id (Para ajustes manuales de US 4.1.4)
    async updatePlannedOperation(req, res, next) {
        try {
            const operationDTO = await this.plannedOpServiceInstance.update(req.params.id, req.body);
            if (!operationDTO)
                return res.status(404).send("Planned operation not found");
            return res.status(200).json(operationDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
};
PlannedOperationController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.plannedOperation.name)),
    __metadata("design:paramtypes", [Object])
], PlannedOperationController);
exports.default = PlannedOperationController;
//# sourceMappingURL=PlannedOperationController.js.map