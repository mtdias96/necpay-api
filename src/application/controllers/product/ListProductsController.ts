import { Controller } from '@application/contracts/Controller';
import { Product } from '@application/entities/Product';
import { ListProductsQuery } from '@application/query/ListProductsQuery';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListProductsController extends Controller<'private', ListProductsController.Response> {
  constructor(private readonly listProductsQuery: ListProductsQuery) {
    super();
  }

  async handle({ storeId }: Controller.Request<'private'>): Promise<Controller.Response<ListProductsController.Response>> {
    const { products } = await this.listProductsQuery.execute({
      storeId,
    });

    return {
      statusCode: 200,
      body: {
        products,
      },
    };
  }
}

export namespace ListProductsController {
  export type Response = {
    products: {
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
    }[];
  }
}
