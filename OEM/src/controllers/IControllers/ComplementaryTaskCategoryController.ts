import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { IComplementaryTaskCategoryService } from "../../services/IServices/IComplementaryTaskCategoryService";
import { CreateComplementaryTaskCategoryDTO } from "../../dto/ComplementaryTaskCategoryDTO";

@Service()
export default class ComplementaryTaskCategoryController {
  constructor(
      @Inject(config.services.complementaryTaskCategory.name) private categoryServiceInstance : IComplementaryTaskCategoryService
  ) {}

  // POST: /complementaryTaskCategories
  public async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryDTO = await this.categoryServiceInstance.create(req.body as CreateComplementaryTaskCategoryDTO);
      return res.status(201).json(categoryDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /complementaryTaskCategories/:id
  public async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryDTO = await this.categoryServiceInstance.getById(req.params.id);
      if (!categoryDTO) return res.status(404).send("Category not found");
      return res.status(200).json(categoryDTO);
    } catch (e) {
      return next(e);
    }
  };

  // GET: /complementaryTaskCategories
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categoriesDTO = await this.categoryServiceInstance.getAll();
      return res.status(200).json(categoriesDTO);
    } catch (e) {
      return next(e);
    }
  };
}