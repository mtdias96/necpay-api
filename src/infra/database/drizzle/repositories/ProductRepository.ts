import { Product } from '@application/entities/Product';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { and, eq, inArray, InferSelectModel, SQL, sql } from 'drizzle-orm';
import { productsTable } from '../schema/product';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

export type ProductDb = InferSelectModel<typeof productsTable>;

@Injectable()
export class ProductRepository {
  constructor(private readonly db: DrizzleClient) { }

  async create(trx: UnitOfWorkTransaction, product: Product): Promise<void> {
    const transaction = trx;
    await transaction.insert(productsTable).values({
      ...product,
      price: product.price.toString(),
      costPrice: product.costPrice.toString(),
    });
  }

  async findById(
    storeId: string,
    productId: string,
  ): Promise<ProductDb | null> {
    const result = await this.db.httpClient
      .select()
      .from(productsTable)
      .where(
        and(
          eq(productsTable.id, productId),
          eq(productsTable.storeId, storeId),
        ),
      );

    return result[0] ?? null;
  }

  async findByName(storeId: string, name: string): Promise<ProductDb | null> {
    const result = await this.db.httpClient
      .select()
      .from(productsTable)
      .where(
        and(eq(productsTable.name, name), eq(productsTable.storeId, storeId)),
      );

    return result[0] ?? null;
  }

  async findProductStockByIds(storeId: string, productId: string[]): Promise<{
    name: string;
    id: string;
    currentStock: number;
    price: string;
  }[]> {
    const result = await this.db.httpClient
      .select({
        name: productsTable.name,
        id: productsTable.id,
        currentStock: productsTable.currentStock,
        price: productsTable.price,
      })
      .from(productsTable)
      .where(
        and(
          inArray(productsTable.id, productId),
          eq(productsTable.storeId, storeId),
        ),
      );

    return result;
  }

  async updateCurrentStock(
    storeId: string,
    items: { productId: string; quantity: number }[],
    trx: UnitOfWorkTransaction,
  ) {
    if (items.length === 0) { return; }

    const transaction = trx;
    const ids: string[] = [];
    const caseChunks: SQL[] = [];

    caseChunks.push(sql`CASE`);

    for (const item of items) {
      ids.push(item.productId);
      caseChunks.push(
        sql`WHEN ${productsTable.id} = ${item.productId} THEN ${item.quantity}`,
      );
    }

    caseChunks.push(sql`ELSE 0 END`);

    const caseExpression = sql.join(caseChunks, sql.raw(' '));

    await transaction
      .update(productsTable)
      .set({
        currentStock: sql`${productsTable.currentStock} - ${caseExpression}`,
      })
      .where(
        and(
          inArray(productsTable.id, ids),
          eq(productsTable.storeId, storeId),
        ),
      );
  }

}
