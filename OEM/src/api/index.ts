import { Router } from 'express';
import { Container } from 'typedi';
import config from '../../config';
import ComplementaryTaskCategoryController from '../controllers/IControllers/ComplementaryTaskCategoryController';

export default (): Router => {
  const router = Router();

  // Get controllers from dependency injection container
  const complementaryTaskCategoryController = Container.get(ComplementaryTaskCategoryController) as ComplementaryTaskCategoryController;
  const complementaryTaskController = Container.get(config.controllers.complementaryTask.name);
  const vesselVisitExecutionController = Container.get(config.controllers.vesselVisitExecution.name);
  const plannedOperationController = Container.get(config.controllers.plannedOperation.name);
  const operationPlanController = Container.get(config.controllers.operationPlan.name);
  const incidentTypeController = Container.get(config.controllers.incidentType.name);
  const incidentController = Container.get(config.controllers.incident.name);
  const executedOperationController = Container.get(config.controllers.executedOperation.name);

  // Register routes

  // Complementary Task Categories
  router.post('/complementaryTaskCategories', (req, res, next) =>
    complementaryTaskCategoryController.createCategory(req, res, next));
  router.get('/complementaryTaskCategories', (req, res, next) =>
    complementaryTaskCategoryController.getAll(req, res, next));
  router.get('/complementaryTaskCategories/:id', (req, res, next) =>
    complementaryTaskCategoryController.getCategory(req, res, next));

  // Operation Plans
  router.post('/operationPlans', (req, res, next) =>
    (operationPlanController as any).createOperationPlan(req, res, next));
  router.post('/operationPlans/batch', (req, res, next) =>
    (operationPlanController as any).saveOperationPlans(req, res, next));
  router.get('/operationPlans/missing', (req, res, next) =>
    (operationPlanController as any).getMissingPlans(req, res, next));
  router.get('/operationPlans/search', (req, res, next) =>
    (operationPlanController as any).search(req, res, next));
  router.get('/operationPlans/resource-allocation', (req, res, next) =>
    (operationPlanController as any).getResourceAllocation(req, res, next));
  router.get('/operationPlans', (req, res, next) =>
    (operationPlanController as any).getAll(req, res, next));
  router.get('/operationPlans/:id', (req, res, next) =>
    (operationPlanController as any).getOperationPlan(req, res, next));
  router.get('/operationPlans/vvn/:vvnId', (req, res, next) =>
    (operationPlanController as any).getByVvn(req, res, next));
  router.put('/operationPlans/:id', (req, res, next) =>
    (operationPlanController as any).updateOperationPlan(req, res, next));

  // Vessel Visit Executions
  router.post('/vesselVisitExecutions', (req, res, next) =>
    (vesselVisitExecutionController as any).createVVE(req, res, next));
  router.get('/vesselVisitExecutions', (req, res, next) =>
    (vesselVisitExecutionController as any).getAll(req, res, next));
  router.patch('/vesselVisitExecutions/:id/complete', (req, res, next) =>
    (vesselVisitExecutionController as any).completeVVE(req, res, next));
  router.get('/vesselVisitExecutions/:id', (req, res, next) =>
    (vesselVisitExecutionController as any).getVVE(req, res, next));
  router.put('/vesselVisitExecutions/:id', (req, res, next) =>
    (vesselVisitExecutionController as any).updateVVE(req, res, next));


  // Complementary Tasks (US 4.1.15)
  router.post('/complementaryTasks', (req, res, next) =>
    (complementaryTaskController as any).createTask(req, res, next));
  router.get('/complementaryTasks', (req, res, next) =>
    (complementaryTaskController as any).getAll(req, res, next));
  router.get('/complementaryTasks/vve/:vveId', (req, res, next) =>
    (complementaryTaskController as any).getByVVE(req, res, next));
  router.put('/complementaryTasks/:id', (req, res, next) =>
    (complementaryTaskController as any).updateTask(req, res, next));

  // Executed Operations
  router.post('/executedOperations', (req, res, next) =>
    (executedOperationController as any).createExecutedOperation(req, res, next));
  router.post('/executedOperations/from-planned', (req, res, next) =>
    (executedOperationController as any).createFromPlannedOperation(req, res, next));
  router.post('/executedOperations/batch-from-planned', (req, res, next) =>
    (executedOperationController as any).batchCreateFromPlannedOperations(req, res, next));
  router.get('/executedOperations/vve/:vveId', (req, res, next) =>
    (executedOperationController as any).getByVVE(req, res, next));
  router.get('/executedOperations/available-planned/:vveId', (req, res, next) =>
    (executedOperationController as any).getAvailablePlannedOperations(req, res, next));
  router.put('/executedOperations/:id', (req, res, next) =>
    (executedOperationController as any).updateExecutedOperation(req, res, next));
  router.put('/executedOperations/batch/update', (req, res, next) =>
    (executedOperationController as any).batchUpdateExecutedOperations(req, res, next));

  // Incidents
  router.post('/incidents', (req, res, next) =>
    (incidentController as any).createIncident(req, res, next));
  router.get('/incidents', (req, res, next) =>
    (incidentController as any).getAll(req, res, next));
  router.get('/incidents/type/:typeId', (req, res, next) =>
    (incidentController as any).getByIncidentType(req, res, next));
  router.get('/incidents/:id', (req, res, next) =>
    (incidentController as any).getIncident(req, res, next));
  router.put('/incidents/:id', (req, res, next) =>
    (incidentController as any).updateIncident(req, res, next));

  // Incident Types
  router.post('/incidentTypes', (req, res, next) =>
    (incidentTypeController as any).createIncidentType(req, res, next));
  router.get('/incidentTypes', (req, res, next) =>
    (incidentTypeController as any).getAll(req, res, next));
  router.get('/incidentTypes/:id', (req, res, next) =>
    (incidentTypeController as any).getById(req, res, next));
  router.put('/incidentTypes/:id', (req, res, next) =>
    (incidentTypeController as any).updateIncidentType(req, res, next));

  // Planned Operations (US 4.1.4)
  router.post('/plannedOperations', (req, res, next) =>
    (plannedOperationController as any).createPlannedOperation(req, res, next));
  router.get('/plannedOperations/plan/:planId', (req, res, next) =>
    (plannedOperationController as any).getByOperationPlan(req, res, next));
  router.get('/plannedOperations/:id', (req, res, next) =>
    (plannedOperationController as any).getById(req, res, next));
  router.put('/plannedOperations/:id', (req, res, next) =>
    (plannedOperationController as any).updatePlannedOperation(req, res, next));


  return router;
};