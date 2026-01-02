import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IOperationPlanService } from "../../services/IServices/IOperationPlanService";
import { CreateOperationPlanDTO, UpdateOperationPlanDTO } from "../../dto/OperationPlanDTO";

@Service()
export default class OperationPlanController {
  constructor(
      @Inject(config.services.operationPlan.name) private operationPlanServiceInstance : IOperationPlanService
  ) {}

  // POST: /operationPlans
  public async createOperationPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const planOrError = await this.operationPlanServiceInstance.create(req.body as CreateOperationPlanDTO);

      if (planOrError === null) {
        return res.status(400).send("Failed to create operational plan");
      }

      return res.status(201).json(planOrError);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /operationPlans/:id
  public async getOperationPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const planDTO = await this.operationPlanServiceInstance.getById(req.params.id);

      if (planDTO === null) {
        return res.status(404).send("Operational plan not found");
      }

      return res.status(200).json(planDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /operationPlans/vve/:vveId
  public async getByVesselVisitExecution(req: Request, res: Response, next: NextFunction) {
    try {
      const planDTO = await this.operationPlanServiceInstance.getByvesselVisitExecutionId(req.params.vveId);

      if (planDTO === null) {
        return res.status(404).send("There isn't operational plan for that visit");
      }

      return res.status(200).json(planDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /operationPlans
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const plansDTO = await this.operationPlanServiceInstance.getAll();
      return res.status(200).json(plansDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /operationPlans/missing
  public async getMissingPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const missingPlansDTO = await this.operationPlanServiceInstance.getMissingPlans();
      return res.status(200).json(missingPlansDTO);
    } catch (e) {
      return next(e);
    }
  };

  // PUT/PATCH: /operationPlans/:id
  public async updateOperationPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const planDTO = await this.operationPlanServiceInstance.update(req.params.id, req.body as UpdateOperationPlanDTO);

      if (planDTO === null) {
        return res.status(404).send("Plan no encontrado para actualizar");
      }

      return res.status(200).json(planDTO);
    } catch (e) {
      return next(e);
    }
  };
}