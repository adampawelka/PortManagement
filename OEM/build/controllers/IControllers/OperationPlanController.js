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
let OperationPlanController = class OperationPlanController {
    constructor(operationPlanServiceInstance) {
        this.operationPlanServiceInstance = operationPlanServiceInstance;
    }
    async createOperationPlan(req, res, next) {
        try {
            const plan = await this.operationPlanServiceInstance.create(req.body);
            return res.status(201).json(plan);
        }
        catch (e) {
            return next(e);
        }
    }
    async saveOperationPlans(req, res, next) {
        try {
            const { plans, metadata } = req.body;
            if (!Array.isArray(plans) || plans.length === 0) {
                return res.status(400).json({ message: "Plans array is required and cannot be empty" });
            }
            const savedPlans = [];
            for (const planDto of plans) {
                const enhancedDto = Object.assign(Object.assign({}, planDto), { algorithmUsed: planDto.algorithmUsed || (metadata === null || metadata === void 0 ? void 0 : metadata.algorithmUsed) || "unknown", createdBy: planDto.createdBy || (metadata === null || metadata === void 0 ? void 0 : metadata.createdBy) || "system", createdAt: planDto.createdAt || new Date() });
                const plan = await this.operationPlanServiceInstance.create(enhancedDto);
                savedPlans.push(plan);
            }
            return res.status(201).json({
                message: `Successfully saved ${savedPlans.length} operation plans`,
                count: savedPlans.length,
                plans: savedPlans
            });
        }
        catch (e) {
            return next(e);
        }
    }
    async getOperationPlan(req, res, next) {
        try {
            const plan = await this.operationPlanServiceInstance.getById(req.params.id);
            if (!plan)
                return res.status(404).send("Operational plan not found");
            return res.status(200).json(plan);
        }
        catch (e) {
            return next(e);
        }
    }
    async getByVvn(req, res, next) {
        try {
            const plan = await this.operationPlanServiceInstance.getByVvnId(req.params.vvnId);
            if (!plan)
                return res.status(404).send("No plan for that visit");
            return res.status(200).json(plan);
        }
        catch (e) {
            return next(e);
        }
    }
    async getAll(req, res, next) {
        try {
            const plans = await this.operationPlanServiceInstance.getAll();
            return res.status(200).json(plans);
        }
        catch (e) {
            return next(e);
        }
    }
    async updateOperationPlan(req, res, next) {
        try {
            const plan = await this.operationPlanServiceInstance.update(req.params.id, req.body);
            if (!plan)
                return res.status(404).send("Plan not found to update");
            return res.status(200).json(plan);
        }
        catch (e) {
            return next(e);
        }
    }
    async getResourceAllocation(req, res, next) {
        try {
            const { resourceType, resourceId, from, to } = req.query;
            if (!resourceType || !resourceId || !from || !to) {
                return res.status(400).json({ message: "Missing query parameters" });
            }
            const result = await this.operationPlanServiceInstance.getResourceAllocation(resourceType, resourceId, new Date(from), new Date(to));
            return res.status(200).json(result);
        }
        catch (e) {
            return next(e);
        }
    }
    async search(req, res, next) {
        try {
            const parseDate = (value) => value ? new Date(value.toString()) : undefined;
            const searchDTO = {
                dateStart: parseDate(req.query.dateStart),
                dateEnd: parseDate(req.query.dateEnd),
                operationDateStart: parseDate(req.query.operationDateStart),
                operationDateEnd: parseDate(req.query.operationDateEnd),
                vesselName: req.query.vesselName,
                vvnId: req.query.vvnId,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder === 'desc' ? 'desc' : 'asc'
            };
            const plans = await this.operationPlanServiceInstance.search(searchDTO);
            return res.status(200).json(plans);
        }
        catch (e) {
            return next(e);
        }
    }
    async getMissingPlans(req, res, next) {
        try {
            // Esperamos la fecha como query param: /missing?date=2025-12-23
            const date = req.query.date;
            if (!date) {
                return res.status(400).send("Date query parameter is required");
            }
            const result = await this.operationPlanServiceInstance.getMissingPlans(date);
            return res.status(200).json(result);
        }
        catch (e) {
            return next(e);
        }
    }
};
OperationPlanController = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(config_1.default.services.operationPlan.name)),
    __metadata("design:paramtypes", [Object])
], OperationPlanController);
exports.default = OperationPlanController;
//# sourceMappingURL=OperationPlanController.js.map