import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IOperationPlanService } from "../../services/IServices/IOperationPlanService";
import { CreateOperationPlanDTO, UpdateOperationPlanDTO, SearchOperationPlanDTO } from "../../dto/OperationPlanDTO";

@Service()
export default class OperationPlanController {
  constructor(
      @Inject(config.services.operationPlan.name) 
      private operationPlanServiceInstance: IOperationPlanService
  ) {}

  public async createOperationPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await this.operationPlanServiceInstance.create(req.body as CreateOperationPlanDTO);
      return res.status(201).json(plan);
    } catch (e) { return next(e); }
  }

  public async saveOperationPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const { plans, metadata } = req.body;
      
      if (!Array.isArray(plans) || plans.length === 0) {
        return res.status(400).json({ message: "Plans array is required and cannot be empty" });
      }  

      const savedPlans = [];
      for (const planDto of plans) {
        const enhancedDto = {
          ...planDto,
          algorithmUsed: planDto.algorithmUsed || metadata?.algorithmUsed || "unknown",
          createdBy: planDto.createdBy || metadata?.createdBy || "system",
          createdAt: planDto.createdAt || new Date()
        };
        
        const plan = await this.operationPlanServiceInstance.create(enhancedDto);
        savedPlans.push(plan);
      }
      
      return res.status(201).json({
        message: `Successfully saved ${savedPlans.length} operation plans`,
        count: savedPlans.length,
        plans: savedPlans
      });
    } catch (e) { 
      return next(e); 
    }
  }

  public async getOperationPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await this.operationPlanServiceInstance.getById(req.params.id);
      if (!plan) return res.status(404).send("Operational plan not found");
      return res.status(200).json(plan);
    } catch (e) { return next(e); }
  }

  public async getByVvn(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await this.operationPlanServiceInstance.getByVvnId(req.params.vvnId);
      if (!plan) return res.status(404).send("No plan for that visit");
      return res.status(200).json(plan);
    } catch (e) { return next(e); }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await this.operationPlanServiceInstance.getAll();
      return res.status(200).json(plans);
    } catch (e) { return next(e); }
  }

  public async updateOperationPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await this.operationPlanServiceInstance.update(req.params.id, req.body as UpdateOperationPlanDTO);
      if (!plan) return res.status(404).send("Plan not found to update");
      return res.status(200).json(plan);
    } catch (e) { return next(e); }
  }

  public async search(req: Request, res: Response, next: NextFunction) {
    try {
      const parseDate = (value?: string | string[]) => value ? new Date(value.toString()) : undefined;

      const searchDTO: SearchOperationPlanDTO = {
        dateStart: parseDate(req.query.dateStart as string),
        dateEnd: parseDate(req.query.dateEnd as string),
        operationDateStart: parseDate(req.query.operationDateStart as string),
        operationDateEnd: parseDate(req.query.operationDateEnd as string),
        vesselName: req.query.vesselName as string | undefined,
        vvnId: req.query.vvnId as string | undefined,
        sortBy: req.query.sortBy as 'startTime' | 'vesselName' | 'delay' | 'createdAt' | undefined,
        sortOrder: req.query.sortOrder === 'desc' ? 'desc' : 'asc'
      };

      const plans = await this.operationPlanServiceInstance.search(searchDTO);
      return res.status(200).json(plans);
    } catch (e) { return next(e); }
  }
  
  public async getMissingPlans(req: Request, res: Response, next: NextFunction) {
    try {
      // Esperamos la fecha como query param: /missing?date=2025-12-23
      const date = req.query.date as string;
      
      if (!date) {
        return res.status(400).send("Date query parameter is required");
      }

      const result = await this.operationPlanServiceInstance.getMissingPlans(date);
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }

}
