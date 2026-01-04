"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const logger_1 = __importDefault(require("./logger"));
exports.default = ({ mongoConnection, schemas, controllers, repos, services }) => {
    try {
        typedi_1.Container.set('logger', logger_1.default);
        /**
         * We are injecting the mongoose models into the DI container.
         * This is controversial but it will provide a lot of flexibility
         * at the time of writing unit tests.
         */
        schemas.forEach(m => {
            // Notice the require syntax and the '.default'
            let schema = require(m.schema).default;
            typedi_1.Container.set(m.name, schema);
        });
        // Instantiate repos manually (they don't have @Service() decorator and have no dependencies)
        repos.forEach(m => {
            let repoModule = require(m.path);
            // Repos are exported as named exports (export class), not default exports
            // Try to get the class by name, or get the first exported class
            let repoClass = repoModule.default || repoModule[m.name] || Object.values(repoModule).find((val) => typeof val === 'function' && val.prototype);
            if (!repoClass || typeof repoClass !== 'function') {
                throw new Error(`Cannot find constructor for repo: ${m.name} at ${m.path}. Available exports: ${Object.keys(repoModule).join(', ')}`);
            }
            let repoInstance = new repoClass(); // Manual instantiation since no @Service() decorator
            typedi_1.Container.set(m.name, repoInstance);
        });
        // Instantiate VvnClientService first (needed by VesselVisitExecutionService)
        const VvnClientService = require('../services/VvnClientService').VvnClientService;
        const vvnClientInstance = new VvnClientService();
        typedi_1.Container.set('VvnClientService', vvnClientInstance);
        // Instantiate services manually with their repo dependencies
        services.forEach(m => {
            let serviceModule = require(m.path);
            // Services are also exported as named exports (export class)
            let serviceClass = serviceModule.default || serviceModule[m.name] || Object.values(serviceModule).find((val) => typeof val === 'function' && val.prototype);
            if (!serviceClass || typeof serviceClass !== 'function') {
                throw new Error(`Cannot find constructor for service: ${m.name} at ${m.path}. Available exports: ${Object.keys(serviceModule).join(', ')}`);
            }
            // Services need repos injected - match service to repo by name pattern
            const repoName = m.name.replace('Service', 'Repo');
            const repoInstance = typedi_1.Container.get(repoName);
            // Special case: VesselVisitExecutionService needs both repo and VvnClientService
            if (m.name === 'VesselVisitExecutionService') {
                const serviceInstance = new serviceClass(repoInstance, vvnClientInstance);
                typedi_1.Container.set(m.name, serviceInstance);
            }
            else {
                const serviceInstance = new serviceClass(repoInstance);
                typedi_1.Container.set(m.name, serviceInstance);
            }
        });
        controllers.forEach(m => {
            // load the @Service() class by its path
            let controllerClass = require(m.path).default;
            // create/get the instance of the @Service() class
            let controllerInstance = typedi_1.Container.get(controllerClass);
            // rename the instance inside the container
            typedi_1.Container.set(m.name, controllerInstance);
        });
        return;
    }
    catch (e) {
        logger_1.default.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
//# sourceMappingURL=dependencyInjector.js.map