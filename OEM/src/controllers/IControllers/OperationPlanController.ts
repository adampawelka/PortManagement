import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IOperationPlanService } from "../../services/IServices/IOperationPlanService";
import { CreateOperationPlanDTO, UpdateOperationPlanDTO, SearchOperationPlanDTO } from "../../dto/OperationPlanDTO";

@Service()
export default class OperationPlanController {
  constructor(
      // Inyectamos el servicio usando la etiqueta definida en vuestro sistema de carga (loaders)
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

  // GET: /operationPlans/vvn/:vvnId
  public async getByVvn(req: Request, res: Response, next: NextFunction) {
    try {
      const planDTO = await this.operationPlanServiceInstance.getByVvnId(req.params.vvnId);

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

  // GET: /operationPlans/search
  public async search(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        dateStart,
        dateEnd,
        operationDateStart,
        operationDateEnd,
        vesselName,
        vvnId,
        sortBy,
        sortOrder
      } = req.query;

      const searchDTO: SearchOperationPlanDTO = {
        dateStart: dateStart as string | undefined,
        dateEnd: dateEnd as string | undefined,
        operationDateStart: operationDateStart as string | undefined,
        operationDateEnd: operationDateEnd as string | undefined,
        vesselName: vesselName as string | undefined,
        vvnId: vvnId as string | undefined,
        sortBy: sortBy as 'startTime' | 'vesselName' | 'delay' | 'createdAt' | undefined,
        sortOrder: (sortOrder as 'asc' | 'desc') || 'asc'
      };

      const plansDTO = await this.operationPlanServiceInstance.search(searchDTO);
      return res.status(200).json(plansDTO);
    } catch (e) {
      return next(e);
    }
  }
}