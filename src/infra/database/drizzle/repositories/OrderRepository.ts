import { Order } from '@application/entities/Order';
import { Injectable } from '@kernel/decorators/Injectable';
import { ordersTable } from '../schema/orders';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

@Injectable()
export class OrderRepository {

  async create(
    order: Order,
    trx: UnitOfWorkTransaction,
  ): Promise<void> {
    await trx.insert(ordersTable).values({
      ...order,
      total: order.total.toFixed(2),
    });

  }
}
