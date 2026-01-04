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
let ExecutedOperationController = class ExecutedOperationController {
    constructor(executedOpServiceInstance) {
        this.executedOpServiceInstance = executedOpServiceInstance;
    }
    // POST: /executedOperations (US 4.1.9)
    async createExecutedOperation(req, res, next) {
        try {
            const operationDTO = await this.executedOpServiceInstance.create(req.body);
            return res.status(201).json(operationDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // POST: /executedOperations/from-planned (NEW - US 4.1.9)
    async createFromPlannedOperation(req, res, next) {
        try {
            const operationDTO = await this.executedOpServiceInstance.createFromPlannedOperation(req.body);
            return res.status(201).json(operationDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    async batchCreateFromPlannedOperations(req, res, next) {
        try {
            const { vesselVisitExecutionId, plannedOperationIds } = req.body;
            if (!vesselVisitExecutionId || !plannedOperationIds || !Array.isArray(plannedOperationIds)) {
                return res.status(400).json({
                    error: "Missing required fields: vesselVisitExecutionId and plannedOperationIds (array)"
                });
            }
            const operationsDTO = await this.executedOpServiceInstance.batchCreateFromPlannedOperations(vesselVisitExecutionId, plannedOperationIds);
            return res.status(201).json({
                message: `Created ${operationsDTO.length} executed operations`,
                operations: operationsDTO
            });
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // GET: /executedOperations/vve/:vveId (Para métricas de ejecución de US 4.1.10)
    async getByVVE(req, res, next) {
        try {
            const operationsDTO = await this.executedOpServiceInstance.getByVesselVisitExecutionId(req.params.vveId);
            return res.status(200).json(operationsDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    async getAvailablePlannedOperations(req, res, next) {
        try {
            const plannedOperations = await this.executedOpServiceInstance.getAvailablePlannedOperationsForVVE(req.params.vveId);
            return res.status(200).json(plannedOperations);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    // PUT: /executedOperations/:id (Sincronización con estado de US 4.1.9)
    async updateExecutedOperation(req, res, next) {
        try {
            const operationDTO = await this.executedOpServiceInstance.update(req.params.id, req.body);
            if (!operationDTO)
                return res.status(404).send("Operation not executed");
            return res.status(200).json(operationDTO);
        }
        catch (e) {
            return next(e);
        }
    }
    ;
    async batchUpdateExecutedOperations(req, res, next) {
        try {
            const updates = req.body;
            if (!Array.isArray(updates)) {
                return res.status(400).json({
                    error: "Request body must be an array of { id: string, updates: UpdateExecutedOperationDTO }"
                });
            }
            const results = [];
            for (const update of updates) {
                try {
                    const operationDTO = await this.executedOpServiceInstance.update(update.id, update.updates);
                    results.push({
                        id: update.id,
                        success: true,
                        data: operationDTO
                    });
                }
                catch (error) {
                    results.push({
                        id: update.id,
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);
            return res.status(200).json({
                message: `Batch update completed. Successful: ${successful.length}, Failed: ${failed.length}`,
                successful,
                failed
            });
        }
        catch (e) {
            return next(e);
        }
    }
    ;
};
ExecutedOperationController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.executedOperation.name)),
    __metadata("design:paramtypes", [Object])
], ExecutedOperationController);
exports.default = ExecutedOperationController;
//# sourceMappingURL=ExecutedOperationController.js.map