import { Controller } from '@application/contracts/Controller';
import { Product } from '@application/entities/Product';
import { GetProductByIdUseCase } from '@application/usecases/product/GetProductByIdUseCase';

import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class GetProductByIdController extends Controller<'private', GetProductByIdController.Response> {
  constructor(private readonly getProductByIdUseCase: GetProductByIdUseCase) {
    super();
  }

  async handle({ storeId, params }: GetProductByIdController.Request): Promise<Controller.Response<GetProductByIdController.Response>> {
    const { productId } = params;

    const { product } = await this.getProductByIdUseCase.execute({
      storeId,
      productId,
    });

    return {
      statusCode: 200,
      body: {
        product,
      },
    };
  }
}

export namespace GetProductByIdController {
  export type Params = {
    productId: string;
  }

  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    GetProductByIdController.Params
  >;

  export type Response = {
    product: {
      id: string;
      storeId: string;
      categoryId: string;
      status: Product.Status;
      inputType: Product.InputType;
      name: string;
      price: number;
      costPrice: number;
      currentStock: number;
      stockAlert: number;
      inputFileKey: string;
      barcode?: string;
      description?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
  }
}
