import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { ProductResponseType } from '@shared/types/Product';
import { sql } from 'drizzle-orm';
import { buildProductFilters } from './helpers/buildProductFilters';

@Injectable()
export class FilterProductsQuery {
  constructor(private readonly db: DrizzleClient) { }

   async execute(input: FilterProductsQuery.Input): Promise<FilterProductsQuery.Output> {
    const filters = buildProductFilters(input);

    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const offset = (page - 1) * limit;

    const orderByColumn = input.orderBy ?? 'created_at';
    const orderDirection = input.order ?? 'desc';

    const whereClause = sql.join(filters, sql` AND `);

    const [rows, totalResult] = await Promise.all([
      this.db.httpClient.execute(
        sql`
          SELECT * FROM products product
          WHERE ${whereClause}
          ORDER BY ${sql.identifier(orderByColumn)} ${sql.raw(orderDirection)}
          LIMIT ${limit} OFFSET ${offset}
        `,
      ),
      this.db.httpClient.execute(
        sql`
          SELECT COUNT(*)::int as total
          FROM products product
          WHERE ${whereClause}
        `,
      ),
    ]);

    return {
      products: rows.rows as ProductResponseType[],
      total: Number(totalResult.rows[0]?.total) | 0,
      page,
      limit,
    };
  }
}

export namespace FilterProductsQuery {
  export type Input = {
    storeId: string;
    name?: string;
    categoryId?: string;
    stockLow?: boolean;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    orderBy?: 'created_at' | 'name' | 'price';
  };

  export type Output = {
    products?: ProductResponseType[];
    total?: number;
    page?: number;
    limit?: number;
  };

}
