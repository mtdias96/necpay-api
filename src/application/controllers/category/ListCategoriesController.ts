import { Controller } from '@application/contracts/Controller';
import { Category } from '@application/entities/Category';
import { FilterCategoryQuery } from '@application/query/FilterCategoryQuery copy';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListCategoryController extends Controller<'private', ListCategoryController.Response> {
  constructor(private readonly filterCategoryQuery: FilterCategoryQuery) {
    super();
  }

  async handle({ storeId, queryParams }: Controller.Request<'private'>): Promise<Controller.Response<ListCategoryController.Response>> {
    const {
      name,
      page = 1,
      limit = 10,
      order = 'asc',
    } = queryParams as ListCategoryController.CategoryParams;

  const result = await this.filterCategoryQuery.execute({
    storeId,
    page: Math.max(1, page),
    limit: Math.min(limit, 100),
    order,
    name,
  });

  return {
    statusCode: 200,
    body: {
      categories: result.categories,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    },
  };

  }
}
export namespace ListCategoryController {
  export type Response = {
    categories: Category[] | undefined;
    meta: {
      total: number,
      page: number,
      limit: number,
      totalPages: number,
    },
  }

  export type CategoryParams = {
    name?: string;
    page: number;
    limit: number;
    order : 'asc' | 'desc'
  }
}
