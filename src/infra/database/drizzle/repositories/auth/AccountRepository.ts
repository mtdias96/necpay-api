import { Account } from '@application/entities/Account';
import { Store } from '@application/entities/Store';
import { DrizzleService } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { accounts } from '../../schema/auth/account';
import { stores } from '../../schema/store/stores';
import { AccountMapper } from './mappers/AccountMapper';
import { StoreMapper } from './mappers/StoreMapper';

@Injectable()
export class AccountRepository {
  constructor(private readonly drizzleService: DrizzleService) { }

  async create(account: Account): Promise<void> {
    const data = AccountMapper.toPersistence(account);
    await this.drizzleService.client.insert(accounts).values(data);
  }

  async createStore(store: Store): Promise<void> {
    const data = StoreMapper.toPersistence(store);
    await this.drizzleService.client.insert(stores).values(data);
  }
}
