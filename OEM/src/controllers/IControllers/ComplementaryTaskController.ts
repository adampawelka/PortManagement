import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IComplementaryTaskService } from "../../services/IServices/IComplementaryTaskService";
import { CreateComplementaryTaskDTO, UpdateComplementaryTaskDTO } from "../../dto/ComplementaryTaskDTO";

@Service()
export default class ComplementaryTaskController {
  constructor(
      @Inject(config.services.complementaryTask.name) private taskServiceInstance : IComplementaryTaskService
  ) {}

  // POST: /complementaryTasks (US 4.1.15)
  public async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskDTO = await this.taskServiceInstance.create(req.body as CreateComplementaryTaskDTO);
      return res.status(201).json(taskDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /complementaryTasks/vve/:vveId
  public async getByVVE(req: Request, res: Response, next: NextFunction) {
    try {
      const tasksDTO = await this.taskServiceInstance.getByVesselVisitExecutionId(req.params.vveId);
      return res.status(200).json(tasksDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /complementaryTasks
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const tasksDTO = await this.taskServiceInstance.getAll();
      return res.status(200).json(tasksDTO);
    } catch (e) {
      return next(e);
    }
  };

  // PUT/PATCH: /complementaryTasks/:id
  public async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskDTO = await this.taskServiceInstance.update(req.params.id, req.body as UpdateComplementaryTaskDTO);
      if (!taskDTO) return res.status(404).send("Task not found");
      return res.status(200).json(taskDTO);
    } catch (e) {
      return next(e);
    }
  };
}