import { Controller } from '@application/contracts/Controller';
import { UpdateProductUseCase } from '@application/usecases/product/UpdateProductUseCase';

import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { UpdateProductBody, updateProductSchema } from './schemas/updateProductSchema';

@Injectable()
@Schema(updateProductSchema)
export class UpdateProductController extends Controller<'private', UpdateProductController.Response> {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {
    super();
  }

  async handle({ params, storeId, body }: UpdateProductController.Request): Promise<Controller.Response<UpdateProductController.Response>> {
    const { productId } = params;
    const { productUpdate, fileUpdate } = body;

    const result = await this.updateProductUseCase.execute({
      storeId,
      productId,
      productUpdate,
      fileUpdate,
    });

    if (result?.uploadSignature) {
      return {
        statusCode: 200,
        body: {
          uploadSignature: result.uploadSignature,
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        message: 'Produto atualizado com sucesso',
      },
    };
  }
}

export namespace UpdateProductController {
  export type Params = {
    productId: string;
  }

  export type Request = Controller.Request<
    'private',
    UpdateProductBody,
    UpdateProductController.Params
  >;

  export type Response = {
    message?: string;
    uploadSignature?: string;
  }
}
