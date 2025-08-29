import { Controller } from '@application/contracts/Controller';
import { Category } from '@application/entities/Category';
import { UpdateCategoryUseCase } from '@application/usecases/category/UpdateCategoryUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { UpdateCategoryBody, updateCategorySchema } from './schemas/updateCategorySchema';

@Injectable()
@Schema(updateCategorySchema)
export class UpdateCategoryController extends Controller<'private', UpdateCategoryController.Response> {
  constructor(private readonly updateCategoryUseCase: UpdateCategoryUseCase) {
    super();
  }

  protected override async handle({ body, params, storeId }: Controller.Request<'private', UpdateCategoryBody>): Promise<Controller.Response<UpdateCategoryController.Response>> {
    const { categoryUpdate } = body;
    const { categoryId } = params as UpdateCategoryController.CategoryParams;

    const { category } = await this.updateCategoryUseCase.execute({ storeId, categoryId, categoryUpdate });

    return {
      statusCode: 201,
      body: {
        category,
      },
    };
  }

}

export namespace UpdateCategoryController {
  export type Response = {
    category: Category
  }

  export type CategoryParams = {
    categoryId: string
  };
}
