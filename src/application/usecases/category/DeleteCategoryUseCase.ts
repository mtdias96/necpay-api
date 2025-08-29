
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound ';
import { CategoryRepository } from '@infra/database/drizzle/repositories/CategoryRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute({
    storeId,
    categoryId,
  }: DeleteCategoryUseCase.Input): Promise<void> {
    const categoryExists = await this.categoryRepository.findById(categoryId, storeId);

    if (!categoryExists) {
      throw new ResourceNotFound(
        `Category with id ${categoryId} not found for store ${storeId}`,
      );
    }

    await this.categoryRepository.delete(categoryId, storeId);
  }
}

export namespace DeleteCategoryUseCase {
  export type Input = {
    storeId: string;
    categoryId: string;
  };
}
