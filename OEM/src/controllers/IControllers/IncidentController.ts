import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IIncidentService } from "../../services/IServices/IIncidentService";
import { CreateIncidentDTO, UpdateIncidentDTO } from "../../dto/IncidentDTO";

@Service()
export default class IncidentController {
  constructor(
      @Inject(config.services.incident.name) private incidentServiceInstance : IIncidentService
  ) {}

  // POST: /incidents (US 4.1.13)
  public async createIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const incidentDTO = await this.incidentServiceInstance.create(req.body as CreateIncidentDTO);
      return res.status(201).json(incidentDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /incidents/:id
  public async getIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const incidentDTO = await this.incidentServiceInstance.getById(req.params.id);
      if (!incidentDTO) return res.status(404).send("Incident not found");
      return res.status(200).json(incidentDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /incidents (Para filtros por buque, fecha o severidad en SPA)
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const incidentsDTO = await this.incidentServiceInstance.getAll();
      return res.status(200).json(incidentsDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /incidents/type/:typeId
  public async getByIncidentType(req: Request, res: Response, next: NextFunction) {
    try {
      const incidentsDTO = await this.incidentServiceInstance.getByIncidentType(req.params.typeId);
      return res.status(200).json(incidentsDTO);
    } catch (e) {
      return next(e);
    }
  };

  // PUT: /incidents/:id (Para marcar resolución o actualizar impacto)
  public async updateIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const incidentDTO = await this.incidentServiceInstance.update(req.params.id, req.body as UpdateIncidentDTO);
      if (!incidentDTO) return res.status(404).send("Incident not found");
      return res.status(200).json(incidentDTO);
    } catch (e) {
      return next(e);
    }
  };
}