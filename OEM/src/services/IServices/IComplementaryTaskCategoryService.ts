import { ComplementaryTaskCategoryDTO } from "../../dto/ComplementaryTaskCategoryDTO";
import { CreateComplementaryTaskCategoryDTO } from "../../dto/ComplementaryTaskCategoryDTO";

export interface IComplementaryTaskCategoryService {
  create(dto: CreateComplementaryTaskCategoryDTO): Promise<ComplementaryTaskCategoryDTO>;
  getById(id: string): Promise<ComplementaryTaskCategoryDTO | null>;
  getByCode(code: string): Promise<ComplementaryTaskCategoryDTO | null>;
  getAll(): Promise<ComplementaryTaskCategoryDTO[]>;
}

