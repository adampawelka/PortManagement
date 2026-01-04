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
  router.get('/operationPlans', (req, res, next) =>
    (operationPlanController as any).getAll(req, res, next));
  router.get('/operationPlans/search', (req, res, next) =>
    (operationPlanController as any).search(req, res, next));
  router.get('/operationPlans/:id', (req, res, next) =>
    (operationPlanController as any).getOperationPlan(req, res, next));
  router.get('/operationPlans/vvn/:vvnId', (req, res, next) =>
    (operationPlanController as any).getByVvn(req, res, next));
  router.put('/operationPlans/:id', (req, res, next) =>
    (operationPlanController as any).updateOperationPlan(req, res, next));
  router.get('/operationPlans/resource-allocation', (req, res, next) =>
    (operationPlanController as any).getResourceAllocation(req, res, next)); 

  // Vessel Visit Executions
  router.post('/vesselVisitExecutions', (req, res, next) =>
    (vesselVisitExecutionController as any).createVVE(req, res, next));
  router.get('/vesselVisitExecutions', (req, res, next) =>
    (vesselVisitExecutionController as any).getAll(req, res, next));
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

  return router;
};