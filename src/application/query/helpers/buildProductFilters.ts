import { SQL, sql } from 'drizzle-orm';
import { FilterProductsQuery } from '../FilterProductsQuery';

export function buildProductFilters(input: FilterProductsQuery.Input): SQL[] {
  const filters: SQL[] = [sql`product.store_id = ${input.storeId}`];

  if (input.name) {
    filters.push(sql`product.name ILIKE ${'%' + input.name + '%'}`);
  }

  if (input.categoryId) {
    filters.push(sql`product.category_id = ${input.categoryId}`);
  }

  if (input.stockLow) {
    filters.push(sql`product.current_stock <= product.stock_alert`);
  }

  return filters;
}
