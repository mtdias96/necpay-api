import { Store } from '@application/entities/Store';
import { Injectable } from '@kernel/decorators/Injectable';
import { StoreMapper } from '../mappers/StoreMapper';
import { storesTable } from '../schema/stores';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

@Injectable()
export class StoreRepository {
  constructor() { }

  async create(
    store: Store,
    trx: UnitOfWorkTransaction,
  ): Promise<void> {
    const transaction = trx;
    const data = StoreMapper.toPersistence(store);
    await transaction.insert(storesTable).values(data);
  }
}
