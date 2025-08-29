import { Category } from '@application/entities/Category';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound ';
import { CategoryRepository } from '@infra/database/drizzle/repositories/CategoryRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) { }

  async execute({
    storeId,
    categoryId,
    categoryUpdate,
  }: UpdateCategoryUseCase.Input): Promise<UpdateCategoryUseCase.Output> {
    const categoryExits = await this.categoryRepository.findById(categoryId, storeId);

    if (!categoryExits) {
      throw new ResourceNotFound(`Category with id ${categoryId} not found for store ${storeId}`);
    }

    const updatedCategory = await this.categoryRepository.update({ categoryId, storeId, categoryUpdate });

    return { category: updatedCategory };

  }
}

export namespace UpdateCategoryUseCase {
  export type Input = {
    storeId: string,
    categoryId: string,
    categoryUpdate: Partial<{ name: string; icon_path: string, active: boolean }>
  };

  export type Output = {
    category: Category
  }
}
