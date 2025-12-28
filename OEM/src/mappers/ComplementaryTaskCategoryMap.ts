import { ComplementaryTaskCategory } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategory";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { ComplementaryTaskCategoryCode } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryCode";
import { ComplementaryTaskCategoryName } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryName";
import { ComplementaryTaskCategoryDescription } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryDescription";

export class ComplementaryTaskCategoryMap {

  static toPersistence(category: ComplementaryTaskCategory): any {
    return {
      domainId: category.id.toString(),
      code: category.code.value,
      name: category.name.value,
      description: category.description.value
    };
  }

  static toDomain(raw: any): ComplementaryTaskCategory {
    const data = raw.toObject ? raw.toObject() : raw;

    const code = ComplementaryTaskCategoryCode.create(data.code).getValue();
    const name = ComplementaryTaskCategoryName.create(data.name).getValue();
    const description = ComplementaryTaskCategoryDescription.create(data.description).getValue();

    const categoryOrError = ComplementaryTaskCategory.create(
      {
        code,
        name,
        description
      },
      new UniqueEntityID(data.domainId)
    );

    if (categoryOrError.isFailure) {
      throw new Error(categoryOrError.errorValue().toString());
    }

    return categoryOrError.getValue();
  }
}
