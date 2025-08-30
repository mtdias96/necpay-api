import { Category } from '@application/entities/Category';
import { CategoryRepository } from '@infra/database/drizzle/repositories/CategoryRepository';
import { CategoryFileStorageGateway } from '@infra/gateways/CategoryFileStorageGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly categoryFileStorageGateway: CategoryFileStorageGateway,
  ) { }

  async execute({ name, storeId, file }: CreateCategoryUseCase.Input): Promise<CreateCategoryUseCase.Output> {

    const inputFileKey = CategoryFileStorageGateway.generateInputFileKey({
      storeId,
      inputType: file.inputType,
    });

    const category = new Category({
      name,
      storeId,
      iconPath: inputFileKey,
    });

    const [, { uploadSignature }] = await Promise.all([
      this.categoryRepository.create(category),
      this.categoryFileStorageGateway.createPOST({
        categoryId: category.id,
        file: {
          key: inputFileKey,
          size: file.size,
          inputType: file.inputType,
        },
      }),
    ]);;

    return {
      categoryId: category.id,
      uploadSignature,
      category: {
        id: category.id,
        name: category.name,
        storeId: category.storeId,
        iconPath: category.iconPath as string,
      },
    };
  }
}

export namespace CreateCategoryUseCase {
  export type Input = {
    storeId: string;
    name: string;
    file: {
      inputType: string;
      size: number;
    }
  }
  export type Output = {
    categoryId: string;
    uploadSignature: any;
    category: {
      id: string;
      name: string;
      storeId: string;
      iconPath: string;
    };
  };
}
