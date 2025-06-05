import { Account } from '@application/entities/Account';
import { DrizzleService } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { NeonHttpQueryResult } from 'drizzle-orm/neon-http';
import { accounts } from '../../schema/auth/account';

@Injectable()
export class AccountRepository {
  constructor(private readonly drizzleService: DrizzleService) { }

  async create(account: Account): Promise<NeonHttpQueryResult<typeof accounts>> {
    return this.drizzleService.client.insert(accounts).values(account);
  }
}
