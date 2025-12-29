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

  // Add routes for other controllers as needed
  // You'll need to check each controller to see what methods they expose
  // and add routes accordingly

  return router;
};