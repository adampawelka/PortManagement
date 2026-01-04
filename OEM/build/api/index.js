"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../../config"));
const ComplementaryTaskCategoryController_1 = __importDefault(require("../controllers/IControllers/ComplementaryTaskCategoryController"));
exports.default = () => {
    const router = (0, express_1.Router)();
    // Get controllers from dependency injection container
    const complementaryTaskCategoryController = typedi_1.Container.get(ComplementaryTaskCategoryController_1.default);
    const complementaryTaskController = typedi_1.Container.get(config_1.default.controllers.complementaryTask.name);
    const vesselVisitExecutionController = typedi_1.Container.get(config_1.default.controllers.vesselVisitExecution.name);
    const plannedOperationController = typedi_1.Container.get(config_1.default.controllers.plannedOperation.name);
    const operationPlanController = typedi_1.Container.get(config_1.default.controllers.operationPlan.name);
    const incidentTypeController = typedi_1.Container.get(config_1.default.controllers.incidentType.name);
    const incidentController = typedi_1.Container.get(config_1.default.controllers.incident.name);
    const executedOperationController = typedi_1.Container.get(config_1.default.controllers.executedOperation.name);
    // Register routes
    // Complementary Task Categories
    router.post('/complementaryTaskCategories', (req, res, next) => complementaryTaskCategoryController.createCategory(req, res, next));
    router.get('/complementaryTaskCategories', (req, res, next) => complementaryTaskCategoryController.getAll(req, res, next));
    router.get('/complementaryTaskCategories/:id', (req, res, next) => complementaryTaskCategoryController.getCategory(req, res, next));
    // Operation Plans
    router.post('/operationPlans', (req, res, next) => operationPlanController.createOperationPlan(req, res, next));
    router.get('/operationPlans', (req, res, next) => operationPlanController.getAll(req, res, next));
    router.get('/operationPlans/search', (req, res, next) => operationPlanController.search(req, res, next));
    router.get('/operationPlans/:id', (req, res, next) => operationPlanController.getOperationPlan(req, res, next));
    router.get('/operationPlans/vvn/:vvnId', (req, res, next) => operationPlanController.getByVvn(req, res, next));
    router.put('/operationPlans/:id', (req, res, next) => operationPlanController.updateOperationPlan(req, res, next));
    router.get('/operationPlans/resource-allocation', (req, res, next) => operationPlanController.getResourceAllocation(req, res, next));
    // Vessel Visit Executions
    router.post('/vesselVisitExecutions', (req, res, next) => vesselVisitExecutionController.createVVE(req, res, next));
    router.get('/vesselVisitExecutions', (req, res, next) => vesselVisitExecutionController.getAll(req, res, next));
    router.get('/vesselVisitExecutions/:id', (req, res, next) => vesselVisitExecutionController.getVVE(req, res, next));
    router.put('/vesselVisitExecutions/:id', (req, res, next) => vesselVisitExecutionController.updateVVE(req, res, next));
    // Complementary Tasks (US 4.1.15)
    router.post('/complementaryTasks', (req, res, next) => complementaryTaskController.createTask(req, res, next));
    router.get('/complementaryTasks', (req, res, next) => complementaryTaskController.getAll(req, res, next));
    router.get('/complementaryTasks/vve/:vveId', (req, res, next) => complementaryTaskController.getByVVE(req, res, next));
    router.put('/complementaryTasks/:id', (req, res, next) => complementaryTaskController.updateTask(req, res, next));
    return router;
};
//# sourceMappingURL=index.js.map