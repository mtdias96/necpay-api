import { Controller } from '@application/contracts/Controller';
import { Category } from '@application/entities/Category';
import { GetCategoryByIdUseCase } from '@application/usecases/category/GetCategoryByIdUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { createCategoryBody } from './schemas/createCategorySchema';

@Injectable()
export class GetCategoryByIdController extends Controller<'private', GetCategoryByIdController.Response> {
  constructor(private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase) {
    super();
  }

  protected override async handle({ storeId, params }: Controller.Request<'private', createCategoryBody>): Promise<Controller.Response<GetCategoryByIdController.Response>> {
    const { categoryId } = params as GetCategoryByIdController.CategoryParams;
    const { category } = await this.getCategoryByIdUseCase.execute({ storeId, categoryId });

    return {
      statusCode: 201,
      body: {
        category,
      },
    };
  }

}

export namespace GetCategoryByIdController {
  export type Response = {
    category: Category
  }

    export type CategoryParams = {
      categoryId: string
  };
}
