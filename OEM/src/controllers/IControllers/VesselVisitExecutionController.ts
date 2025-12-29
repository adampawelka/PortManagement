import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IVesselVisitExecutionService } from "../../services/IServices/IVesselVisitExecutionService";
import { CreateVesselVisitExecutionDTO, UpdateVesselVisitExecutionDTO } from "../../dto/VesselVisitExecutionDTO";

@Service()
export default class VesselVisitExecutionController {
  constructor(
      @Inject(config.services.vesselVisitExecution.name) private vveServiceInstance : IVesselVisitExecutionService
  ) {}

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
    } catch (e) {
      return next(e);
    }
  };

  // GET: /vesselVisitExecutions/:id
  public async getVVE(req: Request, res: Response, next: NextFunction) {
    try {
      const vveDTO = await this.vveServiceInstance.getById(req.params.id);

      if (vveDTO === null) {
        return res.status(404).send("Execution register not found");
      }

      return res.status(200).json(vveDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /vesselVisitExecutions (US 4.1.10)
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Nota: El servicio actual devuelve todos, pero para cumplir plenamente 
      // la US 4.1.10, el backend deberá soportar filtrado por fechas más adelante.
      const vvesDTO = await this.vveServiceInstance.getAll();
      return res.status(200).json(vvesDTO);
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
}