import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

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
      name: config.repos.complementaryTaskCategory.name,
      path: config.repos.complementaryTaskCategory.path,
    },
    {
      name: config.repos.complementaryTask.name,
      path: config.repos.complementaryTask.path,
    },
    {
      name: config.repos.vesselVisitExecution.name,
      path: config.repos.vesselVisitExecution.path,
    },
    {
      name: config.repos.plannedOperation.name,
      path: config.repos.plannedOperation.path,
    },
    {
      name: config.repos.operationPlan.name,
      path: config.repos.operationPlan.path,
    },
    {
      name: config.repos.incidentType.name,
      path: config.repos.incidentType.path,
    },
    {
      name: config.repos.incident.name,
      path: config.repos.incident.path,
    },
    {
      name: config.repos.executedOperation.name,
      path: config.repos.executedOperation.path,
    },
  ];

  // Define all services
  const services = [
    {
      name: config.services.complementaryTaskCategory.name,
      path: config.services.complementaryTaskCategory.path,
    },
    {
      name: config.services.complementaryTask.name,
      path: config.services.complementaryTask.path,
    },
    {
      name: config.services.vesselVisitExecution.name,
      path: config.services.vesselVisitExecution.path,
    },
    {
      name: config.services.plannedOperation.name,
      path: config.services.plannedOperation.path,
    },
    {
      name: config.services.operationPlan.name,
      path: config.services.operationPlan.path,
    },
    {
      name: config.services.incidentType.name,
      path: config.services.incidentType.path,
    },
    {
      name: config.services.incident.name,
      path: config.services.incident.path,
    },
    {
      name: config.services.executedOperation.name,
      path: config.services.executedOperation.path,
    },
  ];

  // Define all controllers
  const controllers = [
    {
      name: config.controllers.complementaryTaskCategory.name,
      path: config.controllers.complementaryTaskCategory.path,
    },
    {
      name: config.controllers.complementaryTask.name,
      path: config.controllers.complementaryTask.path,
    },
    {
      name: config.controllers.vesselVisitExecution.name,
      path: config.controllers.vesselVisitExecution.path,
    },
    {
      name: config.controllers.plannedOperation.name,
      path: config.controllers.plannedOperation.path,
    },
    {
      name: config.controllers.operationPlan.name,
      path: config.controllers.operationPlan.path,
    },
    {
      name: config.controllers.incidentType.name,
      path: config.controllers.incidentType.path,
    },
    {
      name: config.controllers.incident.name,
      path: config.controllers.incident.path,
    },
    {
      name: config.controllers.executedOperation.name,
      path: config.controllers.executedOperation.path,
    },
  ];

  await dependencyInjectorLoader({
    mongoConnection,
    schemas,
    controllers,
    repos,
    services,
  });
  Logger.info('Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};