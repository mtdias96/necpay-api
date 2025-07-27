import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { ProductResponseType } from '@shared/types/Product';
import { SQL, sql } from 'drizzle-orm';

@Injectable()
export class FilterProductsQuery {
  constructor(private readonly db: DrizzleClient) { }

  async execute({
    storeId,
    name,
    stockLow,
    categoryId,
  }: FilterProductsQuery.Input): Promise<FilterProductsQuery.Output> {
    const filters: SQL[] = [sql`product.store_id = ${storeId}`];

    if (name) {
      filters.push(sql`product.name ILIKE ${'%' + name + '%'}`);
    }

    if (categoryId) {
      filters.push(sql`product.category_id = ${categoryId}`);
    }

    if (stockLow) {
      filters.push(sql`product.current_stock <= product.stock_alert`);
    }

    const whereClause = sql.join(filters, sql` AND `);

    const result = await this.db.httpClient.execute(
      sql`SELECT * FROM products product WHERE ${whereClause}`,
    );

    const itemsProduct = result.rows as ProductResponseType[];

    if (!itemsProduct.length) {
      throw new Error('No products found for the specified store.');
    }

    return {
      products: itemsProduct.map(item => ({
        ...item,
      })),
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
  };

  export type Output = {
    products?: ProductResponseType[];
    total?: number;
    page?: number;
    limit?: number;
  };

}
