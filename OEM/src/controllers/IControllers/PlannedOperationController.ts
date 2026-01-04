import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IPlannedOperationService } from "../../services/IServices/IPlannedOperationService";
import { CreatePlannedOperationDTO, UpdatePlannedOperationDTO } from "../../dto/PlannedOperationDTO";

@Service()
export default class PlannedOperationController {
  constructor(
      @Inject(config.services.plannedOperation.name) private plannedOpServiceInstance : IPlannedOperationService
  ) {}

  // POST: /plannedOperations
  public async createPlannedOperation(req: Request, res: Response, next: NextFunction) {
    try {
      const operationDTO = await this.plannedOpServiceInstance.create(req.body as CreatePlannedOperationDTO);
      return res.status(201).json(operationDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /plannedOperations/plan/:planId
  public async getByOperationPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const operationsDTO = await this.plannedOpServiceInstance.getByOperationPlanId(req.params.planId);
      return res.status(200).json(operationsDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /plannedOperations/:id
  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const operationDTO = await this.plannedOpServiceInstance.getById(req.params.id);
      if (!operationDTO) return res.status(404).send("Planned operation not found");
      return res.status(200).json(operationDTO);
    } catch (e) {
      return next(e);
    }
  };

  // PUT: /plannedOperations/:id (Para ajustes manuales de US 4.1.4)
  public async updatePlannedOperation(req: Request, res: Response, next: NextFunction) {
    try {
      const operationDTO = await this.plannedOpServiceInstance.update(req.params.id, req.body as UpdatePlannedOperationDTO);
      if (!operationDTO) return res.status(404).send("Planned operation not found");
      return res.status(200).json(operationDTO);
    } catch (e) {
      return next(e);
    }
  };
}