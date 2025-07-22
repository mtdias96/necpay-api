import { Product } from '@application/entities/Product';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { sql } from 'drizzle-orm';

@Injectable()
export class ListProductsQuery {
  constructor(private readonly db: DrizzleClient) { }

  async execute({ storeId }: ListProductsQuery.Input): Promise<ListProductsQuery.Output> {
    const result = await this.db.httpClient.execute(
      sql`
        SELECT
          product.id,
          product.store_id,
          product.category_id,
          product.status,
          product.name,
          product.price,
          product.cost_price,
          product.current_stock,
          product.stock_alert,
          product.image_path,
          product.barcode,
          product.description,
          product.created_at,
          product.updated_at
        FROM products product
        WHERE product.store_id = ${storeId}
        ORDER BY product.created_at DESC
      `,
    );

    const items: ListProductsQuery.ProductItemType[] = result.rows as ListProductsQuery.ProductItemType[];

    if (!items.length) {
      throw new Error('No products found for the specified store.');
    }

    return {
      products: items.map(item => ({
        ...item,
      })),
    };
  }
}

export namespace ListProductsQuery {
  export type Input = {
    storeId: string;
  };

  export type ProductItemType = {
    id: string;
    storeId: string;
    categoryId: string;
    status: Product.Status;
    inputType: Product.InputType;
    name: string;
    price: number;
    costPrice: number;
    currentStock: number;
    stockAlert: number;
    inputFileKey: string;
    barcode?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };

  export type Output = {
    products: ProductItemType[];
  };
}
