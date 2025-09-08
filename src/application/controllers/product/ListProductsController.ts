import { Controller } from '@application/contracts/Controller';
import { FilterProductsQuery } from '@application/query/FilterProductsQuery';
import { Injectable } from '@kernel/decorators/Injectable';
import { ProductResponseType } from '@shared/types/Product';
import { filterSchema } from './schemas/filterSchema';

@Injectable()
export class ListProductsController extends Controller<'private', ListProductsController.Response> {
  constructor(private readonly filterProductsQuery: FilterProductsQuery) {
    super();
  }

  async handle({ storeId, queryParams }: Controller.Request<'private'>): Promise<Controller.Response<ListProductsController.Response>> {

    const params = filterSchema.parse(queryParams);

    const result = await this.filterProductsQuery.execute({
      storeId,
      ...params,
    });

    return {
      statusCode: 200,
      body: {
        data: result.products,
        meta: {
          limit: result.limit,
          page: result.page,
          total: result.total,
        },
      },
    };
  }
}

export namespace ListProductsController {
  export type Response = {
    data: ProductResponseType[] | undefined;
    meta: {
      total: number | undefined;
      page: number | undefined;
      limit: number | undefined;
    };
  };

  export type FilteredParams = {
    name?: string;
    categoryId?: string;
    stockLow?: boolean;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    orderBy?: 'created_at' | 'name' | 'price';
  };
}
