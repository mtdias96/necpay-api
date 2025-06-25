import { Account } from '@application/entities/Account';
import { Store } from '@application/entities/Store';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AccountRepository } from '../repositories/AccountRepository';
import { StoreRepository } from '../repositories/StoreRepository';

@Injectable()
export class SignUpUnitOfWork {
  constructor(
    private readonly drizzleClient: DrizzleClient,
    private readonly accountRepository: AccountRepository,
    private readonly storeRepository: StoreRepository,
  ) { }

  async run({ account, store }: { account: Account; store: Store }): Promise<void> {
    await this.drizzleClient.wsClient.transaction(async (tx) => {
      await this.accountRepository.create(account, tx);
      await this.storeRepository.create(store, tx);
    });
  }
}

