import { Controller } from '@application/contracts/Controller';
import { DeleteProductUseCase } from '@application/usecases/product/DeleteProductUseCase';

import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class DeleteProductController extends Controller<'private', DeleteProductController.Response> {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {
    super();
  }

  protected override async handle({ params, storeId }: Controller.Request<'private'>): Promise<Controller.Response<DeleteProductController.Response>> {
    const { productId } = params as DeleteProductController.ProductParams;

    await this.deleteProductUseCase.execute({ productId, storeId });

    return {
      statusCode: 201,
    };
  }

}

export namespace DeleteProductController {
  export type Response = {
    statusCode: number
  }

  export type ProductParams = {
    productId: string
  };
}
