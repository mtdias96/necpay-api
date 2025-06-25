import { Account } from '@application/entities/Account';
import { Injectable } from '@kernel/decorators/Injectable';
import { AccountMapper } from '../mappers/AccountMapper';
import { accountsTable } from '../schema/accounts';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

@Injectable()
export class AccountRepository {
  constructor() { }

  async create(
    account: Account,
    trx: UnitOfWorkTransaction,
  ): Promise<void> {
    const transaction = trx;
    const data = AccountMapper.toPersistence(account);
    await transaction.insert(accountsTable).values(data);
  }
}
