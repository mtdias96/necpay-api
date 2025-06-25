// import { Injectable } from '@kernel/decorators/Injectable';
// import { Pool } from '@neondatabase/serverless';
// import { AppConfig } from '@shared/config/AppConfig';
// import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';

// @Injectable()
// export class DrizzleClient {
//   private readonly db: NeonDatabase;

//   constructor(private readonly appConfig: AppConfig) {
//     const pool = new Pool({ connectionString: this.appConfig.database.neon.baseURL });

//     this.db = drizzle(pool);
//   }

//   get client() {
//     return this.db;
//   }
// }

import { Injectable } from '@kernel/decorators/Injectable';
import { neon, Pool } from '@neondatabase/serverless';
import { AppConfig } from '@shared/config/AppConfig';
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzleWS } from 'drizzle-orm/node-postgres';
import * as schema from '../database/drizzle/schema';

@Injectable()
export class DrizzleClient {
  private readonly dbHttp: ReturnType<typeof drizzleHttp<typeof schema>>;
  private readonly dbWS: ReturnType<typeof drizzleWS<typeof schema>>;

  constructor(private readonly appConfig: AppConfig) {
    const connectionUrl = this.appConfig.database.neon.baseURL;
    const sql = neon(connectionUrl);

    this.dbHttp = drizzleHttp(sql, { schema });

    const pool = new Pool({ connectionString: connectionUrl });
    this.dbWS = drizzleWS(pool, { schema });
  }

  get httpClient() {
    return this.dbHttp;
  }

  get wsClient() {
    return this.dbWS;
  }
}
