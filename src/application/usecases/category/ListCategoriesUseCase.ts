import { Category } from '@application/entities/Category';
import { FilterCategoryQuery } from '@application/query/FilterCategoryQuery copy';

import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListCategoriesUseCase {
  constructor(private readonly filterCategoryQuery: FilterCategoryQuery) {}

  async execute(input: ListCategoriesUseCase.Input): Promise<ListCategoriesUseCase.Output> {

    const result = await this.filterCategoryQuery.execute({
      storeId: input.storeId,
      page: input.page,
      limit: input.limit,
      order: input.order,
      name: input.name,
    });

    return {
      categories: result.categories,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }
}

export namespace ListCategoriesUseCase {
  export type Input = {
    storeId: string;
    name?: string;
    page: number;
    limit: number;
    order: 'asc' | 'desc';
  };

  export type Output = {
    categories: Category[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
