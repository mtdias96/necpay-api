import { Controller } from '@application/contracts/Controller';
import { Product } from '@application/entities/Product';
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
    const { name, file } = body;

    const inputType: Product.InputType = Product.InputType.PICTURE;

    const { categoryId, uploadSignature } = await this.createCategoryUseCase.execute({ name, storeId, file: {
      inputType,
      size: file.size,
    } });

    return {
      statusCode: 201,
      body: {
        categoryId,
        uploadSignature,
      },
    };
  }

}

export namespace CreateCategoryController {
  export type Response = {
    categoryId: string;
    uploadSignature: string;
  }
}
