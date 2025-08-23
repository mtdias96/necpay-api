import { DrizzleClient } from '@infra/clients/drizzleClient';
import { ordersTable } from '@infra/database/drizzle/schema/orders';

import { Injectable } from '@kernel/decorators/Injectable';
import { getDateRangeFromPeriod } from '@shared/utils/getDateRangeFromPeriod';
import { sql, SQL } from 'drizzle-orm';

@Injectable()
export class GetSalesByPeriodQuery {
  constructor(private readonly db: DrizzleClient) { }

  async execute({
    period,
    storeId,
    fromParam,
    toParam,
  }: GetSalesByPeriodQuery.Input): Promise<GetSalesByPeriodQuery.Result> {
    const { from, to } = getDateRangeFromPeriod(period, fromParam, toParam);

    const filters: SQL[] = [
      sql`${ordersTable.storeId} = ${storeId}`,
      sql`${ordersTable.createdAt} BETWEEN ${from} AND ${to}`,
      sql`${ordersTable.status} = 'completed'`,
    ];

    const whereClause = sql.join(filters, sql` AND `);

    const result = await this.db.httpClient.execute(
      sql`
        SELECT
          COUNT(*)::int AS "totalOrders",
          SUM(${ordersTable.total})::numeric AS "totalAmount",
          SUM(${ordersTable.totalItems})::int AS "totalItems"
        FROM ${ordersTable}
        WHERE ${whereClause}
      `,
    );

    return result.rows[0] as GetSalesByPeriodQuery.Result;
  }
}

export namespace GetSalesByPeriodQuery {
  export type Input = {
    storeId: string;
    period: 'day' | 'week' | 'month' | 'custom';
    fromParam?: string;
    toParam?: string;
  };

  export type Result = {
    totalOrders: number;
    totalAmount: string;
    totalItems: number;
  };
}
