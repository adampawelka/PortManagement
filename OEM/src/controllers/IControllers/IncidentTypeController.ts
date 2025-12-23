import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IIncidentTypeService } from "../../services/IServices/IIncidentTypeService";
import { CreateIncidentTypeDTO, UpdateIncidentTypeDTO } from "../../dto/IncidentTypeDTO";

@Service()
export default class IncidentTypeController {
  constructor(
      @Inject(config.services.incidentType.name) private incidentTypeServiceInstance : IIncidentTypeService
  ) {}

  // POST: /incidentTypes (US 4.1.12)
  public async createIncidentType(req: Request, res: Response, next: NextFunction) {
    try {
      const typeDTO = await this.incidentTypeServiceInstance.create(req.body as CreateIncidentTypeDTO);
      return res.status(201).json(typeDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /incidentTypes/:id
  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const typeDTO = await this.incidentTypeServiceInstance.getById(req.params.id);
      if (!typeDTO) return res.status(404).send("Incident type not found");
      return res.status(200).json(typeDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /incidentTypes (Para el listado en el SPA)
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const typesDTO = await this.incidentTypeServiceInstance.getAll();
      return res.status(200).json(typesDTO);
    } catch (e) {
      return next(e);
    }
  };

  // PUT: /incidentTypes/:id
  public async updateIncidentType(req: Request, res: Response, next: NextFunction) {
    try {
      const typeDTO = await this.incidentTypeServiceInstance.update(req.params.id, req.body as UpdateIncidentTypeDTO);
      if (!typeDTO) return res.status(404).send("Incident type not found");
      return res.status(200).json(typeDTO);
    } catch (e) {
      return next(e);
    }
  };
}