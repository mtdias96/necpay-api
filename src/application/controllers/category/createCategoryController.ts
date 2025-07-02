import { Controller } from '@application/contracts/Controller';
import { CreateCategoryUseCase } from '@application/usecases/category/CreateCategoryUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { createCategoryBody, createCategorySchema } from './schemas/createCategorySchema';

@Injectable()
@Schema(createCategorySchema)
export class CreateCategoryController extends Controller<'private', CreateCategoryController.Response> {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {
    super();
  }

  protected override async handle({ body, storeId }: Controller.Request<'private', createCategoryBody>): Promise<Controller.Response<CreateCategoryController.Response>> {
    const { name } = body;
    await this.createCategoryUseCase.execute({ name, storeId });

    return {
      statusCode: 201,
    };
  }

}

export namespace CreateCategoryController {
  export type Response = null
}
