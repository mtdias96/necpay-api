import { Category } from '@application/entities/Category';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound ';
import { CategoryRepository } from '@infra/database/drizzle/repositories/CategoryRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) { }

  async execute({
    storeId,
    categoryId,
  }: GetCategoryByIdUseCase.Input): Promise<GetCategoryByIdUseCase.Output> {
    const category = await this.categoryRepository.findById(categoryId, storeId);

    if (!category) {
      throw new ResourceNotFound('category not found.');
    }

    return {
      category,
    };

  }
}

export namespace GetCategoryByIdUseCase {
  export type Input = {
    storeId: string,
    categoryId: string,
  };

  export type Output = {
    category: Category
  }
}
