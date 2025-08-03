import { Order } from '@application/entities/Order';
import { OrderItem } from '@application/entities/OrderItem';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { OrderItemRepository } from '../repositories/OrderItemRepository';
import { OrderRepository } from '../repositories/OrderRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { StockMovementRepository } from '../repositories/StockMovementRepository';

@Injectable()
export class PlaceOrderUnitOfWork {
  constructor(
    private readonly drizzleClient: DrizzleClient,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly stockMovementRepository: StockMovementRepository,
    private readonly productRepository: ProductRepository,
  ) { }

  async run(
    storeId: string,
    order: Order,
    orderItem: OrderItem[],
    stockMovemnt: {
      storeId: string;
      productId: string;
      type: 'ENTRY' | 'EXIT';
      quantity: number;
      costPrice?: number;
    }[],
  )
    : Promise<void> {
    await this.drizzleClient.wsClient.transaction(async (trx) => {
      await this.orderRepository.create(order, trx);
      await this.orderItemRepository.create(orderItem, trx);
      await this.stockMovementRepository.addStockMovementsExit(stockMovemnt, trx);
      await this.productRepository.updateCurrentStock(storeId, stockMovemnt, trx);
    });

  }
}
