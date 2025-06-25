import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

@Injectable()
export abstract class UnitOfWork {
  constructor(private readonly drizzleClient: DrizzleClient) { }

  async execute<T>(callback: (trx: UnitOfWorkTransaction) => Promise<T>): Promise<T> {
    return this.drizzleClient.wsClient.transaction(callback);
  }

}
