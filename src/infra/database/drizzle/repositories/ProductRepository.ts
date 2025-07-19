import { Product } from '@application/entities/Product';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { productsTable } from '../schema/product';

@Injectable()
export class ProductRepository {
  constructor(private readonly db: DrizzleClient) { }

  async create(product: Product): Promise<void> {
    // await this.db.httpClient.insert(productsTable).values({
    //   ...product,
    //   price: product.price.toString(),
    //   costPrice: product.costPrice.toString(),
    // });

    await this.db.httpClient.insert(productsTable).values({
      id: product.id,
      storeId: product.storeId,
      categoryId: product.categoryId,
      name: product.name,
      inputFileKey: product.inputFileKey,
      barcode: product.barcode,
      price: product.price.toString(),
      costPrice: product.costPrice.toString(),
      stockAlert: product.stockAlert,
      currentStock: product.currentStock,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });

  }
}
