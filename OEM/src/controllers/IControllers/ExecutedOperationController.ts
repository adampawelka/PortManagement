import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IExecutedOperationService } from "../../services/IServices/IExecutedOperationService";
import { CreateExecutedOperationDTO, UpdateExecutedOperationDTO } from "../../dto/ExecutedOperationDTO";

@Service()
export default class ExecutedOperationController {
  constructor(
      @Inject(config.services.executedOperation.name) private executedOpServiceInstance : IExecutedOperationService
  ) {}

  // POST: /executedOperations (US 4.1.9)
  public async createExecutedOperation(req: Request, res: Response, next: NextFunction) {
    try {
      const operationDTO = await this.executedOpServiceInstance.create(req.body as CreateExecutedOperationDTO);
      return res.status(201).json(operationDTO);
    } catch (e) {
      return next(e);
    }
  };

  // POST: /executedOperations/from-planned (NEW - US 4.1.9)
  public async createFromPlannedOperation(req: Request, res: Response, next: NextFunction) {
    try {
      const operationDTO = await this.executedOpServiceInstance.createFromPlannedOperation(req.body as CreateExecutedOperationDTO);
      return res.status(201).json(operationDTO);
    } catch (e) {
      return next(e);
    }
  };

  public async batchCreateFromPlannedOperations(req: Request, res: Response, next: NextFunction) {
    try {
      const { vesselVisitExecutionId, plannedOperationIds } = req.body;
      
      if (!vesselVisitExecutionId || !plannedOperationIds || !Array.isArray(plannedOperationIds)) {
        return res.status(400).json({ 
          error: "Missing required fields: vesselVisitExecutionId and plannedOperationIds (array)" 
        });
      }

      const operationsDTO = await this.executedOpServiceInstance.batchCreateFromPlannedOperations(
        vesselVisitExecutionId,
        plannedOperationIds
      );
      
      return res.status(201).json({
        message: `Created ${operationsDTO.length} executed operations`,
        operations: operationsDTO
      });
    } catch (e) {
      return next(e);
    }
  };

  // GET: /executedOperations/vve/:vveId (Para métricas de ejecución de US 4.1.10)
  public async getByVVE(req: Request, res: Response, next: NextFunction) {
    try {
      const operationsDTO = await this.executedOpServiceInstance.getByVesselVisitExecutionId(req.params.vveId);
      return res.status(200).json(operationsDTO);
    } catch (e) {
      return next(e);
    }
  };

  public async getAvailablePlannedOperations(req: Request, res: Response, next: NextFunction) {
    try {
      const plannedOperations = await this.executedOpServiceInstance.getAvailablePlannedOperationsForVVE(req.params.vveId);
      return res.status(200).json(plannedOperations);
    } catch (e) {
      return next(e);
    }
  };

  // PUT: /executedOperations/:id (Sincronización con estado de US 4.1.9)
  public async updateExecutedOperation(req: Request, res: Response, next: NextFunction) {
    try {
      const operationDTO = await this.executedOpServiceInstance.update(req.params.id, req.body as UpdateExecutedOperationDTO);
      if (!operationDTO) return res.status(404).send("Operation not executed");
      return res.status(200).json(operationDTO);
    } catch (e) {
      return next(e);
    }
  };

    public async batchUpdateExecutedOperations(req: Request, res: Response, next: NextFunction) {
    try {
      const updates = req.body;
      
      if (!Array.isArray(updates)) {
        return res.status(400).json({ 
          error: "Request body must be an array of { id: string, updates: UpdateExecutedOperationDTO }" 
        });
      }

      const results = [];
      
      for (const update of updates) {
        try {
          const operationDTO = await this.executedOpServiceInstance.update(update.id, update.updates);
          results.push({ 
            id: update.id, 
            success: true, 
            data: operationDTO 
          });
        } catch (error) {
          results.push({ 
            id: update.id, 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      return res.status(200).json({
        message: `Batch update completed. Successful: ${successful.length}, Failed: ${failed.length}`,
        successful,
        failed
      });
    } catch (e) {
      return next(e);
    }
  };
}