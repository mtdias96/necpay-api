import { Injectable } from '@kernel/decorators/Injectable';
import { stockMovementsTable } from '../schema/stock';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

@Injectable()
export class StockMovementRepository {
  async addStockMovement(
    {
      productId,
      quantity,
      storeId,
      type,
    }: StockMovementRepository.addStockMovementInput,
    trx: UnitOfWorkTransaction,
  ) {
    const transaction = trx;
    await transaction
      .insert(stockMovementsTable)
      .values({
        productId,
        storeId,
        quantity,
        type,
      })
      .execute();
  }

  async addStockMovementsExit(
    movements: StockMovementRepository.addStockMovementInput[],
    trx: UnitOfWorkTransaction,
  ) {
    const transaction = trx;
    const values = movements.map(m => ({
      productId: m.productId,
      storeId: m.storeId,
      quantity: m.quantity,
      type: 'EXIT' as const,
      costPrice: m.costPrice?.toFixed(2),
    }));
    await transaction.insert(stockMovementsTable).values(values).execute();
  }
}

export namespace StockMovementRepository {
  export type addStockMovementInput = {
    storeId: string;
    productId: string;
    type: 'ENTRY' | 'EXIT';
    quantity: number;
    costPrice?: number;
  };
}
