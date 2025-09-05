import { Controller } from '@application/contracts/Controller';
import { Product } from '@application/entities/Product';
import { CreateProductUseCase } from '@application/usecases/product/CreateProductUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import {
  createProductBody,
  createProductSchema,
} from './schemas/createProductSchema';

@Injectable()
@Schema(createProductSchema)
export class CreateProductController extends Controller<
  'private',
  CreateProductController.Response
> {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {
    super();
  }

  protected override async handle({
    body,
    storeId,

  }: Controller.Request<'private', createProductBody>): Promise<
    Controller.Response<CreateProductController.Response>
  > {
    const { file, product } =
      body;

    const inputType: Product.InputType = Product.InputType.PICTURE;

    const { productId, uploadSignature } = await this.createProductUseCase.execute(
      {
        storeId,
        product: {
          ...product,
          //Futuramente iremos ter barcode - até la será undefined.
          barcode: body.product.barcode ?? undefined,
        },
        file: {
          size: file.size,
          inputType,
        },
      },
    );

    return {
      statusCode: 201,
      body: {
        productId,
        uploadSignature,
      },
    };
  }
}

export namespace CreateProductController {
  export type Response = {
    productId: string;
    uploadSignature: string;
  }
}
