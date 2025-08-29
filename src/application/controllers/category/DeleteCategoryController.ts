import { Controller } from '@application/contracts/Controller';
import { DeleteCategoryUseCase } from '@application/usecases/category/DeleteCategoryUseCase';

import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class DeleteCategoryController extends Controller<'private', DeleteCategoryController.Response> {
  constructor(private readonly deleteCategoryUseCase: DeleteCategoryUseCase) {
    super();
  }

  protected override async handle({ params, storeId }: Controller.Request<'private'>): Promise<Controller.Response<DeleteCategoryController.Response>> {
    const { categoryId } = params as DeleteCategoryController.CategoryParams;

     await this.deleteCategoryUseCase.execute({ categoryId, storeId });

    return {
      statusCode: 201,
    };
  }

}

export namespace DeleteCategoryController {
  export type Response = {
    statusCode: number
  }

  export type CategoryParams = {
    categoryId: string
  };
}
