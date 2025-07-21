import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { stockMovementsTable } from '../schema/stock';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

@Injectable()
export class StockMovementRepository {
  constructor(private readonly db: DrizzleClient) { }

  async addStockMovement(trx: UnitOfWorkTransaction, {
    productId,
    quantity,
    storeId,
    type,
  }: StockMovementRepository.addStockMovementInput) {
    const transaction = trx;
    await transaction.insert(stockMovementsTable).values({
      productId,
      storeId,
      quantity,
      type,
    }).execute();

  }
}

export namespace StockMovementRepository {
  export type addStockMovementInput = {
    storeId: string;
    productId: string;
    type: 'ENTRY' | 'EXIT';
    quantity: number;
    costPrice?: number;
  }
}
