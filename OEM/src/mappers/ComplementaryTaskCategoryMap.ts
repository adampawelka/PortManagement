import { ComplementaryTaskCategory } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategory";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class ComplementaryTaskCategoryMap {

  static toPersistence(category: ComplementaryTaskCategory): any {
    return {
      domainId: category.categoryId.toString(),
      code: category.code.value,
      name: category.name.value,
      description: category.description.value
    };
  }

  static toDomain(raw: any): ComplementaryTaskCategory {
    const data = raw.toObject ? raw.toObject() : raw;

    const categoryOrError = ComplementaryTaskCategory.create(
      {
        code: data.code,
        name: data.name,
        description: data.description
      },
      new UniqueEntityID(data.domainId)
    );

    if (categoryOrError.isFailure) {
      throw new Error(categoryOrError.errorValue().toString());
    }

    return categoryOrError.getValue();
  }
}
