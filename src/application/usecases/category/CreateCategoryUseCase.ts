import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/Injectable';
import { ListCategoriesUseCase } from './ListCategoriesUseCase';

@Injectable()
export class ListCategoryController extends Controller<'private', ListCategoryController.Response> {
  constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {
    super();
  }

  async handle({ storeId, queryParams }: Controller.Request<'private'>): Promise<Controller.Response<ListCategoryController.Response>> {
    const {
      name,
      page = 1,
      limit = 10,
      order = 'asc',
    } = queryParams as ListCategoryController.CategoryParams;

    const result = await this.listCategoriesUseCase.execute({
      storeId,
      page: Math.max(1, page),
      limit: Math.min(limit, 100),
      order,
      name,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace ListCategoryController {
  export type Response = ListCategoriesUseCase.Output;

  export type CategoryParams = {
    name?: string;
    page: number;
    limit: number;
    order: 'asc' | 'desc';
  };
}
