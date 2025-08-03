import { OrderItem } from '@application/entities/OrderItem';
import { Injectable } from '@kernel/decorators/Injectable';
import { orderItemsTable } from '../schema/ordersItems';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

@Injectable()
export class OrderItemRepository {
  async create(
    orderItems: OrderItem[],
    trx: UnitOfWorkTransaction,
  ): Promise<void> {
    const values = orderItems.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toFixed(2),
      total: item.subtotal.toFixed(2),
      createdAt: item.createdAt ?? new Date(),
      updatedAt: item.updatedAt ?? new Date(),
    }));

    await trx.insert(orderItemsTable).values(values);
  }
}
