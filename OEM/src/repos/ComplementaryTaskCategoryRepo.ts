import { IComplementaryTaskCategoryRepo } from "../services/IRepos/IComplementaryTaskCategoryRepo";

import { ComplementaryTaskCategory } from "../domain/ComplementaryTaskCategories/ComplementaryTaskCategory";
import { ComplementaryTaskCategoryId } from "../domain/ComplementaryTaskCategories/ComplementaryTaskCategoryId";

import ComplementaryTaskCategorySchema from "../persistence/schemas/ComplementaryTaskCategorySchema";
import { ComplementaryTaskCategoryMap } from "../mappers/ComplementaryTaskCategoryMap";

export class ComplementaryTaskCategoryRepo
  implements IComplementaryTaskCategoryRepo {

  async save(category: ComplementaryTaskCategory): Promise<void> {
    const persistence = ComplementaryTaskCategoryMap.toPersistence(category);

    await ComplementaryTaskCategorySchema.findOneAndUpdate(
      { domainId: persistence.domainId },
      persistence,
      { upsert: true, new: true }
    );
  }

  async findById(
    id: ComplementaryTaskCategoryId
  ): Promise<ComplementaryTaskCategory | null> {

    const doc = await ComplementaryTaskCategorySchema.findOne({
      domainId: id.toString()
    });

    if (!doc) return null;

    return ComplementaryTaskCategoryMap.toDomain(doc);
  }

  async findByCode(
    code: string
  ): Promise<ComplementaryTaskCategory | null> {

    const doc = await ComplementaryTaskCategorySchema.findOne({ code });

    if (!doc) return null;

    return ComplementaryTaskCategoryMap.toDomain(doc);
  }

  async findAll(): Promise<ComplementaryTaskCategory[]> {
    const docs = await ComplementaryTaskCategorySchema.find();

    return docs.map(doc => ComplementaryTaskCategoryMap.toDomain(doc));
  }


  async exists(
    id: ComplementaryTaskCategoryId
  ): Promise<boolean> {

    const count = await ComplementaryTaskCategorySchema.countDocuments({
      domainId: id.toString()
    });

    return count > 0;
  }
}
