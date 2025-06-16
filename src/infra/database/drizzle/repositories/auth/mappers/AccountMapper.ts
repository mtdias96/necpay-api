import { Account } from '@application/entities/Account';
import { accounts } from '@infra/database/drizzle/schema/auth/account';

export class AccountMapper {
  static toEntity(raw: typeof accounts.$inferSelect): Account {
    return new Account({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      externalId: raw.externalId,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(account: Account): typeof accounts.$inferInsert {
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      externalId: account.externalId,
      createdAt: account.createdAt,
    };
  }
}
