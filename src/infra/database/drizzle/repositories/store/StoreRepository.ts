import { Store } from '@application/entities/Store';
import { DrizzleService } from '@infra/clients/drizzleClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { NeonHttpQueryResult } from 'drizzle-orm/neon-http';
import { stores } from '../../schema/store/stores';

@Injectable()
export class StoreRepository {
  constructor(private readonly drizzleService: DrizzleService) { }

  async create(store: Store.Attributes): Promise<NeonHttpQueryResult<typeof stores>> {
    return this.drizzleService.client.insert(stores).values(store);
  }
}

