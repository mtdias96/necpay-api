import { Store } from '@application/entities/Store';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { eq } from 'drizzle-orm';
import { storesTable } from '../schema/stores';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

@Injectable()
export class StoreRepository {
  constructor(private readonly db: DrizzleClient) { }

  async findByName(name: string): Promise<
    { id: string; name: string } | null
  > {
    const result = await this.db.httpClient
      .select({ id: storesTable.id, name: storesTable.name })
      .from(storesTable)
      .where(eq(storesTable.name, name));

    return result[0] ?? null;
  }

  async create(
    store: Store,
    trx: UnitOfWorkTransaction,
  ): Promise<void> {
    const transaction = trx;
    await transaction.insert(storesTable).values(store);
  }
}
