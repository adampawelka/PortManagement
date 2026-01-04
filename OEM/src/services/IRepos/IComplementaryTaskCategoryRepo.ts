import { ComplementaryTaskCategory } from "../../Domain/ComplementaryTaskCategories/ComplementaryTaskCategory";
import { ComplementaryTaskCategoryId } from "../../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryId";

export interface IComplementaryTaskCategoryRepo {
  save(category: ComplementaryTaskCategory): Promise<void>;
  findById(id: ComplementaryTaskCategoryId): Promise<ComplementaryTaskCategory | null>;
  findByCode(code: string): Promise<ComplementaryTaskCategory | null>;
  findAll(): Promise<ComplementaryTaskCategory[]>;
  exists(id: ComplementaryTaskCategoryId): Promise<boolean>;
}
