import { Controller } from '@application/contracts/Controller';
import { FilterProductsQuery } from '@application/query/FilterProductsQuery';
import { Injectable } from '@kernel/decorators/Injectable';
import { ProductResponseType } from '@shared/types/Product';

@Injectable()
export class ListProductsController extends Controller<'private', ListProductsController.Response> {
  constructor(private readonly filterProductsQuery: FilterProductsQuery) {
    super();
  }

  async handle({ storeId, queryParams }: Controller.Request<'private'>): Promise<Controller.Response<ListProductsController.Response>> {
    const { products } = await this.filterProductsQuery.execute({
      storeId,
      ...queryParams, // Filtros opcionais
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
    products: ProductResponseType[] | undefined;
  }
}
