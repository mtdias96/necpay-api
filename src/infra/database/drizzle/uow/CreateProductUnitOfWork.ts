import { Product } from '@application/entities/Product';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { ProductRepository } from '../repositories/ProductRepository';
import { StockMovementRepository } from '../repositories/StockMovementRepository';

@Injectable()
export class CreateProductUnitOfWork {
  constructor(
    private readonly drizzleClient: DrizzleClient,
    private readonly productRepository: ProductRepository,
    private readonly stockMovementRepository: StockMovementRepository,
  ) { }

  async run(product: Product): Promise<void> {
    await this.drizzleClient.wsClient.transaction(async (tx) => {
      await this.productRepository.create(tx, product);

      await this.stockMovementRepository.addStockMovement({
        productId: product.id,
        quantity: product.currentStock,
        storeId: product.storeId,
        type: 'ENTRY',
      }, tx);
    });
  }
}
