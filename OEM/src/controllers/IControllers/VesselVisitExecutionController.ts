import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IVesselVisitExecutionService } from "../../services/IServices/IVesselVisitExecutionService";
import { CreateVesselVisitExecutionDTO, UpdateVesselVisitExecutionDTO, VveSearchCriteriaDTO } from "../../dto/VesselVisitExecutionDTO";

@Service()
export default class VesselVisitExecutionController {
  constructor(
    @Inject(config.services.vesselVisitExecution.name) private vveServiceInstance: IVesselVisitExecutionService
  ) { }

  // POST: /vesselVisitExecutions (US 4.1.7)
  public async createVVE(req: Request, res: Response, next: NextFunction) {
    try {
      // El sistema debe asignar automáticamente un identificador de VVE (US 4.1.7)
      // Status is automatically set to IN_PROGRESS on creation 
      const vveDTO = await this.vveServiceInstance.create(req.body as CreateVesselVisitExecutionDTO);

      if (vveDTO === null) {
        return res.status(400).send("Failed to register vessel arrival");
      }

      return res.status(201).json(vveDTO);
    } catch (e: any) {
      console.error(`[VesselVisitExecutionController] Error creating VVE:`, e.message);
      // Return error message to client for better UX
      const statusCode = e.message && e.message.includes('already exists') ? 409 : 500;
      return res.status(statusCode).json({
        message: e.message || "Failed to create vessel visit execution"
      });
    }
  };

  // GET: /vesselVisitExecutions/:id
  public async getVVE(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(`[VesselVisitExecutionController] getVVE called with ID: ${req.params.id}`);
      const vveDTO = await this.vveServiceInstance.getById(req.params.id);

      if (vveDTO === null) {
        console.log(`[VesselVisitExecutionController] VVE not found for ID: ${req.params.id}`);
        return res.status(404).send("Execution register not found");
      }

      console.log(`[VesselVisitExecutionController] Returning VVE DTO`);
      return res.status(200).json(vveDTO);
    } catch (e) {
      console.error(`[VesselVisitExecutionController] Error in getVVE:`, e);
      return next(e);
    }
  };

  // MODIFICADO: GET /vesselVisitExecutions (Soporta US 4.1.10 y getAll simple)
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Verificamos si hay query params para búsqueda
      const { dateStart, dateEnd, vesselName, status } = req.query;

      if (dateStart || dateEnd || vesselName || status) {
        // US 4.1.10: Búsqueda avanzada
        const criteria: VveSearchCriteriaDTO = {
          dateStart: dateStart as string,
          dateEnd: dateEnd as string,
          vesselName: vesselName as string,
          status: status as string
        };

        const results = await this.vveServiceInstance.search(criteria);
        return res.status(200).json(results);
      } else {
        // getAll original (sin filtros)
        const vvesDTO = await this.vveServiceInstance.getAll();
        return res.status(200).json(vvesDTO);
      }
    } catch (e) {
      return next(e);
    }
  };

  // PUT/PATCH: /vesselVisitExecutions/:id (US 4.1.8 y 4.1.11)
  public async updateVVE(req: Request, res: Response, next: NextFunction) {
    try {
      const vveDTO = await this.vveServiceInstance.update(req.params.id, req.body as UpdateVesselVisitExecutionDTO);

      if (vveDTO === null) {
        return res.status(404).send("Execution register not found");
      }

      return res.status(200).json(vveDTO);
    } catch (e) {
      return next(e);
    }
  };

  //4.1.11
  public async completeVVE(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.sub;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const result = await this.vveServiceInstance.completeVVE(
        req.params.id,
        {
          actualUnberthTime: req.body.actualUnberthTime,
          actualPortDepartureTime: req.body.actualPortDepartureTime,
          user: userId
        }
      );

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(400).json({
        message: e.message || "Failed to complete VVE"
      });
    }
  }

}

