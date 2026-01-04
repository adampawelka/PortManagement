"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const dependencyInjector_1 = __importDefault(require("./dependencyInjector"));
const mongoose_1 = __importDefault(require("./mongoose"));
const logger_1 = __importDefault(require("./logger"));
const config_1 = __importDefault(require("../../config"));
exports.default = async ({ expressApp }) => {
    const mongoConnection = await (0, mongoose_1.default)();
    logger_1.default.info('✌️ DB loaded and connected!');
    // Define all schemas
    const schemas = [
        {
            name: 'complementaryTaskCategorySchema',
            schema: '../persistence/schemas/ComplementaryTaskCategorySchema',
        },
        {
            name: 'complementaryTaskSchema',
            schema: '../persistence/schemas/ComplementaryTaskSchema',
        },
        {
            name: 'vesselVisitExecutionSchema',
            schema: '../persistence/schemas/VesselVisitExecutionSchema',
        },
        {
            name: 'plannedOperationSchema',
            schema: '../persistence/schemas/PlannedOperationSchema',
        },
        {
            name: 'operationPlanSchema',
            schema: '../persistence/schemas/OperationPlanSchema',
        },
        {
            name: 'incidentTypeSchema',
            schema: '../persistence/schemas/IncidentTypeSchema',
        },
        {
            name: 'incidentSchema',
            schema: '../persistence/schemas/IncidentSchema',
        },
        {
            name: 'executedOperationSchema',
            schema: '../persistence/schemas/ExecutedOperationSchema',
        },
    ];
    // Define all repos
    const repos = [
        {
            name: config_1.default.repos.complementaryTaskCategory.name,
            path: config_1.default.repos.complementaryTaskCategory.path,
        },
        {
            name: config_1.default.repos.complementaryTask.name,
            path: config_1.default.repos.complementaryTask.path,
        },
        {
            name: config_1.default.repos.vesselVisitExecution.name,
            path: config_1.default.repos.vesselVisitExecution.path,
        },
        {
            name: config_1.default.repos.plannedOperation.name,
            path: config_1.default.repos.plannedOperation.path,
        },
        {
            name: config_1.default.repos.operationPlan.name,
            path: config_1.default.repos.operationPlan.path,
        },
        {
            name: config_1.default.repos.incidentType.name,
            path: config_1.default.repos.incidentType.path,
        },
        {
            name: config_1.default.repos.incident.name,
            path: config_1.default.repos.incident.path,
        },
        {
            name: config_1.default.repos.executedOperation.name,
            path: config_1.default.repos.executedOperation.path,
        },
    ];
    // Define all services
    const services = [
        {
            name: config_1.default.services.complementaryTaskCategory.name,
            path: config_1.default.services.complementaryTaskCategory.path,
        },
        {
            name: config_1.default.services.complementaryTask.name,
            path: config_1.default.services.complementaryTask.path,
        },
        {
            name: config_1.default.services.vesselVisitExecution.name,
            path: config_1.default.services.vesselVisitExecution.path,
        },
        {
            name: config_1.default.services.plannedOperation.name,
            path: config_1.default.services.plannedOperation.path,
        },
        {
            name: config_1.default.services.operationPlan.name,
            path: config_1.default.services.operationPlan.path,
        },
        {
            name: config_1.default.services.incidentType.name,
            path: config_1.default.services.incidentType.path,
        },
        {
            name: config_1.default.services.incident.name,
            path: config_1.default.services.incident.path,
        },
        {
            name: config_1.default.services.executedOperation.name,
            path: config_1.default.services.executedOperation.path,
        },
    ];
    // Define all controllers
    const controllers = [
        {
            name: config_1.default.controllers.complementaryTaskCategory.name,
            path: config_1.default.controllers.complementaryTaskCategory.path,
        },
        {
            name: config_1.default.controllers.complementaryTask.name,
            path: config_1.default.controllers.complementaryTask.path,
        },
        {
            name: config_1.default.controllers.vesselVisitExecution.name,
            path: config_1.default.controllers.vesselVisitExecution.path,
        },
        {
            name: config_1.default.controllers.plannedOperation.name,
            path: config_1.default.controllers.plannedOperation.path,
        },
        {
            name: config_1.default.controllers.operationPlan.name,
            path: config_1.default.controllers.operationPlan.path,
        },
        {
            name: config_1.default.controllers.incidentType.name,
            path: config_1.default.controllers.incidentType.path,
        },
        {
            name: config_1.default.controllers.incident.name,
            path: config_1.default.controllers.incident.path,
        },
        {
            name: config_1.default.controllers.executedOperation.name,
            path: config_1.default.controllers.executedOperation.path,
        },
    ];
    await (0, dependencyInjector_1.default)({
        mongoConnection,
        schemas,
        controllers,
        repos,
        services,
    });
    logger_1.default.info('Schemas, Controllers, Repositories, Services, etc. loaded');
    await (0, express_1.default)({ app: expressApp });
    logger_1.default.info('Express loaded');
};
//# sourceMappingURL=index.js.map