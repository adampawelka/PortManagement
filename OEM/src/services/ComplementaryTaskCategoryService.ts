import { IComplementaryTaskCategoryService } from "./IServices/IComplementaryTaskCategoryService";
import { IComplementaryTaskCategoryRepo } from "./IRepos/IComplementaryTaskCategoryRepo";

import {
    ComplementaryTaskCategoryDTO,
    CreateComplementaryTaskCategoryDTO
} from "../dto/ComplementaryTaskCategoryDTO";

import { ComplementaryTaskCategory } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategory";
import { ComplementaryTaskCategoryCode } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryCode";
import { ComplementaryTaskCategoryName } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryName";
import { ComplementaryTaskCategoryDescription } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryDescription";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { ComplementaryTaskCategoryId } from "../Domain/ComplementaryTaskCategories/ComplementaryTaskCategoryId";


export class ComplementaryTaskCategoryService
    implements IComplementaryTaskCategoryService {

    constructor(
        private readonly categoryRepo: IComplementaryTaskCategoryRepo
    ) { }

    async create(
        dto: CreateComplementaryTaskCategoryDTO
    ): Promise<ComplementaryTaskCategoryDTO> {

        const existing = await this.categoryRepo.findByCode(dto.code);
        if (existing) {
            throw new Error("ComplementaryTaskCategory with this code already exists");
        }

        const code = ComplementaryTaskCategoryCode.create(dto.code).getValue();
        const name = ComplementaryTaskCategoryName.create(dto.name).getValue();
        const description =
            ComplementaryTaskCategoryDescription.create(dto.description).getValue();

        const categoryOrError = ComplementaryTaskCategory.create({
            code,
            name,
            description
        });

        if (categoryOrError.isFailure) {
            throw new Error(categoryOrError.errorValue().toString());
        }

        const category = categoryOrError.getValue();
        await this.categoryRepo.save(category);

        return this.toDTO(category);
    }

    async getById(
        id: string
    ): Promise<ComplementaryTaskCategoryDTO | null> {

        const categoryId =
            ComplementaryTaskCategoryId.create(
                new UniqueEntityID(id)
            );

        const category = await this.categoryRepo.findById(categoryId);

        if (!category) return null;

        return this.toDTO(category);
    }

    async getByCode(
        code: string
    ): Promise<ComplementaryTaskCategoryDTO | null> {

        const category = await this.categoryRepo.findByCode(code);

        if (!category) return null;

        return this.toDTO(category);
    }

    async getAll(): Promise<ComplementaryTaskCategoryDTO[]> {
        const categories = await this.categoryRepo.findAll();
        return categories.map(category => this.toDTO(category));
    }

    private toDTO(
        category: ComplementaryTaskCategory
    ): ComplementaryTaskCategoryDTO {
        return {
            id: category.id.toString(),
            code: category.code.value,
            name: category.name.value,
            description: category.description.value
        };
    }
}
