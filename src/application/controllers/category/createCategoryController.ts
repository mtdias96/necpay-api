import { Controller } from '@application/contracts/Controller';
import { CreateCategoryUseCase } from '@application/usecases/category/CreateCategoryUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { createCategoryBody, createCategorySchema } from './schemas/createCategorySchema';

@Injectable()
@Schema(createCategorySchema)
export class CreateCategoryController extends Controller<'private', createCategoryController.Response> {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {
    super();
  }

  protected override async handle({ body }: Controller.Request<'private', createCategoryBody>): Promise<Controller.Response<createCategoryController.Response>> {
    const category = body;
    await this.createCategoryUseCase.execute(category);

    return {
      statusCode: 201,
    };
  }

}

export namespace createCategoryController {
  export type Response = null
}
