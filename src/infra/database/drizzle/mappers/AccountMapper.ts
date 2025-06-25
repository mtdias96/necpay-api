import { Account } from '@application/entities/Account';
import { accountsTable } from '../schema/accounts';

export class AccountMapper {
  static toEntity(raw: typeof accountsTable.$inferSelect): Account {
    return new Account({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      externalId: raw.externalId,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(account: Account): typeof accountsTable.$inferInsert {
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      externalId: account.externalId,
      createdAt: account.createdAt,
    };
  }
}
