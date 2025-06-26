import { Account } from '@application/entities/Account';
import { DrizzleClient } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { eq } from 'drizzle-orm';
import { accountsTable } from '../schema/accounts';
import { UnitOfWorkTransaction } from '../types/UnitOfWorkTransaction';

@Injectable()
export class AccountRepository {
  constructor(private readonly db: DrizzleClient) { }

  async findByEmail(email: string): Promise<Account | null> {
    const result = await this.db.httpClient.select().from(accountsTable).where(eq(accountsTable.email, email));

    return result[0];
  }

  async create(
    account: Account,
    trx: UnitOfWorkTransaction,
  ): Promise<void> {
    const transaction = trx;
    await transaction.insert(accountsTable).values(account);
  }
}
