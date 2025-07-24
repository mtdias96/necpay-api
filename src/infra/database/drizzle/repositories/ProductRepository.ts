import { Product } from '@application/entities/Product';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { and, eq, InferSelectModel } from 'drizzle-orm';
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

  async findById(storeId: string, productId: string): Promise<ProductDb | null> {
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
        and(
          eq(productsTable.name, name),
          eq(productsTable.storeId, storeId),
        ),
      );

    return result[0] ?? null;
  }
}
