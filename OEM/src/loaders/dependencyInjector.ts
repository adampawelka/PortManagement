import { Container } from 'typedi';
import LoggerInstance from './logger';

export default ({ mongoConnection, schemas, controllers, repos, services}: {
                    mongoConnection;
                    schemas: { name: string; schema: any }[],
                    controllers: {name: string; path: string }[],
                    repos: {name: string; path: string }[],
                    services: {name: string; path: string }[] }) => {
  try {
    Container.set('logger', LoggerInstance);

    /**
     * We are injecting the mongoose models into the DI container.
     * This is controversial but it will provide a lot of flexibility 
     * at the time of writing unit tests.
     */
    schemas.forEach(m => {
      // Notice the require syntax and the '.default'
      let schema = require(m.schema).default;
      Container.set(m.name, schema);
    });
  
    // Instantiate repos manually (they don't have @Service() decorator and have no dependencies)
    repos.forEach(m => {
      let repoModule = require(m.path);
      // Repos are exported as named exports (export class), not default exports
      // Try to get the class by name, or get the first exported class
      let repoClass = repoModule.default || repoModule[m.name] || Object.values(repoModule).find((val: any) => typeof val === 'function' && val.prototype);
      if (!repoClass || typeof repoClass !== 'function') {
        throw new Error(`Cannot find constructor for repo: ${m.name} at ${m.path}. Available exports: ${Object.keys(repoModule).join(', ')}`);
      }
      let repoInstance = new repoClass(); // Manual instantiation since no @Service() decorator
      Container.set(m.name, repoInstance);
    });

    // Instantiate VvnClientService first (needed by VesselVisitExecutionService)
    const VvnClientService = require('../services/VvnClientService').VvnClientService;
    const vvnClientInstance = new VvnClientService();
    Container.set('VvnClientService', vvnClientInstance);

    // Instantiate services manually with their repo dependencies
    services.forEach(m => {
      let serviceModule = require(m.path);
      // Services are also exported as named exports (export class)
      let serviceClass = serviceModule.default || serviceModule[m.name] || Object.values(serviceModule).find((val: any) => typeof val === 'function' && val.prototype);
      if (!serviceClass || typeof serviceClass !== 'function') {
        throw new Error(`Cannot find constructor for service: ${m.name} at ${m.path}. Available exports: ${Object.keys(serviceModule).join(', ')}`);
      }
      // Services need repos injected - match service to repo by name pattern
      const repoName = m.name.replace('Service', 'Repo');
      const repoInstance = Container.get(repoName);
      
      // Special case: VesselVisitExecutionService needs both repo and VvnClientService
      if (m.name === 'VesselVisitExecutionService') {
        const serviceInstance = new serviceClass(repoInstance, vvnClientInstance);
        Container.set(m.name, serviceInstance);
      } else {
        const serviceInstance = new serviceClass(repoInstance);
        Container.set(m.name, serviceInstance);
      }
    });

    controllers.forEach(m => {
      // load the @Service() class by its path
      let controllerClass = require(m.path).default;
      // create/get the instance of the @Service() class
      let controllerInstance = Container.get(controllerClass);
      // rename the instance inside the container
      Container.set(m.name, controllerInstance);
    });
  
    return;
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
