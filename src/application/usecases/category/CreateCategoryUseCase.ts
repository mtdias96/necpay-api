import { Category } from '@application/entities/Category';
import { NameStoreAlreadyInUse } from '@application/errors/application/NameStoreAlreadyInUse';
import { CategoryRepository } from '@infra/database/drizzle/repositories/CategoryRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) { }

  async execute({ name, storeId, iconPath }: CreateCategoryUseCase.Input): Promise<void> {
    const categoryAlreadyExists = await this.categoryRepository.findByName(name);

    if (categoryAlreadyExists) {
      throw new NameStoreAlreadyInUse();
    }

    const category = new Category({
      name,
      storeId,
      iconPath,
    });

    await this.categoryRepository.create(category);
  }
}

export namespace CreateCategoryUseCase {
  export type Input = {
    storeId: string;
    name: string;
    iconPath?: string;
  }
}
