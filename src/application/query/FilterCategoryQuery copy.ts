import { Category } from '@application/entities/Category';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { TCategory } from '@infra/database/drizzle/schema/categories';
import { Injectable } from '@kernel/decorators/Injectable';
import { SQL, sql } from 'drizzle-orm';

@Injectable()
export class FilterCategoryQuery {
  constructor(private readonly db: DrizzleClient) { }

  async execute({
    storeId,
    name,
    page,
    limit,
    order = 'asc',
  }: FilterCategoryQuery.Input): Promise<FilterCategoryQuery.Output> {

    if (!storeId) {
      throw new Error('StoreId is required');
    }

    const filters: SQL[] = [sql`c.store_id = ${storeId}`];

    if (name && name.trim() !== '') {
      filters.push(sql`c.name ILIKE ${`%${name.trim()}%`}`);
    }

    const whereClause = sql.join(filters, sql` AND `);
    const limitClause = limit ? sql`LIMIT ${limit}` : sql``;
    const offsetClause = page && limit ? sql`OFFSET ${(page - 1) * limit}` : sql``;
    const orderDirection = order === 'desc' ? sql`DESC` : sql`ASC`;

    const query = sql`
      WITH filtered_data AS (
        SELECT c.*, COUNT(*) OVER() as total_count
        FROM categories c
        WHERE ${whereClause}
        ORDER BY c.name ${orderDirection}
        ${limitClause} ${offsetClause}
      )
      SELECT
        id,
        name,
        store_id,
        icon_path,
        active,
        created_at,
        COALESCE(total_count, 0) as total_count
      FROM filtered_data
    `;

    const result = await this.db.httpClient.execute(query);
    const rows = result.rows as (TCategory & { total_count: number })[];

    if (!rows.length) {
      return {
        categories: [],
        total: 0,
        page: page,
        limit: limit,
        totalPages: 0,
      };
    }

    const total = Number(rows[0].total_count);
    const totalPages = Math.ceil(total / limit);

    const categories = rows.map(row => new Category({
      id: row.id,
      name: row.name,
      storeId: row.storeId,
      active: row.active,
      iconPath: row.iconPath,

    }));

    return {
      categories,
      total,
      page: page,
      limit: limit,
      totalPages,
    };
  }
}

export namespace FilterCategoryQuery {
  export type Input = {
    storeId: string;
    name?: string;
    limit: number;
    page: number;
    order?: 'asc' | 'desc';
  };

  export type Output = {
    categories: Category[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
