
import { Injectable } from '@kernel/decorators/Injectable';
import { neon, Pool } from '@neondatabase/serverless';
import { AppConfig } from '@shared/config/AppConfig';
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzleWs } from 'drizzle-orm/node-postgres';
import * as schema from '../database/drizzle/schema';

@Injectable()
export class DrizzleClient {
  private readonly dbHttp: ReturnType<typeof drizzleHttp<typeof schema>>;
  private readonly dbWs: ReturnType<typeof drizzleWs<typeof schema>>;
  private readonly pool: Pool;

  constructor(private readonly appConfig: AppConfig) {
    const connectionUrl = this.appConfig.database.neon.baseURL;

    const sql = neon(connectionUrl);
    this.dbHttp = drizzleHttp(sql, { schema });
    this.pool = new Pool({ connectionString: connectionUrl });
    this.dbWs = drizzleWs(this.pool, { schema });
  }

  get httpClient() {
    return this.dbHttp;
  }

  get wsClient() {
    return this.dbWs;
  }

}
